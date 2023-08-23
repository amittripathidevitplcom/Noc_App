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
import { AbstractControl, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { TrusteeGeneralInfoDataModel, LegalEntityDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';

@Component({
  selector: 'app-preview-legal-entity',
  templateUrl: './preview-legal-entity.component.html',
  styleUrls: ['./preview-legal-entity.component.css']
})
export class PreviewLegalEntityComponent implements OnInit {

  LegalEntityDataModel = new LegalEntityDataModel();
  TrusteeGeneralInfoList: TrusteeGeneralInfoDataModel[] = [];
  legalEntityForm!: FormGroup;
  constructor(private legalEntityListService: LegalEntityService, private TrusteeGeneralInfoService: TrusteeGeneralInfoService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private collegeService: CollegeService, private sSOLoginService: SSOLoginService) {

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
  public TrustLogoDocPathfileExt: any = [];
  public TrusteeMemberProofDocPathfileExt: any = [];
  public PresidentAadhaarProofDocPathfileExt: any = [];
  public SocietyPanProofDocPathfileExt: any = [];

  // sso ligin
  sSOLoginDataModel = new SSOLoginDataModel();
  public CollegeID: number = 0;
  public ModifyBy: number = 0;

  //
  public SSOID: string = '';
  public SelectedLegalEntityID: number = 0;

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //
    this.ModifyBy = 1;
    // get college list
    await this.ViewlegalEntityDataByID(this.sSOLoginDataModel.SSOID);
    await this.GetDataOfLegalEntity();
    await this.GetDataList();
  }
  async GetDataOfLegalEntity() {
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.TrusteeGeneralInfoService.GetDataOfLegalEntity(this.sSOLoginDataModel.SSOID)
        .then(async (data: any) => {
          debugger;
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (!this.State) {
            //this.toastr.success(this.SuccessMessage)
            // data
            this.LegalEntityDataModel = JSON.parse(JSON.stringify(data['Data']));
            // load trustee list
            //await this.GetDataList();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }

          //console.log(this.request.RuralUrban);
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetDataList() {
    
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.TrusteeGeneralInfoService.GetDataList(this.LegalEntityDataModel.LegalEntityID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (!this.State) {
            this.TrusteeGeneralInfoList = JSON.parse(JSON.stringify(data['Data']));
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
      }, 200);
    }
  }

  async ViewlegalEntityDataByID(SSOID: any) {
    try {
      this.loaderService.requestStarted();
      await this.legalEntityListService.GetLegalEntityBySSOID(SSOID, this.UserID)
        .then((data: any) => {
          debugger;
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
}
