import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EducationalQualificationDetails_StaffDetail, StaffDetailDataModel, StaffDetailDataModel_Excel } from '../../../Models/TabDetailDataModel';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StaffDetailService } from '../../../Services/StaffDetail/staff-detail.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import * as moment from 'moment'
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { resolveAny } from 'dns';
type AOA = any[][];

@Injectable({
  providedIn: 'root'
})

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
  request_Excel = new StaffDetailDataModel_Excel()
  public EducationalQualificationDetails_Excel: EducationalQualificationDetails_StaffDetail[] = [];

  public ProfessionalQualificationData: any = [];
  public HighestQualificationData: any = [];
  public SubjectData: any = [];
  public RoleData: any = [];
  public AllRoleData: any = [];
  public AllQualification: any = [];


  public YearData: any = [];
  public isAadhaarCard: boolean = false;
  public isProfilePhoto: boolean = false;
  public isExperianceCertificate: boolean = false;
  public isPANCard: boolean = false;
  public StaffDetailModel: StaffDetailDataModel[] = [];

  public TotalStaffDetail: number = 0;
  public TotalNonTeachingStaffDetail: number = 0;
  public TotalTeachingStaffDetail: number = 0;

  public isSubject: boolean = false;
  public CourseLevelName: string = '';
  public IsESIDetails: boolean = false;
  public isRole: boolean = false;
  public isSpecializationSubject: boolean = false;
  public isRoleMapping: boolean = false;
  public isUANNumber: boolean = false;
  public isDisabledResearchGuide: boolean = false;
  public isDisabled: boolean = false;
  public ESIStaffShowHide: boolean = false;

  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public AppointmentMinDate: Date = new Date;
  public JoiningMinDate: Date = new Date;
  public isAddMore: boolean = false;
  public isUploadDocRequried: boolean = false;
  public FormValid: boolean = true;
  public QualificationDataValid: boolean = false;

  public showProfilePhoto: boolean = false;
  public showAadhaarCard: boolean = false;
  public showPANCard: boolean = false;
  public showExperienceCertificate: boolean = false;
  public showUploadDocument: boolean = false;
  public IsCourseLevel: string = 'Yes';
  public file: any = '';

  public MaxDate: Date = new Date();
  public DOBMinDate: Date = new Date();
  public StartYear: number = 0;
  closeResult: string | undefined;
  public EducationalQualificationDetailsById: any = [];
  public QueryStringStatus: any = '';
  public SelectedApplyNOCID: number = 0;
  public SearchRecordID: string = '';
  constructor(private loaderService: LoaderService, private toastr: ToastrService, private staffDetailService: StaffDetailService, private fileUploadService: FileUploadService
    , private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private modalService: NgbModal) {

  }

  async ngOnInit() {
    this.DOBMinDate.setFullYear(this.DOBMinDate.getFullYear() - 76);
    this.DOBMinDate = new Date(this.DOBMinDate.getFullYear(), this.DOBMinDate.getMonth(), this.DOBMinDate.getDate());

    this.MaxDate.setFullYear(this.MaxDate.getFullYear() - 18);
    this.MaxDate = new Date(this.MaxDate.getFullYear(), this.MaxDate.getMonth(), this.MaxDate.getDate());

    this.StaffDetailForm = this.formBuilder.group(
      {
        rdTeachingType: ['', Validators.required],
        ddlSubjectId: [''],
        ddlRoleId: ['', [DropdownValidators]],
        txtNameOfPerson: ['', Validators.required],
        txtMobileNo: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$"), Validators.minLength(10), Validators.maxLength(10)]],
        txtEmail: ['', [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
        txtPANNo: ['', [Validators.maxLength(10), Validators.pattern("^[A-Za-z]{5}[0-9]{4}[A-Za-z]$")]],
        ddlHighestQualificationId: ['', [DropdownValidators]],
        txtNoOfYearExperience: ['', Validators.required],
        ProfilePhoto: [''],
        ddlGender: ['', [Validators.required]],
        AadhaarCard: [''],
        PANCard: [''],
        ExperienceCertificate: [''],
        NETCertificate: [''],
        txtAadhaarNo: ['', [Validators.required, Validators.pattern("^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$"), Validators.minLength(12), Validators.maxLength(12)]],
        dtDOB: ['', Validators.required],
        dtDateOfAppointment: ['', Validators.required],
        dtDateOfJoining: ['', Validators.required],
        txtSpecializationSubject: [''],
        //txtRoleMapping: [''],
        txtSalary: ['', Validators.required],
        rdStaffStatus: ['', Validators.required],
        rdPFDeduction: [''],
        txtUANNo: [''],
        rdResearchGuide: [''],
        txtESINumber: [''],
        fileData: [''],
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

    if (this.SelectedDepartmentID == 4) {
      this.ShowFileDownload = true;
    }
    else {
      this.ShowFileDownload = false;
    }

    //this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.CollegeID = data['Data']['CollegeID'];
          this.SelectedCollageID = data['Data']['CollegeID'];
          if (this.request.CollegeID == null || this.request.CollegeID == 0 || this.request.CollegeID == undefined) {
            this.routers.navigate(['/draftapplicationlist']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();

    await this.GetCourseLevelByCollegeIDAndDepartmentID();
    await this.GetCollegeWiseSubjectList(this.SelectedCollageID);
    await this.GetQualificationList_DepartmentAndTypeWise();
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

  async IsChnageTechingType(val: any) {
    this.GetCollegeWiseSubjectList(this.SelectedCollageID);
    this.ProfessionalQualificationData = [];
    this.request.HighestQualification = 0;
    this.request.SubjectID = 0;
    this.DeleteResetFiles('All', false, '', '', '');
    await this.GetStaffDesignation(this.request.TeachingType == 'Teaching' ? 1 : 0);
    await this.GetHighestQualificationList_DepartmentAndTypeWise(this.SelectedDepartmentID, this.request.TeachingType == 'Teaching' ? 1 : 0);
    if (this.SelectedDepartmentID == 2) {
      if (this.CourseLevelName == 'Diploma')
        this.IsCourseLevel = 'No';
      else
        this.IsCourseLevel = 'Yes';
    }
    else
      this.IsCourseLevel = 'Yes';
  }

  async AddMoreEducationalQualification() {
    this.FormValid = true;
    this.isUploadDocRequried = false;
    try {
      this.isAddMore = true;
      this.FormValid = this.ProfessionalQualification_Change();

      if (this.StaffEducationDetailForm.invalid) {
        this.FormValid = false;
      }
      if (!this.FormValid) {
        return;
      }

      if (Number(this.request.Marks) > 100) {
        this.request.Marks = '';
        this.toastr.warning('Invalid Percentage/Grade');
        return;
      }

      if (this.request.UploadDocument == '' || this.request.UploadDocument == undefined) {
        this.isUploadDocRequried = true;
        this.toastr.warning('Upload Educational Qualification Document');
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
      this.file = document.getElementById('UploadDocument');
      this.file.value = '';
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

  async GetHighestQualificationList_DepartmentAndTypeWise(DepartmentID: number, IsTeaching: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetQualificationMasterList_DepartmentWise(DepartmentID, IsTeaching)
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

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode == 47 || charCode < 46 || charCode > 57)) {
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

  alphaNumricOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  alphaNumircDecimalOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[A-Za-z0-9.+]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  async GetCollegeWiseSubjectList(CollegeID: number) {
    try {
     
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeWise_SubjectList_StaffDetails(this.SelectedCollageID, 'SubjectList', 0)//4=existing
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SubjectData = data['Data'][0];
          console.log(this.SubjectData);
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

  async GetStaffDesignation(IsTeaching: number) {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffDesignation(IsTeaching, this.SelectedDepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoleData = data['Data'][0]['data'];
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
    this.isProfilePhoto = false;
    this.isExperianceCertificate = false;
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
    try {
      this.loaderService.requestStarted();
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
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  DeleteResetFiles(Type: string, isShow: boolean, fileName: string, filePath: string, dis_Name: string) {
    try {
      this.loaderService.requestStarted();
      if (Type == 'ProfilePhoto' || Type == 'All') {
        this.showProfilePhoto = isShow;
        this.request.ProfilePhoto = fileName;
        this.request.ProfilePhotoPath = filePath;
        this.request.ProfilePhoto_Dis_FileName = dis_Name;
        this.file = document.getElementById('ProfilePhoto');
        this.file.value = '';
      }
      if (Type == 'AadhaarCard' || Type == 'All') {
        this.showAadhaarCard = isShow;
        this.request.AadhaarCard = fileName;
        this.request.AadhaarCardPath = filePath;
        this.request.AadhaarCard_Dis_FileName = dis_Name;
        this.file = document.getElementById('AadhaarCard');
        this.file.value = '';
      }
      if (Type == 'PANCard' || Type == 'All') {
        this.showPANCard = isShow;
        this.request.PANCard = fileName;
        this.request.PANCardPath = filePath;
        this.request.PANCard_Dis_FileName = dis_Name;
        this.file = document.getElementById('PANCard');
        this.file.value = '';
      }
      if (Type == 'ExperienceCertificate' || Type == 'All') {
        this.showExperienceCertificate = isShow;
        this.request.ExperienceCertificate = fileName;
        this.request.ExperienceCertificatePath = filePath;
        this.request.ExperienceCertificate_Dis_FileName = dis_Name;
        this.file = document.getElementById('ExperienceCertificate');
        this.file.value = '';
      }
      if (Type == 'UploadDocument' || Type == 'All') {
        this.showUploadDocument = isShow;
        this.request.UploadDocument = fileName;
        this.request.UploadDocumentPath = filePath;
        this.request.UploadDocument_Dis_FileName = dis_Name;
        this.file = document.getElementById('UploadDocument');
        this.file.value = '';
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async SaveData() {
    try {
      this.isRoleMapping = false;
      this.isSpecializationSubject = false;
      this.FormValid = true;
      this.isUploadDocRequried = false;
      this.isSubmitted = true;
      this.QualificationDataValid = false;
      // this.ESIStaffShowHide = false;
      this.IsESIDetails = false;

      if (this.SelectedDepartmentID != 4) {
        if (this.request.AadhaarCard == '') {
          this.isAadhaarCard = true;
          this.FormValid = false;
        }
      }
      if (this.request.ProfilePhoto == '') {
        this.isProfilePhoto = true;
        this.FormValid = false;
      }
      // check No of exp
      const Joining = new Date(this.request.DateOfJoining);
      const SYear = Joining.getFullYear();
      const cYear = new Date().getFullYear();
      if (Number(this.request.NumberofExperience) > Number(cYear - SYear)) {
        this.toastr.warning('Your experience is more from the date of joining till today, so please fill it correctly.');
        return;
      }
      if (Number(this.request.NumberofExperience) < 0) {
        this.toastr.warning('Your experience is coming in negative year. so please fill it correctly.');
        return;
      }
      if (Number(this.request.NumberofExperience) > 0) {
        if (this.SelectedDepartmentID != 4) {
          if (this.request.ExperienceCertificate == '') {
            this.isExperianceCertificate = true;
            this.FormValid = false;
          }
        }
      }
      if (this.request.PFDeduction == 'Yes') {
        if (this.request.UANNumber == '') {
          this.isUANNumber = true;
          this.FormValid = false;
        }
      }
      if (this.request.TeachingType == 'Teaching' && this.IsCourseLevel == 'Yes') {
        if (this.SelectedDepartmentID != 4 && this.SelectedDepartmentID != 11) {
          if (this.request.SubjectID == 0) {
            this.isSubject = true;
            this.FormValid = false;
          }

          if (this.request.SpecializationSubject == '') {
            this.isSpecializationSubject = true;
            this.FormValid = false;
          }
        }
        
      }

      if (this.request.TeachingType == 'Teaching') {
        if (this.request.Email == '' || this.request.Email == null) {
          this.FormValid = false;
        }
        if (this.request.PANCard == '') {
          this.isPANCard = true;
          this.FormValid = false;
        }
        if (this.request.PANNo == '') {
          this.FormValid = false;
        }
        if (this.request.ResearchGuide == '' || this.request.ResearchGuide == null) {
          this.FormValid = false;
        }
      }
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

      if (this.SelectedDepartmentID == 2) {
        if (this.request.PFDeduction == 'No') {
          this.toastr.warning('PF Deduction is Mandatory');
          return;
        }
        if (this.request.TeachingType == 'Teaching') {
          if (this.request.RoleID == 16)// for Princple
          {
            if (this.request.EducationalQualificationDetails.length > 0) {
              for (var i = 0; i < this.request.EducationalQualificationDetails.length; i++) {
                if (this.request.EducationalQualificationDetails[i].ProfessionalQualification == 'Graduation') {
                  if (Number(this.request.NumberofExperience) < 20) {
                    this.toastr.warning('It is mandatory for the Principal to have at least 20 years of experience in Graduation.');
                    return;
                  }
                }
                else if (this.request.EducationalQualificationDetails[i].ProfessionalQualification == 'Post Graduation' || this.request.EducationalQualificationDetails[i].ProfessionalQualification == 'PHD') {
                  if (Number(this.request.NumberofExperience) < 5) {
                    this.toastr.warning('It is mandatory for the Principal to have at least 5 years of experience in Post Graduation or PHD.');
                    return;
                  }
                }

              }
            }
          }
        }
      }

      let HighestQualificationName = this.HighestQualificationData.find((x: { QualificationID: number; }) => x.QualificationID == this.request.HighestQualification).QualificationName;
      for (var i = 0; i < this.request.EducationalQualificationDetails.length; i++) {
        if (this.request.EducationalQualificationDetails[i].ProfessionalQualification == HighestQualificationName) {
          this.QualificationDataValid = true;
        }
      }
      if (!this.QualificationDataValid) {
        this.QualificationDataValid = false;
        this.toastr.warning('Highest Qualification Document is Required.');
        return;
      }
      if (this.request.Salary == '') {
        this.request.Salary = "0";
      }
      if ((this.TotalStaffDetail > 10) && ((Number(this.request.Salary)/12) < 21000)) {
        if (this.request.ESINumber == '') {
          this.ESIStaffShowHide = true;
          this.IsESIDetails = true;
          this.toastr.warning('If Staff details(Teaching or NoN Teaching) are Greater than 10 employee or salary less then 21000 is mandatory to give ESI No.');
          return;
        }
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
    try {
      this.loaderService.requestStarted();
      this.request = new StaffDetailDataModel();
      this.isSubmitted = false;
      this.showPANCard = false;
      this.showAadhaarCard = false;
      this.showProfilePhoto = false;
      this.showExperienceCertificate = false;
      this.QualificationDataValid = false;
      this.ESIStaffShowHide = false;
      this.IsESIDetails = false;
      this.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
      this.request.ProfessionalQualificationID = 0;
      const btnAdd = document.getElementById('btnAdd')
      if (btnAdd) { btnAdd.innerHTML = "Save"; }
      this.isDisabledResearchGuide = false;
      this.isDisabled = false;
      this.DeleteResetFiles('All', false, '', '', '');
      this.ShowFileDownload = false;
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async OnChangeHighestQualification() {
    try {
      this.loaderService.requestStarted();
      await this.GetQualificationList_DepartmentAndTypeWise();
      var QualificationName = this.HighestQualificationData.find((x: { QualificationID: number; }) => x.QualificationID == this.request.HighestQualification).QualificationName;
      if (QualificationName != 'PHD') {
        this.request.ResearchGuide = 'No';
        this.isDisabledResearchGuide = true;
      }
      else {
        this.isDisabledResearchGuide = false;
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async FillYearData(Maxyear: number, StartYear: number) {
    try {
      this.loaderService.requestStarted();
      this.YearData = [];
      for (var i = Maxyear; i > StartYear; i--) {
        var data = { YearID: i, YearName: i };
        this.YearData.push(data);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  SetDateofAppointment() {
    try {
      this.loaderService.requestStarted();
      const DOB = new Date(this.request.DateOfBirth);
      this.StartYear = DOB.getFullYear()
      DOB.setFullYear(DOB.getFullYear() + 18);
      this.AppointmentMinDate = new Date(DOB.getFullYear(), DOB.getMonth(), DOB.getDate());
      this.JoiningMinDate = new Date(DOB.getFullYear(), DOB.getMonth(), DOB.getDate());
      // Set for Passing Year
      const Maxyear = this.StartYear == 0 ? 0 : this.AppointmentMinDate.getFullYear();
      this.FillYearData(Maxyear, this.StartYear);
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetQualificationList_DepartmentAndTypeWise() {
    try {
      this.loaderService.requestStarted();
      var QualificationName = this.HighestQualificationData.find((x: { QualificationID: number; }) => x.QualificationID == this.request.HighestQualification)?.QualificationName;
      await this.commonMasterService.GetQualificationMasterList_DepartmentWise(this.SelectedDepartmentID, this.request.TeachingType == 'Teaching' ? 1 : 0, 'Qualification')
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ProfessionalQualificationData = data['Data'];
          var OrderBy = this.ProfessionalQualificationData.find((x: { QualificationName: string; }) => x.QualificationName == QualificationName)?.Orderby;
          if (OrderBy != undefined && OrderBy >= 0) {
            this.ProfessionalQualificationData = this.ProfessionalQualificationData.filter((element: any) => element.Orderby >= OrderBy);
          }
          else {
            this.ProfessionalQualificationData = [];
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

  async DeleteImage(file: string, Type: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.fileUploadService.DeleteDocument(file).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.DeleteResetFiles(Type, false, '', '', '');
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
      await this.staffDetailService.GetStaffDetailList_DepartmentCollegeWise(DepartmentID, CollegeID, StaffDetailID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StaffDetailModel = data['Data'];
          this.TotalStaffDetail = this.StaffDetailModel.length;
          if (this.TotalStaffDetail > 10) {
            this.ESIStaffShowHide = true;
          }
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
        .then(async (data_Staff: any) => {

          data_Staff = JSON.parse(JSON.stringify(data_Staff)); 
          console.log(data_Staff);
          this.State = data_Staff['State'];
          this.SuccessMessage = data_Staff['SuccessMessage'];
          this.ErrorMessage = data_Staff['ErrorMessage'];
          this.request = data_Staff['Data'][0];
          //this.request.SubjectID = 1588;
          this.request.ProfessionalQualificationID = 0;
          this.request.PassingYearID = 0;
          this.request.Marks = '';
         // console.log(data_Staff['Data'][0]);
          //await this.GetCollegeWiseSubjectList(this.SelectedCollageID);
          await this.GetStaffDesignation(this.request.TeachingType == 'Teaching' ? 1 : 0);
          await this.GetHighestQualificationList_DepartmentAndTypeWise(this.SelectedDepartmentID, this.request.TeachingType == 'Teaching' ? 1 : 0);
          
         
          console.log(aaa);
          console.log(this.request);
          console.log(data_Staff['Data'][0]);
          console.log(data_Staff['Data'][0]['SubjectID']);
          this.OnChangeHighestQualification();
          //this.SetDateofAppointment();
          this.showPANCard = true;
          this.showAadhaarCard = true;
          this.isProfilePhoto = false;
          this.isExperianceCertificate = false;
          this.showProfilePhoto = this.request.ProfilePhoto != '' ? true : false;

          this.showExperienceCertificate = this.request.ExperienceCertificate != '' ? true : false;
          //profile
          this.ResetFiles('ProfilePhoto', true, this.request.ProfilePhoto, this.request.ProfilePhotoPath, this.request.ProfilePhoto_Dis_FileName);
          //profile
          this.ResetFiles('AadhaarCard', true, this.request.AadhaarCard, this.request.AadhaarCardPath, this.request.AadhaarCard_Dis_FileName);
          //profile
          this.ResetFiles('PANCard', true, this.request.PANCard, this.request.PANCardPath, this.request.PANCard_Dis_FileName);
          //profile
          this.ResetFiles('ExperienceCertificate', this.showExperienceCertificate, this.request.ExperienceCertificate, this.request.ExperienceCertificatePath, this.request.ExperienceCertificate_Dis_FileName);
          //profile
          //this.ResetFiles('UploadDocument', true, this.request.UploadDocument, this.request.UploadDocumentPath, this.request.UploadDocument_Dis_FileName);

          if (this.request.ESINumber != '') {
            this.ESIStaffShowHide = true;
            //this.IsESIDetails = true;
          }

          var aaa = data_Staff['Data'][0]['SubjectID'];
          this.request.SubjectID = 0;
          this.request.SubjectID = aaa;
          //setTimeout(() => {
          //  this.request.SubjectID = data_Staff['Data'][0]['SubjectID'];
          //}, 5000);

          this.isDisabled = true;
          this.SetDateofAppointment();
          this.setPassingYear();
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

  SetNoOfExprience() {
    try {
      this.loaderService.requestStarted();
      const Joining = new Date(this.request.DateOfJoining);
      const SYear = Joining.getFullYear();
      const cYear = new Date().getFullYear();
      this.request.NumberofExperience = (cYear - SYear).toString();
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  CheckDOBDate() {
    try {
      this.loaderService.requestStarted();
      if (this.request.DateOfBirth == '' || this.request.DateOfBirth == null) {
        this.request.DateOfAppointment = ''
        this.request.DateOfJoining = '';
        this.toastr.warning('First select Date Of Birth(DOB)');
      }
      else {
        //Set Joining Date
        this.request.DateOfJoining = '';
        const Appointment = new Date(this.request.DateOfAppointment);
        Appointment.setFullYear(Appointment.getFullYear());
        this.JoiningMinDate = new Date(Appointment.getFullYear(), Appointment.getMonth(), Appointment.getDate());
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  CheckAppointmentDate() {
    try {
      this.loaderService.requestStarted();
      if (this.request.DateOfAppointment == '' || this.request.DateOfAppointment == null || this.request.DateOfBirth == '' || this.request.DateOfBirth == null) {
        this.request.DateOfJoining = '';
        this.toastr.warning('First select Date Of Appointment');
      }
      else {
        this.request.NumberofExperience = "0";
        this.SetNoOfExprience()
        this.setPassingYear();
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  setPassingYear() {
    const DOB = new Date(this.request.DateOfBirth);
    DOB.setFullYear(DOB.getFullYear() + 14);
    this.StartYear = DOB.getFullYear();
    //const DDAppointment = new Date(this.request.DateOfAppointment);
    const DDAppointment = new Date();
    // Set for Passing Year
    const Maxyear = this.StartYear == 0 ? 0 : DDAppointment.getFullYear();
    this.FillYearData(Maxyear, this.StartYear);
  }

  async ViewStaffDetail(content: any, StaffDetailID: number) {
    /*this.request = new StaffDetailDataModel();*/
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.staffDetailService.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, StaffDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.EducationalQualificationDetailsById = data['Data'][0].EducationalQualificationDetails;
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async GetCourseLevelByCollegeIDAndDepartmentID() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCourseLevelByCollegeIDAndDepartmentID(this.SelectedCollageID, this.SelectedDepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseLevelName = data['Data'][0]['data'][0].CourseLevelName;
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

  //Excel Process
  public importExcelData: any = [];
  public importExcelData2: any = [];
  public ShowFileDownload: boolean = false;
  async onFileChange(event: any) {
    try {
      this.request_Excel.AllStaffExcelData = []
      this.importExcelData = [];
      this.importExcelData2 = []
      this.loaderService.requestStarted();

      let workBook: any = null;
      let jsonData = null;
      const reader = new FileReader();
      const file = event.target.files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
        //size validation
        if (file.size > 200000000) {
          this.toastr.error('Select less then 20MB File')
          return
        }
        if (file.size < 10) {
          this.toastr.error('Select more then 1kb File')
          return
        }
      }
      else {// type validation
        this.toastr.error('Select Only xls/xlsx file')
        return
      }
      reader.onload = (event1) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          //console.log(sheet);
          return initial;
        }, {});
        //console.log(jsonData['Pvt_Student_Data']);
        //const dataString = JSON.stringify(jsonData['Pvt_Student_Data']);
        //this.request.Data.push(jsonData['Pvt_Student_Data']);
      }
      reader.readAsBinaryString(file);

      const file1 = event.target.files[0];
      const target: DataTransfer = <DataTransfer>(event.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader1: FileReader = new FileReader();
      reader1.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* grab first sheet */
        const wsname2: string = wb.SheetNames[1];
        const ws2: XLSX.WorkSheet = wb.Sheets[wsname2];

        //debugger;
        /* save data */
        this.importExcelData = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'yyyy-mmm-dd' }));
        this.importExcelData2 = <AOA>(XLSX.utils.sheet_to_json(ws2, { header: 1, raw: false, dateNF: 'yyyy-mmm-dd' }));
        //this.importExcelData.shift();
        //console.log(this.importExcelData);
        //console.log(this.importExcelData2);
        //event.target.value = '';

      };
      reader1.readAsBinaryString(file1);

    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async downloadFile() {
    //var filePath = '../../../assets/ExcelFile/StaffList.xlsx';
    //var link = document.createElement('a');
    //link.href = filePath;
    //link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
    //link.click();
  }
  async BtnUploadExcelData() {
    if (this.importExcelData.length == 0) {
      this.toastr.error("Select Excel File and check data.!");
      return;
    }
    this.request_Excel.AllStaffExcelData = [];

    await this.commonMasterService.GetAllDesignation()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.AllRoleData = data['Data'];
      }, error => console.error(error));

    await this.commonMasterService.GetQualificationMasterList_DepartmentWise(this.SelectedDepartmentID, 0, 'Qualification')
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.AllQualification = data['Data'];
      }, error => console.error(error));

    console.log(this.AllRoleData);
    console.log(this.AllQualification);
    //console.log(this.importExcelData2);

    for (var i = 1; i < this.importExcelData.length; i++) {

      if (this.importExcelData[i][4] != undefined) {
        this.EducationalQualificationDetails_Excel = [];
        for (var j = 1; j < this.importExcelData2.length; j++) {
          var QualificationDetialsID = this.AllQualification.find((x: { QualificationName: string; }) => x.QualificationName == this.importExcelData2[j][1]).QualificationID

          if (this.importExcelData[i][4] == this.importExcelData2[j][0]) {
            await this.EducationalQualificationDetails_Excel.push({
              EducationalQualificationID: 0,
              ProfessionalQualificationID: QualificationDetialsID,
              ProfessionalQualification: this.importExcelData2[j][1],
              StreamSubject: this.importExcelData2[j][2],
              UniversityBoardInstitutionName: this.importExcelData2[j][3],
              PassingYearID: 0,
              PassingYear: this.importExcelData2[j][4],
              Marks: this.importExcelData2[j][5],
              UploadDocument: '',
              UploadDocumentPath: '',
              UploadDocument_Dis_FileName: ''
            })
          }
        }

        console.log(this.importExcelData[i][10]);


        //var date = '/Date(' + this.importExcelData[i][11] + '+0530)/';
        //var nowDate = new Date(parseInt(date.substr(6)));
        //console.log(nowDate);
        //console.log(nowDate);

        //var DateOfBirth = moment.utc('/Date(' + this.importExcelData[i][10]+ '+0530)/');
        //var DateOfAppointment = moment.utc('/Date(' + this.importExcelData[i][11] + '+0530)/');
        //var DateOfJoining = moment.utc('/Date(' + this.importExcelData[i][12] + '+0530)/');


        var DateOfBirth = this.importExcelData[i][10];
        var DateOfAppointment = this.importExcelData[i][11];
        var DateOfJoining = this.importExcelData[i][12];




        var RoleName = (this.importExcelData[i][0] == 'Teaching' ? this.importExcelData[i][1] : this.importExcelData[i][2])
        var RoleID = this.AllRoleData.find((x: { DesignationName: string; }) => x.DesignationName == RoleName).DesignationID;
        console.log(this.importExcelData[i][7]);
        var QualificationID = this.AllQualification.find((x: { QualificationName: string; }) => x.QualificationName == this.importExcelData[i][7]).QualificationID;
        this.request_Excel.AllStaffExcelData.push({
          StaffDetailID: 0,
          TeachingType: this.importExcelData[i][0],
          SubjectName: '',
          RoleName: RoleName,
          SubjectID: 0,
          PersonName: this.importExcelData[i][3],
          RoleID: RoleID,
          MobileNo: this.importExcelData[i][4],
          Email: this.importExcelData[i][5],
          HighestQualification: QualificationID,
          HighestQualificationName: this.importExcelData[i][7],
          NumberofExperience: this.importExcelData[i][13].replace('.00', ''),
          AadhaarNo: this.importExcelData[i][8],
          MaskedAadhaarNo: '',
          //DateOfBirth: DateOfBirth.format('yyyy-MM-dd'),
          //DateOfAppointment: DateOfAppointment.format('yyyy-MM-dd'),
          //DateOfJoining: DateOfJoining.format('yyyy-MM-dd'),
          DateOfBirth: DateOfBirth,
          DateOfAppointment: DateOfAppointment,
          DateOfJoining: DateOfJoining,
          SpecializationSubject: '',
          RoleMapping: '',
          Salary: this.importExcelData[i][14],
          StaffStatus: this.importExcelData[i][15],
          PFDeduction: this.importExcelData[i][16],
          UANNumber: this.importExcelData[i][17],
          ResearchGuide: 'No',
          ProfessionalQualificationID: QualificationID,
          StreamSubject: '',
          UniversityBoardInstitutionName: '',
          PassingYearID: 0,
          Marks: '0',
          ProfilePhoto: '',
          ProfilePhotoPath: '',
          ProfilePhoto_Dis_FileName: '',
          AadhaarCard: '',
          AadhaarCardPath: '',
          AadhaarCard_Dis_FileName: '',
          PANCard: '',
          PANCardPath: '',
          PANCard_Dis_FileName: '',
          ExperienceCertificate: '',
          ExperienceCertificatePath: '',
          ExperienceCertificate_Dis_FileName: '',
          UploadDocument: '',
          UploadDocumentPath: '',
          UploadDocument_Dis_FileName: '',
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          ESINumber: '',
          PANNo: this.importExcelData[i][18],
          CreatedBy: 0,
          ModifyBy: 0,
          IPAddress: '0',
          Action: '',
          Remark: '',
          EducationalQualificationDetails: this.EducationalQualificationDetails_Excel,
          C_Action: '',
          C_Remark: '',
          S_Action: '',
          S_Remark: '',
          Gender: this.importExcelData[i][6],
        });
      }
    }
    try {
      //post
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.SelectedDepartmentID;
      this.request.CollegeID = this.SelectedCollageID;
      await this.staffDetailService.SaveData_ExcelData(this.request_Excel)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.importExcelData = [];
            this.importExcelData2 = [];
            this.request_Excel.FileName = '';
            await this.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }, error => {
          this.toastr.warning("Invalid Excel Data.!");
        })

    }
    catch (Ex) {
      console.log(Ex);
      this.toastr.warning("Invalid Excel Data.!");
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
