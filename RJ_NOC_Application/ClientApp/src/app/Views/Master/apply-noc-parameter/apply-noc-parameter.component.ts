import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { ApplyNocParameterCourseDataModel, ApplyNocParameterDataModel, ApplyNocParameterMasterListDataModel, ApplyNocParameterMasterList_ChangeInCoedtoGirls, ApplyNocParameterMasterList_ChangeInCollegeManagement, ApplyNocParameterMasterList_ChangeInGirlstoCoed, ApplyNocParameterMasterList_ChangeInNameOfCollege, ApplyNocParameterMasterList_ChangeInPlaceOfCollege, ApplyNocParameterMasterList_MergerCollege, ApplyNocParameterMaster_AdditionOfNewSeats60DataModel, ApplyNocParameterMaster_TNOCExtensionDataModel } from '../../../Models/ApplyNocParameterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Console } from 'console';
import internal from 'stream';

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

  // model popup
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public ApplicationTypeList: any = [];
  public CollegeList_ddl: any = [];
  public ApplyNocParameterMasterList_ddl: any = [];
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

  public ApplyNocParameterMasterList_TNOCExtension: ApplyNocParameterMaster_TNOCExtensionDataModel = null;
  public ApplyNocParameterMasterList_AdditionOfNewSeats60: ApplyNocParameterMaster_AdditionOfNewSeats60DataModel = null;
  public ApplyNocParameterMasterList_ChangeInNameOfCollege: ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
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

  constructor(private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router,
    private applyNOCApplicationService: ApplyNOCApplicationService, private fileUploadService: FileUploadService, private modalService: NgbModal) {

  }

  async ngOnInit() {
    this.ApplyNocParameterForm = this.formBuilder.group({
      rbApplicationType: ['', Validators.required],
      ddlCollege: ['', [DropdownValidators]],
      cbNocFor: ['', Validators.required],
      cbCourse_TNOCExtension: [''],
      cbSubject_TNOCExtension: [''],
      cbCourse_AdditionOfNewSeats60: [''],
      ddlCourse: ['', 0]

    });

    // load
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetCollegeList();
    this.loaderService.requestEnded();

  }

  get form() {
    return this.ApplyNocParameterForm.controls;
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
      this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
      this.ApplyNocParameterMasterList_ChangeInGirlstoCoed = null;
      this.ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
      this.ApplyNocParameterMasterList_MergerCollege = null;
      this.ApplyNocParameterMasterList_NewCourse = null;

      this.ApplyNocParameterMasterList_TNOCExtOfSubject = null;
      this.ApplyNocParameterMasterList_PNOCOfSubject = null;

      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.CheckAppliedNOCCollegeWise(this.request.CollegeID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TotalAppliedNOC = data['Data'];
          if (this.TotalAppliedNOC > 0) {
            this.toastr.warning('You have already applied for NOC and NOC not issued yet');
            return;
          }
          else {

            await this.GetApplicationTypeList(this.request.CollegeID);

            await this.applyNocParameterService.GetApplyNocParameterMaster(this.request.CollegeID)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.SuccessMessage = data['SuccessMessage'];
                this.ErrorMessage = data['ErrorMessage'];
                //
                this.ApplyNocParameterMasterList_ddl = data['Data'];
                console.log(this.ApplyNocParameterMasterList_ddl);
              }, error => console.error(error));

            await this.commonMasterService.GetCollegeBasicDetails(this.request.CollegeID.toString())
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.CollegeDepartmentID = data['Data'][0]['data'][0]['DepartmentID'];
                this.request.DepartmentID = data['Data'][0]['data'][0]['DepartmentID'];

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

  async ApplyNocFor_cbChange(event: any, SelectedApplyNocForID: string, item: any) {
    try {
      //debugger
      this.loaderService.requestStarted();
      this.request.ApplyNocID = Number(SelectedApplyNocForID);
      this.request.ApplyNocFor = item.ApplyNocFor;
      this.request.ApplyNocCode = item.ApplyNocCode;

      console.log(item);
      // TNOC Extension
      if (this.request.ApplyNocCode == 'MG3_NewCourse') {
        this.ApplyNocParameterMasterList_TNOCExtension = null;
      }
      // Addition of New Seats(60)
      if (this.request.ApplyNocCode == 'MG3_ANewSeats') {
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
      }
      if (this.request.ApplyNocCode == 'DEC_PNOCSubject') {
        this.ApplyNocParameterMasterList_PNOCOfSubject = new ApplyNocParameterMaster_TNOCExtensionDataModel();
        this.ApplyNocParameterMasterList_PNOCOfSubject.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_PNOCOfSubject.FeeAmount = item.FeeAmount;
      }


      //unchecked
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
        }

        else if (this.request.ApplyNocCode == 'DEC_PNOCSubject') {
          this.ApplyNocParameterMasterList_PNOCOfSubject = null;
        }


        return;
      }
      // get
      await this.applyNocParameterService.GetApplyNocForByParameter(this.request.CollegeID, this.request.ApplyNocFor)
        .then((data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            // TNOC Extension
            if (this.request.ApplyNocFor == 'NOC For New Course') {

              this.ApplyNocParameterMasterList_TNOCExtension = data['Data'];
            }
            // Addition of New Seats(60)
            if (this.request.ApplyNocFor == 'Addition of New Seats(60)') {
              this.ApplyNocParameterMasterList_AdditionOfNewSeats60 = data['Data'];
            }
          }
        }, error => console.error(error));

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

  HasData(): boolean {
    let HasData = false;
    if (this.ApplyNocParameterMasterList_TNOCExtension != null || this.ApplyNocParameterMasterList_AdditionOfNewSeats60 != null || this.ApplyNocParameterMasterList_ChangeInNameOfCollege != null ||
      this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege != null || this.ApplyNocParameterMasterList_ChangeInGirlstoCoed != null || this.ApplyNocParameterMasterList_ChangeInCollegeManagement != null || this.ApplyNocParameterMasterList_MergerCollege != null || this.ApplyNocParameterMasterList_ChangeInCoedtoGirls != null || this.ApplyNocParameterMasterList_NewCourse != null
      || this.ApplyNocParameterMasterList_NewCourseSubject != null || this.ApplyNocParameterMasterList_TNOCExtOfSubject != null || this.ApplyNocParameterMasterList_PNOCOfSubject != null) {
      HasData = true;
    }
    return HasData;
  }
  public isSave: boolean = true;
  async SaveApplyNoc_click() {
    //this.isSave = false; 
    try {
      let isValid = true;
      if (this.ApplyNocParameterForm.invalid) {
        isValid = false;
      }

      // check all
      if (!isValid) {
        return;
      }
      debugger

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
        this.request.TotalFeeAmount += this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.map(t => t.CourseFeesAmount).reduce((acc, value) => acc + value, 0)
      }
      //for Dec New Subject
      if (this.ApplyNocParameterMasterList_NewCourseSubject?.ApplyNocParameterCourseList != null) {

        this.request.TotalFeeAmount += this.calcuateSumofNewSubject();
      }
      //DEC TNOC
      if (this.ApplyNocParameterMasterList_TNOCExtOfSubject?.ApplyNocParameterCourseList != null) {

        this.request.TotalFeeAmount += this.calcuateTNOCSubjectFees();
      }
      //DEC NOC
      if (this.ApplyNocParameterMasterList_PNOCOfSubject?.ApplyNocParameterCourseList != null) {

        this.request.TotalFeeAmount += this.calcuatePNOCSubjectFees();
      }





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
          this.toastr.error("Choose any subject from 'Addition of New Seats(60)'");
          return;
        }
      }

      else if (this.ApplyNocParameterMasterList_NewCourse?.ApplyNocParameterCourseList != null) {
        let SelectedCourselist = this.ApplyNocParameterMasterList_NewCourse?.ApplyNocParameterCourseList;
        if (SelectedCourselist.length == 0) {
          this.toastr.error("Choose any subject from 'NOC For New Course'");
          return;
        }
      }


      else if (this.ApplyNocParameterMasterList_NewCourseSubject?.ApplyNocParameterCourseList != null) {
        let SelectedCourselist = this.ApplyNocParameterMasterList_NewCourseSubject?.ApplyNocParameterCourseList;
        if (SelectedCourselist.length == 0) {
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
        if (SelectedCourselist.length == 0) {
          this.toastr.error("Choose any subject from 'PNOC For New Subject'");
          return;
        }
      }



      this.request.ApplyNocParameterMasterList_ChangeInNameOfCollege = this.ApplyNocParameterMasterList_ChangeInNameOfCollege;
      //Changes In College Place
      this.request.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege;

      debugger;
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




  }


  async ValidateDocument(event: any, Type: string, SubType: string) {
    debugger;
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
    else
    {
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
      var CollegeWiseCourseID = this.CourseDataListPNOC.find((x: { CourseID: number; }) => x.CourseID == SeletedCourseID).CollegeWiseCourseID;
      this.loaderService.requestStarted();
      const courseId = Number(SeletedCourseID);
      if (courseId <= 0) {
        return;
      }
      await this.commonMasterService.GetCollegeWiseCourseIDSubjectList(this.request.CollegeID, CollegeWiseCourseID, 'GetCollegeWiseNewSubjectNOCListPNOC')
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
    debugger;
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

    var data: ApplyNocParameterCourseDataModel = new ApplyNocParameterCourseDataModel();
    data.CourseID = this.ddlCourse;
    data.CourseName = CourseName;
    data.CollegeLevel = CollegeLevel;
    data.CourseFeesAmount = CourseFeesAmount;
    data.ApplyNocParameterSubjectList = this.SubjectDetails.filter(f => f.IsChecked == true);
    this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.push(data);

    this.ApplyNocParameterMasterList_NewCourse.FeeAmount = this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.map(t => t.CourseFeesAmount).reduce((acc, value) => acc + value, 0)





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

  btn_AddCourseSubject() {
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
    this.ApplyNocParameterMasterList_NewCourseSubject.FeeAmount = this.calcuateSumofNewSubject();

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
    this.ApplyNocParameterMasterList_PNOCOfSubject.FeeAmount = this.calcuatePNOCSubjectFees();

    this.modalService.dismissAll('After Success');
    this.isAddNOCCoursePNOC = false;
    this.ddlCoursePNOC = 0;
    this.PNOCSubjectDetails = [];
  }


  calcuateSumofNewSubject(): number {
    if (this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocParameterCourseList != null) {
      this.totalNewSubjectFees = 0;
      this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocParameterCourseList.forEach(element => {
        element.ApplyNocParameterSubjectList.forEach(e2 => {
          this.totalNewSubjectFees += Number(element.CourseFeesAmount);
        })
      });
    }
    return this.totalNewSubjectFees;
  }


  calcuateTNOCSubjectFees(): number {
    if (this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocParameterCourseList != null) {
      this.totalTNOCSubjectFees = 0;
      this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocParameterCourseList.forEach(element => {
        element.ApplyNocParameterSubjectList.forEach(e2 => {
          this.totalTNOCSubjectFees += Number(element.CourseFeesAmount);
        })
      });
    }
    return this.totalTNOCSubjectFees;
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
      //Remove Calculation
      this.ApplyNocParameterMasterList_NewCourse.FeeAmount = this.ApplyNocParameterMasterList_NewCourse.ApplyNocParameterCourseList.map(t => t.CourseFeesAmount).reduce((acc, value) => acc + value, 0)

    }
  }
  //delete items
  btn_DeleteCourseSubject(CourseID: number) {
    if (confirm("Are you sure you want to delete this ?")) {

      const indexToRemove = this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocParameterCourseList.findIndex((pl) => pl.CourseID === CourseID);
      this.ApplyNocParameterMasterList_NewCourseSubject.ApplyNocParameterCourseList.splice(indexToRemove, 1);
      this.ApplyNocParameterMasterList_NewCourseSubject.FeeAmount = this.calcuateSumofNewSubject();
    }
  }


  btn_DeleteTNOCCourseSubject(CourseID: number) {
    if (confirm("Are you sure you want to delete this ?")) {

      const indexToRemove = this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocParameterCourseList.findIndex((pl) => pl.CourseID === CourseID);
      this.ApplyNocParameterMasterList_TNOCExtOfSubject.ApplyNocParameterCourseList.splice(indexToRemove, 1);
      this.ApplyNocParameterMasterList_TNOCExtOfSubject.FeeAmount = this.calcuateTNOCSubjectFees();
    }
  }

  btn_DeletePNOCCourseSubject(CourseID: number) {
    if (confirm("Are you sure you want to delete this ?")) {
      const indexToRemove = this.ApplyNocParameterMasterList_PNOCOfSubject.ApplyNocParameterCourseList.findIndex((pl) => pl.CourseID === CourseID);
      this.ApplyNocParameterMasterList_PNOCOfSubject.ApplyNocParameterCourseList.splice(indexToRemove, 1);
      this.ApplyNocParameterMasterList_PNOCOfSubject.FeeAmount = this.calcuatePNOCSubjectFees();
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



}
