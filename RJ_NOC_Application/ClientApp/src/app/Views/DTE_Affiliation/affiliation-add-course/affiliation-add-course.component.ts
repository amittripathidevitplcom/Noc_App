import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DTEAffiliationAddCourseDataModel, DTEAffiliationDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationAddCourse/DTEAffiliationAddCourseDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { EnumDepartment } from '../../../Common/enum-noc';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DTEAffiliationAddCourseService } from '../../../Services/DTEAffiliation/DTEAffiliationAddCourse/dte-affiliation-add-course.service';
@Component({
  selector: 'app-affiliation-add-course',
  templateUrl: './affiliation-add-course.component.html',
  styleUrls: ['./affiliation-add-course.component.css']
})

export class AffiliationAddCourseComponent {

  //Add FormBuilder
  DTEAffiliationAddCourseForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;

  public EditID: any;
  isEdit: boolean = false;
  public UserID: number = 0;
  searchText: string = '';
  public is_disableDepartment: boolean = false;
  request = new DTEAffiliationAddCourseDataModel();
  dTEAffiliationDataModel = new DTEAffiliationDataModel();
  public AffiliationCourseNameList: any = [];
  public shiftDataList: any = [];
  public AffilationCourseTypeList: any = [];
  public AffiliationBranchList: any = [];
  public DepartmentList: any = [];  
  public StartDateEndDateDepartmentwise: any = [];  
  sSOLoginDataModel = new SSOLoginDataModel();
  public IsOpen: boolean = false;
  public isFormValid: boolean = true;
  public StatusOfCollegeList: any = [];
  public FinancialYearList: any = [];
  public DTEAffiliationApplyList: any = [];
  public ShowAffilationType: boolean = false;
 // public ApplyAffiliation: string = '';
  //public ApplyAffiliationFY: number = 65;
 
  constructor(private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard, private dTEAffiliationAddCourseService: DTEAffiliationAddCourseService) {
  }
  async ngOnInit() {
    this.DTEAffiliationAddCourseForm = this.formBuilder.group(
      {       
        ddlAffiliationCourseTypeID: ['', [DropdownValidators]],       
        ddlCourseID: ['', [DropdownValidators]],       
        ddlAffiliationShiftID: ['', [DropdownValidators]],       
        ddlAffiliationBranchID: ['', [DropdownValidators]],       
        ddlCollegeStatusId: ['', [DropdownValidators]],       
        ddlYearofstartingID: ['', [DropdownValidators]],       
        txtCourseIntakeAsPerAICTELOA: ['', Validators.required],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.SSOID = this.sSOLoginDataModel.SSOID;
    const ddlDepartmentID = document.getElementById('ddlDepartmentID');
    if (ddlDepartmentID) ddlDepartmentID.focus();
    this.GetDepartmentList();
    this.GetStatusOfCollege();
    await this.FillShift();
    await this.GetAllFinancialYear();
  }
  get form() { return this.DTEAffiliationAddCourseForm.controls; }
  async GetStatusOfCollege() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "AffiliationCategory")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusOfCollegeList = data['Data'];
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
  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentList = data['Data'];
          for (let i = 0; i < data['Data'].length; i++) {
            if (data['Data'][i]['DepartmentID'] == 4) {
              this.request.DepartmentID = data['Data'][i]['DepartmentID'];
              this.is_disableDepartment = true;             
              this.GetAffilationCourseType(this.request.DepartmentID);
              this.GetAffiliationBranchList(this.request.DepartmentID);
              this.GetStartDateEndDateDepartmentwise(this.request.DepartmentID)
             // console.log(this.request.DepartmentID);
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
  async GetAffilationCourseType(DepartmentID: number) {
   //debugger;
    //console.log(DepartmentID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, "AffiliationCourseType")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AffilationCourseTypeList = data['Data'];          
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
  async GetAffiliationCourseNameList(AffiliationCourseTypeID:number) {
   // console.log(this.request.DepartmentID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCourseList_ByCourseLevelIDWise(AffiliationCourseTypeID,this.request.DepartmentID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AffiliationCourseNameList = data['Data'];
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
  async GetAffiliationBranchList(DepartmentID: number) {
   
    //console.log(DepartmentID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, "AffiliationBranchType")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AffiliationBranchList = data['Data'];
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
  async GetStartDateEndDateDepartmentwise(DepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStartDateEndDateDepartmentwise(DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StartDateEndDateDepartmentwise = data['Data'];
          this.request.FYID = data['Data'][0]['ApplicationSession'];  
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
  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  } 
  async SaveData() {    
    if (this.request.DepartmentID == 4) {
      this.isSubmitted = true;
     // console.log(this.DTEAffiliationAddCourseForm);
      if (this.DTEAffiliationAddCourseForm.invalid) {
        this.isFormValid = false;
        return
      }   
      const isConfirmed = confirm("Are you sure you want to submit the form?");
      if (!isConfirmed) {
        return; // Exit if user cancels
      }

      //Show Loading
      this.loaderService.requestStarted();
      this.isLoading = true;
      try {
        await this.dTEAffiliationAddCourseService.SaveData(this.request)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            console.log(this.State);
            if (!this.State) {
              this.toastr.success(this.SuccessMessage)
              this.ResetControl();
              this.isSubmitted = false;
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

  }
  async ResetControl() {    
    this.request.CourseIntakeAsPerAICTELOA = '';    
    this.request.AffiliationCourseTypeID = 0;    
    this.request.CourseID = 0;    
    this.request.AffiliationShiftID = 0;    
    this.request.AffiliationBranchID = 0;
    this.isSubmitted = false;
  }
  async FillShift() {
    try {
      this.loaderService.requestStarted();
      this.shiftDataList.push({
        "shiftName": "1st Shift",
        "shiftID": "1",
      });
      this.shiftDataList.push({
        "shiftName": "2nd Shift",
        "shiftID": "2",
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
  async  SelectionOnchange() {   
     var CollegeStatustype = this.StatusOfCollegeList.find((x: { ID: any; }) => x.ID == this.request.CollegeStatusId).Name;
     if (CollegeStatustype == 'New') {
       this.ShowAffilationType = false;
       this.isSubmitted = false;
     }
    if (CollegeStatustype == 'Existing'){
       this.dTEAffiliationDataModel.CollegeStatus =='Existing'
       this.ShowAffilationType = true;
       this.isSubmitted = false;
     }
  }
  async GetAllFinancialYear() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetAllFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.FinancialYearList = data['Data'];
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
}
