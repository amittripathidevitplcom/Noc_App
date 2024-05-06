import { Component, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApplyNocApplicationDataModel, ApplyNocOfflinePaymentModal } from '../../../Models/ApplyNocParameterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { NocPaymentComponent } from '../../noc-payment/payment-request/noc-payment.component';
import { ApplyNOCFDRDetailsComponent } from '../apply-nocfdrdetails/apply-nocfdrdetails.component';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';

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
  public request: ApplyNocOfflinePaymentModal = new ApplyNocOfflinePaymentModal();

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
  public ApplicationTrailList: any = [];
  public lstPaymentMode: any = [];
  public lstOfflinePaymentDetails: any = [];
  public file: any = '';
  public AddUpdatetext: string = 'Add';


  constructor(private fileUploadService: FileUploadService, private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private nocPaymentComponent: NocPaymentComponent) {
  }

  async ngOnInit() {

    // load
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetApplyNocApplicationList();
    await this.GetPaymentMode();
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
            console.log('Deepaklist');
            console.log(this.ApplyNocApplicationList);
            console.log('Deepaklist');
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
          console.log("rsihi")
          console.log(data)

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
          console.log("rsihi")
          console.log(data)

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

  async MakePaymentEGrass_click(item: any) {
    try {
      this.loaderService.requestStarted();
      debugger;
      // payment request
      this.nocPaymentComponent.request.ApplyNocApplicationID = item.ApplyNocApplicationID;
      this.nocPaymentComponent.request.AMOUNT = item.TotalFeeAmount;
      this.nocPaymentComponent.request.USEREMAIL = item.CollegeEmail;
      this.nocPaymentComponent.request.USERNAME = item.CollegeName.substring(0, 49).replace(/[^a-zA-Z ]/g, "");
      this.nocPaymentComponent.request.USERMOBILE = item.CollegeMobileNo;
      this.nocPaymentComponent.request.PURPOSE = "Noc Payment";
      this.nocPaymentComponent.request.DepartmentID = item.DepartmentID;
      this.nocPaymentComponent.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.nocPaymentComponent.request.SSOID = this.sSOLoginDataModel.SSOID;
      this.nocPaymentComponent.request.City = this.sSOLoginDataModel.SSOID;


      this.nocPaymentComponent.request.RemitterName = item.CollegeName;
      this.nocPaymentComponent.request.REGTINNO = item.CollegeRegistrationNo;
      this.nocPaymentComponent.request.DistrictCode = item.DistrictCode;
      this.nocPaymentComponent.request.Adrees = item.FullAddress;
      this.nocPaymentComponent.request.City = item.City;
      this.nocPaymentComponent.request.Pincode = item.Pincode;


      // post
      await this.nocPaymentComponent.PaymentRequest_Egrass()

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

  async MakePayment_click(item: any) {
    try {
      this.loaderService.requestStarted();
      debugger;
      // payment request
      this.nocPaymentComponent.request.ApplyNocApplicationID = item.ApplyNocApplicationID;
      this.nocPaymentComponent.request.AMOUNT = item.TotalFeeAmount;
      this.nocPaymentComponent.request.USEREMAIL = item.CollegeEmail;
      this.nocPaymentComponent.request.USERNAME = item.CollegeName.substring(0, 49).replace(/[^a-zA-Z ]/g, "");
      this.nocPaymentComponent.request.USERMOBILE = item.CollegeMobileNo;
      this.nocPaymentComponent.request.PURPOSE = "Noc Payment";
      this.nocPaymentComponent.request.DepartmentID = item.DepartmentID;
      this.nocPaymentComponent.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.nocPaymentComponent.request.SSOID = this.sSOLoginDataModel.SSOID;
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
  async CheckStatus_click(item: any) {
    try {
      this.loaderService.requestStarted();
      //debugger
      // payment request
      this.nocPaymentComponent.transactionStatusRequest.ApplyNocApplicationID = item.ApplyNocApplicationID;
      this.nocPaymentComponent.transactionStatusRequest.AMOUNT = item.Amount;
      this.nocPaymentComponent.transactionStatusRequest.PRN = item.PRNNO;
      this.nocPaymentComponent.transactionStatusRequest.DepartmentID = item.DepartmentID;
      this.nocPaymentComponent.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.nocPaymentComponent.request.SSOID = this.sSOLoginDataModel.SSOID;
      // post
      await this.nocPaymentComponent.GetTransactionStatus();
      this.GetRPPPaymentHistory(item.ApplyNocApplicationID);
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
      this.nocPaymentComponent.emitraRequest.UserName = item.CollegeName.substring(0, 49).replace(/[^a-zA-Z ]/g, "");
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
    
    this.SelectedApplyNocApplicationID = item.ApplyNocApplicationID;
    this.SelectedMobileNo = item.CollegeMobileNo;
    await this.OpenOTPModel();
    // success is in verifyotp()
  }


  async MakeGrassPayment_click(item: any) {
    try {
      this.loaderService.requestStarted();
      debugger;
      // payment request
      this.nocPaymentComponent.request.ApplyNocApplicationID = item.ApplyNocApplicationID;
      this.nocPaymentComponent.request.AMOUNT = item.TotalFeeAmount;
      this.nocPaymentComponent.request.USEREMAIL = item.CollegeEmail;
      this.nocPaymentComponent.request.USERNAME = item.CollegeName.substring(0, 49).replace(/[^a-zA-Z ]/g, "");
      this.nocPaymentComponent.request.USERMOBILE = item.CollegeMobileNo;
      this.nocPaymentComponent.request.PURPOSE = "Noc Payment";
      this.nocPaymentComponent.request.DepartmentID = item.DepartmentID;
      this.nocPaymentComponent.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.nocPaymentComponent.request.SSOID = this.sSOLoginDataModel.SSOID;
      // post
      await this.nocPaymentComponent.EgrassPaymentRequest()

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

  async GetRPPPaymentHistory(applyNocApplicationID: number) {
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

  async GetApplicationTrail(content: any, ApplyNOCID: number) {
    this.ApplicationTrailList = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetApplicationTrail_DepartmentApplicationWise(ApplyNOCID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationTrailList = data['Data'];
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

  async GetApplicationSummary(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))], { skipLocationChange: true });
  }

  async onFilechangeItem(event: any) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type === 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          if (this.file.size < 100000) {
            this.toastr.error('Select more then 100kb File')
            return
          }
        }
        else {// type validation
          this.toastr.error('Select Only pdf file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.fileUploadService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.request.Dis_FileName = data['Data'][0]["Dis_FileName"];
              this.request.FileName = data['Data'][0]["FileName"];
              this.request.FilePath = data['Data'][0]["FilePath"];
              event.target.value = null;
            }
            if (this.State == 1) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
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

  async DeleteImageItem(FileName: any) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.fileUploadService.DeleteDocument(FileName).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.request.FileName = '';
          this.request.FilePath = '';
          this.request.Dis_FileName = '';
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
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


  public ApplicationFinalSubmit: boolean = false;
  async OpenOfflinePaymentActionPopUP(content: any, item: any,) {
    this.ResetOfflinepaymentdetails();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.ApplicationFinalSubmit = false;
    this.request.ApplyNOCID = item.ApplyNocApplicationID;
    this.request.CollegeID = item.CollegeID;
    this.request.DepartmentID = item.DepartmentID;
    this.ApplicationFinalSubmit = item.IsFinalSubmit;
    if (this.request.DepartmentID == 4 || this.request.DepartmentID == 3) {
      await this.GetPaymentMode();
      this.lstPaymentMode = this.lstPaymentMode.filter((x: { Name: string; }) => x.Name == 'Demand Draft');
    }
    else {
      await this.GetPaymentMode();
    }
    this.GetOfflinePaymentDetails(this.request.ApplyNOCID, 0, 'GetOfflinePaymentDetails');

  }

  async AddOfflineFeeData() {

    this.isSubmitted = true;
    let isValid = true;
    if ((this.request.Amount <= 0) || (this.request.Amount == 0)) {
      isValid = false;
    }
    if ((this.request.BankName == '') || (this.request.BankName == null)) {
      isValid = false;
    }
    if ((this.request.PaymentMode == '0') || (this.request.PaymentMode == null)) {
      isValid = false;
    }
    if ((this.request.DateofIssuance == '') || (this.request.DateofIssuance == null)) {
      isValid = false;
    }
    if (this.request.DepartmentID != 4 && this.request.DepartmentID != 3) {
      if ((this.request.DateofExpiry == '') || (this.request.DateofExpiry == null)) {
        isValid = false;
      }
    }
    if ((this.request.FileName == '') || (this.request.FileName == null)) {
      isValid = false;
    }
    // check all
    if (!isValid) {
      return;
    }

    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.applyNocParameterService.SaveOfflinePaymnetDetail(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.GetOfflinePaymentDetails(this.request.ApplyNOCID, 0, 'GetOfflinePaymentDetails');
            this.ResetOfflinepaymentdetails();
            this.GetApplyNocApplicationList();
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
        this.isLoading = false;

      }, 200);
    }

  }
  async GetPaymentMode() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetPaymentMode()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.lstPaymentMode = data['Data'][0]['data'];
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

  async ResetOfflinepaymentdetails() {
    this.request.ID = 0;
    this.request.BankName = '';
    this.request.DateofExpiry = '';
    this.request.DateofIssuance = '';
    this.request.Amount = 0;
    this.request.PaymentMode = '0';
    this.request.FileName = '';
    this.request.FilePath = '';
    this.request.Dis_FileName = '';
    this.isSubmitted = false;
    this.file = document.getElementById('fileTransactionReceptDocument');
    this.file.value = '';
    this.AddUpdatetext = 'Add';
  }

  async GetOfflinePaymentDetails(ApplyNocID: number, PaymentOfflineID: number, ActionName: string) {
    try {
      this.loaderService.requestStarted();
      await this.applyNocParameterService.GetOfflinePaymentDetails(ApplyNocID, PaymentOfflineID, ActionName)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.lstOfflinePaymentDetails = data['Data'][0]['data'];
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

  async EditOffLinePaymentDetails(item: any) {
    try {
      this.loaderService.requestStarted();
      this.request.ID = item.PaymentOfflineID;
      this.request.ApplyNOCID = item.ApplyNOCID;
      this.request.PaymentMode = item.PaymentMode;
      this.request.DepartmentID = item.DepartmentID;
      this.request.BankName = item.BankName;
      this.request.DateofExpiry = item.DateofExpiry;
      this.request.DateofIssuance = item.DateofIssuance;
      this.request.Amount = item.Amount;
      this.request.FileName = item.FileName;
      this.request.FilePath = item.FilePath;
      this.request.Dis_FileName = item.Dis_FileName;
      this.AddUpdatetext = 'Update';
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

  async DeleteOffLinePaymentDetails(ApplyNocID: number, PaymentOfflineID: number) {
    try {
      this.loaderService.requestStarted();
      await this.applyNocParameterService.GetOfflinePaymentDetails(ApplyNocID, PaymentOfflineID, "DeleteOfflinePayment")
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            data = JSON.parse(JSON.stringify(data));
            this.GetOfflinePaymentDetails(ApplyNocID, 0, 'GetOfflinePaymentDetails');
          }
          else {
            this.toastr.success(this.ErrorMessage);
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
}
