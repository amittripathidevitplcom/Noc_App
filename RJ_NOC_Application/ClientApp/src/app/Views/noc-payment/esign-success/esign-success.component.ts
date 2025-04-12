import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
@Component({
  selector: 'app-esign-success',
  templateUrl: './esign-success.component.html',
  styleUrls: ['./esign-success.component.css']
})
export class EsignSuccessComponent {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public PRNNo: string = '';

  public ApplyNocApplicationID: string = '';
  public signedPDFUrl: string = '';
  public PaymentStatus: string = '';
  public PaymentModeBID: string = '';
  public UDF2_PURPOSE: string = '';

  constructor(private router: ActivatedRoute, private loaderService: LoaderService, private nocpaymentService: NocpaymentService, private aadharServiceDetails: AadharServiceDetails) { }

  ngOnInit(): void {
    this.PRNNo = this.router.snapshot.paramMap.get('TransID')?.toString();
    this.GetPaymentListIDWise(this.PRNNo);

  }

  async GetPaymentListIDWise(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.aadharServiceDetails.GetCA_eSignTransactionDetails(Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.signedPDFUrl = data['Data'][0]['signedPDFUrl'];
          this.PaymentStatus = data['Data'][0]['responseMsg'];
          this.ApplyNocApplicationID = data['Data'][0]['ApplyNocApplicationID'];
          this.UDF2_PURPOSE = data['Data'][0]['eSignType'];
          this.PRNNo = data['Data'][0]['txn'];
        },
          (error: any) => console.error(error));
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

  download(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signed_document.pdf'; // Optional custom name
    link.target = '_blank'; // Optional: open in new tab
    link.click();
  }

}

