import { ChangeDetectorRef, Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FarmLandDetailDataModel } from '../../../Models/FarmLandDetailDataModel';
import { FarmLandDetailService } from '../../../Services/FarmLandDetail/farm-land-detail.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import jsPDF from 'jspdf'

import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-farm-land-details',
  templateUrl: './farm-land-details.component.html',
  styleUrls: ['./farm-land-details.component.css']
})
export class FarmLandDetailsComponent implements OnInit {

  isSubmitted: boolean = false;
  isFarmTotalLandArea: boolean = false;
  isTotalLandArea: boolean = false;
  farmlanddetailform!: FormGroup;
  request = new FarmLandDetailDataModel();
  public lstFarmLandDetails: any = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  UploadFile: string = '';
  file: File | any = null;
  public files: File = null;
  public isFormValid: boolean = false;
  public isLandTitleCertificate: boolean = false;
  public isCertificatefOfTehsildar: boolean = false;
  IsPanchayatSamitirequried: boolean = false;
  IsTehsilrequired: boolean = false;
  IsRural: boolean = false;
  public ImageValidationMessage: string = '';
  public ImageValidate: string = '';

  public DivisionList: any = [];
  public DistrictList: any = [];
  public TehsilList: any = [];
  public PanchyatSamitiList: any = [];
  public QueryStringCollegeID: any = 0;
  public CityList: any = [];
  public QueryStringStatus: any = '';
  public SelectedApplyNOCID: number = 0;
  public SearchRecordID: string = '';

  @ViewChild('fileUploadImage')
  fileUploadImage: ElementRef<HTMLInputElement> = {} as ElementRef;

  sSOLoginDataModel = new SSOLoginDataModel();
  constructor(private farmLandDetailServiceService: FarmLandDetailService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute,
    private routers: Router, private cdRef: ChangeDetectorRef, private clipboard: Clipboard) { }

  init() {
    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }

