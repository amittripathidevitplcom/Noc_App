import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service'

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public PRNNo: string = '';

  public TransactionID: string = '';
  public Amount: string = '';
  public PaymentStatus: string = '';
  public PaymentModeBID: string = '';
  public UDF2_PURPOSE: string = '';

  constructor(private router: ActivatedRoute, private loaderService: LoaderService, private nocpaymentService: NocpaymentService) { }

  ngOnInit(): void
  {
    this.PRNNo = this.router.snapshot.paramMap.get('TransID')?.toString();
    this.GetPaymentListIDWise(this.PRNNo);

  }

  async GetPaymentListIDWise(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.nocpaymentService.GetPaymentListIDWise(Type)
        .then((data: any) =>
        {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.Amount = data['Data'][0]['AMOUNT'];
          this.PaymentStatus = data['Data'][0]['STATUS'];
          this.TransactionID = data['Data'][0]['RPPTXNID'];
          this.UDF2_PURPOSE = data['Data'][0]['UDF2'];
          
        },
            (        error: any) => console.error(error));
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
