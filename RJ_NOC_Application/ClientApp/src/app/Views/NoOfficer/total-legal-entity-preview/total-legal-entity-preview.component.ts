import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { AbstractControl,  FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
@Component({
  selector: 'app-total-legal-entity-preview',
  templateUrl: './total-legal-entity-preview.component.html',
  styleUrls: ['./total-legal-entity-preview.component.css']
})
export class TotalLegalEntityPreviewComponent implements OnInit {
  legalEntityForm!: FormGroup;
  constructor(private legalEntityListService: LegalEntityService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private collegeService: CollegeService, private sSOLoginService: SSOLoginService) {

  }
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;

  public UserID: number = 0;
  public legalEntityListData: any = [];
  public legalEntityListData1: any = [];
  public legalEntityInstituteDetailData: any = [];
  public legalEntityMemberDetailData: any = [];
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

  ngOnInit() {
    
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //
    this.ModifyBy = 1;
    // get college list
    this.GetApplicationList();
  }
  async GetApplicationList() {
    try {
      this.loaderService.requestStarted();
      await this.legalEntityListService.GetLegalEntityList(this.UserID, this.sSOLoginDataModel.SSOID)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.legalEntityListData = data['Data'][0]['data']['Table'];

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
  async ViewlegalEntityDataByID(LegalEntityID:any) {
    try {
      this.loaderService.requestStarted();
      await this.legalEntityListService.ViewlegalEntityDataByID(LegalEntityID, this.UserID, this.sSOLoginDataModel.SSOID)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.legalEntityListData1 = data['Data'][0]['data']['Table'][0];
          this.legalEntityInstituteDetailData = data['Data'][0]['data']['Table1'];
          this.legalEntityMemberDetailData = data['Data'][0]['data']['Table2'];

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

  async DeleteData(row: any) {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.collegeService.DeleteData(row.CollegeID, this.ModifyBy)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          //console.log(this.request.RuralUrban);

          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // data
            const index: number = this.legalEntityListData.indexOf(row);
            if (index != -1) {
              this.legalEntityListData.splice(index, 1)
            }
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

  async CheckMappingSSOID() {
    try {
      this.loaderService.requestStarted();
      await this.sSOLoginService.CheckMappingSSOID(this.SSOID)
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
    if (this.sSOVerifyDataModel != null && this.SSOID.toLowerCase() == this.sSOVerifyDataModel.SSOID.toLowerCase()) {
      this.SsoValidationMessage = '';
      this.SsoSuccessMessage = 'SSO Id Verified Successfully';
    }
    else {
      this.SsoValidationMessage = 'SSO Id Invalid !';
    }

  }

  async CustomValidate() {
    let isValid = true;
    if (this.SSOID == null || this.SSOID == undefined || this.SSOID == '') {
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

  async MapSSOIDInCollege() {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.collegeService.MapSSOIDInCollege(this.CollegeID, this.ModifyBy, this.SSOID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          //console.log(this.request.RuralUrban);

          if (!this.State) {
            this.toastr.success(this.SuccessMessage);
            // close model
            document.getElementById("SSOIDMapping_Close")?.click();
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

  async OpenSSOIDMaping(row: any) {
    await this.ResetSSOIDVerify();
    this.CollegeID = row.CollegeID;
  }

  async ResetSSOIDVerify() {
    this.SsoValidationMessage = '';
    this.SsoSuccessMessage = '';
    this.SSOID = '';
    this.sSOVerifyDataModel = new SSOLoginDataModel();
  }

  async LegalEntityEdit_OnClick(LegalEntityID: number) {
    this.routers.navigate(['/legalentity' + "/" + encodeURI(this.commonMasterService.Encrypt(LegalEntityID.toString()))], { skipLocationChange: true });
  }

}
