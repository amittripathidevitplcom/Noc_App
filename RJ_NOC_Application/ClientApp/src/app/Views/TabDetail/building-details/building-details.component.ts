//import { Component, OnInit } from '@angular/core';
//import * as $ from'jquery'
import { ChangeDetectorRef, Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BuildingDetailsDataModel, DocuemntBuildingDetailsDataModel } from '../../../Models/TabDetailDataModel';
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
import { GlobalConstants } from '../../../Common/GlobalConstants';


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
  public BuildingCollegeAddress: any = [];
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
  public IstxtBuildingHostel: boolean = false;
  public isValidOwnBuildingFileUpload: boolean = false;
  public isValidRentAgreementFileUpload: boolean = false;
  public RentAggrementDocShow: boolean = false;
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
  public SampleDocument: string = '';
  public RangeType: string = '';

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
  public Owin_RentDocTitle: any = '';


  constructor(private buildingDetailsMasterService: BuildingDetailsMasterService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute,
    private routers: Router, private cdRef: ChangeDetectorRef, private clipboard: Clipboard) { }


  init() {
    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }
  ngOnInit(): void {
    this.Owin_RentDocTitle = 'Certificate of Own Building in own land in same campus Order No. & Order Date :'
    this.buildingdetailsForm = this.formBuilder.group(
      {
        rdBuildingType: ['', Validators.required],
        txtOwnerName: ['', Validators.required],
        txtAddressLine1_Owner: ['', Validators.required],
        txtAddressLine2_Owner: [''],
        rbRuralUrban_Owner: ['', Validators.required],
        ddlDivisionID_Owner: ['', [DropdownValidators]],
        ddlDistrictID_Owner: ['', [DropdownValidators]],
        ddlTehsilID_Owner: [''],
        ddlPanchayatSamitiID_Owner: [''],
        txtCityTownVillage_Owner: ['', Validators.required],
        txtPincode_Owner: ['', [Validators.required]],
        txtContactNo_Owner: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
        txtBuildingHostelQuartersRoadArea: ['', [Validators.required, Validators.min(1)]],
        txtFromDate: ['', Validators.required],
        txtFireNOCOrderNumber: ['', Validators.required],
        txtToDate: ['', Validators.required],
        txtFireNOCUpload: [''],
        txtOrderNo: ['', Validators.required],
        txtOrderDate: ['', Validators.required],
        txtExpiringOn: ['', Validators.required],
        txtPWDNOCFileUpload: [''],
        txtRentAgreementFileUpload: [''],

        txtOwnBuildingOrderNo: ['', [Validators.required]],
        txtOwnBuildingOrderDate: ['', [Validators.required]],

        //txtTotalProjectCost: ['', [Validators.required]],
        //txtSourceCostAmount: ['', [Validators.required]],
        //txtAmountDeposited: ['', [Validators.required]],
        //txtOtherFixedAssetsAndSecurities: ['', [Validators.required]],
        //txtGATEYearBalanceSecret: ['', [Validators.required]],
        //txtOtherFinancialResources: ['', [Validators.required]],

        txtTotalProjectCost: [''],
        txtSourceCostAmount: [''],
        txtAmountDeposited: [''],
        txtOtherFixedAssetsAndSecurities: [''],
        txtGATEYearBalanceSecret: [''],
        txtOtherFinancialResources: [''],
        TotalProjectCostFileUpload: [''],
        SourceCostAmountFileUpload: [''],
        AmountDepositedFileUpload: [''],
        OtherFixedAssetsAndSecuritiesFileUpload: [''],
        GATEYearBalanceSecretFileUpload: [''],
        OtherFinancialResourcesFileUpload: [''],
        txtOwnBuildingUpload: [''],
        Rentvaliditydate: [''],

        txtsearchText: [''],
      })

    this.buildingdetails.CollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    if (this.SelectedDepartmentID == 3) {
      this.SampleDocument = GlobalConstants.ImagePathURL + "BuildingDetailsAnn13.pdf";
      this.RangeType = 'in Sq. Ft'
    }

    else if (this.SelectedDepartmentID == 2) {
      this.SampleDocument = '';
      this.RangeType = 'in Sq. Meter'
    }
    else {
      this.SampleDocument = '';
      this.RangeType = 'in Sq. Ft'
    }


    this.buildingdetails.lstBuildingDocDetails = [];
    this.GetBuildingTypeCheck();
    this.GetBuildingUploadDetails(this.SelectedDepartmentID);
    this.GetDivisionList();
    this.GetAllBuildingDetailsList();
    //this.CollegeAddressOnAutoPopulateOnPageload();
    this.ActiveStatus = true;
    s
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

  changeBuildingType(BuildingType: any) {
    if (BuildingType == 'Owned') {
      this.RentAggrementDocShow = false;
      this.Owin_RentDocTitle = 'Certificate of Own Building in own land in same campus Order No. & Order Date :'
    }
    else {
      this.RentAggrementDocShow = true;
      this.Owin_RentDocTitle = 'Certificate of Land & Rented Building in same "Tehsil" Order No. & Order Date : '
    }
  }
  async GetBuildingTypeCheck() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetBuildingTypeCheck(this.SelectedDepartmentID)
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
  async GetBuildingUploadDetails(SelectedDepartmentID: number) {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetBuildingUploadDetails(SelectedDepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.buildingdetails.lstBuildingDocDetails = data['Data'];

          //console.log("this.lstBuildingDocDetails");
          console.log(this.buildingdetails.lstBuildingDocDetails);
          //console.log("this.lstBuildingDocDetails");
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
    this.IstxtBuildingHostel = false;
    this.isValidOwnBuildingFileUpload = false;
    this.isValidRentAgreementFileUpload = false;
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
    if (this.buildingdetails.BuildingHostelQuartersRoadArea <= 0 || (this.buildingdetails.BuildingHostelQuartersRoadArea).toString() == "") {
      this.IstxtBuildingHostel = true;
      return;
    }
    if (this.SelectedDepartmentID == 2) {
      if (this.buildingdetails.BuildingHostelQuartersRoadArea < 1200) {
        this.toastr.warning("Total building area should be equal to or more than 1200 Sq. Meter.");
        return;
      }
    }

    if (this.RentAggrementDocShow) {
      if (this.buildingdetails.RentAgreementFileUpload == '') {
        this.ImageValidate = 'This field is required .!';
        return
      }
      if (this.buildingdetails.Rentvaliditydate == '') {
        return;
      }
    }

    if (this.buildingdetails.FireNOCFileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }
    if (this.buildingdetails.PWDNOCFileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }

    if (this.SelectedDepartmentID == 6) {
      if (this.buildingdetails.TotalProjectCost == '' || this.buildingdetails.TotalProjectCost == '0' || this.buildingdetails.TotalProjectCost == null) {
        this.ImageValidate = 'This field is required .!';
        return
      }
      if (this.buildingdetails.SourceCostAmount == '' || this.buildingdetails.SourceCostAmount == '0' || this.buildingdetails.SourceCostAmount == null) {
        this.ImageValidate = 'This field is required .!';
        return
      }
      if (this.buildingdetails.AmountDeposited == '' || this.buildingdetails.AmountDeposited == '0' || this.buildingdetails.AmountDeposited == null) {
        this.ImageValidate = 'This field is required .!';
        return
      }
      if (this.buildingdetails.OtherFixedAssetsAndSecurities == '' || this.buildingdetails.OtherFixedAssetsAndSecurities == '0' || this.buildingdetails.OtherFixedAssetsAndSecurities == null) {
        this.ImageValidate = 'This field is required .!';
        return
      }
      if (this.buildingdetails.GATEYearBalanceSecret == '' || this.buildingdetails.GATEYearBalanceSecret == '0' || this.buildingdetails.GATEYearBalanceSecret == null) {
        this.ImageValidate = 'This field is required .!';
        return
      }
      if (this.buildingdetails.OtherFinancialResources == '' || this.buildingdetails.OtherFinancialResources == '0' || this.buildingdetails.OtherFinancialResources == null) {
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
            //this.GetBuildingUploadDetails(this.SelectedDepartmentID);
            //this.GetAllBuildingDetailsList();
            //this.CollegeAddressOnAutoPopulateOnPageload();
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

  async CollegeAddressOnAutoPopulateOnPageload() {
    try {
      this.loaderService.requestStarted();
      this.buildingdetails.AddressLine1 = this.BuildingCollegeAddress[0]["AddressLine1"];
      this.buildingdetails.AddressLine2 = this.BuildingCollegeAddress[0]["AddressLine2"];
      this.buildingdetails.RuralUrban = this.BuildingCollegeAddress[0]["RuralUrban"];
      this.buildingdetails.DivisionID = this.BuildingCollegeAddress[0]["DivisionID"];
      this.FillDivisionRelatedDDL(null, this.buildingdetails.DivisionID);
      this.buildingdetails.DistrictID = this.BuildingCollegeAddress[0]["DistrictID"];

      if (this.buildingdetails.RuralUrban == 'Rural') {
        this.IsRural = true;
        this.FillDistrictRelatedDDL(null, this.buildingdetails.DistrictID);
        this.buildingdetails.TehsilID = this.BuildingCollegeAddress[0]["TehsilID"];
        this.buildingdetails.PanchayatSamitiID = this.BuildingCollegeAddress[0]["PanchayatSamitiID"];
      }
      else {
        this.IsRural = false;
      }
      this.buildingdetails.CityTownVillage = this.BuildingCollegeAddress[0]["CityTownVillage"];
      this.buildingdetails.ContactNo = this.BuildingCollegeAddress[0]["MobileNumber"];
      this.buildingdetails.Pincode = this.BuildingCollegeAddress[0]["Pincode"];
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
          this.changeBuildingType(data['Data'][0]['data']['Table'][0]["BuildingTypeName"]);
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
          this.buildingdetails.BuildingHostelQuartersRoadArea = data['Data'][0]['data']['Table'][0]["BuildingHostelQuartersRoadArea"];
          this.buildingdetails.RentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["RentAgreementFileUpload"];
          this.buildingdetails.Dis_RentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["Dis_RentAgreementFileUpload"];
          this.buildingdetails.RentAgreementFileUploadPath = data['Data'][0]['data']['Table'][0]["RentAgreementFileUploadPath"];

          this.buildingdetails.FireNOCOrderNumber = data['Data'][0]['data']['Table'][0]["FireNOCOrderNumber"];
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
          this.buildingdetails.Rentvaliditydate = data['Data'][0]['data']['Table'][0]["Rentvaliditydate"];
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
             // this.CollegeAddressOnAutoPopulateOnPageload();
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
          this.BuildingCollegeAddress = data['Data'][0]['data']['Table2'];
          this.CollegeAddressOnAutoPopulateOnPageload();
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
    this.buildingdetails.RentAgreementFileUpload = '';
    this.buildingdetails.BuildingHostelQuartersRoadArea = 0;
    this.buildingdetails.OrderNo = '';
    this.buildingdetails.OrderDate = '';
    this.buildingdetails.FireNOCOrderNumber = '';
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
    this.buildingdetails.TotalProjectCost = '';
    this.buildingdetails.SourceCostAmount = '';
    this.buildingdetails.AmountDeposited = '';
    this.buildingdetails.OtherFixedAssetsAndSecurities = '';
    this.buildingdetails.GATEYearBalanceSecret = '';
    this.buildingdetails.OtherFinancialResources = '';
    this.buildingdetails.TotalProjectCostFileUpload = '';
    this.buildingdetails.Dis_TotalProjectCostFileUpload = '';
    this.buildingdetails.TotalProjectCostFileUploadPath = '';
    this.buildingdetails.ExpiringOn = '';
    this.buildingdetails.DivisionID = 0;
    this.buildingdetails.DistrictID = 0;
    this.buildingdetails.PanchayatSamitiID = 0;
    this.buildingdetails.CityTownVillage = '';
    this.buildingdetails.ContactNo = '';
    this.buildingdetails.Rentvaliditydate = '';
    this.OwnBuildingFileUpload = false;
    this.RentAggrementDocShow = false;
    this.isValidRentAgreementFileUpload = false;
    this.FireNOCFileUpload = false;
    this.PWDNOCFileUpload = false;
    this.buildingdetails.UserID = 0;
    this.buildingdetails.ActiveStatus = false;
    this.isDisabledGrid = false;
    this.DeleteImage("All");
    this.DescriptionDeleteImage("All");
    this.buildingdetails.lstBuildingDocDetails = [];
    this.GetBuildingUploadDetails(this.SelectedDepartmentID);
    this.GetAllBuildingDetailsList();
    //this.CollegeAddressOnAutoPopulateOnPageload();
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
    try {
      this.loaderService.requestStarted();
      this.IsRural = isRural;
      this.buildingdetails.TehsilID = 0;
      this.buildingdetails.PanchayatSamitiID = 0;
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

      await this.fileUploadService.DeleteDocument(item.FileName).then((data: any) => {

        this.State = data['State'];

        this.SuccessMessage = data['SuccessMessage'];

        this.ErrorMessage = data['ErrorMessage'];

        if (this.State == 0) {
          item.FileName = '';
          item.FilePath = '';
          item.Dis_FileName = '';
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
  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  async ValidateUploadImage(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.isValidOwnBuildingFileUpload = false;
      this.isValidFireNOCFileUpload = false;
      this.isValidPWDNOCFileUpload = false;
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'application/pdf') {
          if (event.target.files[0].size > 2000000) {
            this.ImageValidationMessage = 'Select less then 2MB File';
            this.SetResetFile(Type, true, '', '', '')
            return
          }
          if (event.target.files[0].size < 100000) {
            this.ImageValidationMessage = 'Select more then 100kb File';
            this.SetResetFile(Type, true, '', '', '')
            return
          }
        }
        else {
          this.ImageValidationMessage = 'Select Only pdf file';
          this.SetResetFile(Type, true, '', '', '')
          return
        }

        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.SetResetFile(Type, false, data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"])
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
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 500);
    }
  }
  async DeleteImage(Type: string) {
    try {
      this.loaderService.requestStarted();
      if (Type == 'OwnBuildingFileUpload' || Type == 'All') {
        //this.showOwnBuildingFileUpload = false;
        this.buildingdetails.OwnBuildingFileUpload = '';
        this.buildingdetails.Dis_OwnBuildingFileUpload = '';
        this.buildingdetails.OwnBuildingFileUploadPath = '';
        this.file = document.getElementById('txtOwnBuildingUpload');
        this.file.value = '';
      }
      else if (Type == 'RentAgreementFileUpload' || Type == 'All') {
        // this.isValidRentAgreementFileUpload = true;
        this.buildingdetails.RentAgreementFileUpload = '';
        this.buildingdetails.Dis_RentAgreementFileUpload = '';
        this.buildingdetails.RentAgreementFileUploadPath = '';
        this.file = document.getElementById('txtRentAgreementFileUpload');
        this.file.value = '';
      }
      else if (Type == 'FireNOCFileUpload' || Type == 'All') {
        //this.showFireNOCFileUpload = false;
        this.buildingdetails.FireNOCFileUpload = '';
        this.buildingdetails.Dis_FireNOCFileUpload = '';
        this.buildingdetails.FireNOCFileUploadPath = '';
        this.file = document.getElementById('txtFireNOCUpload');
        this.file.value = '';
      }
      else if (Type == 'PWDNOCFileUpload' || Type == 'All') {
        //this.showPWDNOCFileUpload = false;
        this.buildingdetails.PWDNOCFileUpload = '';
        this.buildingdetails.Dis_PWDNOCFileUpload = '';
        this.buildingdetails.PWDNOCFileUploadPath = '';
        this.file = document.getElementById('txtPWDNOCFileUpload');
        this.file.value = '';
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

  async SetResetFile(Type: string, isShow: boolean, fileName: string, filePath: string, dis_Name: string) {
    if (Type == 'OwnBuildingFileUpload') {
      this.isValidOwnBuildingFileUpload = isShow;
      this.buildingdetails.OwnBuildingFileUpload = fileName;
      this.buildingdetails.Dis_OwnBuildingFileUpload = dis_Name;
      this.buildingdetails.OwnBuildingFileUploadPath = filePath;
    }
    else if (Type == 'RentAgreementFileUpload') {
      this.isValidRentAgreementFileUpload = isShow;
      this.buildingdetails.RentAgreementFileUpload = fileName;
      this.buildingdetails.Dis_RentAgreementFileUpload = dis_Name;
      this.buildingdetails.RentAgreementFileUploadPath = filePath;
    }
    else if (Type == 'FireNOCFileUpload') {
      this.isValidFireNOCFileUpload = isShow;
      this.buildingdetails.FireNOCFileUpload = fileName;
      this.buildingdetails.Dis_FireNOCFileUpload = dis_Name;
      this.buildingdetails.FireNOCFileUploadPath = filePath;
    }
    else if (Type == 'PWDNOCFileUpload') {
      this.isValidPWDNOCFileUpload = isShow;
      this.buildingdetails.PWDNOCFileUpload = fileName;
      this.buildingdetails.Dis_PWDNOCFileUpload = dis_Name;
      this.buildingdetails.PWDNOCFileUploadPath = filePath;
    }
  }

  async DescriptionValidateUploadImage(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
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
            this.DescriptionSetResetFile(Type, true, '', '', '')

            return
          }
          if (event.target.files[0].size < 100000) {
            this.ImageValidationMessage = 'Select more then 100kb File';
            this.DescriptionSetResetFile(Type, true, '', '', '')

            return
          }
        }
        else {
          this.ImageValidationMessage = 'Select Only xlsx/xls/pdf file';
          this.DescriptionSetResetFile(Type, true, '', '', '')

          return
        }

        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.DescriptionSetResetFile(Type, false, data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"])

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
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async DescriptionSetResetFile(Type: string, isShow: boolean, fileName: string, filePath: string, dis_Name: string) {
    if (Type == 'TotalProjectCostFileUpload') {
      this.isValidTotalProjectCostFileUpload = isShow;
      this.buildingdetails.TotalProjectCostFileUpload = fileName;
      this.buildingdetails.Dis_TotalProjectCostFileUpload = dis_Name;
      this.buildingdetails.TotalProjectCostFileUploadPath = filePath;
    }
    else if (Type == 'SourceCostAmountFileUpload') {
      this.isValidSourceCostAmountFileUpload = isShow;
      this.buildingdetails.SourceCostAmountFileUpload = fileName;
      this.buildingdetails.Dis_SourceCostAmountFileUpload = dis_Name;
      this.buildingdetails.SourceCostAmountFileUploadPath = filePath;
    }
    else if (Type == 'AmountDepositedFileUpload') {
      this.isValidAmountDepositedFileUpload = isShow;
      this.buildingdetails.AmountDepositedFileUpload = fileName;
      this.buildingdetails.Dis_AmountDepositedFileUpload = dis_Name;
      this.buildingdetails.AmountDepositedFileUploadPath = filePath;
    }
    else if (Type == 'OtherFixedAssetsAndSecuritiesFileUpload') {
      this.isValidOtherFixedAssetsAndSecuritiesFileUpload = isShow;
      this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload = fileName;
      this.buildingdetails.Dis_OtherFixedAssetsAndSecuritiesFileUpload = dis_Name;
      this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUploadPath = filePath;
    }
    else if (Type == 'GATEYearBalanceSecretFileUpload') {
      this.isValidGATEYearBalanceSecretFileUpload = isShow;
      this.buildingdetails.GATEYearBalanceSecretFileUpload = fileName;
      this.buildingdetails.Dis_GATEYearBalanceSecretFileUpload = dis_Name;
      this.buildingdetails.GATEYearBalanceSecretFileUploadPath = filePath;
    }
    else if (Type == 'OtherFinancialResourcesFileUpload') {
      this.isValidOtherFinancialResourcesFileUpload = isShow;
      this.buildingdetails.OtherFinancialResourcesFileUpload = fileName;
      this.buildingdetails.Dis_OtherFinancialResourcesFileUpload = dis_Name;
      this.buildingdetails.OtherFinancialResourcesFileUploadPath = filePath;
    }
  }
  async DescriptionDeleteImage(Type: string) {
    try {
      this.loaderService.requestStarted();
      if (Type == 'TotalProjectCostFileUpload' || Type == 'All') {
        this.buildingdetails.TotalProjectCostFileUpload = '';
        this.buildingdetails.Dis_TotalProjectCostFileUpload = '';
        this.buildingdetails.TotalProjectCostFileUploadPath = '';
        this.file = document.getElementById('TotalProjectCostFileUpload');
        this.file.value = '';
      }
      else if (Type == 'SourceCostAmountFileUpload' || Type == 'All') {
        this.buildingdetails.SourceCostAmountFileUpload = '';
        this.buildingdetails.Dis_SourceCostAmountFileUpload = '';
        this.buildingdetails.SourceCostAmountFileUploadPath = '';
        this.file = document.getElementById('SourceCostAmountFileUpload');
        this.file.value = '';
      }
      else if (Type == 'AmountDepositedFileUpload' || Type == 'All') {
        this.buildingdetails.AmountDepositedFileUpload = '';
        this.buildingdetails.Dis_AmountDepositedFileUpload = '';
        this.buildingdetails.AmountDepositedFileUploadPath = '';
        this.file = document.getElementById('AmountDepositedFileUpload');
        this.file.value = '';
      }
      else if (Type == 'OtherFixedAssetsAndSecuritiesFileUpload' || Type == 'All') {
        this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload = '';
        this.buildingdetails.Dis_OtherFixedAssetsAndSecuritiesFileUpload = '';
        this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUploadPath = '';
        this.file = document.getElementById('OtherFixedAssetsAndSecuritiesFileUpload');
        this.file.value = '';
      }
      else if (Type == 'GATEYearBalanceSecretFileUpload' || Type == 'All') {
        this.buildingdetails.GATEYearBalanceSecretFileUpload = '';
        this.buildingdetails.Dis_GATEYearBalanceSecretFileUpload = '';
        this.buildingdetails.GATEYearBalanceSecretFileUploadPath = '';
        this.file = document.getElementById('GATEYearBalanceSecretFileUpload');
        this.file.value = '';
      }
      else if (Type == 'OtherFinancialResourcesFileUpload' || Type == 'All') {
        this.buildingdetails.OtherFinancialResourcesFileUpload = '';
        this.buildingdetails.Dis_OtherFinancialResourcesFileUpload = '';
        this.buildingdetails.OtherFinancialResourcesFileUploadPath = '';
        this.file = document.getElementById('OtherFinancialResourcesFileUpload');
        this.file.value = '';
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
