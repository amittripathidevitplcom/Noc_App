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
  public ApplyNocParameterMasterList_ChangeInPlaceOfCollege: any = null;
  constructor(private applyNocParameterService: ApplyNocParameterService, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private committeeMasterService: CommitteeMasterService, private decDocumentScrutinyService: DCEDocumentScrutinyService, private sSOLoginService: SSOLoginService, private aadharServiceDetails: AadharServiceDetails
  ) { }

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
      ActionName = Status == 'Completed' ? 'Approve' : Status == 'Rejected' ? '' : Status == 'Pending' ? 'Approve' : Status == 'Revert' ? 'Revert':'';
      await this.decDocumentScrutinyService.GetNodalOfficerApplyNOCApplicationList(RoleId, UserID, Status, ActionName)
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
}

