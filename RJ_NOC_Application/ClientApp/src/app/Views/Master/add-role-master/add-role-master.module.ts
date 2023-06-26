import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRoleMasterRoutingModule } from './add-role-master-routing.module';
import { AddRoleMasterComponent } from './add-role-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { LoderComponent } from '../../../Shared/loader/loader.component';  
 

@NgModule({
  declarations: [AddRoleMasterComponent, LoderComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, 
    AddRoleMasterRoutingModule,
  ]
})
export class AddRoleMasterModule { }
