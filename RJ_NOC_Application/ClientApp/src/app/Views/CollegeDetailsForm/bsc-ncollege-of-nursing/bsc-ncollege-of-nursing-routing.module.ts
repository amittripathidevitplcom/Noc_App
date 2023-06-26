import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BScNCollegeOfNursingComponent } from './bsc-ncollege-of-nursing.component';

const routes: Routes = [{
  path: '',
  component: BScNCollegeOfNursingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BScNCollegeOfNursingRoutingModule { }
