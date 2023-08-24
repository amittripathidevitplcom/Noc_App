import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { ApplyNOCApplicationService } from '../../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';

@Component({
  selector: 'app-issued-noc-report',
  templateUrl: './issued-noc-report.component.html',
  styleUrls: ['./issued-noc-report.component.css']
})
export class IssuedNOCReportComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public IssuedNOCReportList: any = [];

  constructor(private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetIssuedNOCReportListUserWise(this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID);
  }
  async GetIssuedNOCReportListUserWise(UserID: number, RoleID: number, DepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GetIssuedNOCReportList(UserID, 'Release NOC', RoleID, DepartmentID)
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

}



