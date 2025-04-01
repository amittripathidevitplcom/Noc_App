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
  holddata = new BuildingDetailsDataModel();
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
  public TehsilList_Owner: any = [];
  public PanchyatSamitiList_Owner: any = [];

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

  public ImageValidate: string = 'This field is required .!';
  public CssClass_TextDangerWidth: string = '';
  public CssClass_TextDangerLength: string = '';
  public IstxtBuildingHostel: boolean = false;
  public isValidOwnBuildingFileUpload: boolean = false;
  public isValidRentAgreementFileUpload: boolean = false;
  public isValidbuildingOtherDoc2FileUpload: boolean = false;
  public isValidbuildingOtherDoc1FileUpload: boolean = false;
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
  public buildAddressShowHide: boolean = true;
  public CityID: number = 0;
  public CityName: string = '';
  public CityList: any = [];
  public lstMGOneIstheCampusUnitaryChk: any = [];
  IsThecampusUnitary: boolean = false;

  public QueryStringStatus: any = '';
  public SelectedApplyNOCID: number = 0;
  public SearchRecordID: string = '';
  public ResidentialDivisionList: any = [];
  public ResidentialDistrictList_Owner: any = [];
  public ResidentialTehsilList_Owner: any = [];
  public ResidentialCityList: any = [];
  public ResidentialPanchyatSamitiList_Owner: any = [];
  public ResidentialbuildAddressShowHide: boolean = true;
  IsRural_ResidentialOwner: boolean = true;
  IsRuralResidential: boolean = false;
  public ResidentialRentAggrementDocShow: boolean = false;
  public lstResidentialBuildingTypeChk: any = [];
  public onChangeEvent: string=''
  public onBuildingChangeEvent: string=''
  constructor(private buildingDetailsMasterService: BuildingDetailsMasterService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute,
    private routers: Router, private cdRef: ChangeDetectorRef, private clipboard: Clipboard) { }


  init() {
    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }
  async ngOnInit() {
    this.Owin_RentDocTitle = 'Certificate of Own Building in own land in same campus Order No. & Order Date :'
    this.buildingdetailsForm = this.formBuilder.group(
      {
        rdBuildingType: ['', Validators.required],
        txtOwnerName: [''],
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
        txtContactNo_Owner: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
        // txtBuildingHostelQuartersRoadArea: ['', [Validators.required, Validators.min(1)]],
        txtBuildingHostelQuartersRoadArea: [''],
        txtFromDate: ['', Validators.required],//, Validators.required
        txtFireNOCOrderNumber: ['', Validators.required],//, Validators.required
        txtToDate: ['', Validators.required],//, Validators.required
        txtFireNOCUpload: [''],
        txtOrderNo: ['', Validators.required],
        txtOrderDate: ['', Validators.required],
        txtExpiringOn: ['', Validators.required],
        txtPWDNOCFileUpload: [''],
        txtRentAgreementFileUpload: [''],
        txtbuildingOtherDoc2FileUpload: [''],
        txtbuildingOtherDoc1FileUpload: [''],

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
        txtdistance: [''],
        rdMGOneIstheCampusUnitary: [''],

        //residantel
        ResidentialBuildingTypeID: ['', Validators.required],
        rdMGOneResidentialIstheCampusUnitary: [''],
        txtResidentialdistance: [''],
        txtResidentialOwnerName: [''],
        txtResidentialAddressLine1_Owner: ['', Validators.required],
        txtResidentialAddressLine2_Owner: ['', Validators.required],
        rbResidentialRuralUrban_Owner: ['', Validators.required],
        ddlResidentialDivisionID_Owner: ['', [DropdownValidators]],
        ddlResidentialDistrictID_Owner: ['', [DropdownValidators]],
        ddlResidentialTehsilID_Owner: ['', [DropdownValidators]],
        ddlResidentialCityID: [''],
        ddlResidentialPanchayatSamitiID_Owner: [''],
        txtResidentialCityTownVillage_Owner: ['', Validators.required],
        txtResidentialContactNo_Owner: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
        txtResidentialPincode_Owner: ['', Validators.required],
        txtResidentialBuildingHostelQuartersRoadArea: [''],
        txtResidentialbuildingOtherDoc1FileUpload: [''],
        txtResidentialbuildingOtherDoc2FileUpload: [''],
        txtResidentialRentAgreementFileUpload: [''],
        ResidentialRentvaliditydate: [''],
        txtNameoftheAuthority: ['', Validators.required],
        txtAuthorityDateApproval: ['', Validators.required],
        txtAuthoritybuildingOtherDoc1FileUpload: [''],
        rdMGOneDrainage: [''],
        txtBuildingUseNameoftheAuthority: ['', Validators.required],
        txtBuildingUseOrderNo: ['', Validators.required],
        txtBuildingUseDateApproval: ['', Validators.required],
        txtbuildingUseOtherDoc1FileUpload: [''],
        txtPollutionFromDateApproval: ['', Validators.required],
        txtvalidDateApproval: ['', Validators.required],
        txtPollutionbuildingOtherDoc1FileUpload: [''],
      })

    //this.buildingdetails.CollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.buildingdetails.CollegeID = data['Data']['CollegeID'];
          this.SelectedCollageID = data['Data']['CollegeID'];
          if (this.buildingdetails.CollegeID == null || this.buildingdetails.CollegeID == 0 || this.buildingdetails.CollegeID == undefined) {
            this.routers.navigate(['/draftapplicationlist']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }

    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();

    if (this.SelectedDepartmentID == 3) {
      this.SampleDocument = GlobalConstants.ImagePathURL + "LandTitleCertificateAnn13.pdf";
      this.RangeType = 'in Sq. Ft'
    }

    else if (this.SelectedDepartmentID == 2) {
      this.SampleDocument = '';
      this.RangeType = 'in Sq. Meter'
    }
    else if (this.SelectedDepartmentID == 4) {
      this.SampleDocument = '';
      this.RangeType = 'in Sq. Meter';
      this.Owin_RentDocTitle = '';
    }
    else if (this.SelectedDepartmentID == 6) {
      this.SampleDocument = '';
      this.RangeType = 'in Sq. Ft'
      this.Owin_RentDocTitle = 'Ownership Documents';
    }
    else if (this.SelectedDepartmentID == 1) {
      this.SampleDocument = '';
      this.RangeType = 'in hectare';
    }
    else {
      this.SampleDocument = '';
      this.RangeType = 'in Sq. Ft'
    }


    this.buildingdetails.lstBuildingDocDetails = [];
    await this.GetCollegeBasicDetails();
    this.GetBuildingTypeCheck();
    this.GetResidentialBuildingTypeCheck();
    this.GetBuildingUploadDetails(this.SelectedDepartmentID);
    this.GetDivisionList();
    await this.GetResidentialDivisionList();
    await this.GetAllBuildingDetailsList();
    //this.CollegeAddressOnAutoPopulateOnPageload();
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
  async changeBuildingType(BuildingType: any, IsChanged: boolean) {
    this.onBuildingChangeEvent = BuildingType;
    if (BuildingType == 'Owned') {
      this.RentAggrementDocShow = false;
      this.buildAddressShowHide = true;
      //this.IsRural = false;
      this.CollegeAddressOnAutoPopulateOnPageload();
    }
    else {
      this.RentAggrementDocShow = true;
      this.buildAddressShowHide = false;

      this.Owin_RentDocTitle = 'Certificate of Land & Rented Building in same "Tehsil" Order No. & Order Date : '

      if (this.buildingdetails.SchoolBuildingDetailsID > 0 && !IsChanged) {
        this.buildingdetails.AddressLine1 = this.holddata.AddressLine1;
        this.buildingdetails.AddressLine2 = this.holddata.AddressLine2;
        this.buildingdetails.RuralUrban = this.holddata.RuralUrban;
        await this.IsRuralOrUrban(this.buildingdetails.RuralUrban == 'Rural' ? true : false, '');
        this.buildingdetails.DivisionID = this.holddata.DivisionID;
        await this.FillDivisionRelatedDDL(null, this.buildingdetails.DivisionID);
        this.buildingdetails.DistrictID = this.holddata.DistrictID;
        await this.FillDistrictRelatedDDL(null, this.buildingdetails.DistrictID);
        this.buildingdetails.TehsilID = this.holddata.TehsilID;
        this.buildingdetails.CityID = this.holddata.CityID;
        this.buildingdetails.PanchayatSamitiID = this.holddata.PanchayatSamitiID;
        this.buildingdetails.CityTownVillage = this.holddata.CityTownVillage;
        this.buildingdetails.Pincode = this.holddata.Pincode;
      }
      else {
        this.buildingdetails.AddressLine1 = '';
        this.buildingdetails.AddressLine2 = '';
        this.buildingdetails.RuralUrban = '';
        this.buildingdetails.DivisionID = 0;
        this.buildingdetails.DistrictID = 0;
        this.buildingdetails.TehsilID = 0;
        this.buildingdetails.CityID = 0;
        this.buildingdetails.PanchayatSamitiID = 0;
        this.buildingdetails.CityTownVillage = '';
        this.buildingdetails.Pincode = '';
        this.DistrictList_Owner = [];
        this.TehsilList_Owner = [];
        this.PanchyatSamitiList_Owner = [];
        this.CityList = [];
      }
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
    debugger;
    this.IstxtBuildingHostel = false;
    this.isValidOwnBuildingFileUpload = false;
    this.isValidRentAgreementFileUpload = false;
    this.isValidbuildingOtherDoc1FileUpload = false;
    this.isValidbuildingOtherDoc2FileUpload = false;
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
    if (this.SelectedDepartmentID == 6||this.SelectedDepartmentID == 5) {
      this.buildingdetailsForm.get('txtFireNOCOrderNumber')?.setValidators([Validators.required]);
      this.buildingdetailsForm.get('txtFromDate')?.setValidators([Validators.required]);
      this.buildingdetailsForm.get('txtToDate')?.setValidators([Validators.required]);
      this.buildingdetailsForm.get('txtFireNOCOrderNumber')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtFromDate')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtToDate')?.updateValueAndValidity();
      //this.buildingdetailsForm.get('txtOwnBuildingOrderDate')?.clearValidators();
      this.buildingdetailsForm.get('txtOwnBuildingOrderDate')?.setValidators([Validators.required]);
      this.buildingdetailsForm.get('txtOwnBuildingOrderDate')?.updateValueAndValidity();
     
    }
    else {
      this.buildingdetailsForm.get('txtFireNOCOrderNumber')?.clearValidators();
      this.buildingdetailsForm.get('txtFromDate')?.clearValidators();
      this.buildingdetailsForm.get('txtToDate')?.clearValidators();
      this.buildingdetailsForm.get('txtFireNOCOrderNumber')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtFromDate')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtToDate')?.updateValueAndValidity();

    }
    if (this.SelectedDepartmentID == 4) {
      if (!this.IsGovtCollege) {
        this.buildingdetailsForm.get('txtOwnBuildingOrderNo')?.setValidators([Validators.required]);
        this.buildingdetailsForm.get('txtOwnBuildingOrderDate')?.setValidators([Validators.required]);
        //this.buildingdetailsForm.get('txtFireNOCOrderNumber')?.setValidators([Validators.required]);
        //this.buildingdetailsForm.get('txtFromDate')?.setValidators([Validators.required]);
        //this.buildingdetailsForm.get('txtToDate')?.setValidators([Validators.required]);
        this.buildingdetailsForm.get('txtOrderNo')?.setValidators([Validators.required]);
        this.buildingdetailsForm.get('txtOrderDate')?.setValidators([Validators.required]);
        this.buildingdetailsForm.get('txtExpiringOn')?.setValidators([Validators.required]);
      }
      else {
        this.buildingdetailsForm.get('txtOwnBuildingOrderNo')?.clearValidators();
        this.buildingdetailsForm.get('txtOwnBuildingOrderDate')?.clearValidators();
        //this.buildingdetailsForm.get('txtFireNOCOrderNumber')?.clearValidators();
        //this.buildingdetailsForm.get('txtFromDate')?.clearValidators();
        //this.buildingdetailsForm.get('txtToDate')?.clearValidators();
        this.buildingdetailsForm.get('txtOrderNo')?.clearValidators();
        this.buildingdetailsForm.get('txtOrderDate')?.clearValidators();
        this.buildingdetailsForm.get('txtExpiringOn')?.clearValidators();
      }
      this.buildingdetailsForm.get('txtOwnBuildingOrderNo')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtOwnBuildingOrderDate')?.updateValueAndValidity();
      //this.buildingdetailsForm.get('txtFireNOCOrderNumber')?.updateValueAndValidity();
      //this.buildingdetailsForm.get('txtFromDate')?.updateValueAndValidity();
      //this.buildingdetailsForm.get('txtToDate')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtOrderNo')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtOrderDate')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtExpiringOn')?.updateValueAndValidity();
    }

    if (this.SelectedDepartmentID == 5) {
      if (this.buildingdetails.MGOneIstheCampusUnitary == '') {
        this.isFormValid = false;
      }
      if (this.buildingdetails.MGOneIstheCampusUnitary == 'No' && this.buildingdetails.Distance < 0) {
        this.isFormValid = false;
      }
      
    }
    if (this.SelectedDepartmentID == 5) {
      this.buildingdetailsForm.get('txtOwnBuildingOrderDate')?.setValidators([Validators.required]);
      this.buildingdetailsForm.get('txtOwnBuildingOrderDate')?.updateValueAndValidity();
      if (this.buildingdetails.MGOneResidentialIstheCampusUnitary == '') {
        this.isFormValid = false;
      }
      if (this.buildingdetails.MGOneResidentialIstheCampusUnitary == 'No' && this.buildingdetails.ResidentialDistance < 0) {
        this.isFormValid = false;
      }      
      if (this.buildingdetails.MGOneDrainage == '') {
        this.isFormValid = false;
      }
    }
    if (this.SelectedDepartmentID == 5) {
      if (this.buildingdetails.MGOneIstheCampusUnitary == 'No') {        
        this.buildingdetailsForm.get('txtOwnerName')?.setValidators([Validators.required]);
        this.buildingdetailsForm.get('txtOwnerName')?.updateValueAndValidity();
      }
      else
      {
        
        this.buildingdetailsForm.get('txtOwnerName')?.clearValidators();       
        this.buildingdetailsForm.get('txtOwnerName')?.updateValueAndValidity();

      }
      if (this.buildingdetails.MGOneResidentialIstheCampusUnitary == 'No') {
        this.buildingdetailsForm.get('txtResidentialOwnerName')?.setValidators([Validators.required]);
        this.buildingdetailsForm.get('txtResidentialOwnerName')?.updateValueAndValidity();

      }
      else
      {
        this.buildingdetailsForm.get('txtResidentialOwnerName')?.clearValidators();
        this.buildingdetailsForm.get('txtResidentialPincode_Owner')?.clearValidators();
        this.buildingdetailsForm.get('txtResidentialCityTownVillage_Owner')?.clearValidators();
        this.buildingdetailsForm.get('txtResidentialAddressLine1_Owner')?.clearValidators();
        this.buildingdetailsForm.get('txtResidentialAddressLine2_Owner')?.clearValidators();
        this.buildingdetailsForm.get('rbResidentialRuralUrban_Owner')?.clearValidators();
        this.buildingdetailsForm.get('ddlResidentialTehsilID_Owner')?.clearValidators();
        this.buildingdetailsForm.get('ddlResidentialDivisionID_Owner')?.clearValidators();
        this.buildingdetailsForm.get('ddlResidentialDistrictID_Owner')?.clearValidators();
        this.buildingdetailsForm.get('txtResidentialContactNo_Owner')?.clearValidators();
        this.buildingdetailsForm.get('txtResidentialOwnerName')?.updateValueAndValidity();
        this.buildingdetailsForm.get('txtResidentialPincode_Owner')?.updateValueAndValidity();
        this.buildingdetailsForm.get('txtResidentialCityTownVillage_Owner')?.updateValueAndValidity();
        this.buildingdetailsForm.get('txtResidentialAddressLine1_Owner')?.updateValueAndValidity();
        this.buildingdetailsForm.get('txtResidentialAddressLine2_Owner')?.updateValueAndValidity();
        this.buildingdetailsForm.get('rbResidentialRuralUrban_Owner')?.updateValueAndValidity();
        this.buildingdetailsForm.get('ddlResidentialTehsilID_Owner')?.updateValueAndValidity();
        this.buildingdetailsForm.get('ddlResidentialDivisionID_Owner')?.updateValueAndValidity();
        this.buildingdetailsForm.get('ddlResidentialDistrictID_Owner')?.updateValueAndValidity();
        this.buildingdetailsForm.get('txtResidentialContactNo_Owner')?.updateValueAndValidity();
      }

    }
    if (this.SelectedDepartmentID != 5) {
      this.buildingdetailsForm.get('ResidentialBuildingTypeID')?.clearValidators();
      this.buildingdetailsForm.get('txtResidentialOwnerName')?.clearValidators();
      this.buildingdetailsForm.get('txtResidentialAddressLine1_Owner')?.clearValidators();   
      this.buildingdetailsForm.get('txtResidentialAddressLine2_Owner')?.clearValidators();
      this.buildingdetailsForm.get('rbResidentialRuralUrban_Owner')?.clearValidators();
      this.buildingdetailsForm.get('ddlResidentialDivisionID_Owner')?.clearValidators();
      this.buildingdetailsForm.get('ddlResidentialDistrictID_Owner')?.clearValidators();
      this.buildingdetailsForm.get('ddlResidentialTehsilID_Owner')?.clearValidators();
      this.buildingdetailsForm.get('ddlResidentialCityID')?.clearValidators();
      this.buildingdetailsForm.get('txtResidentialCityTownVillage_Owner')?.clearValidators();
      this.buildingdetailsForm.get('txtResidentialContactNo_Owner')?.clearValidators();
      this.buildingdetailsForm.get('txtResidentialPincode_Owner')?.clearValidators();
      this.buildingdetailsForm.get('txtNameoftheAuthority')?.clearValidators();
      this.buildingdetailsForm.get('txtAuthorityDateApproval')?.clearValidators();
      this.buildingdetailsForm.get('txtBuildingUseNameoftheAuthority')?.clearValidators();
      this.buildingdetailsForm.get('txtBuildingUseOrderNo')?.clearValidators();
      this.buildingdetailsForm.get('txtBuildingUseDateApproval')?.clearValidators();
      this.buildingdetailsForm.get('txtPollutionFromDateApproval')?.clearValidators();
      this.buildingdetailsForm.get('txtvalidDateApproval')?.clearValidators();     
      
      this.buildingdetailsForm.get('ResidentialBuildingTypeID')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtResidentialOwnerName')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtResidentialAddressLine1_Owner')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtResidentialAddressLine2_Owner')?.updateValueAndValidity();
      this.buildingdetailsForm.get('rbResidentialRuralUrban_Owner')?.updateValueAndValidity();
      this.buildingdetailsForm.get('ddlResidentialDivisionID_Owner')?.updateValueAndValidity();
      this.buildingdetailsForm.get('ddlResidentialDistrictID_Owner')?.updateValueAndValidity();
      this.buildingdetailsForm.get('ddlResidentialTehsilID_Owner')?.updateValueAndValidity();
      this.buildingdetailsForm.get('ddlResidentialCityID')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtResidentialCityTownVillage_Owner')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtResidentialContactNo_Owner')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtResidentialPincode_Owner')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtNameoftheAuthority')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtAuthorityDateApproval')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtBuildingUseNameoftheAuthority')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtBuildingUseOrderNo')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtBuildingUseDateApproval')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtPollutionFromDateApproval')?.updateValueAndValidity();
      this.buildingdetailsForm.get('txtvalidDateApproval')?.updateValueAndValidity();      
         
    }

    if (this.buildingdetailsForm.invalid) {
      console.log(this.buildingdetailsForm);
      this.isFormValid = false;
    }
    if (this.buildingdetails.RuralUrban == 'Rural') {
      if (this.buildingdetails.PanchayatSamitiID == 0) {
        this.IsPanchayatSamitirequried = true;
        this.isFormValid = false;
      }
    }
    else {
      if (this.buildingdetails.CityID == 0) {
        this.isFormValid = false;
      }
    }
    if (this.SelectedDepartmentID == 5) {
      if (this.buildingdetails.ResidentialRuralUrban == 'Rural') {
        if (this.buildingdetails.ResidentialPanchayatSamitiID == 0) {
          this.IsPanchayatSamitirequried = true;
          this.isFormValid = false;
        }
      }
      else {
        if (this.buildingdetails.ResidentialCityID == 0) {
          this.isFormValid = false;
        }
      }
    }
    
    if (this.buildingdetails.BuildingHostelQuartersRoadArea <= 0 || (this.buildingdetails.BuildingHostelQuartersRoadArea).toString() == "") {
      this.IstxtBuildingHostel = true;
      return;
    }
    if (this.SelectedDepartmentID == 2) {
      //if (this.buildingdetails.BuildingHostelQuartersRoadArea < 1200) {
      //  this.toastr.warning("Total building area should be equal to or more than 1200 Sq. Meter.");
      //  return;
      //}
      if (this.buildingdetails.buildingOtherDoc1FileUpload == '') {
        this.ImageValidate = 'This field is required .!';
        return
      }

      if (this.buildingdetails.buildingOtherDoc2FileUpload == '') {
        this.ImageValidate = 'This field is required .!';
        return
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
    if (this.SelectedDepartmentID==5) {
      if (this.ResidentialRentAggrementDocShow) {
        if (this.buildingdetails.ResidentialRentAgreementFileUpload == '') {
          this.ImageValidate = 'This field is required .!';
          return
        }
        if (this.buildingdetails.ResidentialRentvaliditydate == '') {
          return;
        }  
            
      }
      if (this.buildingdetails.AuthoritybuildingOtherDoc1FileUpload == '') {
        this.ImageValidate = 'This field is required .!';
        return
      }
      if (this.buildingdetails.buildingUseOtherDoc1FileUpload == '') {
        this.ImageValidate = 'This field is required .!';
        return
      }
      if (this.buildingdetails.PollutionbuildingOtherDoc1FileUpload == '') {
        this.ImageValidate = 'This field is required .!';
        return
      }

      
    }
    
    if (this.buildingdetails.OwnBuildingFileUpload == '' && !this.IsGovtCollege) {
      this.ImageValidate = 'This field is required .!';
      return
    }
    if (this.buildingdetails.FireNOCFileUpload == '' && !this.IsGovtCollege && this.SelectedDepartmentID == 6) {
      this.ImageValidate = 'This field is required .!';
      return
    }
    if (this.buildingdetails.PWDNOCFileUpload == '' && !this.IsGovtCollege) {
      this.ImageValidate = 'This field is required .!';
      return
    }

    //if (this.SelectedDepartmentID == 6) {
    //  if (this.buildingdetails.TotalProjectCost == '' || this.buildingdetails.TotalProjectCost == '0' || this.buildingdetails.TotalProjectCost == null) {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //  if (this.buildingdetails.SourceCostAmount == '' || this.buildingdetails.SourceCostAmount == '0' || this.buildingdetails.SourceCostAmount == null) {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //  if (this.buildingdetails.AmountDeposited == '' || this.buildingdetails.AmountDeposited == '0' || this.buildingdetails.AmountDeposited == null) {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //  if (this.buildingdetails.OtherFixedAssetsAndSecurities == '' || this.buildingdetails.OtherFixedAssetsAndSecurities == '0' || this.buildingdetails.OtherFixedAssetsAndSecurities == null) {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //  if (this.buildingdetails.GATEYearBalanceSecret == '' || this.buildingdetails.GATEYearBalanceSecret == '0' || this.buildingdetails.GATEYearBalanceSecret == null) {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //  if (this.buildingdetails.OtherFinancialResources == '' || this.buildingdetails.OtherFinancialResources == '0' || this.buildingdetails.OtherFinancialResources == null) {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //  if (this.buildingdetails.TotalProjectCostFileUpload == '') {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //  if (this.buildingdetails.SourceCostAmountFileUpload == '') {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //  if (this.buildingdetails.AmountDepositedFileUpload == '') {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //  if (this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload == '') {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //  if (this.buildingdetails.GATEYearBalanceSecretFileUpload == '') {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //  if (this.buildingdetails.OtherFinancialResourcesFileUpload == '') {
    //    this.ImageValidate = 'This field is required .!';
    //    return
    //  }
    //}
    const TotalRequriedDoc = this.buildingdetails.lstBuildingDocDetails.filter((x: { FileName: string, IsMandatory: boolean }) => x.FileName == '' && x.IsMandatory == true);
    if (TotalRequriedDoc.length > 0) {
      this.isFormValid = false;
    }
    if (!this.isFormValid) {
      return;
      console.log(this.isFormValid);
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
      await this.FillDivisionRelatedDDL(null, this.buildingdetails.DivisionID);
      this.buildingdetails.DistrictID = this.BuildingCollegeAddress[0]["DistrictID"];
      await this.FillDistrictRelatedDDL(null, this.buildingdetails.DistrictID);
      this.buildingdetails.TehsilID = this.BuildingCollegeAddress[0]["TehsilID"];
      if (this.buildingdetails.RuralUrban == 'Rural') {
        this.IsRural = true;
        this.buildingdetails.PanchayatSamitiID = this.BuildingCollegeAddress[0]["PanchayatSamitiID"];
      }
      else {
        this.IsRural = false;
        this.buildingdetails.CityID = this.BuildingCollegeAddress[0]["CityID"];
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
  async ViewBuildingDocument(SchoolBuildingDetailsID: number) {
    try {
      this.loaderService.requestStarted();
      await this.buildingDetailsMasterService.GetByID(SchoolBuildingDetailsID, this.UserID)
        .then((data: any) => {
          //data = JSON.parse(JSON.stringify(data));
          this.lstBuildingDocDetails = data['Data'][0]['data']['Table1'];

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async Edit_OnClick(SchoolBuildingDetailsID: number) {
    debugger;
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.buildingDetailsMasterService.GetByID(SchoolBuildingDetailsID, this.UserID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.buildingdetails.SchoolBuildingDetailsID = data['Data'][0]['data']['Table'][0]["SchoolBuildingDetailsID"];
          this.GetBuildingTypeCheck();
          this.buildingdetails.BuildingTypeID = data['Data'][0]['data']['Table'][0]["BuildingTypeID"];          
          this.buildingdetails.Distance = data['Data'][0]['data']['Table'][0]["Distance"];
          this.holddata.AddressLine1 = data['Data'][0]['data']['Table'][0]["AddressLine1"];
          this.holddata.AddressLine2 = data['Data'][0]['data']['Table'][0]["AddressLine2"];
          this.holddata.RuralUrban = data['Data'][0]['data']['Table'][0]["RuralUrban"];
          this.holddata.DivisionID = data['Data'][0]['data']['Table'][0]["DivisionID"];
          await this.FillDivisionRelatedDDL(null, this.holddata.DivisionID);
          this.holddata.DistrictID = data['Data'][0]['data']['Table'][0]["DistrictID"];
          await this.FillDistrictRelatedDDL(null, this.holddata.DistrictID);
          this.holddata.TehsilID = data['Data'][0]['data']['Table'][0]["TehsilID"];
          if (this.holddata.RuralUrban == 'Rural') {
            this.IsRural = true;
            this.holddata.PanchayatSamitiID = data['Data'][0]['data']['Table'][0]["PanchayatSamitiID"];
          }
          else {
            this.IsRural = false;
            this.holddata.CityID = data['Data'][0]['data']['Table'][0]["CityID"];
          }
          this.holddata.CityTownVillage = data['Data'][0]['data']['Table'][0]["CityTownVillage"];
          this.holddata.Pincode = data['Data'][0]['data']['Table'][0]["Pincode"];
          this.changeBuildingType(data['Data'][0]['data']['Table'][0]["BuildingTypeName"], false);
          this.buildingdetails.MGOneIstheCampusUnitary = data['Data'][0]['data']['Table'][0]["MGOneIstheCampusUnitary"];
          this.changeBuildingStatus(this.buildingdetails.MGOneIstheCampusUnitary);
          this.buildingdetails.OwnerName = data['Data'][0]['data']['Table'][0]["OwnerName"];


          this.buildingdetails.ContactNo = data['Data'][0]['data']['Table'][0]["ContactNo"];

          this.buildingdetails.OwnBuildingOrderNo = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderNo"];
          this.buildingdetails.OwnBuildingOrderDate = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderDate"];
          this.buildingdetails.OwnBuildingFileUpload = data['Data'][0]['data']['Table'][0]["OwnBuildingFileUpload"];
          this.buildingdetails.Dis_OwnBuildingFileUpload = data['Data'][0]['data']['Table'][0]["Dis_OwnBuildingFileUpload"];
          this.buildingdetails.OwnBuildingFileUploadPath = data['Data'][0]['data']['Table'][0]["OwnBuildingFileUploadPath"];
          this.buildingdetails.BuildingHostelQuartersRoadArea = data['Data'][0]['data']['Table'][0]["BuildingHostelQuartersRoadArea"];
          this.buildingdetails.RentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["RentAgreementFileUpload"];
          this.buildingdetails.Dis_RentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["Dis_RentAgreementFileUpload"];
          this.buildingdetails.RentAgreementFileUploadPath = data['Data'][0]['data']['Table'][0]["RentAgreementFileUploadPath"];


          this.buildingdetails.buildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["OtherDoc1FileUpload"];
          this.buildingdetails.Dis_buildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["Dis_OtherDoc1FileUpload"];
          this.buildingdetails.buildingOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["OtherDoc1FileUploadPath"];

          this.buildingdetails.buildingOtherDoc2FileUpload = data['Data'][0]['data']['Table'][0]["OtherDoc2FileUpload"];
          this.buildingdetails.Dis_buildingOtherDoc2FileUpload = data['Data'][0]['data']['Table'][0]["Dis_OtherDoc2FileUpload"];
          this.buildingdetails.buildingOtherDoc2FileUploadPath = data['Data'][0]['data']['Table'][0]["OtherDoc2FileUploadPath"];

          if (this.SelectedDepartmentID == 5) {
            this.GetResidentialBuildingTypeCheck();
            this.buildingdetails.ResidentialBuildingTypeID = data['Data'][0]['data']['Table'][0]["ResidentialBuildingTypeID"];
            this.buildingdetails.ResidentialBuildingName = data['Data'][0]['data']['Table'][0]["ResidentialBuildingName"];           
            this.buildingdetails.ResidentialDistance = data['Data'][0]['data']['Table'][0]["ResidentialDistance"];
            this.holddata.ResidentialAddressLine1 = data['Data'][0]['data']['Table'][0]["ResidentialAddressLine1"];
            this.holddata.ResidentialAddressLine2 = data['Data'][0]['data']['Table'][0]["ResidentialAddressLine2"];
            this.holddata.ResidentialRuralUrban = data['Data'][0]['data']['Table'][0]["ResidentialRuralUrban"];
            this.holddata.ResidentialDivisionID = data['Data'][0]['data']['Table'][0]["ResidentialDivisionID"];
            await this.FillResidentialDivisionRelatedDDL(null, this.holddata.ResidentialDivisionID);
            this.holddata.ResidentialDistrictID = data['Data'][0]['data']['Table'][0]["ResidentialDistrictID"];
            await this.FillResidentialDistrictRelatedDDL(null, this.holddata.ResidentialDistrictID);
            this.holddata.ResidentialTehsilID = data['Data'][0]['data']['Table'][0]["ResidentialTehsilID"];
            if (this.holddata.ResidentialRuralUrban == 'Rural') {
              this.IsRuralResidential = true;
              this.holddata.ResidentialPanchayatSamitiID = data['Data'][0]['data']['Table'][0]["ResidentialPanchayatSamitiID"];
            }
            else {
              this.IsRuralResidential = false;
              this.holddata.ResidentialCityID = data['Data'][0]['data']['Table'][0]["ResidentialCityID"];
            }
            this.holddata.ResidentialCityTownVillage = data['Data'][0]['data']['Table'][0]["ResidentialCityTownVillage"];
            this.holddata.ResidentialPincode = data['Data'][0]['data']['Table'][0]["ResidentialPincode"];
            this.changeResidentialBuildingType(data['Data'][0]['data']['Table'][0]["ResidentialBuildingName"], false);
            this.buildingdetails.MGOneResidentialIstheCampusUnitary = data['Data'][0]['data']['Table'][0]["MGOneResidentialIstheCampusUnitary"];
            this.changecampusType(this.buildingdetails.MGOneResidentialIstheCampusUnitary);
            this.buildingdetails.ResidentialOwnerName = data['Data'][0]['data']['Table'][0]["ResidentialOwnerName"];
            this.buildingdetails.ResidentialContactNo = data['Data'][0]['data']['Table'][0]["ResidentialContactNo"];
            this.buildingdetails.ResidentialbuildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc1FileUpload"];
            this.buildingdetails.ResidentialDis_buildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialDis_buildingOtherDoc1FileUpload"];
            this.buildingdetails.ResidentialbuildingOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc1FileUploadPath"];
            this.buildingdetails.ResidentialbuildingOtherDoc2FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc2FileUpload"];
            this.buildingdetails.ResidentialDis_buildingOtherDoc2FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialDis_buildingOtherDoc2FileUpload"];
            this.buildingdetails.ResidentialbuildingOtherDoc2FileUploadPath = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc2FileUploadPath"];
            this.buildingdetails.ResidentialRentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["ResidentialRentAgreementFileUpload"];
            this.buildingdetails.ResidentialDis_RentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["ResidentialDis_RentAgreementFileUpload"];
            this.buildingdetails.ResidentialRentAgreementFileUploadPath = data['Data'][0]['data']['Table'][0]["ResidentialRentAgreementFileUploadPath"];
            this.buildingdetails.AuthoritybuildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["AuthoritybuildingOtherDoc1FileUpload"];
            this.buildingdetails.AuthorityDis_buildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["AuthorityDis_buildingOtherDoc1FileUpload"];
            this.buildingdetails.AuthoritybuildingOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["AuthoritybuildingOtherDoc1FileUploadPath"];
            this.buildingdetails.MGOneDrainage = data['Data'][0]['data']['Table'][0]["MGOneDrainage"];
            this.buildingdetails.BuildingUseNameoftheAuthority = data['Data'][0]['data']['Table'][0]["BuildingUseNameoftheAuthority"];
            this.buildingdetails.NameoftheAuthority = data['Data'][0]['data']['Table'][0]["NameoftheAuthority"];
            this.buildingdetails.AuthorityDateApproval = data['Data'][0]['data']['Table'][0]["AuthorityDateApproval"];
            this.buildingdetails.BuildingUseOrderNo = data['Data'][0]['data']['Table'][0]["BuildingUseOrderNo"];
            this.buildingdetails.BuildingUseDateApproval = data['Data'][0]['data']['Table'][0]["BuildingUseDateApproval"];
            this.buildingdetails.buildingUseOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["buildingUseOtherDoc1FileUpload"];
            this.buildingdetails.Dis_buildingUseOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["Dis_buildingUseOtherDoc1FileUpload"];
            this.buildingdetails.buildingUseOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["buildingUseOtherDoc1FileUploadPath"];
            this.buildingdetails.PollutionDateApproval = data['Data'][0]['data']['Table'][0]["PollutionDateApproval"];
            this.buildingdetails.ValidDateApproval = data['Data'][0]['data']['Table'][0]["ValidDateApproval"];
            this.buildingdetails.PollutionbuildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["PollutionbuildingOtherDoc1FileUpload"];
            this.buildingdetails.PollutionDis_buildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["PollutionDis_buildingOtherDoc1FileUpload"];
            this.buildingdetails.PollutionbuildingOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["PollutionbuildingOtherDoc1FileUploadPath"];
            this.buildingdetails.ResidentialRentvaliditydate = data['Data'][0]['data']['Table'][0]["ResidentialRentvaliditydate"];
          }  
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
          this.buildingdetails.IsApproved = data['Data'][0]['data']['Table'][0]["IsApproved"];
          debugger;
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
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.buildingDetailsMasterService.GetAllBuildingDetailsList(this.UserID, this.buildingdetails.CollegeID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstBuildingDetails = data['Data'][0]['data']['Table'];
          this.lstBuildingDetailsDocument = data['Data'][0]['data']['Table1'];
          this.BuildingCollegeAddress = data['Data'][0]['data']['Table2'];
          //this.CollegeAddressOnAutoPopulateOnPageload();
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
    this.buildingdetails.MGOneIstheCampusUnitary = '';
    this.buildingdetails.Distance = 0;
    this.buildingdetails.MGOneIstheCampusUnitaryName = '';

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
    this.buildingdetails.buildingOtherDoc1FileUpload = '';
    this.buildingdetails.Dis_buildingOtherDoc1FileUpload = '';
    this.buildingdetails.buildingOtherDoc1FileUploadPath = '';
    this.buildingdetails.buildingOtherDoc2FileUpload = '';
    this.buildingdetails.Dis_buildingOtherDoc2FileUpload = '';
    this.buildingdetails.buildingOtherDoc2FileUploadPath = '';
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
    this.buildingdetails.ResidentialBuildingTypeID = null;
    this.buildingdetails.MGOneResidentialIstheCampusUnitary = '';
    this.buildingdetails.ResidentialOwnerName = '';
    this.buildingdetails.ResidentialAddressLine1 = '';
    this.buildingdetails.ResidentialAddressLine2 = '';
    this.buildingdetails.ResidentialRuralUrban = '';
    this.buildingdetails.ResidentialDistance = 0;
    this.buildingdetails.ResidentialDivisionID = 0;
    this.buildingdetails.ResidentialDistrictID = 0;
    this.buildingdetails.ResidentialTehsilID = 0;
    this.buildingdetails.ResidentialCityID = 0;
    this.buildingdetails.ResidentialPanchayatSamitiID = 0;
    this.buildingdetails.ResidentialCityTownVillage = '';
    this.buildingdetails.ResidentialContactNo = '';
    this.buildingdetails.ResidentialPincode = '';
    this.buildingdetails.ResidentialBuildingHostelQuartersRoadArea = 0;
    this.buildingdetails.ResidentialRentvaliditydate = '';
    this.buildingdetails.ResidentialbuildingOtherDoc1FileUpload = '';
    this.buildingdetails.ResidentialDis_buildingOtherDoc1FileUpload = '';
    this.buildingdetails.ResidentialbuildingOtherDoc1FileUploadPath = '';
    this.buildingdetails.ResidentialbuildingOtherDoc2FileUpload = '';
    this.buildingdetails.ResidentialDis_buildingOtherDoc2FileUpload = '';
    this.buildingdetails.ResidentialbuildingOtherDoc2FileUploadPath = '';
    this.buildingdetails.ResidentialRentAgreementFileUpload = '';
    this.buildingdetails.ResidentialDis_RentAgreementFileUpload = '';
    this.buildingdetails.ResidentialRentAgreementFileUploadPath = '';
    this.buildingdetails.AuthoritybuildingOtherDoc1FileUpload = '';
    this.buildingdetails.AuthorityDis_buildingOtherDoc1FileUpload = '';
    this.buildingdetails.AuthoritybuildingOtherDoc1FileUploadPath = '';
    this.buildingdetails.MGOneDrainage = '';
    this.buildingdetails.BuildingUseNameoftheAuthority = '';
    this.buildingdetails.BuildingUseOrderNo = '';
    this.buildingdetails.BuildingUseDateApproval = '';
    this.buildingdetails.buildingUseOtherDoc1FileUpload = '';
    this.buildingdetails.Dis_buildingUseOtherDoc1FileUpload = '';
    this.buildingdetails.buildingUseOtherDoc1FileUploadPath = '';
    this.buildingdetails.PollutionDateApproval = '';
    this.buildingdetails.ValidDateApproval = '';
    this.buildingdetails.PollutionbuildingOtherDoc1FileUpload = '';
    this.buildingdetails.PollutionDis_buildingOtherDoc1FileUpload = '';
    this.buildingdetails.PollutionbuildingOtherDoc1FileUploadPath = '';
    this.buildingdetails.ResidentialBuildingName = '';
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
    this.DistrictList_Owner = [];
    this.TehsilList_Owner = [];
    this.CityList = [];
    this.PanchyatSamitiList_Owner = [];
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
      this.buildingdetails.CityID = 0;
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
  async ResidentialIsRuralOrUrban(IsRuralResidential: boolean, section?: string) {
    try {
      this.loaderService.requestStarted();
      this.IsRuralResidential = IsRuralResidential;
      this.buildingdetails.ResidentialCityID = 0;
      this.buildingdetails.ResidentialPanchayatSamitiID = 0;
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
    this.DistrictList_Owner = [];
    this.buildingdetails.DistrictID = 0;
    this.TehsilList_Owner = [];
    this.buildingdetails.TehsilID = 0;
    this.CityList = [];
    this.buildingdetails.CityID = 0;
    this.PanchyatSamitiList_Owner = [];
    this.buildingdetails.PanchayatSamitiID = 0;
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
          this.file = document.getElementById('fileLandDocument_' + item.DID);
          this.file.value = '';
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
            debugger;
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
      else if (Type == 'buildingOtherDoc1FileUpload' || Type == 'All') {
        //this.isValidbuildingOtherDoc1FileUpload = isShow;
        this.buildingdetails.buildingOtherDoc1FileUpload = '';
        this.buildingdetails.Dis_buildingOtherDoc1FileUpload = '';
        this.buildingdetails.buildingOtherDoc1FileUploadPath = '';
        this.file = document.getElementById('txtbuildingOtherDoc1');
        this.file.value = '';
      }

      else if (Type == 'buildingOtherDoc2FileUpload' || Type == 'All') {
        // this.isValidbuildingOtherDoc1FileUpload = isShow;
        this.buildingdetails.buildingOtherDoc2FileUpload = '';
        this.buildingdetails.Dis_buildingOtherDoc2FileUpload = '';
        this.buildingdetails.buildingOtherDoc2FileUploadPath = '';
        this.file = document.getElementById('txtbuildingOtherDoc2');
        this.file.value = '';
      }
      else if (Type == 'ResidentialbuildingOtherDoc1FileUpload' || Type == 'All') {
        // this.isValidbuildingOtherDoc1FileUpload = isShow;
        this.buildingdetails.ResidentialbuildingOtherDoc1FileUpload = '';
        this.buildingdetails.ResidentialDis_buildingOtherDoc1FileUpload = '';
        this.buildingdetails.ResidentialbuildingOtherDoc1FileUploadPath = '';
        this.file = document.getElementById('txtResidentialbuildingOtherDoc1');
        this.file.value = '';
      }
      else if (Type == 'ResidentialbuildingOtherDoc2FileUpload' || Type == 'All') {
        // this.isValidbuildingOtherDoc1FileUpload = isShow;
        this.buildingdetails.ResidentialbuildingOtherDoc2FileUpload = '';
        this.buildingdetails.ResidentialDis_buildingOtherDoc2FileUpload = '';
        this.buildingdetails.ResidentialbuildingOtherDoc2FileUploadPath = '';
        this.file = document.getElementById('txtResidentialbuildingOtherDoc2');
        this.file.value = '';
      }
      else if (Type == 'ResidentialRentAgreementFileUpload' || Type == 'All') {
        // this.isValidbuildingOtherDoc1FileUpload = isShow;
        this.buildingdetails.ResidentialRentAgreementFileUpload = '';
        this.buildingdetails.ResidentialDis_RentAgreementFileUpload = '';
        this.buildingdetails.ResidentialRentAgreementFileUploadPath = '';
        this.file = document.getElementById('txtResidentialRentAgreementFileUpload');
        this.file.value = '';
      }
      else if (Type == 'AuthoritybuildingOtherDoc1FileUpload' || Type == 'All') {
        // this.isValidbuildingOtherDoc1FileUpload = isShow;
        this.buildingdetails.AuthoritybuildingOtherDoc1FileUpload = '';
        this.buildingdetails.AuthorityDis_buildingOtherDoc1FileUpload = '';
        this.buildingdetails.AuthoritybuildingOtherDoc1FileUploadPath = '';
        this.file = document.getElementById('txtNameoftheAuthority');
        this.file.value = '';
      }
      else if (Type == 'OccupancyCertificatebuildingOtherDoc1FileUpload' || Type == 'All') {
        // this.isValidbuildingOtherDoc1FileUpload = isShow;
        this.buildingdetails.buildingUseOtherDoc1FileUpload = '';
        this.buildingdetails.Dis_buildingUseOtherDoc1FileUpload = '';
        this.buildingdetails.buildingUseOtherDoc1FileUploadPath = '';
        this.file = document.getElementById('txtbuildingUseOtherDoc1');
        this.file.value = '';
      }
      else if (Type == 'PollutionCertificatebuildingOtherDoc1FileUpload' || Type == 'All') {
        // this.isValidbuildingOtherDoc1FileUpload = isShow;
        this.buildingdetails.PollutionbuildingOtherDoc1FileUpload = '';
        this.buildingdetails.PollutionDis_buildingOtherDoc1FileUpload = '';
        this.buildingdetails.PollutionbuildingOtherDoc1FileUploadPath = '';
        this.file = document.getElementById('txtPollutionbuildingOtherDoc1');
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

    else if (Type == 'buildingOtherDoc1FileUpload') {
      this.isValidbuildingOtherDoc1FileUpload = isShow;
      this.buildingdetails.buildingOtherDoc1FileUpload = fileName;
      this.buildingdetails.Dis_buildingOtherDoc1FileUpload = dis_Name;
      this.buildingdetails.buildingOtherDoc1FileUploadPath = filePath;
    }

    else if (Type == 'buildingOtherDoc2FileUpload') {
      this.isValidbuildingOtherDoc2FileUpload = isShow;
      this.buildingdetails.buildingOtherDoc2FileUpload = fileName;
      this.buildingdetails.Dis_buildingOtherDoc2FileUpload = dis_Name;
      this.buildingdetails.buildingOtherDoc2FileUploadPath = filePath;
    }
    else if (Type == 'ResidentialbuildingOtherDoc1FileUpload') {
      this.isValidbuildingOtherDoc1FileUpload = isShow;
      this.buildingdetails.ResidentialbuildingOtherDoc1FileUpload = fileName;
      this.buildingdetails.ResidentialDis_buildingOtherDoc1FileUpload = dis_Name;
      this.buildingdetails.ResidentialbuildingOtherDoc1FileUploadPath = filePath;
    }
    else if (Type == 'ResidentialbuildingOtherDoc2FileUpload') {
      this.isValidbuildingOtherDoc2FileUpload = isShow;
      this.buildingdetails.ResidentialbuildingOtherDoc2FileUpload = fileName;
      this.buildingdetails.ResidentialDis_buildingOtherDoc2FileUpload = dis_Name;
      this.buildingdetails.ResidentialbuildingOtherDoc2FileUploadPath = filePath;
    }
    else if (Type == 'ResidentialRentAgreementFileUpload') {
      this.isValidRentAgreementFileUpload = isShow;
      this.buildingdetails.ResidentialRentAgreementFileUpload = fileName;
      this.buildingdetails.ResidentialDis_RentAgreementFileUpload = dis_Name;
      this.buildingdetails.ResidentialRentAgreementFileUploadPath = filePath;
    }
    else if (Type == 'AuthoritybuildingOtherDoc1FileUpload') {
      this.isValidbuildingOtherDoc1FileUpload = isShow;
      this.buildingdetails.AuthoritybuildingOtherDoc1FileUpload = fileName;
      this.buildingdetails.AuthorityDis_buildingOtherDoc1FileUpload = dis_Name;
      this.buildingdetails.AuthoritybuildingOtherDoc1FileUploadPath = filePath;
    }
    else if (Type == 'OccupancyCertificatebuildingOtherDoc1FileUpload') {
      this.isValidbuildingOtherDoc1FileUpload = isShow;
      this.buildingdetails.buildingUseOtherDoc1FileUpload = fileName;
      this.buildingdetails.Dis_buildingUseOtherDoc1FileUpload = dis_Name;
      this.buildingdetails.buildingUseOtherDoc1FileUploadPath = filePath;
    }
    else if (Type == 'PollutionCertificatebuildingOtherDoc1FileUpload') {
      this.isValidbuildingOtherDoc1FileUpload = isShow;
      this.buildingdetails.PollutionbuildingOtherDoc1FileUpload     = fileName;
      this.buildingdetails.PollutionDis_buildingOtherDoc1FileUpload = dis_Name;
      this.buildingdetails.PollutionbuildingOtherDoc1FileUploadPath = filePath;
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

  public IsGovtCollege: boolean = false;
  async GetCollegeBasicDetails() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeBasicDetails(this.buildingdetails.CollegeID.toString())
        .then(async (data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'][0]['data'][0]['ManagementType'] == 'Government' && this.SelectedDepartmentID == 4) {
            this.IsGovtCollege = true;
          }
          else {
            this.IsGovtCollege = false;
          }
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
  async changeResidentialBuildingType(BuildingType: any, IsChanged: boolean) {
   // debugger;
    this.onChangeEvent = BuildingType;
    if (BuildingType == 'Owned') {     
      this.ResidentialRentAggrementDocShow = false;
      this.ResidentialbuildAddressShowHide = true;
      //this.IsRural = false;      
      this.BulidingResidentialCollegeAddressOnAutoPopulateOnPageload();
    }
    //if (IsChanged == true) {
    //  this.ResidentialRentAggrementDocShow = true;
    //  this.ResidentialbuildAddressShowHide = false;
    //}
    else {
      this.ResidentialRentAggrementDocShow = true;
      this.ResidentialbuildAddressShowHide = false;

      this.Owin_RentDocTitle = 'Certificate of Land & Rented Building in same "Tehsil" Order No. & Order Date : '

      if (this.buildingdetails.SchoolBuildingDetailsID > 0 && !IsChanged) {
        this.buildingdetails.ResidentialAddressLine1 = this.holddata.ResidentialAddressLine1;
        this.buildingdetails.ResidentialAddressLine2 = this.holddata.ResidentialAddressLine2;
        this.buildingdetails.ResidentialRuralUrban = this.holddata.ResidentialRuralUrban;
        await this.ResidentialIsRuralOrUrban(this.buildingdetails.ResidentialRuralUrban == 'Rural' ? true : false, '');
        this.buildingdetails.ResidentialDivisionID = this.holddata.ResidentialDivisionID;
        await this.FillDivisionRelatedDDL(null, this.buildingdetails.ResidentialDivisionID);
        this.buildingdetails.ResidentialDistrictID = this.holddata.ResidentialDistrictID;
        await this.FillDistrictRelatedDDL(null, this.buildingdetails.ResidentialDistrictID);
        this.buildingdetails.ResidentialTehsilID = this.holddata.ResidentialTehsilID;
        this.buildingdetails.ResidentialCityID = this.holddata.ResidentialCityID;
        this.buildingdetails.ResidentialPanchayatSamitiID = this.holddata.ResidentialPanchayatSamitiID;
        this.buildingdetails.ResidentialCityTownVillage = this.holddata.ResidentialCityTownVillage;
        this.buildingdetails.ResidentialPincode = this.holddata.ResidentialPincode;
      }
      else {
        this.buildingdetails.ResidentialAddressLine1 = '';
        this.buildingdetails.ResidentialAddressLine2 = '';
        this.buildingdetails.ResidentialRuralUrban = '';
        this.buildingdetails.ResidentialDivisionID = 0;
        this.buildingdetails.ResidentialDistrictID = 0;
        this.buildingdetails.ResidentialTehsilID = 0;
        this.buildingdetails.ResidentialCityID = 0;
        this.buildingdetails.ResidentialPanchayatSamitiID = 0;
        this.buildingdetails.ResidentialCityTownVillage = '';
        this.buildingdetails.ResidentialPincode = '';
        this.ResidentialDistrictList_Owner = [];
        this.ResidentialTehsilList_Owner = [];
        this.ResidentialPanchyatSamitiList_Owner = [];
        this.ResidentialCityList = [];
      }
    }
  }
  async FillResidentialDivisionRelatedDDL(event: any, SeletedValueResidentialDivision: any) {
    //debugger;
    this.ResidentialDistrictList_Owner = [];
    this.buildingdetails.ResidentialDistrictID = 0;
    this.ResidentialTehsilList_Owner = [];
    this.buildingdetails.ResidentialTehsilID = 0;
    this.ResidentialCityList = [];
    this.buildingdetails.ResidentialCityID = 0;
    this.ResidentialPanchyatSamitiList_Owner = [];
    this.buildingdetails.ResidentialPanchayatSamitiID = 0;
    this.buildingdetails.ResidentialDivisionID = SeletedValueResidentialDivision;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictByDivsionId(this.buildingdetails.ResidentialDivisionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ResidentialDistrictList_Owner = data['Data'];

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
  async BulidingResidentialCollegeAddressOnAutoPopulateOnPageload() {
    debugger;
    try {
      //console.log(this.lstBuildingDetails[0]);      
      this.loaderService.requestStarted();
      this.buildingdetails.ResidentialAddressLine1 = this.BuildingCollegeAddress[0]["AddressLine1"];
      this.buildingdetails.ResidentialAddressLine2 = this.BuildingCollegeAddress[0]["AddressLine2"];
      this.buildingdetails.ResidentialRuralUrban = this.BuildingCollegeAddress[0]["RuralUrban"];
      this.buildingdetails.ResidentialDivisionID = this.BuildingCollegeAddress[0]["DivisionID"];
      //console.log(this.buildingdetails.ResidentialDivisionID);
      await this.FillResidentialDivisionRelatedDDL(null, this.buildingdetails.ResidentialDivisionID);
      this.buildingdetails.ResidentialDistrictID = this.BuildingCollegeAddress[0]["DistrictID"];
      //console.log(this.buildingdetails.ResidentialDistrictID);
      await this.FillResidentialDistrictRelatedDDL(null, this.buildingdetails.ResidentialDistrictID);
      this.buildingdetails.ResidentialTehsilID = this.BuildingCollegeAddress[0]["TehsilID"];
      if (this.buildingdetails.ResidentialRuralUrban == 'Rural') {
        this.IsRuralResidential = true;
        this.buildingdetails.ResidentialPanchayatSamitiID = this.BuildingCollegeAddress[0]["PanchayatSamitiID"];
      }
      else {
        this.IsRuralResidential = false;
        this.buildingdetails.ResidentialCityID = this.BuildingCollegeAddress[0]["CityID"];
      }
      this.buildingdetails.ResidentialCityTownVillage = this.BuildingCollegeAddress[0]["CityTownVillage"];
      this.buildingdetails.ResidentialContactNo = this.BuildingCollegeAddress[0]["MobileNumber"];
      this.buildingdetails.ResidentialPincode = this.BuildingCollegeAddress[0]["Pincode"];      
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async FillResidentialDistrictRelatedDDL(event: any, SeletedValueResidentialDistrict: any) {
    //debugger;
    // this.buildingdetails.DistrictID = SeletedValueDistrict;
    try {
      this.loaderService.requestStarted();
      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(SeletedValueResidentialDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ResidentialTehsilList_Owner = data['Data'];
        }, error => console.error(error));
      // PanchyatSamiti list
      await this.commonMasterService.GetPanchyatSamitiByDistrictId(SeletedValueResidentialDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ResidentialPanchyatSamitiList_Owner = data['Data'];

        }, error => console.error(error));
      //city list
      await this.commonMasterService.GetCityByDistrict(SeletedValueResidentialDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ResidentialCityList = data['Data'][0]['data'];
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
  async GetResidentialDivisionList() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ResidentialDivisionList = data['Data'];
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
  async GetResidentialBuildingTypeCheck() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetBuildingTypeCheck(this.SelectedDepartmentID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstResidentialBuildingTypeChk = data['Data'];
          console.log('Tested');
          console.log(this.lstResidentialBuildingTypeChk);
          console.log('Tested');
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
  async changecampusType(changecampusType1: any) {
     debugger;
    console.log(changecampusType1);
    console.log(this.onChangeEvent);
    if (changecampusType1 == 'No') {
      this.ResidentialRentAggrementDocShow = true;
      this.ResidentialbuildAddressShowHide = false;      
    }
    if (changecampusType1 == 'Yes') {

      this.ResidentialRentAggrementDocShow = false;
      this.ResidentialbuildAddressShowHide = true;
    }
    //if (this.onChangeEvent == 'Lease' && changecampusType1 == 'Yes') {

    //  this.ResidentialRentAggrementDocShow = true;
    //  this.ResidentialbuildAddressShowHide = false;
    //}
    //if (this.onChangeEvent == 'Owned' && changecampusType1 == 'Yes') {

    //  this.ResidentialRentAggrementDocShow = false;
    //  this.ResidentialbuildAddressShowHide = true;
    //}
    
  }
  async changeBuildingStatus(changecampusType1: any) {
    debugger;
    console.log(changecampusType1);
    console.log(this.onBuildingChangeEvent);
    if (changecampusType1 == 'No') {
      this.RentAggrementDocShow = true;
      this.buildAddressShowHide = false;
      
    }
    if (changecampusType1 == 'Yes') {
      this.RentAggrementDocShow = false;
      this.buildAddressShowHide = true;
    }
    //if (this.onBuildingChangeEvent == 'Lease' && changecampusType1 == 'Yes') {

    //  this.RentAggrementDocShow = true;
    //  this.buildAddressShowHide = false;
     
    //}
    //if (this.onBuildingChangeEvent == 'Owned' && changecampusType1 == 'Yes') {
    //  this.RentAggrementDocShow = false;
    //  this.buildAddressShowHide = true;      
    //}
    
  }
}
