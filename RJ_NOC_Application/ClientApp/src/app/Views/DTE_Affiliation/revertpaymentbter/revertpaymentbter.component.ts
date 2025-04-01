import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DTEAffiliationAddCourseDataModel, BTERAffiliationfeesdeposited } from '../../../Models/DTEAffiliation/DTEAffiliationAddCourse/DTEAffiliationAddCourseDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { EnumDepartment } from '../../../Common/enum-noc';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DTEAffiliationAddCourseService } from '../../../Services/DTEAffiliation/DTEAffiliationAddCourse/dte-affiliation-add-course.service';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
import { Console } from 'console';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service';
import { RequestDetails } from '../../../Models/PaymentDataModel';
@Component({
  selector: 'app-revertpaymentbter',
  templateUrl: './revertpaymentbter.component.html',
  styleUrls: ['./revertpaymentbter.component.css']
})

export class RevertpaymentbterComponent {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public files: any = '';
  public file: any = '';
  public EditID: any;
  isEdit: boolean = false;
  public UserID: number = 0;
  searchText: string = '';
  public is_disableDepartment: boolean = false;
  request = new DTEAffiliationAddCourseDataModel();
  request1 = new BTERAffiliationfeesdeposited();
  sSOLoginDataModel = new SSOLoginDataModel();
  public IsOpen: boolean = false;
  public isFormValid: boolean = true;
  request_Payment = new RequestDetails();
  public ShowAffilationType: boolean = false;
  // public ApplyAffiliation: string = '';
  //public ApplyAffiliationFY: number = 65;
  public AffiliationRegStatus: any = '';
  public AffiliationRegID: number = 0;
  public Name: string = '';
  public DTEARNID: number = 0;
  public ApplyAffiliation: string = '';
  public SearchRecordID: string = '';
  public SelectedDepartmentID: number = 0;
  public BTERAffiliationFeeList: any = [];
  public BTERFeeMasterData: any = [];
  public financialYear: string = '';
  public SSOID: string = '';
  public LegalEntityManagementType: string = "";
  public AffiliationCollegeStatusId: number = 0;
  public IsEdits: boolean = false;
  modalReference!: NgbModalRef;
  closeResult!: string;
  public CollegeName: string = '';
  public TotalBTERFees: string = '0.00';
  public Total: string = '0.00';
  public Total1: string = '0.00';
  public BTERAffiliationOnetime: string = '0.00';
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public SelectedDteAffiliationCollageID: number = 0;
  public CheckTabsEntryData: any = [];
  public IsShowDraftFinalSubmit: boolean = true;
  public CollegeStatus: string = '';
  public ManagementType: string = '';
  public NOCDocStatus: string = '';
  public LOADocStatus: string = '';
  public ApplicationDocStatus: string = '';
  public PaymentDocStatus: string = '';
  public CollegeStatusID: number = 0;
  constructor(private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard, private dTEAffiliationAddCourseService: DTEAffiliationAddCourseService, private legalEntityListService: LegalEntityService, private fileUploadService: FileUploadService, private modalService: NgbModal, private nocpaymentService: NocpaymentService,) {
  }
  async ngOnInit() {
    this.loaderService.requestStarted();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    //this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString());
    //this.AffiliationRegID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTEAffiliationID')?.toString());
    //this.AffiliationRegStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());
    //this.AffiliationCollegeStatusId = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeStatusId')?.toString());
    //console.log(this.sSOLoginDataModel);
    this.SSOID = this.sSOLoginDataModel.SSOID;
    this.request.DepartmentID = this.SelectedDepartmentID;
    this.request.BTERRegID = this.AffiliationRegID;
    this.request.RegAffiliationStatusId = this.AffiliationCollegeStatusId;
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('SearchRecordID')?.toString());
    console.log(this.SearchRecordID);
    console.log(this.SearchRecordID.length);

    if (this.SearchRecordID.length > 20) {
      debugger;
      if (this.SearchRecordID.length < 36) {
        this.routers.navigate(['/login']);
      }
      await this.commonMasterService.GetRevert_SearchRecordIDWiseDetails(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.BTERRegID = data['Data']['DTEAffiliationID'];
          this.request.DepartmentID = data['Data']['DepartmentID'];
          //this.CollegeName = data['Data']['CollegeName']
          this.request.RegAffiliationStatusId = data['Data']['CollegeStatusID']
          this.CollegeStatus = data['Data']['CollegeStatus']
          this.ManagementType = data['Data']['ManagementType']
          this.NOCDocStatus = data['Data']['NOCDocStatus']
          this.LOADocStatus = data['Data']['LOADocStatus']
          this.ApplicationDocStatus = data['Data']['ApplicationDocStatus']
          this.PaymentDocStatus = data['Data']['PaymentDocStatus']
          if (this.request.RegAffiliationStatusId == null || this.request.RegAffiliationStatusId == 0 || this.request.RegAffiliationStatusId == undefined) {
            this.routers.navigate(['/dashboard']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/dashboard']);
    }
    this.request.CourseStatusId = 480 //Running by Default
    this.request.GovtNOCAvailableforclosure = 'NO' //Running by Default    
    this.request.BTERAffiliationfeesDetails = [];
    const ddlDepartmentID = document.getElementById('ddlDepartmentID');
    if (ddlDepartmentID) ddlDepartmentID.focus();
    try {
      await this.legalEntityListService.GetLegalEntityBySSOID(this.SSOID, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.LegalEntityManagementType = data['Data'][0]['data']['Table'][0]['ManagementType'];
          this.request.LegalEntityManagementType = data['Data'][0]['data']['Table'][0]['ManagementType'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      this.routers.navigate(['/legalentity']);
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 0);
    }
    if (this.SearchRecordID.length > 20 && this.SelectedDepartmentID == 12) {
      await this.commonMasterService.GetDteAffiliation_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SelectedDteAffiliationCollageID = data['Data']['DTE_ARId'];
          this.CollegeName = data['Data']['College_Name']

          if (this.SelectedDteAffiliationCollageID == null || this.SelectedDteAffiliationCollageID == 0 || this.SelectedDteAffiliationCollageID == undefined) {
            this.routers.navigate(['/affiliationregistration']);
          }
        }, error => console.error(error));
    }
    else {
      this.SelectedDteAffiliationCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString()));
    }
    await this.GetAllBTERAffiliationCourseFeeList();
    //await this.CheckTabsEntry();
    await this.loaderService.requestEnded();
  }
  async GetAllBTERAffiliationCourseFeeList() {
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationAddCourseService.GetAllBTERAffiliationCourseFeeList(this.request.BTERRegID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.BTERAffiliationFeeList = data['Data'][0]['data']['Table'];
          this.BTERAffiliationOnetime = data['Data'][0]['data']['Table1'][0]['AffiliationApplyFeesOneTime'];
          //this.BTERAffiliationFeeList = data['Data'][0]['data'];
          for (var i = 0; i < this.BTERAffiliationFeeList.length; i++) {
            this.Total = (Number(this.Total) + Number(this.BTERAffiliationFeeList[i].CourseFee)).toFixed(2);
          }
          this.GrandTotal();
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GrandTotal() {
    this.Total1 = (Number(this.BTERAffiliationOnetime) + Number(this.Total)).toFixed(2);
  }

  async PaymentApplyNocApplication_click(content: any) {
    try {
      this.TotalBTERFees = "0.00";
      this.CollegeName = this.CollegeName;
      this.loaderService.requestStarted();
      //console.log(this.request.BTERRegID);
      await this.dTEAffiliationAddCourseService.GetAllBTERAffiliationCourseFeeList(this.request.BTERRegID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          // console.log(data);
          if (this.State == 0) {
            this.BTERFeeMasterData = data['Data'][0]['data']['Table'];
            this.BTERAffiliationOnetime = data['Data'][0]['data']['Table1'][0]['AffiliationApplyFeesOneTime'];
            for (var i = 0; i < this.BTERFeeMasterData.length; i++) {
              this.TotalBTERFees = (Number(this.TotalBTERFees) + Number(this.BTERFeeMasterData[i].CourseFee)).toFixed(2);
            }
            this.GrandTotal1();
            // model popup
            this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpayment-title', backdrop: 'static' }).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
          }
          else {
            this.toastr.error(this.ErrorMessage);
          }
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  async GrandTotal1() {
    this.Total1 = (Number(this.BTERAffiliationOnetime) + Number(this.TotalBTERFees)).toFixed(2);
  }
  async MakePayment_click() {
    this.is_disableDepartment = true;
    await this.CheckTabsEntry();
    console.log(this.IsShowDraftFinalSubmit);
    if (this.IsShowDraftFinalSubmit == true) {
      console.log(this.IsShowDraftFinalSubmit);
      try {
        // console.log(this.AffiliationRegID);
        this.loaderService.requestStarted();
        // payment request    

        // console.log(this.request.BTERRegID);
        await this.commonMasterService.GetBTERCollegeBasicDetails(this.request.BTERRegID)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.CollegeName = data['Data'][0]['data'][0]['CollegeNameEn'];
            this.request_Payment.ApplyNocApplicationID = this.CollegeID;
            this.request_Payment.AMOUNT = Number(this.Total1);
            this.request_Payment.USEREMAIL = data['Data'][0]['data'][0].CollegeEmail;
            this.request_Payment.USERNAME = this.CollegeName.substring(0, 49).replace(/[^a-zA-Z ]/g, "");
            this.request_Payment.USERMOBILE = data['Data'][0]['data'][0].CollegeMobileNumber;
            this.request_Payment.PURPOSE = "BTER Payment";
            this.request_Payment.DepartmentID = data['Data'][0]['data'][0].DepartmentID;
            this.request_Payment.CreatedBy = this.sSOLoginDataModel.UserID;
            this.request_Payment.SSOID = this.sSOLoginDataModel.SSOID;
            this.request_Payment.DTEAffiliationID = data['Data'][0]['data'][0].DTEAffiliationID;
            // post
            await this.nocpaymentService.PaymentRequest(this.request_Payment)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.SuccessMessage = data['SuccessMessage'];
                this.ErrorMessage = data['ErrorMessage'];
                //console.log(data.Data.MERCHANTCODE);
                console.log(this.State);
                if (!this.State) {
                  this.RedirectPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA, data.Data.PaymentRequestURL)
                }
                else {
                  this.toastr.error(this.ErrorMessage)
                }
              });
          }, error => console.error(error));
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }

    }
    else {
      this.CheckTabsEntry();
    }
  }
  RedirectPaymentRequest(pMERCHANTCODE: any, pENCDATA: any, pRequestURl: any) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", pRequestURl); //GlobalConstants.RPPRequstURL
    form.setAttribute("target", "_self");
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("name", "ENCDATA");
    hiddenField.setAttribute("value", pENCDATA);
    form.appendChild(hiddenField);
    var MERCHANTCODE = document.createElement("input");
    MERCHANTCODE.setAttribute("name", "MERCHANTCODE");
    MERCHANTCODE.setAttribute("value", pMERCHANTCODE);
    form.appendChild(MERCHANTCODE);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
  async CheckTabsEntry() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.CheckTabsEntryAffiliation(this.request.BTERRegID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckTabsEntryData = data['Data'][0]['data'][0];
          console.log(this.CheckTabsEntryData);
          if (this.CheckTabsEntryData['CollegeDetails'] == 0) {
            this.toastr.error('Add College Details.');
            this.IsShowDraftFinalSubmit = false;
            return;

          }
          if (this.CheckTabsEntryData['CourseDetails'] == 0) {
            this.toastr.error('Add Course Details.');
            this.IsShowDraftFinalSubmit = false;
            return;

          }
          if (this.CheckTabsEntryData['OtherInformation'] == 0) {
            this.toastr.error('Add Other Information');
            this.IsShowDraftFinalSubmit = false;
            return;

          }
          //if (this.CheckTabsEntryData['ApplicationFeeDetails']== 0) {

          //  this.toastr.error('Application Fee Details ');
          //  this.IsShowDraftFinalSubmit = false;
          //  return;

          //}

          //console.log(this.CheckTabsEntryData);
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async MakePaymentEGrass_click() {
    this.is_disableDepartment = true;
    await this.CheckTabsEntry();
    console.log(this.IsShowDraftFinalSubmit);
    if (this.IsShowDraftFinalSubmit == true) {
      console.log(this.IsShowDraftFinalSubmit);
      try {
        // console.log(this.AffiliationRegID);
        this.loaderService.requestStarted();
        // payment request    

        // console.log(this.request.BTERRegID);
        await this.commonMasterService.GetBTERCollegeBasicDetails(this.request.BTERRegID)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.CollegeName = data['Data'][0]['data'][0]['CollegeNameEn'];
            this.request_Payment.ApplyNocApplicationID = data['Data'][0]['data'][0].DTEAffiliationID;
            this.request_Payment.AMOUNT = Number(this.Total1);
            this.request_Payment.USEREMAIL = data['Data'][0]['data'][0].CollegeEmail;
            this.request_Payment.USERNAME = this.CollegeName.substring(0, 49).replace(/[^a-zA-Z ]/g, "");
            this.request_Payment.USERMOBILE = data['Data'][0]['data'][0].CollegeMobileNumber;
            this.request_Payment.PURPOSE = "BTER Payment";
            this.request_Payment.DepartmentID = data['Data'][0]['data'][0].DepartmentID;
            this.request_Payment.CreatedBy = this.sSOLoginDataModel.UserID;
            this.request_Payment.SSOID = this.sSOLoginDataModel.SSOID;
            this.request_Payment.DTEAffiliationID = data['Data'][0]['data'][0].DTEAffiliationID;
            //
            this.request_Payment.RemitterName = this.CollegeName.substring(0, 49).replace(/[^a-zA-Z ]/g, "");
            this.request_Payment.REGTINNO = data['Data'][0]['data'][0].CollegeID;
            this.request_Payment.DistrictCode = data['Data'][0]['data'][0].DistrictID;
            this.request_Payment.Adrees = data['Data'][0]['data'][0].District_Eng;
            this.request_Payment.City = data['Data'][0]['data'][0].District_Eng;
            this.request_Payment.Pincode = data['Data'][0]['data'][0].Pincode;
            this.request_Payment.PaymentType = "BTER Payment";

            await this.nocpaymentService.PaymentRequest_Egrass(this.request_Payment)
              .then((data: any) => {
                debugger;
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.SuccessMessage = data['SuccessMessage'];
                this.ErrorMessage = data['ErrorMessage'];
                //console.log(data.Data.MERCHANTCODE);
                console.log(this.State);
                if (!this.State) {
                  this.RedirectEgrassPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA, data.Data.PaymentRequestURL, data.Data.AUIN)
                }
                else {
                  this.toastr.error(this.ErrorMessage)
                }
              });
          }, error => console.error(error));
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }

    }
    else {
      this.CheckTabsEntry();
    }
  }

  RedirectEgrassPaymentRequest(pMERCHANTCODE: any, pENCDATA: any, pServiceURL: any, pAUIN: any) {


    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", pServiceURL);

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "encData");
    hiddenField.setAttribute("value", pENCDATA);
    form.appendChild(hiddenField);

    var MERCHANTCODE = document.createElement("input");
    MERCHANTCODE.setAttribute("type", "hidden");
    MERCHANTCODE.setAttribute("name", "Merchant_code");
    MERCHANTCODE.setAttribute("value", pMERCHANTCODE);
    form.appendChild(MERCHANTCODE);

    debugger;
    var AUIN = document.createElement("input");
    AUIN.setAttribute("type", "hidden");
    AUIN.setAttribute("name", "AUIN");
    AUIN.setAttribute("value", pAUIN);
    form.appendChild(AUIN);

    console.log(form.outerHTML);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);


  }
}

