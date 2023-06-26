import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicBscNursingRoutingModule } from './basic-bsc-nursing-routing.module';
import { BasicBscNursingComponent } from './basic-bsc-nursing.component';


@NgModule({
  declarations: [BasicBscNursingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BasicBscNursingRoutingModule
  ]
})
export class BasicBscNursingModule { }
