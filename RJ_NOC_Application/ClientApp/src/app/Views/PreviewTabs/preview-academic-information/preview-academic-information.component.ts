import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicInformationDetailsDataModel } from '../../../Models/AcademicInformationDetailsDataModel';
import { AcademicInformationDetailsService } from '../../../Services/AcademicInformationDetails/academic-information-details.service';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'console';

import * as XLSX from 'xlsx';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Clipboard } from '@angular/cdk/clipboard';
/*import * as jsPDF from 'jspdf'*/

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';
import { GlobalConstants } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-preview-academic-information',
  templateUrl: './preview-academic-information.component.html',
  styleUrls: ['./preview-academic-information.component.css']
})
export class PreviewAcademicInformationComponent implements OnInit {
  public AcademicInformationList: AcademicInformationDetailsDataModel[] = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  constructor(private academicInformationDetailsService: AcademicInformationDetailsService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetAcademicInformationDetailAllList();
  }
  async GetAcademicInformationDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.academicInformationDetailsService.GetAcademicInformationDetailAllList(0, this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AcademicInformationList = data['Data'][0]['data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
