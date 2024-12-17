import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AbstractControl, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { DTEAffiliationAddCourseService } from '../../../Services/DTEAffiliation/DTEAffiliationAddCourse/dte-affiliation-add-course.service';
import { DTEAffiliationAddCoursePreviewDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationAddCourse/DTEAffiliationAddCourseDataModel';
@Component({
  selector: 'app-preview-dteaffiliation-course',
  templateUrl: './preview-dteaffiliation-course.component.html',
  styleUrls: ['./preview-dteaffiliation-course.component.css']
})
export class PreviewDTEAffiliationCourseComponent implements OnInit {  
  DTEAffiliationCourse!: FormGroup;
  constructor(private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private sSOLoginService: SSOLoginService, private dteffiliationAddCourseService:DTEAffiliationAddCourseService) {

  }
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public UserID: number = 0;
  public searchText: string = '';
  public SsoValidationMessage: string = '';
  public SsoSuccessMessage: string = '';
  public DepartmentList: any = []; 
  public DTEAffiliationCoursePreviewData: any = []; 
  // sso ligin
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new DTEAffiliationAddCoursePreviewDataModel();
  public ModifyBy: number = 0; 
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));    
    this.ModifyBy = 1;
    this.GetDepartmentList();  
  }
  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentList = data['Data'];
          for (let i = 0; i < data['Data'].length; i++) {
            if (data['Data'][i]['DepartmentID'] == 4) {
              this.request.DepartmentID = data['Data'][i]['DepartmentID'];
             
              this.GetDTEAffiliationCoursePreviewData(this.request.DepartmentID);
              //this.GetAffiliationBranchList(this.request.DepartmentID);
              //this.GetStartDateEndDateDepartmentwise(this.request.DepartmentID)
              // console.log(this.request.DepartmentID);
            }
          }
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
  async GetDTEAffiliationCoursePreviewData(DepartmentID: number) {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.dteffiliationAddCourseService.GetDTEAffiliationCoursePreviewData(DepartmentID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.DTEAffiliationCoursePreviewData = data['Data'][0];          
        }, (error: any) => console.error(error));
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

