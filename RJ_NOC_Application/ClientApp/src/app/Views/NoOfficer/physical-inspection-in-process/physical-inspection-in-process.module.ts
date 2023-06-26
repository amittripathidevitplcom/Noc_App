import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysicalInspectionInProcessRoutingModule } from './physical-inspection-in-process-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhysicalInspectionInProcessComponent } from './physical-inspection-in-process.component';


@NgModule({
  declarations: [PhysicalInspectionInProcessComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PhysicalInspectionInProcessRoutingModule
  ]
})
export class PhysicalInspectionInProcessModule { }
