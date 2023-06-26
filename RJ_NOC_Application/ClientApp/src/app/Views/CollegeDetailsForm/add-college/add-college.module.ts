import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddCollegeRoutingModule } from './add-college-routing.module';
import { AddCollegeComponent } from './add-college.component';


@NgModule({
  declarations: [AddCollegeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AddCollegeRoutingModule
  ]
})
export class AddCollegeModule { }
