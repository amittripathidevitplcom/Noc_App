import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NOCRevertOtherDetailsDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationOtherDetails/DTEAffiliationOtherDetailsDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { DTEAffiliationOtherDetailsService } from '../../../Services/DTEAffiliation/DTEAffiliationOtherDetails/dte-affiliation-other-details.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
@Component({
  selector: 'app-revertotherdetailsnocapplication',
  templateUrl: './revertotherdetailsnocapplication.component.html',
  styleUrls: ['./revertotherdetailsnocapplication.component.css']
})

export class RevertotherdetailsnocapplicationComponent {

  //Add FormBuilder
  RevertnocDTEAffiliationOtherDetailsForm!: FormGroup;
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
  request = new NOCRevertOtherDetailsDataModel();
  public DTEAffiliationDataList: any = [];
  public StatusOfCollegeList: any = [];
  public DepartmentList: any = [];
  public NOCIssuedDataList: any = [];
  public StartDateEndDateDepartmentwise: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public IsOpen: boolean = false;
  public isFormValid: boolean = true;
  public MaxDate: Date = new Date;
  public NOCSTATUS: boolean = false;
  public AICTEEOALOAStatus: boolean = false;
  public SelectedDepartmentID: number = 0;
  public SearchRecordID: string = '';
  public AffiliationRegStatus: any = '';
  public AffiliationRegID: number = 0;
  public SSOID: string = '';
  public LegalEntityManagementType: string = "";
  public AffiliationCollegeStatusId: number = 0;
  public CollegeStatus: string = '';
  public ManagementType: string = '';
  public NOCDocStatus: string = '';
  public LOADocStatus: string = '';
  public ApplicationDocStatus: string = '';
  public PaymentDocStatus: string = '';
  public CollegeStatusID: number = 0;

  constructor(private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard, private dTEAffiliationOtherDetailsService: DTEAffiliationOtherDetailsService, private fileUploadService: FileUploadService) {

  }
  async ngOnInit() {
    this.loaderService.requestStarted();
    this.RevertnocDTEAffiliationOtherDetailsForm = this.formBuilder.group(
      {
        ddlNocIssued: ['',[DropdownValidators]],
        txtNocNumber: [''],
        txtNocIssueDate: [''],
        UploadNocApproval: [''],       
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));   
    this.SSOID = this.sSOLoginDataModel.SSOID;    
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('SearchRecordID')?.toString());
    console.log(this.SearchRecordID.length);
    console.log(this.SearchRecordID);
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
    this.request.DepartmentID = this.SelectedDepartmentID;
    this.request.BTERRegID = this.AffiliationRegID;
    this.request.RegAffiliationStatusId = this.AffiliationCollegeStatusId;
    this.request.UserID = this.sSOLoginDataModel.UserID;

    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();

    await this.ActionStatus();   
    if (this.AffiliationRegStatus == 'New') {
      if (this.request.NOCStatus != '') {
        this.request.NOCStatus = this.request.NOCStatus
      } else {
        this.request.NocIssued = 1;      
        await this.OnchangeStatus();       
      }

    }
    this.GetDepartmentList();
    await this.GetStartDateEndDateDepartmentwise();
    this.GetStatusOfCollege();
    await this.GetOtherinformation();
    await this.loaderService.requestEnded();
  }
  get form() { return this.RevertnocDTEAffiliationOtherDetailsForm.controls; }
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
          //for (let i = 0; i < data['Data'].length; i++) {
          //  if (data['Data'][i]['DepartmentID'] == 4) {
          //    this.request.DepartmentID = data['Data'][i]['DepartmentID'];
          //    this.GetStartDateEndDateDepartmentwise(this.request.DepartmentID) 
          //    //console.log(this.request.DepartmentID);
          //  }
          //}
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
  async GetStartDateEndDateDepartmentwise() {
    try {
      this.loaderService.requestStarted();
      const departmentId = Number(this.request.DepartmentID);
      await this.commonMasterService.GetStartDateEndDateDepartmentwise(departmentId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StartDateEndDateDepartmentwise = data['Data'];
          this.request.FYID = data['Data'][0]['ApplicationSession'];
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
    // console.log(this.request.DepartmentID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "AffiliationCategory")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusOfCollegeList = data['Data'];
          //this.request.CollegeStatusId = 458;
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
  async SaveData() {
    debugger;
    if (this.request.DepartmentID == 12) {
      this.isSubmitted = true;
      if (this.AffiliationRegStatus != 'Existing') {
        var NOCStatustype = this.NOCIssuedDataList.find((x: { NocIssued: any; }) => x.NocIssued == this.request.NocIssued).AffilationIssue;
        this.request.NOCStatus = NOCStatustype
        if (this.request.NOCStatus == 'Yes') {
          this.RevertnocDTEAffiliationOtherDetailsForm.get('txtNocNumber')?.setValidators([Validators.required]);
          this.RevertnocDTEAffiliationOtherDetailsForm.get('txtNocNumber')?.updateValueAndValidity();
          this.RevertnocDTEAffiliationOtherDetailsForm.get('txtNocIssueDate')?.setValidators([Validators.required]);
          this.RevertnocDTEAffiliationOtherDetailsForm.get('txtNocIssueDate')?.updateValueAndValidity();
          console.log(this.request.UploadNocApproval);
          if (this.request.UploadNocApproval == '') {            
            this.isSubmitted = true;
            this.isFormValid = false;
            return;
          }          
        }
      }
      if (this.RevertnocDTEAffiliationOtherDetailsForm.invalid) {
        this.isFormValid = false;
        return;
      }
      const isConfirmed = confirm("Are you sure you want to Re_Submit the form?");
      if (!isConfirmed) {
        return; // Exit if user cancels
      }      
      this.loaderService.requestStarted();
      this.isLoading = true;
      try {
        await this.dTEAffiliationOtherDetailsService.RevertnocSaveData(this.request, 'NOCResubmit')
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            console.log(this.State);
            if (!this.State) {
              this.toastr.success(this.SuccessMessage)
              this.ResetControl();
              this.isSubmitted = false;
              this.routers.navigate(['/dashboard']);

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
    this.request.NocIssued = 1;
    this.request.NocNumber = '';
    this.request.NocIssueDate = '';
    this.request.UploadNocApproval = '';    
    this.isSubmitted = false;
  }

  async DeleteImage(Type: string, file: string) {
    debugger;
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        // delete from server folder
        await this.fileUploadService.DeleteDocument(file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            //this.Reset1FileAndValidation(Type, '', '', '', '', false);
            if (Type == 'UploadNocApproval') {
              this.request.UploadNocApproval = "";
              this.request.UploadNocApprovalDocPath = "";
              this.request.UploadNocApprovalDoc_Dis_FileName = "";
            }            
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
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
  async ValidateDocumentNOCApproval(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (Type == 'UploadNocApproval') {
          console.log(this.file.type);
          if (this.file.type === 'application/pdf' || this.file.type === 'image/png' || this.file.type === 'image/jpeg' || this.file.type === 'image/jpg') {
            //size validation
            if (this.file.size > 1048576) {
              this.ResetFileAndValidation(Type, 'Select less then 1MB or equal File', '', '', '', false);
              this.toastr.error('Select Max 1MB File')
              return
            }
            if (this.file.size < 100000) {
              this.ResetFileAndValidation(Type, 'Select more then 100kb File', '', '', '', false);
              this.toastr.error('Select more then 100kb File')
              return
            }
          }
          else {
            this.toastr.warning('Select Only application/pdf/image');
            // type validation
            this.ResetFileAndValidation(Type, 'Select Only PDF/image', '', '', '', false);
            return
          }
        }
        else {// type validation
          this.ResetFileAndValidation(Type, 'Select Only pdf image file', '', '', '', false);
          return
        }
        // upload to server folder
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, '', data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"], true);
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
      else {
        this.ResetFileAndValidation(Type, '', '', '', '', false);
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        event.target.value = null;
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  ResetFileAndValidation(type: string, msg: string, name: string, path: string, dis_Name: string, isShowFile: boolean) {
    debugger;
    try {
      this.loaderService.requestStarted();
      if (type == 'UploadNocApproval') {
        this.request.UploadNocApproval = name;
        this.request.UploadNocApprovalDocPath = path;
        this.request.UploadNocApprovalDoc_Dis_FileName = dis_Name;
      }      
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

  async ActionStatus() {
    try {
      this.loaderService.requestStarted();
      this.NOCIssuedDataList.push({
        "AffilationIssue": "Yes",
        "NocIssued": "1",
      });
      this.NOCIssuedDataList.push({
        "AffilationIssue": "No",
        "NocIssued": "2",
      });

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
  async OnchangeStatus() {
    debugger;
    // console.log(this.NOCIssuedDataList);
    var NOCStatustype = this.NOCIssuedDataList.find((x: { NocIssued: any; }) => x.NocIssued == this.request.NocIssued).AffilationIssue;

    console.log(NOCStatustype);
    if (NOCStatustype == 'Yes') {
      this.NOCSTATUS = true;
      this.request.NOCStatus == 'Yes'
    }
    else {
      this.NOCSTATUS = false;
      this.request.NocNumber = '';
      this.request.NocIssueDate = '';
      this.request.UploadNocApproval = '';
    }

  }

  async GetOtherinformation() {
    // console.log(this.request.DepartmentID);
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationOtherDetailsService.GetOtherinformation(this.request.BTERRegID)
        .then(async (data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.request.OtherDetailsID = data['Data'][0]['data'][0]['OtherDetailsID'];
          this.request.NOCStatus = data['Data'][0]['data'][0]['StatusNOCIssued'];
          if (this.request.NOCStatus != 'Yes') {
            this.NOCSTATUS = false;
          }
          this.NOCSTATUS = true;
          this.request.NocIssued = data['Data'][0]['data'][0]['NocIssued'];
          this.request.NocNumber = data['Data'][0]['data'][0]['NocNumber'];
          this.request.NocIssueDate = data['Data'][0]['data'][0]['NocIssueDate'];          
          this.loaderService.requestEnded();

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
}
