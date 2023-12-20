import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { __rest } from 'tslib';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { TotalCollegeReportSearchFilter } from '../../../Models/SearchFilterDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { CollegeList_StatisticsFinalSubmitedDataModel_Filter } from '../../../Models/SubjectWiseStatisticsDetailsDataModel';
import { ClassWiseStudentDetailsServiceService } from '../../../Services/ClassWiseStudentDetails/class-wise-student-details-service.service';

@Injectable()

@Component({
  selector: 'app-college-submit-statistics-report-dce',
  templateUrl: './college-submit-statistics-report-dce.component.html',
  styleUrls: ['./college-submit-statistics-report-dce.component.css']
})
export class CollegeSubmitStatisticsReportDCEComponent implements OnInit {
  request = new CollegeList_StatisticsFinalSubmitedDataModel_Filter();
  public searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  //Add FormBuilder

  public UniversityList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public TotalCollegeList: any = [];

  public collegeListData: any = [];
  public collegeContactDetailsList: any = [];
  public collegeNearestGovernmentHospitalsList: any = [];
  public DTECollegeLevel: any = [];



  constructor(private classWiseStudentDetailsServiceService: ClassWiseStudentDetailsServiceService, private draftApplicationListService: DraftApplicationListService, private routers: Router, private router: ActivatedRoute, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.LoadMaster();
    await this.GetTotalStatisticsSubmittedCollegeList();
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
  async FillDivisionRelatedDDL(SelectedDivisionID: string) {
    try {
      this.loaderService.requestStarted();
      const divisionId = Number(SelectedDivisionID);
      this.request.DistrictID = 0;
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

  async GetTotalStatisticsSubmittedCollegeList() {
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.classWiseStudentDetailsServiceService.CollegeList_StatisticsFinalSubmited(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TotalCollegeList = data['Data'][0];
          console.log(this.TotalCollegeList);
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

  public isLoadingExport: boolean = false;
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.TotalCollegeList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][0] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "TotalCollegeList.xlsx");
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
    this.request = new CollegeList_StatisticsFinalSubmitedDataModel_Filter();
  }
}
