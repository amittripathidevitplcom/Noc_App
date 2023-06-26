import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GNMSchoolOfNursingRoutingModule } from './gnmschool-of-nursing-routing.module';
import { GNMSchoolOfNursingComponent } from './gnmschool-of-nursing.component';


@NgModule({
  declarations: [GNMSchoolOfNursingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    GNMSchoolOfNursingRoutingModule
  ]
})
export class GNMSchoolOfNursingModule { }
