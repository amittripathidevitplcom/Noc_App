import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalTrustRoutingModule } from './total-trust-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TotalTrustComponent } from './total-trust.component';


@NgModule({
  declarations: [TotalTrustComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TotalTrustRoutingModule
  ]
})
export class TotalTrustModule { }
