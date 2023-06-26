import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoleMappingRoutingModule } from './create-role-mapping-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateRoleMappingComponent } from './create-role-mapping.component';


@NgModule({
  declarations: [CreateRoleMappingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CreateRoleMappingRoutingModule
  ]
})
export class CreateRoleMappingModule { }
