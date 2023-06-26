import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmittedApplicationRoutingModule } from './submitted-application-routing.module';
import { SubmittedApplicationComponent } from './submitted-application.component';


@NgModule({
  declarations: [SubmittedApplicationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SubmittedApplicationRoutingModule
  ]
})
export class SubmittedApplicationModule { }
