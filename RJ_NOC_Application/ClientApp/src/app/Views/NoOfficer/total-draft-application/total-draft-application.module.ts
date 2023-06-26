import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TotalDraftApplicationRoutingModule } from './total-draft-application-routing.module';
import { TotalDraftApplicationComponent } from './total-draft-application.component';


@NgModule({
  declarations: [TotalDraftApplicationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TotalDraftApplicationRoutingModule
  ]
})
export class TotalDraftApplicationModule { }
