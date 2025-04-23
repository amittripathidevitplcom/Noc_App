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
import { FacilityDetailsService } from '../../../Services/FicilityDetais/facility-details.service';
import { LandDetailsService } from '../../../Services/Tabs/LandDetails/land-details.service';
import { RoomDetailsService } from '../../../Services/RoomDetails/room-details.service';
import { StaffDetailService } from '../../../Services/StaffDetail/staff-detail.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { ToastrService } from 'ngx-toastr';
import { HostelDataModel } from '../../../Models/HostelDetailsDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { VeterinaryHospitalDataModel, AnimalDataModel } from '../../../Models/VeterinaryHospitalDataModel';
import { FarmLandDetailDataModel } from '../../../Models/FarmLandDetailDataModel';
import { ParamedicalHospitalDataModel, ParamedicalHospitalParentNotDataModel, ParamedicalHospitalBedValidation } from '../../../Models/ParamedicalHospitalDataModel';
import { ParamedicalHospitalService } from '../../../Services/Tabs/ParamedicalHospital/paramedical-hospital.service';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { LegalEntityDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { ApplyNOCPreviewComponent } from '../../apply-nocpreview/apply-nocpreview.component';
import { BuildingDetailsMasterService } from '../../../Services/BuildingDetailsMaster/building-details-master.service';
import { OldnocdetailService } from '../../../Services/OldNOCDetail/oldnocdetail.service';
import { HospitalDetailService } from '../../../Services/Tabs/HospitalDetail/hospital-detail.service';
import { HostelDetailService } from '../../../Services/Tabs/hostel-details.service';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { ApplicationCommitteeMemberdataModel, PostApplicationCommitteeMemberdataModel } from '../../../Models/ApplicationCommitteeMemberdataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-final-check-list-mgthree',
  templateUrl: './final-check-list-mgthree.component.html',
  styleUrls: ['./final-check-list-mgthree.component.css']
})
export class FinalCheckListMGThreeComponent implements OnInit {
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
  public ShowHideNextRoleNextUser: boolean = true;
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
  dsrequest = new DocumentScrutinyDataModel();


  public CheckList_hostelDataModel: HostelDataModel[] = [];
  public CheckList_VeterinaryHospitalDataModel: VeterinaryHospitalDataModel[] = [];
  public CheckList_FarmLandDetailsDataModel: FarmLandDetailDataModel[] = [];
  public CheckList_ParamedicalHospitalDataModelList: ParamedicalHospitalDataModel[] = [];

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

  public ParamedicalHospitalBedValidationList: ParamedicalHospitalBedValidation[] = [];

  public IsShowSuperSpecialtyHospital: boolean = false;
  LegalEntityDataModel = new LegalEntityDataModel();
  public QueryStatus: any = '';
  public ApplicationNo: string = '';

