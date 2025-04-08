
import { Component, OnInit, Input, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { CollegeDataModel, ContactDetailsDataModel, NearestGovernmentHospitalsDataModel } from '../../../Models/CollegeDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { max } from 'rxjs';
import { InputValidationService } from '../../../Services/CustomValidators/input-validation.service';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
import { __rest } from 'tslib';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { request } from 'http';
import { Console } from 'console';

@Injectable()

@Component({
  selector: 'app-dteadd-college-master',
  templateUrl: './dteadd-college-master.component.html',
  styleUrls: ['./dteadd-college-master.component.css']
})
export class DTEAddCollegeMasterComponent implements OnInit {
  //Add FormBuilder
  CollegeDetailsForm!: FormGroup;
  CollegeDetailsForm_ContactDetails!: FormGroup;
  CollegeDetailsForm_NearestGovernmentHospitals!: FormGroup;

  //public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)
  public LandLineRegex = new RegExp(/[0-9]{6,12}/)
  public PinNoRegex = new RegExp(/[0-9]{6}/)

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isSubmitted_ContactDetails: boolean = false;
  public isSubmitted_NearestGovernmentHospitals: boolean = false;
  public file!: File;
  public DepartmentList: any = [];
  public CollegeStatusList: any = [];
  public CollegeLevelList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public PresentCollegeStatusList: any = [];
  public CollegeTypeList: any = [];
  public Dis_CollegeTypeList: any = [];
  public CollegeMediumList: any = [];
  public UniversityList: any = [];
  public FinancialYearList: any = [];
  public SuvdivisionList: any = [];
  public TehsilList: any = [];
  public PanchyatSamitiList: any = [];
  public ParliamentAreaList: any = [];
  public AssembelyAreaList: any = [];
  public IsRural: boolean = true;
  public IsAISHECodeStatus: boolean = false;
  public IsCollegeNAACAccredited: boolean = false;
  public IsCollegeAffiliationDocument: boolean = false;
  public IsCollegeWebsiteImage: boolean = false;
  public IsExisting: boolean = false;
  public PresentCollegeStatusList_FilterData: any = []
  public CollegeLevelList_FilterData: any = []
  public DesignationList: any = [];

  public ImageValidationMessage: string = '';
  public isValidCollegeLogo: boolean = false;
  public isValidNAACAccreditedCertificate: boolean = false;
  public isValidAffiliationDocument: boolean = false;
  public IsRural_Nearest: boolean = true;
  public DistrictList_Nearest: any = [];
  public TehsilList_Nearest: any = [];
  public PanchyatSamitiList_Nearest: any = [];

  public showCollegeLogo: boolean = false;
  public showWebsiteImage: boolean = false;
  public IsEdit: boolean = false;
  public showNAACAccreditedCertificate: boolean = false;
  public showAffiliationDocument: boolean = false;
  public showHospitalDocument: boolean = false;
  public isValidHospitalDocument: boolean = false;
  public ProfileLogoValidationMessage: string = '';
  public WebsiteImageValidationMessage: string = '';
  public AISHECodeValidationMessage: string = '';
  public NAACAccreditedCertificateValidationMessage: string = '';
  public AffiliationDocumentValidationMessage: string = '';

  public FundingSourcesValidationMessage: string = '';
  public ICARDocumentValidationMessage: string = '';
  public NACCValidityDateValidationMessage: string = '';
  public HospitalDocumentValidationMessage: string = '';
  public QueryStringCollageID: number = 0;
  public MinDate: Date = new Date;
  public DistancefromCity: string = "Distance from City(km)";

  public is_disableDepartment: boolean = false;
  public LegalEntityManagementType: string = "Private";
  // login model
  sSOLoginDataModel = new SSOLoginDataModel();

  /*Save Data Model*/
  request = new CollegeDataModel();
  request_ContactDetailsDataModel = new ContactDetailsDataModel();
  request_NearestGovernmentHospitals = new NearestGovernmentHospitalsDataModel();

  public CityList_Nearest: any = [];
  public CityList: any = [];


  public dropdownSettings: IDropdownSettings = {};
  public ManagementTypeList: any = [];
  public SelectedCollegeLevel: any = [];
  public showUniversityAffiliationDocument: boolean = false;
  public showUniversityApproveTeachingFaculty: boolean = false;
  public AffiliationUniversityDocumentValidationMessage: string = '';
  public UniversityApproveTeachingFacultyValidationMessage: string = '';
  public SelectedDepartmentID: number = 0;
  public AffiliationStatus: any = '';
  public Name: string = '';
  public DTEARNID: number = 0;
  public ApplyAffiliation: string = '';
  public SearchRecordID: string = '';
  public SelectedDteAffiliationCollageID: number = 0;
  public CollegeID: number = 0;
  public CollegeName: string = '';
  public legalEntityListData: any = [];
  public DTEAffiliationID: number = 0;
  public CollegeStatusId: number = 0;
  public IsEdits: boolean = false;
  public StatusOfBuildingList_FilterData: any = [];
  public AffiliationTypeList_FilterData: any = [];
  public ifExistCollege: any = [];
  public AffiliationTypeID: number = 0;
  public AffiliationTypeStatus: string = '';
  public IsAffiliationtype: boolean = false;
  public IsAICTEEOAAdress: boolean = false;
  constructor(private legalEntityListService: LegalEntityService, private collegeService: CollegeService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService) {
  }

  async ngOnInit() {
    debugger;
    this.CollegeDetailsForm = this.formBuilder.group(
      {
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlCollegeStatus: ['', [DropdownValidators]],
        fCollegeLogo: [''],
        //ddlPresentCollegeStatus: ['', [DropdownValidators]],
        ddlCollegeTypeID: ['', [DropdownValidators]],
        ddlManagementType: ['', [DropdownValidators]],
        ddlCollegeLevelID: ['',[DropdownValidators]],
        ddlStatusOfBuilding: ['', [DropdownValidators]],
        ddlAffiliationType: ['', [DropdownValidators]],
        //txtCollegeCode: ['', Validators.required],
        txtCollegeCode: ['', Validators.required],
        txtCollegeNameEn: ['', Validators.required],
        txtCollegeNameHi: ['', Validators.required],
        CollegeNAACAccredited: ['', Validators.required],       
        NAACAccreditedCertificate: [''],
        txtNACCValidityDate: [''],
        ddlCollegeMedium: ['', [DropdownValidators]],
        ddlUniversityID: ['', [DropdownValidators]],
        txtUniversity: [''],
        ddlYearofEstablishment: [''],
        ddlDivisionID: ['', [DropdownValidators]],
        ddlDistrictID: ['', [DropdownValidators]],
        ddlSubdivisionID: ['', [DropdownValidators]],
        ddlTehsilID: ['', [DropdownValidators]],
        rbRuralUrban: ['', Validators.required],
        ddlCityID: ['', [DropdownValidators]],
        ddlPanchayatSamitiID: ['', [DropdownValidators]],
        ddlParliamentAreaID: [''],
        ddlAssemblyAreaID: [''],  //, [DropdownValidators]
        txtCityTownVillage: ['', Validators.required],
        txtPincode: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],
        txtAddressLine1: ['', Validators.required],
        txtAddressLine2: [''],
        txtDistanceFromCity: ['', Validators.required],
        txtWebsiteLink: [''],
        txtMobileNumber: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]],
        txtCollegeLandlineNumber: ['', [Validators.pattern("^[0-9]{10,12}$")]],
        txtEmail: ['', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
        ddlGCD_DesignationID: [''],
        txtGCD_MobileNumber: ['', [Validators.pattern("^[6-9][0-9]{9}$")]],
        txtCDNameOfPerson: [''],// handle in sub form
        txtGCD_LandlineNumber: ['', [Validators.pattern("^[0-9]{10,12}$")]],
        CollegeWebsiteImage: [''],
        txtAISHECode: [''],
        txtCDMobileNumber: [''],// handle in sub form
        txtAddressofCollegeasgiveninAICTEEOA: ['', Validators.required],
        AICTEEOAAdress: ['', Validators.required],
        txtAICTEEOADifferentAddress: [''],
        txtCDEmailAddress: ['', Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")],// handle in sub form
      })

    this.CollegeDetailsForm_ContactDetails = this.formBuilder.group(
      {
        txtCDNameOfPerson: ['', Validators.required],
       
        ddlCDDesignationID: ['', [DropdownValidators]],
        txtCDMobileNumber: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]],
        txtCDEmailAddress: ['', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
        txtPermanentAddress: ['', Validators.required],
      })

    this.CollegeDetailsForm_NearestGovernmentHospitals = this.formBuilder.group(
      {
        txtHospitalName: ['', Validators.required],
        txtHospitalRegNo: [''],//, Validators.required
        fHospitalDocument: ['', Validators.required],
        txtHospitalDistance: ['', Validators.required],
        txtAddressLine1_Nearest: ['', Validators.required],
        txtAddressLine2_Nearest: [''],
        rbRuralUrban_Nearest: ['', Validators.required],
        ddlDivisionID_Nearest: ['', [DropdownValidators]],
        ddlDistrictID_Nearest: ['', [DropdownValidators]],
        ddlTehsilID_Nearest: ['', [DropdownValidators]],
        ddlCityID_Nearest: ['', [DropdownValidators]],
        ddlPanchayatSamitiID_Nearest: ['', [DropdownValidators]],
        txtCityTownVillage_Nearest: ['', Validators.required],
        txtPincode_Nearest: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]]
      })
    setTimeout(function () { (window as any).LoadData(); }, 200)
    // query string
    //this.QueryStringCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString());
    this.DTEAffiliationID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTEAffiliationID')?.toString());
    this.AffiliationStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());
    this.CollegeStatusId = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeStatusId')?.toString());
    this.request.DTEAffiliationID = this.DTEAffiliationID;
    this.request_ContactDetailsDataModel.DTEAffiliationIDs = this.DTEAffiliationID;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);
    this.request.ContactDetailsList = [];
    this.request.NearestGovernmentHospitalsList = [];


    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      idField: "ID",
      textField: "Name",
    }
    if (this.request.DTEAffiliationID > 0) {
      await this.commonMasterService.CheckCollegestatusIDWise(this.DTEAffiliationID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {
            this.GetData();
          // await this.FilterAffiliationCourseStatusBter();
          }
        }, error => console.error(error));
    }
    else {
      this.SelectedDteAffiliationCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString()));
    }
      
    
    
    this.loaderService.requestStarted();
    // department
    await this.GetDepartmentList();
    await this.FillDepartmentRelatedDDL();
    // division
   await this.GetDivisionList();
    // FinancialYear
    await this.GetAllFinancialYear();
    // get all Designation
    await this.GetAllDesignation();
    //await this.ddlCollegeStatus_TextChange();
    // get college by id

    // sso id
    this.request.ParentSSOID = this.sSOLoginDataModel.SSOID;
    this.request.MappingSSOID = this.sSOLoginDataModel.SSOID;
    if (this.SearchRecordID.length > 20 && this.SelectedDepartmentID == 12) {
      await this.commonMasterService.GetDteAffiliation_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SelectedDteAffiliationCollageID = data['Data']['DTE_ARId'];
          this.CollegeName = data['Data']['College_Name']
          this.request.CollegeNameEn = this.CollegeName
          this.IsEdits = true;
          if (this.SelectedDteAffiliationCollageID == null || this.SelectedDteAffiliationCollageID == 0 || this.SelectedDteAffiliationCollageID == undefined) {
            this.routers.navigate(['/affiliationregistration']);
          }
        }, error => console.error(error));
    }
    else {
      this.SelectedDteAffiliationCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString()));
    }
   await this.loaderService.requestEnded();

  }
 

  async CheckExistsDETGovernmentCollege(SSOID: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.CheckExistsDETGovernmentCollege(SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          if (data['Data'][0][0]['Status'] == true) {
            this.routers.navigate(['/totalcollege']);
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

  //keyPressNumbers(event: any) {
  //  this.inputValidationService.keyPressNumbers(event);
  //}
  //keyPressNumbersWithDecimal(event: any) {
  //  this.inputValidationService.keyPressNumbersWithDecimal(event);
  //}

  get form() { return this.CollegeDetailsForm.controls; }
  get form_ContactDetails() { return this.CollegeDetailsForm_ContactDetails.controls; }
  get form_NearestGovernmentHospitals() { return this.CollegeDetailsForm_NearestGovernmentHospitals.controls; }

  async onFilechange(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (Type == 'CollegeLogo' || Type == 'WebsiteImage') {
          if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg') {
            //size validation
            if (this.file.size > 2000000) {
              this.ResetFileAndValidation(Type, 'Select less then 2MB File', '', '', '', false);
              this.toastr.error('Select more then 100kb File')
              return
            }
            if (this.file.size < 100000) {
              this.ResetFileAndValidation(Type, 'Select more then 100kb File', '', '', '', false);
              this.toastr.error('Select more then 100kb File')
              return
            }
          }
          else {
            this.toastr.warning('Select Only jpg/jpeg');
            // type validation
            this.ResetFileAndValidation(Type, 'Select Only jpg/jpeg', '', '', '', false);
            return
          }
        }
        else if (this.file.type == 'application/pdf') {
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
          this.ResetFileAndValidation(Type, 'Select Only pdf file', '', '', '', false);
          return
        }
        // upload to server folder
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, '', data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"], true);
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
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        event.target.value = null;
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DeleteImage(Type: string, file: string) {
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        // delete from server folder
        await this.fileUploadService.DeleteDocument(file).then((data: any) => {
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
  public files: any = '';
  ResetFileAndValidation(type: string, msg: string, name: string, path: string, dis_Name: string, isShowFile: boolean) {
    //event.target.value = '';
    try {
      this.loaderService.requestStarted();
      if (type == 'CollegeLogo') {
        this.showCollegeLogo = isShowFile;
        this.ProfileLogoValidationMessage = msg;
        this.request.CollegeLogo = name;
        this.request.CollegeLogoPath = path;
        this.request.CollegeLogo_Dis_FileName = dis_Name;
        this.files = document.getElementById('fCollegeLogo');
        this.files.value = '';
      }
      else if (type == 'WebsiteImage') {

        this.request.WebsiteImage = name;
        this.request.WebsiteImagePath = path;
        this.request.WebsiteImage_Dis_FileName = dis_Name;

        this.showWebsiteImage = isShowFile;

        this.WebsiteImageValidationMessage = msg;
        this.files = document.getElementById('CollegeWebsiteImage');
        this.files.value = '';
      }
      //else if (type == 'HospitalDocument') {
      //  this.showHospitalDocument = isShowFile;
      //  this.HospitalDocumentValidationMessage = msg;
      //  this.request_NearestGovernmentHospitals.HospitalDocument = name;
      //  this.request_NearestGovernmentHospitals.HospitalDocumentPath = path;
      //  this.request_NearestGovernmentHospitals.HospitalDocument_Dis_FileName = dis_Name;
      //  this.files = document.getElementById('fHospitalDocument');
      //  this.files.value = '';
      //}
      else if (type == 'NAACAccreditedCertificate') {
        this.showNAACAccreditedCertificate = isShowFile;
        this.NAACAccreditedCertificateValidationMessage = msg;
        this.request.NAACAccreditedCertificate = name;
        this.request.NAACAccreditedCertificatePath = path;
        this.request.NAACAccreditedCertificate_Dis_FileName = dis_Name;
      }
      else if (type == 'AffiliationDocument') {

        this.showAffiliationDocument = isShowFile;
        //this.showAffiliationDocument = isShowFile;
        this.AffiliationDocumentValidationMessage = msg;
        this.request.AffiliationDocument = name;
        this.request.AffiliationDocumentPath = path;
        this.request.AffiliationDocument_Dis_FileName = dis_Name;
      }
      else if (type == 'FundingSources') {
        this.FundingSourcesValidationMessage = msg;
        this.request.FundingSources = name;
        this.request.FundingSourcesPath = path;
        this.request.FundingSources_Dis_FileName = dis_Name;
      }
      else if (type == 'ICARDocument') {
        this.ICARDocumentValidationMessage = msg;
        this.request.ICARDocument = name;
        this.request.ICARDocumentPath = path;
        this.request.ICARDocument_Dis_FileName = dis_Name;
        this.files = document.getElementById('fICARDocument');
        this.files.value = '';
      }
      else if (type == 'UniversityAffiliationDocument') {
        this.showUniversityAffiliationDocument = isShowFile;
        this.AffiliationUniversityDocumentValidationMessage = msg;
        this.request.AffiliationUniversityDoc = name;
        this.request.AffiliationUniversityDocPath = path;
        this.request.AffiliationUniversityDoc_Dis_FileName = dis_Name;
      }
      else if (type == 'UniversityApproveTeachingFaculty') {
        this.showUniversityApproveTeachingFaculty = isShowFile;
        this.UniversityApproveTeachingFacultyValidationMessage = msg;
        this.request.UniversityApproveTeachingFacultyDoc = name;
        this.request.UniversityApproveTeachingFacultyDocPath = path;
        this.request.UniversityApproveTeachingFacultyDoc_Dis_FileName = dis_Name;
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

  async IsRuralOrUrban(isRural: boolean, section: string, isResetValue: boolean) {
    debugger;
    try {
      this.loaderService.requestStarted();
      if (isRural) {
        if (section == 'nearest') {
          this.IsRural_Nearest = isRural;
          if (isResetValue) {
            //this.request_NearestGovernmentHospitals.TehsilID = 0;
            // this.request_NearestGovernmentHospitals.CityID = 0;
            // this.request_NearestGovernmentHospitals.PanchayatSamitiID = 0;
          }
        }
        else {
          this.IsRural = isRural;
          if (isResetValue) {
            this.request.DistanceFromCity = null;
            //this.request.TehsilID = 0;
            this.request.CityID = 0;
            this.request.PanchayatSamitiID = 0;
          }
        }
      }
      else {
        if (section == 'nearest') {
          this.IsRural_Nearest = isRural;
          if (isResetValue) {
            //this.request_NearestGovernmentHospitals.TehsilID = 1;
            //this.request_NearestGovernmentHospitals.CityID = 0;
            // this.request_NearestGovernmentHospitals.PanchayatSamitiID = 0;
          }
        }
        else {
          this.IsRural = isRural;
          if (isResetValue) {
            this.request.DistanceFromCity = 0;
            //this.request.TehsilID = 1;
            this.request.CityID = 0;
            this.request.PanchayatSamitiID = 0;
          }
        }
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

  IsAISHECodeStatusOrNot(isAISHECodeStatus: boolean) {
    try {
      this.loaderService.requestStarted();
      this.IsAISHECodeStatus = isAISHECodeStatus;
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
  IsCollegeNAACAccreditedOrNot(isCollegeNAACAccredited: boolean) {
    debugger;
    try {
      this.loaderService.requestStarted();
      this.IsCollegeNAACAccredited = isCollegeNAACAccredited;
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
  IsAICTEEOAAdressOrNot(IsAICTEEOAAdress: boolean) {
    try {
      this.loaderService.requestStarted();
      this.IsAICTEEOAAdress = IsAICTEEOAAdress;
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

  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList_IsOpenNOCApplication()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentList = data['Data'];        
          
           this.DepartmentList = this.DepartmentList.filter((element: any) => {
             return element.DepartmentID == this.SelectedDepartmentID;
            });
         
          this.request.DepartmentID = this.SelectedDepartmentID;
          //this.IsEdits = true;

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

  async GetAllFinancialYear() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetAllFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.FinancialYearList = data['Data'];
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

  async GetAllDesignation() {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.commonMasterService.GetAllDesignation()
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DesignationList = data['Data'];
          console.log(this.State);
        });
    }
    catch (ex) {
      console.log(ex)
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async ddlPresentCollegeStatus_TextChange(event: any, SelectedPresentCollegeStatusID: string) {
    if (this.request.DepartmentID == 3) {
      try {
        this.loaderService.requestStarted();
        const SelectedPresentCollegeStatusID1 = Number(SelectedPresentCollegeStatusID);
        let SelectdNOCStatus = this.PresentCollegeStatusList_FilterData.find((x: { ID: number; }) => x.ID == SelectedPresentCollegeStatusID1).Name;
        if (SelectdNOCStatus == "TNOC Holder") {
          this.CollegeLevelList_FilterData = this.CollegeLevelList.filter((element: any) => {
            return element.Name == "UG";
          });
        }
        else {
          this.CollegeLevelList_FilterData = this.CollegeLevelList;
        }
      }
      catch (ex) {
        console.log(ex)
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoading = false;
        }, 200);
      }
    }
  }



  async FillDepartmentRelatedDDL() {   
    try {
      this.loaderService.requestStarted();
      this.request.TypeofCollege = "";
      const departmentId = Number(this.SelectedDepartmentID);
      this.request.PresentCollegeStatusID = 0;
      if (departmentId <= 0) {
        return;
      }
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "AffiliationCategory")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeStatusList = data['Data'];
          if (this.SelectedDepartmentID == 12 && this.AffiliationStatus != '') {
            this.CollegeStatusList = this.CollegeStatusList.filter((element: any) => { return element.Name.includes(this.AffiliationStatus); });
          }
          this.request.CollegeStatusID = this.CollegeStatusId;
          console.log(this.CollegeStatusId);
          this.IsEdits = true;
        }, error => console.error(error));
      // college level
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "CollegeLevel")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeLevelList = data['Data'];
          this.CollegeLevelList_FilterData = data['Data'];
          //this.CollegeLevelList_FilterData = this.CollegeLevelList.filter((element: any) => {
          //  return element.Name == "UG";
          //});
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "BTERBuildingStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StatusOfBuildingList_FilterData = data['Data'];

        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "AffiliationType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AffiliationTypeList_FilterData = data['Data'];

        }, error => console.error(error));
      // Present Status of College
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "PresentCollegeStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PresentCollegeStatusList = data['Data'];
          
        }, error => console.error(error));
      // College Type
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "CollegeType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeTypeList = data['Data'];         
        }, error => console.error(error));
      // College Medium
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "CollegeMedium")
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeMediumList = data['Data'];
          this.CollegeMediumList = this.CollegeMediumList.filter((element: any) => {
            return element.Name == "Both (Hindi & English)";
          });
          this.request.CollegeMedium = data['Data'][0]['ID'];
        }, error => console.error(error));
      //university 
      await this.commonMasterService.GetUniversityByDepartmentId(departmentId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.UniversityList = data['Data'];
          this.UniversityList = this.UniversityList.filter((element: any) => {
            return element.UniversityName == "Board of Technical Education Rajasthan";
          });
          this.request.UniversityID = data['Data'][0]['UniversityID'];

        }, error => console.error(error));

      //Management Type      
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "AffiliationManagementType")
        //await this.commonMasterService.GetCommonMasterList_DTEManagementType(departmentId, "AffiliationManagementType", this.request.ParentSSOID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ManagementTypeList = data['Data'];
          //this.ManagementTypeList = this.ManagementTypeList.filter(item => item.ID == this.request.AffiliationTypeID);
          

          //this.request.AffiliationTypeID = this.SelectedDepartmentID;
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
  async FillDivisionRelatedDDL(event: any, SelectedDivisionID: string, section: string,) {
    debugger;
    try {
      this.loaderService.requestStarted();
      const divisionId = Number(SelectedDivisionID);
      if (divisionId <= 0) {
        return;
      }
      // college status
      await this.commonMasterService.GetDistrictByDivsionId(divisionId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (section == 'nearest') {
            this.DistrictList_Nearest = data['Data'];
          }
          else {
            this.DistrictList = data['Data'];
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

  async FillDistrictRelatedDDL(event: any, SelectedDistrictID: string, section: string) {
    debugger;
    try {
      this.loaderService.requestStarted();
      const districtId = Number(SelectedDistrictID);
      if (districtId <= 0) {
        return;
      }
      // subdivision list
      await this.commonMasterService.GetSuvdivisionByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (section != 'nearest') {
            this.SuvdivisionList = data['Data'];
          }
        }, error => console.error(error));
      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (section == 'nearest') {
            this.TehsilList_Nearest = data['Data'];
          }
          else {
            this.TehsilList = data['Data'];
          }
        }, error => console.error(error));
      // PanchyatSamiti list
      await this.commonMasterService.GetPanchyatSamitiByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (section == 'nearest') {
            this.PanchyatSamitiList_Nearest = data['Data'];
          }
          else {
            this.PanchyatSamitiList = data['Data'];
          }
        }, error => console.error(error));
      // ParliamentArea list
      await this.commonMasterService.GetParliamentAreaByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (section != 'nearest') {
            this.ParliamentAreaList = data['Data'];
          }
        }, error => console.error(error));
      // AssembelyArea list
      await this.commonMasterService.GetAssembelyAreaByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (section != 'nearest') {
            this.AssembelyAreaList = data['Data'];
          }
        }, error => console.error(error));
      await this.commonMasterService.GetCityByDistrict(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (section == 'nearest') {
            this.CityList_Nearest = data['Data'][0]['data'];
          }
          else {
            this.CityList = data['Data'][0]['data'];
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

  AddContectDetail() {
    try {

      this.isSubmitted_ContactDetails = true;
      if (this.CollegeDetailsForm_ContactDetails.invalid) {
        return
      }
      this.loaderService.requestStarted();
      //debugger
      this.request.ContactDetailsList.push({
        ContactID: 0,
        CollegeDetailsID: 0,
        DesignationID: this.request_ContactDetailsDataModel.DesignationID,
        DesignationName: this.DesignationList.find((x: { DesignationID: number; }) => x.DesignationID == this.request_ContactDetailsDataModel.DesignationID)?.DesignationName,
        EmailAddress: this.request_ContactDetailsDataModel.EmailAddress,
        MobileNumber: this.request_ContactDetailsDataModel.MobileNumber,
        NameOfPerson: this.request_ContactDetailsDataModel.NameOfPerson,
        DTEAffiliationIDs: 0,
        PermanentAddress: this.request_ContactDetailsDataModel.PermanentAddress
      });
      // reset
      this.request_ContactDetailsDataModel.DesignationID = 0;
      this.request_ContactDetailsDataModel.DesignationName = '';
      this.request_ContactDetailsDataModel.EmailAddress = '';
      this.request_ContactDetailsDataModel.MobileNumber = '';
      this.request_ContactDetailsDataModel.NameOfPerson = '';
      this.request_ContactDetailsDataModel.PermanentAddress = '';
      this.isSubmitted_ContactDetails = false;
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


  AddNearestGovernmentHospitalsDetail() {
    try {

      if (this.request.NearestGovernmentHospitalsList.length >= 10) {
        this.toastr.error("You can't add more then 10.");
        return
      }
      this.isSubmitted_NearestGovernmentHospitals = true;
      let isValid = true;
      if (this.request_NearestGovernmentHospitals.RuralUrban == 1) {
        this.CollegeDetailsForm_NearestGovernmentHospitals.get('ddlCityID_Nearest')?.clearValidators();
        this.CollegeDetailsForm_NearestGovernmentHospitals.get('ddlPanchayatSamitiID_Nearest')?.setValidators([DropdownValidators]);
      }
      else {
        this.CollegeDetailsForm_NearestGovernmentHospitals.get('ddlCityID_Nearest')?.setValidators([DropdownValidators]);
        this.CollegeDetailsForm_NearestGovernmentHospitals.get('ddlPanchayatSamitiID_Nearest')?.clearValidators();
      }
      this.CollegeDetailsForm_NearestGovernmentHospitals.get('ddlCityID_Nearest')?.updateValueAndValidity();
      this.CollegeDetailsForm_NearestGovernmentHospitals.get('ddlPanchayatSamitiID_Nearest')?.updateValueAndValidity();
      if (this.CollegeDetailsForm_NearestGovernmentHospitals.invalid) {
        isValid = false;
      }
      if (!this.CustomValidate_NearestGovernmentHospitals()) {
        isValid = false;
      }
      if (this.HospitalDocumentValidationMessage != '') {
        isValid = false;
      }

      // all validate
      if (!isValid) {
        return;
      }
      this.loaderService.requestStarted();
      // some filter names
      this.request_NearestGovernmentHospitals.DivisionName = this.DivisionList.find((x: { DivisionID: number }) => x.DivisionID == this.request_NearestGovernmentHospitals.DivisionID)?.DivisionName;
      this.request_NearestGovernmentHospitals.DistrictName = this.DistrictList_Nearest.find((x: { DistrictID: number }) => x.DistrictID == this.request_NearestGovernmentHospitals.DistrictID)?.DistrictName;
      // rural/urban
      this.request_NearestGovernmentHospitals.RuralUrbanName = this.request_NearestGovernmentHospitals.RuralUrban == 1 ? 'Rural' : 'Urban';
      this.request_NearestGovernmentHospitals.TehsilName = this.TehsilList_Nearest.find((x: { TehsilID: number }) => x.TehsilID == this.request_NearestGovernmentHospitals.TehsilID)?.TehsilName;
      if (this.request_NearestGovernmentHospitals.RuralUrban == 1) {

        this.request_NearestGovernmentHospitals.PanchayatSamitiName = this.PanchyatSamitiList_Nearest.find((x: { PanchyatSamitiID: number }) => x.PanchyatSamitiID == this.request_NearestGovernmentHospitals.PanchayatSamitiID)?.PanchyatSamitiName;
      }
      else {
        this.request_NearestGovernmentHospitals.CityName = this.CityList_Nearest.find((x: { CityID: number }) => x.CityID == this.request_NearestGovernmentHospitals.CityID)?.City_English;
      }
      // add
      this.request.NearestGovernmentHospitalsList.push(this.request_NearestGovernmentHospitals);
      // reset
      this.request_NearestGovernmentHospitals = new NearestGovernmentHospitalsDataModel();

      //this.request.NearestGovernmentHospitalsList.push({
      //  CollegeDetailsID: 0,
      //  NearestGovernmentHospitalsID: 0,
      //  HospitalName: this.request_NearestGovernmentHospitals.HospitalName,
      //  HospitalRegNo: this.request_NearestGovernmentHospitals.HospitalRegNo,
      //  HospitalDocument: this.request_NearestGovernmentHospitals.HospitalDocument,
      //  AddressLine1: this.request_NearestGovernmentHospitals.AddressLine1,
      //  AddressLine2: this.request_NearestGovernmentHospitals.AddressLine2,
      //  RuralUrban: this.request_NearestGovernmentHospitals.RuralUrban,
      //  DivisionID: this.request_NearestGovernmentHospitals.DivisionID,
      //  DistrictID: this.request_NearestGovernmentHospitals.DistrictID,
      //  TehsilID: this.request_NearestGovernmentHospitals.TehsilID,
      //  PanchayatSamitiID: this.request_NearestGovernmentHospitals.PanchayatSamitiID,
      //  CityTownVillage: this.request_NearestGovernmentHospitals.CityTownVillage,
      //  Pincode: this.request_NearestGovernmentHospitals.Pincode,
      //  HospitalDistance: this.request_NearestGovernmentHospitals.HospitalDistance,
      //});
      // reset    
      //this.request_NearestGovernmentHospitals.HospitalName = '';
      //this.request_NearestGovernmentHospitals.HospitalRegNo = null;
      //this.request_NearestGovernmentHospitals.HospitalDocument = '';
      //this.request_NearestGovernmentHospitals.AddressLine1 = '';
      //this.request_NearestGovernmentHospitals.AddressLine2 = '';
      //this.request_NearestGovernmentHospitals.RuralUrban = null;
      //this.request_NearestGovernmentHospitals.DivisionID = 0;
      //this.request_NearestGovernmentHospitals.DistrictID = 0;
      //this.request_NearestGovernmentHospitals.TehsilID = 0;
      //this.request_NearestGovernmentHospitals.PanchayatSamitiID = 0;
      //this.request_NearestGovernmentHospitals.CityTownVillage = '';
      //this.request_NearestGovernmentHospitals.Pincode = null;
      //this.request_NearestGovernmentHospitals.HospitalDistance = 0;

      this.ResetFileAndValidation('HospitalDocument', '', '', '', '', false);

      this.isSubmitted_NearestGovernmentHospitals = false;
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

  DelContectDetail(item: ContactDetailsDataModel) {
    try {
      this.loaderService.requestStarted();
      //debugger
      if (confirm("Are you sure you want to delete this ?")) {
        const index: number = this.request.ContactDetailsList.indexOf(item);
        if (index != -1) {
          this.request.ContactDetailsList.splice(index, 1)
        }
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

  DelNearestGovernmentHospitalsDetail(item: NearestGovernmentHospitalsDataModel) {
    //debugger
    try {
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to delete this ?")) {
        const index: number = this.request.NearestGovernmentHospitalsList.indexOf(item);
        if (index != -1) {
          this.request.NearestGovernmentHospitalsList.splice(index, 1)
        }
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

  async SaveData() {
    debugger;
    this.request.CollegeLevelDetails = [];
    
    if (this.AffiliationStatus=='Existing') {
      this.CollegeDetailsForm.get('ddlYearofEstablishment')?.setValidators([DropdownValidators]);
      this.CollegeDetailsForm.get('ddlYearofEstablishment')?.updateValueAndValidity();      
    }
    else {
      this.CollegeDetailsForm.get('ddlYearofEstablishment')?.clearValidators();
      this.CollegeDetailsForm.get('ddlYearofEstablishment')?.updateValueAndValidity();   
     // this.CollegeDetailsForm.get('ddlPresentCollegeStatus')?.clearValidators();
    }    

    if (this.request.RuralUrban == 1) {
      this.CollegeDetailsForm.get('ddlPanchayatSamitiID')?.setValidators([DropdownValidators]);
      this.CollegeDetailsForm.get('ddlCityID')?.clearValidators();
    }
    else {
      this.CollegeDetailsForm.get('ddlPanchayatSamitiID')?.clearValidators();
      this.CollegeDetailsForm.get('ddlCityID')?.setValidators([DropdownValidators]);

    }
    this.CollegeDetailsForm.get('ddlPanchayatSamitiID')?.updateValueAndValidity();
    this.CollegeDetailsForm.get('ddlCityID')?.updateValueAndValidity(); 

    this.isValidCollegeLogo = false;
    this.isValidNAACAccreditedCertificate = false;
    this.isValidAffiliationDocument = false;
    this.isSubmitted = true;
    let isValid = true;    
    if (this.CollegeDetailsForm.invalid) {
      isValid = false;
      console.log(this.CollegeDetailsForm);
    }
    if (!this.CustomValidate()) {
      isValid = false;
    }
    //as par client >> Comment by rishi kapooor 05 08 2023 Ts and HTML Page
    //if (this.ProfileLogoValidationMessage != '') {
    //  isValid = false;
    //}
    if (this.request.AICTEEOAAdress == 2) {      
      if (this.request.AICTEEOADifferentAddress == null || this.request.AICTEEOADifferentAddress == '' || this.request.AICTEEOADifferentAddress == undefined) {
        isValid = false;
      }
    }
    
    if (this.request.CollegeNAACAccredited == 1) {
      if (this.request.NAACAccreditedCertificate == null || this.request.NAACAccreditedCertificate == '') {
        isValid = false;
        this.NAACAccreditedCertificateValidationMessage = 'This field is required .!';
      }
      if (this.request.NACCValidityDate == null || this.request.NACCValidityDate == '' || this.request.NACCValidityDate == undefined) {
        isValid = false;
      }
    }
    if (this.request.GCD_DesignationID>0) {
      if (this.request.GCD_MobileNumber == null || this.request.GCD_MobileNumber == '') {
        isValid = false;
        this.NAACAccreditedCertificateValidationMessage = 'This field is required .!';
      }
    }
    if (this.request.CollegeCode.length != 3) {
      this.toastr.error("College Code Enter must be three digits");
      isValid = false;
    }

     console.log(this.request.ContactDetailsList);

    if (!this.CollegeDetailsForm.invalid) {
      if (this.request.ContactDetailsList.length == 0) {
        this.toastr.error("Please add Contact Details");
        isValid = false;
      }
    }
    
    if (!isValid) {
      return;
    }



    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    console.log(this.request);
    try {
      await this.collegeService.SaveData(this.request)
        .then(async (data: any) => {
          debugger;
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage)
            window.location.reload();            
           // this.GetData();
           // this.is_disableDepartment = true;
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
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

  CustomValidate() {
    let isValid = true;
    //as par deparment updated by rishi kapoor 20123
    //if (this.request.CollegeLogo == null || this.request.CollegeLogo == undefined || this.request.CollegeLogo == '') {
    //  isValid = false;
    //  this.ProfileLogoValidationMessage = 'This field is required .!';
    //}
    //if (this.ProfileLogoValidationMessage != '') {
    //  isValid = false;
    //}

    return isValid;
  }

  async ddlCollegeStatus_TextChange(event: any, SelectedCollegeStatusID: string) {
    try {
      this.loaderService.requestStarted();

      const selectedCollegeStatusID = Number(SelectedCollegeStatusID);
      let SelectdCollegeStatusName = this.CollegeStatusList.find((x: { ID: number; }) => x.ID == selectedCollegeStatusID).Name;
      if (SelectdCollegeStatusName == "New") {

        this.IsExisting = false;

        if (this.request.DepartmentID == 3) {
          this.PresentCollegeStatusList_FilterData = this.PresentCollegeStatusList.filter((element: any) => {
            return element.Name == "TNOC Holder";
          });

        }
        else {
          this.PresentCollegeStatusList_FilterData = this.PresentCollegeStatusList;
        }

        if (this.request.DepartmentID == 2) {
          this.CollegeLevelList_FilterData = this.CollegeLevelList.filter((element: any) => {
            return element.Name != "PG";
          });
        }
        else if (this.request.DepartmentID == 4) {
          this.CollegeLevelList_FilterData = this.CollegeLevelList;
        }
        else if (this.request.DepartmentID == 9) {
          this.CollegeLevelList_FilterData = this.CollegeLevelList.filter((element: any) => {
            return element.Name == "Diploma";
          });
        }
        else {
          this.CollegeLevelList_FilterData = this.CollegeLevelList.filter((element: any) => {
            return element.Name == "UG";
          });
        }

      }
      else {
        this.IsExisting = true;
        /*if (this.request.DepartmentID != 3) {*/
        //this.PresentCollegeStatusList_FilterData = this.PresentCollegeStatusList.filter((element: any) => {
        //  return element.Name == "PNOC Holder";
        //});
        /* }*/
        this.PresentCollegeStatusList_FilterData = this.PresentCollegeStatusList;
        this.CollegeLevelList_FilterData = this.CollegeLevelList;
      }



    }
    catch (ex) {
      console.log(ex)
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async GetData() {   
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.IsEdit = true;

    try {
      await this.collegeService.GetBterData(this.request.DTEAffiliationID)
        .then(async (data: any) => {
          debugger;
          this.SelectedCollegeLevel = [];
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.request = JSON.parse(JSON.stringify(data['Data']));

          // manage some data
          if (this.request.GCD_MobileNumber.length == 0) {
            this.request.GCD_MobileNumber = null;
          }
          //console.log(this.request.RuralUrban);
         

          await this.IsAISHECodeStatusOrNot(this.request.AISHECodeStatus == 1 ? true : false)

         // await this.IsCollegeNAACAccreditedOrNot(this.request.CollegeNAACAccredited == 1 ? true : false)
          // department ddl
          //await this.FillDepartmentRelatedDDL();
          // college logo
          await this.ResetFileAndValidation('CollegeLogo', '', this.request.CollegeLogo, this.request.CollegeLogoPath, this.request.CollegeLogo_Dis_FileName, true);
          await this.ResetFileAndValidation('NAACAccreditedCertificate', '', this.request.NAACAccreditedCertificate, this.request.AffiliationDocumentPath, this.request.NAACAccreditedCertificate_Dis_FileName, true);

          await this.ResetFileAndValidation('AffiliationDocument', '', this.request.AffiliationDocument, this.request.AffiliationDocumentPath, this.request.AffiliationDocument_Dis_FileName, this.request.DepartmentID == 3 ? true : false);

          await this.ResetFileAndValidation('WebsiteImage', '', this.request.WebsiteImage, this.request.WebsiteImagePath, this.request.WebsiteImage_Dis_FileName, this.request.DepartmentID == 3 ? true : false);


          await this.ddlCollegeStatus_TextChange(null, this.request.CollegeStatusID.toString());
          this.request.PresentCollegeStatusID = data['Data']['PresentCollegeStatusID'];
          await this.ddlPresentCollegeStatus_TextChange(null, this.request.PresentCollegeStatusID.toString());
          this.SelectedCollegeLevel = this.request.CollegeLevelDetails;
          // division dll
          await this.FillDivisionRelatedDDL(null, this.request.DivisionID.toString(), null);
          // district status
          await this.FillDistrictRelatedDDL(null, this.request.DistrictID.toString(), null);
          // rural/urban
          await this.IsRuralOrUrban(this.request.RuralUrban == 1 ? true : false, null, false);
          //this.ManagementTypeList = this.ManagementTypeList.filter((element: any) => {
          //  return element.ID == this.request.AffiliationTypeID;
          //});
          //this.ManagementTypeList = this.ManagementTypeList.filter((element: any) => {
          //  return element.ID == this.request.AffiliationTypeID;
          //});

          //this.request.AffiliationTypeID = this.request.AffiliationTypeID;
          this.request.AffiliationTypeID = data['Data']['AffiliationTypeID'];
          this.request.AICTEEOAAdress = data['Data']['AICTEEOAAdress'];
          await this.IsAICTEEOAAdressOrNot(this.request.AICTEEOAAdress == 2 ? true : false);
          this.request.CollegeNAACAccredited = data['Data']['CollegeNAACAccredited'];
          await this.IsCollegeNAACAccreditedOrNot(this.request.CollegeNAACAccredited == 1 ? true : false)
          //alert(this.request.AffiliationDocument);
          this.request.AffiliationDocument = data['Data']['AffiliationDocument'];
          this.request.WebsiteImage = data['Data']['WebsiteImage'];

          this.request.TypeofCollege = data['Data']['TypeofCollege'];


          //await this.ddlCollegeType_TextChange(this.request.CollegeTypeID.toString())
          this.request.UniversityID = data['Data']['UniversityID'];
          await this.ResetFileAndValidation('UniversityAffiliationDocument', '', this.request.AffiliationUniversityDoc, this.request.AffiliationUniversityDocPath, this.request.AffiliationUniversityDoc_Dis_FileName, this.request.DepartmentID == 11 ? true : false);
          await this.ResetFileAndValidation('UniversityApproveTeachingFaculty', '', this.request.UniversityApproveTeachingFacultyDoc, this.request.UniversityApproveTeachingFacultyDocPath, this.request.UniversityApproveTeachingFacultyDoc_Dis_FileName, this.request.DepartmentID == 11 ? true : false);
          this.IsAffiliationtype = true;
          //if (!this.State) {
          //  //this.toastr.success(this.SuccessMessage)
          //}
          //else {
          //  this.toastr.error(this.ErrorMessage)
          //}
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
  CustomValidate_NearestGovernmentHospitals() {
    let isValid = true;
    if (this.request_NearestGovernmentHospitals.HospitalDocument == null || this.request_NearestGovernmentHospitals.HospitalDocument == undefined || this.request_NearestGovernmentHospitals.HospitalDocument == '') {
      isValid = false;
      this.HospitalDocumentValidationMessage = 'This field is required .!';
    }
    if (this.HospitalDocumentValidationMessage != '') {
      isValid = false;
    }

    return isValid;
  }
  btnCancel_Click() {
    this.routers.navigate(['/dashboard']);

  }

  MaxLengthValidation_KeyPress(event: any, length: number): boolean {
    if (event.target.value.length == length) {
      return false;
    }
    return true;
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
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }




  async GetCityByDistrict(SelectedDistrictID: string, section: string,) {
    try {
      this.loaderService.requestStarted();
      const DistrictID = Number(SelectedDistrictID);
      if (DistrictID <= 0) {
        return;
      }
      // college status
      await this.commonMasterService.GetCityByDistrict(DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (section == 'nearest') {
            this.CityList_Nearest = data['Data'];
          }
          else {
            this.CityList = data['Data'];
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
  public ShowHideotheruniversity: boolean = false;
  async OnChangeUnniversity(UniversityID: number) {

    try {
      this.request.OtherUniversityName = '';
      this.loaderService.requestStarted();
      var UniversityName = this.UniversityList.find((x: { UniversityID: number; }) => x.UniversityID == UniversityID)?.UniversityName;
      if (UniversityName == 'Other') {
        this.ShowHideotheruniversity = true;
      }
      else {
        this.ShowHideotheruniversity = false;
      }
    } catch (e) {
      console.log(e);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  //async FilterAffiliationCourseStatusBter() {
  //  try {
  //    await this.collegeService.FilterAffiliationCourseStatusBter(this.request.DTEAffiliationID)
  //      .then((data: any) => {
  //        debugger;
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.AffiliationTypeID = data['Data'][0]['AffiliationTypeID'];
  //        this.AffiliationTypeStatus = data['Data'][0]['Name'];
  //      }, (error: any) => console.error(error));
  //  }
  //  catch (Ex) {
  //    this.routers.navigate(['/affiliationregistration']);
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 0);
  //  }
  //}
}

