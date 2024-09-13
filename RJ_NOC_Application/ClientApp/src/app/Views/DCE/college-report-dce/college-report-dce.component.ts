import { Component, OnInit, Input, Injectable, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { __rest } from 'tslib';
import { DCECollegesReportSearchFilter, DCECollegesReportSearchFilterAllData } from '../../../Models/SearchFilterDataModel';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';

@Injectable()

@Component({
  selector: 'app-college-report-dce',
  templateUrl: './college-report-dce.component.html',
  styleUrls: ['./college-report-dce.component.css']
})
export class CollegeReportDCEComponent implements OnInit {
  public searchText: string = '';
  request = new DCECollegesReportSearchFilter();
  requestlst = new DCECollegesReportSearchFilterAllData();
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  //Add FormBuilder
  public NOCStatusList: any = [];
  public ApplicationStatusList: any = [];
  public CollegeTypeList: any = [];
  public StatusOfCollegeList: any = [];
  public CollegeLevelList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public SuvdivisionList: any = [];

  public TehsilList: any = [];
  public ParliamentAreaList: any = [];
  public AssembelyAreaList: any = [];
  public FinancialYearList: any = [];
  public NodalOfficerList: any = [];
  public ApplicationTypeList: any = [];
  public LandAreaList: any = [];
  public LandDocumentTypeList: any = [];
  public LandConversionList: any = [];
  public UniversityList: any = [];
  public CoursesList: any = [];
  public SubjectList: any = [];

  isCardBodyHidden: boolean = true;




  public CollegeList: any = [];


  constructor(private elementRef: ElementRef,private collegeservice:CollegeService,private routers: Router, private router: ActivatedRoute, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.LoadMaster();
    await this.GetCollegeReport();
   // await this.GetCollegeReport();
  }


  async LoadMaster() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, "CourseType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.NOCStatusList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetWorkFlowStatusbyDepartment(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ApplicationStatusList = data['Data'][0]['data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, "CollegeType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeTypeList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, "PresentCollegeStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusOfCollegeList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, "CollegeLevel")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeLevelList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetDivisionList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DivisionList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetDistrictListByStateID(6)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetAllFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.FinancialYearList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetUsersByRoleDepartment(this.sSOLoginDataModel.DepartmentID, 17)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.NodalOfficerList = data['Data'][0]['data'];
        }, error => console.error(error));
      await this.commonMasterService.GetApplyNOCParameterbyDepartment(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ApplicationTypeList = data['Data'][0]['data'];
        }, error => console.error(error));



      await this.commonMasterService.GetLandAreaMasterList_DepartmentWise(this.sSOLoginDataModel.DepartmentID, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LandAreaList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetLandDoucmentTypeMasterList_DepartmentWise(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LandDocumentTypeList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWises(this.sSOLoginDataModel.DepartmentID, 0, 'LandConversion')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LandConversionList = data['Data'];
        }, error => console.error(error));
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
  async FillDivisionRelatedDDL(SelectedDivisionID: string) {
    try {
      this.DistrictList = [];
      this.SuvdivisionList = [];
      this.TehsilList = [];
      this.ParliamentAreaList = [];
      this.AssembelyAreaList = [];
      this.request.DistrictID = 0;
      this.request.SubDivisionID = 0;
      this.request.TehsilID = 0;
      this.request.ParliamentID = 0;
      this.request.AssemblyID = 0;
      this.loaderService.requestStarted();
      const divisionId = Number(SelectedDivisionID);
      if (divisionId < 0) {
        return;
      }
      if (divisionId == 0) {
        await this.commonMasterService.GetDistrictListByStateID(6)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictList = data['Data'];
          }, error => console.error(error));
      }
      else {
        await this.commonMasterService.GetDistrictByDivsionId(divisionId)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictList = data['Data'];
          }, error => console.error(error));
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
  async FillDistrictRelatedDDL(SelectedDistrictID: string) {
    try {
      this.SuvdivisionList = [];
      this.TehsilList = [];
      this.ParliamentAreaList = [];
      this.AssembelyAreaList = [];
      this.request.SubDivisionID = 0;
      this.request.TehsilID = 0;
      this.request.ParliamentID = 0;
      this.request.AssemblyID = 0;
      this.loaderService.requestStarted();
      const districtId = Number(SelectedDistrictID);
      if (districtId <= 0) {
        return;
      }
      // subdivision list
      await this.commonMasterService.GetSuvdivisionByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SuvdivisionList = data['Data'];
        }, error => console.error(error));
      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilList = data['Data'];
        }, error => console.error(error));
      // ParliamentArea list
      await this.commonMasterService.GetParliamentAreaByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ParliamentAreaList = data['Data'];
        }, error => console.error(error));
      // AssembelyArea list
      await this.commonMasterService.GetAssembelyAreaByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AssembelyAreaList = data['Data'];
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

  async GetCollegeReport() {
    try {

      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.collegeservice.CollegesReport(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeList = data['Data'][0]['data'];
          console.log(this.CollegeList);
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
  public isLoadingExport: boolean = false;
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.CollegeList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        //ws['!cols'][0] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "CollegesReportList.xlsx");
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
  async ResetControl() {
    this.request = new DCECollegesReportSearchFilter();
    await this.LoadMaster();
  }


  

  





}
