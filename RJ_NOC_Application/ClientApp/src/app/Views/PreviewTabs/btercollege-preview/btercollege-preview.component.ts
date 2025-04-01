


import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';

@Component({
  selector: 'app-btercollege-preview',
  templateUrl: './btercollege-preview.component.html',
  styleUrls: ['./btercollege-preview.component.css']
})
export class BTERCollegePreviewComponent implements OnInit {
  constructor(private draftApplicationListService: DraftApplicationListService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private collegeService: CollegeService, private sSOLoginService: SSOLoginService) {

  }

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;

  public UserID: number = 0;
  public draftApplicatoinListData: any = [];
  public collegeListData: any = [];
  public collegeContactDetailsList: any = [];
  public collegeNearestGovernmentHospitalsList: any = [];
  public CollegeGeoTaggingList: any = [];
  public searchText: string = '';
  public SsoValidationMessage: string = '';
  public SsoSuccessMessage: string = '';

  // sso ligin
  sSOLoginDataModel = new SSOLoginDataModel();
  sSOVerifyDataModel = new SSOLoginDataModel();
  public CollegeID: number = 0;
  public ModifyBy: number = 0;

  //
  public SSOID: string = '';
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SearchRecordID: string = '';
  public SelectedDteAffiliationRegId: number = 0;
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString());
    
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
    // get college list
    await this.ViewTotalCollegeDataByID(this.SelectedDteAffiliationRegId);
  }
  public DTECollegeLevel: any = [];
  async ViewTotalCollegeDataByID(SelectedDteAffiliationRegId: any) {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.ViewBTERTotalCollegeDataByID(SelectedDteAffiliationRegId, this.UserID)
        .then((data: any) => {         
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.collegeListData = data['Data'][0]['data']['Table'][0];
          this.collegeContactDetailsList = data['Data'][0]['data']['Table1'];          
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
