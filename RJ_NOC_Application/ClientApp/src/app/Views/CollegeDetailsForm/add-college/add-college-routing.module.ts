import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCollegeComponent } from './add-college.component';

const routes: Routes = [{
  path: '',
  component:AddCollegeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCollegeRoutingModule { }
