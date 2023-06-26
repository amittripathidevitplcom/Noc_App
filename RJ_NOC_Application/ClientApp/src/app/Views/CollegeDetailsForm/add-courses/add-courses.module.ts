import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddCoursesRoutingModule } from './add-courses-routing.module';
import { AddCoursesComponent } from './add-courses.component';


@NgModule({
  declarations: [AddCoursesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AddCoursesRoutingModule
  ]
})
export class AddCoursesModule { }
