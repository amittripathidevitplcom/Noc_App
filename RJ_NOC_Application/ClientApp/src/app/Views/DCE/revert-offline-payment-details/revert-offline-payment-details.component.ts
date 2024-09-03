import { Component } from '@angular/core';
import { ApplyNocOfflinePaymentModal } from '../../../Models/ApplyNocParameterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NocPaymentComponent } from '../../noc-payment/payment-request/noc-payment.component';
import { ASTWithName } from '@angular/compiler';

@Component({
  selector: 'app-revert-offline-payment-details',
  templateUrl: './revert-offline-payment-details.component.html',
  styleUrls: ['./revert-offline-payment-details.component.css']
})
export class RevertOfflinePaymentDetailsComponent {
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
  public ApplicationFee: string = '0';
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SearchRecordID: string = '';
  public QueryStringStatus: any = '';
  public SelectedApplyNOCID: number = 0;

  constructor(private fileUploadService: FileUploadService, private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private nocPaymentComponent: NocPaymentComponent) {
  }

  async ngOnInit() {

    // load
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.CollegeID = data['Data']['CollegeID'];
          this.SelectedCollageID = data['Data']['CollegeID'];
          if (this.request.CollegeID == null || this.request.CollegeID == 0 || this.request.CollegeID == undefined) {
            this.routers.navigate(['/draftapplicationlist']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }

    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    debugger;
    await this.GetPaymentMode();
    await this.GetOfflinePaymentDetails(this.SelectedApplyNOCID, 0, 'GetOfflinePaymentDetails');
  }

  async AddOfflineFeeData() {
    this.request.DepartmentID = this.SelectedDepartmentID;
    this.request.ApplyNOCID = this.SelectedApplyNOCID;
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
           await this.GetOfflinePaymentDetails(this.request.ApplyNOCID, 0, 'GetOfflinePaymentDetails');
            this.ResetOfflinepaymentdetails();
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

}
