import { Component, OnInit, Input, Injectable } from '@angular/core';
import { CourseReportSearchFilter, CourseReportSearchFilterLst, PagingConfig } from '../../../Models/SearchFilterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CourseReportService } from '../../../Services/DCEReports/CourseReport/course-report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { SearchFilterDataModel } from '../../../Models/TabDetailDataModel';
import * as XLSX from 'xlsx';  
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-course-reports',
  templateUrl: './course-reports.component.html',
  styleUrls: ['./course-reports.component.css']
})
export class CourseReportsComponent implements PagingConfig, OnInit {
  searchText: string = '';
  request = new CourseReportSearchFilter();
  sSOLoginDataModel = new SSOLoginDataModel();
  requestlst = new CourseReportSearchFilterLst();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public StatusOfCollegeList: any = [];
  public CourseNOCStatusList: any = [];
  public SubjectNOCStatusList: any = [];
  public UniversityList: any = [];
  public CoursesList: any = [];
  public SubjectList: any = [];
  public CollegeList: any = [];
  public CollegeStatusList: any = [];
  public CourseTypeList: any = [];
  public GetCourseList: any = [];
  public GetCourseList_Export: any = [];
  public IsExisting: boolean = false;
  public PresentCollegeStatusList_FilterData: any = []
  public PresentCollegeStatusList: any = [];
  public isLoading: boolean = false;
  public MaxDate: Date = new Date();

  constructor(private coursereportservice: CourseReportService, private collegeService: CollegeService, private routers: Router, private router: ActivatedRoute, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService) {

  }
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  tableSize: number[] = [10, 20, 50, 100, 500, 1000];
  pagingConfig: PagingConfig = {} as PagingConfig;

  async ngOnInit() {

    this.pagingConfig = {
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
      totalItems: this.totalItems
    }

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.LoadMaster();
    await this.GetDepartmentList(this.sSOLoginDataModel.DepartmentID);
    await this.GetCourseReport();
  }
  async LoadMaster() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetUniversityByDepartmentId(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UniversityList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCourseList_DepartmentIDWise(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CoursesList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, "PresentCollegeStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusOfCollegeList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, "CourseType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CourseTypeList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, "OLDNOCStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CourseNOCStatusList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, "OLDNOCStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectNOCStatusList = data['Data'];
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

  async GetDepartmentList(CollegeTypeID: number) {

    try {
      this.loaderService.requestStarted();
      await this.collegeService.GetCollegesByDepartmentID(this.sSOLoginDataModel.DepartmentID)
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
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  async GetSubjectList(SelectedCourseID: string) {
    try {
      this.SubjectList = [];
      this.loaderService.requestStarted();
      const CourseID = Number(SelectedCourseID);
      if (CourseID <= 0) {
        return;
      }
      await this.commonMasterService.GetSubjectList_CourseIDWise(CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectList = data['Data'];
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

  async ddlCollegeStatus_TextChange(event: any, SelectedCollegeStatusID: string) {
    try {
      this.loaderService.requestStarted();

      const selectedCollegeStatusID = Number(SelectedCollegeStatusID);
      let SelectdCollegeStatusName = this.CollegeStatusList.find((x: { ID: number; }) => x.ID == selectedCollegeStatusID).Name;

      if (SelectdCollegeStatusName == "New") {

        this.IsExisting = false;

        if (this.request.DepartmentID == 3) {
          this.PresentCollegeStatusList_FilterData = this.PresentCollegeStatusList.filter((element: any) => {
            return element.Name == "TNOC Holder";
          });

        }
        else {
          this.PresentCollegeStatusList_FilterData = this.PresentCollegeStatusList;
        }
      }
      else {
        this.IsExisting = true;
        if (this.request.DepartmentID != 3) {
          this.PresentCollegeStatusList_FilterData = this.PresentCollegeStatusList.filter((element: any) => {
            return element.Name == "PNOC Holder";
          });
        }
        this.PresentCollegeStatusList_FilterData = this.PresentCollegeStatusList;
      }

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


  onTableDataChange(event: any) {

    console.log(event);
    this.pagingConfig.currentPage = event;
    this.request.PageNumber = this.pagingConfig.currentPage;
    this.GetCourseReport();
  }
  onTableSizeChange(event: any): void {
    this.pagingConfig.itemsPerPage = event.target.value;
    this.pagingConfig.currentPage = 1;

    this.request.PageSize = this.pagingConfig.itemsPerPage;
    this.request.PageNumber = this.pagingConfig.currentPage;

    this.GetCourseReport();
  }
  async GetCourseReport() {
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.coursereportservice.CoursesReport(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GetCourseList = data['Data'][0]['data'];
          this.request.TotalRecords = data['Data'][0]['data'][0]["TotalRecords"];
          this.pagingConfig.totalItems = this.request.TotalRecords;
          this.request.PageSize = this.pagingConfig.itemsPerPage;
          this.request.PageNumber = this.pagingConfig.currentPage;
          //this.request.TotalPages = Number((Number(this.request.TotalRecords) / Number(this.request.PageSize)).toFixed(0));  
          // this.SetPaginate(1);
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


  async ResetControl() {
    this.request = new CourseReportSearchFilter();
    this.sSOLoginDataModel = new SSOLoginDataModel();
    this.requestlst = new CourseReportSearchFilterLst();
    await this.LoadMaster();
    await this.GetCourseReport();
    await this.GetDepartmentList(this.sSOLoginDataModel.DepartmentID);
  }

  async btnExportTable_Click() {
    this.loaderService.requestStarted();
    let PageNumber = this.request.PageNumber;
    let PageSize = this.request.PageSize;

    this.request.PageNumber = 1;
    this.request.PageSize = this.request.TotalRecords;

    await this.coursereportservice.CoursesReport(this.request)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetCourseList_Export = data['Data'][0]['data'];
      }, error => console.error(error));

    if (this.GetCourseList_Export.length > 0) {
      try {

        const ExportData: any = this.GetCourseList_Export.map((x: {
          CourseType: any;
          StatusOfCollege: any;
          Institution: any;
          UniversityName: any;
          CourseName: any;
          CourseNOCStatus: any;
          SubjectName: any;
          NoOfEnrolledStudents: any;
          SubjectNOCStatus: any;
          NOCNumber: any;
          FromSubmittedNOCDate: any;
          ToSubmittedNOCDate: any;
        }) => ({
          CourseType: x.CourseType,
          StatusOfCollege: x.StatusOfCollege,
          Institution: x.Institution,
          UniversityName: x.UniversityName,
          CourseName: x.CourseName,
          CourseNOCStatus: x.CourseNOCStatus,
          SubjectName: x.SubjectName,
          NoOfEnrolledStudents: x.NoOfEnrolledStudents,
          SubjectNOCStatus: x.SubjectNOCStatus,
          NOCNumber: x.NOCNumber,
          FromSubmittedNOCDate: x.FromSubmittedNOCDate,
          ToSubmittedNOCDate: x.ToSubmittedNOCDate, 
        }));
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(ExportData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, "CourseReports.xlsx"); 
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.request.PageNumber = PageNumber;
          this.request.PageSize = PageSize;
          this.loaderService.requestEnded();
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.request.PageNumber = PageNumber;
        this.request.PageSize = PageSize;
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}

