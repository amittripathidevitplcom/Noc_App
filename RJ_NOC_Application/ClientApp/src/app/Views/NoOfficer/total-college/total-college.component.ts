import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RequestDetails } from '../../../Models/PaymentDataModel';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service';

@Component({
  selector: 'app-total-college',
  templateUrl: './total-college.component.html',
  styleUrls: ['./total-college.component.css']
})
export class TotalCollegeComponent implements OnInit {

  constructor(private draftApplicationListService: DraftApplicationListService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private collegeService: CollegeService, private sSOLoginService: SSOLoginService, private modalService: NgbModal, private nocpaymentService: NocpaymentService) {

  }

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;

  public UserID: number = 0;
  public draftApplicatoinListData: any = [];
  public collegeListData: any = [];
  public collegeContactDetailsList: any = [];
  public collegeNearestGovernmentHospitalsList: any = [];
  public LOIFeeMasterData: any = [];
  public searchText: string = '';
  public SsoValidationMessage: string = '';
  public SsoSuccessMessage: string = '';
  public CollegeName: string = '';
  public TotalLOIFees: string = '0.00';
  public DepartmentID: number = 0;

  // sso ligin
  sSOLoginDataModel = new SSOLoginDataModel();
  request_Payment = new RequestDetails();
  sSOVerifyDataModel = new SSOLoginDataModel();
  public CollegeID: number = 0;
  public ModifyBy: number = 0;
  modalReference!: NgbModalRef;
  closeResult!: string;

