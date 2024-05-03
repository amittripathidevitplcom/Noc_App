import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { __rest } from 'tslib';
import * as XLSX from 'xlsx';
import { PaymentDetailsDataModel_Filter } from '../../../Models/PaymentReportModel';
import { Data } from '@angular/router';

@Injectable()

@Component({
  selector: 'app-college-payment-report',
  templateUrl: './college-payment-report.component.html',
  styleUrls: ['./college-payment-report.component.css']
})
export class CollegePaymentReportComponent implements OnInit {
  request = new PaymentDetailsDataModel_Filter();
  public searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public MaxDate: Date = new Date();

  public PaymentList: any = [];




  constructor( private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    await this.GetOnlinePaymentDetailsByDepartment();
  }

  public isLoadingExport: boolean = false;
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.PaymentList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        //ws['!cols'][1] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "OnlinePaymentReport.xlsx");
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
    this.request.FromDate = '';
    this.request.ToDate = '';
    this.request.SearchBy = '';
    this.request.PaymentStatus = '';
  }
  async GetOnlinePaymentDetailsByDepartment() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetOnlinePaymentDetailsByDepartment(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PaymentList = data['Data'][0];
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


}
