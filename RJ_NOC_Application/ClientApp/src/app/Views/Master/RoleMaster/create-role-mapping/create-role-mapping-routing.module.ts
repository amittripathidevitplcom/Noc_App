import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRoleMappingComponent } from './create-role-mapping.component';

const routes: Routes = [
  {
    path: '',
    component: CreateRoleMappingComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRoleMappingRoutingModule { }
