import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DTEAffiliationOtherDetailsDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationOtherDetails/DTEAffiliationOtherDetailsDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { DTEAffiliationOtherDetailsService } from '../../../Services/DTEAffiliation/DTEAffiliationOtherDetails/dte-affiliation-other-details.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
@Component({
  selector: 'app-affiliation-other-details',
  templateUrl: './affiliation-other-details.component.html',
  styleUrls: ['./affiliation-other-details.component.css']
})

export class AffiliationOtherDetailsComponent {

  //Add FormBuilder
  DTEAffiliationOtherDetailsForm!: FormGroup;
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
  request = new DTEAffiliationOtherDetailsDataModel();
  public DTEAffiliationDataList: any = [];
  public StatusOfCollegeList: any = [];
  public DepartmentList: any = [];
  public NOCIssuedDataList: any = [];
  public StartDateEndDateDepartmentwise: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public IsOpen: boolean = false;
  public isFormValid: boolean = true;
  public MaxDate: Date = new Date();
  public NOCSTATUS: boolean = false;
  public AICTEEOALOAStatus: boolean = false;
  constructor(private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard, private dTEAffiliationOtherDetailsService: DTEAffiliationOtherDetailsService, private fileUploadService: FileUploadService) {

  }
  async ngOnInit() {

    this.DTEAffiliationOtherDetailsForm = this.formBuilder.group(
      {        
        ddlNocIssued: ['', [DropdownValidators]],       
        txtNocNumber: [''],
        txtNocIssueDate: [''],
        UploadNocApproval: [''], 
        ddlAICTE_EOA_LOA: ['', [DropdownValidators]],
        txtAICTELAO_No: [''],
        txtEOA_LOA_Date: [''],  
        UploadLOAApproval: [''],        
        UploadApplicationForm: [''],       
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();
    this.request.NocIssued = 1;
    this.request.AICTE_EOA_LOA = 1;
    this.ActionStatus();
    this.GetDepartmentList();
    this.GetStatusOfCollege();
  }
  get form() { return this.DTEAffiliationOtherDetailsForm.controls; }
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
            if (data['Data'][i]['DepartmentID'] == 4) {
              this.request.DepartmentID = data['Data'][i]['DepartmentID'];
              this.GetStartDateEndDateDepartmentwise(this.request.DepartmentID) 
              //console.log(this.request.DepartmentID);
            }
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
    if (this.request.DepartmentID == 4) {
      this.isSubmitted = true;
      if (this.DTEAffiliationOtherDetailsForm.invalid) {
        this.isFormValid = false;
        return;
      }      
      var NOCStatustype = this.NOCIssuedDataList.find((x: { NocIssued: any; }) => x.NocIssued == this.request.NocIssued).AffilationIssue;
      this.request.NOCStatus = NOCStatustype
      if (this.request.NOCStatus == 'Yes' && this.request.NocNumber == '' && this.request.NocIssueDate == '' && this.request.UploadNocApproval == '') {
        this.isFormValid = false;
        return;
      }
      var AICTEEOALOAStatustype = this.NOCIssuedDataList.find((x: { NocIssued: any; }) => x.NocIssued == this.request.NocIssued).AffilationIssue;
      this.request.AICTEStatus = AICTEEOALOAStatustype
      if (this.request.AICTEStatus == 'Yes' && this.request.AICTELAO_No == '' && this.request.EOA_LOA_Date == '' && this.request.UploadLOAApproval == '') {
        this.isFormValid = false;
        return;
      }    

      if (this.request.UploadApplicationForm == '') {
        this.isSubmitted = true;
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
        await this.dTEAffiliationOtherDetailsService.SaveData(this.request)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            console.log(this.State);
            if (!this.State) {
              this.toastr.success(this.SuccessMessage)
              this.ResetControl();
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
    this.request.NocIssued = 1;
    this.request.NocNumber = '';
    this.request.NocIssueDate = '';
    this.request.UploadNocApproval = '';
    this.request.AICTE_EOA_LOA = 1;
    this.request.AICTELAO_No = '';
    this.request.EOA_LOA_Date = '';
    this.request.UploadLOAApproval = '';
    this.request.UploadApplicationForm = '';
    this.isSubmitted = false;
  }
  
  async DeleteImage(Type: string, file: string) {
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        // delete from server folder
        await this.fileUploadService.DeleteDocument(file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, '', '', '', '', false);
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
        if (Type == 'UploadNocApproval' || Type == 'UploadLOAApproval' || Type == 'UploadApplicationForm') {
          console.log(this.file.type);
          if (this.file.type === 'application/pdf' || this.file.type === 'image/png' || this.file.type === 'image/jpeg' || this.file.type ==='image/jpg') {
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
    try {
     this.loaderService.requestStarted();
    if (type == 'UploadNocApproval') {   
      this.request.UploadNocApproval = name;
      this.request.UploadNocApprovalDocPath = path;
      this.request.UploadNocApprovalDoc_Dis_FileName = dis_Name;
     }
    else if (type == 'UploadLOAApproval') {
      this.request.UploadLOAApproval = name;
      this.request.UploadLOAApprovalDocPath = path;
      this.request.UploadLOAApproval_Dis_FileName = dis_Name;
     }
    else if (type == 'UploadApplicationForm') {
      this.request.UploadApplicationForm = name;
      this.request.UploadApplicationFormDocPath = path;
      this.request.UploadApplicationFormDoc_Dis_FileName = dis_Name;
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
      this.OnchangeStatus();
      this.OnchangeEOAStatus();
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
   // console.log(this.NOCIssuedDataList);
    var NOCStatustype = this.NOCIssuedDataList.find((x: { NocIssued: any; }) => x.NocIssued == this.request.NocIssued).AffilationIssue;
    
    console.log(NOCStatustype);
    if (NOCStatustype == 'Yes') {
      this.NOCSTATUS = true;
      this.request.NOCStatus == 'Yes'
    } else {
      this.NOCSTATUS = false;
    }
    
  }
  async OnchangeEOAStatus() {   
    var AICTEEOALOAStatustype = this.NOCIssuedDataList.find((x: { NocIssued: any; }) => x.NocIssued == this.request.NocIssued).AffilationIssue;
    if (AICTEEOALOAStatustype == 'Yes') {
      this.AICTEEOALOAStatus = true;
      this.request.AICTEStatus = 'Yes'
    } else {
      this.AICTEEOALOAStatus = false;
    }
  }
}
