import { Component, Injectable, OnInit } from '@angular/core';
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
import { FacilityDetailsService } from '../../../Services/FicilityDetais/facility-details.service';
import { LandDetailsService } from '../../../Services/Tabs/LandDetails/land-details.service';
import { RoomDetailsService } from '../../../Services/RoomDetails/room-details.service';
import { StaffDetailService } from '../../../Services/StaffDetail/staff-detail.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ToastrService } from 'ngx-toastr';
import { HostelDataModel } from '../../../Models/HostelDetailsDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { LegalEntityDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-document-scrutiny-check-list-details-dce',
  templateUrl: './document-scrutiny-check-list-details.component.html',
  styleUrls: ['./document-scrutiny-check-list-details.component.css']
})
export class DocumentScrutinyCheckListDetailsComponentDce implements OnInit {

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

  SCBoysCountFooter: number = 0
  STBoysCountFooter: number = 0
  OBCBoysCountFooter: number = 0
  MBCBoysCountFooter: number = 0
  GenBoysCountFooter: number = 0
  EWSBoysCountFooter: number = 0
  SCGirlsCountFooter: number = 0
  STGirlsCountFooter: number = 0
  OBCGirlsCountFooter: number = 0
  MBCGirlsCountFooter: number = 0
  GenGirlsCountFooter: number = 0
  EWSGirlsCountFooter: number = 0


  TotalBoysFooter: number = 0
  TotalGirlsFooter: number = 0
  OFTotalMinorityBoysFooter: number = 0
  OFTotalMinorityGirlsFooter: number = 0
  OFTotalPHBoysFooter: number = 0
  OFTotalPHGirlsFooter: number = 0
  //

  FirstYearBoysCountFooter: number = 0
  FirstYearGirlsCountFooter: number = 0
  SecYearBoysCountFooter: number = 0
  SecYearGirlsCountFooter: number = 0
  ThirdYearBoysCountFooter: number = 0
  ThirdYearGirlsCountFooter: number = 0
  PervYearBoysCountFooter: number = 0
  PervYearGirlsCountFooter: number = 0
  FinalYearBoysCountFooter: number = 0
  FinalYearGirlsCountFooter: number = 0
  DiplomaBoysCountFooter: number = 0
  DiplomaGirlsCountFooter: number = 0
  OtherBoysCountFooter: number = 0
  OtherGirlsCountFooter: number = 0
  TotalFooter: number = 0

  public QueryStringStatus: any = '';

