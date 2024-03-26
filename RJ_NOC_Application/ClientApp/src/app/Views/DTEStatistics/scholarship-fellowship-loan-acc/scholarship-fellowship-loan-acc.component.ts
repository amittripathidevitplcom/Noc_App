import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ScholarshipFellowshipLoanAccDataModel, ScholarshipFellowshipLoanAccDataModel_ACC, ScholarshipFellowshipLoanAccDataModel_Scholarship } from '../../../Models/DTEStatistics/ScholarshipFellowshipLoanAccDataModel';
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
    this.request.ACC = [];

    this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
    this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.EntryType = "Regular Mode";
    await this.btnAdd_Click(this.request.ACC[0], 0);
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
          
          if (data['Data'].ACC.length > 0) {
            this.request.ACC = data['Data'].ACC;
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


    this.loaderService.requestStarted();
    await this.Modify_SaveJsonData();
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


  async btnAdd_Click(row: ScholarshipFellowshipLoanAccDataModel_ACC, idx: number) {
    if (row != undefined) {
      if (row.Name == '') {
        this.toastr.error('Name field is required.!');
        const txt_ACC_Name = document.getElementById('txt_ACC_Name' + idx.toString());
        if (txt_ACC_Name) txt_ACC_Name.focus();
        return;
      }
    }

    try {
      this.request.ACC.push({
        SNo: this.request.ACC.length + 1,
        Name: "",
        AccreditationBody: "",
        IsScoreProvided: "",
        MaximumScore: "",
        Score: "",
        CycleofAccreditatio: "",
        StatusofAccreditation: "",
        DateifAccreditationValidity: "",
        Grade: "",
      });

    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        console.log("ACC...");
        console.log(this.request.ACC);
        this.loaderService.requestEnded();
        const btnAdd = document.getElementById('btnAdd')
        if (btnAdd) { btnAdd.innerText = "Add"; }
      }, 200);
    }
  }
  async btnDelete_Click(i: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.ACC.splice(i, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  Modify_SaveJsonData() {

    for (var j = 0; j < this.request.Scholarship.length; j++) {
      this.request.Scholarship[j].General_Total =
      this.request.Scholarship[j].General_Total = this.request.Scholarship[j].General_Total.toString().length == 0 ? 0 : this.request.Scholarship[j].General_Total;
      this.request.Scholarship[j].General_Female = this.request.Scholarship[j].General_Female.toString().length == 0 ? 0 : this.request.Scholarship[j].General_Female;
      this.request.Scholarship[j].General_TransGender = this.request.Scholarship[j].General_TransGender.toString().length == 0 ? 0 : this.request.Scholarship[j].General_TransGender;
      this.request.Scholarship[j].EWS_Total = this.request.Scholarship[j].EWS_Total.toString().length == 0 ? 0 : this.request.Scholarship[j].EWS_Total;
      this.request.Scholarship[j].EWS_Female = this.request.Scholarship[j].EWS_Female.toString().length == 0 ? 0 : this.request.Scholarship[j].EWS_Female;
      this.request.Scholarship[j].EWS_TransGender = this.request.Scholarship[j].EWS_TransGender.toString().length == 0 ? 0 : this.request.Scholarship[j].EWS_TransGender;
      this.request.Scholarship[j].SC_Total = this.request.Scholarship[j].SC_Total.toString().length == 0 ? 0 : this.request.Scholarship[j].SC_Total;
      this.request.Scholarship[j].SC_Female = this.request.Scholarship[j].SC_Female.toString().length == 0 ? 0 : this.request.Scholarship[j].SC_Female;
      this.request.Scholarship[j].SC_TransGender = this.request.Scholarship[j].SC_TransGender.toString().length == 0 ? 0 : this.request.Scholarship[j].SC_TransGender;
      this.request.Scholarship[j].ST_Total = this.request.Scholarship[j].ST_Total.toString().length == 0 ? 0 : this.request.Scholarship[j].ST_Total;
      this.request.Scholarship[j].ST_Female = this.request.Scholarship[j].ST_Female.toString().length == 0 ? 0 : this.request.Scholarship[j].ST_Female;
      this.request.Scholarship[j].ST_TransGender = this.request.Scholarship[j].ST_TransGender.toString().length == 0 ? 0 : this.request.Scholarship[j].ST_TransGender;
      this.request.Scholarship[j].OBC_Total = this.request.Scholarship[j].OBC_Total.toString().length == 0 ? 0 : this.request.Scholarship[j].OBC_Total;
      this.request.Scholarship[j].OBC_Female = this.request.Scholarship[j].OBC_Female.toString().length == 0 ? 0 : this.request.Scholarship[j].OBC_Female;
      this.request.Scholarship[j].OBC_TransGender = this.request.Scholarship[j].OBC_TransGender.toString().length == 0 ? 0 : this.request.Scholarship[j].OBC_TransGender;
      this.request.Scholarship[j].TOTAL_Total = this.request.Scholarship[j].TOTAL_Total.toString().length == 0 ? 0 : this.request.Scholarship[j].TOTAL_Total;
      this.request.Scholarship[j].TOTAL_Female = this.request.Scholarship[j].TOTAL_Female.toString().length == 0 ? 0 : this.request.Scholarship[j].TOTAL_Female;
      this.request.Scholarship[j].TOTAL_TransGender = this.request.Scholarship[j].General_Total.toString().length == 0 ? 0 : this.request.Scholarship[j].TOTAL_TransGender;
      }
    for (var j = 0; j < this.request.Fellowship.length; j++) {
      this.request.Fellowship[j].General_Total =
        this.request.Fellowship[j].General_Total = this.request.Fellowship[j].General_Total.toString().length == 0 ? 0 : this.request.Fellowship[j].General_Total;
      this.request.Fellowship[j].General_Female = this.request.Fellowship[j].General_Female.toString().length == 0 ? 0 : this.request.Fellowship[j].General_Female;
      this.request.Fellowship[j].General_TransGender = this.request.Fellowship[j].General_TransGender.toString().length == 0 ? 0 : this.request.Fellowship[j].General_TransGender;
      this.request.Fellowship[j].EWS_Total = this.request.Fellowship[j].EWS_Total.toString().length == 0 ? 0 : this.request.Fellowship[j].EWS_Total;
      this.request.Fellowship[j].EWS_Female = this.request.Fellowship[j].EWS_Female.toString().length == 0 ? 0 : this.request.Fellowship[j].EWS_Female;
      this.request.Fellowship[j].EWS_TransGender = this.request.Fellowship[j].EWS_TransGender.toString().length == 0 ? 0 : this.request.Fellowship[j].EWS_TransGender;
      this.request.Fellowship[j].SC_Total = this.request.Fellowship[j].SC_Total.toString().length == 0 ? 0 : this.request.Fellowship[j].SC_Total;
      this.request.Fellowship[j].SC_Female = this.request.Fellowship[j].SC_Female.toString().length == 0 ? 0 : this.request.Fellowship[j].SC_Female;
      this.request.Fellowship[j].SC_TransGender = this.request.Fellowship[j].SC_TransGender.toString().length == 0 ? 0 : this.request.Fellowship[j].SC_TransGender;
      this.request.Fellowship[j].ST_Total = this.request.Fellowship[j].ST_Total.toString().length == 0 ? 0 : this.request.Fellowship[j].ST_Total;
      this.request.Fellowship[j].ST_Female = this.request.Fellowship[j].ST_Female.toString().length == 0 ? 0 : this.request.Fellowship[j].ST_Female;
      this.request.Fellowship[j].ST_TransGender = this.request.Fellowship[j].ST_TransGender.toString().length == 0 ? 0 : this.request.Fellowship[j].ST_TransGender;
      this.request.Fellowship[j].OBC_Total = this.request.Fellowship[j].OBC_Total.toString().length == 0 ? 0 : this.request.Fellowship[j].OBC_Total;
      this.request.Fellowship[j].OBC_Female = this.request.Fellowship[j].OBC_Female.toString().length == 0 ? 0 : this.request.Fellowship[j].OBC_Female;
      this.request.Fellowship[j].OBC_TransGender = this.request.Fellowship[j].OBC_TransGender.toString().length == 0 ? 0 : this.request.Fellowship[j].OBC_TransGender;
      this.request.Fellowship[j].TOTAL_Total = this.request.Fellowship[j].TOTAL_Total.toString().length == 0 ? 0 : this.request.Fellowship[j].TOTAL_Total;
      this.request.Fellowship[j].TOTAL_Female = this.request.Fellowship[j].TOTAL_Female.toString().length == 0 ? 0 : this.request.Fellowship[j].TOTAL_Female;
      this.request.Fellowship[j].TOTAL_TransGender = this.request.Fellowship[j].General_Total.toString().length == 0 ? 0 : this.request.Fellowship[j].TOTAL_TransGender;
    }
    for (var j = 0; j < this.request.Loan.length; j++) {
      this.request.Loan[j].General_Total =
        this.request.Loan[j].General_Total = this.request.Loan[j].General_Total.toString().length == 0 ? 0 : this.request.Loan[j].General_Total;
      this.request.Loan[j].General_Female = this.request.Loan[j].General_Female.toString().length == 0 ? 0 : this.request.Loan[j].General_Female;
      this.request.Loan[j].General_TransGender = this.request.Loan[j].General_TransGender.toString().length == 0 ? 0 : this.request.Loan[j].General_TransGender;
      this.request.Loan[j].EWS_Total = this.request.Loan[j].EWS_Total.toString().length == 0 ? 0 : this.request.Loan[j].EWS_Total;
      this.request.Loan[j].EWS_Female = this.request.Loan[j].EWS_Female.toString().length == 0 ? 0 : this.request.Loan[j].EWS_Female;
      this.request.Loan[j].EWS_TransGender = this.request.Loan[j].EWS_TransGender.toString().length == 0 ? 0 : this.request.Loan[j].EWS_TransGender;
      this.request.Loan[j].SC_Total = this.request.Loan[j].SC_Total.toString().length == 0 ? 0 : this.request.Loan[j].SC_Total;
      this.request.Loan[j].SC_Female = this.request.Loan[j].SC_Female.toString().length == 0 ? 0 : this.request.Loan[j].SC_Female;
      this.request.Loan[j].SC_TransGender = this.request.Loan[j].SC_TransGender.toString().length == 0 ? 0 : this.request.Loan[j].SC_TransGender;
      this.request.Loan[j].ST_Total = this.request.Loan[j].ST_Total.toString().length == 0 ? 0 : this.request.Loan[j].ST_Total;
      this.request.Loan[j].ST_Female = this.request.Loan[j].ST_Female.toString().length == 0 ? 0 : this.request.Loan[j].ST_Female;
      this.request.Loan[j].ST_TransGender = this.request.Loan[j].ST_TransGender.toString().length == 0 ? 0 : this.request.Loan[j].ST_TransGender;
      this.request.Loan[j].OBC_Total = this.request.Loan[j].OBC_Total.toString().length == 0 ? 0 : this.request.Loan[j].OBC_Total;
      this.request.Loan[j].OBC_Female = this.request.Loan[j].OBC_Female.toString().length == 0 ? 0 : this.request.Loan[j].OBC_Female;
      this.request.Loan[j].OBC_TransGender = this.request.Loan[j].OBC_TransGender.toString().length == 0 ? 0 : this.request.Loan[j].OBC_TransGender;
      this.request.Loan[j].TOTAL_Total = this.request.Loan[j].TOTAL_Total.toString().length == 0 ? 0 : this.request.Loan[j].TOTAL_Total;
      this.request.Loan[j].TOTAL_Female = this.request.Loan[j].TOTAL_Female.toString().length == 0 ? 0 : this.request.Loan[j].TOTAL_Female;
      this.request.Loan[j].TOTAL_TransGender = this.request.Loan[j].General_Total.toString().length == 0 ? 0 : this.request.Loan[j].TOTAL_TransGender;
    }
  }


}

