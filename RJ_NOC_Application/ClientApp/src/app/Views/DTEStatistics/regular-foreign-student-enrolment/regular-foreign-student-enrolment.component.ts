import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegularForeignStudentEnrolmentDataModel, RegularForeignStudentEnrolmentDataModel_RegularForeignStudentEnrolment } from '../../../Models/DTEStatistics/RegularForeignStudentEnrolmentDataModel';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { RegularForeignStudentEnrolmentService } from '../../../Services/DTEStatistics/RegularForeignStudentEnrolment/regular-foreign-student-enrolment.service';

@Component({
  selector: 'app-regular-foreign-student-enrolment',
  templateUrl: './regular-foreign-student-enrolment.component.html',
  styleUrls: ['./regular-foreign-student-enrolment.component.css']
})
export class RegularForeignStudentEnrolmentComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new RegularForeignStudentEnrolmentDataModel();
  request_RegularForeignStudentEnrolmentDetails = new RegularForeignStudentEnrolmentDataModel_RegularForeignStudentEnrolment();
  public isSubmitted: boolean = false;
  public CurrentIndex: number = -1;
  public levelDataList: any = [];
  public programmeDataList: any = [];

  constructor(private RegularForeignStudentEnrolmentService: RegularForeignStudentEnrolmentService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent) {
  }
  async ngOnInit() {

    this.request.RegularForeignStudentEnrolment = [];

    this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
    this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;
    this.request.EntryType = "Distance Mode";

    await this.CourseLevel();
    await this.GetProgramme();
    await this.btnAdd_Click(this.request.RegularForeignStudentEnrolment[0], 0);
    await this.GetByID();
  }
  async GetProgramme() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetMappedStreamListByID(4)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.programmeDataList = data['Data'][0]['data'];
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
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWises(4, 0, "CourseLevel")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.levelDataList = data['Data'];
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
  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.RegularForeignStudentEnrolmentService.GetByID(this.request.CollegeID, this.request.ModifyBy, this.request.EntryType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;
         
          if (data['Data'].RegularForeignStudentEnrolment != null) {
            if (data['Data'].RegularForeignStudentEnrolment.length > 0) {
              this.request.RegularForeignStudentEnrolment = data['Data'].RegularForeignStudentEnrolment;
            }
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
  async SaveData() {
    this.isSubmitted = true;

    for (var i = 0; i < this.request.RegularForeignStudentEnrolment.length; i++) {

      //  if (this.request.RegularForeignStudentEnrolment[i].Faculty_School == '') {
      //    this.toastr.error('Faculty/ School field is required.!');
      //    const txtFaculty_School = document.getElementById('txtFaculty_School_' + i.toString());
      //    if (txtFaculty_School) txtFaculty_School.focus();
      //    return;
      //  }

      //  if (this.request.RegularForeignStudentEnrolment[i].Department_Centre == '') {
      //    this.toastr.error('Department/Centre field is required.!');
      //    const txtDepartment_Centre_ = document.getElementById('txtDepartment_Centre_' + i.toString());
      //    if (txtDepartment_Centre_) txtDepartment_Centre_.focus();
      //    return;
      //    return;
      //  }
      //  if (this.request.RegularForeignStudentEnrolment[i].LevelID == 0) {
      //    this.toastr.error('Level field is required.!');
      //    const ddlLevel_ = document.getElementById('ddlLevel_' + i.toString());
      //    if (ddlLevel_) ddlLevel_.focus();
      //    return;
      //  }
      //  if (this.request.RegularForeignStudentEnrolment[i].ProgrammeID == 0) {
      //    this.toastr.error('Name Of The Programme field is required.!');
      //    const ddlProgramme_ = document.getElementById('ddlProgramme_' + i.toString());
      //    if (ddlProgramme_) ddlProgramme_.focus();
      //    return;
      //  }
    }

    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.RegularForeignStudentEnrolmentService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            await this.GetByID();
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
  async btnDelete_Click(i: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.RegularForeignStudentEnrolment.splice(i, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
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
  DecimalOnly(evt: any): boolean {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }
  async btnAdd_Click(row: RegularForeignStudentEnrolmentDataModel_RegularForeignStudentEnrolment, idx: number) {
    debugger;
    if (row != undefined) {

      if (row.NoOfStudentsPlaced_Male == null) {
        this.toastr.error('No. Of Students Placed (Male).!');
        const NoOfStudentsPlaced_Male = document.getElementById('NoOfStudentsPlaced_Male' + idx.toString());
        if (NoOfStudentsPlaced_Male) NoOfStudentsPlaced_Male.focus();
        return;
      }
      if (row.NoOfStudentsPlaced_Female == null) {
        this.toastr.error('No. Of Students Placed (Female).!');
        const NoOfStudentsPlaced_Female = document.getElementById('NoOfStudentsPlaced_Female' + idx.toString());
        if (NoOfStudentsPlaced_Female) NoOfStudentsPlaced_Female.focus();
        return;
      }
      if (row.NoOfStudentsSelectedForHigherStudies_Male == null) {
        this.toastr.error('No. Of Students <br />Selected For Higher <br />Studies (Male)');
        const NoOfStudentsSelectedForHigherStudies_Male = document.getElementById('NoOfStudentsSelectedForHigherStudies_Male' + idx.toString());
        if (NoOfStudentsSelectedForHigherStudies_Male) NoOfStudentsSelectedForHigherStudies_Male.focus();
        return;
      }

      if (row.NoOfStudentsSelectedForHigherStudies_Female == null) {
        this.toastr.error('No. Of Students <br />Selected For Higher <br />Studies (Female)');
        const NoOfStudentsSelectedForHigherStudies_Female = document.getElementById('NoOfStudentsSelectedForHigherStudies_Female' + idx.toString());
        if (NoOfStudentsSelectedForHigherStudies_Female) NoOfStudentsSelectedForHigherStudies_Female.focus();
        return;
      }

      if (row.MedianAnnualSalaryforPlacedStudents == null) {
        this.toastr.error('Median Annual Salary for placed students');
        const MedianAnnualSalaryforPlacedStudents = document.getElementById('MedianAnnualSalaryforPlacedStudents' + idx.toString());
        if (MedianAnnualSalaryforPlacedStudents) MedianAnnualSalaryforPlacedStudents.focus();
        return;
      }

    }

    try {
      this.request.RegularForeignStudentEnrolment.push({
        NoOfStudentsPlaced_Male: 0,
        NoOfStudentsPlaced_Female: 0,
        NoOfStudentsPlaced_Total: 0,
        NoOfStudentsSelectedForHigherStudies_Male: 0,
        NoOfStudentsSelectedForHigherStudies_Female: 0,
        NoOfStudentsSelectedForHigherStudies_Total: 0,
        MedianAnnualSalaryforPlacedStudents: 0,
      });

    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        const btnAdd = document.getElementById('btnAdd')
        if (btnAdd) { btnAdd.innerText = "Add"; }
      }, 200);
    }
  }
  async NoOfStudentsPlaced_Male_OnChange(row: RegularForeignStudentEnrolmentDataModel_RegularForeignStudentEnrolment, idx: number) {
    row.NoOfStudentsPlaced_Total = (Number(row.NoOfStudentsPlaced_Male) + Number(row.NoOfStudentsPlaced_Female));
  }
  async NoOfStudentsPlaced_Female_OnChange(row: RegularForeignStudentEnrolmentDataModel_RegularForeignStudentEnrolment, idx: number) {
    row.NoOfStudentsPlaced_Total = (Number(row.NoOfStudentsPlaced_Male) + Number(row.NoOfStudentsPlaced_Female));
  }
  async NoOfStudentsSelectedForHigherStudies_Male_OnChange(row: RegularForeignStudentEnrolmentDataModel_RegularForeignStudentEnrolment, idx: number) {
    row.NoOfStudentsPlaced_Total = (Number(row.NoOfStudentsSelectedForHigherStudies_Male) + Number(row.NoOfStudentsSelectedForHigherStudies_Female));
  }
  async NoOfStudentsSelectedForHigherStudies_Female_OnChange(row: RegularForeignStudentEnrolmentDataModel_RegularForeignStudentEnrolment, idx: number) {
    row.NoOfStudentsSelectedForHigherStudies_Total = (Number(row.NoOfStudentsSelectedForHigherStudies_Male) + Number(row.NoOfStudentsSelectedForHigherStudies_Female));
  }
}


