
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

  constructor(private rightClickDisable: DisableRightClickService, private formBuilder: FormBuilder, private legalEntityService: LegalEntityService, private commonMasterService: CommonMasterService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute, private routers: Router, private cdRef: ChangeDetectorRef, private fileUploadService: FileUploadService, private aadharServiceDetails: AadharServiceDetails) {

  }

  //init() {
  //  this.loaderService.getSpinnerObserver().subscribe((status) => {
  //    this.cdRef.detectChanges();
  //  });
  //}

  async ngOnInit() {

    this.rightClickDisable.disableRightClick();
    this.loaderService.requestStarted();

    try {
      this.legalentityOlRegistrationForm = this.formBuilder.group(
        {
          LegalEntity: [''],
          ddlRegistrationState: ['', [DropdownValidators]],
          ddlRegistrationDistrict: ['', [DropdownValidators]],
          OldRegistrationNo: ['', Validators.required],
        });

      this.legalentityForm_Registration = this.formBuilder.group(
        {
          txtNewRegistrationRegistration: ['', Validators.required],
          txtMobileNumberRegistration: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$"), Validators.minLength(10), Validators.maxLength(10)]],
          txtEmailIDRegistration: ['', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
          txtAadharNumber: ['', [Validators.required, Validators.pattern("^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$"), Validators.minLength(12), Validators.maxLength(12)]]

        });


      this.legalentityForm = this.formBuilder.group(
        {
          txtNewRegistration: ['', Validators.required],
          txtPreMobileNumber: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$"), Validators.minLength(10), Validators.maxLength(10)]],
          txtPreEmailID: ['', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],

          txtSocietyName: ['', Validators.required],
          ddlSocietyPresentStatus: ['', [DropdownValidators]],
          ddlState: ['', [DropdownValidators]],
          ddlDistricts: ['', [DropdownValidators]],
          ddlRegisteredAct: ['', [DropdownValidators]],
          txtSocietyRegistrationDate: ['', Validators.required],
          txtElectionPresentManagementCommitteeDate: ['', Validators.required],
          txtSocietyRegisteredAddress: ['', Validators.required],
          txtPincode: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6), Validators.maxLength(6)]],
          TrustLogoDoc: [''],
          TrusteeMemberProofDoc: [''],
          OtherInstitution: ['', Validators.required],
          WomenMembers: ['', Validators.required],
          DateOfElection: ['', Validators.required],
          txtManagementCommitteecertified: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
          txtSocietyPANNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[A-Za-z]{5}[0-9]{4}[A-Za-z]$")]],
          txtSocietyPanProofDoc: [''],
          fRegistrationDocument: [''],
          fLawsdocument: [''],
          txtRegisteredActName: [''],
          ddlFirstInception: [''],
          fFirstInceptiondocument: [''],

        });
      //this.EnableDisableControls(true);
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
      this.legalentityAddInstituteForm = this.formBuilder.group(
        {
          //Institute details
          txtInstituteRegistrationNo: ['', Validators.required],
          txtInstituteName: ['', Validators.required],
          txtInstitutePersonName: ['', Validators.required],
          txtInstituteDesignation: ['', Validators.required],
          txtInstituteContactNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
          ddlInstituteStateID: ['', [DropdownValidators]]
        });


      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      this.QueryStringLegalEntityID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('LegalEntityID')?.toString()));
      console.log(this.sSOLoginDataModel);
      if (this.sSOLoginDataModel.SSOID == "null" && this.sSOLoginDataModel.RoleID == 0) {
        this.toastr.error("Unable to service request.!");
        this.routers.navigate(['/ssologin']);
        this.loaderService.requestEnded();
        return;
      }
      /*this.GetDistrict();*/
      //this.GetSocietyPresentStatusList();
      //this.GetRegistrationDistrictListByRegistrationStateID(this.RegistrationState)
      //this.GetStateList();
      //this.GetMemberPost();
      //await this.GetRegisteredActList();
      this.SetDOBmindate();
      //this.SetElectionPresentManagementCommitteeDatemindate();

      this.QueryStringLegalEntityID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('LegalEntityID')?.toString()));
      // get Legal Entity by id
      if (this.QueryStringLegalEntityID > 0) {
        //await this.GetApplicationList(this.QueryStringLegalEntityID);
      }
      else {
       // await this.CheckExistsLegalEntity(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.RoleID);
      }
      this.AnnexureDocumentPath = GlobalConstants.ImagePathURL + 'DCECMCAnn6.pdf';
      this.AnnexureName = 'Download Annexure-6';
     // await this.GetDepartmentList();
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 0);
    }
  }
  get form() { return this.legalentityForm.controls; }
  get ORform() { return this.legalentityOlRegistrationForm.controls; }
  get AMform() { return this.medicalcollegelecturetheatreForm.controls; }
  get museumform() { return this.medicalcollegelemuseumForm.controls; }
  get AIform() { return this.legalentityAddInstituteForm.controls; }
  get FormRegistration() { return this.legalentityForm_Registration.controls; }

  //async GetApplicationList(LegalEntityID: any) {
  //  try {
  //    this.holdDepartmentID = this.request.ProcessDepartmentID;
  //    this.loaderService.requestStarted();
  //    await this.legalEntityService.ViewlegalEntityDataByID(LegalEntityID, this.UserID, this.sSOLoginDataModel.SSOID)
  //      .then(async (data: any) => {
  //        debugger;
  //        data = JSON.parse(JSON.stringify(data));
  //        this.ShowHideLegalEntity = true;
  //        this.IsDepartmentShowHide = false;
  //        this.isRegisterNoBox = false;
  //        this.isDisabled = true;
  //       // this.EnableDisableControls(false);
  //        this.request.LegalEntityID = data['Data'][0]['data']['Table']['0']['LegalEntityID'];
  //        if (data['Data'][0]['data']['Table']['0']['IsLegalEntity'] == 'Society') {
  //          this.request.IsLegalEntity = '1';
  //        }
  //        if (data['Data'][0]['data']['Table']['0']['IsLegalEntity'] == 'Trust') {
  //          this.request.IsLegalEntity = '2';
  //        }
  //        if (data['Data'][0]['data']['Table']['0']['IsLegalEntity'] == 'Company') {
  //          this.request.IsLegalEntity = '3';
  //        }
  //        if (data['Data'][0]['data']['Table']['0']['IsLegalEntity'] == 'Other Entity') {
  //          this.request.IsLegalEntity = '4';
  //        }
  //        this.isFormsFill = true;
  //        this.request.RegistrationNo = data['Data'][0]['data']['Table']['0']['RegistrationNo'];
  //        this.request.PresidentMobileNo = data['Data'][0]['data']['Table']['0']['PresidentMobileNo'];
  //        this.request.PresidentAadhaarNumber = data['Data'][0]['data']['Table2']['0']['PresidentAadhaarNumber'];
  //        this.request.PresidentEmail = data['Data'][0]['data']['Table']['0']['PresidentEmail'];
  //        this.request.SocietyName = data['Data'][0]['data']['Table']['0']['SocietyName'];
  //        this.request.SocietyPresentStatus = data['Data'][0]['data']['Table']['0']['SocietyPresentStatus'];
  //        this.legalentityForm.get('ddlState')?.disable();
  //        this.legalentityForm.get('ddlDistricts')?.disable();
  //        this.request.StateID = data['Data'][0]['data']['Table']['0']['StateID'];
  //        this.GetDistrictListByStateID(this.request.StateID);
  //        this.request.DistrictID = data['Data'][0]['data']['Table']['0']['DistrictID'];

  //        //this.GetRegisteredActList();
  //        this.request.RegisteredActID = data['Data'][0]['data']['Table']['0']['RegisteredActID'];
  //        await this.SelectRegistredAct(this.request.RegisteredActID);
  //        this.request.RegisteredActName = data['Data'][0]['data']['Table']['0']['RegisteredActName'];
  //        this.request.SocietyRegistrationDate = data['Data'][0]['data']['Table']['0']['SocietyRegistrationDate'];
  //        this.request.ElectionPresentManagementCommitteeDate = data['Data'][0]['data']['Table']['0']['ElectionPresentManagementCommitteeDate'];
  //        this.request.SocietyRegisteredAddress = data['Data'][0]['data']['Table']['0']['SocietyRegisteredAddress'];
  //        this.request.Pincode = data['Data'][0]['data']['Table']['0']['Pincode'];
  //        this.request.IsOtherInstitution = data['Data'][0]['data']['Table']['0']['IsOtherInstitution'];
  //        this.SelectOtherInstitution(this.request.IsOtherInstitution);
  //        this.request.IsWomenMembers = data['Data'][0]['data']['Table']['0']['IsWomenMembers'];
  //        this.request.IsDateOfElection = data['Data'][0]['data']['Table']['0']['IsDateOfElection'];

  //        if (data['Data'][0]['data']['Table']['0']['ManagementCommitteeCertified'] != '') {
  //          this.request.ManagementCommitteeCertified = 'Yes';
  //        }
  //        else {
  //          this.request.ManagementCommitteeCertified = 'No';
  //        }
  //        this.request.SocietyPANNumber = data['Data'][0]['data']['Table']['0']['SocietyPANNumber'];

  //        //Document fill
  //        this.request.TrustLogoDoc = data['Data'][0]['data']['Table']['0']['TrustLogoDoc'];
  //        if (this.request.TrustLogoDoc != '') {
  //          this.showTrustLogoDoc = true;
  //        }
  //        this.request.TrustLogoDocPath = data['Data'][0]['data']['Table']['0']['TrustLogoDocPath'];
  //        this.request.Dis_TrustLogoDocName = data['Data'][0]['data']['Table']['0']['Dis_TrustLogoDocName'];
  //        this.request.TrusteeMemberProofDoc = data['Data'][0]['data']['Table']['0']['TrusteeMemberProofDoc'];
  //        if (this.request.TrusteeMemberProofDoc != '') {
  //          this.showTrusteeMemberProofDoc = true;
  //        }
  //        this.request.TrusteeMemberProofDocPath = data['Data'][0]['data']['Table']['0']['TrusteeMemberProofDocPath'];
  //        this.request.Dis_TrusteeMemberProofDocName = data['Data'][0]['data']['Table']['0']['Dis_TrusteeMemberProofDocName'];
  //        this.request.SocietyPanProofDoc = data['Data'][0]['data']['Table']['0']['SocietyPanProofDoc'];
  //        if (this.request.SocietyPanProofDoc != '') {
  //          this.showSocietyPanProofDoc = true;
  //        }
  //        this.request.SocietyPanProofDocPath = data['Data'][0]['data']['Table']['0']['SocietyPanProofDocPath'];
  //        this.request.Dis_SocietyPanProofDocName = data['Data'][0]['data']['Table']['0']['Dis_SocietyPanProofDocName'];

  //        this.request.RegistrationDoc = data['Data'][0]['data']['Table']['0']['RegistrationDoc'];
  //        this.request.Dis_RegistrationDocName = data['Data'][0]['data']['Table']['0']['Dis_RegistrationDocName'];
  //        this.request.RegistrationDocPath = data['Data'][0]['data']['Table']['0']['RegistrationDocPath'];
  //        this.request.ProcessDepartmentID = data['Data'][0]['data']['Table']['0']['ProcessDepartmentID'];

  //        if (this.request.ProcessDepartmentID == 9) {
  //          this.request.ByLawsDocument = data['Data'][0]['data']['Table']['0']['ByLawsDocument'];
  //          this.request.Dis_ByLawsDocumentName = data['Data'][0]['data']['Table']['0']['Dis_ByLawsDocumentName'];
  //          this.request.ByLawsDocumentPath = data['Data'][0]['data']['Table']['0']['ByLawsDocumentPath'];
  //        }

  //        if (this.request.ProcessDepartmentID == 2) {
  //          this.request.FirstInception = data['Data'][0]['data']['Table']['0']['FirstInception'];
  //          this.request.FirstInceptionDocument = data['Data'][0]['data']['Table']['0']['FirstInceptionDocument'];
  //          this.request.Dis_FirstInceptionDocumentName = data['Data'][0]['data']['Table']['0']['Dis_FirstInceptionDocumentName'];
  //          this.request.FirstInceptionDocumentPath = data['Data'][0]['data']['Table']['0']['FirstInceptionDocumentPath'];
  //        }

  //        //legalentityAddMember
  //        this.request.MemberDetails = JSON.parse(JSON.stringify(data['Data'][0]['data']['Table2']));
  //        console.log(this.request.MemberDetails);
  //        this.request.InstituteDetails = JSON.parse(JSON.stringify(data['Data'][0]['data']['Table1']));
  //        this.issaveCancelBtn = true;

  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  //async CheckExistsLegalEntity(SSOID: string, RoleID: number) {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.legalEntityService.CheckExistsLegalEntity(SSOID, RoleID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (this.State == 2) {
  //          this.routers.navigate(['/totallegalentitypreview']);
  //        }
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async GetMemberPost() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetRoleListByLevel(2)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.lstMemberPost = data['Data'];
  //        if (this.request.MemberDetails.length == 0) {
  //          this.memberdetails.MemberPostID = this.lstMemberPost[0].RoleID;
  //        }
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  //async GetDistrict() {
  //  try {
  //    this.lstDistrict = [];
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetDistrictList()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.lstDistrict = data['Data'];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  //async GetSocietyPresentStatusList() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(0, 'SocietyPresentStatus')
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.lstSocietyPresentStatus = data['Data'];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async GetRegisteredActList() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(0, 'RegisteredAct')
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.lstRegisteredAct = data['Data'];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  //async GetStateList() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetStateList()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.lstState = data['Data'];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  //async GetDistrictListByStateID(StateID: number) {
  //  try {
  //    this.lstStateDistrict = [];
  //    this.request.DistrictID = 0;
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetDistrictListByStateID(StateID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.lstStateDistrict = data['Data'];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async GetRegistrationDistrictListByRegistrationStateID(StateID: number) {
  //  try {
  //    this.lstDistrict = [];

  //    this.loaderService.requestStarted();
  //    if (StateID != 6) {
  //      this.IsSocietyRegistration = false;
  //    }
  //    else {
  //      this.IsSocietyRegistration = true;
  //    }

  //    await this.commonMasterService.GetDistrictListByStateID(StateID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.lstDistrict = data['Data'];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async SaveData() {
  //  try {

  //    this.isValidLecturePhoto = false;
  //    this.isValidMemberSignature = false;
  //    this.isValidTrustLogoDoc = false;
  //    this.isValidTrusteeMemberProofDoc = false;
  //    this.isValidPresidentAadhaarProofDoc = false;
  //    this.isValidSocietyPanProofDoc = false;
  //    this.isSubmitted = true;
  //    let isValid = true;
  //    console.log(this.legalentityForm);
  //    if (this.legalentityForm.invalid) {
  //      isValid = false;
  //    }
  //    if (this.request.TrusteeMemberProofDoc == '') {
  //      this.IsTrusteeMemberProofDoc = 'This field is required .!';
  //      isValid = false;
  //    }
  //    if (this.request.SocietyPanProofDoc == '') {
  //      this.IsSocietyPanProofDoc = 'This field is required .!';
  //      isValid = false;
  //    }
  //    if (this.request.ProcessDepartmentID == 2) {
  //      if (this.request.FirstInception == '') {
  //        return;
  //      }
  //      if (this.request.FirstInception == 'Yes' && this.request.FirstInceptionDocument == '') {
  //        return;
  //      }
  //    }
  //    var GetPresident = this.request.request.MemberDetails.find((x: { MembersPostName: string; }) => x.MembersPostName == 'President')?.MembersPostName;
  //    var GetSecretary = this.request.MemberDetails.find((x: { MembersPostName: string; }) => x.MembersPostName == 'Secretary')?.MembersPostName;
  //    var GetTreasurer = this.request.MemberDetails.find((x: { MembersPostName: string; }) => x.MembersPostName == 'Treasurer')?.MembersPostName;
  //    var GetDirector = this.request.MemberDetails.find((x: { MembersPostName: string; }) => x.MembersPostName == 'Director')?.MembersPostName;
  //    if ((GetPresident == undefined || GetPresident == '' || GetPresident == null ||
  //      GetSecretary == undefined || GetSecretary == '' || GetSecretary == null ||
  //      GetTreasurer == undefined || GetTreasurer == '' || GetTreasurer == null) && this.request.ProcessDepartmentID != 6) {
  //      this.toastr.warning("Add President, Secretary and Treasurer in Society member");
  //      isValid = false;
  //    }
  //    if ((GetPresident == undefined || GetPresident == '' || GetPresident == null) && this.request.ProcessDepartmentID == 6 && this.request.IsLegalEntity != '3') {
  //      this.toastr.warning("Add President in Society member");
  //      isValid = false;
  //    }
  //    if ((GetDirector == undefined || GetDirector == '' || GetDirector == null) && this.request.ProcessDepartmentID == 6 && this.request.IsLegalEntity == '3') {
  //      this.toastr.warning("Add Director in Society member");
  //      isValid = false;
  //    }


  //    var Presidentlength = this.request.MemberDetails.filter((x: { MembersPostName: string; }) => x.MembersPostName == 'President');
  //    var Secretarylength = this.request.MemberDetails.filter((x: { MembersPostName: string; }) => x.MembersPostName == 'Secretary');
  //    var Treasurerlength = this.request.MemberDetails.filter((x: { MembersPostName: string; }) => x.MembersPostName == 'Treasurer');
  //    if (Presidentlength.length > 1) {
  //      this.toastr.warning("Add Only One President");
  //      isValid = false;
  //    }
  //    if (Secretarylength.length > 1) {
  //      this.toastr.warning("Add Only One Secretary");
  //      isValid = false;
  //    }
  //    if (Treasurerlength.length > 1) {
  //      this.toastr.warning("Add Only One Treasurer");
  //      isValid = false;
  //    }
  //    if (this.request.IsOtherInstitution == 'Yes') {
  //      if (this.request.InstituteDetails.length <= 0) {
  //        this.toastr.warning("Add atleast one institute details");
  //        isValid = false;
  //      }
  //    }
  //    if (this.QueryStringLegalEntityID > 0) {

  //    }
  //    else {
  //      if (this.request.IsLegalEntity == '1') {
  //        if (this.request.StateID != this.RegistrationState || this.request.DistrictID != this.RegistrationDistrict) {
  //          this.toastr.warning("Please select State and District same as Society");
  //          isValid = false;
  //        }
  //      }
  //    }
  //    if (this.IsActOther) {
  //      if (this.request.RegisteredActName == '') {
  //        isValid = false;
  //      }
  //    }
  //    if (this.request.RegistrationDoc == '') {
  //      isValid = false;
  //    }

  //    //check all
  //    if (!isValid) {
  //      return;
  //    }
  //    this.loaderService.requestStarted();
  //    //post
  //    this.request.SSOID = this.sSOLoginDataModel.SSOID;
  //    await this.legalEntityService.SaveData(this.request)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (this.State == 0) {
  //          this.toastr.success(this.SuccessMessage);
  //          //window.location.reload();
  //          if (this.request.LegalEntityID > 0) { this.routers.navigate(['/totallegalentitypreview']); }
  //          else {
  //            if (this.request.ProcessDepartmentID == 12) {
  //              this.routers.navigate(['/affiliationregistration']);
  //            } else {
  //              this.routers.navigate(['/addcollege']);
  //            }

  //          }
  //        }
  //        else if (this.State == 2) {
  //          this.toastr.warning(this.ErrorMessage)
  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage)
  //        }
  //      }, error => {
  //        this.toastr.warning("Unable to connect to server .!");
  //      })
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //  //this.routers.navigate(['/addcollege']);
  //}

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

  ReseLecturetheatre() {
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

  ReseMuseum() {
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
  async DeleteMember(Index: number) {
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


  //async AddInstitute() {
  //  try {
  //    this.loaderService.requestStarted();
  //    this.isInstitueAdded = true;
  //    if (this.legalentityAddInstituteForm.invalid) {
  //      return;
  //    }
  //    this.request.InstituteDetails.push({
  //      InstituteID: 0,
  //      InstituteName: this.institutedetails.InstituteName,
  //      InstituteContactNumber: this.institutedetails.InstituteContactNumber,
  //      InstituteDesignation: this.institutedetails.InstituteDesignation,
  //      InstitutePersonName: this.institutedetails.InstitutePersonName,
  //      RegistrationNo: this.institutedetails.RegistrationNo,
  //      StateID: this.institutedetails.StateID,
  //      StateName: this.lstState.find((x: { StateID: number; }) => x.StateID == this.institutedetails.StateID).StateName
  //    });
  //    this.institutedetails = new LegalEntityInstituteDetailsDataModel();
  //    this.isInstitueAdded = false;
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  //async DeleteInstitute(Index: number) {
  //  this.isSubmitted = false;
  //  try {
  //    if (confirm("Are you sure you want to delete this ?")) {
  //      this.loaderService.requestStarted();
  //      this.request.InstituteDetails.splice(Index, 1);
  //    }
  //  }
  //  catch (ex) { }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }

  //}

  //async SelectOtherInstitution(OtherInstitution: string) {
  //  if (OtherInstitution == 'Yes')
  //    this.IsOtherInstitution = true
  //  else
  //    this.IsOtherInstitution = false
  //}


 

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
  NewRegistration() {
    try {
      this.loaderService.requestStarted();
      //this.RegistrationDistrict = 0;
      this.RegistrationState = 6;
      this.OldRegistrationNo = '';
      this.isRegisterNoBox = false;
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
      this.isSocietyNewReg = true;
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

  CloseOTPModel() {
    const display = document.getElementById('ModalOtpVerify');
    if (display) display.style.display = 'none';
  }
  CloseWarningOTPModel() {
    const display = document.getElementById('NotRegistered');
    if (display) display.style.display = 'none';
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
}
