import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalEntityComponent } from './legal-entity.component';

const routes: Routes = [
  {
    path: '',
    component:LegalEntityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalEntityRoutingModule { }
