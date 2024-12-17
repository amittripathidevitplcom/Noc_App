import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AbstractControl, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { DTEAffiliationOtherDetailsService } from '../../../Services/DTEAffiliation/DTEAffiliationOtherDetails/dte-affiliation-other-details.service';
import { DTEAffiliationOtherDetailsPreviewDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationOtherDetails/DTEAffiliationOtherDetailsDataModel';
@Component({
  selector: 'app-preview-dteaffiliation-other-details',
  templateUrl: './preview-dteaffiliation-other-details.component.html',
  styleUrls: ['./preview-dteaffiliation-other-details.component.css']
})
export class PreviewDTEAffiliationOtherDetailsComponent implements OnInit {
  DTEAffiliationOtherDetails!: FormGroup;
  constructor(private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private sSOLoginService: SSOLoginService, private dteaffiliationOtherDetailsService: DTEAffiliationOtherDetailsService) {

  }
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public UserID: number = 0;
  public searchText: string = '';
  public SsoValidationMessage: string = '';
  public SsoSuccessMessage: string = '';
  public DepartmentList: any = [];
  public DTEAffiliationOtherDetailsPreviewData: any = [];
  // sso ligin
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new DTEAffiliationOtherDetailsPreviewDataModel();
  public ModifyBy: number = 0;
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ModifyBy = 1;
    this.GetDepartmentList();
  }
  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentList = data['Data'];
          for (let i = 0; i < data['Data'].length; i++) {
            if (data['Data'][i]['DepartmentID'] == 4) {
              this.request.DepartmentID = data['Data'][i]['DepartmentID'];

              this.GetDTEAffiliationOtherDetailsPreviewData(this.request.DepartmentID);
              //this.GetAffiliationBranchList(this.request.DepartmentID);
              //this.GetStartDateEndDateDepartmentwise(this.request.DepartmentID)
              // console.log(this.request.DepartmentID);
            }
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
  async GetDTEAffiliationOtherDetailsPreviewData(DepartmentID: number) {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.dteaffiliationOtherDetailsService.GetDTEAffiliationOtherDetailsPreviewData(DepartmentID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.DTEAffiliationOtherDetailsPreviewData = data['Data'][0];
        }, (error: any) => console.error(error));
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

