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
import { AgricultureDocumentScrutinyService } from '../../../Services/AgricultureDocumentScrutiny/agriculture-document-scrutiny.service';
import { EnumCheckListType_Agri, EnumCommitteActionType, EnumCommitteType, EnumOfficerActionType } from '../../../Common/enum-noc';
import { ApplicationCommitteeMemberdataModel, PostApplicationCommitteeMemberdataModel } from '../../../Models/ApplicationCommitteeMemberdataModel';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';

@Component({
  selector: 'app-agri-pri-verification-done-list',
  templateUrl: './agri-pri-verification-done-list.component.html',
  styleUrls: ['./agri-pri-verification-done-list.component.css']
})
export class AgriPriVerificationDoneListComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public ApplicationTrailList: any = [];
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplyNocDetails: any = [];
  public request: CommiteeInspection_RNCCheckList_DataModel[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public ActionID: any = 0;
  public ActionName: string = '';
  public IsRemarksReject: boolean = false;
  public isRemarkValid: boolean = false;
  public isActionTypeValid: boolean = false;
  public CheckFinalRemark: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public CheckListData: any[] = [];
  public FinalCheckListData: any[] = [];
  public FinalRemark: string = '';
  public selectedApplyNOCID: number = 0;

  public QueryStringStatus: any = '';
  public IsDisabled: boolean = true;
  public IsPreDisabled: boolean = true;
  public IsBtnShowHide: boolean = true;

  public CommitteType: string = '';
  public IsCommitteType: boolean = false;
  CommitteeMemberDetails!: FormGroup;
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)

  public All_U_Select: boolean = false;
  public PVApplicationDetailsList: any[] = [];
  public PVCommitteeList: any[] = [];
  public ApplicationNo: string = '';
  public isSubmitted_MemberDetails: boolean = false;
  AadhaarNo: string = '';
  request_CommitteeMemberDataModel = new ApplicationCommitteeMemberdataModel();
  request_MemberList = new PostApplicationCommitteeMemberdataModel();
  sSOVerifyDataModel = new SSOLoginDataModel();

  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;

  constructor(private sSOLoginService: SSOLoginService,private agricultureDocumentScrutinyService: AgricultureDocumentScrutinyService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private committeeMasterService: CommitteeMasterService,
    private aadharServiceDetails: AadharServiceDetails
  ) { }

  async ngOnInit() {

    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetPreVerificationDoneList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);

    if (this.sSOLoginDataModel.RoleID == 29) {
      this.CommitteType = EnumCommitteType.Post;
      this.IsCommitteType = true;
    }

    if (this.QueryStringStatus == 'Pending') {
      this.IsPreDisabled = false;
      this.IsBtnShowHide = true;
      this.ActionID = 0;
    }
    else if (this.QueryStringStatus == 'Completed') {
      this.IsPreDisabled = true;
      this.IsBtnShowHide = false;
      this.ActionID = 1;
    }
    else if (this.QueryStringStatus == 'Rejected') {
      this.IsPreDisabled = true;
      this.IsBtnShowHide = false;
      this.ActionID = 2;
    }

    this.CommitteeMemberDetails = this.formBuilder.group(
      {
        txtCMNameOfPerson: ['', Validators.required],
        txtCMMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtSSOID: ['', Validators.required]
      })
  }
  get form_CommitteeMember() { return this.CommitteeMemberDetails.controls; }

  async GetPreVerificationDoneList(SSOID: string, UserID: number, RoleID: number, DepartmentID: number, QueryStringStatus: string) {
    try {
      this.loaderService.requestStarted();
      await this.agricultureDocumentScrutinyService.GetPreVerificationDoneList(SSOID, UserID, RoleID, DepartmentID, QueryStringStatus)
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

  async OpenActionPopUP(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.selectedApplyNOCID = ApplyNOCID;
    this.GetRNCCheckListByTypeDepartment(this.selectedApplyNOCID);
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

  async GetRNCCheckListByTypeDepartment(ApplyNOCID: number) {
    try {
      this.CheckListData = [];
      this.FinalRemark = '';
      if (this.QueryStringStatus == 'Pending') {
        this.ActionID = 0;
      }

      this.CheckFinalRemark = '';
      this.isRemarkValid = false;
      this.isActionTypeValid = false;
      this.IsRemarksReject = false;
      this.ActionName = '';
      this.loaderService.requestStarted();
      await this.agricultureDocumentScrutinyService.GetPreVerificationchecklistDetails(EnumCheckListType_Agri.DSPV.toString(), this.sSOLoginDataModel.DepartmentID, ApplyNOCID, this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckListData = data['Data'];
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

  async OnChangeCurrentAction(ActionID: any) {
    if (ActionID == 2 || ActionID == '2') {
      this.IsRemarksReject = true;
    }
    else {
      this.IsRemarksReject = false;
    }
  }
  async SubmitPhysicalVerification() {

    this.request = [];
    this.isRemarkValid = false;
    this.isActionTypeValid = false;
    this.ActionName = '';
    try {

      if (this.ActionID == 0) {
        this.isActionTypeValid = true;
        return;
      }
      else {
        if (this.ActionID == 2) {
          this.ActionName = EnumOfficerActionType.PreVeriRejected.toString();
          if (this.CheckFinalRemark == '' || this.CheckFinalRemark == null) {
            this.isRemarkValid = true;
            return;
          }
        }
        else {
          this.ActionName = EnumOfficerActionType.PreVeriApproved.toString();
        }
      }
      this.loaderService.requestStarted();
      if (this.ActionName != '') {
        await this.agricultureDocumentScrutinyService.FinalSubmitPreVerification(this.selectedApplyNOCID, this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.UserID, this.ActionName)
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
      else
        this.toastr.warning("Select Pre Verification Application Action")
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

  async ForwardToInspectionCommitee(ApplyNOCID: number) {

    this.ActionName = '';
    try {
      this.ActionName = EnumCommitteActionType.FTPIC.toString();
      if (this.ActionName != '') {
        if (confirm("Are you sure you want to Forward this Aplication to Physical Insepction Commitee ?")) {
          this.loaderService.requestStarted();
          await this.agricultureDocumentScrutinyService.FinalSubmitPreVerification(ApplyNOCID, this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.UserID, this.ActionName)
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
      }
      else
        this.toastr.warning("Select Pre Verification Application Action")
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

  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string, Status: string) {
      if (this.sSOLoginDataModel.RoleID == 29)
        this.routers.navigate(['/agricultureappnocpreview' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString()))]);
      else
        this.routers.navigate(['/Previewbynodalofficer' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString()))]);
    }


    //if (DepartmentID = 1) {
    //  window.open('/Previewbynodalofficer' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())), "_blank");
    //}
 

  /*  Commitee member function*/
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
  async GetApplicationCommitteeList(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList_AH(ApplyNocApplicationID, this.CommitteType)
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
  async AddMemberDetail() {
    this.isSubmitted_MemberDetails = true;
    if (this.CommitteeMemberDetails.invalid) {
      return
    }
    //rest
    try {
      this.loaderService.requestStarted();
      this.AadhaarNo = '';
      var isValidate = this.request_MemberList.ApplicationCommitteeList.find(e => e.SSOID === this.request_CommitteeMemberDataModel.SSOID);
      if (!isValidate) {
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
            CommitteeType: this.CommitteType
          });
        }
        else {
          this.toastr.warning('SssoID Invalid')
        }
      }
      else {
        this.toastr.warning('This User Alaready Exists')
      }
      // reset
      this.request_CommitteeMemberDataModel.NameOfPerson = '';
      this.request_CommitteeMemberDataModel.MobileNumber = '';
      this.request_CommitteeMemberDataModel.SSOID = '';
      this.request_CommitteeMemberDataModel.IsPrimaryMember = false;
      this.isSubmitted_MemberDetails = false;
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  DelMemberDetail(item: any, index: any) {
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

  async VerifySSOID(SSOID: any) {
    await this.CheckMappingSSOID(SSOID);
    if (this.sSOVerifyDataModel != null && SSOID.toLowerCase() == this.sSOVerifyDataModel.SSOID.toLowerCase()) {
      let d = new AadharServiceDataModel();
      d.AadharID = this.sSOVerifyDataModel.AadhaarId;
      await this.GetAadharByVID(d);
      this.SsoValidationMessage = 'd';
      this.SsoSuccessMessage = 'SSO Id Verified Successfully';
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
          //console.log(this.sSOVerifyDataModel);
        }, (error: any) => console.error(error));
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

    let ifPrimaryExits = this.request_MemberList.ApplicationCommitteeList.find(f => f.IsPrimaryMember == true);
    if (ifPrimaryExits?.IsPrimaryMember == undefined) {
      this.toastr.error("Atleast one primary member required");
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    this.request_MemberList.ApplyNocApplicationID = this.SelectedApplyNOCID;
    this.request_MemberList.UserID = this.sSOLoginDataModel.UserID;
    console.log(this.request_MemberList);
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.committeeMasterService.SaveApplicationCommitteeData_Agri(this.request_MemberList)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.modalService.dismissAll('After Success');
            this.GetPreVerificationDoneList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);

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
  async GetApplyNOCApplicationListByRole(RoleId: number, UserID: number) {
    try {
      this.loaderService.requestStarted();
      await this.agricultureDocumentScrutinyService.GetNOCApplicationList(this.CommitteType, this.sSOLoginDataModel.DepartmentID, UserID, RoleId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyNocDetails = data['Data'];
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


  MaxLengthValidation_KeyPress(event: any, length: number): boolean {
    if (event.target.value.length == length) {
      return false;
    }
    return true;
  }

  SetPrimaryMember(item: any, index: any) {
    let oldArr = this.request_MemberList.ApplicationCommitteeList;
    let newArr = oldArr.map(obj => ({ ...obj, ['IsPrimaryMember']: false }));
    newArr[index].IsPrimaryMember = true;
    this.request_MemberList.ApplicationCommitteeList = newArr;
  }

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
}
