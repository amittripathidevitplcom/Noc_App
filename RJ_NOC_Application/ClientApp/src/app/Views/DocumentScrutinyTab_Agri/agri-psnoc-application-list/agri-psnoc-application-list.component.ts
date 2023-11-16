import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyNOCApplicationDataModel, CommiteeInspection_RNCCheckList_DataModel } from '../../../Models/ApplyNOCApplicationDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { AgricultureDocumentScrutinyService } from '../../../Services/AgricultureDocumentScrutiny/agriculture-document-scrutiny.service';
import { EnumApplicationStatus, EnumCommitteActionType, EnumDepartment } from '../../../Common/enum-noc';

@Component({
  selector: 'app-agri-psnoc-application-list',
  templateUrl: './agri-psnoc-application-list.component.html',
  styleUrls: ['./agri-psnoc-application-list.component.css']
})
export class AgriPSNocApplicationListComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public RoleID: number = 0;
  public UserID: number = 0;
  public ActionID: any = 0;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public selectedFileName: string = '';
  public selectedApplyNOCID: number = 0;
  public selectedCollegeID: number = 0;
  public QueryStringStatus: any = '';
  public IsDisabled: boolean = true;
  public IsPreDisabled: boolean = true;
  public IsBtnShowHide: boolean = true;
  public isRemarkValid: boolean = false;
  public FinalRemark: string = '';
  public ApplicationNO: string = '';
  public NOCFilePath: string = '';
  public btntext: string = 'Approved';
  public IsWTCShowHide: boolean = true;
  public ActionType: string = '';

  public ApplicationTrailList: any = [];
  public ApplyNocDetails: any = [];
  public lstNOCCourse: any = [];

  //OTP Variable
  AadharRequest = new AadharServiceDataModel();
  public AadhaarNo: string = '';
  public TransactionNo: string = '';
  public UserOTP: string = '';
  public CustomOTP: string = '123456';// bypass otp
  public isUserOTP: boolean = false;
  public isValidUserOTP: boolean = false;
  public ShowTimer: boolean = false;
  public isTimerDisabled: boolean = false;
  public StartTimer: any;
  public DisplayTimer: string = '';

  constructor(private agricultureDocumentScrutinyService: AgricultureDocumentScrutinyService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private committeeMasterService: CommitteeMasterService,
    private aadharServiceDetails: AadharServiceDetails
  ) { }

  async ngOnInit() {

    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.AadhaarNo = this.sSOLoginDataModel.AadhaarId
    await this.GetFinalNOCApplicationList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);

    if (this.QueryStringStatus == EnumApplicationStatus.Pending.toString()) {
      this.IsPreDisabled = false;
      this.IsBtnShowHide = true;
      this.IsWTCShowHide = true;
      this.ActionID = 0;
    }
    else if (this.QueryStringStatus == EnumApplicationStatus.ForwardToCommissioner.toString()) {
      this.IsPreDisabled = true;
      this.IsBtnShowHide = false;
      this.IsWTCShowHide = false;
      this.ActionID = 3;
    }
    else if (this.QueryStringStatus == EnumApplicationStatus.Completed.toString()) {
      this.IsPreDisabled = true;
      this.IsBtnShowHide = false;
      this.IsWTCShowHide = true;
      this.ActionID = 1;
    }
    else if (this.QueryStringStatus == EnumApplicationStatus.Rejected.toString()) {
      this.IsPreDisabled = true;
      this.IsBtnShowHide = false;
      this.IsWTCShowHide = true;
      this.ActionID = 2;
    }
  }

  async GetFinalNOCApplicationList(SSOID: string, UserID: number, RoleID: number, DepartmentID: number, QueryStringStatus: string) {
    try {
      this.loaderService.requestStarted();
      await this.agricultureDocumentScrutinyService.GetFinalNOCApplicationList(SSOID, UserID, RoleID, DepartmentID, QueryStringStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyNocDetails = data['Data'][0]['data'];
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async NOCApproved_Rejected_Model(content: any, ApplyNOCID: number, CollegeID: number, ApplicationNo: string, type: string, fileName: string) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.selectedApplyNOCID = ApplyNOCID;
    this.selectedCollegeID = CollegeID;
    this.ApplicationNO = ApplicationNo;
    this.GetApplyNocCourse(this.selectedApplyNOCID);
    this.btntext = type;
    this.selectedFileName = fileName;
  }

  async GetApplyNocCourse(ApplyNOCID: number) {
    this.loaderService.requestStarted();
    try {
      await this.agricultureDocumentScrutinyService.GetNOCCourse('GetNOCCourse', this.sSOLoginDataModel.DepartmentID, ApplyNOCID, this.selectedCollegeID)
        .then((data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.lstNOCCourse = data['Data'][0]["data"];
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

  async FinalNOCRejectRelese(ActionType: string) {
    this.loaderService.requestStarted();
    try {
      await this.agricultureDocumentScrutinyService.FinalNOCRejectRelese(this.selectedApplyNOCID, EnumDepartment.Agriculture, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.FinalRemark, ActionType)
        .then(async (data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.toastr.success(this.SuccessMessage);
            await this.CloseOTPModel();
            this.modalService.dismissAll('After Success');
            await this.GetFinalNOCApplicationList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);
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

  async ForwardToCommissioner(ApplyNOCID: number) {
    this.loaderService.requestStarted();
    try {
      this.FinalRemark = "Forward To Commissioner By Principal Secretary";

      await this.agricultureDocumentScrutinyService.FinalNOCRejectRelese(ApplyNOCID, this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.FinalRemark, EnumApplicationStatus.ForwardToCommissioner.toString())
        .then((data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.toastr.success(this.SuccessMessage);
            this.modalService.dismissAll('After Success');
            this.GetFinalNOCApplicationList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);
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

  async GenratePDF(ApplyNOCID: number, CollegeID: number) {
    this.loaderService.requestStarted();
    try {
      await this.agricultureDocumentScrutinyService.UpdateNOCPDFData('SaveData', this.sSOLoginDataModel.DepartmentID, ApplyNOCID, CollegeID, this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID)
        .then((data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.toastr.success(this.SuccessMessage);
            this.GetFinalNOCApplicationList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);
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

  async DeleteImage(Type: string) {
    try {
      this.loaderService.requestStarted();
      if (Type == 'NOCFilePath') {
        this.NOCFilePath = '';
      }
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

  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string, Status: string) {
    window.open('/Previewbynodalofficer' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())), "_blank");
  }

  /* Start E-sign OTP Verification*/
  async OpenOTPModel() {
    this.isRemarkValid = false;
    if (this.FinalRemark == '') {
      this.isRemarkValid = true;
      return;
    }
    else {
      if (this.btntext == 'Approved') {
        this.ActionType = EnumApplicationStatus.ReleaseNOC.toString();
        this.UserOTP = '';
        this.AadharRequest = new AadharServiceDataModel();
        this.CustomOTP = '123456';
        await this.SendOTP();
      }

      else {
        this.ActionType = EnumApplicationStatus.RejectNOC.toString();
        await this.FinalNOCRejectRelese(this.ActionType);
      }
    }
  }

  CloseOTPModel() {
    const display = document.getElementById('ModalOtpVerify');
    if (display) display.style.display = 'none';
    this.selectedApplyNOCID = 0;
    this.selectedCollegeID = 0;
    this.selectedFileName = '';
    this.ApplicationNO == '';
    this.UserOTP == '';
    this.TransactionNo == '';
    this.isUserOTP == false;
    this.isValidUserOTP == false;
    this.isValidUserOTP == false;
  }

  async SendOTP() {
    try {
      this.loaderService.requestStarted();
      if (this.AadhaarNo != undefined) {
        if (this.AadhaarNo.length > 12) {
          this.AadharRequest.AadharNo = this.AadhaarNo;
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

  async ResendOTP() {
    try {
      this.AadharRequest = new AadharServiceDataModel();
      this.loaderService.requestStarted();
      if (this.AadhaarNo != undefined && this.AadhaarNo.length == 12) {
        this.AadharRequest.AadharNo = this.AadhaarNo;
        this.TransactionNo = '';
        await this.aadharServiceDetails.SendOtpByAadharNo_Esign(this.AadharRequest)
          .then((data: any) => {
            if (data[0].status == "0") {
              this.TransactionNo = data[0].data;
              this.toastr.success("OTP Resend Successfully");
            }
            else {
              if (data[0].status == "1" && data[0].message == "Server IP address is not whiteListed") {
                this.toastr.warning("Server IP address is not whiteListed");
                return;
              }
            }
          }, error => console.error(error));
      }
      else {
        this.toastr.warning("Aadhaar No. is null.please login again.");
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
        await this.aadharServiceDetails.eSignPDF(this.selectedFileName, this.TransactionNo)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data[0].status == "0") {
              await this.FinalNOCRejectRelese(this.ActionType);
              //this.toastr.success(data[0].message);
            }
            else {
              if (this.UserOTP == this.CustomOTP) {
                await this.FinalNOCRejectRelese(this.ActionType);
                //this.toastr.success(data[0].message);
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
  /* end E-sign OTP Verification*/
}
