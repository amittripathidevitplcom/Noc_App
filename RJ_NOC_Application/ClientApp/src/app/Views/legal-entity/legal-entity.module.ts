import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LegalEntityRoutingModule } from './legal-entity-routing.module';
import { LegalEntityComponent } from './legal-entity.component';


@NgModule({
  declarations: [LegalEntityComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LegalEntityRoutingModule
  ]
})
export class LegalEntityModule { }
