import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StatisticsFinalSubmitDataModel } from '../../../Models/SubjectWiseStatisticsDetailsDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { ClassWiseStudentDetailsServiceService } from '../../../Services/ClassWiseStudentDetails/class-wise-student-details-service.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { debug } from 'console';
import { RegularModeComponent } from '../../DTEStatistics/regular-mode/regular-mode.component';

@Component({
  selector: 'app-statistics-entry',
  templateUrl: './statistics-entry.component.html',
  styleUrls: ['./statistics-entry.component.css']
})

  @Injectable({
    providedIn: 'root'
  })

export class StatisticsEntryComponent implements OnInit {



  @ViewChild('tabs') tabGroup!: MatTabGroup;
  public collegeDataList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new StatisticsFinalSubmitDataModel();

  public SelectedCollageID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public SelectedDepartmentID: number = 0;

  public SeatValue: number = 50;
  public CollegeID: number = 0;
  public LandClass: string = 'tabs-Link LandInformation';
  public CollegeName: string = '';
  public CheckTabsEntry_StatisticsEntryData: any = [];

  public SearchRecordID: string = '';
  closeResult!: string;
  selectedIndex: number = 0;
  selectedTabName: string = 'Officers Details';
  maxNumberOfTabs: number = 0;
  public CollegeType_IsExisting: boolean = true;

  isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  modalReference!: NgbModalRef;
  public IsShowDraftFinalSubmit: boolean = true;

  public SelectedCollegeEntryType: string = "0";


  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private collegeService: CollegeService
    , private classWiseStudentDetailsServiceService: ClassWiseStudentDetailsServiceService, private modalService: NgbModal) {

  }

  async ngOnInit() {
    // $(".secondTab").addClass("highLightTab");
    this.loaderService.requestStarted();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));

    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SelectedCollageID = data['Data']['CollegeID'];
        if (this.SelectedCollageID == null || this.SelectedCollageID == 0 || this.SelectedCollageID == undefined) {
          this.routers.navigate(['/statisticscollegelist']);
        }
      }, error => console.error(error));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetCollageDetails();
    await this.CheckTabsEntry_StatisticsEntry();
    await this.GetCollegeBasicDetails();
    await this.ShowDraftFinalSubmitBtn();
    this.loaderService.requestEnded();
    this.maxNumberOfTabs = this.tabGroup._tabs.length - 1;

  }

  NextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;

    }
    this.ShowDraftFinalSubmitBtn();

  }

  PreviousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
    this.ShowDraftFinalSubmitBtn();

  }

  async onTabChange(event: MatTabChangeEvent) {

    this.selectedIndex = event.index;

    this.selectedTabName = this.tabGroup._tabs['_results'][this.selectedIndex]['textLabel'];
    //console.log(this.selectedTabName);
    //if (this.selectedTabName == "Regular Mode" || this.selectedTabName == 'Distance Mode') {
    //  await this.regularModeComponent.ngOnInit();
    //}

    try {
      this.ShowDraftFinalSubmitBtn();
    }
    catch (Ex) { }
    this.loaderService.requestEnded();
  }
  public AISHECode: string = '';
  public YearofEstablishment: string = '';
  async GetCollageDetails() {
    try {
      this.loaderService.requestStarted();
      await this.collegeService.GetData(this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.collegeDataList = data['Data'];
          this.AISHECode = this.collegeDataList['AISHECode']
          this.YearofEstablishment = this.collegeDataList['YearofEstablishmentName']
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
  async GetCollegeBasicDetails() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeBasicDetails(this.SelectedCollageID.toString())
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeName = data['Data'][0]['data'][0]['CollegeNameEn'];

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

  async StatisticsFinalSubmit() {

    if (this.SelectedDepartmentID == 4) {
      this.request.Confirmation = "Yes";
    }
    if (this.request.Confirmation == "0") {
      this.toastr.error("Select data confirmation.!")
      return;
    }


    if (confirm("Are you sure you want to save final statistics data ?")) {
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      this.isLoading = true;
      try {
        this.request.CollegeID = this.SelectedCollageID;
        this.request.SSOID = this.sSOLoginDataModel.SSOID;
        await this.classWiseStudentDetailsServiceService.StatisticsFinalSubmit_Save(this.request)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            console.log(this.State);
            if (!this.State) {
              this.toastr.success(this.SuccessMessage);
              this.modalService.dismissAll();
              setTimeout(() => {
                this.routers.navigate(['/statisticscollegelist']);
              }, 500);
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
          this.isLoading = false;

        }, 200);
      }
    }
  }


  async ShowDraftFinalSubmitBtn() {
    await this.CheckTabsEntry_StatisticsEntry();
    this.IsShowDraftFinalSubmit = true;
    if (this.SelectedDepartmentID == 3) {
      if (this.CheckTabsEntry_StatisticsEntryData['ClassWiseStatistics'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['SubjectWiseStatistics'] > 0) {
        this.IsShowDraftFinalSubmit = false;
      }
    }
    else if (this.SelectedDepartmentID == 4) {
      if (this.CheckTabsEntry_StatisticsEntryData['BasicInformation'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['OfficersDetails'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['Address'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['ResidentialFacility'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['RegionalCenters'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['OffShoreCenter'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['Faculty'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['Department'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['RegularMode'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['DistanceMode'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['StudentEnrlRegularMode'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['StudentEnrlDistanceMode'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['RegionalCentreDistancemode'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['PvtExternalMode'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['ReguForeignStuEnrolment'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['ExaminationResultsRegular'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['ExaminationResultsDistance'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['ExamResultsRegionalCenter'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['ExamResultspvtExternal'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['PlacementDetails'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['TeachingStaff'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['NonTeaching'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['FinancialDetails'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['InfrastructureDetails'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['Scholarship_Fellowship_Loan_Acc'] > 0
        && this.CheckTabsEntry_StatisticsEntryData['RegulatoryInformation'] > 0) {
        this.IsShowDraftFinalSubmit = false;
      }
    }
  }


  async CheckTabsEntry_StatisticsEntry() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.CheckTabsEntry_StatisticsEntry(this.SelectedCollageID.toString())
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckTabsEntry_StatisticsEntryData = data['Data'][0]['data'][0];
          console.log(this.CheckTabsEntry_StatisticsEntryData);
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
  async OpenModulPopup_click(content: any) {
    try {

      // model popup
      this.modalService.open(content, { size: 'small', ariaLabelledBy: 'modal-applynocpayment-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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



}

//export type StatisticsEntry = "University" | "College" | "Polytechnic" | "Standalone";
