import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddUserRoutingModule } from './add-user-routing.module';
import { AddUserComponent } from './add-user.component';
import { LoderComponent } from '../../../Shared/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AddUserComponent,],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AddUserRoutingModule
  ]
})
export class AddUserModule { }
