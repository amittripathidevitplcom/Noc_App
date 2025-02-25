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
import { AnimalDocumentScrutinyService } from '../../../Services/AnimalDocumentScrutiny/animal-document-scrutiny.service';


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-final-check-list-ahdegree',
  templateUrl: './final-check-list-ahdegree.component.html',
  styleUrls: ['./final-check-list-ahdegree.component.css']
})
export class FinalCheckListAHDegreeComponent implements OnInit {
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


  constructor(private sSOLoginService: SSOLoginService, private aadharServiceDetails: AadharServiceDetails, private formBuilder: FormBuilder, private committeeMasterService: CommitteeMasterService, private hostelDetailService: HostelDetailService, private threehospitalDetailService: HospitalDetailService, private oldnocdetailService: OldnocdetailService, private buildingDetailsMasterService: BuildingDetailsMasterService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private landDetailsService: LandDetailsService, private animalDocumentScrutinyService: AnimalDocumentScrutinyService,
    private staffDetailService: StaffDetailService, private hospitalDetailService: ParamedicalHospitalService, private TrusteeGeneralInfoService: TrusteeGeneralInfoService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private collegeService: CollegeService) { }



  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    //this.ApplicationNo = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoYear')?.toString()) + "/" + this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoID')?.toString());
    this.GetLandDetailsDataList();
    this.GetFacilityDetailAllList();
    this.ViewlegalEntityDataByID();
    this.GetSocietyAllList();
    this.ViewTotalCollegeDataByID();
    this.GetAllBuildingDetailsList();
    this.GetStaffDetailList_DepartmentCollegeWise();
    this.GetRequiredDocuments('Required Document');
    this.GetOtherInformationAllList();
    this.GetWorkFlowActionListByRole();
    this.NextGetWorkFlowActionListByRole();
    this.GetCollageDetails();
    this.GetLegalEntityData();
    this.GetAllDepartmentInfrastructureList();
    this.CheckTabsEntry();
  }


  // Start Land Details

  async GetLandDetailsDataList() {

    try {
      this.loaderService.requestStarted();
      await this.animalDocumentScrutinyService.DocumentScrutiny_LandDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.animalDocumentScrutinyService.DocumentScrutiny_FacilityDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.animalDocumentScrutinyService.DocumentScrutiny_LegalEntity(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (data['Data'].length > 0) {
            this.CheckList_legalEntityListData1 = data['Data'][0]['legalEntity'];

            console.log('Deepak');
            console.log(this.CheckList_legalEntityListData1);
            console.log('Deepak');
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
      await this.animalDocumentScrutinyService.DocumentScrutiny_CollegeDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.animalDocumentScrutinyService.DocumentScrutiny_CollegeManagementSociety(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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


  //Start Building Details
  async GetAllBuildingDetailsList() {
    try {
      this.loaderService.requestStarted();
      await this.animalDocumentScrutinyService.DocumentScrutiny_BuildingDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.animalDocumentScrutinyService.DocumentScrutiny_StaffDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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

  //Start Required Documents
  async GetRequiredDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.animalDocumentScrutinyService.DocumentScrutiny_CollegeDocument(this.SelectedDepartmentID, this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_DocumentDetails = data['Data'][0]['lstDatatable'][0];
          this.RequiredDocument_FinalRemarks = data['Data'][0]['lstFinalRemarkList'][0];
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
      await this.animalDocumentScrutinyService.DocumentScrutiny_OtherInformation(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  //Document  Post Section
  public isNextRoleIDValid: boolean = false;
  public isNextUserIdValid: boolean = false;
  public IsAHDegreeCollege: boolean = false;
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
          if (data['Data']['CollegeLevelName'] == 'UG' && data['Data']['DepartmentID'] == 2) {
            this.IsAHDegreeCollege = true;
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
      await this.animalDocumentScrutinyService.CheckDocumentScrutinyTabsData(this.SelectedApplyNOCID, this.sSOLoginDataModel.RoleID, this.SelectedCollageID)
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

  public CHeckList_AHDepartmentList: any = [];
  public AHInfra_FinalRemarks: any = [];
  async GetAllDepartmentInfrastructureList() {
    try {
      this.loaderService.requestStarted();
      await this.animalDocumentScrutinyService.DocumentScrutiny_DepartmentInfrastructure(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CHeckList_AHDepartmentList = data['Data'][0]['AHDepartmentList'];
          this.AHInfra_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
      await this.commonMasterService.GetRoleListForApporval(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID, 'UG')
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
      await this.commonMasterService.GetWorkFlowActionListByRole(this.sSOLoginDataModel.RoleID, "Current", this.sSOLoginDataModel.DepartmentID,'UG')
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.WorkFlowActionList = data['Data'];
            if (this.WorkFlowActionList.length > 0) {

              if (this.QueryStatus == 'InPending' && this.sSOLoginDataModel.RoleID==5) {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID != 52);
              }
              if (this.QueryStatus == 'Pending' && this.sSOLoginDataModel.RoleID == 14) {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID == 49);
              }
              if (this.QueryStatus == 'Pending' && this.sSOLoginDataModel.RoleID == 5) {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID == 52);
              }
              if (this.QueryStatus == 'InPending' && this.sSOLoginDataModel.RoleID == 14) {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID != 49);
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
    await this.GetRoleListForApporval();
    if (this.UserRoleList.length > 0) {
      this.UserRoleList = this.UserRoleList.filter((x: { RoleID: number; }) => x.RoleID != 1);
    }

    var IsNextAction = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsNextAction;
    var IsRevert = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsRevert;
    this.IsRevert = IsRevert;
    if (IsNextAction == true && IsRevert == false) {
      this.ShowHideNextUser = true;
      this.ShowHideNextRole = true;

    }
    else if (IsNextAction == false && IsRevert == false) {
      this.ShowHideNextUser = false;
      this.ShowHideNextRole = false;
      //if (this.UserRoleList.length > 0) {
      //  this.UserRoleList = this.UserRoleList.filter((x: { RoleID: number; }) => x.RoleID != 1);
      //}
    }
    else if (IsNextAction == false && IsRevert == true) {
      this.ShowHideNextUser = true;
      this.ShowHideNextRole = true;
    }
  }




}

