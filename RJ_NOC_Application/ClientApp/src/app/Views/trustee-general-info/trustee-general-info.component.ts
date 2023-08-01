import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TrusteeGeneralInfoDataModel, LegalEntityDataModel } from '../../Models/TrusteeGeneralInfoDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FileUploadService } from '../../Services/FileUpload/file-upload.service';
import { TrusteeGeneralInfoService } from '../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-trustee-general-info',
  templateUrl: './trustee-general-info.component.html',
  styleUrls: ['./trustee-general-info.component.css']
})
export class TrusteeGeneralInfoComponent implements OnInit {
  // form control
  TrusteegeneralinfoForm!: FormGroup;

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public IsTrustee: boolean = true;
  public IsTrusteeReset: boolean = true;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public State: number = -1;

  public file: File = null;
  public showSocietyRegistrationDocument: boolean = false;
  public SocietyRegistrationDocumentValidationMessage: string = '';
  public showSocietyLogoDocument: boolean = false;
  public SocietyLogoValidationMessage: string = '';

  // save model
  request = new TrusteeGeneralInfoDataModel();
  // legal entity
  LegalEntityDataModel = new LegalEntityDataModel();
  // list model
  TrusteeGeneralInfoList: TrusteeGeneralInfoDataModel[] = [];

  // login model
  sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private formBuilder: FormBuilder, private TrusteeGeneralInfoService: TrusteeGeneralInfoService, private commonMasterService: CommonMasterService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute, private routers: Router, private cdRef: ChangeDetectorRef, private fileUploadService: FileUploadService) {

  }

  async ngOnInit() {
    this.TrusteegeneralinfoForm = this.formBuilder.group(
      {
        fSocietyRegistrationDocument: [''],
        fSocietyLogo: [''],
        txtDateOfElectionOfPresentManagementCommittee: ['', Validators.required],
        rbWomenMembersOfManagementCommitteeID: ['', Validators.required],
        rbDateOfElectionOfManagementCommitteeID: ['', Validators.required],
        rbOtherInstitutionRunByTheSocietyID: ['', Validators.required]
      })

    // login info
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // load legal entity
    await this.GetDataOfLegalEntity();
    if (this.TrusteeGeneralInfoList.length == 0) {
      this.IsTrustee = false;
      this.IsTrusteeReset = false;
    }

  }
  get form() { return this.TrusteegeneralinfoForm.controls; }

  async SaveData() {
    this.isSubmitted = true;
    let isValid = true;
    if (this.TrusteegeneralinfoForm.invalid) {
      console.log(this.TrusteegeneralinfoForm);
      isValid = false;
    }
    if (!this.CustomValidate()) {
      isValid = false;
    }

    // check
    if (!isValid) {
      return;
    }

    if (this.request.TrusteeGeneralInfoID > 0) {
      this.request.ModifyBy = 1;
    }
    else {
      this.request.CreatedBy = 1;
      this.request.ModifyBy = 1;
    }
    // save data
    try {
      this.loaderService.requestStarted();
      await this.TrusteeGeneralInfoService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //console.log(this.State);

          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // reset    
            this.ResetData();
            // get data
            if (this.LegalEntityDataModel != null) {
              await this.GetDataList();
              if (this.TrusteeGeneralInfoList.length > 0) {
                this.IsTrustee = true;
                this.IsTrusteeReset = true;
              }
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

    this.isSubmitted = false;

  }

  async CustomValidate() {
    let isValid = true;
    if (this.request.SocietyRegistrationDocument == null || this.request.SocietyRegistrationDocument == undefined || this.request.SocietyRegistrationDocument == '') {
      isValid = false;
      this.SocietyRegistrationDocumentValidationMessage = 'This field is required .!';
    }
    if (this.request.SocietyLogo == null || this.request.SocietyLogo == undefined || this.request.SocietyLogo == '') {
      isValid = false;
      this.SocietyLogoValidationMessage = 'This field is required .!';
    }
    if (this.SocietyRegistrationDocumentValidationMessage != '') {
      isValid = false;
    }
    if (this.SocietyLogoValidationMessage != '') {
      isValid = false;
    }

    return isValid;
  }

  async ResetData() {
    // reset
    //this.request.LegalEntityID = 0;
    try {
      this.loaderService.requestStarted();
      this.request.TrusteeGeneralInfoID = 0;
      this.ResetFileAndValidation('SocietyRegistrationDocument', '', '', '', '', false);
      this.ResetFileAndValidation('SocietyLogo', '', '', '', '', false);
      this.request.DateOfElectionOfPresentManagementCommittee = '';
      this.request.WomenMembersOfManagementCommitteeID = null;
      this.request.DateOfElectionOfManagementCommitteeID = null;
      this.request.OtherInstitutionRunByTheSocietyID = null;
      this.IsTrustee = false;
      this.IsTrusteeReset = false;
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async DeleteData(row: TrusteeGeneralInfoDataModel) {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.TrusteeGeneralInfoService.DeleteData(row.TrusteeGeneralInfoID, row.ModifyBy)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // data
            const index: number = this.TrusteeGeneralInfoList.indexOf(row);
            if (index != -1) {
              this.TrusteeGeneralInfoList.splice(index, 1)
            }
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
        this.isLoading = false;

      }, 200);
    }
  }

  async GetData(trusteeGeneralInfoId: number) {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.TrusteeGeneralInfoService.GetData(trusteeGeneralInfoId)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (!this.State) {
            //this.toastr.success(this.SuccessMessage)
            // data
            this.request = JSON.parse(JSON.stringify(data['Data']));

            // Society Registration Document
            if (this.request.SocietyRegistrationDocument != '' || this.request.Dis_SocietyRegistrationDocument != '' || this.request.SocietyRegistrationDocumentPath != '') {
              await this.ResetFileAndValidation('SocietyRegistrationDocument', '', this.request.SocietyRegistrationDocument, this.request.Dis_SocietyRegistrationDocument, this.request.SocietyRegistrationDocumentPath, true);
            }
            // Society Logo
            if (this.request.SocietyLogo != '' || this.request.Dis_SocietyLogo != '' || this.request.SocietyLogoPath != '') {
              await this.ResetFileAndValidation('SocietyLogo', '', this.request.SocietyLogo, this.request.Dis_SocietyLogo, this.request.SocietyLogoPath, true);
            }
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
        this.isLoading = false;

      }, 200);
    }
  }

  async GetDataOfLegalEntity() {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.TrusteeGeneralInfoService.GetDataOfLegalEntity(this.sSOLoginDataModel.SSOID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          
          if (this.State == 0) {
            this.LegalEntityDataModel = JSON.parse(JSON.stringify(data['Data']));
            if (this.LegalEntityDataModel != null) {
              this.request.LegalEntityID = this.LegalEntityDataModel.LegalEntityID;
              // load trustee list
              await this.GetDataList();
            }
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.SuccessMessage)
          }

          //console.log(this.request.RuralUrban);
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

  async GetDataList() {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.TrusteeGeneralInfoService.GetDataList(this.request.LegalEntityID)
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
        this.isLoading = false;

      }, 200);
    }
  }

  async onFilechange(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type === 'image/jpeg' ||
          this.file.type === 'application/pdf' ||
          this.file.type === 'image/jpg') {
          //size validation
          if (this.file.size > 2000000) {
            this.ResetFileAndValidation(Type, 'Select less then 2MB File', '', '', '', false);
            return
          }
          if (this.file.size < 100000) {
            this.ResetFileAndValidation(Type, 'Select more then 100kb File', '', '', '', false);
            return
          }
        }
        else {// type validation
          this.ResetFileAndValidation(Type, 'Select Only jpg/jpeg/pdf file', '', '', '', false);
          return
        }
        // upload to server folder
        this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            
            this.ResetFileAndValidation(Type, '', data['Data'][0]["FileName"], data['Data'][0]["Dis_FileName"], data['Data'][0]["FilePath"], true);
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
      else {
        this.ResetFileAndValidation(Type, '', '', '', '', false);
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async DeleteImage(Type: string) {
    try {
      this.loaderService.requestStarted();
      let path: string = '';
      if (Type == 'SocietyRegistrationDocument') {
        path = this.request.SocietyRegistrationDocument;
      }
      else if (Type == 'SocietyLogo') {
        path = this.request.SocietyLogo;
      }

      // delete from server folder
      this.fileUploadService.DeleteDocument(path).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.ResetFileAndValidation(Type, '', '', '', '', false);
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async ResetFileAndValidation(type: string, msg: string, name: string, dis_name: string, path: string, isShowFile: boolean) {
    //event.target.value = '';
    try {
      this.loaderService.requestStarted();
      if (type == 'SocietyRegistrationDocument') {
        this.showSocietyRegistrationDocument = isShowFile;
        this.SocietyRegistrationDocumentValidationMessage = msg;
        this.request.SocietyRegistrationDocument = name;
        this.request.Dis_SocietyRegistrationDocument = dis_name;
        this.request.SocietyRegistrationDocumentPath = path;
      }
      else if (type == 'SocietyLogo') {
        this.showSocietyLogoDocument = isShowFile;
        this.SocietyLogoValidationMessage = msg;
        this.request.SocietyLogo = name;
        this.request.Dis_SocietyLogo = dis_name;
        this.request.SocietyLogoPath = path;
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async EditData(trusteeGeneralInfoId: number) {
    try {
      this.loaderService.requestStarted();
      await this.GetData(trusteeGeneralInfoId);
      this.IsTrustee = false;
      this.IsTrusteeReset = true;
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

}
