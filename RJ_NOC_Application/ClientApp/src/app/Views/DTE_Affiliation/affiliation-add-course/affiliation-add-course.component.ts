import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DTEAffiliationAddCourseDataModel,BTERAffiliationfeesdeposited } from '../../../Models/DTEAffiliation/DTEAffiliationAddCourse/DTEAffiliationAddCourseDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { EnumDepartment } from '../../../Common/enum-noc';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DTEAffiliationAddCourseService } from '../../../Services/DTEAffiliation/DTEAffiliationAddCourse/dte-affiliation-add-course.service';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
import { Console } from 'console';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
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
  public files: any = '';
  public file: any = '';
  public EditID: any;
  isEdit: boolean = false;
  public UserID: number = 0;
  searchText: string = '';
  public is_disableDepartment: boolean = false;
  request = new DTEAffiliationAddCourseDataModel();
  request1 = new BTERAffiliationfeesdeposited();  
  public AffiliationCourseNameList: any[] = [];
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
  public AllDTEAffiliationCourseList: any = [];
  public ShowAffilationType: boolean = false;
  // public ApplyAffiliation: string = '';
  //public ApplyAffiliationFY: number = 65;
  public AffiliationRegStatus: any = '';
  public AffiliationRegID: number = 0;
  public Name: string = '';
  public DTEARNID: number = 0;
  public ApplyAffiliation: string = '';
  public SearchRecordID: string = '';
  public SelectedDepartmentID: number = 0;
  public QueryStringCollageID: number = 0;
  public AffiliationfeesdepositedYearList: any = [];
  public financialYear: string = '';
  public SSOID: string = '';
  public LegalEntityManagementType: string = "";
  public AffiliationCollegeStatusId: number = 0;
  public CourseStatus: string = 'Running';
  public IsEdits: boolean = false;
  public BTERAffiliationFeeList: any = [];
  public Total: string = '0.00';
  public AffiliationTypeID: number = 0;
  public AffiliationTypeStatus: string = '';
  public MaxDate: Date = new Date;
  public branchname: string = '';
  constructor(private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard, private dTEAffiliationAddCourseService: DTEAffiliationAddCourseService, private legalEntityListService: LegalEntityService, private fileUploadService: FileUploadService, private collegeService: CollegeService) {
  }
  async ngOnInit() {
    debugger;
    //this.loaderService.requestStarted();
    this.DTEAffiliationAddCourseForm = this.formBuilder.group(
      {
        ddlAffiliationCourseTypeID: [''],
        ddlCourseTypeId: ['', [DropdownValidators]],
        txtCourseIntakeAsPerAICTELOA: [''],
        ddlCourseID: ['', [DropdownValidators]],
        ddlAffiliationShiftID: [''],
        ddlYearofstartingID: ['', [DropdownValidators]],
        ddlAffiliationBranchID: ['', [DropdownValidators]],  
        txtFirstYearRegularStudent: [''],
        txtFirstYearExStudent: [''],
        txtFirstYearTotal: [''],
        txtSecondYearRegularStudent: [''],
        txtSecondYearExStudent: [''],
        txtSecondYearTotal: [''],
        txtThirdYearRegularStudent: [''],
        txtThirdYearExStudent: [''],
        txtThirdYearTotal: [''],
        txtFinancialYearID: [''],
        txtFeesAmount: [''],
        ddlGovtNOCAvailableforclosure: [''],
        txtNocNumber: [''],
        ddlNOCClosingYearId: [''],
        NOCCUploadDocument: [''],
        txtNOCDate: [''],
      })
   
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString());
    this.AffiliationRegID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTEAffiliationID')?.toString());
    this.AffiliationRegStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());
    this.AffiliationCollegeStatusId = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeStatusId')?.toString());
    //console.log(this.sSOLoginDataModel);
    this.SSOID = this.sSOLoginDataModel.SSOID;
    this.financialYear = this.getFinancialYear(new Date());
    //console.log(this.SelectedDepartmentID);
    //console.log(this.AffiliationRegID);
    //console.log(this.AffiliationRegStatus);
    //console.log(this.AffiliationCollegeStatusId);
    this.request.DepartmentID = this.SelectedDepartmentID;
    this.request.BTERRegID = this.AffiliationRegID;   
    this.request.RegAffiliationStatusId = this.AffiliationCollegeStatusId;
    this.request.UserID = this.sSOLoginDataModel.UserID;    
    this.request.GovtNOCAvailableforclosure = 'NO' //Running by Default
   // this.CourseStatus='Running'
   // console.log(this.DTEAffiliationID);
    //console.log(this.AffiliationStatus);
    if (this.request.BTERRegID > 0) {
      await this.commonMasterService.CheckCollegestatusIDWise(this.request.BTERRegID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {
            await this.FilterAffiliationCourseStatusBter();
            // await this.FilterAffiliationCourseStatusBter();
          }
        }, error => console.error(error));
    }
    else {
      this.request.BTERRegID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString()));
    }
    this.request.BTERAffiliationfeesDetails = [];
    const ddlDepartmentID = document.getElementById('ddlDepartmentID');
    if (ddlDepartmentID) ddlDepartmentID.focus();
    try {
      await this.legalEntityListService.GetLegalEntityBySSOID(this.SSOID, 0)
        .then((data: any) => {         
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.LegalEntityManagementType = data['Data'][0]['data']['Table'][0]['ManagementType'];
          this.request.LegalEntityManagementType = data['Data'][0]['data']['Table'][0]['ManagementType'];        
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      this.routers.navigate(['/legalentity']);
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 0);
    }
    
    
    await this.GetStatusOfCollege();
    await this.GetAffilationCourseType();
    await this.GetAffiliationBranchList();
    await this.FillShift();
    await this.GetAllFinancialYear();
    await this.GetAllDTEAffiliationCourseList();
    await this.GetAllBTERAffiliationCourseFeeList();
    
  }
  get form() { return this.DTEAffiliationAddCourseForm.controls; }
  async FilterAffiliationCourseStatusBter() {
    debugger;
    try {
      await this.collegeService.FilterAffiliationCourseStatusBter(this.request.BTERRegID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AffiliationTypeID = data['Data'][0]['AffiliationTypeID'];
          this.AffiliationTypeStatus = data['Data'][0]['Name'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      this.routers.navigate(['/affiliationregistration']);
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 0);
    }
  }
  async GetStatusOfCollege() {    
    const departmentId = Number(this.SelectedDepartmentID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "AffiliationCourseStatus")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusOfCollegeList = data['Data'];
          if (this.AffiliationRegStatus == 'Existing' && this.AffiliationTypeStatus =='Renewal Of Affiliation') {
            const allowedActions = ['Running','Closed','New'];
            this.StatusOfCollegeList = this.StatusOfCollegeList.filter((x: any) =>
              x?.Name && allowedActions.includes(x.Name)
            );
          }
          if (this.AffiliationRegStatus == 'Existing' && (this.AffiliationTypeStatus == 'Affiliation Only For EX Students' || this.AffiliationTypeStatus == 'Affiliation Under Court Case')) {
            const allowedActions = ['Closed','New'];
            this.StatusOfCollegeList = this.StatusOfCollegeList.filter((x: any) =>
              x?.Name && allowedActions.includes(x.Name)
            );
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
  async GetAffilationCourseType() {
    //debugger;
    //console.log(DepartmentID);
    const departmentId = Number(this.SelectedDepartmentID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "AffiliationCourseType")
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
  async GetAffiliationCourseNameList(CourseTypeId: number) {
    debugger;
    // console.log(this.request.DepartmentID);
    const departmentId = Number(this.SelectedDepartmentID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCourseList_ByCourseLevelIDWise(CourseTypeId, departmentId,)
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
  async GetAffiliationBranchList() {   
    //console.log(DepartmentID);
    const departmentId = Number(this.SelectedDepartmentID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "AffiliationBranchType")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AffiliationBranchList = data['Data'];
          console.log(this.AffiliationRegStatus);
          console.log(this.LegalEntityManagementType);
          if (this.AffiliationRegStatus == 'Existing' && this.LegalEntityManagementType =='Private') {
            this.AffiliationBranchList = this.AffiliationBranchList.filter((element: any) => {
              return element.Name == "SFS";
            });
            this.request.BterBranchTypeId = this.AffiliationBranchList[0].ID;
          }
          if (this.AffiliationRegStatus == 'New' && this.LegalEntityManagementType == 'Private') {
            this.AffiliationBranchList = this.AffiliationBranchList.filter((element: any) => {
              return element.Name == "SFS";
            });
            this.request.BterBranchTypeId = this.AffiliationBranchList[0].ID;
          }
          //if (this.AffiliationRegStatus == 'New' && this.LegalEntityManagementType == 'Government') {
          //  const allowedActions = ['SFS', 'GAS'];
          //  this.AffiliationBranchList = this.AffiliationBranchList.filter((x: { ActionName: string }) =>
          //    allowedActions.includes(x.ActionName)
          //  );

          //}
          //if (this.AffiliationRegStatus == 'Existing' && this.LegalEntityManagementType == 'Government') {
          //  const allowedActions = ['SFS', 'GAS'];
          //  this.AffiliationBranchList = this.AffiliationBranchList.filter((x: { ActionName: string }) =>
          //    allowedActions.includes(x.ActionName)
          //  );
          //}
          if (this.AffiliationRegStatus === 'New' && this.LegalEntityManagementType === 'Government') {
            const allowedActions = ['SFS', 'GAS'];
            this.AffiliationBranchList = this.AffiliationBranchList.filter((x: any) =>
              x?.Name && allowedActions.includes(x.Name)
            );
          }

          if (this.AffiliationRegStatus === 'Existing' && this.LegalEntityManagementType === 'Government') {
            const allowedActions = ['SFS', 'GAS'];
            this.AffiliationBranchList = this.AffiliationBranchList.filter((x: any) =>
              x?.Name && allowedActions.includes(x.Name)
            );
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
  async GetStartDateEndDateDepartmentwise() {
    const departmentId = Number(this.SelectedDepartmentID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStartDateEndDateDepartmentwise(departmentId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StartDateEndDateDepartmentwise = data['Data'];
         // this.request.FYID = data['Data'][0]['ApplicationSession'];
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
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  async SaveData() {
    debugger;
    if (this.SelectedDepartmentID == 12) {
      this.isSubmitted = true;
      
      if (this.AffiliationRegStatus == 'New') {
        this.DTEAffiliationAddCourseForm.get('ddlYearofstartingID')?.clearValidators();
        this.DTEAffiliationAddCourseForm.get('ddlYearofstartingID')?.updateValueAndValidity();
        this.DTEAffiliationAddCourseForm.get('ddlCollegeStatusId')?.clearValidators();
        this.DTEAffiliationAddCourseForm.get('ddlCollegeStatusId')?.updateValueAndValidity();
        this.DTEAffiliationAddCourseForm.get('ddlAffiliationShiftID')?.setValidators([DropdownValidators]);
        this.DTEAffiliationAddCourseForm.get('ddlAffiliationShiftID')?.updateValueAndValidity();
        
        if (this.request.CourseIntakeAsPerAICTELOA == '') {
          this.DTEAffiliationAddCourseForm.get('txtCourseIntakeAsPerAICTELOA')?.setValidators([Validators.required]);
          this.DTEAffiliationAddCourseForm.get('txtCourseIntakeAsPerAICTELOA')?.updateValueAndValidity();
        }
      } else {

      }
      if (this.AffiliationRegStatus == 'Existing') {
       // alert(this.CourseStatus);
        console.log(this.CourseStatus);
        console.log(this.request.Yearofstarting);
        if (this.CourseStatus == 'New' || this.CourseStatus == 'Running') {
          this.DTEAffiliationAddCourseForm.get('ddlAffiliationCourseTypeID')?.setValidators([DropdownValidators]);
          this.DTEAffiliationAddCourseForm.get('ddlAffiliationCourseTypeID')?.updateValueAndValidity();
          this.DTEAffiliationAddCourseForm.get('txtCourseIntakeAsPerAICTELOA')?.setValidators([Validators.required]);
          this.DTEAffiliationAddCourseForm.get('txtCourseIntakeAsPerAICTELOA')?.updateValueAndValidity();
          this.DTEAffiliationAddCourseForm.get('ddlAffiliationShiftID')?.setValidators([DropdownValidators]);
          this.DTEAffiliationAddCourseForm.get('ddlAffiliationShiftID')?.updateValueAndValidity();
          if (this.CourseStatus == 'Running') {
            this.DTEAffiliationAddCourseForm.get('txtFirstYearRegularStudent')?.setValidators([Validators.required]);
            this.DTEAffiliationAddCourseForm.get('txtFirstYearRegularStudent')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('txtFirstYearExStudent')?.setValidators([Validators.required]);
            this.DTEAffiliationAddCourseForm.get('txtFirstYearExStudent')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('txtSecondYearRegularStudent')?.setValidators([Validators.required]);
            this.DTEAffiliationAddCourseForm.get('txtSecondYearRegularStudent')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('txtSecondYearExStudent')?.setValidators([Validators.required]);
            this.DTEAffiliationAddCourseForm.get('txtSecondYearExStudent')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('txtThirdYearRegularStudent')?.setValidators([Validators.required]);
            this.DTEAffiliationAddCourseForm.get('txtThirdYearRegularStudent')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('txtThirdYearExStudent')?.setValidators([Validators.required]);
            this.DTEAffiliationAddCourseForm.get('txtThirdYearExStudent')?.updateValueAndValidity();
          }
          
        }
        else if (this.CourseStatus == 'Closed') {
          this.DTEAffiliationAddCourseForm.get('ddlAffiliationCourseTypeID')?.setValidators([DropdownValidators]);
          this.DTEAffiliationAddCourseForm.get('ddlAffiliationCourseTypeID')?.updateValueAndValidity();
          this.DTEAffiliationAddCourseForm.get('txtFirstYearRegularStudent')?.setValidators([Validators.required]);
          this.DTEAffiliationAddCourseForm.get('txtFirstYearRegularStudent')?.updateValueAndValidity();
          this.DTEAffiliationAddCourseForm.get('txtFirstYearExStudent')?.setValidators([Validators.required]);
          this.DTEAffiliationAddCourseForm.get('txtFirstYearExStudent')?.updateValueAndValidity();
          this.DTEAffiliationAddCourseForm.get('txtSecondYearRegularStudent')?.setValidators([Validators.required]);
          this.DTEAffiliationAddCourseForm.get('txtSecondYearRegularStudent')?.updateValueAndValidity();
          this.DTEAffiliationAddCourseForm.get('txtSecondYearExStudent')?.setValidators([Validators.required]);
          this.DTEAffiliationAddCourseForm.get('txtSecondYearExStudent')?.updateValueAndValidity();
          this.DTEAffiliationAddCourseForm.get('txtThirdYearRegularStudent')?.setValidators([Validators.required]);
          this.DTEAffiliationAddCourseForm.get('txtThirdYearRegularStudent')?.updateValueAndValidity();
          this.DTEAffiliationAddCourseForm.get('txtThirdYearExStudent')?.setValidators([Validators.required]);
          this.DTEAffiliationAddCourseForm.get('txtThirdYearExStudent')?.updateValueAndValidity();
          if (this.request.GovtNOCAvailableforclosure == 'Yes')
          {
            this.DTEAffiliationAddCourseForm.get('txtNocNumber')?.setValidators([Validators.required]);
            this.DTEAffiliationAddCourseForm.get('txtNocNumber')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('txtNOCDate')?.setValidators([Validators.required]);
            this.DTEAffiliationAddCourseForm.get('txtNOCDate')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('ddlNOCClosingYearId')?.setValidators([DropdownValidators]);
            this.DTEAffiliationAddCourseForm.get('ddlNOCClosingYearId')?.updateValueAndValidity();
            if (this.request.NOCCUploadDocument=='') {
              this.DTEAffiliationAddCourseForm.get('NOCCUploadDocument')?.setValidators([Validators.required]);
              this.DTEAffiliationAddCourseForm.get('NOCCUploadDocument')?.updateValueAndValidity();
            }
          }
           else
          {
            this.DTEAffiliationAddCourseForm.get('ddlGovtNOCAvailableforclosure')?.clearValidators();
            this.DTEAffiliationAddCourseForm.get('ddlGovtNOCAvailableforclosure')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('txtNocNumber')?.clearValidators();
            this.DTEAffiliationAddCourseForm.get('txtNocNumber')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('txtNOCDate')?.clearValidators();
            this.DTEAffiliationAddCourseForm.get('txtCourseIntakeAsPerAICTELOA')?.clearValidators();
            this.DTEAffiliationAddCourseForm.get('txtCourseIntakeAsPerAICTELOA')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('txtNOCDate')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('ddlNOCClosingYearId')?.clearValidators();
            this.DTEAffiliationAddCourseForm.get('ddlNOCClosingYearId')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('NOCCUploadDocument')?.clearValidators();            
            this.DTEAffiliationAddCourseForm.get('NOCCUploadDocument')?.updateValueAndValidity();
            this.DTEAffiliationAddCourseForm.get('ddlAffiliationShiftID')?.clearValidators();
            this.DTEAffiliationAddCourseForm.get('ddlAffiliationShiftID')?.updateValueAndValidity();
          } 
          
        }
      }      
      if (this.AffiliationRegStatus == 'Existing' && this.SelectedYear != this.currentFinancial && this.CourseStatus != 'New') {       
        if (!this.DTEAffiliationAddCourseForm.invalid) {
          
          if (this.branchname?.trim().toUpperCase() === 'SFS') {
            let count = 0;

            if (!this.request.BTERAffiliationfeesDetails || this.request.BTERAffiliationfeesDetails.length === 0) {
              this.toastr.error("Please add Affiliation fees deposited Details");
              this.isFormValid = false;
              return;
            }

            for (let i = 0; i < this.request.BTERAffiliationfeesDetails.length; i++) {
              let Amount = this.request.BTERAffiliationfeesDetails[i].FeesAmount;

              if (Amount == 0 || Amount == null || Amount == undefined) {
                this.toastr.error('Enter Fees Amount Greater then Zero.!');
                count = 1;
              }
            }

            if (count > 0) {
              return;
            }
          }
          else if (this.branchname?.trim().toUpperCase() === 'GAS') {
            let count = 0;
            for (let i = 0; i < this.request.BTERAffiliationfeesDetails.length; i++) {
              let Amount = this.request.BTERAffiliationfeesDetails[i].FeesAmount;

              if (Amount != 0 || Amount == null || Amount == undefined) {
                this.toastr.error('Entry fee amount at least zero.!');
                count = 1;
              }
            }

            if (count > 0) {
              return;
            }
          }
        }
      }
      if (this.LegalEntityManagementType === 'Government' && this.AffiliationRegStatus == 'Existing' && this.SelectedYear != this.currentFinancial && this.CourseStatus != 'New') {        
        if (this.branchname?.trim().toUpperCase() === 'SFS') {
          if (
            (this.request.FirstYearRegularStudent ?? 0) > 0 &&
            (this.request.FirstYearExStudent ?? 0) > 0 &&
            (this.request.SecondYearRegularStudent ?? 0) > 0 &&
            (this.request.SecondYearExStudent ?? 0) > 0 &&
            (this.request.ThirdYearRegularStudent ?? 0) > 0 &&
            (this.request.ThirdYearExStudent ?? 0) > 0
          ) {
            console.log("All values are greater than zero.");
          } else {
            this.toastr.error("Statistics of students values must be greater than zero.");
            this.isFormValid = false;
            return;
          }
        }
        // If branchname is 'GAS', skip validation
        else if (this.branchname?.trim().toUpperCase() === 'GAS') {
          console.log("Validation skipped for GAS.");
        }
        // If branchname is neither 'SFS' nor 'GAS', you can add custom handling
        else {
          console.log("No validation required for other branch types.");
        }

      }
      //console.log(this.DTEAffiliationAddCourseForm);
      if (this.DTEAffiliationAddCourseForm.invalid) {
       console.log(this.DTEAffiliationAddCourseForm);
        this.isFormValid = false;
        return
      }
      //request.BTERAffiliationfeesDetails

      const isConfirmed = confirm("Are you sure you want to submit the form?");
      if (!isConfirmed) {
        return; // Exit if user cancels
      }
      console.log(this.request);
      //Show Loading
      this.loaderService.requestStarted();
      this.isLoading = true;
      try {
        await this.dTEAffiliationAddCourseService.SaveData(this.request)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            //console.log(this.State);
            if (!this.State) {
              this.toastr.success(this.SuccessMessage)

              this.ResetControl();
              this.GetAllDTEAffiliationCourseList();             
              this.request.BTERAffiliationfeesDetails = [];
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
  async ResetControl1() {
    //this.request.BTERCourseID = 0;
    //this.request.CourseStatusId = 0;
    //this.request.CourseTypeId = 0;
    //this.request.CourseId = 0;
    //this.request.CourseIntakeAsPerAICTELOA = '';
    //this.request.ShiftID = 0;
    //this.request.Yearofstarting = '';
    //this.request.BterBranchTypeId = 0;
    this.FinancialYearList = [];
  }
  async ResetControl() {

    this.request.BTERCourseID = 0;
    this.request.CourseStatusId = 0;
    this.request.CourseTypeId = 0;
    this.request.CourseId = 0;
    this.request.CourseIntakeAsPerAICTELOA = '';
    this.request.CourseName = '';
    this.request.ShiftID = 0;
    this.request.Yearofstarting = '';
    this.request.BterBranchTypeId = 0;
    this.request.FirstYearRegularStudent = 0;
    this.request.FirstYearExStudent = 0;
    this.request.FirstYearTotal = 0;
    this.request.SecondYearRegularStudent = 0;
    this.request.SecondYearExStudent = 0;
    this.request.SecondYearTotal = 0;
    this.request.ThirdYearRegularStudent = 0;
    this.request.ThirdYearExStudent = 0;
    this.request.ThirdYearTotal = 0;
    this.request.GovtNOCAvailableforclosure = 'NO';
    this.request.NOCNumber = '';
    this.request.NOCDate = '';
    this.request.NOCClosingYearId = 0;
    this.request.NOCCUploadDocument = '';
    this.request.BTERAffiliationfeesDetails = [];
    this.IsEdits = false;
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('btnReset')
    if (btnReset) btnReset.innerHTML = "Reset";

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
  async SelectionOnchange(CourseStatusId: number) {
   
    var CourseStatustype = this.StatusOfCollegeList.find((x: { ID: any }) => x.ID == CourseStatusId)?.Name;
    console.log(CourseStatustype);

    if (CourseStatustype === 'New') {
      this.CourseStatus = 'New';
      this.request.Yearofstarting = '66';
      const currentYear = new Date().getFullYear();  // e.g., 2025
      const currentFinancialYear = `${currentYear}-${currentYear + 1}`; // "2025-2026"     

      this.FinancialYearList = this.FinancialYearList.filter(
        (year: any) => year.FinancialYearName === currentFinancialYear
      );
    }
    else if (CourseStatustype === 'Running') {
      this.CourseStatus = 'Running';
      this.request.BTERAffiliationfeesDetails = [];
      await this.GetAllFinancialYear();
    }
    else if (CourseStatustype === 'Closed') {
      this.CourseStatus = 'Closed';
      this.request.GovtNOCAvailableforclosure = 'Yes'
      this.request.BTERAffiliationfeesDetails = [];
      await this.GetAllFinancialYear();
      console.log(this.CourseStatus);
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

  async GetAllDTEAffiliationCourseList() {
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationAddCourseService.GetAllDTEAffiliationCourseList(this.request.BTERRegID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AllDTEAffiliationCourseList = data['Data'];
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
  async Edit_OnClick(BTERCourseID: number) {
    debugger;
    this.isSubmitted = false;
    this.ResetControl1();
    
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationAddCourseService.GetByID(BTERCourseID, this.sSOLoginDataModel.SSOID, this.UserID)
        .then(async (data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.isDisabledGrid = true;          
          this.request.BTERCourseID = data['Data'][0]['data']['Table'][0]["BTERCourseID"];
          this.request.CourseStatusId = data['Data'][0]['data']['Table'][0]["CourseStatusId"];         
          this.CourseStatus = data['Data'][0]['data']['Table'][0]["AffiliationCourseStatus"];
          this.request.GovtNOCAvailableforclosure = data['Data'][0]['data']['Table'][0]["GovtNOCAvailableforclosure"];
          this.request.CourseTypeId =  data['Data'][0]['data']['Table'][0]["CourseTypeId"];
          this.request.CourseIntakeAsPerAICTELOA =  data['Data'][0]['data']['Table'][0]["CourseIntakeAsPerAICTELOA"];
         
          this.request.CourseId = data['Data'][0]['data']['Table'][0]["CourseID"];
          this.request.CourseName = data['Data'][0]['data']['Table'][0]["CourseName"];
          await this.GetAffiliationCourseNameList(this.request.CourseTypeId)
          this.AffiliationCourseNameList = this.AffiliationCourseNameList.filter(item => item.CourseID == this.request.CourseId);
          //this.AffiliationCourseNameList = this.AffiliationCourseNameList.filter(item:any => item.CourseID == CourseLevelID);
          //this.request.CourseId = this.AffiliationCourseNameList.find((x: { CourseID: any }) => x.CourseID == this.request.CourseId)?.CourseID;         
          this.request.ShiftID =  data['Data'][0]['data']['Table'][0]["ShiftID"];
          this.request.Yearofstarting = data['Data'][0]['data']['Table'][0]["Yearofstarting"];
          this.IsEdits = true;
          this.AffiliationRegStatus = data['Data'][0]['data']['Table'][0]["AffiliationCategory"]; 
          this.request.BterBranchTypeId = data['Data'][0]['data']['Table'][0]["BterBranchTypeId"];
          var BranchName = data['Data'][0]['data']['Table'][0]["AffiliationBranchName"];
          if (BranchName != 'GAS') {
            this.branchname = 'SFS'
          }
          else {
            this.branchname = 'GAS'
          }
          this.request.FirstYearRegularStudent =  data['Data'][0]['data']['Table'][0]["FirstYearRegularStudent"];
          this.request.FirstYearExStudent =  data['Data'][0]['data']['Table'][0]["FirstYearExStudent"];
          this.request.FirstYearTotal =  data['Data'][0]['data']['Table'][0]["FirstYearTotal"];
          this.request.SecondYearRegularStudent =  data['Data'][0]['data']['Table'][0]["SecondYearRegularStudent"];
          this.request.SecondYearExStudent =  data['Data'][0]['data']['Table'][0]["SecondYearExStudent"];
          this.request.SecondYearTotal =  data['Data'][0]['data']['Table'][0]["SecondYearTotal"];
          this.request.ThirdYearRegularStudent =  data['Data'][0]['data']['Table'][0]["ThirdYearRegularStudent"];
          this.request.ThirdYearExStudent =  data['Data'][0]['data']['Table'][0]["ThirdYearExStudent"];
          this.request.ThirdYearTotal = data['Data'][0]['data']['Table'][0]["ThirdYearTotal"];          
          this.request.NOCNumber = data['Data'][0]['data']['Table'][0]["NOCNumber"];          
          this.request.NOCDate = data['Data'][0]['data']['Table'][0]["NOCDate"];          
          this.request.NOCClosingYearId = data['Data'][0]['data']['Table'][0]["NOCClosingYearId"];          
          this.request.NOCCUploadDocument = data['Data'][0]['data']['Table'][0]["NOCCUploadDocument"];          
          this.request.NOCCUploadDocumentPath = data['Data'][0]['data']['Table'][0]["NOCCUploadDocumentPath"];          
          this.request.NOCCUploadDocument_Dis_FileName = data['Data'][0]['data']['Table'][0]["NOCCUploadDocument_Dis_FileName"];          
          this.request.FinancialYearName = data['Data'][0]['data']['Table'][0]["FinancialYearName"];          
          console.log(this.FinancialYearList);
          await this.GetAllFinancialYear();
          var SelectedYearStatus = this.FinancialYearList.find((x: { FinancialYearID: any; }) => x.FinancialYearID == this.request.Yearofstarting).FinancialYearName;
          const currentYear = new Date().getFullYear();  // e.g., 2025
          const currentFinancialYear = `${currentYear}-${currentYear + 1}`; // "2025-2026"    
          this.SelectedYear = SelectedYearStatus;
          this.currentFinancial = currentFinancialYear;
          for (var i = 0; i < data['Data'][0]['data']['Table1'].length; i++) {
            this.request.BTERAffiliationfeesDetails.push(data['Data'][0]['data']['Table1'][i]);
          }
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async Delete_OnClick(AffiliationCourseID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.dTEAffiliationAddCourseService.DeleteData(AffiliationCourseID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllDTEAffiliationCourseList();
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  public SelectedYear: string = '';
  public currentFinancial: string = '';

  async GetYearList(YearofstartingID: string) {
    //alert(YearofstartingID);
    debugger;
    //console.log(this.FinancialYearList);
    var SelectedYearStatus = this.FinancialYearList.find((x: { FinancialYearID: any; }) => x.FinancialYearID == YearofstartingID).FinancialYearName;
    const currentYear = new Date().getFullYear();  // e.g., 2025
    const currentFinancialYear = `${currentYear}-${currentYear + 1}`; // "2025-2026"    
    this.SelectedYear = SelectedYearStatus;
    this.currentFinancial = currentFinancialYear;    
    if (currentFinancialYear != SelectedYearStatus) {
      try {
        this.loaderService.requestStarted();
        await this.dTEAffiliationAddCourseService.generateYears(YearofstartingID)
          .then((data: any) => {           
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.request.BTERAffiliationfeesDetails = data['Data'];
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
    } else {
      
      const currentYear = new Date().getFullYear();  // e.g., 2025
      const currentFinancialYear = `${currentYear}-${currentYear + 1}`; // "2025-2026"
      //this.FinancialYearList = this.FinancialYearList.filter(
      //  (year: any) => year.FinancialYearName === currentFinancialYear
      //);
      this.request.BTERAffiliationfeesDetails = [];
    }
    
  }
  getFinancialYear(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based in JavaScript

    let startYear: number, endYear: number;

    if (month >= 4) {
      startYear = year;
      endYear = year + 1;
    } else {
      startYear = year - 1;
      endYear = year;
    }

    return `${startYear}-${endYear.toString().slice(-2)}`; // Format as "2024-25"
  }
  calculateTotal(Action: string) {
    if (Action == 'First') {
      this.request.FirstYearTotal =
        (this.request.FirstYearRegularStudent ? +this.request.FirstYearRegularStudent : 0) +
        (this.request.FirstYearExStudent ? +this.request.FirstYearExStudent : 0);
    }
    if (Action == 'Second') {
      this.request.SecondYearTotal =
        (this.request.SecondYearRegularStudent ? +this.request.SecondYearRegularStudent : 0) +
        (this.request.SecondYearExStudent ? +this.request.SecondYearExStudent : 0);
    }
    if (Action == 'Third') {
      this.request.ThirdYearTotal =
        (this.request.ThirdYearRegularStudent ? +this.request.ThirdYearRegularStudent : 0) +
        (this.request.ThirdYearExStudent ? +this.request.ThirdYearExStudent : 0);
    }

  }

  async ValidateDocumentNOCApproval(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (Type == 'NOCCUploadDocument') {
          console.log(this.file.type);
          if (this.file.type === 'application/pdf' || this.file.type === 'image/png' || this.file.type === 'image/jpeg' || this.file.type === 'image/jpg') {
            //size validation
            if (this.file.size > 1048576) {
              this.ResetFileAndValidation(Type, 'Select less then 1MB or equal File', '', '', '', false);
              this.toastr.error('Select Max 1MB File')
              return
            }
            if (this.file.size < 100000) {
              this.ResetFileAndValidation(Type, 'Select more then 100kb File', '', '', '', false);
              this.toastr.error('Select more then 100kb File')
              return
            }
          }
          else {
            this.toastr.warning('Select Only application/pdf/image');
            // type validation
            this.ResetFileAndValidation(Type, 'Select Only PDF/image', '', '', '', false);
            return
          }
        }
        else {// type validation
          this.ResetFileAndValidation(Type, 'Select Only pdf image file', '', '', '', false);
          return
        }
        // upload to server folder
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, '', data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"], true);
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
        this.ResetFileAndValidation(Type, '', '', '', '', false);
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        event.target.value = null;
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  ResetFileAndValidation(type: string, msg: string, name: string, path: string, dis_Name: string, isShowFile: boolean) {
    try {
      this.loaderService.requestStarted();
      if (type == 'NOCCUploadDocument') {
        this.request.NOCCUploadDocument = name;
        this.request.NOCCUploadDocumentPath = path;
        this.request.NOCCUploadDocument_Dis_FileName = dis_Name;
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
  async DeleteImage(Type: string, file: string) {
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        // delete from server folder
        await this.fileUploadService.DeleteDocument(file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, '', '', '', '', false);
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
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
  async GetAllBTERAffiliationCourseFeeList() {
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationAddCourseService.GetAllBTERAffiliationCourseFeeList(this.request.BTERRegID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.BTERAffiliationFeeList = data['Data'][0]['data'];
          for (var i = 0; i < this.BTERAffiliationFeeList.length; i++) {
            this.Total = (Number(this.Total) + Number(this.BTERAffiliationFeeList[i].CourseFee)).toFixed(2);
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
  async Branchtype(BterBranchTypeId: number) {
    debugger;
    if (BterBranchTypeId != 463) {
      this.branchname = 'SFS'
      console.log(this.branchname);
    }
    else {
      this.branchname = 'GAS'
      console.log(this.branchname);
    }
  }
}
