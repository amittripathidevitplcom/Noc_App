import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OffShoreCenterDataModel, OffShoreCenter_OffShoreCenterDetails } from '../../../Models/DTEStatistics/OffShoreCenterDataModel';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { OffShoreCenterService } from '../../../Services/DTEStatistics/OffShoreCenter/off-shore-center.service';
import { PreviewDTEStatisticsComponent } from '../preview-dtestatistics/preview-dtestatistics.component';

@Component({
  selector: 'app-off-shore-center',
  templateUrl: './off-shore-center.component.html',
  styleUrls: ['./off-shore-center.component.css']
})
export class OffShoreCenterComponent implements OnInit {
  OffShoreCenterFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new OffShoreCenterDataModel();
  request_OffShoreCenterDetails = new OffShoreCenter_OffShoreCenterDetails();
  public FinancialYear: string = ''
  public SearchRecordID: string = ''
  public isSubmitted: boolean = false;
  public DesignationMasterList: any = [];
  public HostelCategoryList: any = [];
  public CurrentIndex: number = -1;
  public PreviewStatus: string = 'N';

  constructor(private OffShoreCenterService: OffShoreCenterService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent, private previewDTEStatisticsComponent: PreviewDTEStatisticsComponent) {
  }
  async ngOnInit() {
    this.OffShoreCenterFormGroup = this.formBuilder.group(
      {
        txtNumberOfOffShoreCenter: [{ value: '', disabled: true }],

        txtNameOffShoreCenter: [''],
        txtCountry: [''],
        txtStudyMode: [''],
        txtTotalEnrolledStudents: [''],
        txtTotalEnrolledGirlsStudents: [''],
      })
    this.request.OffShoreCenterDetails = []

    this.PreviewStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('PreviewStatus')?.toString());
    if (this.PreviewStatus != 'Y') {
      this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
      this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;
      this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;
    }
    else {
      this.OffShoreCenterFormGroup.disable();
      this.SelectedDepartmentID = this.previewDTEStatisticsComponent.SelectedDepartmentID;
      this.SelectedCollageID = await this.previewDTEStatisticsComponent.GetCollegeID_SearchRecordID();
      //var dt = await this.previewDTEStatisticsComponent.GetCollegeDetails_After();
    }

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;

    await this.GetByID();
  }
  get form() { return this.OffShoreCenterFormGroup.controls; }

  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.OffShoreCenterService.GetByID(this.request.CollegeID, this.request.ModifyBy)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;

          this.request.NumberOfOffShoreCenter = data['Data'].NumberOfOffShoreCenter;
          this.request.OffShoreCenterDetails = data['Data'].OffShoreCenterDetails;


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
    if (this.OffShoreCenterFormGroup.invalid) {
      return
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.OffShoreCenterService.SaveData(this.request)
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
  async btnEdit_Click(Item: any, idx: number) {
    this.CurrentIndex = idx;
    this.request_OffShoreCenterDetails.NameOffShoreCenter = Item.NameOffShoreCenter;
    this.request_OffShoreCenterDetails.Country = Item.Country;
    this.request_OffShoreCenterDetails.StudyMode = Item.StudyMode;
    this.request_OffShoreCenterDetails.TotalEnrolledGirlsStudents = Item.TotalEnrolledGirlsStudents;
    this.request_OffShoreCenterDetails.TotalEnrolledStudents = Item.TotalEnrolledStudents;
    const btnAdd = document.getElementById('btnAdd')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }
  async btnDelete_Click(i: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.OffShoreCenterDetails.splice(i, 1);
        this.request.NumberOfOffShoreCenter = this.request.OffShoreCenterDetails.length;
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //validattions
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async btnAdd_Click() {
    try {
      if (this.request_OffShoreCenterDetails.NameOffShoreCenter == '') {
        this.toastr.error("Name field is required .!");
        return;
      }
      if (this.request_OffShoreCenterDetails.Country == '') {
        this.toastr.error("Country field is required .!");
        return;
      }
      if (this.request_OffShoreCenterDetails.StudyMode == '') {
        this.toastr.error("Study Mode field is required .!");
        return;
      }
      if (this.request_OffShoreCenterDetails.TotalEnrolledStudents == null) {
        this.toastr.error("Total Enrolled Students field is required .!");
        return;
      }
      if (this.request_OffShoreCenterDetails.TotalEnrolledGirlsStudents == null) {
        this.toastr.error("Total Enrolled Girls Students field is required .!");
        return;
      }

      this.loaderService.requestStarted();

      if (this.CurrentIndex != -1) {
        this.request.OffShoreCenterDetails.splice(this.CurrentIndex, 1);;
      }

      this.request.OffShoreCenterDetails.push({
        NameOffShoreCenter: this.request_OffShoreCenterDetails.NameOffShoreCenter,
        Country: this.request_OffShoreCenterDetails.Country,
        StudyMode: this.request_OffShoreCenterDetails.StudyMode,
        TotalEnrolledStudents: this.request_OffShoreCenterDetails.TotalEnrolledStudents,
        TotalEnrolledGirlsStudents: this.request_OffShoreCenterDetails.TotalEnrolledGirlsStudents,
      });
      NameOffShoreCenter: this.request_OffShoreCenterDetails.NameOffShoreCenter = '';
      this.request_OffShoreCenterDetails.Country = '';
      this.request_OffShoreCenterDetails.StudyMode = '';
      this.request_OffShoreCenterDetails.TotalEnrolledStudents = 0;
      this.request_OffShoreCenterDetails.TotalEnrolledGirlsStudents = 0;

      this.request.NumberOfOffShoreCenter = this.request.OffShoreCenterDetails.length;
      this.CurrentIndex = -1;

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

  async ddlOffShoreCenter_OnChange() {
    this.request_OffShoreCenterDetails.Country = '';
    this.request_OffShoreCenterDetails.StudyMode = '';
    this.request_OffShoreCenterDetails.TotalEnrolledStudents = 0;
    this.request_OffShoreCenterDetails.TotalEnrolledGirlsStudents = 0;
    this.request.OffShoreCenterDetails = [];
  }

}

