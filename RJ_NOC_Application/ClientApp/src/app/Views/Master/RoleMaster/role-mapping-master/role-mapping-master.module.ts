import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleMappingMasterRoutingModule } from './role-mapping-master-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleMappingMasterComponent } from './role-mapping-master.component';
import { LoderComponent } from '../../../Shared/loader/loader.component';  

@NgModule({
  declarations: [RoleMappingMasterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RoleMappingMasterRoutingModule
  ]
})
export class RoleMappingMasterModule { }
