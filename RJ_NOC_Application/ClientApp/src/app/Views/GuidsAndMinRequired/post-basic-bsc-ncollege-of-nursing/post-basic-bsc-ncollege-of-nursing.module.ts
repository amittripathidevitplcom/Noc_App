import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostBasicBScNCollegeOfNursingRoutingModule } from './post-basic-bsc-ncollege-of-nursing-routing.module';
import { PostBasicBScNCollegeOfNursingComponent } from './post-basic-bsc-ncollege-of-nursing.component';


@NgModule({
  declarations: [PostBasicBScNCollegeOfNursingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PostBasicBScNCollegeOfNursingRoutingModule
  ]
})
export class PostBasicBScNCollegeOfNursingModule { }
