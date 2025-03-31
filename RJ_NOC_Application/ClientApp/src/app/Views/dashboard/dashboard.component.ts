import { Component, OnInit, Input, Injectable, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardDataModel } from '../../Models/DashboardDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  closeResult: string | undefined;
  public SessionID: number = 0;
  public DepartmentID: number = 0;
  public Departmentlist: any = [];

  @ViewChild('ApplicationSessionmodal') templateRef: TemplateRef<any> | undefined;
  constructor(private modalService: NgbModal,public cookie: CookieService, public sanitizer: DomSanitizer,private loaderService: LoaderService, private toastr: ToastrService, private commonMasterService: CommonMasterService) { }

  async ngOnInit() {
    this.loaderService.requestStarted();
    this.ssotoken = this.cookie.get('RAJSSO');
    this.url = this.url + this.ssotoken;
    this.AnalyticsDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDashboardDataSSOWise(this.sSOLoginDataModel.SSOID);    
    this.loaderService.requestEnded();
  }
  async ngAfterViewInit() {
    if (this.sSOLoginDataModel.SessionID == 0) {
      await this.GetAllFinancialYear();
      await this.OpenModel(this.templateRef);
    }
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


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async OpenModel(content: any) {
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public lstDFinancialYear: any = [];
  async GetAllFinancialYear() {
    this.lstDFinancialYear = [];
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDashBoardFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.lstDFinancialYear = data['Data'];
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

  public IsSubmitted: boolean= false;
  async loadDataSessionWise() {
    this.IsSubmitted = true;
    if (this.SessionID == 0) {
      return;
    }
    this.loaderService.requestStarted();
    if (this.SessionID > 0) {
      this.sSOLoginDataModel.SessionID = this.SessionID;
      this.sSOLoginDataModel.SessionName = this.lstDFinancialYear.find((x: { FinancialYearID: number; }) => x.FinancialYearID == this.SessionID)?.FinancialYearName;
      localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
      window.open('/dashboard', "_self");
    }
    //this.router.navigate(['/dashboard']);
    setTimeout(() => {
      this.loaderService.requestEnded();
    }, 100);
  }
}
