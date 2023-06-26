import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffDetailDataModel } from '../../../Models/TabDetailDataModel';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StaffDetailService } from '../../../Services/StaffDetail/staff-detail.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';

@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrls: ['./staff-details.component.css']
})
export class StaffDetailsComponent implements OnInit {
  StaffDetailForm!: FormGroup;
  StaffEducationDetailForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  isSubmitted: boolean = false;
  request = new StaffDetailDataModel();
  public ProfessionalQualificationData: any = [];
  public HighestQualificationData: any = [];
  public SubjectData: any = [];
  public RoleData: any = [];
  public YearData: any = [];
  public isAadhaarCard: boolean = false;
  public isPANCard: boolean = false;
  public StaffDetailModel: StaffDetailDataModel[] = [];

  public TotalStaffDetail: number = 0;
  public TotalNonTeachingStaffDetail: number = 0;
  public TotalTeachingStaffDetail: number = 0;

  public isSubject: boolean = false;
  public isRole: boolean = false;
  public isSpecializationSubject: boolean = false;
  public isRoleMapping: boolean = false;
  public isUANNumber: boolean = false;
  public isDisabledResearchGuide: boolean = false;
  public isDisabled: boolean = false;

  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public AppointmentMinDate: Date = new Date;
  public isAddMore: boolean = false;
  public isUploadDocRequried: boolean = false;
  public FormValid: boolean = true;

  public showProfilePhoto: boolean = false;
  public showAadhaarCard: boolean = false;
  public showPANCard: boolean = false;
  public showExperienceCertificate: boolean = false;
  public showUploadDocument: boolean = false;
  public file: any = '';

  public MaxDate: Date = new Date();


  constructor(private loaderService: LoaderService, private toastr: ToastrService, private staffDetailService: StaffDetailService, private fileUploadService: FileUploadService
    , private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder) {

  }

  async ngOnInit() {

    this.StaffDetailForm = this.formBuilder.group(
      {
        rdTeachingType: ['', Validators.required],
        ddlSubjectId: [''],
        ddlRoleId: [''],
        txtNameOfPerson: ['', Validators.required],
        txtMobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
        txtEmail: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]")]],
        ddlHighestQualificationId: ['', [DropdownValidators]],
        txtNoOfYearExperience: ['', Validators.required],
        ProfilePhoto: [''],
        AadhaarCard: [''],
        PANCard: [''],
        ExperienceCertificate: [''],
        NETCertificate: [''],
        txtAadhaarNo: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
        dtDOB: ['', Validators.required],
        dtDateOfAppointment: ['', Validators.required],
        dtDateOfJoining: ['', Validators.required],
        txtSpecializationSubject: [''],
        txtRoleMapping: [''],
        txtSalary: ['', Validators.required],
        rdStaffStatus: ['', Validators.required],
        rdPFDeduction: [''],
        txtUANNo: [''],
        rdResearchGuide: ['', Validators.required],
      });
    this.StaffEducationDetailForm = this.formBuilder.group(
      {
        ddlProfessionalQualificationID: ['', [DropdownValidators]],
        txtSubjectStream: ['', Validators.required],
        txtUniversityBoardInstitutionName: ['', Validators.required],
        ddlPassingYearID: ['', [DropdownValidators]],
        txtMarks: ['', Validators.required],
        UploadDocument: [''],
      });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetHighestQualificationList_DepartmentAndTypeWise(this.SelectedDepartmentID, 'HighestQualification');
    await this.GetRoleListByLevel(0);
    await this.GetCollegeWiseSubjectList(this.SelectedCollageID);
    await this.FillYearData();
    await this.GetQualificationList_DepartmentAndTypeWise(this.SelectedDepartmentID);
    await this.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
    this.loaderService.requestEnded();
  }
  get form() { return this.StaffDetailForm.controls; }
  get SEform() { return this.StaffEducationDetailForm.controls; }

  async AddMoreEducationalQualification() {
    this.FormValid = true;
    this.isUploadDocRequried = false;
    try {
      this.isAddMore = true;
      if (this.StaffEducationDetailForm.invalid) {
        this.FormValid = false;
      }

      var DocRequried = this.ProfessionalQualificationData.find((x: { QualificationID: number; }) => x.QualificationID == this.request.ProfessionalQualificationID).IsDocCompulsory;
      if (DocRequried == 1) {
        if (this.request.UploadDocument == '') {
          this.isUploadDocRequried = true;
          this.FormValid = false;
        }
      }

      if (!this.FormValid) {
        return;
      }

      if (this.request.Marks > 100) {
        this.request.Marks = 0;
        this.toastr.warning('Invalid Percentage/Grade');
        return;
      }

      this.loaderService.requestStarted();
      await this.request.EducationalQualificationDetails.push({
        EducationalQualificationID: 0,
        ProfessionalQualificationID: this.request.ProfessionalQualificationID,
        StreamSubject: this.request.StreamSubject,
        UniversityBoardInstitutionName: this.request.UniversityBoardInstitutionName,
        PassingYearID: this.request.PassingYearID,
        Marks: this.request.Marks,
        ProfessionalQualification: this.ProfessionalQualificationData.find((x: { QualificationID: number; }) => x.QualificationID == this.request.ProfessionalQualificationID).QualificationName,
        PassingYear: this.request.PassingYearID.toString(),
        UploadDocument: this.request.UploadDocument
      });
      this.request.ProfessionalQualificationID = 0;
      this.request.PassingYearID = 0;
      this.request.StreamSubject = '';
      this.request.UniversityBoardInstitutionName = '';
      this.request.Marks = 0;
      this.request.UploadDocument = '';
      this.isAddMore = false;
      this.showUploadDocument = false;
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
  async DeleteEducationalQualification(i: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.EducationalQualificationDetails.splice(i, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async DeleteStaffDetails(StaffDetailID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.staffDetailService.DeleteStaffDetail(StaffDetailID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              this.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          }, error => {
            this.toastr.warning("Unable to connect to server .!");
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
  async GetHighestQualificationList_DepartmentAndTypeWise(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HighestQualificationData = data['Data'];
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
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  async GetCollegeWiseSubjectList(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeWiseSubjectList(CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SubjectData = data['Data'];
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
  async GetRoleListByLevel(LevelID: number) {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleListByLevel(LevelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoleData = data['Data'];
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
  ValidateDocumentImage(event: any, Type: string) {
    this.isAadhaarCard = false;
    this.isPANCard = false;
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'image/jpeg' ||
        event.target.files[0].type === 'application/pdf' ||
        event.target.files[0].type === 'image/jpg') {
        if (event.target.files[0].size > 2000000) {
          event.target.value = '';
          this.toastr.warning('Select less then 2MB File');
          return
        }
        if (event.target.files[0].size < 100000) {
          event.target.value = '';
          this.toastr.warning('Select more then 100kb File');
          return
        }
      }
      else {
        event.target.value = '';
        this.toastr.warning('Select Only jpg/jpeg/pdf file');
        return
      }

      this.file = event.target.files[0];
      this.fileUploadService.UploadDocument(this.file).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == 'ProfilePhoto') {
            this.showProfilePhoto = true;
            this.request.ProfilePhoto = data['Data'][0]["FilePath"];
          }
          else if (Type == 'AadhaarCard') {
            this.showAadhaarCard = true;
            this.request.AadhaarCard = data['Data'][0]["FilePath"];
          }
          else if (Type == 'PANCard') {
            this.showPANCard = true;
            this.request.PANCard = data['Data'][0]["FilePath"];
          }
          else if (Type == 'ExperienceCertificate') {
            this.showExperienceCertificate = true;
            this.request.ExperienceCertificate = data['Data'][0]["FilePath"];
          }
          else if (Type == 'UploadDocument') {
            this.showUploadDocument = true;
            this.request.UploadDocument = data['Data'][0]["FilePath"];
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
  async SaveData() {
    try {
      this.isRoleMapping = false;
      this.isSpecializationSubject = false;
      this.FormValid = true;
      this.isUploadDocRequried = false;
      this.isSubmitted = true;

      if (this.request.AadhaarCard == '') {
        this.isAadhaarCard = true;
        this.FormValid = false;
      }

      if (this.request.PFDeduction == 'Yes') {
        if (this.request.UANNumber == '') {
          this.isUANNumber = true;
          this.FormValid = false;
        }
      }
      if (this.request.TeachingType == 'Teaching') {
        if (this.request.SubjectID == 0) {
          //this.toastr.warning('Subject is required');
          this.isSubject = true;
          this.FormValid = false;
        }
        if (this.request.RoleID == 0) {
          //this.toastr.warning('Role is required');
          this.isRole = true;
          this.FormValid = false;
        }
        if (this.request.SpecializationSubject == '') {
          //this.toastr.warning('Specialization Subject is required');
          this.isSpecializationSubject = true;
          this.FormValid = false;
        }
        if (this.request.PANCard == '') {
          this.isPANCard = true;
          this.FormValid = false;
        }
      }
      if (this.request.TeachingType == 'NonTeaching') {
        if (this.request.RoleMapping == '') {
          //this.toastr.warning('Role Mapping is required');
          this.isRoleMapping = true;
          this.FormValid = false;
        }
      }
      //if (this.request.EducationalQualificationDetails.length > 0) {
      //  var DocRequried = this.ProfessionalQualificationData.find((x: { QualificationID: number; }) => x.QualificationID == this.request.ProfessionalQualificationID).IsDocCompulsory;
      //  if (DocRequried == 1) {
      //    if (this.request.UploadDocument == '') {
      //      this.isUploadDocRequried = true;
      //      this.FormValid = false;
      //    }
      //  }
      //}
      if (this.StaffDetailForm.invalid) {
        this.FormValid = false;
      }
      if (!this.FormValid) {
        return;
      }
      if (this.request.EducationalQualificationDetails.length == 0) {
        this.toastr.warning('Add atlest one row in Educational Qualification');
        return;
      }
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.SelectedDepartmentID;
      this.request.CollegeID = this.SelectedCollageID;
      await this.staffDetailService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            //console.log(data['Data']);
            this.toastr.success(this.SuccessMessage);
            //window.location.reload();
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }, error => {
          this.toastr.warning("Unable to connect to server .!");
        })


      //this.StaffDetailModel.push({
      //  StaffDetailID: 0,
      //  TeachingType: this.request.TeachingType,
      //  SubjectID: this.request.SubjectID,
      //  SubjectName: this.request.SubjectID > 0 ? this.SubjectData.find((x: { SubjectID: number; }) => x.SubjectID == this.request.SubjectID).SubjectName : '',
      //  PersonName: this.request.PersonName,
      //  RoleID: this.request.RoleID,
      //  RoleName: this.request.RoleID > 0 ? this.RoleData.find((x: { RoleID: number; }) => x.RoleID == this.request.RoleID).RoleName : '',
      //  MobileNo: this.request.MobileNo,
      //  Email: this.request.Email,
      //  HighestQualification: this.request.HighestQualification,
      //  NumberofExperience: this.request.NumberofExperience,
      //  AadhaarNo: this.request.AadhaarNo,
      //  DateOfBirth: this.request.DateOfBirth,
      //  DateOfAppointment: this.request.DateOfAppointment,
      //  DateOfJoining: this.request.DateOfJoining,
      //  SpecializationSubject: this.request.SpecializationSubject,
      //  RoleMapping: this.request.RoleMapping,
      //  Salary: this.request.Salary,
      //  StaffStatus: this.request.StaffStatus,
      //  PFDeduction: this.request.PFDeduction,
      //  UANNumber: this.request.UANNumber,
      //  ResearchGuide: this.request.ResearchGuide,
      //  ProfessionalQualificationID: 0,
      //  StreamSubject: '',
      //  UniversityBoardInstitutionName: '',
      //  PassingYearID: 0,
      //  Marks: 0,
      //  ProfilePhoto: this.request.ProfilePhoto,
      //  EducationalQualificationDetails: this.request.EducationalQualificationDetails,
      //  AadhaarCard: this.request.AadhaarCard,
      //  PANCard: this.request.PANCard,
      //  ExperienceCertificate: this.request.ExperienceCertificate,
      //  UploadDocument: this.request.UploadDocument
      //});


      this.request = new StaffDetailDataModel();
      this.isSubmitted = false;
      this.showPANCard = false;
      this.showAadhaarCard = false;
      this.showProfilePhoto = false;
      this.showExperienceCertificate = false;
      this.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
      this.request.ProfessionalQualificationID = 0;
      const btnAdd = document.getElementById('btnAdd')
      if (btnAdd) { btnAdd.innerHTML = "Add"; }
      this.isDisabled = false;
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
  OnChangeHighestQualification() {
    var QualificationName = this.HighestQualificationData.find((x: { ID: number; }) => x.ID == this.request.HighestQualification).Name;
    if (QualificationName != 'PHD') {
      this.request.ResearchGuide = 'No';
      this.isDisabledResearchGuide = true;
    }
    else {
      this.isDisabledResearchGuide = false;
    }

  }
  async FillYearData() {
    for (var i = 2023; i > 1958; i--) {
      var data = { YearID: i, YearName: i };
      this.YearData.push(data);
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
  SetDateofAppointment() {
    const DOB = new Date(this.request.DateOfBirth);
    DOB.setFullYear(DOB.getFullYear() + 21);
    this.AppointmentMinDate = new Date(DOB.getFullYear(), DOB.getMonth(), DOB.getDate());
    //this.request.DateOfAppointment = '';
    //this.request.DateOfJoining = '';
  }
  async GetQualificationList_DepartmentAndTypeWise(DepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetQualificationMasterList_DepartmentWise(DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ProfessionalQualificationData = data['Data'];
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
  DeleteImage(Type: string) {
    if (Type == 'ProfilePhoto') {
      this.showProfilePhoto = false;
      this.request.ProfilePhoto = '';
    }
    else if (Type == 'AadhaarCard') {
      this.showAadhaarCard = false;
      this.request.AadhaarCard = '';
    }
    else if (Type == 'PANCard') {
      this.showPANCard = false;
      this.request.PANCard = '';
    }
    else if (Type == 'ExperienceCertificate') {
      this.showExperienceCertificate = false;
      this.request.ExperienceCertificate = '';
    }
    else if (Type == 'UploadDocument') {
      this.showUploadDocument = false;
      this.request.UploadDocument = '';
    }
  }
  async GetStaffDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, StaffDetailID: number) {
    try {
      this.loaderService.requestStarted();
      await this.staffDetailService.GetStaffDetailList_DepartmentCollegeWise(DepartmentID, CollegeID, StaffDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StaffDetailModel = data['Data'];
          this.TotalStaffDetail = this.StaffDetailModel.length;
          this.TotalTeachingStaffDetail = 0;
          this.TotalNonTeachingStaffDetail = 0;
          for (var i = 0; i < this.StaffDetailModel.length; i++) {

            if (this.StaffDetailModel[i].AadhaarNo.length > 0) {
              const visibleDigits = 4;
              let maskedSection = this.StaffDetailModel[i].AadhaarNo.slice(0, -visibleDigits);
              let visibleSection = this.StaffDetailModel[i].AadhaarNo.slice(-visibleDigits);
              this.StaffDetailModel[i].MaskedAadhaarNo = maskedSection.replace(/./g, 'X') + visibleSection;
            }
            if (this.StaffDetailModel[i].TeachingType == 'Teaching') {
              this.TotalTeachingStaffDetail++;
            }
            else {
              this.TotalNonTeachingStaffDetail++;
            }
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
  async EditItem(StaffDetailID: number) {
    try {
      this.isAddMore = false;
      this.isAadhaarCard = false;
      this.isPANCard = false;
      this.isSubject = false;
      this.isRole = false;
      this.isSpecializationSubject = false;
      this.isRoleMapping = false;
      this.isUANNumber = false;
      this.isDisabledResearchGuide = false;
      this.isDisabled = false;
      this.loaderService.requestStarted();
      await this.staffDetailService.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, StaffDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request = data['Data'][0];
          this.request.ProfessionalQualificationID = 0;
          this.request.PassingYearID = 0;
          this.request.Marks = 0;
          this.GetCollegeWiseSubjectList(this.SelectedCollageID);
          this.OnChangeHighestQualification();
          this.SetDateofAppointment();
          this.showPANCard = true;
          this.showAadhaarCard = true;
          this.showProfilePhoto = this.request.ProfilePhoto != '' ? true : false;
          this.showExperienceCertificate = this.request.ExperienceCertificate != '' ? true : false;
          this.isDisabled = true;
          const btnAdd = document.getElementById('btnAdd')
          if (btnAdd) { btnAdd.innerHTML = "Update"; }
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
}
