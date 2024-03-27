import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DTEStatisticsStaffDataModel_NonTeaching, DTEStatisticsStaffDataModel_NonTeaching_ProgrammesDetails, DTEStatisticsStaffDataModel_NonTeaching_StudentDetails } from '../../../Models/DTEStatistics/DTEStatisticsStaffDataModel';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { DTEStatisticsStaffService } from '../../../Services/DTEStatistics/DTEStatistics_Staff/dtestatistics-staff.service';

@Component({
  selector: 'app-dtestatistics-non-teaching',
  templateUrl: './dtestatistics-non-teaching.component.html',
  styleUrls: ['./dtestatistics-non-teaching.component.css']
})
export class DTEStatisticsNonTeachingComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new DTEStatisticsStaffDataModel_NonTeaching();
  request_StudentEnrollmentDistanceModeDetails = new DTEStatisticsStaffDataModel_NonTeaching_ProgrammesDetails();
  public StudentDetails: DTEStatisticsStaffDataModel_NonTeaching_StudentDetails[] = [];

  public isSubmitted: boolean = false;
  public CurrentIndex: number = -1;
  public levelDataList: any = [];
  public programmeDataList: any = [];

  constructor(private StudentEnrollmentDistanceModeService: DTEStatisticsStaffService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent) {
  }
  async ngOnInit() {

    this.request.ProgrammesDetails = [];

    this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
    this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.EntryType = "Regular Mode";

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

      if (this.request.ProgrammesDetails[i].StaffType == '') {
        this.toastr.error('Staff Type field is required.!');
        const txtFaculty_School = document.getElementById('txtFaculty_School_' + i.toString());
        if (txtFaculty_School) txtFaculty_School.focus();
        return;
      }
      if (this.request.ProgrammesDetails[i].GroupName == '') {
        this.toastr.error('Group field is required.!');
        const txtDepartment_Centre_ = document.getElementById('txtDepartment_Centre_' + i.toString());
        if (txtDepartment_Centre_) txtDepartment_Centre_.focus();
        return;
      }
      if (this.request.ProgrammesDetails[i].SanctionedStrength == '') {
        this.toastr.error('Sanctioned Strength field is required.!');
        const ddlLevel_ = document.getElementById('txtDiscipline_' + i.toString());
        if (ddlLevel_) ddlLevel_.focus();
        return;
      }


    }
    await this.Modify_SaveJsonData()

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
  async btnAdd_Click(row: DTEStatisticsStaffDataModel_NonTeaching_ProgrammesDetails, idx: number) {
    if (row != undefined) {
      if (row.StaffType == '') {
        this.toastr.error('Staff Type field is required.!');
        const txtFaculty_School = document.getElementById('txtFaculty_School_' + idx.toString());
        if (txtFaculty_School) txtFaculty_School.focus();
        return;
      }
      if (row.GroupName == '') {
        this.toastr.error('Group field is required.!');
        const txtDepartment_Centre_ = document.getElementById('txtDepartment_Centre_' + idx.toString());
        if (txtDepartment_Centre_) txtDepartment_Centre_.focus();
        return;
        return;
      }
      if (row.SanctionedStrength == '') {
        this.toastr.error('Sanctioned Strength field is required.!');
        const ddlLevel_ = document.getElementById('txtDiscipline_' + idx.toString());
        if (ddlLevel_) ddlLevel_.focus();
        return;
      }

    }

    try {
      this.StudentDetails = [];
      this.StudentDetails.push({
        Category: "PWD",
        //General
        GeneralCategoryMale: 0,
        GeneralCategoryFemale: 0,
        GeneralCategoryTransGender: 0,
        //EWS
        EWSCategoryMale: 0,
        EWSCategoryFemale: 0,
        EWSCategoryTransGender: 0,
        //SC
        SCCategoryMale: 0,
        SCCategoryFemale: 0,
        SCCategoryTransGender: 0,
        //ST
        STCategoryMale: 0,
        STCategoryFemale: 0,
        STCategoryTransGender: 0,
        //OBC
        OBCCategoryMale: 0,
        OBCCategoryFemale: 0,
        OBCCategoryTransGender: 0,
        //Total
        TotalCategoryMale: 0,
        TotalCategoryFemale: 0,
        TotalCategoryTransGender: 0,
      }, {
        Category: "Muslim Minority",
        //General
        GeneralCategoryMale: 0,
        GeneralCategoryFemale: 0,
        GeneralCategoryTransGender: 0,
        //EWS
        EWSCategoryMale: 0,
        EWSCategoryFemale: 0,
        EWSCategoryTransGender: 0,
        //SC
        SCCategoryMale: 0,
        SCCategoryFemale: 0,
        SCCategoryTransGender: 0,
        //ST
        STCategoryMale: 0,
        STCategoryFemale: 0,
        STCategoryTransGender: 0,
        //OBC
        OBCCategoryMale: 0,
        OBCCategoryFemale: 0,
        OBCCategoryTransGender: 0,
        //Total
        TotalCategoryMale: 0,
        TotalCategoryFemale: 0,
        TotalCategoryTransGender: 0,
      }, {
        Category: "Other Minority",
        //General
        GeneralCategoryMale: 0,
        GeneralCategoryFemale: 0,
        GeneralCategoryTransGender: 0,
        //EWS
        EWSCategoryMale: 0,
        EWSCategoryFemale: 0,
        EWSCategoryTransGender: 0,
        //SC
        SCCategoryMale: 0,
        SCCategoryFemale: 0,
        SCCategoryTransGender: 0,
        //ST
        STCategoryMale: 0,
        STCategoryFemale: 0,
        STCategoryTransGender: 0,
        //OBC
        OBCCategoryMale: 0,
        OBCCategoryFemale: 0,
        OBCCategoryTransGender: 0,
        //Total
        TotalCategoryMale: 0,
        TotalCategoryFemale: 0,
        TotalCategoryTransGender: 0,
      })
      debugger;
      console.log(this.request.ProgrammesDetails.length);
      var trCss = (Number(this.request.ProgrammesDetails.length) + 1) % 2 === 0 ? "trAlter" : "";

      this.request.ProgrammesDetails.push({
        StaffType: "",
        GroupName: "",
        SanctionedStrength: "",
        Category: "Total",
        //General
        GeneralCategoryMale: 0,
        GeneralCategoryFemale: 0,
        GeneralCategoryTransGender: 0,
        //EWS
        EWSCategoryMale: 0,
        EWSCategoryFemale: 0,
        EWSCategoryTransGender: 0,
        //SC
        SCCategoryMale: 0,
        SCCategoryFemale: 0,
        SCCategoryTransGender: 0,
        //ST
        STCategoryMale: 0,
        STCategoryFemale: 0,
        STCategoryTransGender: 0,
        //OBC
        OBCCategoryMale: 0,
        OBCCategoryFemale: 0,
        OBCCategoryTransGender: 0,
        //Total
        TotalCategoryMale: 0,
        TotalCategoryFemale: 0,
        TotalCategoryTransGender: 0,
        StudentDetails: this.StudentDetails,
        Remark: "",
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

      this.request.ProgrammesDetails[i].GeneralCategoryMale =
        this.request.ProgrammesDetails[i].GeneralCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].GeneralCategoryMale;
      this.request.ProgrammesDetails[i].GeneralCategoryFemale =
        this.request.ProgrammesDetails[i].GeneralCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].GeneralCategoryFemale;
      this.request.ProgrammesDetails[i].GeneralCategoryTransGender =
        this.request.ProgrammesDetails[i].GeneralCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].GeneralCategoryTransGender;
      this.request.ProgrammesDetails[i].EWSCategoryMale =
        this.request.ProgrammesDetails[i].EWSCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].EWSCategoryMale;
      this.request.ProgrammesDetails[i].EWSCategoryFemale =
        this.request.ProgrammesDetails[i].EWSCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].EWSCategoryFemale;
      this.request.ProgrammesDetails[i].EWSCategoryTransGender =
        this.request.ProgrammesDetails[i].EWSCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].EWSCategoryTransGender;
      this.request.ProgrammesDetails[i].SCCategoryMale =
        this.request.ProgrammesDetails[i].SCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].SCCategoryMale;
      this.request.ProgrammesDetails[i].SCCategoryFemale =
        this.request.ProgrammesDetails[i].SCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].SCCategoryFemale;
      this.request.ProgrammesDetails[i].SCCategoryTransGender =
        this.request.ProgrammesDetails[i].SCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].SCCategoryTransGender;
      this.request.ProgrammesDetails[i].STCategoryMale =
        this.request.ProgrammesDetails[i].STCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].STCategoryMale;
      this.request.ProgrammesDetails[i].STCategoryFemale =
        this.request.ProgrammesDetails[i].STCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].STCategoryFemale;
      this.request.ProgrammesDetails[i].STCategoryTransGender =
        this.request.ProgrammesDetails[i].STCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].STCategoryTransGender;
      this.request.ProgrammesDetails[i].OBCCategoryMale =
        this.request.ProgrammesDetails[i].OBCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OBCCategoryMale;
      this.request.ProgrammesDetails[i].OBCCategoryFemale =
        this.request.ProgrammesDetails[i].OBCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OBCCategoryFemale;
      this.request.ProgrammesDetails[i].OBCCategoryTransGender =
        this.request.ProgrammesDetails[i].OBCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].OBCCategoryTransGender;
      this.request.ProgrammesDetails[i].TotalCategoryMale =
        this.request.ProgrammesDetails[i].TotalCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].TotalCategoryMale;
      this.request.ProgrammesDetails[i].TotalCategoryFemale =
        this.request.ProgrammesDetails[i].TotalCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].TotalCategoryFemale;
      this.request.ProgrammesDetails[i].TotalCategoryTransGender =
        this.request.ProgrammesDetails[i].TotalCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].TotalCategoryTransGender;


      for (var j = 0; j < this.request.ProgrammesDetails[i].StudentDetails.length; j++) {
        this.request.ProgrammesDetails[i].StudentDetails[j].GeneralCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].GeneralCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].GeneralCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].GeneralCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].GeneralCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].GeneralCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].GeneralCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].GeneralCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].GeneralCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].EWSCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].EWSCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].EWSCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].EWSCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].EWSCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].EWSCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].EWSCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].EWSCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].EWSCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].SCCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].SCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].SCCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].SCCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].SCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].SCCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].SCCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].SCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].SCCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].STCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].STCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].STCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].STCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].STCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].STCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].STCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].STCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].STCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].OBCCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OBCCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OBCCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OBCCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].OBCCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OBCCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].OBCCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].OBCCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].OBCCategoryTransGender;
        this.request.ProgrammesDetails[i].StudentDetails[j].TotalCategoryMale =
          this.request.ProgrammesDetails[i].StudentDetails[j].TotalCategoryMale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].TotalCategoryMale;
        this.request.ProgrammesDetails[i].StudentDetails[j].TotalCategoryFemale =
          this.request.ProgrammesDetails[i].StudentDetails[j].TotalCategoryFemale.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].TotalCategoryFemale;
        this.request.ProgrammesDetails[i].StudentDetails[j].TotalCategoryTransGender =
          this.request.ProgrammesDetails[i].StudentDetails[j].TotalCategoryTransGender.toString().length == 0 ? 0 : this.request.ProgrammesDetails[i].StudentDetails[j].TotalCategoryTransGender;
      }
    }
  }
}

