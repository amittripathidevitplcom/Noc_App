import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DTEDocumentScrutinyService } from '../../../Services/DTEDocumentScrutiny/dtedocument-scrutiny.service';
import { ApplicationCommitteeMemberdataModel, PostApplicationCommitteeMemberdataModel } from '../../../Models/ApplicationCommitteeMemberdataModel';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';

@Component({
  selector: 'app-generate-receipt-list-dte',
  templateUrl: './generate-receipt-list-dte.component.html',
  styleUrls: ['./generate-receipt-list-dte.component.css']
})
export class GenerateReceiptListDTEComponent implements OnInit {
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

  CommitteeMemberDetails!: FormGroup;
  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)
  constructor(private loaderService: LoaderService, private toastr: ToastrService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private dteDocumentScrutinyService: DTEDocumentScrutinyService, private modalService: NgbModal, private committeeMasterService: CommitteeMasterService,
    private sSOLoginService: SSOLoginService, private aadharServiceDetails: AadharServiceDetails
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.AadhaarNo = this.sSOLoginDataModel.AadhaarId;
    await this.GetApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
    this.CommitteeMemberDetails = this.formBuilder.group(
      {
        txtCMNameOfPerson: ['', Validators.required],
        txtCMMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtSSOID: ['', Validators.required]
      })
  }
  get form_CommitteeMember() { return this.CommitteeMemberDetails.controls; }

  async GetApplicationList(RoleId: number, UserID: number, Status: string) {
    try {
      let ActionName = '';

      ActionName = Status == 'Completed' ? 'Forward' : Status == 'Pending' ? 'Forward to Generate Receipt' : '';

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

  async DocumentScrutiny_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    this.routers.navigate(['/documentscrutinydte' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + this.QueryStringStatus + "/" + 'Step1']);
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

  
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  request_MemberList = new PostApplicationCommitteeMemberdataModel();
  request_CommitteeMemberDataModel = new ApplicationCommitteeMemberdataModel();
  async OpenAsignCommitteePopUP(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    debugger;
    this.ApplicationNo = ApplicationNo;
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.GetApplicationCommitteeList(ApplyNOCID)
  }

  async GetApplicationCommitteeList(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList(ApplyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request_MemberList.ApplicationCommitteeList = data['Data'];
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


  public isSubmitted: boolean = false;
  public isSubmitted_MemberDetails: boolean = false;
  async SaveData() {
    this.isSubmitted = true;

    let isValid = true;
    if (this.form_CommitteeMember.invalid) {
      isValid = false;
      return;
    }
    if (this.request_MemberList.ApplicationCommitteeList.length == 0) {
      this.toastr.error("Please add Member Details");
      isValid = false;
    }
    if (this.request_MemberList.ApplicationCommitteeList.length < 3) {
      this.toastr.error("Please add three Member Details");
      isValid = false;
    }
    let ifPrimaryExits = this.request_MemberList.ApplicationCommitteeList.find(f => f.IsPrimaryMember == true);
    if (ifPrimaryExits?.IsPrimaryMember == undefined) {
      this.toastr.error("Atleast one primary member required");
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    //console.log(this.request_MemberList.ApplicationCommitteeList);
    this.request_MemberList.ApplyNocApplicationID = this.SelectedApplyNOCID;
    this.request_MemberList.UserID = this.sSOLoginDataModel.UserID;
    console.log(this.request_MemberList);
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.committeeMasterService.SaveApplicationCommitteeData(this.request_MemberList)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.modalService.dismissAll('After Success');
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

  async AddMemberDetail() {
    this.isSubmitted_MemberDetails = true;
    if (this.CommitteeMemberDetails.invalid) {
      return
    }
    //rest
    this.AadhaarNo = '';

    var isValidate = this.request_MemberList.ApplicationCommitteeList.find(e => e.SSOID === this.request_CommitteeMemberDataModel.SSOID);
    var isValidateMobile = this.request_MemberList.ApplicationCommitteeList.find(e => e.MobileNumber === this.request_CommitteeMemberDataModel.MobileNumber);
    if (!isValidate && !isValidateMobile) {
      await this.VerifySSOID(this.request_CommitteeMemberDataModel.SSOID);
      if (this.AadhaarNo.length > 0) {
        this.request_MemberList.ApplicationCommitteeList.push({
          CommitteeMemberID: 0,
          ApplyNocApplicationID: this.SelectedApplyNOCID,
          NameOfPerson: this.request_CommitteeMemberDataModel.NameOfPerson,
          MobileNumber: this.request_CommitteeMemberDataModel.MobileNumber,
          SSOID: this.request_CommitteeMemberDataModel.SSOID,
          RoleID: 0,
          IsPrimaryMember: false,
          ActiveStatus: true,
          DeleteStatus: false,
          AadhaarNo: this.AadhaarNo,
        });
        this.request_CommitteeMemberDataModel.NameOfPerson = '';
        this.request_CommitteeMemberDataModel.MobileNumber = '';
        this.request_CommitteeMemberDataModel.SSOID = '';
        this.request_CommitteeMemberDataModel.IsPrimaryMember = false;
        this.isSubmitted_MemberDetails = false;
      }
      else {
        this.toastr.warning('SSOID Invalid')
      }
    }
    else {
      this.toastr.warning(isValidate ? 'This User Alaready Exists' : 'this Mobile Number Exists');
    }
    // reset




  }
  DelMemberDetail(item: any, index: any) {

    //  const index: number = this.request_MemberList.ApplicationCommitteeList.indexOf(item);


    let chkIsPrimary = this.request_MemberList.ApplicationCommitteeList[index].IsPrimaryMember;
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        if (!chkIsPrimary) {
          this.loaderService.requestStarted();
          this.request_MemberList.ApplicationCommitteeList.splice(index, 1)
        }
        else {
          this.toastr.warning("You can't delete primary member")
        }
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }
  async VerifySSOID(SSOID: any) {
    //Show Loading
    debugger;
    //verify ssoid
    await this.CheckMappingSSOID(SSOID);
    if (this.sSOVerifyDataModel != null && SSOID.toLowerCase() == this.sSOVerifyDataModel.SSOID.toLowerCase()) {
      let d = new AadharServiceDataModel();
      d.AadharID = this.sSOVerifyDataModel.AadhaarId;
      await this.GetAadharByVID(d);
      this.SsoValidationMessage = 'd';
      this.SsoSuccessMessage = 'SSO Id Verified Successfully';


    }
    else {
      this.SsoValidationMessage = ''
      this.SsoValidationMessage = 'SSO Id Invalid !';
    }
  }

  async CheckMappingSSOID(ssoid: any) {
    try {
      this.loaderService.requestStarted();
      await this.sSOLoginService.CheckMappingSSOID(ssoid)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.sSOVerifyDataModel = data['Data'];
          console.log(this.sSOVerifyDataModel);
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
  async GetAadharByVID(data: any) {
    await this.aadharServiceDetails.GetAadharByVID(data)
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
  SetPrimaryMember(item: any, index: any) {
    let oldArr = this.request_MemberList.ApplicationCommitteeList;
    let newArr = oldArr.map(obj => ({ ...obj, ['IsPrimaryMember']: false }));
    newArr[index].IsPrimaryMember = true;
    this.request_MemberList.ApplicationCommitteeList = newArr;
  }
  numbersOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[0-9]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }




  async GenerateReceipt(CollegeID: number, DepartmentID: number, ApplyNOCID: number) {
    try {
      this.loaderService.requestStarted();
      await this.dteDocumentScrutinyService.GenerateReceipt(CollegeID, DepartmentID, ApplyNOCID, this.sSOLoginDataModel.UserID, '', false)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.toastr.success(this.SuccessMessage);
          await this.GetApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
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
      await this.dteDocumentScrutinyService.ReceiptPdfEsign(this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID)
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


  async ForwardToDTECommittee(ApplyNOCID: number) {


    try {
      if (confirm("Are you sure you want to forward this application to DTE committee?")) {

        this.loaderService.requestStarted();
        await this.dteDocumentScrutinyService.WorkflowInsertDTE(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, 45, ApplyNOCID, 4, "", 0, 0, 0)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              this.GetApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
            else {
              this.toastr.error(this.ErrorMessage)
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
}

