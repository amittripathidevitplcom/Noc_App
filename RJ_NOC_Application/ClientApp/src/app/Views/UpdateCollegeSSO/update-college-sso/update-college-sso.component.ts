import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { SSOUpdateDataModelSearchFilter, TotalCollegeReportSearchFilter } from '../../../Models/SearchFilterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';

@Component({
  selector: 'app-update-college-sso',
  templateUrl: './update-college-sso.component.html',
  styleUrls: ['./update-college-sso.component.css']
})
export class UpdateCollegeSSOComponent implements OnInit{

  request = new TotalCollegeReportSearchFilter();
  requestlst = new SSOUpdateDataModelSearchFilter();
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchText: string = '';

  TotalCollegeList: any = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public SsoValidationMessage: string = '';
  public isSubmitted: boolean = false;
  public isDisabledGrid: boolean = false;

  public collegeListData: any = [];
  public collegeContactDetailsList: any = [];
  public collegeNearestGovernmentHospitalsList: any = [];
  public DTECollegeLevel: any = [];
  sSOVerifyDataModel = new SSOLoginDataModel();
  public SsoSuccessMessage: string = '';
  public CollegeID: number = 0;

  public CurrentSSOID: string = '';
  public NewSSOID: string = '';

  constructor(private collegeservice: CollegeService, private sSOLoginService: SSOLoginService, private draftApplicationListService: DraftApplicationListService, private routers: Router, private router: ActivatedRoute,  private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService) {
  }


  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetTotalCollegeList();

  }

  
  ResetControl() { }
  btnExportTable_Click() { }


  async GetTotalCollegeList() {
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.collegeservice.TotalCollegeDetailsByDepartment(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TotalCollegeList = data['Data'][0]['data'];
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


  async GetCollegeDetailsByCollege(CollegeID: any) {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.ViewTotalCollegeDataByID(CollegeID, this.sSOLoginDataModel.UserID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.collegeListData = data['Data'][0]['data']['Table'][0];
          this.collegeContactDetailsList = data['Data'][0]['data']['Table1'];
          this.collegeNearestGovernmentHospitalsList = data['Data'][0]['data']['Table2'];
          this.DTECollegeLevel = data['Data'][0]['data']['Table4'];

          //console.log(this.draftApplicatoinListData);
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

  async VerifySSOID() {
    //Show Loading
    this.isLoading = true;

    let isValid = true;
    if (!await this.CustomValidate()) {
      isValid = false;
    }

    // check
    if (!isValid) {
      return;
    }
    // verify ssoid
    await this.CheckMappingSSOID();

    if (this.sSOVerifyDataModel != null && this.CurrentSSOID.toLowerCase() == this.sSOVerifyDataModel.SSOID.toLowerCase()) {
      this.SsoValidationMessage = '';
      this.SsoSuccessMessage = 'SSO Id Verified Successfully';
    }
    else {
      this.SsoValidationMessage = 'SSO Id Invalid !';
    }

  }



  //async CustomValidate() {
  //  let isValid = true;
  //  if (this.SSOID == null || this.SSOID == undefined || this.SSOID == '') {
  //    isValid = false;
  //    this.SsoValidationMessage = 'This field is required .!';
  //  }
  //  else {
  //    this.SsoValidationMessage = '';
  //  }
  //  if (this.SsoValidationMessage != '') {
  //    isValid = false;
  //  }

  //  return isValid;
  //}


  async CustomValidate() {
    let isValid = true;
    if (this.NewSSOID == null || this.NewSSOID == undefined || this.NewSSOID == '') {
      isValid = false;
      this.SsoValidationMessage = 'This field is required .!';
    }
    else {
      this.SsoValidationMessage = '';
    }
    if (this.SsoValidationMessage != '') {
      isValid = false;
    }

    return isValid;
  }



  async CheckMappingSSOID() {
    try {
      this.loaderService.requestStarted();
      await this.sSOLoginService.CheckMappingSSOID(this.CurrentSSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.sSOVerifyDataModel = data['Data'];
          //console.log(this.draftApplicatoinListData);
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

  async ResetSSOIDVerify() {
    this.SsoValidationMessage = '';
    this.SsoSuccessMessage = '';
    this.CurrentSSOID = '';
    this.NewSSOID = '';
    this.sSOVerifyDataModel = new SSOLoginDataModel();
  }

  async OpenSSOIDMaping(row: any) {
    debugger;
    this.CollegeID = row.CollegeID;
    this.CurrentSSOID = row.MappingSSOID;


  }


  async SSOUpdateSubmit(item: any) {
    debugger;
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;


    try {
      await this.commonMasterService.SSOUpdateSubmit(this.CollegeID, this.NewSSOID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          //console.log(this.request.RuralUrban);

          if (!this.State) {
            this.toastr.success(this.SuccessMessage);
            // close model
            document.getElementById("SSOIDMapping_Close")?.click();
            this.GetTotalCollegeList();
            this.ResetSSOIDVerify();
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

  //async GetCollegeDetailsByCollege(CollegeID: any) {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.draftApplicationListService.ViewTotalCollegeDataByID(CollegeID, this.sSOLoginDataModel.UserID)
  //      .then((data: any) => {

  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        // data
  //        this.collegeListData = data['Data'][0]['data']['Table'][0];
  //        this.collegeContactDetailsList = data['Data'][0]['data']['Table1'];
  //        this.collegeNearestGovernmentHospitalsList = data['Data'][0]['data']['Table2'];
  //        this.DTECollegeLevel = data['Data'][0]['data']['Table4'];

  //        //console.log(this.draftApplicatoinListData);
  //      }, (error: any) => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


   



}
