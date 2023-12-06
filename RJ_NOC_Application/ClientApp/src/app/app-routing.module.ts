import { NgModule } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Route, RouterModule, RouterStateSnapshot, Routes, withDisabledInitialNavigation, withEnabledBlockingInitialNavigation } from '@angular/router';
import { ApplicationListComponent } from './Views/application-list/application-list.component';
import { ApplicationDetailEntryComponent } from './Views/ApplicationDetailEntry/application-detail-entry/application-detail-entry.component';
import { CollegeDetailsComponent } from './Views/college-details/college-details.component';
import { AddCollegeComponent } from './Views/CollegeDetailsForm/add-college/add-college.component';
import { AddCoursesComponent } from './Views/CollegeDetailsForm/add-courses/add-courses.component';
import { BasicBscNursingComponent } from './Views/CollegeDetailsForm/basic-bsc-nursing/basic-bsc-nursing.component';
import { BScNCollegeOfNursingComponent } from './Views/CollegeDetailsForm/bsc-ncollege-of-nursing/bsc-ncollege-of-nursing.component';

import { GNMSchOfNursingComponent } from './Views/CollegeDetailsForm/gnmsch-of-nursing/gnmsch-of-nursing.component';
import { DashboardComponent } from './Views/dashboard/dashboard.component';
import { GNMSchoolOfNursingComponent } from './Views/GuidsAndMinRequired/gnmschool-of-nursing/gnmschool-of-nursing.component';
import { MScNursingProgrammeComponent } from './Views/GuidsAndMinRequired/msc-nursing-programme/msc-nursing-programme.component';
import { OpenBScNCollegeOfNursingComponent } from './Views/GuidsAndMinRequired/open-bsc-ncollege-of-nursing/open-bsc-ncollege-of-nursing.component';
import { PostBasicBScNCollegeOfNursingComponent } from './Views/GuidsAndMinRequired/post-basic-bsc-ncollege-of-nursing/post-basic-bsc-ncollege-of-nursing.component';
import { LegalEntityComponent } from './Views/legal-entity/legal-entity.component';
import { LoginComponent } from './Views/login/login.component';
import { ProjectMasterComponent } from './Views/Master/project-master/project-master.component';
import { AddRoleMasterComponent } from './Views/Master/add-role-master/add-role-master.component';
import { CreateRoleMappingComponent } from './Views/Master/RoleMaster/create-role-mapping/create-role-mapping.component';
import { RoleMappingMasterComponent } from './Views/Master/RoleMaster/role-mapping-master/role-mapping-master.component';
import { AddUserComponent } from './Views/Master/UserMaster/add-user/add-user.component';
import { AddUserModule } from './Views/Master/UserMaster/add-user/add-user.module';
import { UserListComponent } from './Views/Master/UserMaster/user-list/user-list.component';
//import { MedicalGroupSubDetailsComponent } from './Views/medical-group-sub-details/medical-group-sub-details.component';
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
import { MasterPageComponent } from './Views/Shared/master-page/master-page.component';
import { PageNotFoundComponent } from './Views/Shared/page-not-found/page-not-found.component';
import { SSOLoginComponent } from './Views/SSOLogin/ssologin/ssologin.component';
import { FacilityDetailsComponent } from './Views/TabDetail/facility-details/facility-details.component';
import { LandDetailsComponent } from './Views/TabDetail/land-details/land-details.component';
import { RequiredDocumentComponent } from './Views/TabDetail/required-document/required-document.component';
import { HospitalDetailComponent } from './Views/TabDetail/hospital-detail/hospital-detail.component';
import { BuildingDetailsComponent } from './Views/TabDetail/building-details/building-details.component';
import { DraftApplicationListComponent } from './Views/DraftApplicationList/draft-application-list/draft-application-list.component';
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
import { TotalLegalEntityPreviewComponent } from './Views/NoOfficer/total-legal-entity-preview/total-legal-entity-preview.component';

import { ApplicationPreviewComponent } from './Views/ApplicationPreview/application-preview/application-preview.component';
import { ApplyNOCApplicationListComponent } from './Views/apply-nocapplication-list/apply-nocapplication-list.component';
import { WorkFlowMasterComponent } from './Views/Admin/work-flow-master/add-work-flow-master/work-flow-master.component';
import { WorkFlowMasterListComponent } from './Views/Admin/work-flow-master/work-flow-master-list/work-flow-master-list.component';
import { ApplicationSummaryComponent } from './Views/ApplicationSummary/application-summary/application-summary.component';
import { ApplyNocParameterComponent } from './Views/Master/apply-noc-parameter/apply-noc-parameter.component';
import { ApplyNOCPreviewComponent } from './Views/apply-nocpreview/apply-nocpreview.component';

