import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DTEAffiliationDataModel, DTEAffiliationRegistrationDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationRegistration/DTEAffiliationRegistrationDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { EnumDepartment } from '../../../Common/enum-noc';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DTEAffiliationRegistrationService } from '../../../Services/DTEAffiliation/DTEAffiliationRegistration/dte-affiliation-registration.service';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
import { NocPaymentComponent } from '../../noc-payment/payment-request/noc-payment.component';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
@Component({
  selector: 'app-affiliation-registration',
  templateUrl: './affiliation-registration.component.html',
  styleUrls: ['./affiliation-registration.component.css']
})

export class AffiliationRegistrationComponent {

  //Add FormBuilder
  DTEAffiliationForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  
  public EditID: any;
  isEdit: boolean = false;
  public UserID: number = 0;
  searchText: string = '';
  public is_disableDepartment: boolean = false;
  public is_disableCollegeStatus: boolean = false;
  request = new DTEAffiliationRegistrationDataModel();
  public DTEAffiliationDataList: any = [];
  public StatusOfCollegeList: any = [];
  public DepartmentList: any = [];
  public DTEAffiliationApplyList: any = [];
  public AffiliationRegistrationList: any = [];
  public StartDateEndDateDepartmentwise: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  dteAffiliationDataModel = new DTEAffiliationDataModel();
  public IsOpen: boolean = false;
  public isFormValid: boolean = true;
  public AffiliationType: any = [];
  public ShowAffilationType: boolean = false;
  public ApplyAffiliation: string = '';
  public LegalEntityManagementType: string = '';
  public ApplyAffiliationFY: number = 65;
  public legalEntityListData: any = [];
  modalReference!: NgbModalRef;
  closeResult!: string;
  constructor( private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard, private dTEAffiliationregistrationService: DTEAffiliationRegistrationService, private legalEntityListService: LegalEntityService, private nocPaymentComponent: NocPaymentComponent, private modalService: NgbModal, private applyNocParameterService: ApplyNocParameterService) {

  }
  async ngOnInit() { 
     
      this.DTEAffiliationForm = this.formBuilder.group(
        {
          ddlDepartmentID: ['', [DropdownValidators]],        
          ddlCollegeStatusId: ['', [DropdownValidators]],        
          ddlAffiliationType: [''],   
          txtCollege_Name: ['', Validators.required],
          txtMobile_Number: ['', Validators.required],
          txtEmail_Address: ['', Validators.required],

        })
    this.DTEAffiliationForm.get('ddlCollegeStatusId')?.enable();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //console.log(this.sSOLoginDataModel);
    this.request.SSOID = this.sSOLoginDataModel.SSOID;
    if (this.sSOLoginDataModel.SSOID == "" && this.sSOLoginDataModel.SSOID == undefined && this.sSOLoginDataModel.SSOID == null && this.sSOLoginDataModel.RoleID == null) {
      this.toastr.error("Unable to service request.!");
      this.routers.navigate(['/ssologin']);
      this.loaderService.requestEnded();
      return;
    }
    try {
      this.loaderService.requestStarted();
      await this.legalEntityListService.GetLegalEntityBySSOID(this.sSOLoginDataModel.SSOID, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (data['Data'][0]['data']['Table'].length == 0) {
            this.toastr.warning("First Add Legal Entity then Add College.!");
            setTimeout(() => {
              this.routers.navigate(['/legalentity']);
            }, 500);

          }
          else {
            this.LegalEntityManagementType = data['Data'][0]['data']['Table'][0]['ManagementType'];
          }
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
    const ddlDepartmentID = document.getElementById('ddlDepartmentID');
    if (ddlDepartmentID) ddlDepartmentID.focus();
    this.GetDepartmentList();
    this.GetDTEAffiliationApply();
    this.GetStatusOfCollege();      
    this.GetAffiliationType();
    this.GetAffiliationRegistrationList();
  }
  get form() { return this.DTEAffiliationForm.controls; }
 
  async GetDTEAffiliationApply() {   
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDTEAffiliationApply(this.request.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DTEAffiliationApplyList = data['Data'];

          if (data['Data'][0]['DTEAffiliationApplyStatus'] == 'Existing') {
            this.DTEAffiliationApplyList = this.DTEAffiliationApplyList.filter((element: any) => {
              return element.DTEAffiliationApplyStatus == "Existing";
            });
            this.ApplyAffiliation = this.DTEAffiliationApplyList[0]['DTEAffiliationApplyStatus'];
            this.DTEAffiliationForm.get('ddlCollegeStatusId')?.disable();

            this.ShowAffilationType = true;
          }
          if (data['Data'][0]['DTEAffiliationApplyStatus'] == 'New') {
            this.DTEAffiliationApplyList = this.DTEAffiliationApplyList.filter((element: any) => {
              return element.DTEAffiliationApplyStatus == "New";
            });
            this.ApplyAffiliation = this.DTEAffiliationApplyList[0]['DTEAffiliationApplyStatus'];           
          }
          this.ApplyAffiliationFY = data['Data'][0]['FYID'];
         // console.log(this.ApplyAffiliationFY);
          
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
  async GetStatusOfCollege() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "AffiliationCategory")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusOfCollegeList = data['Data'];
          if (this.ApplyAffiliation == 'Existing') {
            this.StatusOfCollegeList = this.StatusOfCollegeList.filter((element: any) => {
              return element.Name == "Existing";
            });
            this.request.CollegeStatusId = this.StatusOfCollegeList[0].ID;
            this.DTEAffiliationForm.get('ddlCollegeStatusId')?.disable();            
            this.ShowAffilationType = true;
          }
          if (this.ApplyAffiliation == 'New') {
            this.StatusOfCollegeList = this.StatusOfCollegeList.filter((element: any) => {
              return element.Name == "New";
            });
            this.request.CollegeStatusId = this.StatusOfCollegeList[0].ID;
            this.is_disableCollegeStatus = true;
            this.ShowAffilationType = false;
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
  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentList = data['Data'];   
          for (let i = 0; i < data['Data'].length; i++) {
            this.DepartmentList = this.DepartmentList.filter((element: any) => {
              return element.DepartmentName == "Board of Technical Education";
            });
            this.request.DepartmentID = this.DepartmentList[0].DepartmentID;
            this.DTEAffiliationForm.get('ddlDepartmentID')?.disable();
            this.GetStartDateEndDateDepartmentwise(this.request.DepartmentID);
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
  async GetStartDateEndDateDepartmentwise(DepartmentID: number) {    
    try {     
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStartDateEndDateDepartmentwise(DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StartDateEndDateDepartmentwise = data['Data'];
          this.dteAffiliationDataModel = data['Data'][0];

          this.is_disableDepartment = true;
          if (data['Data'][0]['IsOpen'] == true) {
            this.IsOpen = true;
          }
          this.request.OpenSessionFY = data['Data'][0]['ApplicationSession']
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
 
  async GetAffiliationType() {    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "AffiliationType")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AffiliationType = data['Data'];          
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

  async GetAffiliationRegistrationList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetAffiliationRegistrationList(this.request.SSOID)
        .then((data: any) => {        
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];         
          this.AffiliationRegistrationList = data['Data'][0]['data'];
          //console.log(this.AffiliationRegistrationList);
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
  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async SaveData()
  {   
      if (this.request.DepartmentID == 12) {
      //console.log(this.DTEAffiliationForm);
      this.isSubmitted = true;    
      if (this.DTEAffiliationForm.invalid) {
        this.isFormValid = false;
        return;
      }
      var CollegeStatustype = this.StatusOfCollegeList.find((x: { ID: any; }) => x.ID == this.request.CollegeStatusId).Name;
      this.request.CollegeStatus = CollegeStatustype     
      if (this.ApplyAffiliation == 'Existing' && this.request.AffiliationTypeID == 0) {
        this.isFormValid = false;
        return;
      }    
      const isConfirmed = confirm("Are you sure you want to submit the form?");
      if (!isConfirmed) {
        return; // Exit if user cancels
      }
      //Show Loading
      this.loaderService.requestStarted();
      this.isLoading = true;       
      try {
        await this.dTEAffiliationregistrationService.SaveData(this.request)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            console.log(this.State);
            if (!this.State) {
              this.toastr.success(this.SuccessMessage)
              this.ResetControl();
              await this.GetAffiliationRegistrationList();        
              this.isSubmitted = false;
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
      catch (ex) { console.log(ex) }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoading = false;

        }, 200);
      }
    }
    
  }
  async ResetControl() {   
    this.request.DTE_ARId = 0;
    this.request.College_Name = '';
    this.request.Mobile_Number = '';
    this.request.Email_Address = '';
    this.request.AffiliationTypeID =0;
    this.isSubmitted = false;
  }
  public STATUS: string = '';
  public ResponseMessage: string = '';
  public PaymentStatus: string = '';

  async Edit_OnClick(DepartmentID: number, DTE_ARId: string, DTEAffiliationID: number, Status: string, CollegeStatusId: number,IsMakePayment:number) {   
    // var kk = CollegeID ? CollegeID : 0;+ "/" + encodeURI(this.commonMasterService.Encrypt(kk.toString()))
    await this.applyNocParameterService.GetApplyBTERPaymentHistoryApplicationID(DTEAffiliationID, 'BTER')
      .then((data: any) => {    
        
        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        // data
        if (this.State == 0) {
          this.PaymentHistoryDetails = data['Data'][0]['data'];
          for (let i = 0; i < data['Data'][0]['data'].length; i++) {
            this.STATUS = data['Data'][0]['data'][i]['STATUS'];
            this.ResponseMessage = data['Data'][0]['data'][i]['ResponseMessage'];
            this.PaymentStatus = data['Data'][0]['data'][i]['PaymentStatus'];
          }          
        }
        else {
          this.toastr.error(this.ErrorMessage);
        }
      }, error => console.error(error));
    
    if (this.PaymentHistoryDetails.length > 0) {
      //paymentdetails.STATUS != 'SUCCESS' && paymentdetails.STATUS != 'FAILED
      if (this.STATUS != 'SUCCESS' && this.PaymentStatus != 'SUCCESS' && this.STATUS != 'FAILED' && this.PaymentStatus != 'FAILED') {
        this.toastr.warning("First Check Your Payment History!");
        return;
      } else {
        this.routers.navigate(['/dteaffiliationdetails' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(DTE_ARId.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(DTEAffiliationID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeStatusId.toString()))]);
      }

    } else {
      this.routers.navigate(['/dteaffiliationdetails' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(DTE_ARId.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(DTEAffiliationID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeStatusId.toString()))]);
    }

   
  }
  async View_OnClick(DepartmentID: number, DTEAffiliationID: number,Status: string, CollegeStatusId: number) {   
    window.open('/dteaffiliationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(DTEAffiliationID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeStatusId.toString())), '_blank');
  }
  public PaymentHistoryDetails: any = [];
  async PaymentHistoryApplyBTERApplication_click(content: any, BTERRegID: number) {    
    try {
      this.loaderService.requestStarted();
      // get
      await this.applyNocParameterService.GetApplyBTERPaymentHistoryApplicationID(BTERRegID, 'BTER')
        .then((data: any) => {
          console.log(data);
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (this.State == 0) {
            this.PaymentHistoryDetails = data['Data'][0]['data'];
            // model popup
            this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpaymentdetails-title', backdrop: 'static' }).result.then((result) => {
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
  async CheckStatus_click(item: any) {
    try {
      this.loaderService.requestStarted();
      //debugger
      // payment request
      debugger;
      this.nocPaymentComponent.transactionStatusRequest.ApplyNocApplicationID = item.ApplyNocApplicationID;
      this.nocPaymentComponent.transactionStatusRequest.AMOUNT = item.Amount;
      this.nocPaymentComponent.transactionStatusRequest.PRN = item.PRNNO;
      this.nocPaymentComponent.transactionStatusRequest.DepartmentID = item.DepartmentID;
      this.nocPaymentComponent.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.nocPaymentComponent.request.SSOID = this.sSOLoginDataModel.SSOID;
      this.nocPaymentComponent.transactionStatusRequest.ServiceProvider = item.ServiceProvider;
      debugger;
      // post
      if (item.ServiceProvider == 'RPPT') {
        this.loaderService.requestEnded();
        await this.nocPaymentComponent.GetTransactionStatus();
      }
      else if (item.ServiceProvider == 'EMITRA') {
        this.loaderService.requestEnded();
        await this.nocPaymentComponent.GetEmitraTransactionStatus();
      }
      else {
        this.loaderService.requestEnded();
        await this.nocPaymentComponent.GRAS_GetPaymentStatus(item.AID, item.DepartmentID, 'BTER Payment');
      }

      this.modalService.dismissAll();
      this.GetAffiliationRegistrationList();

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
  async ApplicationSummary_OnClick(DepartmentID: number, DTEAffiliationID: number, Status: string, CollegeStatusId: number) {
    
    window.open('/bterpreviewaffiliationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(DTEAffiliationID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeStatusId.toString())), '_blank');
  }
  
}
