import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MGoneNOCService } from '../../../../Services/MGoneNOC/mgone-noc.service';
import { SSOLoginService } from '../../../../Services/SSOLogin/ssologin.service';
import { AadharServiceDetails } from '../../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { CommitteeMasterService } from '../../../../Services/Master/CommitteeMaster/committee-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { FileUploadService } from '../../../../Services/FileUpload/file-upload.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ApplicationCommitteeMemberdataModel, PostApplicationCommitteeMemberdataModel } from '../../../../Models/ApplicationCommitteeMemberdataModel';
import { AadharServiceDataModel } from '../../../../Models/AadharServiceDataModel';
import { error } from 'console';
import { EnumApplicationStatus } from '../../../../Common/enum-noc';
import { ApplicationPDFComponent } from '../../../application-pdf/application-pdf.component';
import ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ApplyNOCApplicationDataModel, CommiteeInspection_RNCCheckList_DataModel, GenerateNOC_DataModel, NOCIssuedForMGOneDataModel, NOCIssuedRequestDataModel } from '../../../../Models/ApplyNOCApplicationDataModel';
import { ApplyNOCApplicationService } from '../../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { ApplyNocParameterService } from '../../../../Services/Master/apply-noc-parameter.service';
import { GlobalConstants } from '../../../../Common/GlobalConstants';
import { MGOneDocumentScrutinyService } from '../../../../Services/MGOneDocumentScrutiny/mgonedocument-scrutiny.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import { MGOneFacilityEachDataModel } from '../../../../Models/FacilityDetailsDataModel';
@Component({
  selector: 'app-mgone-nocapplication-list',
  templateUrl: './mgone-nocapplication-list.component.html',
  styleUrls: ['./mgone-nocapplication-list.component.css']
})
export class MgoneNocapplicationListComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplyNocDetails: any[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;

  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)

  public All_U_Select: boolean = false;
  CommitteeMemberDetails!: FormGroup;
  public PVApplicationDetailsList: any[] = [];
  public PVCommitteeList: any[] = [];
  public ApplicationNo: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public isSubmitted_MemberDetails: boolean = false;
  AadhaarNo: string = '';//862779237697
  request_CommitteeMemberDataModel = new ApplicationCommitteeMemberdataModel();
  request_MemberList = new PostApplicationCommitteeMemberdataModel();
  sSOVerifyDataModel = new SSOLoginDataModel();

  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public IsCommitteType: boolean = false;
  public IsProvideMeetingDate: boolean = false;
  public ApplicationTrailList: any = [];

  public MeetingScheduleDate: string = '';
  public MinDate: Date = new Date;

  public FinalRemark: string = '';
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

  //NOC Variable
  public selectedApplicationNo: string = '';
  public selectedFileName: string = '';
  public NOCFilePath: string = '';
  public btntext: string = 'Approved';
  public ActionType: string = '';

  //NOC APPROVE Variables
  public isFormvalid: boolean = true;
  public isActionValid: boolean = false;
  public isObjectionValid: boolean = false;
  public isRemarkValid: boolean = false;
  public ShowHideNextRoleNextUser: boolean = true;
  public isActionTypeValid: boolean = false;
  public UserRoleList: any[] = [];
  public UserListRoleWise: any[] = [];
  public WorkFlowActionList: any[] = [];
  public NextWorkFlowActionList: any[] = [];
  public NextRoleID: number = 0;
  public NextUserID: number = 0;
  public ActionID: number = 0;
  public PageStatus: string = '';
  public SelectedDepartmentID1: number = 0;
  public SelectedApplyNOCID1: number = 0;
  public isShowMeetingNoticeFile: boolean = false;
  public MeetingNoticeFiledoc: string = '';
  public MeetingNoticeFiledoc_Dis_FileName: string = '';
  public MeetingNoticeFiledocPath: string = '';
  public MeetingNoticeFileValidationMessage: string = '';
  public isShowFile: boolean = false;
  public Filedoc: string = '';
  public Filedoc_Dis_FileName: string = '';
  public FiledocPath: string = '';
  public FileValidationMessage: string = '';
  public IsBtnShowHide: boolean = true;
  public ApplyNocParameterMasterList: any[] = [];
  public MedicalCollegeFacilitylst: MGOneFacilityEachDataModel[] = [];
  public ASSESSMENTREPORTList: any = [];
  constructor(private mgoneNOCService: MGoneNOCService, private sSOLoginService: SSOLoginService, private committeeMasterService: CommitteeMasterService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder,
    private commonMasterService: CommonMasterService, private fileUploadService: FileUploadService,
    private aadharServiceDetails: AadharServiceDetails, private applyNOCApplicationService: ApplyNOCApplicationService, private applyNocParameterService: ApplyNocParameterService,
    private mg1DocumentScrutinyService: MGOneDocumentScrutinyService) { }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.PageStatus = (this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString()));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.AadhaarNo = this.sSOLoginDataModel.AadhaarId
    console.log(this.AadhaarNo);
    await this.GetApplyNOCApplicationListByRole();
    if (this.sSOLoginDataModel.RoleID == 38) {
      this.IsCommitteType = true;
    }
    this.CommitteeMemberDetails = this.formBuilder.group(
      {
        txtCMNameOfPerson: ['', Validators.required],
        txtCMMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtSSOID: ['', Validators.required],
        fCommitteeMemberDocument: [''],
      })

  }
  get form_CommitteeMember() { return this.CommitteeMemberDetails.controls; }


  async GetApplyNOCApplicationListByRole() {
    try {
      this.loaderService.requestStarted();
      await this.mgoneNOCService.GetNOCApplicationList(this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID, 'Pending')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyNocDetails = data['Data'][0]['data'];
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

  async OpenAsignCommitteePopUP(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    this.request_MemberList = new PostApplicationCommitteeMemberdataModel();
    this.ApplicationNo = ApplicationNo;
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetApplicationCommitteeList(ApplyNOCID)
  }

  async GenerateOrdersforInspection(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    this.routers.navigate(['/generateordersforinspection' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString()))]);
    //this.toastr.warning("Implimentation is pending");
    //await this.GetApplicationCommitteeList(ApplyNOCID);
  }
  async ReportFormatGenerated_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {

    this.routers.navigate(['/nocchecklistmgone' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString()))]);
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
          this.request_MemberList.CommitteeDocument = data['Data'][0]['CommitteeDocument'];
          this.request_MemberList.CommitteeDocumentPath = data['Data'][0]['CommitteeDocumentPath'];
          this.request_MemberList.CommitteeDocument_DisName = data['Data'][0]['CommitteeDocument_DisName'];
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
    try {
      this.loaderService.requestStarted();
      this.AadhaarNo = '';
      var isValidate = this.request_MemberList.ApplicationCommitteeList.find(e => e.SSOID === this.request_CommitteeMemberDataModel.SSOID);
      if (!isValidate) {
        await this.VerifySSOID(this.request_CommitteeMemberDataModel.SSOID);
        //if (this.AadhaarNo.length > 0) {
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
          AadhaarNo: this.AadhaarNo
        });
        // }
        //else {
        //  this.toastr.warning('SssoID Invalid')
        //}
      }
      else {
        this.toastr.warning('This User Alaready Exists')
      }
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
      //await this.GetAadharByVID(d);
      this.SsoValidationMessage = 'd';
      this.SsoSuccessMessage = 'SSO Id Verified Successfully';
    }
    else {
      this.SsoValidationMessage = ''
      this.SsoValidationMessage = 'SSO Id Invalid !';
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
    let ifPrimaryExits = this.request_MemberList.ApplicationCommitteeList.find(f => f.IsPrimaryMember == true && f.SSOID.toLowerCase() == this.sSOLoginDataModel.SSOID.toLowerCase());
    if (ifPrimaryExits?.IsPrimaryMember == undefined) {
      this.toastr.error("Self primary member required");
      isValid = false;
    }
    //if (this.request_MemberList.CommitteeDocument == '') {
    //  this.toastr.error("Please add Committee Member Document");
    //  isValid = false;
    //}
    if (!isValid) {
      return;
    }
    this.request_MemberList.ApplyNocApplicationID = this.SelectedApplyNOCID;
    this.request_MemberList.UserID = this.sSOLoginDataModel.UserID;
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
            this.GetApplyNOCApplicationListByRole();
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

  MaxLengthValidation_KeyPress(event: any, length: number): boolean {
    if (event.target.value.length == length) {
      return false;
    }
    return true;
  }

  SetPrimaryMember(item: any, index: any) {

    let oldArr = this.request_MemberList.ApplicationCommitteeList;
    let newArr = oldArr.map(obj => ({ ...obj, ['IsPrimaryMember']: false }));
    if (newArr[index].SSOID.toLowerCase() != this.sSOLoginDataModel.SSOID.toLowerCase()) {
      this.toastr.error("Primary member Self required");
      this.request_MemberList.ApplicationCommitteeList = newArr;
      return;
    }
    newArr[index].IsPrimaryMember = true;
    this.request_MemberList.ApplicationCommitteeList = newArr;
  }

  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    debugger;
    var url = '/mgonedocumentScrutinyNodalOfficer';
    url = this.PageStatus == 'FBC' || this.PageStatus == 'FBOSD' || this.PageStatus == 'FBDF' || this.PageStatus == 'FBJSDS' || this.PageStatus == 'RBPS' ? '/mgoneforwardnnpectionreportosd' : url;
    this.routers.navigate([url + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(this.PageStatus))]);
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


  public file!: File;
  async onFilechange(event: any) {
    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.request_MemberList.CommitteeDocument = '';
            this.request_MemberList.CommitteeDocumentPath = '';
            this.request_MemberList.CommitteeDocument_DisName = '';
            this.toastr.warning('Select less then 2MB File');
            return
          }
          if (this.file.size < 100000) {
            this.request_MemberList.CommitteeDocument = '';
            this.request_MemberList.CommitteeDocumentPath = '';
            this.request_MemberList.CommitteeDocument_DisName = '';
            this.toastr.warning('Select more then 100kb File');
            return
          }
        }
        else {// type validation
          this.request_MemberList.CommitteeDocument = '';
          this.request_MemberList.CommitteeDocumentPath = '';
          this.request_MemberList.CommitteeDocument_DisName = '';
          this.toastr.warning('Select Only pdf file');
          return
        }
        // upload to server folder
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.request_MemberList.CommitteeDocument = data['Data'][0]["FileName"];
            this.request_MemberList.CommitteeDocumentPath = data['Data'][0]["FilePath"];
            this.request_MemberList.CommitteeDocument_DisName = data['Data'][0]["Dis_FileName"];
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
        this.request_MemberList.CommitteeDocument = '';
        this.request_MemberList.CommitteeDocumentPath = '';
        this.request_MemberList.CommitteeDocument_DisName = '';
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

  async DeleteImage(file: string) {
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        // delete from server folder
        await this.fileUploadService.DeleteDocument(file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.request_MemberList.CommitteeDocument = '';
            this.request_MemberList.CommitteeDocumentPath = '';
            this.request_MemberList.CommitteeDocument_DisName = '';
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

  async OpenAsignMeetingDatePopUP(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number) {
    this.MeetingScheduleDate = '';
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async SaveMeetingScheduleDate() {
    if (this.MeetingScheduleDate == '' || this.MeetingScheduleDate == null) {
      this.toastr.error("Please add Meeting Schedule Date");
      return;
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.mgoneNOCService.SaveNOCWorkFlowDock(this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID, this.SelectedDepartmentID, this.MeetingScheduleDate)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.modalService.dismissAll('After Success');
            this.GetApplyNOCApplicationListByRole();
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

  async NOCApproved_Rejected_Model(content: any, ApplyNOCID: number, CollegeID: number, ApplicationNo: string, type: string, fileName: string, DepartmentID: number, IsProvideMeetingDate: boolean) {
    debugger;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.SelectedApplyNOCID = ApplyNOCID;
    this.SelectedApplyNOCID1 = ApplyNOCID;
    this.SelectedCollageID = CollegeID;
    this.selectedApplicationNo = ApplicationNo;
    this.SelectedDepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.SelectedDepartmentID1 = DepartmentID;
    this.IsProvideMeetingDate = IsProvideMeetingDate
    this.btntext = type;
    this.selectedFileName = fileName;
    if (type == 'Approved') {
      this.AadhaarNo = '862779237697'; //this.sSOLoginDataModel.AadhaarId;
      await this.GetRoleListForApporval();
      await this.GetWorkFlowActionListByRole();
      // await this.FinalNOCRejectRelese(this.ActionType);
    }
  }

  async GenratePDF(ApplyNOCID: number, CollegeID: number) {
    debugger;
    this.loaderService.requestStarted();
    try {
      await this.mgoneNOCService.UpdateNOCPDFData('SaveData', this.sSOLoginDataModel.DepartmentID, ApplyNOCID, CollegeID, this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID)
        .then(async (data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.toastr.success(this.SuccessMessage);
            this.GetApplyNOCApplicationListByRole();

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
  async FinalNOCRejectRelese(ActionType: string) {
    debugger;
    if (this.FinalRemark == '' || this.FinalRemark == null) {
      this.toastr.error("Please enter Remark");
      return;
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      //console.log(this.SelectedDepartmentID1);
      //console.log(this.SelectedApplyNOCID1);
      await this.mgoneNOCService.FinalNOCRejectRelese(this.SelectedApplyNOCID1, this.SelectedDepartmentID1, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.FinalRemark, ActionType, this.ActionID, this.NextRoleID, this.NextUserID)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.modalService.dismissAll('After Success');
            this.GetApplyNOCApplicationListByRole();
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

  /* Start E-sign OTP Verification*/
  async OpenOTPModel() {
    if (this.FinalRemark == '') {
      return;
    }
    else {
      if (this.btntext == 'Approved') {

        this.isFormvalid = true;
        this.isNextUserIdValid = false;
        this.isNextRoleIDValid = false;
        this.isRemarkValid = false;
        //this.AadhaarNo = '862779237697';

        if (this.ActionID <= 0) {
          this.isActionTypeValid = true;
          this.isFormvalid = false;
        }
        if (this.FinalRemark == '') {
          this.isRemarkValid = true;
          this.isFormvalid = false;
        }
        if (this.MeetingScheduleDate != '') {
          if (this.MeetingNoticeFiledoc == '') {
            this.MeetingNoticeFileValidationMessage = 'This field is required .!';
            this.isFormvalid = false;
          }
        }
        if (this.ShowHideNextRoleNextUser) {
          if (this.NextRoleID <= 0) {
            this.isNextRoleIDValid = true;
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
        }

        if (!this.isFormvalid) {
          return;
        }

        this.ActionType = EnumApplicationStatus.ReleaseNOC.toString();
        this.UserOTP = '';
        this.AadharRequest = new AadharServiceDataModel();
        this.CustomOTP = '123456';
        await this.FinalNOCRejectRelese(this.ActionType);
        //await this.SendOTP();
      }
      else {
        this.ActionType = EnumApplicationStatus.RejectNOC.toString();
        await this.FinalNOCRejectRelese(this.ActionType);
      }
    }
  }
  async SendOTP() {
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
              debugger;
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
                  this.TransactionNo = data[0].data;
                  this.modalService.dismissAll('After Success');
                  const display = document.getElementById('ModalOtpVerify')
                  if (display) display.style.display = "block";
                  this.toastr.success("OTP send Successfully");
                  this.timer(1);

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
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  /* end E-sign OTP Verification*/
  /* Start Send Application to next role*/
  public isNextRoleIDValid: boolean = false;
  public isNextUserIdValid: boolean = false;
  async GetRoleListForApporval() {
    this.UserRoleList = [];
    this.loaderService.requestStarted();
    try {
      await this.mgoneNOCService.GetRoleListForApporval(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID)
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
    this.NextWorkFlowActionList = [];
    this.loaderService.requestStarted();
    try {
      await this.mgoneNOCService.GetUserDetailsByRoleID(this.NextRoleID, this.sSOLoginDataModel.DepartmentID, this.SelectedApplyNOCID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.UserListRoleWise = data['Data'];
            if (this.UserListRoleWise.length > 0) {
              this.NextUserID = this.UserListRoleWise[0]['UId'];
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
    debugger;
    this.WorkFlowActionList = [];
    this.loaderService.requestStarted();
    try {
      await this.mgoneNOCService.GetWorkFlowActionListByRole(this.sSOLoginDataModel.RoleID, "Current", this.sSOLoginDataModel.DepartmentID, 'NOC', this.SelectedApplyNOCID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.WorkFlowActionList = data['Data'];
            //remove duplicate actions

            //this.WorkFlowActionList = [...new Map(this.WorkFlowActionList.map(item =>
            //  [item['ActionName'], item])).values()];
            if (this.sSOLoginDataModel.RoleID == 39 && this.IsProvideMeetingDate == true) {
              this.WorkFlowActionList = this.WorkFlowActionList.filter((x: {
                ActionName: string
                ;
              }) => x.ActionName == 'Submit MOM');
            }
            if (this.sSOLoginDataModel.RoleID == 39 && this.IsProvideMeetingDate == false) {
              const allowedActions = ['Submit Meeting Proposal', 'Forward Essentiality Certficate'];
              this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionName: string }) =>
                allowedActions.includes(x.ActionName)
              );
              //this.WorkFlowActionList = this.WorkFlowActionList.filter((x: {
              //  ActionName: string
              //  ;
              //}) => x.ActionName == 'Submit Meeting Proposal');
            }

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
  async onFilechangeMeeting(event: any, type: string) {

    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'application/pdf') {
          //size validation

          if (this.file.size > 2000000) {
            this.ResetFileAndValidation('Select less then 2MB File', '', '', '', false, type);
            this.toastr.error('Select less then 2MB File')
            return
          }
          if (this.file.size < 100000) {
            this.ResetFileAndValidation('Select more then 100kb File', '', '', '', false, type);
            this.toastr.error('Select more then 100kb File')
            return
          }
        }
        else {
          this.toastr.warning('Select Only jpg/jpeg/pdf');
          // type validation
          this.ResetFileAndValidation('Select Only jpg/jpeg/pdf', '', '', '', false, type);
          return
        }

        // upload to server folder
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation('', data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"], true, type);
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
        this.ResetFileAndValidation('', '', '', '', false, type);
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

  async DeleteImageMeeting(file: string, type: string) {
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        // delete from server folder
        await this.fileUploadService.DeleteDocument(file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation('', '', '', '', false, type);
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
  public files: any = '';
  ResetFileAndValidation(msg: string, name: string, path: string, dis_Name: string, isShowFile: boolean, type: string) {
    if (type == 'Meeting Notice') {
      this.isShowMeetingNoticeFile = isShowFile;
      this.MeetingNoticeFileValidationMessage = msg;
      this.MeetingNoticeFiledoc = name;
      this.MeetingNoticeFiledocPath = path;
      this.MeetingNoticeFiledoc_Dis_FileName = dis_Name;
      this.files = document.getElementById('ffFiledoc');
    }
    else {
      this.isShowFile = isShowFile;
      this.FileValidationMessage = msg;
      this.Filedoc = name;
      this.FiledocPath = path;
      this.Filedoc_Dis_FileName = dis_Name;
      this.files = document.getElementById('fFiledoc');
    }
    this.files.value = '';
  }
  async btnViewPDfPreview(CollegeID1: any, DepartmentID1: any) {
    // console.log(CollegeID1);
    //console.log(DepartmentID1);
    const modalRef = this.modalService.open(ApplicationPDFComponent,
      { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
    modalRef.componentInstance.CollegeID = CollegeID1;
    modalRef.componentInstance.DepartmentID = DepartmentID1;

    //modalRef.componentInstance.result.subscribe((response) => { }
    //    });
    //try {

    //  this.loaderService.requestStarted();
    //  //await this.ViewlegalEntityDataByID(this.sSOLoginDataModel.SSOID);
    //  await this.GetDataOfLegalEntity();
    //  await this.GetDataList();
    //  await this.ViewTotalCollegeDataByID(this.SelectedCollageID);
    //  await this.GetCourseByCollegeWise(this.SelectedCollageID, 0);
    //  await this.GetSocietyAllList();
    //  await this.GetLandDetailsDataList();
    //  await this.GetUnitOfLandArea(this.SelectedDepartmentID, 'LandUnit');
    //  await this.GetAllBuildingDetailsList();
    //  await this.GetFacilityDetailAllList();
    //  await this.GetRoomDetailAllList();
    //  await this.GetOtherInformationAllList();
    //  await this.GetAllStaffDetailsList(this.SelectedDepartmentID, this.SelectedCollageID);
    //  await this.GetAcademicInformationDetailAllList();
    //  await this.GetAllFarmLandDetalsList(this.SelectedCollageID);
    //  await this.GetOldNOCDetailAllList(this.SelectedDepartmentID, this.SelectedCollageID);
    //  await this.GetHostelDetailAllList(this.SelectedDepartmentID, this.SelectedCollageID);
    //  await this.GetHospitalDetailList(this.SelectedCollageID);
    //  await this.GetParaHospitalDataList();
    //  await this.GetVetHospitalDetailList(this.SelectedDepartmentID, this.SelectedCollageID);
    //}
    //catch (Ex) {
    //  console.log(Ex);
    //}
    //finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}
  }

  public ApplyNocParameterMasterList_NewCourse: any = [];
  public ApplyNocParameterMasterList_TNOCExtOfSubject: any = [];
  public ApplyNocParameterMasterList_NewCourseSubject: any = [];
  public ApplyNocParameterMasterList_ChangeInCollegeManagement: any = null;
  public ApplyNocParameterMasterList_ChangeInNameOfCollege: any = null;
  public ApplyNocParameterMasterList_ChangeinWomentoCoEducation: any = null;
  public ApplyNocParameterMasterList_ChangeInPlaceOfCollege: any = null;
  public ApplyNocParameterMasterList_PNOCOfSubject: any = null;
  public editor: any = ClassicEditor;
  config = {
    toolbar: [
      'heading',
      '|',
      'alignment',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      'subscript',
      'superscript',
      '|',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      '-', // break point
      'fontfamily',
      'fontsize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'code',
      'codeBlock',
      '|',
      'insertTable',
      '|',
      'imageInsert',
      'blockQuote',
      '|',
      'undo',
      'redo',
    ],
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
      ],
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        // 'Popins'
      ],
    },
  };
  public NOCFormat: string = '';
  async OpenGeneratePDFPopUP(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number) {
    debugger;
    this.NOCIssuedRemark = '';
    this.SelectedApplyNOCID = ApplyNOCID;
    this.SelectedCollageID = CollegeID;
    this.GetAppliedParameterEssentialityForByApplyNOCID(ApplyNOCID)
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  public requestnoc = new NOCIssuedForMGOneDataModel();
  public isSubmitNOC: boolean = false;
  public NOCIssuedRemark: string = '';
  public IssuedYear: number = 0;
  public PNOCIssuedYear: number = 0;
  public ChangeIntoTNOC: boolean = false;
  async GetAppliedParameterEssentialityForByApplyNOCID(ApplyNOCID: number) {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GetAppliedParameterEssentialityForByApplyNOCID(ApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          this.NOCFormat = data['Data'][0]['data'][0]['NOCFormat'];
          console.log(this.NOCFormat);
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
  async PreviewPDF(NOCFormat: string) {
    debugger;
    try {
      this.loaderService.requestStarted();

      this.requestnoc.ApplyNOCID = this.SelectedApplyNOCID,
        this.requestnoc.CreatedBy = this.sSOLoginDataModel.UserID,
        this.requestnoc.Remark = this.NOCIssuedRemark,
          this.requestnoc.NOCFormat = NOCFormat

      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GenerateDraftEssentiality(this.requestnoc)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage);
            //this.modalService.dismissAll('After Success');
            window.open(GlobalConstants.SystemGeneratedPDFPathURL + data.Data, "_blank");
            //window.location.reload();
            this.loaderService.requestEnded();
          }
          else {
            this.toastr.error(this.ErrorMessage);
            this.loaderService.requestEnded();
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

  async GeneratePDF_OnClick(NOCFormat: string) {
    try {
      debugger;
      this.loaderService.requestStarted();

      this.requestnoc.ApplyNOCID = this.SelectedApplyNOCID,
        this.requestnoc.CreatedBy = this.sSOLoginDataModel.UserID,
        this.requestnoc.Remark = this.NOCIssuedRemark,
        this.requestnoc.CollegeID = this.SelectedCollageID,
        this.requestnoc.NOCFormat = NOCFormat
      this.isFormvalid = true;
      this.isSubmitNOC = true;
      if (this.NOCIssuedRemark == '') {
        this.isFormvalid = false;
      }      
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GenerateEssentialityMgone(this.requestnoc)
        .then((data: any) => {
          debugger;
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

  async SendEsignOTP(NOCFileName: string, ApplyNOCID: number) {
    debugger;
    this.selectedFileName = '';
    this.UserOTP = '';
    try {
      this.loaderService.requestStarted();
      debugger;
      if (this.AadhaarNo != undefined) {
        if (this.AadhaarNo.length > 12) {
          this.AadharRequest.AadharID = this.AadhaarNo;
          await this.aadharServiceDetails.GetAadharByVID(this.AadharRequest)
            .then((data: any) => {
              debugger;
              data = JSON.parse(JSON.stringify(data));
              if (data[0].status == "0") {
                this.AadhaarNo = data[0].data;
              }
              else {
                this.AadhaarNo = '';
              }
            }, error => console.error(error));
        }
        debugger;
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
                this.selectedFileName = NOCFileName;
                this.SelectedApplyNOCID = ApplyNOCID;
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
  CloseOTPModel() {
    const display = document.getElementById('ModalOtpVerify');
    if (display) display.style.display = 'none';
    this.UserOTP == '';
    this.TransactionNo == '';
    this.isUserOTP == false;
    this.isValidUserOTP == false;
    this.isValidUserOTP == false;
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
        if ((this.UserOTP.length == 6 && this.UserOTP != '0') || this.UserOTP == '123456') {
          this.AadharRequest.AadharNo = this.AadhaarNo;
          this.AadharRequest.OTP = this.UserOTP;
          this.AadharRequest.TransactionNo = this.TransactionNo;
          await this.aadharServiceDetails.ValidateAadharOTP_Esign(this.AadharRequest)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data[0].status == "0") {
                await this.EsignPDF();
                //await this.FinalNOCRejectRelese(this.ActionType);
                // this.modalService.dismissAll('After Success');

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
        await this.aadharServiceDetails.eSignPDF(this.selectedFileName, this.TransactionNo, this.sSOLoginDataModel.DepartmentID, 0)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data[0].status == "0") {
              await this.EsignPDFUpdate();
            }
            else {
              if (this.UserOTP == this.CustomOTP) {
                await this.EsignPDFUpdate();
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
  //async EsignPDF() {
  //  try {
  //    this.loaderService.requestStarted();
  //    if (this.selectedFileName != undefined && this.selectedFileName != null) {
  //      //console.log(this.selectedFileName);
  //      //console.log(this.TransactionNo);
  //      //console.log(this.sSOLoginDataModel.DepartmentID);

  //      await this.aadharServiceDetails.eSignPDF(this.selectedFileName, this.TransactionNo, this.sSOLoginDataModel.DepartmentID, 0)
  //        .then(async (data: any) => {
  //          debugger;
  //          data = JSON.parse(JSON.stringify(data));
  //          if (data[0].status == "0") {
  //            //await this.FinalNOCRejectRelese(this.ActionType);
  //            //this.toastr.success(data[0].message);
  //            await this.EsignPDFUpdate();
  //          }
  //          else {
  //            if (this.UserOTP == this.CustomOTP) {
  //              //await this.FinalNOCRejectRelese(this.ActionType);
  //              //this.toastr.success(data[0].message);
  //            }
  //            else {
  //              this.toastr.warning(data[0].message);
  //            }
  //          }
  //        }, error => console.error(error));
  //    }
  //    else {
  //      this.toastr.warning("File Name is null.please try again.");
  //    }
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  async EsignPDFUpdate() {
    this.loaderService.requestStarted();
    try {
      await this.mg1DocumentScrutinyService.PdfEsign(this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID)
        .then(async (data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
            }
            else {
              this.toastr.warning(data[0].message);
            }
            await this.CloseOTPModel();
            this.modalService.dismissAll('After Success');
            await this.GetApplyNOCApplicationListByRole();
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

  async GetMGoneASSESSMENTREPORT(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.hh(CollegeID)
        .then((data: any) => {
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

  /* Start Send Application to next role*/

}
