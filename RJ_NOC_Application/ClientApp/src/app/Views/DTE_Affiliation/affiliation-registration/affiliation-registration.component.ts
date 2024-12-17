import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DTEAffiliationDataModel, DTEAffiliationRegistrationDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationRegistration/DTEAffiliationRegistrationDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { EnumDepartment } from '../../../Common/enum-noc';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DTEAffiliationRegistrationService } from '../../../Services/DTEAffiliation/DTEAffiliationRegistration/dte-affiliation-registration.service';
@Component({
  selector: 'app-affiliation-registration',
  templateUrl: './affiliation-registration.component.html',
  styleUrls: ['./affiliation-registration.component.css']
})

export class AffiliationRegistrationComponent {

  //Add FormBuilder
  DTEAffiliationForm!: FormGroup;
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
  public is_disableCollegeStatus: boolean = false;
  request = new DTEAffiliationRegistrationDataModel();
  public DTEAffiliationDataList: any = [];
  public StatusOfCollegeList: any = [];
  public DepartmentList: any = [];
  public DTEAffiliationApplyList: any = [];
  public AffiliationRegistrationList: any = [];
  public StartDateEndDateDepartmentwise: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  dteAffiliationDataModel = new DTEAffiliationDataModel();
  public IsOpen: boolean = false;
  public isFormValid: boolean = true;
  public AffiliationType: any = [];
  public ShowAffilationType: boolean = false;
  public ApplyAffiliation: string = '';
  public ApplyAffiliationFY: number = 65;
  constructor( private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard, private dTEAffiliationregistrationService: DTEAffiliationRegistrationService) {

  }
  async ngOnInit() { 
     
      this.DTEAffiliationForm = this.formBuilder.group(
        {
          ddlDepartmentID: ['', [DropdownValidators]],        
          ddlCollegeStatusId: ['', [DropdownValidators]],        
          ddlAffiliationType: [''],   
          txtCollege_Name: ['', Validators.required],
          txtMobile_Number: ['', Validators.required],
          txtEmail_Address: ['', Validators.required],

        })
    this.DTEAffiliationForm.get('ddlCollegeStatusId')?.enable();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //console.log(this.sSOLoginDataModel);
    this.request.SSOID = this.sSOLoginDataModel.SSOID;
    console.log(this.request.SSOID);
    const ddlDepartmentID = document.getElementById('ddlDepartmentID');
    if (ddlDepartmentID) ddlDepartmentID.focus();
    this.GetDepartmentList();
    this.GetDTEAffiliationApply();
    this.GetStatusOfCollege();      
    this.GetAffiliationType();
    this.GetAffiliationRegistrationList();
  }
  get form() { return this.DTEAffiliationForm.controls; }
 
  async GetDTEAffiliationApply() {   
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDTEAffiliationApply(this.request.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DTEAffiliationApplyList = data['Data'];

          if (data['Data'][0]['DTEAffiliationApplyStatus'] == 'Existing') {
            this.DTEAffiliationApplyList = this.DTEAffiliationApplyList.filter((element: any) => {
              return element.DTEAffiliationApplyStatus == "Existing";
            });
            this.ApplyAffiliation = this.DTEAffiliationApplyList[0]['DTEAffiliationApplyStatus'];
            this.DTEAffiliationForm.get('ddlCollegeStatusId')?.disable();

            this.ShowAffilationType = true;
          }
          if (data['Data'][0]['DTEAffiliationApplyStatus'] == 'New') {
            this.DTEAffiliationApplyList = this.DTEAffiliationApplyList.filter((element: any) => {
              return element.DTEAffiliationApplyStatus == "New";
            });
            this.ApplyAffiliation = this.DTEAffiliationApplyList[0]['DTEAffiliationApplyStatus'];           
          }
          this.ApplyAffiliationFY = data['Data'][0]['FYID'];
         // console.log(this.ApplyAffiliationFY);
          
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
  async GetStatusOfCollege() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "AffiliationCategory")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusOfCollegeList = data['Data'];
          if (this.ApplyAffiliation == 'Existing') {
            this.StatusOfCollegeList = this.StatusOfCollegeList.filter((element: any) => {
              return element.Name == "Existing";
            });
            this.request.CollegeStatusId = this.StatusOfCollegeList[0].ID;
            this.DTEAffiliationForm.get('ddlCollegeStatusId')?.disable();            
            this.ShowAffilationType = true;
          }
          if (this.ApplyAffiliation == 'New') {
            this.StatusOfCollegeList = this.StatusOfCollegeList.filter((element: any) => {
              return element.Name == "New";
            });
            this.request.CollegeStatusId = this.StatusOfCollegeList[0].ID;
            this.is_disableCollegeStatus = true;
            this.ShowAffilationType = false;
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
          for (let i = 0; i < data['Data'].length; i++) {
            this.DepartmentList = this.DepartmentList.filter((element: any) => {
              return element.DepartmentName == "Department Of Technical Education";
            });
            this.request.DepartmentID = this.DepartmentList[0].DepartmentID;
            this.DTEAffiliationForm.get('ddlDepartmentID')?.disable();
            this.GetStartDateEndDateDepartmentwise(this.request.DepartmentID);
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
          this.dteAffiliationDataModel = data['Data'][0];
          this.is_disableDepartment = true;
          if (data['Data'][0]['IsOpen'] == true) {
            this.IsOpen = true;
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
 
  async GetAffiliationType() {    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "AffiliationType")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AffiliationType = data['Data'];          
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

  async GetAffiliationRegistrationList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetAffiliationRegistrationList(this.request.SSOID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];         
          this.AffiliationRegistrationList = data['Data'][0]['data'];
          console.log(this.AffiliationRegistrationList);
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
  async SaveData()
  {    
      if (this.request.DepartmentID == 4) {
      //console.log(this.DTEAffiliationForm);
      this.isSubmitted = true;    
      if (this.DTEAffiliationForm.invalid) {
        this.isFormValid = false;
        return;
      }
      var CollegeStatustype = this.StatusOfCollegeList.find((x: { ID: any; }) => x.ID == this.request.CollegeStatusId).Name;
      this.request.CollegeStatus = CollegeStatustype     
      if (this.ApplyAffiliation == 'Existing' && this.request.AffiliationTypeID == 0) {
        this.isFormValid = false;
        return;
      }    
      const isConfirmed = confirm("Are you sure you want to submit the form?");
      if (!isConfirmed) {
        return; // Exit if user cancels
      }
      //Show Loading
      this.loaderService.requestStarted();
      this.isLoading = true;
      console.log(this.request);
      try {
        await this.dTEAffiliationregistrationService.SaveData(this.request)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            console.log(this.State);
            if (!this.State) {
              this.toastr.success(this.SuccessMessage)
              this.ResetControl();
              await this.GetAffiliationRegistrationList();        
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
    this.request.DTE_ARId = 0;
    this.request.College_Name = '';
    this.request.Mobile_Number = '';
    this.request.Email_Address = '';
    this.request.AffiliationTypeID =0;
    this.isSubmitted = false;
  }
  async Edit_OnClick(DepartmentID: number, DTE_ARId: number, CollegeStatusId: number) {    
    this.routers.navigate(['/dteaffiliationdetails' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(DTE_ARId.toString()))]);      
  }
  async View_OnClick(DepartmentID: number, DTE_ARId: number, CollegeStatusId: number) {    
    this.routers.navigate(['/dteaffiliationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(DTE_ARId.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeStatusId.toString()))]);
  }
 
}
