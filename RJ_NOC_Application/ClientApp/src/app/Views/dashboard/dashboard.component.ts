import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardDataModel } from '../../Models/DashboardDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardDataModel = new DashboardDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  constructor(private loaderService: LoaderService, private toastr: ToastrService, private commonMasterService: CommonMasterService) { }

  async ngOnInit() {
    this.loaderService.requestStarted();
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDashboardDataSSOWise(this.sSOLoginDataModel.SSOID);
    this.loaderService.requestEnded();
  }

  async GetDashboardDataSSOWise(SSOID: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDashboardDataSSOWise(SSOID, this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.dashboardDataModel = data['Data'][0];


          console.log(this.dashboardDataModel);
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
}
