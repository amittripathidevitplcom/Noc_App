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
  // save
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
  public StartYear: number = 0;

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
    await this.GetQualificationList_DepartmentAndTypeWise(this.SelectedDepartmentID);
    await this.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
    this.loaderService.requestEnded();
  }
  get form() { return this.StaffDetailForm.controls; }
  get SEform() { return this.StaffEducationDetailForm.controls; }

  ProfessionalQualification_Change(): boolean {
    let isValid = true;
    var DocRequried = this.ProfessionalQualificationData.find((x: { QualificationID: number; }) => x.QualificationID == this.request.ProfessionalQualificationID)?.IsDocCompulsory;
    if (DocRequried == 1) {
      if (this.request.UploadDocument == '') {
        this.isUploadDocRequried = true;
        isValid = false;
      }
    }
    return isValid;
  }

  async AddMoreEducationalQualification() {
    this.FormValid = true;
    this.isUploadDocRequried = false;
    try {
      this.isAddMore = true;
      if (this.StaffEducationDetailForm.invalid) {
        this.FormValid = false;
      }

      this.FormValid = this.ProfessionalQualification_Change();

      if (!this.FormValid) {
        return;
      }

      if (Number(this.request.Marks) > 100) {
        this.request.Marks = '';
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
        Marks: Number(this.request.Marks),
        ProfessionalQualification: this.ProfessionalQualificationData.find((x: { QualificationID: number; }) => x.QualificationID == this.request.ProfessionalQualificationID).QualificationName,
        PassingYear: this.request.PassingYearID.toString(),
        UploadDocument: this.request.UploadDocument,
        UploadDocumentPath: this.request.UploadDocumentPath,
        UploadDocument_Dis_FileName: this.request.UploadDocument_Dis_FileName,
      });
      this.request.ProfessionalQualificationID = 0;
      this.request.PassingYearID = 0;
      this.request.StreamSubject = '';
      this.request.UniversityBoardInstitutionName = '';
      this.request.Marks = '';
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

  async ValidateDocumentImage(event: any, Type: string) {
    this.isAadhaarCard = false;
    this.isPANCard = false;
    if (event.target.files && event.target.files[0]) {
      if ((event.target.files[0].type === 'image/jpeg' && Type == 'ProfilePhoto') ||
        (Type != 'ProfilePhoto' && event.target.files[0].type === 'application/pdf') ||
        (event.target.files[0].type === 'image/jpg' && Type == 'ProfilePhoto')) {
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
        this.toastr.warning(Type == 'ProfilePhoto' ? 'Select Only jpg/jpeg' : 'Select Only pdf');
        return
      }
      // upload
      this.file = event.target.files[0];
      try {
        this.loaderService.requestStarted();
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFiles(Type, true, data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"]);
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
      catch (ex) { }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }

    }
    else {
      this.ResetFiles(Type, false, '', '', '');
    }
  }

  ResetFiles(Type: string, isShow: boolean, fileName: string, filePath: string, dis_Name: string) {
    if (Type == 'ProfilePhoto' || Type == 'All') {
      this.showProfilePhoto = isShow;
      this.request.ProfilePhoto = fileName;
      this.request.ProfilePhotoPath = filePath;
      this.request.ProfilePhoto_Dis_FileName = dis_Name;
    }
    if (Type == 'AadhaarCard' || Type == 'All') {
      this.showAadhaarCard = isShow;
      this.request.AadhaarCard = fileName;
      this.request.AadhaarCardPath = filePath;
      this.request.AadhaarCard_Dis_FileName = dis_Name;
    }
    if (Type == 'PANCard' || Type == 'All') {
      this.showPANCard = isShow;
      this.request.PANCard = fileName;
      this.request.PANCardPath = filePath;
      this.request.PANCard_Dis_FileName = dis_Name;
    }
    if (Type == 'ExperienceCertificate' || Type == 'All') {
      this.showExperienceCertificate = isShow;
      this.request.ExperienceCertificate = fileName;
      this.request.ExperienceCertificatePath = filePath;
      this.request.ExperienceCertificate_Dis_FileName = dis_Name;
    }
    if (Type == 'UploadDocument' || Type == 'All') {
      this.showUploadDocument = isShow;
      this.request.UploadDocument = fileName;
      this.request.UploadDocumentPath = filePath;
      this.request.UploadDocument_Dis_FileName = dis_Name;
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
      // owner
      if (this.request.StaffDetailID > 0) {
        this.request.ModifyBy = 1;
      }
      else {
        this.request.CreatedBy = 1;
        this.request.ModifyBy = 1;
      }
      //post
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
            this.ResetControl();
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
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ResetControl() {
    this.request = new StaffDetailDataModel();
    this.isSubmitted = false;
    this.showPANCard = false;
    this.showAadhaarCard = false;
    this.showProfilePhoto = false;
    this.showExperienceCertificate = false;
    this.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
    this.request.ProfessionalQualificationID = 0;
    const btnAdd = document.getElementById('btnAdd')
    if (btnAdd) { btnAdd.innerHTML = "Save"; }
    this.isDisabledResearchGuide = false;
    this.isDisabled = false;
    this.ResetFiles('All', false, '', '', '');
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

  async FillYearData(Maxyear: number, StartYear: number) {
    this.YearData = [];
    for (var i = Maxyear; i > StartYear; i--) {
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
    this.StartYear = DOB.getFullYear() + 18;
    DOB.setFullYear(DOB.getFullYear() + 21);
    this.AppointmentMinDate = new Date(DOB.getFullYear(), DOB.getMonth(), DOB.getDate());
    const Maxyear = this.StartYear == 0 ? 0 : this.MaxDate.getFullYear();
    this.FillYearData(Maxyear, this.StartYear);
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

  async DeleteImage(file: string, Type: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.fileUploadService.DeleteDocument(file).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.ResetFiles(Type, false, '', '', '');
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
          this.request.Marks = '';
          this.GetCollegeWiseSubjectList(this.SelectedCollageID);
          this.OnChangeHighestQualification();
          this.SetDateofAppointment();
          this.showPANCard = true;
          this.showAadhaarCard = true;
          this.showProfilePhoto = this.request.ProfilePhoto != '' ? true : false;
          this.showExperienceCertificate = this.request.ExperienceCertificate != '' ? true : false;
          //profile
          this.ResetFiles('ProfilePhoto', true, this.request.ProfilePhoto, this.request.ProfilePhotoPath, this.request.ProfilePhoto_Dis_FileName);
          //profile
          this.ResetFiles('AadhaarCard', true, this.request.AadhaarCard, this.request.AadhaarCardPath, this.request.AadhaarCard_Dis_FileName);
          //profile
          this.ResetFiles('PANCard', true, this.request.PANCard, this.request.PANCardPath, this.request.PANCard_Dis_FileName);
          //profile
          this.ResetFiles('ExperienceCertificate', true, this.request.ExperienceCertificate, this.request.ExperienceCertificatePath, this.request.ExperienceCertificate_Dis_FileName);
          //profile
          //this.ResetFiles('UploadDocument', true, this.request.UploadDocument, this.request.UploadDocumentPath, this.request.UploadDocument_Dis_FileName);
          this.isDisabled = true;
          this.SetDateofAppointment();
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
