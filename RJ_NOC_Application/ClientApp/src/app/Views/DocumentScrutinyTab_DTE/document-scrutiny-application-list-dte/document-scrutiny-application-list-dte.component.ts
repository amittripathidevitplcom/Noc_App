import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DTEDocumentScrutinyService } from '../../../Services/DTEDocumentScrutiny/dtedocument-scrutiny.service';
import { LegalEntityDataModel } from '../../../Models/LegalEntityDataModel';
import { TrusteeGeneralInfoDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { SocityService } from '../../../Services/Master/SocietyManagement/socity.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { OldnocdetailService } from '../../../Services/OldNOCDetail/oldnocdetail.service';
import { LandDetailsService } from '../../../Services/Tabs/LandDetails/land-details.service';
import { BuildingDetailsMasterService } from '../../../Services/BuildingDetailsMaster/building-details-master.service';
import { RoomDetailsService } from '../../../Services/RoomDetails/room-details.service';
import { OtherInformationService } from '../../../Services/OtherInformation/other-information.service';
import { FacilityDetailsService } from '../../../Services/FicilityDetais/facility-details.service';
import { StaffDetailService } from '../../../Services/StaffDetail/staff-detail.service';
import { AcademicInformationDetailsService } from '../../../Services/AcademicInformationDetails/academic-information-details.service';
import { HostelDetailService } from '../../../Services/Tabs/hostel-details.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { ApplyNocApplicationDataModel } from '../../../Models/ApplyNocParameterDataModel';

@Component({
  selector: 'app-document-scrutiny-application-list-dte',
  templateUrl: './document-scrutiny-application-list-dte.component.html',
  styleUrls: ['./document-scrutiny-application-list-dte.component.css']
})
export class DocumentScrutinyApplicationListDTEComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplicationDetails: any[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public ApplicationNo: string = '';

  sSOVerifyDataModel = new SSOLoginDataModel();

  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';

  AadhaarNo: string = '';

  public isLoading: boolean = false;
  public QueryStringStatus: any = '';
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  constructor(private loaderService: LoaderService, private toastr: ToastrService, private buildingDetailsMasterService: BuildingDetailsMasterService, private roomDetailsService: RoomDetailsService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private dteDocumentScrutinyService: DTEDocumentScrutinyService, private modalService: NgbModal, private legalEntityListService: LegalEntityService, private draftApplicationListService: DraftApplicationListService,
    private socityService: SocityService, private courseMasterService: CourseMasterService, private oldnocdetailService: OldnocdetailService, private landDetailsService: LandDetailsService,
    private otherInformationService: OtherInformationService, private facilityDetailsService: FacilityDetailsService, private staffDetailService: StaffDetailService, private academicInformationDetailsService: AcademicInformationDetailsService,
    private hostelDetailService: HostelDetailService, private applyNocParameterService: ApplyNocParameterService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
  }

  async GetApplicationList(RoleId: number, UserID: number, Status: string) {
    try {
      let ActionName = '';
      //if (this.sSOLoginDataModel.RoleID == 17) {
      //  ActionName = Status == 'Completed' ? 'Forward To Joint Secretary' : Status == 'Pending' ? 'Recommended by Inspection Committee,Not recommended by Inspection Committee' : Status == 'Revert' ? 'Revert after Inspection' : Status == 'Reject' ? 'Reject' : '';
      //}
      //else if (this.sSOLoginDataModel.RoleID == 34)
      //{
      //  ActionName = Status == 'Completed' ? 'Forward to Inspection Committee,Forward To Joint Secretary' : Status == 'Pending' ? 'Forward' : '';
      //}
      //else {
      ActionName = Status == 'Completed' ? 'Recommended by Inspection Committee,Not recommended by Inspection Committee,Forward to Inspection Committee,Forward To Joint Secretary,Deficiency (to be removed in 7 days)' : Status == 'Pending' ? 'Forward,Forward to Inspection Committee,Forward to Inspection Committee after inspection' : '';
      //}
      
      this.loaderService.requestStarted();
      await this.dteDocumentScrutinyService.GetApplyNOCApplicationList(RoleId, UserID, Status, ActionName)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationDetails = data['Data'][0];
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

  async DocumentScrutiny_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    this.routers.navigate(['/documentscrutinydte' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + this.QueryStringStatus + "/" + 'Step1']);
  }

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public ApplicationTrailList: any = [];
  async GetApplicationTrail(content: any, ApplyNOCID: number) {
    this.ApplicationTrailList = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetApplicationTrail_DepartmentApplicationWise(ApplyNOCID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationTrailList = data['Data'];
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
  async ApplicationSummary_OnClick(DepartmentID: number, CollegeID: number) {
    window.open('/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())), '_blank')
  }





  LegalEntityDataModel = new LegalEntityDataModel();
  TrusteeGeneralInfoList: TrusteeGeneralInfoDataModel[] = [];
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


  async btnViewPDfPreview(content: any, CollegeID: number, DepartmentID: number, SSOID: string, ApplyNOCID: number) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.SelectedCollageID = CollegeID;
      this.SelectedDepartmentID = DepartmentID;
      this.loaderService.requestStarted();
      await this.GetDownloadPdfDetails();
      await this.GetLegalEntity(SSOID);
      await this.GetCollegeDetails(CollegeID);
      await this.GetSocietyAllList();
      await this.GetAllCourse(SSOID, CollegeID);
      await this.GetOldNOCDetails(DepartmentID, CollegeID);
      await this.GetLandDetailsDataList();
      await this.GetAllBuildingDetailsList();
      await this.GetRoomDetailAllList();
      await this.GetOtherInformationAllList();
      await this.GetFacilityDetailAllList();
      await this.GetAllStaffDetailsList(DepartmentID, CollegeID);
      await this.GetAcademicInformationDetailAllList();
      await this.GetHostelDetailAllList(DepartmentID, CollegeID);
      await this.ViewApplyNocApplicationDetails(ApplyNOCID)
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

  public IsManagmentType: boolean = false;
  async GetLegalEntity(SSOID: any) {
    let UserID: number = 0;
    try {
      this.loaderService.requestStarted();
      await this.legalEntityListService.GetLegalEntityBySSOIDFForPDF(SSOID, UserID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          // data
          this.legalEntityListData1 = data['Data'][0]['data']['Table'][0];
          if (this.legalEntityListData1['ManagementType'] == 'Private') {
            this.IsManagmentType = true;
            this.legalEntityInstituteDetailData = data['Data'][0]['data']['Table1'];
            this.legalEntityMemberDetailData = data['Data'][0]['data']['Table2'];
          }
          else {
            this.IsManagmentType = false;
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
  public DTECollegeLevel: any = [];
  async GetCollegeDetails(CollegeID: any) {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.ViewTotalCollegeDataByID(CollegeID, 0)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.collegeListData = data['Data'][0]['data']['Table'][0];
          this.collegeContactDetailsList = data['Data'][0]['data']['Table1'];
          this.CollegeGeoTaggingList = data['Data'][0]['data']['Table3'];
          this.DTECollegeLevel = data['Data'][0]['data']['Table4'];
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
  async GetSocietyAllList() {
    try {

      this.loaderService.requestStarted();
      await this.socityService.GetSocietyAllList(0, this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SocietyAllList = data['Data'][0]['data'];
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
  async GetAllCourse(SSOID: string, CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetListDTE(0, SSOID, 0, CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AllCourseList = data['Data'][0]['data'];
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
  async GetOldNOCDetails(DepartmentID: number, CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.oldnocdetailService.GetOldNOCDetailListForPDF(DepartmentID, CollegeID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.OldNocDetailslst = data['Data'][0]['data']['Table'];
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
  async GetLandDetailsDataList() {
    try {
      this.loaderService.requestStarted();
      await this.landDetailsService.GetLandDetailsListForPDF(this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.LandDetailList = data['Data'][0]['data']['Table'];
          this.LandDetailsDocumentList = data['Data'][0]['data']['Table1'];

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

  async GetAllBuildingDetailsList() {
    try {
      this.loaderService.requestStarted();
      await this.buildingDetailsMasterService.GetAllBuildingDetailsList(0, this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstBuildingDetails = data['Data'][0]['data']['Table'];
          this.lstBuildingDetailsDocument = data['Data'][0]['data']['Table1'];
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

  async GetRoomDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.roomDetailsService.GetRoomDetailAllList(0, this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.RoomDetails = data['Data'][0]['data'];
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
  async GetOtherInformationAllList() {
    try {
      this.loaderService.requestStarted();
      await this.otherInformationService.GetOtherInformationAllList(0, this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.OtherInformation = data['Data'][0]['data'];
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
  async GetFacilityDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.facilityDetailsService.GetFacilityDetailAllList(0, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.FacilitiesDataAllList = data['Data'][0]['data'];
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
  async GetAllStaffDetailsList(DepartmentID: number, CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.staffDetailService.GetStaffDetailsListForPDF(DepartmentID, CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StaffDetaillst = data['Data'][0]['data']['Table'];
          this.StaffEducationlst = data['Data'][0]['data']['Table1'];
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
  async GetAcademicInformationDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.academicInformationDetailsService.GetAcademicInformationDetailAllList(0, this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AcademicInformationList = data['Data'][0]['data'];
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
  async GetHostelDetailAllList(DepartmentID: number, CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.hostelDetailService.GetHostelPdfDetails(DepartmentID, CollegeID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.hostelDetaillst = data['Data'][0]['data']['Table'];
          this.HostelBlocklst = data['Data'][0]['data']['Table1'];
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
  public ApplyNocApplicationDetail: ApplyNocApplicationDataModel = new ApplyNocApplicationDataModel();
  async ViewApplyNocApplicationDetails(applyNocApplicationID: number) {
    try {
      this.loaderService.requestStarted();
      // get
      await this.applyNocParameterService.GetApplyNocApplicationByApplicationID(applyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          // data
          if (this.State == 0) {
            this.ApplyNocApplicationDetail = data['Data'];
          }
          else {
            this.toastr.error(this.ErrorMessage);
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

  async GetDownloadPdfDetails() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDownloadPdfDetails(this.SelectedDepartmentID, this.SelectedCollageID)
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
  btnSavePDF_Click(): void {
    debugger
    this.loaderService.requestStarted();
    let dt = new Date();
    //let Imgpath = this.DownloadPdfDetailslst[0]["data"][0]["MemberSignature2"];
    try {
      let Heading1 = 'GOVERNMENT OF RAJASTHAN';
      let Heading2 = 'DIRECTORATE OF TECHNICAL EDUCATION, RAJASTHAN,';
      let Heading3 = 'W-6 RESIDENCY ROAD, JODHPUR-342032';
      let Heading4 = 'ACADEMIC SESSION '; //+ this.DownloadPdfDetailslst[0]["data"][0]["SessionYear"];
      let Heading5 = '';
      if (this.CollegeType_IsExisting)
        Heading5 = '(FOR EXISTING COLLEGE)';
      else
        Heading5 = '(FOR NEW COLLEGE)';
      let month = (Number(dt.getMonth()) + 1).toString();
      let day = (Number(dt.getDate())).toString();
      if (month.length == 1)
        month = '0' + month.toString();
      if (day.length == 1)
        day = '0' + day.toString();
      let Footer1 = 'DECLARATION';
      let Footer2 = 'ALL THE ABOVE INFORMATION PROVIDED BY ME IS TRUE AND OTHERWISE I ACCEPT TO WITHDRAW MY APPLICATION.';
      let Footer3 = 'PRINT DATE : - ' + dt.getFullYear() + '-' + month + '-' + day + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
      //let Footer4 = 'SIGNATURE WITH DATE';
      //let Footer5 = '(PRESIDENT/SECRETARY OF MANAGEMENT COMMITTEE)';
      let doc = new jsPDF('p', 'mm', [432, 279])
      doc.setDrawColor(0);
      doc.setFillColor(255, 0, 0);
      doc.setFontSize(12);

      let pDFData: any = [];
      if (this.IsManagmentType == true) {
        pDFData.push({ "ContentName": "#LegalBasicInfo" })
        pDFData.push({ "ContentName": "#TrusteeMemberDetails" })
        pDFData.push({ "ContentName": "#TrusteeGeneralDetails" })
        pDFData.push({ "ContentName": "#LegalMemberDetails" })
        pDFData.push({ "ContentName": "#LegalInstituteDetails" })
      }
      pDFData.push({ "ContentName": "#CollegeBasicInfo" })
      pDFData.push({ "ContentName": "#CollegeGeoTagging" })
      pDFData.push({ "ContentName": "#CollegeContactDetails" })
      pDFData.push({ "ContentName": "#CollegeGeneralContactDetails" })
      pDFData.push({ "ContentName": "#CollegeManagementSociety" })
      pDFData.push({ "ContentName": "#CourseBasicDetails" })




      if (this.CollegeType_IsExisting) {
        pDFData.push({ "ContentName": "#OldNocDetial" })
        pDFData.push({ "ContentName": "#StaffDetails" })
        pDFData.push({ "ContentName": "#AcademicInfo" })
      }
      pDFData.push({ "ContentName": "#LandDetails" })
      pDFData.push({ "ContentName": "#BuildingDetails" })
      pDFData.push({ "ContentName": "#RoomDetails" })
      pDFData.push({ "ContentName": "#OtherInfoDetails" })
      pDFData.push({ "ContentName": "#FacilityDetails" })
      pDFData.push({ "ContentName": "#HostelDetial" })
      pDFData.push({ "ContentName": "#ApplyNOCDetails" })


      for (var i = 0; i < pDFData.length; i++) {

        if (pDFData[i].ContentName == '#TrusteeMemberDetails') {
          autoTable(doc,
            {
              html: pDFData[i].ContentName,
              styles: { fontSize: 10, overflow: "linebreak" },
              headStyles: {
                fillColor: '#3f51b5',
                textColor: '#fff',
                halign: 'left',
                fontSize: 13
              },

              theme: 'plain',
              bodyStyles: {
                halign: 'left', valign: "top"
              },
              showHead: "everyPage",
              margin: {
                left: 16,
                right: 16,
                top: 35,
                bottom: 70
              },
              tableLineWidth: 0.5,
              didDrawPage: function (data) {
                // Header

                doc.setFontSize(13);
                doc.setTextColor("#161C22");

                doc.text(Heading1, 140, 10, { align: 'center', maxWidth: 100 });
                doc.setFontSize(12);
                doc.text(Heading2, 140, 15, { align: 'center', maxWidth: 200 });
                doc.setFontSize(12);
                doc.text(Heading3, 140, 20, { align: 'center', maxWidth: 100 });
                doc.setFontSize(10);
                doc.text(Heading4, 140, 25, { align: 'center', maxWidth: 150 });
                doc.setFontSize(8);
                doc.text(Heading5, 140, 30, { align: 'center', maxWidth: 100 });

                // Footer
                let str = "1";//+ doc.internal.getNumberOfPages();
                doc.setFontSize(13);


                let pageSize = doc.internal.pageSize;
                let pageHeight = pageSize.height
                  ? pageSize.height
                  : pageSize.getHeight();
                doc.line(264, 377, 15, 377)
                doc.setTextColor("#3f51b5");
                doc.text(Footer1, data.settings.margin.left, pageHeight - 50);
                doc.line(264, 385, 15, 385)
                doc.setFontSize(10);
                doc.setTextColor("#161C22");
                doc.text(Footer2, data.settings.margin.left, pageHeight - 43);
                doc.text(Footer3, data.settings.margin.left, pageHeight - 22);
                //doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                //doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                //doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
                doc.text(str, 575, 830);
              },
              didDrawCell: function (data) {
                //data.cell.height = 20;
                if ((data.column.index === 0) && data.row.index == 1 && data.cell.section === 'body') {
                  let td = data.cell.raw
                  var img = (td as HTMLTableCellElement).getElementsByTagName('img')[0];
                  var dim = data.cell.height - data.cell.padding('vertical');
                  //var textPos = data.cell.textPos;
                  doc.addImage(img.src, 'JPEG', data.cell.x + 2, data.cell.y + 2, dim, dim);
                }
              }
            }
          )
        }
        else if (pDFData[i].ContentName == '#TrusteeGeneralDetails') {
          autoTable(doc,
            {
              html: pDFData[i].ContentName,
              styles: { fontSize: 10, overflow: "linebreak" },
              headStyles: {
                fillColor: '#3f51b5',
                textColor: '#fff',
                halign: 'left',
                fontSize: 13
              },

              theme: 'plain',
              bodyStyles: {
                halign: 'left', valign: "top"
              },
              showHead: "everyPage",
              margin: {
                left: 16,
                right: 16,
                top: 35,
                bottom: 70
              },
              tableLineWidth: 0.5,
              didDrawPage: function (data) {
                // Header

                doc.setFontSize(13);
                doc.setTextColor("#161C22");

                doc.text(Heading1, 140, 10, { align: 'center', maxWidth: 100 });
                doc.setFontSize(12);
                doc.text(Heading2, 140, 15, { align: 'center', maxWidth: 200 });
                doc.setFontSize(12);
                doc.text(Heading3, 140, 20, { align: 'center', maxWidth: 100 });
                doc.setFontSize(10);
                doc.text(Heading4, 140, 25, { align: 'center', maxWidth: 150 });
                doc.setFontSize(8);
                doc.text(Heading5, 140, 30, { align: 'center', maxWidth: 100 });

                // Footer
                let str = "1";//+ doc.internal.getNumberOfPages();
                doc.setFontSize(13);


                let pageSize = doc.internal.pageSize;
                let pageHeight = pageSize.height
                  ? pageSize.height
                  : pageSize.getHeight();
                doc.line(264, 377, 15, 377)
                doc.setTextColor("#3f51b5");
                doc.text(Footer1, data.settings.margin.left, pageHeight - 50);
                doc.line(264, 385, 15, 385)
                doc.setFontSize(10);
                doc.setTextColor("#161C22");
                doc.text(Footer2, data.settings.margin.left, pageHeight - 43);
                doc.text(Footer3, data.settings.margin.left, pageHeight - 22);
                //doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                //doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                //doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
                doc.text(str, 575, 830);
              },
              didDrawCell: function (data) {
                //data.cell.height = 20;
                if ((data.column.index === 6) && data.row.index >= 1 && data.cell.section === 'body') {
                  let td = data.cell.raw
                  var img = (td as HTMLTableCellElement).getElementsByTagName('img')[0];
                  var dim = data.cell.height - data.cell.padding('vertical');
                  //var textPos = data.cell.textPos;
                  doc.addImage(img.src, 'JPEG', data.cell.x + 2, data.cell.y + 2, dim, dim);
                }
              }
            }
          )
        }
        else if (pDFData[i].ContentName == '#LegalMemberDetails') {
          autoTable(doc,
            {
              html: pDFData[i].ContentName,
              styles: { fontSize: 10, overflow: "linebreak" },
              headStyles: {
                fillColor: '#3f51b5',
                textColor: '#fff',
                halign: 'left',
                fontSize: 13
              },

              theme: 'plain',
              bodyStyles: {
                halign: 'left', valign: "top"
              },
              showHead: "everyPage",
              margin: {
                left: 16,
                right: 16,
                top: 35,
                bottom: 70
              },
              tableLineWidth: 0.5,
              didDrawPage: function (data) {
                // Header

                doc.setFontSize(13);
                doc.setTextColor("#161C22");

                doc.text(Heading1, 140, 10, { align: 'center', maxWidth: 100 });
                doc.setFontSize(12);
                doc.text(Heading2, 140, 15, { align: 'center', maxWidth: 200 });
                doc.setFontSize(12);
                doc.text(Heading3, 140, 20, { align: 'center', maxWidth: 100 });
                doc.setFontSize(10);
                doc.text(Heading4, 140, 25, { align: 'center', maxWidth: 150 });
                doc.setFontSize(8);
                doc.text(Heading5, 140, 30, { align: 'center', maxWidth: 100 });

                // Footer
                let str = "1";//+ doc.internal.getNumberOfPages();
                doc.setFontSize(13);


                let pageSize = doc.internal.pageSize;
                let pageHeight = pageSize.height
                  ? pageSize.height
                  : pageSize.getHeight();
                doc.line(264, 377, 15, 377)
                doc.setTextColor("#3f51b5");
                doc.text(Footer1, data.settings.margin.left, pageHeight - 50);
                doc.line(264, 385, 15, 385)
                doc.setFontSize(10);
                doc.setTextColor("#161C22");
                doc.text(Footer2, data.settings.margin.left, pageHeight - 43);
                doc.text(Footer3, data.settings.margin.left, pageHeight - 22);
                //doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                //doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                //doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
                doc.text(str, 575, 830);
              },
              didDrawCell: function (data) {
                //data.cell.height = 20;
                if ((data.column.index === 7 || data.column.index === 8) && data.row.index >= 1 && data.cell.section === 'body') {
                  let td = data.cell.raw
                  var img = (td as HTMLTableCellElement).getElementsByTagName('img')[0];
                  var dim = data.cell.height - data.cell.padding('vertical');
                  //var textPos = data.cell.textPos;
                  doc.addImage(img.src, 'JPEG', data.cell.x + 2, data.cell.y + 2, dim, dim);
                }
              }
            }
          )
        }
        else if (pDFData[i].ContentName == '#CollegeBasicInfo') {
          autoTable(doc,
            {
              html: pDFData[i].ContentName,
              styles: { fontSize: 10, overflow: "linebreak" },
              headStyles: {
                fillColor: '#3f51b5',
                textColor: '#fff',
                halign: 'left',
                fontSize: 13
              },

              theme: 'plain',
              bodyStyles: {
                halign: 'left', valign: "top"
              },
              showHead: "everyPage",
              margin: {
                left: 16,
                right: 16,
                top: 35,
                bottom: 70
              },
              tableLineWidth: 0.5,
              didDrawPage: function (data) {

                //doc.addFileToVFS('MANGAL.ttf', Mangal)
                //doc.addFont('MANGAL.ttf', 'MANGAL', 'normal');
                //doc.setFont('MANGAL', 'normal');
                doc.setFontSize(13);
                doc.setTextColor("#161C22");

                doc.text(Heading1, 140, 10, { align: 'center', maxWidth: 100 });
                doc.setFontSize(12);
                doc.text(Heading2, 140, 15, { align: 'center', maxWidth: 200 });
                doc.setFontSize(12);
                doc.text(Heading3, 140, 20, { align: 'center', maxWidth: 100 });
                doc.setFontSize(10);
                doc.text(Heading4, 140, 25, { align: 'center', maxWidth: 150 });
                doc.setFontSize(8);
                doc.text(Heading5, 140, 30, { align: 'center', maxWidth: 100 });

                // Footer
                let str = "1";//+ doc.internal.getNumberOfPages();
                doc.setFontSize(13);


                let pageSize = doc.internal.pageSize;
                let pageHeight = pageSize.height
                  ? pageSize.height
                  : pageSize.getHeight();
                doc.line(264, 377, 15, 377)
                doc.setTextColor("#3f51b5");
                doc.text(Footer1, data.settings.margin.left, pageHeight - 50);
                doc.line(264, 385, 15, 385)
                doc.setFontSize(10);
                doc.setTextColor("#161C22");
                doc.text(Footer2, data.settings.margin.left, pageHeight - 43);
                doc.text(Footer3, data.settings.margin.left, pageHeight - 22);
                //doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                //doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                //doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
                doc.text(str, 575, 830);
              },
              didDrawCell: function (data) {
                //data.cell.height = 20;
                if ((data.column.index === 0) && data.row.index == 1 && data.cell.section === 'body') {
                  let td = data.cell.raw
                  var img = (td as HTMLTableCellElement).getElementsByTagName('img')[0];
                  var dim = data.cell.height - data.cell.padding('vertical');
                  //var textPos = data.cell.textPos;
                  doc.addImage(img.src, 'JPEG', data.cell.x + 35, data.cell.y + 2, 10, 10);
                }
              }
            }
          )
        }
        else if (pDFData[i].ContentName == '#StaffDetails') {
          autoTable(doc,
            {
              html: pDFData[i].ContentName,
              styles: { fontSize: 10, overflow: "linebreak" },
              headStyles: {
                fillColor: '#3f51b5',
                textColor: '#fff',
                halign: 'left',
                fontSize: 13
              },

              theme: 'plain',
              bodyStyles: {
                halign: 'left', valign: "top"
              },
              showHead: "everyPage",
              margin: {
                left: 16,
                right: 16,
                top: 35,
                bottom: 70
              },
              tableLineWidth: 0.5,
              didDrawPage: function (data) {
                // Header

                doc.setFontSize(13);
                doc.setTextColor("#161C22");

                doc.text(Heading1, 140, 10, { align: 'center', maxWidth: 100 });
                doc.setFontSize(12);
                doc.text(Heading2, 140, 15, { align: 'center', maxWidth: 200 });
                doc.setFontSize(12);
                doc.text(Heading3, 140, 20, { align: 'center', maxWidth: 100 });
                doc.setFontSize(10);
                doc.text(Heading4, 140, 25, { align: 'center', maxWidth: 150 });
                doc.setFontSize(8);
                doc.text(Heading5, 140, 30, { align: 'center', maxWidth: 100 });

                // Footer
                let str = "1";//+ doc.internal.getNumberOfPages();
                doc.setFontSize(13);


                let pageSize = doc.internal.pageSize;
                let pageHeight = pageSize.height
                  ? pageSize.height
                  : pageSize.getHeight();
                doc.line(264, 377, 15, 377)
                doc.setTextColor("#3f51b5");
                doc.text(Footer1, data.settings.margin.left, pageHeight - 50);
                doc.line(264, 385, 15, 385)
                doc.setFontSize(10);
                doc.setTextColor("#161C22");
                doc.text(Footer2, data.settings.margin.left, pageHeight - 43);
                doc.text(Footer3, data.settings.margin.left, pageHeight - 22);
                //doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                //doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                //doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
                doc.text(str, 575, 830);
              },
              didDrawCell: function (data) {
                if ((data.column.index === 1) && data.row.index >= 1 && data.cell.section === 'body') {
                  let td = data.cell.raw
                  var img = (td as HTMLTableCellElement).getElementsByTagName('img')[0];
                  var dim = data.cell.height - data.cell.padding('vertical');
                  //var textPos = data.cell.textPos;
                  doc.addImage(img.src, 'JPEG', data.cell.x + 2, data.cell.y + 2, 11, 20);
                }
              }
            }
          )
        }
        else {
          if (pDFData[i].ContentName == '#CollegeManagementSociety') {
            doc.addPage();
          }
          //doc.rect(15, 35, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 45, 'S');
          autoTable(doc,
            {
              html: pDFData[i].ContentName,
              styles: { fontSize: 10, overflow: "linebreak" },
              headStyles: {
                fillColor: '#3f51b5',
                textColor: '#fff',
                halign: 'left',
                fontSize: 13
              },
              bodyStyles: {
                halign: 'left', valign: "top"
              },
              showHead: "everyPage",
              margin: {
                left: 16,
                right: 16,
                top: 35,
                bottom: 70
              },
              //alternateRowStyles: {
              //  fillColor: '#CCC',
              //  textColor: '#fff',
              //  halign: 'center',
              //  fontSize: 10
              //},
              tableLineWidth: 0.5,
              didDrawPage: function (data) {
                // Header
                doc.setFontSize(13);
                doc.setTextColor("#161C22");

                doc.text(Heading1, 140, 10, { align: 'center', maxWidth: 100 });
                doc.setFontSize(12);
                doc.text(Heading2, 140, 15, { align: 'center', maxWidth: 200 });
                doc.setFontSize(12);
                doc.text(Heading3, 140, 20, { align: 'center', maxWidth: 100 });
                doc.setFontSize(10);
                doc.text(Heading4, 140, 25, { align: 'center', maxWidth: 150 });
                doc.setFontSize(8);
                doc.text(Heading5, 140, 30, { align: 'center', maxWidth: 100 });

                // Footer
                let str = "1";//+ doc.internal.getNumberOfPages();
                doc.setFontSize(13);


                let pageSize = doc.internal.pageSize;
                let pageHeight = pageSize.height
                  ? pageSize.height
                  : pageSize.getHeight();
                doc.line(264, 377, 15, 377)
                doc.setTextColor("#3f51b5");
                doc.text(Footer1, data.settings.margin.left, pageHeight - 50);
                doc.line(264, 385, 15, 385)
                doc.setFontSize(10);
                doc.setTextColor("#161C22");
                doc.text(Footer2, data.settings.margin.left, pageHeight - 43);
                doc.text(Footer3, data.settings.margin.left, pageHeight - 22);
                //doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                //doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                //doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
                doc.text(str, 575, 830);
              }
            }
          )
          //doc.rect(15, 35, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 45, 'S');
        }
      }
      doc.save("ApplicationSummery" + '.pdf');
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

