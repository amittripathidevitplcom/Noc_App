import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { DCEDocumentScrutinyService } from '../../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import * as XLSX from 'xlsx';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { PaymentReportDataModel } from '../../../../Models/PaymentReportDataModel';
import { PaymentReportService } from '../../../../Services/Admin/PaymentReport/payment-report.service';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.css']
})
export class PaymentReportComponent implements OnInit {

  request = new PaymentReportDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();


  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public QueryStringStatus: string = '';
  public DepartmentList: any= [];
  public CollegeDataList: any = [];
  public PaymentReportData: any = [];

  searchText: string = '';
  SelectedSSOID: any = [];
  SelectedDepartmentID: any = [];
 
 

  constructor(private routers: Router, private router: ActivatedRoute, private toastr: ToastrService, private commonMasterService: CommonMasterService, private loaderService: LoaderService, private paymentReportService: PaymentReportService,) { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDepartmentList();
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;

  }


  async GetDepartmentList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList_IsOpenNOCApplication()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentList = data['Data'];
          this.request.DepartmentID = this.DepartmentList['DepartmentID'];

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


  


  async GetPaymentReportList(FromDate: any, ToDate: any,DepartmentID: number) {
    debugger;

    try {
      this.loaderService.requestStarted();
      await this.paymentReportService.GetPaymentReport(FromDate, ToDate, this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PaymentReportData = data['Data'][0]['data'];
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
    if (this.PaymentReportData.length > 0) {
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
        XLSX.writeFile(wb, "PaymentReportLst.xlsx");
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

  async ResetControl() {
    this.request = new PaymentReportDataModel();
    
  }
   
 
  
}
