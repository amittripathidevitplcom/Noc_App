import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentEnrollmentDistanceModeDataModel, StudentEnrollmentDistanceModeDataModel_ProgrammesDetails, StudentEnrollmentDistanceModeDataModel_StudentDetails } from '../../../Models/DTEStatistics/StudentEnrollmentDistanceModeDataModel';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { StudentEnrollmentDistanceModeService } from '../../../Services/DTEStatistics/StudentEnrollmentDistanceMode/student-enrollment-distance-mode.service';
import { PreviewDTEStatisticsComponent } from '../preview-dtestatistics/preview-dtestatistics.component';

@Component({
  selector: 'app-student-enrollment-distance-mode',
  templateUrl: './student-enrollment-distance-mode.component.html',
  styleUrls: ['./student-enrollment-distance-mode.component.css']
})
export class StudentEnrollmentDistanceModeComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new StudentEnrollmentDistanceModeDataModel();
  request_StudentEnrollmentDistanceModeDetails = new StudentEnrollmentDistanceModeDataModel_ProgrammesDetails();
  public StudentDetails: StudentEnrollmentDistanceModeDataModel_StudentDetails[] = [];

  public isSubmitted: boolean = false;
  public CurrentIndex: number = -1;
  public levelDataList: any = [];
  public programmeDataList: any = [];
  public disabled: boolean = false;
  public PreviewStatus: string = 'N';

  constructor(private StudentEnrollmentDistanceModeService: StudentEnrollmentDistanceModeService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent, private previewDTEStatisticsComponent: PreviewDTEStatisticsComponent) {
  }
  async ngOnInit() {

    this.request.ProgrammesDetails = [];

    this.PreviewStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('PreviewStatus')?.toString());
    if (this.PreviewStatus != 'Y') {
      this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
      this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;
      this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;
    }
    else {
      this.disabled = true;
      this.SelectedDepartmentID = this.previewDTEStatisticsComponent.SelectedDepartmentID;
      this.SelectedCollageID = await this.previewDTEStatisticsComponent.GetCollegeID_SearchRecordID();
    }

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.EntryType = "Distance Mode";

    await this.CourseLevel();
    await this.GetProgramme();
    await this.btnAdd_Click(this.request.ProgrammesDetails[0], 0);
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
      await this.StudentEnrollmentDistanceModeService.GetByID(this.request.CollegeID, this.request.ModifyBy, this.request.EntryType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;

          if (data['Data'].ProgrammesDetails.length > 0) {
            this.request.ProgrammesDetails = data['Data'].ProgrammesDetails;
            for (var i = 0; i < this.request.ProgrammesDetails.length; i++) {
              this.request.ProgrammesDetails[i].trCss = (i + 1) % 2 === 0 ? "trAlter" : "";
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

    for (var i = 0; i < this.request.ProgrammesDetails.length; i++) {

      if (this.request.ProgrammesDetails[i].Faculty_School == '') {
        this.toastr.error('Faculty/ School field is required.!');
        const txtFaculty_School = document.getElementById('txtFaculty_School_' + i.toString());
        if (txtFaculty_School) txtFaculty_School.focus();
        return;
      }
      if (this.request.ProgrammesDetails[i].Department_Centre == '') {
        this.toastr.error('Department/Centre field is required.!');
        const txtDepartment_Centre_ = document.getElementById('txtDepartment_Centre_' + i.toString());
        if (txtDepartment_Centre_) txtDepartment_Centre_.focus();
        return;
        return;
      }
      if (this.request.ProgrammesDetails[i].LevelID == 0) {
        this.toastr.error('Level field is required.!');
        const ddlLevel_ = document.getElementById('ddlLevel_' + i.toString());
        if (ddlLevel_) ddlLevel_.focus();
        return;
      }

      if (this.request.ProgrammesDetails[i].Discipline == '') {
        this.toastr.error('Discipline field is required.!');
        const txtDiscipline_ = document.getElementById('txtDiscipline_' + i.toString());
        if (txtDiscipline_) txtDiscipline_.focus();
        return;
      }
      if (this.request.ProgrammesDetails[i].Year == null) {
        this.toastr.error('Year field is required.!');
        const txtYear_ = document.getElementById('txtYear_' + i.toString());
        if (txtYear_) txtYear_.focus();
        return;
      }
      if (this.request.ProgrammesDetails[i].Month == null) {
        this.toastr.error('Month field is required.!');
        const txtMonth_ = document.getElementById('txtMonth_' + i.toString());
        if (txtMonth_) txtMonth_.focus();
        return;
      }

    }


    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.StudentEnrollmentDistanceModeService.SaveData(this.request)
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
        this.request.ProgrammesDetails.splice(i, 1);
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
  async btnAdd_Click(row: StudentEnrollmentDistanceModeDataModel_ProgrammesDetails, idx: number) {
    if (row != undefined) {
      if (row.Faculty_School == '') {
        this.toastr.error('Faculty/ School field is required.!');
        const txtFaculty_School = document.getElementById('txtFaculty_School_' + idx.toString());
        if (txtFaculty_School) txtFaculty_School.focus();
        return;
      }
      if (row.Department_Centre == '') {
        this.toastr.error('Department/Centre field is required.!');
        const txtDepartment_Centre_ = document.getElementById('txtDepartment_Centre_' + idx.toString());
        if (txtDepartment_Centre_) txtDepartment_Centre_.focus();
        return;
        return;
      }
      if (row.LevelID == 0) {
        this.toastr.error('Level field is required.!');
        const ddlLevel_ = document.getElementById('ddlLevel_' + idx.toString());
        if (ddlLevel_) ddlLevel_.focus();
        return;
      }
      if (row.Discipline == '') {
        this.toastr.error('Discipline field is required.!');
        const txtDiscipline_ = document.getElementById('txtDiscipline_' + idx.toString());
        if (txtDiscipline_) txtDiscipline_.focus();
        return;
      }
      if (row.Year == null) {
        this.toastr.error('Year field is required.!');
        const txtYear_ = document.getElementById('txtYear_' + idx.toString());
        if (txtYear_) txtYear_.focus();
        return;
      }
      if (row.Month == null) {
        this.toastr.error('Month field is required.!');
        const txtMonth_ = document.getElementById('txtMonth_' + idx.toString());
        if (txtMonth_) txtMonth_.focus();
        return;
      }
    }

    try {
      this.StudentDetails = [];
      this.StudentDetails.push({
        Category: "PWD (out of Total)",
        //General
        GeneralCategorySeatsEarmarkedAsPerGOI: 0,
        GeneralCategoryMale: 0,
        GeneralCategoryFemale: 0,
        GeneralCategoryTransGender: 0,
        //EWS
        EWSCategorySeatsEarmarkedAsPerGOI: 0,
        EWSCategoryMale: 0,
        EWSCategoryFemale: 0,
        EWSCategoryTransGender: 0,
        //SC
        SCCategorySeatsEarmarkedAsPerGOI: 0,
        SCCategoryMale: 0,
        SCCategoryFemale: 0,
        SCCategoryTransGender: 0,
        //ST
        STCategorySeatsEarmarkedAsPerGOI: 0,
        STCategoryMale: 0,
        STCategoryFemale: 0,
        STCategoryTransGender: 0,
        //OBC
        OBCCategorySeatsEarmarkedAsPerGOI: 0,
        OBCCategoryMale: 0,
        OBCCategoryFemale: 0,
        OBCCategoryTransGender: 0,
        //Total
        TotalCategorySeatsEarmarkedAsPerGOI: 0,
        TotalCategoryMale: 0,
        TotalCategoryFemale: 0,
        TotalCategoryTransGender: 0,
      }, {
        Category: "Muslim Minority (out of Total)",
        //General
        GeneralCategorySeatsEarmarkedAsPerGOI: 0,
        GeneralCategoryMale: 0,
        GeneralCategoryFemale: 0,
        GeneralCategoryTransGender: 0,
        //EWS
        EWSCategorySeatsEarmarkedAsPerGOI: 0,
        EWSCategoryMale: 0,
        EWSCategoryFemale: 0,
        EWSCategoryTransGender: 0,
        //SC
        SCCategorySeatsEarmarkedAsPerGOI: 0,
        SCCategoryMale: 0,
        SCCategoryFemale: 0,
        SCCategoryTransGender: 0,
        //ST
        STCategorySeatsEarmarkedAsPerGOI: 0,
        STCategoryMale: 0,
        STCategoryFemale: 0,
        STCategoryTransGender: 0,
        //OBC
        OBCCategorySeatsEarmarkedAsPerGOI: 0,
        OBCCategoryMale: 0,
        OBCCategoryFemale: 0,
        OBCCategoryTransGender: 0,
        //Total
        TotalCategorySeatsEarmarkedAsPerGOI: 0,
        TotalCategoryMale: 0,
        TotalCategoryFemale: 0,
        TotalCategoryTransGender: 0,
      }, {
        Category: "Other Minority (out of Total)1",
        //General
        GeneralCategorySeatsEarmarkedAsPerGOI: 0,
        GeneralCategoryMale: 0,
        GeneralCategoryFemale: 0,
        GeneralCategoryTransGender: 0,
        //EWS
        EWSCategorySeatsEarmarkedAsPerGOI: 0,
        EWSCategoryMale: 0,
        EWSCategoryFemale: 0,
        EWSCategoryTransGender: 0,
        //SC
        SCCategorySeatsEarmarkedAsPerGOI: 0,
        SCCategoryMale: 0,
        SCCategoryFemale: 0,
        SCCategoryTransGender: 0,
        //ST
        STCategorySeatsEarmarkedAsPerGOI: 0,
        STCategoryMale: 0,
        STCategoryFemale: 0,
        STCategoryTransGender: 0,
        //OBC
        OBCCategorySeatsEarmarkedAsPerGOI: 0,
        OBCCategoryMale: 0,
        OBCCategoryFemale: 0,
        OBCCategoryTransGender: 0,
        //Total
        TotalCategorySeatsEarmarkedAsPerGOI: 0,
        TotalCategoryMale: 0,
        TotalCategoryFemale: 0,
        TotalCategoryTransGender: 0,
      })

      var trCss = (Number(this.request.ProgrammesDetails.length) + 1) % 2 === 0 ? "trAlter" : "";

      this.request.ProgrammesDetails.push({
        Faculty_School: "",
        Department_Centre: "",
        LevelID: 0,
        LevelName: "",
        Discipline: "",
        Year: 0,
        Month: 0,
        Remark: '',
        Category: "Total",
        //General
        GeneralCategorySeatsEarmarkedAsPerGOI: 0,
        GeneralCategoryMale: 0,
        GeneralCategoryFemale: 0,
        GeneralCategoryTransGender: 0,
        //EWS
        EWSCategorySeatsEarmarkedAsPerGOI: 0,
        EWSCategoryMale: 0,
        EWSCategoryFemale: 0,
        EWSCategoryTransGender: 0,
        //SC
        SCCategorySeatsEarmarkedAsPerGOI: 0,
        SCCategoryMale: 0,
        SCCategoryFemale: 0,
        SCCategoryTransGender: 0,
        //ST
        STCategorySeatsEarmarkedAsPerGOI: 0,
        STCategoryMale: 0,
        STCategoryFemale: 0,
        STCategoryTransGender: 0,
        //OBC
        OBCCategorySeatsEarmarkedAsPerGOI: 0,
        OBCCategoryMale: 0,
        OBCCategoryFemale: 0,
        OBCCategoryTransGender: 0,
        //Total
        TotalCategorySeatsEarmarkedAsPerGOI: 0,
        TotalCategoryMale: 0,
        TotalCategoryFemale: 0,
        TotalCategoryTransGender: 0,
        StudentDetails: this.StudentDetails,
        trCss: trCss
      });

    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {

        const txtFaculty_School = document.getElementById('txtFaculty_School_' + (idx+1).toString());
        if (txtFaculty_School) txtFaculty_School.focus();


        this.loaderService.requestEnded();
        const btnAdd = document.getElementById('btnAdd')
        if (btnAdd) { btnAdd.innerText = "Add"; }

      }, 200);
    }
  }


}

