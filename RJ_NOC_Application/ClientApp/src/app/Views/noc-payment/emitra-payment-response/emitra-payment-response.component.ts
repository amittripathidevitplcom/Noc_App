import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
