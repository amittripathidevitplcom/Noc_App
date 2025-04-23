


import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';

import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TrusteeGeneralInfoDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { LegalEntityDataModel } from '../../../Models/LegalEntityDataModel';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { SocityService } from '../../../Services/Master/SocietyManagement/socity.service';
import { CourtOrderSearchFilterDataModel, LandDetailDataModel } from '../../../Models/TabDetailDataModel';
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
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service';
import { ApplyNocApplicationDataModel } from '../../../Models/ApplyNocParameterDataModel';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { ActivityDetailsService } from '../../../Services/ActivityDetails/activity-details.service';
import { CourtOrderService } from '../../../Services/Tabs/court-order.service';
import { CollegeDocumentService } from '../../../Services/Tabs/CollegeDocument/college-document.service';
import { DTEAffiliationAddCourseService } from '../../../Services/DTEAffiliation/DTEAffiliationAddCourse/dte-affiliation-add-course.service';
import { DTEAffiliationOtherDetailsService } from '../../../Services/DTEAffiliation/DTEAffiliationOtherDetails/dte-affiliation-other-details.service';


@Component({
  selector: 'app-bterapplication-pdf',
  templateUrl: './bterapplication-pdf.component.html',
  styleUrls: ['./bterapplication-pdf.component.css']
})



export class BTERApplicationPDFComponent implements OnInit {

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
  searchrequest = new CourtOrderSearchFilterDataModel();
  public courtOrderDataList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;


  @Input() AffiliationRegID: any;
  @Input() DepartmentID: any;
  @Input() Status: any;

  public paymentResponseDataModel: any[] = [];
  public PaymentHistoryDetails: any[] = [];
  public OfflinePaymentDataModel: any[] = [];
  public AffiliationRegStatus: any = '';
  public BTERRegID: number = 0;
  public Name: string = '';
  public DTEARNID: number = 0;
  public ApplyAffiliation: string = '';
  public SearchRecordID: string = '';
  public SelectedDepartmentID: number = 0; 
  public SSOID: string = '';
  public QueryStringStatus: string = 'Web'
  public AllDTEAffiliationCourseList: any = [];
  public DTEAffiliationOtherDetailsPreviewData: any = [];
  constructor(public activeModal: NgbActiveModal, private buildingDetailsMasterService: BuildingDetailsMasterService, private landDetailsService: LandDetailsService, private socityService: SocityService, private draftApplicationListService: DraftApplicationListService, private TrusteeGeneralInfoService: TrusteeGeneralInfoService, private legalEntityListService: LegalEntityService, private modalService: NgbModal, private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService, private collegeService: CollegeService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private oldnocdetailService: OldnocdetailService, private hostelDetailService: HostelDetailService, private hospitalDetailService: HospitalDetailService, private veterinaryHospitalService: VeterinaryHospitalService,
    private otherInformationService: OtherInformationService, private staffDetailService: StaffDetailService, private academicInformationDetailsService: AcademicInformationDetailsService, private farmLandDetailServiceService: FarmLandDetailService, private elRef: ElementRef,
    private nocpaymentService: NocpaymentService, private applyNocParameterService: ApplyNocParameterService,
    private ActivityDetailsService: ActivityDetailsService, private courtOrderService: CourtOrderService, private collegeDocumentService: CollegeDocumentService, private dTEAffiliationAddCourseService: DTEAffiliationAddCourseService, private dteaffiliationOtherDetailsService: DTEAffiliationOtherDetailsService
  ) { }

