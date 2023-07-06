import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TrusteeGeneralInfoDataModel, LegalEntityDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';


@Component({
  selector: 'app-preview-trustee-general-info',
  templateUrl: './preview-trustee-general-info.component.html',
  styleUrls: ['./preview-trustee-general-info.component.css']
})
export class PreviewTrusteeGeneralInfoComponent implements OnInit {
  LegalEntityDataModel = new LegalEntityDataModel();
  // list model
  TrusteeGeneralInfoList: TrusteeGeneralInfoDataModel[] = [];
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public State: number = -1;
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  // login model
  sSOLoginDataModel = new SSOLoginDataModel();
  constructor(private formBuilder: FormBuilder, private TrusteeGeneralInfoService: TrusteeGeneralInfoService, private commonMasterService: CommonMasterService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute, private routers: Router, private cdRef: ChangeDetectorRef, private fileUploadService: FileUploadService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    // load legal entity
    await this.GetDataOfLegalEntity();
    await this.GetDataList();

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
            //this.toastr.success(this.SuccessMessage)
            // data
            this.TrusteeGeneralInfoList = JSON.parse(JSON.stringify(data['Data']));
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

  async GetDataOfLegalEntity() {
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.TrusteeGeneralInfoService.GetDataOfLegalEntity(this.sSOLoginDataModel.SSOID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (!this.State) {
            //this.toastr.success(this.SuccessMessage)
            // data
            this.LegalEntityDataModel = JSON.parse(JSON.stringify(data['Data']));
            // load trustee list
            await this.GetDataList();
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
}
