import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { NOCIssuedDataModel } from '../../../../Models/ApplyNOCApplicationDataModel';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { ApplyNOCApplicationService } from '../../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';

@Component({
  selector: 'app-nocissued-report',
  templateUrl: './nocissued-report.component.html',
  styleUrls: ['./nocissued-report.component.css']
})
export class NOCIssuedReportComponent implements OnInit {
  NOCIssuedReport!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public IssuedNOCReportList: any = [];
  public collegeDataList: any = [];
  public DepartmentList: any = [];
  request = new NOCIssuedDataModel();
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  isEdit: boolean = false;
  public UserID: number = 0;
  public SelectedDepartmentID: number = 0;
 
  public MaxDate: Date = new Date();


  constructor(private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetIssuedNOCReportAdmin(this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID);
  }
  get form() { return this.NOCIssuedReport.controls; }

  async GetCollageMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(this.SelectedDepartmentID, this.sSOLoginDataModel.SSOID, "ApplyNOC")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.collegeDataList = data['Data'];
          console.log(this.collegeDataList);
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
  async GetIssuedNOCReportAdmin(UserID: number, RoleID: number) {
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GetNOCIssuedReportListForAdmin(UserID, 'Release NOC', RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'][0]['data'].length > 0) {
            this.IssuedNOCReportList = data['Data'][0]['data'];
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
  public isFormValid: boolean = true;
  async SearchData() {
    this.isSubmitted = true;
    this.isFormValid = true;
    if (this.NOCIssuedReport.invalid) {
      this.isFormValid = false;
      return;
    }
    this.loaderService.requestStarted();
    try {
      this.applyNOCApplicationService.GetNOCIssuedReportListForAdmin(this.request.DepartmentID, this.request.FromDate, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'][0]['data'].length > 0) {
            this.IssuedNOCReportList = data['Data'][0]['data'];
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
  async ResetControl() {
    const ddlCollegeID = document.getElementById('ddlCollegeID')
    if (ddlCollegeID) ddlCollegeID.focus();
    this.isSubmitted = false;
    this.request.DepartmentID = 0;
    this.request.CollegeID = 0;
    this.request.FromDate = '';
    this.request.ToDate = '';
  }

  async ClearNOCIssuedReport() {
    this.IssuedNOCReportList = [];
  }

}



