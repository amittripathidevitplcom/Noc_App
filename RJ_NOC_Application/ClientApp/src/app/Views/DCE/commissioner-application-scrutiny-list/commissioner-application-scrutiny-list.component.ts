import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyNOCApplicationDataModel, CommiteeInspection_RNCCheckList_DataModel, GenerateNOC_DataModel, NOCIssuedRequestDataModel } from '../../../Models/ApplyNOCApplicationDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from '../..//../Services/FileUpload/file-upload.service';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { CommitteeMasterDataModel, CommitteeMemberDetail } from '../../../Models/CommitteeMasterDataModel';
import { ApplicationCommitteeMemberdataModel, PostApplicationCommitteeMemberdataModel } from '../../../Models/ApplicationCommitteeMemberdataModel';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { ApplyNocApplicationDataModel } from '../../../Models/ApplyNocParameterDataModel';

@Component({
  selector: 'app-commissioner-application-scrutiny-list',
  templateUrl: './commissioner-application-scrutiny-list.component.html',
  styleUrls: ['./commissioner-application-scrutiny-list.component.css']
})
export class CommissionerApplicationScrutinyListComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplyNocDetails: any[] = [];
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
  public SelectedApplyNOCIDForFile: number = 0;
  public WorkFlowActionList: any[] = [];
  public CheckListData: any[] = [];
  public NextActionID: number = 0;

  public isNextRoleIDValid: boolean = false;
  public isNextUserIdValid: boolean = false;
  public TotalDocumentScrutinyTab: number = 0;
  public isNextActionValid: boolean = false;
  public CollegeType_IsExisting: boolean = true;
  //public ApplyNocApplicationDetail: any = [];
  request_CommitteeMemberDataModel = new ApplicationCommitteeMemberdataModel();
  public ApplicationNo: string = '';

  request_MemberList = new PostApplicationCommitteeMemberdataModel();
  sSOVerifyDataModel = new SSOLoginDataModel();

  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';

  AadhaarNo: string = '';

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isSubmitted_MemberDetails: boolean = false;

  public QueryStringStatus: any = '';

  public NextWorkFlowActionList: any[] = [];

  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)

  public All_U_Select: boolean = false;
  CommitteeMemberDetails!: FormGroup;
  public PVApplicationDetailsList: any[] = [];
  public PVCommitteeList: any[] = [];


  public ApplyNocParameterMasterList: any[] = [];

  public ApplyNocParameterMasterList_NewCourse: any = [];
  public ApplyNocParameterMasterList_TNOCExtOfSubject: any = [];
  public ApplyNocParameterMasterList_NewCourseSubject: any = [];
  public ApplyNocParameterMasterList_ChangeInCollegeManagement: any = null;
  public ApplyNocParameterMasterList_ChangeInNameOfCollege: any = null;
  public ApplyNocParameterMasterList_ChangeInPlaceOfCollege: any = null;
  public ApplyNocParameterMasterList_PNOCOfSubject: any = null;
  constructor(private applyNocParameterService: ApplyNocParameterService, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private committeeMasterService: CommitteeMasterService, private decDocumentScrutinyService: DCEDocumentScrutinyService, private sSOLoginService: SSOLoginService, private aadharServiceDetails: AadharServiceDetails
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.AadhaarNo = this.sSOLoginDataModel.AadhaarId
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetNodalOfficerApplyNOCApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
    this.GetRoleListForApporval();
    this.GetWorkFlowActionListByRole();
    //this.GetRNCCheckListByTypeDepartment();

    this.CommitteeMemberDetails = this.formBuilder.group(
      {
        txtCMNameOfPerson: ['', Validators.required],
        txtCMMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtSSOID: ['', Validators.required]
      })

  }
  get form_CommitteeMember() { return this.CommitteeMemberDetails.controls; }



  async GetNodalOfficerApplyNOCApplicationList(RoleId: number, UserID: number, Status: string) {
    try {
      this.loaderService.requestStarted();
      let ActionName = '';
      if (RoleId == 24) {
        ActionName = Status == 'Completed' ? 'Forward To Secretary' : Status == 'Rejected' ? 'Reject By Commissioner' : Status == 'Revert' ? 'Revert By Commissioner' : Status == 'NOCIssued' ? 'Release NOC' : Status == 'Pending' ? 'Approve' : Status == 'ForwardedSecretary' ? 'Forward To Commissioner' : '';
      }
      if (RoleId == 7) {
        ActionName = Status == 'Completed' ? 'Forward To Minister Higher Education' : Status == 'Rejected' ? 'Reject By Secretary' : Status == 'Revert' ? 'Revert By Secretary' : Status == 'NOCIssued' ? 'Release NOC' : Status == 'Forward' ? 'Forward To Secretary By Minister' : Status == 'Pending' ? 'Forward To Secretary' : Status == 'CCompleted' ? 'Forward To Commissioner' : '';
      }
      if (RoleId == 26) {
        ActionName = Status == 'Completed' ? 'Forward To Secretary By Minister' : Status == 'Rejected' ? 'Reject By Minister' : Status == 'Pending' ? 'Forward To Minister Higher Education' : '';
      }

      await this.decDocumentScrutinyService.GetNodalOfficerApplyNOCApplicationList(RoleId, UserID, Status, ActionName, this.sSOLoginDataModel.SessionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyNocDetails = data['Data'];
          console.log(this.ApplyNocDetails);
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

  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }




  async OpenActionPopUP(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    this.ApplicationNo = ApplicationNo;
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    this.SelectedCollageID = 0;
    this.SelectedDepartmentID = 0;
    this.SelectedApplyNOCID = 0;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  async OpenAsignCommitteePopUP(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    this.ApplicationNo = ApplicationNo;
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.GetApplicationCommitteeList(ApplyNOCID)
  }

  async DocumentScrutiny() {
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
      }
      if (this.ActionID <= 0) {
        this.isActionTypeValid = true;
        this.isFormvalid = false;
      }
      if (this.CheckFinalRemark == '') {
        this.isRemarkValid = true;
        this.isFormvalid = false;
      }

      if (this.ShowHideNextRoleNextUser) {
        if (this.NextRoleID <= 0) {
          this.isNextRoleIDValid = true;
          this.isFormvalid = false;
        }
        if (this.NextActionID <= 0) {
          this.isNextActionValid = true;
          this.isFormvalid = false;
        }
        if (this.NextUserID <= 0) {
          this.isNextUserIdValid = true;
          this.isFormvalid = false;
        }
      }
      else {
        this.NextRoleID = 1;
        this.NextUserID = 0;
        this.NextActionID = 0;
      }


      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      this.applyNOCApplicationService.DocumentScrutiny(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.ActionID, this.SelectedApplyNOCID, this.SelectedDepartmentID, this.CheckFinalRemark, this.NextRoleID, this.NextUserID, this.NextActionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.modalService.dismissAll('After Success');
            this.routers.navigate(['/dashboard']);
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
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


  checkboxthAll_checkboxchange($event: any, checkValuethAll: boolean) {
    this.All_U_Select = checkValuethAll;
    for (let item of this.CheckListData) {
      item.IsChecked = checkValuethAll;
    }
  }

  public file: any = '';
  async ValidateDocumentImage(event: any, idx: number) {
    this.loaderService.requestStarted();
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
    } catch (ex) {

    }
    finally {
      this.loaderService.requestEnded();
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



  async GetRoleListForApporval() {
    this.UserRoleList = [];
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetRoleListForApporval(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.UserRoleList = data['Data'];
            if (this.UserRoleList.length > 0) {
              this.NextRoleID = this.UserRoleList[0]['RoleID'];
              await this.NextGetUserDetailsByRoleID();
            }
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async NextGetUserDetailsByRoleID() {
    this.UserListRoleWise = [];
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetUserDetailsByRoleID(this.NextRoleID, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.UserListRoleWise = data['Data'];
            if (this.UserListRoleWise.length > 0) {
              this.NextUserID = this.UserListRoleWise[0]['UId'];
              await this.NextGetWorkFlowActionListByRole();
            }
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async NextGetWorkFlowActionListByRole() {
    this.NextWorkFlowActionList = [];
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetWorkFlowActionListByRole(this.NextRoleID, "Next", this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.NextWorkFlowActionList = data['Data'];
            if (this.NextWorkFlowActionList.length > 0) {
              this.NextActionID = this.NextWorkFlowActionList[0]['ActionID'];
            }
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async GetWorkFlowActionListByRole() {
    this.WorkFlowActionList = [];
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetWorkFlowActionListByRole(this.sSOLoginDataModel.RoleID, "Current", this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.WorkFlowActionList = data['Data'];
            if (this.WorkFlowActionList.length > 0) {
              this.ActionID = this.WorkFlowActionList[0]['ActionID'];
              var IsNextAction = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsNextAction;
              if (IsNextAction == true) {
                this.ShowHideNextRoleNextUser = true;
              }
              else {
                this.ShowHideNextRoleNextUser = false;
              }
            }
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  OnChangeCurrentAction() {
    var IsNextAction = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsNextAction;
    if (IsNextAction == true) {
      this.ShowHideNextRoleNextUser = true;
    }
    else {
      this.ShowHideNextRoleNextUser = false;
    }
  }

  async CheckDocumentScrutinyTabsData() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.CheckDocumentScrutinyTabsData(this.SelectedApplyNOCID, this.sSOLoginDataModel.RoleID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TotalDocumentScrutinyTab = data['Data'];
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


  async AddMemberDetail() {
    this.isSubmitted_MemberDetails = true;
    if (this.CommitteeMemberDetails.invalid) {
      return
    }
    //rest
    this.AadhaarNo = '';

    var isValidate = this.request_MemberList.ApplicationCommitteeList.find(e => e.SSOID === this.request_CommitteeMemberDataModel.SSOID);
    var isValidateMobile = this.request_MemberList.ApplicationCommitteeList.find(e => e.MobileNumber === this.request_CommitteeMemberDataModel.MobileNumber);
    if (!isValidate && !isValidateMobile) {
      await this.VerifySSOID(this.request_CommitteeMemberDataModel.SSOID);
      if (this.AadhaarNo.length > 0) {
        this.request_MemberList.ApplicationCommitteeList.push({
          CommitteeMemberID: 0,
          ApplyNocApplicationID: this.SelectedApplyNOCID,
          NameOfPerson: this.request_CommitteeMemberDataModel.NameOfPerson,
          MobileNumber: this.request_CommitteeMemberDataModel.MobileNumber,
          SSOID: this.request_CommitteeMemberDataModel.SSOID,
          RoleID: 0,
          IsPrimaryMember: false,
          ActiveStatus: true,
          DeleteStatus: false,
          AadhaarNo: this.AadhaarNo,
        });
        this.request_CommitteeMemberDataModel.NameOfPerson = '';
        this.request_CommitteeMemberDataModel.MobileNumber = '';
        this.request_CommitteeMemberDataModel.SSOID = '';
        this.request_CommitteeMemberDataModel.IsPrimaryMember = false;
        this.isSubmitted_MemberDetails = false;
      }
      else {
        this.toastr.warning('SSOID Invalid')
      }
    }
    else {
      this.toastr.warning(isValidate ? 'This User Alaready Exists' : 'this Mobile Number Exists');
    }
    // reset




  }
  DelMemberDetail(item: any, index: any) {

    //  const index: number = this.request_MemberList.ApplicationCommitteeList.indexOf(item);


    let chkIsPrimary = this.request_MemberList.ApplicationCommitteeList[index].IsPrimaryMember;
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        if (!chkIsPrimary) {
          this.loaderService.requestStarted();
          this.request_MemberList.ApplicationCommitteeList.splice(index, 1)
        }
        else {
          this.toastr.warning("You can't delete primary member")
        }
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async SaveData() {
    this.isSubmitted = true;

    let isValid = true;
    if (this.form_CommitteeMember.invalid) {
      isValid = false;
      return;
    }
    if (this.request_MemberList.ApplicationCommitteeList.length == 0) {
      this.toastr.error("Please add Member Details");
      isValid = false;
    }
    if (this.request_MemberList.ApplicationCommitteeList.length <= 3) {
      this.toastr.error("Please add three Member Details");
      isValid = false;
    }
    let ifPrimaryExits = this.request_MemberList.ApplicationCommitteeList.find(f => f.IsPrimaryMember == true);
    if (ifPrimaryExits?.IsPrimaryMember == undefined) {
      this.toastr.error("Atleast one primary member required");
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    //console.log(this.request_MemberList.ApplicationCommitteeList);
    this.request_MemberList.ApplyNocApplicationID = this.SelectedApplyNOCID;
    this.request_MemberList.UserID = this.sSOLoginDataModel.UserID;
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.committeeMasterService.SaveApplicationCommitteeData(this.request_MemberList)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.modalService.dismissAll('After Success');
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


  async GetApplicationCommitteeList(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList(ApplyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request_MemberList.ApplicationCommitteeList = data['Data'];
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

  async CheckMappingSSOID(ssoid: any) {
    try {
      this.loaderService.requestStarted();
      await this.sSOLoginService.CheckMappingSSOID(ssoid)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.sSOVerifyDataModel = data['Data'];
        }, (error: any) => console.error(error));
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

  async VerifySSOID(SSOID: any) {
    //Show Loading
    debugger;
    //verify ssoid
    await this.CheckMappingSSOID(SSOID);
    if (this.sSOVerifyDataModel != null && SSOID.toLowerCase() == this.sSOVerifyDataModel.SSOID.toLowerCase()) {
      let d = new AadharServiceDataModel();
      d.AadharID = this.sSOVerifyDataModel.AadhaarId;
      await this.GetAadharByVID(d);
      this.SsoValidationMessage = 'd';
      this.SsoSuccessMessage = 'SSO Id Verified Successfully';

      AadharServiceDetails
    }
    else {
      this.SsoValidationMessage = ''
      this.SsoValidationMessage = 'SSO Id Invalid !';
    }
  }


  async GetAadharByVID(data: any) {
    await this.aadharServiceDetails.GetAadharByVID(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data[0].status == "0") {
          this.AadhaarNo = data[0].data;
        }
        else {
          this.AadhaarNo = '';
        }
      }, error => console.error(error));
  }
  SetPrimaryMember(item: any, index: any) {
    let oldArr = this.request_MemberList.ApplicationCommitteeList;
    let newArr = oldArr.map(obj => ({ ...obj, ['IsPrimaryMember']: false }));
    newArr[index].IsPrimaryMember = true;
    this.request_MemberList.ApplicationCommitteeList = newArr;
  }

  //Application Details
  async ViewApplicationPvDetails(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    this.ApplicationNo = ApplicationNo;
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //
    await this.GetApplicationPvDetails(this.SelectedApplyNOCID);
    await this.GetPVApplicationCommitteeList(this.SelectedApplyNOCID);
    await this.GetWorkFlowRemarksByApplicationID(this.SelectedApplyNOCID);

  }

  async GetApplicationPvDetails(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.decDocumentScrutinyService.GetApplicationPvDetails(ApplyNocApplicationID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PVApplicationDetailsList = data['Data'][0]['data'];
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

  async GetPVApplicationCommitteeList(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList(ApplyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PVCommitteeList = data['Data'];
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

  numbersOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[0-9]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
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

  async ApplicationScrutiny_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    if (this.QueryStringStatus == 'Forward') {
      this.routers.navigate(['/checklistforsecretarydce' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString()))]);
    }
    else if (this.QueryStringStatus == 'ForwardedSecretary') {
      this.routers.navigate(['/checklistforcommissioner' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + 'ForwardedSecretary']);
    }else {
      this.routers.navigate(['/checklistforcommissioner' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString()))]);
    }
  }

  async OpenGeneratePDFPopUP(content: any, ApplyNOCID: number, DepartmentID: number) {
    this.NOCIssuedRemark = '';
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.ApplyNocParameterMasterList_NewCourse = [];
    this.ApplyNocParameterMasterList_TNOCExtOfSubject = [];
    this.ApplyNocParameterMasterList_PNOCOfSubject = [];
    this.ApplyNocParameterMasterList_NewCourseSubject = [];
    this.ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
    this.ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
    this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
    await this.GetAppliedParameterNOCForByApplyNOCID(ApplyNOCID);
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  public requestnoc = new NOCIssuedRequestDataModel();
  public isSubmitNOC: boolean = false;
  public NOCIssuedRemark: string = '';
  public IssuedYear: number = 0;
  async GeneratePDF_OnClick() {
    try {
      this.requestnoc = new NOCIssuedRequestDataModel();
      this.isFormvalid = true;
      this.isSubmitNOC = true;
      if (this.NOCIssuedRemark == '') {
        this.isFormvalid = false;
      }

      var CheckedCount = 0;
      await this.ApplyNocParameterMasterList.forEach((i: { IsChecked: boolean, ApplyNocParameterID: number, ApplyNocApplicationID: number }) => {
        if (i.IsChecked) {
          CheckedCount++;
          this.requestnoc.AppliedNOCFor.push({
            ApplyNOCID: i.ApplyNocApplicationID,
            ParameterID: i.ApplyNocParameterID,
            CreatedBy: this.sSOLoginDataModel.UserID,
            Remark: this.NOCIssuedRemark,
            NoOfIssuedYear: this.IssuedYear
          });
        }
      });
      if (CheckedCount <= 0) {
        this.isFormvalid = false;
        this.toastr.warning('Please select atleast one noc realse for');
        return;
      }
      var NewSubjects = this.ApplyNocParameterMasterList.find((x: { IsChecked: boolean; ParameterCode: string }) => x.IsChecked == true && x.ParameterCode == 'DEC_NewSubject')?.IsChecked;
      var NewSubjectsCount = 0;
      if (NewSubjects == true) {
        for (var i = 0; i < this.ApplyNocParameterMasterList_NewCourseSubject.length; i++) {
          for (var j = 0; j < this.ApplyNocParameterMasterList_NewCourseSubject[i].SubjectList.length; j++) {
            if (this.ApplyNocParameterMasterList_NewCourseSubject[i].SubjectList[j].IsSubjectChecked == true) {
              NewSubjectsCount++;
              this.requestnoc.NOCDetails.push({
                ApplyNOCID: this.ApplyNocParameterMasterList_NewCourseSubject[i].ApplyNocApplicationID,
                DepartmentID: this.SelectedDepartmentID,
                RoleID: this.sSOLoginDataModel.RoleID,
                UserID: this.sSOLoginDataModel.UserID,
                CourseID: this.ApplyNocParameterMasterList_NewCourseSubject[i].CourseID,
                CourseName: this.ApplyNocParameterMasterList_NewCourseSubject[i].CourseName,
                SubjectID: this.ApplyNocParameterMasterList_NewCourseSubject[i].SubjectList[j].SubjectID,
                SubjectName: this.ApplyNocParameterMasterList_NewCourseSubject[i].SubjectList[j].SubjectName,
                ApplyNocParameterID: this.ApplyNocParameterMasterList_NewCourseSubject[i].SubjectList[j].ApplyNocParameterID,
              });
            }
          }
        }
        if (NewSubjectsCount <= 0) {
          this.isFormvalid = false;
          this.toastr.warning('Please select atleast one Subject in New Subjects');
          return;
        }
      }
      var TNOCExt = this.ApplyNocParameterMasterList.find((x: { IsChecked: boolean; ParameterCode: string }) => x.IsChecked == true && x.ParameterCode == 'DEC_TNOCExtOfSubject')?.IsChecked;
      var TNOCExtCount = 0;
      if (TNOCExt == true) {
        for (var i = 0; i < this.ApplyNocParameterMasterList_TNOCExtOfSubject.length; i++) {
          for (var j = 0; j < this.ApplyNocParameterMasterList_TNOCExtOfSubject[i].SubjectList.length; j++) {
            if (this.ApplyNocParameterMasterList_TNOCExtOfSubject[i].SubjectList[j].IsSubjectChecked == true) {
              TNOCExtCount++;
              this.requestnoc.NOCDetails.push({
                ApplyNOCID: this.ApplyNocParameterMasterList_TNOCExtOfSubject[i].ApplyNocApplicationID,
                DepartmentID: this.SelectedDepartmentID,
                RoleID: this.sSOLoginDataModel.RoleID,
                UserID: this.sSOLoginDataModel.UserID,
                CourseID: this.ApplyNocParameterMasterList_TNOCExtOfSubject[i].CourseID,
                CourseName: this.ApplyNocParameterMasterList_TNOCExtOfSubject[i].CourseName,
                SubjectID: this.ApplyNocParameterMasterList_TNOCExtOfSubject[i].SubjectList[j].SubjectID,
                SubjectName: this.ApplyNocParameterMasterList_TNOCExtOfSubject[i].SubjectList[j].SubjectName,
                ApplyNocParameterID: this.ApplyNocParameterMasterList_TNOCExtOfSubject[i].SubjectList[j].ApplyNocParameterID,
              });
            }
          }
        }
        if (TNOCExtCount <= 0) {
          this.isFormvalid = false;
          this.toastr.warning('Please select atleast one Subject in TNOC Extension Of Subject');
          return;
        }
        if (this.IssuedYear <= 0) {
          this.isFormvalid = false;
          this.toastr.warning('Please select No Of Issued Year in TNOC Extension Of Subject');
          return;
        }
      }

      var NewCourse = this.ApplyNocParameterMasterList.find((x: { IsChecked: boolean; ParameterCode: string }) => x.IsChecked == true && x.ParameterCode == 'DEC_NewCourse')?.IsChecked;
      var NewCourseCount = 0;
      if (NewCourse == true) {
        for (var i = 0; i < this.ApplyNocParameterMasterList_NewCourse.length; i++) {
          for (var j = 0; j < this.ApplyNocParameterMasterList_NewCourse[i].SubjectList.length; j++) {
            if (this.ApplyNocParameterMasterList_NewCourse[i].SubjectList[j].IsSubjectChecked == true) {
              NewCourseCount++;
              this.requestnoc.NOCDetails.push({
                ApplyNOCID: this.ApplyNocParameterMasterList_NewCourse[i].ApplyNocApplicationID,
                DepartmentID: this.SelectedDepartmentID,
                RoleID: this.sSOLoginDataModel.RoleID,
                UserID: this.sSOLoginDataModel.UserID,
                CourseID: this.ApplyNocParameterMasterList_NewCourse[i].CourseID,
                CourseName: this.ApplyNocParameterMasterList_NewCourse[i].CourseName,
                SubjectID: this.ApplyNocParameterMasterList_NewCourse[i].SubjectList[j].SubjectID,
                SubjectName: this.ApplyNocParameterMasterList_NewCourse[i].SubjectList[j].SubjectName,
                ApplyNocParameterID: this.ApplyNocParameterMasterList_NewCourse[i].SubjectList[j].ApplyNocParameterID,
              });
            }
          }
        }
        if (NewCourseCount <= 0) {
          this.isFormvalid = false;
          this.toastr.warning('Please select atleast one Subject in New Course');
          return;
        }
      }
      debugger;
      var PNOC = this.ApplyNocParameterMasterList.find((x: { IsChecked: boolean; ParameterCode: string }) => x.IsChecked == true && x.ParameterCode == 'DEC_PNOCSubject')?.IsChecked;
      var PNOCCount = 0;
      if (PNOC == true) {
        for (var i = 0; i < this.ApplyNocParameterMasterList_PNOCOfSubject.length; i++) {
          for (var j = 0; j < this.ApplyNocParameterMasterList_PNOCOfSubject[i].SubjectList.length; j++) {
            if (this.ApplyNocParameterMasterList_PNOCOfSubject[i].SubjectList[j].IsSubjectChecked == true) {
              PNOCCount++;
              this.requestnoc.NOCDetails.push({
                ApplyNOCID: this.ApplyNocParameterMasterList_PNOCOfSubject[i].ApplyNocApplicationID,
                DepartmentID: this.SelectedDepartmentID,
                RoleID: this.sSOLoginDataModel.RoleID,
                UserID: this.sSOLoginDataModel.UserID,
                CourseID: this.ApplyNocParameterMasterList_PNOCOfSubject[i].CourseID,
                CourseName: this.ApplyNocParameterMasterList_PNOCOfSubject[i].CourseName,
                SubjectID: this.ApplyNocParameterMasterList_PNOCOfSubject[i].SubjectList[j].SubjectID,
                SubjectName: this.ApplyNocParameterMasterList_PNOCOfSubject[i].SubjectList[j].SubjectName,
                ApplyNocParameterID: this.ApplyNocParameterMasterList_PNOCOfSubject[i].SubjectList[j].ApplyNocParameterID,
              });
            }
          }
        }
        if (PNOCCount <= 0) {
          this.isFormvalid = false;
          this.toastr.warning('Please select atleast one Subject in PNOC for Subject');
          return;
        }
      }

      if (!this.isFormvalid) {
        return;
      }

      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GenerateNOCForDCE(this.requestnoc)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage);
            this.modalService.dismissAll('After Success');
            window.location.reload();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
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
  public WorkFlowRemarks: any = [];
  async GetWorkFlowRemarksByApplicationID(ApplyNOCID: number) {
    try {
      this.loaderService.requestStarted();
      await this.decDocumentScrutinyService.GetWorkFlowRemarksByApplicationID(ApplyNOCID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.WorkFlowRemarks = data['Data'][0]['data'];
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
  public ApplicationTrailList: any = [];
  async GetApplicationTrail(content: any, ApplyNOCID: number) {
    this.ApplicationTrailList = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetApplicationTrail_DepartmentApplicationWise(ApplyNOCID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationTrailList = data['Data'];
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




  async GetApplyNOCCourseandSubject(applyNocApplicationID: number, ParameterID: number, ParameterCode: string) {
    try {
      this.loaderService.requestStarted();
      // get
      await this.applyNocParameterService.GetCourseSubjectByApplyNOCID(applyNocApplicationID, ParameterID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            if (ParameterCode == 'DEC_NewCourse') {
              this.ApplyNocParameterMasterList_NewCourse = data['Data'];
            }
            else if (ParameterCode == 'DEC_TNOCExtOfSubject') {
              this.ApplyNocParameterMasterList_TNOCExtOfSubject = data['Data'];
            }
            else if (ParameterCode == 'DEC_NewSubject') {
              this.ApplyNocParameterMasterList_NewCourseSubject = data['Data'];
            }
            else if (ParameterCode == 'DEC_PNOCSubject') {
              this.ApplyNocParameterMasterList_PNOCOfSubject = data['Data'];
            }
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



  async GetAppliedParameterNOCForByApplyNOCID(ApplyNOCID: number) {
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GetAppliedParameterNOCForByApplyNOCID(ApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          this.ApplyNocParameterMasterList = data['Data'][0]['data'];
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

  async ApplyNocFor_cbChange(ApplyNOCID: number, ParameterID: number, IsChecked: boolean, ParameterCode: string) {
    try {
      this.loaderService.requestStarted();
      // get
      if (IsChecked) {
        if (ParameterCode == 'DEC_NewCourse' || ParameterCode == 'DEC_TNOCExtOfSubject' || ParameterCode == 'DEC_NewSubject' || ParameterCode =='DEC_PNOCSubject') {
          await this.GetApplyNOCCourseandSubject(ApplyNOCID, ParameterID, ParameterCode);
        }
        else {
          await this.applyNocParameterService.GetApplyNocApplicationByApplicationID(ApplyNOCID)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              if (this.State == 0) {
                if (ParameterCode == 'DEC_ChangeManagement') {
                  this.ApplyNocParameterMasterList_ChangeInCollegeManagement = data['Data']['ChangeInCollegeManagementList'][0];
                }
                else if (ParameterCode == 'DEC_ChangeName') {
                  this.ApplyNocParameterMasterList_ChangeInNameOfCollege = data['Data']['ChangeInNameOfCollegeList'][0];
                }
                else if (ParameterCode == 'DEC_ChangePlace') {
                  this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = data['Data']['ChangeInPlaceOfCollegeList'][0];
                }
              }
              else {
                if (ParameterCode == 'DEC_ChangeManagement') {
                  this.ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
                }
                else if (ParameterCode == 'DEC_ChangeName') {
                  this.ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
                }
                else if (ParameterCode == 'DEC_ChangePlace') {
                  this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
                }
              }
            }, error => console.error(error));
        }
      }
      else {
        if (ParameterCode == 'DEC_NewCourse') {
          this.ApplyNocParameterMasterList_NewCourse = [];
        }
        else if (ParameterCode == 'DEC_TNOCExtOfSubject') {
          this.ApplyNocParameterMasterList_TNOCExtOfSubject = [];
        }
        else if (ParameterCode == 'DEC_NewSubject') {
          this.ApplyNocParameterMasterList_NewCourseSubject = [];
        }
        else if (ParameterCode == 'DEC_ChangeManagement') {
          this.ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
        }
        else if (ParameterCode == 'DEC_ChangeName') {
          this.ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
        }
        else if (ParameterCode == 'DEC_ChangePlace') {
          this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
        }
        else if (ParameterCode == 'DEC_PNOCSubject') {
          this.ApplyNocParameterMasterList_PNOCOfSubject = [];
        }
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



  //Esign

  //OTP Variable
  AadharRequest = new AadharServiceDataModel();
  public TransactionNo: string = '';
  public UserOTP: string = '';
  public CustomOTP: string = '123456';// bypass otp
  public isUserOTP: boolean = false;
  public isValidUserOTP: boolean = false;
  public ShowTimer: boolean = false;
  public isTimerDisabled: boolean = false;
  public StartTimer: any;
  public DisplayTimer: string = '';
  public selectedFileName: string = '';
  public selectedApplyNOCID: number = 0;
  public selectedParameterID: number = 0;
  async SendEsignOTP(FileName: string, ApplyNOCID: number, ParameterID: number) {
    this.selectedFileName = '';
    this.UserOTP = '';
    try {
      this.loaderService.requestStarted();
      if (this.AadhaarNo != undefined) {
        if (this.AadhaarNo.length > 12) {
          this.AadharRequest.AadharID = this.AadhaarNo;
          await this.aadharServiceDetails.GetAadharByVID(this.AadharRequest)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data[0].status == "0") {
                this.AadhaarNo = data[0].data;
              }
              else {
                this.AadhaarNo = '';
              }
            }, error => console.error(error));
        }
        if (this.AadhaarNo.length == 12) {
          this.AadharRequest.AadharNo = this.AadhaarNo;
          this.AadharRequest.TransactionNo = '';
          await this.aadharServiceDetails.SendOtpByAadharNo_Esign(this.AadharRequest)
            .then((data: any) => {
              if (data[0].status == "0") {
                this.TransactionNo = data[0].data;
                this.modalService.dismissAll('After Success');
                const display = document.getElementById('ModalOtpVerify')
                if (display) display.style.display = "block";
                this.toastr.success("OTP send Successfully");
                this.selectedFileName = FileName;
                this.selectedApplyNOCID = ApplyNOCID;
                this.selectedParameterID = ParameterID;
                this.timer(1);
              }
              else {
                if (data[0].status == "1" && data[0].message == "Server IP address is not whiteListed") {
                  this.toastr.warning("Server IP address is not whiteListed");
                }
                else {
                  this.toastr.warning(data[0].message);
                }

              }
            }, error => console.error(error));
        }
        else {
          this.toastr.warning("Aadhaar No. is not correct.please contact to admin department.");
          return;
        }
      }
      else {
        this.toastr.warning("Aadhaar number is not registered in the SSO you are using. Please update your Aadhaar number in your SSO and then login.");
        return;
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
  timer(minute: number) {
    clearInterval(this.StartTimer);
    this.ShowTimer = true;
    this.isTimerDisabled = true;
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    this.StartTimer = setInterval(() => {

      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.DisplayTimer = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.ShowTimer = false;
        this.isTimerDisabled = false;
        clearInterval(this.StartTimer);
      }
    }, 1000);
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  CloseOTPModel() {
    const display = document.getElementById('ModalOtpVerify');
    if (display) display.style.display = 'none';
    this.selectedApplyNOCID = 0;
    this.selectedParameterID = 0;
    this.UserOTP = '';
    this.TransactionNo = '';
    this.isUserOTP = false;
    this.isValidUserOTP = false;
  }

  async ResendOTP() {
    try {
      this.loaderService.requestStarted();
      if (this.AadhaarNo != undefined) {
        if (this.AadhaarNo.length > 12) {
          this.AadharRequest.AadharID = this.AadhaarNo;
          await this.aadharServiceDetails.GetAadharByVID(this.AadharRequest)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data[0].status == "0") {
                this.AadhaarNo = data[0].data;
              }
              else {
                this.AadhaarNo = '';
              }
            }, error => console.error(error));
        }
        console.log(this.AadhaarNo);
        if (this.AadhaarNo.length == 12) {
          this.AadharRequest.AadharNo = this.AadhaarNo;
          this.AadharRequest.TransactionNo = '';
          await this.aadharServiceDetails.SendOtpByAadharNo_Esign(this.AadharRequest)
            .then((data: any) => {
              if (data[0].status == "0") {
                this.TransactionNo = data[0].data;
                this.modalService.dismissAll('After Success');
                const display = document.getElementById('ModalOtpVerify')
                if (display) display.style.display = "block";
                this.toastr.success("OTP send Successfully");
                this.timer(1);
              }
              else {
                if (data[0].status == "1" && data[0].message == "Server IP address is not whiteListed") {
                  this.toastr.warning("Server IP address is not whiteListed");
                }
                else {
                  this.toastr.warning(data[0].message);
                }

              }
            }, error => console.error(error));
        }
        else {
          this.toastr.warning("Aadhaar No. is not correct.please contact to admin department.");
          return;
        }
      }
      else {
        this.toastr.warning("Aadhaar number is not registered in the SSO you are using. Please update your Aadhaar number in your SSO and then login.");
        return;
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

  async VerifyOTP() {
    try {
      this.isUserOTP = false;
      this.isValidUserOTP = false;
      this.loaderService.requestStarted();
      if (this.UserOTP != undefined && this.UserOTP != null) {
        if (this.UserOTP.length == 6 && this.UserOTP != '0') {
          this.AadharRequest.AadharNo = this.AadhaarNo;
          this.AadharRequest.OTP = this.UserOTP;
          this.AadharRequest.TransactionNo = this.TransactionNo;
          await this.aadharServiceDetails.ValidateAadharOTP_Esign(this.AadharRequest)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data[0].status == "0") {
                await this.EsignPDF();
              }
              else {
                if (this.UserOTP == this.CustomOTP) {
                  await this.EsignPDF();
                }
                else {
                  this.toastr.success("Invalid OTP!");
                  this.isValidUserOTP = true;
                  return;
                }
              }
            }, error => console.error(error));
        }
        else {
          this.isValidUserOTP = true;
          return;
        }
      }
      else {
        this.isUserOTP = true;
        return;
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
  async EsignPDF() {
    try {
      this.loaderService.requestStarted();
      if (this.selectedFileName != undefined && this.selectedFileName != null) {
        await this.aadharServiceDetails.eSignPDF(this.selectedFileName, this.TransactionNo, this.sSOLoginDataModel.DepartmentID, this.selectedParameterID)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data[0].status == "0") {
              await this.EsignPDFUpdate();
              //this.toastr.success(data[0].message);
            }
            else {
              if (this.UserOTP == this.CustomOTP) {
                await this.EsignPDFUpdate();
                //this.toastr.success(data[0].message);
              }
              else {
                this.toastr.warning(data[0].message);
              }
            }
          }, error => console.error(error));
      }
      else {
        this.toastr.warning("File Name is null.please try again.");
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


  async EsignPDFUpdate() {
    this.loaderService.requestStarted();
    try {
      await this.decDocumentScrutinyService.DCEPdfEsign(this.selectedApplyNOCID, this.selectedParameterID, this.sSOLoginDataModel.UserID)
        .then(async (data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.toastr.success(this.SuccessMessage);
            await this.CloseOTPModel();
            this.modalService.dismissAll('After Success');
            await this.GetNodalOfficerApplyNOCApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
          }
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }
  }


  public MinisterFile: string = '';
  public MinisterFile_Dis_FileName: string = '';
  public MinisterFilePath: string = '';
  async MinisterOfflineFilePopUp(content: any, ApplyNOCID: number, ApplicationNo: string) {
    this.ApplicationNo = '';
    this.ApplicationNo = ApplicationNo;
    this.SelectedApplyNOCIDForFile = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
   
  }

  async UploadFile(event: any) {
    if (event.target.files && event.target.files[0]) {
        if(event.target.files[0].type === 'application/pdf') {
        //if (event.target.files[0].size > 2000000) {
        //  event.target.value = '';
        //  this.toastr.warning('Select less then 2MB File');
        //  return
        //}
        if (event.target.files[0].size < 100000) {
          event.target.value = '';
          this.toastr.warning('Select more then 100kb File');
          return
        }
      }
      else {
        event.target.value = '';
        this.toastr.warning('Select Only pdf');
        return
      }
      // upload
      this.file = event.target.files[0];
      try {
        this.loaderService.requestStarted();
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.MinisterFile = data['Data'][0]["FileName"];
            this.MinisterFilePath = data['Data'][0]["FilePath"];
            this.MinisterFile_Dis_FileName = data['Data'][0]["Dis_FileName"];
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
      catch (ex) { }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }

    }
    else {
      this.MinisterFile = '';
      this.MinisterFilePath = '';
      this.MinisterFile_Dis_FileName = '';
    }
  }
  async DeleteFile(file: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.fileUploadService.DeleteDocument(file).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.MinisterFile = '';
          this.MinisterFilePath = '';
          this.MinisterFile_Dis_FileName = '';
        }
        if (this.State == 1) {
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

  async SaveMinisterOfflineFile() {
    try {
      if (this.MinisterFile == '') {
        this.toastr.warning('please upload a file');
        return;
      }
      this.loaderService.requestStarted();
      await this.applyNocParameterService.SaveApplyNocMinisterFile(this.SelectedApplyNOCIDForFile, this.MinisterFile).then(async (data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.MinisterFile = '';
          this.MinisterFilePath = '';
          this.MinisterFile_Dis_FileName = '';
          this.modalService.dismissAll('After Success');
          await this.GetNodalOfficerApplyNOCApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
        }
        if (this.State == 1) {
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


  async Forwardtoesign(ApplyNOCID: number) {
   
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      if (confirm("Are you sure you want to forward to esign this application?")) {
        await this.applyNOCApplicationService.ForwardToEsignDCE(ApplyNOCID, this.sSOLoginDataModel.UserID)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (!this.State) {
              this.toastr.success(this.SuccessMessage);
              await this.GetNodalOfficerApplyNOCApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
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

