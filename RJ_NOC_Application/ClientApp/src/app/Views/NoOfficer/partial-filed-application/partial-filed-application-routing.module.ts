import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartialFiledApplicationComponent } from './partial-filed-application.component';

const routes: Routes = [
  {
    path: '',
    component: PartialFiledApplicationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartialFiledApplicationRoutingModule { }
