
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InfrastructureMedicalCollegeFacilitiesDataModel, LectureTheatreDetailsDataModel, MuseumDetailsDataModel, DissectionHallDetailsDataModel, SkillLaboratoryDetailsDataModel } from '../../../Models/InfrastructureMedicalCollegeFacilitiesDataModel';
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
  showUploadPhotoHistologyPhoto: boolean = false;
  showUploadPhotoClinicalPhysiologyPhoto: boolean = false;
  showUploadPhotoBiochemistryPhoto: boolean = false;
  showUploadPhotoHistopathologyCytopathologyPhoto: boolean = false;
  showUploadPhotoClinicalPathologyHaematologPhoto: boolean = false;
  showUploadPhotoMicrobiologyPhoto: boolean = false;
  showUploadPhotoClinicalPharmacologyandComputerAssistedLearningPhoto: boolean = false;
  showJournalsIndianForeignList: boolean = false;
  showCentralLibrarybooksList: boolean = false;
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
  medicalcollegeDissectionHallForm!: FormGroup;
  medicalcollegeSkillLaboratoryForm!: FormGroup;
  request = new InfrastructureMedicalCollegeFacilitiesDataModel();  
  LectureTheatreDetails = new LectureTheatreDetailsDataModel();
  MuseumDetails = new MuseumDetailsDataModel();
  DissectionHallDetails = new DissectionHallDetailsDataModel();
  SkillLaboratoryDetails = new SkillLaboratoryDetailsDataModel();
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
  public isUploadPhotoHistologyPhoto: boolean = false;
  public isUploadPhotoClinicalPhysiology: boolean = false;
  public isUploadPhotoBiochemistryPhoto: boolean = false;
  public isUploadPhotoHistopathologyCytopathologyPhoto: boolean = false;
  public isUploadPhotoClinicalPathologyHaematologPhoto: boolean = false;
  public isUploadPhotoMicrobiologyPhoto: boolean = false;
  public isUploadPhotoClinicalPharmacologyandComputerAssistedLearningPhoto: boolean = false;
  public isCentralLibrarybooksList: boolean = false;
  public isJournalsIndianForeignList: boolean = false;
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
  public isValidUploadPhotoHistologyPhoto: boolean = false;
  public isValidUploadPhotoClinicalPhysiology: boolean = false;
  public isValidUploadPhotoBiochemistryPhoto: boolean = false;
  public isValidUploadPhotoHistopathologyCytopathologyPhoto: boolean = false;
  public isValidUploadPhotoClinicalPathologyHaematologPhoto: boolean = false;
  public isValidUploadPhotoMicrobiologyPhoto: boolean = false;
  public isValidUploadPhotoClinicalPharmacologyandComputerAssistedLearningPhoto: boolean = false;
  public isValidCentralLibrarybooksList: boolean = false;
  public isValidJournalsIndianForeignList: boolean = false;

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
  public ImageValidationMessage_UploadPhotoHistology: string = '';
  public ImageValidationMessage_UploadPhotoClinicalPhysiology: string = '';
  public ImageValidationMessage_UploadPhotoBiochemistryPhoto: string = '';
  public ImageValidationMessage_UploadPhotoHistopathologyCytopathology: string = '';
  public ImageValidationMessage_UploadPhotoClinicalPathologyHaematolog: string = '';
  public ImageValidationMessage_UploadPhotoMicrobiologyPhoto: string = '';
  public ImageValidationMessage_UploadPhotoClinicalPharmacologyandComputerAssistedLearning: string = '';
  public ImageValidationMessage_CentralLibrarybooksList: string = '';
  public ImageValidationMessage_JournalsIndianForeignList: string = '';
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
   // this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //console.log(this.sSOLoginDataModel);
    //this.rightClickDisable.disableRightClick();
    this.loaderService.requestStarted();
       
      this.medicalcollegelecturetheatreForm = this.formBuilder.group(
        {
          
          txtLectureTheatreType: ['', Validators.required],
          txtLectureTheatrecapacity: ['', Validators.required],
          txtLectureTheatreSize: ['', Validators.required],          
          txtLectureTheatrePhoto: ['']         
        });
      this.medicalcollegelemuseumForm = this.formBuilder.group(
        {
          
          txtMuseumType: ['', Validators.required],
          txtMuseum: ['', Validators.required],
          txtMuseumSize: ['', Validators.required],
          txtMuseumPhoto: ['']
        });
    this.medicalcollegeDissectionHallForm = this.formBuilder.group(
       {
        txtDissectionHallNumber: ['', Validators.required],
        txtDissectionHallCapacity: ['', Validators.required],
        txtDissectionHallsize: ['', Validators.required],       
        txtDissectionHallPhoto: ['']
      });
    this.medicalcollegeSkillLaboratoryForm = this.formBuilder.group(
       {
        txtLaboratoryNumber: ['', Validators.required],
        txtLaboratorySize: ['', Validators.required],              
        txtSkillLaboratoryPhoto: ['']    
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
      txtUploadPhotoHistology:[''],
      txtUploadPhotoClinicalPhysiology:[''],
      txtUploadPhotoBiochemistry:[''],
      txtUploadPhotoHistopathologyCytopathologyPhoto:[''],
      txtUploadPhotoClinicalPathologyHaematologPhoto:[''],
      txtUploadPhotoMicrobiologyPhoto:[''],
      txtUploadPhotoClinicalPharmacologyandComputerAssistedLearningPhoto:[''],
      txtCentralLibrarybooksList:[''],
      txtJournalsIndianForeignList:[''],
    })
    // query string
    this.QueryStringDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    //this.QueryStringCollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then(async(data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.CollegeID = data['Data']['CollegeID'];
          this.QueryStringCollegeID = data['Data']['CollegeID'];
          if (this.request.CollegeID == null || this.request.CollegeID == 0 || this.request.CollegeID == undefined) {
            this.routers.navigate(['/draftapplicationlist']);
          }
          await this.commonMasterService.GetGetInfrastructuremedicalgrouponeData(this.request.CollegeID)


        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.request.CollegeID);
    console.log(this.QueryStringCollegeID);
    
     await this.commonMasterService.GetGetInfrastructuremedicalgrouponeData(this.request.CollegeID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          console.log(data['Data']);
          if (data['Data'] != null) {
            this.GetInfrastructuremedicalgrouponecollege();
            // await this.FilterAffiliationCourseStatusBter();
          }
          
          }, error => console.error(error));
   

    }
    
  get AMform() { return this.medicalcollegelecturetheatreForm.controls; }
  get museumform() { return this.medicalcollegelemuseumForm.controls; } 
  get InfrastructureMedicalcollege() { return this.InfrastructureMedicalcollegeForm.controls; } 
  get medicalcollegeDissectionHall() { return this.medicalcollegeDissectionHallForm.controls; } 
  get medicalcollegeSkillLaboratory() { return this.medicalcollegeSkillLaboratoryForm.controls; } 
 
  async AddLecturetheatre() {
    debugger;
    try {
      this.CurrentIndex;

      this.isMemberAdded = true;
      this.isLecturePhoto = false;      
      if (this.medicalcollegelecturetheatreForm.invalid) {
        return;
      }     
      if (this.LectureTheatreDetails.LectureTheatreCapacity <180 ) {
        this.toastr.warning("Lecture Theatre Capacity Minimum 180 !");
        return;
      }
      if (this.LectureTheatreDetails.LectureTheatreSize<=0) {
        this.toastr.warning("Please Input Lecture Theatre Size !");
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
          LectureTheatreType: this.LectureTheatreDetails.LectureTheatreType,
        });
      }
      console.log(this.request.LectureTheatreDetails);
     // this.LectureTheatreDetails = new LectureTheatreDetailsDataModel();
      //this.isMemberAdded = false;
      //this.showLectureTheatre = false;
      //this.showMemberSign = false;
      // this.showPresidentAadhaarProofDoc = false;
      this.ReseLecturetheatre();
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
  async ReseLecturetheatre() {
    this.LectureTheatreDetails.LectureTheatreID = 0;
    this.LectureTheatreDetails.LectureTheatreCapacity = 0;
    this.LectureTheatreDetails.LectureTheatreSize = 0;
    this.LectureTheatreDetails.LectureTheatrePhoto = '';
    this.LectureTheatreDetails.LectureTheatrePhotoPath = '';
    this.LectureTheatreDetails.Dis_LectureTheatrePhotoName = '';
    this.LectureTheatreDetails.LectureTheatreType = '';    
    this.isMemberAdded = false;
    this.showLectureTheatre = false;    
    this.showPresidentAadhaarProofDoc = false;
    this.CurrentIndex = -1;
    this.isDisabledGrid = false;
    const btnAdd = document.getElementById('btnLecturetheatre')
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

  async AddMuseum() {
    debugger;
    try {
      this.CurrentIndex;

      this.isMemberAdded = true;
      this.isLecturePhoto = false;
      if (this.medicalcollegelemuseumForm.invalid) {
        return;
      }
      if (this.MuseumDetails.MuseumCapacity < 50) {
        this.toastr.warning("Museum Capacity Minimum 50 !");
        return;
      }
      if (this.MuseumDetails.MuseumSize <=0) {
        this.toastr.warning("Please Input Museum Size!");
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
          MuseumType: this.MuseumDetails.MuseumType,
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
      const btnAdd = document.getElementById('btnAddMuseum')
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
    this.MuseumDetails.MuseumCapacity = 0;
    this.MuseumDetails.MuseumSize = 0;
    this.MuseumDetails.MuseumPhotoPath = '';
    this.MuseumDetails.MuseumPhoto = '';
    this.MuseumDetails.Dis_MuseumPhotoName = '';
    this.MuseumDetails.MuseumType = '';
    this.isMemberAdded = false;
    this.showLectureTheatre = false;
    this.showPresidentAadhaarProofDoc = false;
    this.CurrentIndex = -1;
    this.isDisabledGrid = false;
    const btnAdd = document.getElementById('btnAddMuseum')
    if (btnAdd) { btnAdd.innerHTML = "Add"; }
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

  async AddDissectionHall() {
    debugger;
    try {
      this.CurrentIndex;      
      this.isMemberAdded = true;
      this.isLecturePhoto = false;
      if (this.medicalcollegeDissectionHallForm.invalid) {
        return;
      }
      if (this.DissectionHallDetails.DissectionHallNumber <=0) {
        this.toastr.warning("This field is required  enter value above Zero Dissection Hall Number.!");
        return;
      }
      if (this.DissectionHallDetails.DissectionHallCapacity < 75) {
        this.toastr.warning("Dissection Hall Capacity Minimum 75 !");
        return;
      }
      if (this.DissectionHallDetails.DissectionHallsize < 315) {
        this.toastr.warning("Dissection Hall size Minimum 315 (sq.mt) !");
        return;
      }     

      if (this.CurrentIndex != -1) {
        this.request.DissectionHallDetails.splice(this.CurrentIndex, 1, this.DissectionHallDetails);
        console.log(this.LectureTheatreDetails);
      }
      else {
        console.log(this.request.DissectionHallDetails);
        this.loaderService.requestStarted();
        this.request.DissectionHallDetails.push({
          DissectionID: 0,
          DissectionHallNumber: this.DissectionHallDetails.DissectionHallNumber,
          DissectionHallCapacity: this.DissectionHallDetails.DissectionHallCapacity,
          DissectionHallsize: this.DissectionHallDetails.DissectionHallsize,
          DissectionHallPhoto: this.DissectionHallDetails.DissectionHallPhoto,
          DissectionHallPhotoPath: this.DissectionHallDetails.DissectionHallPhotoPath == '' ? 'N/A' : this.DissectionHallDetails.DissectionHallPhotoPath,
          Dis_DissectionHallPhoto: this.DissectionHallDetails.Dis_DissectionHallPhoto,
        });
      }
      console.log(this.request.DissectionHallDetails);
      // this.LectureTheatreDetails = new LectureTheatreDetailsDataModel();
     // this.isMemberAdded = false;
      //this.showLectureTheatre = false;
      //this.showMemberSign = false;
      // this.showPresidentAadhaarProofDoc = false;
      this.ReseDissectionHall();
      this.CurrentIndex = -1;
      this.isDisabledGrid = false;
      const btnAdd = document.getElementById('btnDissectionHall')
      if (btnAdd) { btnAdd.innerHTML = "Add"; }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async ReseDissectionHall() {
    this.DissectionHallDetails.DissectionID = 0;
    this.DissectionHallDetails.DissectionHallNumber = 0;
    this.DissectionHallDetails.DissectionHallCapacity = 0;
    this.DissectionHallDetails.DissectionHallsize = 0;
    this.DissectionHallDetails.DissectionHallPhoto = '';
    this.DissectionHallDetails.DissectionHallPhotoPath = '';
    this.DissectionHallDetails.Dis_DissectionHallPhoto = '';
    //this.isMemberAdded = false;
    //this.showDissectionHallPhoto = false;
    //this.showPresidentAadhaarProofDoc = false;
    this.CurrentIndex = -1;
    this.isDisabledGrid = false;
    const btnAdd = document.getElementById('btnDissectionHall')
    if (btnAdd) { btnAdd.innerHTML = "Add"; }
  }
  async DeleteDissectionHall(Index: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.DissectionHallDetails.splice(Index, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async AddSkillLaboratory() {
    debugger;
    try {
      this.CurrentIndex;      
      this.isMemberAdded = true;
      this.isLecturePhoto = false;
      if (this.medicalcollegeSkillLaboratoryForm.invalid) {
        return;
      }
      if (this.SkillLaboratoryDetails.SkillLaboratoryNumber <=0) {
        this.toastr.warning("This field is required enter value above Zero Skill Laboratory Number .!");
        return;
      }      
      if (this.SkillLaboratoryDetails.SkillLaboratorySize < 600) {
        this.toastr.warning("Skill Laboratory Size Minimum 600 (sq.mt) !");
        return;
      }     

      if (this.CurrentIndex != -1) {
        this.request.SkillLaboratoryDetails.splice(this.CurrentIndex, 1, this.SkillLaboratoryDetails);
        console.log(this.SkillLaboratoryDetails);
      }
      else {
        console.log(this.request.SkillLaboratoryDetails);
        this.loaderService.requestStarted();
        this.request.SkillLaboratoryDetails.push({
          SkillLaboratoryID: 0,
          SkillLaboratoryNumber: this.SkillLaboratoryDetails.SkillLaboratoryNumber,          
          SkillLaboratorySize: this.SkillLaboratoryDetails.SkillLaboratorySize,
          SkillLaboratoryPhoto: this.SkillLaboratoryDetails.SkillLaboratoryPhoto,
          SkillLaboratoryPhotoPath: this.SkillLaboratoryDetails.SkillLaboratoryPhotoPath == '' ? 'N/A' : this.SkillLaboratoryDetails.SkillLaboratoryPhotoPath,
          Dis_SkillLaboratoryPhoto: this.SkillLaboratoryDetails.Dis_SkillLaboratoryPhoto,
        });
      }
      console.log(this.request.SkillLaboratoryDetails);
      // this.LectureTheatreDetails = new LectureTheatreDetailsDataModel();
     // this.isMemberAdded = false;
      //this.showLectureTheatre = false;
      //this.showMemberSign = false;
      // this.showPresidentAadhaarProofDoc = false;
      this.ReseSkillLaboratory();
      this.CurrentIndex = -1;
      this.isDisabledGrid = false;
      const btnAdd = document.getElementById('btnSkillLaboratory')
      if (btnAdd) { btnAdd.innerHTML = "Add"; }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async ReseSkillLaboratory() {
    this.SkillLaboratoryDetails.SkillLaboratoryID = 0;
    this.SkillLaboratoryDetails.SkillLaboratoryNumber = 0;    
    this.SkillLaboratoryDetails.SkillLaboratorySize = 0;
    this.SkillLaboratoryDetails.SkillLaboratoryPhoto = '';
    this.SkillLaboratoryDetails.SkillLaboratoryPhotoPath = '';
    this.SkillLaboratoryDetails.Dis_SkillLaboratoryPhoto = '';
    //this.isMemberAdded = false;
    //this.showDissectionHallPhoto = false;
    //this.showPresidentAadhaarProofDoc = false;
    this.CurrentIndex = -1;
    this.isDisabledGrid = false;
    const btnAdd = document.getElementById('btnSkillLaboratory')
    if (btnAdd) { btnAdd.innerHTML = "Add"; }
  }
  async DeleteSkillLaboratory(Index: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.SkillLaboratoryDetails.splice(Index, 1);
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
      this.isValidPowerBackupPhoto = false;    
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'application/pdf' || event.target.files[0].type === 'image/jpg' || event.target.files[0].type==='image/jpeg') {
          if (event.target.files[0].size > 782676) {
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
              this.DissectionHallDetails.Dis_DissectionHallPhoto = '';
              this.DissectionHallDetails.DissectionHallPhotoPath = '';
              this.DissectionHallDetails.DissectionHallPhoto = '';
              this.ImageValidationMessage_LecturePhoto = 'Select less then 2MB File';
              this.file = document.getElementById('txtDissectionHallPhoto');
              this.file.value = '';
            }
            if (Type == 'SkillLaboratoryPhoto') {
              this.isValidSkillLaboratoryPhoto = true;
              this.SkillLaboratoryDetails.Dis_SkillLaboratoryPhoto = '';
              this.SkillLaboratoryDetails.SkillLaboratoryPhotoPath = '';
              this.SkillLaboratoryDetails.SkillLaboratoryPhoto = '';
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
            if (Type == 'UploadPhotoHistology') {
              this.isValidUploadPhotoHistologyPhoto = true;
              this.request.Dis_UploadPhotoHistology = '';
              this.request.UploadPhotoHistologyPath = '';
              this.request.UploadPhotoHistology = '';
              this.ImageValidationMessage_UploadPhotoHistology = 'Select less then 2MB File';
              this.file = document.getElementById('txtUploadPhotoHistology');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoClinicalPhysiology') {
              this.isValidUploadPhotoClinicalPhysiology = true;
              this.request.Dis_UploadPhotoClinicalPhysiology = '';
              this.request.UploadPhotoClinicalPhysiologyPath = '';
              this.request.UploadPhotoClinicalPhysiology = '';
              this.ImageValidationMessage_UploadPhotoClinicalPhysiology = 'Select less then 2MB File';
              this.file = document.getElementById('txtUploadPhotoClinicalPhysiology');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoBiochemistry') {
              this.isValidUploadPhotoBiochemistryPhoto = true;
              this.request.Dis_UploadPhotoBiochemistry = '';
              this.request.UploadPhotoBiochemistryPath = '';
              this.request.UploadPhotoBiochemistry = '';
              this.ImageValidationMessage_UploadPhotoBiochemistryPhoto = 'Select less then 2MB File';
              this.file = document.getElementById('txtUploadPhotoBiochemistry');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoHistopathologyCytopathology') {
              this.isValidUploadPhotoHistopathologyCytopathologyPhoto = true;
              this.request.Dis_UploadPhotoHistopathologyCytopathology = '';
              this.request.UploadPhotoHistopathologyCytopathologyPath = '';
              this.request.UploadPhotoHistopathologyCytopathology = '';
              this.ImageValidationMessage_UploadPhotoHistopathologyCytopathology = 'Select less then 2MB File';
              this.file = document.getElementById('txtUploadPhotoHistopathologyCytopathologyPhoto');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoClinicalPathologyHaematolog') {
              this.isValidUploadPhotoClinicalPathologyHaematologPhoto = true;
              this.request.Dis_UploadPhotoClinicalPathologyHaematolog = '';
              this.request.UploadPhotoClinicalPathologyHaematologPath = '';
              this.request.UploadPhotoClinicalPathologyHaematolog = '';
              this.ImageValidationMessage_UploadPhotoClinicalPathologyHaematolog = 'Select less then 2MB File';
              this.file = document.getElementById('txtUploadPhotoClinicalPathologyHaematologPhoto');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoMicrobiology') {
              this.isValidUploadPhotoMicrobiologyPhoto = true;
              this.request.Dis_UploadPhotoMicrobiology = '';
              this.request.UploadPhotoMicrobiologyPath = '';
              this.request.UploadPhotoMicrobiology = '';
              this.ImageValidationMessage_UploadPhotoMicrobiologyPhoto = 'Select less then 2MB File';
              this.file = document.getElementById('txtUploadPhotoMicrobiologyPhoto');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoClinicalPharmacologyandComputerAssistedLearning') {
              this.isValidUploadPhotoClinicalPharmacologyandComputerAssistedLearningPhoto = true;
              this.request.Dis_ClinicalPharmacologyandComputerAssistedLearning = '';
              this.request.ClinicalPharmacologyandComputerAssistedLearningPath = '';
              this.request.UploadPhotoClinicalPharmacologyandComputerAssistedLearning = '';
              this.ImageValidationMessage_UploadPhotoClinicalPharmacologyandComputerAssistedLearning = 'Select less then 2MB File';
              this.file = document.getElementById('txtUploadPhotoClinicalPharmacologyandComputerAssistedLearningPhoto');
              this.file.value = '';
            }
            if (Type == 'CentralLibrarybooksList') {
              this.isValidCentralLibrarybooksList = true;
              this.request.Dis_CentralLibrarybooksList = '';
              this.request.CentralLibrarybooksListPath = '';
              this.request.CentralLibrarybooksList = '';
              this.ImageValidationMessage_CentralLibrarybooksList = 'Select less then 2MB File';
              this.file = document.getElementById('txtCentralLibrarybooksList');
              this.file.value = '';
            }
            if (Type == 'JournalsIndianForeignList') {
              this.isValidJournalsIndianForeignList = true;
              this.request.Dis_JournalsIndianForeignList = '';
              this.request.JournalsIndianForeignListPath = '';
              this.request.JournalsIndianForeignList = '';
              this.ImageValidationMessage_JournalsIndianForeignList = 'Select less then 2MB File';
              this.file = document.getElementById('txtJournalsIndianForeignList');
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
            this.DissectionHallDetails.Dis_DissectionHallPhoto = '';
            this.DissectionHallDetails.DissectionHallPhotoPath = '';
            this.DissectionHallDetails.DissectionHallPhoto = '';
            this.ImageValidationMessage_DissectionHallPhoto = 'Select less then 2MB File';
            this.file = document.getElementById('txtDissectionHallPhoto');
            this.file.value = '';
          }
          if (Type == 'SkillLaboratoryPhoto') {
            this.isValidSkillLaboratoryPhoto = true;
            this.SkillLaboratoryDetails.Dis_SkillLaboratoryPhoto = '';
            this.SkillLaboratoryDetails.SkillLaboratoryPhotoPath = '';
            this.SkillLaboratoryDetails.SkillLaboratoryPhoto = '';
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
          if (Type == 'UploadPhotoHistology') {
            this.isValidUploadPhotoHistologyPhoto = true;
            this.request.Dis_UploadPhotoHistology = '';
            this.request.UploadPhotoHistologyPath = '';
            this.request.UploadPhotoHistology = '';
            this.ImageValidationMessage_UploadPhotoHistology = 'Select less then 2MB File';
            this.file = document.getElementById('txtUploadPhotoHistology');
            this.file.value = '';
          }
          if (Type == 'UploadPhotoClinicalPhysiology') {
            this.isValidUploadPhotoClinicalPhysiology = true;
            this.request.Dis_UploadPhotoClinicalPhysiology = '';
            this.request.UploadPhotoClinicalPhysiologyPath = '';
            this.request.UploadPhotoClinicalPhysiology = '';
            this.ImageValidationMessage_UploadPhotoClinicalPhysiology = 'Select less then 2MB File';
            this.file = document.getElementById('txtUploadPhotoClinicalPhysiology');
            this.file.value = '';
          }
          if (Type == 'UploadPhotoBiochemistry') {
            this.isValidUploadPhotoBiochemistryPhoto = true;
            this.request.Dis_UploadPhotoBiochemistry = '';
            this.request.UploadPhotoBiochemistryPath = '';
            this.request.UploadPhotoBiochemistry = '';
            this.ImageValidationMessage_UploadPhotoBiochemistryPhoto = 'Select less then 2MB File';
            this.file = document.getElementById('txtUploadPhotoBiochemistry');
            this.file.value = '';
          }
          if (Type == 'UploadPhotoHistopathologyCytopathology') {
            this.isValidUploadPhotoHistopathologyCytopathologyPhoto = true;
            this.request.Dis_UploadPhotoHistopathologyCytopathology = '';
            this.request.UploadPhotoHistopathologyCytopathologyPath = '';
            this.request.UploadPhotoHistopathologyCytopathology = '';
            this.ImageValidationMessage_UploadPhotoHistopathologyCytopathology = 'Select less then 2MB File';
            this.file = document.getElementById('txtUploadPhotoHistopathologyCytopathologyPhoto');
            this.file.value = '';
          }
          if (Type == 'UploadPhotoClinicalPathologyHaematolog') {
            this.isValidUploadPhotoClinicalPathologyHaematologPhoto = true;
            this.request.Dis_UploadPhotoClinicalPathologyHaematolog = '';
            this.request.UploadPhotoClinicalPathologyHaematologPath = '';
            this.request.UploadPhotoClinicalPathologyHaematolog = '';
            this.ImageValidationMessage_UploadPhotoClinicalPathologyHaematolog = 'Select less then 2MB File';
            this.file = document.getElementById('txtUploadPhotoClinicalPathologyHaematologPhoto');
            this.file.value = '';
          }
          if (Type == 'UploadPhotoMicrobiology') {
            this.isValidUploadPhotoMicrobiologyPhoto = true;
            this.request.Dis_UploadPhotoMicrobiology = '';
            this.request.UploadPhotoMicrobiologyPath = '';
            this.request.UploadPhotoMicrobiology = '';
            this.ImageValidationMessage_UploadPhotoMicrobiologyPhoto = 'Select less then 2MB File';
            this.file = document.getElementById('txtUploadPhotoMicrobiologyPhoto');
            this.file.value = '';
          }
          if (Type == 'UploadPhotoClinicalPharmacologyandComputerAssistedLearning') {
            this.isValidUploadPhotoClinicalPharmacologyandComputerAssistedLearningPhoto = true;
            this.request.Dis_ClinicalPharmacologyandComputerAssistedLearning = '';
            this.request.ClinicalPharmacologyandComputerAssistedLearningPath = '';
            this.request.UploadPhotoClinicalPharmacologyandComputerAssistedLearning = '';
            this.ImageValidationMessage_UploadPhotoClinicalPharmacologyandComputerAssistedLearning = 'Select less then 2MB File';
            this.file = document.getElementById('txtUploadPhotoClinicalPharmacologyandComputerAssistedLearningPhoto');
            this.file.value = '';
          }
          if (Type == 'CentralLibrarybooksList') {
            this.isValidCentralLibrarybooksList = true;
            this.request.Dis_CentralLibrarybooksList = '';
            this.request.CentralLibrarybooksListPath = '';
            this.request.CentralLibrarybooksList = '';
            this.ImageValidationMessage_CentralLibrarybooksList = 'Select less then 2MB File';
            this.file = document.getElementById('txtCentralLibrarybooksList');
            this.file.value = '';
          }
          if (Type == 'JournalsIndianForeignList') {
            this.isValidJournalsIndianForeignList = true;
            this.request.Dis_JournalsIndianForeignList = '';
            this.request.JournalsIndianForeignListPath = '';
            this.request.JournalsIndianForeignList = '';
            this.ImageValidationMessage_JournalsIndianForeignList = 'Select less then 2MB File';
            this.file = document.getElementById('txtJournalsIndianForeignList');
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
              this.DissectionHallDetails.Dis_DissectionHallPhoto = data['Data'][0]["Dis_FileName"];
              this.DissectionHallDetails.DissectionHallPhotoPath = data['Data'][0]["FilePath"];
              this.DissectionHallDetails.DissectionHallPhoto = data['Data'][0]["FileName"];             
              this.ImageValidationMessage_DissectionHallPhoto='';             
              this.file = document.getElementById('txtDissectionHallPhoto');
              this.file.value = '';
            }
            if (Type == 'SkillLaboratoryPhoto') {
              this.showSkillLaboratoryPhoto = true;
              this.SkillLaboratoryDetails.Dis_SkillLaboratoryPhoto = data['Data'][0]["Dis_FileName"];
              this.SkillLaboratoryDetails.SkillLaboratoryPhotoPath = data['Data'][0]["FilePath"];
              this.SkillLaboratoryDetails.SkillLaboratoryPhoto = data['Data'][0]["FileName"];             
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
            if (Type == 'UploadPhotoHistology') {
              this.showUploadPhotoHistologyPhoto = true;
              this.request.Dis_UploadPhotoHistology = data['Data'][0]["Dis_FileName"];
              this.request.UploadPhotoHistologyPath = data['Data'][0]["FilePath"];
              this.request.UploadPhotoHistology = data['Data'][0]["FileName"];
              this.ImageValidationMessage_UploadPhotoHistology = '';
              this.file = document.getElementById('txtUploadPhotoHistology');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoClinicalPhysiology') {
              this.showUploadPhotoClinicalPhysiologyPhoto = true;
              this.request.Dis_UploadPhotoClinicalPhysiology = data['Data'][0]["Dis_FileName"];
              this.request.UploadPhotoClinicalPhysiologyPath = data['Data'][0]["FilePath"];
              this.request.UploadPhotoClinicalPhysiology = data['Data'][0]["FileName"];
              this.ImageValidationMessage_UploadPhotoClinicalPhysiology = '';
              this.file = document.getElementById('txtUploadPhotoClinicalPhysiology');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoBiochemistry') {
              this.showUploadPhotoBiochemistryPhoto = true;
              this.request.Dis_UploadPhotoBiochemistry = data['Data'][0]["Dis_FileName"];
              this.request.UploadPhotoBiochemistryPath = data['Data'][0]["FilePath"];
              this.request.UploadPhotoBiochemistry = data['Data'][0]["FileName"];
              this.ImageValidationMessage_UploadPhotoBiochemistryPhoto = '';
              this.file = document.getElementById('txtUploadPhotoBiochemistry');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoHistopathologyCytopathology') {
              this.showUploadPhotoHistopathologyCytopathologyPhoto = true;
              this.request.Dis_UploadPhotoHistopathologyCytopathology = data['Data'][0]["Dis_FileName"];
              this.request.UploadPhotoHistopathologyCytopathologyPath = data['Data'][0]["FilePath"];
              this.request.UploadPhotoHistopathologyCytopathology = data['Data'][0]["FileName"];
              this.ImageValidationMessage_UploadPhotoHistopathologyCytopathology = '';
              this.file = document.getElementById('txtUploadPhotoHistopathologyCytopathologyPhoto');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoClinicalPathologyHaematolog') {
              this.showUploadPhotoClinicalPathologyHaematologPhoto = true;
              this.request.Dis_UploadPhotoClinicalPathologyHaematolog = data['Data'][0]["Dis_FileName"];
              this.request.UploadPhotoClinicalPathologyHaematologPath = data['Data'][0]["FilePath"];
              this.request.UploadPhotoClinicalPathologyHaematolog = data['Data'][0]["FileName"];
              this.ImageValidationMessage_UploadPhotoClinicalPathologyHaematolog = '';
              this.file = document.getElementById('txtUploadPhotoClinicalPathologyHaematologPhoto');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoMicrobiology') {
              this.showUploadPhotoMicrobiologyPhoto = true;
              this.request.Dis_UploadPhotoMicrobiology = data['Data'][0]["Dis_FileName"];;
              this.request.UploadPhotoMicrobiologyPath = data['Data'][0]["FilePath"];
              this.request.UploadPhotoMicrobiology = data['Data'][0]["FileName"];
              this.ImageValidationMessage_UploadPhotoMicrobiologyPhoto = '';
              this.file = document.getElementById('txtUploadPhotoMicrobiologyPhoto');
              this.file.value = '';
            }
            if (Type == 'UploadPhotoClinicalPharmacologyandComputerAssistedLearning') {
              this.showUploadPhotoClinicalPharmacologyandComputerAssistedLearningPhoto = true;
              this.request.Dis_ClinicalPharmacologyandComputerAssistedLearning = data['Data'][0]["Dis_FileName"];
              this.request.ClinicalPharmacologyandComputerAssistedLearningPath = data['Data'][0]["FilePath"];
              this.request.UploadPhotoClinicalPharmacologyandComputerAssistedLearning = data['Data'][0]["FileName"];
              this.ImageValidationMessage_UploadPhotoClinicalPharmacologyandComputerAssistedLearning = '';
              this.file = document.getElementById('txtUploadPhotoClinicalPharmacologyandComputerAssistedLearningPhoto');
              this.file.value = '';
            }            
            if (Type == 'CentralLibrarybooksList') {
              this.showCentralLibrarybooksList = true;
              this.request.Dis_CentralLibrarybooksList = data['Data'][0]["Dis_FileName"];
              this.request.CentralLibrarybooksListPath = data['Data'][0]["FilePath"];
              this.request.CentralLibrarybooksList = data['Data'][0]["FileName"];
              this.ImageValidationMessage_CentralLibrarybooksList = '';
              this.file = document.getElementById('txtCentralLibrarybooksList');
              this.file.value = '';
            }
            if (Type == 'JournalsIndianForeignList') {
              this.showJournalsIndianForeignList = true;
              this.request.Dis_JournalsIndianForeignList = data['Data'][0]["Dis_FileName"];
              this.request.JournalsIndianForeignListPath = data['Data'][0]["FilePath"];
              this.request.JournalsIndianForeignList = data['Data'][0]["FileName"];
              this.ImageValidationMessage_JournalsIndianForeignList = 'Select less then 2MB File';
              this.file = document.getElementById('txtJournalsIndianForeignList');
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
            this.DissectionHallDetails.Dis_DissectionHallPhoto = '';
            this.DissectionHallDetails.DissectionHallPhotoPath = '';
            this.DissectionHallDetails.DissectionHallPhoto = ''; 
            this.ImageValidationMessage_DissectionHallPhoto = '';
          }
          if (Type == 'SkillLaboratoryPhoto') {
            this.showSkillLaboratoryPhoto = false;
            this.SkillLaboratoryDetails.Dis_SkillLaboratoryPhoto = '';
            this.SkillLaboratoryDetails.SkillLaboratoryPhotoPath = '';
            this.SkillLaboratoryDetails.SkillLaboratoryPhoto = ''; 
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
          if (Type == 'UploadPhotoHistology') {
            this.showUploadPhotoHistologyPhoto = false;
            this.request.Dis_UploadPhotoHistology = '';
            this.request.UploadPhotoHistologyPath = '';
            this.request.UploadPhotoHistology = '';
            this.ImageValidationMessage_UploadPhotoHistology = '';            
          }
          if (Type == 'UploadPhotoClinicalPhysiology') {
            this.showUploadPhotoClinicalPhysiologyPhoto = false;
            this.request.Dis_UploadPhotoClinicalPhysiology = '';
            this.request.UploadPhotoClinicalPhysiologyPath = '';
            this.request.UploadPhotoClinicalPhysiology = '';
            this.ImageValidationMessage_UploadPhotoClinicalPhysiology = '';            
          }
          if (Type == 'UploadPhotoBiochemistry') {
            this.showUploadPhotoBiochemistryPhoto = false;
            this.request.Dis_UploadPhotoBiochemistry = '';
            this.request.UploadPhotoBiochemistryPath = '';
            this.request.UploadPhotoBiochemistry = '';
            this.ImageValidationMessage_UploadPhotoBiochemistryPhoto = '';
           
          }
          if (Type == 'UploadPhotoHistopathologyCytopathology') {
            this.showUploadPhotoHistopathologyCytopathologyPhoto = false;
            this.request.Dis_UploadPhotoHistopathologyCytopathology = '';
            this.request.UploadPhotoHistopathologyCytopathologyPath = '';
            this.request.UploadPhotoHistopathologyCytopathology = '';
            this.ImageValidationMessage_UploadPhotoHistopathologyCytopathology = '';           
          }
          if (Type == 'UploadPhotoClinicalPathologyHaematolog') {
            this.showUploadPhotoClinicalPathologyHaematologPhoto = false;
            this.request.Dis_UploadPhotoClinicalPathologyHaematolog = '';
            this.request.UploadPhotoClinicalPathologyHaematologPath = '';
            this.request.UploadPhotoClinicalPathologyHaematolog = '';
            this.ImageValidationMessage_UploadPhotoClinicalPathologyHaematolog = '';           
          }
          if (Type == 'UploadPhotoMicrobiology') {
            this.showUploadPhotoMicrobiologyPhoto = false;
            this.request.Dis_UploadPhotoMicrobiology = '';
            this.request.UploadPhotoMicrobiologyPath = '';
            this.request.UploadPhotoMicrobiology = '';
            this.ImageValidationMessage_UploadPhotoMicrobiologyPhoto = '';            
          }
          if (Type == 'UploadPhotoClinicalPharmacologyandComputerAssistedLearning') {
            this.showUploadPhotoClinicalPharmacologyandComputerAssistedLearningPhoto = false;
            this.request.Dis_ClinicalPharmacologyandComputerAssistedLearning = '';
            this.request.ClinicalPharmacologyandComputerAssistedLearningPath = '';
            this.request.UploadPhotoClinicalPharmacologyandComputerAssistedLearning = '';
            this.ImageValidationMessage_UploadPhotoClinicalPharmacologyandComputerAssistedLearning = '';            
          }
          if (Type == 'CentralLibrarybooksList') {
            this.showCentralLibrarybooksList = false;
            this.request.Dis_CentralLibrarybooksList = '';
            this.request.CentralLibrarybooksListPath = '';
            this.request.CentralLibrarybooksList = '';
            this.ImageValidationMessage_CentralLibrarybooksList = '';           
          }
          if (Type == 'JournalsIndianForeignList') {
            this.showJournalsIndianForeignList = false;
            this.request.Dis_JournalsIndianForeignList = '';
            this.request.JournalsIndianForeignListPath = '';
            this.request.JournalsIndianForeignList = '';
            this.ImageValidationMessage_JournalsIndianForeignList = '';           
            
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
  async EditDissectionHallDetail(idx: number) {
    this.CurrentIndex = idx;
    this.isDisabledGrid = true;
    this.DissectionHallDetails.DissectionID = this.request.DissectionHallDetails[idx].DissectionID;
    this.DissectionHallDetails.DissectionHallNumber = this.request.DissectionHallDetails[idx].DissectionHallNumber;
    this.DissectionHallDetails.DissectionHallCapacity = this.request.DissectionHallDetails[idx].DissectionHallCapacity;
    this.DissectionHallDetails.DissectionHallsize = this.request.DissectionHallDetails[idx].DissectionHallsize;
    this.DissectionHallDetails.Dis_DissectionHallPhoto = this.request.DissectionHallDetails[idx].Dis_DissectionHallPhoto;
    this.DissectionHallDetails.DissectionHallPhoto = this.request.DissectionHallDetails[idx].DissectionHallPhoto;
    this.DissectionHallDetails.DissectionHallPhotoPath = this.request.DissectionHallDetails[idx].DissectionHallPhotoPath;
    this.showDissectionHallPhoto = this.DissectionHallDetails.DissectionHallPhoto != '' ? true : false;
    const btnAdd = document.getElementById('btnDissectionHall')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }
  async EditSkillLaboratoryDetail(idx: number) {
    this.CurrentIndex = idx;
    this.isDisabledGrid = true;
    this.SkillLaboratoryDetails.SkillLaboratoryID = this.request.SkillLaboratoryDetails[idx].SkillLaboratoryID;
    this.SkillLaboratoryDetails.SkillLaboratoryNumber = this.request.SkillLaboratoryDetails[idx].SkillLaboratoryNumber;    
    this.SkillLaboratoryDetails.SkillLaboratorySize = this.request.SkillLaboratoryDetails[idx].SkillLaboratorySize;
    this.SkillLaboratoryDetails.Dis_SkillLaboratoryPhoto = this.request.SkillLaboratoryDetails[idx].Dis_SkillLaboratoryPhoto;
    this.SkillLaboratoryDetails.SkillLaboratoryPhoto = this.request.SkillLaboratoryDetails[idx].SkillLaboratoryPhoto;
    this.SkillLaboratoryDetails.SkillLaboratoryPhotoPath = this.request.SkillLaboratoryDetails[idx].SkillLaboratoryPhotoPath;
    this.showSkillLaboratoryPhoto = this.SkillLaboratoryDetails.SkillLaboratoryPhoto != '' ? true : false;
    const btnAdd = document.getElementById('btnSkillLaboratory')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }
  //public isSubmitted: boolean = false
  public isformvalid: boolean = true;
  async SaveData() {
    debugger;
    this.isSubmitted = true;
    this.isformvalid = true;

    if (this.request.LectureTheatreDetails.length<4) {
      this.toastr.warning("Lecture Theatre Add At list 4 !");
      return;
    }
    if (this.request.MuseumDetails.length < 6) {
      this.toastr.warning("Museum Add At list 6 !");
      return;
    }
    if (this.request.DissectionHallDetails.length < 1) {
      this.toastr.warning("Dissection Hall Add At list 1 !");
      return;
    }
    if (this.request.SkillLaboratoryDetails.length < 1) {
      this.toastr.warning("Skill Laboratory Add At list 1 !");
      return;
    }
    if (this.request.DemonstrationRoom=='') {
      this.toastr.warning("Please Select Demonstration Room");
      return;
    }
    if (this.request.DemonstrationRoom == 'Yes') {
      if (this.request.Histology == '') {
        this.toastr.warning("Please Select Histology Lab");
        return;
      }
      if (this.request.Histology == 'Yes') {
        if (this.request.UploadPhotoHistology=='') {
          this.toastr.warning("Please Upload Histology Lab Photo");
          return;
        }
      }
      if (this.request.ClinicalPhysiology == '') {
        this.toastr.warning("Please Select Clinical Physiology Lab");
        return;
      }
      if (this.request.ClinicalPhysiology == 'Yes') {
        if (this.request.UploadPhotoClinicalPhysiology == '') {
          this.toastr.warning("Please Upload Clinical Physiology Lab Photo");
          return;
        }
      }
      if (this.request.Biochemistry == '') {
        this.toastr.warning("Please Select Bio Chemistry Lab");
        return;
      }
      if (this.request.Biochemistry == 'Yes') {
        if (this.request.UploadPhotoBiochemistry == '') {
          this.toastr.warning("Please Upload Biochemistry Lab Photo");
          return;
        }
      }
      if (this.request.HistopathologyCytopathology == '') {
        this.toastr.warning("Please Select Histopathology Cytopathology Lab");
        return;
      }
      if (this.request.HistopathologyCytopathology == 'Yes') {
        if (this.request.UploadPhotoHistopathologyCytopathology == '') {
          this.toastr.warning("Please Upload Biochemistry Lab Photo");
          return;
        }
      }
      if (this.request.ClinicalPathologyHaematolog == '') {
        this.toastr.warning("Please Select Clinical Pathology Haematolog Lab");
        return;
      }
      if (this.request.ClinicalPathologyHaematolog == 'Yes') {
        if (this.request.UploadPhotoClinicalPathologyHaematolog == '') {
          this.toastr.warning("Please Upload Clinical Pathology Haematolog Lab Photo");
          return;
        }
      }
      if (this.request.Microbiology == '') {
        this.toastr.warning("Please Select Microbiology Lab");
        return;
      }
      if (this.request.Microbiology == 'Yes') {
        if (this.request.UploadPhotoMicrobiology == '') {
          this.toastr.warning("Please Upload Microbiology Lab Photo");
          return;
        }
      }
      if (this.request.ClinicalPharmacologyandComputerAssistedLearning == '') {
        this.toastr.warning("Please Select Clinical Pharmacology and Computer Assisted Learning(CAL) Lab");
        return;
      }
      if (this.request.ClinicalPharmacologyandComputerAssistedLearning == 'Yes') {
        if (this.request.UploadPhotoClinicalPharmacologyandComputerAssistedLearning == '') {
          this.toastr.warning("Please Upload (CAL) Lab Photo");
          return;
        }
      }
    }
    
    
    if (this.request.Centralresearch == '') {
      this.toastr.warning("Please Select Central research Lab/ Cell");
      return;
    }
    if (this.request.CentralLibrary == '') {
      this.toastr.warning("Please Select Central Library");
      return;
    }
    if (this.request.CentralLibrary == 'Yes') {
      if (this.request.CentralLibraryArea <= 0 && this.request.CentralLibrarySeatingCapacity <= 0 && this.request.CentralLibraryBooks <= 0 && this.request.JournalsIndianForeign <= 0) {
        this.toastr.warning("This field is required Must Be enter value above Zero Central Library .");
        return;
      }
      if (this.request.CentralLibraryArea < 1000) {
        this.toastr.warning("Centra lLibrary Area Minimum 1000 (sq.mt) !");
        return;
      }
      if (this.request.CentralLibrarySeatingCapacity < 350) {
        this.toastr.warning("Central Library Seating Capacity (Inside + OutSide) Minimum 350!");
        return;
      }
      if (this.request.CentralLibraryBooks < 4500) {
        this.toastr.warning("Central Library Books Minimum 4500 !");
        return;
      }
      if (this.request.JournalsIndianForeign < 45) {
        this.toastr.warning("Journals (Indian + Foreign) Minimum 45 !");
        return;
      }
      if (this.request.CentralLibrarybooksList =='') {
        this.toastr.warning("Upload Central Library books List!");
        return;
      }
      if (this.request.JournalsIndianForeignList == '') {
        this.toastr.warning("Upload Journals Indian Foreign List!");
        return;
      }
    }
    if (this.request.RuralHealthTrainingCentre == '') {
      this.toastr.warning("Please Select Rural Health Training Centre");
      return;
    }
    if (this.request.RuralHealthTrainingCentre == 'Yes') {
      if (this.request.RuralHealth <= 0) {
        this.toastr.warning("This field is required Must Be enter value above Zero Rural Health .");
        return;
      }
    }
    if (this.request.UrbanHealthTrainingCentre == '') {
      this.toastr.warning("Please Select Urban Health Training Centre");
      return;
    }
    if (this.request.UrbanHealthTrainingCentre == 'Yes') {
      if (this.request.UrbanHealth <= 0) {
        this.toastr.warning("This field is required Must Be enter value above Zero Urban Health .");
        return;
      }
    }
    if (this.request.PowerBackup == '') {
      this.toastr.warning("Please Select Power Backup");
      return;
    }
    if (this.request.PowerBackup == 'Yes') {
      if (this.request.PowerBackupCapacity <= 0) {
        this.toastr.warning("This field is required Must Be enter value above Zero Power Backup .");
        return;
      }
    }   
   if (!this.isformvalid) {
      return
    }
    // save data
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SaveInfrastructuremedicalgrouponecollegeData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //console.log(this.State);

          if (!this.State) {
            this.toastr.success(this.SuccessMessage);
            await this.GetInfrastructuremedicalgrouponecollege();
            // reset
            //this.ResetDetails();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
          // get data
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
    this.isSubmitted = false;

  }
  async GetInfrastructuremedicalgrouponecollege() {
    debugger;
    //Show Loading
    this.loaderService.requestStarted();
   // this.isLoading = true;
    //this.IsEdit = true;

    try {
      await this.commonMasterService.GetInfrastructuremedicalgrouponecollege(this.request.CollegeID)
        .then(async (data: any) => {
          //this.SelectedCollegeLevel = [];
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          debugger;
          this.request = JSON.parse(JSON.stringify(data['Data']));

        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        //this.isLoading = false;

      }, 200);
    }
  }
}
