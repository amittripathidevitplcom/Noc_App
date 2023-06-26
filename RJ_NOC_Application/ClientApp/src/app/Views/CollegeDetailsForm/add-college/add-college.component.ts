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

@Injectable()

@Component({
  selector: 'app-add-college',
  templateUrl: './add-college.component.html',
  styleUrls: ['./add-college.component.css']
})
export class AddCollegeComponent implements OnInit {
  //Add FormBuilder
  CollegeDetailsForm!: FormGroup;
  CollegeDetailsForm_ContactDetails!: FormGroup;
  CollegeDetailsForm_NearestGovernmentHospitals!: FormGroup;

  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)
  public PinNoRegex = new RegExp(/[0-9]{6}/)

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isSubmitted_ContactDetails: boolean = false;
  public isSubmitted_NearestGovernmentHospitals: boolean = false;
  public file: File = null;
  public DepartmentList: any = [];
  public CollegeStatusList: any = [];
  public CollegeLevelList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public PresentCollegeStatusList: any = [];
  public CollegeTypeList: any = [];
  public CollegeMediumList: any = [];
  public UniversityList: any = [];
  public FinancialYearList: any = [];
  public SuvdivisionList: any = [];
  public TehsilList: any = [];
  public PanchyatSamitiList: any = [];
  public ParliamentAreaList: any = [];
  public AssembelyAreaList: any = [];
  public IsRural: boolean = true;
  public IsAISHECodeStatus: boolean = true;
  public PresentCollegeStatusList_FilterData: any = []
  public CollegeLevelList_FilterData: any = []
  public DesignationList: any = [];
  public ImageValidationMessage: string = '';
  public isValidCollegeLogo: boolean = false;
  public IsRural_Nearest: boolean = true;
  public DistrictList_Nearest: any = [];
  public TehsilList_Nearest: any = [];
  public PanchyatSamitiList_Nearest: any = [];

  public showCollegeLogo: boolean = false;
  public showHospitalDocument: boolean = false;
  public isValidHospitalDocument: boolean = false;
  public ProfileLogoValidationMessage: string = '';
  public HospitalDocumentValidationMessage: string = '';
  public QueryStringCollageID: number = 0;

  // login model
  sSOLoginDataModel = new SSOLoginDataModel();

  /*Save Data Model*/
  request = new CollegeDataModel();
  request_ContactDetailsDataModel = new ContactDetailsDataModel();
  request_NearestGovernmentHospitals = new NearestGovernmentHospitalsDataModel();

  constructor(private collegeService: CollegeService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService) {
  }

  async ngOnInit() {

    this.CollegeDetailsForm = this.formBuilder.group(
      {
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlCollegeStatus: ['', [DropdownValidators]],
        ddlPresentCollegeStatus: ['', [DropdownValidators]],
        ddlCollegeTypeID: ['', [DropdownValidators]],
        ddlCollegeLevelID: ['', [DropdownValidators]],
        txtCollegeNameEn: ['', Validators.required],
        txtCollegeNameHi: ['', Validators.required],
        AISHECodeStatus: [''],
        txtAISHECode: [''],
        ddlCollegeMedium: ['', [DropdownValidators]],
        ddlUniversityID: ['', [DropdownValidators]],
        txtMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtEmail: ['', [Validators.required, Validators.email]],
        txtAddressLine1: ['', Validators.required],
        txtAddressLine2: ['', Validators.required],
        rbRuralUrban: ['', Validators.required],
        txtDistanceFromCity: ['', Validators.required],
        ddlDivisionID: ['', [DropdownValidators]],
        ddlDistrictID: ['', [DropdownValidators]],
        ddlSubdivisionID: ['', [DropdownValidators]],
        ddlTehsilID: ['', [DropdownValidators]],
        ddlPanchayatSamitiID: ['', [DropdownValidators]],
        ddlParliamentAreaID: ['', [DropdownValidators]],
        ddlAssemblyAreaID: ['', [DropdownValidators]],
        txtCityTownVillage: ['', Validators.required],
        ddlYearofEstablishment: ['', [DropdownValidators]],
        txtPincode: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],
        txtWebsiteLink: [''],
        txtCDNameOfPerson: [''],// handle in sub form
        txtCDDesignation: [''],// handle in sub form
        txtCDMobileNumber: [''],// handle in sub form
        txtCDEmailAddress: [''],// handle in sub form
        ddlGCD_DesignationID: [''],
        txtGCD_MobileNumber: ['', [Validators.pattern(this.MobileNoRegex)]],
        txtGCD_LandlineNumber: [''],
        txtTGC_Latitude: [''],
        txtTGC_Longitude: [''],
      })

    this.CollegeDetailsForm_ContactDetails = this.formBuilder.group(
      {
        txtCDNameOfPerson: ['', Validators.required],
        ddlCDDesignationID: ['', [DropdownValidators]],
        txtCDMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtCDEmailAddress: ['', [Validators.required, Validators.email]],
      })

    this.CollegeDetailsForm_NearestGovernmentHospitals = this.formBuilder.group(
      {
        txtHospitalName: ['', Validators.required],
        txtHospitalRegNo: ['', Validators.required],
        fHospitalDocument: ['', Validators.required],
        txtHospitalDistance: ['', Validators.required],
        txtAddressLine1_Nearest: ['', Validators.required],
        txtAddressLine2_Nearest: ['', Validators.required],
        rbRuralUrban_Nearest: ['', Validators.required],
        ddlDivisionID_Nearest: ['', [DropdownValidators]],
        ddlDistrictID_Nearest: ['', [DropdownValidators]],
        ddlTehsilID_Nearest: ['', [DropdownValidators]],
        ddlPanchayatSamitiID_Nearest: ['', [DropdownValidators]],
        txtCityTownVillage_Nearest: ['', Validators.required],
        txtPincode_Nearest: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]]
      })

    // query string
    this.QueryStringCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
        
    this.request.ContactDetailsList = [];
    this.request.NearestGovernmentHospitalsList = [];

    // department
    await this.GetDepartmentList();
    // division
    await this.GetDivisionList();
    // FinancialYear
    await this.GetAllFinancialYear();
    // get all Designation
    await this.GetAllDesignation();

    // get college by id
    if (this.QueryStringCollageID > 0) {
      await this.GetData();
      this.request.ModifyBy = 1;
    }
    else {
      this.request.CreatedBy = 1;
      this.request.ModifyBy = 1;
    }
    // sso id
    this.request.ParentSSOID = this.sSOLoginDataModel.SSOID;
    this.request.MappingSSOID = this.sSOLoginDataModel.SSOID;

  }

  get form() { return this.CollegeDetailsForm.controls; }
  get form_ContactDetails() { return this.CollegeDetailsForm_ContactDetails.controls; }
  get form_NearestGovernmentHospitals() { return this.CollegeDetailsForm_NearestGovernmentHospitals.controls; }

  onFilechange(event: any, Type: string) {
    this.file = event.target.files[0];
    if (this.file) {
      if (this.file.type === 'image/jpeg' ||
        this.file.type === 'application/pdf' ||
        this.file.type === 'image/jpg') {
        //size validation
        if (this.file.size > 2000000) {
          this.ResetFileAndValidation(Type, 'Select less then 2MB File', '', false);
          return
        }
        if (this.file.size < 100000) {
          this.ResetFileAndValidation(Type, 'Select more then 100kb File', '', false);
          return
        }
      }
      else {// type validation
        this.ResetFileAndValidation(Type, 'Select Only jpg/jpeg/pdf file', '', false);
        return
      }
      // upload to server folder
      this.fileUploadService.UploadDocument(this.file).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.ResetFileAndValidation(Type, '', data['Data'][0]["FilePath"], true);
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
      this.ResetFileAndValidation(Type, '', '', false);
    }
  }

  DeleteImage(Type: string) {
    let path: string = '';
    if (Type == 'CollegeLogo') {
      path = this.request.CollegeLogo;
    }
    else if (Type == 'HospitalDocument') {
      path = this.request_NearestGovernmentHospitals.HospitalDocument;
    }
    // delete from server folder
    this.fileUploadService.DeleteDocument(path).then((data: any) => {
      this.State = data['State'];
      this.SuccessMessage = data['SuccessMessage'];
      this.ErrorMessage = data['ErrorMessage'];
      if (this.State == 0) {
        this.ResetFileAndValidation(Type, '', '', false);
      }
      if (this.State == 1) {
        this.toastr.error(this.ErrorMessage)
      }
      else if (this.State == 2) {
        this.toastr.warning(this.ErrorMessage)
      }
    });
  }

  ResetFileAndValidation(type: string, msg: string, path: string, isShowFile: boolean) {
    //event.target.value = '';
    if (type == 'CollegeLogo') {
      this.showCollegeLogo = isShowFile;
      this.ProfileLogoValidationMessage = msg;
      this.request.CollegeLogo = path;
    }
    else if (type == 'HospitalDocument') {
      this.showHospitalDocument = isShowFile;
      this.HospitalDocumentValidationMessage = msg;
      this.request_NearestGovernmentHospitals.HospitalDocument = path;
    }
  }

  async IsRuralOrUrban(isRural: boolean, section: string, isResetValue: boolean) {
    if (isRural) {
      if (section == 'nearest') {
        this.IsRural_Nearest = isRural;
        if (isResetValue) {
          this.request_NearestGovernmentHospitals.TehsilID = 0;
          this.request_NearestGovernmentHospitals.PanchayatSamitiID = 0;
        }
      }
      else {
        this.IsRural = isRural;
        if (isResetValue) {
          this.request.DistanceFromCity = null;
          this.request.TehsilID = 0;
          this.request.PanchayatSamitiID = 0;
        }
      }
    }
    else {
      if (section == 'nearest') {
        this.IsRural_Nearest = isRural;
        if (isResetValue) {
          this.request_NearestGovernmentHospitals.TehsilID = 1;
          this.request_NearestGovernmentHospitals.PanchayatSamitiID = 1;
        }
      }
      else {
        this.IsRural = isRural;
        if (isResetValue) {
          this.request.DistanceFromCity = 0;
          this.request.TehsilID = 1;
          this.request.PanchayatSamitiID = 1;
        }
      }
    }
  }

  IsAISHECodeStatusOrNot(isAISHECodeStatus: boolean) {
    this.IsAISHECodeStatus = isAISHECodeStatus;
  }

  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentList = data['Data'];
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

  async ddlCollegeStatus_TextChange(event: any, SelectedCollegeStatusID: string) {
    const selectedCollegeStatusID = Number(SelectedCollegeStatusID);
    let SelectdCollegeStatusName = this.CollegeStatusList.find((x: { ID: number; }) => x.ID == selectedCollegeStatusID).Name;

    if (SelectdCollegeStatusName == "New") {
      this.PresentCollegeStatusList_FilterData = this.PresentCollegeStatusList.filter((element: any) => {
        return element.Name == "TNOC";
      });

      this.CollegeLevelList_FilterData = this.CollegeLevelList.filter((element: any) => {
        return element.Name == "UG";
      });

    }
    else {
      this.PresentCollegeStatusList_FilterData = this.PresentCollegeStatusList;
      this.CollegeLevelList_FilterData = this.CollegeLevelList;
    }
  }

  async FillDepartmentRelatedDDL(event: any, SeletedDepartmentID: string) {
    try {
      this.loaderService.requestStarted();
      const departmentId = Number(SeletedDepartmentID);
      if (departmentId <= 0) {
        return;
      }
      // college status
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "CourseType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeStatusList = data['Data'];
        }, error => console.error(error));
      // college level
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "CourseLevel")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeLevelList = data['Data'];
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
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeMediumList = data['Data'];
        }, error => console.error(error));
      // university 
      await this.commonMasterService.GetUniversityByDepartmentId(departmentId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.UniversityList = data['Data'];
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
    this.isSubmitted_ContactDetails = true;
    if (this.CollegeDetailsForm_ContactDetails.invalid) {
      return
    }

    //debugger
    this.request.ContactDetailsList.push({
      ContactID: 0,
      CollegeDetailsID: 0,
      DesignationID: this.request_ContactDetailsDataModel.DesignationID,
      EmailAddress: this.request_ContactDetailsDataModel.EmailAddress,
      MobileNumber: this.request_ContactDetailsDataModel.MobileNumber,
      NameOfPerson: this.request_ContactDetailsDataModel.NameOfPerson
    });
    // reset
    this.request_ContactDetailsDataModel.DesignationID = 0;
    this.request_ContactDetailsDataModel.EmailAddress = '';
    this.request_ContactDetailsDataModel.MobileNumber = null;
    this.request_ContactDetailsDataModel.NameOfPerson = '';
    this.isSubmitted_ContactDetails = false;
  }

  AddNearestGovernmentHospitalsDetail() {
    this.isSubmitted_NearestGovernmentHospitals = true;
    if (this.CollegeDetailsForm_NearestGovernmentHospitals.invalid) {
      return
    }
    if (this.request.NearestGovernmentHospitalsList.length >= 10) {
      this.toastr.error("You can't add more then 10.");
      return
    }

    //debugger
    this.request.NearestGovernmentHospitalsList.push({
      CollegeDetailsID: 0,
      NearestGovernmentHospitalsID: 0,
      HospitalName: this.request_NearestGovernmentHospitals.HospitalName,
      HospitalRegNo: this.request_NearestGovernmentHospitals.HospitalRegNo,
      HospitalDocument: this.request_NearestGovernmentHospitals.HospitalDocument,
      AddressLine1: this.request_NearestGovernmentHospitals.AddressLine1,
      AddressLine2: this.request_NearestGovernmentHospitals.AddressLine2,
      RuralUrban: this.request_NearestGovernmentHospitals.RuralUrban,
      DivisionID: this.request_NearestGovernmentHospitals.DivisionID,
      DistrictID: this.request_NearestGovernmentHospitals.DistrictID,
      TehsilID: this.request_NearestGovernmentHospitals.TehsilID,
      PanchayatSamitiID: this.request_NearestGovernmentHospitals.PanchayatSamitiID,
      CityTownVillage: this.request_NearestGovernmentHospitals.CityTownVillage,
      Pincode: this.request_NearestGovernmentHospitals.Pincode,
      HospitalDistance: this.request_NearestGovernmentHospitals.HospitalDistance,
    });
    // reset
    this.request_NearestGovernmentHospitals.HospitalName = '';
    this.request_NearestGovernmentHospitals.HospitalRegNo = null;
    this.request_NearestGovernmentHospitals.HospitalDocument = '';
    this.request_NearestGovernmentHospitals.AddressLine1 = '';
    this.request_NearestGovernmentHospitals.AddressLine2 = '';
    this.request_NearestGovernmentHospitals.RuralUrban = null;
    this.request_NearestGovernmentHospitals.DivisionID = 0;
    this.request_NearestGovernmentHospitals.DistrictID = 0;
    this.request_NearestGovernmentHospitals.TehsilID = 0;
    this.request_NearestGovernmentHospitals.PanchayatSamitiID = 0;
    this.request_NearestGovernmentHospitals.CityTownVillage = '';
    this.request_NearestGovernmentHospitals.Pincode = null;
    this.request_NearestGovernmentHospitals.HospitalDistance = 0;

    this.ResetFileAndValidation('HospitalDocument', '', '', false);

    this.isSubmitted_NearestGovernmentHospitals = false;
  }

  DelContectDetail(item: ContactDetailsDataModel) {
    //debugger
    const index: number = this.request.ContactDetailsList.indexOf(item);
    if (index != -1) {
      this.request.ContactDetailsList.splice(index, 1)
    }
  }

  DelNearestGovernmentHospitalsDetail(item: NearestGovernmentHospitalsDataModel) {
    //debugger
    const index: number = this.request.NearestGovernmentHospitalsList.indexOf(item);
    if (index != -1) {
      this.request.NearestGovernmentHospitalsList.splice(index, 1)
    }
  }

  async SaveData() {
    this.isValidCollegeLogo = false;
    this.isSubmitted = true;

    let isValid = true;
    if (this.CollegeDetailsForm.invalid) {
      isValid = false;
    }
    if (!this.CustomValidate()) {
      isValid = false;
    }
    if (this.ProfileLogoValidationMessage != '') {
      isValid = false;
    }
   
    // all validate
    if (!isValid) {
      return;
    }

    if (this.request.NearestGovernmentHospitalsList.length == 0) {
      this.toastr.error("Please add government hospitals nearest to the institution");
      isValid = false;
    }
    if (this.request.ContactDetailsList.length == 0) {
      this.toastr.error("Please add Contact Details");
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.collegeService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            setTimeout(() => {
              this.routers.navigate(['/addcourses']);
            }, 500);

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
    if (this.request.CollegeLogo == null || this.request.CollegeLogo == undefined || this.request.CollegeLogo == '') {
      isValid = false;
      this.ProfileLogoValidationMessage = 'This field is required .!';
    }
    if (this.ProfileLogoValidationMessage != '') {
      isValid = false;
    }

    return isValid;
  }

  async GetData() {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.collegeService.GetData(this.QueryStringCollageID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.request = JSON.parse(JSON.stringify(data['Data']));
          // manage some data
          if (this.request.GCD_MobileNumber == 0) {
            this.request.GCD_MobileNumber = null;
          }
          //console.log(this.request.RuralUrban);

          // department ddl
          await this.FillDepartmentRelatedDDL(null, this.request.DepartmentID.toString());
          // college logo
          await this.ResetFileAndValidation('CollegeLogo', '', this.request.CollegeLogo, true);
          // college status
          await this.ddlCollegeStatus_TextChange(null, this.request.CollegeStatusID.toString())
          // division dll
          await this.FillDivisionRelatedDDL(null, this.request.DivisionID.toString(), null);
          // district status
          await this.FillDistrictRelatedDDL(null, this.request.DistrictID.toString(), null);
          // rural/urban
          await this.IsRuralOrUrban(this.request.RuralUrban == 1 ? true : false, null, false);

          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
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

  btnCancel_Click() {
    this.routers.navigate(['/dashboard']);

  }


}
