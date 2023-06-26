import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationswithNodalOfficerRoutingModule } from './applicationswith-nodal-officer-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationswithNodalOfficerComponent } from './applicationswith-nodal-officer.component';


@NgModule({
  declarations: [ApplicationswithNodalOfficerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationswithNodalOfficerRoutingModule
  ]
})
export class ApplicationswithNodalOfficerModule { }
