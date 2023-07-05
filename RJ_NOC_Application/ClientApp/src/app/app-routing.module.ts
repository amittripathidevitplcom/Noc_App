import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { ApplyNOCJointSecPreviewComponent } from './Views/apply-nocjoint-sec-preview/apply-nocjoint-sec-preview.component';
import { ApplyNOCSecretaryPreviewComponent } from './Views/apply-nocsecretary-preview/apply-nocsecretary-preview.component';
import { ScurtenyComitteeComponent } from './Views/ScurtenyComittee/scurteny-comittee/scurteny-comittee.component';
import { PreviewLegalEntityComponent } from './Views/PreviewTabs/preview-legal-entity/preview-legal-entity.component';
import { PreviewCollegeComponent } from './Views/PreviewTabs/preview-college/preview-college.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent
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
    path: '',
    component: MasterPageComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent
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
        path: 'addcollege', component: AddCollegeComponent

      },
      {
        path: 'addcollege/:CollegeID', component: AddCollegeComponent

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
        path: 'applicationdetailentry/:DepartmentID/:CollegeID', component: ApplicationDetailEntryComponent
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
      }      ,
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
        path: 'appnocpreview/:DepartmentID/:CollegeID/:ApplyNOCID', component: ApplyNOCPreviewComponent
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
    ]
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
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
