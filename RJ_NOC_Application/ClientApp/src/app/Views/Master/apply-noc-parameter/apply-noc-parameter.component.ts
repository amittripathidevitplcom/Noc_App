import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import {
  ApplyNocParameterCourseDataModel, ApplyNocParameterDataModel, ApplyNocParameterMasterListDataModel, ApplyNocParameterMasterList_AdditionofIntegratedDualDegree, ApplyNocParameterMasterList_BankDetails, ApplyNocParameterMasterList_ChangeInCoedtoGirls, ApplyNocParameterMasterList_ChangeInCollegeManagement, ApplyNocParameterMasterList_ChangeInGirlstoCoed, ApplyNocParameterMasterList_ChangeInNameOfCollege,
  ApplyNocParameterMasterList_ChangeInInspectionFee
  , ApplyNocParameterMasterList_ChangeInNameOfCourse, ApplyNocParameterMasterList_ChangeInNameofInstitution, ApplyNocParameterMasterList_ChangeInPlaceOfCollege, ApplyNocParameterMasterList_ChangeinNameofSociety, ApplyNocParameterMasterList_ChangeofSite_Location, ApplyNocParameterMasterList_ClosureOfCourses, ApplyNocParameterMasterList_ClosureOfProgram, ApplyNocParameterMasterList_CoursesforWorkingProfessionals, ApplyNocParameterMasterList_IncreaseInIntake_AdditionofCourse, ApplyNocParameterMasterList_IncreaseinIntakeAdditionofCourse, ApplyNocParameterMasterList_IntroductionOffCampus, ApplyNocParameterMasterList_MergerCollege, ApplyNocParameterMasterList_MergerOfTheCourse, ApplyNocParameterMasterList_MergerofInstitutions, ApplyNocParameterMasterList_ReductionInIntake, ApplyNocParameterMasterList_TostartNewProgramme, ApplyNocParameterMaster_AdditionOfNewSeats60DataModel, ApplyNocParameterMaster_TNOCExtensionDataModel, DefaulterCollegePenaltyDataModal
} from '../../../Models/ApplyNocParameterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Console } from 'console';
import internal from 'stream';
import { EnumDepartment } from '../../../Common/enum-noc';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';



