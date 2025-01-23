import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DocumentScrutinyDataModel } from '../../../../Models/DocumentScrutinyDataModel';
import { AcademicInformationDetailsDataModel, BuildingDetailsDataModel, LandDetailDataModel, OldNocDetailsDataModel, RequiredDocumentsDataModel_Documents, StaffDetailDataModel } from '../../../../Models/TabDetailDataModel';
import { OtherInformationDataModel } from '../../../../Models/OtherInformationDataModel';
import { HospitalDataModel } from '../../../../Models/HospitalDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SocietyDataModel } from '../../../../Models/SocietyDataModel';
import { AnimalDataModel, VeterinaryHospitalDataModel } from '../../../../Models/VeterinaryHospitalDataModel';
import { HostelDataModel } from '../../../../Models/HostelDetailsDataModel';
import { VeterinaryHospitalService } from '../../../../Services/VeterinaryHospital/veterinary-hospital.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ApplyNOCApplicationService } from '../../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { LandDetailsService } from '../../../../Services/Tabs/LandDetails/land-details.service';
import { SocityService } from '../../../../Services/Master/SocietyManagement/socity.service';
import { StaffDetailService } from '../../../../Services/StaffDetail/staff-detail.service';
import { TrusteeGeneralInfoService } from '../../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { BuildingDetailsMasterService } from '../../../../Services/BuildingDetailsMaster/building-details-master.service';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CollegeService } from '../../../../services/collegedetailsform/College/college.service';
import { MGoneNOCService } from '../../../../Services/MGoneNOC/mgone-noc.service';
import { LegalEntityDataModel } from '../../../../Models/LegalEntityDataModel';
import { MGOneDocumentScrutinyService } from '../../../../Services/MGOneDocumentScrutiny/mgonedocument-scrutiny.service';
import { HospitalDetailService } from '../../../../Services/Tabs/HospitalDetail/hospital-detail.service';
import { FileUploadService } from '../../../../Services/FileUpload/file-upload.service';

@Component({
  selector: 'app-mgone-forward-inpection-report-osd',
  templateUrl: './mgone-forward-inpection-report-osd.component.html',
  styleUrls: ['./mgone-forward-inpection-report-osd.component.css']
})
export class MGOneForwardInpectionReportOSDComponent {

  @ViewChild('TarilMymodal') tarilMymodal: TemplateRef<any> | undefined;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public collegeDataList: any = [];
  public lstTarils: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public ApplicationNo: string = '';
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
  public ShowHideMeetingDateTime: boolean = false;

  buildingdetails: any = {};

  public RoleID: number = 10;
  public UserID: number = 0;


  ApprovedCount: number = 0;
  RevertCount: number = 0;
  RejectCount: number = 0;
  TotalCount: number = 0;
  public AllTabDocumentScrutinyData: any = [];
  public DocumentScrutinyButtonText: string = '';

  ldrequest = new LandDetailDataModel();
  sdrequest = new StaffDetailDataModel();
  public CheckList_LandDetailList: LandDetailDataModel[] = [];
  public CheckList_lstBuildingDetails: BuildingDetailsDataModel[] = [];
  public CheckList_DocumentDetails: RequiredDocumentsDataModel_Documents[] = [];
  public CheckList_HospitalParentNotDataModelList: any = [];
  public HospitalData: any = {};
  public LandDetail_FinalRemarks: any = [];
  public RoomDetails_FinalRemarks: any = [];
  public BuildingDetail_FinalRemarks: any = [];
  public RequiredDocument_FinalRemarks: any = [];
  public HospitalDetails_FinalRemarks: any = [];
  public UnitOfLand: string = '';

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public CheckList_legalEntityListData1: any = null;
  public CheckList_legalEntityInstituteDetailData: any = [];
  public CheckList_legalEntityMemberDetailData: any = [];
  public LegalEntityFinalRemarks: any = [];


