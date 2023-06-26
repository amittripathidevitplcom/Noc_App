import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TotalTrustComponent } from './total-trust.component';

const routes: Routes = [
  {
    path: '',
    component: TotalTrustComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalTrustRoutingModule { }
