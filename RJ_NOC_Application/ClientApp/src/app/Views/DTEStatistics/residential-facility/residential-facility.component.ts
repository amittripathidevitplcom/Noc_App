import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResidentialFacilityDataModel, ResidentialFacility_HostelDetailsDataModel } from '../../../Models/DTEStatistics/ResidentialFacilityDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ResidentialFacilityService } from '../../../Services/DTEStatistics/ResidentialFacility/residential-facility.service';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';

@Component({
  selector: 'app-residential-facility',
  templateUrl: './residential-facility.component.html',
  styleUrls: ['./residential-facility.component.css']
})
export class ResidentialFacilityComponent implements OnInit {
  ResidentialFacilityFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new ResidentialFacilityDataModel();
  request_HostelDetails = new ResidentialFacility_HostelDetailsDataModel();
  public FinancialYear: string = ''
  public SearchRecordID: string = ''
  public isSubmitted: boolean = false;
  public DesignationMasterList: any = [];
  public HostelCategoryList: any = [];
  public CurrentIndex: number = -1;

  constructor(private residentialFacilityService: ResidentialFacilityService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent) {
  }
  async ngOnInit() {
    this.ResidentialFacilityFormGroup = this.formBuilder.group(
      {

        ddlIsStaffQuarterAvailable: [''],
        txtTeachingStaff: [''],
        txtNonTeachingStaff: [''],
        txtTotalStaffQuarter: [{ value: '', disabled: true }],

        ddlIsStudentsHostelAvailable: [''],

        txtName: [''],
        ddlType: [''],
        txtCapacity: [''],
        txtResidingStudents: ['']
      })
    this.request.HostelDetails = []

    this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
    this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;

    await this.GetHostelCategory();
    await this.GetByID();
  }
  get form() { return this.ResidentialFacilityFormGroup.controls; }
  async GetHostelCategory() {
    try {
      // loading
      this.loaderService.requestStarted();
      // get
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.SelectedDepartmentID, "HostelCategory")
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HostelCategoryList = data['Data'];
          if (this.State != 0) {
            this.toastr.error(this.ErrorMessage);
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
  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.residentialFacilityService.GetByID(this.request.CollegeID, this.request.ModifyBy)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;

          this.request.IsStaffQuarterAvailable = data['Data'].IsStaffQuarterAvailable;
          this.request.TeachingStaff = data['Data'].TeachingStaff;
          this.request.NonTeachingStaff = data['Data'].NonTeachingStaff;
          this.request.TotalStaffQuarter = data['Data'].TotalStaffQuarter;
          this.request.IsStudentsHostelAvailable = data['Data'].IsStudentsHostelAvailable;
          this.request.HostelDetails = data['Data'].HostelDetails;

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
    if (this.ResidentialFacilityFormGroup.invalid) {
      return
    }
    if (this.request.IsStaffQuarterAvailable == null || this.request.IsStaffQuarterAvailable == undefined || this.request.IsStaffQuarterAvailable == '')
    {
      this.toastr.error("Is Staff Quarter Available field is required .!");
      return;
    }
    if (this.request.IsStudentsHostelAvailable == null || this.request.IsStudentsHostelAvailable == undefined || this.request.IsStudentsHostelAvailable == '')
    {
      this.toastr.error("Is Students Hostel Available field is required .!");
      return;
    }

    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.residentialFacilityService.SaveData(this.request)
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
  btnEdit_Click(Item: any, idx: number) {
    this.CurrentIndex = idx;
    this.request_HostelDetails.Name = Item.Name;
    this.request_HostelDetails.Type = Item.Type;
    this.request_HostelDetails.Capacity = Item.Capacity;
    this.request_HostelDetails.ResidingStudents = Item.ResidingStudents;
    const btnAdd = document.getElementById('btnAdd')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }
  async btnDelete_Click(i: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.HostelDetails.splice(i, 1);
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
      if (this.request_HostelDetails.Name == '') {
        this.toastr.error("Name field is required .!");
        return;
      }
      if (this.request_HostelDetails.Type == '0') {
        this.toastr.error("Type field is required .!");
        return;
      }
      if (this.request_HostelDetails.Capacity == 0) {
        this.toastr.error("Capacity field is required .!");
        return;
      }
      if (this.request_HostelDetails.ResidingStudents == null) {
        this.toastr.error("Residing Students field is required .!");
        return;
      }

      this.loaderService.requestStarted();

      if (this.CurrentIndex != -1) {
        this.request.HostelDetails.splice(this.CurrentIndex, 1);;
      }

      this.request.HostelDetails.push({
        Name: this.request_HostelDetails.Name,
        Type: this.request_HostelDetails.Type,
        Capacity: this.request_HostelDetails.Capacity,
        ResidingStudents: this.request_HostelDetails.ResidingStudents,
      });
      this.request_HostelDetails.Name = '';
      this.request_HostelDetails.Type = '0';
      this.request_HostelDetails.Capacity = 0;
      this.request_HostelDetails.ResidingStudents = 0;
      this.CurrentIndex = -1;
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
  async txtTeachingStaff_OnChange() {
    this.request.TotalStaffQuarter = Number(this.request.TeachingStaff) + Number(this.request.NonTeachingStaff);
  }
  async txtNonTeachingStaff_OnChange() {
    this.request.TotalStaffQuarter = Number(this.request.TeachingStaff) + Number(this.request.NonTeachingStaff);
  }
  async ddlIsStaffQuarterAvailable_OnChange() {
    this.request.TotalStaffQuarter = 0;
    this.request.TeachingStaff = 0;
    this.request.NonTeachingStaff = 0;
  }
  async ddlIsStudentsHostelAvailable_OnChange() {
    this.request_HostelDetails.Name = '';
    this.request_HostelDetails.Type = "0";
    this.request_HostelDetails.Capacity = 0;
    this.request_HostelDetails.ResidingStudents = 0;
    this.request.HostelDetails = [];
  }

}