@Component({
  selector: 'app-apply-noc-parameter',
  templateUrl: './apply-noc-parameter.component.html',
  styleUrls: ['./apply-noc-parameter.component.css']
})
export class ApplyNocParameterComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isFormValid: boolean = true;
  public draftApplicatoinListData: any = [];
  public searchText: string = '';

  // model popup
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public ApplicationTypeList: any = [];
  public CollegeList_ddl: any = [];
  public CollegeList: any = [];
  public ApplyNocParameterMasterList_ddl: any[] = [];
  public file: any = '';

  ddlCourse: number = 0;
  ddlCourseSubject: number = 0;

  ddlCourseTNOC: number = 0;
  ddlCoursePNOC: number = 0;

  // FormBuilder
  public ApplyNocParameterForm!: FormGroup;
  // login model
  sSOLoginDataModel = new SSOLoginDataModel();
  // model
  request = new ApplyNocParameterDataModel();



  totalNewSubjectFees: number = 0;

  totalTNOCSubjectFees: number = 0;
  totalPNOCSubjectFees: number = 0;
  TNOCParameterFees: number = 0;

  public DTE_CourseDataList: any = [];

  public ApplyNocParameterMasterList_TNOCExtension: ApplyNocParameterMaster_TNOCExtensionDataModel = null;
  public ApplyNocParameterMasterList_AdditionOfNewSeats60: ApplyNocParameterMaster_AdditionOfNewSeats60DataModel = null;
  public ApplyNocParameterMasterList_ChangeInNameOfCollege: ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
  public ApplyNocParameterMasterList_ChangeInInspectionFee: ApplyNocParameterMasterList_ChangeInInspectionFee = null;
  public ApplyNocParameterMasterList_ChangeInPlaceOfCollege: ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
  public ApplyNocParameterMasterList_ChangeInCoedtoGirls: ApplyNocParameterMasterList_ChangeInCoedtoGirls = null;
  public ApplyNocParameterMasterList_ChangeInGirlstoCoed: ApplyNocParameterMasterList_ChangeInGirlstoCoed = null;
  public ApplyNocParameterMasterList_ChangeInCollegeManagement: ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
  public ApplyNocParameterMasterList_MergerCollege: ApplyNocParameterMasterList_MergerCollege = null;
  public ApplyNocParameterMasterList_NewCourse: ApplyNocParameterMaster_TNOCExtensionDataModel = null;
  public ApplyNocParameterMasterList_NewCourseSubject: ApplyNocParameterMaster_TNOCExtensionDataModel = null;
  public ApplyNocParameterMasterList_TNOCExtOfSubject: ApplyNocParameterMaster_TNOCExtensionDataModel = null;
  public ApplyNocParameterMasterList_PNOCOfSubject: ApplyNocParameterMaster_TNOCExtensionDataModel = null;



  //Validation variable
  //change in name
  public isValidCollegeNewName_Eng: boolean = false;
  public isValidCollegeNewName_Hi: boolean = false;
  public isChangeInNameOfCollege_Document: boolean = false;
  //end change in name
  //change in place
  public isChangeInPlaceNewName: boolean = false;
  public isChangeInPlaceNameOfCollege_Document: boolean = false;
  public isChangeInPlaceNameOfCollege_PlaceDocument: boolean = false;
  //end change in place


  public isCoedtoGConsentDocument: boolean = false;
  //Change IN Grils COD
  public isConsentManagementDocument: boolean = false;

  public isConsentStudentDocument: boolean = false;


  public isSocietyProposal: boolean = false;
  public isAllNOC: boolean = false;
  public isUniversityAffiliation: boolean = false;
  public isConsentAffidavit: boolean = false;
  public isNOCAffiliationUniversity: boolean = false;


  //merger
  public isOtherAllNOC: boolean = false;
  public isOtherUniversityAffiliation: boolean = false;
  public isOtherNOCAffiliationUniversity: boolean = false;
  public isOtherConsentAffidavit: boolean = false;
  public isLandTitleCertificate: boolean = false;
  public isBuildingBluePrint: boolean = false;
  public isStaffInformation: boolean = false;

  public isNewSocietyName: boolean = false;
  public isCmDocumentName: boolean = false;
  public isAnnexureDocument: boolean = false;
  public TotalAppliedNOC: number = -1;

  public streamDataList: any = [];
  public CourseLevelList: any = [];

  public CourseDataList: any[] = [];
  public ExistingCourseDataList: any[] = [];

  public CourseDataListTNOC: any[] = [];
  public CourseDataListPNOC: any[] = [];


  public ddlStreamID: number = 0;
  public CourseLevelID: number = 0;


  public isShowGrid: boolean = true;
  public SubjectDetails: any[] = [];
  public NewSubjectDetails: any[] = [];
  public TNOCSubjectDetails: any[] = [];
  public PNOCSubjectDetails: any[] = [];



  public isAddNOCCourseSubject: boolean = false;
  public isAddNOCCourse: boolean = false;

  public isAddNOCCourseSubjectTNOC: boolean = false;
  public isAddNOCCoursePNOC: boolean = false;
  searchTextNewCourse: string = '';
  searchTextNewSubject: string = '';
  searchTextNewPNOC: string = '';
  searchTextNewTNOC: string = '';

  public isInspectionFee: boolean = false;
  public isAlreadyApplied: boolean = false;

  public DepartmentInspectionFee: number = 0;

  public TotalLateFees: number = 0;

  public isShowPriceDetails: boolean = false;
  public IsTermsChecked: boolean = false;
  public CollegeLableName: string = "College";

  public IsShowCollegeList: boolean = true;
  public IsShowApplyNocForm: boolean = false;
  public SelectedCollegeID: number = 0;
  public SelectedDepartmentID: number = 0;

  //DTE Validation Prop
  //Change in the Name of the Bank
  public isValidOldBankName: boolean = false;
  public isValidNewBankName: boolean = false;
  public isValidOldBranchName: boolean = false;
  public isValidNewBranchName: boolean = false;
  public isValidOldIFSC: boolean = false;
  public isValidNewIFSC: boolean = false;
  public isValidOldAccountNumber: boolean = false;
  public isValidNewAccountNumber: boolean = false;

  /*Change in the Minority Status of the Institution*/
  public isValidDTE_ChangeInTheMinorityStatusoftheInstitution: boolean = false;
  /*Merger of Institutions under the same Trust / Society / Company*/
  public isValidDTE_InstituteID2: boolean = false;
  public isValidDTE_MergeInstituteID: boolean = false;
  /*Change in the name of Trust / Society / Company*/
  public isValidDTE_NewName: boolean = false;
  public isValidDTE_SocietyNewAddress: boolean = false;

  /*Change in Name of Institution*/
  public isValidDTE_NewCollegeName: boolean = false;
  public isValidDTE_NewCollegeNameHi: boolean = false;
  public isValidDTE_NewAddress: boolean = false;

  public isValidDTE_NewTrustName: boolean = false;
  public isValidDTE_NewInstituteName: boolean = false;

  constructor(private draftApplicationListService: DraftApplicationListService, private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router,
    private applyNOCApplicationService: ApplyNOCApplicationService, private fileUploadService: FileUploadService, private modalService: NgbModal, private cdref: ChangeDetectorRef) {

  }

  async ngOnInit() {
    this.ApplyNocParameterForm = this.formBuilder.group({
      rbApplicationType: ['', Validators.required],
      ddlCollege: [{ value: '', disabled: true }, [DropdownValidators]],
      /*cbNocFor: ['', Validators.required],*/
      cbCourse_TNOCExtension: [''],
      cbSubject_TNOCExtension: [''],
      cbCourse_AdditionOfNewSeats60: [''],
      ddlCourse: ['', 0]
    });
    // load
    //Dte added Rishi Kapoor
    this.request.DTE_BankDetails = new ApplyNocParameterMasterList_BankDetails();
    this.request.DTE_MergerofInstitutions = new ApplyNocParameterMasterList_MergerofInstitutions();
    this.request.DTE_ChangeinNameofSociety = new ApplyNocParameterMasterList_ChangeinNameofSociety();
    this.request.DTE_IncreaseinIntakeAdditionofCourse = new ApplyNocParameterMasterList_IncreaseinIntakeAdditionofCourse();
    this.request.DTE_IncreaseinIntakeAdditionofCourse_List = [];
    this.request.DTE_ChangeInNameofInstitution = new ApplyNocParameterMasterList_ChangeInNameofInstitution();
    this.request.DTE_ChangeofSite_Location = new ApplyNocParameterMasterList_ChangeofSite_Location();

    this.request.DTE_TostartNewProgramme = new ApplyNocParameterMasterList_TostartNewProgramme();
    this.request.DTE_TostartNewProgramme_List = [];

    this.request.DTE_IncreaseInIntake_AdditionofCourse = new ApplyNocParameterMasterList_IncreaseInIntake_AdditionofCourse();
    this.request.DTE_IncreaseInIntake_AdditionofCourse_List = [];

    this.request.DTE_IntroductionOffCampus = new ApplyNocParameterMasterList_IntroductionOffCampus();
    this.request.DTE_IntroductionOffCampus_List = [];

    this.request.DTE_CoursesforWorkingProfessionals = new ApplyNocParameterMasterList_CoursesforWorkingProfessionals();
    this.request.DTE_CoursesforWorkingProfessionals_List = [];

    this.request.DefaulterCollegePenaltyDetailList = [];

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetCollegeList();
    await this.GetApplicationList();

    this.loaderService.requestEnded();
    setTimeout(function () { (window as any).LoadData(); }, 200)
  }

  get form() {
    return this.ApplyNocParameterForm.controls;
  }
  async ClickApplyNOC(DepartmentID: number, collegeID: number, FinalSubmit: boolean, PendingNOC: number) {
    if (FinalSubmit == false && PendingNOC == 0) {
      this.SelectedCollegeID = collegeID;
      this.SelectedDepartmentID = DepartmentID;
      this.IsShowApplyNocForm = true;
      this.IsShowCollegeList = false;
      this.request.CollegeID = collegeID;
      await this.College_ddlChange(null);
      await this.GetDTE_StreamDataList();
      await this.GetDTE_CourseLevelList();
      await this.GetDTE_StreamMasterDataList();
      await this.GetDTE_CourseLevelMasterList();
      await this.GetCollegeDeficiency();
    }
    else {
      this.routers.navigate(['/applynocapplicationdetail']);
    }
  }
  async BackToCollegeList() {
    this.IsShowCollegeList = true;
    this.IsShowApplyNocForm = false;
    this.SelectedCollegeID = 0;
    this.SelectedDepartmentID = 0;
    this.request.CollegeID = 0;
    await this.College_ddlChange(null);
  }

  async GetApplicationList() {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.CollegeDetails(this.sSOLoginDataModel.SSOID, 'NOC')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.draftApplicatoinListData = data['Data'][0]['data'];
          console.log(this.draftApplicatoinListData);

        }, (error: any) => console.error(error));
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

  async GetCollegeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(0, this.sSOLoginDataModel.SSOID, 'ApplyNocParameter')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          this.CollegeList_ddl = data['Data'];
        }, error => console.error(error));


      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(0, this.sSOLoginDataModel.SSOID, 'Society')
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeList = data['Data'];
          console.log(this.State);
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

  async GetApplicationTypeList(CollegeID: number) {
    try {
      this.request.ApplicationTypeID = 0;
      this.ApplicationTypeList = [];
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GetApplyNOCApplicationType(CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationTypeList = data['Data'];
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

  public CollegeDepartmentID: number = 0;
  async College_ddlChange(event: any) {
    try {
      this.TotalAppliedNOC = -1;
      //reset
      this.ApplyNocParameterMasterList_ddl = [];
      this.ApplyNocParameterMasterList_TNOCExtension = null;
      this.ApplyNocParameterMasterList_AdditionOfNewSeats60 = null;
      this.ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
      this.ApplyNocParameterMasterList_ChangeInInspectionFee = null;
      this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
      this.ApplyNocParameterMasterList_ChangeInGirlstoCoed = null;
      this.ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
      this.ApplyNocParameterMasterList_MergerCollege = null;
      this.ApplyNocParameterMasterList_NewCourse = null;

      this.ApplyNocParameterMasterList_TNOCExtOfSubject = null;
      this.ApplyNocParameterMasterList_PNOCOfSubject = null;

      this.ApplyNocParameterMasterList_ChangeInCoedtoGirls = null;

      this.request.ApplyNocLateFeeDetailList = [];
      this.isShowPriceDetails = false;



      this.isInspectionFee = false;
      this.request.ApplicationTypeID = 0;
      this.ApplicationTypeList = [];


      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.CheckAppliedNOCCollegeWise(this.request.CollegeID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TotalAppliedNOC = data['Data'];
          if (this.TotalAppliedNOC > 0) {
            this.toastr.warning('You have already applied for NOC and NOC not issued yet');
            this.ApplicationTypeList = [];
            return;
          }
          else {

            await this.GetApplicationTypeList(this.request.CollegeID);


            await this.commonMasterService.GetCollegeBasicDetails(this.request.CollegeID.toString())
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.CollegeDepartmentID = data['Data'][0]['data'][0]['DepartmentID'];
                this.request.DepartmentID = data['Data'][0]['data'][0]['DepartmentID'];
                if (this.request.DepartmentID == 2) {
                  this.CollegeLableName = "College/Institute Name";
                }
                else {
                  this.CollegeLableName = "College";
                }
              }, error => console.error(error));
          }
        }, error => console.error(error));
      // get

      this.FillCourses();

    }



    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetApplyNocParameterMaster() {

    await this.applyNocParameterService.GetApplyNocParameterMaster(this.request.CollegeID)
      .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        //
        this.ApplyNocParameterMasterList_ddl = data['Data'];

        if (this.SelectedDepartmentID == 3) {
          await this.ApplyNocParameterMasterList_ddl.forEach(rowitem => {
            if (rowitem.ApplyNocCode == 'DCEInspectionFee') {
              rowitem.IsChecked = true;
              this.ApplyNocFor_cbChange(null, rowitem.ApplyNocID, rowitem, 0);
            }
          });
        }


        console.log(this.ApplyNocParameterMasterList_ddl);
      }, error => console.error(error));
  }


  public isApplicationApplyFor: boolean = false;
  async ApplyNocFor_cbChange(event: any, SelectedApplyNocForID: string, item: any, index: any) {
    try {
      this.loaderService.requestStarted();
      this.request.ApplyNocID = Number(SelectedApplyNocForID);
      this.request.ApplyNocFor = item.ApplyNocFor;
      this.request.ApplyNocCode = item.ApplyNocCode;


      //if (this.CollegeDepartmentID == 2) {
      //  if (this.ApplyNocParameterMasterList_ddl.filter(f => f.IsChecked).length > 0) {
      //    await this.ApplyNocParameterMasterList_ddl.forEach(rowitem => {
      //      if (item.ApplyNocID != rowitem.ApplyNocID) {
      //        rowitem.IsChecked = false;

      //      }
      //      else {
      //        rowitem.IsChecked = true;

      //      }
      //    });
      //  }
      //}
      ///Department 4 (DTE)
      if (this.CollegeDepartmentID == 4) {
        if (this.request.ApplyNocFor == 'Closure of Institute') {
          this.isApplicationApplyFor = item.IsChecked;
          await this.ApplyNocParameterMasterList_ddl.forEach(rowitem => {
            if (item.ApplyNocID != rowitem.ApplyNocID) {
              rowitem.IsChecked = false;

            }
            else {
              rowitem.IsChecked = true;
            }
          });
        }
      }
      //Adde by rishi kapoor DTE 15 Cases

      if (this.request.ApplyNocCode == 'DTE_BankDetails') {
        this.request.DTE_BankDetails_View = item.IsChecked;
        this.request.DTE_BankDetails.BankDetailID = 0;
        this.request.DTE_BankDetails.ApplyNocID = 0;
        this.request.DTE_BankDetails.DepartmentID = 0;
        this.request.DTE_BankDetails.CollegeID = 0;
        this.request.DTE_BankDetails.OldBankName = '';
        this.request.DTE_BankDetails.NewBankName = '';
        this.request.DTE_BankDetails.OldBranchName = '';
        this.request.DTE_BankDetails.NewBranchName = '';
        this.request.DTE_BankDetails.OldIFSC = '';
        this.request.DTE_BankDetails.NewIFSC = '';
        this.request.DTE_BankDetails.OldAccountNumber = '';
        this.request.DTE_BankDetails.NewAccountNumber = '';
        this.request.DTE_BankDetails.FeeAmount = 0;
        if (item.IsChecked == true) {
          this.request.DTE_BankDetails.ApplyNocID = Number(SelectedApplyNocForID);
          this.request.DTE_BankDetails.FeeAmount = item.FeeAmount
        }
      }
      //Change In The Minority Status of the Institution
      if (this.request.ApplyNocCode == 'DTE_ChangeInTheMinorityStatusoftheInstitution') {
        this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_View = item.IsChecked;

        this.request.DTE_ChangeInTheMinorityStatusoftheInstitution = '';
        this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Dis_FileName = '';
        this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Path = '';

        if (item.IsChecked == true) {
          this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_FeeAmount = item.FeeAmount
        }
      }

      if (this.request.ApplyNocCode == 'DTE_MergerofInstitutions') {
        this.request.DTE_MergerofInstitutions_View = item.IsChecked;
        this.request.DTE_MergerofInstitutions.InstituteID1 = this.request.CollegeID;
        this.request.DTE_MergerofInstitutions.InstituteID2 = 0;
        this.request.DTE_MergerofInstitutions.MergeInstituteID = 0;
        this.request.DTE_MergerofInstitutions.FeeAmount = 0;

        this.request.DTE_MergerofInstitutions.NewTrustName = '';
        this.request.DTE_MergerofInstitutions.NewTrustName = '';
        if (item.IsChecked == true) {
          this.request.DTE_MergerofInstitutions.ApplyNocID = Number(SelectedApplyNocForID);
          this.request.DTE_MergerofInstitutions.FeeAmount = item.FeeAmount
        }
      }
      /*Change in the name of Trust / Society / Company*/
      if (this.request.ApplyNocCode == 'DTE_ChangeinNameofSociety') {
        this.request.DTE_ChangeinNameofSociety_View = item.IsChecked;
        this.request.DTE_ChangeinNameofSociety.CurrentName = '';


        await this.commonMasterService.GetSocietyByCollege(this.request.CollegeID)
          .then((data: any) => {
            this.request.DTE_ChangeinNameofSociety.CurrentName = data['Data'][0]['data'][0]['SocietyName'];
            this.request.DTE_ChangeinNameofSociety.OldAddress = data['Data'][0]['data'][0]['OldAddress'];
          });

        this.request.DTE_ChangeinNameofSociety.NewName = '';
        this.request.DTE_ChangeinNameofSociety.NewAddress = '';
        this.request.DTE_ChangeinNameofSociety.FeeAmount = 0;
        if (item.IsChecked == true) {
          this.request.DTE_ChangeinNameofSociety.ApplyNocID = Number(SelectedApplyNocForID);
          this.request.DTE_ChangeinNameofSociety.FeeAmount = item.FeeAmount
        }
      }

      /*//Increase in Intake / Addition of Course*/
      if (this.request.ApplyNocCode == 'DTE_IncreaseinIntakeAdditionofCourse') {
        this.request.DTE_IncreaseinIntakeAdditionofCourse_View = item.IsChecked;
        this.request.DTE_IncreaseinIntakeAdditionofCourse.CourseID = 0;
        this.request.DTE_IncreaseinIntakeAdditionofCourse.FeeAmount = 0;
        this.request.DTE_IncreaseinIntakeAdditionofCourse_List = [];

        //await this.commonMasterService.GetCourseList_CollegeWise(this.request.CollegeID)
        //  .then((data: any) => {
        //    data = JSON.parse(JSON.stringify(data));
        //    this.DTE_CourseDataList = data['Data'];
        //    console.log(this.DTE_CourseDataList);
        //  }, error => console.error(error));

        if (item.IsChecked == true) {
          this.request.DTE_IncreaseinIntakeAdditionofCourse.ApplyNocID = Number(SelectedApplyNocForID);
          this.request.DTE_IncreaseinIntakeAdditionofCourse.FeeAmount = item.FeeAmount
        }
      }
      // await  this.SetPrimaryMember(item, index)

      /*//To start new Programme/ Level in the existing Institutions*/
      if (this.request.ApplyNocCode == 'DTE_TostartNewProgramme') {
        this.request.DTE_TostartNewProgramme_View = item.IsChecked;
        this.request.DTE_TostartNewProgramme.CourseID = 0;
        this.request.DTE_TostartNewProgramme.FeeAmount = 0;
        this.request.DTE_TostartNewProgramme_List = [];

        await this.commonMasterService.GetCourseList_CollegeWise(this.request.CollegeID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DTE_CourseDataList = data['Data'];
            console.log(this.DTE_CourseDataList);
          }, error => console.error(error));

        if (item.IsChecked == true) {
          this.request.DTE_TostartNewProgramme.ApplyNocID = Number(SelectedApplyNocForID);
          this.request.DTE_TostartNewProgramme.FeeAmount = item.FeeAmount
        }
      }


      /*Change in Name of Institution*/
      if (this.request.ApplyNocCode == 'DTE_ChangeofSite_Location') {
        this.request.DTE_ChangeofSite_Location_View = item.IsChecked;
        this.request.DTE_ChangeofSite_Location.CurrentAddress = '';
        this.request.DTE_ChangeofSite_Location.NewAddress = '';

        await this.commonMasterService.GetCollegeBasicDetails(this.request.CollegeID.toString())
          .then((data: any) => {
            this.request.DTE_ChangeofSite_Location.CurrentAddress = data['Data'][0]['data'][0]['FullAddress'];
          });

        this.request.DTE_ChangeofSite_Location.FeeAmount = 0;
        if (item.IsChecked == true) {
          this.request.DTE_ChangeofSite_Location.ApplyNocID = Number(SelectedApplyNocForID);
          this.request.DTE_ChangeofSite_Location.FeeAmount = item.FeeAmount
        }
      }

      /*Change in Name of Institution*/
      if (this.request.ApplyNocCode == 'DTE_ChangeInNameofInstitution') {
        this.request.DTE_ChangeInNameofInstitution_View = item.IsChecked;
        this.request.DTE_ChangeInNameofInstitution.CurrentCollegeName = '';
        this.request.DTE_ChangeInNameofInstitution.NewCollegeName = '';
        this.request.DTE_ChangeInNameofInstitution.NewCollegeNameHi = '';
        setTimeout(function () { (window as any).LoadData(); }, 200)
        await this.commonMasterService.GetCollegeBasicDetails(this.request.CollegeID.toString())
          .then((data: any) => {

            this.request.DTE_ChangeInNameofInstitution.CurrentCollegeName = data['Data'][0]['data'][0]['CollegeNameEn'];
          });

        this.request.DTE_ChangeInNameofInstitution.FeeAmount = 0;
        if (item.IsChecked == true) {
          this.request.DTE_ChangeInNameofInstitution.ApplyNocID = Number(SelectedApplyNocForID);
          this.request.DTE_ChangeInNameofInstitution.FeeAmount = item.FeeAmount
        }
      }


      /*//To start new Programme/ Level in the existing Institutions*/
      if (this.request.ApplyNocCode == 'DTE_IncreaseInIntake_AdditionofCourse') {
        this.request.DTE_IncreaseInIntake_AdditionofCourse_View = item.IsChecked;
        this.request.DTE_IncreaseInIntake_AdditionofCourse.CourseID = 0;
        this.request.DTE_IncreaseInIntake_AdditionofCourse.FeeAmount = 0;
        this.request.DTE_IncreaseInIntake_AdditionofCourse_List = [];

        //await this.commonMasterService.GetCourseList_CollegeWise(this.request.CollegeID)
        //  .then((data: any) => {
        //    data = JSON.parse(JSON.stringify(data));
        //    this.DTE_CourseDataList = data['Data'];
        //    console.log(this.DTE_CourseDataList);
        //  }, error => console.error(error));

        if (item.IsChecked == true) {
          this.request.DTE_IncreaseInIntake_AdditionofCourse.ApplyNocID = Number(SelectedApplyNocForID);
          this.request.DTE_IncreaseInIntake_AdditionofCourse.FeeAmount = item.FeeAmount
        }
      }

      //Amit

      if (this.request.ApplyNocCode == 'DTE_AdditionofIntegratedDualDegree') {
        this.request.DTE_AdditionofIntegratedDualDegree_View = item.IsChecked;
        this.DTE_AdditionofIntegratedDualDegree.DetailID = 0;
        this.DTE_AdditionofIntegratedDualDegree.ApplyNocID = 0;
        this.DTE_AdditionofIntegratedDualDegree.DepartmentID = 0;
        this.DTE_AdditionofIntegratedDualDegree.CollegeID = 0;
        this.DTE_AdditionofIntegratedDualDegree.CourseID = 0;
        this.DTE_AdditionofIntegratedDualDegree.FeeAmount = 0;
        this.DTE_AdditionofIntegratedDualDegree.Intake = 0;
        if (item.IsChecked == true) {
          this.DTE_AdditionofIntegratedDualDegree.ApplyNocID = Number(SelectedApplyNocForID);
          this.DTE_AdditionofIntegratedDualDegree.FeeAmount = item.FeeAmount
        }
        this.request.DTE_AdditionofIntegratedDualDegreeList = [];
      }
      if (this.request.ApplyNocCode == 'DTE_ChangeInNameOfCourse') {
        this.request.DTE_ChangeInNameOfCourse_View = item.IsChecked;
        this.DTE_ChangeInNameOfCourse.DetailID = 0;
        this.DTE_ChangeInNameOfCourse.ApplyNocID = 0;
        this.DTE_ChangeInNameOfCourse.DepartmentID = 0;
        this.DTE_ChangeInNameOfCourse.CollegeID = 0;
        this.DTE_ChangeInNameOfCourse.CourseID = 0;
        this.DTE_ChangeInNameOfCourse.NewCourseName = '';
        if (item.IsChecked == true) {
          this.DTE_ChangeInNameOfCourse.ApplyNocID = Number(SelectedApplyNocForID);
          this.DTE_ChangeInNameOfCourse.FeeAmount = item.FeeAmount
        }

        this.request.DTE_ChangeInNameOfCourseList = [];
      }

      if (this.request.ApplyNocCode == 'DTE_ReductionInIntake') {
        this.request.DTE_ReductionInIntake_View = item.IsChecked;
        this.DTE_ReductionInIntake.DetailID = 0;
        this.DTE_ReductionInIntake.ApplyNocID = 0;
        this.DTE_ReductionInIntake.DepartmentID = 0;
        this.DTE_ReductionInIntake.CollegeID = 0;
        this.DTE_ReductionInIntake.CourseID = 0;
        this.DTE_ReductionInIntake.CurrentIntake = 0;
        this.DTE_ReductionInIntake.ReducedIntake = 0;
        if (item.IsChecked == true) {
          this.DTE_ReductionInIntake.ApplyNocID = Number(SelectedApplyNocForID);
          this.DTE_ReductionInIntake.FeeAmount = item.FeeAmount
        }

        this.request.DTE_ReductionInIntakeList = [];

      }

      if (this.request.ApplyNocCode == 'DTE_ClosureOfProgramme') {
        this.request.DTE_ClosureOfProgram_View = item.IsChecked;
        this.DTE_ClosureOfProgram.DetailID = 0;
        this.DTE_ClosureOfProgram.ApplyNocID = 0;
        this.DTE_ClosureOfProgram.DepartmentID = 0;
        this.DTE_ClosureOfProgram.CollegeID = 0;
        this.DTE_ClosureOfProgram.StreamID = 0;
        this.DTE_ClosureOfProgram.CourseLevelID = 0;
        this.DTE_ClosureOfProgram.FeeAmount = 0;
        if (item.IsChecked == true) {
          this.DTE_ClosureOfProgram.ApplyNocID = Number(SelectedApplyNocForID);
          this.DTE_ClosureOfProgram.FeeAmount = item.FeeAmount
        }

        this.DTE_ClosureOfProgramList = [];

      }

      if (this.request.ApplyNocCode == 'DTE_ClosureOfCourse') {
        this.request.DTE_ClosureOfCourses_View = item.IsChecked;
        this.DTE_ClosureOfCourses.DetailID = 0;
        this.DTE_ClosureOfCourses.ApplyNocID = 0;
        this.DTE_ClosureOfCourses.DepartmentID = 0;
        this.DTE_ClosureOfCourses.CollegeID = 0;
        this.DTE_ClosureOfCourses.CourseID = 0;
        this.DTE_ClosureOfCourses.CurrentIntake = 0;
        this.DTE_ClosureOfCourses.ReducedIntake = 0;
        if (item.IsChecked == true) {
          this.DTE_ClosureOfCourses.ApplyNocID = Number(SelectedApplyNocForID);
          this.DTE_ClosureOfCourses.FeeAmount = item.FeeAmount
        }

        this.request.DTE_ClosureOfCoursesList = [];

      }

      if (this.request.ApplyNocCode == 'DTE_MergerOfTheCourses') {
        this.request.DTE_MergerOfTheCourse_View = item.IsChecked;
        this.DTE_MergerOfTheCourse.DetailID = 0;
        this.DTE_MergerOfTheCourse.ApplyNocID = 0;
        this.DTE_MergerOfTheCourse.DepartmentID = 0;
        this.DTE_MergerOfTheCourse.CollegeID = 0;
        this.DTE_MergerOfTheCourse.CourseID1 = 0;
        this.DTE_MergerOfTheCourse.CourseID2 = 0;
        this.DTE_MergerOfTheCourse.MergerCourseID = 0;
        if (item.IsChecked == true) {
          this.DTE_MergerOfTheCourse.ApplyNocID = Number(SelectedApplyNocForID);
          this.DTE_MergerOfTheCourse.FeeAmount = item.FeeAmount

        }

        this.request.DTE_MergerOfTheCourseList = [];

      }
      //Amit


      //Deepak 29_01_2024
      if (this.request.ApplyNocCode == 'DTE_IntroductionOffCampus') {
        this.request.DTE_IntroductionOffCampus_View = item.IsChecked;
        this.request.DTE_IntroductionOffCampus.DetailID = 0;
        this.request.DTE_IntroductionOffCampus.ApplyNocID = 0;
        this.request.DTE_IntroductionOffCampus.DepartmentID = 0;
        this.request.DTE_IntroductionOffCampus.CollegeID = 0;
        this.request.DTE_IntroductionOffCampus.CourseID = 0;
        this.request.DTE_IntroductionOffCampus.FeeAmount = 0;
        this.request.DTE_IntroductionOffCampus.Intake = 0;
        if (item.IsChecked == true) {
          this.request.DTE_IntroductionOffCampus.ApplyNocID = Number(SelectedApplyNocForID);
          this.request.DTE_IntroductionOffCampus.FeeAmount = item.FeeAmount
        }
        this.request.DTE_IntroductionOffCampus_List = [];
      }
      if (this.request.ApplyNocCode == 'DTE_CoursesforWorkingProfessionals') {
        debugger;
        this.request.DTE_CoursesforWorkingProfessionals_View = item.IsChecked;
        this.request.DTE_CoursesforWorkingProfessionals.DetailID = 0;
        this.request.DTE_CoursesforWorkingProfessionals.ApplyNocID = 0;
        this.request.DTE_CoursesforWorkingProfessionals.DepartmentID = 0;
        this.request.DTE_CoursesforWorkingProfessionals.CollegeID = 0;
        this.request.DTE_CoursesforWorkingProfessionals.CourseID = 0;
        this.request.DTE_CoursesforWorkingProfessionals.FeeAmount = 0;
        this.request.DTE_CoursesforWorkingProfessionals.Intake = 0;
        if (item.IsChecked == true) {
          this.request.DTE_CoursesforWorkingProfessionals.ApplyNocID = Number(SelectedApplyNocForID);
          this.request.DTE_CoursesforWorkingProfessionals.FeeAmount = item.FeeAmount
        }
        this.request.DTE_CoursesforWorkingProfessionals_List = [];
      }
      //Deepak 29_01_2024
      // await  this.SetPrimaryMember(item, index)
      // TNOC Extension
      if (this.request.ApplyNocCode == 'NewCourse') {
        this.ApplyNocParameterMasterList_TNOCExtension = null;


      }
      // Addition of New Seats(60)
      if (this.request.ApplyNocCode == 'ANewSeats') {
        this.ApplyNocParameterMasterList_AdditionOfNewSeats60 = null;
      }

      if (this.request.ApplicationTypeID <= 0) {
        this.toastr.error("Choose application type");
        event.target.checked = false;
        return;
      }
      //DEC Change In Name Of College
      if (this.request.ApplyNocCode == 'DEC_ChangeName') {
        this.ApplyNocParameterMasterList_ChangeInNameOfCollege = new ApplyNocParameterMasterList_ChangeInNameOfCollege();
        this.ApplyNocParameterMasterList_ChangeInNameOfCollege.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_ChangeInNameOfCollege.FeeAmount = item.FeeAmount;
        setTimeout(function () { (window as any).LoadData(); }, 200)
      }
      if (this.request.ApplyNocCode == 'DCEInspectionFee') {
        this.ApplyNocParameterMasterList_ChangeInInspectionFee = new ApplyNocParameterMasterList_ChangeInInspectionFee();
        this.ApplyNocParameterMasterList_ChangeInInspectionFee.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_ChangeInInspectionFee.FeeAmount = item.FeeAmount;
      }
      if (this.request.ApplyNocCode == 'DEC_ChangePlace') {
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = new ApplyNocParameterMasterList_ChangeInPlaceOfCollege();
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.FeeAmount = item.FeeAmount;
      }
      if (this.request.ApplyNocCode == 'DEC_CoedToGirls') {
        this.ApplyNocParameterMasterList_ChangeInCoedtoGirls = new ApplyNocParameterMasterList_ChangeInCoedtoGirls();
        this.ApplyNocParameterMasterList_ChangeInCoedtoGirls.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_ChangeInCoedtoGirls.FeeAmount = item.FeeAmount;
      }
      if (this.request.ApplyNocCode == 'DEC_GilsToCoed') {
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed = new ApplyNocParameterMasterList_ChangeInGirlstoCoed();
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.FeeAmount = item.FeeAmount;
      }
      if (this.request.ApplyNocCode == 'DEC_ChangeManagement') {
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement = new ApplyNocParameterMasterList_ChangeInCollegeManagement();
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement.FeeAmount = item.FeeAmount;
      }
      if (this.request.ApplyNocCode == 'DEC_Merger') {
        this.ApplyNocParameterMasterList_MergerCollege = new ApplyNocParameterMasterList_MergerCollege();
        this.ApplyNocParameterMasterList_MergerCollege.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_MergerCollege.FeeAmount = item.FeeAmount;
      }

      if (this.request.ApplyNocCode == 'DEC_NewCourse') {

        this.ApplyNocParameterMasterList_NewCourse = new ApplyNocParameterMaster_TNOCExtensionDataModel();
        this.ApplyNocParameterMasterList_NewCourse.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_NewCourse.FeeAmount = item.FeeAmount;
      }
      if (this.request.ApplyNocCode == 'DEC_NewSubject') {
        this.ApplyNocParameterMasterList_NewCourseSubject = new ApplyNocParameterMaster_TNOCExtensionDataModel();
        this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_NewCourseSubject.FeeAmount = item.FeeAmount;
      }

      if (this.request.ApplyNocCode == 'DEC_TNOCExtOfSubject') {
        this.ApplyNocParameterMasterList_TNOCExtOfSubject = new ApplyNocParameterMaster_TNOCExtensionDataModel();
        this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_TNOCExtOfSubject.FeeAmount = item.FeeAmount;
        this.TNOCParameterFees = item.FeeAmount;
      }

      if (this.request.ApplyNocCode == 'DEC_PNOCSubject') {
        this.ApplyNocParameterMasterList_PNOCOfSubject = new ApplyNocParameterMaster_TNOCExtensionDataModel();
        this.ApplyNocParameterMasterList_PNOCOfSubject.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_PNOCOfSubject.FeeAmount = item.FeeAmount;
      }


      //unchecked
      if (event != null) {
        if (!event.target.checked) {
          if (this.request.ApplyNocCode == 'DEC_ChangeName') {
            this.ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
          }
          else if (this.request.ApplyNocCode == 'DEC_ChangePlace') {
            this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
          }
          else if (this.request.ApplyNocCode == 'DEC_CoedToGirls') {
            this.ApplyNocParameterMasterList_ChangeInCoedtoGirls = null;
          }
          else if (this.request.ApplyNocCode == 'DEC_GilsToCoed') {
            this.ApplyNocParameterMasterList_ChangeInGirlstoCoed = null;
          }
          else if (this.request.ApplyNocCode == 'DEC_ChangeManagement') {
            this.ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
          }
          else if (this.request.ApplyNocCode == 'DEC_Merger') {
            this.ApplyNocParameterMasterList_MergerCollege = null;
          }

          else if (this.request.ApplyNocCode == 'DEC_NewCourse') {
            this.ApplyNocParameterMasterList_NewCourse = null;
          }
          else if (this.request.ApplyNocCode == 'DEC_NewSubject') {
            this.ApplyNocParameterMasterList_NewCourseSubject = null;
          }

          else if (this.request.ApplyNocCode == 'DEC_TNOCExtOfSubject') {
            this.ApplyNocParameterMasterList_TNOCExtOfSubject = null;
            this.TNOCParameterFees = 0;
          }

          else if (this.request.ApplyNocCode == 'DEC_PNOCSubject') {
            this.ApplyNocParameterMasterList_PNOCOfSubject = null;
          }
        }

        if (this.ApplyNocParameterMasterList_ddl.filter(f => f.IsChecked).length == 0) {
          this.isShowPriceDetails = false;
          this.request.ApplyNocLateFeeDetailList = [];
        }
        await this.CalculateAllAmount();
        return;
      }
      // get
      await this.GetApplyNocForByParameter();
      this.isShowPriceDetails = true;

    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetApplyNocForByParameter() {
    await this.applyNocParameterService.GetApplyNocForByParameter(this.request.CollegeID, this.request.ApplyNocCode)
      .then((data: any) => {
        if (data != null && data != undefined) {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // TNOC Extension
          if (this.request.ApplyNocCode == 'NewCourse') {
            this.ApplyNocParameterMasterList_TNOCExtension = data['Data'];
          }
          // Addition of New Seats(60)
          if (this.request.ApplyNocCode == 'ANewSeats') {
            this.ApplyNocParameterMasterList_AdditionOfNewSeats60 = data['Data'];
          }

          if (this.CollegeDepartmentID == EnumDepartment.Animal_Husbandry) {
            if (this.request.ApplyNocCode == 'NewCourse') {
              this.ApplyNocParameterMasterList_AdditionOfNewSeats60 = null;
            }
            if (this.request.ApplyNocCode == 'ANewSeats') {
              this.ApplyNocParameterMasterList_TNOCExtension = null;
            }
          }
        }
      }, error => console.error(error));
  }




  async GetNocLateFees() {
    try {
      this.loaderService.requestStarted();
      await this.applyNocParameterService.GetNocLateFees(this.CollegeDepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.ApplyNocLateFeeDetailList = data['Data'][0]['data'];

          if (this.request.ApplyNocLateFeeDetailList != null) {
            if (this.request.ApplyNocLateFeeDetailList.length > 0) {
              this.TotalLateFees = this.request.ApplyNocLateFeeDetailList.map(t => t.FeesAmount).reduce((acc, value) => acc + value, 0);
            }
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



  HasData(): boolean {
    let HasData = false;
    if (this.request.DepartmentID == 4) {
      let IfSelectedParamenter = false;
      for (var i = 0; i < this.ApplyNocParameterMasterList_ddl.length; i++) {
        if (this.ApplyNocParameterMasterList_ddl[i].IsChecked == true) {
          IfSelectedParamenter = true;
        }
      }
      HasData = IfSelectedParamenter;
    }
    else if (this.request.DepartmentID == 2) {
      let IfSelectedParamenter = true;
      for (var i = 0; i < this.ApplyNocParameterMasterList_ddl.length; i++) {
        if (this.ApplyNocParameterMasterList_ddl[i].IsChecked == true) {
          //IfSelectedParamenter = true;
        }
        else {
          IfSelectedParamenter = false;
        }
      }
      HasData = IfSelectedParamenter;
    }
    else if (this.request.DepartmentID == 6) {
      let IfSelectedParamenter = true;
      for (var i = 0; i < this.ApplyNocParameterMasterList_ddl.length; i++) {
        if (this.ApplyNocParameterMasterList_ddl[i].IsChecked == true) {
          IfSelectedParamenter = true;
        }
      }
      HasData = IfSelectedParamenter;
    }
    else if (this.request.DepartmentID == 1) {
      let IfSelectedParamenter = false;
      if (this.isInspectionFee)
        IfSelectedParamenter = true;
      for (var i = 0; i < this.ApplyNocParameterMasterList_ddl.length; i++) {
        if (this.ApplyNocParameterMasterList_ddl[i].IsChecked == true) {
          IfSelectedParamenter = true;
        }
      }
      HasData = IfSelectedParamenter;
    }
    else {
      if (this.ApplyNocParameterMasterList_TNOCExtension != null || this.ApplyNocParameterMasterList_AdditionOfNewSeats60 != null || this.ApplyNocParameterMasterList_ChangeInNameOfCollege != null ||
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege != null || this.ApplyNocParameterMasterList_ChangeInGirlstoCoed != null || this.ApplyNocParameterMasterList_ChangeInCollegeManagement != null || this.ApplyNocParameterMasterList_MergerCollege != null || this.ApplyNocParameterMasterList_ChangeInCoedtoGirls != null || this.ApplyNocParameterMasterList_NewCourse != null
        || this.ApplyNocParameterMasterList_NewCourseSubject != null || this.ApplyNocParameterMasterList_TNOCExtOfSubject != null || this.ApplyNocParameterMasterList_PNOCOfSubject != null || (this.isInspectionFee && this.DepartmentInspectionFee > 0)) {
        HasData = true;
      }

    }
    return HasData;
  }
  public isSave: boolean = true;
  async SaveApplyNoc_click() {
    if (confirm("Are you satisfied with the data that are showing in the View Application? Apply NOC After Not  Edit Your Application Profile.")) {

      //this.isSave = false; 
      try {
        let isValid = true;
        if (this.ApplyNocParameterForm.invalid) {
          isValid = false;
        }




        // check all

        this.isSubmitted = true;
        //set
        if (this.request.ApplyNocApplicationID > 0) {
          this.request.ModifyBy = 1;
        }
        else {
          this.request.CreatedBy = 1;
          this.request.ModifyBy = 1;
        }
        // noc parameter
        this.request.SSOID = this.sSOLoginDataModel.SSOID;
        this.request.ApplyNocParameterMasterListDataModel = this.ApplyNocParameterMasterList_ddl;

        let totalFeeList = this.request.ApplyNocParameterMasterListDataModel?.filter((element: any) => { return element.IsChecked == true; });
        // and total fee
        this.request.TotalFeeAmount = 0;
        for (let i = 0; i < totalFeeList.length; i++) {
          this.request.TotalFeeAmount += totalFeeList[i].FeeAmount;
        }
        //for Dec New Subject
        if (this.ApplyNocParameterMasterList_NewCourse?.ApplyNocParameterCourseList != null) {
          //for Dec New Subject
          if (this.SelectedDepartmentID != 1) {
            this.request.TotalFeeAmount += this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.map(t => t.CourseFeesAmount).reduce((acc, value) => acc + value, 0)
          }
        }
        //for Dec New Subject
        if (this.ApplyNocParameterMasterList_NewCourseSubject?.ApplyNocParameterCourseList != null) {

          this.request.TotalFeeAmount += await this.calcuateSumofNewSubject();
        }
        //DEC TNOC
        //if (this.ApplyNocParameterMasterList_TNOCExtOfSubject?.ApplyNocParameterCourseList != null) {

        //  this.request.TotalFeeAmount += this.calcuateTNOCSubjectFees();
        //}
        //DEC NOC
        if (this.ApplyNocParameterMasterList_PNOCOfSubject?.ApplyNocParameterCourseList != null) {
          //this.request.TotalFeeAmount
          //this.request.TotalFeeAmount += this.calcuatePNOCSubjectFees();
        }



        this.request.TotalNocFee = this.request.TotalFeeAmount;
        if (this.request.ApplyNocLateFeeDetailList.length > 0) {
          this.request.TotalFeeAmount += this.TotalLateFees;
          this.request.LateFee = this.TotalLateFees;
        }
        this.request.TotalDefaulterCollegePenalty = 0;
        for (let i = 0; i < this.request.DefaulterCollegePenaltyDetailList.length; i++) {
          this.request.TotalDefaulterCollegePenalty += this.request.DefaulterCollegePenaltyDetailList[i].PenaltyAmount;
        }

        this.request.TotalNocFee += this.DepartmentInspectionFee;

        this.request.TotalFeeAmount += this.DepartmentInspectionFee;
        this.request.TotalFeeAmount += this.request.TotalDefaulterCollegePenalty;






        // TNOC Extension      
        this.request.ApplyNocParameterMasterList_TNOCExtension = this.ApplyNocParameterMasterList_TNOCExtension;
        // filter and validation
        if (this.ApplyNocParameterMasterList_TNOCExtension?.ApplyNocParameterCourseList != null) {
          let SelectedCourselist = this.ApplyNocParameterMasterList_TNOCExtension?.ApplyNocParameterCourseList?.filter((element: any) => { return element.IsChecked == true; });
          if (SelectedCourselist.length == 0) {
            this.toastr.error("Choose any subject from 'NOC For New Course'");
            return;
          }
        }
        // Addition of New Seats(60)
        this.request.ApplyNocParameterMasterList_AdditionOfNewSeats60 = this.ApplyNocParameterMasterList_AdditionOfNewSeats60;
        if (this.ApplyNocParameterMasterList_AdditionOfNewSeats60?.ApplyNocParameterCourseList != null) {
          let selectedCourselist = this.ApplyNocParameterMasterList_AdditionOfNewSeats60?.ApplyNocParameterCourseList?.filter((element: any) => { return element.IsChecked == true; });
          if (selectedCourselist.length == 0) {
            if (this.CollegeDepartmentID == EnumDepartment.Animal_Husbandry)
              this.toastr.error("Choose any Course from 'Addition of New Seats(50)'");
            else
              this.toastr.error("Choose any subject from 'Addition of New Seats(60)'");
            return;
          }
        }

        else if (this.ApplyNocParameterMasterList_NewCourse?.ApplyNocParameterCourseList != null) {
          let SelectedCourselist = this.ApplyNocParameterMasterList_NewCourse?.ApplyNocParameterCourseList;
          if (SelectedCourselist.length == 0) {
            if (this.CollegeDepartmentID == EnumDepartment.Animal_Husbandry)
              this.toastr.error("Choose any Course from 'NOC For New Course'");
            else if (this.CollegeDepartmentID == EnumDepartment.Agriculture)
              this.toastr.error("Choose any Course from 'TNOC Extension'");
            else
              this.toastr.error("Choose any subject from 'NOC For New Course'");
            return;
          }
        }


        else if (this.ApplyNocParameterMasterList_NewCourseSubject?.ApplyNocParameterCourseList != null) {
          let SelectedCourselist = this.ApplyNocParameterMasterList_NewCourseSubject?.ApplyNocParameterCourseList;
          if (SelectedCourselist.length == 0) {
            if (this.CollegeDepartmentID == EnumDepartment.Animal_Husbandry)
              this.toastr.error("Choose any Course from 'NOC For New Course'");
            else
              this.toastr.error("Choose any subject from 'NOC For New Subject'");
            return;
          }
        }


        else if (this.ApplyNocParameterMasterList_TNOCExtOfSubject?.ApplyNocParameterCourseList != null) {
          let SelectedCourselist = this.ApplyNocParameterMasterList_TNOCExtOfSubject?.ApplyNocParameterCourseList;
          if (SelectedCourselist.length == 0) {
            this.toastr.error("Choose any subject from 'TNOC For New Subject'");
            return;
          }
        }

        else if (this.ApplyNocParameterMasterList_PNOCOfSubject?.ApplyNocParameterCourseList != null) {
          let SelectedCourselist = this.ApplyNocParameterMasterList_PNOCOfSubject?.ApplyNocParameterCourseList;

          if (this.IsCollegeDeficiency) {
            alert('College Deficiency\n' + this.CollegeDeficiencys);
            this.toastr.error('With College Deficiency not apply Permanent NOC')
            return;
          }
          if (SelectedCourselist.length == 0) {
            this.toastr.error("Choose any subject from 'PNOC For New Subject'");
            return;
          }
        }



        this.request.ApplyNocParameterMasterList_ChangeInNameOfCollege = this.ApplyNocParameterMasterList_ChangeInNameOfCollege;
        //Changes In College Place
        this.request.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege;


        //Changes In Coed to Girls
        this.request.ApplyNocParameterMasterList_ChangeInCoedtoGirls = this.ApplyNocParameterMasterList_ChangeInCoedtoGirls;

        //Changes In Girlsto Coed
        this.request.ApplyNocParameterMasterList_ChangeInGirlstoCoed = this.ApplyNocParameterMasterList_ChangeInGirlstoCoed;

        //Merge
        this.request.ApplyNocParameterMasterList_MergerCollege = this.ApplyNocParameterMasterList_MergerCollege;

        //Changes In College Management
        this.request.ApplyNocParameterMasterList_ChangeInCollegeManagement = this.ApplyNocParameterMasterList_ChangeInCollegeManagement;

        //Changes In Subject
        this.request.ApplyNocParameterMasterList_NewCourse = this.ApplyNocParameterMasterList_NewCourse;

        //Changes In NewCourseSubject
        this.request.ApplyNocParameterMasterList_NewCourseSubject = this.ApplyNocParameterMasterList_NewCourseSubject;


        //Changes In NewCourseSubject
        this.request.ApplyNocParameterMasterList_TNOCExtOfSubject = this.ApplyNocParameterMasterList_TNOCExtOfSubject;

        this.request.ApplyNocParameterMasterList_PNOCOfSubject = this.ApplyNocParameterMasterList_PNOCOfSubject;


        //validation
        this.isFormValid = this.ValidateApplyNOCForm();
        if (!this.isFormValid) {
          return;
        }
        //Departemt 4 DTE

        if (this.request.DTE_MergerofInstitutions_View == true) {
          if (this.request.DTE_MergerofInstitutions.TrustType == '') {
            this.toastr.warning('Choose trust type');
            return;
          }
          if (this.request.DTE_MergerofInstitutions.TrustType == 'DifferentTrust') {
            if (this.request.DTE_MergerofInstitutions.NewTrustName == '') {
              this.toastr.warning('Fill new trust name');
              return;
            }
            if (this.request.DTE_MergerofInstitutions.NewInstituteName == '') {
              this.toastr.warning('Fill new institute name');
              return;
            }
          }
          //if (this.request.DTE_MergerofInstitutions.InstituteID1 == this.request.DTE_MergerofInstitutions.InstituteID2) {
          //  this.toastr.warning('Select other Institute 2');
          //  return;
          //}
          //if (this.request.DTE_MergerofInstitutions.InstituteID1 != this.request.DTE_MergerofInstitutions.MergeInstituteID)
          //{
          //  if (this.request.DTE_MergerofInstitutions.InstituteID2 != this.request.DTE_MergerofInstitutions.MergeInstituteID)
          //  {
          //    this.toastr.warning('Invalid Merge to Institute');
          //    return;
          //  }
          //}
        }
        //To start new Programme/ Level in the existing Institutions
        if (this.request.DTE_IncreaseinIntakeAdditionofCourse_View == true) {
          if (this.request.DTE_IncreaseinIntakeAdditionofCourse_List.length == 0) {
            this.toastr.warning('Add To start new Programme');
            return;
          }
        }
        //Increase in Intake / Addition of Course
        if (this.request.DTE_TostartNewProgramme_View == true) {
          if (this.request.DTE_TostartNewProgramme_List.length == 0) {
            this.toastr.warning('Add To start new Programme');
            return;
          }
        }
        //Increase in Intake / Addition of Course
        if (this.request.DTE_IncreaseInIntake_AdditionofCourse_View == true) {
          if (this.request.DTE_IncreaseInIntake_AdditionofCourse_List.length == 0) {
            this.toastr.warning('Add To Intake Details');
            return;
          }
        }


        if (this.CollegeDepartmentID == 4) {
          if (this.request.ExistingLetterofEOA == '') {
            this.toastr.warning('Upload Existing Letter of EOA');
            return;
          }
        }

        if (!this.IsTermsChecked) {
          this.toastr.warning('Please accept terms and condition');
          isValid = false;
        }

        if (!isValid) {
          return;
        }

        this.loaderService.requestStarted();
        //post
        await this.applyNocParameterService.SaveApplyNocApplication(this.request)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            //
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              setTimeout(() => {
                //move to list page
                this.routers.navigate(['/applynocapplicationdetail']);
              }, 1000);
            }
            else {
              this.toastr.error(this.ErrorMessage);
              this.isSave = true;
            }

          }, error => console.error(error));
      }
      catch (ex) {
        console.log(ex);
        this.isSave = true;
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isSubmitted = false;

        }, 200);
      }
    }
  }

  async cbCourse_TNOCExtension_change(event: any, courseID: string, item: any) {
    let _courseID = Number(courseID);
    let isChecked = false;
    if (event.target.checked) {
      isChecked = true;
    }
    for (let j = 0; j < item.ApplyNocParameterSubjectList.length; j++) {
      item.ApplyNocParameterSubjectList[j].IsChecked = isChecked;
    }
  }

  ResetApplyNoc_click() {
    // model
    this.request = new ApplyNocParameterDataModel();
    // parameter master
    this.ApplyNocParameterMasterList_ddl = [];
    // parameter details
    this.ApplyNocParameterMasterList_TNOCExtension = null;
    this.ApplyNocParameterMasterList_AdditionOfNewSeats60 = null;

    //parameters details
    this.ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
    this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
    this.ApplyNocParameterMasterList_ChangeInGirlstoCoed = null;
    this.ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
    this.ApplyNocParameterMasterList_MergerCollege = null;
    this.ApplyNocParameterMasterList_NewCourse = null;
    this.ApplyNocParameterMasterList_NewCourseSubject = null;

    this.ApplyNocParameterMasterList_TNOCExtOfSubject = null;
    this.ApplyNocParameterMasterList_PNOCOfSubject = null;

    this.isInspectionFee = false;
    this.DepartmentInspectionFee = 0;

    this.isShowPriceDetails = false;

    this.IsTermsChecked = false;


  }


  async ValidateDocument(event: any, Type: string, SubType: string) {

    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'application/pdf') {
        if (event.target.files[0].size > 2000000) {
          event.target.value = '';
          this.toastr.warning('Select less then 2MB File');
          this.ResetDocument(Type, '', '', '', '');
          return
        }
        if (event.target.files[0].size < 100000) {
          event.target.value = '';
          this.toastr.warning('Select more then 100kb File');
          this.ResetDocument(Type, '', '', '', '');
          return
        }
      }
      else {
        event.target.value = '';
        this.toastr.warning('Select Only pdf');
        this.ResetDocument(Type, '', '', '', '');
        return
      }
      // upload
      this.file = event.target.files[0];
      try {

        this.loaderService.requestStarted();
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetDocument(Type, data['Data'][0]["Dis_FileName"], data['Data'][0]["FileName"], data['Data'][0]["FilePath"], SubType);
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
      catch (ex) { }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }

    }
    else {
      this.ApplyNocParameterMasterList_ChangeInNameOfCollege.Dis_DocumentName = '';
      this.ApplyNocParameterMasterList_ChangeInNameOfCollege.DocumentPath = '';
      this.ApplyNocParameterMasterList_ChangeInNameOfCollege.DocumentName = '';
    }
  }
  async DeleteDocument(file: string, Type: string, SubType: string) {
    try {
      // delete from server folder
      this.loaderService.requestStarted();
      await this.fileUploadService.DeleteDocument(file).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.ResetDocument(Type, '', '', '', SubType);
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

  ResetDocument(Type: string, Dis_Name: string, Name: string, Path: string, SubType: string) {
    this.loaderService.requestStarted();
    if (Type == 'ChangeInNameOfCollege') {
      this.ApplyNocParameterMasterList_ChangeInNameOfCollege.Dis_DocumentName = Dis_Name;
      this.ApplyNocParameterMasterList_ChangeInNameOfCollege.DocumentPath = Path;
      this.ApplyNocParameterMasterList_ChangeInNameOfCollege.DocumentName = Name;
    }
    else if (Type == 'ChangeInPlaceNameOfCollege') {
      if (SubType == 'Document') {
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.Dis_DocumentName = Dis_Name;
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.DocumentPath = Path;
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.DocumentName = Name;
      }
      else if (SubType == 'PlaceDocument') {
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.Dis_PlaceDocumentName = Dis_Name;
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.PlaceDocumentPath = Path;
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.PlaceDocumentName = Name;
      }
    }
    else if (Type == 'ChangeInCoedtoGirls') {
      this.ApplyNocParameterMasterList_ChangeInCoedtoGirls.Dis_ConsentManagementDocument = Dis_Name;
      this.ApplyNocParameterMasterList_ChangeInCoedtoGirls.ConsentManagementDocumentPath = Path;
      this.ApplyNocParameterMasterList_ChangeInCoedtoGirls.ConsentManagementDocument = Name;
    }
    else if (Type == 'ChangeInGirlstoCoed') {
      if (SubType == 'ConsentManagementDocument') {
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.Dis_ConsentManagementDocument = Dis_Name;
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.ConsentManagementDocumentPath = Path;
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.ConsentManagementDocument = Name;
      }
      else if (SubType == 'ConsentStudentDocument') {
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.Dis_ConsentStudentDocument = Dis_Name;
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.ConsentStudentDocumentPath = Path;
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.ConsentStudentDocument = Name;
      }
    }
    else if (Type == 'ChangeInCollegeManagement') {
      if (SubType == 'Document') {
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement.Dis_DocumentName = Dis_Name;
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement.DocumentPath = Path;
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement.DocumentName = Name;
      }
      else if (SubType == 'AnnexureDocument') {
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement.Dis_AnnexureDocument = Dis_Name;
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement.AnnexureDocumentPath = Path;
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement.AnnexureDocument = Name;
      }
    }
    else if (Type == 'Merger') {
      if (SubType == 'SocietyProposal') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_SocietyProposal = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.SocietyProposalPath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.SocietyProposal = Name;
      }
      else if (SubType == 'AllNOC') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_AllNOC = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.AllNOCPath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.AllNOC = Name;
      }
      else if (SubType == 'UniversityAffiliation') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_UniversityAffiliation = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.UniversityAffiliationPath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.UniversityAffiliation = Name;
      }
      else if (SubType == 'NOCAffiliationUniversity') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_NOCAffiliationUniversity = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.NOCAffiliationUniversityPath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.NOCAffiliationUniversity = Name;
      }
      else if (SubType == 'ConsentAffidavit') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_ConsentAffidavit = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.ConsentAffidavitPath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.ConsentAffidavit = Name;
      }
      else if (SubType == 'OtherAllNOC') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_OtherAllNOC = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.OtherAllNOCPath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.OtherAllNOC = Name;
      }
      else if (SubType == 'OtherUniversityAffiliation') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_OtherUniversityAffiliation = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.OtherUniversityAffiliationPath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.OtherUniversityAffiliation = Name;
      }
      else if (SubType == 'OtherNOCAffiliationUniversity') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_OtherNOCAffiliationUniversity = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.OtherNOCAffiliationUniversityPath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.OtherNOCAffiliationUniversity = Name;
      }
      else if (SubType == 'OtherConsentAffidavit') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_OtherConsentAffidavit = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.OtherConsentAffidavitPath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.OtherConsentAffidavit = Name;
      }
      else if (SubType == 'LandTitleCertificate') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_LandTitleCertificate = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.LandTitleCertificatePath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.LandTitleCertificate = Name;
      }
      else if (SubType == 'BuildingBluePrint') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_BuildingBluePrint = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.BuildingBluePrintPath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.BuildingBluePrint = Name;
      }
      else if (SubType == 'StaffInformation') {
        this.ApplyNocParameterMasterList_MergerCollege.Dis_StaffInformation = Dis_Name;
        this.ApplyNocParameterMasterList_MergerCollege.StaffInformationPath = Path;
        this.ApplyNocParameterMasterList_MergerCollege.StaffInformation = Name;
      }
    }

    else if (Type == 'DTE_IntroductionOffCampus') {
      this.request.DTE_IntroductionOffCampus.Dis_DocumentName = Dis_Name;
      this.request.DTE_IntroductionOffCampus.DocumentPath = Path;
      this.request.DTE_IntroductionOffCampus.DocumentName = Name;
    }
    this.loaderService.requestEnded();
  }


  ValidateApplyNOCForm(): boolean {
    this.ResetValidationVariable();
    //change in name
    if (this.ApplyNocParameterMasterList_ChangeInNameOfCollege != null) {
      if (this.ApplyNocParameterMasterList_ChangeInNameOfCollege.NewNameEnglish == '') {
        this.isValidCollegeNewName_Eng = true;
        this.isFormValid = false;
      }
      if (this.ApplyNocParameterMasterList_ChangeInNameOfCollege.NewNameHindi == '') {
        this.isValidCollegeNewName_Hi = true;
        this.isFormValid = false;
      }
      if (this.ApplyNocParameterMasterList_ChangeInNameOfCollege.DocumentName == '') {
        this.isChangeInNameOfCollege_Document = true;
        this.isFormValid = false;
      }
    }
    //change place
    if (this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege != null) {
      if (this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.PlaceName == '') {
        this.isChangeInPlaceNewName = true;
        this.isFormValid = false;
      }
      if (this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.DocumentName == '') {
        this.isChangeInPlaceNameOfCollege_Document = true;
        this.isFormValid = false;
      }
      if (this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.PlaceDocumentName == '') {
        this.isChangeInPlaceNameOfCollege_PlaceDocument = true;
        this.isFormValid = false;
      }
    }
    //Change Coed to girls
    if (this.ApplyNocParameterMasterList_ChangeInCoedtoGirls != null) {
      if (this.ApplyNocParameterMasterList_ChangeInCoedtoGirls.ConsentManagementDocument == '') {
        this.isCoedtoGConsentDocument = true;
        this.isFormValid = false;
      }
    }
    //college management
    if (this.ApplyNocParameterMasterList_ChangeInCollegeManagement != null) {
      if (this.ApplyNocParameterMasterList_ChangeInCollegeManagement.NewSocietyName == '') {
        this.isNewSocietyName = true;
        this.isFormValid = false;
      }
      if (this.ApplyNocParameterMasterList_ChangeInCollegeManagement.DocumentName == '') {
        this.isCmDocumentName = true;
        this.isFormValid = false;
      }
      if (this.ApplyNocParameterMasterList_ChangeInCollegeManagement.AnnexureDocument == '') {
        this.isAnnexureDocument = true;
        this.isFormValid = false;
      }
    }



    //Change GirlstoCoed
    if (this.ApplyNocParameterMasterList_ChangeInGirlstoCoed != null) {
      if (this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.ConsentManagementDocument == '') {
        this.isConsentManagementDocument = true;
        this.isFormValid = false;
      }
      if (this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.ConsentStudentDocument == '') {
        this.isConsentStudentDocument = true;
        this.isFormValid = false;
      }
    }


    //Change Merger College
    if (this.ApplyNocParameterMasterList_MergerCollege != null) {
      //own

      if (this.ApplyNocParameterMasterList_MergerCollege.SocietyProposal == '') {
        this.isSocietyProposal = true;
        this.isFormValid = false;
      }
      if (this.ApplyNocParameterMasterList_MergerCollege.AllNOC == '') {
        this.isAllNOC = true;
        this.isFormValid = false;
      }

      if (this.ApplyNocParameterMasterList_MergerCollege.UniversityAffiliation == '') {
        this.isUniversityAffiliation = true;
        this.isFormValid = false;
      }

      if (this.ApplyNocParameterMasterList_MergerCollege.NOCAffiliationUniversity == '') {
        this.isNOCAffiliationUniversity = true;
        this.isFormValid = false;
      }

      if (this.ApplyNocParameterMasterList_MergerCollege.ConsentAffidavit == '') {
        this.isConsentAffidavit = true;
        this.isFormValid = false;
      }
      //Other


      if (this.ApplyNocParameterMasterList_MergerCollege.OtherAllNOC == '') {
        this.isOtherAllNOC = true;
        this.isFormValid = false;
      }

      if (this.ApplyNocParameterMasterList_MergerCollege.OtherUniversityAffiliation == '') {
        this.isOtherUniversityAffiliation = true;
        this.isFormValid = false;
      }

      if (this.ApplyNocParameterMasterList_MergerCollege.OtherNOCAffiliationUniversity == '') {
        this.isOtherNOCAffiliationUniversity = true;
        this.isFormValid = false;
      }

      if (this.ApplyNocParameterMasterList_MergerCollege.OtherConsentAffidavit == '') {
        this.isOtherConsentAffidavit = true;
        this.isFormValid = false;
      }
      if (this.ApplyNocParameterMasterList_MergerCollege.LandTitleCertificate == '') {
        this.isLandTitleCertificate = true;
        this.isFormValid = false;
      }
      if (this.ApplyNocParameterMasterList_MergerCollege.BuildingBluePrint == '') {
        this.isBuildingBluePrint = true;
        this.isFormValid = false;
      }
      if (this.ApplyNocParameterMasterList_MergerCollege.StaffInformation == '') {
        this.isStaffInformation = true;
        this.isFormValid = false;
      }


    }


    //DTE Validation
    //Change Bank Name
    if (this.request.DTE_BankDetails_View == true) {
      if (this.request.DTE_BankDetails.OldBankName == '') {
        this.isValidOldBankName = true;
        this.isFormValid = false;
      }
      else {
        this.isValidOldBankName = false;
      }

      if (this.request.DTE_BankDetails.OldBranchName == '') {
        this.isValidOldBranchName = true;
        this.isFormValid = false;
      }
      else {
        this.isValidOldBranchName = false;
      }

      if (this.request.DTE_BankDetails.OldIFSC == '') {
        this.isValidOldIFSC = true;
        this.isFormValid = false;
      }
      else {
        this.isValidOldIFSC = false;
      }

      if (this.request.DTE_BankDetails.OldAccountNumber == '') {
        this.isValidOldAccountNumber = true;
        this.isFormValid = false;
      }
      else {
        this.isValidOldAccountNumber = false;
      }
      if (this.request.DTE_BankDetails.NewBankName == '') {
        this.isValidNewBankName = true;
        this.isFormValid = false;
      }
      else {
        this.isValidNewBankName = false;
      }

      if (this.request.DTE_BankDetails.NewBranchName == '') {
        this.isValidNewBranchName = true;
        this.isFormValid = false;
      }
      else {
        this.isValidNewBranchName = false;
      }

      if (this.request.DTE_BankDetails.NewIFSC == '') {
        this.isValidNewIFSC = true;
        this.isFormValid = false;
      }
      else {
        this.isValidNewIFSC = false;
      }

      if (this.request.DTE_BankDetails.NewAccountNumber == '') {
        this.isValidNewAccountNumber = true;
        this.isFormValid = false;
      }
      else {
        this.isValidNewAccountNumber = false;
      }

    }
    //Change Bank Name End
    /*Change in the Minority Status of the Institution*/
    if (this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_View == true) {
      if (this.request.DTE_ChangeInTheMinorityStatusoftheInstitution == '') {
        this.isValidDTE_ChangeInTheMinorityStatusoftheInstitution = true;
        this.isFormValid = false;
      }
      else {
        this.isValidDTE_ChangeInTheMinorityStatusoftheInstitution = false;
      }
    }
    /*Change in the Minority Status of the Institution End*/
    //Merger of Institutions under the same Trust/ Society/ Company
    if (this.request.DTE_MergerofInstitutions_View == true) {
      if (this.request.DTE_MergerofInstitutions.TrustType == '') {
        this.toastr.warning('Choose trust type');
        this.isFormValid = false;
      }
      if (this.request.DTE_MergerofInstitutions.TrustType == 'DifferentTrust') {
        if (this.request.DTE_MergerofInstitutions.NewTrustName == '') {
          this.isValidDTE_NewTrustName = true;
          this.isFormValid = false;
        }
        else {
          this.isValidDTE_NewTrustName = false;
        }
        if (this.request.DTE_MergerofInstitutions.NewInstituteName == '') {
          this.isValidDTE_NewInstituteName = true;
          this.isFormValid = false;
        }
        else {
          this.isValidDTE_NewInstituteName = false;
        }
      }
      //if (this.request.DTE_MergerofInstitutions.InstituteID2 == 0) {
      //  this.isValidDTE_InstituteID2 = true;
      //  this.isFormValid = false;
      //}
      //else {
      //  this.isValidDTE_InstituteID2 = false;
      //}

      //if (this.request.DTE_MergerofInstitutions.MergeInstituteID == 0) {
      //  this.isValidDTE_MergeInstituteID = true;
      //  this.isFormValid = false;
      //}
      //else {
      //  this.isValidDTE_MergeInstituteID = false;
      //}
    }
    //Merger of Institutions under the same Trust/ Society/ Company end

    /*Change in the name of Trust / Society / Company*/
    if (this.request.DTE_ChangeinNameofSociety_View == true) {
      if (this.request.DTE_ChangeinNameofSociety.ChangeType == '') {
        this.toastr.warning('Please Choose Change in Name/Address');
        this.isFormValid = false;//
      }
      else {
        if (this.request.DTE_ChangeinNameofSociety.ChangeType == 'NameChange' || this.request.DTE_ChangeinNameofSociety.ChangeType == 'BothChange') {
          if (this.request.DTE_ChangeinNameofSociety.NewName == '') {
            this.isValidDTE_NewName = true;
            this.isFormValid = false;//
          }
          else {
            this.isValidDTE_NewName = false;
          }
        }
        if (this.request.DTE_ChangeinNameofSociety.ChangeType == 'AddressChange' || this.request.DTE_ChangeinNameofSociety.ChangeType == 'BothChange') {
          if (this.request.DTE_ChangeinNameofSociety.NewAddress == '') {
            this.isValidDTE_SocietyNewAddress = true;
            this.isFormValid = false;//
          }
          else {
            this.isValidDTE_SocietyNewAddress = false;
          }
        }
      }
    }

    /*Change in Name of Institution*/
    if (this.request.DTE_ChangeInNameofInstitution_View == true) {
      if (this.request.DTE_ChangeInNameofInstitution.NewCollegeName == '') {
        this.isValidDTE_NewCollegeName = true;
        this.isFormValid = false;//
      }
      else {
        this.isValidDTE_NewCollegeName = false;
      }
      if (this.request.DTE_ChangeInNameofInstitution.NewCollegeNameHi == '') {
        this.isValidDTE_NewCollegeNameHi = true;
        this.isFormValid = false;//
      }
      else {
        this.isValidDTE_NewCollegeNameHi = false;
      }
    }

    /*Change of Site / Location*/
    if (this.request.DTE_ChangeofSite_Location_View == true) {
      if (this.request.DTE_ChangeofSite_Location.NewAddress == '') {
        this.isValidDTE_NewAddress = true;
        this.isFormValid = false;//
      }
      else {
        this.isValidDTE_NewAddress = false;
      }

    }

    //Addition of Integrated Dual Degree
    if (this.request.DTE_AdditionofIntegratedDualDegree_View == true) {
      if (this.request.DTE_AdditionofIntegratedDualDegreeList.length <= 0) {
        this.toastr.warning('Add Course Details in Addition of Integrated/Dual Degree ')
        this.isFormValid = false;
      }
    }
    //Addition of Integrated Dual Degree End  

    //Change in Name of Course
    if (this.request.DTE_ChangeInNameOfCourse_View == true) {
      if (this.request.DTE_ChangeInNameOfCourseList.length <= 0) {
        this.toastr.warning('Add Change Course Details')
        this.isFormValid = false;
      }

    }
    //Change in Name of Course End

    ///Reduction in Intake    
    if (this.request.DTE_ReductionInIntake_View == true) {
      if (this.request.DTE_ReductionInIntakeList.length <= 0) {
        this.toastr.warning('Add Reduction Details')
        this.isFormValid = false;
      }
    }
    //Reduction in Intake End
    //DTE_ClosureOfProgram_View
    if (this.request.DTE_ClosureOfProgram_View == true) {
      if (this.request.DTE_ClosureOfProgramList.length <= 0) {
        this.toastr.warning('Add Closure Of Program Details')
        this.isFormValid = false;
      }
    }
    //Closure of Program End

    //Closure Of Courses
    if (this.request.DTE_ClosureOfCourses_View == true) {
      if (this.request.DTE_ClosureOfCoursesList.length <= 0) {
        this.toastr.warning('Add Closure Of Courses Details')
        this.isFormValid = false;
      }
    }
    //Closure Of Courses End
    //Merger Of The Course
    if (this.request.DTE_MergerOfTheCourse_View == true) {
      if (this.request.DTE_MergerOfTheCourseList.length <= 0) {
        this.toastr.warning('Add Merger Of The Course Details')
        this.isFormValid = false;
      }
    }
    //Merger Of The Course End

    //Introduction Off Campus
    if (this.request.DTE_IntroductionOffCampus_View == true) {
      if (this.request.DTE_IntroductionOffCampus_List.length <= 0) {
        this.toastr.warning('Add Course Details in Introduction Off Campus ')
        this.isFormValid = false;
      }
    }
    //Introduction Off Campus
    if (this.request.DTE_CoursesforWorkingProfessionals_View == true) {
      if (this.request.DTE_CoursesforWorkingProfessionals_List.length <= 0) {
        this.toastr.warning('Add Course Details in Courses for Working Professionals ')
        this.isFormValid = false;
      }
    }
    //DTE Validation End

    return this.isFormValid
  }



  async AddCourse_click(content: any) {
    try {
      this.loaderService.requestStarted();
      //reset Parametreas
      this.ddlCourse = 0;
      this.SubjectDetails = [];
      this.isAddNOCCourse = false;
      this.searchTextNewCourse = '';
      // get
      // model popup
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpaymentdetails-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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


  async FillCourses() {
    try {
      // Deparment level
      await this.commonMasterService.GetCollegeWiseCourseIDSubjectList(this.request.CollegeID, 0, 'GetCollegeWiseCourseList')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseDataList = data['Data'][0]['data'];

        }, error => console.error(error));

      await this.commonMasterService.GetCollegeWiseCourseIDSubjectList(this.request.CollegeID, 0, 'GetCollegeWiseExistingCourseList')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ExistingCourseDataList = data['Data'][0]['data'];
        }, error => console.error(error));


      await this.commonMasterService.GetCollegeWiseCourseIDSubjectList(this.request.CollegeID, 0, 'GetCollegeWiseExistingCourseListTNOCExtension')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseDataListTNOC = data['Data'][0]['data'];
        }, error => console.error(error));


      await this.commonMasterService.GetCollegeWiseCourseIDSubjectList(this.request.CollegeID, 0, 'GetCollegeWiseExistingCourseListPNOC')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseDataListPNOC = data['Data'][0]['data'];
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


  async ddlCourse_change($event: any, SeletedCourseID: any) {
    try {
      this.SubjectDetails = [];
      var CollegeWiseCourseID = this.CourseDataList.find((x: { CourseID: number; }) => x.CourseID == SeletedCourseID).CollegeWiseCourseID;

      this.loaderService.requestStarted();
      const courseId = Number(SeletedCourseID);

      if (courseId <= 0) {
        return;
      }
      await this.commonMasterService.GetCollegeWiseCourseIDSubjectList(this.request.CollegeID, CollegeWiseCourseID, 'GetCollegeWiseCourseIDSubjectList')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectDetails = data['Data'][0]['data'];
          this.isShowGrid = true;
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
    SeletedCourseID = '';
  }

  async ddlExistingCourse_change($event: any, SeletedCourseID: any) {
    try {
      this.NewSubjectDetails = [];
      var CollegeWiseCourseID = this.ExistingCourseDataList.find((x: { CourseID: number; }) => x.CourseID == SeletedCourseID).CollegeWiseCourseID;

      this.loaderService.requestStarted();
      const courseId = Number(SeletedCourseID);

      if (courseId <= 0) {
        return;
      }
      await this.commonMasterService.GetCollegeWiseCourseIDSubjectList(this.request.CollegeID, CollegeWiseCourseID, 'GetCollegeWiseNewSubjectNOCList')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.NewSubjectDetails = data['Data'][0]['data'];
          this.isShowGrid = true;
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
    SeletedCourseID = '';
  }

  async ddlTNOCCourse_change($event: any, SeletedCourseID: any) {
    try {
      this.TNOCSubjectDetails = [];
      var CollegeWiseCourseID = this.CourseDataListTNOC.find((x: { CourseID: number; }) => x.CourseID == SeletedCourseID).CollegeWiseCourseID;

      this.loaderService.requestStarted();
      const courseId = Number(SeletedCourseID);

      if (courseId <= 0) {
        return;
      }
      await this.commonMasterService.GetCollegeWiseCourseIDSubjectList(this.request.CollegeID, CollegeWiseCourseID, 'GetCollegeWiseSubjectNOCListTNOCExtension')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TNOCSubjectDetails = data['Data'][0]['data'];
          this.isShowGrid = true;
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
    SeletedCourseID = '';
  }

  async ddlPNOCCourse_change($event: any, SeletedCourseID: any) {
    try {
      this.PNOCSubjectDetails = [];
      //var CollegeWiseCourseID = this.CourseDataListPNOC.find((x: { CourseID: number; }) => x.CourseID == SeletedCourseID).CollegeWiseCourseID;
      //this.loaderService.requestStarted();
      //const courseId = Number(SeletedCourseID);
      //if (courseId <= 0) {
      //  return;
      //}
      await this.commonMasterService.GetCollegeWiseCourseIDSubjectList(this.request.CollegeID, SeletedCourseID, 'GetCollegeWiseNewSubjectNOCListPNOC')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PNOCSubjectDetails = data['Data'][0]['data'];
          this.isShowGrid = true;
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
    SeletedCourseID = '';
  }




  async ddlCourseLevel_change(CourseLevelID: any) {

    //this.request.CourseLevelID = CourseLevelID;

    await this.commonMasterService.GetAddCourseList_DepartmentIDWise(this.request.DepartmentID, CourseLevelID)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CourseDataList = data['Data'];
        console.log(this.CourseDataList);
      }, error => console.error(error));

    this.CourseDataList = this.CourseDataList.filter(item => item.CourseLevelID == CourseLevelID);
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

  //Add course
  btn_AddCourse() {
    this.isAddNOCCourse = true;
    if (this.ddlCourse == undefined || this.ddlCourse <= 0 || this.ddlCourse == null) {
      return;
    }
    if (this.SubjectDetails != null && this.SubjectDetails.length > 0) {
      if (this.SubjectDetails.filter(f => f.IsChecked == true).length <= 0) {
        this.toastr.warning('Please select atleast one subject');
        return;
      }
    }
    else {
      this.toastr.warning('Please select atleast one subject');
    }
    var ExistorNotCourse = this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourse)?.CourseName;
    if (ExistorNotCourse != undefined && ExistorNotCourse != '') {
      this.toastr.warning('Duplicate course not allowed');
      return;
    }
    let CourseName = this.CourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourse).CourseName;
    let CollegeLevel = this.CourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourse).strCollegeLevel;
    let CourseFeesAmount = this.CourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourse).CourseFeesAmount;



    if ((CourseName.toLowerCase() == 'bachelor of arts' || CourseName.toLowerCase() == 'bachelor of commerce' || CourseName.toLowerCase() == 'bachelor of science')) {
      if (this.SubjectDetails.filter(f => f.IsChecked == true).length < 3) {
        this.toastr.error("Minimum 3 Subject Required.");
        return;
      }
    }


    var data: ApplyNocParameterCourseDataModel = new ApplyNocParameterCourseDataModel();
    data.CourseID = this.ddlCourse;
    data.CourseName = CourseName;
    data.CollegeLevel = CollegeLevel;
    data.CourseFeesAmount = CourseFeesAmount;
    data.ApplyNocParameterSubjectList = this.SubjectDetails.filter(f => f.IsChecked == true);
    this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.push(data);

    if (this.SelectedDepartmentID != 1) {
      this.ApplyNocParameterMasterList_NewCourse.FeeAmount = this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.map(t => t.CourseFeesAmount).reduce((acc, value) => acc + value, 0)
    }
    //calc
    this.CalculateAllAmount();


    //close data
    this.modalService.dismissAll('After Success');
    this.isAddNOCCourse = false;
    this.ddlCourse = 0;
    this.SubjectDetails = [];
  }



  async AddCourseSubject_click(content: any) {
    try {
      this.loaderService.requestStarted();
      //reset Parametreas

      this.NewSubjectDetails = [];
      this.ddlCourseSubject = 0;
      this.isAddNOCCourseSubject = false;
      this.searchTextNewSubject = '';
      // get
      // model popup
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpaymentdetails-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  async btn_AddCourseSubject() {
    this.isAddNOCCourseSubject = true;
    if (this.ddlCourseSubject == undefined || this.ddlCourseSubject <= 0 || this.ddlCourseSubject == null) {
      return;
    }
    if (this.NewSubjectDetails != null && this.NewSubjectDetails.length > 0) {
      if (this.NewSubjectDetails.filter(f => f.IsChecked == true).length <= 0) {
        this.toastr.warning('Please select atleast one subject');
        return;
      }
    }
    else {
      this.toastr.warning('Please select atleast one subject');
    }
    var ExistorNotCourse = this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocParameterCourseList.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourseSubject)?.CourseName;
    if (ExistorNotCourse != undefined && ExistorNotCourse != '') {
      this.toastr.warning('Duplicate course not allowed');
      return;
    }
    let CourseName = this.ExistingCourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourseSubject).CourseName;
    let CollegeLevel = this.ExistingCourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourseSubject).strCollegeLevel;
    let CourseFeesAmount = this.ExistingCourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourseSubject).CourseFeesAmount;

    var data: ApplyNocParameterCourseDataModel = new ApplyNocParameterCourseDataModel();
    data.CourseID = this.ddlCourseSubject;
    data.CourseName = CourseName;
    data.CollegeLevel = CollegeLevel;
    data.CourseFeesAmount = CourseFeesAmount;
    data.ApplyNocParameterSubjectList = this.NewSubjectDetails.filter(f => f.IsChecked == true);
    this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocParameterCourseList.push(data);
    //close data
    this.ApplyNocParameterMasterList_NewCourseSubject.FeeAmount = await this.calcuateSumofNewSubject();

    //calc
    this.CalculateAllAmount();


    this.modalService.dismissAll('After Successd');
    this.isAddNOCCourseSubject = false;
    this.ddlCourseSubject = 0;
    this.NewSubjectDetails = [];
  }





  btn_AddTNOCSubject() {
    this.isAddNOCCourseSubjectTNOC = true;
    if (this.ddlCourseTNOC == undefined || this.ddlCourseTNOC <= 0 || this.ddlCourseTNOC == null) {
      return;
    }
    if (this.TNOCSubjectDetails != null && this.TNOCSubjectDetails.length > 0) {
      if (this.TNOCSubjectDetails.filter(f => f.IsChecked == true).length <= 0) {
        this.toastr.warning('Please select atleast one subject');
        return;
      }
    }
    else {
      this.toastr.warning('Please select atleast one subject');
    }
    var ExistorNotCourse = this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocParameterCourseList.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourseTNOC)?.CourseName;
    if (ExistorNotCourse != undefined && ExistorNotCourse != '') {
      this.toastr.warning('Duplicate course not allowed');
      return;
    }
    let CourseName = this.CourseDataListTNOC.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourseTNOC).CourseName;
    let CollegeLevel = this.CourseDataListTNOC.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourseTNOC).strCollegeLevel;
    let CourseFeesAmount = this.CourseDataListTNOC.find((x: { CourseID: number; }) => x.CourseID == this.ddlCourseTNOC).CourseFeesAmount;

    var data: ApplyNocParameterCourseDataModel = new ApplyNocParameterCourseDataModel();
    data.CourseID = this.ddlCourseTNOC;
    data.CourseName = CourseName;
    data.CollegeLevel = CollegeLevel;
    data.CourseFeesAmount = CourseFeesAmount;
    data.ApplyNocParameterSubjectList = this.TNOCSubjectDetails.filter(f => f.IsChecked == true);
    this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocParameterCourseList.push(data);

    //calc
    this.CalculateAllAmount();
    //close data
    this.ApplyNocParameterMasterList_TNOCExtOfSubject.FeeAmount = this.calcuateTNOCSubjectFees();



    this.modalService.dismissAll('After Success');
    this.isAddNOCCourseSubjectTNOC = false;
    this.ddlCourseTNOC = 0;
    this.TNOCSubjectDetails = [];
  }





  btn_AddPNOCCSubject() {
    this.isAddNOCCoursePNOC = true;
    if (this.ddlCoursePNOC == undefined || this.ddlCoursePNOC <= 0 || this.ddlCoursePNOC == null) {
      return;
    }
    if (this.PNOCSubjectDetails != null && this.PNOCSubjectDetails.length > 0) {
      if (this.PNOCSubjectDetails.filter(f => f.IsChecked == true).length <= 0) {
        this.toastr.warning('Please select atleast one subject');
        return;
      }
    }
    else {
      this.toastr.warning('Please select atleast one subject');
    }
    var ExistorNotCourse = this.ApplyNocParameterMasterList_PNOCOfSubject.ApplyNocParameterCourseList.find((x: { CourseID: number; }) => x.CourseID == this.ddlCoursePNOC)?.CourseName;
    if (ExistorNotCourse != undefined && ExistorNotCourse != '') {
      this.toastr.warning('Duplicate course not allowed');
      return;
    }
    let CourseName = this.CourseDataListPNOC.find((x: { CourseID: number; }) => x.CourseID == this.ddlCoursePNOC).CourseName;
    let CollegeLevel = this.CourseDataListPNOC.find((x: { CourseID: number; }) => x.CourseID == this.ddlCoursePNOC).strCollegeLevel;
    let CourseFeesAmount = this.CourseDataListPNOC.find((x: { CourseID: number; }) => x.CourseID == this.ddlCoursePNOC).CourseFeesAmount;

    var data: ApplyNocParameterCourseDataModel = new ApplyNocParameterCourseDataModel();
    data.CourseID = this.ddlCoursePNOC;
    data.CourseName = CourseName;
    data.CollegeLevel = CollegeLevel;
    data.CourseFeesAmount = CourseFeesAmount;
    data.ApplyNocParameterSubjectList = this.PNOCSubjectDetails.filter(f => f.IsChecked == true);
    this.ApplyNocParameterMasterList_PNOCOfSubject.ApplyNocParameterCourseList.push(data);
    //close data
    //this.ApplyNocParameterMasterList_PNOCOfSubject.FeeAmount = this.calcuatePNOCSubjectFees();

    //calc
    this.CalculateAllAmount();

    this.modalService.dismissAll('After Success');
    this.isAddNOCCoursePNOC = false;
    this.ddlCoursePNOC = 0;
    this.PNOCSubjectDetails = [];
  }


  async calcuateSumofNewSubject(): Promise<number> {

    if (this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocParameterCourseList != null) {
      this.totalNewSubjectFees = 0;

      await this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocParameterCourseList.forEach(element => {
        element.ApplyNocParameterSubjectList.forEach(e2 => {
          if (element.CollegeLevel == 'UG') {
            this.totalNewSubjectFees = Number(element.CourseFeesAmount);
          }
        })
      });

      await this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocParameterCourseList.forEach(element => {
        element.ApplyNocParameterSubjectList.forEach(e2 => {
          if (element.CollegeLevel == 'PG') {
            this.totalNewSubjectFees += Number(element.CourseFeesAmount);
          }
        })
      });

    }
    return this.totalNewSubjectFees;
  }


  calcuateTNOCSubjectFees(): number {
    //if (this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocParameterCourseList != null) {
    //  this.totalTNOCSubjectFees = 0;
    //  this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocParameterCourseList.forEach(element => {
    //    element.ApplyNocParameterSubjectList.forEach(e2 => {
    //      if (element.CollegeLevel == 'UG') {
    //        this.totalTNOCSubjectFees = Number(element.CourseFeesAmount);
    //      }
    //    })
    //  });

    //  this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocParameterCourseList.forEach(element => {
    //    element.ApplyNocParameterSubjectList.forEach(e2 => {
    //      if (element.CollegeLevel == 'PG') {
    //        this.totalTNOCSubjectFees += Number(element.CourseFeesAmount);
    //      }
    //    })
    //  });

    //}
    //return this.totalTNOCSubjectFees + this.TNOCParameterFees;
    return this.TNOCParameterFees;
  }

  calcuatePNOCSubjectFees(): number {
    if (this.ApplyNocParameterMasterList_PNOCOfSubject.ApplyNocParameterCourseList != null) {
      this.totalPNOCSubjectFees = 0;
      this.ApplyNocParameterMasterList_PNOCOfSubject.ApplyNocParameterCourseList.forEach(element => {
        element.ApplyNocParameterSubjectList.forEach(e2 => {
          this.totalPNOCSubjectFees += Number(element.CourseFeesAmount);
        })
      });
    }
    return this.totalPNOCSubjectFees;
  }


  //delete items
  btn_DeleteCourse(CourseID: number) {
    if (confirm("Are you sure you want to delete this ?")) {

      const indexToRemove = this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.findIndex((pl) => pl.CourseID === CourseID);
      this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.splice(indexToRemove, 1);
      this.CalculateAllAmount();
      //Remove Calculation
      this.ApplyNocParameterMasterList_NewCourse.FeeAmount = this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.map(t => t.CourseFeesAmount).reduce((acc, value) => acc + value, 0)

    }
  }
  //delete items
  async btn_DeleteCourseSubject(CourseID: number) {
    if (confirm("Are you sure you want to delete this ?")) {

      const indexToRemove = this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocParameterCourseList.findIndex((pl) => pl.CourseID === CourseID);
      this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocParameterCourseList.splice(indexToRemove, 1);
      this.CalculateAllAmount();
      this.ApplyNocParameterMasterList_NewCourseSubject.FeeAmount = await this.calcuateSumofNewSubject();
    }
  }


  btn_DeleteTNOCCourseSubject(CourseID: number) {
    if (confirm("Are you sure you want to delete this ?")) {

      const indexToRemove = this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocParameterCourseList.findIndex((pl) => pl.CourseID === CourseID);
      this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocParameterCourseList.splice(indexToRemove, 1);
      this.ApplyNocParameterMasterList_TNOCExtOfSubject.FeeAmount = this.calcuateTNOCSubjectFees();
      this.CalculateAllAmount();
    }
  }

  btn_DeletePNOCCourseSubject(CourseID: number) {
    if (confirm("Are you sure you want to delete this ?")) {
      const indexToRemove = this.ApplyNocParameterMasterList_PNOCOfSubject.ApplyNocParameterCourseList.findIndex((pl) => pl.CourseID === CourseID);
      this.ApplyNocParameterMasterList_PNOCOfSubject.ApplyNocParameterCourseList.splice(indexToRemove, 1);
      //this.ApplyNocParameterMasterList_PNOCOfSubject.FeeAmount = this.calcuatePNOCSubjectFees();
      this.CalculateAllAmount();
    }
  }




  async AddTNOCSubject_click(content: any) {
    try {
      this.loaderService.requestStarted();
      //reset Parametreas

      this.TNOCSubjectDetails = [];
      this.ddlCourseTNOC = 0;
      this.isAddNOCCourseSubjectTNOC = false;
      this.searchTextNewTNOC = '';
      // get
      // model popup
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpaymentdetails-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  async AddPNOCSubject_click(content: any) {
    try {
      this.loaderService.requestStarted();
      //reset Parametreas

      this.PNOCSubjectDetails = [];
      this.ddlCoursePNOC = 0;
      this.isAddNOCCoursePNOC = false;
      this.searchTextNewPNOC = '';
      // get
      // model popup
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpaymentdetails-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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



  ddlSreamChangeReset(ID: any) { }

  ResetValidationVariable() {
    this.isFormValid = true;
    this.isValidCollegeNewName_Eng = false;
    this.isValidCollegeNewName_Hi = false;
    this.isChangeInNameOfCollege_Document = false;
    this.isChangeInPlaceNewName = false;
    this.isChangeInPlaceNameOfCollege_Document = false;
    this.isChangeInPlaceNameOfCollege_PlaceDocument = false;

    //Consern Mangement Document
    this.isCoedtoGConsentDocument = false;
    this.isConsentManagementDocument = false;
    this.isConsentStudentDocument = false;



    this.isSocietyProposal = false;
    this.isAllNOC = false;
    this.isUniversityAffiliation = false;
    this.isConsentAffidavit = false;
    this.isNOCAffiliationUniversity = false;


    //merger
    this.isOtherAllNOC = false;
    this.isOtherUniversityAffiliation = false;
    this.isOtherNOCAffiliationUniversity = false;
    this.isOtherConsentAffidavit = false;
    this.isLandTitleCertificate = false;
    this.isBuildingBluePrint = false;
    this.isStaffInformation = false;
    this.isNewSocietyName = false;
    this.isCmDocumentName = false;
    this.isAnnexureDocument = false;


  }


  async ApplyNocFor_rbChange(event: any, selectedvalue: any, item: any) {

    this.ApplyNocParameterMasterList_ddl = [];
    this.ApplyNocParameterMasterList_TNOCExtension = null;
    this.ApplyNocParameterMasterList_AdditionOfNewSeats60 = null;
    //parameters details
    this.ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
    this.ApplyNocParameterMasterList_ChangeInInspectionFee = null;
    this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
    this.ApplyNocParameterMasterList_ChangeInGirlstoCoed = null;
    this.ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
    this.ApplyNocParameterMasterList_MergerCollege = null;
    this.ApplyNocParameterMasterList_NewCourse = null;
    this.ApplyNocParameterMasterList_NewCourseSubject = null;
    this.ApplyNocParameterMasterList_TNOCExtOfSubject = null;
    this.ApplyNocParameterMasterList_PNOCOfSubject = null;

    this.ApplyNocParameterMasterList_ChangeInCoedtoGirls = null
    this.IsTermsChecked = false;
    if (item.Code == 'InspectionFee') {
      this.isInspectionFee = true;
      await this.GetCollegeInspectionFee();
      this.request.ApplyNocLateFeeDetailList = [];

      //this.isShowPriceDetails = false;

    }
    else {
      await this.GetApplyNocParameterMaster();
      this.isInspectionFee = false;
      this.DepartmentInspectionFee = 0;
      // this.isShowPriceDetails = true;
    }



    await this.GetNocLateFees();
    await this.GetDefaulterCollegePenalty();
    await this.CalculateAllAmount();
  }

  async GetDefaulterCollegePenalty() {
    try {
      debugger
      this.loaderService.requestStarted();
      await this.applyNocParameterService.GetDefaulterCollegePenalty(this.request.CollegeID, "-1", '-1')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.DefaulterCollegePenaltyDetailList = data['Data'][0]['data'];

          if (this.request.DefaulterCollegePenaltyDetailList != null) {
            if (this.request.DefaulterCollegePenaltyDetailList.length > 0) {
              this.request.TotalDefaulterCollegePenalty = this.request.DefaulterCollegePenaltyDetailList.map(t => t.PenaltyAmount).reduce((acc, value) => acc + value, 0);
            }
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
  async GetCollegeInspectionFee() {
    await this.commonMasterService.GetCollegeInspectionFee(this.request.CollegeID, this.request.DepartmentID)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DepartmentInspectionFee = data['Data'][0]['data'][0]['FeeAmount'];
        console.log(data);
      }, error => console.error(error));
  }

  async SaveInspectionFee_click() {
    this.DepartmentInspectionFee;
  }


  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode == 47 || charCode < 46 || charCode > 57)) {
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

  alphaNumaricOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }


  async CalculateAllAmount() {
    try {
      this.request.ApplyNocParameterMasterListDataModel = this.ApplyNocParameterMasterList_ddl;

      let totalFeeList = this.request.ApplyNocParameterMasterListDataModel?.filter((element: any) => { return element.IsChecked == true; });
      // and total fee
      this.request.TotalFeeAmount = 0;
      this.request.TotalDefaulterCollegePenalty = 0;
      for (let i = 0; i < totalFeeList.length; i++) {
        this.request.TotalFeeAmount += totalFeeList[i].FeeAmount;
      }
      //for Dec New Subject
      if (this.ApplyNocParameterMasterList_NewCourse?.ApplyNocParameterCourseList != null) {
        //for Dec New Subject
        if (this.SelectedDepartmentID != 1) {
          this.request.TotalFeeAmount += this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.map(t => t.CourseFeesAmount).reduce((acc, value) => acc + value, 0)
        }
      }
      //for Dec New Subject
      if (this.ApplyNocParameterMasterList_NewCourseSubject?.ApplyNocParameterCourseList != null) {

        this.request.TotalFeeAmount += await this.calcuateSumofNewSubject();
      }
      //DEC TNOC
      //if (this.ApplyNocParameterMasterList_TNOCExtOfSubject?.ApplyNocParameterCourseList != null) {

      //  this.request.TotalFeeAmount += this.calcuateTNOCSubjectFees();
      //}
      //DEC NOC
      if (this.ApplyNocParameterMasterList_PNOCOfSubject?.ApplyNocParameterCourseList != null) {

        //this.request.TotalFeeAmount += this.calcuatePNOCSubjectFees();
      }

      this.request.TotalNocFee = this.request.TotalFeeAmount;
      if (this.request.ApplyNocLateFeeDetailList != null) {
        if (this.request.ApplyNocLateFeeDetailList.length > 0) {
          this.request.TotalFeeAmount += this.TotalLateFees;
          this.request.LateFee = this.TotalLateFees;
        }
      }


      for (let i = 0; i < this.request.DefaulterCollegePenaltyDetailList.length; i++) {
        this.request.TotalDefaulterCollegePenalty += this.request.DefaulterCollegePenaltyDetailList[i].PenaltyAmount;
      }

      this.request.TotalNocFee += this.DepartmentInspectionFee;

      this.request.TotalFeeAmount += this.DepartmentInspectionFee;
/*      setTimeout(() => {*/
        this.request.TotalFeeAmount += this.request.TotalDefaulterCollegePenalty;
   /*   }, 500);*/


    } catch (error) {

    }
  }

  async fDTE_ChangeInTheMinorityStatusoftheInstitution_onFilechange(event: any) {

    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.warning('Select less then 2MB File');
            event.target.value = ''
            this.request.DTE_ChangeInTheMinorityStatusoftheInstitution = '';
            this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Dis_FileName = '';
            this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Path = '';
            return
          }
          if (this.file.size < 100000) {
            this.toastr.warning('Select more then 100kb File');
            event.target.value = ''
            this.request.DTE_ChangeInTheMinorityStatusoftheInstitution = '';
            this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Dis_FileName = '';
            this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Path = '';
            return
          }

          // upload to server folder
          await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.request.DTE_ChangeInTheMinorityStatusoftheInstitution = data['Data'][0]["FileName"];
              this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Dis_FileName = data['Data'][0]["Dis_FileName"];
              this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Path = data['Data'][0]["FilePath"];
              event.target.value = ''
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
          this.toastr.warning('Select Only pdf/jpg/jpeg');
          event.target.value = ''
          this.request.DTE_ChangeInTheMinorityStatusoftheInstitution = '';
          this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Dis_FileName = '';
          this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Path = '';
          return
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


  async fExistingLetterofEOA_onFilechange(event: any) {

    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.warning('Select less then 2MB File');
            event.target.value = ''
            this.request.ExistingLetterofEOA = '';
            this.request.ExistingLetterofEOA_Dis_FileName = '';
            this.request.ExistingLetterofEOA_Path = '';
            return
          }
          if (this.file.size < 100000) {
            this.toastr.warning('Select more then 100kb File');
            event.target.value = ''
            this.request.ExistingLetterofEOA = '';
            this.request.ExistingLetterofEOA_Dis_FileName = '';
            this.request.ExistingLetterofEOA_Path = '';
            return
          }

          // upload to server folder
          await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.request.ExistingLetterofEOA = data['Data'][0]["FileName"];
              this.request.ExistingLetterofEOA_Dis_FileName = data['Data'][0]["Dis_FileName"];
              this.request.ExistingLetterofEOA_Path = data['Data'][0]["FilePath"];
              event.target.value = ''
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
          this.toastr.warning('Select Only pdf/jpg/jpeg');
          event.target.value = ''
          this.request.ExistingLetterofEOA = '';
          this.request.ExistingLetterofEOA_Dis_FileName = '';
          this.request.ExistingLetterofEOA_Path = '';
          return
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
  async DeleteImage(file: string) {
    try {

      this.loaderService.requestStarted();
      // delete from server folder
      await this.fileUploadService.DeleteDocument(file).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.request.ExistingLetterofEOA = '';
          this.request.ExistingLetterofEOA_Dis_FileName = '';
          this.request.ExistingLetterofEOA_Path = '';
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

  async DTE_ChangeInTheMinorityStatusoftheInstitution_DeleteImage(file: string) {
    try {

      this.loaderService.requestStarted();
      // delete from server folder
      await this.fileUploadService.DeleteDocument(file).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.request.DTE_ChangeInTheMinorityStatusoftheInstitution = '';
          this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Dis_FileName = '';
          this.request.DTE_ChangeInTheMinorityStatusoftheInstitution_Path = '';
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

  Add_IncreaseinIntake() {

    if (this.request.DTE_IncreaseinIntakeAdditionofCourse.CourseID == 0) {
      this.toastr.error("Select Course.!");
      return;
    }
    if (this.request.DTE_IncreaseinIntakeAdditionofCourse.Intake == 0) {
      this.toastr.error("Enter intake greater than zero.!");
      return;
    }


    var CourseExit = this.request.DTE_IncreaseinIntakeAdditionofCourse_List.filter((x: { CourseID: number; }) => x.CourseID == this.request.DTE_IncreaseinIntakeAdditionofCourse.CourseID);
    if (CourseExit.length > 0) {
      this.toastr.warning("Course Already Added.!");
      return;
    }


    this.request.DTE_IncreaseinIntakeAdditionofCourse_List.push({
      DetailID: 0,
      ApplyNocID: 0,
      DepartmentID: 0,
      CollegeID: 0,
      CourseID: this.request.DTE_IncreaseinIntakeAdditionofCourse.CourseID,
      CourseName: this.DTE_CourseDataListIncreaseinIntake_Master.find((x: { CourseID: number; }) => x.CourseID == this.request.DTE_IncreaseinIntakeAdditionofCourse.CourseID).CourseName,
      Intake: this.request.DTE_IncreaseinIntakeAdditionofCourse.Intake,
      FeeAmount: this.request.DTE_IncreaseinIntakeAdditionofCourse.FeeAmount,

      StreamID: this.request.DTE_IncreaseinIntakeAdditionofCourse.StreamID,
      CourseLevelID: this.request.DTE_IncreaseinIntakeAdditionofCourse.CourseLevelID,
      StreamName: this.DTE_streamDataList.find((x: { StreamMasterID: number; }) => x.StreamMasterID == this.request.DTE_IncreaseinIntakeAdditionofCourse.StreamID).StreamName,
      CourseLevelName: this.DTE_CourseLevelList.find((x: { ID: number; }) => x.ID == this.request.DTE_IncreaseinIntakeAdditionofCourse.CourseLevelID).Name
    });
    this.request.DTE_IncreaseinIntakeAdditionofCourse.CourseID = 0;
    this.request.DTE_IncreaseinIntakeAdditionofCourse.CourseName = '';
    this.request.DTE_IncreaseinIntakeAdditionofCourse.Intake = 0;

  }
  Delete_IncreaseinIntake(item: ApplyNocParameterMasterList_IncreaseinIntakeAdditionofCourse) {
    try {
      this.loaderService.requestStarted();
      //debugger
      if (confirm("Are you sure you want to delete this ?")) {
        const index: number = this.request.DTE_IncreaseinIntakeAdditionofCourse_List.indexOf(item);
        if (index != -1) {
          this.request.DTE_IncreaseinIntakeAdditionofCourse_List.splice(index, 1)
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

  /*To start new Programme / Level in the existing Institutions*/
  Add_TostartNewProgramme() {

    if (this.request.DTE_TostartNewProgramme.CourseID == 0) {
      this.toastr.error("Select Course.!");
      return;
    }
    if (this.request.DTE_TostartNewProgramme.Intake == 0) {
      this.toastr.error("Enter intake greater than zero.!");
      return;
    }


    var CourseExit = this.request.DTE_TostartNewProgramme_List.filter((x: { CourseID: number; }) => x.CourseID == this.request.DTE_TostartNewProgramme.CourseID);
    if (CourseExit.length > 0) {
      this.toastr.warning("Course Already Added.!");
      return;
    }


    this.request.DTE_TostartNewProgramme_List.push({
      DetailID: 0,
      ApplyNocID: 0,
      DepartmentID: 0,
      CollegeID: 0,
      CourseID: this.request.DTE_TostartNewProgramme.CourseID,
      CourseName: this.DTE_CourseDataList_Master.find((x: { CourseID: number; }) => x.CourseID == this.request.DTE_TostartNewProgramme.CourseID).CourseName,
      Intake: this.request.DTE_TostartNewProgramme.Intake,
      FeeAmount: this.request.DTE_TostartNewProgramme.FeeAmount,
      StreamID: this.request.DTE_TostartNewProgramme.StreamID,
      CourseLevelID: this.request.DTE_TostartNewProgramme.CourseLevelID,
      StreamName: this.DTE_streamMasterDataList.find((x: { StreamMasterID: number; }) => x.StreamMasterID == this.request.DTE_TostartNewProgramme.StreamID).StreamName,
      CourseLevelName: this.DTE_CourseLevelMasterList.find((x: { ID: number; }) => x.ID == this.request.DTE_TostartNewProgramme.CourseLevelID).Name
    });
    this.request.DTE_TostartNewProgramme.CourseID = 0;
    this.request.DTE_TostartNewProgramme.CourseName = '';
    this.request.DTE_TostartNewProgramme.Intake = 0;
    this.request.DTE_TostartNewProgramme.StreamID = 0;
    this.request.DTE_TostartNewProgramme.CourseLevelID = 0;
    this.DTE_CourseDataList_Master = [];

  }
  Delete_TostartNewProgramme(item: ApplyNocParameterMasterList_TostartNewProgramme) {
    try {
      this.loaderService.requestStarted();
      //debugger
      if (confirm("Are you sure you want to delete this ?")) {
        const index: number = this.request.DTE_TostartNewProgramme_List.indexOf(item);
        if (index != -1) {
          this.request.DTE_TostartNewProgramme_List.splice(index, 1)
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


  /*Increase in Intake / Addition of Course*/
  Add_IncreaseInIntake_AdditionofCourse() {

    if (this.request.DTE_IncreaseInIntake_AdditionofCourse.CourseID == 0) {
      this.toastr.error("Select Course.!");
      return;
    }
    if (this.request.DTE_IncreaseInIntake_AdditionofCourse.Intake == 0) {
      this.toastr.error("Enter intake greater than zero.!");
      return;
    }
    if (this.request.DTE_IncreaseInIntake_AdditionofCourse.UpdatedIntake == 0) {
      this.toastr.error("Enter updated intake greater than zero.!");
      return;
    }


    var CourseExit = this.request.DTE_IncreaseInIntake_AdditionofCourse_List.filter((x: { CourseID: number; }) => x.CourseID == this.request.DTE_IncreaseInIntake_AdditionofCourse.CourseID);
    if (CourseExit.length > 0) {
      this.toastr.warning("Course Already Added.!");
      return;
    }


    this.request.DTE_IncreaseInIntake_AdditionofCourse_List.push({
      DetailID: 0,
      ApplyNocID: 0,
      DepartmentID: 0,
      CollegeID: 0,
      CourseID: this.request.DTE_IncreaseInIntake_AdditionofCourse.CourseID,
      CourseName: this.DTE_CourseDataListIncreaseInIntake_AdditionofCourse.find((x: { CourseID: number; }) => x.CourseID == this.request.DTE_IncreaseInIntake_AdditionofCourse.CourseID).CourseName,
      Intake: this.request.DTE_IncreaseInIntake_AdditionofCourse.Intake,
      UpdatedIntake: this.request.DTE_IncreaseInIntake_AdditionofCourse.UpdatedIntake,
      FeeAmount: this.request.DTE_IncreaseInIntake_AdditionofCourse.FeeAmount,

      StreamID: this.request.DTE_IncreaseInIntake_AdditionofCourse.StreamID,
      CourseLevelID: this.request.DTE_IncreaseInIntake_AdditionofCourse.CourseLevelID,
      StreamName: this.DTE_streamDataList.find((x: { StreamMasterID: number; }) => x.StreamMasterID == this.request.DTE_IncreaseInIntake_AdditionofCourse.StreamID).StreamName,
      CourseLevelName: this.DTE_CourseLevelList.find((x: { ID: number; }) => x.ID == this.request.DTE_IncreaseInIntake_AdditionofCourse.CourseLevelID).Name
    });
    this.request.DTE_IncreaseInIntake_AdditionofCourse.CourseID = 0;
    this.request.DTE_IncreaseInIntake_AdditionofCourse.CourseName = '';
    this.request.DTE_IncreaseInIntake_AdditionofCourse.Intake = 0;
    this.request.DTE_IncreaseInIntake_AdditionofCourse.UpdatedIntake = 0;

  }
  Delete_IncreaseInIntake_AdditionofCourse(item: ApplyNocParameterMasterList_IncreaseInIntake_AdditionofCourse) {
    try {
      this.loaderService.requestStarted();
      //debugger
      if (confirm("Are you sure you want to delete this ?")) {
        const index: number = this.request.DTE_IncreaseInIntake_AdditionofCourse_List.indexOf(item);
        if (index != -1) {
          this.request.DTE_IncreaseInIntake_AdditionofCourse_List.splice(index, 1)
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
  async ddlDTECouser_IncreaseinIntake_change(values: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetIntakeByCollegeCourse(this.request.CollegeID, values)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.request.DTE_IncreaseInIntake_AdditionofCourse.Intake = data['Data'][0]['data'][0]['Intake'];
        }, (error: any) => console.error(error));
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


  //Amit
  public courseDataList: any = [];
  public UniversityID: number = 0;
  public SelectedCollageID: number = 0;
  public DTE_AdditionofIntegratedDualDegreeList: any = [];
  public DTE_AdditionofIntegratedDualDegree: ApplyNocParameterMasterList_AdditionofIntegratedDualDegree = new ApplyNocParameterMasterList_AdditionofIntegratedDualDegree();
  public DTE_ChangeInNameOfCourseList: any = [];
  public DTE_ChangeInNameOfCourse: ApplyNocParameterMasterList_ChangeInNameOfCourse = new ApplyNocParameterMasterList_ChangeInNameOfCourse();
  public DTE_ReductionInIntakeList: any = [];
  public DTE_ReductionInIntake: ApplyNocParameterMasterList_ReductionInIntake = new ApplyNocParameterMasterList_ReductionInIntake();
  public DTE_ClosureOfProgramList: any = [];
  public DTE_ClosureOfProgram: ApplyNocParameterMasterList_ClosureOfProgram = new ApplyNocParameterMasterList_ClosureOfProgram();
  public DTE_ClosureOfCoursesList: any = [];
  public DTE_ClosureOfCourses: ApplyNocParameterMasterList_ClosureOfCourses = new ApplyNocParameterMasterList_ClosureOfCourses();
  public DTE_MergerOfTheCourseList: any = [];
  public DTE_MergerOfTheCourse: ApplyNocParameterMasterList_MergerOfTheCourse = new ApplyNocParameterMasterList_MergerOfTheCourse();
  public IntakeValuesList: any = [];

  async Add_AdditionofIntegratedDualDegree() {

    if (this.DTE_AdditionofIntegratedDualDegree.CourseID == 0) {

      this.toastr.error("Select Course.!");

      return;

    }

    if (this.DTE_AdditionofIntegratedDualDegree.Intake == 0) {

      this.toastr.error("Enter intake greater than zero.!");

      return;

    }

    var CourseExit = this.request.DTE_AdditionofIntegratedDualDegreeList.filter((x: { CourseID: number; }) => x.CourseID == this.DTE_AdditionofIntegratedDualDegree.CourseID);

    if (CourseExit.length > 0) {

      this.toastr.warning("Course Already Added.!");

      return;

    }

    this.request.DTE_AdditionofIntegratedDualDegreeList.push({
      DetailID: 0,
      ApplyNocID: 0,
      DepartmentID: 0,
      CollegeID: 0,
      FeeAmount: 0,
      CourseID: this.DTE_AdditionofIntegratedDualDegree.CourseID,
      CourseName: this.DTE_AdditionofIntegratedDualDegreeCourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.DTE_AdditionofIntegratedDualDegree.CourseID).CourseName,
      Intake: this.DTE_AdditionofIntegratedDualDegree.Intake,
      StreamID: this.DTE_AdditionofIntegratedDualDegree.StreamID,
      CourseLevelID: this.DTE_AdditionofIntegratedDualDegree.CourseLevelID,
      StreamName: this.DTE_streamMasterDataList.find((x: { StreamMasterID: number; }) => x.StreamMasterID == this.DTE_AdditionofIntegratedDualDegree.StreamID).StreamName,
      CourseLevelName: this.DTE_CourseLevelMasterList_PG.find((x: { ID: number; }) => x.ID == this.DTE_AdditionofIntegratedDualDegree.CourseLevelID).Name

    });
    this.DTE_AdditionofIntegratedDualDegree.StreamID = 0;
    this.DTE_AdditionofIntegratedDualDegree.CourseLevelID = 0;
    this.DTE_AdditionofIntegratedDualDegree.CourseID = 0;
    this.DTE_AdditionofIntegratedDualDegree.Intake = 0;
    this.DTE_AdditionofIntegratedDualDegreeCourseDataList = [];
  }

  async Add_ChangeInNameOfCourse() {

    if (this.DTE_ChangeInNameOfCourse.CourseID == 0) {

      this.toastr.error("Select Course.!");

      return;

    }
    if (this.DTE_ChangeInNameOfCourse.NewCourseID == 0) {

      this.toastr.error("Select New Course.!");

      return;

    }

    var CourseExit = this.request.DTE_ChangeInNameOfCourseList.filter((x: { CourseID: number; }) => x.CourseID == this.DTE_ChangeInNameOfCourse.CourseID);

    if (CourseExit.length > 0) {

      this.toastr.warning("Course Already Added.!");

      return;

    }

    this.request.DTE_ChangeInNameOfCourseList.push({
      DetailID: 0,
      ApplyNocID: 0,
      DepartmentID: 0,
      CollegeID: 0,
      FeeAmount: 0,
      CourseID: this.DTE_ChangeInNameOfCourse.CourseID,
      CourseName: this.DTE_ChangeInNameOfCourseCourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.DTE_ChangeInNameOfCourse.CourseID).CourseName,
      NewCourseID: this.DTE_ChangeInNameOfCourse.NewCourseID,
      NewCourseName: this.DTE_ChangeInNameOfCourseCourseDataList_Master.find((x: { CourseID: number; }) => x.CourseID == this.DTE_ChangeInNameOfCourse.NewCourseID).CourseName,
      StreamID: this.DTE_ChangeInNameOfCourse.StreamID,
      CourseLevelID: this.DTE_ChangeInNameOfCourse.CourseLevelID,
      StreamName: this.DTE_streamDataList.find((x: { StreamMasterID: number; }) => x.StreamMasterID == this.DTE_ChangeInNameOfCourse.StreamID).StreamName,
      CourseLevelName: this.DTE_CourseLevelList.find((x: { ID: number; }) => x.ID == this.DTE_ChangeInNameOfCourse.CourseLevelID).Name

    });

    this.DTE_ChangeInNameOfCourse.CourseID = 0;
    this.DTE_ChangeInNameOfCourse.StreamID = 0;
    this.DTE_ChangeInNameOfCourse.CourseLevelID = 0;
    this.DTE_ChangeInNameOfCourse.NewCourseID = 0;
    this.DTE_ChangeInNameOfCourseCourseDataList = [];
    this.DTE_ChangeInNameOfCourseCourseDataList_Master = [];
  }

  async CalculateReducedIntake() {

    if (Number(this.DTE_ReductionInIntake.ReducedIntake) > Number(this.DTE_ReductionInIntake.CurrentIntake)) {

      this.toastr.error('Please Enter the Smaller values')

      return;

    }

  };

  async Add_ReductionInIntake() {

    if (this.DTE_ReductionInIntake.CourseID == 0) {

      this.toastr.error("Select Course.!");

      return;

    }

    if (this.DTE_ReductionInIntake.CurrentIntake == 0) {

      this.toastr.error("Enter Current Intake.!");

      return;

    }

    if (this.DTE_ReductionInIntake.ReducedIntake == 0) {

      this.toastr.error("Enter Reduced Intake.!");

      return;

    }

    if (Number(this.DTE_ReductionInIntake.ReducedIntake) > Number(this.DTE_ReductionInIntake.CurrentIntake)) {

      this.toastr.error('Please Enter the Smaller values')

      return;

    }

    var CourseExit = this.request.DTE_ReductionInIntakeList.filter((x: { CourseID: number; }) => x.CourseID == this.DTE_ReductionInIntake.CourseID);

    if (CourseExit.length > 0) {

      this.toastr.warning("Course Already Added.!");

      return;

    }

    this.request.DTE_ReductionInIntakeList.push({

      DetailID: 0,
      ApplyNocID: 0,
      DepartmentID: 0,
      CollegeID: 0,
      FeeAmount: 0,
      CourseID: this.DTE_ReductionInIntake.CourseID,
      CourseName: this.DTE_ReductionInIntakeCourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.DTE_ReductionInIntake.CourseID).CourseName,
      CurrentIntake: this.DTE_ReductionInIntake.CurrentIntake,
      ReducedIntake: this.DTE_ReductionInIntake.ReducedIntake,
      StreamID: this.DTE_ReductionInIntake.StreamID,
      CourseLevelID: this.DTE_ReductionInIntake.CourseLevelID,
      StreamName: this.DTE_streamDataList.find((x: { StreamMasterID: number; }) => x.StreamMasterID == this.DTE_ReductionInIntake.StreamID).StreamName,
      CourseLevelName: this.DTE_CourseLevelList.find((x: { ID: number; }) => x.ID == this.DTE_ReductionInIntake.CourseLevelID).Name

    });

    this.DTE_ReductionInIntake.CourseID = 0;
    this.DTE_ReductionInIntake.StreamID = 0;
    this.DTE_ReductionInIntake.CourseLevelID = 0;
    this.DTE_ReductionInIntake.CurrentIntake = 0;
    this.DTE_ReductionInIntake.ReducedIntake = 0;
    this.DTE_ReductionInIntakeCourseDataList = [];
  }

  async Add_ClosureOfProgram() {

    if (this.DTE_ClosureOfProgram.StreamID == 0) {
      this.toastr.error("Select Programme.!");
      return;
    }

    if (this.DTE_ClosureOfProgram.CourseLevelID == 0) {
      this.toastr.error("Select Course Level.!");
      return;
    }

    var CourseExit = this.request.DTE_ClosureOfProgramList.filter((x: { StreamID: number; CourseLevelID: number }) => x.StreamID == this.DTE_ClosureOfProgram.StreamID && x.CourseLevelID == this.DTE_ClosureOfProgram.CourseLevelID);

    if (CourseExit.length > 0) {

      this.toastr.warning("Programme and Course Level Already Added.!");

      return;

    }

    this.request.DTE_ClosureOfProgramList.push({
      DetailID: 0,
      ApplyNocID: 0,
      DepartmentID: 0,
      CollegeID: 0,
      FeeAmount: 0,
      StreamID: this.DTE_ClosureOfProgram.StreamID,
      CourseLevelID: this.DTE_ClosureOfProgram.CourseLevelID,
      StreamName: this.DTE_streamDataList.find((x: { StreamMasterID: number; }) => x.StreamMasterID == this.DTE_ClosureOfProgram.StreamID).StreamName,
      CourseLevelName: this.DTE_CourseLevelList.find((x: { ID: number; }) => x.ID == this.DTE_ClosureOfProgram.CourseLevelID).Name

    });

    this.DTE_ClosureOfProgram.StreamID = 0;
    this.DTE_ClosureOfProgram.CourseLevelID = 0;
  }

  async Add_DTE_ClosureOfCourses() {

    if (this.DTE_ClosureOfCourses.CourseID == 0) {

      this.toastr.error("Select Course.!");

      return;

    }

    if (this.DTE_ClosureOfCourses.CurrentIntake == 0) {

      this.toastr.error("Enter Current Intake.!");

      return;

    }

    if (this.DTE_ClosureOfCourses.ReducedIntake == 0) {

      this.toastr.error("Enter Reduced Intake.!");

      return;

    }

    var CourseExit = this.request.DTE_ClosureOfCoursesList.filter((x: { CourseID: number; }) => x.CourseID == this.DTE_ClosureOfCourses.CourseID);

    if (CourseExit.length > 0) {

      this.toastr.warning("Course Already Added.!");

      return;

    }

    this.request.DTE_ClosureOfCoursesList.push({

      DetailID: 0,
      ApplyNocID: 0,
      DepartmentID: 0,
      CollegeID: 0,
      FeeAmount: 0,
      CourseID: this.DTE_ClosureOfCourses.CourseID,
      CourseName: this.DTE_ClosureOfCoursesCourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.DTE_ClosureOfCourses.CourseID).CourseName,
      CurrentIntake: this.DTE_ClosureOfCourses.CurrentIntake,
      ReducedIntake: this.DTE_ClosureOfCourses.ReducedIntake,
      StreamID: this.DTE_ClosureOfCourses.StreamID,
      CourseLevelID: this.DTE_ClosureOfCourses.CourseLevelID,
      StreamName: this.DTE_streamDataList.find((x: { StreamMasterID: number; }) => x.StreamMasterID == this.DTE_ClosureOfCourses.StreamID).StreamName,
      CourseLevelName: this.DTE_CourseLevelList.find((x: { ID: number; }) => x.ID == this.DTE_ClosureOfCourses.CourseLevelID).Name

    });

    this.DTE_ClosureOfCourses.CourseID = 0;
    this.DTE_ClosureOfCourses.StreamID = 0;
    this.DTE_ClosureOfCourses.CourseLevelID = 0;
    this.DTE_ClosureOfCourses.CurrentIntake = 0;
    this.DTE_ClosureOfCourses.ReducedIntake = 0;
    this.DTE_ClosureOfCoursesCourseDataList = [];
  }

  async Add_DTE_MergerOfTheCourse() {

    //if (Number(this.DTE_MergerOfTheCourse.CourseID1) == Number(this.DTE_MergerOfTheCourse.CourseID2)) {      

    //    this.toastr.error('Please Select different course Name')

    //    return;      

    //}

    if (this.DTE_MergerOfTheCourse.CourseID1 == 0) {

      this.toastr.error("Select Course One.!");

      return;

    }

    if (this.DTE_MergerOfTheCourse.CourseID2 == 0) {

      this.toastr.error("Select Course Two.!");

      return;

    }

    if (this.DTE_MergerOfTheCourse.MergerCourseID == 0) {

      this.toastr.error("Select Merger Course.!");

      return;

    }


    if (this.request.DTE_MergerOfTheCourse_View == true) {

      if (this.DTE_MergerOfTheCourse.CourseID1 == this.DTE_MergerOfTheCourse.CourseID2) {

        this.toastr.warning('Select other Course 2');

        return;

      }

      if (this.DTE_MergerOfTheCourse.CourseID1 != this.DTE_MergerOfTheCourse.MergerCourseID) {

        if (this.DTE_MergerOfTheCourse.CourseID2 != this.DTE_MergerOfTheCourse.MergerCourseID) {

          this.toastr.warning('Invalid Merge to Course');

          return;

        }

      }

    }


    if (this.DTE_MergerOfTheCourse.MergerIntake == 0) {
      this.toastr.error("Enter Merger Intake.!");
      return;
    }

    if ((Number(this.DTE_MergerOfTheCourse.MergerIntake)) > ((Number(this.DTE_MergerOfTheCourse.CourseIntake1) + Number(this.DTE_MergerOfTheCourse.CourseIntake2)))) {
      this.toastr.error("Enter Merger Intake (should be less than or equal (intake 1 + intake 2).!");
      return;
    }


    //To start new Programme/ Level in the existing Institutions

    //if (this.request.DTE_MergerOfTheCourse_View == true) {

    //  

    //  if (this.request.DTE_MergerOfTheCourseList.length == 0) {

    //    this.toastr.warning('Add To start new Course');

    //    return;

    //  }

    //}


    var CourseExit = this.request.DTE_MergerOfTheCourseList.filter((x: { CourseID1: number; }) => x.CourseID1 == this.DTE_MergerOfTheCourse.CourseID1);

    if (CourseExit.length > 0) {

      this.toastr.warning("Course Already Added.!");

      return;

    }

    this.request.DTE_MergerOfTheCourseList.push({
      DetailID: 0,
      ApplyNocID: 0,
      DepartmentID: 0,
      CollegeID: 0,
      FeeAmount: 0,
      CourseID1: this.DTE_MergerOfTheCourse.CourseID1,
      CourseID2: this.DTE_MergerOfTheCourse.CourseID2,
      MergerCourseID: this.DTE_MergerOfTheCourse.MergerCourseID,
      CourseName: this.DTE_MergerOfTheCourseCourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.DTE_MergerOfTheCourse.CourseID1).CourseName,
      CourseName1: this.DTE_MergerOfTheCourseCourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.DTE_MergerOfTheCourse.CourseID2).CourseName,
      MergeCourseName: this.DTE_MergerOfTheCourseCourseDataList.find((x: { CourseID: number; }) => x.CourseID == this.DTE_MergerOfTheCourse.MergerCourseID).CourseName,
      StreamID: this.DTE_MergerOfTheCourse.StreamID,
      CourseLevelID: this.DTE_MergerOfTheCourse.CourseLevelID,
      StreamName: this.DTE_streamDataList.find((x: { StreamMasterID: number; }) => x.StreamMasterID == this.DTE_MergerOfTheCourse.StreamID).StreamName,
      CourseLevelName: this.DTE_CourseLevelList.find((x: { ID: number; }) => x.ID == this.DTE_MergerOfTheCourse.CourseLevelID).Name,
      CourseIntake1: this.DTE_MergerOfTheCourse.CourseIntake1,
      CourseIntake2: this.DTE_MergerOfTheCourse.CourseIntake2,
      MergerIntake: this.DTE_MergerOfTheCourse.MergerIntake
    });

    this.DTE_MergerOfTheCourse.CourseID1 = 0;
    this.DTE_MergerOfTheCourse.StreamID = 0;
    this.DTE_MergerOfTheCourse.CourseLevelID = 0;
    this.DTE_MergerOfTheCourse.CourseID2 = 0;
    this.DTE_MergerOfTheCourse.MergerCourseID = 0;
    this.DTE_MergerOfTheCourseCourseDataList = [];

    this.DTE_MergerOfTheCourse.CourseIntake1 = 0;
    this.DTE_MergerOfTheCourse.CourseIntake2 = 0;
    this.DTE_MergerOfTheCourse.MergerIntake = 0;
  }

  Delete_AdditionofIntegratedDualDegree(item: ApplyNocParameterMasterList_AdditionofIntegratedDualDegree) {

    try {

      this.loaderService.requestStarted();

      //debugger

      if (confirm("Are you sure you want to delete this ?")) {

        const index: number = this.request.DTE_AdditionofIntegratedDualDegreeList.indexOf(item);

        if (index != -1) {

          this.request.DTE_AdditionofIntegratedDualDegreeList.splice(index, 1)

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

  Delete_ChangeinNameofCourse(item: ApplyNocParameterMasterList_ChangeInNameOfCourse) {

    try {

      this.loaderService.requestStarted();

      //debugger

      if (confirm("Are you sure you want to delete this ?")) {

        const index: number = this.request.DTE_ChangeInNameOfCourseList.indexOf(item);

        if (index != -1) {

          this.request.DTE_ChangeInNameOfCourseList.splice(index, 1)

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

  Delete_IncreaseinIntake1(item: ApplyNocParameterMasterList_ReductionInIntake) {

    try {

      this.loaderService.requestStarted();

      //debugger

      if (confirm("Are you sure you want to delete this ?")) {

        const index: number = this.request.DTE_ReductionInIntakeList.indexOf(item);

        if (index != -1) {

          this.request.DTE_ReductionInIntakeList.splice(index, 1)

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

  Delete_ClosureofProgram(item: ApplyNocParameterMasterList_ClosureOfProgram) {

    try {

      this.loaderService.requestStarted();

      //debugger

      if (confirm("Are you sure you want to delete this ?")) {

        const index: number = this.request.DTE_ClosureOfProgramList.indexOf(item);

        if (index != -1) {

          this.request.DTE_ClosureOfProgramList.splice(index, 1)

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

  Delete_ClosureOfCoursesList(item: ApplyNocParameterMasterList_ClosureOfCourses) {

    try {

      this.loaderService.requestStarted();

      //debugger

      if (confirm("Are you sure you want to delete this ?")) {

        const index: number = this.request.DTE_ClosureOfCoursesList.indexOf(item);

        if (index != -1) {

          this.request.DTE_ClosureOfCoursesList.splice(index, 1)

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

  Delete_DTE_MergerOfTheCourse(item: ApplyNocParameterMasterList_MergerOfTheCourse) {

    try {

      this.loaderService.requestStarted();

      //debugger

      if (confirm("Are you sure you want to delete this ?")) {

        const index: number = this.request.DTE_MergerOfTheCourseList.indexOf(item);

        if (index != -1) {

          this.request.DTE_MergerOfTheCourseList.splice(index, 1)

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

  numberOnly(event: any): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }

  async GetIntakeValues(CourseID: number, Type: string) {
    this.DTE_ReductionInIntake.CurrentIntake = 0;
    this.DTE_ClosureOfCourses.CurrentIntake = 0;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetIntakeByCollegeCourse(this.request.CollegeID, CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (Type == 'ClosureIntake') {
            this.DTE_ClosureOfCourses.CurrentIntake = data['Data'][0]['data'][0]['Intake'];
          }
          else if (Type == 'DTE_MergerOfTheCourseCourseID1') {
            this.DTE_MergerOfTheCourse.CourseIntake1 = data['Data'][0]['data'][0]['Intake'];
          }
          else if (Type == 'DTE_MergerOfTheCourseCourseID2') {
            this.DTE_MergerOfTheCourse.CourseIntake2 = data['Data'][0]['data'][0]['Intake'];
          }
          else {
            this.DTE_ReductionInIntake.CurrentIntake = data['Data'][0]['data'][0]['Intake'];
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

  ///DTE
  public DTE_streamDataList: any = [];
  public DTE_CourseLevelList: any = [];
  async GetDTE_StreamDataList() {
    try {
      debugger
      this.loaderService.requestStarted();
      await this.commonMasterService.GetProgramMaster_CollegeIDWise(this.request.CollegeID, 'NM')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DTE_streamDataList = data['Data'][0]['data'];
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
  async GetDTE_CourseLevelList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCourseLevel_ProgramIDWise(this.request.CollegeID, 'NM')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DTE_CourseLevelList = data['Data'][0]['data'];
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
  public DTE_streamMasterDataList: any = [];
  public DTE_CourseLevelMasterList: any = [];
  public DTE_CourseLevelMasterList_PG: any = [];
  async GetDTE_StreamMasterDataList() {
    try {
      debugger
      this.loaderService.requestStarted();
      await this.commonMasterService.GetProgramMaster_CollegeIDWise(this.request.CollegeID, 'Master')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DTE_streamMasterDataList = data['Data'][0]['data'];
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
  async GetDTE_CourseLevelMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCourseLevel_ProgramIDWise(this.request.CollegeID, 'Master')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DTE_CourseLevelMasterList = data['Data'][0]['data'];
          this.DTE_CourseLevelMasterList_PG = this.DTE_CourseLevelMasterList.filter((x: { Name: string; }) => x.Name == 'PG');
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




  public DTE_AdditionofIntegratedDualDegreeCourseDataList: any = [];
  public DTE_CourseDataListIncreaseinIntake: any = [];
  public DTE_CourseDataListIncreaseInIntake_AdditionofCourse: any = [];
  public DTE_ChangeInNameOfCourseCourseDataList: any = [];
  public DTE_ReductionInIntakeCourseDataList: any = [];
  public DTE_ClosureOfCoursesCourseDataList: any = [];
  public DTE_MergerOfTheCourseCourseDataList: any = [];
  public DTE_IntroductionOffCampusCourseDataList: any = [];
  public DTE_CourseDataListCoursesforWorkingProfessionals: any = [];
  async GetCourse_CourseLevelIDWise(ProgrammeID: number, CourseLevelID: number, Type: string, GetType: string) {
    try {
      this.loaderService.requestStarted();
      await this.GetCourse_CourseLevelIDWise_Master(ProgrammeID, CourseLevelID, Type, 'Master');

      await this.commonMasterService.GetCourse_CourseLevelIDWise(this.request.CollegeID, ProgrammeID, CourseLevelID, GetType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (Type == 'AdditionofIntegratedDualDegree') {
            this.DTE_AdditionofIntegratedDualDegreeCourseDataList = data['Data'][0]['data'];
          }
          else if (Type == 'IncreaseinIntake') {
            this.DTE_CourseDataListIncreaseinIntake = data['Data'][0]['data'];
          }
          else if (Type == 'DTE_IncreaseInIntake_AdditionofCourse') {
            this.DTE_CourseDataListIncreaseInIntake_AdditionofCourse = data['Data'][0]['data'];
          }
          else if (Type == 'ChangeInNameOfCourse') {
            this.DTE_ChangeInNameOfCourseCourseDataList = data['Data'][0]['data'];
          }
          else if (Type == 'ReductionInIntake') {
            this.DTE_ReductionInIntakeCourseDataList = data['Data'][0]['data'];
          }
          else if (Type == 'ClosureOfCourses') {
            this.DTE_ClosureOfCoursesCourseDataList = data['Data'][0]['data'];
          }
          else if (Type == 'MergerOfTheCourse') {
            this.DTE_MergerOfTheCourseCourseDataList = data['Data'][0]['data'];
          }
          else if (Type == 'IntroductionOffCampus') {
            this.DTE_IntroductionOffCampusCourseDataList = data['Data'][0]['data'];
          }
          else if (Type == 'CoursesforWorkingProfessionals') {
            this.DTE_CourseDataListCoursesforWorkingProfessionals = data['Data'][0]['data'];
          }
          else {
            this.DTE_CourseDataList = data['Data'][0]['data'];
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


  public DTE_AdditionofIntegratedDualDegreeCourseDataList_Master: any = [];
  public DTE_CourseDataListIncreaseinIntake_Master: any = [];
  public DTE_CourseDataListIncreaseInIntake_AdditionofCourse_Master: any = [];
  public DTE_ChangeInNameOfCourseCourseDataList_Master: any = [];
  public DTE_ReductionInIntakeCourseDataList_Master: any = [];
  public DTE_ClosureOfCoursesCourseDataList_Master: any = [];
  public DTE_MergerOfTheCourseCourseDataList_Master: any = [];
  public DTE_IntroductionOffCampusCourseDataList_Master: any = [];
  public DTE_CourseDataList_Master: any = [];
  async GetCourse_CourseLevelIDWise_Master(ProgrammeID: number, CourseLevelID: number, Type: string, GetType: string) {
    try {
      this.loaderService.requestStarted();
      debugger;
      await this.commonMasterService.GetCourse_CourseLevelIDWise(this.request.CollegeID, ProgrammeID, CourseLevelID, GetType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (Type == 'AdditionofIntegratedDualDegree') {
            this.DTE_AdditionofIntegratedDualDegreeCourseDataList_Master = data['Data'][0]['data'];
          }
          else if (Type == 'IncreaseinIntake') {
            this.DTE_CourseDataListIncreaseinIntake_Master = data['Data'][0]['data'];
          }
          else if (Type == 'DTE_IncreaseInIntake_AdditionofCourse') {
            this.DTE_CourseDataListIncreaseInIntake_AdditionofCourse = data['Data'][0]['data'];
          }
          else if (Type == 'ChangeInNameOfCourse') {
            this.DTE_ChangeInNameOfCourseCourseDataList_Master = data['Data'][0]['data'];
          }
          else if (Type == 'ReductionInIntake') {
            this.DTE_ReductionInIntakeCourseDataList_Master = data['Data'][0]['data'];
          }
          else if (Type == 'ClosureOfCourses') {
            this.DTE_ClosureOfCoursesCourseDataList_Master = data['Data'][0]['data'];
          }
          else if (Type == 'MergerOfTheCourse') {
            this.DTE_MergerOfTheCourseCourseDataList_Master = data['Data'][0]['data'];
          }
          else if (Type == 'IntroductionOffCampus') {
            this.DTE_IntroductionOffCampusCourseDataList_Master = data['Data'][0]['data'];
          }
          else {
            this.DTE_CourseDataList_Master = data['Data'][0]['data'];
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




  async Add_IntroductionOffCampus() {

    if (this.request.DTE_IntroductionOffCampus.CourseID == 0) {
      this.toastr.error("Select Course.!");
      return;
    }
    if (this.request.DTE_IntroductionOffCampus.Intake == 0) {
      this.toastr.error("Enter intake greater than zero.!");
      return;
    }

    if (this.request.DTE_IntroductionOffCampus.DocumentName == '') {
      this.toastr.error("Please upload document.!");
      return;
    }

    var CourseExit = this.request.DTE_IntroductionOffCampus_List.filter((x: { CourseID: number; }) => x.CourseID == this.request.DTE_IntroductionOffCampus.CourseID);
    if (CourseExit.length > 0) {
      this.toastr.warning("Course Already Added.!");
      return;
    }

    this.request.DTE_IntroductionOffCampus_List.push({
      DetailID: 0,
      ApplyNocID: 0,
      DepartmentID: 0,
      CollegeID: 0,
      FeeAmount: 0,
      CourseID: this.request.DTE_IntroductionOffCampus.CourseID,
      CourseName: this.DTE_IntroductionOffCampusCourseDataList_Master.find((x: { CourseID: number; }) => x.CourseID == this.request.DTE_IntroductionOffCampus.CourseID).CourseName,
      Intake: this.request.DTE_IntroductionOffCampus.Intake,
      StreamID: this.request.DTE_IntroductionOffCampus.StreamID,
      CourseLevelID: this.request.DTE_IntroductionOffCampus.CourseLevelID,
      StreamName: this.DTE_streamMasterDataList.find((x: { StreamMasterID: number; }) => x.StreamMasterID == this.request.DTE_IntroductionOffCampus.StreamID).StreamName,
      CourseLevelName: this.DTE_CourseLevelMasterList.find((x: { ID: number; }) => x.ID == this.request.DTE_IntroductionOffCampus.CourseLevelID).Name,
      DocumentName: this.request.DTE_IntroductionOffCampus.DocumentName,
      DocumentPath: this.request.DTE_IntroductionOffCampus.DocumentPath,
      Dis_DocumentName: this.request.DTE_IntroductionOffCampus.Dis_DocumentName
    });
    this.request.DTE_IntroductionOffCampus.StreamID = 0;
    this.request.DTE_IntroductionOffCampus.CourseLevelID = 0;
    this.request.DTE_IntroductionOffCampus.CourseID = 0;
    this.request.DTE_IntroductionOffCampus.Intake = 0;
    this.request.DTE_IntroductionOffCampus.DocumentName = '';
    this.request.DTE_IntroductionOffCampus.Dis_DocumentName = '';
    this.request.DTE_IntroductionOffCampus.DocumentPath = '';
    this.DTE_IntroductionOffCampusCourseDataList_Master = [];
  }

  Delete_IntroductionOffCampus(item: ApplyNocParameterMasterList_IntroductionOffCampus) {
    try {
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to delete this ?")) {
        const index: number = this.request.DTE_IntroductionOffCampus_List.indexOf(item);
        if (index != -1) {
          this.request.DTE_IntroductionOffCampus_List.splice(index, 1)
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
  async Add_CoursesforWorkingProfessionals() {

    if (this.request.DTE_CoursesforWorkingProfessionals.CourseID == 0) {
      this.toastr.error("Select Course.!");
      return;
    }
    if (this.request.DTE_CoursesforWorkingProfessionals.Intake == 0) {
      this.toastr.error("Enter intake greater than zero.!");
      return;
    }

    var CourseExit = this.request.DTE_CoursesforWorkingProfessionals_List.filter((x: { CourseID: number; }) => x.CourseID == this.request.DTE_CoursesforWorkingProfessionals.CourseID);
    if (CourseExit.length > 0) {
      this.toastr.warning("Course Already Added.!");
      return;
    }

    this.request.DTE_CoursesforWorkingProfessionals_List.push({
      DetailID: 0,
      ApplyNocID: 0,
      DepartmentID: 0,
      CollegeID: 0,
      FeeAmount: 0,
      CourseID: this.request.DTE_CoursesforWorkingProfessionals.CourseID,
      CourseName: this.DTE_CourseDataListCoursesforWorkingProfessionals.find((x: { CourseID: number; }) => x.CourseID == this.request.DTE_CoursesforWorkingProfessionals.CourseID).CourseName,
      Intake: this.request.DTE_CoursesforWorkingProfessionals.Intake,
      StreamID: this.request.DTE_CoursesforWorkingProfessionals.StreamID,
      CourseLevelID: this.request.DTE_CoursesforWorkingProfessionals.CourseLevelID,
      StreamName: this.DTE_streamDataList.find((x: { StreamMasterID: number; }) => x.StreamMasterID == this.request.DTE_CoursesforWorkingProfessionals.StreamID).StreamName,
      CourseLevelName: this.DTE_CourseLevelList.find((x: { ID: number; }) => x.ID == this.request.DTE_CoursesforWorkingProfessionals.CourseLevelID).Name
    });
    this.request.DTE_CoursesforWorkingProfessionals.StreamID = 0;
    this.request.DTE_CoursesforWorkingProfessionals.CourseLevelID = 0;
    this.request.DTE_CoursesforWorkingProfessionals.CourseID = 0;
    this.request.DTE_CoursesforWorkingProfessionals.Intake = 0;
    this.DTE_CourseDataListCoursesforWorkingProfessionals = [];
  }

  Delete_CoursesforWorkingProfessionals(item: ApplyNocParameterMasterList_CoursesforWorkingProfessionals) {
    try {
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to delete this ?")) {
        const index: number = this.request.DTE_CoursesforWorkingProfessionals_List.indexOf(item);
        if (index != -1) {
          this.request.DTE_CoursesforWorkingProfessionals_List.splice(index, 1)
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

  public IsCollegeDeficiency: boolean = false;
  public CollegeDeficiencys: string = '';
  async GetCollegeDeficiency() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeDeficiency(this.request.CollegeID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'].length > 0) {
            if (data['Data'][0]['data'].length > 0) {
              if (data['Data'][0]['data'][0]['Deficiency'] != '') {
                this.IsCollegeDeficiency = true;
                this.CollegeDeficiencys = data['Data'][0]['data'][0]['Deficiency'];
              }
            }
          }
          console.log(data);
        }, (error: any) => console.error(error));
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
