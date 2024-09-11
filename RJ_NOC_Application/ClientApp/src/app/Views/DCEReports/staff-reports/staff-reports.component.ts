import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffReportDataModel, StaffReportFilter } from '../../../Models/StaffReportDataModel';

import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { StaffReportsService } from '../../../Services/DCEReports/StaffReportsService/staff-reports.service';
import * as XLSX from 'xlsx';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-staff-reports',
  templateUrl: './staff-reports.component.html',
  styleUrls: ['./staff-reports.component.css']
})
export class StaffReportsComponent implements OnInit {


  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public DesignationList: any = [];
  public CollegeStatusList: any = [];
  public SubjectList: any = [];
  public NOCStatusList: any = [];
  public StaffStatusList: any = [];
  public StaffPFStatusList: any = [];
  public StaffReportList: any = [];
  public StaffDuplicateAdharlistList: any = [];
  public PresentCollegeStatusList_FilterData: any = [];
  public StaffReportData: any = [];
  public InstitutionList: any = [];
  public StaffResearchGuideList: any = [];
  public JoiningMinDate: Date = new Date;
  public isLoadingExport: boolean = false;
  public searchText: string = '';


  sSOLoginDataModel = new SSOLoginDataModel();
  request = new StaffReportDataModel();
  requestlst = new StaffReportFilter();


  constructor(private staffReportsService: StaffReportsService, private collegeservice: CollegeService, private statisticsEntryComponent: StatisticsEntryComponent, private loaderService: LoaderService, private toastr: ToastrService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private modalService: NgbModal) { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllDesignation();
    // await this.GetNocStatus();
    await this.GetSubjectList();
    await this.GetNOCStatus();

    await this.GetCollegeStatus();

    await this.GetStaffDuplicateAdharList();

    await this.DCEStaffDetailsList();
    await this.GetCollegesByDepartmentID();

    this.request.CollegeName = this.statisticsEntryComponent.CollegeName;

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



  async GetCollegesByDepartmentID() {
    try {
      this.loaderService.requestStarted();
      await this.collegeservice.GetCollegesByDepartmentID(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          /*console.log(data['Data'][0]);*/
          this.InstitutionList = data['Data'][0];
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

  CheckAppointmentDate() {
    try {
      this.loaderService.requestStarted();
      if (this.request.DateOfAppointment == '' || this.request.DateOfAppointment == null) {
        this.request.DateOfJoining = '';
        this.toastr.warning('First select Date Of Appointment');
      }
      else {


      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetSubjectList() {

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.staffReportsService.GetSubjectList()
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SubjectList = data['Data'];
          /*console.log(this.State);*/
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

  async GetNOCStatus() {

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, 'PresentCollegeStatus')
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.NOCStatusList = data['Data'];
          /*console.log(this.State);*/
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



  async GetCollegeStatus() {

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, 'CourseType')
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeStatusList = data['Data'];
          /*console.log(this.State);*/
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



  async GetStaffDuplicateAdharList() {

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.staffReportsService.GetStaffDuplicateAdharList(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StaffDuplicateAdharlistList = data['Data'];
          /*console.log(this.State);*/
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


  async DCEStaffDetailsList() {
    try {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();
      if (this.request.MonthlySalary.toString() == '' || this.request.MonthlySalary.toString() == null || this.request.MonthlySalary.toString() == undefined)
      {
        this.request.MonthlySalary = "0";
      }
      await this.staffReportsService.DCEStaffDetailsList(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StaffReportData = data['Data'][0]['data'];
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

  async ResetControl() {
    this.request = new StaffReportDataModel();
    this.requestlst = new StaffReportFilter();
    this.DCEStaffDetailsList();
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

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.StaffReportData.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        //ws['!cols'] = [];
        //ws['!cols'][0] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "StaffReportData.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }

  }


}
