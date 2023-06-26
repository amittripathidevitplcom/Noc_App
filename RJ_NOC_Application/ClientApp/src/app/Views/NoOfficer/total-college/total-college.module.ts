import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalCollegeRoutingModule } from './total-college-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TotalCollegeComponent } from './total-college.component';


@NgModule({
  declarations: [TotalCollegeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TotalCollegeRoutingModule
  ]
})
export class TotalCollegeModule { }
