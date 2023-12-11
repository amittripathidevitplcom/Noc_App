import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { bottom } from '@popperjs/core';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StatisticsFinalSubmitDataModel } from '../../../Models/SubjectWiseStatisticsDetailsDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { ClassWiseStudentDetailsServiceService } from '../../../Services/ClassWiseStudentDetails/class-wise-student-details-service.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { DteAddCourseComponent } from '../../CollegeDetailsForm/dte-add-course/dte-add-course.component';
import { AcademicInformationComponent } from '../../TabDetail/academic-information/academic-information.component';
import { OldNOCDetailsComponent } from '../../TabDetail/old-nocdetails/old-nocdetails.component';
import { RoomDetailsComponent } from '../../TabDetail/room-details/room-details.component';
import { StaffDetailsComponent } from '../../TabDetail/staff-details/staff-details.component';
import { VeterinaryHospitalComponent } from '../../VeterinaryHospital/veterinary-hospital/veterinary-hospital.component';

@Component({
  selector: 'app-statistics-entry',
  templateUrl: './statistics-entry.component.html',
  styleUrls: ['./statistics-entry.component.css']
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
  public CheckTabsEntryData: any = [];

  public SearchRecordID: string = '';
  closeResult!: string;
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 0;
  public CollegeType_IsExisting: boolean = true;

  isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  modalReference!: NgbModalRef;
  public IsShowDraftFinalSubmit: boolean = true;
  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private collegeService: CollegeService
    , private classWiseStudentDetailsServiceService: ClassWiseStudentDetailsServiceService, private modalService: NgbModal) { }

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
    await this.CheckTabsEntry();
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

  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;

    try {
      this.ShowDraftFinalSubmitBtn();
    }
    catch (Ex) { }
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
    await this.CheckTabsEntry();
    this.IsShowDraftFinalSubmit = true;
    if (this.CheckTabsEntryData['ClassWiseStatistics'] > 0 && this.CheckTabsEntryData['SubjectWiseStatistics'] > 0) {
      this.IsShowDraftFinalSubmit = false;
    }

  }
  async CheckTabsEntry() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.CheckTabsEntry(this.SelectedCollageID.toString())
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckTabsEntryData = data['Data'][0]['data'][0];
          console.log(this.CheckTabsEntryData);
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
