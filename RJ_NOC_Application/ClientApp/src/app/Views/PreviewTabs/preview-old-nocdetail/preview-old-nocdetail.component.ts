import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OldNocDataModel, OldNocDetailsDataModel, OldNocDetails_SubjectDataModel } from '../../../Models/TabDetailDataModel';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { async } from 'rxjs';
import { parse } from 'path';
import { OldnocdetailService } from '../../../Services/OldNOCDetail/oldnocdetail.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
@Component({
  selector: 'app-preview-old-nocdetail',
  templateUrl: './preview-old-nocdetail.component.html',
  styleUrls: ['./preview-old-nocdetail.component.css']
})
export class PreviewOldNOCDetailComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public OldNocDetails: OldNocDetailsDataModel[] = [];
  public SubjectDataModel: OldNocDetails_SubjectDataModel[] = [];
  request = new OldNocDetailsDataModel();
  constructor(private loaderService: LoaderService, private toastr: ToastrService, private fileUploadService: FileUploadService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private oldnocdetailService: OldnocdetailService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetOldNOCDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID,0);
  }
  async GetOldNOCDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, OldNocID: number) {
    try {
      this.loaderService.requestStarted();
      await this.oldnocdetailService.GetOldNOCDetailList_DepartmentCollegeWise(DepartmentID, CollegeID, OldNocID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.OldNocDetails = data['Data'];
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

  async CloseOldNOCDetailModel() {
    const display = document.getElementById('ModalViewOldNOCDetail');
    if (display) display.style.display = 'none';
    this.request = new OldNocDetailsDataModel();
  }

  async ViewOldNOCDetail(OldNocID: number) {
    try {
      this.loaderService.requestStarted();
      await this.oldnocdetailService.GetOldNOCDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, OldNocID)
        .then((data: any) => {
          const display = document.getElementById('ModalViewOldNOCDetail');
          if (display) display.style.display = 'block';
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request = data['Data'][0];
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
