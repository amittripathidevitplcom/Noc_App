import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { ApplyNocParameterDataModel, ApplyNocParameterMasterListDataModel, ApplyNocParameterMasterList_ChangeInCollegeManagement, ApplyNocParameterMasterList_ChangeInGirlstoCoed, ApplyNocParameterMasterList_ChangeInNameOfCollege, ApplyNocParameterMasterList_ChangeInPlaceOfCollege, ApplyNocParameterMasterList_MergerCollege, ApplyNocParameterMaster_AdditionOfNewSeats60DataModel, ApplyNocParameterMaster_TNOCExtensionDataModel } from '../../../Models/ApplyNocParameterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

  // FormBuilder
  public ApplyNocParameterForm!: FormGroup;
  // login model
  sSOLoginDataModel = new SSOLoginDataModel();
  // model
  request = new ApplyNocParameterDataModel();

  public ApplyNocParameterMasterList_TNOCExtension: ApplyNocParameterMaster_TNOCExtensionDataModel = null;
  public ApplyNocParameterMasterList_AdditionOfNewSeats60: ApplyNocParameterMaster_AdditionOfNewSeats60DataModel = null;
  public ApplyNocParameterMasterList_ChangeInNameOfCollege: ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
  public ApplyNocParameterMasterList_ChangeInPlaceOfCollege: ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
  public ApplyNocParameterMasterList_ChangeInGirlstoCoed: ApplyNocParameterMasterList_ChangeInGirlstoCoed = null;
  public ApplyNocParameterMasterList_ChangeInCollegeManagement: ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
  public ApplyNocParameterMasterList_MergerCollege: ApplyNocParameterMasterList_MergerCollege = null;

  public ApplyNocParameterMasterList_NewCourse: ApplyNocParameterMaster_TNOCExtensionDataModel = null;


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
    });

    // load
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetCollegeList();
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
      //reset
      this.ApplyNocParameterMasterList_ddl = [];
      this.ApplyNocParameterMasterList_TNOCExtension = null;
      this.ApplyNocParameterMasterList_AdditionOfNewSeats60 = null;
      this.ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
      this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
      this.ApplyNocParameterMasterList_ChangeInGirlstoCoed = null;
      this.ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
      this.ApplyNocParameterMasterList_MergerCollege = null;

      // get
      await this.GetApplicationTypeList(this.request.CollegeID);
      this.loaderService.requestStarted();
      await this.applyNocParameterService.GetApplyNocParameterMaster(this.request.CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          this.ApplyNocParameterMasterList_ddl = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.GetCollegeBasicDetails(this.request.CollegeID.toString())
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeDepartmentID = data['Data'][0]['data'][0]['DepartmentID'];

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

  async ApplyNocFor_cbChange(event: any, SelectedApplyNocForID: string, item: any) {
    try {
      //debugger
      this.loaderService.requestStarted();
      this.request.ApplyNocID = Number(SelectedApplyNocForID);
      this.request.ApplyNocFor = item.ApplyNocFor;

      // TNOC Extension
      if (this.request.ApplyNocFor == 'NOC For New Course') {
        this.ApplyNocParameterMasterList_TNOCExtension = null;
      }
      // Addition of New Seats(60)
      if (this.request.ApplyNocFor == 'Addition of New Seats(60)') {
        this.ApplyNocParameterMasterList_AdditionOfNewSeats60 = null;
      }
      if (this.request.ApplicationTypeID <= 0) {
        this.toastr.error("Choose application type");
        event.target.checked = false;
        return;
      }
      // Change In Name Of College
      if (this.request.ApplyNocFor == 'Change in Name') {
        this.ApplyNocParameterMasterList_ChangeInNameOfCollege = new ApplyNocParameterMasterList_ChangeInNameOfCollege();
        this.ApplyNocParameterMasterList_ChangeInNameOfCollege.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_ChangeInNameOfCollege.FeeAmount = item.FeeAmount;
      }
      if (this.request.ApplyNocFor == 'Change in Place') {
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = new ApplyNocParameterMasterList_ChangeInPlaceOfCollege();
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege.FeeAmount = item.FeeAmount;
      }
      if (this.request.ApplyNocFor == 'Girls to Coed') {
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed = new ApplyNocParameterMasterList_ChangeInGirlstoCoed();
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_ChangeInGirlstoCoed.FeeAmount = item.FeeAmount;
      }
      if (this.request.ApplyNocFor == 'Change Management') {
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement = new ApplyNocParameterMasterList_ChangeInCollegeManagement();
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_ChangeInCollegeManagement.FeeAmount = item.FeeAmount;
      }
      if (this.request.ApplyNocFor == 'Merger')
      {
        this.ApplyNocParameterMasterList_MergerCollege = new ApplyNocParameterMasterList_MergerCollege();
        this.ApplyNocParameterMasterList_MergerCollege.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_MergerCollege.FeeAmount = item.FeeAmount;
      }

      if (this.request.ApplyNocFor == 'New Course')
      {

        this.ApplyNocParameterMasterList_NewCourse = new ApplyNocParameterMaster_TNOCExtensionDataModel();
        this.ApplyNocParameterMasterList_NewCourse.ApplyNocID = Number(SelectedApplyNocForID);
        this.ApplyNocParameterMasterList_NewCourse.FeeAmount = item.FeeAmount;
      }


      //unchecked
      if (!event.target.checked) {
        if (this.request.ApplyNocFor == 'Change in Name') {
          this.ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
        }
        else if (this.request.ApplyNocFor == 'Change in Place') {
          this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
        }
        else if (this.request.ApplyNocFor == 'Girls to Coed') {
          this.ApplyNocParameterMasterList_ChangeInGirlstoCoed = null;
        }
        else if (this.request.ApplyNocFor == 'Change Management') {
          this.ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
        }
        else if (this.request.ApplyNocFor == 'Merger') {
          this.ApplyNocParameterMasterList_MergerCollege = null;
        }
        return;
      }


      // get
      await this.applyNocParameterService.GetApplyNocForByParameter(this.request.CollegeID, this.request.ApplyNocFor)
        .then((data: any) => {
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
      this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege != null || this.ApplyNocParameterMasterList_ChangeInGirlstoCoed != null || this.ApplyNocParameterMasterList_ChangeInCollegeManagement != null || this.ApplyNocParameterMasterList_MergerCollege != null) {
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
      // debugger

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

      this.request.ApplyNocParameterMasterList_ChangeInNameOfCollege = this.ApplyNocParameterMasterList_ChangeInNameOfCollege;
      //Changes In College Place
      this.request.ApplyNocParameterMasterList_ChangeInPlaceOfCollege = this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege;
      //Changes In Girlsto Coed
      this.request.ApplyNocParameterMasterList_ChangeInGirlstoCoed = this.ApplyNocParameterMasterList_ChangeInGirlstoCoed;

      //Changes In Girlsto Coed
      this.request.ApplyNocParameterMasterList_MergerCollege = this.ApplyNocParameterMasterList_MergerCollege;

      //Changes In Girlsto Coed
      this.request.ApplyNocParameterMasterList_ChangeInCollegeManagement = this.ApplyNocParameterMasterList_ChangeInCollegeManagement;

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
      this.loaderService.requestEnded();
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



      //college management
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

    return this.isFormValid
  }


 
  async AddCourse_click(content: any) {
    try {
      this.loaderService.requestStarted();
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


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  ResetValidationVariable() {
    this.isFormValid = true;
    this.isValidCollegeNewName_Eng = false;
    this.isValidCollegeNewName_Hi = false;
    this.isChangeInNameOfCollege_Document = false;
    this.isChangeInPlaceNewName = false;
    this.isChangeInPlaceNameOfCollege_Document = false;
    this.isChangeInPlaceNameOfCollege_PlaceDocument = false;

    //Consern Mangement Document
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
}
