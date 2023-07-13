//import { Component, OnInit } from '@angular/core';
//import * as $ from'jquery'
import { ChangeDetectorRef, Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BuildingDetailsDataModel,DocuemntBuildingDetailsDataModel } from '../../../Models/TabDetailDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { BuildingDetailsMasterService } from '../../../Services/BuildingDetailsMaster/building-details-master.service'
import { Obj } from '@popperjs/core';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable, { Table } from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-building-details',
  templateUrl: './building-details.component.html',
  styleUrls: ['./building-details.component.css']
})
export class BuildingDetailsComponent implements OnInit {
  isSubmitted: boolean = false;
  buildingdetailsForm!: FormGroup;
  buildingdetails = new BuildingDetailsDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  UploadFile: string = '';
  file: File | any = null;
  public files: File = null;
  public isDisabledGrid: boolean = false;
  public isFileName: boolean = false;
  public lstBuildingTypeChk: any = [];
  public lstBuildingDetails: any = [];
  public lstBuildingDetailsDocument: any = [];
  public isDeleteButton: boolean = true; 
  //public lstBuildingDocDetails: any = [];
  public isLoadingExport: boolean = false;
  public DivisionList: any = [];
  public DistrictList_Owner: any = [];
  public UserID: number = 0;
  public DistrictList: any = [];
  public SuvdivisionList: any = [];
  public TehsilList_Owner: any = [];
  public TehsilList: any = [];
  public PanchyatSamitiList_Owner: any = [];
  public PanchyatSamitiList: any = [];
  public ParliamentAreaList: any = [];
  public AssembelyAreaList: any = [];
  IsBuildingDetails: boolean = false;
  public PinNoRegex = new RegExp(/[0-9]{5}/);
  public ContactNoRegex = new RegExp(/[0-9]{5}/);
  IsRural_Owner: boolean = true;
  IsRural: boolean = false;
  isCheckedBuildingType: boolean = false;
  IsPanchayatSamitirequried: boolean = false;
  IsTehsilrequired: boolean = false;
  public OwnBuildingFileUpload: boolean = false;
  public FireNOCFileUpload: boolean = false;
  public PWDNOCFileUpload: boolean = false;
  public ActiveStatus: boolean = true;
  public downloadingPDF: boolean = false;
  searchText: string = '';
  public isFormValid: boolean = false;

  public ImageValidate: string = '';
  public CssClass_TextDangerWidth: string = '';
  public CssClass_TextDangerLength: string = '';

  public isValidOwnBuildingFileUpload: boolean = false;
  public isValidFireNOCFileUpload: boolean = false;
  public isValidPWDNOCFileUpload: boolean = false;
  public showOwnBuildingFileUpload: boolean = false;
  public showFireNOCFileUpload: boolean = false;
  public showPWDNOCFileUpload: boolean = false;

  public ImageValidationMessage: string = '';
  public isValidTotalProjectCostFileUpload: boolean = false;
  public isValidSourceCostAmountFileUpload: boolean = false;
  public isValidAmountDepositedFileUpload: boolean = false;
  public isValidOtherFixedAssetsAndSecuritiesFileUpload: boolean = false;
  public isValidGATEYearBalanceSecretFileUpload: boolean = false;
  public isValidOtherFinancialResourcesFileUpload: boolean = false;
 
  @ViewChild('fileUploadImage')
  fileUploadImage: ElementRef<HTMLInputElement> = {} as ElementRef;

  public lstBuildingDocDetails: DocuemntBuildingDetailsDataModel[] = [];
  
  public EditID: any;
  isEdit: boolean = false;

  public isView: boolean = true;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;
  
  public isPrint: boolean = true;
  public CurrentPageName: any = "";
  public dropdownList: any = [];
  public dropdownSettings: IDropdownSettings = {};
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  isUploadImage: boolean = false;
  public MaxDate: Date = new Date();


  constructor(private buildingDetailsMasterService: BuildingDetailsMasterService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute,
    private routers: Router, private cdRef: ChangeDetectorRef, private clipboard: Clipboard) { }


