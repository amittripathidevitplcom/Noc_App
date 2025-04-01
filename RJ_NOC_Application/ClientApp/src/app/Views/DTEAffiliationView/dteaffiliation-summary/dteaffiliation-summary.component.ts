import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TrusteeGeneralInfoDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { LegalEntityDataModel } from '../../../Models/LegalEntityDataModel';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { SocityService } from '../../../Services/Master/SocietyManagement/socity.service';
import { LandDetailDataModel } from '../../../Models/TabDetailDataModel';
import { LandDetailsService } from '../../../Services/Tabs/LandDetails/land-details.service';
import { BuildingDetailsMasterService } from '../../../Services/BuildingDetailsMaster/building-details-master.service';
import { FacilityDetailsService } from '../../../Services/FicilityDetais/facility-details.service';
import { RoomDetailsService } from '../../../Services/RoomDetails/room-details.service';
import { OtherInformationService } from '../../../Services/OtherInformation/other-information.service';
import { StaffDetailService } from '../../../Services/StaffDetail/staff-detail.service';
import { AcademicInformationDetailsService } from '../../../Services/AcademicInformationDetails/academic-information-details.service';
import { FarmLandDetailService } from '../../../Services/FarmLandDetail/farm-land-detail.service';
import { OldnocdetailService } from '../../../Services/OldNOCDetail/oldnocdetail.service';
import { HostelDetailService } from '../../../Services/Tabs/hostel-details.service';
import { HospitalDetailService } from '../../../Services/Tabs/HospitalDetail/hospital-detail.service';
import { VeterinaryHospitalService } from '../../../Services/VeterinaryHospital/veterinary-hospital.service';
import { BTERApplicationPDFComponent } from '../../DTE_Affiliation/bterapplication-pdf/bterapplication-pdf.component';



@Component({
  selector: 'app-dteaffiliation-summary',
  templateUrl: './dteaffiliation-summary.component.html',
  styleUrls: ['./dteaffiliation-summary.component.css']
})



export class DTEAffiliationSummaryComponent implements OnInit {

  LegalEntityDataModel = new LegalEntityDataModel();
  TrusteeGeneralInfoList: TrusteeGeneralInfoDataModel[] = [];
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public legalEntityListData: any = [];
  public legalEntityListData1: any = [];
  public legalEntityInstituteDetailData: any = [];
  public legalEntityMemberDetailData: any = [];
  public TrustLogoDocPathfileExt: any = [];
  public TrusteeMemberProofDocPathfileExt: any = [];
  public PresidentAadhaarProofDocPathfileExt: any = [];
  public SocietyPanProofDocPathfileExt: any = [];

  public collegeListData: any = [];
  public collegeContactDetailsList: any = [];
  public collegeNearestGovernmentHospitalsList: any = [];
  public CollegeGeoTaggingList: any = [];
  public AllCourseList: any = [];
  public SocietyAllList: any = [];
  public LandDetailList: any = [];
  public UnitOfLand: string = '';
  public LandDetailsDocumentList: any = [];
  public lstBuildingDetailsDocument: any = [];
  public lstBuildingDetails: any = [];
  public FacilitiesDataAllList: any = [];
  public RoomDetails: any = [];
  public OtherInformation: any = [];

  public StaffDetaillst: any = [];
  public StaffEducationlst: any = [];
  public AcademicInformationList: any = [];
  public lstFarmLandDetails: any = [];
  public OldNocDetailslst: any = [];
  public OldNocSubjectlst: any = [];
  public DownloadPdfDetailslst: any = [];
  public hostelDetaillst: any = [];
  public HostelBlocklst: any = [];
  public IsShowSuperSpecialtyHospital: boolean = false;
  public HospitalAllDatalst: any = [];
  public ParaHospitallst: any = [];

  public vetHospitalDetaillst: any = [];
  public AnimalDetaillst: any = [];
  public SansthaBhavanlst: any = [];

  public CollegeType_IsExisting: boolean = true;
  public collegeDataList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();

  //public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public UserSSOID: string = '';
  public SearchRecordID: string = '';
  public AffiliationRegID: number = 0;
  public AffiliationRegStatus: any = '';
  public AffiliationCollegeStatusId: number = 0;  
  public LegalEntityManagementType: string = "";
  public SelectedDteAffiliationRegId: number = 0;
  public IsManagmentType: boolean = false;
  //public SelectedCollageID: number = 0;
  //public SelectedDepartmentID: number = 0;
  constructor(private roomDetailsService: RoomDetailsService, private facilityDetailsService: FacilityDetailsService, private buildingDetailsMasterService: BuildingDetailsMasterService, private landDetailsService: LandDetailsService, private socityService: SocityService, private draftApplicationListService: DraftApplicationListService, private TrusteeGeneralInfoService: TrusteeGeneralInfoService, private legalEntityListService: LegalEntityService, private modalService: NgbModal, private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService, private collegeService: CollegeService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private oldnocdetailService: OldnocdetailService, private hostelDetailService: HostelDetailService, private hospitalDetailService: HospitalDetailService, private veterinaryHospitalService: VeterinaryHospitalService,
    private otherInformationService: OtherInformationService, private staffDetailService: StaffDetailService, private academicInformationDetailsService: AcademicInformationDetailsService, private farmLandDetailServiceService: FarmLandDetailService, private elRef: ElementRef) { }

