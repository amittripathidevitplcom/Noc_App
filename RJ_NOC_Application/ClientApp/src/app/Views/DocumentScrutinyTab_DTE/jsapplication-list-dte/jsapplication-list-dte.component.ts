import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DTEDocumentScrutinyService } from '../../../Services/DTEDocumentScrutiny/dtedocument-scrutiny.service';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';

@Component({
  selector: 'app-jsapplication-list-dte',
  templateUrl: './jsapplication-list-dte.component.html',
  styleUrls: ['./jsapplication-list-dte.component.css']
})
export class JSApplicationListDTEComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplicationDetails: any[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public ApplicationNo: string = '';

  sSOVerifyDataModel = new SSOLoginDataModel();

  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';

  AadhaarNo: string = '';

  public isLoading: boolean = false;
  public QueryStringStatus: any = '';
  constructor(private loaderService: LoaderService, private toastr: ToastrService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private dteDocumentScrutinyService: DTEDocumentScrutinyService, private modalService: NgbModal, private aadharServiceDetails: AadharServiceDetails
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.AadhaarNo = this.sSOLoginDataModel.AadhaarId;
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
  }

  async GetApplicationList(RoleId: number, UserID: number, Status: string) {
    try {
      let ActionName = '';
      ActionName = Status == 'Completed' ? 'Release NOC' : Status == 'Pending' ? 'Forward To Joint Secretary': '';
      this.loaderService.requestStarted();
      await this.dteDocumentScrutinyService.GetApplyNOCApplicationList(RoleId, UserID, Status, ActionName)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationDetails = data['Data'][0];
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


  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public ApplicationTrailList: any = [];
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
          debugger;
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  async ApplicationSummary_OnClick(DepartmentID: number, CollegeID: number) {
    window.open('/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())), '_blank')
  }





  public SelectedApplyNOCID: number = 0;
  public SelectedDepartmentID: number = 0;


  async OpenGeneratePDFPopUP(content: any, ApplyNOCID: number, DepartmentID: number) {
    debugger;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  public NOCIssuedRemark: string = '';
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  public isSubmitted: boolean = false;
  public IsNOCIssued: number = 0;
  async GeneratePDF_OnClick() {
    try {
      this.isSubmitted = true;

      if (this.NOCIssuedRemark == '') {
        this.isRemarkValid = true;
        this.isFormvalid = false;
      }
      if (this.IsNOCIssued <= 0) {
        this.isFormvalid = false;
      }
      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      await this.dteDocumentScrutinyService.GeneratePDF_DTENOC(this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID, this.NOCIssuedRemark, this.IsNOCIssued)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage);
            this.modalService.dismissAll('After Success');
            window.location.reload();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
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



  //Esign

  //OTP Variable
  AadharRequest = new AadharServiceDataModel();
  public TransactionNo: string = '';
  public UserOTP: string = '';
  public CustomOTP: string = '123456';// bypass otp
  public isUserOTP: boolean = false;
  public isValidUserOTP: boolean = false;
  public ShowTimer: boolean = false;
  public isTimerDisabled: boolean = false;
  public StartTimer: any;
  public DisplayTimer: string = '';
  public selectedFileName: string = '';
  async SendEsignOTP(FileName: string, LOIID: number) {
    this.selectedFileName = '';
    this.UserOTP = '';
    try {
      this.loaderService.requestStarted();
      debugger;
      if (this.AadhaarNo != undefined) {
        if (this.AadhaarNo.length > 12) {
          this.AadharRequest.AadharID = this.AadhaarNo;
          await this.aadharServiceDetails.GetAadharByVID(this.AadharRequest)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data[0].status == "0") {
                this.AadhaarNo = data[0].data;
              }
              else {
                this.AadhaarNo = '';
              }
            }, error => console.error(error));
        }
        if (this.AadhaarNo.length == 12) {
          this.AadharRequest.AadharNo = this.AadhaarNo;
          this.AadharRequest.TransactionNo = '';
          await this.aadharServiceDetails.SendOtpByAadharNo_Esign(this.AadharRequest)
            .then((data: any) => {
              if (data[0].status == "0") {
                this.TransactionNo = data[0].data;
                this.modalService.dismissAll('After Success');
                const display = document.getElementById('ModalOtpVerify')
                if (display) display.style.display = "block";
                this.toastr.success("OTP send Successfully");
                this.selectedFileName = FileName;
                this.SelectedApplyNOCID = LOIID;
                this.timer(1);
              }
              else {
                if (data[0].status == "1" && data[0].message == "Server IP address is not whiteListed") {
                  this.toastr.warning("Server IP address is not whiteListed");
                }
                else {
                  this.toastr.warning(data[0].message);
                }

              }
            }, error => console.error(error));
        }
        else {
          this.toastr.warning("Aadhaar No. is not correct.please contact to admin department.");
          return;
        }
      }
      else {
        this.toastr.warning("Aadhaar number is not registered in the SSO you are using. Please update your Aadhaar number in your SSO and then login.");
        return;
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
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  CloseOTPModel() {
    const display = document.getElementById('ModalOtpVerify');
    if (display) display.style.display = 'none';
    this.SelectedApplyNOCID = 0;
    this.UserOTP = '';
    this.TransactionNo = '';
    this.isUserOTP = false;
    this.isValidUserOTP = false;
  }

  async ResendOTP() {
    try {
      this.loaderService.requestStarted();
      if (this.AadhaarNo != undefined) {
        if (this.AadhaarNo.length > 12) {
          this.AadharRequest.AadharID = this.AadhaarNo;
          await this.aadharServiceDetails.GetAadharByVID(this.AadharRequest)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data[0].status == "0") {
                this.AadhaarNo = data[0].data;
              }
              else {
                this.AadhaarNo = '';
              }
            }, error => console.error(error));
        }
        console.log(this.AadhaarNo);
        if (this.AadhaarNo.length == 12) {
          this.AadharRequest.AadharNo = this.AadhaarNo;
          this.AadharRequest.TransactionNo = '';
          await this.aadharServiceDetails.SendOtpByAadharNo_Esign(this.AadharRequest)
            .then((data: any) => {
              if (data[0].status == "0") {
                this.TransactionNo = data[0].data;
                this.modalService.dismissAll('After Success');
                const display = document.getElementById('ModalOtpVerify')
                if (display) display.style.display = "block";
                this.toastr.success("OTP send Successfully");
                this.timer(1);
              }
              else {
                if (data[0].status == "1" && data[0].message == "Server IP address is not whiteListed") {
                  this.toastr.warning("Server IP address is not whiteListed");
                }
                else {
                  this.toastr.warning(data[0].message);
                }

              }
            }, error => console.error(error));
        }
        else {
          this.toastr.warning("Aadhaar No. is not correct.please contact to admin department.");
          return;
        }
      }
      else {
        this.toastr.warning("Aadhaar number is not registered in the SSO you are using. Please update your Aadhaar number in your SSO and then login.");
        return;
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

  async VerifyOTP() {
    try {
      this.isUserOTP = false;
      this.isValidUserOTP = false;
      this.loaderService.requestStarted();
      if (this.UserOTP != undefined && this.UserOTP != null) {
        if (this.UserOTP.length == 6 && this.UserOTP != '0') {
          this.AadharRequest.AadharNo = this.AadhaarNo;
          this.AadharRequest.OTP = this.UserOTP;
          this.AadharRequest.TransactionNo = this.TransactionNo;
          await this.aadharServiceDetails.ValidateAadharOTP_Esign(this.AadharRequest)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data[0].status == "0") {
                await this.EsignPDF();
              }
              else {
                if (this.UserOTP == this.CustomOTP) {
                  await this.EsignPDF();
                }
                else {
                  this.toastr.success("Invalid OTP!");
                  this.isValidUserOTP = true;
                  return;
                }
              }
            }, error => console.error(error));
        }
        else {
          this.isValidUserOTP = true;
          return;
        }
      }
      else {
        this.isUserOTP = true;
        return;
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
  async EsignPDF() {
    try {
      this.loaderService.requestStarted();
      if (this.selectedFileName != undefined && this.selectedFileName != null) {
        await this.aadharServiceDetails.eSignPDF(this.selectedFileName, this.TransactionNo, this.sSOLoginDataModel.DepartmentID, 0)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data[0].status == "0") {
              await this.EsignPDFUpdate();
            }
            else {
              if (this.UserOTP == this.CustomOTP) {
                await this.EsignPDFUpdate();
              }
              else {
                this.toastr.warning(data[0].message);
              }
            }
          }, error => console.error(error));
      }
      else {
        this.toastr.warning("File Name is null.please try again.");
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


  async EsignPDFUpdate() {
    this.loaderService.requestStarted();
    try {
      await this.dteDocumentScrutinyService.PdfEsign(this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID)
        .then(async (data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
            }
            else {
              this.toastr.warning(data[0].message);
            }
            await this.CloseOTPModel();
            this.modalService.dismissAll('After Success');
            await this.GetApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
          }
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }
  }
}

