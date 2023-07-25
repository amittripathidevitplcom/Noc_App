import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { ApplyNocParameterDataModel, ApplyNocParameterMasterListDataModel, ApplyNocParameterMasterList_ChangeInCollegeManagement, ApplyNocParameterMasterList_ChangeInGirlstoCoed, ApplyNocParameterMasterList_ChangeInNameOfCollege, ApplyNocParameterMasterList_ChangeInPlaceOfCollege, ApplyNocParameterMaster_AdditionOfNewSeats60DataModel, ApplyNocParameterMaster_TNOCExtensionDataModel } from '../../../Models/ApplyNocParameterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';

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

  constructor(private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router,
    private applyNOCApplicationService: ApplyNOCApplicationService, private fileUploadService: FileUploadService) {

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
      this.ApplyNocParameterMasterList_ChangeInPlaceOfCollege != null || this.ApplyNocParameterMasterList_ChangeInGirlstoCoed != null || this.ApplyNocParameterMasterList_ChangeInCollegeManagement != null) {
      HasData = true;
    }
    return HasData;
  }
  public isSave: boolean = true;
  async SaveApplyNoc_click() {
    this.isSave = false;


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
      this.loaderService.requestStarted();
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
      //debugger
      console.log(this.request)
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
  }
}
