import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { DocumentScrutinyDataModel } from '../../Models/DocumentScrutinyDataModel';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CourseMasterService } from '../../Services/Master/AddCourse/course-master.service';
import { ApplyNOCApplicationService } from '../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { PreviewLandDetailComponent } from '../PreviewTabs/preview-land-detail/preview-land-detail.component';

import { LandDetailDataModel } from '../../Models/LandDetailDataModel';
import { LandDetailsService } from '../../Services/Tabs/LandDetails/land-details.service'
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MedicalDocumentScrutinyService } from '../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';



import { FacilityDetailsDataModel } from '../../Models/FacilityDetailsDataModel';
import { FacilityDetailsService } from '../../Services/FicilityDetais/facility-details.service';
import { HostelDataModel, HostelDetailsDataModel_Hostel } from '../../Models/HostelDetailsDataModel';

import { RoomDetailsDataModel_RoomDetails } from '../../Models/RoomDetailsDataModel';
import { RoomDetailsService } from '../../Services/RoomDetails/room-details.service';


import { BuildingDetailsMasterService } from '../../Services/BuildingDetailsMaster/building-details-master.service'
import { BuildingDetailsDataModel, DocuemntBuildingDetailsDataModel, OldNocDetailsDataModel } from '../../Models/TabDetailDataModel';

import { StaffDetailDataModel } from '../../Models/TabDetailDataModel';
import { StaffDetailService } from '../../Services/StaffDetail/staff-detail.service';
import { RequiredDocumentsDataModel, RequiredDocumentsDataModel_Documents } from '../../Models/TabDetailDataModel'

import { OtherInformationDataModel } from '../../Models/OtherInformationDataModel';
import { AcademicInformationDetailsDataModel } from '../../Models/AcademicInformationDetailsDataModel';
import { HospitalDataModel, HospitalParentNotDataModel } from '../../Models/HospitalDataModel';


@Component({
  selector: 'app-apply-nocpreview',
  templateUrl: './apply-nocpreview.component.html',
  styleUrls: ['./apply-nocpreview.component.css']
})
export class ApplyNOCPreviewComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public dropdownSettings: IDropdownSettings = {};

  @ViewChild('tabs') tabGroup!: MatTabGroup;
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

  public CheckList_legalEntityListData1: any = [];
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

  public HostelDetailFinalRemarks: any = [];

  public TotalStaffDetail: number = 0;
  public TotalNonTeachingStaffDetail: number = 0;
  public TotalTeachingStaffDetail: number = 0;


  public CheckList_OldNocDetails: OldNocDetailsDataModel[] = [];
  public OldNOC_FinalRemarks: any = [];


  public CheckFinalRemark: string = '';

  constructor(private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private landDetailsService: LandDetailsService, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService, private facilityDetailsService: FacilityDetailsService,
    private roomDetailsService: RoomDetailsService, private staffDetailService: StaffDetailService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal) { }



  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.sSOLoginDataModel.RoleID = 0;
    this.GetLandDetailsDataList();
    this.GetFacilityDetailAllList();

    this.ViewlegalEntityDataByID(this.sSOLoginDataModel.SSOID);
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
    this.maxNumberOfTabs = this.tabGroup._tabs.length - 1;
  }

  NextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  PreviousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

  async DocumentScrutiny(ActionType: string) {
    this.isRemarkValid = false;
    try {
      if (this.CheckFinalRemark == '') {
        this.isRemarkValid = true;
        return;
      }
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.DocumentScrutiny(this.RoleID, this.UserID, ActionType, this.SelectedApplyNOCID, this.SelectedDepartmentID, this.CheckFinalRemark)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.routers.navigate(['/applynocapplicationlist']);
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

  // Start Land Details

  async GetLandDetailsDataList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_LandDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
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
  async ViewlegalEntityDataByID(SSOID: any) {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_LegalEntity(SSOID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.CheckList_legalEntityListData1 = data['Data'][0]['legalEntity'];
          this.CheckList_legalEntityInstituteDetailData = data['Data'][0]['legalEntity']['InstituteDetails'];
          this.CheckList_legalEntityMemberDetailData = data['Data'][0]['legalEntity']['MemberDetails'];
          this.LegalEntityFinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
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
  }