  public CheckList_collegeListData: any = [];
  public CheckList_collegeGeoTaggingDetailsList: any = [];
  public CheckList_collegeContactDetailsList: any = [];
  public CheckList_collegeNearestGovernmentHospitalsList: any = [];
  public CollegeDetailFinalRemarks: any = [];

  public CheckList_FDRDetails: any = [];
  public FDR_FinalRemarks: any = [];
  public CheckList_PaymentDetails: any = [];
  public Payment_FinalRemarks: any = [];

  CheckList_societyrequest = new SocietyDataModel();
  public CheckList_SocietyAllList: any = [];
  public SocietyFinalRemarks: any = [];
  dsrequest = new DocumentScrutinyDataModel();


  public DetailoftheLand: any = [];
  public LandDetailsDocumentListByID: any = [];
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
  public PageStatus: string = '';

  public IsSummaryReport: boolean = false;
  public IsMeetingNotice: boolean = false;
  public isShowFile: boolean = false;
  public Filedoc: string = '';
  public Filedoc_Dis_FileName: string = '';
  public FiledocPath: string = '';
  public FileValidationMessage: string = '';

  public isShowMOMFile: boolean = false;
  public MOMFiledoc: string = '';
  public MOMFiledoc_Dis_FileName: string = '';
  public MOMFiledocPath: string = '';
  public MOMFileValidationMessage: string = '';
  public ProposedMeetingDate: string = '';
  public ProposedMeetingTime: string = '';

  public file!: File;
  public SummaryReport: string = '';
  public MeetingNotice: string = '';
  public MOMDocument: string = '';
  public nocWorkFlowDock: any;
  LegalEntityDataModel = new LegalEntityDataModel();
  public isProposedMeetingDateValid: boolean = false;
  public isProposedMeetingTimeValid: boolean = false;
  constructor(private toastr: ToastrService, private loaderService: LoaderService, private mg1DocumentScrutinyService: MGOneDocumentScrutinyService,
    private landDetailsService: LandDetailsService, private mgoneNOCService: MGoneNOCService, private socityService: SocityService, private TrusteeGeneralInfoService: TrusteeGeneralInfoService, private buildingDetailsMasterService: BuildingDetailsMasterService, private hospitalDetailService: HospitalDetailService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private collegeService: CollegeService, private fileUploadService: FileUploadService, private commonMasterService: CommonMasterService
  ) { }

