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
  public AllCourseList: any = [];

  request = new DTECourseMasterDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public isLoading: boolean = false;
  public ShowHideotherCourse: boolean = false;
  public CourseDropdown: boolean = false;
  isSubmitted: boolean = false;
  public UserID: number = 0;
  searchText: string = '';
  public LoginSocietyName: string = 'Society Name';
  public UniversityID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SearchRecordID: string = '';

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
      this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
      //this.request.CollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

      this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
      if (this.SearchRecordID.length > 20) {
        await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.request.CollegeID = data['Data']['CollegeID'];
            if (this.request.CollegeID == null || this.request.CollegeID == 0 || this.request.CollegeID == undefined) {
              this.routers.navigate(['/draftapplicationlist']);
            }
          }, error => console.error(error));
      }
      else {
        this.routers.navigate(['/draftapplicationlist']);
      }


      ///this.SelectedDepartmentID = 4;//Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
      //this.request.CollegeID = 4563;
      this.UserID = 1;
      ///Edit Process
      await this.GetCollegeBasicDetails();
      await this.GetStreamList();
      await this.CourseLevel();
      await this.FillShift();
      await this.FillConductMode();
      await this.GetAllList();
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
  async ddlStreamID_Change() {
    this.request.CourseLevelID = 0;
    this.request.CourseID = 0;
    await this.CourseLevel();
    await this.GetCourseListByLevelID(this.request.CourseLevelID);
  }
  get form() { return this.CourseMasterForm.controls; }

  async GetCollegeBasicDetails() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeBasicDetails(this.request.CollegeID.toString())
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UniversityID = data['Data'][0]['data'][0]['UniversityID'];
          //alert(this.UniversityID);
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

  async GetAllList() {
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetListDTE(this.UserID, this.sSOLoginDataModel.SSOID, 0, this.request.CollegeID)
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
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWises(this.SelectedDepartmentID, this.request.CollegeID, "CourseLevel")
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
    this.courseDataList = []
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

  async Edit_OnClick(CollegeWiseCourseID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetListDTE(this.UserID, this.sSOLoginDataModel.SSOID, CollegeWiseCourseID, this.request.CollegeID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          this.request.CollegeWiseCourseID = CollegeWiseCourseID;
          this.request.DepartmentID = data['Data'][0]['data'][0]["DepartmentID"];
          this.request.CollegeID = data['Data'][0]['data'][0]["CollegeID"];
          this.request.StreamID = data['Data'][0]['data'][0]["StreamMasterID"];
          this.request.Enrollment = data['Data'][0]['data'][0]["NoOfEnrolledStudents"];
          this.request.CourseLevelID = data['Data'][0]['data'][0]["CourseLevelID"];
          await this.GetCourseListByLevelID(this.request.CourseLevelID);
          this.request.CourseID = data['Data'][0]['data'][0]["CourseID"];
          this.request.SuperNumerarySeats = data['Data'][0]['data'][0]["Seats"];
          this.request.UserID = data['Data'][0]['data'][0]["UserID"];
          this.request.ActiveStatus = data['Data'][0]['data'][0]["ActiveStatus"];
          this.request.DeleteStatus = data['Data'][0]['data'][0]["DeleteStatus"];

          this.request.Intake = data['Data'][0]['data'][0]["Intake"];
          this.request.ConductMode = data['Data'][0]['data'][0]["ConductMode"];
          this.request.Shift = data['Data'][0]['data'][0]["ShiftType"];

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 2000);
    }

  }

  async Delete_OnClick(CollegeWiseCourseID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.courseMasterService.DeleteData(CollegeWiseCourseID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllList();
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {
      this.clipboard.copy(tabellist.innerText);
    }
  }

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.AllCourseList.length > 0) {
      try {
        //this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][0] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "CollegeCourse.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          // this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        //this.isLoadingExport = false;
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
    //if (this.request.CourseID == 0) {
    //  this.CourseDropdown = true;
    //  this.isFormValid = false;
    //}
    //if (this.ShowHideotherCourse) {
    //  if (this.request.OtherCourseName == '') {
    //    this.isFormValid = false;
    //  }
    //}
    if (Number(this.request.Enrollment) > Number(this.request.Intake) + Number(this.request.SuperNumerarySeats)) {
      this.isFormValid = false;
      this.toastr.warning('No of Enrollment not grater then Intake + Super Numerary Seats');
    }

    if (!this.isFormValid) {
      return;
    }


    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
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
            this.GetAllList();
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
    this.courseDataList = [];

    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('btnReset')
    if (btnReset) btnReset.innerHTML = "Reset";
  }

  @ViewChild('content') content: ElementRef | any;
  btnSavePDF_Click(): void {
    this.loaderService.requestStarted();
    if (this.AllCourseList.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("College Wise Course", 100, 10, { align: 'center', maxWidth: 100 });
        autoTable(doc, {
          html: '#tabellist'
          , styles: { fontSize: 8 },
          headStyles: {
            fillColor: '#3f51b5',
            textColor: '#fff',
            halign: 'center'
          },
          bodyStyles: {
            halign: 'center'
          },
          margin: {
            left: 5,
            right: 5,
            top: 15
          },
          tableLineWidth: 0
        })
        doc.save("CollegeCourse" + '.pdf');

      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          //this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        //this.isLoadingExport = false;
      }, 200);
    }
  }
}
