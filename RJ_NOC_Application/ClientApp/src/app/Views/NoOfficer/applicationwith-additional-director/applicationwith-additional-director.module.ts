import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationwithAdditionalDirectorRoutingModule } from './applicationwith-additional-director-routing.module';
import { ApplicationwithAdditionalDirectorComponent } from './applicationwith-additional-director.component';


@NgModule({
  declarations: [ApplicationwithAdditionalDirectorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationwithAdditionalDirectorRoutingModule
  ]
})
export class ApplicationwithAdditionalDirectorModule { }
