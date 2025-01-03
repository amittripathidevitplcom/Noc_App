import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators, DropdownValidatorsString } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';

import { MGThreeAffiliatedHospitalDataModel, MGThreeHospitalDataModel } from '../../../Models/HospitalDataModel';
import { min } from 'rxjs';
import { async } from '@angular/core/testing';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { HospitalDetailService } from '../../../Services/Tabs/HospitalDetail/hospital-detail.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LegalEntityDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { SocityService } from '../../../Services/Master/SocietyManagement/socity.service';
import { LegalEntityMemberDetailsDataModel } from '../../../Models/LegalEntityDataModel';

@Component({
  selector: 'app-mgthree-hospital',
  templateUrl: './mgthree-hospital.component.html',
  styleUrls: ['./mgthree-hospital.component.css']
})
export class MGThreeHospitalComponent {

  HospitalForm!: FormGroup;
  AffiliatedHospitalForm!: FormGroup;
  // login model
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new MGThreeHospitalDataModel();
  Affiliatedrequest = new MGThreeAffiliatedHospitalDataModel();
  public PinNoRegex = new RegExp(/[0-9]{6}/)
  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)
  public LandLineRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)
  public DivisionList: any = [];
  public DistrictList: any = [];
  public TehsilList: any = [];
  public PanchyatSamitiList: any = [];
  public CityList: any = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public lstSocietyMemberName: any = [];
  public SearchRecordID: string = '';
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public ReasonForAffiliation: any = [];
  constructor(private TrusteeGeneralInfoService: TrusteeGeneralInfoService, private modalService: NgbModal, private hospitalDetailService: HospitalDetailService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private fileUploadService: FileUploadService, private societyService: SocityService) {
  }
  async ngOnInit() {
    this.HospitalForm = this.formBuilder.group(
      {
        ddlIsHillytribalArea: ['', DropdownValidatorsString],
        ddlIsInstitutionParentHospital: [''],
        rbHospitalStatus: [''],
        txtHospitalName: ['', Validators.required],
        txtOwnerName: [''],
        txtRegistrationNo: ['', Validators.required],
        txtHospitalContactNo: ['', [Validators.required, Validators.pattern(this.LandLineRegex)]],
        txtHospitalEmailID: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        txtAddressLine1: ['', Validators.required],
        txtAddressLine2: [''],//, Validators.required
        rbRuralUrban: ['', Validators.required],
        ddlDivisionID: ['', [DropdownValidators]],
        ddlDistrictID: ['', [DropdownValidators]],
        ddlTehsilID: ['', [DropdownValidators]],
        ddlCityID: ['', [DropdownValidators]],
        ddlPanchayatSamitiID: ['', [DropdownValidators]],
        txtCityTownVillage: ['', Validators.required],
        txtPincode: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],
        ddlSocietyMemberName: [''],
        fHospitalMOU: [''],
        txtBedCapacity: ['', Validators.required],

        txtMedicalBeds: ['', [Validators.required]],
        txtSurgicalBeds: ['', [Validators.required]],
        txtObstetricsBeds: ['', [Validators.required]],
        txtPediatricsBeds: ['', [Validators.required]],
        txtOrthoBeds: ['', [Validators.required]],
        txtEmergencyMedicineBeds: ['', [Validators.required]],
        txtPsychiatryBeds: ['', [Validators.required]],

        txtNumberofdeliveries: ['', [Validators.required]],
        txtCollegeDistance: ['', [Validators.required]],

        fBedOccupancy: [''],
        fFireNOC: [''],
        fPollutionCertificate: [''],
        fClinicalEstablishment: [''],
        fNABH: [''],
        fUndertakingNotAffiliated: [''],
        fStaffInformation: [''],
      });
    this.AffiliatedHospitalForm = this.formBuilder.group(
      {
        txtAffiliatedHospitalName: ['', Validators.required],
        ddlAffiliationReason: ['', DropdownValidators],
        txtSpecialtyAffiliation: [''],
        ddlIsAnyAffiliatedHospital: [''],
        txtAffiliatedNameofOwner: ['', Validators.required],

        fAffiliatedHospitalMOU: ['', Validators.required],
        txtAffiliatedBedCapacity: ['', Validators.required],

        txtAffiliatedMedicalBeds: ['', [Validators.required]],
        txtAffiliatedSurgicalBeds: ['', [Validators.required]],
        txtAffiliatedObstetricsBeds: ['', [Validators.required]],
        txtAffiliatedPediatricsBeds: ['', [Validators.required]],
        txtAffiliatedOrthoBeds: ['', [Validators.required]],
        txtAffiliatedPsychiatryBeds: ['', [Validators.required]],
        txtAffiliatedEmergencyMedicineBeds: ['', [Validators.required]],

        txtAffiliatedNumberofdeliveries: ['', [Validators.required]],
        txtAffiliatedCollegeDistance: ['', [Validators.required]],

        fAffiliatedBedOccupancy: ['', Validators.required],
        fAffiliatedFireNOC: ['', Validators.required],
        fAffiliatedPollutionCertificate: ['', Validators.required],
        fAffiliatedClinicalEstablishment: ['', Validators.required],
        fAffiliatedNABH: [''],
        fAffiliatedUndertakingNotAffiliated: ['', Validators.required],
        fAffiliatedStaffInformation: ['', Validators.required],

      });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
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

    await this.LoadMaster();
    await this.GetMGThreeHospitalDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
  }
  get form() { return this.HospitalForm.controls; }
  get affiliatedform() { return this.AffiliatedHospitalForm.controls; }

  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  alphaandNumberOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  NumberOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[0-9]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  async LoadMaster() {
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
      await this.societyService.GetSocietyAllList(0, this.SelectedCollageID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstSocietyMemberName = data['Data'][0]['data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(6, 'ReasonForAffiliation')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ReasonForAffiliation = data['Data'];
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
  async FillDivisionRelatedDDL(event: any, SelectedDivisionID: string) {
    try {
      this.DistrictList = [];
      this.TehsilList = [];
      this.CityList = [];
      this.PanchyatSamitiList = [];
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
          this.DistrictList = data['Data'];
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
  async FillDistrictRelatedDDL(event: any, SelectedDistrictID: string) {
    try {
      this.loaderService.requestStarted();
      const districtId = Number(SelectedDistrictID);
      if (districtId <= 0) {
        return;
      }
      this.TehsilList = [];
      this.CityList = [];
      this.PanchyatSamitiList = [];
      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TehsilList = data['Data'];
        }, error => console.error(error));
      // PanchyatSamiti list
      await this.commonMasterService.GetPanchyatSamitiByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PanchyatSamitiList = data['Data'];
        }, error => console.error(error));
      //city list
      await this.commonMasterService.GetCityByDistrict(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CityList = data['Data'][0]['data'];
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
  async IsRuralOrUrban(isRural: boolean) {
    try {
      this.loaderService.requestStarted();
      if (isRural) {
        this.request.CityID = 0;
      }
      else {
        this.request.PanchayatSamitiID = 0;
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

  public file: any = null;
  async onFilechange(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        // (Type != 'ConsentForm' && (this.file.type === 'image/jpeg' || this.file.type === 'image/jpg')) ||
        if (this.file.type === 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.warning('Please select less then 2 MB file');
            this.ResetFileAndValidation(Type, '', '', '');
            return
          }
          if (this.file.size < 100000) {
            this.toastr.warning('Please select grater then 100 KB file');
            this.ResetFileAndValidation(Type, '', '', '');
            return
          }
        }
        else {// type validation
          this.toastr.warning('Please select only pdf file');
          this.ResetFileAndValidation(Type, '', '', '');
          return
        }
        // upload to server folder
        this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, data['Data'][0]["FileName"], data['Data'][0]["Dis_FileName"], data['Data'][0]["FilePath"]);
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
        this.ResetFileAndValidation(Type, '', '', '');
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ResetFileAndValidation(type: string, name: string, dis_name: string, path: string) {
    //event.target.value = '';
    try {
      this.loaderService.requestStarted();
      if (type == 'HospitalMOU') {
        this.request.HospitalMOU = name;
        this.request.Dis_HospitalMOU = dis_name;
        this.request.HospitalMOUPath = path;
        this.file = document.getElementById('fHospitalMOU');
        this.file.value = '';
      }
      if (type == 'BedOccupancy') {
        this.request.BedOccupancy = name;
        this.request.Dis_BedOccupancy = dis_name;
        this.request.BedOccupancyPath = path;
        this.file = document.getElementById('fBedOccupancy');
        this.file.value = '';
      }
      if (type == 'FireNOC') {
        this.request.FireNOC = name;
        this.request.Dis_FireNOC = dis_name;
        this.request.FireNOCPath = path;
        this.file = document.getElementById('fFireNOC');
        this.file.value = '';
      }
      if (type == 'PollutionCertificate') {
        this.request.PollutionCertificate = name;
        this.request.Dis_PollutionCertificate = dis_name;
        this.request.PollutionCertificatePath = path;
        this.file = document.getElementById('fPollutionCertificate');
        this.file.value = '';
      }
      if (type == 'ClinicalEstablishment') {
        this.request.ClinicalEstablishment = name;
        this.request.Dis_ClinicalEstablishment = dis_name;
        this.request.ClinicalEstablishmentPath = path;
        this.file = document.getElementById('fClinicalEstablishment');
        this.file.value = '';
      }
      if (type == 'NABH') {
        this.request.NABH = name;
        this.request.Dis_NABH = dis_name;
        this.request.NABHPath = path;
        this.file = document.getElementById('fNABH');
        this.file.value = '';
      }
      if (type == 'UndertakingNotAffiliated') {
        this.request.UndertakingNotAffiliated = name;
        this.request.Dis_UndertakingNotAffiliated = dis_name;
        this.request.UndertakingNotAffiliatedPath = path;
        this.file = document.getElementById('fUndertakingNotAffiliated');
        this.file.value = '';
      }
      if (type == 'StaffInformation') {
        this.request.StaffInformation = name;
        this.request.Dis_StaffInformation = dis_name;
        this.request.StaffInformationPath = path;
        this.file = document.getElementById('fStaffInformation');
        this.file.value = '';
      }
      if (type == 'AffiliatedHospitalMOU') {
        this.Affiliatedrequest.HospitalMOU = name;
        this.Affiliatedrequest.Dis_HospitalMOU = dis_name;
        this.Affiliatedrequest.HospitalMOUPath = path;
        this.file = document.getElementById('fAffiliatedHospitalMOU');
        this.file.value = '';
      }
      if (type == 'AffiliatedBedOccupancy') {
        this.Affiliatedrequest.BedOccupancy = name;
        this.Affiliatedrequest.Dis_BedOccupancy = dis_name;
        this.Affiliatedrequest.BedOccupancyPath = path;
        this.file = document.getElementById('fAffiliatedBedOccupancy');
        this.file.value = '';
      }
      if (type == 'AffiliatedFireNOC') {
        this.Affiliatedrequest.FireNOC = name;
        this.Affiliatedrequest.Dis_FireNOC = dis_name;
        this.Affiliatedrequest.FireNOCPath = path;
        this.file = document.getElementById('fAffiliatedFireNOC');
        this.file.value = '';
      }
      if (type == 'AffiliatedPollutionCertificate') {
        this.Affiliatedrequest.PollutionCertificate = name;
        this.Affiliatedrequest.Dis_PollutionCertificate = dis_name;
        this.Affiliatedrequest.PollutionCertificatePath = path;
        this.file = document.getElementById('fAffiliatedPollutionCertificate');
        this.file.value = '';
      }
      if (type == 'AffiliatedClinicalEstablishment') {
        this.Affiliatedrequest.ClinicalEstablishment = name;
        this.Affiliatedrequest.Dis_ClinicalEstablishment = dis_name;
        this.Affiliatedrequest.ClinicalEstablishmentPath = path;
        this.file = document.getElementById('fAffiliatedClinicalEstablishment');
        this.file.value = '';
      }
      if (type == 'AffiliatedNABH') {
        this.Affiliatedrequest.NABH = name;
        this.Affiliatedrequest.Dis_NABH = dis_name;
        this.Affiliatedrequest.NABHPath = path;
        this.file = document.getElementById('fAffiliatedNABH');
        this.file.value = '';
      }
      if (type == 'AffiliatedUndertakingNotAffiliated') {
        this.Affiliatedrequest.UndertakingNotAffiliated = name;
        this.Affiliatedrequest.Dis_UndertakingNotAffiliated = dis_name;
        this.Affiliatedrequest.UndertakingNotAffiliatedPath = path;
        this.file = document.getElementById('fAffiliatedUndertakingNotAffiliated');
        this.file.value = '';
      }
      if (type == 'AffiliatedStaffInformation') {
        this.Affiliatedrequest.StaffInformation = name;
        this.Affiliatedrequest.Dis_StaffInformation = dis_name;
        this.Affiliatedrequest.StaffInformationPath = path;
        this.file = document.getElementById('fAffiliatedStaffInformation');
        this.file.value = '';
      }

    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DeleteImage(Type: string, filename: string) {
    let path: string = '';
    try {
      this.loaderService.requestStarted();
      // delete from server folder
      this.fileUploadService.DeleteDocument(filename).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.ResetFileAndValidation(Type, '', '', '');
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  public isAffiliatedSubmitted: boolean = false;
  public CurrentIndex: number = -1;
  public isDisabledGrid: boolean = false;
  async AddAffiliatedHospital() {
    try {
      this.isAffiliatedSubmitted = true;
      if (this.AffiliatedHospitalForm.invalid) {
        return;
      }
      if (this.request.IsHillytribalArea == 'No' && this.Affiliatedrequest.CollegeDistance > 30) {
        return;
      }
      if (this.request.IsHillytribalArea == 'Yes' && this.Affiliatedrequest.CollegeDistance > 50) {
        return;
      }

      this.loaderService.requestStarted();
      if (this.CurrentIndex != -1) {
        this.request.MGThreeAffiliatedHospitalList.splice(this.CurrentIndex, 1, this.Affiliatedrequest);
      }
      else {
        this.request.MGThreeAffiliatedHospitalList.push({
          CollegeID: this.SelectedCollageID,
          AffiliatedHospitalName: this.Affiliatedrequest.AffiliatedHospitalName,
          AffiliationReason: this.Affiliatedrequest.AffiliationReason,
          SpecialtyAffiliation: this.Affiliatedrequest.SpecialtyAffiliation,
          OwnerName: this.Affiliatedrequest.OwnerName,
          BedCapacity: this.Affiliatedrequest.BedCapacity,
          NumberDeliveries: this.Affiliatedrequest.NumberDeliveries,
          CollegeDistance: this.Affiliatedrequest.CollegeDistance,
          HospitalMOU: this.Affiliatedrequest.HospitalMOU,
          Dis_HospitalMOU: this.Affiliatedrequest.Dis_HospitalMOU,
          HospitalMOUPath: this.Affiliatedrequest.HospitalMOUPath,
          MedicalBeds: this.Affiliatedrequest.MedicalBeds,
          SurgicalBeds: this.Affiliatedrequest.SurgicalBeds,
          ObstetricsBeds: this.Affiliatedrequest.ObstetricsBeds,
          PediatricsBeds: this.Affiliatedrequest.PediatricsBeds,
          OrthoBeds: this.Affiliatedrequest.OrthoBeds,
          PsychiatryBeds: this.Affiliatedrequest.PsychiatryBeds,
          EmergencyMedicineBeds: this.Affiliatedrequest.EmergencyMedicineBeds,
          BedOccupancy: this.Affiliatedrequest.BedOccupancy,
          Dis_BedOccupancy: this.Affiliatedrequest.Dis_BedOccupancy,
          BedOccupancyPath: this.Affiliatedrequest.BedOccupancyPath,
          FireNOC: this.Affiliatedrequest.FireNOC,
          Dis_FireNOC: this.Affiliatedrequest.Dis_FireNOC,
          FireNOCPath: this.Affiliatedrequest.FireNOCPath,
          PollutionCertificate: this.Affiliatedrequest.PollutionCertificate,
          Dis_PollutionCertificate: this.Affiliatedrequest.Dis_PollutionCertificate,
          PollutionCertificatePath: this.Affiliatedrequest.PollutionCertificatePath,
          ClinicalEstablishment: this.Affiliatedrequest.ClinicalEstablishment,
          Dis_ClinicalEstablishment: this.Affiliatedrequest.Dis_ClinicalEstablishment,
          ClinicalEstablishmentPath: this.Affiliatedrequest.ClinicalEstablishmentPath,
          NABH: this.Affiliatedrequest.NABH,
          Dis_NABH: this.Affiliatedrequest.Dis_NABH,
          NABHPath: this.Affiliatedrequest.NABHPath,
          UndertakingNotAffiliated: this.Affiliatedrequest.UndertakingNotAffiliated,
          Dis_UndertakingNotAffiliated: this.Affiliatedrequest.Dis_UndertakingNotAffiliated,
          UndertakingNotAffiliatedPath: this.Affiliatedrequest.UndertakingNotAffiliatedPath,
          StaffInformation: this.Affiliatedrequest.StaffInformation,
          Dis_StaffInformation: this.Affiliatedrequest.Dis_StaffInformation,
          StaffInformationPath: this.Affiliatedrequest.StaffInformationPath
        });
      }
      this.Affiliatedrequest = new MGThreeAffiliatedHospitalDataModel();
      this.CurrentIndex = -1;
      this.isDisabledGrid = false;
      const btnAdd = document.getElementById('btnAddAffiliated')
      if (btnAdd) { btnAdd.innerHTML = "Add"; }
      this.isAffiliatedSubmitted = false;
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async EditAffiliatedHospitalDetail(idx: number) {
    this.CurrentIndex = idx;
    this.isDisabledGrid = true;
    this.Affiliatedrequest.CollegeID = this.request.MGThreeAffiliatedHospitalList[idx].CollegeID;
    this.Affiliatedrequest.AffiliatedHospitalName = this.request.MGThreeAffiliatedHospitalList[idx].AffiliatedHospitalName;
    this.Affiliatedrequest.AffiliationReason = this.request.MGThreeAffiliatedHospitalList[idx].AffiliationReason;
    this.Affiliatedrequest.SpecialtyAffiliation = this.request.MGThreeAffiliatedHospitalList[idx].SpecialtyAffiliation;
    this.Affiliatedrequest.OwnerName = this.request.MGThreeAffiliatedHospitalList[idx].OwnerName;
    this.Affiliatedrequest.BedCapacity = this.request.MGThreeAffiliatedHospitalList[idx].BedCapacity;
    this.Affiliatedrequest.NumberDeliveries = this.request.MGThreeAffiliatedHospitalList[idx].NumberDeliveries;
    this.Affiliatedrequest.CollegeDistance = this.request.MGThreeAffiliatedHospitalList[idx].CollegeDistance;
    this.Affiliatedrequest.HospitalMOU = this.request.MGThreeAffiliatedHospitalList[idx].HospitalMOU;
    this.Affiliatedrequest.Dis_HospitalMOU = this.request.MGThreeAffiliatedHospitalList[idx].Dis_HospitalMOU;
    this.Affiliatedrequest.HospitalMOUPath = this.request.MGThreeAffiliatedHospitalList[idx].HospitalMOUPath;
    this.Affiliatedrequest.MedicalBeds = this.request.MGThreeAffiliatedHospitalList[idx].MedicalBeds;
    this.Affiliatedrequest.SurgicalBeds = this.request.MGThreeAffiliatedHospitalList[idx].SurgicalBeds;
    this.Affiliatedrequest.ObstetricsBeds = this.request.MGThreeAffiliatedHospitalList[idx].ObstetricsBeds;
    this.Affiliatedrequest.PediatricsBeds = this.request.MGThreeAffiliatedHospitalList[idx].PediatricsBeds;
    this.Affiliatedrequest.OrthoBeds = this.request.MGThreeAffiliatedHospitalList[idx].OrthoBeds;
    this.Affiliatedrequest.PsychiatryBeds = this.request.MGThreeAffiliatedHospitalList[idx].PsychiatryBeds;
    this.Affiliatedrequest.EmergencyMedicineBeds = this.request.MGThreeAffiliatedHospitalList[idx].EmergencyMedicineBeds;
    this.Affiliatedrequest.BedOccupancy = this.request.MGThreeAffiliatedHospitalList[idx].BedOccupancy;
    this.Affiliatedrequest.Dis_BedOccupancy = this.request.MGThreeAffiliatedHospitalList[idx].Dis_BedOccupancy;
    this.Affiliatedrequest.BedOccupancyPath = this.request.MGThreeAffiliatedHospitalList[idx].BedOccupancyPath;
    this.Affiliatedrequest.FireNOC = this.request.MGThreeAffiliatedHospitalList[idx].FireNOC;
    this.Affiliatedrequest.Dis_FireNOC = this.request.MGThreeAffiliatedHospitalList[idx].Dis_FireNOC;
    this.Affiliatedrequest.FireNOCPath = this.request.MGThreeAffiliatedHospitalList[idx].FireNOCPath;
    this.Affiliatedrequest.PollutionCertificate = this.request.MGThreeAffiliatedHospitalList[idx].PollutionCertificate;
    this.Affiliatedrequest.Dis_PollutionCertificate = this.request.MGThreeAffiliatedHospitalList[idx].Dis_PollutionCertificate;
    this.Affiliatedrequest.PollutionCertificatePath = this.request.MGThreeAffiliatedHospitalList[idx].PollutionCertificatePath;
    this.Affiliatedrequest.ClinicalEstablishment = this.request.MGThreeAffiliatedHospitalList[idx].ClinicalEstablishment;
    this.Affiliatedrequest.Dis_ClinicalEstablishment = this.request.MGThreeAffiliatedHospitalList[idx].Dis_ClinicalEstablishment;
    this.Affiliatedrequest.ClinicalEstablishmentPath = this.request.MGThreeAffiliatedHospitalList[idx].ClinicalEstablishmentPath;
    this.Affiliatedrequest.NABH = this.request.MGThreeAffiliatedHospitalList[idx].NABH;
    this.Affiliatedrequest.Dis_NABH = this.request.MGThreeAffiliatedHospitalList[idx].Dis_NABH;
    this.Affiliatedrequest.NABHPath = this.request.MGThreeAffiliatedHospitalList[idx].NABHPath;
    this.Affiliatedrequest.UndertakingNotAffiliated = this.request.MGThreeAffiliatedHospitalList[idx].UndertakingNotAffiliated;
    this.Affiliatedrequest.Dis_UndertakingNotAffiliated = this.request.MGThreeAffiliatedHospitalList[idx].Dis_UndertakingNotAffiliated;
    this.Affiliatedrequest.UndertakingNotAffiliatedPath = this.request.MGThreeAffiliatedHospitalList[idx].UndertakingNotAffiliatedPath;
    this.Affiliatedrequest.StaffInformation = this.request.MGThreeAffiliatedHospitalList[idx].StaffInformation;
    this.Affiliatedrequest.Dis_StaffInformation = this.request.MGThreeAffiliatedHospitalList[idx].Dis_StaffInformation;
    this.Affiliatedrequest.StaffInformationPath == this.request.MGThreeAffiliatedHospitalList[idx].StaffInformationPath;

    const btnAdd = document.getElementById('btnAddAffiliated')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }
  async DeleteAffiliatedHospital(idx: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.MGThreeAffiliatedHospitalList.splice(idx, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ResetAffiliatedDetails() {
    this.Affiliatedrequest = new MGThreeAffiliatedHospitalDataModel();
    this.CurrentIndex = -1;
    this.isDisabledGrid = false;
    const btnAdd = document.getElementById('btnAddAffiliated')
    if (btnAdd) { btnAdd.innerHTML = "Add"; }
  }
  public isSubmitted: boolean = false
  public isformvalid: boolean = true;
  async SaveData() {
    this.isSubmitted = true;
    this.isformvalid = true;
    if (this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == '') {
      this.isformvalid = false;
    }
    if (((this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'Yes') || this.request.IsHillytribalArea == 'No') && this.request.HospitalStatus == '') {
      this.isformvalid = false;
    }
    if (((this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'Yes') || this.request.IsHillytribalArea == 'No')) {
      var TotalBed =
        Number(this.request.MedicalBeds) +
        Number(this.request.SurgicalBeds) +
        Number(this.request.ObstetricsBeds) + Number(this.request.PediatricsBeds) + Number(this.request.OrthoBeds)
        + Number(this.request.PsychiatryBeds) + Number(this.request.EmergencyMedicineBeds);
      if (TotalBed < 100) {
        this.toastr.warning('100 bed manadatory for own/parent hospital');
        return;
      }
    }
    if ((this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'Yes') || this.request.IsHillytribalArea == 'No') {
      if (this.request.HospitalMOU == '') {
        this.isformvalid = false;
      }
      if (this.request.BedOccupancy == '') {
        this.isformvalid = false;
      }
      if (this.request.FireNOC == '') {
        this.isformvalid = false;
      }
      if (this.request.PollutionCertificate == '') {
        this.isformvalid = false;
      }
      if (this.request.ClinicalEstablishment == '') {
        this.isformvalid = false;
      }
      if (this.request.UndertakingNotAffiliated == '') {
        this.isformvalid = false;
      }
      if (this.request.StaffInformation == '') {
        this.isformvalid = false;
      }
    }

    if (((this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'Yes') || this.request.IsHillytribalArea == 'No') && this.request.HospitalStatus == 'Own' && this.request.OwnerName == '') {
      this.isformvalid = false;
    }
    if (((this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'Yes') || this.request.IsHillytribalArea == 'No') && this.request.HospitalStatus == 'Parental' && this.request.SocietyMemberID <= 0) {
      this.isformvalid = false;
    }
    if (this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'No') {
      this.HospitalForm.get('txtHospitalName')?.clearValidators();
      this.HospitalForm.get('txtHospitalName')?.updateValueAndValidity();
      this.HospitalForm.get('txtRegistrationNo')?.clearValidators();
      this.HospitalForm.get('txtRegistrationNo')?.updateValueAndValidity();
      this.HospitalForm.get('txtHospitalContactNo')?.clearValidators();
      this.HospitalForm.get('txtHospitalContactNo')?.updateValueAndValidity();
      this.HospitalForm.get('txtHospitalEmailID')?.clearValidators();
      this.HospitalForm.get('txtHospitalEmailID')?.updateValueAndValidity();
      this.HospitalForm.get('txtAddressLine1')?.clearValidators();
      this.HospitalForm.get('txtAddressLine1')?.updateValueAndValidity();
      this.HospitalForm.get('rbRuralUrban')?.clearValidators();
      this.HospitalForm.get('rbRuralUrban')?.updateValueAndValidity();
      this.HospitalForm.get('ddlDivisionID')?.clearValidators();
      this.HospitalForm.get('ddlDivisionID')?.updateValueAndValidity();
      this.HospitalForm.get('ddlDistrictID')?.clearValidators();
      this.HospitalForm.get('ddlDistrictID')?.updateValueAndValidity();
      this.HospitalForm.get('ddlTehsilID')?.clearValidators();
      this.HospitalForm.get('ddlTehsilID')?.updateValueAndValidity();
      this.HospitalForm.get('txtCityTownVillage')?.clearValidators();
      this.HospitalForm.get('txtCityTownVillage')?.updateValueAndValidity();
      this.HospitalForm.get('txtPincode')?.clearValidators();
      this.HospitalForm.get('txtPincode')?.updateValueAndValidity();
      //this.HospitalForm.get('fHospitalMOU')?.clearValidators();
      //this.HospitalForm.get('fHospitalMOU')?.updateValueAndValidity();
      this.HospitalForm.get('txtBedCapacity')?.clearValidators();
      this.HospitalForm.get('txtBedCapacity')?.updateValueAndValidity();
      this.HospitalForm.get('txtMedicalBeds')?.clearValidators();
      this.HospitalForm.get('txtMedicalBeds')?.updateValueAndValidity();
      this.HospitalForm.get('txtSurgicalBeds')?.clearValidators();
      this.HospitalForm.get('txtSurgicalBeds')?.updateValueAndValidity();
      this.HospitalForm.get('txtObstetricsBeds')?.clearValidators();
      this.HospitalForm.get('txtObstetricsBeds')?.updateValueAndValidity();
      this.HospitalForm.get('txtPediatricsBeds')?.clearValidators();
      this.HospitalForm.get('txtPediatricsBeds')?.updateValueAndValidity();
      this.HospitalForm.get('txtOrthoBeds')?.clearValidators();
      this.HospitalForm.get('txtOrthoBeds')?.updateValueAndValidity();
      this.HospitalForm.get('txtEmergencyMedicineBeds')?.clearValidators();
      this.HospitalForm.get('txtEmergencyMedicineBeds')?.updateValueAndValidity();
      this.HospitalForm.get('txtPsychiatryBeds')?.clearValidators();
      this.HospitalForm.get('txtPsychiatryBeds')?.updateValueAndValidity();
      this.HospitalForm.get('ddlTehsilID')?.clearValidators();
      this.HospitalForm.get('ddlTehsilID')?.updateValueAndValidity();
      this.HospitalForm.get('ddlTehsilID')?.clearValidators();
      this.HospitalForm.get('ddlTehsilID')?.updateValueAndValidity();
      //this.HospitalForm.get('fBedOccupancy')?.clearValidators();
      //this.HospitalForm.get('fBedOccupancy')?.updateValueAndValidity();
      //this.HospitalForm.get('fFireNOC')?.clearValidators();
      //this.HospitalForm.get('fFireNOC')?.updateValueAndValidity();
      //this.HospitalForm.get('fPollutionCertificate')?.clearValidators();
      //this.HospitalForm.get('fPollutionCertificate')?.updateValueAndValidity();
      //this.HospitalForm.get('fClinicalEstablishment')?.clearValidators();
      //this.HospitalForm.get('fClinicalEstablishment')?.updateValueAndValidity();
      //this.HospitalForm.get('fUndertakingNotAffiliated')?.clearValidators();
      //this.HospitalForm.get('fUndertakingNotAffiliated')?.updateValueAndValidity();
      //this.HospitalForm.get('fStaffInformation')?.clearValidators();
      //this.HospitalForm.get('fStaffInformation')?.updateValueAndValidity();
      this.HospitalForm.get('txtCollegeDistance')?.clearValidators();
      this.HospitalForm.get('txtCollegeDistance')?.updateValueAndValidity();
      this.HospitalForm.get('txtNumberofdeliveries')?.clearValidators();
      this.HospitalForm.get('txtNumberofdeliveries')?.updateValueAndValidity();
      this.HospitalForm.get('ddlCityID')?.clearValidators();
      this.HospitalForm.get('ddlCityID')?.updateValueAndValidity();
      this.HospitalForm.get('ddlPanchayatSamitiID')?.clearValidators();
      this.HospitalForm.get('ddlPanchayatSamitiID')?.updateValueAndValidity();
    }
    else {
      if (this.request.RuralUrban == 1) {
        this.HospitalForm.get('ddlCityID')?.clearValidators();
        this.HospitalForm.get('ddlCityID')?.updateValueAndValidity();
        this.HospitalForm.get('ddlPanchayatSamitiID')?.setValidators([DropdownValidators]);
        this.HospitalForm.get('ddlPanchayatSamitiID')?.updateValueAndValidity();
      }
      if (this.request.RuralUrban == 2) {
        this.HospitalForm.get('ddlPanchayatSamitiID')?.clearValidators();
        this.HospitalForm.get('ddlPanchayatSamitiID')?.updateValueAndValidity();
        this.HospitalForm.get('ddlCityID')?.setValidators([DropdownValidators]);
        this.HospitalForm.get('ddlCityID')?.updateValueAndValidity();
      }
    }
    if (this.request.IsHillytribalArea == 'No' && this.request.CollegeDistance > 30) {
      return;
    }
    if (this.request.IsHillytribalArea == 'Yes' && this.request.CollegeDistance > 50) {
      return;
    }
    if (this.HospitalForm.invalid) {
      this.isformvalid = false;
    }
    if (this.request.IsHillytribalArea == 'Yes' && this.request.IsInstitutionParentHospital == 'No') {
      if (this.request.MGThreeAffiliatedHospitalList.length <= 0) {
        this.toastr.warning('Please add one Affiliated Hospital');
        return;
      }
    }
    //var TotalBed = Number(this.request.MedicalBeds) + Number(this.request.SurgicalBeds) + Number(this.request.ObstetricsBeds)
    //  + Number(this.request.PediatricsBeds) + Number(this.request.OrthoBeds)
    //  + Number(this.request.PsychiatryBeds) + Number(this.request.EmergencyMedicineBeds);
    //for (var i = 0; i < this.request.MGThreeAffiliatedHospitalList.length; i++) {
    //  var TotalAffBed = Number(this.request.MGThreeAffiliatedHospitalList[i].MedicalBeds) + Number(this.request.MGThreeAffiliatedHospitalList[i].SurgicalBeds) + Number(this.request.MGThreeAffiliatedHospitalList[i].ObstetricsBeds)
    //    + Number(this.request.MGThreeAffiliatedHospitalList[i].PediatricsBeds) + Number(this.request.MGThreeAffiliatedHospitalList[i].OrthoBeds)
    //    + Number(this.request.MGThreeAffiliatedHospitalList[i].PsychiatryBeds) + Number(this.request.MGThreeAffiliatedHospitalList[i].EmergencyMedicineBeds);
    //  TotalBed = TotalBed + TotalAffBed;
    //}
    //if (TotalBed < 180) {
    //  this.toastr.warning('Total 180 bed requried');
    //  return;
    //}
    console.log(this.HospitalForm);
    if (!this.isformvalid) {
      return
    }
    // save data
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.SaveMGThreeHospitalData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //console.log(this.State);

          if (!this.State) {
            this.toastr.success(this.SuccessMessage);
            await this.GetMGThreeHospitalDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
            // reset
            this.ResetDetails();
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
  async ResetDetails() {
    this.request = new MGThreeHospitalDataModel();
  }
  async OnChangeinstitutesituated() {
    this.request.HospitalStatus = '';
    this.request.IsInstitutionParentHospital = '';
  }
  async OnChangeInstitutionParentHospital() {
    this.request.HospitalStatus = '';
  }

  public HospitalList: any = [];
  async GetMGThreeHospitalDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, HospitalID: number) {
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.GetMGThreeHospitalDetailList_DepartmentCollegeWise(DepartmentID, CollegeID, HospitalID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HospitalList = data['Data'];
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

  async EditHospital(HospitalID: number) {
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.GetMGThreeHospitalDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, HospitalID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then(async (data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.request = data['Data'][0];
            await this.FillDivisionRelatedDDL(null, this.request.DivisionID.toString());
            await this.FillDistrictRelatedDDL(null, this.request.DistrictID.toString());
            if (this.request.MGThreeAffiliatedHospitalList.length > 0) {
              this.request.IsAnyAffiliatedHospital = 'Yes';
            }
            else {
              this.request.IsAnyAffiliatedHospital = '';
            }
          }
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async DeleteHospitalDetail(HospitalID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.hospitalDetailService.DeleteHospitalDetail(HospitalID)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              await this.GetMGThreeHospitalDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
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

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public viewrequest: any = {};
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  async ViewHospitalDetail(content: any, HospitalID: number) {
    this.viewrequest = {};
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.GetMGThreeHospitalDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, HospitalID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.viewrequest = data['Data'][0];
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
