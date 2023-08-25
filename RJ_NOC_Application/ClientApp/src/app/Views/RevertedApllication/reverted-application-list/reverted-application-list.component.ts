import { Component, OnInit, Input, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';

@Injectable()

  @Component({
    selector: 'app-reverted-application-list',
    templateUrl: './reverted-application-list.component.html',
    styleUrls: ['./reverted-application-list.component.css']
  })
export class RevertedApplicationListComponent implements OnInit
{
  //Add FormBuilder
  ProjectMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/

  public UserID: number = 0;
  public draftApplicatoinListData: any = [];
  searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();


  constructor(private collegeservice: CollegeService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {

  }

  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.RevertedApplicationList();
  }

  async RevertedApplicationList()
  {
    try
    {
      this.loaderService.requestStarted();
      await this.collegeservice.RevertedApplicationList(this.sSOLoginDataModel.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.draftApplicatoinListData = data['Data'][0]['data'];
          console.log(this.draftApplicatoinListData);
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

  async DraftEdit_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationdetailentry' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }
  async ApplicationSummary_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }
}

