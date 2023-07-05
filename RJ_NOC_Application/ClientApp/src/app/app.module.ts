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
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
 
import { CreateUserComponent } from './Views/Master/UserMaster/create-user/create-user.component';
import { ApplicationSummaryComponent } from './Views/ApplicationSummary/application-summary/application-summary.component';
import { ApplyNocParameterComponent } from './Views/Master/apply-noc-parameter/apply-noc-parameter.component';
import { ApplyNOCPreviewComponent } from './Views/apply-nocpreview/apply-nocpreview.component';
import { PreviewRNCRegistratComponent } from './Views/PreviewTabs/preview-rncregistrat/preview-rncregistrat.component';
import { ApplyNOCApplicationListComponent } from './Views/apply-nocapplication-list/apply-nocapplication-list.component';
import { ApplyNOCJointSecPreviewComponent } from './Views/apply-nocjoint-sec-preview/apply-nocjoint-sec-preview.component';
import { ApplyNOCSecretaryPreviewComponent } from './Views/apply-nocsecretary-preview/apply-nocsecretary-preview.component';
import { ApplyNocParameterDetailsComponent } from './Views/Master/apply-noc-parameter-details/apply-noc-parameter-details.component';
import { ScurtenyComitteeComponent } from './Views/ScurtenyComittee/scurteny-comittee/scurteny-comittee.component';
import { PreviewLegalEntityComponent } from './Views/PreviewTabs/preview-legal-entity/preview-legal-entity.component';
import { PreviewCollegeComponent } from './Views/PreviewTabs/preview-college/preview-college.component';

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
    //LoaderModule,
    ApplyNOCJointSecPreviewComponent,
    ApplyNOCSecretaryPreviewComponent,
    ApplyNocParameterComponent,
    PreviewRNCRegistratComponent,
    ScurtenyComitteeComponent,
    PreviewLegalEntityComponent,
    PreviewCollegeComponent
    PreviewScurtenyComitteeComponent,
    PreviewRNCRegistratComponent,
    ApplyNocParameterDetailsComponent

  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbPopoverModule,
    //DataTablesModule,
    //AutocompleteLibModule,
    MatTabsModule,
    FormsModule,
    NgbPopoverModule,
    NgMultiSelectDropDownModule.forRoot(),
    //NgSelect2Module,
    //ChartsModule,
    //NgbPopoverModule,
    //BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })


  ],
  //exports: [TableSearchFilterPipe],
  //exports: [LoaderModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
