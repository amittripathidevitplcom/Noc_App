import { Component, Injectable, OnInit } from '@angular/core';
import { TotalNotFilledStatics_DataModel_Filter } from '../../../Models/SubjectWiseStatisticsDetailsDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import * as XLSX from 'xlsx';
import { ClassWiseStudentDetailsServiceService } from '../../../Services/ClassWiseStudentDetails/class-wise-student-details-service.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()

@Component({
  selector: 'app-total-not-filled-statics-report',
  templateUrl: './total-not-filled-statics-report.component.html',
  styleUrls: ['./total-not-filled-statics-report.component.css']
})
export class TotalNotFilledStaticsReportComponent implements OnInit {

  request = new TotalNotFilledStatics_DataModel_Filter();

  public searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public UniversityList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public TotalListNotFilledStaticsReport: any = [];


  constructor(private loaderService: LoaderService, private classWiseStudentDetailsServiceService: ClassWiseStudentDetailsServiceService, private toastr: ToastrService, private commonMasterService: CommonMasterService) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.LoadMaster();
    await this.GetTotalStatisticsNotFilledReport();
  }


  async LoadMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetUniversityByDepartmentId(3)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UniversityList = data['Data'];
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


  async GetTotalStatisticsNotFilledReport() {
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.classWiseStudentDetailsServiceService.CollegeList_StatisticsNotFilledReport(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TotalListNotFilledStaticsReport = data['Data'][0];
          console.log(this.TotalListNotFilledStaticsReport);
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
    this.request = new TotalNotFilledStatics_DataModel_Filter();
    await this.LoadMaster();
  }


  public isLoadingExport: boolean = false;
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.TotalListNotFilledStaticsReport.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
      
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "TotalStatisticsNotFilledReport.xlsx");
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