  init() {
    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }
  ngOnInit(): void {  
    

    // load
    // query string
   

    this.buildingdetailsForm = this.formBuilder.group(
      {
        rdBuildingType: ['', Validators.required],
        txtOwnerName: ['', Validators.required],
        txtAddressLine1_Owner: ['', Validators.required],
        txtAddressLine2_Owner: ['', Validators.required],
        rbRuralUrban_Owner: ['', Validators.required],
        ddlDivisionID_Owner: ['', [DropdownValidators]],
        ddlDistrictID_Owner: ['', [DropdownValidators]],
        ddlTehsilID_Owner: [''],
        ddlPanchayatSamitiID_Owner: [''],
        txtCityTownVillage_Owner: ['', Validators.required],
        txtPincode_Owner: ['', [Validators.required]],
        txtContactNo_Owner: ['', [Validators.required]],

        txtFromDate: ['', Validators.required],
        txtToDate: ['', Validators.required],
        txtFireNOCUpload: [''],
        txtOrderNo: ['', Validators.required],
        txtOrderDate: ['', Validators.required],
        txtExpiringOn: ['', Validators.required],
        txtPWDNOCFileUpload: [''],
        //txtFrontViewFileUpload: ['', Validators.required],
        //txtBackViewFileUpload: ['', Validators.required],
        //txtLSideViewFileUpload: ['', Validators.required],
        //txtRSideViewFileUpload: ['', Validators.required],
        //txtOtherFileUpload: ['', Validators.required],


        txtOwnBuildingOrderNo: ['', [Validators.required]],
        txtOwnBuildingOrderDate: ['', [Validators.required]],
        txtTotalProjectCost: ['', [Validators.required]],
        txtSourceCostAmount: ['', [Validators.required]],
        txtAmountDeposited: ['', [Validators.required]],
        txtOtherFixedAssetsAndSecurities: ['', [Validators.required]],
        txtGATEYearBalanceSecret: ['', [Validators.required]],
        txtOtherFinancialResources: ['', [Validators.required]],
        TotalProjectCostFileUpload: [''],
        SourceCostAmountFileUpload: [''],
        AmountDepositedFileUpload: [''],
        OtherFixedAssetsAndSecuritiesFileUpload: [''],
        GATEYearBalanceSecretFileUpload: [''],
        OtherFinancialResourcesFileUpload: [''],
        txtOwnBuildingUpload: [''],
        
        txtsearchText: [''],
      })

    this.buildingdetails.CollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    this.buildingdetails.lstBuildingDocDetails = [];
    this.GetBuildingTypeCheck();
    this.GetBuildingUploadDetails();
    this.GetDivisionList();
    this.GetAllBuildingDetailsList();
    this.ActiveStatus = true;
   
  }
  get form() { return this.buildingdetailsForm.controls; }

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
  async GetBuildingTypeCheck() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetBuildingTypeCheck()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstBuildingTypeChk = data['Data'];
          console.log(this.lstBuildingTypeChk);
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
  async GetBuildingUploadDetails() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetBuildingUploadDetails()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.buildingdetails.lstBuildingDocDetails = data['Data'];

