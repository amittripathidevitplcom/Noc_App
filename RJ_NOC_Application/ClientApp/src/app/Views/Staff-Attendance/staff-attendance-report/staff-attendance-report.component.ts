import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StaffAttendanceReportDataModel } from '../../../Models/StaffAttendanceDataModel';
import { StaffAttendanceService } from '../../../Services/StaffAttendance/staff-attendance.service';
import { debug } from 'console';

@Injectable()
  @Component({
    selector: 'app-staff-attendance-report',
    templateUrl: './staff-attendance-report.component.html',
    styleUrls: ['./staff-attendance-report.component.css']
  })
export class StaffAttendanceReportComponent implements OnInit {

  StaffAttendReport!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new StaffAttendanceReportDataModel();
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  isEdit: boolean = false;
  public UserID: number = 0;
  public collegeDataList: any = [];
  public departmentMasterData: any = [];
  public courseDataList: any[] = [];
  public StaffAttendanceReportList: any[] = [];
  public PresentStatusLst: any[] = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedDepartmentID: number = 0;
  public SelectedCollageID: number = 0;
  public is_disableDepartment: boolean = false;
  public MaxDate: Date = new Date();
  public IsTeaching: boolean = false;
  public IsStaffList: boolean = false;
  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService, private staffAttendanceService: StaffAttendanceService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {

  }
  async ngOnInit() {

    this.StaffAttendReport = this.formBuilder.group(
      {
        ddlCollegeID: ['', [DropdownValidators]],
        ddlStaffType: ['', [Validators.required]],
        ddlCourse: [''],
        txtFromDate: ['', Validators.required],
        txtToDate: ['', Validators.required],
      })

    const ddlCollegeID = document.getElementById('ddlCollegeID')
    if (ddlCollegeID) ddlCollegeID.focus();

    this.request.StatusID = 0;
    // get login data
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // get colleges
    await this.GetCollegesByDepartmentAndSsoId(this.sSOLoginDataModel.SSOID, 'Society');

    await this.FillStaffDetailsStatus();

  }
  get form() { return this.StaffAttendReport.controls; }

  async GetStaffType(SeletedStaffType: any) {
    this.StaffAttendanceReportList = [];
    this.request.CourseID = 0;
    this.IsStaffList = false;
    this.request.StatusID = 0;
    if (SeletedStaffType == 'Teaching') {
      this.IsTeaching = true;
    }
    else {
      this.IsTeaching = false;
      this.request.CourseID = 0;
    }
  }
  async GetCollegesByDepartmentAndSsoId(ssoId: string, type: string) {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(0, ssoId, type)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.collegeDataList = data['Data'];
          if (this.collegeDataList.length == 1) {
            this.request.CollegeID = data['Data'][0]['CollegeID'];
            this.is_disableDepartment = true;
            this.GetCourseByCollegID(this.request.CollegeID);
          }
        });
    }
    catch (ex) {
      console.log(ex)
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async GetCourseByCollegID(SeletedCollegeID: any) {
    this.request.Date = '';
    this.StaffAttendanceReportList = [];
    this.request.CourseID = 0;
    this.request.StaffType = '';
    try {
      this.loaderService.requestStarted();
      this.request.CollegeID = SeletedCollegeID;
      this.commonMasterService.GetOldNOCCourseList_CollegeWise(SeletedCollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.courseDataList = data['Data'];
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
  async FillStaffDetailsStatus() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(0, "StaffAttendance")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PresentStatusLst = data['Data'];
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

  public isFormValid: boolean = true;
  async SearchData() {
    this.IsStaffList = true;
    this.isSubmitted = true;
    this.isFormValid = true;
    if (this.request.StaffType == 'Teaching') {
      if (this.request.CourseID == 0) {
        return;
      }
    }
    if (this.StaffAttendReport.invalid) {
      this.isFormValid = false;
      return;
    }
    this.loaderService.requestStarted();
    try {
      this.staffAttendanceService.GetStaffAttendanceReportData(this.request.CollegeID,this.request.StaffType, this.request.CourseID, this.request.FromDate,this.request.ToDate,this.request.StatusID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StaffAttendanceReportList = data['Data'][0]['data'];
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



  async ResetControl() {
    const ddlCollegeID = document.getElementById('ddlCollegeID')
    if (ddlCollegeID) ddlCollegeID.focus();
    this.isSubmitted = false;
    this.request.CollegeID = 0;
    this.request.CourseID = 0;
    this.request.FromDate = '';
    this.request.StaffType = '';
    this.request.ToDate = '';
    this.request.StatusID = 0;
    this.courseDataList = [];
    this.StaffAttendanceReportList = [];
    this.IsStaffList = false;
  }

  async ClearStaffAttendenceReport() {
    this.StaffAttendanceReportList = [];
    this.IsStaffList = false;
  }
}
