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
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';

@Component({
  selector: 'app-document-scrutiny-college-detail',
  templateUrl: './document-scrutiny-college-detail.component.html',
  styleUrls: ['./document-scrutiny-college-detail.component.css']
})
export class DocumentScrutinyCollegeDetailComponent implements OnInit {
  constructor(private applyNOCApplicationService: ApplyNOCApplicationService,private draftApplicationListService: DraftApplicationListService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private collegeService: CollegeService, private sSOLoginService: SSOLoginService) {

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
  public SelectedApplyNOCID: number = 0;
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString())
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()))
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()))
    //
    this.ModifyBy = 1;
    // get college list
    await this.ViewTotalCollegeDataByID(this.SelectedCollageID);
  }
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
  async selectAll(ActionType: string) {
    await this.collegeNearestGovernmentHospitalsList.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    })
  }


  ClickOnAction(idx: number) {
    for (var i = 0; i < this.collegeNearestGovernmentHospitalsList.length; i++) {
      if (i == idx) {
        this.collegeNearestGovernmentHospitalsList[i].Remark = '';
      }
    }
  }

  async SubmitCollegeDetail_Onclick() {
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = 0;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'College Detail';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    for (var i = 0; i < this.collegeNearestGovernmentHospitalsList.length; i++) {
      if (this.collegeNearestGovernmentHospitalsList[i].Action == '' || this.collegeNearestGovernmentHospitalsList[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.collegeNearestGovernmentHospitalsList[i].Action == 'No') {
        if (this.collegeNearestGovernmentHospitalsList[i].Remark == '' || this.collegeNearestGovernmentHospitalsList[i].Remark == undefined) {
          this.toastr.warning('Please enter remark');
          return;
        }
      }
    }

    if (this.dsrequest.FinalRemark == '') {
      this.isRemarkValid = true;
      this.isFormvalid = false;
    }
    if (!this.isFormvalid) {
      return;
    }
    if (this.collegeNearestGovernmentHospitalsList.length > 0) {
      for (var i = 0; i < this.collegeNearestGovernmentHospitalsList.length; i++) {
        console.log(this.collegeNearestGovernmentHospitalsList[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: 0,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.collegeNearestGovernmentHospitalsList[i].Action,
          Remark: this.collegeNearestGovernmentHospitalsList[i].Remark,
          TabRowID: this.collegeNearestGovernmentHospitalsList[i].NearestGovernmentHospitalsID,
          SubTabName: ''
        });
      }
    }
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.SaveDocumentScrutiny(this.dsrequest)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.isRemarkValid = false;
            this.isFormvalid = true;
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
