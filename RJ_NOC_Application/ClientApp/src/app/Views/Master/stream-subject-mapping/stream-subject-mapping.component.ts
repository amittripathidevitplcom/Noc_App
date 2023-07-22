import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';

import { SubjectMasterDataModel } from '../../../Models/SubjectMasterDataModel'
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { StreamSubjectMappingDetailDataModel } from '../../../Models/StreamSubjectMappingDetailDataModel';
import { SubjectMasterService } from '../../../Services/Master/SubjectMaster/subject-master.service'
import {StreamSubjectMappingServiceService } from '../../../Services/Master/StreamSubjectMappingMaster/stream-subject-mapping-service.service'
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';



@Component({
  selector: 'app-stream-subject-mapping',
  templateUrl: './stream-subject-mapping.component.html',
  styleUrls: ['./stream-subject-mapping.component.css']
})
export class StreamSubjectMappingComponent implements OnInit {

  SubjectMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  isSubmitted: boolean = false;
  /*Save Data Model*/
  request = new StreamSubjectMappingDetailDataModel();

  public DepartmentList: any;
  public CourseList: any;
  public CollegeLevelList_FilterData: any = [];
  public CollegeLevelList: any = [];

  public subjectDataList: any = [];
  public streamDataList: any = [];
  public isLoading: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public StreamSubjectMappingList: any = [];
  public isDisabledGrid: boolean = false;
  public isDeleteButton: boolean = true;
  searchText: string = '';

  public isShowGrid: boolean = false;

  constructor(private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private subjectMasterService: SubjectMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private clipboard: Clipboard, private streamsubjectmappingserviceservice: StreamSubjectMappingServiceService) { }

  async ngOnInit()
  {
    await this.GetDepartmentList();
    await this.GetSubjectMappingList()

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.SubjectMasterForm = this.formBuilder.group(
      {
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlCollegeLevelID: ['', [DropdownValidators]],
        ddlCourseID: ['', [DropdownValidators]],
        ddlStreamID: ['', [DropdownValidators]],

      })
  }
  get form() { return this.SubjectMasterForm.controls; }

  async GetDepartmentList()
  {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentList = data['Data'];
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

  async DepartmentChangecourse(select: any) {
    this.request.DepartmentID = select;
    try {
      this.loaderService.requestStarted();
      await this.subjectMasterService.GetDepartmentByCourse(this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseList = data['Data'];


        }, error => console.error(error));

      this.CourseLevel();
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  };

  async CourseLevel()
  {

    try
    {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "CourseLevel")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeLevelList = data['Data'];
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
  };


  async ddlCourse_change($event: any, SeletedCourseID: any)
  {
    this.request.CourseID = SeletedCourseID;
    this.GetStreamList_CourseIDWise();
  }
  async ddlCollege_change($event: any, SelectedCourseLevelID: any)
  {
    this.request.CourseLevelID = SelectedCourseLevelID;
  }

  async GetStreamList_CourseIDWise()
  {
    try
    {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStreamList_CourseIDWise(this.request.DepartmentID, this.request.CourseLevelID, this.request.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.streamDataList = data['Data'];

          console.log(this.streamDataList);
          //  this.request.SelectedSubjectDetails = data['Data'];
          //console.log(this.request.SelectedSubjectDetails);
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

  async ddlStream_change($event: any, SeletedStreamID: any)
  {
    try {
      this.request.StreamID = SeletedStreamID;
      this.loaderService.requestStarted();

      await this.commonMasterService.GetSubjectList_CourseIDWise(this.request.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.SelectedSubjectDetails = data['Data'];

          this.isShowGrid = true;

          //  this.request.SelectedSubjectDetails = data['Data'];
          //console.log(this.request.SelectedSubjectDetails);
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



  async SaveData() {

    this.isSubmitted = true;
    if (this.SubjectMasterForm.invalid) {
      return
    }
    this.request.UserID = this.sSOLoginDataModel.UserID;
   // this.request.SelectedSubjectDetails = this.subjectDataList
  
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.streamsubjectmappingserviceservice.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetSubjectMappingList();
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


  async GetSubjectMappingList() {
    try {
      this.loaderService.requestStarted();
      await this.streamsubjectmappingserviceservice.GetSubjectMappingList(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StreamSubjectMappingList = data['Data'][0]['data'];

          console.log(this.StreamSubjectMappingList);

          
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



  async Edit_OnClick(CollegeWiseCourseID: number) {

    this.ResetControl();
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.streamsubjectmappingserviceservice.GetByID(CollegeWiseCourseID, this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID)
        .then(async (data: any) =>
        {

          this.request.StreamMappingID = data['Data'][0]["StreamMappingID"];
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
           await  this.DepartmentChangecourse(this.request.DepartmentID);
          this.request.CourseLevelID = data['Data'][0]["CourseLevelID"];
          this.request.CourseID = data['Data'][0]["CourseID"];
          await this.ddlCourse_change(null, this.request.CourseID);
          this.request.StreamID = data['Data'][0]["StreamID"];
          this.request.SelectedSubjectDetails = data['Data'][0]["SelectedSubjectDetails"];

          this.isShowGrid = true;




        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }
  async Delete_OnClick(CollegeWiseCourseID: number)
  {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.streamsubjectmappingserviceservice.DeleteData(CollegeWiseCourseID, this.sSOLoginDataModel.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetSubjectMappingList();
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

  


  async ResetControl()
  {
    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();
    this.isSubmitted = false;
  
    this.request.DepartmentID = 0;
    this.request.CourseID = 0;
    this.request.UserID = 0;
    this.request.StreamID = 0;
    this.request.CourseLevelID = 0;
    this.request.ActiveStatus = true;
    this.isDisabledGrid = false;
    this.isShowGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }


}
