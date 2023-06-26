import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpenBScNCollegeOfNursingRoutingModule } from './open-bsc-ncollege-of-nursing-routing.module';
import { OpenBScNCollegeOfNursingComponent } from './open-bsc-ncollege-of-nursing.component';


@NgModule({
  declarations: [OpenBScNCollegeOfNursingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OpenBScNCollegeOfNursingRoutingModule
  ]
})
export class OpenBScNCollegeOfNursingModule { }
