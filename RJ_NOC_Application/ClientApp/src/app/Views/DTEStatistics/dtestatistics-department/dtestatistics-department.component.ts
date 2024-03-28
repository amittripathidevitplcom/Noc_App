import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { DepartmentDataModel, Department_DepartmentDetails } from '../../../Models/DTEStatistics/DTEStatisticsDepartmentDataModel';
import { DTEStatisticsDepartmentService } from '../../../Services/DTEStatistics/DTEStatisticsDepartment/dtestatistics-department.service';

@Component({
  selector: 'app-dtestatistics-department',
  templateUrl: './dtestatistics-department.component.html',
  styleUrls: ['./dtestatistics-department.component.css']
})
export class DTEStatisticsDepartmentComponent implements OnInit {
  DepartmentFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new DepartmentDataModel();
  request_DepartmentDetails = new Department_DepartmentDetails();
  public FinancialYear: string = ''
  public SearchRecordID: string = ''
  public isSubmitted: boolean = false;
  public CurrentIndex: number = -1;

  constructor(private dTEStatisticsDepartmentService: DTEStatisticsDepartmentService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent) {
  }
  async ngOnInit() {
    this.DepartmentFormGroup = this.formBuilder.group(
      {
        txtNameofDepartment: [''],
        txtNameOfDepartmentCentres: [''],
      });
    this.request.DepartmentDetails = [];

    this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
    this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;

    await this.GetByID();
  }
  get form() { return this.DepartmentFormGroup.controls; }

  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.dTEStatisticsDepartmentService.GetByID(this.request.CollegeID, this.request.ModifyBy)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;

          this.request.DepartmentDetails = data['Data'].DepartmentDetails;


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
    if (this.DepartmentFormGroup.invalid) {
      return
    }

    if (this.request.DepartmentDetails.length == 0) {
      this.toastr.error("Enter Department Details.!");
      return;
    }

    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.dTEStatisticsDepartmentService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            await this.GetByID();
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
  async btnEdit_Click(Item: any, idx: number) {
    this.CurrentIndex = idx;
    this.request_DepartmentDetails.NameofFaculty = Item.NameofFaculty;
    this.request_DepartmentDetails.NameOfDepartmentCentres = Item.NameOfDepartmentCentres;
    const btnAdd = document.getElementById('btnAdd')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }
  async btnDelete_Click(i: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.DepartmentDetails.splice(i, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //validattions
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async btnAdd_Click() {
    try {
      if (this.request_DepartmentDetails.NameofFaculty == '') {
        this.toastr.error("Name of Faculty/School.!");
        return;
      }
      if (this.request_DepartmentDetails.NameOfDepartmentCentres == '') {
        this.toastr.error("Name Of Department/Centres.!");
        return;
      }

      this.loaderService.requestStarted();

      if (this.CurrentIndex != -1) {
        this.request.DepartmentDetails.splice(this.CurrentIndex, 1);;
      }
      console.log(this.request.DepartmentDetails)
      this.request.DepartmentDetails.push({
        NameofFaculty: this.request_DepartmentDetails.NameofFaculty,
        NameOfDepartmentCentres: this.request_DepartmentDetails.NameOfDepartmentCentres
      });
      console.log(this.request.DepartmentDetails)
      this.request_DepartmentDetails.NameofFaculty = '';
      this.request_DepartmentDetails.NameOfDepartmentCentres = '';
      this.CurrentIndex = -1;
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        const btnAdd = document.getElementById('btnAdd')
        if (btnAdd) { btnAdd.innerText = "Add"; }
      }, 200);
    }
  }


}

