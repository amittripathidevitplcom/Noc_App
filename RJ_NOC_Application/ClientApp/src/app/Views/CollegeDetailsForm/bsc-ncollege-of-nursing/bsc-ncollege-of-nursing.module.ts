import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BScNCollegeOfNursingRoutingModule } from './bsc-ncollege-of-nursing-routing.module';
import { BScNCollegeOfNursingComponent } from './bsc-ncollege-of-nursing.component';


@NgModule({
  declarations: [BScNCollegeOfNursingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BScNCollegeOfNursingRoutingModule
  ]
})
export class BScNCollegeOfNursingModule { }
