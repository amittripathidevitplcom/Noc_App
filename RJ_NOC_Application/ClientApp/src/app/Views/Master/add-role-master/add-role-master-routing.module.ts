import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRoleMasterComponent } from './add-role-master.component';

const routes: Routes = [
  {
    path: '',
    component: AddRoleMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRoleMasterRoutingModule { }
