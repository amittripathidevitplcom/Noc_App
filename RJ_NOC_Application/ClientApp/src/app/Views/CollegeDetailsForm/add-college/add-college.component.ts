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
  public file: File = null;
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
  public IsExisting: boolean = false;
  public PresentCollegeStatusList_FilterData: any = []
  public CollegeLevelList_FilterData: any = []
  public DesignationList: any = [];
  public ImageValidationMessage: string = '';
  public isValidCollegeLogo: boolean = false;
  public isValidNAACAccreditedCertificate: boolean = false;
  public IsRural_Nearest: boolean = true;
  public DistrictList_Nearest: any = [];
  public TehsilList_Nearest: any = [];
  public PanchyatSamitiList_Nearest: any = [];

  public showCollegeLogo: boolean = false;
  public IsEdit: boolean = false;
  public showNAACAccreditedCertificate: boolean = false;
  public showHospitalDocument: boolean = false;
  public isValidHospitalDocument: boolean = false;
  public ProfileLogoValidationMessage: string = '';
  public AISHECodeValidationMessage: string = '';
  public NAACAccreditedCertificateValidationMessage: string = '';
  public NACCValidityDateValidationMessage: string = '';
  public HospitalDocumentValidationMessage: string = '';
  public QueryStringCollageID: number = 0;
  public MinDate: Date = new Date;
  public DistancefromCity: string = "Distance from City(km)";

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
  constructor(private legalEntityListService: LegalEntityService, private collegeService: CollegeService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService) {
  }

  async ngOnInit() {

    this.CollegeDetailsForm = this.formBuilder.group(
      {
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlTypeofCollege: ['', Validators.required],
        ddlCollegeStatus: ['', [DropdownValidators]],
        ddlPresentCollegeStatus: ['', [DropdownValidators]],
        ddlCollegeTypeID: ['', [DropdownValidators]],
        ddlCollegeLevelID: [''],
        ddlDTECollegeLevelID: [''],
        ddlManagementType: [''],
        //txtCollegeCode: ['', Validators.required],
        txtCollegeCode: [''],
        txtCollegeNameEn: ['', Validators.required],
        txtCollegeNameHi: ['', Validators.required],
        AISHECodeStatus: ['', Validators.required],
        CollegeNAACAccredited: ['', Validators.required],
        txtAISHECode: [''],
        ddlCollegeMedium: ['', [DropdownValidators]],
        ddlUniversityID: ['', [DropdownValidators]],
        txtMobileNumber: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]],
        txtCollegeLandlineNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10,12}$")]],

        txtEmail: ['', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
        txtAddressLine1: ['', Validators.required],
        //txtAddressLine2: ['', Validators.required],
        txtAddressLine2: [''],
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
        txtCDEmailAddress: ['', Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")],// handle in sub form
        ddlGCD_DesignationID: [''],
        txtGCD_MobileNumber: ['', [Validators.pattern("^[6-9][0-9]{9}$")]],
        txtGCD_LandlineNumber: ['', [Validators.pattern("^[0-9]{10,12}$")]],
        txtTGC_Latitude: [''],
        txtTGC_Longitude: [''],
        fCollegeLogo: [''],
        NAACAccreditedCertificate: [''],
        txtNACCValidityDate: [''],
        ddlCityID: ['', [DropdownValidators]],
        txtUniversity: ['']
      })

    this.CollegeDetailsForm_ContactDetails = this.formBuilder.group(
      {
        txtCDNameOfPerson: ['', Validators.required],
        ddlCDDesignationID: ['', [DropdownValidators]],
        txtCDMobileNumber: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]],
        txtCDEmailAddress: ['', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      })

    this.CollegeDetailsForm_NearestGovernmentHospitals = this.formBuilder.group(
      {
        txtHospitalName: ['', Validators.required],
        txtHospitalRegNo: ['', Validators.required],
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
    this.QueryStringCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

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



    try {
      this.loaderService.requestStarted();
      await this.legalEntityListService.GetLegalEntityBySSOID(this.request.ParentSSOID, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (data['Data'][0]['data']['Table'].length == 0) {
            this.toastr.warning("Add Legal Entity After Add College.!");
            setTimeout(() => {
              this.routers.navigate(['/legalentity']);
            }, 500);

          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      this.routers.navigate(['/legalentity']);
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 0);
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
        if (Type == 'CollegeLogo') {
          if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg') {
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
      }
      else if (type == 'HospitalDocument') {
        this.showHospitalDocument = isShowFile;
        this.HospitalDocumentValidationMessage = msg;
        this.request_NearestGovernmentHospitals.HospitalDocument = name;
        this.request_NearestGovernmentHospitals.HospitalDocumentPath = path;
        this.request_NearestGovernmentHospitals.HospitalDocument_Dis_FileName = dis_Name;
        this.files = document.getElementById('fHospitalDocument');
        this.files.value = '';
      }
      else if (type == 'NAACAccreditedCertificate') {
        this.showNAACAccreditedCertificate = isShowFile;
        this.NAACAccreditedCertificateValidationMessage = msg;
        this.request.NAACAccreditedCertificate = name;
        this.request.NAACAccreditedCertificatePath = path;
        this.request.NAACAccreditedCertificate_Dis_FileName = dis_Name;
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
    try {
      this.loaderService.requestStarted();
      if (isRural) {
        if (section == 'nearest') {
          this.IsRural_Nearest = isRural;
          if (isResetValue) {
            //this.request_NearestGovernmentHospitals.TehsilID = 0;
            this.request_NearestGovernmentHospitals.CityID = 0;
            this.request_NearestGovernmentHospitals.PanchayatSamitiID = 0;
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
            this.request_NearestGovernmentHospitals.CityID = 0;
            this.request_NearestGovernmentHospitals.PanchayatSamitiID = 0;
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



  async FillDepartmentRelatedDDL(event: any, SeletedDepartmentID: string) {
    try {
      this.loaderService.requestStarted();
      this.request.TypeofCollege = "";
      const departmentId = Number(SeletedDepartmentID);
      if (SeletedDepartmentID == "2") {
        this.DistancefromCity = "Distance from District Headquater"
      }
      else {
        this.DistancefromCity = "Distance from City(km)"
      }
      this.request.PresentCollegeStatusID = 0;
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
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "CollegeLevel")
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
          // general filter
          let departmentName = this.DepartmentList.find((x: { DepartmentID: number }) => x.DepartmentID == departmentId)?.DepartmentName;
          if (departmentName == 'Medical Group 3') {
            this.CollegeTypeList = data['Data'].filter((element: any) => { return element.Name.includes('General'); });
          }
          else {// all
            this.CollegeTypeList = data['Data'];
          }
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

      //Management Type
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "DTEManagementType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ManagementTypeList = data['Data'];
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
        NameOfPerson: this.request_ContactDetailsDataModel.NameOfPerson
      });
      // reset
      this.request_ContactDetailsDataModel.DesignationID = 0;
      this.request_ContactDetailsDataModel.DesignationName = '';
      this.request_ContactDetailsDataModel.EmailAddress = '';
      this.request_ContactDetailsDataModel.MobileNumber = '';
      this.request_ContactDetailsDataModel.NameOfPerson = '';
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
    this.request.CollegeLevelDetails = [];
    if (this.IsExisting == true) {
      this.CollegeDetailsForm.get('ddlYearofEstablishment')?.setValidators([DropdownValidators]);
      //this.CollegeDetailsForm.get('AISHECodeStatus')?.setValidators([DropdownValidators]);
      this.CollegeDetailsForm.get('ddlPresentCollegeStatus')?.setValidators([DropdownValidators]);
    }
    else {
      this.CollegeDetailsForm.get('ddlYearofEstablishment')?.clearValidators();
      //this.CollegeDetailsForm.get('AISHECodeStatus')?.clearValidators();
      this.CollegeDetailsForm.get('ddlPresentCollegeStatus')?.clearValidators();
    }
    this.CollegeDetailsForm.get('ddlYearofEstablishment')?.updateValueAndValidity();
    //this.CollegeDetailsForm.get('AISHECodeStatus')?.updateValueAndValidity();
    this.CollegeDetailsForm.get('ddlPresentCollegeStatus')?.updateValueAndValidity();

    console.log(this.request.RuralUrban);
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


    if (this.request.DepartmentID == 3) {
      this.CollegeDetailsForm.get('AISHECodeStatus')?.setValidators([Validators.required]);
    }
    else {
      this.CollegeDetailsForm.get('AISHECodeStatus')?.clearValidators();
    }
    this.CollegeDetailsForm.get('AISHECodeStatus')?.updateValueAndValidity();

    if (this.request.DepartmentID == 5) {
      this.CollegeDetailsForm.get('ddlTypeofCollege')?.setValidators([Validators.required]);
    }
    else {
      this.CollegeDetailsForm.get('ddlTypeofCollege')?.clearValidators();
    }
    this.CollegeDetailsForm.get('ddlTypeofCollege')?.updateValueAndValidity();



    this.isValidCollegeLogo = false;
    this.isValidNAACAccreditedCertificate = false;
    this.isSubmitted = true;

    console.log(this.request.NACCValidityDate);

    console.log(this.CollegeDetailsForm);
    let isValid = true;
    if (this.CollegeDetailsForm.invalid) {
      isValid = false;
    }
    if (!this.CustomValidate()) {
      isValid = false;
    }
    //as par client >> Comment by rishi kapooor 05 08 2023 Ts and HTML Page
    //if (this.ProfileLogoValidationMessage != '') {
    //  isValid = false;
    //}
    //if (this.IsExisting == true) {
    //  if (this.request.AISHECodeStatus == 1) {
    //    if (this.request.AISHECode == null || this.request.AISHECode == '') {
    //      isValid = false;
    //      this.AISHECodeValidationMessage = 'This field is required .!';
    //    }
    //  }
    //}
    if (this.request.CollegeNAACAccredited == 1) {
      if (this.request.NAACAccreditedCertificate == null || this.request.NAACAccreditedCertificate == '') {
        isValid = false;
        this.NAACAccreditedCertificateValidationMessage = 'This field is required .!';
      }
      if (this.request.NACCValidityDate == null || this.request.NACCValidityDate == '' || this.request.NACCValidityDate == undefined) {
        isValid = false;
      }
    }
    if (this.request.DepartmentID == 4) {
      if (this.SelectedCollegeLevel.length > 0) {
        for (var i = 0; i < this.SelectedCollegeLevel.length; i++) {
          this.request.CollegeLevelDetails.push({
            AID: 0,
            CollegeID: 0,
            ID: this.SelectedCollegeLevel[i].ID,
            Name: ''
          })
        }
      }
      else {
        isValid = false;
      }
      if (this.ShowHideotheruniversity && this.request.OtherUniversityName == '') {
        isValid = false;
      }
      if (this.request.ManagementTypeID <= 0) {
        isValid = false;
      }
    }
    else {
      if (this.request.CollegeLevelID <= 0) {
        isValid = false;
      }
    }
    // all validate
    //if (!isValid) {
    //  console.log(this.CollegeDetailsForm);
    //  return;
    //}
    if (this.request.DepartmentID == 6) {
      if (this.request.NearestGovernmentHospitalsList.length == 0) {
        this.toastr.error("Please add government hospitals nearest to the institution");
        isValid = false;
      }
    }

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
              if (this.request.DepartmentID == 5) {
                this.routers.navigate(['/totalcollege']);
              }
              else {
                this.routers.navigate(['/addcourses']);
              }
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

  async GetData() {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.IsEdit = true;

    try {
      await this.collegeService.GetData(this.QueryStringCollageID)
        .then(async (data: any) => {
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

          await this.IsCollegeNAACAccreditedOrNot(this.request.CollegeNAACAccredited == 1 ? true : false)
          // department ddl
          await this.FillDepartmentRelatedDDL(null, this.request.DepartmentID.toString());
          // college logo
          await this.ResetFileAndValidation('CollegeLogo', '', this.request.CollegeLogo, this.request.CollegeLogoPath, this.request.CollegeLogo_Dis_FileName, true);
          await this.ResetFileAndValidation('NAACAccreditedCertificate', '', this.request.NAACAccreditedCertificate, this.request.NAACAccreditedCertificatePath, this.request.NAACAccreditedCertificate_Dis_FileName, true);
          // college status
          await this.ddlCollegeStatus_TextChange(null, this.request.CollegeStatusID.toString())
          this.request.PresentCollegeStatusID = data['Data']['PresentCollegeStatusID'];
          await this.ddlPresentCollegeStatus_TextChange(null, this.request.PresentCollegeStatusID.toString());
          this.SelectedCollegeLevel = this.request.CollegeLevelDetails;
          // division dll
          await this.FillDivisionRelatedDDL(null, this.request.DivisionID.toString(), null);
          // district status
          await this.FillDistrictRelatedDDL(null, this.request.DistrictID.toString(), null);
          // rural/urban
          await this.IsRuralOrUrban(this.request.RuralUrban == 1 ? true : false, null, false);


          this.request.CollegeNAACAccredited = data['Data']['CollegeNAACAccredited'];
          await this.IsCollegeNAACAccreditedOrNot(this.request.CollegeNAACAccredited == 1 ? true : false)
          this.request.TypeofCollege = data['Data']['TypeofCollege'];

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

  async ddlCollegeType_TextChange(SelectedCollegeTypeID: string) {
    if (this.request.DepartmentID == 3) {
      let Item = this.CollegeTypeList.filter((element: any) => {
        return element.ID == SelectedCollegeTypeID;
      });

      if (Item[0]['Name'] == 'Law Co-ed' || Item[0]['Name'] == 'Law Girls') {
        await this.commonMasterService.GetUniversityByDepartmentId(this.request.DepartmentID, 1)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.UniversityList = data['Data'];
          }, error => console.error(error));
      }
      else {
        await this.commonMasterService.GetUniversityByDepartmentId(this.request.DepartmentID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.UniversityList = data['Data'];
          }, error => console.error(error));
      }

    }
    //  console.log(Item[0]['Name']);

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
}
