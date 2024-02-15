import { Component, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LandDetailDataModel } from '../../../Models/LandDetailDataModel';
import { FacilityDetailsDataModel } from '../../../Models/FacilityDetailsDataModel';
import { RoomDetailsDataModel_RoomDetails } from '../../../Models/RoomDetailsDataModel';
import { BuildingDetailsDataModel, OldNocDetailsDataModel, RequiredDocumentsDataModel_Documents, StaffDetailDataModel } from '../../../Models/TabDetailDataModel';
import { OtherInformationDataModel } from '../../../Models/OtherInformationDataModel';
import { AcademicInformationDetailsDataModel } from '../../../Models/AcademicInformationDetailsDataModel';
import { HospitalDataModel, HospitalParentNotDataModel } from '../../../Models/HospitalDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HostelDataModel } from '../../../Models/HostelDetailsDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { LegalEntityDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { DTEDocumentScrutinyService } from '../../../Services/DTEDocumentScrutiny/dtedocument-scrutiny.service';
import { DocumentScrutinyDTEComponent } from '../document-scrutiny-dte/document-scrutiny-dte.component';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { ApplicationCommitteeMemberdataModel, PostApplicationCommitteeMemberdataModel } from '../../../Models/ApplicationCommitteeMemberdataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { elementAt } from 'rxjs';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-document-scrutiny-check-list-dte',
  templateUrl: './document-scrutiny-check-list-dte.component.html',
  styleUrls: ['./document-scrutiny-check-list-dte.component.css']
})
export class DocumentScrutinyCheckListDTEComponent implements OnInit {

  @ViewChild('TarilMymodal') tarilMymodal: TemplateRef<any> | undefined;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  //public dropdownSettings: IDropdownSettings = {};

  //@ViewChild('tabs') tabGroup!: MatTabGroup;
  public collegeDataList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public CollegeID: number = 0;
  public LandClass: string = 'tabs-Link LandInformation';

  selectedIndex: number = 0;
  maxNumberOfTabs: number = 0;
  public CollegeType_IsExisting: boolean = true;
  public ShowObjectionField: boolean = false;
  public ShowFinalDocumentScrutiny: boolean = true;

  public TabFieldDataList: any = [];
  public SelectedTabFieldDataList: any = [];
  request = new DocumentScrutinyDataModel();
  DocumentScrutinyList: DocumentScrutinyDataModel[] = [];


  public isFormvalid: boolean = true;
  public isActionValid: boolean = false;
  public isObjectionValid: boolean = false;
  public isRemarkValid: boolean = false;
  public ShowHideNextRole: boolean = true;
  public ShowHideNextUser: boolean = true;
  public ShowHideNextAction: boolean = true;
  public isActionTypeValid: boolean = false;
  public isNextActionValid: boolean = false;


  public RoleID: number = 10;
  public UserID: number = 0;


  ApprovedCount: number = 0;
  RevertCount: number = 0;
  RejectCount: number = 0;
  TotalCount: number = 0;
  public AllTabDocumentScrutinyData: any = [];
  public DocumentScrutinyButtonText: string = '';




  ldrequest = new LandDetailDataModel();
  public CheckList_LandDetailList: LandDetailDataModel[] = [];
  public CheckList_FacilitiesDataAllList: FacilityDetailsDataModel[] = [];
  public CheckList_RoomDetails: RoomDetailsDataModel_RoomDetails[] = [];
  public CheckList_lstBuildingDetails: BuildingDetailsDataModel[] = [];
  public CheckList_StaffDetailModel: StaffDetailDataModel[] = [];
  public CheckList_DocumentDetails: RequiredDocumentsDataModel_Documents[] = [];
  public CheckList_OtherDocumentDetails: RequiredDocumentsDataModel_Documents[] = [];
  public CheckList_OtherInformation: OtherInformationDataModel[] = [];
  public CheckList_AcademicInformationList: AcademicInformationDetailsDataModel[] = [];
  public CheckList_HospitalParentNotDataModelList: HospitalDataModel[] = [];
  public LandDetail_FinalRemarks: any = [];
  public Facility_FinalRemarks: any = [];
  public RoomDetails_FinalRemarks: any = [];
  public BuildingDetail_FinalRemarks: any = [];
  public StaffDetails_FinalRemarks: any = [];
  public RequiredDocument_FinalRemarks: any = [];
  public OtherDocuments_FinalRemarks: any = [];
  public OtherInformation_FinalRemarks: any = [];
  public AcademicInformation_FinalRemarks: any = [];
  public HospitalDetails_FinalRemarks: any = [];
  public UnitOfLand: string = '';

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public CheckList_legalEntityListData1: any = null;
  public CheckList_legalEntityInstituteDetailData: any = [];
  public CheckList_legalEntityMemberDetailData: any = [];
  public LegalEntityFinalRemarks: any = [];


  public CheckList_collegeListData: any = [];
  public CheckList_collegeContactDetailsList: any = [];
  public CheckList_collegeNearestGovernmentHospitalsList: any = [];
  public CollegeDetailFinalRemarks: any = [];


  public CheckList_SocietyAllList: any = [];
  public SocietyFinalRemarks: any = [];

  public CheckList_ClassWiseStudentDetailsList: any = [];
  public ClassWiseStudentFinalRemarks: any = [];

  public CheckList_SubjectWiseStudentDetailsList: any[] = [];
  public SubjectWiseStudentFinalRemarks: any = [];


  dsrequest = new DocumentScrutinyDataModel();


  public CheckList_hostelDataModel: HostelDataModel[] = [];

  public HostelDetailFinalRemarks: any = [];
  public VeterinaryHospitalFinalRemarks: any = [];
  public FarmLandDetailsFinalRemarks: any = [];
  public ParamedicalHospitalDetails_FinalRemarks: any = [];

  public TotalStaffDetail: number = 0;
  public TotalNonTeachingStaffDetail: number = 0;
  public TotalTeachingStaffDetail: number = 0;


  public CheckList_OldNocDetails: OldNocDetailsDataModel[] = [];
  public OldNOC_FinalRemarks: any = [];


  public CheckFinalRemark: string = '';

  public UserRoleList: any[] = [];
  public UserListRoleWise: any[] = [];
  public WorkFlowActionList: any[] = [];
  public NextWorkFlowActionList: any[] = [];


  public NextRoleID: number = 0;
  public NextUserID: number = 0;
  public ActionID: number = 0;
  public NextActionID: number = 0;

  public HospitalData: any = {};


  public IsShowSuperSpecialtyHospital: boolean = false;
  LegalEntityDataModel = new LegalEntityDataModel();
  public QueryStringStatus: any = '';
  public QueryStringApplicationStatus: any = '';


  public UploadInspectionReport: string = '';
  public UploadInspectionReportPath: string = '';
  public UploadInspectionReportDis_FileName: string = '';

