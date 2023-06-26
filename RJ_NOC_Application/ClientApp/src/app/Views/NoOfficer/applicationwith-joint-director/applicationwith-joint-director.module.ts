import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationwithJointDirectorRoutingModule } from './applicationwith-joint-director-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationwithJointDirectorComponent } from './applicationwith-joint-director.component';


@NgModule({
  declarations: [ApplicationwithJointDirectorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationwithJointDirectorRoutingModule
  ]
})
export class ApplicationwithJointDirectorModule { }
