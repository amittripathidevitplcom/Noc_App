import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicBscNursingComponent } from './basic-bsc-nursing.component';

const routes: Routes = [{
  path: '',
  component: BasicBscNursingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicBscNursingRoutingModule { }
