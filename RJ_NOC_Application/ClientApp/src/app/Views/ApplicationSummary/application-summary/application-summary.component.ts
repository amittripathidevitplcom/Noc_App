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
@Component({
  selector: 'app-application-summary',
  templateUrl: './application-summary.component.html',
  styleUrls: ['./application-summary.component.css']
})



export class ApplicationSummaryComponent implements OnInit {

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

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  constructor(private roomDetailsService: RoomDetailsService, private facilityDetailsService: FacilityDetailsService, private buildingDetailsMasterService: BuildingDetailsMasterService, private landDetailsService: LandDetailsService, private socityService: SocityService, private draftApplicationListService: DraftApplicationListService, private TrusteeGeneralInfoService: TrusteeGeneralInfoService, private legalEntityListService: LegalEntityService, private modalService: NgbModal, private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService, private collegeService: CollegeService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private oldnocdetailService: OldnocdetailService, private hostelDetailService: HostelDetailService, private hospitalDetailService: HospitalDetailService, private veterinaryHospitalService: VeterinaryHospitalService,
    private otherInformationService: OtherInformationService, private staffDetailService: StaffDetailService, private academicInformationDetailsService: AcademicInformationDetailsService, private farmLandDetailServiceService: FarmLandDetailService, private elRef: ElementRef) { }

  async ngOnInit() {

    this.loaderService.requestStarted();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetCollageDetails();
    await this.GetDownloadPdfDetails();
    this.loaderService.requestEnded();


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
  @ViewChild('content') content: ElementRef | any;
  btnSavePDF_Click(): void {
    this.loaderService.requestStarted();
    let dt = new Date();
    let Imgpath = this.DownloadPdfDetailslst[0]["data"][0]["MemberSignature2"];
    try {
      let Heading1 = 'GOVERNMENT OF RAJASTHAN';
      let Heading2 = 'OFFICE OF THE COMMISSIONER, COLLEGE EDUCATION,';
      let Heading3 = 'RAJASTHAN, JAIPUR';
      let Heading4 = 'ACADEMIC SESSION ' + this.DownloadPdfDetailslst[0]["data"][0]["SessionYear"];
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
      pDFData.push({ "ContentName": "#LegalBasicInfo" })
      pDFData.push({ "ContentName": "#TrusteeMemberDetails" })
      pDFData.push({ "ContentName": "#TrusteeGeneralDetails" })
      pDFData.push({ "ContentName": "#LegalMemberDetails" })
      pDFData.push({ "ContentName": "#LegalInstituteDetails" })
      pDFData.push({ "ContentName": "#CollegeBasicInfo" })
      pDFData.push({ "ContentName": "#CollegeGeoTagging" })
      pDFData.push({ "ContentName": "#CollegeContactDetails" })
      pDFData.push({ "ContentName": "#CollegeGeneralContactDetails" })
      if (this.SelectedDepartmentID == 6) {
        pDFData.push({ "ContentName": "#CollegeHospitalDetails" })
      }

      pDFData.push({ "ContentName": "#CourseBasicDetails" })
      pDFData.push({ "ContentName": "#CollegeManagementSociety" })
      pDFData.push({ "ContentName": "#LandDetails" })
      pDFData.push({ "ContentName": "#BuildingDetails" })
      pDFData.push({ "ContentName": "#FacilityDetails" })
      pDFData.push({ "ContentName": "#RoomDetails" })
      pDFData.push({ "ContentName": "#OtherInfoDetails" })

      if (this.CollegeType_IsExisting) {
        pDFData.push({ "ContentName": "#OldNocDetial" })
        pDFData.push({ "ContentName": "#StaffDetails" })
        pDFData.push({ "ContentName": "#AcademicInfo" })
      }
      if (this.SelectedDepartmentID == 1) {
        pDFData.push({ "ContentName": "#FarmLandDetial" })
      }
      if (this.SelectedDepartmentID == 3 || this.SelectedDepartmentID == 6 || this.SelectedDepartmentID == 4) {
        pDFData.push({ "ContentName": "#HostelDetial" })
        pDFData.push({ "ContentName": "#HospitalDetailInfo" })
      }
      if (this.SelectedDepartmentID == 6 || this.SelectedDepartmentID == 5) {
        pDFData.push({ "ContentName": "#HospitalDetailInfo" })
      }
      if (this.SelectedDepartmentID == 9) {
        pDFData.push({ "ContentName": "#ParaHospitalDetailInfo" })
      }
      if (this.SelectedDepartmentID == 2) {
        pDFData.push({ "ContentName": "#VetHospitalDetial" })
      }

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
                doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
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
                doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
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
                doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
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
                doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
                doc.text(str, 575, 830);
              },
              didDrawCell: function (data) {
                //data.cell.height = 20;
                debugger;
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
                doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
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
                doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
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

  async btnViewPDfPreview(content: any) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      debugger;
      this.loaderService.requestStarted();
      await this.ViewlegalEntityDataByID(this.sSOLoginDataModel.SSOID);
      await this.GetDataOfLegalEntity();
      await this.GetDataList();
      await this.ViewTotalCollegeDataByID(this.SelectedCollageID);
      await this.GetCourseByCollegeWise(this.SelectedCollageID, 0);
      await this.GetSocietyAllList();
      await this.GetLandDetailsDataList();
      await this.GetUnitOfLandArea(this.SelectedDepartmentID, 'LandUnit');
      await this.GetAllBuildingDetailsList();
      await this.GetFacilityDetailAllList();
      await this.GetRoomDetailAllList();
      await this.GetOtherInformationAllList();
      await this.GetAllStaffDetailsList(this.SelectedDepartmentID, this.SelectedCollageID);
      await this.GetAcademicInformationDetailAllList();
      await this.GetAllFarmLandDetalsList(this.SelectedCollageID);
      await this.GetOldNOCDetailAllList(this.SelectedDepartmentID, this.SelectedCollageID);
      await this.GetHostelDetailAllList(this.SelectedDepartmentID, this.SelectedCollageID);
      await this.GetHospitalDetailList(this.SelectedCollageID);
      await this.GetParaHospitalDataList();
      await this.GetVetHospitalDetailList(this.SelectedDepartmentID, this.SelectedCollageID);
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

  //Get Preview genrate datamodel
  async GetDataOfLegalEntity() {
    this.loaderService.requestStarted();
    try {
      await this.TrusteeGeneralInfoService.GetDataOfLegalEntity(this.sSOLoginDataModel.SSOID)
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

  async ViewTotalCollegeDataByID(CollegeID: any) {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.ViewTotalCollegeDataByID(CollegeID, 0)
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

  async GetCourseByCollegeWise(CollegeID: number, UserID: number) {
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetCoursesByCollegeID(CollegeID, UserID)
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

  async GetUnitOfLandArea(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UnitOfLand = data['Data'][0]['Name'];
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

  async GetFacilityDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.facilityDetailsService.GetFacilityDetailAllList(0, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.FacilitiesDataAllList = data['Data'][0]['data'];
          console.log(this.FacilitiesDataAllList);
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
          console.log(this.OtherInformation);
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
  async GetAllFarmLandDetalsList(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.farmLandDetailServiceService.GetAllFarmLandDetalsListByCollegeID(CollegeID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstFarmLandDetails = data['Data'][0]['data'];
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
  async GetOldNOCDetailAllList(DepartmentID: number, CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.oldnocdetailService.GetOldNOCDetailListForPDF(DepartmentID, CollegeID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.OldNocDetailslst = data['Data'][0]['data']['Table'];
          this.OldNocSubjectlst = data['Data'][0]['data']['Table1'];
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

  async IsSuperSpecialtyHospital() {
    try {
      this.IsShowSuperSpecialtyHospital = false;
      this.loaderService.requestStarted();
      await this.hospitalDetailService.IsSuperSpecialtyHospital(this.SelectedCollageID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.IsShowSuperSpecialtyHospital = data['Data'];
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

  async GetHospitalDetailList(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.GetHospitalDataListforPDF(CollegeID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.HospitalAllDatalst = data['Data'];

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

  async GetParaHospitalDataList() {
    this.loaderService.requestStarted();
    try {
      await this.hospitalDetailService.GetHospitalDataListforPDF(this.SelectedCollageID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.ParaHospitallst = data['Data'];
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

  async GetVetHospitalDetailList(DepartmentID: number, CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.veterinaryHospitalService.GetVeterinaryHospitalListForPdf(DepartmentID, CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.vetHospitalDetaillst = data['Data'][0]['data']['Table'];
          this.AnimalDetaillst = data['Data'][0]['data']['Table1'];
          this.SansthaBhavanlst = data['Data'][0]['data']['Table2'];
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