  async ngOnInit() { 
  // this.loaderService.requestStarted();  
   
    this.SelectedDepartmentID = this.DepartmentID;
    this.BTERRegID = this.AffiliationRegID;
    this.AffiliationRegStatus = this.Status    
    console.log(this.AffiliationRegStatus);
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SSOID = this.sSOLoginDataModel.SSOID;   
      
     await this.GetCollageDetails();
     await this.GetDownloadPdfDetails();   
    await this.ViewlegalEntityDataByID(this.UserSSOID);    
     await this.GetDataOfLegalEntity();
     await this.GetDataList();
    await this.ViewTotalCollegeDataByID(this.BTERRegID);
    await this.GetAllDTEAffiliationCourseList();
     await this.GetDTEAffiliationOtherDetailsPreviewData();    
    await this.GetPreviewPaymentDetails(this.BTERRegID);
    await this.GetApplyBTERPaymentHistoryApplicationID();
    // this.loaderService.requestEnded();
  }
  public UserSSOID: string = '';
  async GetCollageDetails() {
    
    try {

      this.loaderService.requestStarted();
      await this.collegeService.GetBterData(this.BTERRegID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.collegeDataList = data['Data'];
          this.UserSSOID = data['Data']['ParentSSOID'];
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
  async GetDownloadPdfDetails() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDownloadBTERPdfDetails(this.SelectedDepartmentID, this.BTERRegID)
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
  btnSavePDF_Click(): void {
    debugger;
    this.loaderService.requestStarted();
    let dt = new Date();
    let Imgpath = ''
    if (this.DownloadPdfDetailslst.length > 0 && this.DownloadPdfDetailslst[0]["data"].length > 0 && this.DownloadPdfDetailslst[0]["data"][0]["MemberSignature2"] != null && this.DownloadPdfDetailslst[0]["data"][0]["MemberSignature2"] != '') {
      Imgpath = this.DownloadPdfDetailslst[0]["data"][0]["MemberSignature2"];
    }
    else {
      Imgpath = "../../../assets/images/userImg.jpg";
    }
    let DefaultImg = "../../../assets/images/userImg.jpg";
    try {
      let Heading1 = 'GOVERNMENT OF RAJASTHAN';
      let Heading2 = '';
      let Heading3 = '';
      let Heading4 = 'Affiliation SESSION ' + this.DownloadPdfDetailslst[0]["data"][0]["SessionYear"];
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
      let Footer4 = 'SIGNATURE WITH DATE';
      let Footer5 = '(PRESIDENT/SECRETARY OF MANAGEMENT COMMITTEE)';
      let doc = new jsPDF('p', 'mm', [432, 279])
      doc.setDrawColor(0);
      doc.setFillColor(255, 0, 0);
      doc.setFontSize(12);

      let pDFData: any = [];
      
      if (this.IsManagmentType) {
        pDFData.push({ "ContentName": "#LegalBasicInfo" })
        pDFData.push({ "ContentName": "#TrusteeMemberDetails" })
       // pDFData.push({ "ContentName": "#TrusteeGeneralDetails" })
        pDFData.push({ "ContentName": "#LegalMemberDetails" })
        pDFData.push({ "ContentName": "#LegalInstituteDetails" })
      }
      pDFData.push({ "ContentName": "#CollegeBasicInfo" })      
      pDFData.push({ "ContentName": "#CollegeContactDetails" })
      pDFData.push({ "ContentName": "#CollegeGeneralContactDetails" })
      pDFData.push({ "ContentName": "#CourseBasicDetails" })
      pDFData.push({ "ContentName": "#BTEROtherDetails" })
      console.log(this.PaymentHistoryDetails);
      if (this.PaymentHistoryDetails.length > 0) {
        pDFData.push({ "ContentName": "#OnlinePayment" })
      }
      //pDFData.push({ "ContentName": "#ApplyNOCDetails" })
      for (var i = 0; i < pDFData.length; i++)
      {

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
                doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                try {
                  doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                } catch (e) {
                  //doc.addImage(DefaultImg, 214, down, 40, 13, 'JPG');
                }

                doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
                doc.text(str, 575, 830);
              }
            }
          )
          //doc.rect(15, 35, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 45, 'S');
        }
    
      doc.save("BTERApplicationSummery" + '.pdf');
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
  public IsManagmentType: boolean = false;
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
  public DTECollegeLevel: any = [];
  async ViewTotalCollegeDataByID(AffiliationRegID: any) {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.ViewBTERTotalCollegeDataByID(AffiliationRegID, 0)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.collegeListData = data['Data'][0]['data']['Table'][0];
          this.collegeContactDetailsList = data['Data'][0]['data']['Table1'];
          this.collegeNearestGovernmentHospitalsList = data['Data'][0]['data']['Table2'];
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
  async GetAllDTEAffiliationCourseList() {
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationAddCourseService.GetAllDTEAffiliationCourseList(this.BTERRegID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AllDTEAffiliationCourseList = data['Data'];
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
  async GetDTEAffiliationOtherDetailsPreviewData() {
    try {
      this.loaderService.requestStarted();
      await this.dteaffiliationOtherDetailsService.GetDTEAffiliationOtherDetailsPreviewData(this.BTERRegID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.DTEAffiliationOtherDetailsPreviewData = data['Data'][0];
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
  
  async GetPreviewPaymentDetails(AffiliationRegID: number) {
    try {

      this.loaderService.requestStarted();
      await this.nocpaymentService.GetBTERPreviewPaymentDetails(AffiliationRegID, this.sSOLoginDataModel.SessionID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.paymentResponseDataModel = data['Data'];
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
  async GetApplyBTERPaymentHistoryApplicationID() {
    try {
      this.loaderService.requestStarted();
      await this.applyNocParameterService.GetApplyBTERPaymentHistoryApplicationID(this.BTERRegID, 'BTER')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PaymentHistoryDetails = data['Data'][0]['data'];
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
          this.State = data['State'];
          console.log(data['Data']);
          // data
          if (this.State == 0) {
            this.ApplyNocApplicationDetail = data['Data'];
          }
          else {
            //this.toastr.error(this.ErrorMessage);
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
  close() {
    this.activeModal.close("Send data")
  }

}



