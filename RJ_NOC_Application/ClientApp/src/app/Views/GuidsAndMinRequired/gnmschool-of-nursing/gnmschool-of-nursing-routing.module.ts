import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GNMSchoolOfNursingComponent } from './gnmschool-of-nursing.component';

const routes: Routes = [{
  path: '',
  component: GNMSchoolOfNursingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GNMSchoolOfNursingRoutingModule { }
