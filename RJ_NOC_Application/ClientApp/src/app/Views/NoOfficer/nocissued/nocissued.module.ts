import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NOCIssuedRoutingModule } from './nocissued-routing.module';
import { NOCIssuedComponent } from './nocissued.component';


@NgModule({
  declarations: [NOCIssuedComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NOCIssuedRoutingModule
  ]
})
export class NOCIssuedModule { }
