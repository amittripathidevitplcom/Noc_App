import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TotalDraftApplicationComponent } from './total-draft-application.component';

const routes: Routes = [
  {
    path: '',
    component: TotalDraftApplicationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalDraftApplicationRoutingModule { }
