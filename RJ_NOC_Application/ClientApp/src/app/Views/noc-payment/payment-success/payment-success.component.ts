import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  constructor(private router: ActivatedRoute) { }

  ngOnInit(): void
  {
    alert(this.router.snapshot.paramMap.get('TransID'));
  }


}
