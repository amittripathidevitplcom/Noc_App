import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GNMSchOfNursingRoutingModule } from './gnmsch-of-nursing-routing.module';
import { GNMSchOfNursingComponent } from './gnmsch-of-nursing.component';


@NgModule({
  declarations: [GNMSchOfNursingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    GNMSchOfNursingRoutingModule
  ]
})
export class GNMSchOfNursingModule { }
