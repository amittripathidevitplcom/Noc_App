import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationwithAdditionalDirectorComponent } from './applicationwith-additional-director.component';

const routes: Routes = [{
  path: '',
  component: ApplicationwithAdditionalDirectorComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationwithAdditionalDirectorRoutingModule { }
