import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyNOCApplicationDataModel, CommiteeInspection_RNCCheckList_DataModel } from '../../../Models/ApplyNOCApplicationDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';

@Component({
  selector: 'app-inspection-committee-physical-verification-dce',
  templateUrl: './inspection-committee-physical-verification-dce.component.html',
  styleUrls: ['./inspection-committee-physical-verification-dce.component.css']
})
export class InspectionCommitteePhysicalVerificationDCEComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplyNocDetails: any = [];
  public request: CommiteeInspection_RNCCheckList_DataModel[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public isFormvalid: boolean = true;
  public isActionValid: boolean = false;
  public isObjectionValid: boolean = false;
  public isRemarkValid: boolean = false;
  public ShowHideNextRoleNextUser: boolean = true;
  public isActionTypeValid: boolean = false;

  public UserRoleList: any[] = [];
  public UserListRoleWise: any[] = [];


  public NextRoleID: number = 0;
  public NextUserID: number = 0;
  public ActionID: number = 0;
  public CheckFinalRemark: string = '';
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public WorkFlowActionList: any[] = [];
  public CheckListData: any[] = [];
  public FinalCheckListData: any[] = [];
  public NextActionID: number = 0;

  public isNextRoleIDValid: boolean = false;
  public isNextUserIdValid: boolean = false;
  public TotalDocumentScrutinyTab: number = 0;
  public isNextActionValid: boolean = false;
  public CollegeType_IsExisting: boolean = true;


  public ApplicationNo: string = '';
  public CommitteeApplicationNo: string = '';



  public NextWorkFlowActionList: any[] = [];
  public ApplicationCommitteeList: any[] = [];

  public All_U_Select: boolean = false;
  public isSubmit: boolean = false;
  public FinalRemark: string = '';
  public QueryStringStatus: any = '';

  public ShowHideApplicationAction: boolean = false;
  public ShowHideCommittee: boolean = false;
  AadharRequest = new AadharServiceDataModel();
  public CustomOTP: string = '123456';
  constructor(private medicalDocumentScrutinyService: MedicalDocumentScrutinyService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private committeeMasterService: CommitteeMasterService,
    private aadharServiceDetails: AadharServiceDetails
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetPhysicalVerificationAppliationList(this.sSOLoginDataModel.SSOID, this.QueryStringStatus);

  }

  async GetPhysicalVerificationAppliationList(SSOID: string, Status: any) {
    try {
      this.loaderService.requestStarted();
      await this.dceDocumentScrutinyService.GetPhysicalVerificationAppliationList(SSOID, Status)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyNocDetails = data['Data'][0]['data'];
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

  async GetRNCCheckListByTypeDepartment(ApplyNOCID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRNCCheckListByTypeDepartment('PV', this.sSOLoginDataModel.DepartmentID, ApplyNOCID, this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckListData = data['Data'].filter((x: { IsCheckList: number }) => x.IsCheckList == 0);
          this.FinalCheckListData = data['Data'].filter((x: { IsCheckList: number }) => x.IsCheckList == 1);
          this.FinalRemark = this.CheckListData[0].FinalRemark;
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


  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number)
  {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }


  async OpenActionPopUP(ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    this.ApplicationNo = ApplicationNo;
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.ShowHideApplicationAction = true;
    this.GetRNCCheckListByTypeDepartment(ApplyNOCID);
  }
  async SaveData() {
    this.isSubmit = true;
    this.request = [];
    this.isFormvalid = true;
    this.isNextUserIdValid = false;
    this.isNextRoleIDValid = false;
    this.isNextActionValid = false;
    this.isRemarkValid = false;
    try {
      debugger;
      for (var i = 0; i < this.CheckListData.length; i++) {
        if (this.CheckListData[i].FileUpload == true) {
          if (this.CheckListData[i].FileUploadName == '' || this.CheckListData[i].FileUploadName == undefined) {
            this.toastr.warning('Please select a file for upload');
            return
          }
        }
        if (this.CheckListData[i].IsChecked == '2') {
          if (this.CheckListData[i].Remark == '' || this.CheckListData[i].Remark == undefined) {
            this.toastr.warning('Please enter remark');
            return
          }
        }
        if (this.CheckListData[i].IsChecked == '' || this.CheckListData[i].IsChecked == undefined) {
          this.toastr.warning('Please check all checklist');
          return
        }
        this.request.push({
          ApplyNOCID: this.SelectedApplyNOCID,
          RNCCheckListID: this.CheckListData[i].RNCCheckListID,
          CreatedBy: this.sSOLoginDataModel.UserID,
          FileUploadName: this.CheckListData[i].FileUpload == true ? this.CheckListData[i].FileUploadName : "",
          IsChecked: this.CheckListData[i].IsChecked,
          Remark: this.CheckListData[i].Remark,
          FinalRemark: this.FinalRemark,
          RoleID: this.sSOLoginDataModel.RoleID
        })
      }
      if (this.FinalRemark == '' || this.FinalRemark == undefined || this.FinalRemark == null) {
        this.isFormvalid = false;
      }
      //if (this.ActionID <= 0) {
      //  this.isActionTypeValid = true;
      //  this.isFormvalid = false;
      //}
      //if (this.CheckFinalRemark == '') {
      //  this.isRemarkValid = true;
      //  this.isFormvalid = false;
      //}

      //if (this.ShowHideNextRoleNextUser) {
      //  if (this.NextRoleID <= 0) {
      //    this.isNextRoleIDValid = true;
      //    this.isFormvalid = false;
      //  }
      //  if (this.NextActionID <= 0) {
      //    this.isNextActionValid = true;
      //    this.isFormvalid = false;
      //  }
      //  if (this.NextUserID <= 0) {
      //    this.isNextUserIdValid = true;
      //    this.isFormvalid = false;
      //  }
      //}
      //else {
      //  this.NextRoleID = 4;
      //  this.NextUserID = 0;
      //  this.NextActionID = 0;
      //}
      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.SaveCommiteeInspectionRNCCheckList(this.request).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.toastr.success(this.SuccessMessage);
          this.modalService.dismissAll('After Success');
          this.ShowHideApplicationAction = false;
          window.location.reload();
        }
        else if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
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


  checkboxthAll_checkboxchange($event: any, checkValuethAll: boolean) {
    this.All_U_Select = checkValuethAll;
    for (let item of this.CheckListData) {
      item.IsChecked = checkValuethAll;
    }
  }

  public file: any = '';
  async ValidateDocumentImage(event: any, idx: number) {
    try {
      this.CheckListData[idx].ShowHideImgButton = false;
      if (event.target.files && event.target.files[0]) {
        if ((event.target.files[0].type === 'image/jpeg' ||
          event.target.files[0].type === 'image/jpg') ||
          event.target.files[0].type === 'application/pdf') {
          if (event.target.files[0].size > 2000000) {
            event.target.value = '';
            this.toastr.warning('Select less then 2MB File');
            return
          }
          if (event.target.files[0].size < 100000) {
            event.target.value = '';
            this.toastr.warning('Select more then 100kb File');
            return
          }
        }
        else {
          event.target.value = '';
          let msg = 'Select Only ';

          this.toastr.warning('Select Only JPG/JPEG/Pdf File');

          return
        }
        this.file = event.target.files[0];
        try {
          this.loaderService.requestStarted();
          await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.CheckListData[idx].ShowHideImgButton = true;
              this.CheckListData[idx].FileUploadName = data['Data'][0]["FileName"];
              this.CheckListData[idx].FileUploadNamePath = data['Data'][0]["FilePath"];
              this.CheckListData[idx].FileUploadName_Dis_FileName = data['Data'][0]["Dis_FileName"];
              event.target.value = '';
            }
            if (this.State == 1) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
        }
        catch (ex) {
          console.log(ex);
        }
        finally {
          this.loaderService.requestEnded();
        }
      }
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      //this.loaderService.requestEnded();
    }
  }


  async DeleteImage(idx: number) {
    this.loaderService.requestStarted();
    try {
      // delete from server folder
      await this.fileUploadService.DeleteDocument(this.CheckListData[idx].FileUploadName).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.CheckListData[idx].ShowHideImgButton = false;
          this.CheckListData[idx].FileUploadName = '';
          this.CheckListData[idx].FileUploadNamePath = '';
          this.CheckListData[idx].FileUploadName_Dis_FileName = '';

        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();

      }, 200);
    }

  }

  numbersOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[0-9]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  alphanumbersOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  CloseApplicationAction_Click() {
    this.isSubmit = false;
    this.ApplicationNo = '';
    this.SelectedCollageID = 0;
    this.SelectedDepartmentID = 0;
    this.SelectedApplyNOCID = 0;
    this.ShowHideApplicationAction = false;
    this.CheckListData = [];
  }

  async GetApplicationCommitteeList(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList(ApplyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationCommitteeList = data['Data'];
          if (this.ApplicationCommitteeList.length > 0) {
            this.ApplicationCommitteeList = this.ApplicationCommitteeList.filter(x => x.IsPrimaryMember == 0);
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

  public FinalSubmitApplyNOCID: number = 0;
  async OpenApplicationCommitteeMember(ApplyNOCID: number, ApplicationNo: string) {
    this.CommitteeApplicationNo = ApplicationNo;
    this.ShowHideCommittee = true;
    this.FinalSubmitApplyNOCID = ApplyNOCID;
    await this.GetApplicationCommitteeList(ApplyNOCID);
    await this.GetRNCCheckListByTypeDepartment(ApplyNOCID);
  }
  CloseCommittee_Click() {
    this.CommitteeApplicationNo = '';
    this.ShowHideCommittee = false;
    this.ApplicationCommitteeList = [];
    this.FinalSubmitApplyNOCID = 0;
  }
  public TransactionNo: string = '';
  async SendOTP(AadhaarNo: string, idx: number) {
    if (AadhaarNo != undefined && AadhaarNo.length == 12) {
      this.AadharRequest.AadharNo = AadhaarNo;
      for (var i = 0; i < this.ApplicationCommitteeList.length; i++) {
        if (idx != i && this.ApplicationCommitteeList[i].SendOTP != 2) {
          this.ApplicationCommitteeList[i].SendOTP = 0;
        }
      }
      await this.aadharServiceDetails.SendAadharOTP(this.AadharRequest)
        .then((data: any) => {
          if (data[0].status == "0") {
            this.ApplicationCommitteeList[idx].SendOTP = 1;
            this.TransactionNo = data[0].data;
            this.toastr.success("OTP send Successfully");
          }
          else {
            //this.toastr.error(data[0].message);
            this.ApplicationCommitteeList[idx].SendOTP = 1;
          }
        }, error => console.error(error));
    }
  }

  async VerifyOTP(UserOTP: number, idx: number) {
    await this.aadharServiceDetails.ValidateAadharOTP(this.AadharRequest)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data[0].status == "0") {
          //this.AadharDetails = JSON.parse(data[0].data);
          this.toastr.success("OTP Verify Successfully");
          this.ApplicationCommitteeList[idx].Verified = true;
          this.ApplicationCommitteeList[idx].SendOTP = 2;
        }
        else
        {
          if (UserOTP != Number(this.CustomOTP)) {
            this.toastr.error(data[0].message);
            this.ApplicationCommitteeList[idx].Verified = false;
          }
        }
      }, error => console.error(error));
    if (UserOTP == Number(this.CustomOTP)) {
      this.ApplicationCommitteeList[idx].Verified = true;
      this.ApplicationCommitteeList[idx].SendOTP = 2;
    }
  }

  async SubmitPhysicalVerification() {
    this.request = [];
    try {
      for (var i = 0; i < this.ApplicationCommitteeList.length; i++) {
        if (this.ApplicationCommitteeList[i].SendOTP != 2) {
          this.toastr.warning('Verified All Memeber');
          return;
        }
      }
      for (var i = 0; i < this.FinalCheckListData.length; i++) {
        if (this.FinalCheckListData[i].IsChecked == '2') {
          if (this.FinalCheckListData[i].Remark == '' || this.FinalCheckListData[i].Remark == undefined) {
            this.toastr.warning('Please enter remark');
            return
          }
        }
        if (this.FinalCheckListData[i].IsChecked == '' || this.FinalCheckListData[i].IsChecked == undefined) {
          this.toastr.warning('Please check all checklist');
          return
        }
        this.request.push({
          ApplyNOCID: this.FinalSubmitApplyNOCID,
          RNCCheckListID: this.FinalCheckListData[i].RNCCheckListID,
          CreatedBy: this.sSOLoginDataModel.UserID,
          FileUploadName: "",//this.FinalCheckListData[i].FileUpload == true ? this.FinalCheckListData[i].FileUploadName :
          IsChecked: this.FinalCheckListData[i].IsChecked,
          Remark: this.FinalCheckListData[i].Remark,
          FinalRemark: '',//this.FinalRemark
          RoleID: this.sSOLoginDataModel.RoleID
        })
      }
      await this.applyNOCApplicationService.SaveCommiteeInspectionRNCCheckList(this.request).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
      });
      await this.dceDocumentScrutinyService.FinalSubmitInspectionCommittee(this.ApplicationCommitteeList[0].ApplyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            window.location.reload();
          }
          else if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
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
}
