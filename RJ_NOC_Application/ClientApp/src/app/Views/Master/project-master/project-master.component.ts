import { Component, OnInit, Input, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProjectMasterDataModel } from '../../../Models/ProjectMasterDataModel';
import { ProjectMasterService } from '../../../Services/Master/ProjectMaster/project-master.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';



@Injectable()

@Component({
  selector: 'app-project-master',
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.css']
})

export class ProjectMasterComponent implements OnInit {
  //Add FormBuilder
  ProjectMasterForm!: FormGroup;

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new ProjectMasterDataModel();

  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  isEdit: boolean = false;

  public isView: boolean = true;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;
  public isDeleteButton: boolean = true;
  public isPrint: boolean = true;
  public CurrentPageName: any = "";

  public UserID: number = 0;
  public projectMasterData: any = [];
  searchText: string = '';


  constructor(private projectMasterService: ProjectMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {

  }
   
  async ngOnInit() {
 
    this.ProjectMasterForm = this.formBuilder.group(
      {
        rbEmpanelmentTypeService: [''],
        rbEmpanelmentDevelopment: [''],
        txtProjectName: ['', Validators.required],
        txtDepartmentName: ['', Validators.required],
        txtNumberofResources: ['', Validators.required]
      })
    const txtProjectName = document.getElementById('txtProjectName')
    if (txtProjectName) txtProjectName.focus();
    //this.UserID = Number(sessionStorage.getItem('UserID'));
    this.UserID = 1;
    ///Edit Process
    this.GetAllList();
    //this.EditID = this.router.snapshot.paramMap.get('ID');
    //if (this.EditID != null) {
    //  console.log(this.EditID);
    //  this.isEdit = true;
    //  this.Edit_OnClick(this.EditID)
    //}
    //document.getElementById('txtFirstName').focus();
  }



  //get form(): { [key: string]: AbstractControl } {
  //  return this.ProjectMasterForm.controls;
  //}

  get form() { return this.ProjectMasterForm.controls; }

  async GetAllList() {
    try {
      this.loaderService.requestStarted();
      await this.projectMasterService.GetList(this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.projectMasterData = data['Data'][0]['data'];
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
    if (this.ProjectMasterForm.invalid) {
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.projectMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetAllList();
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


  async ResetControl() {

    const txtProjectName = document.getElementById('txtProjectName')
    if (txtProjectName) txtProjectName.focus();

    this.isSubmitted = false;
    this.request.ProjectID = 0;
    this.request.ProjectName = '';
    this.request.DepartmentName = '';
    this.request.NumberofResources = 0;
    this.request.EmpanelmentType = 'Service';
    this.request.UserID = 0;
    this.request.ActiveStatus = true;
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML="Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
    
  }

  async Edit_OnClick(ProjectID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.projectMasterService.GetByID(ProjectID, this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.ProjectID = data['Data'][0]["ProjectID"];
          this.request.ProjectName = data['Data'][0]["ProjectName"];
          this.request.DepartmentName = data['Data'][0]["DepartmentName"];
          this.request.NumberofResources = data['Data'][0]["NumberofResources"];
          this.request.EmpanelmentType = data['Data'][0]["EmpanelmentType"];
          this.isDisabledGrid = true;

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async Delete_OnClick(ProjectID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.projectMasterService.DeleteData(ProjectID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllList();
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

