import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TotalCollegeComponent } from './total-college.component';

const routes: Routes = [
  {
    path: '',
    component: TotalCollegeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalCollegeRoutingModule { }
