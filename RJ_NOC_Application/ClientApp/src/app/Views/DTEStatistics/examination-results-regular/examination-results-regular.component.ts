import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExaminationResultsRegularDataModel, ExaminationResultsRegularDataModel_ProgrammesDetails, ExaminationResultsRegularDataModel_StudentDetails } from '../../../Models/DTEStatistics/ExaminationResultsRegularDataModel';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { ExaminationResultsRegularService } from '../../../Services/DTEStatistics/ExaminationResultsRegular/examination-results-regular.service';
import { PreviewDTEStatisticsComponent } from '../preview-dtestatistics/preview-dtestatistics.component';


@Component({
  selector: 'app-examination-results-regular',
  templateUrl: './examination-results-regular.component.html',
  styleUrls: ['./examination-results-regular.component.css']
})
export class ExaminationResultsRegularComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new ExaminationResultsRegularDataModel();
  request_ExaminationResultsRegularDetails = new ExaminationResultsRegularDataModel_ProgrammesDetails();
  public StudentDetails: ExaminationResultsRegularDataModel_StudentDetails[] = [];

  public isSubmitted: boolean = false;
  public CurrentIndex: number = -1;
  public levelDataList: any = [];
  public programmeDataList: any = [];
  public disabled: boolean = false;
  public PreviewStatus: string = 'N';

  constructor(private ExaminationResultsRegularService: ExaminationResultsRegularService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
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
      this.request.SelectedCollegeEntryTypeName = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('EntryType')?.toString());
    }

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.EntryType = "Results Regular";

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
      await this.ExaminationResultsRegularService.GetByID(this.request.CollegeID, this.request.ModifyBy, this.request.EntryType)
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
      if (this.request.SelectedCollegeEntryTypeName == 'University') {
        if (this.request.ProgrammesDetails[i].Faculty_School == '') {
          this.toastr.error('Faculty/ School field is required.!');
          const txtFaculty_School = document.getElementById('txtFaculty_School_' + i.toString());
          if (txtFaculty_School) txtFaculty_School.focus();
          return;
        }
      }
      if (this.request.SelectedCollegeEntryTypeName == 'University') {
        if (this.request.ProgrammesDetails[i].Department_Centre == '') {
          this.toastr.error('Department/Centre field is required.!');
          const txtDepartment_Centre_ = document.getElementById('txtDepartment_Centre_' + i.toString());
          if (txtDepartment_Centre_) txtDepartment_Centre_.focus();
          return;
        }
      }
      if (this.request.SelectedCollegeEntryTypeName == 'University' || this.request.SelectedCollegeEntryTypeName == 'Polytechnic') {
        if (this.request.ProgrammesDetails[i].LevelID == 0) {
          this.toastr.error('Level field is required.!');
          const ddlLevel_ = document.getElementById('ddlLevel_' + i.toString());
          if (ddlLevel_) ddlLevel_.focus();
          return;
        }
      }

      if (this.request.ProgrammesDetails[i].Discipline == '') {
        this.toastr.error('Discipline field is required.!');
        const txtDiscipline_ = document.getElementById('txtDiscipline_' + i.toString());
        if (txtDiscipline_) txtDiscipline_.focus();
        return;
      }


    }


    this.loaderService.requestStarted();
    this.isLoading = true;
    await this.Modify_SaveJsonData();
    try {
      await this.ExaminationResultsRegularService.SaveData(this.request)
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
  async btnAdd_Click(row: ExaminationResultsRegularDataModel_ProgrammesDetails, idx: number) {
    if (row != undefined) {
      if (this.request.SelectedCollegeEntryTypeName == 'University') {
        if (row.Faculty_School == '') {
          this.toastr.error('Faculty/ School field is required.!');
          const txtFaculty_School = document.getElementById('txtFaculty_School_' + idx.toString());
          if (txtFaculty_School) txtFaculty_School.focus();
          return;
        }
      }
      if (this.request.SelectedCollegeEntryTypeName == 'University') {
        if (row.Department_Centre == '') {
          this.toastr.error('Department/Centre field is required.!');
          const txtDepartment_Centre_ = document.getElementById('txtDepartment_Centre_' + idx.toString());
          if (txtDepartment_Centre_) txtDepartment_Centre_.focus();
          return;
        }
      }
      if (this.request.SelectedCollegeEntryTypeName == 'University' || this.request.SelectedCollegeEntryTypeName == 'Polytechnic' || this.request.SelectedCollegeEntryTypeName == 'Standalone') {
        if (row.LevelID == 0) {
          this.toastr.error('Level field is required.!');
          const ddlLevel_ = document.getElementById('ddlLevel_' + idx.toString());
          if (ddlLevel_) ddlLevel_.focus();
          return;
        }
      }
      if (row.Discipline == '') {
        this.toastr.error('Discipline field is required.!');
        const txtDiscipline_ = document.getElementById('txtDiscipline_' + idx.toString());
        if (txtDiscipline_) txtDiscipline_.focus();
        return;
      }

    }

    try {
      this.StudentDetails = [];
      this.StudentDetails.push(
        {
          AppeardCategory: 'PWD',
          AppeardGeneralCategoryMale: 0,
          AppeardGeneralCategoryFemale: 0,
          AppeardGeneralCategoryTransGender: 0,

          AppeardEWSCategoryMale: 0,
          AppeardEWSCategoryFemale: 0,
          AppeardEWSCategoryTransGender: 0,

          AppeardSCCategoryMale: 0,
          AppeardSCCategoryFemale: 0,
          AppeardSCCategoryTransGender: 0,

          AppeardSTCategoryMale: 0,
          AppeardSTCategoryFemale: 0,
          AppeardSTCategoryTransGender: 0,

          AppeardOBCCategoryMale: 0,
          AppeardOBCCategoryFemale: 0,
          AppeardOBCCategoryTransGender: 0,

          AppeardTotalCategoryMale: 0,
          AppeardTotalCategoryFemale: 0,
          AppeardTotalCategoryTransGender: 0,



          //Total Number of Students Passed/Awarded Degree
          PassedCategory: 'PWD',
          PassedGeneralCategoryMale: 0,
          PassedGeneralCategoryFemale: 0,
          PassedGeneralCategoryTransGender: 0,

          PassedEWSCategoryMale: 0,
          PassedEWSCategoryFemale: 0,
          PassedEWSCategoryTransGender: 0,

          PassedSCCategoryMale: 0,
          PassedSCCategoryFemale: 0,
          PassedSCCategoryTransGender: 0,

          PassedSTCategoryMale: 0,
          PassedSTCategoryFemale: 0,
          PassedSTCategoryTransGender: 0,

          PassedOBCCategoryMale: 0,
          PassedOBCCategoryFemale: 0,
          PassedOBCCategoryTransGender: 0,

          PassedTotalCategoryMale: 0,
          PassedTotalCategoryFemale: 0,
          PassedTotalCategoryTransGender: 0,

          //Out of Total, Number of Students Passed with 60% or above
          OutofTotalPassedCategory: 'PWD',
          OutofTotalPassedGeneralCategoryMale: 0,
          OutofTotalPassedGeneralCategoryFemale: 0,
          OutofTotalPassedGeneralCategoryTransGender: 0,

          OutofTotalPassedEWSCategoryMale: 0,
          OutofTotalPassedEWSCategoryFemale: 0,
          OutofTotalPassedEWSCategoryTransGender: 0,

          OutofTotalPassedSCCategoryMale: 0,
          OutofTotalPassedSCCategoryFemale: 0,
          OutofTotalPassedSCCategoryTransGender: 0,

          OutofTotalPassedSTCategoryMale: 0,
          OutofTotalPassedSTCategoryFemale: 0,
          OutofTotalPassedSTCategoryTransGender: 0,

          OutofTotalPassedOBCCategoryMale: 0,
          OutofTotalPassedOBCCategoryFemale: 0,
          OutofTotalPassedOBCCategoryTransGender: 0,

          OutofTotalPassedTotalCategoryMale: 0,
          OutofTotalPassedTotalCategoryFemale: 0,
          OutofTotalPassedTotalCategoryTransGender: 0,


        },
        {
          AppeardCategory: 'Muslim Minority',
          AppeardGeneralCategoryMale: 0,
          AppeardGeneralCategoryFemale: 0,
          AppeardGeneralCategoryTransGender: 0,

          AppeardEWSCategoryMale: 0,
          AppeardEWSCategoryFemale: 0,
          AppeardEWSCategoryTransGender: 0,

          AppeardSCCategoryMale: 0,
          AppeardSCCategoryFemale: 0,
          AppeardSCCategoryTransGender: 0,

          AppeardSTCategoryMale: 0,
          AppeardSTCategoryFemale: 0,
          AppeardSTCategoryTransGender: 0,

          AppeardOBCCategoryMale: 0,
          AppeardOBCCategoryFemale: 0,
          AppeardOBCCategoryTransGender: 0,

          AppeardTotalCategoryMale: 0,
          AppeardTotalCategoryFemale: 0,
          AppeardTotalCategoryTransGender: 0,



          //Total Number of Students Passed/Awarded Degree
          PassedCategory: 'Muslim Minority',
          PassedGeneralCategoryMale: 0,
          PassedGeneralCategoryFemale: 0,
          PassedGeneralCategoryTransGender: 0,

          PassedEWSCategoryMale: 0,
          PassedEWSCategoryFemale: 0,
          PassedEWSCategoryTransGender: 0,

          PassedSCCategoryMale: 0,
          PassedSCCategoryFemale: 0,
          PassedSCCategoryTransGender: 0,

          PassedSTCategoryMale: 0,
          PassedSTCategoryFemale: 0,
          PassedSTCategoryTransGender: 0,

          PassedOBCCategoryMale: 0,
          PassedOBCCategoryFemale: 0,
          PassedOBCCategoryTransGender: 0,

          PassedTotalCategoryMale: 0,
          PassedTotalCategoryFemale: 0,
          PassedTotalCategoryTransGender: 0,

          //Out of Total, Number of Students Passed with 60% or above
          OutofTotalPassedCategory: 'Muslim Minority',
          OutofTotalPassedGeneralCategoryMale: 0,
          OutofTotalPassedGeneralCategoryFemale: 0,
          OutofTotalPassedGeneralCategoryTransGender: 0,

          OutofTotalPassedEWSCategoryMale: 0,
          OutofTotalPassedEWSCategoryFemale: 0,
          OutofTotalPassedEWSCategoryTransGender: 0,

          OutofTotalPassedSCCategoryMale: 0,
          OutofTotalPassedSCCategoryFemale: 0,
          OutofTotalPassedSCCategoryTransGender: 0,

          OutofTotalPassedSTCategoryMale: 0,
          OutofTotalPassedSTCategoryFemale: 0,
          OutofTotalPassedSTCategoryTransGender: 0,

          OutofTotalPassedOBCCategoryMale: 0,
          OutofTotalPassedOBCCategoryFemale: 0,
          OutofTotalPassedOBCCategoryTransGender: 0,

          OutofTotalPassedTotalCategoryMale: 0,
          OutofTotalPassedTotalCategoryFemale: 0,
          OutofTotalPassedTotalCategoryTransGender: 0,

        },
        {
          AppeardCategory: 'Other Minority',
          AppeardGeneralCategoryMale: 0,
          AppeardGeneralCategoryFemale: 0,
          AppeardGeneralCategoryTransGender: 0,

          AppeardEWSCategoryMale: 0,
          AppeardEWSCategoryFemale: 0,
          AppeardEWSCategoryTransGender: 0,

          AppeardSCCategoryMale: 0,
          AppeardSCCategoryFemale: 0,
          AppeardSCCategoryTransGender: 0,

          AppeardSTCategoryMale: 0,
          AppeardSTCategoryFemale: 0,
          AppeardSTCategoryTransGender: 0,

          AppeardOBCCategoryMale: 0,
          AppeardOBCCategoryFemale: 0,
          AppeardOBCCategoryTransGender: 0,

          AppeardTotalCategoryMale: 0,
          AppeardTotalCategoryFemale: 0,
          AppeardTotalCategoryTransGender: 0,


          //Total Number of Students Passed/Awarded Degree
          PassedCategory: 'Other Minority',
          PassedGeneralCategoryMale: 0,
          PassedGeneralCategoryFemale: 0,
          PassedGeneralCategoryTransGender: 0,

          PassedEWSCategoryMale: 0,
          PassedEWSCategoryFemale: 0,
          PassedEWSCategoryTransGender: 0,

          PassedSCCategoryMale: 0,
          PassedSCCategoryFemale: 0,
          PassedSCCategoryTransGender: 0,

          PassedSTCategoryMale: 0,
          PassedSTCategoryFemale: 0,
          PassedSTCategoryTransGender: 0,

          PassedOBCCategoryMale: 0,
          PassedOBCCategoryFemale: 0,
          PassedOBCCategoryTransGender: 0,

          PassedTotalCategoryMale: 0,
          PassedTotalCategoryFemale: 0,
          PassedTotalCategoryTransGender: 0,


          //Out of Total, Number of Students Passed with 60% or above
          OutofTotalPassedCategory: 'Other Minority',
          OutofTotalPassedGeneralCategoryMale: 0,
          OutofTotalPassedGeneralCategoryFemale: 0,
          OutofTotalPassedGeneralCategoryTransGender: 0,

          OutofTotalPassedEWSCategoryMale: 0,
          OutofTotalPassedEWSCategoryFemale: 0,
          OutofTotalPassedEWSCategoryTransGender: 0,

          OutofTotalPassedSCCategoryMale: 0,
          OutofTotalPassedSCCategoryFemale: 0,
          OutofTotalPassedSCCategoryTransGender: 0,

          OutofTotalPassedSTCategoryMale: 0,
          OutofTotalPassedSTCategoryFemale: 0,
          OutofTotalPassedSTCategoryTransGender: 0,

          OutofTotalPassedOBCCategoryMale: 0,
          OutofTotalPassedOBCCategoryFemale: 0,
          OutofTotalPassedOBCCategoryTransGender: 0,

          OutofTotalPassedTotalCategoryMale: 0,
          OutofTotalPassedTotalCategoryFemale: 0,
          OutofTotalPassedTotalCategoryTransGender: 0,


        }
      )

      var trCss = (Number(this.request.ProgrammesDetails.length) + 1) % 2 === 0 ? "trAlter" : "";

      this.request.ProgrammesDetails.push({
        Faculty_School: "",
        Department_Centre: "",
        LevelID: 0,
        LevelName: "",
        Discipline: "",

        AppeardCategory: 'Total',
        AppeardGeneralCategoryMale: 0,
        AppeardGeneralCategoryFemale: 0,
        AppeardGeneralCategoryTransGender: 0,

        AppeardEWSCategoryMale: 0,
        AppeardEWSCategoryFemale: 0,
        AppeardEWSCategoryTransGender: 0,

        AppeardSCCategoryMale: 0,
        AppeardSCCategoryFemale: 0,
        AppeardSCCategoryTransGender: 0,

        AppeardSTCategoryMale: 0,
        AppeardSTCategoryFemale: 0,
        AppeardSTCategoryTransGender: 0,

        AppeardOBCCategoryMale: 0,
        AppeardOBCCategoryFemale: 0,
        AppeardOBCCategoryTransGender: 0,

        AppeardTotalCategoryMale: 0,
        AppeardTotalCategoryFemale: 0,
        AppeardTotalCategoryTransGender: 0,

        AppeardRemark: '',


        //Total Number of Students Passed/Awarded Degree
        PassedCategory: 'Total',
        PassedGeneralCategoryMale: 0,
        PassedGeneralCategoryFemale: 0,
        PassedGeneralCategoryTransGender: 0,

        PassedEWSCategoryMale: 0,
        PassedEWSCategoryFemale: 0,
        PassedEWSCategoryTransGender: 0,

        PassedSCCategoryMale: 0,
        PassedSCCategoryFemale: 0,
        PassedSCCategoryTransGender: 0,

        PassedSTCategoryMale: 0,
        PassedSTCategoryFemale: 0,
        PassedSTCategoryTransGender: 0,

        PassedOBCCategoryMale: 0,
        PassedOBCCategoryFemale: 0,
        PassedOBCCategoryTransGender: 0,

        PassedTotalCategoryMale: 0,
        PassedTotalCategoryFemale: 0,
        PassedTotalCategoryTransGender: 0,

        PassedRemark: '',

        //Out of Total, Number of Students Passed with 60% or above
        OutofTotalPassedCategory: 'Total',
        OutofTotalPassedGeneralCategoryMale: 0,
        OutofTotalPassedGeneralCategoryFemale: 0,
        OutofTotalPassedGeneralCategoryTransGender: 0,

        OutofTotalPassedEWSCategoryMale: 0,
        OutofTotalPassedEWSCategoryFemale: 0,
        OutofTotalPassedEWSCategoryTransGender: 0,

        OutofTotalPassedSCCategoryMale: 0,
        OutofTotalPassedSCCategoryFemale: 0,
        OutofTotalPassedSCCategoryTransGender: 0,

        OutofTotalPassedSTCategoryMale: 0,
        OutofTotalPassedSTCategoryFemale: 0,
        OutofTotalPassedSTCategoryTransGender: 0,

        OutofTotalPassedOBCCategoryMale: 0,
        OutofTotalPassedOBCCategoryFemale: 0,
        OutofTotalPassedOBCCategoryTransGender: 0,

        OutofTotalPassedTotalCategoryMale: 0,
        OutofTotalPassedTotalCategoryFemale: 0,
        OutofTotalPassedTotalCategoryTransGender: 0,

        OutofTotalPassedRemark: '',


        StudentDetails: this.StudentDetails,
        trCss: trCss
      });

    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {

        const txtFaculty_School = document.getElementById('txtFaculty_School_' + (idx + 1).toString());
        if (txtFaculty_School) txtFaculty_School.focus();


        this.loaderService.requestEnded();
        const btnAdd = document.getElementById('btnAdd')
        if (btnAdd) { btnAdd.innerText = "Add"; }

      }, 200);
    }
  }
  Modify_SaveJsonData() {
    for (var i = 0; i < this.request.ProgrammesDetails.length; i++) {

      this.request.ProgrammesDetails[i].AppeardGeneralCategoryMale =
        this.request.ProgrammesDetails[i].AppeardGeneralCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardGeneralCategoryMale;
      this.request.ProgrammesDetails[i].AppeardGeneralCategoryFemale =
        this.request.ProgrammesDetails[i].AppeardGeneralCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardGeneralCategoryFemale;
      this.request.ProgrammesDetails[i].AppeardGeneralCategoryTransGender =
        this.request.ProgrammesDetails[i].AppeardGeneralCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardGeneralCategoryTransGender;
      this.request.ProgrammesDetails[i].AppeardEWSCategoryMale =
        this.request.ProgrammesDetails[i].AppeardEWSCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardEWSCategoryMale;
      this.request.ProgrammesDetails[i].AppeardEWSCategoryFemale =
        this.request.ProgrammesDetails[i].AppeardEWSCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardEWSCategoryFemale;
      this.request.ProgrammesDetails[i].AppeardEWSCategoryTransGender =
        this.request.ProgrammesDetails[i].AppeardEWSCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardEWSCategoryTransGender;
      this.request.ProgrammesDetails[i].AppeardSCCategoryMale =
        this.request.ProgrammesDetails[i].AppeardSCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardSCCategoryMale;
      this.request.ProgrammesDetails[i].AppeardSCCategoryFemale =
        this.request.ProgrammesDetails[i].AppeardSCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardSCCategoryFemale;
      this.request.ProgrammesDetails[i].AppeardSCCategoryTransGender =
        this.request.ProgrammesDetails[i].AppeardSCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardSCCategoryTransGender;
      this.request.ProgrammesDetails[i].AppeardSTCategoryMale =
        this.request.ProgrammesDetails[i].AppeardSTCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardSTCategoryMale;
      this.request.ProgrammesDetails[i].AppeardSTCategoryFemale =
        this.request.ProgrammesDetails[i].AppeardSTCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardSTCategoryFemale;
      this.request.ProgrammesDetails[i].AppeardSTCategoryTransGender =
        this.request.ProgrammesDetails[i].AppeardSTCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardSTCategoryTransGender;
      this.request.ProgrammesDetails[i].AppeardOBCCategoryMale =
        this.request.ProgrammesDetails[i].AppeardOBCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardOBCCategoryMale;
      this.request.ProgrammesDetails[i].AppeardOBCCategoryFemale =
        this.request.ProgrammesDetails[i].AppeardOBCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardOBCCategoryFemale;
      this.request.ProgrammesDetails[i].AppeardOBCCategoryTransGender =
        this.request.ProgrammesDetails[i].AppeardOBCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardOBCCategoryTransGender;
      this.request.ProgrammesDetails[i].AppeardTotalCategoryMale =
        this.request.ProgrammesDetails[i].AppeardTotalCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardTotalCategoryMale;
      this.request.ProgrammesDetails[i].AppeardTotalCategoryFemale =
        this.request.ProgrammesDetails[i].AppeardTotalCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardTotalCategoryFemale;
      this.request.ProgrammesDetails[i].AppeardTotalCategoryTransGender =
        this.request.ProgrammesDetails[i].AppeardTotalCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].AppeardTotalCategoryTransGender;
      this.request.ProgrammesDetails[i].PassedGeneralCategoryMale =
        this.request.ProgrammesDetails[i].PassedGeneralCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedGeneralCategoryMale;
      this.request.ProgrammesDetails[i].PassedGeneralCategoryFemale =
        this.request.ProgrammesDetails[i].PassedGeneralCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedGeneralCategoryFemale;
      this.request.ProgrammesDetails[i].PassedGeneralCategoryTransGender =
        this.request.ProgrammesDetails[i].PassedGeneralCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedGeneralCategoryTransGender;
      this.request.ProgrammesDetails[i].PassedEWSCategoryMale =
        this.request.ProgrammesDetails[i].PassedEWSCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedEWSCategoryMale;
      this.request.ProgrammesDetails[i].PassedEWSCategoryFemale =
        this.request.ProgrammesDetails[i].PassedEWSCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedEWSCategoryFemale;
      this.request.ProgrammesDetails[i].PassedEWSCategoryTransGender =
        this.request.ProgrammesDetails[i].PassedEWSCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedEWSCategoryTransGender;
      this.request.ProgrammesDetails[i].PassedSCCategoryMale =
        this.request.ProgrammesDetails[i].PassedSCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedSCCategoryMale;
      this.request.ProgrammesDetails[i].PassedSCCategoryFemale =
        this.request.ProgrammesDetails[i].PassedSCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedSCCategoryFemale;
      this.request.ProgrammesDetails[i].PassedSCCategoryTransGender =
        this.request.ProgrammesDetails[i].PassedSCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedSCCategoryTransGender;
      this.request.ProgrammesDetails[i].PassedSTCategoryMale =
        this.request.ProgrammesDetails[i].PassedSTCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedSTCategoryMale;
      this.request.ProgrammesDetails[i].PassedSTCategoryFemale =
        this.request.ProgrammesDetails[i].PassedSTCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedSTCategoryFemale;
      this.request.ProgrammesDetails[i].PassedSTCategoryTransGender =
        this.request.ProgrammesDetails[i].PassedSTCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedSTCategoryTransGender;
      this.request.ProgrammesDetails[i].PassedOBCCategoryMale =
        this.request.ProgrammesDetails[i].PassedOBCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedOBCCategoryMale;
      this.request.ProgrammesDetails[i].PassedOBCCategoryFemale =
        this.request.ProgrammesDetails[i].PassedOBCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedOBCCategoryFemale;
      this.request.ProgrammesDetails[i].PassedOBCCategoryTransGender =
        this.request.ProgrammesDetails[i].PassedOBCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedOBCCategoryTransGender;
      this.request.ProgrammesDetails[i].PassedTotalCategoryMale =
        this.request.ProgrammesDetails[i].PassedTotalCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedTotalCategoryMale;
      this.request.ProgrammesDetails[i].PassedTotalCategoryFemale =
        this.request.ProgrammesDetails[i].PassedTotalCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedTotalCategoryFemale;
      this.request.ProgrammesDetails[i].PassedTotalCategoryTransGender =
        this.request.ProgrammesDetails[i].PassedTotalCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].PassedTotalCategoryTransGender;
      this.request.ProgrammesDetails[i].OutofTotalPassedGeneralCategoryMale =
        this.request.ProgrammesDetails[i].OutofTotalPassedGeneralCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedGeneralCategoryMale;
      this.request.ProgrammesDetails[i].OutofTotalPassedGeneralCategoryFemale =
        this.request.ProgrammesDetails[i].OutofTotalPassedGeneralCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedGeneralCategoryFemale;
      this.request.ProgrammesDetails[i].OutofTotalPassedGeneralCategoryTransGender =
        this.request.ProgrammesDetails[i].OutofTotalPassedGeneralCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedGeneralCategoryTransGender;
      this.request.ProgrammesDetails[i].OutofTotalPassedEWSCategoryMale =
        this.request.ProgrammesDetails[i].OutofTotalPassedEWSCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedEWSCategoryMale;
      this.request.ProgrammesDetails[i].OutofTotalPassedEWSCategoryFemale =
        this.request.ProgrammesDetails[i].OutofTotalPassedEWSCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedEWSCategoryFemale;
      this.request.ProgrammesDetails[i].OutofTotalPassedEWSCategoryTransGender =
        this.request.ProgrammesDetails[i].OutofTotalPassedEWSCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedEWSCategoryTransGender;
      this.request.ProgrammesDetails[i].OutofTotalPassedSCCategoryMale =
        this.request.ProgrammesDetails[i].OutofTotalPassedSCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedSCCategoryMale;
      this.request.ProgrammesDetails[i].OutofTotalPassedSCCategoryFemale =
        this.request.ProgrammesDetails[i].OutofTotalPassedSCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedSCCategoryFemale;
      this.request.ProgrammesDetails[i].OutofTotalPassedSCCategoryTransGender =
        this.request.ProgrammesDetails[i].OutofTotalPassedSCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedSCCategoryTransGender;
      this.request.ProgrammesDetails[i].OutofTotalPassedSTCategoryMale =
        this.request.ProgrammesDetails[i].OutofTotalPassedSTCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedSTCategoryMale;
      this.request.ProgrammesDetails[i].OutofTotalPassedSTCategoryFemale =
        this.request.ProgrammesDetails[i].OutofTotalPassedSTCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedSTCategoryFemale;
      this.request.ProgrammesDetails[i].OutofTotalPassedSTCategoryTransGender =
        this.request.ProgrammesDetails[i].OutofTotalPassedSTCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedSTCategoryTransGender;
      this.request.ProgrammesDetails[i].OutofTotalPassedOBCCategoryMale =
        this.request.ProgrammesDetails[i].OutofTotalPassedOBCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedOBCCategoryMale;
      this.request.ProgrammesDetails[i].OutofTotalPassedOBCCategoryFemale =
        this.request.ProgrammesDetails[i].OutofTotalPassedOBCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedOBCCategoryFemale;
      this.request.ProgrammesDetails[i].OutofTotalPassedOBCCategoryTransGender =
        this.request.ProgrammesDetails[i].OutofTotalPassedOBCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedOBCCategoryTransGender;
      this.request.ProgrammesDetails[i].OutofTotalPassedTotalCategoryMale =
        this.request.ProgrammesDetails[i].OutofTotalPassedTotalCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedTotalCategoryMale;
      this.request.ProgrammesDetails[i].OutofTotalPassedTotalCategoryFemale =
        this.request.ProgrammesDetails[i].OutofTotalPassedTotalCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedTotalCategoryFemale;
      this.request.ProgrammesDetails[i].OutofTotalPassedTotalCategoryTransGender =
        this.request.ProgrammesDetails[i].OutofTotalPassedTotalCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OutofTotalPassedTotalCategoryTransGender;


      for (var j = 0; j < this.request.ProgrammesDetails[i].StudentDetails.length; j++) {

        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardGeneralCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardGeneralCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardGeneralCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardGeneralCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardGeneralCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardGeneralCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardGeneralCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardGeneralCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardGeneralCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardEWSCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardEWSCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardEWSCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardEWSCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardEWSCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardEWSCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardEWSCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardEWSCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardEWSCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSCCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSCCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSCCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSCCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSCCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSCCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSTCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSTCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSTCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSTCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSTCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSTCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSTCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSTCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardSTCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardOBCCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardOBCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardOBCCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardOBCCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardOBCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardOBCCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardOBCCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardOBCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardOBCCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardTotalCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardTotalCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardTotalCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardTotalCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardTotalCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardTotalCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].AppeardTotalCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].AppeardTotalCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].AppeardTotalCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedGeneralCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedGeneralCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedGeneralCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedGeneralCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedGeneralCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedGeneralCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedGeneralCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedGeneralCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedGeneralCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedEWSCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedEWSCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedEWSCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedEWSCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedEWSCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedEWSCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedEWSCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedEWSCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedEWSCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedSCCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedSCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedSCCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedSCCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedSCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedSCCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedSCCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedSCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedSCCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedSTCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedSTCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedSTCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedSTCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedSTCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedSTCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedSTCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedSTCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedSTCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedOBCCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedOBCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedOBCCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedOBCCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedOBCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedOBCCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedOBCCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedOBCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedOBCCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedTotalCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedTotalCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedTotalCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedTotalCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedTotalCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedTotalCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].PassedTotalCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].PassedTotalCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].PassedTotalCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedGeneralCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedGeneralCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedGeneralCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedGeneralCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedGeneralCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedGeneralCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedGeneralCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedGeneralCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedGeneralCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedEWSCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedEWSCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedEWSCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedEWSCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedEWSCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedEWSCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedEWSCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedEWSCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedEWSCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSCCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSCCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSCCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSCCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSCCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSCCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSTCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSTCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSTCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSTCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSTCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSTCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSTCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSTCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedSTCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedOBCCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedOBCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedOBCCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedOBCCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedOBCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedOBCCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedOBCCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedOBCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedOBCCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedTotalCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedTotalCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedTotalCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedTotalCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedTotalCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedTotalCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedTotalCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedTotalCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OutofTotalPassedTotalCategoryTransGender;
      }


    }
  }


}

