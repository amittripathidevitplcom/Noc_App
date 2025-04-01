import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { SocietyDataModel } from '../../../../Models/SocietyDataModel';
import { SocityService } from '../../../../Services/Master/SocietyManagement/socity.service';
import { FileUploadService } from '../../../../Services/FileUpload/file-upload.service';

import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { Clipboard } from '@angular/cdk/clipboard';
/*import * as jsPDF from 'jspdf'*/

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';
import { GlobalConstants } from '../../../../Common/GlobalConstants';

@Injectable()

@Component({
  selector: 'app-society',
  templateUrl: './society.component.html',
  styleUrls: ['./society.component.css']
})
export class SocietyComponent implements OnInit {


  //Add FormBuilder
  SocietyDetailsForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public files: File = null;
  public isAuthorizedOrNot: boolean = false;
  public CollegeList: any = [];
  public DesignationList: any = [];
  public OccupationList: any = [];
  public SocietyList: any = [];
  public SocietyAllList: any = [];
  public FilterSocietyAllList: any = [];
  public SocietyList_dummy: SocietyDataModel[] = [];

  public isDisabledGrid: boolean = false;
  public isDisabledPrimary: boolean = true;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  isEdit: boolean = false;

  public isView: boolean = true;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;
  public isDeleteButton: boolean = true;
  public isPrint: boolean = true;
  public CurrentPageName: any = "";
  public UserID: number = 0;
  public Femalepre: number = 0;
  searchText: string = '';
  GetIsPrimary: string = '';
  GetMobileNo: string = '';
  GetEmail: string = '';
  GetAadhaarNo: string = '';
  GetPANNo: string = '';
  public dropdownList: any = [];
  public dropdownSettings: IDropdownSettings = {};

  // ssologin model
  ssoLoginModel = new SSOLoginDataModel();
  /*Save Data Model*/
  request = new SocietyDataModel();

  public ImageValidationMessage: string = '';
  public CollegeName: string = '';
  public DepartmentID: number = 0;
  public IsLOI: boolean = false;
  public OccupationsName: string = '';
  public IsEducationists: boolean = false;
  public isValidProfilePhoto: boolean = false;
  public isValidAadhaarCard: boolean = false;
  public isValidSignatureDoc: boolean = false;
  public isValidPANCard: boolean = false;
  public isValidAuthorizedDocument: boolean = false;
  public isValidEducationProof: boolean = false;
  public isValidConsentLetter: boolean = false;
  public IsValidEducationist: string = '';
  public IsValidEducationists: string = '';

  public showProfilePhoto: boolean = false;
  public showSignatureDoc: boolean = false;
  public showPANCard: boolean = false;
  public showAuthorizedDocument: boolean = false;
  public showAadhaarCard: boolean = false;
  public IsOtherOccupation: boolean = false;
  public IsValidOtherOccupation: string = '';
  public file: any = '';
  public ProceedToNext: string = 'Proceed To Draft';
  constructor(private societyService: SocityService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService, private clipboard: Clipboard) { }
  async ngOnInit() {
    this.SocietyDetailsForm = this.formBuilder.group(
      {
        ddlCollegeID: ['', [DropdownValidators]],
        txtPersonName: ['', Validators.required],
        fProfilePhoto: [''],
        ddlDesignationID: ['', [DropdownValidators]],
        ddlOccupationID: ['', [DropdownValidators]],
        Educationists: [''],
        txtMobileNo: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$"), Validators.minLength(10), Validators.maxLength(10)]],
        txtEmail: ['', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
        ddlGender: ['', Validators.required],
        txtFatherName: ['', Validators.required],
        txtAadhaarNo: ['', [Validators.required, Validators.pattern("^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$"), Validators.minLength(12), Validators.maxLength(12)]],
        fAadhaarCard: [''],
        fSignatureDoc: [''],
        txtPANNo: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[A-Za-z]{5}[0-9]{4}[A-Za-z]$")]],//Validators.required,
        fPANCard: [''],
        ckIsPrimary: [''],
        ckIsAuthorized: [''],
        //fAuthorizedDocument: ['', Validators.required],
        fAuthorizedDocument: [''],
        fEducationProof: [''],
        fConsentLetter: [''],
        txtsearchText: [''],
        txtOtherOccupation: [''],
      });
    const ddlCollegeID = document.getElementById('ddlCollegeID')
    if (ddlCollegeID) ddlCollegeID.focus();
    this.UserID = 1;


    // get login data
    this.ssoLoginModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // get colleges
    await this.GetCollegesByDepartmentAndSsoId(0, this.ssoLoginModel.SSOID, 'Society');
    // get all Designation
    await this.GetAllDesignation();
    // get all Occupation
    await this.GetAllOccupation();
    // get saved society
    //await this.GetSocietyAllList(this.CollegeList[0]["CollegeID"]);   
  }
  get form() { return this.SocietyDetailsForm.controls; }

  async IsAuthorizedOrNot(event: any) {
    try {
      this.loaderService.requestStarted();
      this.isAuthorizedOrNot = event.target.checked;
      if (this.isAuthorizedOrNot == false) {
        this.request.AuthorizedDocument = '';
        this.request.Dis_AuthorizedDocument = '';
        this.request.AuthorizedDocumentPath = '';
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
  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  async GetSocietyAllList(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.societyService.GetSocietyAllList(this.UserID, CollegeID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SocietyAllList = data['Data'][0]['data'];


          await this.commonMasterService.GetCollegeBasicDetails(this.request.CollegeID.toString())
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.CollegeName = data['Data'][0]['data'][0]['CollegeNameEn'];
              this.DepartmentID = data['Data'][0]['data'][0]['DepartmentID'];
              this.IsLOI = data['Data'][0]['data'][0]['IsLOI'];

              if (this.DepartmentID == 5 && this.IsLOI == false) {
                this.ProceedToNext = "Proceed To LOI"
              }
              else {
                this.ProceedToNext = "Proceed To Draft";
              }

            }, error => console.error(error));



          // this.CollegeName = this.CollegeList.find((x: { CollegeID: number; }) => x.CollegeID == this.request.CollegeID).CollegeName;
          //this.DepartmentID = this.CollegeList.find((x: { CollegeID: number; }) => x.CollegeID == CollegeID).DepartmentID;


          this.GetIsPrimary = this.SocietyAllList.find((x: { S_IsPrimary: string; }) => x.S_IsPrimary.replace(/^\r\n\s+|\s+$/g, '') == 'Yes')?.S_IsPrimary;
          if (this.GetIsPrimary == 'Yes') {
            this.isDisabledPrimary = true;
          }
          else {
            this.isDisabledPrimary = false;
          }
          this.Check30Female(CollegeID);
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
  async Check30Female(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.Check30Female(CollegeID)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          data = JSON.parse(JSON.stringify(data));

          if (!this.State) {
            this.Femalepre = data['Data'][0]['data'][0]['FemalePercentage'];
          }
          else {
            this.toastr.error(this.ErrorMessage)
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

  //

  async GetCollegesByDepartmentAndSsoId(departmentId: number, ssoId: string, type: string) {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(departmentId, ssoId, type)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeList = data['Data'];
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

  async GetAllOccupation() {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.commonMasterService.GetAllOccupation()
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.OccupationList = data['Data'];
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

  async SaveData() {

    this.isValidProfilePhoto = false;
    this.isValidAadhaarCard = false;
    this.isValidSignatureDoc = false;
    this.isValidPANCard = false;
    this.isValidAuthorizedDocument = false;
    this.isValidEducationProof = false;
    this.isValidConsentLetter = false;
    this.isSubmitted = true;
    console.log(this.request);
    if (this.SocietyDetailsForm.invalid) {
      return
    }
    this.OccupationsName = this.OccupationList.find((x: { OccupationID: number; }) => x.OccupationID == this.request.OccupationID).OccupationName;
    if (this.OccupationsName == 'Educationist') {
      if (this.request.EducationProof == '' || this.request.ConsentLetter == '') {
        this.IsValidEducationist = 'This field is required .!';
        return
      }
    }
    if (this.DepartmentID == 5) {
      if (this.OccupationsName == 'Medical Educationist') {
        if (this.request.EducationProof == '' || this.request.ConsentLetter == '') {
          this.IsValidEducationist = 'This field is required .!';
          return
        }
      }
    }
    if (this.DepartmentID == 5)
    {
      if (this.OccupationsName == 'Medical Educationist') {
        if (this.request.EducationProof == '' || this.request.ConsentLetter == '') {
          this.IsValidEducationist = 'This field is required .!';
          return
        }
      }
    }
    
    if (this.OccupationsName == 'Others') {
      if (this.request.OtherOccupation == '') {
        this.IsValidOtherOccupation = 'This field is required .!';
        return
      }
    }
    if (this.DepartmentID != 2) {
      if (this.request.Educationists == '') {
        this.IsValidEducationists = 'This field is required .!';
        return
      }
    }
    if (this.request.SocietyID == 0) {
      this.GetMobileNo = this.SocietyAllList.find((x: { MobileNo: string; }) => x.MobileNo.replace(/^\r\n\s+|\s+$/g, '') == this.request.MobileNo)?.MobileNo;
      this.GetEmail = this.SocietyAllList.find((x: { Email: string; }) => x.Email.replace(/^\r\n\s+|\s+$/g, '') == this.request.Email)?.Email;
      this.GetAadhaarNo = this.SocietyAllList.find((x: { AadhaarNo: string; }) => x.AadhaarNo.replace(/^\r\n\s+|\s+$/g, '') == this.request.AadhaarNo)?.AadhaarNo;
      this.GetPANNo = this.SocietyAllList.find((x: { PANNo: string; }) => x.PANNo.replace(/^\r\n\s+|\s+$/g, '') == this.request.PANNo)?.PANNo;

      if (this.GetMobileNo == this.request.MobileNo) {
        this.toastr.warning(this.request.MobileNo + " Mobile number is already exist ");
        return
      }
      if (this.GetEmail == this.request.Email) {
        this.toastr.warning(this.request.Email + " Email address is already exist");
        return
      }
      if (this.GetAadhaarNo == this.request.AadhaarNo) {
        this.toastr.warning(this.request.AadhaarNo + " Aadhaar No is already exist");
        return
      }
      if (this.GetPANNo == this.request.PANNo && this.request.PANNo!='') {
        this.toastr.warning(this.request.PANNo + " PAN No is already exist");
        return
      }
    }
    else {
      this.FilterSocietyAllList = this.SocietyAllList.filter((x: { SocietyID: number }) => x.SocietyID != this.request.SocietyID);
      this.GetMobileNo = this.FilterSocietyAllList.find((x: { MobileNo: string; }) => x.MobileNo.replace(/^\r\n\s+|\s+$/g, '') == this.request.MobileNo)?.MobileNo;
      this.GetEmail = this.FilterSocietyAllList.find((x: { Email: string; }) => x.Email.replace(/^\r\n\s+|\s+$/g, '') == this.request.Email)?.Email;
      this.GetAadhaarNo = this.FilterSocietyAllList.find((x: { AadhaarNo: string; }) => x.AadhaarNo.replace(/^\r\n\s+|\s+$/g, '') == this.request.AadhaarNo)?.AadhaarNo;
      this.GetPANNo = this.FilterSocietyAllList.find((x: { PANNo: string; }) => x.PANNo.replace(/^\r\n\s+|\s+$/g, '') == this.request.PANNo)?.PANNo;

      if (this.GetMobileNo == this.request.MobileNo) {
        this.toastr.warning(this.request.MobileNo + " Mobile number is already exist ");
        return
      }
      if (this.GetEmail == this.request.Email) {
        this.toastr.warning(this.request.Email + " Email address is already exist");
        return
      }
      if (this.GetAadhaarNo == this.request.AadhaarNo) {
        this.toastr.warning(this.request.AadhaarNo + " Aadhaar No is already exist");
        return
      }
      if (this.GetPANNo == this.request.PANNo && this.request.PANNo != '') {
        this.toastr.warning(this.request.PANNo + " PAN No is already exist");
        return
      }
    }

    this.GetIsPrimary = this.SocietyAllList.find((x: { S_IsPrimary: string; }) => x.S_IsPrimary.replace(/^\r\n\s+|\s+$/g, '') == 'Yes')?.S_IsPrimary;

    var Is_Primary = this.request.IsPrimary == true ? 'Yes' : 'No';
    console.log(this.request.SocietyID);
    if (this.request.SocietyID == 0) {
      if (this.GetIsPrimary == Is_Primary) {
        this.toastr.warning("At most you can add only one IsPrimary in a College Management Society");
        return
      }
    }

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.societyService.SaveData(this.request, this.files)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // get saved society
            this.GetCollegesByDepartmentAndSsoId(0, this.ssoLoginModel.SSOID, 'Society');
            this.GetAllDesignation();
            this.GetAllOccupation();
            this.GetSocietyAllList(this.request.CollegeID);//this.CollegeList[0]["CollegeID"]
            this.ResetControl();
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

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  async ValidateImage(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.isValidProfilePhoto = false;
      this.isValidSignatureDoc = false;
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'image/jpeg') {
          if (event.target.files[0].size > 2000000) {
            //event.target.value = '';
            this.ImageValidationMessage = 'Select less then 2MB File';
            this.ResetFileAndValidation(Type, '', '', '', true);
            //if (Type == 'ProfilePhoto') {
            //  this.isValidProfilePhoto = true;
            //  this.request.ProfilePhoto = '';
            //  this.request.Dis_ProfilePhoto = '';
            //  this.request.ProfilePhotoPath = '';
            //  this.file = document.getElementById('fProfilePhoto');
            //  this.file.value = '';
            //}
            //else if (Type == 'SignatureDoc') {
            //  this.isValidSignatureDoc = true;
            //  this.request.SignatureDoc = '';
            //  this.request.Dis_SignatureDoc = '';
            //  this.request.SignatureDocPath = '';
            //  this.file = document.getElementById('fSignatureDoc');
            //  this.file.value = '';
            //}
            return
          }
          if (event.target.files[0].size < 100000) {
            //event.target.value = '';
            this.ImageValidationMessage = 'Select more then 100kb File';
            //if (Type == 'ProfilePhoto') {
            //  this.isValidProfilePhoto = true;
            //  this.request.ProfilePhoto = '';
            //  this.request.Dis_ProfilePhoto = '';
            //  this.request.ProfilePhotoPath = '';
            //  this.file = document.getElementById('fProfilePhoto');
            //  this.file.value = '';
            //}
            //else if (Type == 'SignatureDoc') {
            //  this.isValidSignatureDoc = true;
            //  this.request.SignatureDoc = '';
            //  this.request.Dis_SignatureDoc = '';
            //  this.request.SignatureDocPath = '';
            //  this.file = document.getElementById('fSignatureDoc');
            //  this.file.value = '';
            //}
            this.ResetFileAndValidation(Type, '', '', '', true);
            return
          }
        }
        else {
          this.ImageValidationMessage = 'Select Only jpg/jpeg file';
          event.target.value = '';
          //if (Type == 'ProfilePhoto') {
          //  this.isValidProfilePhoto = true;
          //  this.request.ProfilePhoto = '';
          //  this.request.Dis_ProfilePhoto = '';
          //  this.request.ProfilePhotoPath = '';
          //  this.file = document.getElementById('fProfilePhoto');
          //  this.file.value = '';
          //}
          //else if (Type == 'SignatureDoc') {
          //  this.isValidSignatureDoc = true;
          //  this.request.SignatureDoc = '';
          //  this.request.Dis_SignatureDoc = '';
          //  this.request.SignatureDocPath = '';
          //  this.file = document.getElementById('fSignatureDoc');
          //  this.file.value = '';
          //}
          this.ResetFileAndValidation(Type, '', '', '', true);
          return
        }

        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          //event.target.value = '';

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, data['Data'][0]["FileName"], data['Data'][0]["Dis_FileName"], data['Data'][0]["FilePath"], false);
            //if (Type == 'ProfilePhoto') {
            //  //this.showProfilePhoto = true;
            //  this.request.ProfilePhoto = data['Data'][0]["FileName"];
            //  this.request.Dis_ProfilePhoto = data['Data'][0]["Dis_FileName"];
            //  this.request.ProfilePhotoPath = data['Data'][0]["FilePath"];
            //  this.file = document.getElementById('fProfilePhoto');
            //  this.file.value = '';
            //}
            //else if (Type == 'SignatureDoc') {
            //  //this.showSignatureDoc = true;
            //  this.request.SignatureDoc = data['Data'][0]["FileName"];
            //  this.request.Dis_SignatureDoc = data['Data'][0]["Dis_FileName"];
            //  this.request.SignatureDocPath = data['Data'][0]["FilePath"];
            //  this.file = document.getElementById('fSignatureDoc');
            //  this.file.value = '';
            //}
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

  async ValidatePdf(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.isValidAadhaarCard = false;
      this.isValidPANCard = false;
      this.isValidAuthorizedDocument = false;
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'application/pdf') {
          if (event.target.files[0].size > 2000000) {
            //event.target.value = '';
            this.ImageValidationMessage = 'Select less then 2MB File';
            this.ResetFileAndValidation(Type, '', '', '', true);
            //if (Type == 'AadhaarCard') {
            //  this.isValidAadhaarCard = true;
            //  this.request.AadhaarCard = '';
            //  this.request.Dis_AadhaarCard = '';
            //  this.request.AadhaarCardPath = '';
            //  this.file = document.getElementById('fAadhaarCard');
            //  this.file.value = '';
            //}
            //else if (Type == 'PANCard') {
            //  this.isValidPANCard = true;
            //  this.request.PANCard = '';
            //  this.request.Dis_PANCard = '';
            //  this.request.PANCardPath = '';
            //  this.file = document.getElementById('fPANCard');
            //  this.file.value = '';
            //}
            //else if (Type == 'AuthorizedDocument') {
            //  this.isValidAuthorizedDocument = true;
            //  this.request.AuthorizedDocument = '';
            //  this.request.Dis_AuthorizedDocument = '';
            //  this.request.AuthorizedDocumentPath = '';
            //  this.file = document.getElementById('fAuthorizedDocument');
            //  this.file.value = '';
            //}
            //else if (Type == 'EducationProof') {
            //  this.isValidEducationProof = true;
            //  this.request.EducationProof = '';
            //  this.request.Dis_EducationProof = '';
            //  this.request.EducationProofPath = '';
            //  this.file = document.getElementById('fEducationProof');
            //  this.file.value = '';
            //}
            //else if (Type == 'ConsentLetter') {
            //  this.isValidConsentLetter = true;
            //  this.request.ConsentLetter = '';
            //  this.request.Dis_ConsentLetter = '';
            //  this.request.ConsentLetterPath = '';
            //  this.file = document.getElementById('fConsentLetter');
            //  this.file.value = '';
            //}
            return
          }
          if (event.target.files[0].size < 100000) {
            //event.target.value = '';
            this.ImageValidationMessage = 'Select more then 100kb File';

            //if (Type == 'AadhaarCard') {
            //  this.isValidAadhaarCard = true;
            //  this.request.AadhaarCard = '';
            //  this.request.Dis_AadhaarCard = '';
            //  this.request.AadhaarCardPath = '';
            //  this.file = document.getElementById('fAadhaarCard');
            //  this.file.value = '';
            //}
            //else if (Type == 'PANCard') {
            //  this.isValidPANCard = true;
            //  this.request.PANCard = '';
            //  this.request.Dis_PANCard = '';
            //  this.request.PANCardPath = '';
            //  this.file = document.getElementById('fPANCard');
            //  this.file.value = '';
            //}
            //else if (Type == 'AuthorizedDocument') {
            //  this.isValidAuthorizedDocument = true;
            //  this.request.AuthorizedDocument = '';
            //  this.request.Dis_AuthorizedDocument = '';
            //  this.request.AuthorizedDocumentPath = '';
            //  this.file = document.getElementById('fAuthorizedDocument');
            //  this.file.value = '';
            //}
            //else if (Type == 'EducationProof') {
            //  this.isValidEducationProof = true;
            //  this.request.EducationProof = '';
            //  this.request.Dis_EducationProof = '';
            //  this.request.EducationProofPath = '';
            //  this.file = document.getElementById('fEducationProof');
            //  this.file.value = '';
            //}
            //else if (Type == 'ConsentLetter') {
            //  this.isValidConsentLetter = true;
            //  this.request.ConsentLetter = '';
            //  this.request.Dis_ConsentLetter = '';
            //  this.request.ConsentLetterPath = '';
            //  this.file = document.getElementById('fConsentLetter');
            //  this.file.value = '';
            //}
            this.ResetFileAndValidation(Type, '', '', '', true);
            return
          }
        }
        else {
          this.ImageValidationMessage = 'Select Only pdf file';
          //event.target.value = '';

          //if (Type == 'AadhaarCard') {
          //  this.isValidAadhaarCard = true;
          //  this.request.AadhaarCard = '';
          //  this.request.Dis_AadhaarCard = '';
          //  this.request.AadhaarCardPath = '';
          //  this.file = document.getElementById('fAadhaarCard');
          //  this.file.value = '';
          //}
          //else if (Type == 'PANCard') {
          //  this.isValidPANCard = true;
          //  this.request.PANCard = '';
          //  this.request.Dis_PANCard = '';
          //  this.request.PANCardPath = '';
          //  this.file = document.getElementById('fPANCard');
          //  this.file.value = '';
          //}
          //else if (Type == 'AuthorizedDocument') {
          //  this.isValidAuthorizedDocument = true;
          //  this.request.AuthorizedDocument = '';
          //  this.request.Dis_AuthorizedDocument = '';
          //  this.request.AuthorizedDocumentPath = '';
          //  this.file = document.getElementById('fAuthorizedDocument');
          //  this.file.value = '';
          //}
          //else if (Type == 'EducationProof') {
          //  this.isValidEducationProof = true;
          //  this.request.EducationProof = '';
          //  this.request.Dis_EducationProof = '';
          //  this.request.EducationProofPath = '';
          //  this.file = document.getElementById('fEducationProof');
          //  this.file.value = '';
          //}
          //else if (Type == 'ConsentLetter') {
          //  this.isValidConsentLetter = true;
          //  this.request.ConsentLetter = '';
          //  this.request.Dis_ConsentLetter = '';
          //  this.request.ConsentLetterPath = '';
          //  this.file = document.getElementById('fConsentLetter');
          //  this.file.value = '';
          //}
          this.ResetFileAndValidation(Type, '', '', '', true);
          return
        }

        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          //event.target.value = '';

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, data['Data'][0]["FileName"], data['Data'][0]["Dis_FileName"], data['Data'][0]["FilePath"], false);
            //if (Type == 'AadhaarCard') {
            //  //this.showAadhaarCard = true;
            //  this.request.AadhaarCard = data['Data'][0]["FileName"];
            //  this.request.Dis_AadhaarCard = data['Data'][0]["Dis_FileName"];
            //  this.request.AadhaarCardPath = data['Data'][0]["FilePath"];
            //  this.file = document.getElementById('fAadhaarCard');
            //  this.file.value = '';
            //}
            //else if (Type == 'PANCard') {
            //  //this.showPANCard = true;
            //  this.request.PANCard = data['Data'][0]["FileName"];
            //  this.request.Dis_PANCard = data['Data'][0]["Dis_FileName"];
            //  this.request.PANCardPath = data['Data'][0]["FilePath"];
            //  this.file = document.getElementById('fPANCard');
            //  this.file.value = '';
            //}
            //else if (Type == 'AuthorizedDocument') {
            //  //this.showAuthorizedDocument = true;
            //  this.request.AuthorizedDocument = data['Data'][0]["FileName"];
            //  this.request.Dis_AuthorizedDocument = data['Data'][0]["Dis_FileName"];
            //  this.request.AuthorizedDocumentPath = data['Data'][0]["FilePath"];
            //  this.file = document.getElementById('fAuthorizedDocument');
            //  this.file.value = '';
            //}
            //else if (Type == 'EducationProof') {
            //  this.request.EducationProof = data['Data'][0]["FileName"];
            //  this.request.Dis_EducationProof = data['Data'][0]["Dis_FileName"];
            //  this.request.EducationProofPath = data['Data'][0]["FilePath"];
            //  this.file = document.getElementById('fEducationProof');
            //  this.file.value = '';
            //}
            //else if (Type == 'ConsentLetter') {
            //  this.request.ConsentLetter = data['Data'][0]["FileName"];
            //  this.request.Dis_ConsentLetter = data['Data'][0]["Dis_FileName"];
            //  this.request.ConsentLetterPath = data['Data'][0]["FilePath"];
            //  this.file = document.getElementById('fConsentLetter');
            //  this.file.value = '';
            //}
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

  DeleteImage(Type: string) {
    this.ResetFileAndValidation(Type, '', '', '', false);
    //try {

    //  //this.loaderService.requestStarted();

    //  //if (Type == 'ProfilePhoto') {
    //  //  //this.showProfilePhoto = false;
    //  //  this.request.ProfilePhoto = '';
    //  //  this.request.Dis_ProfilePhoto = '';
    //  //  this.request.ProfilePhotoPath = '';
    //  //}
    //  //else if (Type == 'AadhaarCard') {
    //  //  //this.showAadhaarCard = false;
    //  //  this.request.AadhaarCard = '';
    //  //  this.request.Dis_AadhaarCard = '';
    //  //  this.request.AadhaarCardPath = '';
    //  //}
    //  //else if (Type == 'SignatureDoc') {
    //  //  //this.showSignatureDoc = false;
    //  //  this.request.SignatureDoc = '';
    //  //  this.request.Dis_SignatureDoc = '';
    //  //  this.request.SignatureDocPath = '';
    //  //}
    //  //else if (Type == 'PANCard') {
    //  //  //this.showPANCard = false;
    //  //  this.request.PANCard = '';
    //  //  this.request.Dis_PANCard = '';
    //  //  this.request.PANCardPath = '';
    //  //}
    //  //else if (Type == 'AuthorizedDocument') {
    //  //  //this.showAuthorizedDocument = false;
    //  //  this.request.AuthorizedDocument = '';
    //  //  this.request.Dis_AuthorizedDocument = '';
    //  //  this.request.AuthorizedDocumentPath = '';
    //  //}
    //  //else if (Type == 'EducationProof') {
    //  //  this.request.EducationProof = '';
    //  //  this.request.Dis_EducationProof = '';
    //  //  this.request.EducationProofPath = '';
    //  //}
    //  //else if (Type == 'ConsentLetter') {
    //  //  this.request.ConsentLetter = '';
    //  //  this.request.Dis_ConsentLetter = '';
    //  //  this.request.ConsentLetterPath = '';
    //  //}
    //}
    //catch (Ex) {
    //  console.log(Ex);
    //}
    //finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}
  }


  async ResetControl() {
    try {
      this.loaderService.requestStarted();
      const ddlCollegeID = document.getElementById('ddlCollegeID')
      if (ddlCollegeID) ddlCollegeID.focus();

      this.isSubmitted = false;
      this.request.SocietyID = 0;
      //this.request.CollegeID = 0;
      this.request.PersonName = '';
      this.request.ProfilePhoto = '';
      this.request.Dis_ProfilePhoto = '';
      this.request.ProfilePhotoPath = '';
      this.request.DesignationID = 0;
      this.request.OccupationID = 0;
      this.request.Educationists = '';
      this.request.MobileNo = '';
      this.request.Email = '';
      this.request.Gender = '';
      this.request.FatherName = '';
      this.request.AadhaarNo = '';
      this.request.AadhaarCard = '';
      this.request.Dis_AadhaarCard = '';
      this.request.AadhaarCardPath = '';
      this.request.SignatureDoc = '';
      this.request.Dis_SignatureDoc = '';
      this.request.SignatureDocPath = '';
      this.request.PANNo = '';
      this.request.PANCard = '';
      this.request.Dis_PANCard = '';
      this.request.PANCardPath = '';
      this.request.IsPrimary = false;
      this.request.IsAuthorized = false;
      this.request.AuthorizedDocument = '';
      this.request.Dis_AuthorizedDocument = '';
      this.request.AuthorizedDocumentPath = '';
      this.request.EducationProof = '';
      this.request.Dis_EducationProof = '';
      this.request.EducationProofPath = '';
      this.request.ConsentLetter = '';
      this.request.Dis_ConsentLetter = '';
      this.request.ConsentLetterPath = '';
      this.request.OtherOccupation = '';
      this.IsEducationists = false;
      this.showAuthorizedDocument = false;
      this.showPANCard = false;
      this.showSignatureDoc = false;
      this.showProfilePhoto = false;
      this.showAadhaarCard = false;
      this.isAuthorizedOrNot = false;
      this.request.UserID = 0;
      this.isDisabledGrid = false;
      this.IsOtherOccupation = false;

      const btnSave = document.getElementById('btnSave')
      if (btnSave) btnSave.innerHTML = "<i class='fa fa-plus'></i> Add &amp; Save";
      const btnReset = document.getElementById('')
      if (btnReset) btnReset.innerHTML = "Reset";
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
  async Edit_OnClick(SocietyID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.societyService.GetSocietyByID(SocietyID, this.UserID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.request.SocietyID = data['Data'][0]["SocietyID"];
          this.request.CollegeID = data['Data'][0]["CollegeID"];
          this.request.PersonName = data['Data'][0]["PersonName"];
          this.request.ProfilePhoto = data['Data'][0]["ProfilePhoto"];
          this.request.Dis_ProfilePhoto = data['Data'][0]["Dis_ProfilePhoto"];
          this.request.ProfilePhotoPath = data['Data'][0]["ProfilePhotoPath"];
          this.request.DesignationID = data['Data'][0]["DesignationID"];
          this.request.OccupationID = data['Data'][0]["OccupationID"];
          this.OccupationsName = this.OccupationList.find((x: { OccupationID: number; }) => x.OccupationID == this.request.OccupationID).OccupationName;
          if (this.OccupationsName == 'Educationist' && data['Data'][0]["Educationists"] == 'Yes') {
            this.request.Educationists = data['Data'][0]["Educationists"];
            this.IsEducationists = true;
          }
          else {
            this.request.Educationists = data['Data'][0]["Educationists"];
            this.IsEducationists = false;
          }

          if (this.OccupationsName == 'Others') {
            this.request.OtherOccupation = data['Data'][0]["OtherOccupation"];
            this.IsOtherOccupation = true;
          }
          else {
            this.IsOtherOccupation = false;
          }
          this.request.MobileNo = data['Data'][0]["MobileNo"];
          this.request.Email = data['Data'][0]["Email"];
          this.request.Gender = data['Data'][0]["Gender"];
          this.request.FatherName = data['Data'][0]["FatherName"];
          this.request.AadhaarNo = data['Data'][0]["AadhaarNo"];
          this.request.AadhaarCard = data['Data'][0]["AadhaarCard"];
          this.request.Dis_AadhaarCard = data['Data'][0]["Dis_AadhaarCard"];
          this.request.AadhaarCardPath = data['Data'][0]["AadhaarCardPath"];
          this.request.SignatureDoc = data['Data'][0]["SignatureDoc"];
          this.request.Dis_SignatureDoc = data['Data'][0]["Dis_SignatureDoc"];
          this.request.SignatureDocPath = data['Data'][0]["SignatureDocPath"];
          this.request.PANNo = data['Data'][0]["PANNo"];
          this.request.PANCard = data['Data'][0]["PANCard"];
          this.request.Dis_PANCard = data['Data'][0]["Dis_PANCard"];
          this.request.PANCardPath = data['Data'][0]["PANCardPath"];
          this.request.IsAuthorized = data['Data'][0]["IsAuthorized"];
          if (this.request.IsAuthorized == true) {
            this.isAuthorizedOrNot = true;
            this.request.AuthorizedDocument = data['Data'][0]["AuthorizedDocument"];
            this.request.Dis_AuthorizedDocument = data['Data'][0]["Dis_AuthorizedDocument"];
            this.request.AuthorizedDocumentPath = data['Data'][0]["AuthorizedDocumentPath"];
          }
          if (this.IsEducationists == true) {
            this.request.EducationProof = data['Data'][0]["EducationProof"];
            this.request.Dis_EducationProof = data['Data'][0]["Dis_EducationProof"];
            this.request.EducationProofPath = data['Data'][0]["EducationProofPath"];
            this.request.ConsentLetter = data['Data'][0]["ConsentLetter"];
            this.request.Dis_ConsentLetter = data['Data'][0]["Dis_ConsentLetter"];
            this.request.ConsentLetterPath = data['Data'][0]["ConsentLetterPath"];
          }
          this.GetIsPrimary = this.SocietyAllList.find((x: { S_IsPrimary: string; }) => x.S_IsPrimary.replace(/^\r\n\s+|\s+$/g, '') == 'Yes')?.S_IsPrimary;
          if (this.GetIsPrimary == 'Yes') {
            this.request.IsPrimary = data['Data'][0]["IsPrimary"];
            this.isDisabledPrimary = true;
          }
          else {
            this.request.IsPrimary = data['Data'][0]["IsPrimary"];
            this.isDisabledPrimary = false;
          }
          this.isDisabledGrid = true;

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Reset";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async Delete_OnClick(SocietyID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.societyService.DeleteData(SocietyID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetSocietyAllList(this.request.CollegeID);
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

  SelectOccupation_Educationist_Change() {
    debugger;
    this.OccupationsName = this.OccupationList.find((x: { OccupationID: number; }) => x.OccupationID == this.request.OccupationID).OccupationName;
    if (this.OccupationsName == 'Educationist' || this.OccupationsName == 'Medical Educationist') {
      this.request.Educationists = 'Yes';
      this.IsEducationists = true;
    }
    else {
      this.request.Educationists = '';
      this.request.EducationProof = '';
      this.request.Dis_EducationProof = '';
      this.request.EducationProofPath = '';
      this.request.ConsentLetter = '';
      this.request.Dis_ConsentLetter = '';
      this.request.ConsentLetterPath = '';
      this.IsEducationists = false;
    }
    
    if (this.OccupationsName == 'Others') {
      this.IsOtherOccupation = true;
    }
    else {
      this.IsOtherOccupation = false;
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
    if (this.SocietyAllList.length > 0) {
      try {
        this.isLoadingExport = true;
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
        XLSX.writeFile(wb, "SocietyMaster.xlsx");
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
    this.loaderService.requestStarted();
    if (this.SocietyAllList.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("SocietyMaster", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("SocietyMaster" + '.pdf');

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

  async Proceed_Draft() {

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      if (this.ProceedToNext == "Proceed To LOI") {
        this.routers.navigate(['/totalcollege']);
      }
      else {
        this.routers.navigate(['/draftapplicationlist']);
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



  ResetFileAndValidation(type: string, name: string, dis_name: string, path: string, isShowFile: boolean) {
    //event.target.value = '';
    try {
      this.loaderService.requestStarted();
      if (type == 'ProfilePhoto' || type == 'All') {
        this.isValidProfilePhoto = isShowFile;
        this.request.ProfilePhoto = name;
        this.request.Dis_ProfilePhoto = dis_name;
        this.request.ProfilePhotoPath = path;
        this.file = document.getElementById('fProfilePhoto');
        this.file.value = '';
      }
      if (type == 'SignatureDoc' || type == 'All') {
        this.isValidSignatureDoc = isShowFile;
        this.request.SignatureDoc = name;
        this.request.Dis_SignatureDoc = dis_name;
        this.request.SignatureDocPath = path;
        this.file = document.getElementById('fSignatureDoc');
        this.file.value = '';
      }
      if (type == 'AadhaarCard' || type == 'All') {
        this.isValidAadhaarCard = isShowFile;
        this.request.AadhaarCard = name;
        this.request.Dis_AadhaarCard = dis_name;
        this.request.AadhaarCardPath = path;
        this.file = document.getElementById('fAadhaarCard');
        this.file.value = '';
      }
      if (type == 'PANCard' || type == 'All') {
        this.isValidPANCard = isShowFile;
        this.request.PANCard = name;
        this.request.Dis_PANCard = dis_name;
        this.request.PANCardPath = path;
        this.file = document.getElementById('fPANCard');
        this.file.value = '';
      }
      if (type == 'AuthorizedDocument' || type == 'All') {
        this.isValidAuthorizedDocument = isShowFile;
        this.request.AuthorizedDocument = name;
        this.request.Dis_AuthorizedDocument = dis_name;
        this.request.AuthorizedDocumentPath = path;
        this.file = document.getElementById('fAuthorizedDocument');
        this.file.value = '';
      }
      if (type == 'EducationProof' || type == 'All') {
        this.isValidEducationProof = isShowFile;
        this.request.EducationProof = name;
        this.request.Dis_EducationProof = dis_name;
        this.request.EducationProofPath = path;
        this.file = document.getElementById('fEducationProof');
        this.file.value = '';
      }
      if (type == 'ConsentLetter' || type == 'All') {
        this.isValidConsentLetter = isShowFile;
        this.request.ConsentLetter = name;
        this.request.Dis_ConsentLetter = dis_name;
        this.request.ConsentLetterPath = path;
        this.file = document.getElementById('fConsentLetter');
        this.file.value = '';
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
}
