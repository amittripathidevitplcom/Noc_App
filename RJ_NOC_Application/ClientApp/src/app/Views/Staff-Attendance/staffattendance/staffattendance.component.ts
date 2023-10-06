import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StaffAttendanceDataModel, AttendanceDataModel } from '../../../Models/StaffAttendanceDataModel';
import { StaffAttendanceService } from '../../../Services/StaffAttendance/staff-attendance.service';
import { debug } from 'console';

@Injectable()
@Component({
  selector: 'app-staffattendance',
  templateUrl: './staffattendance.component.html',
  styleUrls: ['./staffattendance.component.css']
})
export class StaffattendanceComponent implements OnInit {

  StaffAttendForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new StaffAttendanceDataModel();
  public request_Attend: AttendanceDataModel[] = [];
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
  public StaffAttendanceDetailsList: any[] = [];
  public PresentStatusLst: any[] = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedDepartmentID: number = 0;
  public SelectedCollageID: number = 0;
  public MaxDate: Date = new Date();
  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService, private staffAttendanceService: StaffAttendanceService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {

  }
  async ngOnInit() {

    this.StaffAttendForm = this.formBuilder.group(
      {
        ddlCollegeID: ['', [DropdownValidators]],
        ddlCourse: ['', [DropdownValidators]],
        txtDate: ['', Validators.required],
      })

    const ddlCollegeID = document.getElementById('ddlCollegeID')
    if (ddlCollegeID) ddlCollegeID.focus();


    // get login data
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    // get colleges
    await this.GetCollegesByDepartmentAndSsoId(this.SelectedDepartmentID, this.sSOLoginDataModel.SSOID, 'Society');

    await this.FillStaffDetailsStatus();

  }
  get form() { return this.StaffAttendForm.controls; }


  async GetCollegesByDepartmentAndSsoId(departmentId: number, ssoId: string, type: string) {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(departmentId, ssoId, type)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.collegeDataList = data['Data'];
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
    this.StaffAttendanceDetailsList = [];
    this.request.CourseID = 0;
    try {
      this.loaderService.requestStarted();
      this.request.CollegeID = SeletedCollegeID;
      this.commonMasterService.GetCourseList_CollegeWise(SeletedCollegeID)
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
  public isFormValid: boolean = true;
  async SearchData() {
    this.isSubmitted = true;
    this.isFormValid = true;
    if (this.StaffAttendForm.invalid) {
      this.isFormValid = false;
      return;
    }
    if (this.request.CollegeID == undefined || this.request.CollegeID == 0) {
      this.toastr.warning('Please select College !!!.');
    }
    this.loaderService.requestStarted();
    try {
      this.staffAttendanceService.GetStaffList_CollegeWise(this.request.CollegeID, this.request.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StaffAttendanceDetailsList = data['Data'][0]['data'];
          //if (this.StaffAttendanceDetailsList.length = 0) {
          //  this.toastr.warning('No Record Found !!!.');
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

  async SaveData() {
    this.request.AttendanceDetailsList = [];

    this.request.DepartmentID = this.SelectedDepartmentID;

    try {


      for (var i = 0; i < this.StaffAttendanceDetailsList.length; i++) {

        //if (this.PresentStatusLst[i].PresentStatus == '' || this.PresentStatusLst[i].PresentStatus == undefined) {
        //  this.toastr.warning('Please check one radio button.');
        //  return
        //}
        this.request.AttendanceDetailsList.push({
          StaffAttendanceDetailID: 0,
          StaffID: this.StaffAttendanceDetailsList[i].StaffDetailID,
          PresentStatus: this.StaffAttendanceDetailsList[i].StatusID != undefined ? this.StaffAttendanceDetailsList[i].StatusID : 0,
        })
      }


      this.loaderService.requestStarted();
      await this.staffAttendanceService.SaveStaffAttendanceData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }, error => {
          this.toastr.warning("Unable to connect to server .!");
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
  async FillStaffDetailsStatus() {
    try {
      this.loaderService.requestStarted();
      const departmentId = Number(this.SelectedDepartmentID);
      if (departmentId <= 0) {
        return;
      }
      // College Medium
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "StaffAttendance")
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

  async ResetControl() {
    const ddlCollegeID = document.getElementById('ddlCollegeID')
    if (ddlCollegeID) ddlCollegeID.focus();
    this.isSubmitted = false;
    this.request.CollegeID = 0;
    this.request.CourseID = 0;
    this.request.Date = '';
    this.courseDataList = [];
    this.request.UserID = 0;
    this.request.ActiveStatus = true;
    this.request.DeleteStatus = false;


    this.request.UserID = 0;

  }


}
