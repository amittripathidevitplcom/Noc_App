import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BEdRoomdetailDataModel } from '../../../Models/BEdRoomdetailDataModel';
import { BedRoomDetailService } from '../../../Services/BEdRoomDetail/bed-room-detail.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { Clipboard } from '@angular/cdk/clipboard';
/*import * as jsPDF from 'jspdf'*/

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';
import { debug } from 'console';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-bed-room-detail',
  templateUrl: './bed-room-detail.component.html',
  styleUrls: ['./bed-room-detail.component.css']
})
export class BedRoomDetailComponent implements OnInit {
  BEdRoomDetailForm !: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new BEdRoomdetailDataModel();
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  public EditID: any;
  isEdit: boolean = false;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;
  public isDeleteButton: boolean = true;

  public UserID: number = 0;
  searchText: string = '';
  public LoginSSOID: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public CssClass_TextDangerNoOfClasses: string = 'text-danger';

  // ssologin model
  ssoLoginModel = new SSOLoginDataModel();
  public MinNoOfClasses: number = 0;
  public SearchRecordID: string = '';
  constructor(private bEdroomdetailService: BedRoomDetailService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute,
    private routers: Router, private _fb: FormBuilder, private clipboard: Clipboard) { }


  async ngOnInit() {
    this.BEdRoomDetailForm = this.formBuilder.group(
      {
        txtNoOfClasses: ['', [Validators.required, Validators.min(1)]],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    

    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.CollegeID = data['Data']['CollegeID'];
          this.SelectedCollageID = data['Data']['CollegeID'];
          if (this.request.CollegeID == null || this.request.CollegeID == 0 || this.request.CollegeID == undefined) {
            this.routers.navigate(['/draftapplicationlist']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }

    this.GetBEdClassRoomDetail();
    const txtNoOfClasses = document.getElementById('txtNoOfClasses')
    if (txtNoOfClasses) txtNoOfClasses.focus();
    this.UserID = 1;
  }

  //    this.LoadMaster(0);
  get form() { return this.BEdRoomDetailForm.controls; }


  public isformvalid: boolean = true;
  async SaveData() {
    debugger;

    this.isformvalid = true;
    this.isSubmitted = true;

    if (this.BEdRoomDetailForm.invalid) {
      this.isformvalid = false;
    }
    if (Number(this.request.NoOfClasses) <= Number(this.MinNoOfClasses)) {
      this.CssClass_TextDangerNoOfClasses = 'text-danger';
      this.toastr.warning('Please Enter Number of Classes ')
      this.isformvalid = false;
    }
    if (!this.isformvalid) {
      return;
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.request.DepartmentID = this.SelectedDepartmentID;
    this.request.CollegeID = this.SelectedCollageID;
    this.isLoading = true;
    try {
      await this.bEdroomdetailService.SaveData(this.request)
        .then((data: any) => {
          debugger;
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            debugger
            this.toastr.success(this.SuccessMessage)
            this.GetBEdClassRoomDetail();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async GetBEdClassRoomDetail() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.bEdroomdetailService.GetBEdRoomDetailList(this.SelectedDepartmentID, this.SelectedCollageID).then((data: any) => {

        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        this.request.NoOfClasses = data['Data'][0]['data'][0]['NoOfClasses'];
        this.request.BEdRoomDetailID = data['Data'][0]['data'][0]['BEdRoomDetailID']
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
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  async DeleteData(BEdRoomDetailID: number) {

    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.bEdroomdetailService.DeleteData(BEdRoomDetailID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {

              this.toastr.success(this.SuccessMessage)
              this.request.NoOfClasses = 0;
              this.request.BEdRoomDetailID = 0
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
