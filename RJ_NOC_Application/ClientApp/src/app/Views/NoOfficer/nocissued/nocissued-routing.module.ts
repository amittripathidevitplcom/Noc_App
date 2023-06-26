import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NOCIssuedComponent } from './nocissued.component';

const routes: Routes = [
  {
    path: '',
    component: NOCIssuedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NOCIssuedRoutingModule { }
