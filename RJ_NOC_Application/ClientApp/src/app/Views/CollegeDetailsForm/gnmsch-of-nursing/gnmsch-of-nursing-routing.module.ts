import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GNMSchOfNursingComponent } from './gnmsch-of-nursing.component';

const routes: Routes = [{
  path: '',
  component: GNMSchOfNursingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GNMSchOfNursingRoutingModule { }
