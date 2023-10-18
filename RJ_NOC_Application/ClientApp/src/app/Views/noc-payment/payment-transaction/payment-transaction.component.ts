import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';

import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service';
import { RequestDetails, EmitraRequestDetails, TransactionStatusDataModel, TransactionSearchFilterModel } from '../../../Models/PaymentDataModel';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { NocPaymentComponent } from '../payment-request/noc-payment.component';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-payment-transaction',
  templateUrl: './payment-transaction.component.html',
  styleUrls: ['./payment-transaction.component.css']
})
export class PaymentTransactionComponent
{

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public searchText: string = '';
  public TransactionList: any[] = [];
  public RefundTransactionList: any[] = [];
  transactionStatusRequest = new TransactionStatusDataModel();
  transactionSearchFilterModel = new TransactionSearchFilterModel();
  // login model
  sSOLoginDataModel = new SSOLoginDataModel();
  constructor(private loaderService: LoaderService, private toastr: ToastrService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private nocpaymentService: NocpaymentService, private nocPaymentComponent: NocPaymentComponent) {

  }
  async ngOnInit()
  {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRPPPaymentHistory();
  }
  async GetRPPPaymentHistory()
  {
    try
    {
      this.transactionSearchFilterModel.DepartmentID = 0;
      this.transactionSearchFilterModel.Key = "GetRPPTransactionList";
      this.loaderService.requestStarted();
      // get
      await this.nocpaymentService.GetRPPTransactionList(this.transactionSearchFilterModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (this.State == 0) {
    
            this.TransactionList = data['Data'][0]['data'];
          ;
            // model popup
          }
          else {
            this.toastr.error(this.ErrorMessage);
          }
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


  async RefundPayment_click(item:any) {

    this.loaderService.requestStarted();
    try {

      if (confirm('Are You Sure To Refund This Transaction')) {

        this.transactionStatusRequest.PRN = item.PRNNO;
        this.transactionStatusRequest.ApplyNocApplicationID = item.ApplyNocApplicationID;
        this.transactionStatusRequest.AMOUNT = item.Amount;
        this.transactionStatusRequest.DepartmentID = item.DepartmentID;
        this.transactionStatusRequest.RPPTXNID = item.RPPTXNID;
        this.transactionStatusRequest.CreatedBy = this.sSOLoginDataModel.UserID;
        await this.nocpaymentService.RPPTransactionRefund(this.transactionStatusRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            console.log(data.Data.MERCHANTCODE);
            console.log(this.State);
            if (!this.State)
            {
              this.toastr.success(this.SuccessMessage)
              this.GetRPPPaymentHistory();
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async RefundPaymentStatus_click(item: any) {
    try {
      this.loaderService.requestStarted();
      // Refund Request
      this.nocPaymentComponent.transactionStatusRequest.PRN = item.PRNNO;
      this.nocPaymentComponent.transactionStatusRequest.ApplyNocApplicationID = item.ApplyNocApplicationID;
      this.nocPaymentComponent.transactionStatusRequest.AMOUNT = item.Amount;
      this.nocPaymentComponent.transactionStatusRequest.DepartmentID = item.DepartmentID;
      this.nocPaymentComponent.transactionStatusRequest.RPPTXNID = item.RPPTXNID; 
      //Post
      await this.nocPaymentComponent.RPPTransactionRefundStatus();
      this.GetRPPPaymentHistory();
      this.ViewRefundRequest(item);
   
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



  async ViewRefundRequest(item:any) {
    try {
      this.transactionStatusRequest.DepartmentID = item.DepartmentID;
      this.transactionSearchFilterModel.Key = "GetRefundTransactionList";
      this.transactionSearchFilterModel.ApplyNocApplicationID = item.ApplyNocApplicationID;
      this.transactionSearchFilterModel.RPPTranID = item.RPPTXNID;
      
      // get
      await this.nocpaymentService.GetRPPTransactionList(this.transactionSearchFilterModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (this.State == 0) {

            this.RefundTransactionList = data['Data'][0]['data'];
            ;
            // model popup
          }
          else {
            this.toastr.error(this.ErrorMessage);
          }
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

  async CheckStatus_click(item: any) {
    try {
      this.loaderService.requestStarted();
      //debugger
      // payment request
      this.nocPaymentComponent.transactionStatusRequest.ApplyNocApplicationID = item.ApplyNocApplicationID;
      this.nocPaymentComponent.transactionStatusRequest.AMOUNT = item.Amount;
      this.nocPaymentComponent.transactionStatusRequest.PRN = item.PRNNO;
      this.nocPaymentComponent.transactionStatusRequest.DepartmentID = item.DepartmentID;
      // post
      await this.nocPaymentComponent.GetTransactionStatus();
      this.GetRPPPaymentHistory();
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
