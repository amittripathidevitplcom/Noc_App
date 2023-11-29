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
import { MGOneDocumentScrutinyService } from '../../../Services/MGOneDocumentScrutiny/mgonedocument-scrutiny.service';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-application-final-check-list-mgone',
  templateUrl: './application-final-check-list-mgone.component.html',
  styleUrls: ['./application-final-check-list-mgone.component.css']
})
export class ApplicationFinalCheckListMGOneComponent implements OnInit {
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

  constructor( private medicalDocumentScrutinyService: MedicalDocumentScrutinyService, private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private landDetailsService: LandDetailsService, private mg1documentScrutinyService: MGOneDocumentScrutinyService, private facilityDetailsService: FacilityDetailsService,
    private roomDetailsService: RoomDetailsService, private staffDetailService: StaffDetailService, private TrusteeGeneralInfoService: TrusteeGeneralInfoService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private collegeService: CollegeService) { }



  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('LOIID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetLandDetailsDataList();
    this.ViewlegalEntityDataByID();
    this.GetSocietyAllList();
    this.ViewTotalCollegeDataByID();
    this.GetAllBuildingDetailsList();
    this.GetHospitalDataList();
    this.GetRequiredDocuments('Required Document');
    this.GetRoleListForApporval();
    this.GetWorkFlowActionListByRole();
    this.GetCollageDetails();
    this.CheckTabsEntry();
  }


  // Start Land Details

  async GetLandDetailsDataList() {

    try {
      this.loaderService.requestStarted();
      await this.mg1documentScrutinyService.DocumentScrutiny_LandDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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

  //Legal Entity
  async ViewlegalEntityDataByID() {
    try {
      this.loaderService.requestStarted();
      await this.mg1documentScrutinyService.DocumentScrutiny_LegalEntity(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.mg1documentScrutinyService.DocumentScrutiny_CollegeDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.mg1documentScrutinyService.DocumentScrutiny_CollegeManagementSociety(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
      await this.mg1documentScrutinyService.DocumentScrutiny_BuildingDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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

  //Start Required Documents
  async GetRequiredDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.mg1documentScrutinyService.DocumentScrutiny_CollegeDocument(this.SelectedDepartmentID, this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, Type)
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
            this.CheckList_HospitalParentNotDataModelList = data['Data'][0]['HospitalDetails'];
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

      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      await this.collegeService.SaveLOIWorkFlow(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.ActionID, this.SelectedApplyNOCID, this.SelectedDepartmentID, this.CheckFinalRemark, this.NextRoleID, this.NextUserID, this.NextActionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.routers.navigate(['/documentscrutinylistmgone/Pending']);
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
      await this.mg1documentScrutinyService.CheckDocumentScrutinyTabsData(this.SelectedApplyNOCID, this.sSOLoginDataModel.RoleID, this.SelectedCollageID)
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
}
