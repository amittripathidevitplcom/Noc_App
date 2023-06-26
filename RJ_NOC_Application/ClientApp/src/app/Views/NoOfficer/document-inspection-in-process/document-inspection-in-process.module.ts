import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentInspectionInProcessRoutingModule } from './document-inspection-in-process-routing.module';
import { DocumentInspectionInProcessComponent } from './document-inspection-in-process.component';


@NgModule({
  declarations: [DocumentInspectionInProcessComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DocumentInspectionInProcessRoutingModule
  ]
})
export class DocumentInspectionInProcessModule { }
