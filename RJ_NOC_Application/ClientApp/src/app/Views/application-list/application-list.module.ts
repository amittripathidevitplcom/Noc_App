import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationListRoutingModule } from './application-list-routing.module';
import { ApplicationListComponent } from './application-list.component';


@NgModule({
  declarations: [ApplicationListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationListRoutingModule
  ]
})
export class ApplicationListModule { }
