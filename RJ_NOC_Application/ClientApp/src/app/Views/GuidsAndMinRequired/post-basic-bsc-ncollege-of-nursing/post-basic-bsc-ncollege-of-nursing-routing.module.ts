import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostBasicBScNCollegeOfNursingComponent } from './post-basic-bsc-ncollege-of-nursing.component';

const routes: Routes = [{
  path: '',
  component:PostBasicBScNCollegeOfNursingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostBasicBScNCollegeOfNursingRoutingModule { }
