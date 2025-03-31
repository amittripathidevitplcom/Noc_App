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
  public SelectedDepartmentID: number = 0;
  public SearchRecordID: string = '';
  public SelectedDteAffiliationRegId: number = 0;
  public AffiliationRegStatus: any = '';
  public AffiliationRegID: number = 0;
  public AffiliationCollegeStatusId: number = 0;
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString());
    this.AffiliationRegStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());
    this.AffiliationCollegeStatusId = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeStatusId')?.toString());

    if (this.SearchRecordID.length > 20 && this.SelectedDepartmentID == 12) {
      await this.commonMasterService.GetDteAffiliation_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SelectedDteAffiliationRegId = data['Data']['DTE_ARId'];

          if (this.SelectedDteAffiliationRegId == null || this.SelectedDteAffiliationRegId == 0 || this.SelectedDteAffiliationRegId == undefined) {
            this.routers.navigate(['/affiliationregistration']);
          }
        }, error => console.error(error));
    }
    else {
      this.SelectedDteAffiliationRegId = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString()));
    }
    this.ModifyBy = 1;
    await this.GetDTEAffiliationOtherDetailsPreviewData();
    await this.GetDepartmentList();
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
  async GetDTEAffiliationOtherDetailsPreviewData() {   
    try {
      this.loaderService.requestStarted();
      await this.dteaffiliationOtherDetailsService.GetDTEAffiliationOtherDetailsPreviewData(this.SelectedDteAffiliationRegId)
        .then((data: any) => {         
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

