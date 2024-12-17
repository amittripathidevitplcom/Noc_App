import { Component, OnInit } from '@angular/core';
import { ResponseParameters } from '../../../Models/PaymentDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ToastrService } from 'ngx-toastr';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { DocumentScrutinyComponent } from '../../DCE/document-scrutiny/document-scrutiny.component';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-document-scrutiny-payment-details-dce',
  templateUrl: './document-scrutiny-payment-details-dce.component.html',
  styleUrls: ['./document-scrutiny-payment-details-dce.component.css']
})
export class DocumentScrutinyPaymentDetailsDCEComponent implements OnInit {

  public paymentResponseDataModel: any[] = [];
  public OfflinePaymentDataModel: any[] = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public showRentDocument: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();
  public isDisabledAction: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedApplyNOCID: number = 0;
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  public FinalRemarks: any = [];
  public QueryStringStatus: any = '';

  constructor(private modalService: NgbModal,private dcedocumentscrutiny: DocumentScrutinyComponent,private dceDocumentScrutinyService: DCEDocumentScrutinyService,private applyNOCApplicationService: ApplyNOCApplicationService,private toastr: ToastrService,private loaderService: LoaderService, private nocpaymentService: NocpaymentService, private router: ActivatedRoute, private commonMasterService: CommonMasterService) {


  }

  async ngOnInit() {
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()))
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetOfflinePaymentDetails(this.SelectedCollageID);
  }

  async GetPreviewPaymentDetails(SelectedCollageID: number) {
    try {

      this.loaderService.requestStarted();
      await this.nocpaymentService.GetPreviewPaymentDetails(SelectedCollageID, this.sSOLoginDataModel.SessionID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.paymentResponseDataModel = data['Data'];
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
  async GetOfflinePaymentDetails(SelectedCollageID: number) {
    try {

      this.loaderService.requestStarted();
      await this.dceDocumentScrutinyService.DocumentScrutiny_PaymentDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          // data
          this.OfflinePaymentDataModel = data['Data'][0]['OfflinePaymentDetails'][0];
          this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
          this.dsrequest.ActionID = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.ActionID;
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



  async selectAll(ActionType: string) {
    await this.OfflinePaymentDataModel.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    });
    if (ActionType == 'No') {
      this.dsrequest.ActionID = 2;
      this.isDisabledAction = true;
    }
    else {
      this.dsrequest.ActionID = 0;
      this.isDisabledAction = false;
    }
  }


  ClickOnAction(idx: number) {
    var Count = 0;
    for (var i = 0; i < this.OfflinePaymentDataModel.length; i++) {
      if (i == idx) {
        this.OfflinePaymentDataModel[i].Remark = '';
      }
      if (this.OfflinePaymentDataModel[i].Action == 'No') {
        Count++;
      }
    }
    if (Count > 0) {
      this.dsrequest.ActionID = 2;
      this.isDisabledAction = true;
    }
    else {
      this.dsrequest.ActionID = 0;
      this.isDisabledAction = false;
    }
  }

  public isSubmitted: boolean = false;

  async SubmitOffPaymentDetail_Onclick() {
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'OfflinePayment';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.OfflinePaymentDataModel.length; i++) {
      if (this.OfflinePaymentDataModel[i].Action == '' || this.OfflinePaymentDataModel[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.OfflinePaymentDataModel[i].Action == 'No') {
        if (this.OfflinePaymentDataModel[i].Remark == '' || this.OfflinePaymentDataModel[i].Remark == undefined) {
          this.toastr.warning('Please enter remark');
          return;
        }
      }
    }
    if (this.dsrequest.ActionID <= 0) {
      this.isFormvalid = false;
    }
    if (this.dsrequest.FinalRemark == '' || this.dsrequest.FinalRemark == undefined) {
      this.isRemarkValid = true;
      this.isFormvalid = false;
    }
    if (!this.isFormvalid) {
      return;
    }
    if (this.OfflinePaymentDataModel.length > 0) {
      for (var i = 0; i < this.OfflinePaymentDataModel.length; i++) {
        console.log(this.OfflinePaymentDataModel[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.OfflinePaymentDataModel[i].Action,
          Remark: this.OfflinePaymentDataModel[i].Remark,
          TabRowID: this.OfflinePaymentDataModel[i].PaymentID,
          SubTabName: ''
        });
      }
    }
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.SaveDocumentScrutiny(this.dsrequest)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.isRemarkValid = false;
            this.isFormvalid = true;
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ViewTaril(ID: number, ActionType: string) {
    this.dcedocumentscrutiny.ViewTarilCommon(ID, ActionType);
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
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public OfflinePaymentHistory: any = [];
  async ViewOfflinePaymentHistory(content: any, ID: number) {
    this.OfflinePaymentHistory = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeTabData_History(ID, 'OfflinePayment')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfflinePaymentHistory = data['Data'][0]['data']["Table"];
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
