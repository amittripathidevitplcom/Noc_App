import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MScNursingProgrammeComponent } from './msc-nursing-programme.component';

const routes: Routes = [{
  path: '',
  component: MScNursingProgrammeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MScNursingProgrammeRoutingModule { }
