import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CourseMasterDataModel, DTECourseMasterDataModel } from '../../../Models/CourseMasterDataModel';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { EnumDepartment } from '../../../Common/enum-noc';
import { Console } from 'console';

@Component({
  selector: 'app-dte-add-course',
  templateUrl: './dte-add-course.component.html',
  styleUrls: ['./dte-add-course.component.css']
})
export class DteAddCourseComponent {
  CourseMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public streamDataList: any = [];
  public CourseLevelList: any = [];
  public courseDataList: any[] = [];
  public shiftDataList: any[] = [];
  public ConductModeDataList: any[] = [];

  request = new DTECourseMasterDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public isLoading: boolean = false;
  public ShowHideotherCourse: boolean = false;
  public CourseDropdown: boolean = false;
  isSubmitted: boolean = false;
  public UserID: number = 0;
  searchText: string = '';
  public LoginSocietyName: string = 'Society Name';
  public CollegeID: number = 0;
  public UniversityID: number = 0;
  public SelectedDepartmentID: number = 0;

  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard) {

  }

  async ngOnInit() {
    this.loaderService.requestStarted();
    try {
      this.CourseMasterForm = this.formBuilder.group(
        {
          ddlStreamID: ['', DropdownValidators],
          ddlCourseLevelID: ['', [DropdownValidators]],
          ddlCourse: [''],
          ddlConductMode: ['', [DropdownValidators]],
          ddlShift: ['', DropdownValidators],
          txtEnrollment: ['', Validators.required],
          txtSuperNumerarySeats: ['', Validators.required],
          txtIntake: ['', Validators.required],
          txtOtherCourseName: [''],
        })

      const ddlDepartment = document.getElementById('ddlStreamID')
      if (ddlDepartment) ddlDepartment.focus();

      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      this.SelectedDepartmentID = 4;//Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
      this.CollegeID = 4563;
      this.UniversityID = 117;
      this.UserID = 1;
      ///Edit Process
      await this.GetStreamList();
      await this.CourseLevel();
      await this.FillShift();
      await this.FillConductMode();
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 0);
    }
  }

  get form() { return this.CourseMasterForm.controls; }

  async GetStreamList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetMappedStreamListByID(this.SelectedDepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.streamDataList = data['Data'][0]['data'];
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

  async CourseLevel() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWises(this.SelectedDepartmentID, this.CollegeID, "CourseLevel")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseLevelList = data['Data'];
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
  };

  async GetCourseListByLevelID(CourseLevelID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCourseByStreamID(this.request.StreamID, this.SelectedDepartmentID, CourseLevelID, this.UniversityID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.courseDataList = data['Data'][0]['data'];
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
  };

  async IsChangeCourse(CourseID: number) {
    try {
      this.loaderService.requestStarted();
      if (CourseID == -1)
        this.ShowHideotherCourse = true;
      else
        this.ShowHideotherCourse = false;

    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  };

  async FillShift() {
    try {
      this.loaderService.requestStarted();
      this.shiftDataList.push({
        "shiftName": "1st Shift",
        "shiftID": "1",
      });
      this.shiftDataList.push({
        "shiftName": "2nd Shift",
        "shiftID": "2",
      });
      this.shiftDataList.push({
        "shiftName": "3rd Shift",
        "shiftID": "3",
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

  async FillConductMode() {
    try {
      this.loaderService.requestStarted();
      this.ConductModeDataList.push({
        "ConductName": "Full Time",
        "ConductID": "1",
      });
      this.ConductModeDataList.push({
        "ConductName": "Part Time",
        "ConductID": "2",
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


  public isFormValid: boolean = true;

  async SaveData() {
    this.isSubmitted = true;
    this.isFormValid = true;
    this.CourseDropdown = false;
    if (this.CourseMasterForm.invalid) {
      this.isFormValid = false;
    }
    if (this.request.CourseID == 0) {
      this.CourseDropdown = true;
      this.isFormValid = false;
    }
    if (this.ShowHideotherCourse) {
      if (this.request.OtherCourseName == '') {
        this.isFormValid = false;
      }
    }

    if (!this.isFormValid) {
      return;
    }


    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      this.request.CollegeID = this.CollegeID;
      this.request.DepartmentID = this.SelectedDepartmentID;
      await this.courseMasterService.DTESaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
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

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  async ResetControl() {
    const ddlDepartment = document.getElementById('ddlStreamID')
    if (ddlDepartment) ddlDepartment.focus();
    this.isSubmitted = false;
    this.request.CollegeWiseCourseID = 0;

    this.request.StreamID = 0;
    this.request.DepartmentID = 0;
    this.request.CollegeID = 0;
    this.request.CourseID = 0;
    this.request.CourseLevelID = 0;
    this.request.OtherCourseName = '';
    this.request.UserID = 0;
    this.request.Intake = 0;
    this.request.Enrollment = 0;
    this.request.SuperNumerarySeats = 0;
    this.request.Shift = 0;
    this.request.ConductMode = 0;
    this.request.ActiveStatus = true;
    this.request.DeleteStatus = false;
    this.ShowHideotherCourse = false;

    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('btnReset')
    if (btnReset) btnReset.innerHTML = "Reset";
  }

  shiftFHandler() {
    alert('Shift+F pressed!');
  }
}