import { PreviewRNCRegistratComponent } from './Views/PreviewTabs/preview-rncregistrat/preview-rncregistrat.component';

import { CreateUserComponent } from './Views/Master/UserMaster/create-user/create-user.component';
import { CommitteeMasterComponent } from './Views/Master/CommitteeMaster/AddCommitteeMaster/committee-master.component';
import { CommitteeMasterListComponent } from './Views/Master/CommitteeMaster/CommitteeMasterList/committee-master-list.component';
import { ApplyNOCJointSecPreviewComponent } from './Views/apply-nocjoint-sec-preview/apply-nocjoint-sec-preview.component';
import { ApplyNOCSecretaryPreviewComponent } from './Views/apply-nocsecretary-preview/apply-nocsecretary-preview.component';
import { ScurtenyComitteeComponent } from './Views/ScurtenyComittee/scurteny-comittee/scurteny-comittee.component';
import { PreviewLegalEntityComponent } from './Views/PreviewTabs/preview-legal-entity/preview-legal-entity.component';
import { PreviewCollegeComponent } from './Views/PreviewTabs/preview-college/preview-college.component';
import { ApplyNocParameterDetailsComponent } from './Views/Master/apply-noc-parameter-details/apply-noc-parameter-details.component';
import { RevertApplyNOCApplicationListComponent } from './Views/revert-apply-nocapplication-list/revert-apply-nocapplication-list.component';
import { CollegeManagementSocietyComponent } from './Views/PreviewTabs/college-management-society/college-management-society.component';
import { ApplyNOCFDRDetailsComponent } from './Views/Master/apply-nocfdrdetails/apply-nocfdrdetails.component';
import { NocPaymentComponent } from './Views/noc-payment/payment-request/noc-payment.component';
import { PaymentSuccessComponent } from './Views/noc-payment/payment-success/payment-success.component'
import { DocumentScrutinyCompletedReportComponent } from './Views/DocumentScrutinyTab/document-scrutiny-completed-report/document-scrutiny-completed-report.component';
import { RNCCheckListMasterComponent } from './Views/Master/rnccheck-list-master/rnccheck-list-master.component';
import { UserRoleRightsComponent } from './Views/Master/RoleMaster/user-role-rights/user-role-rights.component';
import { PreviewPaymentDetailComponent } from './Views/PreviewTabs/preview-payment-detail/preview-payment-detail.component';
import { DocumentScrutinyCheckListDetailsComponent } from './Views/DocumentScrutinyTab/document-scrutiny-check-list-details/document-scrutiny-check-list-details.component';
import { JointApplicationListComponent } from './Views/joint-application-list/joint-application-list.component';

