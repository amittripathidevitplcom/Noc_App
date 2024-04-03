import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialDetailsDataModel, FinancialDetailsDataModel_FinancialDetails } from '../../../Models/DTEStatistics/FinancialDetailsDataModel';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { FinancialDetailsService } from '../../../Services/DTEStatistics/FinancialDetails/financial-details.service';
import { async } from '@angular/core/testing';
import { PreviewDTEStatisticsComponent } from '../preview-dtestatistics/preview-dtestatistics.component';

@Component({
  selector: 'app-financial-details',
  templateUrl: './financial-details.component.html',
  styleUrls: ['./financial-details.component.css']
})
export class FinancialDetailsComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new FinancialDetailsDataModel();
  request_FinancialDetailsDetails = new FinancialDetailsDataModel_FinancialDetails();
  public isSubmitted: boolean = false;
  public CurrentIndex: number = -1;
  public levelDataList: any = [];
  public programmeDataList: any = [];
  public TotalIncome: number = 0;
  public TotalExpenses: number = 0;
  public disabled: boolean = false;
  public PreviewStatus: string = 'N';

  constructor(private FinancialDetailsService: FinancialDetailsService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent, private previewDTEStatisticsComponent: PreviewDTEStatisticsComponent) {
  }
  async ngOnInit() {

    this.request.FinancialDetails_Income = [];
    this.request.FinancialDetails_Expenses = [];

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
    this.request.EntryType = "Distance Mode";

    await this.CourseLevel();
    await this.GetProgramme();
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
      await this.FinancialDetailsService.GetByID(this.request.CollegeID, this.request.ModifyBy, this.request.EntryType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;

          if (data['Data'].FinancialDetails_Income.length > 0) {
            this.request.FinancialDetails_Income = data['Data'].FinancialDetails_Income;
          }
          if (data['Data'].FinancialDetails_Expenses.length > 0) {
            this.request.FinancialDetails_Expenses = data['Data'].FinancialDetails_Expenses;
          }


        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(async () => {
        await this.Income_Change();
        await this.Expense_Change();
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async SaveData() {
    this.isSubmitted = true;

    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.FinancialDetailsService.SaveData(this.request)
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

  async Income_Change() {
    this.TotalIncome = 0;
    for (var i = 0; i < this.request.FinancialDetails_Income.length; i++) {
      this.TotalIncome += Number(this.request.FinancialDetails_Income[i].Amount)
    }
  }
  async Expense_Change() {
    this.TotalExpenses = 0;
    for (var i = 0; i < this.request.FinancialDetails_Expenses.length; i++) {
      this.TotalExpenses += Number(this.request.FinancialDetails_Expenses[i].Amount)
    }
  }
}

