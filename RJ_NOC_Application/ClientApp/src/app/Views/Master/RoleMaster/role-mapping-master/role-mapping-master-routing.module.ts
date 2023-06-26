import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleMappingMasterComponent } from './role-mapping-master.component';

const routes: Routes = [
  {
    path: '',
    component: RoleMappingMasterComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleMappingMasterRoutingModule { }
