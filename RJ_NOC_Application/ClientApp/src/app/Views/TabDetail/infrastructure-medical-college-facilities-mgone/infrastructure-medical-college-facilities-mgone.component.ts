
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InfrastructureMedicalCollegeFacilitiesDataModel, LectureTheatreDetailsDataModel, MuseumDetailsDataModel } from '../../../Models/InfrastructureMedicalCollegeFacilitiesDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DisableRightClickService } from '../../../Services/DisableRightClick/disable-right-click.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { Console, log } from 'console';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { isBoolean } from 'util';
import { GlobalConstants } from '../../../Common/GlobalConstants';
@Component({
  selector: 'app-infrastructure-medical-college-facilities-mgone',
  templateUrl: './infrastructure-medical-college-facilities-mgone.component.html',
  styleUrls: ['./infrastructure-medical-college-facilities-mgone.component.css']
})
export class InfrastructureMedicalCollegeFacilitiesMgoneComponent implements OnInit {
  //public DepartmentID: number = 0;
  //public DepartmentType: number = 0;
  public isDepartmentSubmitted: boolean = false;
  public DepartmentList: any = [];
  public IsDepartmentShowHide: boolean = true;
  public ShowHideLegalEntity: boolean = false;
  isOtherStateNewRegistration: boolean = false;
  isSubmitted: boolean = false;
  isValidateMemberDoc: boolean = true;
  IsActOther: boolean = false;
  IsSocietyRegistration: boolean = true;
  IsOtherInstitution: boolean = false;
  showTrustLogoDoc: boolean = false;
  showTrusteeMemberProofDoc: boolean = false;
  showPresidentAadhaarProofDoc: boolean = false;
  showSocietyPanProofDoc: boolean = false;
  showLectureTheatre: boolean = false;
  showMuseumPhoto: boolean = false;
  showDissectionHallPhoto: boolean = false;
  showSkillLaboratoryPhoto: boolean = false;
  showCentralLibraryPhoto: boolean = false;
  showPowerBackupPhoto: boolean = false;
  ShowNewRegistrationButton: boolean = true;
  showMemberSign: boolean = false;
  public ShowTimer: boolean = false;
  public isTimerDisabled: boolean = false;
  public isSubmitted_Registration: boolean = false;
  public ImageValidate: string = '';

  public RegistrationMaxDate: Date = new Date();
  public MaxDate: Date = new Date();
  public MinDate_DOB: Date = new Date();
  //public MinDate_ElectionPresentManagementCommitteeDate: Date = new Date();
  public MinDate: any = '';
  legalentityForm!: FormGroup;
  legalentityForm_Registration!: FormGroup;

  legalentityOlRegistrationForm!: FormGroup;
  medicalcollegelecturetheatreForm!: FormGroup;
  legalentityAddInstituteForm!: FormGroup;
  medicalcollegelemuseumForm!: FormGroup;
  InfrastructureMedicalcollegeForm!: FormGroup;

  request = new InfrastructureMedicalCollegeFacilitiesDataModel();  
  LectureTheatreDetails = new LectureTheatreDetailsDataModel();
  MuseumDetails = new MuseumDetailsDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public lstDistrict: any = [];
  public lstStateDistrict: any = [];
  public lstSocietyPresentStatus: any = [];
  public lstState: any = [];
  public lstMemberPost: any = [];
  public lstRegisteredAct: any = [];


  public RegistrationDistrict: number = 0;
  public RegistrationState: number = 6;
  public OldRegistrationNo: string = '';

  public isRegisterNoBox: boolean = false;
  public isFormsFill: boolean = false;
  public isGetRegistration: boolean = false;
  public isSocietyList: boolean = false;
  public ScoietyData: any = {};
  public isDisabled: boolean = false;
  public issaveCancelBtn: boolean = false;
  public isSocietyNewReg: boolean = false;
  public isDisabledNewRegistration: boolean = false;
  public isDisabledCommitteeDate: boolean = true;
  public isInstitueAdded: boolean = false;
  public isMemberAdded: boolean = false;
  public isLectureTheatre: boolean = false;
  public isMuseumPhoto: boolean = false;
  public isLecturePhoto: boolean = false;
  public isDissectionHallPhoto: boolean = false;
  public isSkillLaboratoryPhoto: boolean = false;
  public isCentralLibraryPhoto: boolean = false;
  public isPowerBackupPhoto: boolean = false;
  public isMemberSignature: boolean = false;
  public isPresidentAadhaarProofDoc: boolean = false;
  public OTP: string = '';
  public CustomOTP: string = '123456';
  public UserOTP: string = '';

  public isNewRegistrationNo: boolean = false;
  public isNewPreMobileNo: boolean = false;
  public isUserOTP: boolean = false;
  public isValidUserOTP: boolean = false;
  public isNewPreEmailID: boolean = false;


  public isValidLecturePhoto: boolean = false;
  public isValidMuseumPhoto: boolean = false;
  public isValidDissectionHallPhoto: boolean = false;
  public isValidSkillLaboratoryPhoto: boolean = false;
  public isValidCentralLibraryPhoto: boolean = false;
  public isValidPowerBackupPhoto: boolean = false;
  public isValidMemberSignature: boolean = false;
  public isValidTrustLogoDoc: boolean = false;
  public isValidTrusteeMemberProofDoc: boolean = false;
  public isValidPresidentAadhaarProofDoc: boolean = false;
  public isValidSocietyPanProofDoc: boolean = false;

  public MaskedMobileNo: string = '';
  public file: any = '';
  public DisplayTimer: string = ''
  public StartTimer: any = '';
  public isValidMobileNo: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public IsNotMoreThen3Year: boolean = true;

  public ImageValidationMessage_TrusteeMemberProofDoc: string = '';
  public IsTrusteeMemberProofDoc: string = '';
  public ImageValidationMessage_PresidentAadhaarProofDoc: string = '';
  public ImageValidationMessage_SocietyPanProofDoc: string = '';
  public IsSocietyPanProofDoc: string = '';
  public ImageValidationMessage_LecturePhoto: string = '';
  public ImageValidationMessage_MuseumPhoto: string = '';
  public ImageValidationMessage_DissectionHallPhoto: string = '';
  public ImageValidationMessage_SkillLaboratoryPhoto: string = '';
  public ImageValidationMessage_CentralLibraryPhoto: string = '';
  public ImageValidationMessage_PowerBackupPhoto: string = '';
  public ImageValidationMessage_MemberSignature: string = '';
  public ImageValidationMessage_TrustLogoDoc: string = '';
  public IsTrustLogoDoc: string = '';

  public ValidationMinDate: string = '';

  public TransactionNo: string = '';
  public VerifiedOTP: boolean = false;
  public AadharDetails: any = {};


  AadharRequest = new AadharServiceDataModel();

  public QueryStringLegalEntityID: number = 0;
  public UserID: number = 0;

  public AnnexureDocumentPath: string = '';
  public AnnexureName: string = '';
  public holdDepartmentID: number = 0;
  public isValidByLawsDocument: boolean = true;
  public ImageValidationMessage_ByLawsDocument: string = '';
  public QueryStringDepartmentID: number = 0;
  public QueryStringCollegeID: number = 0;
  public SearchRecordID: string = '';
  constructor(private rightClickDisable: DisableRightClickService, private formBuilder: FormBuilder, private legalEntityService: LegalEntityService, private commonMasterService: CommonMasterService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute, private routers: Router, private cdRef: ChangeDetectorRef, private fileUploadService: FileUploadService, private aadharServiceDetails: AadharServiceDetails) {

  }
  async ngOnInit() {

    this.rightClickDisable.disableRightClick();
    this.loaderService.requestStarted();
       
      this.medicalcollegelecturetheatreForm = this.formBuilder.group(
        {
          
          txtLectureTheatrecapacity: ['', Validators.required],
          txtLectureTheatreSize: ['', Validators.required],          
          txtLectureTheatrePhoto: ['']         
        });
      this.medicalcollegelemuseumForm = this.formBuilder.group(
        {
          
          txtMuseum: ['', Validators.required],
          txtMuseumSize: ['', Validators.required],
          txtMuseumPhoto: ['']
        });
    this.InfrastructureMedicalcollegeForm = this.formBuilder.group({
      rdMGOneDemonstrationRoom:[''],
      rdHistology:[''],
      rdClinicalPhysiology:[''],
      rdBiochemistry:[''],
      rdHistopathologyCytopathology:[''],
      rdClinicalPathologyHaematolog:[''],
      rdMicrobiology:[''],
      rdClinicalPharmacologyandComputerAssistedLearning:[''],
      rdDissectionHall:[''],
      txtDissectionHallNumber:[''],
      txtDissectionHallCapacity:[''],
      txtDissectionHallsize:[''],
      rdSkillLaboratory:[''],
      txtLaboratoryNumber:[''],
      txtLaboratoryCapacity:[''],
      rdCentralresearch:[''],
      rdCentralLibrary:[''],
      txtCentralLibraryArea:[''],
      txtCentralLibrarySeatingCapacity:[''],
      txtCentralLibraryBooks:[''],
      JournalsIndianForeign:[''],
      rdRuralHealthTrainingCentre:[''],
      txtRuralHealth:[''],
      rdUrbanHealthTrainingCentre:[''],
      txtUrbanHealth:[''],
      rdPowerBackup:[''],
      txtPowerBackupCapacity:[''],
    })
    // query string
    this.QueryStringDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    //this.QueryStringCollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.CollegeID = data['Data']['CollegeID'];
          this.QueryStringCollegeID = data['Data']['CollegeID'];
          if (this.request.CollegeID == null || this.request.CollegeID == 0 || this.request.CollegeID == undefined) {
            this.routers.navigate(['/draftapplicationlist']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.request.CollegeID);
    console.log(this.QueryStringCollegeID);
    }
    
  get AMform() { return this.medicalcollegelecturetheatreForm.controls; }
  get museumform() { return this.medicalcollegelemuseumForm.controls; } 
  get InfrastructureMedicalcollege() { return this.InfrastructureMedicalcollegeForm.controls; } 
 
  async AddLecturetheatre() {
    debugger;
    try {
      this.CurrentIndex;

      this.isMemberAdded = true;
      this.isLecturePhoto = false;      
      if (this.medicalcollegelecturetheatreForm.invalid) {
        return;
      }     
      if (this.LectureTheatreDetails.LectureTheatreCapacity <'180' ) {
        this.toastr.warning("Lecture Theatre Capacity Must be 180");
        return;
      }
      if (!this.LectureTheatreDetails.LectureTheatrePhoto) {
        this.toastr.warning("Please Select Lecture Theatre Photo");
        return;
      }

      if (this.CurrentIndex != -1) {
        this.request.LectureTheatreDetails.splice(this.CurrentIndex, 1, this.LectureTheatreDetails);
        console.log(this.LectureTheatreDetails);
      }
      else {
        console.log(this.request.LectureTheatreDetails);
        this.loaderService.requestStarted();
        this.request.LectureTheatreDetails.push({
          LectureTheatreID: 0,         
          LectureTheatreCapacity: this.LectureTheatreDetails.LectureTheatreCapacity,
          LectureTheatreSize: this.LectureTheatreDetails.LectureTheatreSize,
          LectureTheatrePhoto: this.LectureTheatreDetails.LectureTheatrePhoto,
          LectureTheatrePhotoPath: this.LectureTheatreDetails.LectureTheatrePhotoPath == '' ? 'N/A' : this.LectureTheatreDetails.LectureTheatrePhotoPath,
          Dis_LectureTheatrePhotoName: this.LectureTheatreDetails.Dis_LectureTheatrePhotoName,
        });
      }
      console.log(this.request.LectureTheatreDetails);
     // this.LectureTheatreDetails = new LectureTheatreDetailsDataModel();
      this.isMemberAdded = false;
      this.showLectureTheatre = false;
      //this.showMemberSign = false;
      // this.showPresidentAadhaarProofDoc = false;
      this.ReseLecturetheatre();
      this.CurrentIndex = -1;
      this.isDisabledGrid = false;
      const btnAdd = document.getElementById('btnAddmember')
      if (btnAdd) { btnAdd.innerHTML = "Add"; }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ReseLecturetheatre() {
    this.LectureTheatreDetails.LectureTheatreID = 0;
    this.LectureTheatreDetails.LectureTheatreCapacity = '';
    this.LectureTheatreDetails.LectureTheatreSize = '';
    this.LectureTheatreDetails.LectureTheatrePhoto = '';
    this.LectureTheatreDetails.LectureTheatrePhotoPath = '';
    this.LectureTheatreDetails.Dis_LectureTheatrePhotoName = '';    
    this.isMemberAdded = false;
    this.showLectureTheatre = false;    
    this.showPresidentAadhaarProofDoc = false;
    this.CurrentIndex = -1;
    this.isDisabledGrid = false;
    const btnAdd = document.getElementById('btnAddmember')
    if (btnAdd) { btnAdd.innerHTML = "Add"; }
  }
  async AddMuseum() {
    debugger;
    try {
      this.CurrentIndex;

      this.isMemberAdded = true;
      this.isLecturePhoto = false;
      if (this.medicalcollegelemuseumForm.invalid) {
        return;
      }
      if (this.MuseumDetails.MuseumCapacity < '50') {
        this.toastr.warning("Museum Capacity Must be 50");
        return;
      }
      if (!this.MuseumDetails.MuseumPhoto) {
        this.toastr.warning("Please Select Museum Photo");
        return;
      }

      if (this.CurrentIndex != -1) {
        this.request.MuseumDetails.splice(this.CurrentIndex, 1, this.MuseumDetails);
        console.log(this.LectureTheatreDetails);
      }
      else {
        console.log(this.request.MuseumDetails);
        this.loaderService.requestStarted();
        this.request.MuseumDetails.push({
          MuseumID: 0,
          MuseumCapacity: this.MuseumDetails.MuseumCapacity,
          MuseumSize: this.MuseumDetails.MuseumSize,
          MuseumPhoto: this.MuseumDetails.MuseumPhoto,
          MuseumPhotoPath: this.MuseumDetails.MuseumPhotoPath == '' ? 'N/A' : this.MuseumDetails.MuseumPhotoPath,
          Dis_MuseumPhotoName: this.MuseumDetails.Dis_MuseumPhotoName,
        });
      }
      console.log(this.request.MuseumDetails);
      // this.LectureTheatreDetails = new LectureTheatreDetailsDataModel();
      this.isMemberAdded = false;
      this.showLectureTheatre = false;
      //this.showMemberSign = false;
      // this.showPresidentAadhaarProofDoc = false;
      this.ReseMuseum();
      this.CurrentIndex = -1;
      this.isDisabledGrid = false;
      const btnAdd = document.getElementById('btnLecturetheatre')
      if (btnAdd) { btnAdd.innerHTML = "Add"; }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ReseMuseum() {
    this.MuseumDetails.MuseumID = 0;
    this.MuseumDetails.MuseumCapacity = '';
    this.MuseumDetails.MuseumSize = '';
    this.MuseumDetails.MuseumPhotoPath = '';
    this.MuseumDetails.MuseumPhoto = '';
    this.MuseumDetails.Dis_MuseumPhotoName = '';
    this.isMemberAdded = false;
    this.showLectureTheatre = false;
    this.showPresidentAadhaarProofDoc = false;
    this.CurrentIndex = -1;
    this.isDisabledGrid = false;
    const btnAdd = document.getElementById('btnAddMuseum')
    if (btnAdd) { btnAdd.innerHTML = "Add"; }
  }
  async DeleteLectureImage(Index: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.LectureTheatreDetails.splice(Index, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async DeleteMuseumMember(Index: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.MuseumDetails.splice(Index, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  btnCancel_Click() {
    this.routers.navigate(['/dashboard']);
  }  
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  ResetControl() {
    try {
      this.loaderService.requestStarted();
      this.request = new InfrastructureMedicalCollegeFacilitiesDataModel();
      this.RegistrationDistrict = 0;
      this.RegistrationState = 6;
      //this.GetRegistrationDistrictListByRegistrationStateID(this.RegistrationState);
      this.OldRegistrationNo = '';
      this.isFormsFill = false;
      this.isGetRegistration = false;
      this.isSocietyList = false;
      this.ScoietyData = {};
      this.isDisabled = false;
      //this.EnableDisableControls(true);
      this.issaveCancelBtn = false;
      this.isSocietyNewReg = false;
      this.isDisabledNewRegistration = false;
      this.isInstitueAdded = false;
      this.isMemberAdded = false;
      this.isLectureTheatre = false;
      this.isMemberSignature = false;
      this.isPresidentAadhaarProofDoc = false;
      const ModelOTP = document.getElementById('ModalOtpVerify');
      if (ModelOTP) ModelOTP.style.display = 'none';
      const ModelWarning = document.getElementById('NotRegistered');
      if (ModelWarning) ModelWarning.style.display = 'none';
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted_Registration = false;
      }, 200);
    }
  } 
  async ValidateImage(event: any, Type: string) {
    debugger;    
    try {

      this.loaderService.requestStarted();
      this.isValidLecturePhoto = false;
      this.isValidMuseumPhoto = false;
      this.isValidDissectionHallPhoto = false;     
      this.isValidSkillLaboratoryPhoto = false;     
      this.isValidCentralLibraryPhoto = false;     
          
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'application/pdf' || event.target.files[0].type === 'image/jpg' || event.target.files[0].type==='image/jpeg') {
          if (event.target.files[0].size > 200000) {
            event.target.value = '';

            if (Type == 'TheatrePhoto') {
              this.isValidLecturePhoto = true;
              this.LectureTheatreDetails.Dis_LectureTheatrePhotoName = '';
              this.LectureTheatreDetails.LectureTheatrePhotoPath = '';
              this.LectureTheatreDetails.LectureTheatrePhoto = '';
              this.ImageValidationMessage_LecturePhoto = 'Select less then 2MB File';
              this.file = document.getElementById('txtLectureTheatrePhoto');
              this.file.value = '';
            }
            if (Type == 'MuseumPhoto') {
              this.isValidMuseumPhoto = true;
              this.MuseumDetails.Dis_MuseumPhotoName = '';
              this.MuseumDetails.MuseumPhotoPath = '';
              this.MuseumDetails.MuseumPhoto = '';
              this.ImageValidationMessage_LecturePhoto = 'Select less then 2MB File';
              this.file = document.getElementById('txtMuseumPhoto');
              this.file.value = '';
            }
            if (Type == 'DissectionHallPhoto') {
              this.isValidDissectionHallPhoto = true;
              this.request.Dis_DissectionHallPhoto = '';
              this.request.DissectionHallPhotoPath = '';
              this.request.DissectionHallPhoto = '';
              this.ImageValidationMessage_LecturePhoto = 'Select less then 2MB File';
              this.file = document.getElementById('txtDissectionHallPhoto');
              this.file.value = '';
            }
            if (Type == 'SkillLaboratoryPhoto') {
              this.isValidSkillLaboratoryPhoto = true;
              this.request.Dis_SkillLaboratoryPhoto = '';
              this.request.SkillLaboratoryPhotoPath = '';
              this.request.SkillLaboratoryPhoto = '';
              this.ImageValidationMessage_SkillLaboratoryPhoto = 'Select less then 2MB File';
              this.file = document.getElementById('txtSkillLaboratoryPhoto');
              this.file.value = '';
            }
            if (Type == 'CentralLibraryPhoto') {
              this.isValidCentralLibraryPhoto = true;
              this.request.Dis_CentralLibraryPhoto = '';
              this.request.CentralLibraryPhotoPath = '';
              this.request.CentralLibraryPhoto = '';
              this.ImageValidationMessage_CentralLibraryPhoto = 'Select less then 2MB File';
              this.file = document.getElementById('txtCentralLibraryPhoto');
              this.file.value = '';
            }
            if (Type == 'PowerBackupPhoto') {
              this.isValidPowerBackupPhoto = true;
              this.request.Dis_PowerBackupPhoto = '';
              this.request.PowerBackupPhotoPath = '';
              this.request.PowerBackupPhoto = '';
              this.ImageValidationMessage_PowerBackupPhoto = 'Select less then 2MB File';
              this.file = document.getElementById('txtPowerBackupPhoto');
              this.file.value = '';
            }           
            
            return
          }          
        }
        else {
          event.target.value = '';

          if (Type == 'TheatrePhoto') {
            this.isValidLecturePhoto = true;
            this.LectureTheatreDetails.Dis_LectureTheatrePhotoName = '';
            this.LectureTheatreDetails.LectureTheatrePhotoPath = '';
            this.LectureTheatreDetails.LectureTheatrePhoto = '';
            this.ImageValidationMessage_LecturePhoto = 'Select Only jpg/jpeg';
            this.file = document.getElementById('txtLectureTheatrePhoto');
            this.file.value = '';
          }
          if (Type == 'MuseumPhoto') {
            this.isValidMuseumPhoto = true;
            this.MuseumDetails.Dis_MuseumPhotoName = '';
            this.MuseumDetails.MuseumPhotoPath = '';
            this.MuseumDetails.MuseumPhoto = '';
            this.ImageValidationMessage_MuseumPhoto = 'Select Only jpg/jpeg';
            this.file = document.getElementById('txtMuseumPhoto');
            this.file.value = '';
          }
          if (Type == 'DissectionHallPhoto') {
            this.isValidDissectionHallPhoto = true;
            this.request.Dis_DissectionHallPhoto = '';
            this.request.DissectionHallPhotoPath = '';
            this.request.DissectionHallPhoto = '';
            this.ImageValidationMessage_DissectionHallPhoto = 'Select less then 2MB File';
            this.file = document.getElementById('txtDissectionHallPhoto');
            this.file.value = '';
          }
          if (Type == 'SkillLaboratoryPhoto') {
            this.isValidSkillLaboratoryPhoto = true;
            this.request.Dis_SkillLaboratoryPhoto = '';
            this.request.SkillLaboratoryPhotoPath = '';
            this.request.SkillLaboratoryPhoto = '';
            this.ImageValidationMessage_SkillLaboratoryPhoto = 'Select less then 2MB File';
            this.file = document.getElementById('txtSkillLaboratoryPhoto');
            this.file.value = '';
          }
          if (Type == 'CentralLibraryPhoto') {
            this.isValidCentralLibraryPhoto = true;
            this.request.Dis_CentralLibraryPhoto = '';
            this.request.CentralLibraryPhotoPath = '';
            this.request.CentralLibraryPhoto = '';
            this.ImageValidationMessage_CentralLibraryPhoto = 'Select less then 2MB File';
            this.file = document.getElementById('txtCentralLibraryPhoto');
            this.file.value = '';
          }
          if (Type == 'PowerBackupPhoto') {
            this.isValidPowerBackupPhoto = true;
            this.request.Dis_PowerBackupPhoto = '';
            this.request.PowerBackupPhotoPath = '';
            this.request.PowerBackupPhoto = '';
            this.ImageValidationMessage_PowerBackupPhoto = 'Select less then 2MB File';
            this.file = document.getElementById('txtPowerBackupPhoto');
            this.file.value = '';
          }
          return
        }

        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          event.target.value = '';
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            if (Type == 'TheatrePhoto') {
              this.showLectureTheatre = true;
              this.LectureTheatreDetails.Dis_LectureTheatrePhotoName = data['Data'][0]["Dis_FileName"];
              this.LectureTheatreDetails.LectureTheatrePhotoPath = data['Data'][0]["FilePath"];
              this.LectureTheatreDetails.LectureTheatrePhoto = data['Data'][0]["FileName"];
              this.ImageValidationMessage_LecturePhoto = '';
              this.file = document.getElementById('txtLectureTheatrePhoto');
              this.file.value = '';
            }
            if (Type == 'MuseumPhoto') {
              this.showMuseumPhoto = true;
              this.MuseumDetails.Dis_MuseumPhotoName = data['Data'][0]["Dis_FileName"];
              this.MuseumDetails.MuseumPhotoPath = data['Data'][0]["FilePath"];
              this.MuseumDetails.MuseumPhoto = data['Data'][0]["FileName"];
              this.ImageValidationMessage_MuseumPhoto = '';
              this.file = document.getElementById('txtMuseumPhoto');
              this.file.value = '';
            }
            if (Type == 'DissectionHallPhoto') {
              this.showDissectionHallPhoto = true;
              this.request.Dis_DissectionHallPhoto = data['Data'][0]["Dis_FileName"];
              this.request.DissectionHallPhotoPath = data['Data'][0]["FilePath"];
              this.request.DissectionHallPhoto = data['Data'][0]["FileName"];             
              this.ImageValidationMessage_DissectionHallPhoto='';             
              this.file = document.getElementById('txtDissectionHallPhoto');
              this.file.value = '';
            }
            if (Type == 'SkillLaboratoryPhoto') {
              this.showSkillLaboratoryPhoto = true;
              this.request.Dis_SkillLaboratoryPhoto = data['Data'][0]["Dis_FileName"];
              this.request.SkillLaboratoryPhotoPath = data['Data'][0]["FilePath"];
              this.request.SkillLaboratoryPhoto = data['Data'][0]["FileName"];             
              this.ImageValidationMessage_SkillLaboratoryPhoto ='';             
              this.file = document.getElementById('txtSkillLaboratoryPhoto');
              this.file.value = '';
            }
            if (Type == 'CentralLibraryPhoto') {
              this.showCentralLibraryPhoto = true;
              this.request.Dis_CentralLibraryPhoto = data['Data'][0]["Dis_FileName"];
              this.request.CentralLibraryPhotoPath = data['Data'][0]["FilePath"];
              this.request.CentralLibraryPhoto = data['Data'][0]["FileName"];
              this.ImageValidationMessage_CentralLibraryPhoto = '';
              this.file = document.getElementById('txtCentralLibraryPhoto');
              this.file.value = '';
            }
            if (Type == 'PowerBackupPhoto') {              
              this.showPowerBackupPhoto = true;
              this.request.Dis_PowerBackupPhoto = data['Data'][0]["Dis_FileName"];
              this.request.PowerBackupPhotoPath = data['Data'][0]["FilePath"];
              this.request.PowerBackupPhoto = data['Data'][0]["FileName"];
              this.ImageValidationMessage_PowerBackupPhoto = '';
              this.file = document.getElementById('txtPowerBackupPhoto');
              this.file.value = '';
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
      this.loaderService.requestStarted();
      // delete from server folder
      await this.fileUploadService.DeleteDocument(file).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        //
        if (this.State == 0) {
          if (Type == 'TheatrePhoto') {
            this.showLectureTheatre = false;
            this.LectureTheatreDetails.Dis_LectureTheatrePhotoName = '';
            this.LectureTheatreDetails.LectureTheatrePhotoPath = '';
            this.LectureTheatreDetails.LectureTheatrePhoto = '';
            this.ImageValidationMessage_LecturePhoto = '';
          }
          if (Type == 'MuseumPhoto') {
            this.showMuseumPhoto = false;
            this.MuseumDetails.Dis_MuseumPhotoName = '';
            this.MuseumDetails.MuseumPhotoPath = '';
            this.MuseumDetails.MuseumPhoto = '';
            this.ImageValidationMessage_MuseumPhoto = '';
          }
          if (Type == 'DissectionHallPhoto') {
            this.showDissectionHallPhoto = false;
            this.request.Dis_DissectionHallPhoto = '';
            this.request.DissectionHallPhotoPath = '';
            this.request.DissectionHallPhoto = ''; 
            this.ImageValidationMessage_DissectionHallPhoto = '';
          }
          if (Type == 'SkillLaboratoryPhoto') {
            this.showSkillLaboratoryPhoto = false;
            this.request.Dis_SkillLaboratoryPhoto = '';
            this.request.SkillLaboratoryPhotoPath = '';
            this.request.SkillLaboratoryPhoto = ''; 
            this.ImageValidationMessage_DissectionHallPhoto = '';
          }
          if (Type == 'CentralLibraryPhoto') {
            this.showCentralLibraryPhoto = false;
            this.request.Dis_CentralLibraryPhoto ='';
            this.request.CentralLibraryPhotoPath = '';
            this.request.CentralLibraryPhoto = '';
            this.ImageValidationMessage_CentralLibraryPhoto = '';            
          }
          if (Type == 'PowerBackupPhoto') {
            this.showPowerBackupPhoto = false;
            this.request.Dis_PowerBackupPhoto = '';
            this.request.PowerBackupPhotoPath = '';
            this.request.PowerBackupPhoto = '';
            this.ImageValidationMessage_PowerBackupPhoto = '';           
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
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  timer(minute: number) {
    clearInterval(this.StartTimer);
    this.ShowTimer = true;
    this.isTimerDisabled = true;
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    this.StartTimer = setInterval(() => {

      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.DisplayTimer = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.ShowTimer = false;
        this.isTimerDisabled = false;
        clearInterval(this.StartTimer);
      }
    }, 1000);
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
  SetDOBmindate() {

    const mindate1 = new Date();
    mindate1.setFullYear(mindate1.getFullYear() - 100);
    this.MinDate_DOB = new Date(mindate1.getFullYear(), mindate1.getMonth(), mindate1.getDate());
  } 
  alphanumbersSpaceOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  alphanumbersOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  public CurrentIndex: number = -1;
  public isDisabledGrid: boolean = false;
  async EditLectureDetail(idx: number) {
    this.CurrentIndex = idx;
    this.isDisabledGrid = true;
    this.LectureTheatreDetails.LectureTheatreID = this.request.LectureTheatreDetails[idx].LectureTheatreID;
    this.LectureTheatreDetails.LectureTheatreCapacity = this.request.LectureTheatreDetails[idx].LectureTheatreCapacity;
    this.LectureTheatreDetails.LectureTheatreSize = this.request.LectureTheatreDetails[idx].LectureTheatreSize;    
    this.LectureTheatreDetails.Dis_LectureTheatrePhotoName = this.request.LectureTheatreDetails[idx].Dis_LectureTheatrePhotoName;
    this.LectureTheatreDetails.LectureTheatrePhoto = this.request.LectureTheatreDetails[idx].LectureTheatrePhoto;
    this.LectureTheatreDetails.LectureTheatrePhotoPath = this.request.LectureTheatreDetails[idx].LectureTheatrePhotoPath;
    this.showLectureTheatre = this.LectureTheatreDetails.LectureTheatrePhoto != '' ? true : false;    
    const btnAdd = document.getElementById('btnLecturetheatre')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }
  async EditMuseumDetail(idx: number) {
    this.CurrentIndex = idx;
    this.isDisabledGrid = true;
    this.MuseumDetails.MuseumID = this.request.MuseumDetails[idx].MuseumID;
    this.MuseumDetails.MuseumCapacity = this.request.MuseumDetails[idx].MuseumCapacity;
    this.MuseumDetails.MuseumSize = this.request.MuseumDetails[idx].MuseumSize;    
    this.MuseumDetails.Dis_MuseumPhotoName = this.request.MuseumDetails[idx].Dis_MuseumPhotoName;
    this.MuseumDetails.MuseumPhoto = this.request.MuseumDetails[idx].MuseumPhoto;
    this.MuseumDetails.MuseumPhotoPath = this.request.MuseumDetails[idx].MuseumPhotoPath;
    this.showMuseumPhoto = this.MuseumDetails.MuseumPhoto != '' ? true : false;    
    const btnAdd = document.getElementById('btnAddMuseum')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }

  //public isSubmitted: boolean = false
  public isformvalid: boolean = true;
  //async SaveData() {
  //  this.isSubmitted = true;
  //  this.isformvalid = true;
  //  if (this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == '') {
  //    this.isformvalid = false;
  //  }
  //  if (((this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'Yes') || this.request.IsHillytribalArea == 'No') && this.request.HospitalStatus == '') {
  //    this.isformvalid = false;
  //  }
  //  if (((this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'Yes') || this.request.IsHillytribalArea == 'No')) {
  //    var TotalBed =
  //      Number(this.request.MedicalBeds) +
  //      Number(this.request.SurgicalBeds) +
  //      Number(this.request.ObstetricsBeds) + Number(this.request.PediatricsBeds) + Number(this.request.OrthoBeds)
  //      + Number(this.request.PsychiatryBeds) + Number(this.request.EmergencyMedicineBeds);
  //    //TotalBed < 300
  //    if (TotalBed < 100) {
  //      this.toastr.warning('100 bed manadatory for own/parent hospital');
  //      //this.toastr.warning('300 bed manadatory for own/parent hospital');
  //      return;
  //    }
  //  }
  //  if ((this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'Yes') || this.request.IsHillytribalArea == 'No') {
  //    if (this.request.HospitalMOU == '') {
  //      this.isformvalid = false;
  //    }
  //    if (this.request.BedOccupancy == '') {
  //      this.isformvalid = false;
  //    }
  //    if (this.request.FireNOC == '') {
  //      this.isformvalid = false;
  //    }
  //    if (this.request.PollutionCertificate == '') {
  //      this.isformvalid = false;
  //    }
  //    if (this.request.ClinicalEstablishment == '') {
  //      this.isformvalid = false;
  //    }
  //    if (this.request.UndertakingNotAffiliated == '') {
  //      this.isformvalid = false;
  //    }
  //    if (this.request.StaffInformation == '') {
  //      this.isformvalid = false;
  //    }
  //  }

  //  if (((this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'Yes') || this.request.IsHillytribalArea == 'No') && this.request.HospitalStatus == 'Own' && this.request.OwnerName == '') {
  //    this.isformvalid = false;
  //  }
  //  if (((this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'Yes') || this.request.IsHillytribalArea == 'No') && this.request.HospitalStatus == 'Parental' && this.request.SocietyMemberID <= 0) {
  //    this.isformvalid = false;
  //  }
  //  if (this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'No') {
  //    this.HospitalForm.get('txtHospitalName')?.clearValidators();
  //    this.HospitalForm.get('txtHospitalName')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtRegistrationNo')?.clearValidators();
  //    this.HospitalForm.get('txtRegistrationNo')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtHospitalContactNo')?.clearValidators();
  //    this.HospitalForm.get('txtHospitalContactNo')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtHospitalEmailID')?.clearValidators();
  //    this.HospitalForm.get('txtHospitalEmailID')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtAddressLine1')?.clearValidators();
  //    this.HospitalForm.get('txtAddressLine1')?.updateValueAndValidity();
  //    this.HospitalForm.get('rbRuralUrban')?.clearValidators();
  //    this.HospitalForm.get('rbRuralUrban')?.updateValueAndValidity();
  //    this.HospitalForm.get('ddlDivisionID')?.clearValidators();
  //    this.HospitalForm.get('ddlDivisionID')?.updateValueAndValidity();
  //    this.HospitalForm.get('ddlDistrictID')?.clearValidators();
  //    this.HospitalForm.get('ddlDistrictID')?.updateValueAndValidity();
  //    this.HospitalForm.get('ddlTehsilID')?.clearValidators();
  //    this.HospitalForm.get('ddlTehsilID')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtCityTownVillage')?.clearValidators();
  //    this.HospitalForm.get('txtCityTownVillage')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtPincode')?.clearValidators();
  //    this.HospitalForm.get('txtPincode')?.updateValueAndValidity();
  //    //this.HospitalForm.get('fHospitalMOU')?.clearValidators();
  //    //this.HospitalForm.get('fHospitalMOU')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtBedCapacity')?.clearValidators();
  //    this.HospitalForm.get('txtBedCapacity')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtMedicalBeds')?.clearValidators();
  //    this.HospitalForm.get('txtMedicalBeds')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtSurgicalBeds')?.clearValidators();
  //    this.HospitalForm.get('txtSurgicalBeds')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtObstetricsBeds')?.clearValidators();
  //    this.HospitalForm.get('txtObstetricsBeds')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtPediatricsBeds')?.clearValidators();
  //    this.HospitalForm.get('txtPediatricsBeds')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtOrthoBeds')?.clearValidators();
  //    this.HospitalForm.get('txtOrthoBeds')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtEmergencyMedicineBeds')?.clearValidators();
  //    this.HospitalForm.get('txtEmergencyMedicineBeds')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtPsychiatryBeds')?.clearValidators();
  //    this.HospitalForm.get('txtPsychiatryBeds')?.updateValueAndValidity();
  //    this.HospitalForm.get('ddlTehsilID')?.clearValidators();
  //    this.HospitalForm.get('ddlTehsilID')?.updateValueAndValidity();
  //    this.HospitalForm.get('ddlTehsilID')?.clearValidators();
  //    this.HospitalForm.get('ddlTehsilID')?.updateValueAndValidity();
  //    //this.HospitalForm.get('fBedOccupancy')?.clearValidators();
  //    //this.HospitalForm.get('fBedOccupancy')?.updateValueAndValidity();
  //    //this.HospitalForm.get('fFireNOC')?.clearValidators();
  //    //this.HospitalForm.get('fFireNOC')?.updateValueAndValidity();
  //    //this.HospitalForm.get('fPollutionCertificate')?.clearValidators();
  //    //this.HospitalForm.get('fPollutionCertificate')?.updateValueAndValidity();
  //    //this.HospitalForm.get('fClinicalEstablishment')?.clearValidators();
  //    //this.HospitalForm.get('fClinicalEstablishment')?.updateValueAndValidity();
  //    //this.HospitalForm.get('fUndertakingNotAffiliated')?.clearValidators();
  //    //this.HospitalForm.get('fUndertakingNotAffiliated')?.updateValueAndValidity();
  //    //this.HospitalForm.get('fStaffInformation')?.clearValidators();
  //    //this.HospitalForm.get('fStaffInformation')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtCollegeDistance')?.clearValidators();
  //    this.HospitalForm.get('txtCollegeDistance')?.updateValueAndValidity();
  //    this.HospitalForm.get('txtNumberofdeliveries')?.clearValidators();
  //    this.HospitalForm.get('txtNumberofdeliveries')?.updateValueAndValidity();
  //    this.HospitalForm.get('ddlCityID')?.clearValidators();
  //    this.HospitalForm.get('ddlCityID')?.updateValueAndValidity();
  //    this.HospitalForm.get('ddlPanchayatSamitiID')?.clearValidators();
  //    this.HospitalForm.get('ddlPanchayatSamitiID')?.updateValueAndValidity();
  //  }
  //  else {
  //    if (this.request.RuralUrban == 1) {
  //      this.HospitalForm.get('ddlCityID')?.clearValidators();
  //      this.HospitalForm.get('ddlCityID')?.updateValueAndValidity();
  //      this.HospitalForm.get('ddlPanchayatSamitiID')?.setValidators([DropdownValidators]);
  //      this.HospitalForm.get('ddlPanchayatSamitiID')?.updateValueAndValidity();
  //    }
  //    if (this.request.RuralUrban == 2) {
  //      this.HospitalForm.get('ddlPanchayatSamitiID')?.clearValidators();
  //      this.HospitalForm.get('ddlPanchayatSamitiID')?.updateValueAndValidity();
  //      this.HospitalForm.get('ddlCityID')?.setValidators([DropdownValidators]);
  //      this.HospitalForm.get('ddlCityID')?.updateValueAndValidity();
  //    }
  //  }
  //  if (this.request.IsHillytribalArea == 'No' && this.request.CollegeDistance > 30) {
  //    return;
  //  }
  //  if (this.request.IsHillytribalArea == 'Yes' && this.request.CollegeDistance > 50) {
  //    return;
  //  }
  //  if (this.HospitalForm.invalid) {
  //    this.isformvalid = false;
  //  }
  //  if (this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'No') {
  //    if (this.request.MGThreeAffiliatedHospitalList.length <= 0) {
  //      this.toastr.warning('Please add one Affiliated Hospital');
  //      return;
  //    }
  //  }

  //  console.log(this.HospitalForm);
  //  if (!this.isformvalid) {
  //    return
  //  }
  //  // save data
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.hospitalDetailService.SaveMGThreeHospitalData(this.request)
  //      .then(async (data: any) => {
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        //console.log(this.State);

  //        if (!this.State) {
  //          this.toastr.success(this.SuccessMessage);
  //          await this.GetMGThreeHospitalDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
  //          // reset
  //          this.ResetDetails();
  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage)
  //        }
  //        // get data
  //      })
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }

  //  this.isSubmitted = false;

  //}
  async SaveData() {

  }
}
