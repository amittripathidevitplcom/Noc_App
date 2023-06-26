import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectMasterComponent } from './project-master.component';

const routes: Routes = [{
  path: '',
  component: ProjectMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectMasterRoutingModule { }
