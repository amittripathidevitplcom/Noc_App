import { Component, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApplyNocApplicationDataModel } from '../../../Models/ApplyNocParameterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { NocPaymentComponent } from '../../noc-payment/payment-request/noc-payment.component';
import { ApplyNOCFDRDetailsComponent } from '../apply-nocfdrdetails/apply-nocfdrdetails.component';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-apply-noc-parameter-details',
  templateUrl: './apply-noc-parameter-details.component.html',
  styleUrls: ['./apply-noc-parameter-details.component.css']
})
export class ApplyNocParameterDetailsComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  // model popup
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  // login model
  sSOLoginDataModel = new SSOLoginDataModel();
  // application list
  public ApplyNocApplicationList: ApplyNocApplicationDataModel[] = [];
  // application view
  public ApplyNocApplicationDetail: ApplyNocApplicationDataModel = new ApplyNocApplicationDataModel();

  // otp model
  public SelectedMobileNo: string = '';
  public SelectedApplyNocApplicationID: number = 0;
  public OTP: string = '';
  public UserOTP: string = '';
  public MaskedMobileNo: string = '';
  public CustomOTP: string = '123456';// bypass otp
  public isUserOTP: boolean = false;
  public isValidUserOTP: boolean = false;
  public ShowTimer: boolean = false;
  public isTimerDisabled: boolean = false;
  public StartTimer: any;
  public DisplayTimer: string = '';
  public searchText: string = '';

  public PaymentHistoryDetails: any = [];

  public ApplicationPaymentHistoryDetails: any = [];


  constructor(private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private nocPaymentComponent: NocPaymentComponent) {
  }

  async ngOnInit() {

    // load
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetApplyNocApplicationList();
  }

  async GetApplyNocApplicationList() {
    
    try {
      this.loaderService.requestStarted();
      // get
      await this.applyNocParameterService.GetApplyNocApplicationList(this.sSOLoginDataModel.SSOID)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (this.State == 0) {
            this.ApplyNocApplicationList = data['Data'];
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

  async ViewApplyNocApplication_click(content: any, applyNocApplicationID: number) {
    try {
      this.loaderService.requestStarted();
      // get
      await this.applyNocParameterService.GetApplyNocApplicationByApplicationID(applyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          console.log(data['Data']);
          // data
          if (this.State == 0) {
            this.ApplyNocApplicationDetail = data['Data'];
            console.log(this.ApplyNocApplicationDetail);
            // model popup
            this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocview-title', backdrop: 'static' }).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
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

  async PaymentApplyNocApplication_click(content: any, applyNocApplicationID: number) {
    try {
      this.loaderService.requestStarted();
      // get
      await this.applyNocParameterService.GetApplyNocApplicationByApplicationID(applyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (this.State == 0) {
            this.ApplyNocApplicationDetail = data['Data'];
            // model popup
            this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpayment-title', backdrop: 'static' }).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
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



  async EmitraPaymentApplyNocApplication_click(content: any, applyNocApplicationID: number) {
    try {
      this.loaderService.requestStarted();
      // get
      await this.applyNocParameterService.GetApplyNocApplicationByApplicationID(applyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (this.State == 0) {
            this.ApplyNocApplicationDetail = data['Data'];
            // model popup
            this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpayment-title', backdrop: 'static' }).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
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








  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async MakePayment_click(item: any) {
    try {
      this.loaderService.requestStarted();
      //debugger
      // payment request
      this.nocPaymentComponent.request.ApplyNocApplicationID = item.ApplyNocApplicationID;
      this.nocPaymentComponent.request.AMOUNT = item.TotalFeeAmount;
      this.nocPaymentComponent.request.USEREMAIL = item.CollegeEmail;
      this.nocPaymentComponent.request.USERNAME = item.CollegeName.substring(0, 49).str.replace(/[^a-zA-Z ]/g, "");
      this.nocPaymentComponent.request.USERMOBILE = item.CollegeMobileNo;
      this.nocPaymentComponent.request.PURPOSE = "Noc Payment";
      // post
      await this.nocPaymentComponent.PaymentRequest()
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



  async MakeEmitraPayment_click(item: any) {
    try {

      this.loaderService.requestStarted();
      this.nocPaymentComponent.emitraRequest.Amount = item.ApplicationFeeAmount;
      this.nocPaymentComponent.emitraRequest.AppRequestID = item.ApplyNocApplicationID;
      this.nocPaymentComponent.emitraRequest.ServiceID = item.ServiceId
      this.nocPaymentComponent.emitraRequest.UserName = item.CollegeName.substring(0, 49).str.replace(/[^a-zA-Z ]/g, "");
      this.nocPaymentComponent.emitraRequest.MobileNo = item.CollegeMobileNo;;
      this.nocPaymentComponent.emitraRequest.SsoID = "";
      this.nocPaymentComponent.emitraRequest.ApplicationIdEnc = item.ApplyNocApplicationID;
      // post
      await this.nocPaymentComponent.EmitraPaymentRequest()
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








  async DeleteApplyNocApplication_click(item: any) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        let modifyBy = 1;
        // post
        await this.applyNocParameterService.DeleteApplyNocApplicationByApplicationID(item.ApplyNocApplicationID, modifyBy)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            // data
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              const index: number = this.ApplyNocApplicationList.indexOf(item);
              if (index != -1) {
                this.ApplyNocApplicationList.splice(index, 1)
              }
            }
            else {
              this.toastr.error(this.ErrorMessage);
            }
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

  async FinalSubmitApplyNocApplication_click(item: any) {
    // otp send and verify process then proceed
    debugger
    this.SelectedApplyNocApplicationID = item.ApplyNocApplicationID;
    this.SelectedMobileNo = item.CollegeMobileNo;
    await this.OpenOTPModel();
    // success is in verifyotp()
  }

  // mobile otp
  CloseOTPModel() {
    const display = document.getElementById('ModalOtpVerify');
    if (display) display.style.display = 'none';
  }

  async OpenOTPModel() {
    this.UserOTP = '';
    this.MaskedMobileNo = '';
    try {
      this.loaderService.requestStarted();
      if (this.SelectedMobileNo.length > 0) {
        const visibleDigits = 4;
        let maskedSection = this.SelectedMobileNo.slice(0, -visibleDigits);
        let visibleSection = this.SelectedMobileNo.slice(-visibleDigits);
        this.MaskedMobileNo = maskedSection.replace(/./g, 'X') + visibleSection;
      }
      await this.commonMasterService.SendMessage(this.SelectedMobileNo, 'OTP')
        .then((data: any) => {
          this.OTP = data['Data'];
          this.CustomOTP = '123456';
          const display = document.getElementById('ModalOtpVerify')
          if (display) display.style.display = "block";
          this.timer(1);
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async VerifyOTP() {
    try {
      this.loaderService.requestStarted();
      this.isUserOTP = false;
      this.isValidUserOTP = false;
      if (this.UserOTP == '') {
        this.isUserOTP = true;
        return;
      }
      if (this.UserOTP == this.OTP || this.CustomOTP == this.UserOTP) {
        // otp success       
        let modifyBy = 1;
        // post
        await this.applyNocParameterService.FinalSubmitApplyNocApplicationByApplicationID(this.SelectedApplyNocApplicationID, modifyBy)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            // data
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              // close model
              this.CloseOTPModel();
              // get list
              await this.GetApplyNocApplicationList();
            }
            else {
              this.toastr.error(this.ErrorMessage);
            }
          }, error => console.error(error));
      }
      else {
        this.isValidUserOTP = true;
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

  async ResendOTP() {
    try {
      this.loaderService.requestStarted();
      this.timer(1);
      var MaskedMobileNo = this.SelectedMobileNo;
      await this.commonMasterService.SendMessage(MaskedMobileNo, 'OTP')
        .then((data: any) => {
          this.OTP = data['Data'];
          this.CustomOTP = '123456';
          if (MaskedMobileNo.length > 0) {
            const visibleDigits = 4;
            let maskedSection = MaskedMobileNo.slice(0, -visibleDigits);
            let visibleSection = MaskedMobileNo.slice(-visibleDigits);
            MaskedMobileNo = maskedSection.replace(/./g, 'X') + visibleSection;
          }
          this.toastr.info('Successfully Resend OTP on ' + MaskedMobileNo);
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

  timer(minute: number) {
    clearInterval(this.StartTimer);
    this.ShowTimer = true;
    this.isTimerDisabled = true;
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    this.StartTimer = setInterval(() => {

      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.DisplayTimer = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.ShowTimer = false;
        this.isTimerDisabled = false;
        clearInterval(this.StartTimer);
      }
    }, 1000);
  }
  // end mobile otp

  async PaymentHistoryApplyNocApplication_click(content: any, applyNocApplicationID: number) {
    try {
      this.loaderService.requestStarted();
      // get
      await this.applyNocParameterService.GetApplyNocPaymentHistoryApplicationID(applyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (this.State == 0) {
            this.ApplyNocApplicationDetail.ApplyNocApplicationID = applyNocApplicationID;
            this.PaymentHistoryDetails = data['Data'][0]['data'];
            console.log(this.PaymentHistoryDetails);
            // model popup
            this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpaymentdetails-title', backdrop: 'static' }).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
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



  async PaymentHistoryNocApplication_click(content: any, applyNocApplicationID: number) {
    try {
      this.loaderService.requestStarted();
      // get
      await this.applyNocParameterService.GetApplicationPaymentHistoryApplicationID(applyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (this.State == 0) {
            this.ApplyNocApplicationDetail.ApplyNocApplicationID = applyNocApplicationID;
            this.ApplicationPaymentHistoryDetails = data['Data'][0]['data'];
            console.log(this.ApplicationPaymentHistoryDetails);
            // model popup
            this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpaymentdetails-title', backdrop: 'static' }).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
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



  async AddFDR_click(item: any) {
    try {
      this.loaderService.requestStarted();
      // model
      const modalRef = this.modalService.open(ApplyNOCFDRDetailsComponent, { backdrop: 'static', size: 'xl', keyboard: false, centered: true });
      modalRef.componentInstance.CollegeID = item.CollegeID;
      modalRef.componentInstance.ApplyNocApplicationID = item.ApplyNocApplicationID;
      modalRef.componentInstance.IsSaveFDR = item.IsSaveFDR;
      modalRef.componentInstance.RefModal = modalRef;
      modalRef.componentInstance.CollegeName = item.CollegeName
      modalRef.componentInstance.ApplicationNo = item.ApplicationNo
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
}
