import { Component, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { DocumentScrutinyDataModel } from '../../Models/DocumentScrutinyDataModel';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ApplyNOCApplicationService } from '../../Services/ApplyNOCApplicationList/apply-nocapplication.service';

import { LandDetailDataModel } from '../../Models/LandDetailDataModel';
import { LandDetailsService } from '../../Services/Tabs/LandDetails/land-details.service'
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FacilityDetailsDataModel } from '../../Models/FacilityDetailsDataModel';
import { FacilityDetailsService } from '../../Services/FicilityDetais/facility-details.service';
import { HostelDataModel, HostelDetailsDataModel_Hostel } from '../../Models/HostelDetailsDataModel';

import { RoomDetailsDataModel_RoomDetails } from '../../Models/RoomDetailsDataModel';
import { RoomDetailsService } from '../../Services/RoomDetails/room-details.service';

import { BuildingDetailsDataModel, DocuemntBuildingDetailsDataModel, OldNocDetailsDataModel } from '../../Models/TabDetailDataModel';

import { StaffDetailDataModel } from '../../Models/TabDetailDataModel';
import { StaffDetailService } from '../../Services/StaffDetail/staff-detail.service';
import { RequiredDocumentsDataModel, RequiredDocumentsDataModel_Documents } from '../../Models/TabDetailDataModel'

import { OtherInformationDataModel } from '../../Models/OtherInformationDataModel';
import { AcademicInformationDetailsDataModel } from '../../Models/AcademicInformationDetailsDataModel';
import { HospitalDataModel, HospitalParentNotDataModel } from '../../Models/HospitalDataModel';
import { CollegeService } from '../../services/collegedetailsform/College/college.service';
import { AgricultureDocumentScrutinyService } from '../../Services/AgricultureDocumentScrutiny/agriculture-document-scrutiny.service';
import { AgriDocumentScrutinyCheckListDetailsComponent } from '../DocumentScrutinyTab_Agri/agri-document-scrutiny-check-list-details/agri-document-scrutiny-check-list-details.component';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-apply-nocpreview-agriculture',
  templateUrl: './apply-nocpreview-agriculture.component.html',
  styleUrls: ['./apply-nocpreview-agriculture.component.css']
})
export class ApplyNocpreviewAgricultureComponent implements OnInit {

  @ViewChild('tabs') tabGroup!: MatTabGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public dropdownSettings: IDropdownSettings = {};
  public lstTarils: any = [];

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

  public RoleID: number = 0;
  public UserID: number = 0;

  ApprovedCount: number = 0;
  RevertCount: number = 0;
  RejectCount: number = 0;
  TotalCount: number = 0;
  public AllTabDocumentScrutinyData: any = [];
  public DocumentScrutinyButtonText: string = '';
  public ApplicationNo: string = '';
  @ViewChild('TarilMymodal') tarilMymodal: TemplateRef<any> | undefined;


  @ViewChild(AgriDocumentScrutinyCheckListDetailsComponent)
  private checkListDetailsComponent_New!: AgriDocumentScrutinyCheckListDetailsComponent;

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
  constructor(private agricultureDocumentScrutinyService: AgricultureDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private landDetailsService: LandDetailsService, private facilityDetailsService: FacilityDetailsService,
    private roomDetailsService: RoomDetailsService, private staffDetailService: StaffDetailService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private collegeService: CollegeService) { }

  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.ApplicationNo = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoYear')?.toString()) + "/" + this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoID')?.toString());
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetCollageDetails();
    await this.CheckTabsEntry();
    debugger;
    if (this.tabGroup != null)
      this.maxNumberOfTabs = this.tabGroup._tabs.length - 1;
    else {
      if (this.CollegeType_IsExisting) {
        this.maxNumberOfTabs = 14;
      }
      else {
        this.maxNumberOfTabs = 11;
      }
    }
  }

  NextStep() {
    debugger;
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
    if (this.selectedIndex == this.maxNumberOfTabs) {
      this.checkListDetailsComponent_New.ngOnInit();
    }
    this.CheckTabsEntry();
  }

  PreviousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }

    this.CheckTabsEntry();
  }

  onTabChange(event: MatTabChangeEvent) {
    debugger;
    this.selectedIndex = event.index;
    if (this.selectedIndex == this.maxNumberOfTabs) {
      this.checkListDetailsComponent_New.ngOnInit();
    }

    this.CheckTabsEntry();
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

  public CheckTabsEntryData: any = [];
  async CheckTabsEntry() {
    try {
      this.loaderService.requestStarted();
      await this.agricultureDocumentScrutinyService.CheckDocumentScrutinyTabsData(this.SelectedApplyNOCID, this.sSOLoginDataModel.RoleID, this.SelectedCollageID)
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

  public ViewTarilCommon(ID: number, ActionType: string) {
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