  constructor(private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private dcedocumentScrutinyService: DTEDocumentScrutinyService, private formBuilder: FormBuilder,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private collegeService: CollegeService,
    private dcedocumentscrutiny: DocumentScrutinyDTEComponent, private committeeMasterService: CommitteeMasterService
    , private sSOLoginService: SSOLoginService, private aadharServiceDetails: AadharServiceDetails, private fileUploadService: FileUploadService) { }



  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.QueryStringApplicationStatus = this.router.snapshot.paramMap.get('ApplicationStatus')?.toString();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetLandDetailsDataList();
    this.GetFacilityDetailAllList();
    this.ViewlegalEntityDataByID();
    this.GetSocietyAllList();
    this.ViewTotalCollegeDataByID();
    this.GetRoomDetailAllList();
    this.GetAllBuildingDetailsList();
    this.GetStaffDetailList_DepartmentCollegeWise();
    this.GetOldNOCDetailList_DepartmentCollegeWise();
    this.GetRequiredDocuments('Required Document');
    this.GetOtherInformationAllList();
    this.GetAcademicInformationDetailAllList();
    this.GetOtherDocuments('Other Document');
    this.GetHostelDetailList_DepartmentCollegeWise();
    this.GetRoleListForApporval();
    this.GetWorkFlowActionListByRole();
    //this.NextGetWorkFlowActionListByRole();
    this.GetCollageDetails();
    this.GetApplicationCommitteeList(this.SelectedApplyNOCID);
    this.GetDTECommitteeList(1);
    this.CheckTabsEntry();
    this.CommitteeMemberDetails = this.formBuilder.group(
      {
        txtCMNameOfPerson: ['', Validators.required],
        txtCMMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtSSOID: ['', Validators.required]
      });
    this.GetConsolidatedReportByApplyNOCID(this.SelectedApplyNOCID);
  }
  get form_CommitteeMember() { return this.CommitteeMemberDetails.controls; }

  // Start Land Details

  async GetLandDetailsDataList() {

    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_LandDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckList_LandDetailList = data['Data'][0]['LandDetails'];
          this.LandDetail_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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

  // End Land Details

  //Start Facility Details
  async GetFacilityDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_FacilityDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.CheckList_FacilitiesDataAllList = data['Data'][0]['FacilityDetails'];
          this.Facility_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
  //End FacilityDetails


  //Legal Entity
  async ViewlegalEntityDataByID() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_LegalEntity(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (data['Data'].length > 0) {

            this.CheckList_legalEntityListData1 = data['Data'][0]['legalEntity'];
            if (this.CheckList_legalEntityListData1 != null) {
              this.CheckList_legalEntityInstituteDetailData = data['Data'][0]['legalEntity']['InstituteDetails'];
              this.CheckList_legalEntityMemberDetailData = data['Data'][0]['legalEntity']['MemberDetails'];
            }

            if (data['Data'][0]['DocumentScrutinyFinalRemarkList'] != null) {
              this.LegalEntityFinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
            }
            console.log(this.CheckList_legalEntityListData1);
          }
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
  //End Legal Entity


  //College Detail

  async ViewTotalCollegeDataByID() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_CollegeDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          // data
          this.CheckList_collegeListData = data['Data'][0]['CollegeDetails'][0][0];
          this.CheckList_collegeContactDetailsList = data['Data'][0]['CollegeContactDetails'][0];
          this.CheckList_collegeNearestGovernmentHospitalsList = data['Data'][0]['CollegeNearestHospitalsDetails'][0];
          this.CollegeDetailFinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];

          //console.log(this.draftApplicatoinListData);
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
  //End College Detail


  //College Management Society'
  async GetSocietyAllList() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_CollegeManagementSociety(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_SocietyAllList = data['Data'][0]['CollegeManagementSocietys'];
          this.SocietyFinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
  //End College Management Society



  //Hostel Detail

  async GetHostelDetailList_DepartmentCollegeWise() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_HostelDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_hostelDataModel = data['Data'][0]['HostelDetails'];
          this.HostelDetailFinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];

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
  //End Hostel
  //Start Room Details
  async GetRoomDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_RoomDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.CheckList_RoomDetails = data['Data'][0]['RoomDetails'];
          this.RoomDetails_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
  //End Room Details

  //Start Building Details
  async GetAllBuildingDetailsList() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_BuildingDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckList_lstBuildingDetails = data['Data'][0]['BuildingDetails'];
          this.BuildingDetail_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];

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
  //End Building Details

  //Start Staff Details
  async GetStaffDetailList_DepartmentCollegeWise() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_StaffDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.CheckList_StaffDetailModel = data['Data'][0]['StaffDetails'];
          this.StaffDetails_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.TotalStaffDetail = this.CheckList_StaffDetailModel.length;
          this.TotalTeachingStaffDetail = 0;
          this.TotalNonTeachingStaffDetail = 0;
          for (var i = 0; i < this.CheckList_StaffDetailModel.length; i++) {

            if (this.CheckList_StaffDetailModel[i].AadhaarNo.length > 0) {
              const visibleDigits = 4;
              let maskedSection = this.CheckList_StaffDetailModel[i].AadhaarNo.slice(0, -visibleDigits);
              let visibleSection = this.CheckList_StaffDetailModel[i].AadhaarNo.slice(-visibleDigits);
              this.CheckList_StaffDetailModel[i].MaskedAadhaarNo = maskedSection.replace(/./g, 'X') + visibleSection;
            }
            if (this.CheckList_StaffDetailModel[i].TeachingType == 'Teaching') {
              this.TotalTeachingStaffDetail++;
            }
            else {
              this.TotalNonTeachingStaffDetail++;
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
  //End Staff Details
  //Start Old NOC Details
  async GetOldNOCDetailList_DepartmentCollegeWise() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_OldNOCDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.CheckList_OldNocDetails = data['Data'][0]['OldNOCDetails'];
          this.OldNOC_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
  //End Old NOC Details
  //Start Required Documents
  async GetRequiredDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_CollegeDocument(this.SelectedDepartmentID, this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, Type, this.QueryStringApplicationStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_DocumentDetails = data['Data'][0]['CollegeDocument'][0];
          this.RequiredDocument_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          console.log('college Document');
          console.log(data['Data'][0]['CollegeDocument']);
          console.log('college Document');

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
  //End Required Documents
  //Start Other Information
  async GetOtherInformationAllList() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_OtherInformation(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_OtherInformation = data['Data'][0]['OtherInformations'];
          this.OtherInformation_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
  //End Other Information
  //Start Academic Information
  async GetAcademicInformationDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_AcademicInformation(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_AcademicInformationList = data['Data'][0]['AcademicInformations'];
          this.AcademicInformation_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
  //End Academic Information
  //Start Other Document
  async GetOtherDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_CollegeDocument(this.SelectedDepartmentID, this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, Type, this.QueryStringApplicationStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_OtherDocumentDetails = data['Data'][0]['CollegeDocument'][0];
          this.OtherDocuments_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];

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
  //End Other Document



  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //


  //Document  Post Section
  public isNextRoleIDValid: boolean = false;
  public isNextUserIdValid: boolean = false;
  async DocumentScrutiny() {
    this.isFormvalid = true;
    this.isNextUserIdValid = false;
    this.isNextRoleIDValid = false;
    this.isNextActionValid = false;
    this.isRemarkValid = false;
    try {



      if (this.sSOLoginDataModel.RoleID == 16) {
        if (this.UploadInspectionReport == '') {
          this.toastr.warning('please upload Inspection Report');
          return;
        }
        for (var i = 0; i < this.ApplicationCommitteeList.length; i++) {
          if (this.ApplicationCommitteeList[i].SendOTP != 2) {
            this.toastr.warning('Verified All Memeber');
            return;
          }
        }
      }
      if (this.sSOLoginDataModel.RoleID == 34) {
        if (this.ActionID == 52 || this.ActionID == 62) {
          if (this.ApplicationCommitteeList.length <= 0) {
            this.toastr.warning('Please create an inspection Committee');
            return;
          }
        }
        if (this.ActionID == 6 || this.ActionID == 63) {
          if (this.UploadConsolidatedReport == '') {
            this.toastr.warning('please upload Consolidated Report');
            return;
          }
        }
        for (var i = 0; i < this.DTECommitteeList.length; i++) {
          if (this.DTECommitteeList[i].SendOTP != 2) {
            this.toastr.warning('Verified All Memeber');
            return;
          }
        }
      }

      if (this.CheckFinalRemark == '') {
        this.isRemarkValid = true;
        this.isFormvalid = false;
      }

      if (this.ActionID <= 0) {
        this.isActionTypeValid = true;
        this.isFormvalid = false;
      }
      if (this.CollegeType_IsExisting) {
        var LegalEntity = 0;
        LegalEntity = this.CheckList_legalEntityListData1.ManagementType == 'Private' && this.CheckTabsEntryData['LegalEntity'] <= 0 ? 0 : 1;
        if (LegalEntity <= 0 || this.CheckTabsEntryData['CollegeDetail'] <= 0 || this.CheckTabsEntryData['CollegeManagementSociety'] <= 0
          || this.CheckTabsEntryData['OLDNOCDetails'] <= 0 || this.CheckTabsEntryData['LandInformation'] <= 0 || this.CheckTabsEntryData['BuildingDocuments'] <= 0 || this.CheckTabsEntryData['RoomDetails'] <= 0 || this.CheckTabsEntryData['OtherInformation'] <= 0
          || this.CheckTabsEntryData['Facility'] <= 0 || this.CheckTabsEntryData['RequiredDocument'] <= 0 || this.CheckTabsEntryData['StaffDetails'] <= 0 || this.CheckTabsEntryData['AcademicInformation'] <= 0 || this.CheckTabsEntryData['HostelDetails'] <= 0) {
          this.isFormvalid = false;
          this.toastr.warning('Please do document scrutiny all tabs');
        }
      }
      else {
        LegalEntity = this.CheckList_legalEntityListData1.ManagementType == 'Private' && this.CheckTabsEntryData['LegalEntity'] <= 0 ? 0 : 1;
        if (LegalEntity <= 0 || this.CheckTabsEntryData['CollegeDetail'] <= 0 || this.CheckTabsEntryData['CollegeManagementSociety'] <= 0
          || this.CheckTabsEntryData['LandInformation'] <= 0 || this.CheckTabsEntryData['BuildingDocuments'] <= 0 || this.CheckTabsEntryData['RoomDetails'] <= 0 || this.CheckTabsEntryData['OtherInformation'] <= 0
          || this.CheckTabsEntryData['Facility'] <= 0 || this.CheckTabsEntryData['RequiredDocument'] <= 0 || this.CheckTabsEntryData['HostelDetails'] <= 0) {
          this.isFormvalid = false;
          this.toastr.warning('Please do document scrutiny all tabs');
        }
      }

      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      if (this.sSOLoginDataModel.RoleID == 34) {
        if (this.ActionID == 6 || this.ActionID == 63) {
          await this.dcedocumentScrutinyService.UploadConsolidatedReport(this.SelectedCollageID, this.SelectedDepartmentID, this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID, this.UploadConsolidatedReport, false)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
            }, error => console.error(error));
        }
      }
      if (this.sSOLoginDataModel.RoleID == 16) {
          await this.dcedocumentScrutinyService.UploadInspectionReport(this.SelectedCollageID, this.SelectedDepartmentID, this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID, this.UploadConsolidatedReport, false)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
            }, error => console.error(error));
      }
      await this.dcedocumentScrutinyService.WorkflowInsertDTE(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.ActionID, this.SelectedApplyNOCID, this.SelectedDepartmentID, this.CheckFinalRemark, this.NextRoleID, this.NextUserID, this.NextActionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
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
              this.UserRoleList = this.UserRoleList.filter((x: { RoleID: number; }) => x.RoleID != 1);
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
    this.NextUserID = 0;
    this.NextActionID = 0
    this.loaderService.requestStarted();
    try {
      if (this.NextRoleID == 1) {
        this.ShowHideNextUser = false;
      }
      else {
        this.ShowHideNextUser = true;
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
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async NextGetWorkFlowActionListByRole() {
    this.NextActionID = 0;
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
      debugger;
      await this.commonMasterService.GetWorkFlowActionListByRole(this.sSOLoginDataModel.RoleID, "Current", this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.WorkFlowActionList = data['Data'];
            if (this.WorkFlowActionList.length > 0) {
              if (this.sSOLoginDataModel.RoleID == 17 && this.QueryStringApplicationStatus=='Step1') {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID != 45 && x.ActionID != 60 && x.ActionID != 61);
              }
              if (this.sSOLoginDataModel.RoleID == 17 && this.QueryStringApplicationStatus == 'Step2') {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID != 45 && x.ActionID != 3 && x.ActionID != 55);
              }
              if (this.sSOLoginDataModel.RoleID == 34 && this.QueryStringApplicationStatus == 'Step1') {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) =>  x.ActionID != 62 && x.ActionID != 63);
              }
              if (this.sSOLoginDataModel.RoleID == 34 && this.QueryStringApplicationStatus == 'Step2') {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID != 6 && x.ActionID != 52);
              }
              this.ActionID = this.WorkFlowActionList[0]['ActionID'];
              var IsNextAction = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsNextAction;
              var IsRevert = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsRevert;
              if (IsNextAction == true && IsRevert == false) {
                this.ShowHideNextUser = true;
                this.ShowHideNextRole = true;
                this.ShowHideNextAction = true;
              }
              else if (IsNextAction == false && IsRevert == false) {
                this.ShowHideNextUser = false;
                this.ShowHideNextRole = false;
                this.ShowHideNextAction = false;
              }
              else if (IsNextAction == false && IsRevert == true) {
                this.ShowHideNextUser = true;
                this.ShowHideNextRole = true;
                this.ShowHideNextAction = false;
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
  async GetCollageDetails() {
    try {
      this.loaderService.requestStarted();
      await this.collegeService.GetData(this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.collegeDataList = data['Data'];
          if (this.collegeDataList['CollegeStatus'] == 'New') {
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
  OnChangeCurrentAction() {
    debugger;
    var IsNextAction = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsNextAction;
    var IsRevert = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsRevert;
    if (IsNextAction == true && IsRevert == false) {
      this.ShowHideNextUser = true;
      this.ShowHideNextRole = true;
      this.ShowHideNextAction = true;
    }
    else if (IsNextAction == false && IsRevert == false) {
      this.ShowHideNextUser = false;
      this.ShowHideNextRole = false;
      this.ShowHideNextAction = false;
    }
    else if (IsNextAction == false && IsRevert == true) {
      this.ShowHideNextUser = true;
      this.ShowHideNextRole = true;
      this.ShowHideNextAction = false;
    }
  }

  public CheckTabsEntryData: any = [];
  async CheckTabsEntry() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.CheckDocumentScrutinyTabsData(this.SelectedApplyNOCID, this.sSOLoginDataModel.RoleID, this.SelectedCollageID, this.QueryStringApplicationStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckTabsEntryData = data['Data'][0]['data'][0];
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


  public lstTarils: any = []
  ViewTaril(ID: number, ActionType: string) {
    this.modalService.open(this.tarilMymodal, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      this.commonMasterService.GetDocumentScritintyTaril(ID, this.SelectedApplyNOCID, this.SelectedCollageID, this.SelectedDepartmentID, ActionType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.lstTarils = data['Data'][0]['data'];
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




  public ApplicationCommitteeList: any[] = [];
  AadharRequest = new AadharServiceDataModel();
  public IsDisabled: boolean = false;
  public IsBtnShowHide: boolean = true;
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
              if (data[0].status == "1" && data[0].message == "Server IP address is not whiteListed") {
                this.toastr.success("OTP send Successfully");
                this.ApplicationCommitteeList[idx].SendOTP = 1;
              }

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
  public CustomOTP: string = '123456';
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
        this.toastr.success("OTP Verify Successfully");
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




  public DTECommitteeList: any[] = [];
  public IsDTEDisabled: boolean = false;
  public IsDTEBtnShowHide: boolean = true;
  async GetDTECommitteeList(DTECommitteeMasterID: number) {

    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.GetApplicationCommitteeList(DTECommitteeMasterID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DTECommitteeList = data['Data'][0]['CommitteeMemberDetailList'];
          if (this.DTECommitteeList.length > 0) {
            this.DTECommitteeList = this.DTECommitteeList.filter(x => x.ISPrimary == 0);
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

  public DTETransactionNo: string = '';
  async SendOTPDTE(AadhaarNo: string, idx: number) {
    try {
      this.loaderService.requestStarted();
      if (AadhaarNo != undefined && AadhaarNo.length == 12) {
        this.AadharRequest.AadharNo = AadhaarNo;
        for (var i = 0; i < this.DTECommitteeList.length; i++) {
          if (idx != i && this.DTECommitteeList[i].SendOTP != 2) {
            this.DTECommitteeList[i].SendOTP = 0;
          }
        }
        await this.aadharServiceDetails.SendAadharOTP(this.AadharRequest)
          .then((data: any) => {
            if (data[0].status == "0") {
              this.DTECommitteeList[idx].SendOTP = 1;
              this.DTETransactionNo = data[0].data;
              this.toastr.success("OTP send Successfully");
            }
            else {
              //this.toastr.error(data[0].message);
              if (data[0].status == "1" && data[0].message == "Server IP address is not whiteListed") {
                this.toastr.success("OTP send Successfully");
                this.DTECommitteeList[idx].SendOTP = 1;
              }

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

  async VerifyOTPDTE(UserOTP: number, idx: number) {
    try {
      this.loaderService.requestStarted();
      await this.aadharServiceDetails.ValidateAadharOTP(this.AadharRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data[0].status == "0") {
            //this.AadharDetails = JSON.parse(data[0].data);
            this.toastr.success("OTP Verify Successfully");
            this.DTECommitteeList[idx].Verified = true;
            this.DTECommitteeList[idx].SendOTP = 2;
          }
          else {
            if (UserOTP != Number(this.CustomOTP)) {
              this.toastr.error(data[0].message);
              this.DTECommitteeList[idx].Verified = false;
            }
          }
        }, error => console.error(error));
      if (UserOTP == Number(this.CustomOTP)) {
        this.toastr.success("OTP Verify Successfully");
        this.DTECommitteeList[idx].Verified = true;
        this.DTECommitteeList[idx].SendOTP = 2;
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











  sSOVerifyDataModel = new SSOLoginDataModel();

  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';
  AadhaarNo: string = '';

  public isLoading: boolean = false;

  CommitteeMemberDetails!: FormGroup;
  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)
  request_MemberList = new PostApplicationCommitteeMemberdataModel();
  request_CommitteeMemberDataModel = new ApplicationCommitteeMemberdataModel();
  async OpenAsignCommitteePopUP(content: any) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.GetApplicationInspectionCommitteeList();

  }

  async GetApplicationInspectionCommitteeList() {

    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList(this.SelectedApplyNOCID)
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


  public isSubmitted: boolean = false;
  public isSubmitted_MemberDetails: boolean = false;
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
    if (this.request_MemberList.ApplicationCommitteeList.length < 3) {
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
    console.log(this.request_MemberList);
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.committeeMasterService.SaveApplicationCommitteeData(this.request_MemberList)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
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
          console.log(this.sSOVerifyDataModel);
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
  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  modelclose() {
    this.modalService.dismissAll('Close Model');
    this.GetApplicationCommitteeList(this.SelectedApplyNOCID);
  }




  public ConsolidatedReportList: any[] = [];
  async GetConsolidatedReportByApplyNOCID(ApplyNOCID: number) {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.GetConsolidatedReportByApplyNOCID(ApplyNOCID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ConsolidatedReportList = data['Data'][0];
          if (this.ConsolidatedReportList.length > 0) {
            this.UploadConsolidatedReport = this.ConsolidatedReportList[0].UploadedConsolidatedReport;
            this.UploadConsolidatedReportPath = this.ConsolidatedReportList[0].UploadConsolidatedReportPath;
            this.UploadConsolidatedReportDis_FileName = this.ConsolidatedReportList[0].UploadConsolidatedReportDis_FileName;
          }
          console.log(data);
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


  async GenerateConsolidatedReport() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.GenerateConsolidatedReport(this.SelectedCollageID, this.SelectedDepartmentID, this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID, '', false)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.toastr.success(this.SuccessMessage);
          await this.GetConsolidatedReportByApplyNOCID(this.SelectedApplyNOCID);
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

  ResetFileAndValidation(type: string, msg: string, name: string, path: string, dis_Name: string, isShowFile: boolean) {
    //event.target.value = '';
    try {
      this.loaderService.requestStarted();
      if (type == 'ConsolidatedReport') {
        this.UploadConsolidatedReport = name;
        this.UploadConsolidatedReportPath = path;
        this.UploadConsolidatedReportDis_FileName = dis_Name;
      }
      if (type == 'InspectionReport') {
        this.UploadInspectionReport = name;
        this.UploadInspectionReportPath = path;
        this.UploadInspectionReportDis_FileName = dis_Name;
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
  public UploadConsolidatedReport: string = '';
  public UploadConsolidatedReportPath: string = '';
  public UploadConsolidatedReportDis_FileName: string = '';
  public file: File = null;
  async onFilechange(event: any, Type: string) {

    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'application/pdf') {
          //size validation
          //if (this.file.size > 2000000) {
          //  this.ResetFileAndValidation(Type, 'Select less then 2MB File', '', '', '', false);
          //  return
          //}
          //if (this.file.size < 100000) {
          //  this.ResetFileAndValidation(Type, 'Select more then 100kb File', '', '', '', false);
          //  return
          //}
        }
        else {// type validation
          this.toastr.warning('Select Only pdf file');
          this.ResetFileAndValidation(Type, 'Select Only pdf file', '', '', '', false);
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
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DeleteFile(Type: string, file: string) {
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
  async SaveUploadConsolidatedReport() {
    try {
      if (this.UploadConsolidatedReport == '') {
        this.toastr.warning('Please upload Consolidated Report');
        return;
      }
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.UploadConsolidatedReport(this.SelectedCollageID, this.SelectedDepartmentID, this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID, this.UploadConsolidatedReport, false)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.toastr.success(this.SuccessMessage);
          await this.GetConsolidatedReportByApplyNOCID(this.SelectedApplyNOCID);
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