  async ngOnInit(): Promise<void> {
    this.farmlanddetailform = this.formBuilder.group(
      {
        txtTotalFarmLandArea: ['', Validators.required],
        rbFarmLandIs: ['', Validators.required],
        txtKhasraNumber: ['', Validators.required],
        txtLandOwnerName: ['', Validators.required],
        txtTotalLandArea: ['', Validators.required],
        /*  txtLandAddress: ['', Validators.required],*/
        rbLandType: ['', Validators.required],
        txtSourceIrrigation: ['', Validators.required],
        txtCertificatefOfTehsildar: [''],
        txtLandTitleCertificate: [''],
        txtAddressLine1_Owner: ['', Validators.required],
        txtAddressLine2_Owner: [''],
        rbRuralUrban_Owner: ['', Validators.required],
        ddlDivisionID_Owner: ['', [DropdownValidators]],
        ddlDistrictID_Owner: ['', [DropdownValidators]],
        ddlTehsilID_Owner: ['', [DropdownValidators]],
        ddlCityID: [''],
        ddlPanchayatSamitiID_Owner: [''],
        txtCityTownVillage_Owner: ['', Validators.required],
        txtPincode_Owner: ['', [Validators.required]],
      })
    this.GetDivisionList();
    //this.QueryStringCollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.CollegeID = data['Data']['CollegeID'];
          this.QueryStringCollegeID = data['Data']['CollegeID'];
          if (this.request.CollegeID == null || this.request.CollegeID == 0 || this.request.CollegeID == undefined) {
            this.routers.navigate(['/draftapplicationlist']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    debugger;
    this.GetAllFarmLandDetalsList(this.QueryStringCollegeID);
  }
  get form() { return this.farmlanddetailform.controls; }

  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode == 47 || charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async IsRuralOrUrban(isRural: boolean, section?: string) {
    this.IsRural = isRural;
    //this.request.TehsilID = 0;
    this.request.PanchayatSamitiID = 0;
    this.request.CityID = 0;
  }
  async GetDivisionList() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionList = data['Data'];
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

  async FillDivisionRelatedDDL(event: any, SeletedValueDivision: any) {
    this.request.DivisionID = SeletedValueDivision;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictByDivsionId(this.request.DivisionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DistrictList = data['Data'];

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
  async FillDistrictRelatedDDL(event: any, SeletedValueDistrict: any) {
    // this.buildingdetails.DistrictID = SeletedValueDistrict;
    try {
      this.loaderService.requestStarted();

      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(SeletedValueDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TehsilList = data['Data'];
        }, error => console.error(error));
      // PanchyatSamiti list
      await this.commonMasterService.GetPanchyatSamitiByDistrictId(SeletedValueDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PanchyatSamitiList = data['Data'];

        }, error => console.error(error));
      //city list
      await this.commonMasterService.GetCityByDistrict(SeletedValueDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CityList = data['Data'][0]['data'];
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

  ValidateUploadImage(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      if (event.target.files && event.target.files[0]) {
        this.file = event.target.files[0];
        if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/jpg') {
          if (event.target.files[0].size > 2000000) {
            this.ResetFileAndValidation(Type, 'Select less then 2MB File', '', '', '', true);
            return
          }
          if (event.target.files[0].size < 100000) {
            this.ResetFileAndValidation(Type, 'Select more then 100kb File', '', '', '', true);
            return
          }
        }
        else {
          this.ResetFileAndValidation(Type, 'Select Only pdf/jpeg/jpg File', '', '', '', true);
          return
        }

        this.file = event.target.files[0];
        this.fileUploadService.UploadDocument(this.file).then((data: any) => {

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, '', data['Data'][0]["FileName"], data['Data'][0]["Dis_FileName"], data['Data'][0]["FilePath"], false);
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
        this.ResetFileAndValidation(Type, 'Select pdf/jpeg/jpg File', '', '', '', true);
      }

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
  ResetFileAndValidation(type: string, msg: string, name: string, dis_name: string, path: string, isShowFile: boolean) {
    if (type == 'CertificatefOfTehsildar') {
      this.ImageValidationMessage = msg;
      this.isCertificatefOfTehsildar = isShowFile;
      this.request.CertificatefOfTehsildarPath = path;
      this.request.CertificatefOfTehsildarName = name;
      this.request.CertificatefOfTehsildar_DisName = dis_name;
    }
    else if (type == 'LandTitleCertificate') {
      this.ImageValidationMessage = msg;
      this.isLandTitleCertificate = isShowFile;
      this.request.LandTitleCertificatePath = path;
      this.request.LandTitleCertificateName = name;
      this.request.LandTitleCertificate_DisName = dis_name;
    }
  }
  DeleteImage(Type: string) {
    let path: string = '';
    if (Type == 'CertificatefOfTehsildar') {
      this.file = document.getElementById('txtCertificatefOfTehsildar');
      this.file.value = '';
      path = this.request.CertificatefOfTehsildarName;
    }
    else if (Type == 'LandTitleCertificate') {
      this.file = document.getElementById('txtLandTitleCertificate');
      this.file.value = '';
      path = this.request.LandTitleCertificateName;
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
  async SaveData() {
    
    this.isFarmTotalLandArea = false;
    this.isTotalLandArea = false;
    this.isSubmitted = true;
    this.isFormValid = true;
    if (this.farmlanddetailform.invalid) {
      this.isFormValid = false;
    }
    if (this.request.TotalFarmLandArea == 0) {
      this.isFarmTotalLandArea = true;
      this.isFormValid = false;
    }
    if (this.request.TotalLandArea == 0) {
      this.isTotalLandArea = true;

    }
    if (this.request.RuralUrban == 'Rural') {
      if (this.request.PanchayatSamitiID == 0) {
        this.IsPanchayatSamitirequried = true;
        this.isFormValid = false;
      }
    }
    else {
      if (this.request.CityID == 0) {
        this.isFormValid = false;
      }
    }
    if (this.request.CertificatefOfTehsildarPath == '') {
      this.ImageValidate = 'This field is required .!';
      this.isFormValid = false;
    }
    if (this.request.LandTitleCertificatePath == '') {
      this.ImageValidate = 'This field is required .!';
      this.isFormValid = false;
    }

    if (!this.isFormValid) {
      return;
    }
    this.loaderService.requestStarted();
    try {
      console.log(this.request);
      this.request.CollegeID = this.QueryStringCollegeID;
      await this.farmLandDetailServiceService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetAllFarmLandDetalsList(this.request.CollegeID);
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
  async ResetControl() {
    const txtCertificatefOfTehsildar = document.getElementById('txtCertificatefOfTehsildar')
    if (txtCertificatefOfTehsildar) txtCertificatefOfTehsildar.focus();
    this.isSubmitted = false;
    this.request.FarmLandDetailID = 0;
    this.request.CertificatefOfTehsildarName = "";
    this.request.CertificatefOfTehsildarPath = '';
    this.request.CertificatefOfTehsildar_DisName = '';
    this.request.AddressLine1 = '';
    this.request.AddressLine2 = '';
    this.request.TehsilID = 0;
    this.request.RuralUrban = '';
    this.request.Pincode = '';
    this.request.PanchayatSamitiID = 0;
    this.request.CityID = 0;
    this.request.KhasraNumber = '';
    this.request.LandOwnerName = '';
    this.request.LandTitleCertificateName = '';
    this.request.LandTitleCertificatePath = '';
    this.request.CertificatefOfTehsildar_DisName = '';
    this.request.LandType = '';
    this.request.FarmLandIs = '';
    this.request.SourceIrrigation = '';
    this.request.TotalFarmLandArea = 0;
    this.request.CityTownVillage = '';
    this.request.TotalLandArea = 0;
    this.request.CityTownVillage = '';

    this.request.DivisionID = 0;
    this.request.DistrictID = 0;
    this.request.PanchayatSamitiID = 0;
    this.request.CityTownVillage = '';
    this.request.ContactNo = '';
    this.isFormValid = false;
    this.isLandTitleCertificate = false;
    this.isCertificatefOfTehsildar = false;
    this.IsPanchayatSamitirequried = false;
    this.IsTehsilrequired = false;
    this.IsRural = false;
    this.ImageValidationMessage = '';
    this.ImageValidate = '';

    this.DistrictList = [];
    this.TehsilList = [];
    this.PanchyatSamitiList = [];
    this.CityList = [];
    this.request.ActiveStatus = false;
    this.isFarmTotalLandArea = false;
    this.isTotalLandArea = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
  }
  btnCancel_Click() {
    this.routers.navigate(['/dashboard']);

  }

  async GetAllFarmLandDetalsList(CollegeID: number) {
    
    try {
      this.loaderService.requestStarted();
      await this.farmLandDetailServiceService.GetAllFarmLandDetalsListByCollegeID(CollegeID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID:0)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstFarmLandDetails = data['Data'][0]['data'];
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

  async Edit_OnClick(FarmLandDetailsID: number) {
    
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.farmLandDetailServiceService.GetFarmLandDetalsByID(FarmLandDetailsID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.FarmLandDetailID = data['Data']["FarmLandDetailID"];
          this.request.CollegeID = data['Data']["CollegeID"];
          this.request.LandOwnerName = data['Data']["LandOwnerName"];
          this.request.KhasraNumber = data['Data']["KhasraNumber"];
          this.request.AddressLine1 = data['Data']["AddressLine1"];
          this.request.AddressLine2 = data['Data']["AddressLine2"];
          this.request.RuralUrban = data['Data']["RuralUrban"];
          this.request.DivisionID = data['Data']["DivisionID"];
          this.FillDivisionRelatedDDL(null, this.request.DivisionID);
          this.request.DistrictID = data['Data']["DistrictID"];
          this.FillDistrictRelatedDDL(null, this.request.DistrictID);
          this.request.TehsilID = data['Data']["TehsilID"];
          if (this.request.RuralUrban == 'Rural') {
            this.IsRural = true;
            this.request.PanchayatSamitiID = data['Data']["PanchayatSamitiID"];
          }
          else {
            this.IsRural = false;
            this.request.CityID = data['Data']["CityID"];

          }
          this.request.CityTownVillage = data['Data']["CityTownVillage"];
          this.request.LandType = data['Data']["LandType"];
          this.request.Pincode = data['Data']["Pincode"];
          this.request.TotalFarmLandArea = data['Data']["TotalFarmLandArea"];
          this.request.TotalLandArea = data['Data']["TotalLandArea"];
          this.request.SourceIrrigation = data['Data']["SourceIrrigation"];
          this.request.FarmLandIs = data['Data']["FarmLandIs"];
          this.request.CertificatefOfTehsildarPath = data['Data']["CertificatefOfTehsildarPath"];
          this.request.CertificatefOfTehsildarName = data['Data']["CertificatefOfTehsildarName"];
          this.request.CertificatefOfTehsildar_DisName = data['Data']["CertificatefOfTehsildar_DisName"];
          this.request.LandTitleCertificatePath = data['Data']["LandTitleCertificatePath"];
          this.request.LandTitleCertificateName = data['Data']["LandTitleCertificateName"];
          this.request.LandTitleCertificate_DisName = data['Data']["LandTitleCertificate_DisName"];

          // this.isDisabledGrid = true;
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async Delete_OnClick(FarmLandDetailsID: number) {
    
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.farmLandDetailServiceService.DeleteData(FarmLandDetailsID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllFarmLandDetalsList(this.QueryStringCollegeID);
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
