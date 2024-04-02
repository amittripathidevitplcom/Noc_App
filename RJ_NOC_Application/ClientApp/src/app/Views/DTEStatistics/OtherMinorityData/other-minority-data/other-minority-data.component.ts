import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/*import { LoaderService } from '../../../Services/Loader/loader.service';*/
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OtherMinorityDataModel, OtherMinorityDataModel_OtherMinorityDetails } from '../../../../Models/DTEStatistics/OtherMinorityDataModel';
import { StatisticsEntryComponent } from '../../../Statistics/statistics-entry/statistics-entry.component';
import { OtherMinorityDataService } from '../../../../Services/DTEStatistics/OtherMinorityData/other-minority-data.service';
//import { PlacementDetailsService } from '../../../../Services/DTEStatistics/PlacementDetails/placement-details.service';

@Component({
  selector: 'app-other-minority-data',
  templateUrl: './other-minority-data.component.html',
  styleUrls: ['./other-minority-data.component.css']
})
export class OtherMinorityDataComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new OtherMinorityDataModel();
  request_OtherMinorityDetails = new OtherMinorityDataModel_OtherMinorityDetails();
  public isSubmitted: boolean = false;
  public CurrentIndex: number = -1;
  public levelDataList: any = [];
  public programmeDataList: any = [];

  constructor(private OtherMinorityDataService: OtherMinorityDataService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent) {
  }
  async ngOnInit() {
    this.request.OtherMinorityDetails = [];
    this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
    this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;
    this.request.EntryType = "Other Minority Details";

    await this.CourseLevel();
    await this.GetProgramme();
    await this.btnAdd_Click(this.request.OtherMinorityDetails[0], 0);
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
      await this.OtherMinorityDataService.GetByID(this.request.CollegeID, this.request.ModifyBy, this.request.EntryType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;

          if (data['Data'].OtherMinorityDetails.length > 0) {
            this.request.OtherMinorityDetails = data['Data'].OtherMinorityDetails;
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
    debugger;
    
    this.isSubmitted = true;
    

    for (var i = 0; i < this.request.OtherMinorityDetails.length; i++) {

      //  if (this.request.PlacementDetails[i].Faculty_School == '') {
      //    this.toastr.error('Faculty/ School field is required.!');
      //    const txtFaculty_School = document.getElementById('txtFaculty_School_' + i.toString());
      //    if (txtFaculty_School) txtFaculty_School.focus();
      //    return;
      //  }

      //  if (this.request.PlacementDetails[i].Department_Centre == '') {
      //    this.toastr.error('Department/Centre field is required.!');
      //    const txtDepartment_Centre_ = document.getElementById('txtDepartment_Centre_' + i.toString());
      //    if (txtDepartment_Centre_) txtDepartment_Centre_.focus();
      //    return;
      //    return;
      //  }
      //  if (this.request.PlacementDetails[i].LevelID == 0) {
      //    this.toastr.error('Level field is required.!');
      //    const ddlLevel_ = document.getElementById('ddlLevel_' + i.toString());
      //    if (ddlLevel_) ddlLevel_.focus();
      //    return;
      //  }
      //  if (this.request.PlacementDetails[i].ProgrammeID == 0) {
      //    this.toastr.error('Name Of The Programme field is required.!');
      //    const ddlProgramme_ = document.getElementById('ddlProgramme_' + i.toString());
      //    if (ddlProgramme_) ddlProgramme_.focus();
      //    return;
      //  }
    }

    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.OtherMinorityDataService.SaveData(this.request)
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
        this.request.OtherMinorityDetails.splice(i, 1);
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
  async btnAdd_Click(row: OtherMinorityDataModel_OtherMinorityDetails, idx: number) {
    if (row != undefined) {

      //if (row.Discipline == null) {
      //  this.toastr.error('No. Of Students Placed (Male).!');
      //  const NoOfStudentsPlaced_Male = document.getElementById('NoOfStudentsPlaced_Male' + idx.toString());
      //  if (NoOfStudentsPlaced_Male) NoOfStudentsPlaced_Male.focus();
      //  return;
      //}
      //if (row.NoOfStudentsPlaced_Female == null) {
      //  this.toastr.error('No. Of Students Placed (Female).!');
      //  const NoOfStudentsPlaced_Female = document.getElementById('NoOfStudentsPlaced_Female' + idx.toString());
      //  if (NoOfStudentsPlaced_Female) NoOfStudentsPlaced_Female.focus();
      //  return;
      //}
      //if (row.NoOfStudentsSelectedForHigherStudies_Male == null) {
      //  this.toastr.error('No. Of Students <br />Selected For Higher <br />Studies (Male)');
      //  const NoOfStudentsSelectedForHigherStudies_Male = document.getElementById('NoOfStudentsSelectedForHigherStudies_Male' + idx.toString());
      //  if (NoOfStudentsSelectedForHigherStudies_Male) NoOfStudentsSelectedForHigherStudies_Male.focus();
      //  return;
      //}

      //if (row.NoOfStudentsSelectedForHigherStudies_Female == null) {
      //  this.toastr.error('No. Of Students <br />Selected For Higher <br />Studies (Female)');
      //  const NoOfStudentsSelectedForHigherStudies_Female = document.getElementById('NoOfStudentsSelectedForHigherStudies_Female' + idx.toString());
      //  if (NoOfStudentsSelectedForHigherStudies_Female) NoOfStudentsSelectedForHigherStudies_Female.focus();
      //  return;
      //}

      //if (row.MedianAnnualSalaryforPlacedStudents == null) {
      //  this.toastr.error('Median Annual Salary for placed students');
      //  const MedianAnnualSalaryforPlacedStudents = document.getElementById('MedianAnnualSalaryforPlacedStudents' + idx.toString());
      //  if (MedianAnnualSalaryforPlacedStudents) MedianAnnualSalaryforPlacedStudents.focus();
      //  return;
      //}


    }

    try {
      this.request.OtherMinorityDetails.push({
        Discipline: "",
        Year: 0,
        General_Male: 0,
        General_Female: 0,
        General_Transgender: 0,
        EWS_Male: 0,
        EWS_Female : 0,
        EWS_Transgender: 0,
        SC_Male: 0,
        SC_Female:0,
        SC_Transgender: 0 ,
        ST_Male: 0,
        ST_Female:0,
        ST_Transgender:  0,
        OBC_Male: 0 ,
        OBC_Female: 0,
        OBC_Transgender: 0,
        Total_Male: 0,
        Total_Female: 0,
        Total_Transgender:0,

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
  //async NoOfStudentsPlaced_Male_OnChange(row: PlacementDetailsDataModel_PlacementDetails, idx: number) {
  //  row.NoOfStudentsPlaced_Total = (Number(row.NoOfStudentsPlaced_Male) + Number(row.NoOfStudentsPlaced_Female));
  //}
  //async NoOfStudentsPlaced_Female_OnChange(row: PlacementDetailsDataModel_PlacementDetails, idx: number) {
  //  row.NoOfStudentsPlaced_Total = (Number(row.NoOfStudentsPlaced_Male) + Number(row.NoOfStudentsPlaced_Female));
  //}
  //async NoOfStudentsSelectedForHigherStudies_Male_OnChange(row: PlacementDetailsDataModel_PlacementDetails, idx: number) {
  //  row.NoOfStudentsPlaced_Total = (Number(row.NoOfStudentsSelectedForHigherStudies_Male) + Number(row.NoOfStudentsSelectedForHigherStudies_Female));
  //}
  //async NoOfStudentsSelectedForHigherStudies_Female_OnChange(row: PlacementDetailsDataModel_PlacementDetails, idx: number) {
  //  row.NoOfStudentsSelectedForHigherStudies_Total = (Number(row.NoOfStudentsSelectedForHigherStudies_Male) + Number(row.NoOfStudentsSelectedForHigherStudies_Female));
  //}


}