          console.log("this.lstBuildingDocDetails");
          console.log(this.buildingdetails.lstBuildingDocDetails);
          console.log("this.lstBuildingDocDetails");
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
  async SaveData() {
    debugger;
    this.isValidOwnBuildingFileUpload = false;
    this.isValidFireNOCFileUpload = false;
    this.isValidPWDNOCFileUpload = false;

    this.isValidTotalProjectCostFileUpload = false;
    this.isValidSourceCostAmountFileUpload = false;
    this.isValidAmountDepositedFileUpload = false;
    this.isValidOtherFixedAssetsAndSecuritiesFileUpload = false;
    this.isValidGATEYearBalanceSecretFileUpload = false;
    this.isValidOtherFinancialResourcesFileUpload = false;

    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';
    this.isSubmitted = true;
    this.isFormValid = true;
    if (this.buildingdetailsForm.invalid) {
      this.isFormValid = false;
    }
    if (this.buildingdetails.RuralUrban == 'Rural') {
      if (this.buildingdetails.PanchayatSamitiID == 0) {
        this.IsPanchayatSamitirequried = true;
        this.isFormValid = false;
      }
      if (this.buildingdetails.TehsilID == 0) {
        this.IsTehsilrequired = true;
        this.isFormValid = false;
      }
    }
    if (this.buildingdetails.OwnBuildingFileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }
    if (this.buildingdetails.FireNOCFileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }
    if (this.buildingdetails.PWDNOCFileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }
    if (this.buildingdetails.TotalProjectCostFileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }
    if (this.buildingdetails.SourceCostAmountFileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }
    if (this.buildingdetails.AmountDepositedFileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }
    if (this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }
    if (this.buildingdetails.GATEYearBalanceSecretFileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    } 
    if (this.buildingdetails.OtherFinancialResourcesFileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    } 
    if (!this.isFormValid) {
      return;
    }    
    this.loaderService.requestStarted();
    try {
      await this.buildingDetailsMasterService.SaveData(this.buildingdetails)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetBuildingUploadDetails();
            this.GetAllBuildingDetailsList();
            this.lstBuildingDetails = [];
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
  async Edit_OnClick(SchoolBuildingDetailsID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.buildingDetailsMasterService.GetByID(SchoolBuildingDetailsID, this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.buildingdetails.SchoolBuildingDetailsID = data['Data'][0]['data']['Table'][0]["SchoolBuildingDetailsID"];
          this.GetBuildingTypeCheck();
          this.buildingdetails.BuildingTypeID = data['Data'][0]['data']['Table'][0]["BuildingTypeID"];
          this.buildingdetails.OwnerName = data['Data'][0]['data']['Table'][0]["OwnerName"];
          this.buildingdetails.AddressLine1 = data['Data'][0]['data']['Table'][0]["AddressLine1"];
          this.buildingdetails.AddressLine2 = data['Data'][0]['data']['Table'][0]["AddressLine2"];
          this.buildingdetails.RuralUrban = data['Data'][0]['data']['Table'][0]["RuralUrban"];
          this.buildingdetails.DivisionID = data['Data'][0]['data']['Table'][0]["DivisionID"];
          this.FillDivisionRelatedDDL(null, this.buildingdetails.DivisionID);
          this.buildingdetails.DistrictID = data['Data'][0]['data']['Table'][0]["DistrictID"];
          
          if (this.buildingdetails.RuralUrban == 'Rural') {
            this.IsRural = true;
            this.FillDistrictRelatedDDL(null, this.buildingdetails.DistrictID);
            this.buildingdetails.TehsilID = data['Data'][0]['data']['Table'][0]["TehsilID"];
            this.buildingdetails.PanchayatSamitiID = data['Data'][0]['data']['Table'][0]["PanchayatSamitiID"];            
          }
          else {
            this.IsRural = false;
          }
          this.buildingdetails.CityTownVillage = data['Data'][0]['data']['Table'][0]["CityTownVillage"];
          this.buildingdetails.ContactNo = data['Data'][0]['data']['Table'][0]["ContactNo"];
          this.buildingdetails.Pincode = data['Data'][0]['data']['Table'][0]["Pincode"];
          this.buildingdetails.OwnBuildingOrderNo = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderNo"];
          this.buildingdetails.OwnBuildingOrderDate = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderDate"];
          this.buildingdetails.OwnBuildingFileUpload = data['Data'][0]['data']['Table'][0]["OwnBuildingFileUpload"];
          this.buildingdetails.Dis_OwnBuildingFileUpload = data['Data'][0]['data']['Table'][0]["Dis_OwnBuildingFileUpload"];
          this.buildingdetails.OwnBuildingFileUploadPath = data['Data'][0]['data']['Table'][0]["OwnBuildingFileUploadPath"];
          this.buildingdetails.FromDate = data['Data'][0]['data']['Table'][0]["FromDate"];
          this.buildingdetails.ToDate = data['Data'][0]['data']['Table'][0]["ToDate"];
          this.buildingdetails.FireNOCFileUpload = data['Data'][0]['data']['Table'][0]["FireNOCFileUpload"];
          this.buildingdetails.Dis_FireNOCFileUpload = data['Data'][0]['data']['Table'][0]["Dis_FireNOCFileUpload"];
          this.buildingdetails.FireNOCFileUploadPath = data['Data'][0]['data']['Table'][0]["FireNOCFileUploadPath"];
          this.buildingdetails.OrderNo = data['Data'][0]['data']['Table'][0]["OrderNo"];
          this.buildingdetails.OrderDate = data['Data'][0]['data']['Table'][0]["OrderDate"];
          this.buildingdetails.ExpiringOn = data['Data'][0]['data']['Table'][0]["ExpiringOn"];
          this.buildingdetails.PWDNOCFileUpload = data['Data'][0]['data']['Table'][0]["PWDNOCFileUpload"];
          this.buildingdetails.Dis_PWDNOCFileUpload = data['Data'][0]['data']['Table'][0]["Dis_PWDNOCFileUpload"];
          this.buildingdetails.PWDNOCFileUploadPath = data['Data'][0]['data']['Table'][0]["PWDNOCFileUploadPath"];

          this.buildingdetails.TotalProjectCost = data['Data'][0]['data']['Table'][0]["TotalProjectCost"];
          this.buildingdetails.SourceCostAmount = data['Data'][0]['data']['Table'][0]["SourceCostAmount"];
          this.buildingdetails.AmountDeposited = data['Data'][0]['data']['Table'][0]["AmountDeposited"];
          this.buildingdetails.OtherFixedAssetsAndSecurities = data['Data'][0]['data']['Table'][0]["OtherFixedAssetsAndSecurities"];
          this.buildingdetails.GATEYearBalanceSecret = data['Data'][0]['data']['Table'][0]["GATEYearBalanceSecret"];
          this.buildingdetails.OtherFinancialResources = data['Data'][0]['data']['Table'][0]["OtherFinancialResources"];
          this.buildingdetails.TotalProjectCostFileUpload = data['Data'][0]['data']['Table'][0]["TotalProjectCostFileUpload"];
          this.buildingdetails.TotalProjectCostFileUploadPath = data['Data'][0]['data']['Table'][0]["TotalProjectCostFileUploadPath"];
          this.buildingdetails.Dis_TotalProjectCostFileUpload = data['Data'][0]['data']['Table'][0]["Dis_TotalProjectCostFileUpload"];
          this.buildingdetails.SourceCostAmountFileUpload = data['Data'][0]['data']['Table'][0]["SourceCostAmountFileUpload"];
          this.buildingdetails.SourceCostAmountFileUploadPath = data['Data'][0]['data']['Table'][0]["SourceCostAmountFileUploadPath"];
          this.buildingdetails.Dis_SourceCostAmountFileUpload = data['Data'][0]['data']['Table'][0]["Dis_SourceCostAmountFileUpload"];
          this.buildingdetails.AmountDepositedFileUpload = data['Data'][0]['data']['Table'][0]["AmountDepositedFileUpload"];
          this.buildingdetails.AmountDepositedFileUploadPath = data['Data'][0]['data']['Table'][0]["AmountDepositedFileUploadPath"];
          this.buildingdetails.Dis_AmountDepositedFileUpload = data['Data'][0]['data']['Table'][0]["Dis_AmountDepositedFileUpload"];
          this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload = data['Data'][0]['data']['Table'][0]["OtherFixedAssetsAndSecuritiesFileUpload"];
          this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUploadPath = data['Data'][0]['data']['Table'][0]["OtherFixedAssetsAndSecuritiesFileUploadPath"];
          this.buildingdetails.Dis_OtherFixedAssetsAndSecuritiesFileUpload = data['Data'][0]['data']['Table'][0]["Dis_OtherFixedAssetsAndSecuritiesFileUpload"];
          this.buildingdetails.GATEYearBalanceSecretFileUpload = data['Data'][0]['data']['Table'][0]["GATEYearBalanceSecretFileUpload"];
          this.buildingdetails.GATEYearBalanceSecretFileUploadPath = data['Data'][0]['data']['Table'][0]["GATEYearBalanceSecretFileUploadPath"];
          this.buildingdetails.Dis_GATEYearBalanceSecretFileUpload = data['Data'][0]['data']['Table'][0]["Dis_GATEYearBalanceSecretFileUpload"];
          this.buildingdetails.OtherFinancialResourcesFileUpload = data['Data'][0]['data']['Table'][0]["OtherFinancialResourcesFileUpload"];
          this.buildingdetails.OtherFinancialResourcesFileUploadPath = data['Data'][0]['data']['Table'][0]["OtherFinancialResourcesFileUploadPath"];
          this.buildingdetails.Dis_OtherFinancialResourcesFileUpload = data['Data'][0]['data']['Table'][0]["Dis_OtherFinancialResourcesFileUpload"];

            this.buildingdetails.lstBuildingDocDetails = data['Data'][0]['data']['Table1'];
        
          this.isDisabledGrid = true;
          //this.showOwnBuildingFileUpload = true;
          //this.showFireNOCFileUpload = true;
          //this.showPWDNOCFileUpload = true;  
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
  async Delete_OnClick(SchoolBuildingDetailsID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.buildingDetailsMasterService.DeleteData(SchoolBuildingDetailsID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllBuildingDetailsList();
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
  async StatusUpdate_OnClick(SchoolBuildingDetailsID: number, ActiveStatus: boolean) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to Change Status this ?")) {
        this.loaderService.requestStarted();
        await this.buildingDetailsMasterService.StatusUpdate(SchoolBuildingDetailsID, ActiveStatus, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              // this.GetAllUniversityList();
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
  async GetAllBuildingDetailsList() {
    try {
      this.loaderService.requestStarted();
      await this.buildingDetailsMasterService.GetAllBuildingDetailsList(this.UserID, this.buildingdetails.CollegeID)
        .then((data: any) => {
    
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstBuildingDetails = data['Data'][0]['data']['Table'];
          this.lstBuildingDetailsDocument = data['Data'][0]['data']['Table1'];
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
  async ResetControl() {
    const txtOwnerName = document.getElementById('txtOwnerName')
    if (txtOwnerName) txtOwnerName.focus();
    this.isSubmitted = false;
    this.buildingdetails.SchoolBuildingDetailsID = 0;
    this.buildingdetails.BuildingTypeID = null;
    this.buildingdetails.OwnerName = '';
    this.buildingdetails.AddressLine1 = '';
    this.buildingdetails.AddressLine2 = '';
    this.buildingdetails.TehsilID = 0;
    this.buildingdetails.RuralUrban = '';
    this.buildingdetails.PWDNOCFileUpload = '';
    this.buildingdetails.Pincode = '';
    this.buildingdetails.PanchayatSamitiID = 0;
    this.buildingdetails.OwnBuildingOrderNo = '';
    this.buildingdetails.OwnBuildingOrderDate = '';
    this.buildingdetails.OwnBuildingFileUpload = '';
    this.buildingdetails.OrderNo = '';
    this.buildingdetails.OrderDate = '';
    this.buildingdetails.FromDate = '';
    this.buildingdetails.ToDate = '';
    this.buildingdetails.FireNOCFileUpload = '';
    this.buildingdetails.OtherFinancialResourcesFileUpload = '';
    this.buildingdetails.Dis_OtherFinancialResourcesFileUpload = '';
    this.buildingdetails.OtherFinancialResourcesFileUploadPath = '';
    this.buildingdetails.GATEYearBalanceSecretFileUpload = '';
    this.buildingdetails.Dis_GATEYearBalanceSecretFileUpload = '';
    this.buildingdetails.GATEYearBalanceSecretFileUploadPath = '';
    this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload = '';
    this.buildingdetails.Dis_OtherFixedAssetsAndSecuritiesFileUpload = '';
    this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUploadPath = '';
    this.buildingdetails.AmountDepositedFileUpload = '';
    this.buildingdetails.Dis_AmountDepositedFileUpload = '';
    this.buildingdetails.AmountDepositedFileUploadPath = '';
    this.buildingdetails.SourceCostAmountFileUpload = '';
    this.buildingdetails.Dis_SourceCostAmountFileUpload = '';
    this.buildingdetails.SourceCostAmountFileUploadPath = '';
    this.buildingdetails.TotalProjectCostFileUpload = '';
    this.buildingdetails.Dis_TotalProjectCostFileUpload = '';
    this.buildingdetails.TotalProjectCostFileUploadPath = '';
    this.buildingdetails.ExpiringOn = '';
    this.buildingdetails.DivisionID = 0;
    this.buildingdetails.DistrictID = 0;
    this.buildingdetails.PanchayatSamitiID = 0;
    this.buildingdetails.CityTownVillage = '';
    this.buildingdetails.ContactNo = '';
    this.OwnBuildingFileUpload= false;
    this.FireNOCFileUpload = false;
    this.PWDNOCFileUpload = false;
    //this.showOwnBuildingFileUpload = false;
    //this.showFireNOCFileUpload = false;
    //this.showPWDNOCFileUpload = false;  
    this.buildingdetails.UserID = 0;
    this.buildingdetails.ActiveStatus = false;
    this.isDisabledGrid = false;
    this.GetAllBuildingDetailsList();
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }  
  btnCancel_Click() {
    this.routers.navigate(['/dashboard']);

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
  async IsRuralOrUrban(isRural: boolean, section?: string) {
    this.IsRural = isRural;
    this.buildingdetails.TehsilID = 0;
    this.buildingdetails.PanchayatSamitiID = 0;
  }
  async FillDivisionRelatedDDL(event: any, SeletedValueDivision: any) {
    this.buildingdetails.DivisionID = SeletedValueDivision;    
    try {
      this.loaderService.requestStarted();      
      await this.commonMasterService.GetDistrictByDivsionId(this.buildingdetails.DivisionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DistrictList_Owner = data['Data'];

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
      // subdivision list
      await this.commonMasterService.GetSuvdivisionByDistrictId(SeletedValueDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SuvdivisionList = data['Data'];

        }, error => console.error(error));
      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(SeletedValueDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TehsilList_Owner = data['Data'];
        }, error => console.error(error));
      // PanchyatSamiti list
      await this.commonMasterService.GetPanchyatSamitiByDistrictId(SeletedValueDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PanchyatSamitiList_Owner = data['Data'];

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
  

  async onFilechange(event: any, item: DocuemntBuildingDetailsDataModel) {

    try {

      this.file = event.target.files[0];

      if (this.file) {

        if (this.file.type === 'image/jpeg' ||

          this.file.type === 'application/pdf' ||

          this.file.type === 'image/jpg') {

          //size validation

          if (this.file.size > 2000000) {

            this.toastr.error('Select less then 2MB File')

            return

          }

          if (this.file.size < 100000) {

            this.toastr.error('Select more then 100kb File')

            return

          }

        }

        else {// type validation

          this.toastr.error('Select Only jpg/jpeg/pdf file')

          return

        }

        // upload to server folder

        this.loaderService.requestStarted();

        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {

          this.State = data['State'];

          this.SuccessMessage = data['SuccessMessage'];

          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == 0) {

            item.FileName = data['Data'][0]["FileName"];

            item.FilePath = data['Data'][0]["FilePath"];
            item.Dis_FileName = data['Data'][0]["Dis_FileName"];

            event.Value = null;

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

        //this.ResetFileAndValidation(Type, '', '', false);

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
  async DeleteImages(item: DocuemntBuildingDetailsDataModel) {

    try {

      // delete from server folder

      this.loaderService.requestEnded();

      await this.fileUploadService.DeleteDocument(item.FilePath).then((data: any) => {

        this.State = data['State'];

        this.SuccessMessage = data['SuccessMessage'];

        this.ErrorMessage = data['ErrorMessage'];

        if (this.State == 0) {

          item.FileName = '';

          item.FilePath = '';

        }

        if (this.State == 1) {

          this.toastr.error(this.ErrorMessage)

        }

        else if (this.State == 2) {

          this.toastr.warning(this.ErrorMessage)

        }

      });

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
    
    this.isValidOwnBuildingFileUpload = false;
    this.isValidFireNOCFileUpload = false;
    this.isValidPWDNOCFileUpload = false;
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'image/jpeg' ||
        event.target.files[0].type === 'application/pdf' ||
        event.target.files[0].type === 'image/jpg') {
        if (event.target.files[0].size > 2000000) {
          this.ImageValidationMessage = 'Select less then 2MB File';
          if (Type == 'OwnBuildingFileUpload') {
            this.isValidOwnBuildingFileUpload = true;
            this.buildingdetails.OwnBuildingFileUpload = '';
            this.buildingdetails.Dis_OwnBuildingFileUpload = '';
            this.buildingdetails.OwnBuildingFileUploadPath = '';
          }
          else if (Type == 'FireNOCFileUpload') {
            this.isValidFireNOCFileUpload = true;
            this.buildingdetails.FireNOCFileUpload = '';
            this.buildingdetails.Dis_FireNOCFileUpload = '';
            this.buildingdetails.FireNOCFileUploadPath = '';
          }
          else if (Type == 'PWDNOCFileUpload') {
            this.isValidPWDNOCFileUpload = true;
            this.buildingdetails.PWDNOCFileUpload = '';
            this.buildingdetails.Dis_PWDNOCFileUpload = '';
            this.buildingdetails.PWDNOCFileUploadPath = '';
          }
          return
        }
        if (event.target.files[0].size < 100000) {
          this.ImageValidationMessage = 'Select more then 100kb File';
          if (Type == 'OwnBuildingFileUpload') {
            this.isValidOwnBuildingFileUpload = true;
            this.buildingdetails.OwnBuildingFileUpload = '';
            this.buildingdetails.Dis_OwnBuildingFileUpload = '';
            this.buildingdetails.OwnBuildingFileUploadPath = '';
          }
          else if (Type == 'FireNOCFileUpload') {
            this.isValidFireNOCFileUpload = true;
            this.buildingdetails.FireNOCFileUpload = '';
            this.buildingdetails.Dis_FireNOCFileUpload = '';
            this.buildingdetails.FireNOCFileUploadPath = '';
          }
          else if (Type == 'PWDNOCFileUpload') {
            this.isValidPWDNOCFileUpload = true;
            this.buildingdetails.PWDNOCFileUpload = '';
            this.buildingdetails.Dis_PWDNOCFileUpload = '';
            this.buildingdetails.PWDNOCFileUploadPath = '';
          }
          return
        }
      }
      else {
        this.ImageValidationMessage = 'Select Only jpg/jpeg/pdf file';
        if (Type == 'OwnBuildingFileUpload') {
          this.isValidOwnBuildingFileUpload = true;
          this.buildingdetails.OwnBuildingFileUpload = '';
          this.buildingdetails.Dis_OwnBuildingFileUpload = '';
          this.buildingdetails.OwnBuildingFileUploadPath = '';
        }
        else if (Type == 'FireNOCFileUpload') {
          this.isValidFireNOCFileUpload = true;
          this.buildingdetails.FireNOCFileUpload = '';
          this.buildingdetails.Dis_FireNOCFileUpload = '';
          this.buildingdetails.FireNOCFileUploadPath = '';
        }
        else if (Type == 'PWDNOCFileUpload') {
          this.isValidPWDNOCFileUpload = true;
          this.buildingdetails.PWDNOCFileUpload = '';
          this.buildingdetails.Dis_PWDNOCFileUpload = '';
          this.buildingdetails.PWDNOCFileUploadPath = '';
        }
        return
      }

      this.file = event.target.files[0];
      this.fileUploadService.UploadDocument(this.file).then((data: any) => {
        
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == 'OwnBuildingFileUpload') {
            //this.showOwnBuildingFileUpload = true;            
            this.buildingdetails.OwnBuildingFileUpload = data['Data'][0]["FileName"];
            this.buildingdetails.Dis_OwnBuildingFileUpload = data['Data'][0]["Dis_FileName"];
            this.buildingdetails.OwnBuildingFileUploadPath = data['Data'][0]["FilePath"];
          }
          else if (Type == 'FireNOCFileUpload') {
            //this.showFireNOCFileUpload = true;            
            this.buildingdetails.FireNOCFileUpload = data['Data'][0]["FileName"];
            this.buildingdetails.Dis_FireNOCFileUpload = data['Data'][0]["Dis_FileName"];
            this.buildingdetails.FireNOCFileUploadPath = data['Data'][0]["FilePath"];
          }
          else if (Type == 'PWDNOCFileUpload') {
            //this.showPWDNOCFileUpload = true;            
            this.buildingdetails.PWDNOCFileUpload = data['Data'][0]["FileName"];
            this.buildingdetails.Dis_PWDNOCFileUpload = data['Data'][0]["Dis_FileName"];
            this.buildingdetails.PWDNOCFileUploadPath = data['Data'][0]["FilePath"];
          }
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
    }
  }
  DeleteImage(Type: string) {
    if (Type == 'OwnBuildingFileUpload') {
      //this.showOwnBuildingFileUpload = false;
      this.buildingdetails.OwnBuildingFileUpload = '';
      this.buildingdetails.Dis_OwnBuildingFileUpload = '';
      this.buildingdetails.OwnBuildingFileUploadPath = '';
    }
    else if (Type == 'FireNOCFileUpload') {
      //this.showFireNOCFileUpload = false;
      this.buildingdetails.FireNOCFileUpload = '';
      this.buildingdetails.Dis_FireNOCFileUpload = '';
      this.buildingdetails.FireNOCFileUploadPath = '';
    }
    else if (Type == 'PWDNOCFileUpload') {
      //this.showPWDNOCFileUpload = false;
      this.buildingdetails.PWDNOCFileUpload = '';
      this.buildingdetails.Dis_PWDNOCFileUpload = '';
      this.buildingdetails.PWDNOCFileUploadPath = '';
    }
  }

  DescriptionValidateUploadImage(event: any, Type: string) {

    this.isValidTotalProjectCostFileUpload = false;
    this.isValidSourceCostAmountFileUpload = false;
    this.isValidAmountDepositedFileUpload = false;
    this.isValidOtherFixedAssetsAndSecuritiesFileUpload = false;
    this.isValidGATEYearBalanceSecretFileUpload = false;
    this.isValidOtherFinancialResourcesFileUpload = false;
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'application/pdf' ||
        event.target.files[0].type === 'application/xlsx' ||
        event.target.files[0].type === 'application/xls') {
        if (event.target.files[0].size > 2000000) {
          this.ImageValidationMessage = 'Select less then 2MB File';
          if (Type == 'TotalProjectCostFileUpload') {
            this.isValidTotalProjectCostFileUpload = true;
            this.buildingdetails.TotalProjectCostFileUpload = '';
            this.buildingdetails.Dis_TotalProjectCostFileUpload = '';
            this.buildingdetails.TotalProjectCostFileUploadPath = '';
          }
          else if (Type == 'SourceCostAmountFileUpload') {
            this.isValidSourceCostAmountFileUpload = true;
            this.buildingdetails.SourceCostAmountFileUpload = '';
            this.buildingdetails.Dis_SourceCostAmountFileUpload = '';
            this.buildingdetails.SourceCostAmountFileUploadPath = '';
          }
          else if (Type == 'AmountDepositedFileUpload') {
            this.isValidAmountDepositedFileUpload = true;
            this.buildingdetails.AmountDepositedFileUpload = '';
            this.buildingdetails.Dis_AmountDepositedFileUpload = '';
            this.buildingdetails.AmountDepositedFileUploadPath = '';
          }
          else if (Type == 'OtherFixedAssetsAndSecuritiesFileUpload') {
            this.isValidOtherFixedAssetsAndSecuritiesFileUpload = true;
            this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload = '';
            this.buildingdetails.Dis_OtherFixedAssetsAndSecuritiesFileUpload = '';
            this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUploadPath = '';
          }
          else if (Type == 'GATEYearBalanceSecretFileUpload') {
            this.isValidGATEYearBalanceSecretFileUpload = true;
            this.buildingdetails.GATEYearBalanceSecretFileUpload = '';
            this.buildingdetails.Dis_GATEYearBalanceSecretFileUpload = '';
            this.buildingdetails.GATEYearBalanceSecretFileUploadPath = '';
          }
          else if (Type == 'OtherFinancialResourcesFileUpload') {
            this.isValidOtherFinancialResourcesFileUpload = true;
            this.buildingdetails.OtherFinancialResourcesFileUpload = '';
            this.buildingdetails.Dis_OtherFinancialResourcesFileUpload = '';
            this.buildingdetails.OtherFinancialResourcesFileUploadPath = '';
          }
          return
        }
        if (event.target.files[0].size < 100000) {
          this.ImageValidationMessage = 'Select more then 100kb File';
          if (Type == 'TotalProjectCostFileUpload') {
            this.isValidTotalProjectCostFileUpload = true;
            this.buildingdetails.TotalProjectCostFileUpload = '';
            this.buildingdetails.Dis_TotalProjectCostFileUpload = '';
            this.buildingdetails.TotalProjectCostFileUploadPath = '';
          }
          else if (Type == 'SourceCostAmountFileUpload') {
            this.isValidSourceCostAmountFileUpload = true;
            this.buildingdetails.SourceCostAmountFileUpload = '';
            this.buildingdetails.Dis_SourceCostAmountFileUpload = '';
            this.buildingdetails.SourceCostAmountFileUploadPath = '';
          }
          else if (Type == 'AmountDepositedFileUpload') {
            this.isValidAmountDepositedFileUpload = true;
            this.buildingdetails.AmountDepositedFileUpload = '';
            this.buildingdetails.Dis_AmountDepositedFileUpload = '';
            this.buildingdetails.AmountDepositedFileUploadPath = '';
          }
          else if (Type == 'OtherFixedAssetsAndSecuritiesFileUpload') {
            this.isValidOtherFixedAssetsAndSecuritiesFileUpload = true;
            this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload = '';
            this.buildingdetails.Dis_OtherFixedAssetsAndSecuritiesFileUpload = '';
            this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUploadPath = '';
          }
          else if (Type == 'GATEYearBalanceSecretFileUpload') {
            this.isValidGATEYearBalanceSecretFileUpload = true;
            this.buildingdetails.GATEYearBalanceSecretFileUpload = '';
            this.buildingdetails.Dis_GATEYearBalanceSecretFileUpload = '';
            this.buildingdetails.GATEYearBalanceSecretFileUploadPath = '';
          }
          else if (Type == 'OtherFinancialResourcesFileUpload') {
            this.isValidOtherFinancialResourcesFileUpload = true;
            this.buildingdetails.OtherFinancialResourcesFileUpload = '';
            this.buildingdetails.Dis_OtherFinancialResourcesFileUpload = '';
            this.buildingdetails.OtherFinancialResourcesFileUploadPath = '';
          }
          return
        }
      }
      else {
        this.ImageValidationMessage = 'Select Only xlsx/xls/pdf file';
        if (Type == 'TotalProjectCostFileUpload') {
          this.isValidTotalProjectCostFileUpload = true;
          this.buildingdetails.TotalProjectCostFileUpload = '';
          this.buildingdetails.Dis_TotalProjectCostFileUpload = '';
          this.buildingdetails.TotalProjectCostFileUploadPath = '';
        }
        else if (Type == 'SourceCostAmountFileUpload') {
          this.isValidSourceCostAmountFileUpload = true;
          this.buildingdetails.SourceCostAmountFileUpload = '';
          this.buildingdetails.Dis_SourceCostAmountFileUpload = '';
          this.buildingdetails.SourceCostAmountFileUploadPath = '';
        }
        else if (Type == 'AmountDepositedFileUpload') {
          this.isValidAmountDepositedFileUpload = true;
          this.buildingdetails.AmountDepositedFileUpload = '';
          this.buildingdetails.Dis_AmountDepositedFileUpload = '';
          this.buildingdetails.AmountDepositedFileUploadPath = '';
        }
        else if (Type == 'OtherFixedAssetsAndSecuritiesFileUpload') {
          this.isValidOtherFixedAssetsAndSecuritiesFileUpload = true;
          this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload = '';
          this.buildingdetails.Dis_OtherFixedAssetsAndSecuritiesFileUpload = '';
          this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUploadPath = '';
        }
        else if (Type == 'GATEYearBalanceSecretFileUpload') {
          this.isValidGATEYearBalanceSecretFileUpload = true;
          this.buildingdetails.GATEYearBalanceSecretFileUpload = '';
          this.buildingdetails.Dis_GATEYearBalanceSecretFileUpload = '';
          this.buildingdetails.GATEYearBalanceSecretFileUploadPath = '';
        }
        else if (Type == 'OtherFinancialResourcesFileUpload') {
          this.isValidOtherFinancialResourcesFileUpload = true;
          this.buildingdetails.OtherFinancialResourcesFileUpload = '';
          this.buildingdetails.Dis_OtherFinancialResourcesFileUpload = '';
          this.buildingdetails.OtherFinancialResourcesFileUploadPath = '';
        }
        return
      }

      this.file = event.target.files[0];
      this.fileUploadService.UploadDocument(this.file).then((data: any) => {

        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
     
          if (Type == 'TotalProjectCostFileUpload') {
            this.buildingdetails.TotalProjectCostFileUpload = data['Data'][0]["FileName"];
            this.buildingdetails.Dis_TotalProjectCostFileUpload = data['Data'][0]["Dis_FileName"];
            this.buildingdetails.TotalProjectCostFileUploadPath = data['Data'][0]["FilePath"];
          }
          else if (Type == 'SourceCostAmountFileUpload') {
            this.buildingdetails.SourceCostAmountFileUpload = data['Data'][0]["FileName"];
            this.buildingdetails.Dis_SourceCostAmountFileUpload = data['Data'][0]["Dis_FileName"];
            this.buildingdetails.SourceCostAmountFileUploadPath = data['Data'][0]["FilePath"];
          }
          else if (Type == 'AmountDepositedFileUpload') {
            this.buildingdetails.AmountDepositedFileUpload = data['Data'][0]["FileName"];
            this.buildingdetails.Dis_AmountDepositedFileUpload = data['Data'][0]["Dis_FileName"];
            this.buildingdetails.AmountDepositedFileUploadPath = data['Data'][0]["FilePath"];
          }
          else if (Type == 'OtherFixedAssetsAndSecuritiesFileUpload') {
            this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload = data['Data'][0]["FileName"];
            this.buildingdetails.Dis_OtherFixedAssetsAndSecuritiesFileUpload = data['Data'][0]["Dis_FileName"];
            this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUploadPath = data['Data'][0]["FilePath"];
          }
          else if (Type == 'GATEYearBalanceSecretFileUpload') {
            this.buildingdetails.GATEYearBalanceSecretFileUpload = data['Data'][0]["FileName"];
            this.buildingdetails.Dis_GATEYearBalanceSecretFileUpload = data['Data'][0]["Dis_FileName"];
            this.buildingdetails.GATEYearBalanceSecretFileUploadPath = data['Data'][0]["FilePath"];
          }
          else if (Type == 'OtherFinancialResourcesFileUpload') {
            this.buildingdetails.OtherFinancialResourcesFileUpload = data['Data'][0]["FileName"];
            this.buildingdetails.Dis_OtherFinancialResourcesFileUpload = data['Data'][0]["Dis_FileName"];
            this.buildingdetails.OtherFinancialResourcesFileUploadPath = data['Data'][0]["FilePath"];
          }
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
    }
  }
  DescriptionDeleteImage(Type: string) {    
    if (Type == 'TotalProjectCostFileUpload') {
      this.buildingdetails.TotalProjectCostFileUpload = '';
      this.buildingdetails.Dis_TotalProjectCostFileUpload = '';
      this.buildingdetails.TotalProjectCostFileUploadPath = '';
    }
    else if (Type == 'SourceCostAmountFileUpload') {
      this.buildingdetails.SourceCostAmountFileUpload = '';
      this.buildingdetails.Dis_SourceCostAmountFileUpload = '';
      this.buildingdetails.SourceCostAmountFileUploadPath = '';
    }
    else if (Type == 'AmountDepositedFileUpload') {
      this.buildingdetails.AmountDepositedFileUpload = '';
      this.buildingdetails.Dis_AmountDepositedFileUpload = '';
      this.buildingdetails.AmountDepositedFileUploadPath = '';
    }
    else if (Type == 'OtherFixedAssetsAndSecuritiesFileUpload') {
      this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload = '';
      this.buildingdetails.Dis_OtherFixedAssetsAndSecuritiesFileUpload = '';
      this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUploadPath = '';
    }
    else if (Type == 'GATEYearBalanceSecretFileUpload') {
      this.buildingdetails.GATEYearBalanceSecretFileUpload = '';
      this.buildingdetails.Dis_GATEYearBalanceSecretFileUpload = '';
      this.buildingdetails.GATEYearBalanceSecretFileUploadPath = '';
    }
    else if (Type == 'OtherFinancialResourcesFileUpload') {
      this.buildingdetails.OtherFinancialResourcesFileUpload = '';
      this.buildingdetails.Dis_OtherFinancialResourcesFileUpload = '';
      this.buildingdetails.OtherFinancialResourcesFileUploadPath = '';
    }
  }
 
  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {
      this.clipboard.copy(tabellist.innerText);
    }
  }
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.lstBuildingDetails.length > 0) {
      try {
        this.isLoadingExport = true;
        this.downloadingPDF = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        //ws['!cols'] = [];
        //ws['!cols'][0] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "BuildingDetailsMaster.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }
  }
  @ViewChild('content') content: ElementRef | any;
  btnSavePDF_Click(): void {
    this.downloadingPDF = true;
    this.loaderService.requestStarted();
    if (this.lstBuildingDetails.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);

        doc.text("Building Details Master", 100, 10, { align: 'center', maxWidth: 100 });
        autoTable(doc, {
          html: '#tabellist'
          , styles: { fontSize: 8 },
          headStyles: {
            fillColor: '#3f51b5',
            textColor: '#fff',
            halign: 'center'

          },
          bodyStyles: {
            halign: 'center'
          },
          margin: {
            left: 5,
            right: 5,
            top: 15
          },
          tableLineWidth: 0

        })
        doc.save("BuildingDetailsMaster" + '.pdf');
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }

  }
}
