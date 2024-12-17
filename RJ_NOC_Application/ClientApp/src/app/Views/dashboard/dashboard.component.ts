import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardDataModel } from '../../Models/DashboardDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardDataModel: any;
  OtherdashboardDataModel: any;
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public url: string = 'https://analytics.rajasthan.gov.in/RajSso/SASVisualAnalyticsViewer/VisualAnalyticsViewer.jsp?reportName=Rajasthan+NOC+Managment+System&reportPath=/RAJ+NOC/&appSwitcherDisabled=true&redirectUrl=&token=';
  AnalyticsDashboardUrl: SafeResourceUrl | undefined;
  public ssotoken: string = '';
  constructor(public cookie: CookieService, public sanitizer: DomSanitizer,private loaderService: LoaderService, private toastr: ToastrService, private commonMasterService: CommonMasterService) { }

  async ngOnInit() {
    this.loaderService.requestStarted();
    this.ssotoken = this.cookie.get('RAJSSO');
    console.log(this.ssotoken);
    this.url = this.url + this.ssotoken;
    this.AnalyticsDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDashboardDataSSOWise(this.sSOLoginDataModel.SSOID);
    this.loaderService.requestEnded();
  }

  async GetDashboardDataSSOWise(SSOID: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDashboardDataSSOWise(SSOID, this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.SessionID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(data['Data']);
          this.dashboardDataModel = data['Data'][0]['DashBoardCount'][0];
          if (data['Data'][0]['AllDepartmentCommonCount'] != null) {
            this.OtherdashboardDataModel = data['Data'][0]['AllDepartmentCommonCount'][0];
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
}
