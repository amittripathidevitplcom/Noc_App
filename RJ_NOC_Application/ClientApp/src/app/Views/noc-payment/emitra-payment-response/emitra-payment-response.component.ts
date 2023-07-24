import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service';

@Component({
  selector: 'app-emitra-payment-response',
  templateUrl: './emitra-payment-response.component.html',
  styleUrls: ['./emitra-payment-response.component.css']
})
export class EmitraPaymentResponseComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public PRNNo: string = '';

  public TransactionID: string = '';
  public Amount: string = '';
  public PaymentStatus: string = '';
  public PaymentModeBID: string = '';
  public TransactionMessage: string = '';
  

  constructor(private router: ActivatedRoute, private loaderService: LoaderService, private nocpaymentService: NocpaymentService) { }

  ngOnInit(): void
  {
    this.PRNNo = this.router.snapshot.paramMap.get('TransID')?.toString();
    this.GetEmitraPaymentStatus(this.PRNNo);
  }

  async GetEmitraPaymentStatus(Type: string)
  {
    try {
      this.loaderService.requestStarted();
      await this.nocpaymentService.GetEmitraTransactionDetails(Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          var reult = data['Data'][0]['data'][0];
          this.Amount = reult.TransAmt;
          this.PaymentStatus = reult.TransctionStatus;
          this.TransactionID = reult.Receipt_Number;
          this.TransactionMessage = reult.TransctionMSG;

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

}
