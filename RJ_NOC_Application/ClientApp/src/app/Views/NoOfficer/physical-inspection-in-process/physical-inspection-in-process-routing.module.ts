import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhysicalInspectionInProcessComponent } from './physical-inspection-in-process.component';

const routes: Routes = [{
  path: '',
  component: PhysicalInspectionInProcessComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysicalInspectionInProcessRoutingModule { }
