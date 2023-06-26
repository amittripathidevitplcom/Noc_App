import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationswithNodalOfficerComponent } from './applicationswith-nodal-officer.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationswithNodalOfficerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationswithNodalOfficerRoutingModule { }
