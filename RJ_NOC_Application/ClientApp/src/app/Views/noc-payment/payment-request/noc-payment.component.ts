import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';

import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service';
import { RequestDetails, EmitraRequestDetails } from '../../../Models/PaymentDataModel';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { GlobalConstants } from '../../../Common/GlobalConstants';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-noc-payment',
  templateUrl: './noc-payment.component.html',
  styleUrls: ['./noc-payment.component.css']
})
export class NocPaymentComponent implements OnInit {

  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  PaymentRequestForm!: FormGroup;
  /*Save Data Model*/
  request = new RequestDetails();
  emitraRequest = new EmitraRequestDetails();


  constructor(private loaderService: LoaderService, private toastr: ToastrService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private nocpaymentService: NocpaymentService) {

  }

  async ngOnInit() {
    this.PaymentRequestForm = this.formBuilder.group(
      {

        txtUSERNAME: ['', Validators.required],
        txtUSEREMAIL: ['', Validators.required],
        txtCMMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtAMOUNT: ['', Validators.required],
        txtPURPOSE: ['', Validators.required],

      })
  }

  RedirectPaymentRequest(pMERCHANTCODE: any, pENCDATA: any) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", GlobalConstants.RPPRequstURL);
    form.setAttribute("target", "_self");
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("name", "ENCDATA");
    hiddenField.setAttribute("value", pENCDATA);
    form.appendChild(hiddenField);
    var MERCHANTCODE = document.createElement("input");
    MERCHANTCODE.setAttribute("name", "MERCHANTCODE");
    MERCHANTCODE.setAttribute("value", pMERCHANTCODE);
    form.appendChild(MERCHANTCODE);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }


  async PaymentRequest() {
    //this.request.AMOUNT = 1000;
    //this.request.USEREMAIL = "r.rajsingh04@gmail.com"
    //this.request.USERNAME = "Rav Raj";
    //this.request.USERMOBILE = "7737348604";
    //this.request.PURPOSE = "Test";
    //this.request.ApplyNocApplicationID = 1;

    //debugger
    this.loaderService.requestStarted();
    try {
      await this.nocpaymentService.PaymentRequest(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(data.Data.MERCHANTCODE);
          console.log(this.State);
          if (!this.State) {
            this.RedirectPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }






  async EmitraPaymentRequest()
  {
    //this.request.AMOUNT = 1000;
    //this.request.USEREMAIL = "r.rajsingh04@gmail.com"
    //this.request.USERNAME = "Rav Raj";
    //this.request.USERMOBILE = "7737348604";
    //this.request.PURPOSE = "Test";
    //this.request.ApplyNocApplicationID = 1;
    this.emitraRequest.Amount = 10;
    this.emitraRequest.AppRequestID = "1";
    this.emitraRequest.ServiceID = "8184"
    this.emitraRequest.UserName = "Rav Raj";
    this.emitraRequest.MobileNo = "7737348604";
    this.emitraRequest.SsoID = "geeta.saini87";
    this.emitraRequest.ApplicationIdEnc = "1";

    //debugger
    this.loaderService.requestStarted();
    try {
      await this.nocpaymentService.EmitraPayment(this.emitraRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(data);
          //console.log(data.Data.MERCHANTCODE);
          //console.log(this.State);

          //Model.ENCDATA = response.Body.EmitraEncryptStringResult;
          //Model.MERCHANTCODE = EmitraServiceDetail.MERCHANTCODE;
          //Model.PaymentRequestURL = EmitraServiceDetail.ServiceURL;
          //Model.ServiceID = EmitraServiceDetail.SERVICEID;

     

          if (!this.State)
          {
            this.RedirectEmitraPaymentRequest(data.MERCHANTCODE, data.ENCDATA, data.PaymentRequestURL)

          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  RedirectEmitraPaymentRequest(pMERCHANTCODE: any, pENCDATA: any, pServiceURL: any)
  {

    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action",pServiceURL);

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "ENCDATA");
    hiddenField.setAttribute("value", pENCDATA);
    form.appendChild(hiddenField);

    var hiddenFieldService = document.createElement("input");
    hiddenFieldService.setAttribute("type", "hidden");
    hiddenFieldService.setAttribute("name", "SERVICEID");
    hiddenFieldService.setAttribute("value", "8184");
    form.appendChild(hiddenFieldService);

    var MERCHANTCODE = document.createElement("input");
    MERCHANTCODE.setAttribute("type", "hidden");
    MERCHANTCODE.setAttribute("name", "MERCHANTCODE");
    MERCHANTCODE.setAttribute("value", pMERCHANTCODE);
    form.appendChild(MERCHANTCODE);
    document.body.appendChild(form);
    form.submit();

    document.body.removeChild(form);


  }

}
