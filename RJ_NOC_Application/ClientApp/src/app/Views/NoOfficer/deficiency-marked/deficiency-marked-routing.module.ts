import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeficiencyMarkedComponent } from './deficiency-marked.component';

const routes: Routes = [
  {
    path: '',
    component: DeficiencyMarkedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeficiencyMarkedRoutingModule { }
