import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentInspectionInProcessComponent } from './document-inspection-in-process.component';

const routes: Routes = [{
  path: '',
  component:DocumentInspectionInProcessComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentInspectionInProcessRoutingModule { }
