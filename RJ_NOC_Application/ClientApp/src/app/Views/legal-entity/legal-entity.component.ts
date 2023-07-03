import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LegalEntityDataModel, LegalEntityInstituteDetailsDataModel, LegalEntityMemberDetailsDataModel } from '../../Models/LegalEntityDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { LegalEntityService } from '../../Services/LegalEntity/legal-entity.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { FileUploadService } from '../../Services/FileUpload/file-upload.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
@Component({
  selector: 'app-legal-entity',
  templateUrl: './legal-entity.component.html',
  styleUrls: ['./legal-entity.component.css']
})
export class LegalEntityComponent implements OnInit {
  isSubmitted: boolean = false;
  IsActOther: boolean = false;
  IsSocietyRegistration: boolean = true;
  IsOtherInstitution: boolean = false;
  showTrustLogoDoc: boolean = false;
  showTrusteeMemberProofDoc: boolean = false;
  showPresidentAadhaarProofDoc: boolean = false;
  showSocietyPanProofDoc: boolean = false;
  showMemberPhoto: boolean = false;
  ShowNewRegistrationButton: boolean = true;
  showMemberSign: boolean = false;
  public ShowTimer: boolean = false;
  public isTimerDisabled: boolean = false;
  public isSubmitted_Registration: boolean = false;
  public ImageValidate: string = '';

  public MaxDate: Date = new Date();
  public MinDate_DOB: Date = new Date();
  public MinDate_ElectionPresentManagementCommitteeDate: Date = new Date();

  legalentityForm!: FormGroup;
  legalentityForm_Registration!: FormGroup;

  legalentityOlRegistrationForm!: FormGroup;
  legalentityAddMemberForm!: FormGroup;
  legalentityAddInstituteForm!: FormGroup;


  request = new LegalEntityDataModel();
  institutedetails = new LegalEntityInstituteDetailsDataModel();
  memberdetails = new LegalEntityMemberDetailsDataModel();
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
  public isInstitueAdded: boolean = false;
  public isMemberAdded: boolean = false;
  public isMemberPhoto: boolean = false;
  public isMemberSignature: boolean = false;
  public OTP: string = '';
  public CustomOTP: string = '';
  public UserOTP: string = '';

  public isNewRegistrationNo: boolean = false;
  public isNewPreMobileNo: boolean = false;
  public isUserOTP: boolean = false;
  public isValidUserOTP: boolean = false;
  public isNewPreEmailID: boolean = false;


  public isValidMemberPhoto: boolean = false;
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
  public ImageValidationMessage_PresidentAadhaarProofDoc: string = '';
  public ImageValidationMessage_SocietyPanProofDoc: string = '';
  public ImageValidationMessage_MemberPhoto: string = '';
  public ImageValidationMessage_MemberSignature: string = '';
  public ImageValidationMessage_TrustLogoDoc: string = '';
  constructor(private formBuilder: FormBuilder, private legalEntityService: LegalEntityService, private commonMasterService: CommonMasterService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute, private routers: Router, private cdRef: ChangeDetectorRef, private fileUploadService: FileUploadService) {

  }

  //init() {
  //  this.loaderService.getSpinnerObserver().subscribe((status) => {
  //    this.cdRef.detectChanges();
  //  });
  //}

  async ngOnInit() {
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
          txtMobileNumberRegistration: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
          txtEmailIDRegistration: ['', [Validators.required, Validators.email]],
        });


      this.legalentityForm = this.formBuilder.group(
        {
          txtNewRegistration: ['', Validators.required],
          txtPreMobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
          txtPreEmailID: ['', [Validators.required, Validators.email]],

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
          txtManagementCommitteecertified: ['', Validators.required, Validators.pattern('^[a-zA-Z \-\']+')],
          txtPresidentAadhaarNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(12), Validators.maxLength(12)]],
          txtPresidentAadhaarProofDoc: [''],
          txtSocietyPANNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          txtSocietyPanProofDoc: [''],
          txtRegisteredActName: ['']
        });
      this.legalentityAddMemberForm = this.formBuilder.group(
        {

          //Member Details
          txtMemberName: ['', Validators.required],
          txtMemberFatherName: ['', Validators.required],
          txtMemberDOB: ['', Validators.required],
          txtMemberMobNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
          ddlMemberposts: ['', [DropdownValidators]],
          txtMemberPhoto: [''],
          txtMemberSign: [''],
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

      /*this.GetDistrict();*/
      this.GetSocietyPresentStatusList();
      this.GetRegistrationDistrictListByRegistrationStateID(this.RegistrationState)
      this.GetStateList();
      this.GetMemberPost();
      this.GetRegisteredActList();
      this.SetDOBmindate();
      this.SetElectionPresentManagementCommitteeDatemindate();
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
  get AMform() { return this.legalentityAddMemberForm.controls; }
  get AIform() { return this.legalentityAddInstituteForm.controls; }
  get FormRegistration() { return this.legalentityForm_Registration.controls; }

  async GetMemberPost() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleListByLevel(2)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstMemberPost = data['Data'];
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
  async GetDistrict() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstDistrict = data['Data'];
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
  async GetSocietyPresentStatusList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(0, 'SocietyPresentStatus')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstSocietyPresentStatus = data['Data'];
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

  async GetRegisteredActList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(0, 'RegisteredAct')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstRegisteredAct = data['Data'];
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
  async GetStateList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstState = data['Data'];
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
  async GetDistrictListByStateID(StateID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictListByStateID(StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstStateDistrict = data['Data'];
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

  async GetRegistrationDistrictListByRegistrationStateID(StateID: number) {
    try {
      this.loaderService.requestStarted();
      if (StateID != 6) {
        this.IsSocietyRegistration = false;
      }

      await this.commonMasterService.GetDistrictListByStateID(StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstDistrict = data['Data'];
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

  async SaveData() {
    try {
      this.loaderService.requestStarted();
      this.isValidMemberPhoto = false;
      this.isValidMemberSignature = false;
      this.isValidTrustLogoDoc = false;
      this.isValidTrusteeMemberProofDoc = false;
      this.isValidPresidentAadhaarProofDoc = false;
      this.isValidSocietyPanProofDoc = false;
      this.isSubmitted = true;
      let isValid = true;
      if (this.legalentityForm.invalid) {
        isValid = false;
      }
      if (this.request.TrusteeMemberProofDoc == '') {
        this.ImageValidationMessage_TrusteeMemberProofDoc = 'This field is required .!';
        isValid = false;
      }
      if (this.request.PresidentAadhaarProofDoc == '') {
        this.ImageValidationMessage_PresidentAadhaarProofDoc = 'This field is required .!';
        isValid = false;
      }
      if (this.request.SocietyPanProofDoc == '') {
        this.ImageValidationMessage_SocietyPanProofDoc = 'This field is required .!';
        isValid = false;
      }
      if (this.request.MemberDetails.length < 3) {
        this.toastr.warning("Add Atleast three member details");
        isValid = false;
      }
      if (this.request.IsOtherInstitution == 'Yes') {
        if (this.request.InstituteDetails.length <= 0) {
          this.toastr.warning("Add atleast one institute details");
          isValid = false;
        }
      }

      //check all
      if (!isValid) {
        return;
      }

      //post
      this.request.SSOID = this.sSOLoginDataModel.SSOID;
      await this.legalEntityService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            //window.location.reload();
            this.routers.navigate(['/addcollege']);
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
    //this.routers.navigate(['/addcollege']);
  }

  async AddMember() {
    try {
      this.loaderService.requestStarted();
      this.isMemberSignature = false;
      this.isMemberPhoto = false;

      this.isMemberAdded = true;
      if (this.legalentityAddMemberForm.invalid) {
        return;
      }
      var GetPostName = this.lstMemberPost.find((x: { RoleID: number; }) => x.RoleID == this.memberdetails.MemberPostID).RoleName;
      if (GetPostName != 'Member') {
        if (this.memberdetails.MemberPhoto == '' || this.memberdetails.MemberSignature == '') {
          this.isMemberPhoto = this.memberdetails.MemberPhoto == '' ? true : false;
          this.isMemberSignature = this.memberdetails.MemberSignature == '' ? true : false;
          return;
        }
        if (this.request.MemberDetails.length > 0) {
          var result = this.request.MemberDetails.filter(obj => {
            return obj.MemberPostID === this.memberdetails.MemberPostID
          });
          if (result.length > 0) {
            this.toastr.warning(GetPostName + " not duplicate");
            return;
          }
        }
      }
      else {
        this.memberdetails.MemberPhoto = '';
        this.memberdetails.MemberSignature = '';
        this.isMemberPhoto = false;
        this.isMemberSignature = false;
      }
      this.request.MemberDetails.push({
        MemberID: 0,
        MemberName: this.memberdetails.MemberName,
        MemberFatherName: this.memberdetails.MemberFatherName,
        MemberDOB: this.memberdetails.MemberDOB,
        MemberMobileNo: this.memberdetails.MemberMobileNo,
        MemberPostID: this.memberdetails.MemberPostID,
        MembersPostName: this.lstMemberPost.find((x: { RoleID: number; }) => x.RoleID == this.memberdetails.MemberPostID).RoleName,
        MemberPhoto: this.memberdetails.MemberPhoto,
        MemberPhotoPath: this.memberdetails.MemberPhotoPath,
        Dis_MemberPhotoName: this.memberdetails.Dis_MemberPhotoName,
        MemberSignature: this.memberdetails.MemberSignature,
        MemberSignaturePath: this.memberdetails.MemberSignaturePath,
        Dis_MemberSignatureName: this.memberdetails.Dis_MemberSignatureName,
      });
      this.memberdetails = new LegalEntityMemberDetailsDataModel();
      this.isMemberAdded = false;
      this.showMemberPhoto = false;
      this.showMemberSign = false;
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DeleteMember(Index: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.MemberDetails.splice(Index, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async AddInstitute() {
    try {
      this.loaderService.requestStarted();
      this.isInstitueAdded = true;
      if (this.legalentityAddInstituteForm.invalid) {
        return;
      }
      this.request.InstituteDetails.push({
        InstituteID: 0,
        InstituteName: this.institutedetails.InstituteName,
        InstituteContactNumber: this.institutedetails.InstituteContactNumber,
        InstituteDesignation: this.institutedetails.InstituteDesignation,
        InstitutePersonName: this.institutedetails.InstitutePersonName,
        RegistrationNo: this.institutedetails.RegistrationNo,
        StateID: this.institutedetails.StateID,
        StateName: this.lstState.find((x: { StateID: number; }) => x.StateID == this.institutedetails.StateID).StateName
      });
      this.institutedetails = new LegalEntityInstituteDetailsDataModel();
      this.isInstitueAdded = false;
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async DeleteInstitute(Index: number) {
    this.request.InstituteDetails.splice(Index, 1);
  }
  async SelectOtherInstitution(OtherInstitution: string) {
    if (OtherInstitution == 'Yes')
      this.IsOtherInstitution = true
    else
      this.IsOtherInstitution = false
  }


  SelectRegistredAct(Id: number) {
    if (this.lstRegisteredAct.find((x: { ID: number; }) => x.ID == Id).Name == 'Other') {
      this.IsActOther = true;
    }

  }

  btnCancel_Click() {
    this.routers.navigate(['/dashboard']);
  }

  OnChangeLegalEntity() {
    try {
      this.loaderService.requestStarted();
      var currentlegal = this.request.IsLegalEntity;
      if (this.request.IsLegalEntity == 1) {
        this.ResetControl();
        this.isRegisterNoBox = true;
        this.isFormsFill = false;
        this.request.IsLegalEntity = currentlegal;
      }
      else {
        this.NewRegistration();
        this.request = new LegalEntityDataModel();
        this.isRegisterNoBox = false;
        this.request.IsLegalEntity = currentlegal;
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetSocietyDetailByRegistrationNo() {
    this.ShowNewRegistrationButton = true;
    this.UserOTP = '';
    this.isGetRegistration = true;
    if (this.legalentityOlRegistrationForm.invalid) {
      return;
    }
    var DistrictName = this.lstDistrict.find((x: { DistrictID: number; }) => x.DistrictID == this.RegistrationDistrict).DistrictName;
    if (!this.OldRegistrationNo.toLowerCase().includes(DistrictName.toLowerCase())) {
      const display = document.getElementById('NotRegistered')
      if (display) display.style.display = "block";
      this.ShowNewRegistrationButton = false;
      this.isSocietyList = false;
      this.isDisabled = false;
      return;
    }
    try {

      this.loaderService.requestStarted();
      this.MaskedMobileNo = ''
      await this.commonMasterService.GetSocietyDetailByRegistrationNo(this.OldRegistrationNo, this.RegistrationDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Status'] == '200' && data['Message'] == 'Success') {
            this.timer(1);
            this.ScoietyData = data['Data'];

            //console.log("aaa");
            //console.log(this.ScoietyData);
            //console.log(this.ScoietyData['AdministrativeData']);
            //console.log("aaa");
            //
            //console.log(this.ScoietyData['AdministrativeData'].find((x: { PostName: string; }) => x.PostName.toLowerCase().includes('president')));

            this.ScoietyData.PresidentName = this.ScoietyData['AdministrativeData'].find((x: { PostName: string, Name: string }) => x.PostName.toLowerCase().includes('president')).Name;

            this.ScoietyData.PresidentMobileNo = this.ScoietyData['AdministrativeData'].find((x: { PostName: string, ContactNo: string }) => x.PostName.toLowerCase().includes('president')).ContactNo;

            console.log(this.ScoietyData.PresidentName);
            console.log(this.ScoietyData.PresidentMobileNo);

            //this.ScoietyData.PresidentName = this.ScoietyData.AdministrativeData.find((x: { PostName: string; }) => x.PostName.includes('PRESIDVYAPARNT') || x.PostName.includes('PRESIDENT') || x.PostName.includes('President') || x.PostName.includes('President/ अध्यक्ष')).Name;

            //this.ScoietyData.PresidentMobileNo = this.ScoietyData.AdministrativeData.find((x: { PostName: string; }) => x.PostName.includes('PRESIDVYAPARNT') || x.PostName.includes('PRESIDENT') || x.PostName.includes('President') || x.PostName.includes('President/ अध्यक्ष')).ContactNo;

            if (this.ScoietyData.PresidentName == '' || this.ScoietyData.PresidentMobileNo == '') {
              const display = document.getElementById('NotRegistered')
              if (display) display.style.display = "block";
              this.isSocietyList = false;
              this.isDisabled = false;
              return;
            }


            if (this.ScoietyData.PresidentMobileNo.length > 0) {
              const visibleDigits = 4;
              let maskedSection = this.ScoietyData.PresidentMobileNo.slice(0, -visibleDigits);
              let visibleSection = this.ScoietyData.PresidentMobileNo.slice(-visibleDigits);
              this.MaskedMobileNo = maskedSection.replace(/./g, 'X') + visibleSection;
            }


            try {
              this.commonMasterService.SendMessage(this.ScoietyData.PresidentMobileNo, 'OTP')
                .then((data: any) => {
                  this.OTP = data['Data'];
                }, error => console.error(error));
            }
            catch (Ex) { }
            finally {
              this.CustomOTP = '123456';
              const display = document.getElementById('ModalOtpVerify')
              if (display) display.style.display = "block";
            }

          }
          else {
            const display = document.getElementById('NotRegistered')
            if (display) display.style.display = "block";
            this.isSocietyList = false;
            this.isDisabled = false;
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

  ProceedDetail() {
    try {
      this.loaderService.requestStarted();
      this.isFormsFill = true;
      this.issaveCancelBtn = true;
      this.request.RegistrationNo = this.ScoietyData.RegistrationNo;
      this.request.PresidentMobileNo = this.ScoietyData.PresidentMobileNo;
      this.request.StateID = this.RegistrationState;
      this.GetDistrictListByStateID(this.RegistrationState);
      this.request.DistrictID = this.lstDistrict.find((x: { DistrictName: string; }) => x.DistrictName == this.ScoietyData.District).DistrictID;
      this.isDisabledNewRegistration = true;
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted_Registration = false;
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

  ResetControl() {
    try {
      this.loaderService.requestStarted();
      this.request = new LegalEntityDataModel();
      this.RegistrationDistrict = 0;
      this.RegistrationState = 6;
      this.OldRegistrationNo = '';
      this.isFormsFill = false;
      this.isGetRegistration = false;
      this.isSocietyList = false;
      this.ScoietyData = {};
      this.isDisabled = false;
      this.issaveCancelBtn = false;
      this.isSocietyNewReg = false;
      this.isDisabledNewRegistration = false;
      this.isInstitueAdded = false;
      this.isMemberAdded = false;
      this.isMemberPhoto = false;
      this.isMemberSignature = false;
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
      this.RegistrationDistrict = 0;
      this.RegistrationState = 6;
      this.OldRegistrationNo = '';
      this.isRegisterNoBox = false;
      this.isFormsFill = false;
      this.isGetRegistration = false;
      this.isSocietyList = false;
      this.ScoietyData = {};
      this.isDisabled = false;
      this.issaveCancelBtn = false;
      this.isSocietyNewReg = false;
      this.isDisabledNewRegistration = false;
      this.isInstitueAdded = false;
      this.isMemberAdded = false;
      this.isMemberPhoto = false;
      this.isMemberSignature = false;
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
  async OpenOTPModel() {
    console.log(this.legalentityForm_Registration.controls);
    this.isSubmitted_Registration = true;
    if (this.legalentityForm_Registration.invalid) {
      return
    }
    this.UserOTP = '';
    this.MaskedMobileNo = '';
    try {
      this.loaderService.requestStarted();
      if (this.request.PresidentMobileNo.length > 0) {
        const visibleDigits = 4;
        let maskedSection = this.request.PresidentMobileNo.slice(0, -visibleDigits);
        let visibleSection = this.request.PresidentMobileNo.slice(-visibleDigits);
        this.MaskedMobileNo = maskedSection.replace(/./g, 'X') + visibleSection;
      }
      await this.commonMasterService.SendMessage(this.request.PresidentMobileNo, 'OTP')
        .then((data: any) => {
          this.OTP = data['Data'];
          this.CustomOTP = '123456';
          const display = document.getElementById('ModalOtpVerify')
          if (display) display.style.display = "block";
          this.timer(1);
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted_Registration = false;
      }, 200);
    }
  }
  VerifyOTP() {
    try {
      this.loaderService.requestStarted();
      this.isUserOTP = false;
      this.isValidUserOTP = false;
      if (this.UserOTP == '') {
        this.isUserOTP = true;
        return;
      }

      if (this.UserOTP == this.OTP || this.CustomOTP == this.UserOTP) {
        if (this.OldRegistrationNo != '') {
          this.legalEntityService.CheckDuplicateRegNo(this.request.LegalEntityID, this.OldRegistrationNo)
            .then((data: any) => {
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              if (this.State == 2) {
                this.toastr.warning(this.ErrorMessage);
                this.isSocietyList = false;
                this.isDisabled = false;
                return;
              }
            }, error => console.error(error));
          this.isSocietyList = true;
          this.isDisabled = true;
          const display = document.getElementById('ModalOtpVerify');
          if (display) display.style.display = 'none';
        }
        else {
          this.legalEntityService.CheckDuplicateRegNo(this.request.LegalEntityID, this.request.RegistrationNo)
            .then((data: any) => {
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              if (this.State == 2) {
                this.toastr.warning(this.ErrorMessage);
                this.isSocietyList = false;
                this.isDisabled = false;
                this.isFormsFill = false;
                this.issaveCancelBtn = false;
                this.isSocietyNewReg = false;
                this.isDisabledNewRegistration = false;
                return;
              }
            }, error => console.error(error));
          this.ScoietyData = []
          this.isSocietyList = false;
          this.isDisabled = false;
          const ModelOTP = document.getElementById('ModalOtpVerify');
          if (ModelOTP) ModelOTP.style.display = 'none';
          const ModelWarning = document.getElementById('NotRegistered');
          if (ModelWarning) ModelWarning.style.display = 'none';
          this.isFormsFill = true;
          this.issaveCancelBtn = true;
          this.isSocietyNewReg = false;
          this.request.StateID = 6;
          this.GetDistrictListByStateID(this.request.StateID);
          this.isDisabledNewRegistration = true;
        }
      }
      else {
        this.isValidUserOTP = true;
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
  async ResendOTP() {
    try {
      this.loaderService.requestStarted();
      this.timer(1);
      var MaskedMobileNo = this.OldRegistrationNo != '' ? this.ScoietyData.PresidentMobileNo : this.request.PresidentMobileNo;
      await this.commonMasterService.SendMessage(MaskedMobileNo, 'OTP')
        .then((data: any) => {
          this.OTP = data['Data'];
          this.CustomOTP = '123456';
          if (MaskedMobileNo.length > 0) {
            const visibleDigits = 4;
            let maskedSection = MaskedMobileNo.slice(0, -visibleDigits);
            let visibleSection = MaskedMobileNo.slice(-visibleDigits);
            MaskedMobileNo = maskedSection.replace(/./g, 'X') + visibleSection;
          }
          this.toastr.info('Successfully Resend OTP on ' + MaskedMobileNo);
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

  async ValidateDocument(event: any, Type: string) {
    try {
      
      this.loaderService.requestStarted();
      this.isValidMemberPhoto = false;
      this.isValidMemberSignature = false;
      this.isValidTrustLogoDoc = false;
      this.isValidTrusteeMemberProofDoc = false;
      this.isValidPresidentAadhaarProofDoc = false;
      this.isValidSocietyPanProofDoc = false;
      if (event.target.files && event.target.files[0]) {

        if (event.target.files[0].type === 'application/pdf') {
          if (event.target.files[0].size > 2000000) {
            event.target.value = '';
            
            if (Type == 'TrusteeMember') {
              this.isValidTrusteeMemberProofDoc = true;
              this.request.Dis_TrusteeMemberProofDocName = '';
              this.request.TrusteeMemberProofDocPath = '';
              this.request.TrusteeMemberProofDoc = '';
              this.ImageValidationMessage_TrusteeMemberProofDoc = 'Select less then 2MB File';
            }
            else if (Type == 'PresidentAadhaar') {
              this.isValidPresidentAadhaarProofDoc = true;
              this.request.Dis_PresidentAadhaarProofDocName = '';
              this.request.PresidentAadhaarProofDocPath = '';
              this.request.PresidentAadhaarProofDoc = '';
              this.ImageValidationMessage_PresidentAadhaarProofDoc = 'Select less then 2MB File';
            }
            else if (Type == 'SocietyPan') {
              this.isValidSocietyPanProofDoc = true;
              this.request.Dis_SocietyPanProofDocName = '';
              this.request.SocietyPanProofDocPath = '';
              this.request.SocietyPanProofDoc = '';
              this.ImageValidationMessage_SocietyPanProofDoc = 'Select less then 2MB File';
            }
            return
          }
          if (event.target.files[0].size < 100000) {
            event.target.value = '';

            if (Type == 'TrusteeMember') {
              this.isValidTrusteeMemberProofDoc = true;
              this.request.Dis_TrusteeMemberProofDocName = '';
              this.request.TrusteeMemberProofDocPath = '';
              this.request.TrusteeMemberProofDoc = '';
              this.ImageValidationMessage_TrusteeMemberProofDoc = 'Select more then 100kb File';
            }
            else if (Type == 'PresidentAadhaar') {
              this.isValidPresidentAadhaarProofDoc = true;
              this.request.Dis_PresidentAadhaarProofDocName = '';
              this.request.PresidentAadhaarProofDocPath = '';
              this.request.PresidentAadhaarProofDoc = '';
              this.ImageValidationMessage_PresidentAadhaarProofDoc = 'Select more then 100kb File';
            }
            else if (Type == 'SocietyPan') {
              this.isValidSocietyPanProofDoc = true;
              this.request.Dis_SocietyPanProofDocName = '';
              this.request.SocietyPanProofDocPath = '';
              this.request.SocietyPanProofDoc = '';
              this.ImageValidationMessage_SocietyPanProofDoc = 'Select more then 100kb File';
            }
            return
          }
        }
        else {
          event.target.value = '';

          if (Type == 'TrusteeMember') {
            this.isValidTrusteeMemberProofDoc = true;
            this.request.Dis_TrusteeMemberProofDocName = '';
            this.request.TrusteeMemberProofDocPath = '';
            this.request.TrusteeMemberProofDoc = '';
            this.ImageValidationMessage_TrusteeMemberProofDoc = 'Select Only pdf file';
          }
          else if (Type == 'PresidentAadhaar') {
            this.isValidPresidentAadhaarProofDoc = true;
            this.request.Dis_PresidentAadhaarProofDocName = '';
            this.request.PresidentAadhaarProofDocPath = '';
            this.request.PresidentAadhaarProofDoc = '';
            this.ImageValidationMessage_PresidentAadhaarProofDoc = 'Select Only pdf file';
          }
          else if (Type == 'SocietyPan') {
            this.isValidSocietyPanProofDoc = true;
            this.request.Dis_SocietyPanProofDocName = '';
            this.request.SocietyPanProofDocPath = '';
            this.request.SocietyPanProofDoc = '';
            this.ImageValidationMessage_SocietyPanProofDoc = 'Select Only pdf file';
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
            if (Type == 'TrusteeMember') {
              this.showTrusteeMemberProofDoc = true;
              this.request.Dis_TrusteeMemberProofDocName = data['Data'][0]["Dis_FileName"];
              this.request.TrusteeMemberProofDocPath = data['Data'][0]["FilePath"];
              this.request.TrusteeMemberProofDoc = data['Data'][0]["FileName"];
              this.ImageValidationMessage_TrusteeMemberProofDoc = '';
            }
            else if (Type == 'PresidentAadhaar') {
              this.showPresidentAadhaarProofDoc = true;
              this.request.Dis_PresidentAadhaarProofDocName = data['Data'][0]["Dis_FileName"];
              this.request.PresidentAadhaarProofDocPath = data['Data'][0]["FilePath"];
              this.request.PresidentAadhaarProofDoc = data['Data'][0]["FileName"];
              this.ImageValidationMessage_PresidentAadhaarProofDoc = '';
            }
            else if (Type == 'SocietyPan') {
              this.showSocietyPanProofDoc = true;
              this.request.Dis_SocietyPanProofDocName = data['Data'][0]["Dis_FileName"];
              this.request.SocietyPanProofDocPath = data['Data'][0]["FilePath"];
              this.request.SocietyPanProofDoc = data['Data'][0]["FileName"];
              this.ImageValidationMessage_SocietyPanProofDoc = '';
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
  async ValidateImage(event: any, Type: string) {
    try {
      
      this.loaderService.requestStarted();
      this.isValidMemberPhoto = false;
      this.isValidMemberSignature = false;
      this.isValidTrustLogoDoc = false;
      this.isValidTrusteeMemberProofDoc = false;
      this.isValidPresidentAadhaarProofDoc = false;
      this.isValidSocietyPanProofDoc = false;
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/jpg') {
          if (event.target.files[0].size > 2000000) {
            event.target.value = '';

            if (Type == 'MemberPhoto') {
              this.isValidMemberPhoto = true;
              this.memberdetails.Dis_MemberPhotoName = '';
              this.memberdetails.MemberPhotoPath = '';
              this.memberdetails.MemberPhoto = '';
              this.ImageValidationMessage_MemberPhoto = 'Select less then 2MB File';
            }
            else if (Type == 'MemberSign') {
              this.isValidMemberSignature = true;
              this.memberdetails.Dis_MemberSignatureName = '';
              this.memberdetails.MemberSignaturePath = '';
              this.memberdetails.MemberSignature = '';
              this.ImageValidationMessage_MemberSignature = 'Select less then 2MB File';
            }
            else if (Type == 'TrustLogo') {
              this.isValidTrustLogoDoc = true;
              this.request.Dis_TrustLogoDocName = '';
              this.request.TrustLogoDocPath = '';
              this.request.TrustLogoDoc = '';
              this.ImageValidationMessage_TrustLogoDoc = 'Select less then 2MB File';
            }
            return
          }
          if (event.target.files[0].size < 100000) {
            event.target.value = '';
            
            //this.toastr.warning('Select more then 100kb File');
            if (Type == 'MemberPhoto') {
              this.isValidMemberPhoto = true;
              this.memberdetails.Dis_MemberPhotoName = '';
              this.memberdetails.MemberPhotoPath = '';
              this.memberdetails.MemberPhoto = '';
              this.ImageValidationMessage_MemberPhoto = 'Select more then 100kb File';
            }
            else if (Type == 'MemberSign') {
              this.isValidMemberSignature = true;
              this.memberdetails.Dis_MemberSignatureName = '';
              this.memberdetails.MemberSignaturePath = '';
              this.memberdetails.MemberSignature = '';
              this.ImageValidationMessage_MemberSignature = 'Select more then 100kb File';
            }
            else if (Type == 'TrustLogo') {
              this.isValidTrustLogoDoc = true;
              this.request.Dis_TrustLogoDocName = '';
              this.request.TrustLogoDocPath = '';
              this.request.TrustLogoDoc = '';
              this.ImageValidationMessage_TrustLogoDoc = 'Select more then 100kb File';
            }
            return
          }
        }
        else {
          event.target.value = '';
          
          if (Type == 'MemberPhoto') {
            this.isValidMemberPhoto = true;
            this.memberdetails.Dis_MemberPhotoName = '';
            this.memberdetails.MemberPhotoPath = '';
            this.memberdetails.MemberPhoto = '';
            this.ImageValidationMessage_MemberPhoto = 'Select Only jpg/jpeg';
          }
          else if (Type == 'MemberSign') {
            this.isValidMemberSignature = true;
            this.memberdetails.Dis_MemberSignatureName = '';
            this.memberdetails.MemberSignaturePath = '';
            this.memberdetails.MemberSignature = '';
            this.ImageValidationMessage_MemberSignature = 'Select Only jpg/jpeg';
          }
          else if (Type == 'TrustLogo') {
            this.isValidTrustLogoDoc = true;
            this.request.Dis_TrustLogoDocName = '';
            this.request.TrustLogoDocPath = '';
            this.request.TrustLogoDoc = '';
            this.ImageValidationMessage_TrustLogoDoc = 'Select Only jpg/jpeg';
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
            if (Type == 'MemberPhoto') {
              this.showMemberPhoto = true;
              this.memberdetails.Dis_MemberPhotoName = data['Data'][0]["Dis_FileName"];
              this.memberdetails.MemberPhotoPath = data['Data'][0]["FilePath"];
              this.memberdetails.MemberPhoto = data['Data'][0]["FileName"];
              this.ImageValidationMessage_MemberPhoto = '';
            }
            else if (Type == 'MemberSign') {
              this.showMemberSign = true;
              this.memberdetails.Dis_MemberSignatureName = data['Data'][0]["Dis_FileName"];
              this.memberdetails.MemberSignaturePath = data['Data'][0]["FilePath"];
              this.memberdetails.MemberSignature = data['Data'][0]["FileName"];
              this.ImageValidationMessage_MemberSignature = '';
            }
            else if (Type == 'TrustLogo') {
              this.showTrustLogoDoc = true;
              this.request.Dis_TrustLogoDocName = data['Data'][0]["Dis_FileName"];
              this.request.TrustLogoDocPath = data['Data'][0]["FilePath"];
              this.request.TrustLogoDoc = data['Data'][0]["FileName"];
              this.ImageValidationMessage_TrustLogoDoc = '';
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
          if (Type == 'MemberPhoto') {
            this.showMemberPhoto = false;
            this.memberdetails.Dis_MemberPhotoName = '';
            this.memberdetails.MemberPhotoPath = '';
            this.memberdetails.MemberPhoto = '';
            this.ImageValidationMessage_MemberPhoto = '';
          }
          else if (Type == 'MemberSign') {
            this.showMemberSign = false;
            this.memberdetails.Dis_MemberSignatureName = '';
            this.memberdetails.MemberSignaturePath = '';
            this.memberdetails.MemberSignature = '';
            this.ImageValidationMessage_MemberSignature = '';
          }
          else if (Type == 'TrustLogo') {
            this.showTrustLogoDoc = false;
            this.request.TrustLogoDoc = '';
          }
          else if (Type == 'TrusteeMember') {
            this.showTrusteeMemberProofDoc = false;
            this.request.Dis_TrusteeMemberProofDocName = '';
            this.request.TrusteeMemberProofDocPath = '';
            this.request.TrusteeMemberProofDoc = '';
            this.ImageValidationMessage_TrusteeMemberProofDoc = '';
          }
          else if (Type == 'PresidentAadhaar') {
            this.showPresidentAadhaarProofDoc = false;
            this.request.Dis_PresidentAadhaarProofDocName = '';
            this.request.PresidentAadhaarProofDocPath = '';
            this.request.PresidentAadhaarProofDoc = '';
            this.ImageValidationMessage_PresidentAadhaarProofDoc = '';
          }
          else if (Type == 'SocietyPan') {
            this.showSocietyPanProofDoc = false;
            this.request.Dis_SocietyPanProofDocName = '';
            this.request.SocietyPanProofDocPath = '';
            this.request.SocietyPanProofDoc = '';
            this.ImageValidationMessage_SocietyPanProofDoc = '';
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

  SetElectionPresentManagementCommitteeDatemindate() {
    
    const mindate1 = new Date();
    mindate1.setFullYear(mindate1.getFullYear() - 3);
    this.MinDate_ElectionPresentManagementCommitteeDate = new Date(mindate1.getFullYear(), mindate1.getMonth(), mindate1.getDate());
  }
  
  ElectionPresentManagementCommitteeDate_Change() {
    if (this.request.ElectionPresentManagementCommitteeDate != '') {
      this.request.IsDateOfElection = 'Yes';
      this.IsNotMoreThen3Year = true;
    }
    else {
      this.request.IsDateOfElection = 'No';
      this.IsNotMoreThen3Year = false;
    }
    this.ToggleElectionPresentManagementCommitteeDateValidation();
  }

  ToggleElectionPresentManagementCommitteeDateValidation() {
    if (this.IsNotMoreThen3Year) {
      this.legalentityForm.get('txtElectionPresentManagementCommitteeDate')?.setValidators([Validators.required]);
    }
    else {
      this.legalentityForm.get('txtElectionPresentManagementCommitteeDate')?.clearValidators();
    }
    this.legalentityForm.get('txtElectionPresentManagementCommitteeDate')?.updateValueAndValidity();
  }

  IsDateOfElection_Change() {
    if (this.request.IsDateOfElection == 'Yes') {
      this.IsNotMoreThen3Year = true;
    }
    else {
      this.IsNotMoreThen3Year = false;
      this.request.ElectionPresentManagementCommitteeDate = '';
    }
    this.ToggleElectionPresentManagementCommitteeDateValidation();
  }
}
