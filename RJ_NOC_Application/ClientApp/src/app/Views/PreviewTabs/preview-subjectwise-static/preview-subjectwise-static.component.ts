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
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ToastrService } from 'ngx-toastr';
import { HostelDataModel } from '../../../Models/HostelDetailsDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { LegalEntityDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { DocumentScrutinyComponent } from '../../DCE/document-scrutiny/document-scrutiny.component';


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-preview-subjectwise-static',
  templateUrl: './preview-subjectwise-static.component.html',
  styleUrls: ['./preview-subjectwise-static.component.css']
})
export class PreviewSubjectwiseStaticComponent implements OnInit {

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



  constructor(private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private dcedocumentScrutinyService: DCEDocumentScrutinyService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private collegeService: CollegeService,
    private dcedocumentscrutiny: DocumentScrutinyComponent) { }



  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    this.GetSubjectWiseStudenetDetails();

  }


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

}