  CommitteeMemberDetails!: FormGroup;
  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)


  constructor(private sSOLoginService: SSOLoginService,private aadharServiceDetails: AadharServiceDetails,private formBuilder: FormBuilder,private committeeMasterService: CommitteeMasterService,private hostelDetailService: HostelDetailService, private threehospitalDetailService: HospitalDetailService, private oldnocdetailService: OldnocdetailService, private buildingDetailsMasterService: BuildingDetailsMasterService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private landDetailsService: LandDetailsService, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService,
     private staffDetailService: StaffDetailService, private hospitalDetailService: ParamedicalHospitalService, private TrusteeGeneralInfoService: TrusteeGeneralInfoService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private collegeService: CollegeService, private fileUploadService: FileUploadService) { }



  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.ApplicationNo = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoYear')?.toString()) + "/" + this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoID')?.toString());
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
    this.GetHospitalDataList();
    this.GetHostelDetailList_DepartmentCollegeWise();

    this.GetWorkFlowActionListByRole();
    this.NextGetWorkFlowActionListByRole();
    this.GetCollageDetails();
    this.GetVeterinaryHospitalList_DepartmentCollegeWise();
    this.GetFarmLandDetailsList_DepartmentCollegeWise();
    this.GetLegalEntityData();
    this.GetHospitalDataList_DepartmentCollegeWise();
    this.GetCourtCaseList();
    this.CheckTabsEntry();
    this.GetCourseDetailAllList();

    this.CommitteeMemberDetails = this.formBuilder.group(
      {
        txtCMNameOfPerson: ['', Validators.required],
        txtCMMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtSSOID: ['', Validators.required],
        fCommitteeMemberDocument: ['']
      })
  }
  get form_CommitteeMember() { return this.CommitteeMemberDetails.controls; }


  public CheckListAllCourseList: any = [];
  public CourseDetail_FinalRemarks: any = [];
  async GetCourseDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_CourseDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.CheckListAllCourseList = data['Data'][0]['CourseDetails'][0];
          this.CourseDetail_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];

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

  // Start Land Details

  async GetLandDetailsDataList() {

    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_LandDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckList_LandDetailList = data['Data'][0]['LandDetails'][0];
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_FacilityDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_LegalEntity(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_CollegeDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_CollegeManagementSociety(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_HostelDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_RoomDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_BuildingDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_StaffDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_OldNOCDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_CollegeDocument(this.SelectedDepartmentID, this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, Type)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_OtherInformation(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_AcademicInformation(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.medicalDocumentScrutinyService.DocumentScrutiny_CollegeDocument(this.SelectedDepartmentID, this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, Type)
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

  //Start Hospital Details
  async GetHospitalDataList() {
    this.loaderService.requestStarted();
    try {
      await this.medicalDocumentScrutinyService.DocumentScrutiny_HospitalDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.CheckList_HospitalParentNotDataModelList = data['Data'][0]['HospitalDetails'][0];
            this.HospitalDetails_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
  //End Hospital Details
  //Veterinary Hospital

  async GetVeterinaryHospitalList_DepartmentCollegeWise() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_VeterinaryHospital(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_VeterinaryHospitalDataModel = data['Data'][0]['VeterinaryHospitals'];
          this.VeterinaryHospitalFinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];

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
  //End Veterinary Hospital

  //Farm Land Details
  async GetFarmLandDetailsList_DepartmentCollegeWise() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_FarmLandDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_FarmLandDetailsDataModel = data['Data'][0]['FarmLandDetails'];
          this.FarmLandDetailsFinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];

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
  //End Farm Land Details

  //
  public UserSSOID: string = '';
  async GetLegalEntityData() {
    try {
      await this.commonMasterService.GetCollegeBasicDetails(this.SelectedCollageID.toString())
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserSSOID = data['Data'][0]['data'][0]['ParentSSOID'];
          this.TrusteeGeneralInfoService.GetDataOfLegalEntity(this.UserSSOID)
            .then(async (data: any) => {
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              debugger;
              if (this.State == 0) {
                this.LegalEntityDataModel = JSON.parse(JSON.stringify(data['Data']));
              }
              if (this.State == 1) {
                this.toastr.error(this.ErrorMessage)
              }
              else if (this.State == 2) {
                this.toastr.warning(this.SuccessMessage)
              }
            })
        }, error => console.error(error));

    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetHospitalDataList_DepartmentCollegeWise() {
    this.loaderService.requestStarted();
    try {
      await this.medicalDocumentScrutinyService.DocumentScrutiny_ParamedicalHospitalDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.CheckList_ParamedicalHospitalDataModelList = data['Data'][0]['HospitalDetails'];
            this.ParamedicalHospitalDetails_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];

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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  async ViewHospitalDetail(content: any, HospitalID: number) {
    this.HospitalData = {};
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.GetData(HospitalID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HospitalData = data['Data'];
        });
      await this.GetParamedicalHospitalBedValidation(HospitalID);
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

  async GetParamedicalHospitalBedValidation(HospitalID: number) {
    try {
      this.ParamedicalHospitalBedValidationList = [];
      await this.hospitalDetailService.GetParamedicalHospitalBedValidation(this.SelectedCollageID, HospitalID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ParamedicalHospitalBedValidationList = JSON.parse(JSON.stringify(data['Data']));
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.SuccessMessage)
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

  public CheckList_courtOrderList: any = [];
  public CourtCaseFinalRemarks: any = [];
  async GetCourtCaseList() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_CourtCase(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_courtOrderList = data['Data'][0]['CourtCase'][0];
          this.CourtCaseFinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];

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
  //


  //Document  Post Section
  public isNextRoleIDValid: boolean = false;
  public isNextUserIdValid: boolean = false;
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
  public CheckTabsEntryData: any = [];
  async CheckTabsEntry() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.CheckDocumentScrutinyTabsData(this.SelectedApplyNOCID, this.sSOLoginDataModel.RoleID, this.SelectedCollageID)
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

  landrequest = new LandDetailDataModel();
  async ViewLandDetail(content: any, LandDetailID: number) {
    this.landrequest = new LandDetailDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.landDetailsService.GetLandDetailsIDWise(LandDetailID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.landrequest = data['Data'][0];
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
  buildingdetails: any = {};
  async ViewBuildingDetails(content: any, BuildingDetailID: number) {
    this.buildingdetails = {};
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.buildingDetailsMasterService.GetByID(BuildingDetailID, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.buildingdetails.SchoolBuildingDetailsID = data['Data'][0]['data']['Table'][0]["SchoolBuildingDetailsID"];
          this.buildingdetails.BuildingTypeID = data['Data'][0]['data']['Table'][0]["BuildingTypeID"];
          this.buildingdetails.BuildingTypeName = data['Data'][0]['data']['Table'][0]["BuildingTypeName"];
          this.buildingdetails.MGOneIstheCampusUnitary = data['Data'][0]['data']['Table'][0]["MGOneIstheCampusUnitary"];
          this.buildingdetails.Distance = data['Data'][0]['data']['Table'][0]["Distance"];
          this.buildingdetails.NameoftheAuthority = data['Data'][0]['data']['Table'][0]["NameoftheAuthority"];
          this.buildingdetails.AuthorityDateApproval = data['Data'][0]['data']['Table'][0]["AuthorityDateApproval"];
          this.buildingdetails.OwnerName = data['Data'][0]['data']['Table'][0]["OwnerName"];
          this.buildingdetails.AddressLine1 = data['Data'][0]['data']['Table'][0]["AddressLine1"];
          this.buildingdetails.AddressLine2 = data['Data'][0]['data']['Table'][0]["AddressLine2"];
          this.buildingdetails.RuralUrban = data['Data'][0]['data']['Table'][0]["RuralUrban"];
          this.buildingdetails.DivisionID = data['Data'][0]['data']['Table'][0]["DivisionID"];
          this.buildingdetails.Division_English = data['Data'][0]['data']['Table'][0]["Division_English"];
          this.buildingdetails.DistrictID = data['Data'][0]['data']['Table'][0]["DistrictID"];
          this.buildingdetails.District_Eng = data['Data'][0]['data']['Table'][0]["District_Eng"];
          this.buildingdetails.TehsilID = data['Data'][0]['data']['Table'][0]["TehsilID"];
          this.buildingdetails.TehsilName = data['Data'][0]['data']['Table'][0]["TehsilName"];
          this.buildingdetails.PanchayatSamitiID = data['Data'][0]['data']['Table'][0]["PanchayatSamitiID"];
          this.buildingdetails.PanchyatSamitiName = data['Data'][0]['data']['Table'][0]["PanchyatSamitiName"];
          this.buildingdetails.CityTownVillage = data['Data'][0]['data']['Table'][0]["CityTownVillage"];
          this.buildingdetails.CityName = data['Data'][0]['data']['Table'][0]["CityName"];
          this.buildingdetails.ContactNo = data['Data'][0]['data']['Table'][0]["ContactNo"];
          this.buildingdetails.Pincode = data['Data'][0]['data']['Table'][0]["Pincode"];
          this.buildingdetails.OwnBuildingOrderNo = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderNo"];
          this.buildingdetails.OwnBuildingOrderDate = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderDate"];
          this.buildingdetails.OwnBuildingFileUpload = data['Data'][0]['data']['Table'][0]["OwnBuildingFileUpload"];
          this.buildingdetails.Dis_OwnBuildingFileUpload = data['Data'][0]['data']['Table'][0]["Dis_OwnBuildingFileUpload"];
          this.buildingdetails.OwnBuildingFileUploadPath = data['Data'][0]['data']['Table'][0]["OwnBuildingFileUploadPath"];
          this.buildingdetails.FromDate = data['Data'][0]['data']['Table'][0]["FromDate"];
          this.buildingdetails.ToDate = data['Data'][0]['data']['Table'][0]["ToDate"];
          this.buildingdetails.ResidentialBuildingTypeID = data['Data'][0]['data']['Table'][0]["ResidentialBuildingTypeID"];
          this.buildingdetails.ResidentialBuildingName = data['Data'][0]['data']['Table'][0]["ResidentialBuildingName"];
          this.buildingdetails.MGOneResidentialIstheCampusUnitary = data['Data'][0]['data']['Table'][0]["MGOneResidentialIstheCampusUnitary"];
          this.buildingdetails.ResidentialDistance = data['Data'][0]['data']['Table'][0]["ResidentialDistance"];
          this.buildingdetails.ResidentialAddressLine1 = data['Data'][0]['data']['Table'][0]["ResidentialAddressLine1"];
          this.buildingdetails.ResidentialAddressLine2 = data['Data'][0]['data']['Table'][0]["ResidentialAddressLine2"];
          this.buildingdetails.ResidentialRuralUrban = data['Data'][0]['data']['Table'][0]["ResidentialRuralUrban"];
          this.buildingdetails.ResidentialDivisionID = data['Data'][0]['data']['Table'][0]["ResidentialDivisionID"];
          this.buildingdetails.ResDivision_English = data['Data'][0]['data']['Table'][0]["ResDivision_English"];
          this.buildingdetails.ResidentialDistrictID = data['Data'][0]['data']['Table'][0]["ResidentialDistrictID"];
          this.buildingdetails.ResDistrict_Eng = data['Data'][0]['data']['Table'][0]["ResDistrict_Eng"];
          this.buildingdetails.ResidentialTehsilID = data['Data'][0]['data']['Table'][0]["ResidentialTehsilID"];
          this.buildingdetails.ResTehsilName = data['Data'][0]['data']['Table'][0]["ResTehsilName"];
          this.buildingdetails.ResidentialPanchayatSamitiID = data['Data'][0]['data']['Table'][0]["ResidentialPanchayatSamitiID"];
          this.buildingdetails.ResPanchyatSamitiName = data['Data'][0]['data']['Table'][0]["ResPanchyatSamitiName"];
          this.buildingdetails.ResidentialCityID = data['Data'][0]['data']['Table'][0]["ResidentialCityID"];
          this.buildingdetails.ResCity_English = data['Data'][0]['data']['Table'][0]["ResCity_English"];
          this.buildingdetails.ResidentialCityTownVillage = data['Data'][0]['data']['Table'][0]["ResidentialCityTownVillage"];
          this.buildingdetails.ResidentialPincode = data['Data'][0]['data']['Table'][0]["ResidentialPincode"];
          this.buildingdetails.ResidentialOwnerName = data['Data'][0]['data']['Table'][0]["ResidentialOwnerName"];
          this.buildingdetails.ResidentialContactNo = data['Data'][0]['data']['Table'][0]["ResidentialContactNo"];
          this.buildingdetails.ResidentialRentvaliditydate = data['Data'][0]['data']['Table'][0]["ResidentialRentvaliditydate"];
          this.buildingdetails.ResidentialbuildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc1FileUpload"];
          this.buildingdetails.ResidentialDis_buildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialDis_buildingOtherDoc1FileUpload"];
          this.buildingdetails.ResidentialbuildingOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc1FileUploadPath"];
          this.buildingdetails.ResidentialbuildingOtherDoc2FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc2FileUpload"];
          this.buildingdetails.ResidentialDis_buildingOtherDoc2FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialDis_buildingOtherDoc2FileUpload"];
          this.buildingdetails.ResidentialbuildingOtherDoc2FileUploadPath = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc2FileUploadPath"];
          this.buildingdetails.ResidentialRentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["ResidentialRentAgreementFileUpload"];
          this.buildingdetails.ResidentialDis_RentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["ResidentialDis_RentAgreementFileUpload"];
          this.buildingdetails.ResidentialRentAgreementFileUploadPath = data['Data'][0]['data']['Table'][0]["ResidentialRentAgreementFileUploadPath"];
          this.buildingdetails.AuthoritybuildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["AuthoritybuildingOtherDoc1FileUpload"];
          this.buildingdetails.AuthorityDis_buildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["AuthorityDis_buildingOtherDoc1FileUpload"];
          this.buildingdetails.AuthoritybuildingOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["AuthoritybuildingOtherDoc1FileUploadPath"];
          this.buildingdetails.MGOneDrainage = data['Data'][0]['data']['Table'][0]["MGOneDrainage"];
          this.buildingdetails.BuildingUseNameoftheAuthority = data['Data'][0]['data']['Table'][0]["BuildingUseNameoftheAuthority"];
          this.buildingdetails.BuildingUseOrderNo = data['Data'][0]['data']['Table'][0]["BuildingUseOrderNo"];
          this.buildingdetails.BuildingUseDateApproval = data['Data'][0]['data']['Table'][0]["BuildingUseDateApproval"];
          this.buildingdetails.buildingUseOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["buildingUseOtherDoc1FileUpload"];
          this.buildingdetails.Dis_buildingUseOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["Dis_buildingUseOtherDoc1FileUpload"];
          this.buildingdetails.buildingUseOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["buildingUseOtherDoc1FileUploadPath"];
          this.buildingdetails.PollutionDateApproval = data['Data'][0]['data']['Table'][0]["PollutionDateApproval"];
          this.buildingdetails.ValidDateApproval = data['Data'][0]['data']['Table'][0]["ValidDateApproval"];
          this.buildingdetails.PollutionbuildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["PollutionbuildingOtherDoc1FileUpload"];
          this.buildingdetails.PollutionDis_buildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["PollutionDis_buildingOtherDoc1FileUpload"];
          this.buildingdetails.PollutionbuildingOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["PollutionbuildingOtherDoc1FileUploadPath"];
          this.buildingdetails.FireNOCFileUpload = data['Data'][0]['data']['Table'][0]["FireNOCFileUpload"];
          this.buildingdetails.Dis_FireNOCFileUpload = data['Data'][0]['data']['Table'][0]["Dis_FireNOCFileUpload"];
          this.buildingdetails.FireNOCFileUploadPath = data['Data'][0]['data']['Table'][0]["FireNOCFileUploadPath"];
          this.buildingdetails.OrderNo = data['Data'][0]['data']['Table'][0]["OrderNo"];
          this.buildingdetails.OrderDate = data['Data'][0]['data']['Table'][0]["OrderDate"];
          this.buildingdetails.ExpiringOn = data['Data'][0]['data']['Table'][0]["ExpiringOn"];
          this.buildingdetails.PWDNOCFileUpload = data['Data'][0]['data']['Table'][0]["PWDNOCFileUpload"];
          this.buildingdetails.Dis_PWDNOCFileUpload = data['Data'][0]['data']['Table'][0]["Dis_PWDNOCFileUpload"];
          this.buildingdetails.PWDNOCFileUploadPath = data['Data'][0]['data']['Table'][0]["PWDNOCFileUploadPath"];
          this.buildingdetails.TotalProjectCost = data['Data'][0]['data']['Table'][0]["TotalProjectCost"];
          this.buildingdetails.SourceCostAmount = data['Data'][0]['data']['Table'][0]["SourceCostAmount"];
          this.buildingdetails.AmountDeposited = data['Data'][0]['data']['Table'][0]["AmountDeposited"];
          this.buildingdetails.OtherFixedAssetsAndSecurities = data['Data'][0]['data']['Table'][0]["OtherFixedAssetsAndSecurities"];
          this.buildingdetails.GATEYearBalanceSecret = data['Data'][0]['data']['Table'][0]["GATEYearBalanceSecret"];
          this.buildingdetails.OtherFinancialResources = data['Data'][0]['data']['Table'][0]["OtherFinancialResources"];
          this.buildingdetails.TotalProjectCostFileUpload = data['Data'][0]['data']['Table'][0]["TotalProjectCostFileUpload"];
          this.buildingdetails.TotalProjectCostFileUploadPath = data['Data'][0]['data']['Table'][0]["TotalProjectCostFileUploadPath"];
          this.buildingdetails.Dis_TotalProjectCostFileUpload = data['Data'][0]['data']['Table'][0]["Dis_TotalProjectCostFileUpload"];
          this.buildingdetails.SourceCostAmountFileUpload = data['Data'][0]['data']['Table'][0]["SourceCostAmountFileUpload"];
          this.buildingdetails.SourceCostAmountFileUploadPath = data['Data'][0]['data']['Table'][0]["SourceCostAmountFileUploadPath"];
          this.buildingdetails.Dis_SourceCostAmountFileUpload = data['Data'][0]['data']['Table'][0]["Dis_SourceCostAmountFileUpload"];
          this.buildingdetails.AmountDepositedFileUpload = data['Data'][0]['data']['Table'][0]["AmountDepositedFileUpload"];
          this.buildingdetails.AmountDepositedFileUploadPath = data['Data'][0]['data']['Table'][0]["AmountDepositedFileUploadPath"];
          this.buildingdetails.Dis_AmountDepositedFileUpload = data['Data'][0]['data']['Table'][0]["Dis_AmountDepositedFileUpload"];
          this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload = data['Data'][0]['data']['Table'][0]["OtherFixedAssetsAndSecuritiesFileUpload"];
          this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUploadPath = data['Data'][0]['data']['Table'][0]["OtherFixedAssetsAndSecuritiesFileUploadPath"];
          this.buildingdetails.Dis_OtherFixedAssetsAndSecuritiesFileUpload = data['Data'][0]['data']['Table'][0]["Dis_OtherFixedAssetsAndSecuritiesFileUpload"];
          this.buildingdetails.GATEYearBalanceSecretFileUpload = data['Data'][0]['data']['Table'][0]["GATEYearBalanceSecretFileUpload"];
          this.buildingdetails.GATEYearBalanceSecretFileUploadPath = data['Data'][0]['data']['Table'][0]["GATEYearBalanceSecretFileUploadPath"];
          this.buildingdetails.Dis_GATEYearBalanceSecretFileUpload = data['Data'][0]['data']['Table'][0]["Dis_GATEYearBalanceSecretFileUpload"];
          this.buildingdetails.OtherFinancialResourcesFileUpload = data['Data'][0]['data']['Table'][0]["OtherFinancialResourcesFileUpload"];
          this.buildingdetails.OtherFinancialResourcesFileUploadPath = data['Data'][0]['data']['Table'][0]["OtherFinancialResourcesFileUploadPath"];
          this.buildingdetails.Dis_OtherFinancialResourcesFileUpload = data['Data'][0]['data']['Table'][0]["Dis_OtherFinancialResourcesFileUpload"];
          this.buildingdetails.BuildingHostelQuartersRoadArea = data['Data'][0]['data']['Table'][0]["BuildingHostelQuartersRoadArea"];
          this.buildingdetails.FireNOCOrderNumber = data['Data'][0]['data']['Table'][0]["FireNOCOrderNumber"];
          if (this.buildingdetails.BuildingTypeName != 'Owned') {
            this.buildingdetails.Dis_RentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["Dis_RentAgreementFileUpload"];
            this.buildingdetails.RentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["RentAgreementFileUpload"];
            this.buildingdetails.RentAgreementFileUploadPath = data['Data'][0]['data']['Table'][0]["RentAgreementFileUploadPath"];
            this.buildingdetails.Rentvaliditydate = data['Data'][0]['data']['Table'][0]["Rentvaliditydate"];
          }
          this.buildingdetails.lstBuildingDocDetails = data['Data'][0]['data']['Table1'];
          this.buildingdetails.IsApproved = data['Data'][0]['data']['Table'][0]["IsApproved"];
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
  staffrequest = new StaffDetailDataModel();
  async ViewStaffDetail(content: any, StaffDetailID: number) {
    this.staffrequest = new StaffDetailDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.staffDetailService.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, StaffDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.staffrequest = data['Data'][0];
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
  oldnocrequest = new OldNocDetailsDataModel();
  async ViewOldNOCDetail(content: any, OldNocID: number) {
    this.oldnocrequest = new OldNocDetailsDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.oldnocdetailService.GetOldNOCDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, OldNocID)
        .then((data: any) => {
          const display = document.getElementById('ModalViewOldNOCDetail');
          if (display) display.style.display = 'block';
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.oldnocrequest = data['Data'][0];
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
  public viewrequest: any = {};
  async ViewMGThreeHospitalDetail(content: any, HospitalID: number) {
    this.viewrequest = {};
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.threehospitalDetailService.GetMGThreeHospitalDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, HospitalID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.viewrequest = data['Data'][0];
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

  public showRentDocument: boolean = false;
  hostelrequest = new HostelDataModel();
  async ViewHostelItem(content: any, HostelDetailID: number) {
    this.hostelrequest = new HostelDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.hostelDetailService.GetHostelDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, HostelDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.hostelrequest = data['Data'][0];
          if (this.hostelrequest.HostelType == 'Rent') {
            this.showRentDocument = true;
          }
          //this.request.RentDocumentPath = this.imageUrlPath + this.request.RentDocument;

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







  /*Document Scrutiny*/
  public ShowHideNextRole: boolean = true;
  public ShowHideNextUser: boolean = true;
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
      if (this.ShowHideNextRole && this.ShowHideNextUser) {
        if (this.NextRoleID <= 0) {
          this.isNextRoleIDValid = true;
          this.isFormvalid = false;
        }
        if (this.NextUserID <= 0) {
          this.isNextUserIdValid = true;
          this.isFormvalid = false;
        }
      }
      else if (!this.ShowHideNextUser && !this.ShowHideNextRole) {
        this.NextRoleID = 1;
        this.NextUserID = 0;
        this.NextActionID = 0;
      }
      else if (this.ShowHideNextUser && this.ShowHideNextRole) {
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
      else if (!this.ShowHideNextUser && this.ShowHideNextRole) { // && !this.ShowHideNextAction
        if (this.NextRoleID <= 0) {
          this.isNextRoleIDValid = true;
          this.isFormvalid = false;
        }
        this.NextUserID = 0;
        this.NextActionID = 0;
      }
      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to submit?")) {
        await this.applyNOCApplicationService.DocumentScrutiny(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.ActionID, this.SelectedApplyNOCID, this.SelectedDepartmentID, this.CheckFinalRemark, this.NextRoleID, this.NextUserID, this.NextActionID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              this.routers.navigate(['/applicationslist' + "/" + encodeURI(this.commonMasterService.Encrypt(this.QueryStatus.toString()))]);

            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
            else {
              this.toastr.error(this.ErrorMessage)
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
        await this.commonMasterService.GetUserDetailsByRoleID(this.NextRoleID, this.sSOLoginDataModel.DepartmentID, this.SelectedApplyNOCID)
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

              if (this.QueryStatus == 'DCPending') {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID == 84 || x.ActionID==3);
              }
              if (this.QueryStatus == 'InspectionPending' || this.QueryStatus == 'IPending') {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID == 69);
              }
              if (this.QueryStatus == 'AfterInspectionPending' && this.sSOLoginDataModel.RoleID==3) {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID ==45 || x.ActionID==60);
              }
              if (this.QueryStatus == 'AfterInspectionPending' && this.sSOLoginDataModel.RoleID == 5) {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID == 63 || x.ActionID == 60);
              }
              if (this.QueryStatus == 'AfterInspectionPending' && this.sSOLoginDataModel.RoleID == 6) {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID == 49 || x.ActionID == 60);
              }
              this.ActionID = this.WorkFlowActionList[0]['ActionID'];
              await this.OnChangeCurrentAction()
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
  public IsRevert: boolean = false;
  async OnChangeCurrentAction() {
    //await this.GetRoleListForApporval();
    //if (this.UserRoleList.length > 0) {
    //  this.UserRoleList = this.UserRoleList.filter((x: { RoleID: number; }) => x.RoleID != 1);
    //}
  
    //var IsNextAction = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsNextAction;
    //var IsRevert = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsRevert;
    //this.IsRevert = IsRevert;
    //if (IsNextAction == true && IsRevert == false) {
    //  this.ShowHideNextUser = true;
    //  this.ShowHideNextRole = true;

    //}
    //else if (IsNextAction == false && IsRevert == false) {
    //  this.ShowHideNextUser = false;
    //  this.ShowHideNextRole = false;
    //  //if (this.UserRoleList.length > 0) {
    //  //  this.UserRoleList = this.UserRoleList.filter((x: { RoleID: number; }) => x.RoleID != 1);
    //  //}
    //}
    //else if (IsNextAction == false && IsRevert == true) {
    //  this.ShowHideNextUser = true;
    //  this.ShowHideNextRole = true;
    //}

    await this.GetRoleListForApporval();
    this.NextRoleID = 0;
    var IsNextAction = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsNextAction;
    var IsRevert = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsRevert;
    if (IsNextAction == true && IsRevert == false) {
      this.ShowHideNextUser = true;
      this.ShowHideNextRole = true;
      if (this.UserRoleList.length > 0) {
        this.UserRoleList = this.UserRoleList.filter((x: { RoleID: number; }) => x.RoleID != 1);
      }
      //this.ShowHideNextAction = true;
    }
    else if (IsNextAction == false && IsRevert == false) {
      this.ShowHideNextUser = false;
      this.ShowHideNextRole = false;
      if (this.UserRoleList.length > 0) {
        this.UserRoleList = this.UserRoleList.filter((x: { RoleID: number; }) => x.RoleID != 1);
      }
      //this.ShowHideNextAction = false;
    }
    else if (IsNextAction == false && IsRevert == true) {
      this.ShowHideNextUser = true;
      this.ShowHideNextRole = true;
      if (this.sSOLoginDataModel.RoleID != 5 || (this.sSOLoginDataModel.RoleID == 5 && this.QueryStatus =='InspectionPending')) {
        if (this.UserRoleList.length > 0) {
          this.UserRoleList = this.UserRoleList.filter((x: { RoleID: number; }) => x.RoleID != 1);
        }
      }
      //this.ShowHideNextAction = false;
    }
  }




  /*Inspection Committe*/
  async OpenAsignCommitteePopUP(content: any) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    await this.GetApplicationCommitteeList(this.SelectedApplyNOCID);
  }


  public CommitteeMemberlst: any = [];
  async GetApplicationCommitteeList(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList_AH(ApplyNocApplicationID, this.QueryStatus =='AfterInspectionPending'?'Scrutiny': 'Inspection')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request_MemberList.ApplicationCommitteeList = data['Data'];
          if (this.request_MemberList.ApplicationCommitteeList.length > 0) {
            this.request_MemberList.CommitteeDocument = data['Data'][0]['CommitteeDocument'];
            this.request_MemberList.CommitteeDocumentPath = data['Data'][0]['CommitteeDocumentPath'];
            this.request_MemberList.CommitteeDocument_DisName = data['Data'][0]['CommitteeDocument_DisName'];
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



  request_CommitteeMemberDataModel = new ApplicationCommitteeMemberdataModel();
  request_MemberList = new PostApplicationCommitteeMemberdataModel();
  public isSubmitted_MemberDetails: boolean = false;
  public isSubmitted: boolean = false;
  AadhaarNo: string = '';
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
          CommitteeType: this.QueryStatus == 'AfterInspectionPending' ? 'Scrutiny' : 'Inspection',
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
    if (this.request_MemberList.ApplicationCommitteeList.length < 2) {
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

      }, 200);
    }
  }
  sSOVerifyDataModel = new SSOLoginDataModel();
  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';
  async VerifySSOID(SSOID: any) {
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


  async GetAadharByVID(data: any) {
    this.AadhaarNo ='123456789102'
    //await this.aadharServiceDetails.GetAadharByVID(data)
    //  .then((data: any) => {
    //    data = JSON.parse(JSON.stringify(data));
    //    if (data[0].status == "0") {
    //      this.AadhaarNo = data[0].data;
    //    }
    //    else {
    //      this.AadhaarNo = '';
    //    }
    //  }, error => console.error(error));
  }
  SetPrimaryMember(item: any, index: any) {
    let oldArr = this.request_MemberList.ApplicationCommitteeList;
    let newArr = oldArr.map(obj => ({ ...obj, ['IsPrimaryMember']: false }));
    newArr[index].IsPrimaryMember = true;
    this.request_MemberList.ApplicationCommitteeList = newArr;
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
}

