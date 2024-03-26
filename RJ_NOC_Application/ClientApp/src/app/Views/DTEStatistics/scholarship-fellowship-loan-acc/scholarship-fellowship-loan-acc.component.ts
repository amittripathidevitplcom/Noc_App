import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ScholarshipFellowshipLoanAccDataModel, ScholarshipFellowshipLoanAccDataModel_Scholarship } from '../../../Models/DTEStatistics/ScholarshipFellowshipLoanAccDataModel';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { ScholarshipFellowshipLoanAccService } from '../../../Services/DTEStatistics/ScholarshipFellowshipLoanAcc/scholarship-fellowship-loan-acc.service';

@Component({
  selector: 'app-scholarship-fellowship-loan-acc',
  templateUrl: './scholarship-fellowship-loan-acc.component.html',
  styleUrls: ['./scholarship-fellowship-loan-acc.component.css']
})
export class ScholarshipFellowshipLoanAccComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new ScholarshipFellowshipLoanAccDataModel(); 

  public isSubmitted: boolean = false;
  public CurrentIndex: number = -1;
  public levelDataList: any = [];
  public programmeDataList: any = [];

  constructor(private ScholarshipFellowshipLoanAccService: ScholarshipFellowshipLoanAccService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent) {
  }
  async ngOnInit() {

    this.request.Scholarship = [];
    this.request.Fellowship = [];
    this.request.Loan = [];

    this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
    this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.EntryType = "Regular Mode";

    await this.GetByID();
  }
  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.ScholarshipFellowshipLoanAccService.GetByID(this.request.CollegeID, this.request.ModifyBy, this.request.EntryType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;

          this.request.Scholarship = data['Data'].Scholarship;
          this.request.Fellowship = data['Data'].Fellowship;
          this.request.Loan = data['Data'].Loan;


          //if (data['Data'].ProgrammesDetails.length > 0) {
          //  this.request.ProgrammesDetails = data['Data'].ProgrammesDetails;
          //  for (var i = 0; i < this.request.ProgrammesDetails.length; i++) {
          //    this.request.ProgrammesDetails[i].trCss = (i + 1) % 2 === 0 ? "trAlter" : "";
          //  }
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
    this.isSubmitted = true;

     
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.ScholarshipFellowshipLoanAccService.SaveData(this.request)
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
  
}

