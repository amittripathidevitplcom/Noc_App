import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectMasterRoutingModule } from './project-master-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectMasterComponent } from './project-master.component';
import { LoderComponent } from '../../Shared/loader/loader.component';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';



@NgModule({
  declarations: [ProjectMasterComponent,   TableSearchFilterPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProjectMasterRoutingModule,
  ]
})
export class ProjectMasterModule { }
