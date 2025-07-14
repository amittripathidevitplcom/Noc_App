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
import { InfrastructureMedicalCollegeFacilitiesDataModel, LectureTheatreDetailsDataModel, MuseumDetailsDataModel, DissectionHallDetailsDataModel, SkillLaboratoryDetailsDataModel } from '../../../Models/InfrastructureMedicalCollegeFacilitiesDataModel';
@Component({
  selector: 'app-preview-infrastructure-medical-college-facilitiesmgone',
  templateUrl: './preview-infrastructure-medical-college-facilitiesmgone.component.html',
  styleUrls: ['./preview-infrastructure-medical-college-facilitiesmgone.component.css']
})
export class PreviewInfrastructureMedicalCollegeFacilitiesmgoneComponent implements OnInit {
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
  //25-06-25
  request = new InfrastructureMedicalCollegeFacilitiesDataModel();
  LectureTheatreDetails = new LectureTheatreDetailsDataModel();
  MuseumDetails = new MuseumDetailsDataModel();
  DissectionHallDetails = new DissectionHallDetailsDataModel();
  SkillLaboratoryDetails = new SkillLaboratoryDetailsDataModel();

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    //
    this.ModifyBy = 1;
    // get college list
    await this.ViewTotalCollegeDataByID(this.SelectedCollageID);
    await this.GetInfrastructuremedicalgrouponecollege();
  }
  public DTECollegeLevel: any = [];
  async ViewTotalCollegeDataByID(CollegeID: any) {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.ViewTotalCollegeDataByID(CollegeID, this.UserID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.collegeListData = data['Data'][0]['data']['Table'][0];
          this.collegeContactDetailsList = data['Data'][0]['data']['Table1'];
          this.collegeNearestGovernmentHospitalsList = data['Data'][0]['data']['Table2'];
          this.CollegeGeoTaggingList = data['Data'][0]['data']['Table3'];
          this.DTECollegeLevel = data['Data'][0]['data']['Table4'];
          if (this.CollegeGeoTaggingList.Image1 == '') {

          }
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
  async GetInfrastructuremedicalgrouponecollege() {
    debugger;
    //Show Loading
    this.loaderService.requestStarted();
    // this.isLoading = true;
    //this.IsEdit = true;

    try {
      await this.commonMasterService.GetInfrastructuremedicalgrouponecollege(this.SelectedCollageID)
        .then(async (data: any) => {
          //this.SelectedCollegeLevel = [];
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          debugger;
          this.request = JSON.parse(JSON.stringify(data['Data']));

        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        //this.isLoading = false;

      }, 200);
    }
  }
}
