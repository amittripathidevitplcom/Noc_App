import { Component, OnInit, Input, Injectable } from '@angular/core';
import { CourseReportSearchFilter, CourseReportSearchFilterLst } from '../../../Models/SearchFilterDataModel';
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



@Component({
  selector: 'app-course-reports',
  templateUrl: './course-reports.component.html',
  styleUrls: ['./course-reports.component.css']
})
export class CourseReportsComponent implements OnInit {
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
  public IsExisting: boolean = false;
  public PresentCollegeStatusList_FilterData: any = []
  public PresentCollegeStatusList: any = [];
  public isLoading: boolean = false;
  public MaxDate: Date = new Date();

  constructor(private coursereportservice: CourseReportService, private collegeService: CollegeService, private routers: Router, private router: ActivatedRoute, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService) {
  }
  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.LoadMaster();
    await this.GetCourseReport();
    await this.GetDepartmentList(3);
  }
  async LoadMaster() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetUniversityByDepartmentId(3)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UniversityList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCourseList_DepartmentIDWise(3)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CoursesList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(3, "PresentCollegeStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusOfCollegeList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(3, "CourseType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CourseTypeList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(3, "OLDNOCStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CourseNOCStatusList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(3, "OLDNOCStatus")
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
      await this.collegeService.GetCollegesByDepartmentID(3)
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

  async GetCourseReport() {
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = 3;
      await this.coursereportservice.CoursesReport(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GetCourseList = data['Data'][0]['data'];
          console.log(this.GetCourseList);
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
    await this.GetDepartmentList(3);
  }
}

