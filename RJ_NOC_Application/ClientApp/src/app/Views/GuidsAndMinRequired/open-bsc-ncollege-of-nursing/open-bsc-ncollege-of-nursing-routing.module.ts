import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenBScNCollegeOfNursingComponent } from './open-bsc-ncollege-of-nursing.component';

const routes: Routes = [{
  path: '',
  component:OpenBScNCollegeOfNursingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenBScNCollegeOfNursingRoutingModule { }
