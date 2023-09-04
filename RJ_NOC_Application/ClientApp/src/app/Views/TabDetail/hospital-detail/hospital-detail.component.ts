import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';

import { HospitalDataModel, HospitalParentNotDataModel } from '../../../Models/HospitalDataModel';
import { min } from 'rxjs';
import { async } from '@angular/core/testing';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { HospitalDetailService } from '../../../Services/Tabs/HospitalDetail/hospital-detail.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LegalEntityDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
@Injectable()

@Component({
  selector: 'app-hospital-detail',
  templateUrl: './hospital-detail.component.html',
  styleUrls: ['./hospital-detail.component.css']
})
export class HospitalDetailComponent implements OnInit {

  //Add FormBuilder
  HospitalParentForm!: FormGroup;
  HospitalParentNotForm!: FormGroup;

  public PinNoRegex = new RegExp(/[0-9]{6}/)
  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)
  public LandLineRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public IsHospitalOwned: boolean = false;
  public isSubmitted_ParentNot: boolean = false;
  public HospitalAreaValidationList: any = [];
  public MinDistance: number = 0;
  public MaxDistance: number = 0;
  public MinDistance_ParentNot: number = 0;
  public MaxDistance_ParentNot: number = 0;
  public IsParentHospital: boolean = null;
  public IsParentHospitalRelatedToOther: boolean = false;
  public IsAffiliatedHospitalAffiliationToOther: boolean = false;
  public isValid: boolean = true;
  public isValid_ParentNot: boolean = true;
  public HospitalDataModelList: any = [];
  public HospitalParentNotDataModelList: any = [];
  public DivisionList: any = [];

  public DistrictList: any = [];
  public TehsilList: any = [];
  public PanchyatSamitiList: any = [];
  public IsRural: boolean = true;

  public DistrictList_ManageBy: any = [];
  public TehsilList_ManageBy: any = [];
  public PanchyatSamitiList_ManageBy: any = [];
  public IsRural_ManageBy: boolean = true;

  public DistrictList_Owner: any = [];
  public TehsilList_Owner: any = [];
  public PanchyatSamitiList_Owner: any = [];
  public IsRural_Owner: boolean = true;

  public DistrictList_Other: any = [];
  public TehsilList_Other: any = [];
  public PanchyatSamitiList_Other: any = [];
  public IsRural_Other: boolean = true;


  public DistrictList_ParentNot: any = [];
  public TehsilList_ParentNot: any = [];
  public PanchyatSamitiList_ParentNot: any = [];
  public IsRural_ParentNot: boolean = true;

  public DistrictList_ParentNot_ManageBy: any = [];
  public TehsilList_ParentNot_ManageBy: any = [];
  public PanchyatSamitiList_ParentNot_ManageBy: any = [];
  public IsRural_ParentNot_ManageBy: boolean = true;

  public QueryStringDepartmentID: number = 0;
  public QueryStringCollegeID: number = 0;

  public DistrictList_ParentNot_Owner: any = [];
  public TehsilList_ParentNot_Owner: any = [];
  public PanchyatSamitiList_ParentNot_Owner: any = [];
  public IsRural_ParentNot_Owner: boolean = true;
  public IsShowSuperSpecialtyHospital: boolean = false;

  public file: any = null;
  public showParentNotDocument: boolean = false;
  public ParentNotDocumentValidationMessage: string = '';
  public PollutionCertificateValidationMessage: string = '';
  public NotPollutionCertificateValidationMessage: string = '';
  public showParentNotConsentForm: boolean = false;
  public ParentNotConsentFormValidationMessage: string = '';

  // login model
  sSOLoginDataModel = new SSOLoginDataModel();

  /*Save Data Model*/
  request = new HospitalDataModel();
  requestNot = new HospitalParentNotDataModel();

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public HospitalData: any = {};

  LegalEntityDataModel = new LegalEntityDataModel();
  public isHospitalrequried: boolean = false;
  public isFormValid: boolean = true;
  constructor(private TrusteeGeneralInfoService: TrusteeGeneralInfoService, private modalService: NgbModal, private hospitalDetailService: HospitalDetailService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private fileUploadService: FileUploadService) {
  }

  async ngOnInit() {

    this.HospitalParentForm = this.formBuilder.group(
      {
        rbParentHospital: [''],
        rbHospitalStatus: [''],
        rbHospitalArea: ['', Validators.required],
        txtHospitalName: ['', Validators.required],
        txtHospitalRegNo: ['', Validators.required],
        txtHospitalDistance: ['', Validators.required],
        txtHospitalContactNo: ['', [Validators.required, Validators.pattern(this.LandLineRegex)]],
        txtHospitalEmailID: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        txtManageByName: ['', Validators.required],
        txtManageByPhone: ['', [Validators.required, Validators.pattern(this.LandLineRegex)]],
        txtOwnerName: ['', Validators.required],
        txtOwnerPhone: ['', [Validators.required, Validators.pattern(this.LandLineRegex)]],
        txtMedicalBeds: ['', [Validators.required, Validators.min(30)]],
        txtSurgicalBeds: ['', [Validators.required, Validators.min(30)]],
        txtObstAndGynaecologyBeds: ['', [Validators.required, Validators.min(30)]],
        txtPediatricsBeds: ['', [Validators.required, Validators.min(20)]],
        txtOrthoBeds: ['', [Validators.required, Validators.min(10)]],
        txtOccupancyPercentegeBeds: ['', [Validators.required, Validators.min(75)]],
        txtAffiliationPsychiatricBeds: ['', [Validators.required, Validators.min(50)]],
        rbParentHospitalRelatedToOtherID: [''],
        txtInstitutionName: ['', Validators.required],
        txtOrganizationPhone: ['', [Validators.required]], //, Validators.pattern(this.LandLineRegex)

        txtCardioThoracicTotalBeds: ['', [Validators.required, Validators.min(50)]],
        txtCardioThoracicCCUBeds: [''],
        txtCardioThoracicICCUBeds: [''],
        txtCardioThoracicICUBeds: [''],

        txtCriticalCareNursingTotalBeds: ['', [Validators.required, Validators.min(250)]],
        txtCriticalCareNursingCCBeds: [''],
        txtCriticalCareNursingICUBeds: [''],

        txtMidwiferyNursingTotalBeds: ['', [Validators.required, Validators.min(50)]],
        txtMotherNeonatalUnitsBeds: [''],
        txtDeliveriesPerYear: ['', [Validators.required, Validators.min(500)]],
        txtLevelIINeonatalBeds: ['', [Validators.required, Validators.min(8)]],
        txtLevelIIINeonatalBeds: [''],

        txtNeuroScienceNursingTotalBeds: ['', [Validators.required, Validators.min(50)]],

        txtOncologyNursingTotalBeds: ['', [Validators.required, Validators.min(100)]],
        txtOncologyNursingMedicalBeds: [''],
        txtOncologyNurSingsurgicalBeds: [''],
        txtOncologyNursingChemotherapyBeds: [''],
        txtOncologyNursingRadiotherapyBeds: [''],
        txtOncologyNursingPalliativeBeds: [''],
        txtOncologyNursingDiagnosticBeds: [''],

        txtOrthopaedicRehabilitationNursingTotalBeds: ['', [Validators.required, Validators.min(250)]],
        txtOrthopaedicRehabilitationNursingOrthopaedicBeds: [''],
        txtOrthopaedicRehabilitationNursingRehabilitationBeds: [''],

        txtPsychiatricNursingTotalBeds: ['', [Validators.required, Validators.min(50)]],
        txtPsychiatricNursingAcuteBeds: [''],
        txtPsychiatricNursingChronicBeds: [''],
        txtPsychiatricNursingAdultBeds: [''],
        txtPsychiatricNursingChildBeds: [''],
        txtPsychiatricNursingDeAddictionBeds: [''],

        txtNeonatalNursingTotalBeds: ['', [Validators.required, Validators.min(250)]],
        txtNeonatalNursingLevelIIOrIIINICUBeds: [''],
        txtNeonatalNursingNICUBeds: [''],

        txtOperationRoomNursingTotalBeds: ['', [Validators.required, Validators.min(250)]],
        txtOperationRoomNursingGeneralSurgeryBeds: [''],
        txtOperationRoomNursingPediatricBeds: [''],
        txtOperationRoomNursingCardiothoracicBeds: [''],
        txtOperationRoomNursingGynaeAndObstetricalBeds: [''],
        txtOperationRoomNursingOrthopaedicsBeds: [''],
        txtOperationRoomNursingOphthalmicBeds: [''],
        txtOperationRoomNursingENTAndNeuroBeds: [''],

        txtEmergencyAndDisasterNursingTotalBeds: ['', [Validators.required, Validators.min(250)]],
        txtEmergencyAndDisasterNursingICUBeds: [''],
        txtEmergencyAndDisasterNursingEmergencylBeds: [''],

        txtAddressLine1: ['', Validators.required],
        txtAddressLine2: [''],//, Validators.required
        rbRuralUrban: ['', Validators.required],
        ddlDivisionID: ['', [DropdownValidators]],
        ddlDistrictID: ['', [DropdownValidators]],
        ddlTehsilID: ['', [DropdownValidators]],
        ddlPanchayatSamitiID: ['', [DropdownValidators]],
        txtCityTownVillage: ['', Validators.required],
        txtPincode: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],

        txtAddressLine1_ManageBy: ['', Validators.required],
        txtAddressLine2_ManageBy: [''],//, Validators.required
        rbRuralUrban_ManageBy: ['', Validators.required],
        ddlDivisionID_ManageBy: ['', [DropdownValidators]],
        ddlDistrictID_ManageBy: ['', [DropdownValidators]],
        ddlTehsilID_ManageBy: ['', [DropdownValidators]],
        ddlPanchayatSamitiID_ManageBy: ['', [DropdownValidators]],
        txtCityTownVillage_ManageBy: ['', Validators.required],
        txtPincode_ManageBy: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],

        txtAddressLine1_Owner: ['', Validators.required],
        txtAddressLine2_Owner: [''],//, Validators.required
        rbRuralUrban_Owner: ['', Validators.required],
        ddlDivisionID_Owner: ['', [DropdownValidators]],
        ddlDistrictID_Owner: ['', [DropdownValidators]],
        ddlTehsilID_Owner: ['', [DropdownValidators]],
        ddlPanchayatSamitiID_Owner: ['', [DropdownValidators]],
        txtCityTownVillage_Owner: ['', Validators.required],
        txtPincode_Owner: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],

        txtAddressLine1_Other: ['', Validators.required],
        txtAddressLine2_Other: ['', Validators.required],
        rbRuralUrban_Other: ['', Validators.required],
        ddlDivisionID_Other: ['', [DropdownValidators]],
        ddlDistrictID_Other: ['', [DropdownValidators]],
        ddlTehsilID_Other: ['', [DropdownValidators]],
        ddlPanchayatSamitiID_Other: ['', [DropdownValidators]],
        txtCityTownVillage_Other: ['', Validators.required],
        txtPincode_Other: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],

        txtPollutionUnitID: ['', Validators.required],
        fPollutionCertificate: [''],
      })

    this.HospitalParentNotForm = this.formBuilder.group(
      {
        rbHospitalArea: ['', Validators.required],
        txtHospitalName: ['', Validators.required],
        txtHospitalRegNo: ['', Validators.required],
        txtHospitalDistance: ['', Validators.required],
        txtHospitalContactNo: ['', [Validators.required, Validators.pattern(this.LandLineRegex)]],
        txtHospitalEmailID: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        txtManageByName: ['', Validators.required],
        txtManageByPhone: ['', [Validators.required, Validators.pattern(this.LandLineRegex)]],
        txtOwnerName: ['', Validators.required],
        txtOwnerPhone: ['', [Validators.required, Validators.pattern(this.LandLineRegex)]],
        txtMedicalBeds: ['', [Validators.required, Validators.min(30)]],
        txtSurgicalBeds: ['', [Validators.required, Validators.min(30)]],
        txtObstAndGynaecologyBeds: ['', [Validators.required, Validators.min(30)]],
        txtPediatricsBeds: ['', [Validators.required, Validators.min(20)]],
        txtOrthoBeds: ['', [Validators.required, Validators.min(10)]],
        txtOccupancyPercentegeBeds: ['', [Validators.required, Validators.min(75)]],
        txtAffiliationPsychiatricBeds: ['', [Validators.required, Validators.min(50)]],
        rbAffiliatedHospitalAffiliationToOtherID: ['', Validators.required],
        fParentNotDocument: [''],
        fConsentForm: [''],

        txtAddressLine1: ['', Validators.required],
        txtAddressLine2: [''],//, Validators.required
        rbRuralUrban: ['', Validators.required],
        ddlDivisionID: ['', [DropdownValidators]],
        ddlDistrictID: ['', [DropdownValidators]],
        ddlTehsilID: ['', [DropdownValidators]],
        ddlPanchayatSamitiID: ['', [DropdownValidators]],
        txtCityTownVillage: ['', Validators.required],
        txtPincode: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],

        txtAddressLine1_ManageBy: ['', Validators.required],
        txtAddressLine2_ManageBy: [''],//, Validators.required
        rbRuralUrban_ManageBy: ['', Validators.required],
        ddlDivisionID_ManageBy: ['', [DropdownValidators]],
        ddlDistrictID_ManageBy: ['', [DropdownValidators]],
        ddlTehsilID_ManageBy: ['', [DropdownValidators]],
        ddlPanchayatSamitiID_ManageBy: ['', [DropdownValidators]],
        txtCityTownVillage_ManageBy: ['', Validators.required],
        txtPincode_ManageBy: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],

        txtAddressLine1_Owner: ['', Validators.required],
        txtAddressLine2_Owner: [''],//, Validators.required
        rbRuralUrban_Owner: ['', Validators.required],
        ddlDivisionID_Owner: ['', [DropdownValidators]],
        ddlDistrictID_Owner: ['', [DropdownValidators]],
        ddlTehsilID_Owner: ['', [DropdownValidators]],
        ddlPanchayatSamitiID_Owner: ['', [DropdownValidators]],
        txtCityTownVillage_Owner: ['', Validators.required],
        txtPincode_Owner: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],
        txtPollutionUnitID: ['', Validators.required],
        fPollutionCertificate: [''],
      })

    // query string
    this.QueryStringDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.QueryStringCollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // set for hidden of Whether the parent hospital is related to any other institution in the past or not
    this.request.InstitutionName = 'NA';
    this.request.OrganizationPhone = '0000000000';
    this.request.AddressLine1_Other = 'NA';
    this.request.AddressLine2_Other = 'NA';
    this.request.RuralUrban_Other = 0;
    this.request.DivisionID_Other = 1;
    this.request.DistrictID_Other = 1;
    this.request.TehsilID_Other = 1;
    this.request.PanchayatSamitiID_Other = 1;
    this.request.CityTownVillage_Other = 'NA';
    this.request.Pincode_Other = 111111;

    // get all hospital area validation
    await this.GetHospitalAreaValidationList();
    // division
    await this.GetDivisionList();
    // set course id
    this.request.CollegeID = this.QueryStringCollegeID;
    this.requestNot.CollegeID = this.QueryStringCollegeID;
    // get hospital list by courseid
    if (this.QueryStringDepartmentID > 0 && this.QueryStringCollegeID > 0) {
      await this.GetDataList();
      // Super specialty hospital
      await this.IsSuperSpecialtyHospital();
      await this.GetLegalEntityData();
    }


    const txtHospitalRegNo = document.getElementById('txtHospitalRegNo')
    if (txtHospitalRegNo) txtHospitalRegNo.focus();

  }

  get form() { return this.HospitalParentForm.controls; }
  get form_ParentNot() { return this.HospitalParentNotForm.controls; }

  ToggleSuperSpecialtyHospitalValidation() {
    try {
      this.loaderService.requestStarted();
      if (this.IsShowSuperSpecialtyHospital) {
        this.HospitalParentForm.get('txtCardioThoracicTotalBeds')?.setValidators([Validators.required, Validators.min(50)]);
        this.HospitalParentForm.get('txtCriticalCareNursingTotalBeds')?.setValidators([Validators.required, Validators.min(250)]);
        this.HospitalParentForm.get('txtMidwiferyNursingTotalBeds')?.setValidators([Validators.required, Validators.min(50)]);
        this.HospitalParentForm.get('txtDeliveriesPerYear')?.setValidators([Validators.required, Validators.min(500)]);
        this.HospitalParentForm.get('txtLevelIINeonatalBeds')?.setValidators([Validators.required, Validators.min(8)]);
        this.HospitalParentForm.get('txtNeuroScienceNursingTotalBeds')?.setValidators([Validators.required, Validators.min(50)]);
        this.HospitalParentForm.get('txtOncologyNursingTotalBeds')?.setValidators([Validators.required, Validators.min(100)]);
        this.HospitalParentForm.get('txtOrthopaedicRehabilitationNursingTotalBeds')?.setValidators([Validators.required, Validators.min(250)]);
        this.HospitalParentForm.get('txtPsychiatricNursingTotalBeds')?.setValidators([Validators.required, Validators.min(50)]);
        this.HospitalParentForm.get('txtNeonatalNursingTotalBeds')?.setValidators([Validators.required, Validators.min(250)]);
        this.HospitalParentForm.get('txtOperationRoomNursingTotalBeds')?.setValidators([Validators.required, Validators.min(250)]);
        this.HospitalParentForm.get('txtEmergencyAndDisasterNursingTotalBeds')?.setValidators([Validators.required, Validators.min(250)]);
      }
      else {
        this.HospitalParentForm.get('txtCardioThoracicTotalBeds')?.clearValidators();
        this.HospitalParentForm.get('txtCriticalCareNursingTotalBeds')?.clearValidators();
        this.HospitalParentForm.get('txtMidwiferyNursingTotalBeds')?.clearValidators();
        this.HospitalParentForm.get('txtDeliveriesPerYear')?.clearValidators();
        this.HospitalParentForm.get('txtLevelIINeonatalBeds')?.clearValidators();
        this.HospitalParentForm.get('txtNeuroScienceNursingTotalBeds')?.clearValidators();
        this.HospitalParentForm.get('txtOncologyNursingTotalBeds')?.clearValidators();
        this.HospitalParentForm.get('txtOrthopaedicRehabilitationNursingTotalBeds')?.clearValidators();
        this.HospitalParentForm.get('txtPsychiatricNursingTotalBeds')?.clearValidators();
        this.HospitalParentForm.get('txtNeonatalNursingTotalBeds')?.clearValidators();
        this.HospitalParentForm.get('txtOperationRoomNursingTotalBeds')?.clearValidators();
        this.HospitalParentForm.get('txtEmergencyAndDisasterNursingTotalBeds')?.clearValidators();
      }
      this.HospitalParentForm.get('txtCardioThoracicTotalBeds')?.updateValueAndValidity();
      this.HospitalParentForm.get('txtCriticalCareNursingTotalBeds')?.updateValueAndValidity();
      this.HospitalParentForm.get('txtMidwiferyNursingTotalBeds')?.updateValueAndValidity();
      this.HospitalParentForm.get('txtDeliveriesPerYear')?.updateValueAndValidity();
      this.HospitalParentForm.get('txtLevelIINeonatalBeds')?.updateValueAndValidity();
      this.HospitalParentForm.get('txtNeuroScienceNursingTotalBeds')?.updateValueAndValidity();
      this.HospitalParentForm.get('txtOncologyNursingTotalBeds')?.updateValueAndValidity();
      this.HospitalParentForm.get('txtOrthopaedicRehabilitationNursingTotalBeds')?.updateValueAndValidity();
      this.HospitalParentForm.get('txtPsychiatricNursingTotalBeds')?.updateValueAndValidity();
      this.HospitalParentForm.get('txtNeonatalNursingTotalBeds')?.updateValueAndValidity();
      this.HospitalParentForm.get('txtOperationRoomNursingTotalBeds')?.updateValueAndValidity();
      this.HospitalParentForm.get('txtEmergencyAndDisasterNursingTotalBeds')?.updateValueAndValidity();
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

  async SetHospitalDistance(minDistance: number, maxDistance: number, section: string) {
    try {
      this.loaderService.requestStarted();
      if (section == 'ParentNot') {
        this.MinDistance_ParentNot = minDistance;
        this.MaxDistance_ParentNot = maxDistance;
      }
      else {
        this.MinDistance = minDistance;
        this.MaxDistance = maxDistance;
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

  IsParentHospitalOrNot(isParent: boolean) {
    try {
      this.loaderService.requestStarted();
      this.IsParentHospital = isParent;
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

  // other
  IsParentHospitalRelatedToOtherOrNot(isParentRelatedToOther: boolean) {
    try {
      this.loaderService.requestStarted();
      this.IsParentHospitalRelatedToOther = isParentRelatedToOther;

      if (isParentRelatedToOther) {
        this.request.InstitutionName = null;
        this.request.OrganizationPhone = '';
        this.request.AddressLine1_Other = '';
        this.request.AddressLine2_Other = '';
        this.request.RuralUrban_Other = null;
        this.request.DivisionID_Other = 0;
        this.request.DistrictID_Other = 0;
        this.request.TehsilID_Other = 0;
        this.request.PanchayatSamitiID_Other = 0;
        this.request.CityTownVillage_Other = '';
        this.request.Pincode_Other = null;

      }
      else {
        this.request.InstitutionName = 'NA';
        this.request.OrganizationPhone = '0000000000';
        this.request.AddressLine1_Other = 'NA';
        this.request.AddressLine2_Other = 'NA';
        this.request.RuralUrban_Other = 0;
        this.request.DivisionID_Other = 1;
        this.request.DistrictID_Other = 1;
        this.request.TehsilID_Other = 1;
        this.request.PanchayatSamitiID_Other = 1;
        this.request.CityTownVillage_Other = 'NA';
        this.request.Pincode_Other = 111111;

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

  IsAffiliatedHospitalAffiliationToOtherOrNot(isAffiliatedHospitalAffiliationToOther: boolean) {
    try {
      this.loaderService.requestStarted();
      this.IsAffiliatedHospitalAffiliationToOther = isAffiliatedHospitalAffiliationToOther;
      //if (isAffiliatedHospitalAffiliationToOther) {
      //  this.requestNot.ConsentForm = '';
      //} else {
      //  this.requestNot.ConsentForm = 'NA';
      //}
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

  async IsSuperSpecialtyHospital() {
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.IsSuperSpecialtyHospital(this.QueryStringCollegeID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.IsShowSuperSpecialtyHospital = data['Data'];
          await this.ToggleSuperSpecialtyHospitalValidation();
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

  async GetHospitalAreaValidationList() {
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.GetHospitalAreaValidation()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HospitalAreaValidationList = data['Data'];
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

  async IsRuralOrUrban(isRural: boolean, section: string, isResetValue: boolean) {
    try {
      this.loaderService.requestStarted();
      if (isRural) {
        if (section == 'ManageBy') {
          this.IsRural_ManageBy = isRural;
          if (isResetValue) {
            this.request.TehsilID_ManageBy = 0;
            this.request.PanchayatSamitiID_ManageBy = 0;
          }
        }
        else if (section == 'Owner') {
          this.IsRural_Owner = isRural;
          if (isResetValue) {
            this.request.TehsilID_Owner = 0;
            this.request.PanchayatSamitiID_Owner = 0;
          }
        }
        else if (section == 'Other') {
          this.IsRural_Other = isRural;
          if (isResetValue) {
            this.request.TehsilID_Other = 0;
            this.request.PanchayatSamitiID_Other = 0;
          }
        }
        else {
          this.IsRural = isRural;
          if (isResetValue) {
            this.request.TehsilID = 0;
            this.request.PanchayatSamitiID = 0;
          }
        }
      }
      else {
        if (section == 'ManageBy') {
          this.IsRural_ManageBy = isRural;
          if (isResetValue) {
            this.request.TehsilID_ManageBy = 1;
            this.request.PanchayatSamitiID_ManageBy = 1;
          }
        }
        else if (section == 'Owner') {
          this.IsRural_Owner = isRural;
          if (isResetValue) {
            this.request.TehsilID_Owner = 1;
            this.request.PanchayatSamitiID_Owner = 1;
          }
        }
        else if (section == 'Other') {
          this.IsRural_Other = isRural;
          if (isResetValue) {
            this.request.TehsilID_Other = 1;
            this.request.PanchayatSamitiID_Other = 1;
          }
        }
        else {
          this.IsRural = isRural;
          if (isResetValue) {
            this.request.TehsilID = 1;
            this.request.PanchayatSamitiID = 1;
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

  async IsRuralOrUrban_ParentNot(isRural: boolean, section: string, isResetValue: boolean) {
    try {
      this.loaderService.requestStarted();
      if (isRural) {
        if (section == 'ManageBy') {
          this.IsRural_ParentNot_ManageBy = isRural;
          if (isResetValue) {
            this.requestNot.TehsilID_ManageBy = 0;
            this.requestNot.PanchayatSamitiID_ManageBy = 0;
          }
        }
        else if (section == 'Owner') {
          this.IsRural_ParentNot_Owner = isRural;
          if (isResetValue) {
            this.requestNot.TehsilID_Owner = 0;
            this.requestNot.PanchayatSamitiID_Owner = 0;
          }
        }
        else {
          this.IsRural_ParentNot = isRural;
          if (isResetValue) {
            this.requestNot.TehsilID = 0;
            this.requestNot.PanchayatSamitiID = 0;
          }
        }
      }
      else {
        if (section == 'ManageBy') {
          this.IsRural_ParentNot_ManageBy = isRural;
          if (isResetValue) {
            this.requestNot.TehsilID_ManageBy = 1;
            this.requestNot.PanchayatSamitiID_ManageBy = 1;
          }
        }
        else if (section == 'Owner') {
          this.IsRural_ParentNot_Owner = isRural;
          if (isResetValue) {
            this.requestNot.TehsilID_Owner = 1;
            this.requestNot.PanchayatSamitiID_Owner = 1;
          }
        }
        else {
          this.IsRural_ParentNot = isRural;
          if (isResetValue) {
            this.requestNot.TehsilID = 1;
            this.requestNot.PanchayatSamitiID = 1;
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

          if (section == 'ManageBy') {
            this.DistrictList_ManageBy = data['Data'];
          }
          else if (section == 'Owner') {
            this.DistrictList_Owner = data['Data'];
          }
          else if (section == 'Other') {
            this.DistrictList_Other = data['Data'];
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

  async FillDivisionRelatedDDL_ParentNot(event: any, SelectedDivisionID: string, section: string,) {
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

          if (section == 'ManageBy') {
            this.DistrictList_ParentNot_ManageBy = data['Data'];
          }
          else if (section == 'Owner') {
            this.DistrictList_ParentNot_Owner = data['Data'];
          }
          else {
            this.DistrictList_ParentNot = data['Data'];
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

  async FillDistrictRelatedDDL(event: any, SelectedDistrictID: string, section: string,) {
    try {
      this.loaderService.requestStarted();
      const districtId = Number(SelectedDistrictID);
      if (districtId <= 0) {
        return;
      }
      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          if (section == 'ManageBy') {
            this.TehsilList_ManageBy = data['Data'];
          }
          else if (section == 'Owner') {
            this.TehsilList_Owner = data['Data'];
          }
          else if (section == 'Other') {
            this.TehsilList_Other = data['Data'];
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

          if (section == 'ManageBy') {
            this.PanchyatSamitiList_ManageBy = data['Data'];
          }
          else if (section == 'Owner') {
            this.PanchyatSamitiList_Owner = data['Data'];
          }
          else if (section == 'Other') {
            this.PanchyatSamitiList_Other = data['Data'];
          }
          else {
            this.PanchyatSamitiList = data['Data'];
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

  async FillDistrictRelatedDDL_ParentNot(event: any, SelectedDistrictID: string, section: string,) {
    try {
      this.loaderService.requestStarted();
      const districtId = Number(SelectedDistrictID);
      if (districtId <= 0) {
        return;
      }
      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          if (section == 'ManageBy') {
            this.TehsilList_ParentNot_ManageBy = data['Data'];
          }
          else if (section == 'Owner') {
            this.TehsilList_ParentNot_Owner = data['Data'];
          }
          else {
            this.TehsilList_ParentNot = data['Data'];
          }
        }, error => console.error(error));
      // PanchyatSamiti list
      await this.commonMasterService.GetPanchyatSamitiByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          if (section == 'ManageBy') {
            this.PanchyatSamitiList_ParentNot_ManageBy = data['Data'];
          }
          else if (section == 'Owner') {
            this.PanchyatSamitiList_ParentNot_Owner = data['Data'];
          }
          else {
            this.PanchyatSamitiList_ParentNot = data['Data'];
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

  async SaveDataOfParent() {
    this.isHospitalrequried = false;
    this.isFormValid = true;
    this.isSubmitted = true;
    if (this.HospitalParentForm.invalid) {
      console.log(this.HospitalParentForm);
      this.isFormValid = false;
    }
    if (!this.IsValid()) {
      this.isFormValid = false;
    }
    if (this.request.PollutionCertificate == '') {
      this.isFormValid = false;
    }
    if (!this.isFormValid) { return }
    if (this.request.HospitalID > 0) {
      this.request.ModifyBy = 1;
    }
    else {
      this.request.CreatedBy = 1;
      this.request.ModifyBy = 1;
    }
    // save data
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //console.log(this.State);

          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // reset    
            this.ResetHospitalOfParent();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
          // get data
          await this.GetDataList();
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }

    this.isSubmitted = false;

  }

  ResetHospitalOfParent() {
    try {
      this.loaderService.requestStarted();
      this.IsHospitalOwned = false;
      this.request.HospitalID = 0;
      this.request.HospitalAreaID = 0;
      this.request.HospitalRegNo = '';
      this.request.HospitalName = '';
      this.request.HospitalDistance = 0;
      this.request.HospitalContactNo = '';
      this.request.HospitalEmailID = '';
      this.request.ManageByName = '';
      this.request.ManageByPhone = '';
      this.request.OwnerName = '';
      this.request.OwnerPhone = '';
      this.request.MedicalBeds = 0;
      this.request.SurgicalBeds = 0;
      this.request.ObstAndGynaecologyBeds = 0;
      this.request.PediatricsBeds = 0;
      this.request.OrthoBeds = 0;
      this.request.OccupancyPercentegeBeds = 0;
      this.request.AffiliationPsychiatricBeds = 0;
      this.request.ParentHospitalRelatedToOtherID = 0;
      this.request.InstitutionName = '';
      this.request.OrganizationPhone = '';

      this.request.CardioThoracicTotalBeds = 0;
      this.request.CardioThoracicCCUBeds = 0;
      this.request.CardioThoracicICCUBeds = 0;
      this.request.CardioThoracicICUBeds = 0;
      this.request.CriticalCareNursingTotalBeds = 0;
      this.request.CriticalCareNursingCCBeds = 0;
      this.request.CriticalCareNursingICUBeds = 0;
      this.request.MidwiferyNursingTotalBeds = 0;
      this.request.MotherNeonatalUnitsBeds = 0;
      this.request.DeliveriesPerYear = 0;
      this.request.LevelIINeonatalBeds = 0;
      this.request.LevelIIINeonatalBeds = 0;
      this.request.NeuroScienceNursingTotalBeds = 0;
      this.request.OncologyNursingTotalBeds = 0;
      this.request.OncologyNursingMedicalBeds = 0;
      this.request.OncologyNurSingsurgicalBeds = 0;
      this.request.OncologyNursingChemotherapyBeds = 0;
      this.request.OncologyNursingRadiotherapyBeds = 0;
      this.request.OncologyNursingPalliativeBeds = 0;
      this.request.OncologyNursingDiagnosticBeds = 0;
      this.request.OrthopaedicRehabilitationNursingTotalBeds = 0;
      this.request.OrthopaedicRehabilitationNursingOrthopaedicBeds = 0;
      this.request.OrthopaedicRehabilitationNursingRehabilitationBeds = 0;
      this.request.PsychiatricNursingTotalBeds = 0;
      this.request.PsychiatricNursingAcuteBeds = 0;
      this.request.PsychiatricNursingChronicBeds = 0;
      this.request.PsychiatricNursingAdultBeds = 0;
      this.request.PsychiatricNursingChildBeds = 0;
      this.request.PsychiatricNursingDeAddictionBeds = 0;
      this.request.NeonatalNursingTotalBeds = 0;
      this.request.NeonatalNursingLevelIIOrIIINICUBeds = 0;
      this.request.NeonatalNursingNICUBeds = 0;
      this.request.OperationRoomNursingTotalBeds = 0;
      this.request.OperationRoomNursingGeneralSurgeryBeds = 0;
      this.request.OperationRoomNursingPediatricBeds = 0;
      this.request.OperationRoomNursingCardiothoracicBeds = 0;
      this.request.OperationRoomNursingGynaeAndObstetricalBeds = 0;
      this.request.OperationRoomNursingOrthopaedicsBeds = 0;
      this.request.OperationRoomNursingOphthalmicBeds = 0;
      this.request.OperationRoomNursingENTAndNeuroBeds = 0;
      this.request.EmergencyAndDisasterNursingTotalBeds = 0;
      this.request.EmergencyAndDisasterNursingICUBeds = 0;
      this.request.EmergencyAndDisasterNursingEmergencylBeds = 0;

      this.request.AddressLine1 = '';
      this.request.AddressLine2 = '';
      this.request.RuralUrban = null;
      this.request.DivisionID = 0;
      this.request.DistrictID = 0;
      this.request.TehsilID = 0;
      this.request.PanchayatSamitiID = 0;
      this.request.CityTownVillage = '';
      this.request.Pincode = null;

      this.request.AddressLine1_ManageBy = '';
      this.request.AddressLine2_ManageBy = '';
      this.request.RuralUrban_ManageBy = null;
      this.request.DivisionID_ManageBy = 0;
      this.request.DistrictID_ManageBy = 0;
      this.request.TehsilID_ManageBy = 0;
      this.request.PanchayatSamitiID_ManageBy = 0;
      this.request.CityTownVillage_ManageBy = '';
      this.request.Pincode_ManageBy = null;

      this.request.AddressLine1_Owner = '';
      this.request.AddressLine2_Owner = '';
      this.request.RuralUrban_Owner = null;
      this.request.DivisionID_Owner = 0;
      this.request.DistrictID_Owner = 0;
      this.request.TehsilID_Owner = 0;
      this.request.PanchayatSamitiID_Owner = 0;
      this.request.CityTownVillage_Owner = '';
      this.request.Pincode_Owner = null;

      this.request.AddressLine1_Other = '';
      this.request.AddressLine2_Other = '';
      this.request.RuralUrban_Other = null;
      this.request.DivisionID_Other = 0;
      this.request.DistrictID_Other = 0;
      this.request.TehsilID_Other = 0;
      this.request.PanchayatSamitiID_Other = 0;
      this.request.CityTownVillage_Other = '';
      this.request.Pincode_Other = null;
      this.request.HospitalStatus = '';
      this.ResetFileAndValidation('All', '', '', '', '', false);
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async DeleteHospitalOfParent(row: any) {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (confirm("Are you sure you want to delete this ?")) {
        await this.hospitalDetailService.DeleteData(row.HospitalID, row.ModifyBy)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            // data
            const index: number = this.HospitalDataModelList.indexOf(row);
            if (index != -1) {
              this.HospitalDataModelList.splice(index, 1)
            }
            //console.log(this.request.RuralUrban);

            if (!this.State) {
              this.toastr.success(this.SuccessMessage)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
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

  async SaveDataOfParentNot() {
    this.isHospitalrequried = false;
    this.isFormValid = true;
    this.isSubmitted_ParentNot = true;
    if (this.HospitalParentNotForm.invalid) {
      console.log(this.HospitalParentNotForm);
      this.isFormValid = false;
    }
    if (!this.IsValid_ParentNot()) {
      this.isFormValid = false;
    }
    if (this.requestNot.PollutionCertificate == '') {
      this.isFormValid = false;
    }
    if (!this.isFormValid) { return }
    if (this.requestNot.HospitalID > 0) {
      this.requestNot.ModifyBy = 1;
    }
    else {
      this.requestNot.CreatedBy = 1;
      this.requestNot.ModifyBy = 1;
    }
    // parenthospitalid
    this.requestNot.ParentHospitalID = this.request.ParentHospitalID;
    this.requestNot.HospitalStatus = this.request.HospitalStatus;
    // save data
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.SaveData(this.requestNot)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //console.log(this.State);

          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // reset
            this.ResetHospitalOfParentNot();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
          // get data
          await this.GetDataList();
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }

    this.isSubmitted_ParentNot = false;

  }

  ResetHospitalOfParentNot() {
    try {
      this.loaderService.requestStarted();
      // reset
      this.IsHospitalOwned = false;
      this.request.HospitalStatus = '';
      this.requestNot.HospitalID = 0;
      this.requestNot.HospitalAreaID = 0;
      this.requestNot.HospitalRegNo = '';
      this.requestNot.HospitalName = '';
      this.requestNot.HospitalDistance = 0;
      this.requestNot.HospitalContactNo = null;
      this.requestNot.HospitalEmailID = '';
      this.requestNot.ManageByName = '';
      this.requestNot.ManageByPhone = null;
      this.requestNot.OwnerName = '';
      this.requestNot.OwnerPhone = null;
      this.requestNot.MedicalBeds = 0;
      this.requestNot.SurgicalBeds = 0;
      this.requestNot.ObstAndGynaecologyBeds = 0;
      this.requestNot.PediatricsBeds = 0;
      this.requestNot.OrthoBeds = 0;
      this.requestNot.OccupancyPercentegeBeds = 0;
      this.requestNot.AffiliationPsychiatricBeds = 0;
      this.requestNot.AffiliatedHospitalAffiliationToOtherID = null;
      this.requestNot.ParentNotDocument = '';
      this.requestNot.Dis_ParentNotDocument = '';
      this.requestNot.ParentNotDocumentPath = '';
      this.requestNot.ConsentForm = '';
      this.requestNot.Dis_ConsentForm = '';
      this.requestNot.ConsentFormPath = '';


      this.requestNot.AddressLine1 = '';
      this.requestNot.AddressLine2 = '';
      this.requestNot.RuralUrban = null;
      this.requestNot.DivisionID = 0;
      this.requestNot.DistrictID = 0;
      this.requestNot.TehsilID = 0;
      this.requestNot.PanchayatSamitiID = 0;
      this.requestNot.CityTownVillage = '';
      this.requestNot.Pincode = null;

      this.requestNot.AddressLine1_ManageBy = '';
      this.requestNot.AddressLine2_ManageBy = '';
      this.requestNot.RuralUrban_ManageBy = null;
      this.requestNot.DivisionID_ManageBy = 0;
      this.requestNot.DistrictID_ManageBy = 0;
      this.requestNot.TehsilID_ManageBy = 0;
      this.requestNot.PanchayatSamitiID_ManageBy = 0;
      this.requestNot.CityTownVillage_ManageBy = '';
      this.requestNot.Pincode_ManageBy = null;

      this.requestNot.AddressLine1_Owner = '';
      this.requestNot.AddressLine2_Owner = '';
      this.requestNot.RuralUrban_Owner = null;
      this.requestNot.DivisionID_Owner = 0;
      this.requestNot.DistrictID_Owner = 0;
      this.requestNot.TehsilID_Owner = 0;
      this.requestNot.PanchayatSamitiID_Owner = 0;
      this.requestNot.CityTownVillage_Owner = '';
      this.requestNot.Pincode_Owner = null;

      const txtHospitalName = document.getElementById('txtHospitalRegNo')
      if (txtHospitalName) txtHospitalName.focus();
      this.ResetFileAndValidation('All', '', '', '', '', false);
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async DeleteHospitalOfParentNot(row: any) {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (confirm("Are you sure you want to delete this ?")) {
        await this.hospitalDetailService.DeleteData(row.HospitalID, row.ModifyBy)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            // data
            const index: number = this.HospitalParentNotDataModelList.indexOf(row);
            if (index != -1) {
              this.HospitalParentNotDataModelList.splice(index, 1)
            }
            //console.log(this.request.RuralUrban);

            if (!this.State) {
              this.toastr.success(this.SuccessMessage)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
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

  IsValid() {
    this.isValid = true;

    if (this.request.HospitalAreaID == null || this.request.HospitalAreaID == undefined || this.request.HospitalAreaID == 0) {
      this.isValid = false;
    }
    if (!(this.request.HospitalDistance >= this.MinDistance && this.request.HospitalDistance <= this.MaxDistance)) {
      this.isValid = false;
    }
    if (this.IsShowSuperSpecialtyHospital) {
      if (!this.IsValidCriticalCareNursing(this.request.CriticalCareNursingCCBeds, this.request.CriticalCareNursingICUBeds)) {
        this.isValid = false;
      }
    }
    if (this.request.HospitalStatus == null || this.request.HospitalStatus == '') {
      this.isValid = false;
      this.isHospitalrequried = true;
    }
    return this.isValid;
  }

  IsValidCriticalCareNursing(criticalCareNursingCCBeds: number, criticalCareNursingICUBeds: number) {
    if (criticalCareNursingCCBeds + criticalCareNursingICUBeds < 8) {
      return false;
    }
    return true;
  }

  IsValid_ParentNot() {
    this.isValid_ParentNot = true;

    if (this.requestNot.HospitalAreaID == undefined || this.requestNot.HospitalAreaID == null || this.requestNot.HospitalAreaID == 0) {
      this.isValid_ParentNot = false;
    }
    if (!(this.requestNot.HospitalDistance >= this.MinDistance_ParentNot && this.requestNot.HospitalDistance <= this.MaxDistance_ParentNot)) {
      this.isValid_ParentNot = false;
    }
    if (this.request.HospitalStatus == null || this.request.HospitalStatus == '') {
      this.isValid_ParentNot = false;
      this.isHospitalrequried = true;
    }

    return this.isValid_ParentNot;
  }

  async GetDataList() {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.hospitalDetailService.GetDataList(this.QueryStringCollegeID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            //this.toastr.success(this.SuccessMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
          // data
          if (data['Data'].length > 0) {

            let modelDataList = JSON.parse(JSON.stringify(data['Data']));

            this.HospitalDataModelList = modelDataList.filter((element: any) => element.ParentHospitalID == 1);
            this.HospitalParentNotDataModelList = modelDataList.filter((element: any) => element.ParentHospitalID == 2);
          }
          //console.log(this.request.RuralUrban);
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

  async GetData(hospitalId: number) {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.hospitalDetailService.GetData(hospitalId)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            //this.toastr.success(this.SuccessMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }

          // data
          if (data['Data']['ParentHospitalID'] == 1) {
            this.request = JSON.parse(JSON.stringify(data['Data']));
            // hospital area validation
            let selectedHospitalAreaValidation = this.HospitalAreaValidationList.filter((element: any) => element.ID == this.request.HospitalAreaID);
            if (selectedHospitalAreaValidation.length > 0) {
              await this.SetHospitalDistance(selectedHospitalAreaValidation[0].MinValue, selectedHospitalAreaValidation[0].MaxValue, null);
            }
            // parent hospital
            this.IsParentHospitalOrNot(true);

            if (this.request.HospitalStatus == 'Own') {
              this.IsHospitalOwned = true;
            }
            else {
              this.IsHospitalOwned = false;
            }
            // rural/urban          
            await this.IsRuralOrUrban(this.request.RuralUrban == 1 ? true : false, null, false);
            await this.IsRuralOrUrban(this.request.RuralUrban_ManageBy == 1 ? true : false, 'ManageBy', false);
            await this.IsRuralOrUrban(this.request.RuralUrban_Owner == 1 ? true : false, 'Owner', false);
            await this.IsRuralOrUrban(this.request.RuralUrban_Other == 1 ? true : false, 'Other', false);
            // division dll
            await this.FillDivisionRelatedDDL(null, this.request.DivisionID.toString(), null);
            await this.FillDivisionRelatedDDL(null, this.request.DivisionID_ManageBy.toString(), 'ManageBy');
            await this.FillDivisionRelatedDDL(null, this.request.DivisionID_Owner.toString(), 'Owner');
            await this.FillDivisionRelatedDDL(null, this.request.DivisionID_Other.toString(), 'Other');
            // district status
            await this.FillDistrictRelatedDDL(null, this.request.DistrictID.toString(), null);
            await this.FillDistrictRelatedDDL(null, this.request.DistrictID_ManageBy.toString(), 'ManageBy');
            await this.FillDistrictRelatedDDL(null, this.request.DistrictID_Owner.toString(), 'Owner');
            await this.FillDistrictRelatedDDL(null, this.request.DistrictID_Other.toString(), 'Other');
            // Whether the parent hospital is related to any other institution in the past or not
            this.IsParentHospitalRelatedToOther = this.request.ParentHospitalRelatedToOtherID == 1 ? true : false;
          }
          else if (data['Data']['ParentHospitalID'] == 2) {
            this.requestNot = JSON.parse(JSON.stringify(data['Data']));
            // hospital area validation
            let selectedHospitalAreaValidation = this.HospitalAreaValidationList.filter((element: any) => element.ID == this.requestNot.HospitalAreaID);
            if (selectedHospitalAreaValidation.length > 0) {
              await this.SetHospitalDistance(selectedHospitalAreaValidation[0].MinValue, selectedHospitalAreaValidation[0].MaxValue, 'ParentNot');
            }
            // parent hospital or not
            this.IsParentHospitalOrNot(false);

            this.request.HospitalStatus = this.requestNot.HospitalStatus;
            if (this.requestNot.HospitalStatus == 'Own') {
              this.IsHospitalOwned = true;
            }
            else {
              this.IsHospitalOwned = false;
            }
            // rural/urban
            await this.IsRuralOrUrban_ParentNot(this.requestNot.RuralUrban == 1 ? true : false, null, false);
            await this.IsRuralOrUrban_ParentNot(this.requestNot.RuralUrban_ManageBy == 1 ? true : false, 'ManageBy', false);
            await this.IsRuralOrUrban_ParentNot(this.requestNot.RuralUrban_Owner == 1 ? true : false, 'Owner', false);
            // division dll
            await this.FillDivisionRelatedDDL_ParentNot(null, this.requestNot.DivisionID.toString(), null);
            await this.FillDivisionRelatedDDL_ParentNot(null, this.requestNot.DivisionID_ManageBy.toString(), 'ManageBy');
            await this.FillDivisionRelatedDDL_ParentNot(null, this.requestNot.DivisionID_Owner.toString(), 'Owner');
            // district status
            await this.FillDistrictRelatedDDL_ParentNot(null, this.requestNot.DistrictID.toString(), null);
            await this.FillDistrictRelatedDDL_ParentNot(null, this.requestNot.DistrictID_ManageBy.toString(), 'ManageBy');
            await this.FillDistrictRelatedDDL_ParentNot(null, this.requestNot.DistrictID_Owner.toString(), 'Owner');
            // Whether the affiliated hospital has affiliation with any other institution in the past or not
            this.IsAffiliatedHospitalAffiliationToOtherOrNot(this.requestNot.AffiliatedHospitalAffiliationToOtherID == 1 ? true : false);
            // document
            if (this.requestNot.ParentNotDocument != '' || this.requestNot.Dis_ParentNotDocument != '' || this.requestNot.ParentNotDocumentPath != '') {
              await this.ResetFileAndValidation('ParentNotDocument', '', this.requestNot.ParentNotDocument, this.requestNot.Dis_ParentNotDocument, this.requestNot.ParentNotDocumentPath, true);
            }
            // consent form
            if (this.requestNot.ConsentForm != '' || this.requestNot.Dis_ConsentForm != '' || this.requestNot.ConsentFormPath != '') {
              await this.ResetFileAndValidation('ConsentForm', '', this.requestNot.ConsentForm, this.requestNot.Dis_ConsentForm, this.requestNot.ConsentFormPath, true);
            }
          }
          //console.log(this.request.RuralUrban);
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

  async onFilechange(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        // (Type != 'ConsentForm' && (this.file.type === 'image/jpeg' || this.file.type === 'image/jpg')) ||
        if (this.file.type === 'application/pdf') {
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
          //'Select Only ' + (Type == 'ConsentForm' ? 'pdf file' : 'jpg/jpeg')
          this.ResetFileAndValidation(Type, 'Select Only pdf', '', '', '', false);
          return
        }
        // upload to server folder
        this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, '', data['Data'][0]["FileName"], data['Data'][0]["Dis_FileName"], data['Data'][0]["FilePath"], true);
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
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async DeleteImage(Type: string) {
    let path: string = '';
    try {
      this.loaderService.requestStarted();
      if (Type == 'ParentNotDocument') {
        path = this.requestNot.ParentNotDocument;
      }
      else if (Type == 'ConsentForm') {
        path = this.requestNot.ConsentForm;
      }
      else if (Type == 'PollutionCertificate') {
        path = this.request.PollutionCertificate;
      }
      else if (Type == 'NotPollutionCertificate') {
        path = this.requestNot.PollutionCertificate;
      }
      // delete from server folder
      this.fileUploadService.DeleteDocument(path).then((data: any) => {
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
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  ResetFileAndValidation(type: string, msg: string, name: string, dis_name: string, path: string, isShowFile: boolean) {
    //event.target.value = '';
    try {
      this.loaderService.requestStarted();
      if (type == 'ParentNotDocument' || type == 'All') {
        this.showParentNotDocument = isShowFile;
        this.ParentNotDocumentValidationMessage = msg;
        this.requestNot.ParentNotDocument = name;
        this.requestNot.Dis_ParentNotDocument = dis_name;
        this.requestNot.ParentNotDocumentPath = path;
        this.file = document.getElementById('fParentNotDocument');
        this.file.value = '';
      }
      if (type == 'ConsentForm' || type == 'All') {
        this.showParentNotConsentForm = isShowFile;
        this.ParentNotConsentFormValidationMessage = msg;
        this.requestNot.ConsentForm = name;
        this.requestNot.Dis_ConsentForm = dis_name;
        this.requestNot.ConsentFormPath = path;
        this.file = document.getElementById('fConsentForm');
        this.file.value = '';
      }
      if (type == 'PollutionCertificate' || type == 'All') {
        this.PollutionCertificateValidationMessage = msg;
        this.request.PollutionCertificate = name;
        this.request.Dis_PollutionCertificate = dis_name;
        this.request.PollutionCertificatePath = path;
        this.file = document.getElementById('fPollutionCertificate');
        this.file.value = '';
      }
      if (type == 'NotPollutionCertificate' || type == 'All') {
        this.NotPollutionCertificateValidationMessage = msg;
        this.requestNot.PollutionCertificate = name;
        this.requestNot.Dis_PollutionCertificate = dis_name;
        this.requestNot.PollutionCertificatePath = path;
        this.file = document.getElementById('fPollutionCertificate');
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

  CustomValidate() {
    let isValid = true;
    if (this.requestNot.ParentNotDocument == null || this.requestNot.ParentNotDocument == undefined || this.requestNot.ParentNotDocument == '') {
      isValid = false;
      this.ParentNotDocumentValidationMessage = 'This field is required .!';
    }
    if (this.ParentNotDocumentValidationMessage != '') {
      isValid = false;
    }

    return isValid;
  }

  async EditHospital(hospitalId: number) {
    try {
      this.loaderService.requestStarted();
      await this.GetData(hospitalId);
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

  async ViewHospitalDetail(content: any, HospitalID: number) {
    this.HospitalData = {};
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.GetData(HospitalID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HospitalData = data['Data'];
          console.log('Deepak');
          console.log(this.HospitalData);
          console.log('Deepak');
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  async GetLegalEntityData() {
    try {
      await this.TrusteeGeneralInfoService.GetDataOfLegalEntity(this.sSOLoginDataModel.SSOID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          debugger;
          if (this.State == 0) {
            this.LegalEntityDataModel = JSON.parse(JSON.stringify(data['Data']));
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.SuccessMessage)
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

  IsHospitalOwnedOrParental() {
    this.IsHospitalOwned = false;
    if (this.request.HospitalStatus == 'Own') {
      this.IsHospitalOwned = true;
    }
    else {
      this.IsHospitalOwned = false;
    }
  }
}
