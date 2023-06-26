import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCoursesComponent } from './add-courses.component';

const routes: Routes = [{
  path: '',
  component: AddCoursesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCoursesRoutingModule { }
