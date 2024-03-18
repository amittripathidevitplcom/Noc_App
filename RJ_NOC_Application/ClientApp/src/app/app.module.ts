import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MasterPageComponent } from './Views/Shared/master-page/master-page.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
 import { MatTabsModule } from '@angular/material/tabs'; 
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import { APP_BASE_HREF } from '@angular/common'; 
/*import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';*/
//import { MatIconModule } from '@angular/material/icon';
//import { MatButtonModule } from '@angular/material/button';
//import { MatInputModule } from '@angular/material/input';
//import { MatFormFieldModule } from '@angular/material/form-field';
//import { MatStepperModule } from '@angular/material/stepper';
/*import { NgShortcutModule, NgShortcutConfig } from 'ng-shortcut';*/
import { AutocompleteLibModule } from 'angular-ng-autocomplete'; 


import { ApplicationListComponent } from './Views/application-list/application-list.component';
import { CollegeDetailsComponent } from './Views/college-details/college-details.component';
import { BasicBscNursingComponent } from './Views/CollegeDetailsForm/basic-bsc-nursing/basic-bsc-nursing.component';
import { GNMSchOfNursingComponent } from './Views/CollegeDetailsForm/gnmsch-of-nursing/gnmsch-of-nursing.component';
import { DashboardComponent } from './Views/dashboard/dashboard.component';
import { GNMSchoolOfNursingComponent } from './Views/GuidsAndMinRequired/gnmschool-of-nursing/gnmschool-of-nursing.component';
import { MScNursingProgrammeComponent } from './Views/GuidsAndMinRequired/msc-nursing-programme/msc-nursing-programme.component';
import { OpenBScNCollegeOfNursingComponent } from './Views/GuidsAndMinRequired/open-bsc-ncollege-of-nursing/open-bsc-ncollege-of-nursing.component';
import { PostBasicBScNCollegeOfNursingComponent } from './Views/GuidsAndMinRequired/post-basic-bsc-ncollege-of-nursing/post-basic-bsc-ncollege-of-nursing.component';
import { LegalEntityComponent } from './Views/legal-entity/legal-entity.component';
import { ProjectMasterComponent } from './Views/Master/project-master/project-master.component';

import { CreateRoleMappingComponent } from './Views/Master/RoleMaster/create-role-mapping/create-role-mapping.component';
import { RoleMappingMasterComponent } from './Views/Master/RoleMaster/role-mapping-master/role-mapping-master.component';
import { UserListComponent } from './Views/Master/UserMaster/user-list/user-list.component';
import { ApplicationswithNodalOfficerComponent } from './Views/NoOfficer/applicationswith-nodal-officer/applicationswith-nodal-officer.component';
import { ApplicationwithAdditionalDirectorComponent } from './Views/NoOfficer/applicationwith-additional-director/applicationwith-additional-director.component';
import { ApplicationwithJointDirectorComponent } from './Views/NoOfficer/applicationwith-joint-director/applicationwith-joint-director.component';
import { DeficiencyMarkedComponent } from './Views/NoOfficer/deficiency-marked/deficiency-marked.component';
import { DocumentInspectionInProcessComponent } from './Views/NoOfficer/document-inspection-in-process/document-inspection-in-process.component';
import { NOCIssuedComponent } from './Views/NoOfficer/nocissued/nocissued.component';
import { PartialFiledApplicationComponent } from './Views/NoOfficer/partial-filed-application/partial-filed-application.component';
import { PhysicalInspectionInProcessComponent } from './Views/NoOfficer/physical-inspection-in-process/physical-inspection-in-process.component';
import { SubmittedApplicationComponent } from './Views/NoOfficer/submitted-application/submitted-application.component';
import { TotalCollegeComponent } from './Views/NoOfficer/total-college/total-college.component';
import { TotalDraftApplicationComponent } from './Views/NoOfficer/total-draft-application/total-draft-application.component';
import { TotalTrustComponent } from './Views/NoOfficer/total-trust/total-trust.component';
import { TableSearchFilterPipe } from './Pipes/table-search-filter.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { LoderComponent } from './Views/Shared/loader/loader.component';
import { SSOLoginComponent } from './Views/SSOLogin/ssologin/ssologin.component';
import { LoginComponent } from './Views/login/login.component';

import { PageNotFoundComponent } from './Views/Shared/page-not-found/page-not-found.component';
import { AddCoursesComponent } from './Views/CollegeDetailsForm/add-courses/add-courses.component';
import { AddCollegeComponent } from './Views/CollegeDetailsForm/add-college/add-college.component';
import { BScNCollegeOfNursingComponent } from './Views/CollegeDetailsForm/bsc-ncollege-of-nursing/bsc-ncollege-of-nursing.component';

import { WorkFlowMasterComponent } from './Views/Admin/work-flow-master/add-work-flow-master/work-flow-master.component';
import { WorkFlowMasterListComponent } from './Views/Admin/work-flow-master/work-flow-master-list/work-flow-master-list.component';
import { ApplicationDetailEntryComponent } from './Views/ApplicationDetailEntry/application-detail-entry/application-detail-entry.component';
/*import { MedicalGroupSubDetailsComponent } from './Views/medical-group-sub-details/medical-group-sub-details.component';*/

import { FacilityDetailsComponent } from './Views/TabDetail/facility-details/facility-details.component';
import { LandDetailsComponent } from './Views/TabDetail/land-details/land-details.component';
import { RequiredDocumentComponent } from './Views/TabDetail/required-document/required-document.component';

import { BuildingDetailsComponent } from './Views/TabDetail/building-details/building-details.component';
import { DraftApplicationListComponent } from './Views/DraftApplicationList/draft-application-list/draft-application-list.component';
import { RoomDetailsComponent } from './Views/TabDetail/room-details/room-details.component';
import { OtherDocumentComponent } from './Views/TabDetail/other-document/other-document.component';
import { OtherInformationComponent } from './Views/TabDetail/other-information/other-information.component';

import { StaffDetailsComponent } from './Views/TabDetail/staff-details/staff-details.component';
import { HostelDetailsComponent } from './Views/TabDetail/hostel-details/hostel-details.component';
import { OldNOCDetailsComponent } from './Views/TabDetail/old-nocdetails/old-nocdetails.component';
import { AcademicInformationComponent } from './Views/TabDetail/academic-information/academic-information.component';
import { ApplyNOCComponent } from './Views/apply-noc/apply-noc.component';
import { TrusteeGeneralInfoComponent } from './Views/trustee-general-info/trustee-general-info.component';

import { ParliamentAreaMasterComponent } from './Views/Master/ParliamentAreaMaster/parliament-area-master.component';
import { AssemblyAreaMasterComponent } from './Views/Master/AssemblyAreaMaster/assembly-area-master.component';
import { CommonMasterComponent } from './Views/Master/CommonMaster/common-master.component';
import { SocietyComponent } from './Views/Master/SocietyManagement/society/society.component';
import { UniversityComponent } from './Views/Master/UniversityMaster/university/university.component';
import { LandAreaSituatedComponent } from './Views/Master/LandAreaSituatedMaster/land-area-situated/land-area-situated.component';
import { FacilitiesComponent } from './Views/Master/FacilitiesMaster/facilities-master.component';
import { QualificationMasterComponent } from './Views/Master/QualificationMaster/qualification-master.component';
import { SubjectMasterComponent } from './Views/Master/SubjectMaster/subject-master.component';
import { DocumentMasterComponent } from './Views/Master/document-master/document-master.component';
import { AddRoleMasterComponent } from './Views/Master/add-role-master/add-role-master.component';
import { HospitalDetailComponent } from './Views/TabDetail/hospital-detail/hospital-detail.component';
import { TotalLegalEntityPreviewComponent } from './Views/NoOfficer/total-legal-entity-preview/total-legal-entity-preview.component';

import { PreviewLandDetailComponent } from './Views/PreviewTabs/preview-land-detail/preview-land-detail.component';
import { PreviewFacilityDetailComponent } from './Views/PreviewTabs/preview-facility-detail/preview-facility-detail.component';
import { PreviewRequiredDocumentComponent } from './Views/PreviewTabs/preview-required-document/preview-required-document.component';
import { PreviewRoomDetailComponent } from './Views/PreviewTabs/preview-room-detail/preview-room-detail.component';
import { PreviewOtherInformationComponent } from './Views/PreviewTabs/preview-other-information/preview-other-information.component';
import { PreviewBuildingDetailComponent } from './Views/PreviewTabs/preview-building-detail/preview-building-detail.component';
import { PreviewStaffDetailComponent } from './Views/PreviewTabs/preview-staff-detail/preview-staff-detail.component';
import { PreviewOldNOCDetailComponent } from './Views/PreviewTabs/preview-old-nocdetail/preview-old-nocdetail.component';
import { PreviewAcademicInformationComponent } from './Views/PreviewTabs/preview-academic-information/preview-academic-information.component';
import { PreviewOtherDocumentComponent } from './Views/PreviewTabs/preview-other-document/preview-other-document.component';
import { PreviewHospitalDetailComponent } from './Views/PreviewTabs/preview-hospital-detail/preview-hospital-detail.component';
import { PreviewHostelDetailsComponent } from './Views/PreviewTabs/preview-hostel-detail/preview-hostel-details.component';
import { ApplicationPreviewComponent } from './Views/ApplicationPreview/application-preview/application-preview.component';
import { NgIdleModule } from '@ng-idle/core';

import { CreateUserComponent } from './Views/Master/UserMaster/create-user/create-user.component';
import { ApplicationSummaryComponent } from './Views/ApplicationSummary/application-summary/application-summary.component';
import { ApplyNocParameterComponent } from './Views/Master/apply-noc-parameter/apply-noc-parameter.component';
import { ApplyNOCPreviewComponent } from './Views/apply-nocpreview/apply-nocpreview.component';
import { PreviewRNCRegistratComponent } from './Views/PreviewTabs/preview-rncregistrat/preview-rncregistrat.component';
import { ApplyNOCApplicationListComponent } from './Views/apply-nocapplication-list/apply-nocapplication-list.component';
import { ApplyNOCJointSecPreviewComponent } from './Views/apply-nocjoint-sec-preview/apply-nocjoint-sec-preview.component';
import { ApplyNOCSecretaryPreviewComponent } from './Views/apply-nocsecretary-preview/apply-nocsecretary-preview.component';
import { ApplyNocParameterDetailsComponent } from './Views/Master/apply-noc-parameter-details/apply-noc-parameter-details.component';
import { CommitteeMasterComponent } from './Views/Master/CommitteeMaster/AddCommitteeMaster/committee-master.component';
import { CommitteeMasterListComponent } from './Views/Master/CommitteeMaster/CommitteeMasterList/committee-master-list.component';
import { ScurtenyComitteeComponent } from './Views/ScurtenyComittee/scurteny-comittee/scurteny-comittee.component';
import { PreviewLegalEntityComponent } from './Views/PreviewTabs/preview-legal-entity/preview-legal-entity.component';
import { PreviewCollegeComponent } from './Views/PreviewTabs/preview-college/preview-college.component';
import { RevertApplyNOCApplicationListComponent } from './Views/revert-apply-nocapplication-list/revert-apply-nocapplication-list.component';
import { CollegeManagementSocietyComponent } from './Views/PreviewTabs/college-management-society/college-management-society.component';
import { PreviewTrusteeGeneralInfoComponent } from './Views/PreviewTabs/preview-trustee-general-info/preview-trustee-general-info.component';
import { ApplyNOCFDRDetailsComponent } from './Views/Master/apply-nocfdrdetails/apply-nocfdrdetails.component';
import { DocumentScrutinyLandDetailComponent } from './Views/DocumentScrutinyTab/document-scrutiny-land-detail/document-scrutiny-land-detail.component';
import { DocumentScrutinyRoomDetailsComponent } from './Views/DocumentScrutinyTab/document-scrutiny-room-details/document-scrutiny-room-details.component';
import { DocumentScrutinyBuildingDetailsComponent } from './Views/DocumentScrutinyTab/document-scrutiny-building-details/document-scrutiny-building-details.component';
import { DocumentScrutinyStaffDetailsComponent } from './Views/DocumentScrutinyTab/document-scrutiny-staff-details/document-scrutiny-staff-details.component';
import { DocumentScrutinyOldNOCDetailsComponent } from './Views/DocumentScrutinyTab/document-scrutiny-old-nocdetails/document-scrutiny-old-nocdetails.component';
import { DocumentScrutinyAcademicInformationComponent } from './Views/DocumentScrutinyTab/document-scrutiny-academic-information/document-scrutiny-academic-information.component';
import { DocumentScrutinyHospitalDetailsComponent } from './Views/DocumentScrutinyTab/document-scrutiny-hospital-details/document-scrutiny-hospital-details.component';
import { DocumentScrutinyHostalDetailsComponent } from './Views/DocumentScrutinyTab/document-scrutiny-hostal-details/document-scrutiny-hostal-details.component';
import { DocumentScrutinyFacilityComponent } from './Views/DocumentScrutinyTab/document-scrutiny-facility/document-scrutiny-facility.component';
import { DocumentScrutinyRequiredDocumentComponent } from './Views/DocumentScrutinyTab/document-scrutiny-required-document/document-scrutiny-required-document.component';
import { DocumentScrutinyOtherInformationComponent } from './Views/DocumentScrutinyTab/document-scrutiny-other-information/document-scrutiny-other-information.component';
import { DocumentScrutinyOtherDocumentComponent } from './Views/DocumentScrutinyTab/document-scrutiny-other-document/document-scrutiny-other-document.component';
import { DocumentScrutinyCollegeManagementSocietyComponent } from './Views/DocumentScrutinyTab/document-scrutiny-college-management-society/document-scrutiny-college-management-society.component';
import { DocumentScrutinyLegalEntityComponent } from './Views/DocumentScrutinyTab/document-scrutiny-legal-entity/document-scrutiny-legal-entity.component';
import { DocumentScrutinyCollegeDetailComponent } from './Views/DocumentScrutinyTab/document-scrutiny-college-detail/document-scrutiny-college-detail.component';
import { NocPaymentComponent } from './Views/noc-payment/payment-request/noc-payment.component';
import { PaymentSuccessComponent } from './Views/noc-payment/payment-success/payment-success.component';
import { DocumentScrutinyCompletedReportComponent } from './Views/DocumentScrutinyTab/document-scrutiny-completed-report/document-scrutiny-completed-report.component';
import { RNCCheckListMasterComponent } from './Views/Master/rnccheck-list-master/rnccheck-list-master.component';
import { UserRoleRightsComponent } from './Views/Master/RoleMaster/user-role-rights/user-role-rights.component';
import { PreviewPaymentDetailComponent } from './Views/PreviewTabs/preview-payment-detail/preview-payment-detail.component';
import { DocumentScrutinyCheckListDetailsComponent } from './Views/DocumentScrutinyTab/document-scrutiny-check-list-details/document-scrutiny-check-list-details.component';
import { JointApplicationListComponent } from './Views/joint-application-list/joint-application-list.component';
import { CommiteeInspectionComponent } from './Views/commitee-inspection/commitee-inspection.component';
import { ApplyNOCJointSecretaryListComponent } from './Views/apply-nocjoint-secretary-list/apply-nocjoint-secretary-list.component';
import { ApplyNOCSecretaryListComponent } from './Views/apply-nocsecretary-list/apply-nocsecretary-list.component';
import { EmitraPaymentResponseComponent } from './Views/noc-payment/emitra-payment-response/emitra-payment-response.component';
import { AnimalMasterComponent } from './Views/Master/AnimalMaster/animal-master.component';
import { VeterinaryHospitalComponent } from './Views/VeterinaryHospital/veterinary-hospital/veterinary-hospital.component';
import { StreamSubjectMappingComponent } from './Views/Master/StreamSubjectMapping/stream-subject-mapping.component';
import { DocumentScrutinyRejectedReportComponent } from './Views/DocumentScrutinyTab/document-scrutiny-rejected-report/document-scrutiny-rejected-report.component';
import { JointSecretaryCompletedReportComponent } from './Views/Reports/Medical/joint-secretary-completed-report/joint-secretary-completed-report.component';
import { JointSecretaryRejectedReportComponent } from './Views/Reports/Medical/joint-secretary-rejected-report/joint-secretary-rejected-report.component';
import { SecretaryRejectedReportComponent } from './Views/Reports/Medical/secretary-rejected-report/secretary-rejected-report.component';
import { SecretaryCompletedReportComponent } from './Views/Reports/Medical/secretary-completed-report/secretary-completed-report.component';
import { CommitteeCompletedReportComponent } from './Views/Reports/Medical/committee-completed-report/committee-completed-report.component';
import { CommitteeRejectedReportComponent } from './Views/Reports/Medical/committee-rejected-report/committee-rejected-report.component';
import { JointSecretaryPendingNOCReportComponent } from './Views/Reports/Medical/joint-secretary-pending-nocreport/joint-secretary-pending-nocreport.component';
import { CommitteeForwardReportComponent } from './Views/Reports/Medical/committee-forward-report/committee-forward-report.component';
import { ApplyNOCCompletedReportComponent } from './Views/Reports/Medical/apply-noccompleted-report/apply-noccompleted-report.component';
import { FarmLandDetailsComponent } from './Views/TabDetail/farm-land-details/farm-land-details.component';
import { PreviewFarmLandDetailsComponent } from './Views/PreviewTabs/preview-farm-land-details/preview-farm-land-details.component';
import { CourseMasterComponent } from './Views/Master/CourseMaster/course-master.component';
import { ParamedicalHospitalDetailComponent } from './Views/TabDetail/paramedical-hospital-detail/paramedical-hospital-detail.component';
import { ClassWiseStudentDetailsComponent } from './Views/ClassWiseStudentDetails/class-wise-student-details/class-wise-student-details.component';
import { PreviewParamedicalHospitalDetailComponent } from './Views/PreviewTabs/preview-paramedical-hospital-detail/preview-paramedical-hospital-detail.component';
import { DocumentScrutinyParamedicalHospitalDetailComponent } from './Views/DocumentScrutinyTab/document-scrutiny-paramedical-hospital-detail/document-scrutiny-paramedical-hospital-detail.component';
import { PreviewVeterinaryHospitalComponent } from './Views/PreviewTabs/preview-veterinary-hospital/preview-veterinary-hospital.component';
import { DocumentScrutinyVeterinaryHospitalComponent } from './Views/DocumentScrutinyTab/document-scrutiny-veterinary-hospital/document-scrutiny-veterinary-hospital.component';
import { DocumentScrutinyFarmLandDetailsComponent } from './Views/DocumentScrutinyTab/document-scrutiny-farm-land-details/document-scrutiny-farm-land-details.component';
import { DocumentScrutinyComponent } from './Views/DCE/document-scrutiny/document-scrutiny.component';

//document scotiny
import { DocumentScrutinyLegalEntityComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-legal-entity/document-scrutiny-legal-entity-dce.component';
import { DocumentScrutinyRoomDetailsComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-room-details/document-scrutiny-room-details.component';
import { DocumentScrutinyBuildingDetailsComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-building-details/document-scrutiny-building-details.component';
import { DocumentScrutinyStaffDetailsComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-staff-details/document-scrutiny-staff-details.component';
import { DocumentScrutinyOldNOCDetailsComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-old-nocdetails/document-scrutiny-old-nocdetails.component';
import { DocumentScrutinyAcademicInformationComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-academic-information/document-scrutiny-academic-information.component';
import { DocumentScrutinyHospitalDetailsComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-hospital-details/document-scrutiny-hospital-details.component';
import { DocumentScrutinyHostalDetailsComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-hostal-details/document-scrutiny-hostal-details.component';
import { DocumentScrutinyFacilityComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-facility/document-scrutiny-facility.component';
import { DocumentScrutinyRequiredDocumentComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-required-document/document-scrutiny-required-document.component';
import { DocumentScrutinyOtherInformationComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-other-information/document-scrutiny-other-information.component';
import { DocumentScrutinyOtherDocumentComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-other-document/document-scrutiny-other-document.component';
import { DocumentScrutinyCollegeManagementSocietyComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-college-management-society/document-scrutiny-college-management-society.component';
import { DocumentScrutinyCollegeDetailComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-college-detail/document-scrutiny-college-detail.component';
import { DocumentScrutinyCheckListDetailsComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-check-list-details/document-scrutiny-check-list-details.component';

import { DocumentScrutinyLandDetailComponentDce } from './Views/DocumentScrutinyTabDCE/document-scrutiny-land-detail/document-scrutiny-land-detail.component';
import { ApplyNocpreviewAnimalhusbandryComponent } from './Views/apply-nocpreview-animalhusbandry/apply-nocpreview-animalhusbandry.component';
import { AhDocumentScrutinyLegalEntityComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-legal-entity/ah-document-scrutiny-legal-entity.component';
import { AhDocumentScrutinyCollegeDetailComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-college-detail/ah-document-scrutiny-college-detail.component';
import { AhDocumentScrutinyCollegeManagementSocietyComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-college-management-society/ah-document-scrutiny-college-management-society.component';
import { AhDocumentScrutinyLandDetailComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-land-detail/ah-document-scrutiny-land-detail.component';
import { AhDocumentScrutinyFacilityComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-facility/ah-document-scrutiny-facility.component';
import { AhDocumentScrutinyRequiredDocumentComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-required-document/ah-document-scrutiny-required-document.component';
import { AhDocumentScrutinyRoomDetailsComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-room-details/ah-document-scrutiny-room-details.component';
import { AhDocumentScrutinyOtherInformationComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-other-information/ah-document-scrutiny-other-information.component';
import { AhDocumentScrutinyBuildingDetailsComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-building-details/ah-document-scrutiny-building-details.component';
import { AhDocumentScrutinyStaffDetailComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-staff-detail/ah-document-scrutiny-staff-detail.component';
import { AhDocumentScrutinyOldNocdetailsComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-old-nocdetails/ah-document-scrutiny-old-nocdetails.component';
import { AhDocumentScrutinyAcademicInformationComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-academic-information/ah-document-scrutiny-academic-information.component';
import { AhDocumentScrutinyOtherDocumentComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-other-document/ah-document-scrutiny-other-document.component';
import { AhDocumentScrutinyVeterinaryHospitalComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-veterinary-hospital/ah-document-scrutiny-veterinary-hospital.component';
import { AhDocumentScrutinyCheckListDetailsComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-check-list-details/ah-document-scrutiny-check-list-details.component';
import { AgriDocumentScrutinyLandDetailComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-land-detail/agri-document-scrutiny-land-detail.component';
import { AgriDocumentScrutinyFacilityComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-facility/agri-document-scrutiny-facility.component';
import { AgriDocumentScrutinyRequiredDocumentComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-required-document/agri-document-scrutiny-required-document.component';
import { AgriDocumentScrutinyRoomDetailsComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-room-details/agri-document-scrutiny-room-details.component';
import { AgriDocumentScrutinyOtherInformationComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-other-information/agri-document-scrutiny-other-information.component';
import { AgriDocumentScrutinyBuildingDetailsComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-building-details/agri-document-scrutiny-building-details.component';
import { AgriDocumentScrutinyStaffDetailComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-staff-detail/agri-document-scrutiny-staff-detail.component';
import { AgriDocumentScrutinyOldNocdetailsComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-old-nocdetails/agri-document-scrutiny-old-nocdetails.component';
import { AgriDocumentScrutinyAcademicInformationComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-academic-information/agri-document-scrutiny-academic-information.component';
import { AgriDocumentScrutinyOtherDocumentComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-other-document/agri-document-scrutiny-other-document.component';
import { AgriDocumentScrutinyFarmLandDetailsComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-farm-land-details/agri-document-scrutiny-farm-land-details.component';
import { AgriDocumentScrutinyCheckListDetailsComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-check-list-details/agri-document-scrutiny-check-list-details.component';
import { AgriDocumentScrutinyCollegeDetailComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-college-detail/agri-document-scrutiny-college-detail.component';
import { AgriDocumentScrutinyCollegeManagementSocietyComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-college-management-society/agri-document-scrutiny-college-management-society.component';
import { AgriDocumentScrutinyLegalEntityComponent } from './Views/DocumentScrutinyTab_Agri/agri-document-scrutiny-legal-entity/agri-document-scrutiny-legal-entity.component';
import { ApplyNocpreviewAgricultureComponent } from './Views/apply-nocpreview-agriculture/apply-nocpreview-agriculture.component';
import { SubjectWiseStudentStatisticsComponent } from './Views/SubjectWiseStudentStatistics/subject-wise-student-statistics/subject-wise-student-statistics.component';
import { InspectionCommitteePhysicalVerificationDCEComponent } from './Views/DCE/inspection-committee-physical-verification-dce/inspection-committee-physical-verification-dce.component';

import { NodalOfficerApplicationListComponent } from './Views/DCE/nodal-officer-application-list/nodal-officer-application-list.component';
import { DocumentScrutinyClassWiseStudentDetailsComponent } from './Views/DocumentScrutinyTabDCE/document-scrutiny-class-wise-student-details/document-scrutiny-class-wise-student-details.component';
import { DocumentScrutinySubjectWiseStudentStatisticsComponent } from './Views/DocumentScrutinyTabDCE/document-scrutiny-subject-wise-student-statistics/document-scrutiny-subject-wise-student-statistics.component';
//import { AhDocumentScrutinyForwardToCommetteReportComponent } from './Views/DocumentScrutinyTab_AH/ahDocumentScrutinyForwardToCommetteReport/ah-document-scrutiny-forward-to-commette-report/ah-document-scrutiny-forward-to-commette-report.component';
import { AhInspectionCommitteePhysicalVerificationComponent } from './Views/DocumentScrutinyTab_AH/ah-inspection-committee-physical-verification/ah-inspection-committee-physical-verification.component';
import { AhPreVerificationDoneListComponent } from './Views/DocumentScrutinyTab_AH/ah-pre-verification-done-list/ah-pre-verification-done-list.component';
import { IssuedNOCReportComponent } from './Views/Reports/Medical/issued-noc-report/issued-noc-report.component';
import { AhApplyNocApplicationListComponent } from './Views/ahApplyNocApplicationList/ah-apply-noc-application-list/ah-apply-noc-application-list.component';
import { AhDocumentScrutinyForwardCommetteComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-forward-commette/ah-document-scrutiny-forward-commette.component';
import { AhPhysicalPostVerificationComponent } from './Views/DocumentScrutinyTab_AH/ah-physical-post-verification/ah-physical-post-verification.component';
import { DceDocumentScrutinyCompletedReportComponent } from './Views/Reports/DCE/dce-document-scrutiny-completed-report/dce-document-scrutiny-completed-report.component';
import { RouterModule } from '@angular/router';
import { RevertedApplicationListComponent } from './Views/RevertedApllication/reverted-application-list/reverted-application-list.component';
import { AhPostVerificationDoneListComponent } from './Views/DocumentScrutinyTab_AH/ah-post-verification-done-list/ah-post-verification-done-list.component';
import { EnableControlDirective } from './Common/enable-control.directive';
import { EnterTabDirective } from './Common/enter-tab.directive';
import { AhPhysicalFinalVerificationComponent } from './Views/DocumentScrutinyTab_AH/ah-physical-final-verification/ah-physical-final-verification.component';
import { AhFinalVerificationDoneListComponent } from './Views/DocumentScrutinyTab_AH/ah-final-verification-done-list/ah-final-verification-done-list.component';
import { AhFinalNocApplicationListComponent } from './Views/DocumentScrutinyTab_AH/ah-final-noc-application-list/ah-final-noc-application-list.component';
import { PreviewApplyNocDetailComponent } from './Views/PreviewTabs/preview-apply-noc-detail/preview-apply-noc-detail.component';
import { AhDocumentScrutinyNodalOfficerComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-nodal-officer/ah-document-scrutiny-nodal-officer.component';

import { PreviewFDRDetailComponent } from './Views/PreviewTabs/preview-fdr-detail/preview-fdr-detail.component';
import { PreviewCourseDetailComponent } from './Views/PreviewTabs/preview-course-detail/preview-course-detail.component';
import { OneStepRevertBackComponent } from './Views/one-step-revert-back/one-step-revert-back.component';
import { LOIApplicationListComponent } from './Views/Medical Group 1/loiapplication-list/loiapplication-list.component';
import { CommissionerApplicationScrutinyListComponent } from './Views/DCE/commissioner-application-scrutiny-list/commissioner-application-scrutiny-list.component';
import { CheckListForCommissionerComponent } from './Views/DCE/check-list-for-commissioner/check-list-for-commissioner.component';
import { RevertCheckListDCEComponent } from './Views/DCE/revert-check-list-dce/revert-check-list-dce.component';
import { RevertApplicationDetailEntryComponent } from './Views/DCE/revert-application-detail-entry/revert-application-detail-entry.component';
import { ImportExcelDataComponent } from './Views/import-excel-data/import-excel-data.component';
import { StaffattendanceComponent } from './Views/Staff-Attendance/staffattendance/staffattendance.component';
import { StaffAttendanceReportComponent } from './Views/Staff-Attendance/staff-attendance-report/staff-attendance-report.component';
import { AgriApplyNocApplicationListComponent } from './Views/AgriApplyNocApplicationList/agri-apply-noc-application-list/agri-apply-noc-application-list.component';
import { AgriPriVerificationDoneListComponent } from './Views/DocumentScrutinyTab_Agri/agri-pri-verification-done-list/agri-pri-verification-done-list.component';
import { AgriDsForwardToCommiteeListComponent } from './Views/DocumentScrutinyTab_Agri/agri-ds-forward-to-commitee-list/agri-ds-forward-to-commitee-list.component';
import { AgriDsCommitteePrimaryVerificationComponent } from './Views/DocumentScrutinyTab_Agri/agri-ds-committee-primary-verification/agri-ds-committee-primary-verification.component';
import { AgriInsepctionPostVerificationComponent } from './Views/DocumentScrutinyTab_Agri/agri-insepction-post-verification/agri-insepction-post-verification.component';
import { AgriPreViewByNodalOfficerComponent } from './Views/DocumentScrutinyTab_Agri/agri-pre-view-by-nodal-officer/agri-pre-view-by-nodal-officer.component';
import { AgriPIForwardToCommiteeListComponent } from './Views/DocumentScrutinyTab_Agri/agri-piforward-to-commitee-list/agri-piforward-to-commitee-list.component';
import { AgriPostVerificationDoneListComponent } from './Views/DocumentScrutinyTab_Agri/agri-post-verification-done-list/agri-post-verification-done-list.component';
import { PaymentTransactionComponent } from './Views/noc-payment/payment-transaction/payment-transaction.component';
import { AgriPSNocApplicationListComponent } from './Views/DocumentScrutinyTab_Agri/agri-psnoc-application-list/agri-psnoc-application-list.component';
import { DocumentScrutinyRevertedReportComponent } from './Views/DocumentScrutinyTab/document-scrutiny-reverted-report/document-scrutiny-reverted-report.component';
import { DteAddCourseComponent } from './Views/CollegeDetailsForm/dte-add-course/dte-add-course.component';
import { UpdateNocFeesComponent } from './Views/Admin/update-noc-fees/update-noc-fees.component';
import { PreviewLOIapplicationdetailEntryComponent } from './Views/PreviewTabs/preview-loiapplicationdetail-entry/preview-loiapplicationdetail-entry.component';
import { LOIApplyEntryComponent } from './Views/NoOfficer/loiapply-entry/loiapply-entry.component';
import { NocInformationComponent } from './Views/NocInformation/noc-information/noc-information.component';
import { SeatInformationMasterComponent } from './Views/Master/seat-information-master/seat-information-master.component';
import { LOIFeeMasterComponent } from './Views/Master/loifee-master/loifee-master.component';
import { RejectedApplicationListComponent } from './Views/RejectedApplication/rejected-application-list/rejected-application-list.component';
import { NOCIssuedReportComponent } from './Views/Admin/`Reports/nocissued-report/nocissued-report.component';
import { ForwardedApplicationListComponent } from './Views/DocumentScrutinyTab/forwarded-application-list/forwarded-application-list.component';
import { MG1DocumentScrutinyLegalEntityComponent } from './Views/DocumentScrutinyTab_MG1/mg1-document-scrutiny-legal-entity/mg1-document-scrutiny-legal-entity.component';
import { MG1DocumentScrutinyCollegeDetailComponent } from './Views/DocumentScrutinyTab_MG1/mg1-document-scrutiny-college-detail/mg1-document-scrutiny-college-detail.component';
import { MG1DocumentScrutinyCMSComponent } from './Views/DocumentScrutinyTab_MG1/mg1-document-scrutiny-cms/mg1-document-scrutiny-cms.component';
import { MG1DocumentScrutinyLandDetailComponent } from './Views/DocumentScrutinyTab_MG1/mg1-document-scrutiny-land-detail/mg1-document-scrutiny-land-detail.component';
import { MG1DocumentScrutinyBuildingDetailComponent } from './Views/DocumentScrutinyTab_MG1/mg1-document-scrutiny-building-detail/mg1-document-scrutiny-building-detail.component';
import { MG1DocumentScrutinyRequiredDocumentComponent } from './Views/DocumentScrutinyTab_MG1/mg1-document-scrutiny-required-document/mg1-document-scrutiny-required-document.component';
import { MG1DocumentScrutinyHospitalDetailComponent } from './Views/DocumentScrutinyTab_MG1/mg1-document-scrutiny-hospital-detail/mg1-document-scrutiny-hospital-detail.component';
import { DocumentScrutinyCheckListMGOneComponent } from './Views/DocumentScrutinyTab_MG1/document-scrutiny-check-list-mgone/document-scrutiny-check-list-mgone.component';
import { DocumentScrutinyMGOneComponent } from './Views/DocumentScrutinyTab_MG1/document-scrutiny-mgone/document-scrutiny-mgone.component';
import { DocumentScrutinyListMGOneComponent } from './Views/Medical Group 1/document-scrutiny-list-mgone/document-scrutiny-list-mgone.component';
import { NodalSecretaryApplicationListMGOneComponent } from './Views/Medical Group 1/nodal-secretary-application-list-mgone/nodal-secretary-application-list-mgone.component';
import { ApplicationFinalCheckListMGOneComponent } from './Views/Medical Group 1/application-final-check-list-mgone/application-final-check-list-mgone.component';
import { OSDApplicationListMGOneComponent } from './Views/Medical Group 1/osdapplication-list-mgone/osdapplication-list-mgone.component';
import { ForwardByMinisterListMGOneComponent } from './Views/Medical Group 1/forward-by-minister-list-mgone/forward-by-minister-list-mgone.component';
import { DeputySecretaryListMGOneComponent } from './Views/Medical Group 1/deputy-secretary-list-mgone/deputy-secretary-list-mgone.component';
import { GenerateLOIReportMGOneComponent } from './Views/Medical Group 1/generate-loireport-mgone/generate-loireport-mgone.component';
import { IssuedLOIReportMGOneComponent } from './Views/Medical Group 1/issued-loireport-mgone/issued-loireport-mgone.component';
import { RevertApplicationDetailEntryMGOneComponent } from './Views/Medical Group 1/revert-application-detail-entry-mgone/revert-application-detail-entry-mgone.component';
import { LegalEntityRevertComponent } from './Views/legal-entity-revert/legal-entity-revert.component';
import { CollegeRevertComponent } from './Views/college-revert/college-revert.component';
import { CollegeManagementSocietyRevertComponent } from './Views/college-management-society-revert/college-management-society-revert.component';
import { CheckListMGOneComponent } from './Views/DocumentScrutinyTab_MG1/check-list-mgone/check-list-mgone.component';
import { ClassWiseStaticReportDCEComponent } from './Views/DCE/class-wise-static-report-dce/class-wise-static-report-dce.component';
import { SubjectWiseStaticReportDCEComponent } from './Views/DCE/subject-wise-static-report-dce/subject-wise-static-report-dce.component';
import { StatisticsEntryComponent } from './Views/Statistics/statistics-entry/statistics-entry.component';
import { StatisticsCollegeListComponent } from './Views/Statistics/statistics-college-list/statistics-college-list.component';
//import { PreviewTabsComponent } from './Views/PreviewTabs/preview-tabs/preview-tabs.component';
import { PreviewClasswiseStaticComponent } from './Views/PreviewTabs/preview-classwise-static/preview-classwise-static.component';
import { PreviewSubjectwiseStaticComponent } from './Views/PreviewTabs/preview-subjectwise-static/preview-subjectwise-static.component';
import { HomeComponent } from './Views/home/home.component';

import { DCENOCReportComponent } from './Views/DCE/dcenocreport/dcenocreport.component';
import { CollegeReportDCEComponent } from './Views/DCE/college-report-dce/college-report-dce.component';
import { TotalCollegeDepartmentWiseReportsComponent } from './Views/total-college-department-wise-reports/total-college-department-wise-reports.component';
import { NewGrievanceModule } from './Views/Grievance/new-grievance/new-grievance.module';
import { NewGrievanceComponent } from './Views/Grievance/new-grievance/new-grievance.component';
import { CollegeSubmitStatisticsReportDCEComponent } from './Views/DCE/college-submit-statistics-report-dce/college-submit-statistics-report-dce.component';
import { TotalApplicationListByDepartmentComponent } from './Views/Reports/total-application-list-by-department/total-application-list-by-department.component';
import { StatisticsDraftCollgerReportComponent } from './Views/DCE/statistics-draft-collger-report/statistics-draft-collger-report.component';
import { DTEDocumentScrutinyLegalEntityComponent } from './Views/DocumentScrutinyTab_DTE/dtedocument-scrutiny-legal-entity/dtedocument-scrutiny-legal-entity.component';
import { DocumentScrutinyDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-dte/document-scrutiny-dte.component';
import { DocumentScrutinyCollegeDetailDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-college-detail-dte/document-scrutiny-college-detail-dte.component';
import { DocumentScrutinyCollegeManagementSocietyDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-college-management-society-dte/document-scrutiny-college-management-society-dte.component';
import { DocumentScrutinyOLDNOCDetailsDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-oldnocdetails-dte/document-scrutiny-oldnocdetails-dte.component';
import { DocumentScrutinyLandDetailDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-land-detail-dte/document-scrutiny-land-detail-dte.component';
import { DocumentScrutinyBuildingDetailDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-building-detail-dte/document-scrutiny-building-detail-dte.component';
import { DocumentScrutinyCourseDetailDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-course-detail-dte/document-scrutiny-course-detail-dte.component';
import { DocumentScrutinyHostalDetailsComponentDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-hostal-details-component-dte/document-scrutiny-hostal-details-component-dte.component';
import { DocumentScrutinyAcademicInformationDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-academic-information-dte/document-scrutiny-academic-information-dte.component';
import { DocumentScrutinyStaffDetailsDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-staff-details-dte/document-scrutiny-staff-details-dte.component';
import { DocumentScrutinyOtherDocumentDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-other-document-dte/document-scrutiny-other-document-dte.component';
import { DocumentScrutinyFacilityDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-facility-dte/document-scrutiny-facility-dte.component';
import { DocumentScrutinyRequiredDocumentDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-required-document-dte/document-scrutiny-required-document-dte.component';
import { DocumentScrutinyRoomDetailsDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-room-details-dte/document-scrutiny-room-details-dte.component';
import { DocumentScrutinyOtherInfrastuctureDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-other-infrastucture-dte/document-scrutiny-other-infrastucture-dte.component';
import { DocumentScrutinyCheckListDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-check-list-dte/document-scrutiny-check-list-dte.component';
import { ApplicationLandingDetailsDTEComponent } from './Views/DocumentScrutinyTab_DTE/application-landing-details-dte/application-landing-details-dte.component';
import { DTECommitteeMasterComponent } from './Views/dtecommittee-master/dtecommittee-master.component';
import { DocumentScrutinyApplicationListDTEComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-application-list-dte/document-scrutiny-application-list-dte.component';
import { JSApplicationListDTEComponent } from './Views/DocumentScrutinyTab_DTE/jsapplication-list-dte/jsapplication-list-dte.component';
import { RevertApplicationDetailEntryDTEComponent } from './Views/DocumentScrutinyTab_DTE/revert-application-detail-entry-dte/revert-application-detail-entry-dte.component';
//import { MatPaginatorModule } from '@angular/material/paginator';
//import { MatTableModule } from '@angular/material/table';
//import { MatSortModule } from '@angular/material/sort';
import { TotalNotFilledStaticsReportComponent } from './Views/DCE/total-not-filled-statics-report/total-not-filled-statics-report.component';
import { SecretaryFinalCheckListMGOneComponent } from './Views/Medical Group 1/secretary-final-check-list-mgone/secretary-final-check-list-mgone.component';
import { DtcoursemasterComponent } from './Views/Master/DT_CourseMaster/dtcoursemaster/dtcoursemaster.component';
import { UserManualDocumentMasterComponent } from './Views/Master/usermanualdocumentmaster/usermanualdocumentmaster.component';
import { GenerateReceiptListDTEComponent } from './Views/DocumentScrutinyTab_DTE/generate-receipt-list-dte/generate-receipt-list-dte.component';
import { DocumentScrutinyStepIIApplicationsComponent } from './Views/DocumentScrutinyTab_DTE/document-scrutiny-step-iiapplications/document-scrutiny-step-iiapplications.component';
import { ApplicationPDFComponent } from './Views/application-pdf/application-pdf.component';
import { ApplyNOCMGOneComponent } from './Views/Medical Group 1/apply-nocmgone/apply-nocmgone.component';
import { JDACCEApplicationListDCEComponent } from './Views/DCE/jdacceapplication-list-dce/jdacceapplication-list-dce.component';
import { CheckListSecretaryDCEComponent } from './Views/DCE/check-list-secretary-dce/check-list-secretary-dce.component';
import { RevertCheckListDTEComponent } from './Views/DocumentScrutinyTab_DTE/revert-check-list-dte/revert-check-list-dte.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DTECommitteApplicationListComponent } from './Views/DocumentScrutinyTab_DTE/dtecommitte-application-list/dtecommitte-application-list.component';
import { FinalCheckListDTEComponent } from './Views/DocumentScrutinyTab_DTE/final-check-list-dte/final-check-list-dte.component';
import { ActivityDetailsComponent } from './Views/TabDetail/ActivityDetails/activity-details/activity-details.component';
import { PreviewActivityDetailsComponent } from './Views/PreviewTabs/PreviewActivityDetails/preview-activity-details/preview-activity-details.component';
import { OfficersDetailsComponent } from './Views/DTEStatistics/officers-details/officers-details.component';
import { AddressComponent } from './Views/DTEStatistics/address/address.component';
import { ResidentialFacilityComponent } from './Views/DTEStatistics/residential-facility/residential-facility.component';
import { RegionalCentersComponent } from './Views/DTEStatistics/regional-centers/regional-centers.component';
import { OffShoreCenterComponent } from './Views/DTEStatistics/off-shore-center/off-shore-center.component';
import { FacultyComponent } from './Views/DTEStatistics/faculty/faculty.component';
import { DTEStatisticsDepartmentComponent } from './Views/DTEStatistics/dtestatistics-department/dtestatistics-department.component';
import { RegularModeComponent } from './Views/DTEStatistics/regular-mode/regular-mode.component';
import { DistanceModeComponent } from './Views/DTEStatistics/distance-mode/distance-mode.component';
import { StudentEnrollmentDistanceModeComponent } from './Views/DTEStatistics/student-enrollment-distance-mode/student-enrollment-distance-mode.component';
import { PlacementDetailsComponent } from './Views/DTEStatistics/placement-details/placement-details.component';
import { FinancialDetailsComponent } from './Views/DTEStatistics/financial-details/financial-details.component';

//import { NewgrievancereportComponent } from './Views/DCE/newgrievancereport/newgrievancereport/newgrievancereport.component';





@NgModule({
  declarations: [

    AppComponent,
    MasterPageComponent,


    ApplicationListComponent,
    CollegeDetailsComponent,
    BasicBscNursingComponent,
    GNMSchOfNursingComponent,
    DashboardComponent,
    GNMSchoolOfNursingComponent,
    MScNursingProgrammeComponent,
    OpenBScNCollegeOfNursingComponent,
    PostBasicBScNCollegeOfNursingComponent,
    LegalEntityComponent,
    ProjectMasterComponent,
    CreateRoleMappingComponent,
    RoleMappingMasterComponent,
    UserListComponent,
    ApplicationswithNodalOfficerComponent,
    ApplicationwithAdditionalDirectorComponent,
    ApplicationwithJointDirectorComponent,
    DeficiencyMarkedComponent,
    DocumentInspectionInProcessComponent,
    NOCIssuedComponent,
    PartialFiledApplicationComponent,
    PhysicalInspectionInProcessComponent,
    SubmittedApplicationComponent,
    TotalCollegeComponent,
    TotalDraftApplicationComponent,
    TotalTrustComponent,
    LoderComponent,
    TableSearchFilterPipe,
    SSOLoginComponent,
    LoginComponent,
    PageNotFoundComponent,
    AddCoursesComponent,
    AddCollegeComponent,
    BScNCollegeOfNursingComponent,

    BScNCollegeOfNursingComponent,
    WorkFlowMasterComponent,
    WorkFlowMasterListComponent,
    ApplicationDetailEntryComponent,

    LandDetailsComponent,
    FacilityDetailsComponent,
    RequiredDocumentComponent,
    HospitalDetailComponent,
    BuildingDetailsComponent,

    DraftApplicationListComponent,
    RoomDetailsComponent,
    OtherDocumentComponent,
    OtherInformationComponent,
    StaffDetailsComponent,
    HostelDetailsComponent,
    OldNOCDetailsComponent,
    AcademicInformationComponent,
    ApplyNOCComponent,
    TrusteeGeneralInfoComponent,

    ParliamentAreaMasterComponent,
    AssemblyAreaMasterComponent,
    CommonMasterComponent,
    SocietyComponent,
    UniversityComponent,
    LandAreaSituatedComponent,
    FacilitiesComponent,
    QualificationMasterComponent,
    SubjectMasterComponent,
    DocumentMasterComponent,
    AddRoleMasterComponent,
    TotalLegalEntityPreviewComponent,
    AddRoleMasterComponent,

    PreviewLandDetailComponent,
    PreviewFacilityDetailComponent,
    PreviewRequiredDocumentComponent,
    PreviewRoomDetailComponent,
    PreviewOtherInformationComponent,
    PreviewBuildingDetailComponent,
    PreviewStaffDetailComponent,
    PreviewOldNOCDetailComponent,
    PreviewAcademicInformationComponent,
    PreviewOtherDocumentComponent,
    PreviewHospitalDetailComponent,
    PreviewHostelDetailsComponent,
    ApplicationPreviewComponent,
    CreateUserComponent,
    ApplyNOCApplicationListComponent,
    ApplicationSummaryComponent,
    ApplyNOCPreviewComponent,
    CommitteeMasterComponent,
    CommitteeMasterListComponent,
    //LoaderModule,
    ApplyNOCJointSecPreviewComponent,
    ApplyNOCSecretaryPreviewComponent,
    ApplyNocParameterComponent,
    PreviewRNCRegistratComponent,
    ScurtenyComitteeComponent,
    PreviewLegalEntityComponent,
    PreviewCollegeComponent,
    PreviewCollegeComponent,
    PreviewRNCRegistratComponent,
    RevertApplyNOCApplicationListComponent,
    CollegeManagementSocietyComponent,
    PreviewTrusteeGeneralInfoComponent,
    PreviewCollegeComponent,
    PreviewRNCRegistratComponent,
    ApplyNocParameterDetailsComponent,
    DocumentScrutinyLandDetailComponent,
    DocumentScrutinyRoomDetailsComponent,
    DocumentScrutinyBuildingDetailsComponent,
    DocumentScrutinyStaffDetailsComponent,
    DocumentScrutinyOldNOCDetailsComponent,
    DocumentScrutinyAcademicInformationComponent,
    DocumentScrutinyHospitalDetailsComponent,
    DocumentScrutinyHostalDetailsComponent,
    DocumentScrutinyFacilityComponent,
    DocumentScrutinyRequiredDocumentComponent,
    DocumentScrutinyOtherInformationComponent,
    PreviewTrusteeGeneralInfoComponent,
    ApplyNocParameterDetailsComponent,
    ApplyNOCFDRDetailsComponent,
    DocumentScrutinyOtherDocumentComponent,
    DocumentScrutinyCollegeManagementSocietyComponent,
    DocumentScrutinyLegalEntityComponent,
    DocumentScrutinyCollegeDetailComponent,
    ApplyNocParameterDetailsComponent,
    NocPaymentComponent,
    PaymentSuccessComponent,
    DocumentScrutinyCollegeDetailComponent,
    DocumentScrutinyCompletedReportComponent,
    RNCCheckListMasterComponent,
    UserRoleRightsComponent,
    PreviewPaymentDetailComponent,
    DocumentScrutinyCheckListDetailsComponent,
    JointApplicationListComponent,
    ApplyNOCJointSecretaryListComponent,
    ApplyNOCSecretaryListComponent,
    CommiteeInspectionComponent,
    EmitraPaymentResponseComponent,
    AnimalMasterComponent,
    VeterinaryHospitalComponent,
    DocumentScrutinyRejectedReportComponent,
    JointSecretaryCompletedReportComponent,
    JointSecretaryRejectedReportComponent,
    SecretaryRejectedReportComponent,
    SecretaryCompletedReportComponent,
    CommitteeCompletedReportComponent,
    CommitteeRejectedReportComponent,
    JointSecretaryPendingNOCReportComponent,
    CommitteeForwardReportComponent,
    EmitraPaymentResponseComponent,
    StreamSubjectMappingComponent,
    ApplyNOCCompletedReportComponent,
    FarmLandDetailsComponent,
    PreviewFarmLandDetailsComponent,
    ParamedicalHospitalDetailComponent,
    CourseMasterComponent,
    ClassWiseStudentDetailsComponent,
    PreviewParamedicalHospitalDetailComponent,
    DocumentScrutinyParamedicalHospitalDetailComponent,
    PreviewVeterinaryHospitalComponent,
    DocumentScrutinyVeterinaryHospitalComponent,
    DocumentScrutinyFarmLandDetailsComponent,
    DocumentScrutinyComponent,
    DocumentScrutinyLegalEntityComponentDce,
    DocumentScrutinyRoomDetailsComponentDce,
    DocumentScrutinyBuildingDetailsComponentDce,
    DocumentScrutinyStaffDetailsComponentDce,
    DocumentScrutinyOldNOCDetailsComponentDce,
    DocumentScrutinyAcademicInformationComponentDce,
    DocumentScrutinyHospitalDetailsComponentDce,
    DocumentScrutinyHostalDetailsComponentDce,
    DocumentScrutinyFacilityComponentDce,
    DocumentScrutinyRequiredDocumentComponentDce,
    DocumentScrutinyOtherInformationComponentDce,
    DocumentScrutinyOtherDocumentComponentDce,
    DocumentScrutinyCollegeManagementSocietyComponentDce,
    DocumentScrutinyCollegeDetailComponentDce,
    DocumentScrutinyCheckListDetailsComponentDce,
    DocumentScrutinyLandDetailComponentDce,
    ApplyNocpreviewAnimalhusbandryComponent,
    AhDocumentScrutinyLegalEntityComponent,
    AhDocumentScrutinyCollegeDetailComponent,
    AhDocumentScrutinyCollegeManagementSocietyComponent,
    AhDocumentScrutinyLandDetailComponent,
    AhDocumentScrutinyFacilityComponent,
    AhDocumentScrutinyRequiredDocumentComponent,
    AhDocumentScrutinyRoomDetailsComponent,
    AhDocumentScrutinyOtherInformationComponent,
    AhDocumentScrutinyBuildingDetailsComponent,
    AhDocumentScrutinyStaffDetailComponent,
    AhDocumentScrutinyOldNocdetailsComponent,
    AhDocumentScrutinyAcademicInformationComponent,
    AhDocumentScrutinyOtherDocumentComponent,
    AhDocumentScrutinyVeterinaryHospitalComponent,
    AhDocumentScrutinyCheckListDetailsComponent,
    AgriDocumentScrutinyLandDetailComponent,
    AgriDocumentScrutinyFacilityComponent,
    AgriDocumentScrutinyRequiredDocumentComponent,
    AgriDocumentScrutinyRoomDetailsComponent,
    AgriDocumentScrutinyOtherInformationComponent,
    AgriDocumentScrutinyBuildingDetailsComponent,
    AgriDocumentScrutinyStaffDetailComponent,
    AgriDocumentScrutinyOldNocdetailsComponent,
    AgriDocumentScrutinyAcademicInformationComponent,
    AgriDocumentScrutinyOtherDocumentComponent,
    AgriDocumentScrutinyFarmLandDetailsComponent,
    AgriDocumentScrutinyCheckListDetailsComponent,
    AgriDocumentScrutinyCollegeDetailComponent,
    AgriDocumentScrutinyCollegeManagementSocietyComponent,
    AgriDocumentScrutinyLegalEntityComponent,
    ApplyNocpreviewAgricultureComponent,
    SubjectWiseStudentStatisticsComponent,
    InspectionCommitteePhysicalVerificationDCEComponent,

    NodalOfficerApplicationListComponent,
    DocumentScrutinyClassWiseStudentDetailsComponent,
    DocumentScrutinySubjectWiseStudentStatisticsComponent,
    /*AhDocumentScrutinyForwardToCommetteReportComponent,*/
    AhInspectionCommitteePhysicalVerificationComponent,
    AhPreVerificationDoneListComponent,
    IssuedNOCReportComponent,
    AhApplyNocApplicationListComponent,
    AhDocumentScrutinyForwardCommetteComponent,
    AhPhysicalPostVerificationComponent,
    DceDocumentScrutinyCompletedReportComponent,
    RevertedApplicationListComponent,
    AhPostVerificationDoneListComponent,
    AhPhysicalFinalVerificationComponent,
    AhFinalVerificationDoneListComponent,
    AhFinalNocApplicationListComponent,
    
    EnableControlDirective,
    EnterTabDirective,
    PreviewApplyNocDetailComponent,
    AhDocumentScrutinyNodalOfficerComponent,
    PreviewFDRDetailComponent,
    PreviewCourseDetailComponent,
    OneStepRevertBackComponent,
    LOIApplicationListComponent,
    OneStepRevertBackComponent,
    CommissionerApplicationScrutinyListComponent,
    CheckListForCommissionerComponent,
    RevertCheckListDCEComponent,
    RevertApplicationDetailEntryComponent,
    ImportExcelDataComponent,
    StaffattendanceComponent,
    StaffAttendanceReportComponent,
    AgriApplyNocApplicationListComponent,
    AgriPriVerificationDoneListComponent,
    AgriDsForwardToCommiteeListComponent,
    AgriDsCommitteePrimaryVerificationComponent,
    AgriInsepctionPostVerificationComponent,
    AgriPreViewByNodalOfficerComponent,
    AgriPIForwardToCommiteeListComponent,
    AgriPostVerificationDoneListComponent,
    PaymentTransactionComponent,
    AgriPSNocApplicationListComponent,
    DocumentScrutinyRevertedReportComponent,
    DteAddCourseComponent,
    UpdateNocFeesComponent,
    PreviewLOIapplicationdetailEntryComponent,
    LOIApplyEntryComponent,
    NocInformationComponent,
    SeatInformationMasterComponent,
    LOIFeeMasterComponent,
    RejectedApplicationListComponent,
    NOCIssuedReportComponent,
    ForwardedApplicationListComponent,
    MG1DocumentScrutinyLegalEntityComponent,
    MG1DocumentScrutinyCollegeDetailComponent,
    MG1DocumentScrutinyCMSComponent,
    MG1DocumentScrutinyLandDetailComponent,
    MG1DocumentScrutinyBuildingDetailComponent,
    MG1DocumentScrutinyRequiredDocumentComponent,
    MG1DocumentScrutinyHospitalDetailComponent,
    DocumentScrutinyCheckListMGOneComponent,
    DocumentScrutinyMGOneComponent,
    DocumentScrutinyListMGOneComponent,
    NodalSecretaryApplicationListMGOneComponent,
    ApplicationFinalCheckListMGOneComponent,
    OSDApplicationListMGOneComponent,
    ForwardByMinisterListMGOneComponent,
    DeputySecretaryListMGOneComponent,
    GenerateLOIReportMGOneComponent,
    IssuedLOIReportMGOneComponent,
    RevertApplicationDetailEntryMGOneComponent,
    LegalEntityRevertComponent,
    CollegeRevertComponent,
    CollegeManagementSocietyRevertComponent,
    CheckListMGOneComponent,
    ClassWiseStaticReportDCEComponent,
    SubjectWiseStaticReportDCEComponent,
    StatisticsEntryComponent,
    StatisticsCollegeListComponent,
    //PreviewTabsComponent,
    PreviewClasswiseStaticComponent,
    PreviewSubjectwiseStaticComponent,
    HomeComponent,
    
    DCENOCReportComponent,
          CollegeReportDCEComponent,
          TotalCollegeDepartmentWiseReportsComponent,
          NewGrievanceComponent,
          CollegeSubmitStatisticsReportDCEComponent,
          TotalApplicationListByDepartmentComponent,
          StatisticsDraftCollgerReportComponent,
          DTEDocumentScrutinyLegalEntityComponent,
          DocumentScrutinyDTEComponent,
          DocumentScrutinyCollegeDetailDTEComponent,
          DocumentScrutinyCollegeManagementSocietyDTEComponent,
          DocumentScrutinyOLDNOCDetailsDTEComponent,
          DocumentScrutinyLandDetailDTEComponent,
          DocumentScrutinyBuildingDetailDTEComponent,
          DocumentScrutinyCourseDetailDTEComponent,
          DocumentScrutinyHostalDetailsComponentDTEComponent,
          DocumentScrutinyAcademicInformationDTEComponent,
          DocumentScrutinyStaffDetailsDTEComponent,
          DocumentScrutinyOtherDocumentDTEComponent,
          DocumentScrutinyFacilityDTEComponent,
          DocumentScrutinyRequiredDocumentDTEComponent,
          DocumentScrutinyRoomDetailsDTEComponent,
          DocumentScrutinyOtherInfrastuctureDTEComponent,
          DocumentScrutinyCheckListDTEComponent,
          ApplicationLandingDetailsDTEComponent,
          DTECommitteeMasterComponent,
          DocumentScrutinyApplicationListDTEComponent,
          JSApplicationListDTEComponent,
          RevertApplicationDetailEntryDTEComponent,
          TotalNotFilledStaticsReportComponent,
          SecretaryFinalCheckListMGOneComponent,
          DtcoursemasterComponent,
    UserManualDocumentMasterComponent,
    GenerateReceiptListDTEComponent,
    DocumentScrutinyStepIIApplicationsComponent,
    ApplicationPDFComponent,
    ApplyNOCMGOneComponent,
    JDACCEApplicationListDCEComponent,
    CheckListSecretaryDCEComponent,
    RevertCheckListDTEComponent,
    DTECommitteApplicationListComponent,
    FinalCheckListDTEComponent,
    ActivityDetailsComponent,
    PreviewActivityDetailsComponent,
    OfficersDetailsComponent,
    AddressComponent,
    ResidentialFacilityComponent,
    RegionalCentersComponent,
    OffShoreCenterComponent,
    FacultyComponent,
    DTEStatisticsDepartmentComponent,
    RegularModeComponent,
    DistanceModeComponent,
    StudentEnrollmentDistanceModeComponent,
    PlacementDetailsComponent,
    FinancialDetailsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    //ReactiveFormsModule,
    BrowserAnimationsModule,
    //NgbPopoverModule,
    //MatPaginatorModule,
    //MatSortModule,
    //MatTableModule,
    MatTabsModule, 
    //FormsModule,
    //NgbPopoverModule,
    /*MatStepperModule,*/
    FormsModule,
    ReactiveFormsModule,
    //MatFormFieldModule,
    //MatInputModule,
    //MatButtonModule,
    //MatIconModule,
    RouterModule, 
    NgMultiSelectDropDownModule.forRoot(),
    AutocompleteLibModule,
    NgIdleModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    NewGrievanceModule,
    NgbModule
  ],
  //exports: [TableSearchFilterPipe],
  //exports: [LoaderModule],
  //providers: [],
  providers: [NgbActiveModal,
    {
      provide: '',
      useValue: { displayDefaultIndicatorType: false },

    },
    {
      provide: APP_BASE_HREF, useValue: '/' 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
