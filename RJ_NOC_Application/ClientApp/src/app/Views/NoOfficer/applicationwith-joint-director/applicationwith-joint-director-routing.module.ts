import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationwithJointDirectorComponent } from './applicationwith-joint-director.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationwithJointDirectorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationwithJointDirectorRoutingModule { }
