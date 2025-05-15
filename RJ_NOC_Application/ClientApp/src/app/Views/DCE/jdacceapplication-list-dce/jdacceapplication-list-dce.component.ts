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
import { ApplicationCommitteeMemberdataModel, PostApplicationCommitteeMemberdataModel } from '../../../Models/ApplicationCommitteeMemberdataModel';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { GlobalConstants } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-jdacceapplication-list-dce',
  templateUrl: './jdacceapplication-list-dce.component.html',
  styleUrls: ['./jdacceapplication-list-dce.component.css']
})
export class JDACCEApplicationListDCEComponent implements OnInit {
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

  constructor(private applyNocParameterService: ApplyNocParameterService, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private committeeMasterService: CommitteeMasterService, private decDocumentScrutinyService: DCEDocumentScrutinyService, private sSOLoginService: SSOLoginService, private aadharServiceDetails: AadharServiceDetails
  ) { }
  onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.AadhaarNo = this.sSOLoginDataModel.AadhaarId
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetNodalOfficerApplyNOCApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);

  }



  async GetNodalOfficerApplyNOCApplicationList(RoleId: number, UserID: number, Status: string) {
    try {
      this.loaderService.requestStarted();
      let ActionName = '';
      ActionName = Status == 'Completed' ? 'Approve' : Status == 'Rejected' ? '' : Status == 'Pending' ? 'Approve' : Status == 'Revert' ? 'Revert' : '';
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
    this.routers.navigate(['/checklistforcommissioner' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString()))]);
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
    this.ApplyNocParameterMasterList_ChangeinWomentoCoEducation = null;
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
  public PNOCIssuedYear: number = 0;
  public ChangeIntoTNOC: boolean = false;
  public ChangeIntoPNOC: boolean = false;
  async GeneratePDF_OnClick() {
    try {
      this.requestnoc = new NOCIssuedRequestDataModel();
      this.isFormvalid = true;
      this.isSubmitNOC = true;
      if (this.NOCIssuedRemark == '') {
        this.isFormvalid = false;
      }

      var CheckedCount = 0;
      await this.ApplyNocParameterMasterList.forEach((i: { IsChecked: boolean, ApplyNocParameterID: number, ApplyNocApplicationID: number, ParameterCode: string }) => {
        if (i.IsChecked) {
          CheckedCount++;
          this.requestnoc.AppliedNOCFor.push({
            ApplyNOCID: i.ApplyNocApplicationID,
            ParameterID: i.ApplyNocParameterID,
            CreatedBy: this.sSOLoginDataModel.UserID,
            Remark: this.NOCIssuedRemark,
            NoOfIssuedYear: i.ParameterCode == 'DEC_PNOCSubject' ? this.PNOCIssuedYear : this.IssuedYear,
            ChangeIntoTNOC: this.ChangeIntoTNOC,
            ChangeIntoPNOC: this.ChangeIntoPNOC,
            NOCFormat: i.ParameterCode == 'DEC_NewCourse' ? this.NewCourseNOCFormat : i.ParameterCode == 'DEC_TNOCExtOfSubject' && !this.ChangeIntoPNOC ? this.TNOCExtOfSubjectNOCFormat :
              i.ParameterCode == 'DEC_TNOCExtOfSubject' && this.ChangeIntoPNOC ? this.ChangeTNOCintoPNOCNOCFormat
            : i.ParameterCode == 'DEC_NewSubject' ? this.NewSubjectNOCFormat
              : i.ParameterCode == 'DEC_PNOCSubject' && !this.ChangeIntoTNOC ? this.PNOCOfSubjectNOCFormat : i.ParameterCode == 'DEC_PNOCSubject' && this.ChangeIntoTNOC ? this.ChangePNOCintoTNOCNOCFormat : i.ParameterCode == 'DEC_ChangeManagement' ? this.ApplyNocParameterMasterList_ChangeInCollegeManagement.NOCFormat : i.ParameterCode == 'DEC_ChangeName' ? this.ApplyNocParameterMasterList_ChangeInNameOfCollege.NOCFormat : i.ParameterCode == 'DEC_ChangePlace' ? this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.NOCFormat : i.ParameterCode == 'DEC_GilsToCoed' ? this.ApplyNocParameterMasterList_ChangeinWomentoCoEducation.NOCFormat : ''
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
        if (this.IssuedYear <= 0 && !this.ChangeIntoPNOC) {
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
        if (this.PNOCIssuedYear <= 0 && this.ChangeIntoTNOC) {
          this.isFormvalid = false;
          this.toastr.warning('Please select No Of Issued Year in TNOC Extension Of Subject');
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
              this.NewCourseNOCFormat = this.ApplyNocParameterMasterList.find((x: { ParameterCode: string }) => x.ParameterCode == 'DEC_NewCourse')?.NOCFormat;
            }
            else if (ParameterCode == 'DEC_TNOCExtOfSubject') {
              this.ApplyNocParameterMasterList_TNOCExtOfSubject = data['Data'];
              this.TNOCExtOfSubjectNOCFormat = this.ApplyNocParameterMasterList.find((x: { ParameterCode: string }) => x.ParameterCode == 'DEC_TNOCExtOfSubject')?.NOCFormat;
            }
            else if (ParameterCode == 'DEC_NewSubject') {
              this.ApplyNocParameterMasterList_NewCourseSubject = data['Data'];
              this.NewSubjectNOCFormat = this.ApplyNocParameterMasterList.find((x: { ParameterCode: string }) => x.ParameterCode == 'DEC_NewSubject')?.NOCFormat;
            }
            else if (ParameterCode == 'DEC_PNOCSubject') {

              this.ApplyNocParameterMasterList_PNOCOfSubject = data['Data'];
              this.PNOCOfSubjectNOCFormat = this.ApplyNocParameterMasterList.find((x: { ParameterCode: string }) => x.ParameterCode == 'DEC_PNOCSubject')?.NOCFormat;
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
  async ApplyNocFor_cbChange(ApplyNOCID: number, ParameterID: number, IsChecked: boolean, ParameterCode: string) {
    try {
      this.loaderService.requestStarted();
      // get
      if (IsChecked) {
        if (ParameterCode == 'DEC_NewCourse' || ParameterCode == 'DEC_TNOCExtOfSubject' || ParameterCode == 'DEC_NewSubject' || ParameterCode == 'DEC_PNOCSubject') {
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
                  this.ApplyNocParameterMasterList_ChangeInCollegeManagement.NOCFormat = this.ApplyNocParameterMasterList.find((x: { ParameterCode: string }) => x.ParameterCode == 'DEC_ChangeManagement')?.NOCFormat;
                }
                else if (ParameterCode == 'DEC_ChangeName') {
                  this.ApplyNocParameterMasterList_ChangeInNameOfCollege = data['Data']['ChangeInNameOfCollegeList'][0];
                  this.ApplyNocParameterMasterList_ChangeInNameOfCollege.NOCFormat = this.ApplyNocParameterMasterList.find((x: { ParameterCode: string }) => x.ParameterCode == 'DEC_ChangeName')?.NOCFormat;
                }
                else if (ParameterCode == 'DEC_ChangePlace') {
                  this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = data['Data']['ChangeInPlaceOfCollegeList'][0];
                  this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.NOCFormat = this.ApplyNocParameterMasterList.find((x: { ParameterCode: string }) => x.ParameterCode == 'DEC_ChangePlace')?.NOCFormat;
                }
                else if (ParameterCode == 'DEC_GilsToCoed') {
                  this.ApplyNocParameterMasterList_ChangeinWomentoCoEducation = data['Data']['ChangeInGirlstoCoedList'][0];
                  this.ApplyNocParameterMasterList_ChangeinWomentoCoEducation.NOCFormat = this.ApplyNocParameterMasterList.find((x: { ParameterCode: string }) => x.ParameterCode == 'DEC_GilsToCoed')?.NOCFormat;
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
                else if (ParameterCode == 'DEC_GilsToCoed') {
                  this.ApplyNocParameterMasterList_ChangeinWomentoCoEducation = null;
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
        else if (ParameterCode == 'DEC_GilsToCoed') {
          this.ApplyNocParameterMasterList_ChangeinWomentoCoEducation = null;
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



  public TNOCExtOfSubjectNOCFormat: string = '';
  public NewCourseNOCFormat: string = '';
  public NewSubjectNOCFormat: string = '';
  public PNOCOfSubjectNOCFormat: string = '';
  public ChangePNOCintoTNOCNOCFormat: string = '';
  public ChangeTNOCintoPNOCNOCFormat: string = '';
  async PreviewPDF(ParameterID: number, NOCFormat: string) {
    try {
      this.requestnoc = new NOCIssuedRequestDataModel();
      this.loaderService.requestStarted();
      this.requestnoc.AppliedNOCFor.push({
        ApplyNOCID: this.SelectedApplyNOCID,
        ParameterID: ParameterID,
        CreatedBy: this.sSOLoginDataModel.UserID,
        Remark: this.NOCIssuedRemark,
        NoOfIssuedYear: ParameterID == 10 && !this.ChangeIntoTNOC ? this.IssuedYear : this.PNOCIssuedYear,
        ChangeIntoTNOC: this.ChangeIntoTNOC,
        ChangeIntoPNOC: this.ChangeIntoPNOC,
        NOCFormat: NOCFormat
      });
      debugger;
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
        if (this.IssuedYear <= 0 && !this.ChangeIntoPNOC) {
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
        if (this.PNOCIssuedYear <= 0 && this.ChangeIntoTNOC) {
          this.isFormvalid = false;
          this.toastr.warning('Please select No Of Issued Year in TNOC Extension Of Subject');
          return;
        }
      }


      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GenerateDraftNOCFor_DCE(this.requestnoc)
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




  //async OnChangeTNOCFormat() {
  //  if (this.ChangeIntoTNOC) {
  //    this.GetTNOCFormat();
  //  }
  //  else {
  //    this.ChangePNOCintoTNOCNOCFormat = '';
  //  }
  //}

  async GetTNOCFormat(Type: string) {
    if (Type == 'PNOCintoTNOC') {
      this.ChangePNOCintoTNOCNOCFormat ='';
    }
    if (Type == 'TNOCintoPNOC') {
      this.ChangeTNOCintoPNOCNOCFormat = '';
    }
    const T = Type == 'PNOCintoTNOC' ? 1 : 7;
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetNOCFormatList(T)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (Type == 'PNOCintoTNOC') {
            this.ChangePNOCintoTNOCNOCFormat = data['Data'][0][0]["NOCFormat"];
          }
          if (Type == 'TNOCintoPNOC') {
            this.ChangeTNOCintoPNOCNOCFormat = data['Data'][0][0]["NOCFormat"];
          }
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}

