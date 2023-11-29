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
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { AnimalDocumentScrutinyService } from '../../../Services/AnimalDocumentScrutiny/animal-document-scrutiny.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';

@Component({
  selector: 'app-ah-physical-final-verification',
  templateUrl: './ah-physical-final-verification.component.html',
  styleUrls: ['./ah-physical-final-verification.component.css']
})
export class AhPhysicalFinalVerificationComponent {
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

  public ShowHideApplicationAction: boolean = false;
  public ShowHideCommittee: boolean = false;
  AadharRequest = new AadharServiceDataModel();
  public CustomOTP: string = '123456';
  public QueryStringStatus: any = '';
  public IsDisabled: boolean = false;
  public IsBtnShowHide: boolean = true;

  constructor(private animalDocumentScrutinyService: AnimalDocumentScrutinyService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private committeeMasterService: CommitteeMasterService, private collegeService: CollegeService,
    private aadharServiceDetails: AadharServiceDetails
  ) { }

  async ngOnInit() {

    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetFinalVerificationAppliationList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);

    if (this.QueryStringStatus == 'Pending') {
      this.IsDisabled = false;
      this.IsBtnShowHide = true;
    }
    else {
      this.IsDisabled = true;
      this.IsBtnShowHide = false;
    }
  }

  async GetFinalVerificationAppliationList(SSOID: string, UserID: number, RoleID: number, DepartmentID: number, QueryStringStatus: string) {
    try {
      this.loaderService.requestStarted();
      await this.animalDocumentScrutinyService.GetFinalVerificationAppliationList(SSOID, UserID, RoleID, DepartmentID, QueryStringStatus)
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
      await this.commonMasterService.GetRNCCheckListByTypeDepartment('FVCPC', this.sSOLoginDataModel.DepartmentID, ApplyNOCID, this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID)
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
  public CheckTabsEntryData: any = [];
  async CheckTabsEntry(SelectedApplyNOCID: number) {
    try {
      this.loaderService.requestStarted();
      await this.animalDocumentScrutinyService.CheckDocumentScrutinyTabsData(SelectedApplyNOCID, this.sSOLoginDataModel.RoleID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckTabsEntryData = data['Data'][0]['data'][0];
          if (this.SelectedDepartmentID == 2) {
            if (this.CollegeType_IsExisting) {
              if (this.CheckTabsEntryData['RoomDetails'] <= 0 || this.CheckTabsEntryData['CollegeDetail'] <= 0 || this.CheckTabsEntryData['CollegeManagementSociety'] <= 0 || this.CheckTabsEntryData['LandInformation'] <= 0
                || this.CheckTabsEntryData['Facility'] <= 0 || this.CheckTabsEntryData['RequiredDocument'] <= 0 || this.CheckTabsEntryData['RoomDetails'] <= 0 || this.CheckTabsEntryData['OtherInformation'] <= 0
                || this.CheckTabsEntryData['BuildingDocuments'] <= 0 || this.CheckTabsEntryData['StaffDetails'] <= 0 || this.CheckTabsEntryData['OLDNOCDetails'] <= 0 || this.CheckTabsEntryData['AcademicInformation'] <= 0
                || this.CheckTabsEntryData['OtherDocument'] <= 0 || this.CheckTabsEntryData['VeterinaryHospital'] <= 0) {
                this.isFormvalid = false;
              }
            }
            else {
              if (this.CheckTabsEntryData['RoomDetails'] <= 0 || this.CheckTabsEntryData['CollegeDetail'] <= 0 || this.CheckTabsEntryData['CollegeManagementSociety'] <= 0 || this.CheckTabsEntryData['LandInformation'] <= 0
                || this.CheckTabsEntryData['Facility'] <= 0 || this.CheckTabsEntryData['RequiredDocument'] <= 0 || this.CheckTabsEntryData['RoomDetails'] <= 0 || this.CheckTabsEntryData['OtherInformation'] <= 0
                || this.CheckTabsEntryData['BuildingDocuments'] <= 0  || this.CheckTabsEntryData['OtherDocument'] <= 0 || this.CheckTabsEntryData['VeterinaryHospital'] <= 0
              ) {
                this.isFormvalid = false;
              }
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

  async OpenActionPopUP(ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    this.ApplicationNo = ApplicationNo;
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    await this.GetCollageDetails(CollegeID);
    await this.CheckTabsEntry(ApplyNOCID);
    if (this.isFormvalid) {
      this.ShowHideApplicationAction = true;
      this.GetRNCCheckListByTypeDepartment(ApplyNOCID);
    }
    else {
      this.toastr.warning('First of all, check and complete all the tabs of document scrutiny and then complete the check list.');
      this.ShowHideApplicationAction = false;
    }
  }

  async GetCollageDetails(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.collegeService.GetData(CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*          this.collegeDataList = data['Data'];*/
          if (data['Data']['CollegeStatus'] == 'New') {
            this.CollegeType_IsExisting = false;
            //this.isAcademicInformation = false;
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

  async SaveData() {
    this.isSubmit = true;
    this.request = [];
    this.isFormvalid = true;
    this.isNextUserIdValid = false;
    this.isNextRoleIDValid = false;
    this.isNextActionValid = false;
    this.isRemarkValid = false;
    try {
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
      await this.committeeMasterService.GetApplicationCommitteeList_AH(ApplyNocApplicationID, "FinalVerification")
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
    try {
      this.loaderService.requestStarted();
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
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async VerifyOTP(UserOTP: number, idx: number) {
    try {
      this.loaderService.requestStarted();
      await this.aadharServiceDetails.ValidateAadharOTP(this.AadharRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data[0].status == "0") {
            //this.AadharDetails = JSON.parse(data[0].data);
            this.toastr.success("OTP Verify Successfully");
            this.ApplicationCommitteeList[idx].Verified = true;
            this.ApplicationCommitteeList[idx].SendOTP = 2;
          }
          else {
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
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
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
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.SaveCommiteeInspectionRNCCheckList(this.request).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
      });
      await this.animalDocumentScrutinyService.FinalSubmitInspectionCommittee(this.ApplicationCommitteeList[0].ApplyNocApplicationID, this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.UserID, "Final Verification Forward")
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

  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    if (DepartmentID = 2) {
      this.routers.navigate(['/animalhusbandryappnocpreview' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString()))]);
    }
  }
}