import { ApplyNOCJointSecretaryListComponent } from './Views/apply-nocjoint-secretary-list/apply-nocjoint-secretary-list.component';
import { ApplyNOCSecretaryListComponent } from './Views/apply-nocsecretary-list/apply-nocsecretary-list.component';
import { CommiteeInspectionComponent } from './Views/commitee-inspection/commitee-inspection.component';
import { EmitraPaymentResponseComponent } from './Views/noc-payment/emitra-payment-response/emitra-payment-response.component'

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
import { CourseMasterComponent } from './Views/Master/CourseMaster/course-master.component';
import { ParamedicalHospitalDetailComponent } from './Views/TabDetail/paramedical-hospital-detail/paramedical-hospital-detail.component';
import { ClassWiseStudentDetailsComponent } from './Views/ClassWiseStudentDetails/class-wise-student-details/class-wise-student-details.component';
import { PreviewParamedicalHospitalDetailComponent } from './Views/PreviewTabs/preview-paramedical-hospital-detail/preview-paramedical-hospital-detail.component';
import { DocumentScrutinyParamedicalHospitalDetailComponent } from './Views/DocumentScrutinyTab/document-scrutiny-paramedical-hospital-detail/document-scrutiny-paramedical-hospital-detail.component';
import { DocumentScrutinyComponent } from './Views/DCE/document-scrutiny/document-scrutiny.component';
import { ApplyNocpreviewAnimalhusbandryComponent } from './Views/apply-nocpreview-animalhusbandry/apply-nocpreview-animalhusbandry.component';
import { ApplyNocpreviewAgricultureComponent } from './Views/apply-nocpreview-agriculture/apply-nocpreview-agriculture.component';
import { SubjectWiseStudentStatisticsComponent } from './Views/SubjectWiseStudentStatistics/subject-wise-student-statistics/subject-wise-student-statistics.component'
import { InspectionCommitteePhysicalVerificationDCEComponent } from './Views/DCE/inspection-committee-physical-verification-dce/inspection-committee-physical-verification-dce.component';
import { NodalOfficerApplicationListComponent } from './Views/DCE/nodal-officer-application-list/nodal-officer-application-list.component';
//import { AhDocumentScrutinyForwardToCommetteReportComponent } from './Views/DocumentScrutinyTab_AH/ahDocumentScrutinyForwardToCommetteReport/ah-document-scrutiny-forward-to-commette-report/ah-document-scrutiny-forward-to-commette-report.component';
import { AhInspectionCommitteePhysicalVerificationComponent } from './Views/DocumentScrutinyTab_AH/ah-inspection-committee-physical-verification/ah-inspection-committee-physical-verification.component';
import { AhPreVerificationDoneListComponent } from './Views/DocumentScrutinyTab_AH/ah-pre-verification-done-list/ah-pre-verification-done-list.component';
import { AhApplyNocApplicationListComponent } from './Views/ahApplyNocApplicationList/ah-apply-noc-application-list/ah-apply-noc-application-list.component';
import { AhDocumentScrutinyForwardCommetteComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-forward-commette/ah-document-scrutiny-forward-commette.component';
import { IssuedNOCReportComponent } from './Views/Reports/Medical/issued-noc-report/issued-noc-report.component';
import { DceDocumentScrutinyCompletedReportComponent } from './Views/Reports/DCE/dce-document-scrutiny-completed-report/dce-document-scrutiny-completed-report.component';
import { RevertedApplicationListComponent } from './Views/RevertedApllication/reverted-application-list/reverted-application-list.component';
import { AhPhysicalPostVerificationComponent } from './Views/DocumentScrutinyTab_AH/ah-physical-post-verification/ah-physical-post-verification.component';
import { AhPostVerificationDoneListComponent } from './Views/DocumentScrutinyTab_AH/ah-post-verification-done-list/ah-post-verification-done-list.component';
import { AhPhysicalFinalVerificationComponent } from './Views/DocumentScrutinyTab_AH/ah-physical-final-verification/ah-physical-final-verification.component';
import { AhFinalVerificationDoneListComponent } from './Views/DocumentScrutinyTab_AH/ah-final-verification-done-list/ah-final-verification-done-list.component';
import { AhFinalNocApplicationListComponent } from './Views/DocumentScrutinyTab_AH/ah-final-noc-application-list/ah-final-noc-application-list.component';
import { AhDocumentScrutinyNodalOfficerComponent } from './Views/DocumentScrutinyTab_AH/ah-document-scrutiny-nodal-officer/ah-document-scrutiny-nodal-officer.component';
import { OneStepRevertBackComponent } from './Views/one-step-revert-back/one-step-revert-back.component';
import { Observable } from 'rxjs';
import { SkipLocationChangeGuard } from './Common/auth.guard.ts';
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
import { LOIFeeMasterComponent } from './Views/Master/loifee-master/loifee-master.component'
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
import { DocumentScrutinyMGOneComponent } from './Views/DocumentScrutinyTab_MG1/document-scrutiny-mgone/document-scrutiny-mgone.component';
import { DocumentScrutinyListMGOneComponent } from './Views/Medical Group 1/document-scrutiny-list-mgone/document-scrutiny-list-mgone.component';
import { NodalSecretaryApplicationListMGOneComponent } from './Views/Medical Group 1/nodal-secretary-application-list-mgone/nodal-secretary-application-list-mgone.component';
import { OSDApplicationListMGOneComponent } from './Views/Medical Group 1/osdapplication-list-mgone/osdapplication-list-mgone.component';
import { ApplicationFinalCheckListMGOneComponent } from './Views/Medical Group 1/application-final-check-list-mgone/application-final-check-list-mgone.component';
import { ForwardByMinisterListMGOneComponent } from './Views/Medical Group 1/forward-by-minister-list-mgone/forward-by-minister-list-mgone.component';
import { DeputySecretaryListMGOneComponent } from './Views/Medical Group 1/deputy-secretary-list-mgone/deputy-secretary-list-mgone.component';
import { GenerateLOIReportMGOneComponent } from './Views/Medical Group 1/generate-loireport-mgone/generate-loireport-mgone.component';
import { IssuedLOIReportMGOneComponent } from './Views/Medical Group 1/issued-loireport-mgone/issued-loireport-mgone.component';
import { RevertApplicationDetailEntryMGOneComponent } from './Views/Medical Group 1/revert-application-detail-entry-mgone/revert-application-detail-entry-mgone.component';
import { CollegeManagementSocietyRevertComponent } from './Views/college-management-society-revert/college-management-society-revert.component';
import { ClassWiseStaticReportDCEComponent } from './Views/DCE/class-wise-static-report-dce/class-wise-static-report-dce.component';
import { SubjectWiseStaticReportDCEComponent } from './Views/DCE/subject-wise-static-report-dce/subject-wise-static-report-dce.component';
import { StatisticsEntryComponent } from './Views/Statistics/statistics-entry/statistics-entry.component';
import { StatisticsCollegeListComponent } from './Views/Statistics/statistics-college-list/statistics-college-list.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  }
  , {
    path: 'NocInformation/:SearchRecordID', component: NocInformationComponent,
  },
  {
    path: 'ssologin/:id1/:id2', component: SSOLoginComponent
  },
  {
    path: 'ssologin/:id1', component: SSOLoginComponent
  },
  {
    path: 'ssologin', component: SSOLoginComponent
  },
  {
    path: 'paymentsuccess/:TransID', component: PaymentSuccessComponent
  },
  {
    path: 'paymentfailed/:TransID', component: PaymentSuccessComponent
  },
  {
    path: 'paymentstatus/:TransID', component: EmitraPaymentResponseComponent
  },
  {
    path: '', component: MasterPageComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent,

      },
      {
        path: 'projectmaster', component: ProjectMasterComponent
      },
      {
        path: 'adduser', component: AddUserComponent

      },
      {
        path: 'userlist', component: UserListComponent
      },
      {
        path: 'addrolemaster', component: AddRoleMasterComponent
      },
      {
        path: 'rolemapping', component: RoleMappingMasterComponent
      },
      {
        path: 'createrolemapping', component: CreateRoleMappingComponent
      },
      {
        path: 'totaltrust', component: TotalTrustComponent
      },
      {
        path: 'totalcollege', component: TotalCollegeComponent
      },
      {
        path: 'totaldraftapplication', component: TotalDraftApplicationComponent
      },
      {
        path: 'submittedapplication', component: SubmittedApplicationComponent
      },
      {
        path: 'partialfiledapplication', component: PartialFiledApplicationComponent
      },
      {
        path: 'documentinspectioninprocess', component: DocumentInspectionInProcessComponent
      },
      {
        path: 'physicalinspectioninprocess', component: PhysicalInspectionInProcessComponent
      },
      {
        path: 'applicationswithnodalofficer', component: ApplicationswithNodalOfficerComponent
      },
      {
        path: 'applicationswithjointdirector', component: ApplicationwithJointDirectorComponent
      },
      {
        path: 'applicationwithadditionaldirector', component: ApplicationwithAdditionalDirectorComponent
      },
      {
        path: 'nocissued', component: NOCIssuedComponent
      },
      {
        path: 'deficiencymarked', component: DeficiencyMarkedComponent
      },
      {
        path: 'collegedetail', component: CollegeDetailsComponent
      },
      {
        path: 'legalentity', component: LegalEntityComponent
      }
      ,
      {
        path: 'legalentity/:LegalEntityID', component: LegalEntityComponent
      },
      {
        path: 'postbasicbscncollegeofnursing', component: PostBasicBScNCollegeOfNursingComponent
      },
      {
        path: 'openbscncollegeofnursing', component: OpenBScNCollegeOfNursingComponent
      },

      {
        path: 'gnmschoolofnursing', component: GNMSchoolOfNursingComponent
      },
      {
        path: 'applicationlist', component: ApplicationListComponent
      },

      {
        path: 'addcourses', component: AddCoursesComponent

      },
      {
        path: 'dteaddcourses', component: DteAddCourseComponent

      },
      {
        path: 'addcollege', component: AddCollegeComponent,
        //canActivate: [RedirectGuard]
      },
      {
        //path: 'addcollege/:CollegeID', component: AddCollegeComponent,

        //data: { redirectTo: '/adc' }
        path: 'addcollege/:CollegeID', component: AddCollegeComponent,
        //data: {
        //  redirectTo: "/people" // <--- absolute redirect to PEOPLE route.
        //}
      },
      {
        path: 'basicbscnursing', component: BasicBscNursingComponent
      },
      {
        path: 'gnmschofnursing', component: GNMSchOfNursingComponent
      },
      {
        path: 'bscncollegeofnursing', component: BScNCollegeOfNursingComponent
      },
      //{
      //  path: 'medicalgroupsubdetails', component: MedicalGroupSubDetailsComponent
      //},

      {
        path: 'mscnursingprogramme', component: MScNursingProgrammeComponent
      },
      {
        path: 'mscnursingprogramm', component: MScNursingProgrammeComponent
      },

      {
        path: 'draftapplicationlist', component: DraftApplicationListComponent
      },
      {
        path: 'landdetails', component: LandDetailsComponent
      },

      {
        path: 'facilitydetails', component: FacilityDetailsComponent
      },
      //{
      //  path: 'requireddocument', component: RequiredDocumentComponent
      //},
      {
        path: 'hospitaldetails', component: HospitalDetailComponent
      },
      {
        path: 'buildingdetails', component: BuildingDetailsComponent
      },
      {
        path: 'applicationdetailentry/:DepartmentID/:CollegeID', component: ApplicationDetailEntryComponent,
        pathMatch: 'full'
        // canActivate: [NeverActivate]
        //canActivate: [RedirectGuard],
        //data: {
        //  externalUrl: "http://localhost:4200/applicationdetailentry/3/1"
        //}
      },
      {
        path: 'applicationdetailentry/:DepartmentID/:CollegeID/:ApplyNOCID/:Status', component: RevertApplicationDetailEntryComponent,
        pathMatch: 'full'
        // canActivate: [NeverActivate]
        //canActivate: [RedirectGuard],
        //data: {
        //  externalUrl: "http://localhost:4200/applicationdetailentry/3/1"
        //}
      },
      {
        path: 'applicationdetailentrymgone/:DepartmentID/:CollegeID/:ApplyNOCID/:Status', component: RevertApplicationDetailEntryMGOneComponent,
        pathMatch: 'full'
      },
      {
        path: 'applynoc', component: ApplyNOCComponent
      },
      {
        path: 'trusteegeneralinfo', component: TrusteeGeneralInfoComponent
      },

      {
        path: 'parliamentareamaster', component: ParliamentAreaMasterComponent
      },
      {
        path: 'assemblyareamaster', component: AssemblyAreaMasterComponent
      },
      {
        path: 'commonmaster', component: CommonMasterComponent
      },
      {
        path: 'societydetails', component: SocietyComponent
      },
      {
        path: 'universitymaster', component: UniversityComponent
      },
      {
        path: 'landareasituated', component: LandAreaSituatedComponent
      },
      {
        path: 'facilitiesmaster', component: FacilitiesComponent
      },
      {
        path: 'qualificationmaster', component: QualificationMasterComponent
      },
      {
        path: 'subjectmaster', component: SubjectMasterComponent
      },
      {
        path: 'documentmaster', component: DocumentMasterComponent
      }
      ,
      {
        path: 'workflowmaster', component: WorkFlowMasterComponent
      }
      ,
      {
        path: 'workflowmasterlist', component: WorkFlowMasterListComponent
      },
      {
        path: 'workflowmaster', component: WorkFlowMasterComponent
      },
      {
        path: 'workflowmasterlist', component: WorkFlowMasterListComponent
      },
      {
        path: 'workflowmaster/:id', component: WorkFlowMasterComponent
      },
      {
        path: 'applicationpreview/:DepartmentID/:CollegeID', component: ApplicationPreviewComponent
      },
      {
        path: 'applicationsummary/:DepartmentID/:CollegeID', component: ApplicationSummaryComponent
      },
      {
        path: 'applynocapplicationlist', component: ApplyNOCApplicationListComponent
      },
      {
        path: 'createuser', component: CreateUserComponent
      },
      {
        path: 'totallegalentitypreview', component: TotalLegalEntityPreviewComponent
      },
      {
        path: 'applynocforparameter', component: ApplyNocParameterComponent
      },
      {
        path: 'appnocpreview/:DepartmentID/:CollegeID/:ApplyNOCID/:ApplicationNo', component: ApplyNOCPreviewComponent
      },
      {
        path: 'appnocpreview/:DepartmentID/:CollegeID/:ApplyNOCID/:ApplicationNoYear/:ApplicationNoID', component: ApplyNOCPreviewComponent
      },
      {
        path: 'applynocjointsec/:DepartmentID/:CollegeID/:ApplyNOCID', component: ApplyNOCJointSecPreviewComponent
      },
      {
        path: 'applynocsecretary/:DepartmentID/:CollegeID/:ApplyNOCID', component: ApplyNOCSecretaryPreviewComponent
      },
      {
        path: 'rncRegistratPreview/:DepartmentID/:CollegeID', component: PreviewRNCRegistratComponent
      },
      {
        path: 'scurtenyComittee', component: ScurtenyComitteeComponent
      },
      {
        path: 'previewLegalEntity/:SSOLoginUser', component: PreviewLegalEntityComponent
      },
      {
        path: 'previewCollege/:CollegeID', component: PreviewCollegeComponent
      },
      {
        path: 'applynocapplicationdetail', component: ApplyNocParameterDetailsComponent
      },
      {
        path: 'committeemaster', component: CommitteeMasterComponent
      },
      {
        path: 'committeemasterlist', component: CommitteeMasterListComponent
      },
      {
        path: 'committeemaster/:id', component: CommitteeMasterComponent
      },
      {
        path: 'revertapplynoclist', component: RevertApplyNOCApplicationListComponent
      },
      {
        path: 'previewcollegesociety', component: CollegeManagementSocietyComponent
      },
      {
        path: 'NocPayment', component: NocPaymentComponent
      },
      {
        path: 'applynocfdrdetails', component: ApplyNOCFDRDetailsComponent
      },
      {
        path: 'documentscrutinycompletedreport', component: DocumentScrutinyCompletedReportComponent
      },
      {
        path: 'documentscrutinyrejectedreport', component: DocumentScrutinyRejectedReportComponent
      },
      {
        path: 'documentscrutinyrevertedreport', component: DocumentScrutinyRevertedReportComponent
      },
      {
        path: 'rncchekclistmaster', component: RNCCheckListMasterComponent
      },

      {
        path: 'userrolerights/:RoleID', component: UserRoleRightsComponent
      },
      {
        path: 'previewpaymentDetail', component: PreviewPaymentDetailComponent
      },

      {
        path: 'checklistpreview/:DepartmentID/:CollegeID/:ApplyNOCID', component: DocumentScrutinyCheckListDetailsComponent
      },
      {
        path: 'jointapplicationlist', component: JointApplicationListComponent
      },
      {
        path: 'jointsecretaryapplicationlist', component: ApplyNOCJointSecretaryListComponent
      },
      {
        path: 'secretaryapplicationlist', component: ApplyNOCSecretaryListComponent
      },


      {
        path: 'commiteeinspection', component: CommiteeInspectionComponent
      },
      {
        path: 'animalmaster', component: AnimalMasterComponent
      },
      {
        path: 'veterinaryhospital/:DepartmentID/:CollegeID', component: VeterinaryHospitalComponent
      },
      {
        path: 'streamsubjectmapping', component: StreamSubjectMappingComponent
      },


      {
        path: 'jointsecretarycompletedreport', component: JointSecretaryCompletedReportComponent
      },
      {
        path: 'jointsecretaryrejectedreport', component: JointSecretaryRejectedReportComponent
      },
      {
        path: 'secretaryrejectedreport', component: SecretaryRejectedReportComponent
      },
      {
        path: 'secretarycompletedreport', component: SecretaryCompletedReportComponent
      },
      {
        path: 'committeecompletedreport', component: CommitteeCompletedReportComponent
      },
      {
        path: 'committeerejectedreport', component: CommitteeRejectedReportComponent
      },
      {
        path: 'jointsecretarypendingnocreport', component: JointSecretaryPendingNOCReportComponent
      },
      {
        path: 'committeeforwardreport', component: CommitteeForwardReportComponent
      },
      {
        path: 'committeeforwardreport/:Committee', component: CommitteeForwardReportComponent
      },
      {
        path: 'applynoccompletedreport', component: ApplyNOCCompletedReportComponent
      },
      {
        path: 'farmlanddetails', component: FarmLandDetailsComponent
      },
      {
        path: 'coursemaster', component: CourseMasterComponent
      },
      {
        path: 'paramedicalhospitaldetail/:DepartmentID/:CollegeID', component: ParamedicalHospitalDetailComponent
      },
      {
        path: 'classwisestudentdetail', component: ClassWiseStudentDetailsComponent
      },
      {
        path: 'previewparamedicalhospitaldetail/:DepartmentID/:CollegeID', component: PreviewParamedicalHospitalDetailComponent
      },
      {
        path: 'documentscrutinyparamedicalhospitaldetail/:DepartmentID/:CollegeID', component: DocumentScrutinyParamedicalHospitalDetailComponent
      },
      {
        path: 'animalhusbandryappnocpreview/:DepartmentID/:CollegeID/:ApplyNOCID/:ApplicationNoYear/:ApplicationNoID', component: ApplyNocpreviewAnimalhusbandryComponent
      },
      {
        path: 'documentscrutiny/:DepartmentID/:CollegeID/:ApplyNOCID/:ApplicationNo', component: DocumentScrutinyComponent
      },
      {
        path: 'documentscrutiny/:DepartmentID/:CollegeID/:ApplyNOCID/:ApplicationNoYear/:ApplicationNoID', component: DocumentScrutinyComponent
      },
      {
        path: 'documentscrutiny/:DepartmentID/:CollegeID/:ApplyNOCID/:ApplicationNoYear/:ApplicationNoID/:Status', component: DocumentScrutinyComponent
      },
      {
        path: 'agricultureappnocpreview/:DepartmentID/:CollegeID/:ApplyNOCID/:ApplicationNoYear/:ApplicationNoID', component: ApplyNocpreviewAgricultureComponent
      },
      {
        path: 'subjectwisestudentstatistics', component: SubjectWiseStudentStatisticsComponent
      }
      ,
      {
        path: 'inspectioncommitteephysicalverification/:Status', component: InspectionCommitteePhysicalVerificationDCEComponent
      },
      {
        path: 'nodalofficerapplicationlist/:Status', component: NodalOfficerApplicationListComponent
      },
      {
        path: 'dceapplicationlist/:Status', component: NodalOfficerApplicationListComponent
      },
      {
        path: 'documentscrutinyForwardToCommiteereport', component: AhDocumentScrutinyForwardCommetteComponent
      },

      {
        path: 'AHinspectioncommitteephysicalverification/:Status', component: AhInspectionCommitteePhysicalVerificationComponent
      },
      {
        path: 'AHPreVerificationDoneList/:Status', component: AhPreVerificationDoneListComponent
      },
      {
        path: 'issuednocreport', component: IssuedNOCReportComponent
      },
      {
        path: 'applynocapplicationlistAH', component: AhApplyNocApplicationListComponent
      },
      {
        path: 'dceapplicationreport/:Status', component: DceDocumentScrutinyCompletedReportComponent
      },
      {
        path: 'revertedapplicationlist', component: RevertedApplicationListComponent
      },
      {
        path: 'rejectedapplicationlist', component: RejectedApplicationListComponent
      },
      {
        path: 'AHinspectioncommitteephysicalverification/:Status', component: AhInspectionCommitteePhysicalVerificationComponent
      },
      {
        path: 'AHinspectioncommitteepostverification/:Status', component: AhPhysicalPostVerificationComponent
      },
      {
        path: 'AHPostVerificationDoneList/:Status', component: AhPostVerificationDoneListComponent
      },

      {
        path: 'AHinspectioncommitteefinalverification/:Status', component: AhPhysicalFinalVerificationComponent
      },
      {
        path: 'AHFinalVerificationDoneList/:Status', component: AhFinalVerificationDoneListComponent
      },

      {
        path: 'AhFinalNocApplicationList/:Status', component: AhFinalNocApplicationListComponent
      },
      {
        path: 'animalhusbandryappnocviewByNodal/:DepartmentID/:CollegeID/:ApplyNOCID/:ApplicationNoYear/:ApplicationNoID/:Status', component: AhDocumentScrutinyNodalOfficerComponent
      },
      {
        path: 'onesteprevertbackapplist', component: OneStepRevertBackComponent
      },

      {
        path: 'loiapplicationlist', component: LOIApplicationListComponent
      },
      {
        path: 'commissionerapplicationscrutinylist/:Status', component: CommissionerApplicationScrutinyListComponent
      },
      {
        path: 'checklistforcommissioner/:DepartmentID/:CollegeID/:ApplyNOCID/:ApplicationNoYear/:ApplicationNoID', component: CheckListForCommissionerComponent
      },
      {
        path: 'checklistforcommissioner/:DepartmentID/:CollegeID/:ApplyNOCID', component: CheckListForCommissionerComponent
      },
      {
        path: 'revertchecklistdce/:DepartmentID/:CollegeID/:ApplyNOCID', component: RevertCheckListDCEComponent
      },
      {
        path: 'staffattendance', component: StaffattendanceComponent
      },
      {
        path: 'staffattendancereport', component: StaffAttendanceReportComponent
      },
      {
        path: 'test', component: CollegeDetailsComponent
      },
      {
        path: 'ImportExcelData', component: ImportExcelDataComponent,

      },
      {
        path: 'applynocapplicationlistAgri', component: AgriApplyNocApplicationListComponent
      },
      {
        path: 'AgriPriVerificationDone/:Status', component: AgriPriVerificationDoneListComponent
      },
      {
        path: 'AgriDsForwardToCommiteeList', component: AgriDsForwardToCommiteeListComponent
      },
      {
        path: 'AgriPIForwardToCommiteeList', component: AgriPIForwardToCommiteeListComponent
      },
      {
        path: 'DSCommitteePrimaryVerification/:Status', component: AgriDsCommitteePrimaryVerificationComponent
      },
      {
        path: 'AgriInsepctionPostVerification/:Status', component: AgriInsepctionPostVerificationComponent
      },
      {
        path: 'Previewbynodalofficer/:DepartmentID/:CollegeID/:ApplyNOCID/:ApplicationNoYear/:ApplicationNoID/:Status', component: AgriPreViewByNodalOfficerComponent
      },

      {
        path: 'AgriPostVerificationDoneList/:Status', component: AgriPostVerificationDoneListComponent
      },
      {
        path: 'AgriPSNocApplicationList/:Status', component: AgriPSNocApplicationListComponent
      },
      {
        path: 'paymenttransactionlist', component: PaymentTransactionComponent,

      }
      , {
        path: 'updatenocfees', component: UpdateNocFeesComponent,

      },
      {
        path: 'LOIapplicationsummary/:DepartmentID/:CollegeID', component: PreviewLOIapplicationdetailEntryComponent
      },
     
      {
        path: 'documentscrutinymgone/:DepartmentID/:CollegeID/:LOIID/:ApplicationNoYear/:ApplicationNoID/:Status', component: DocumentScrutinyMGOneComponent
      },
      {
        path: 'finalchecklistmgone/:DepartmentID/:CollegeID/:LOIID/:ApplicationNoYear/:ApplicationNoID/:Status', component: ApplicationFinalCheckListMGOneComponent
      },
      {
        path: 'documentscrutinylistmgone/:Status', component: DocumentScrutinyListMGOneComponent
      },
      {
        path: 'nodalsecretaryapplicationlistmgone/:Status', component: NodalSecretaryApplicationListMGOneComponent
      },
      {
        path: 'osdapplicationlistmgone/:Status', component: OSDApplicationListMGOneComponent
      },
      {
        path: 'forwardbyministerlistmgone/:Status', component: ForwardByMinisterListMGOneComponent
      },
      {
        path: 'deputysecretarylistmgone/:Status', component: DeputySecretaryListMGOneComponent
      },
      {
        path: 'generateloireportmgone/:Status', component: GenerateLOIReportMGOneComponent
      },
      {
        path: 'issuedloireportmgone', component: IssuedLOIReportMGOneComponent
      },
      {
        path: 'classwisestaticreport', component: ClassWiseStaticReportDCEComponent
      },
      {
        path: 'subjectwisestaticreport', component: SubjectWiseStaticReportDCEComponent
      },
      {
        path: 'LOIapplyentry/:DepartmentID/:CollegeID', component: LOIApplyEntryComponent,
        pathMatch: 'full'
        // canActivate: [NeverActivate]
        //canActivate: [RedirectGuard],
        //data: {
        //  externalUrl: "http://localhost:4200/applicationdetailentry/3/1"
        //}
      },
      {
        path: 'seatinformationmaster', component: SeatInformationMasterComponent
      },
      {
        path: 'loifeemaster', component: LOIFeeMasterComponent
      },
      {
        path: 'nocissuedreport', component: NOCIssuedReportComponent
      },
      {
        path: 'forwardedApplications', component: ForwardedApplicationListComponent
      },
      {
        path: 'statisticsentry/:DepartmentID/:CollegeID', component: StatisticsEntryComponent
      },

      {
        path: 'statisticscollegelist', component: StatisticsCollegeListComponent
      },
    ]
    // ,canActivate: [SkipLocationChangeGuard],
  },


  //Medical College Tab Routing
  //{
  //  path: 'landdetails', component: LandDetailsComponent
  //},
  //{
  //  path: 'facilitydetails', component: FacilityDetailsComponent
  //},
  //{
  //  path: 'requireddocument', component: RequiredDocumentComponent
  //},
  {
    path: '**', component: PageNotFoundComponent
  }


];
//const addLocationGuard = (r: Route): Route => r.redirectTo ? r : { ...r, canActivate: [SkipLocationChangeGuard] };
//const addLocationGuard = (r: ActivatedRoute): ActivatedRoute => (r.redirectTo: any) ?r: { ...r, canActivate: [SkipLocationChangeGuard] };

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  //imports: [
  //  RouterModule.forRoot(routes.map(addLocationGuard)),
  // // RouterModule.forRoot(routes.),
  // // RouterModule.bind(routes.map(addLocationGuard)),
  //],
  exports: [RouterModule]
})
export class AppRoutingModule { }



//class NeverActivate implements CanActivate {

//  canActivate(
//    route: ActivatedRouteSnapshot,
//    state: RouterStateSnapshot
//  ): Observable<boolean> | Promise<boolean> | boolean {
//    return false; // never allow activation
//  }
//}
