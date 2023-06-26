import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmittedApplicationComponent } from './submitted-application.component';

const routes: Routes = [{
  path: '',
  component: SubmittedApplicationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmittedApplicationRoutingModule { }
