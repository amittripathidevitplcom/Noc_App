
import { ChangeDetectorRef, Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VeterinaryHospitalDataModel } from '../../../Models/VeterinaryHospitalDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { VeterinaryHospitalService } from '../../../Services/VeterinaryHospital/veterinary-hospital.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { Obj } from '@popperjs/core';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable, { Table } from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-veterinary-hospital',
  templateUrl: './veterinary-hospital.component.html',
  styleUrls: ['./veterinary-hospital.component.css']
})
export class VeterinaryHospitalComponent implements OnInit {
  isSubmitted: boolean = false;
  veterinaryHospitalForm!: FormGroup;
  request = new VeterinaryHospitalDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  UploadFile: string = '';
  file: File | any = null;
  public files: File = null;
  public isDisabledGrid: boolean = false;
  public isFileName: boolean = false;
  public isDeleteButton: boolean = true;
  public isLoadingExport: boolean = false;
  public DivisionList: any = [];
  public UserID: number = 0;
  public DistrictList: any = [];
  public SuvdivisionList: any = [];
  public TehsilList: any = [];
  public PanchyatSamitiList: any = [];
  public PinNoRegex = new RegExp(/[0-9]{5}/);
  public ContactNoRegex = new RegExp(/[0-9]{5}/);
  IsRural: boolean = false;
  IsPanchayatSamitirequried: boolean = false;
  IsTehsilrequired: boolean = false;
  public VeterinaryHostpitalFileUpload: boolean = false;
  public ActiveStatus: boolean = true;
  public downloadingPDF: boolean = false;
  searchText: string = '';
  public isFormValid: boolean = false;

  public ImageValidate: string = '';
  public CssClass_TextDangerWidth: string = '';
  public CssClass_TextDangerLength: string = '';

  public isValidFileUpload: boolean = false;
  public showFileUpload: boolean = false;

  public ImageValidationMessage: string = '';

  @ViewChild('fileUploadImage')
  fileUploadImage: ElementRef<HTMLInputElement> = {} as ElementRef;

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


  constructor(private veterinaryHospitalService: VeterinaryHospitalService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute,
    private routers: Router, private cdRef: ChangeDetectorRef, private clipboard: Clipboard) { }

  init() {
    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }

  ngOnInit(): void {
    this.veterinaryHospitalForm = this.formBuilder.group(
      {
        txtHospitalName: ['', Validators.required],
        txtDistanceFromInstitute: ['', Validators.required],
        txtAuthorizedPerson: ['', Validators.required],
        txtAddressLine1: ['', Validators.required],
        txtAddressLine2: ['', Validators.required],
        txtRelation: ['', Validators.required],
        rbRuralUrban: ['', Validators.required],
        rbYesNo: ['', Validators.required],
        ddlDivisionID: ['', [DropdownValidators]],
        ddlDistrictID: ['', [DropdownValidators]],
        ddlTehsilID: [''],
        ddlPanchayatSamitiID: [''],
        txtCityTownVillage: ['', Validators.required],
        txtPincode: ['', [Validators.required]],
        txtMobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
        txtEmailAddress: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        txtRemark: ['', Validators.required],
        txtFileUpload: [''],
        //txtFromDate: ['', Validators.required],
        //txtToDate: ['', Validators.required],
        //txtFireNOCUpload: [''],
        //txtOrderNo: ['', Validators.required],
        //txtOrderDate: ['', Validators.required],
        //txtExpiringOn: ['', Validators.required],
        //txtPWDNOCFileUpload: [''],
        ////txtFrontViewFileUpload: ['', Validators.required],
        ////txtBackViewFileUpload: ['', Validators.required],
        ////txtLSideViewFileUpload: ['', Validators.required],
        ////txtRSideViewFileUpload: ['', Validators.required],
        ////txtOtherFileUpload: ['', Validators.required],


        //txtOwnBuildingOrderNo: ['', [Validators.required]],
        //txtOwnBuildingOrderDate: ['', [Validators.required]],
        //txtTotalProjectCost: ['', [Validators.required]],
        //txtSourceCostAmount: ['', [Validators.required]],
        //txtAmountDeposited: ['', [Validators.required]],
        //txtOtherFixedAssetsAndSecurities: ['', [Validators.required]],
        //txtGATEYearBalanceSecret: ['', [Validators.required]],
        //txtOtherFinancialResources: ['', [Validators.required]],
        //TotalProjectCostFileUpload: [''],
        //SourceCostAmountFileUpload: [''],
        //AmountDepositedFileUpload: [''],
        //OtherFixedAssetsAndSecuritiesFileUpload: [''],
        //GATEYearBalanceSecretFileUpload: [''],
        //OtherFinancialResourcesFileUpload: [''],
        //txtOwnBuildingUpload: [''],

        //txtsearchText: [''],
      })

    //this.buildingdetails.CollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    //this.buildingdetails.lstBuildingDocDetails = [];
    //this.GetBuildingTypeCheck();
    //this.GetBuildingUploadDetails();
    this.GetDivisionList();
    //this.GetAllBuildingDetailsList();
    this.ActiveStatus = true;
  }
  get form() { return this.veterinaryHospitalForm.controls; }

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
    this.request.TehsilID = 0;
    this.request.PanchayatSamitiID = 0;
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
    // this.request.DistrictID = SeletedValueDistrict;
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

    this.isValidFileUpload = false;
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'application/pdf') {
        if (event.target.files[0].size > 2000000) {
          this.ImageValidationMessage = 'Select less then 2MB File';
          if (Type == 'FileUpload') {
            this.isValidFileUpload = true;
            this.request.FileUpload = '';
            this.request.Dis_FileUpload = '';
            this.request.FileUploadPath = '';
          }         
          return
        }
        if (event.target.files[0].size < 100000) {
          this.ImageValidationMessage = 'Select more then 100kb File';
          if (Type == 'FileUpload') {
            this.isValidFileUpload = true;
            this.request.FileUpload = '';
            this.request.Dis_FileUpload = '';
            this.request.FileUploadPath = '';
          }          
          return
        }
      }
      else {
        this.ImageValidationMessage = 'Select Only pdf file';
        if (Type == 'FileUpload') {
          this.isValidFileUpload = true;
          this.request.FileUpload = '';
          this.request.Dis_FileUpload = '';
          this.request.FileUploadPath = '';
        }
        return
      }

      this.file = event.target.files[0];
      this.fileUploadService.UploadDocument(this.file).then((data: any) => {

        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == 'FileUpload') {            
            this.request.FileUpload = data['Data'][0]["FileName"];
            this.request.Dis_FileUpload = data['Data'][0]["Dis_FileName"];
            this.request.FileUploadPath = data['Data'][0]["FilePath"];
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
    if (Type == 'FileUpload') {
      //this.showOwnBuildingFileUpload = false;
      this.request.FileUpload = '';
      this.request.Dis_FileUpload = '';
      this.request.FileUploadPath = '';
    }
  }
}
