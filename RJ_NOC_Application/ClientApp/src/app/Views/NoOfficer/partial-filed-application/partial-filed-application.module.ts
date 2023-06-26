import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartialFiledApplicationRoutingModule } from './partial-filed-application-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartialFiledApplicationComponent } from './partial-filed-application.component';


@NgModule({
  declarations: [PartialFiledApplicationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PartialFiledApplicationRoutingModule
  ]
})
export class PartialFiledApplicationModule { }
