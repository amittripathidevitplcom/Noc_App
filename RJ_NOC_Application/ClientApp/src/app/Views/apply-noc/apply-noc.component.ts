import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';


@Component({
  selector: 'app-apply-noc',
  templateUrl: './apply-noc.component.html',
  styleUrls: ['./apply-noc.component.css']
})
export class ApplyNOCComponent implements OnInit {
  public DepartmentData: any = [];
  public CollegeData: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public ApplicationType: string = '';
  public ShowNOCFor: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  constructor(private loaderService: LoaderService, private toastr: ToastrService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.loaderService.requestStarted();
    this.SelectedDepartmentID = 6;
    //this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.DepartmentID = this.SelectedDepartmentID;
    this.sSOLoginDataModel.SSOID = 'rishikapoordelhi'; //JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetDepartmentList();
    this.GetCollageMaster();
    this.loaderService.requestEnded();
  }
  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DepartmentData = data['Data'];
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
  async GetCollageMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(this.SelectedDepartmentID, this.sSOLoginDataModel.SSOID, "ApplyNOC")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeData = data['Data'];
          console.log(this.CollegeData);
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
  OnChangeApplicationType() {
    if (this.ApplicationType != '') {
      this.ShowNOCFor = true;
    }
    else {
      this.ShowNOCFor = false;
    }
  }
  async Preview_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationpreview' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }
}
