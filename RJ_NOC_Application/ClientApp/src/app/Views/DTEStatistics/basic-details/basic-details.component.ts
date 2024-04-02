import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { PreviewDTEStatisticsComponent } from '../preview-dtestatistics/preview-dtestatistics.component';
import { BasicDetailsDataModel, BasicDetails_AffiliationDetailsDataModel, BasicDetails_InstituteHeadDetailsDataModel, BasicDetails_NodalOfficerDetailsDataModel, BasicDetails_SpecialisationDetailsDataModel } from '../../../Models/DTEStatistics/BasicDetailsDataModel';
import { BasicDetailsService } from '../../../Services/DTEStatistics/BasicDetails/basic-details.service';
import { Console } from 'console';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent {
  BasicDetailsFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isDisabled: boolean = true;
  request = new BasicDetailsDataModel();
  request_SpecialisationDetails = new BasicDetails_SpecialisationDetailsDataModel();

  public CurrentIndex: number = -1;
  public isSubmitted: boolean = false;
  public PreviewStatus: string = 'N';
  public SearchRecordID: string = '';
  public DesignationList: any = [];
  constructor(private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private previewDTEStatisticsComponent: PreviewDTEStatisticsComponent, private statisticsEntryComponent: StatisticsEntryComponent, private basicsetailsService: BasicDetailsService) {
  }
  async ngOnInit() {

    this.BasicDetailsFormGroup = this.formBuilder.group(
      {
        txtAisheCode: [''],
        txtNameofinstitution: [{ value: '', disabled: true }],
        txtYearofEstablishment: [''],
        txtStatusPriorToEstablishment: [''],
        txtYearDeclaredUniversityInstitute: [''],
        txtTypeOfInstitution: [''],
        txtOwnershipStatusOfInstitution: [''],
        ddlInstitutionfromonegender: [''],
        ddlInstituteUnnatBharatScheme: [''],
        ddlMinorityManagedInstitution: [''],
        ddlIsInstitutionNCC: [''],
        txtEnrolledStudentInNCC: [''],
        txtEnrolledFemaleStudentInNCC: [''],
        txtEnrolledTotalStudentInNCC: [{ value: '', disabled: true }],

        ddlIsInstitutionNSS: [''],
        txtEnrolledStudentInNSS: [''],
        txtEnrolledFemaleStudentInNSS: [''],
        txtEnrolledTotalStudentInNSS: [{ value: '', disabled: true }],
        ddlIsspecializedUniversity: [''],
        txtAffiliatedInstitutions: [''],

        txtSpecialisation: [''],
        txtNoOfCollegesPermanentAffiliation: [''],
        txtNoOfCollegesTemporaryAffiliation: [''],


        ddlManagementOfTheInstitution: [''],
        ddlIsEveningCollege: [''],
        ddlAutonomousInstitute: [''],
        txtMinorityCommunityType: [''],
        txtEnrolledStudentInNCCOtherInstitute: [''],
        txtEnrolledFemaleStudentInNCCOtherInstitute: [''],
        txtSpecialisedUniversity: [''],
        txtOtherSpecialisedUniversity: [''],
        ddlWhetherTheCollegeRunningDiplomaLevelCourse: [''],
        txtDiplomaLevelCourse: [''],
        txtOtherDiplomaCourse: [''],
        ddlWhetherAwardsDegreethroughAnyUniversity: [''],
        txtOtherUniversityName: [''],


        txtInstituteHeadNameOfUniversityNodalOfficerForAISHE: [''],
        ddlInstituteHeadDesignation: [''],
        txtInstituteHeadEmail: [''],
        txtInstituteHeadMobileNo: [''],
        txtInstituteHeadTelephoneNo: [''],

        txtNodalOfficerNameOfUniversityNodalOfficerForAISHE: [''],
        ddlNodalOfficerDesignation: [''],
        txtNodalOfficerEmail: [''],
        txtNodalOfficerMobileNo: [''],
        txtNodalOfficerTelephoneNo: [''],

        txtAffiliationNameStatutorybody: [''],
        txtAffiliationYear: [''],
        txtAffiliatedOtherUniversity: [''],
      });
    this.request.SpecialisationDetails = [];
    this.PreviewStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('PreviewStatus')?.toString());
    if (this.PreviewStatus != 'Y') {
      this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
      this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;
      this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;
      this.request.Nameofinstitution = this.statisticsEntryComponent.CollegeName;
    }
    else {
      this.BasicDetailsFormGroup.disable();
      this.SelectedDepartmentID = this.previewDTEStatisticsComponent.SelectedDepartmentID;
      this.SelectedCollageID = await this.previewDTEStatisticsComponent.GetCollegeID_SearchRecordID();
      var dt = await this.previewDTEStatisticsComponent.GetCollegeDetails_After();
      //this.request.AisheCode = dt.AISHECode;
      //this.request.YearofEstablishment = dt.YearofEstablishmentName;
      this.request.Nameofinstitution = dt.CollegeNameEn;
    }
    this.request.CollegeID = this.SelectedCollageID;
    this.request.Department = this.SelectedDepartmentID;
    await this.GetAllDesignation();
    await this.GetByID();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.isDisabled = true;

  }
  get form() { return this.BasicDetailsFormGroup.controls; }

  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.basicsetailsService.GetByID(this.request.CollegeID, 0)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;
          //if (this.PreviewStatus == 'Y') {
          //  this.request.SelectedCollegeEntryTypeName = data['Data'].CollegeEntryType;
          //}
          if (this.request.EntryID > 0) {
            this.request.AisheCode = data['Data'].AisheCode;
            this.request.YearofEstablishment = data['Data'].YearofEstablishment;
          }
          else {
            this.request.AisheCode = this.statisticsEntryComponent.AISHECode;
            this.request.YearofEstablishment = this.statisticsEntryComponent.YearofEstablishment;
          }
          this.request.StatusPriorToEstablishment = data['Data'].StatusPriorToEstablishment;
          this.request.YearDeclaredUniversityInstitute = data['Data'].YearDeclaredUniversityInstitute;
          this.request.TypeOfInstitution = data['Data'].TypeOfInstitution;
          this.request.OwnershipStatusOfInstitution = data['Data'].OwnershipStatusOfInstitution;
          this.request.Institutionfromonegender = data['Data'].Institutionfromonegender;
          this.request.InstituteUnnatBharatScheme = data['Data'].InstituteUnnatBharatScheme;
          this.request.MinorityManagedInstitution = data['Data'].MinorityManagedInstitution;
          this.request.IsInstitutionNCC = data['Data'].IsInstitutionNCC;
          this.request.EnrolledStudentInNCC = data['Data'].EnrolledStudentInNCC;
          this.request.EnrolledFemaleStudentInNCC = data['Data'].EnrolledFemaleStudentInNCC;
          this.request.EnrolledTotalStudentInNCC = data['Data'].EnrolledTotalStudentInNCC;
          this.request.IsInstitutionNSS = data['Data'].IsInstitutionNSS;
          this.request.EnrolledStudentInNSS = data['Data'].EnrolledStudentInNSS;
          this.request.EnrolledFemaleStudentInNSS = data['Data'].EnrolledFemaleStudentInNSS;
          this.request.EnrolledTotalStudentInNSS = data['Data'].EnrolledTotalStudentInNSS;
          this.request.IsspecializedUniversity = data['Data'].IsspecializedUniversity;
          this.request.AffiliatedInstitutions = data['Data'].AffiliatedInstitutions;
          this.request.SpecialisationDetails = data['Data'].SpecialisationDetails;
          this.request.CollegeUnderUniversityDetails = data['Data'].CollegeUnderUniversityDetails;

          this.request.ManagementOfTheInstitution = data['Data'].ManagementOfTheInstitution;
          this.request.IsEveningCollege = data['Data'].IsEveningCollege;
          this.request.AutonomousInstitute = data['Data'].AutonomousInstitute;
          this.request.MinorityCommunityType = data['Data'].MinorityCommunityType;
          this.request.EnrolledStudentInNCCOtherInstitute = data['Data'].EnrolledStudentInNCCOtherInstitute;
          this.request.EnrolledFemaleStudentInNCCOtherInstitute = data['Data'].EnrolledFemaleStudentInNCCOtherInstitute;
          this.request.SpecialisedUniversity = data['Data'].SpecialisedUniversity;
          this.request.OtherSpecialisedUniversity = data['Data'].OtherSpecialisedUniversity;
          this.request.WhetherTheCollegeRunningDiplomaLevelCourse = data['Data'].WhetherTheCollegeRunningDiplomaLevelCourse;
          this.request.DiplomaLevelCourse = data['Data'].DiplomaLevelCourse;
          this.request.OtherDiplomaCourse = data['Data'].OtherDiplomaCourse;
          this.request.WhetherAwardsDegreethroughAnyUniversity = data['Data'].WhetherAwardsDegreethroughAnyUniversity;
          this.request.OtherUniversityName = data['Data'].OtherUniversityName;
          
          this.request.InstituteHeadDetails = data['Data'].InstituteHeadDetails != null ? data['Data'].InstituteHeadDetails : new BasicDetails_InstituteHeadDetailsDataModel();
          this.request.NodalOfficerDetails = data['Data'].NodalOfficerDetails != null ? data['Data'].NodalOfficerDetails : new BasicDetails_NodalOfficerDetailsDataModel();
          this.request.AffiliationDetails = data['Data'].AffiliationDetails != null ? data['Data'].AffiliationDetails : new BasicDetails_AffiliationDetailsDataModel();
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
    this.isSubmitted = true;
    if (this.BasicDetailsFormGroup.invalid) {
      return
    }
    await this.ModifyRequest();
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.basicsetailsService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            await this.GetByID();
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

  async TotalStudentsEnrolledInNCC() {
    this.request.EnrolledTotalStudentInNCC = Number(this.request.EnrolledStudentInNCC) + Number(this.request.EnrolledFemaleStudentInNCC);
  }
  async TotalStudentsEnrolledInNSS() {
    this.request.EnrolledTotalStudentInNSS = Number(this.request.EnrolledStudentInNSS) + Number(this.request.EnrolledFemaleStudentInNSS);
  }
  async btnAdd_Click() {
    try {
      if (this.request_SpecialisationDetails.Specialisation == '') {
        this.toastr.error("Specialisation field is required .!");
        return;
      }
      if (this.request_SpecialisationDetails.NoOfCollegesPermanentAffiliation == null || this.request_SpecialisationDetails.NoOfCollegesPermanentAffiliation.toString() == '' || this.request_SpecialisationDetails.NoOfCollegesPermanentAffiliation == 0) {
        this.toastr.error("No Of Colleges Permanent Affiliation field is required .!");
        return;
      }
      if (this.request_SpecialisationDetails.NoOfCollegesTemporaryAffiliation == null || this.request_SpecialisationDetails.NoOfCollegesTemporaryAffiliation.toString() == '' || this.request_SpecialisationDetails.NoOfCollegesTemporaryAffiliation == 0) {
        this.toastr.error("No Of Colleges Temporary Affiliation field is required .!");
        return;
      }

      this.loaderService.requestStarted();

      if (this.CurrentIndex != -1) {
        this.request.SpecialisationDetails.splice(this.CurrentIndex, 1);;
      }

      this.request.SpecialisationDetails.push({
        EntryID: 0,
        AID: 0,
        Specialisation: this.request_SpecialisationDetails.Specialisation,
        NoOfCollegesPermanentAffiliation: this.request_SpecialisationDetails.NoOfCollegesPermanentAffiliation,
        NoOfCollegesTemporaryAffiliation: this.request_SpecialisationDetails.NoOfCollegesTemporaryAffiliation,
        Total: Number(this.request_SpecialisationDetails.NoOfCollegesPermanentAffiliation) + Number(this.request_SpecialisationDetails.NoOfCollegesTemporaryAffiliation)
      });
      this.request_SpecialisationDetails.EntryID = 0;
      this.request_SpecialisationDetails.AID = 0;
      this.request_SpecialisationDetails.Specialisation = '';
      this.request_SpecialisationDetails.NoOfCollegesPermanentAffiliation = 0;
      this.request_SpecialisationDetails.NoOfCollegesTemporaryAffiliation = 0;
      this.request_SpecialisationDetails.Total = 0;
      this.CurrentIndex = -1;
      const btnAdd = document.getElementById('btnAdd')
      if (btnAdd) { btnAdd.innerHTML = "Add"; }
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
  async btnEdit_Click(Item: any, idx: number) {
    this.CurrentIndex = idx;
    this.request_SpecialisationDetails.EntryID = Item.EntryID;
    this.request_SpecialisationDetails.AID = Item.AID;
    this.request_SpecialisationDetails.Specialisation = Item.Specialisation;
    this.request_SpecialisationDetails.NoOfCollegesPermanentAffiliation = Item.NoOfCollegesPermanentAffiliation;
    this.request_SpecialisationDetails.NoOfCollegesTemporaryAffiliation = Item.NoOfCollegesTemporaryAffiliation;
    const btnAdd = document.getElementById('btnAdd')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }
  async btnDelete_Click(i: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.SpecialisationDetails.splice(i, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async ModifyRequest() {
    if (this.request.EnrolledStudentInNCC == null || this.request.EnrolledStudentInNCC == undefined || this.request.EnrolledStudentInNCC.toString() == '') {
      this.request.EnrolledStudentInNCC = 0
    }
    if (this.request.EnrolledFemaleStudentInNCC == null || this.request.EnrolledFemaleStudentInNCC == undefined || this.request.EnrolledFemaleStudentInNCC.toString() == '') {
      this.request.EnrolledFemaleStudentInNCC = 0
    }
    if (this.request.EnrolledTotalStudentInNCC == null || this.request.EnrolledTotalStudentInNCC == undefined || this.request.EnrolledTotalStudentInNCC.toString() == '') {
      this.request.EnrolledTotalStudentInNCC = 0
    }

    if (this.request.EnrolledStudentInNSS == null || this.request.EnrolledStudentInNSS == undefined || this.request.EnrolledStudentInNSS.toString() == '') {
      this.request.EnrolledStudentInNSS = 0;
    }
    if (this.request.EnrolledFemaleStudentInNSS == null || this.request.EnrolledFemaleStudentInNSS == undefined || this.request.EnrolledFemaleStudentInNSS.toString() == '') {
      this.request.EnrolledFemaleStudentInNSS = 0;
    }
    if (this.request.EnrolledTotalStudentInNSS == null || this.request.EnrolledTotalStudentInNSS == undefined || this.request.EnrolledTotalStudentInNSS.toString() == '') {
      this.request.EnrolledTotalStudentInNSS = 0;
    }
    for (var i = 0; i < this.request.CollegeUnderUniversityDetails.length; i++) {
      if (this.request.CollegeUnderUniversityDetails[i].NoOfColleges == null || this.request.CollegeUnderUniversityDetails[i].NoOfColleges == undefined || this.request.CollegeUnderUniversityDetails[i].NoOfColleges.toString() == '') {
        this.request.CollegeUnderUniversityDetails[i].NoOfColleges = 0;
      }
    }


    if (this.request.EnrolledStudentInNCCOtherInstitute == null || this.request.EnrolledStudentInNCCOtherInstitute == undefined || this.request.EnrolledStudentInNCCOtherInstitute.toString() == '') {
      this.request.EnrolledStudentInNCCOtherInstitute = 0;
    }
    if (this.request.EnrolledFemaleStudentInNCCOtherInstitute == null || this.request.EnrolledFemaleStudentInNCCOtherInstitute == undefined || this.request.EnrolledFemaleStudentInNCCOtherInstitute.toString() == '') {
      this.request.EnrolledFemaleStudentInNCCOtherInstitute = 0;
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
}
