import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeficiencyMarkedRoutingModule } from './deficiency-marked-routing.module';
import { DeficiencyMarkedComponent } from './deficiency-marked.component';


@NgModule({
  declarations: [DeficiencyMarkedComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DeficiencyMarkedRoutingModule
  ]
})
export class DeficiencyMarkedModule { }
