import { Component, Injectable } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ApplyNocParameterDetailsComponent } from '../../Master/apply-noc-parameter-details/apply-noc-parameter-details.component';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApplyNocOfflinePaymentModal } from '../../../Models/ApplyNocParameterDataModel';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';


@Component({
  selector: 'app-penalty-application-list-dce',
  templateUrl: './penalty-application-list-dce.component.html',
  styleUrls: ['./penalty-application-list-dce.component.css']
})
export class PenaltyApplicationListDCEComponent {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public PenaltyApplicationList: any = [];
  searchText: string = '';
  constructor(private fileUploadService: FileUploadService,private applyNocParameterService: ApplyNocParameterService,private applyNOCApplicationService: ApplyNOCApplicationService, private toastr: ToastrService, private loaderService: LoaderService, private modalService: NgbModal,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private applyNocParameterDetailsComponent: ApplyNocParameterDetailsComponent) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetData();
  }

  async GetData() {
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.applyNOCApplicationService.GetApplicationPenaltyList(this.sSOLoginDataModel.SSOID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (this.State == 0) {
            this.PenaltyApplicationList = data['Data'][0]['data'];
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

  public request: ApplyNocOfflinePaymentModal = new ApplyNocOfflinePaymentModal();
  // model popup
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public ApplicationFee: string = '0';
  async OpenOfflinePaymentActionPopUP(content: any, item: any,) {
    this.ResetOfflinepaymentdetails();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.request.ApplyNOCID = item.ApplyNOCID;
    this.request.CollegeID = item.CollegeID;
    this.request.DepartmentID = item.DepartmentID;
    this.ApplicationFee = item.PenaltyAmount;
    this.request.PaymentType = 'Penalty';
    await this.GetPaymentMode();
    //if (this.request.DepartmentID == 4 || this.request.DepartmentID == 3) {
    //  await this.GetPaymentMode();
    //  this.lstPaymentMode = this.lstPaymentMode.filter((x: { Name: string; }) => x.Name == 'Demand Draft');
    //}
    //else {
    //  await this.GetPaymentMode();
    //}
    this.GetOfflinePaymentDetails(this.request.ApplyNOCID, 0, 'GetOfflinePaymentDetails');

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
  public isSubmitted: boolean = false;
  public file: any = '';
  public AddUpdatetext: string = 'Add';
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

  public lstPaymentMode: any = [];
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
  public lstOfflinePaymentDetails: any = [];
  async GetOfflinePaymentDetails(ApplyNocID: number, PaymentOfflineID: number, ActionName: string) {
    try {
      this.loaderService.requestStarted();
      await this.applyNocParameterService.GetOfflinePaymentDetails(ApplyNocID, PaymentOfflineID, ActionName)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.lstOfflinePaymentDetails = data['Data'][0]['data'];

          console.log(this.lstOfflinePaymentDetails);
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
    this.request.PaymentType = 'Penalty';
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
            await this.GetData();
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