  //
  public SSOID: string = '';

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //
    this.ModifyBy = 1;
    // get college list
    await this.GetApplicationList();
  }

  async GetApplicationList() {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.CollegeDetails(this.sSOLoginDataModel.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.draftApplicatoinListData = data['Data'][0]['data'];
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

  async DeleteData(row: any) {

    if (confirm("Are you sure you want to delete this ?")) {

      //Show Loading
      this.loaderService.requestStarted();
      this.isLoading = true;

      try {
        await this.collegeService.DeleteData(row.CollegeID, this.ModifyBy)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];

            //console.log(this.request.RuralUrban);

            if (!this.State) {
              this.toastr.success(this.SuccessMessage)
              // data
              const index: number = this.draftApplicatoinListData.indexOf(row);
              if (index != -1) {
                this.draftApplicatoinListData.splice(index, 1)
              }
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
  }

  async CheckMappingSSOID() {
    try {
      this.loaderService.requestStarted();
      await this.sSOLoginService.CheckMappingSSOID(this.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.sSOVerifyDataModel = data['Data'];
          //console.log(this.draftApplicatoinListData);
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

  async VerifySSOID() {
    //Show Loading
    this.isLoading = true;

    let isValid = true;
    if (!await this.CustomValidate()) {
      isValid = false;
    }

    // check
    if (!isValid) {
      return;
    }
    // verify ssoid
    await this.CheckMappingSSOID();
    if (this.sSOVerifyDataModel != null && this.SSOID.toLowerCase() == this.sSOVerifyDataModel.SSOID.toLowerCase()) {
      this.SsoValidationMessage = '';
      this.SsoSuccessMessage = 'SSO Id Verified Successfully';
    }
    else {
      this.SsoValidationMessage = 'SSO Id Invalid !';
    }

  }

  async CustomValidate() {
    let isValid = true;
    if (this.SSOID == null || this.SSOID == undefined || this.SSOID == '') {
      isValid = false;
      this.SsoValidationMessage = 'This field is required .!';
    }
    else {
      this.SsoValidationMessage = '';
    }
    if (this.SsoValidationMessage != '') {
      isValid = false;
    }

    return isValid;
  }

  async MapSSOIDInCollege() {
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.collegeService.MapSSOIDInCollege(this.CollegeID, this.ModifyBy, this.SSOID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          //console.log(this.request.RuralUrban);

          if (!this.State) {
            this.toastr.success(this.SuccessMessage);
            // close model
            document.getElementById("SSOIDMapping_Close")?.click();
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

  async OpenSSOIDMaping(row: any) {
    await this.ResetSSOIDVerify();
    this.CollegeID = row.CollegeID;
  }

  async ResetSSOIDVerify() {
    this.SsoValidationMessage = '';
    this.SsoSuccessMessage = '';
    this.SSOID = '';
    this.sSOVerifyDataModel = new SSOLoginDataModel();
  }

  async DraftEdit_OnClick(CollegeID: number) {
    this.routers.navigate(['/addcollege' + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }


  public DTECollegeLevel: any = [];
  async ViewTotalCollegeDataByID(CollegeID: any) {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.ViewTotalCollegeDataByID(CollegeID, this.UserID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.collegeListData = data['Data'][0]['data']['Table'][0];
          this.collegeContactDetailsList = data['Data'][0]['data']['Table1'];
          this.collegeNearestGovernmentHospitalsList = data['Data'][0]['data']['Table2'];
          this.DTECollegeLevel = data['Data'][0]['data']['Table4'];

          //console.log(this.draftApplicatoinListData);
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
  async ApplyLOI_OnClick(DepartmentID: number, CollegeID: number) {
    /*this.routers.navigate(['/applicationdetailentry' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))], { skipLocationChange: true });*/

    this.routers.navigate(['/LOIapplyentry' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }
  async EditCollegeData(CollegeID: number) {
    /* this.routers.navigate(['/addcollege' + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))], { skipLocationChange: true });*/

    this.routers.navigate(['/addcollege' + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);

  }

  async ApplicationSummary_OnClick(DepartmentID: number, CollegeID: number) {

    window.open('/LOIapplicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())), '_blank')

    /* this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);*/
  }


  async PaymentApplyNocApplication_click(content: any, CollegeID: number, DepartmentID: number, CollegeName: string) {
    try {
      this.TotalLOIFees = "0.00";
      this.CollegeName = CollegeName;
      this.CollegeID = CollegeID;
      this.loaderService.requestStarted();
      // get
      await this.commonMasterService.Get_LOIFeeMaster(DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          console.log(data);
          if (this.State == 0) {
            this.LOIFeeMasterData = data['Data'][0];
            for (var i = 0; i < this.LOIFeeMasterData.length; i++) {
              this.TotalLOIFees = (Number(this.TotalLOIFees) + Number(this.LOIFeeMasterData[i].Amount)).toFixed(2);
            }
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

  async MakePayment_click() {
    try {
      this.loaderService.requestStarted();
      // payment request

      await this.commonMasterService.GetCollegeBasicDetails(this.CollegeID.toString())
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeName = data['Data'][0]['data'][0]['CollegeNameEn'];
          this.request_Payment.ApplyNocApplicationID = this.CollegeID;
          this.request_Payment.AMOUNT = Number(this.TotalLOIFees);
          this.request_Payment.USEREMAIL = data['Data'][0]['data'][0].Email;
          this.request_Payment.USERNAME = this.CollegeName.substring(0, 49).replace(/[^a-zA-Z ]/g, "");
          this.request_Payment.USERMOBILE = data['Data'][0]['data'][0].MobileNumber;
          this.request_Payment.PURPOSE = "LOI Payment";
          this.request_Payment.DepartmentID = data['Data'][0]['data'][0].DepartmentID;
          this.request_Payment.CreatedBy = this.sSOLoginDataModel.UserID;
          this.request_Payment.SSOID = this.sSOLoginDataModel.SSOID;

          // post
          await this.nocpaymentService.PaymentRequest(this.request_Payment)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              //console.log(data.Data.MERCHANTCODE);
              console.log(this.State);
              if (!this.State) {
                this.RedirectPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA, data.Data.PaymentRequestURL)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            });
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
  RedirectPaymentRequest(pMERCHANTCODE: any, pENCDATA: any, pRequestURl: any) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", pRequestURl); //GlobalConstants.RPPRequstURL
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


  ////////////////LOI Final Save
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

  async FinalSubmitApplyNocApplication_click(item: any) {

    this.SelectedApplyNocApplicationID = item.CollegeID;
    this.SelectedMobileNo = item.CollegeMobileNumber;
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

        await this.draftApplicationListService.LOIFinalSubmit_OTPVerification(this.SelectedApplyNocApplicationID)
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
              await this.GetApplicationList();
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
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