  constructor(private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private landDetailsService: LandDetailsService, private dcedocumentScrutinyService: DCEDocumentScrutinyService, private facilityDetailsService: FacilityDetailsService,
    private roomDetailsService: RoomDetailsService, private staffDetailService: StaffDetailService, private TrusteeGeneralInfoService: TrusteeGeneralInfoService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private collegeService: CollegeService) { }



  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
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
    this.GetCollegeWiseStudenetDetails();
    this.GetSubjectWiseStudenetDetails();
    //this.CheckDocumentScrutinyTabsData();
    this.CheckTabsEntry();
    this.GetPVStageStatusOfApplication(this.SelectedApplyNOCID);
  }


  // Start Land Details

  async GetLandDetailsDataList() {

    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_LandDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_FacilityDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_LegalEntity(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_CollegeDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_CollegeManagementSociety(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_HostelDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_RoomDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_BuildingDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_StaffDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_OldNOCDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_CollegeDocument(this.SelectedDepartmentID, this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, Type)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_OtherInformation(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_AcademicInformation(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.dcedocumentScrutinyService.DocumentScrutiny_CollegeDocument(this.SelectedDepartmentID, this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, Type)
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


  //Start Class Wise Student
  async GetCollegeWiseStudenetDetails() {
    try {

      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_ClassWiseStudentDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_ClassWiseStudentDetailsList = data['Data'][0]['ClassWiseStudentDetails'];
          this.ClassWiseStudentFinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.ClassWiseStudentFinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
          this.TotalClassWiseStudentFooterSum();
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

  TotalClassWiseStudentFooterSum() {

    //Boys
    this.SCBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { SCBoysCount: any; }) => t.SCBoysCount).reduce((acc: any, value: any) => acc + value, 0)
    this.STBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { STBoysCount: any; }) => t.STBoysCount).reduce((acc: any, value: any) => acc + value, 0);
    this.OBCBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OBCBoysCount: any; }) => t.OBCBoysCount).reduce((acc: any, value: any) => acc + value, 0)
    this.MBCBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { MBCBoysCount: any; }) => t.MBCBoysCount).reduce((acc: any, value: any) => acc + value, 0);
    this.GenBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { GenBoysCount: any; }) => t.GenBoysCount).reduce((acc: any, value: any) => acc + value, 0);
    this.EWSBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { EWSBoysCount: any; }) => t.EWSBoysCount).reduce((acc: any, value: any) => acc + value, 0);
    //Girls Footer SUM
    this.SCGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { SCGirlsCount: any; }) => t.SCGirlsCount).reduce((acc: any, value: any) => acc + value, 0)
    this.STGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { STGirlsCount: any; }) => t.STGirlsCount).reduce((acc: any, value: any) => acc + value, 0);
    this.OBCGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OBCGirlsCount: any; }) => t.OBCGirlsCount).reduce((acc: any, value: any) => acc + value, 0)
    this.MBCGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { MBCGirlsCount: any; }) => t.MBCGirlsCount).reduce((acc: any, value: any) => acc + value, 0);
    this.GenGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { GenGirlsCount: any; }) => t.GenGirlsCount).reduce((acc: any, value: any) => acc + value, 0);
    this.EWSGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { EWSGirlsCount: any; }) => t.EWSGirlsCount).reduce((acc: any, value: any) => acc + value, 0);

    //
    this.TotalBoysFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { TotalBoys: any; }) => t.TotalBoys).reduce((acc: any, value: any) => acc + value, 0)
    this.TotalGirlsFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { TotalGirls: any; }) => t.TotalGirls).reduce((acc: any, value: any) => acc + value, 0);


    this.OFTotalMinorityBoysFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OFTotalMinorityBoys: any; }) => t.OFTotalMinorityBoys).reduce((acc: any, value: any) => acc + value, 0)
    this.OFTotalMinorityGirlsFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OFTotalMinorityGirls: any; }) => t.OFTotalMinorityGirls).reduce((acc: any, value: any) => acc + value, 0);

    this.OFTotalPHBoysFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OFTotalPHBoys: any; }) => t.OFTotalPHBoys).reduce((acc: any, value: any) => acc + value, 0)
    this.OFTotalPHGirlsFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OFTotalPHGirls: any; }) => t.OFTotalPHGirls).reduce((acc: any, value: any) => acc + value, 0);


  }
  //End Class Wise Student


  //strat subject wise Student Detais
  async GetSubjectWiseStudenetDetails() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_SubjectWiseStudentDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.CheckList_SubjectWiseStudentDetailsList = data['Data'][0]['SubjectWiseStudentDetails'];
          this.SubjectWiseStudentFinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.SubjectWiseStudentFinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;

          this.TotalFooterSum();

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

  TotalFooterSum() {


    //Boys
    this.FirstYearBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.FirstYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.FirstYearGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.FirstYearGirlsCount).reduce((acc, value) => acc + value, 0);

    this.SecYearBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.SecYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.SecYearGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.SecYearGirlsCount).reduce((acc, value) => acc + value, 0);

    this.ThirdYearBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.ThirdYearBoysCount).reduce((acc, value) => acc + value, 0);
    this.ThirdYearGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.ThirdYearGirlsCount).reduce((acc, value) => acc + value, 0);

    //Girls Footer SUM
    this.FinalYearBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.FinalYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.FinalYearGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.FinalYearGirlsCount).reduce((acc, value) => acc + value, 0);

    //Girls Footer SUM
    this.PervYearBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.PervYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.PervYearGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.PervYearBoysCount).reduce((acc, value) => acc + value, 0);

    this.DiplomaBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.DiplomaBoysCount).reduce((acc, value) => acc + value, 0)
    this.DiplomaGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.DiplomaGirlsCount).reduce((acc, value) => acc + value, 0);


    this.OtherBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.OtherBoysCount).reduce((acc, value) => acc + value, 0);
    this.OtherGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.OtherGirlsCount).reduce((acc, value) => acc + value, 0);

    //
    this.TotalFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.Total).reduce((acc, value) => acc + value, 0)

  }


  //end subject wise student detials



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

      if (this.CheckFinalRemark == '') {
        this.isRemarkValid = true;
        this.isFormvalid = false;
      }

      if (this.ActionID <= 0) {
        this.isActionTypeValid = true;
        this.isFormvalid = false;
      }
      if (this.ShowHideNextRole && this.ShowHideNextAction && this.ShowHideNextUser) {
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
      else if (!this.ShowHideNextUser && !this.ShowHideNextRole && !this.ShowHideNextAction) {
        this.NextRoleID = 1;
        this.NextUserID = 0;
        this.NextActionID = 0;
      }
      else if (this.ShowHideNextUser && this.ShowHideNextRole && !this.ShowHideNextAction) {
        if (this.NextRoleID <= 0) {
          this.isNextRoleIDValid = true;
          this.isFormvalid = false;
        }
        if (this.NextUserID <= 0) {
          this.isNextUserIdValid = true;
          this.isFormvalid = false;
        }
        this.NextActionID = 0;
      }
      else if (!this.ShowHideNextUser && this.ShowHideNextRole && !this.ShowHideNextAction) {
        if (this.NextRoleID <= 0) {
          this.isNextRoleIDValid = true;
          this.isFormvalid = false;
        }
        this.NextUserID = 0;
        this.NextActionID = 0;
      }
      if (this.IsPVStageDone != 1) {
        this.toastr.warning('Physical Verification not done yet');
        this.isFormvalid = false;
      }

      if (this.SelectedDepartmentID == 3) {
        if (this.CollegeType_IsExisting) {
          if (this.CheckTabsEntryData['LegalEntity'] <= 0 || this.CheckTabsEntryData['CollegeDetail'] <= 0 || this.CheckTabsEntryData['CollegeManagementSociety'] <= 0 || this.CheckTabsEntryData['LandInformation'] <= 0
            || this.CheckTabsEntryData['Facility'] <= 0 || this.CheckTabsEntryData['RequiredDocument'] <= 0 || this.CheckTabsEntryData['RoomDetails'] <= 0 || this.CheckTabsEntryData['OtherInformation'] <= 0
            || this.CheckTabsEntryData['BuildingDocuments'] <= 0 || this.CheckTabsEntryData['StaffDetails'] <= 0 || this.CheckTabsEntryData['OLDNOCDetails'] <= 0 || this.CheckTabsEntryData['AcademicInformation'] <= 0
            || this.CheckTabsEntryData['OtherDocument'] <= 0 || this.CheckTabsEntryData['ClassWiseStudentDetail'] <= 0 || this.CheckTabsEntryData['HostelDetails'] <= 0 || this.CheckTabsEntryData['SubjectWiseStudentDetail'] <= 0) {
            this.isFormvalid = false;
            this.toastr.warning('Please do document scrutiny all tabs');
          }
        }
        else {
          if (this.CheckTabsEntryData['LegalEntity'] <= 0 || this.CheckTabsEntryData['CollegeDetail'] <= 0 || this.CheckTabsEntryData['CollegeManagementSociety'] <= 0 || this.CheckTabsEntryData['LandInformation'] <= 0
            || this.CheckTabsEntryData['Facility'] <= 0 || this.CheckTabsEntryData['RequiredDocument'] <= 0 || this.CheckTabsEntryData['RoomDetails'] <= 0 || this.CheckTabsEntryData['OtherInformation'] <= 0
            || this.CheckTabsEntryData['BuildingDocuments'] <= 0 || this.CheckTabsEntryData['OtherDocument'] <= 0 || this.CheckTabsEntryData['SubjectWiseStudentDetail'] <= 0
            || this.CheckTabsEntryData['HostelDetails'] <= 0 || this.CheckTabsEntryData['ClassWiseStudentDetail'] <= 0) {
            this.isFormvalid = false;
            this.toastr.warning('Please do document scrutiny all tabs');
          }
        }
      }

      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      //if (this.sSOLoginDataModel.RoleID == 16) {
      //  this.routers.navigate(['/inspectioncommitteephysicalverification/Pending']);
      //}
      //else {
        await this.applyNOCApplicationService.DocumentScrutiny(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.ActionID, this.SelectedApplyNOCID, this.SelectedDepartmentID, this.CheckFinalRemark, this.NextRoleID, this.NextUserID, this.NextActionID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              this.routers.navigate(['/dceapplicationlist/Pending']);
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          }, error => console.error(error));
      //}
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
      await this.dcedocumentScrutinyService.CheckDocumentScrutinyTabsData(this.SelectedApplyNOCID, this.sSOLoginDataModel.RoleID, this.SelectedCollageID)
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

  public IsPVStageDone: number = null;
  async GetPVStageStatusOfApplication(applyNocApplicationID: number) {
    debugger;
    try {
      this.loaderService.requestStarted();
      // get
      await this.applyNocParameterService.GetApplyNocApplicationByApplicationID(applyNocApplicationID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.IsPVStageDone = data['Data']['PVStage'];
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
