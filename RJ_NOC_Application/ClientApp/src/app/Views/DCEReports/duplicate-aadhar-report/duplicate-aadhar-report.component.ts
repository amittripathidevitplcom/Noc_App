import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service'; 
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; 
import { Clipboard } from  '@angular/cdk/clipboard';
import { DuplicateAadharReportService } from '../../../Services/DCEReports/DuplicateAadharReport/duplicate-aadhar-report.service';
import { DuplicateAadharReportDataModel, DuplicateAadharReportFilter } from '../../../Models/DuplicateAadharReportDataModel';


@Component({
  selector: 'app-duplicate-aadhar-report',
  templateUrl: './duplicate-aadhar-report.component.html',
  styleUrls: ['./duplicate-aadhar-report.component.css']
})
export class DuplicateAadharReportComponent implements OnInit {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ClassWiseStaticReportLst: any = [];
  public DesignationList: any = [];
  public isLoading: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  searchText: string = '';
  public CollegeList: any = [];
  public GetDuplicateAadhaarDetailList: any = [];
  public MaxDate: Date = new Date();
  request = new DuplicateAadharReportDataModel()
  requestlst = new DuplicateAadharReportFilter()


  constructor(private clipboard: Clipboard, private collegeservice: CollegeService, private toastr: ToastrService, private loaderService: LoaderService, private modalService: NgbModal,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private duplicateAadharReportService: DuplicateAadharReportService) {

  }
  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    await this.GetAllDesignation();
    await this.GetColleges_DepartmentWise(this.sSOLoginDataModel.DepartmentID);
    await this.GetDuplicateAadhaarReport();

  }

  async GetAllDesignation() {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.commonMasterService.GetAllDesignation()
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DesignationList = data['Data'];
          console.log(this.State);
        });
    }
    catch (ex) {
      console.log(ex)
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async GetColleges_DepartmentWise(CollegeTypeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.collegeservice.GetCollegesByDepartmentID(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeList = data['Data'][0];
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
  async GetDuplicateAadhaarReport() {
         try {
          this.loaderService.requestStarted();
          if (this.request.MonthlySalary.toString() == '' || this.request.MonthlySalary.toString() == null || this.request.MonthlySalary.toString() == undefined) {
            this.request.MonthlySalary = 0;
          }
      await this.duplicateAadharReportService.GetDuplicateAadhaarReportDatail(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GetDuplicateAadhaarDetailList = data['Data'][0]['data'];

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


  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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
  async ResetControl() {
    this.request = new DuplicateAadharReportDataModel()
    this.requestlst = new DuplicateAadharReportFilter()
    this.GetDuplicateAadhaarReport();
    
    
  }


}