  async ngOnInit() {
    debugger;
    this.loaderService.requestStarted();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.AffiliationRegID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString()));
    this.AffiliationRegStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());
    this.AffiliationCollegeStatusId = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeStatusId')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //console.log(this.SelectedDepartmentID);
    //console.log(this.AffiliationRegID);
    //console.log(this.AffiliationRegStatus);
    //console.log(this.AffiliationCollegeStatusId);
    await this.GetCollageDetails();
    await this.GetDownloadPdfDetails();
    await this.GetApplicationDeficiency();
    await this.ViewlegalEntityDataByID(this.UserSSOID);
    this.loaderService.requestEnded();
    
  }
  public IsAHDegreeCollege: boolean = false;
  async GetCollageDetails() {
    try {
      this.IsAHDegreeCollege = false;
      this.loaderService.requestStarted();
      await this.collegeService.GetBterData(this.AffiliationRegID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.collegeDataList = data['Data'];
          this.UserSSOID = data['Data']['ParentSSOID'];
          //if (this.collegeDataList['CollegeStatus'] == 'New') {
          //  this.CollegeType_IsExisting = false;
          //  //this.isAcademicInformation = false;
          //}
          //if (this.collegeDataList['CollegeLevelName'] == 'UG' && this.collegeDataList['DepartmentID'] == 2) {
          //  this.IsAHDegreeCollege = true;
          //}
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
  async GetDownloadPdfDetails() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDownloadBTERPdfDetails(this.SelectedDepartmentID, this.AffiliationRegID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DownloadPdfDetailslst = data['Data'];
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
  @ViewChild('content') content: ElementRef | any;
  async btnViewPDfPreview(content: any) {   
    const modalRef = this.modalService.open(BTERApplicationPDFComponent,
      { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
    modalRef.componentInstance.AffiliationRegID = this.AffiliationRegID;
    modalRef.componentInstance.DepartmentID = this.SelectedDepartmentID;
    modalRef.componentInstance.Status = this.AffiliationRegStatus;

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

  //Get Preview genrate datamodel
  async GetDataOfLegalEntity() {
    this.loaderService.requestStarted();
    try {
      await this.TrusteeGeneralInfoService.GetDataOfLegalEntity(this.UserSSOID)
        .then(async (data: any) => {
          this.LegalEntityDataModel = JSON.parse(JSON.stringify(data['Data']));
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetDataList() {

    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.TrusteeGeneralInfoService.GetDataListForPDF(this.LegalEntityDataModel.LegalEntityID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (!this.State) {
            this.TrusteeGeneralInfoList = JSON.parse(JSON.stringify(data['Data']));
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
  //public IsManagmentType: boolean = false;
  async ViewlegalEntityDataByID(SSOID: any) {
    let UserID: number = 0;
    try {
      this.loaderService.requestStarted();
      await this.legalEntityListService.GetLegalEntityBySSOIDFForPDF(SSOID, UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.legalEntityListData1 = data['Data'][0]['data']['Table'][0];
          if (this.legalEntityListData1['ManagementType'] == 'Private') {
            this.IsManagmentType = true;
          }
          else {
            this.IsManagmentType = false;
          }

          this.legalEntityInstituteDetailData = data['Data'][0]['data']['Table1'];
          this.legalEntityMemberDetailData = data['Data'][0]['data']['Table2'];
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
  
  //Application Deficiency DO3
  public DCPendingPoint: string = '';
  async GetApplicationDeficiency() {
    try {
      let Femalepre = 0;
      this.loaderService.requestStarted();
      await this.commonMasterService.Check30Female(this.AffiliationRegID)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          data = JSON.parse(JSON.stringify(data));

          if (!this.State) {
            if (data['Data'][0]['data'][0]['TotalMember'] < 15) {
              this.DCPendingPoint += "Add Minimum 15 College Management Committee Members." + "</br>";
            }
            if (data['Data'][0]['data'][0]['Educationist'] < 2) {
              this.DCPendingPoint += "Add Minimum 2 Educationist College Management Committee Members." + "</br>";
            }
            Femalepre = data['Data'][0]['data'][0]['FemalePercentage'];
            if (Femalepre < 30) {
              this.DCPendingPoint += "Member list must have atleast 30% of Woman" + "</br>";
            }
            if (data['Data'][0]['data'][0]['PendingFacilities'] > 0) {
              this.DCPendingPoint += "Enter All Facilities Details." + "</br>";
            }
            if (data['Data'][0]['data'][0]['PendingOtherInformation'] > 0) {
              this.DCPendingPoint += "Enter All Other Information Details." + "</br>";
            }

            if (data['Data'][0]['data'][0]['PendingClassRoomDetails'] > 0) {
              this.DCPendingPoint += "Enter All Class Room Details." + "</br>";
            }

            if (data['Data'][0]['data'][0]['PendingClassWiseNoofRoomRoomDetails'] > 0) {
              this.DCPendingPoint += "Enter All Class Wise No of Room Details." + "</br>";
            }
            if (data['Data'][0]['data'][0]['PendingMinLandArea'] > 0) {
              this.DCPendingPoint += "Please Enter Min Land Area : " + data['Data'][0]['data'][0]['Dis_MinLandArea'] + " Sq. Feet" + "</br>";
            }
            if (this.CollegeType_IsExisting == true) {
              if (data['Data'][0]['data'][0]['PendingSubjectStaff'] > 0) {
                this.DCPendingPoint += "In the case of teaching, it is Mandatory to have teachers of all the subjects." + "</br>";
              }
            }
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
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

