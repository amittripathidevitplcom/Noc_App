import { Component, OnInit } from '@angular/core';
import { ResponseParameters } from '../../../Models/PaymentDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';

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

  constructor(private loaderService: LoaderService, private nocpaymentService: NocpaymentService, private router: ActivatedRoute, private commonMasterService: CommonMasterService) {


  }

  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.GetPreviewPaymentDetails(this.SelectedCollageID);
    this.GetOfflinePaymentDetails(this.SelectedCollageID);
  }

  async GetPreviewPaymentDetails(SelectedCollageID: number) {
    try {

      this.loaderService.requestStarted();
      await this.nocpaymentService.GetPreviewPaymentDetails(SelectedCollageID)
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
      await this.nocpaymentService.GetOfflinePaymentDetails(SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.OfflinePaymentDataModel = data['Data'][0]['data'];
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
