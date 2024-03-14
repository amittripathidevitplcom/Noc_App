import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GrievanceReportSearchFilter } from '../../../../Models/SearchFilterDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { DCEDocumentScrutinyService } from '../../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { GrievanceService } from '../../../../Services/Grievance/grievance.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-newgrievancereport',
  templateUrl: './newgrievancereport.component.html',
  styleUrls: ['./newgrievancereport.component.css']
})
export class NewgrievancereportComponent implements OnInit {

  request = new GrievanceReportSearchFilter();
  sSOLoginDataModel = new SSOLoginDataModel();

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public QueryStringStatus: string = '';
  public DepartmentList: any;
  public CollegeDataList: any = [];
  public GrievanceReportData: any;
  searchText: string = '';

  constructor(private routers: Router, private router: ActivatedRoute, private toastr: ToastrService,private commonMasterService: CommonMasterService, private grievanceService: GrievanceService, private loaderService: LoaderService, private dceDocumentScrutinyService: DCEDocumentScrutinyService,) { }


  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());

    await this.GetDepartmentList();
    //await this.GetGrievanceReportList();
    //await this.GetDCENOCReportData();
  }

  

  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList_IsOpenNOCApplication()
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
  };

  async ddlDepartment_textChange(SeletedDepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(SeletedDepartmentID, this.sSOLoginDataModel.SSOID, "Grievance")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeDataList = data['Data'];
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
  };


  async GetGrievanceReportList(FromDate: any, ToDate:any) {
    debugger;
    
    try {
      this.loaderService.requestStarted();
      await this.dceDocumentScrutinyService.GetGrievanceReport(FromDate, ToDate)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GrievanceReportData = data['Data'][0]['data'];
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
    if (this.GrievanceReportData.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][8] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "GrievanceReportLst.xlsx");
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
  @ViewChild('content') content: ElementRef | any;


  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  //async ResetControl() {
  //  this.request = new GrievanceReportSearchFilter();
  //  await this.GetGrievanceReportList();
  //}

 



}