  async ngOnInit() {

    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.ApplicationNo = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoYear')?.toString()) + "/" + this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoID')?.toString());
    this.PageStatus = (this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString()));
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetNOCWorkFlowDock();

    if (this.sSOLoginDataModel.RoleID == 31) {
      this.IsSummaryReport = true;
    }
    else if (this.sSOLoginDataModel.RoleID == 39 && this.nocWorkFlowDock.MeetingScheduleDate != "" && this.nocWorkFlowDock.MeetingNotice == "") {
      this.IsMeetingNotice = true;
    }

    this.GetCollageDetails();
    this.GetLandDetailsDataList();
    this.ViewlegalEntityDataByID();
    this.GetSocietyAllList();
    this.ViewTotalCollegeDataByID();
    this.GetAllBuildingDetailsList();
    this.GetRequiredDocuments('Required Document');
    this.GetHospitalParentList();
    this.GetFDRDetails();
    this.GetPaymentetails();

    this.GetRoleListForApporval();
    this.GetWorkFlowActionListByRole();
    this.NextGetWorkFlowActionListByRole();
    this.GetLegalEntityData();
    await this.GetUnitOfLandArea(this.SelectedDepartmentID, 'LandUnit');
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

  // Start Land Details
  async GetLandDetailsDataList() {

    try {
      this.loaderService.requestStarted();
      await this.mg1DocumentScrutinyService.DocumentScrutiny_LandDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
  async GetUnitOfLandArea(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UnitOfLand = data['Data'] != '' ? data['Data'][0]['Name'] : '';

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
  async ViewLandDetail(content: any, LandDetailID: number) {
    this.ldrequest = new LandDetailDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.LandDetailsDocumentListByID = [];
      this.loaderService.requestStarted();
      await this.landDetailsService.GetLandDetailsIDWise(LandDetailID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ldrequest = data['Data'][0];
          this.LandDetailsDocumentListByID = data['Data'][0]["LandDetailDocument"];
          this.DetailoftheLand = data['Data'][0]["CollegeLandTypeDetails"];
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

  //Legal Entity
  async ViewlegalEntityDataByID() {
    try {
      this.loaderService.requestStarted();
      await this.mg1DocumentScrutinyService.DocumentScrutiny_LegalEntity(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.mg1DocumentScrutinyService.DocumentScrutiny_CollegeDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
          this.CheckList_collegeGeoTaggingDetailsList = data['Data'][0]['CollegeGeoTaggingDetails'][0];
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
      await this.mg1DocumentScrutinyService.DocumentScrutiny_CollegeManagementSociety(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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

  async ViewCollegeManagmentDetail(content: any, SocietyID: number) {
    this.CheckList_societyrequest = new SocietyDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.socityService.GetSocietyByID(SocietyID, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckList_societyrequest = data['Data'][0];
          if (this.CheckList_societyrequest.AadhaarNo.length > 0) {
            const visibleDigits = 4;
            let maskedSection = this.CheckList_societyrequest.AadhaarNo.slice(0, -visibleDigits);
            let visibleSection = this.CheckList_societyrequest.AadhaarNo.slice(-visibleDigits);
            this.CheckList_societyrequest.MaskedAadhaarNo = maskedSection.replace(/./g, 'X') + visibleSection;
          }
          console.log(this.request);
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
      await this.mg1DocumentScrutinyService.DocumentScrutiny_BuildingDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
          this.buildingdetails.OwnerName = data['Data'][0]['data']['Table'][0]["OwnerName"];
          this.buildingdetails.AddressLine1 = data['Data'][0]['data']['Table'][0]["AddressLine1"];
          this.buildingdetails.AddressLine2 = data['Data'][0]['data']['Table'][0]["AddressLine2"];
          this.buildingdetails.RuralUrban = data['Data'][0]['data']['Table'][0]["RuralUrban"];
          this.buildingdetails.DivisionID = data['Data'][0]['data']['Table'][0]["DivisionID"];
          this.buildingdetails.Division_English = data['Data'][0]['data']['Table'][0]["Division_English"];
          this.buildingdetails.DistrictID = data['Data'][0]['data']['Table'][0]["DistrictID"];
          this.buildingdetails.District_Eng = data['Data'][0]['data']['Table'][0]["District_Eng"];

          if (this.buildingdetails.RuralUrban == 'Rural') {
            this.buildingdetails.TehsilID = data['Data'][0]['data']['Table'][0]["TehsilID"];
            this.buildingdetails.TehsilName = data['Data'][0]['data']['Table'][0]["TehsilName"];
            this.buildingdetails.PanchayatSamitiID = data['Data'][0]['data']['Table'][0]["PanchayatSamitiID"];
            this.buildingdetails.PanchyatSamitiName = data['Data'][0]['data']['Table'][0]["PanchyatSamitiName"];
          }
          this.buildingdetails.CityTownVillage = data['Data'][0]['data']['Table'][0]["CityTownVillage"];
          this.buildingdetails.ContactNo = data['Data'][0]['data']['Table'][0]["ContactNo"];
          this.buildingdetails.Pincode = data['Data'][0]['data']['Table'][0]["Pincode"];
          this.buildingdetails.OwnBuildingOrderNo = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderNo"];
          this.buildingdetails.OwnBuildingOrderDate = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderDate"];
          this.buildingdetails.OwnBuildingFileUpload = data['Data'][0]['data']['Table'][0]["OwnBuildingFileUpload"];
          this.buildingdetails.Dis_OwnBuildingFileUpload = data['Data'][0]['data']['Table'][0]["Dis_OwnBuildingFileUpload"];
          this.buildingdetails.OwnBuildingFileUploadPath = data['Data'][0]['data']['Table'][0]["OwnBuildingFileUploadPath"];
          this.buildingdetails.FromDate = data['Data'][0]['data']['Table'][0]["FromDate"];
          this.buildingdetails.ToDate = data['Data'][0]['data']['Table'][0]["ToDate"];
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

  async GetRequiredDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.mg1DocumentScrutinyService.DocumentScrutiny_CollegeDocument(this.SelectedDepartmentID, this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_DocumentDetails = data['Data'][0]['CollegeDocument'][0];

          this.RequiredDocument_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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

  //Start Hospital Parent
  async GetHospitalParentList() {
    try {
      this.loaderService.requestStarted();
      await this.mg1DocumentScrutinyService.DocumentScrutiny_HospitalDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_HospitalParentNotDataModelList = data['Data'][0]['HospitalDetails'];
          this.HospitalDetails_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
  //End Hospital Parent

  //Start FDR Details
  async GetFDRDetails() {
    try {
      this.loaderService.requestStarted();
      await this.mg1DocumentScrutinyService.DocumentScrutiny_FDRDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_FDRDetails = data['Data'][0]['FDRDetails'][0];
          this.FDR_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
  //End FDR Details

  //Start Payment Details
  async GetPaymentetails() {
    try {
      this.loaderService.requestStarted();
      await this.mg1DocumentScrutinyService.DocumentScrutiny_PaymentDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_PaymentDetails = data['Data'][0]['PaymentDetail'][0];
          this.Payment_FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
  //End Payment Details

  //Start NOCWorkFlowDock Details
  async GetNOCWorkFlowDock() {
    try {
      this.loaderService.requestStarted();
      await this.mgoneNOCService.GetNOCWorkFlowDock(this.SelectedApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.nocWorkFlowDock = data['Data'][0]['data'][0];
          console.log(this.nocWorkFlowDock);
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
  //End NOCWorkFlowDock Details


  async GetLegalEntityData() {
    try {
      await this.TrusteeGeneralInfoService.GetDataOfLegalEntity(this.sSOLoginDataModel.SSOID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.LegalEntityDataModel = JSON.parse(JSON.stringify(data['Data']));
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            // this.toastr.warning(this.SuccessMessage)
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

  //Document  Post Section
  public isNextRoleIDValid: boolean = false;
  public isNextUserIdValid: boolean = false;
  async DocumentScrutiny() {
    debugger;
    this.isFormvalid = true;
    this.isNextUserIdValid = false;
    this.isNextRoleIDValid = false;
    this.isNextActionValid = false;
    this.isRemarkValid = false;
    try {
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
        //if (this.NextActionID <= 0) {
        //  this.isNextActionValid = true;
        //  this.isFormvalid = false;
        //}
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
      if ((this.IsSummaryReport || this.IsMeetingNotice) && this.Filedoc == '') {
        this.FileValidationMessage = 'This field is required .!';
        this.isFormvalid = false;
      }
      if (this.IsMeetingNotice && this.MOMFiledoc == '') {
        this.MOMFileValidationMessage = 'This field is required .!';
        this.isFormvalid = false;
      }
      //if (this.sSOLoginDataModel.RoleID == 27 && this.PageStatus == 'FBJSDS' && this.ActionID==84) {
      //  if (this.ProposedMeetingDate == '' && this.ProposedMeetingTime == '') {
      //    this.isProposedMeetingDateValid = true;
      //    this.isProposedMeetingTimeValid = true;
      //    this.isFormvalid = false;
      //  }
      //}

      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      await this.mgoneNOCService.SaveNOCWorkFlow(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.ActionID, this.SelectedApplyNOCID, this.SelectedDepartmentID, this.CheckFinalRemark, this.NextRoleID, this.NextUserID, this.NextActionID, this.Filedoc, this.MOMFiledoc)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.routers.navigate(['/mgonenocapplicationlist']);
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
      await this.mgoneNOCService.GetRoleListForApporval(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          debugger;
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
      await this.mgoneNOCService.GetWorkFlowActionListByRole(this.NextRoleID, "Next", this.sSOLoginDataModel.DepartmentID, 'NOC', this.SelectedApplyNOCID)
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
      await this.mgoneNOCService.GetWorkFlowActionListByRole(this.sSOLoginDataModel.RoleID, "Current", this.sSOLoginDataModel.DepartmentID, 'NOC', this.SelectedApplyNOCID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.WorkFlowActionList = data['Data'];
            //remove duplicate actions
            if (this.sSOLoginDataModel.RoleID == 6 && this.PageStatus == 'FBC') {
              this.WorkFlowActionList = this.WorkFlowActionList.filter((x: {
                ActionName: string
                ;
              }) => x.ActionName == 'Forward Inspection Report');
            }
            if (this.sSOLoginDataModel.RoleID == 39 || (this.sSOLoginDataModel.RoleID == 6 && this.PageStatus == 'FBOSD')) {
              this.WorkFlowActionList = this.WorkFlowActionList.filter((x: {
                ActionName: string
                ;
              }) => x.ActionName == 'Forward Summary Report');
            }
            if (this.sSOLoginDataModel.RoleID == 6 && this.PageStatus == 'FBDF') {
              const allowedActions = ['Forward Meeting Proposal', 'Forward MOM'];
              this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionName: string }) =>
                allowedActions.includes(x.ActionName)
              );
              //this.WorkFlowActionList = this.WorkFlowActionList.filter((x: {
              //  ActionName: string
              //  ;
              //}) => x.ActionName == 'Forward Meeting Proposal');
            }
            if (this.sSOLoginDataModel.RoleID == 27 && this.PageStatus == 'FBJSDS') {
              const allowedActions = ['Provide Date & Time For Meeting', 'Forward MOM', 'Reject and Forward'];
              this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionName: string }) =>
                allowedActions.includes(x.ActionName)
              );
              //this.WorkFlowActionList = this.WorkFlowActionList.filter((x: {
              //  ActionName: string
              //  ;
              //}) => x.ActionName == 'Provide Date & Time For Meeting');
            }
            if (this.sSOLoginDataModel.RoleID == 6 && this.PageStatus == 'RBPS') {              
              const allowedActions = ['Inform Meeting Proposal','Revert to Dealing Officer'];
              this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionName: string }) =>
                allowedActions.includes(x.ActionName)
              );
              //this.WorkFlowActionList = this.WorkFlowActionList.filter((x: {
              //  ActionName: string
              //  ;
              //}) => x.ActionName == 'Inform Meeting Proposal');
            }
            //this.WorkFlowActionList = [...new Map(this.WorkFlowActionList.map(item =>
            //  [item['ActionName'], item])).values()];

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
    debugger;
    var IsNextAction = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsNextAction;
    //var ActionID = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.ActionID;
    //console.log(ActionID);
    if (IsNextAction == true) {
      this.ShowHideNextRoleNextUser = true;
    }
    else {
      this.ShowHideNextRoleNextUser = false;
    }
    //if (ActionID == 84) {
    //  this.ShowHideMeetingDateTime = true;
    //} else {
    //  this.ShowHideMeetingDateTime = false;
    //}
  }


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

  async onFilechange(event: any, type: string) {

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

  async DeleteImage(file: string, type: string) {
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
    if (type == 'MOM') {
      this.isShowMOMFile = isShowFile;
      this.MOMFileValidationMessage = msg;
      this.MOMFiledoc = name;
      this.MOMFiledocPath = path;
      this.MOMFiledoc_Dis_FileName = dis_Name;
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
}
