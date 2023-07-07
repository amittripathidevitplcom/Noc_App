import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApplyNocApplicationDataModel } from '../../../Models/ApplyNocParameterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { ApplyNOCFDRDetailsComponent } from '../apply-nocfdrdetails/apply-nocfdrdetails.component';

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

  constructor(private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal) {
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
      await this.applyNocParameterService.GetApplyNocApplicationList()
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
          // data
          if (this.State == 0) {
            this.ApplyNocApplicationDetail = data['Data'];
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async MakePayment_click(applyNocApplicationID: number) {
    try {
      this.loaderService.requestStarted();
      // do
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
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async FinalSubmitApplyNocApplication_click() {

  }

  async PaymentHistoryApplyNocApplication_click() {

  }

  async AddFDR_click(item: any) {
    try {
      this.loaderService.requestStarted();
      // model
      const modalRef = this.modalService.open(ApplyNOCFDRDetailsComponent, { backdrop: 'static', size: 'xl', keyboard: false, centered: true });
      modalRef.componentInstance.CollegeID = item.CollegeID;
      modalRef.componentInstance.ApplyNocApplicationID = item.ApplyNocApplicationID;
      modalRef.componentInstance.IsSaveFDR = item.IsSaveFDR;
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
