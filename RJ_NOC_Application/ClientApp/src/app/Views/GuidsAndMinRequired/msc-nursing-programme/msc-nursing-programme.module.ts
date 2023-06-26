import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MScNursingProgrammeRoutingModule } from './msc-nursing-programme-routing.module';
import { MScNursingProgrammeComponent } from './msc-nursing-programme.component';


@NgModule({
  declarations: [MScNursingProgrammeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MScNursingProgrammeRoutingModule
  ]
})
export class MScNursingProgrammeModule { }
