import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeDetailsComponent } from './college-details.component';

const routes: Routes = [
  {
    path: '',
    component: CollegeDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeDetailsRoutingModule { }
