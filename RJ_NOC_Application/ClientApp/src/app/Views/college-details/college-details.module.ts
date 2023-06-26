import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollegeDetailsRoutingModule } from './college-details-routing.module';
import { CollegeDetailsComponent } from './college-details.component';


@NgModule({
  declarations: [CollegeDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CollegeDetailsRoutingModule,
    
  ]
})
export class CollegeDetailsModule { }
