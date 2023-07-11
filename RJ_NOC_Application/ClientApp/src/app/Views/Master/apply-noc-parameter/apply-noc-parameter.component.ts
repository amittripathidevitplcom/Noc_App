import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { ApplyNocParameterDataModel, ApplyNocParameterMasterListDataModel, ApplyNocParameterMaster_AdditionOfNewSeats60DataModel, ApplyNocParameterMaster_TNOCExtensionDataModel } from '../../../Models/ApplyNocParameterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';

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

  // FormBuilder
  public ApplyNocParameterForm!: FormGroup;
  // login model
  sSOLoginDataModel = new SSOLoginDataModel();
  // model
  request = new ApplyNocParameterDataModel();

  public ApplyNocParameterMasterList_TNOCExtension: ApplyNocParameterMaster_TNOCExtensionDataModel = null;
  public ApplyNocParameterMasterList_AdditionOfNewSeats60: ApplyNocParameterMaster_AdditionOfNewSeats60DataModel = null;

  constructor(private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router) {

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
    await this.GetApplicationTypeList();
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

  async GetApplicationTypeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(0, "NOCApply")
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

  async College_ddlChange(event: any) {
    try {
      //reset
      this.ApplyNocParameterMasterList_ddl = [];
      this.ApplyNocParameterMasterList_TNOCExtension = null;
      this.ApplyNocParameterMasterList_AdditionOfNewSeats60 = null;
      // get
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
      if (this.request.ApplyNocFor == 'TNOC Extension') {
        this.ApplyNocParameterMasterList_TNOCExtension = null;
      }
      // Addition of New Seats(60)
      if (this.request.ApplyNocFor == 'Addition of New Seats(60)') {
        this.ApplyNocParameterMasterList_AdditionOfNewSeats60 = null;
      }
      //unchecked
      if (!event.target.checked) {
        return;
      }
      if (this.request.ApplicationTypeID <= 0) {
        this.toastr.error("Choose application type");
        event.target.checked = false;
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
          if (this.request.ApplyNocFor == 'TNOC Extension') {
            debugger;
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
    if (this.ApplyNocParameterMasterList_TNOCExtension != null || this.ApplyNocParameterMasterList_AdditionOfNewSeats60 != null) {
      HasData = true;
    }
    return HasData;
  }

  async SaveApplyNoc_click() {
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
          this.toastr.error("Choose any subject from 'TNOC Extension'");
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
            }, 2000);
          }
          else {
            this.toastr.error(this.ErrorMessage);
          }

        }, error => console.error(error));
    }
    catch (ex) {
      console.log(ex);
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

}
