import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyDataModel, Faculty_FacultyDetails } from '../../../Models/DTEStatistics/FacultyDataModel';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { FacultyService } from '../../../Services/DTEStatistics/Faculty/faculty.service';
import { PreviewDTEStatisticsComponent } from '../preview-dtestatistics/preview-dtestatistics.component';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent implements OnInit {
  FacultyFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new FacultyDataModel();
  request_FacultyDetails = new Faculty_FacultyDetails();
  public FinancialYear: string = ''
  public SearchRecordID: string = ''
  public isSubmitted: boolean = false; 
  public CurrentIndex: number = -1;
  public PreviewStatus: string = 'N';

  constructor(private FacultyService: FacultyService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent, private previewDTEStatisticsComponent: PreviewDTEStatisticsComponent) {
  }
  async ngOnInit() {
    this.FacultyFormGroup = this.formBuilder.group(
      {
        txtNameofFaculty: [''],
      });
    this.request.FacultyDetails = [];
    this.PreviewStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('PreviewStatus')?.toString());
    if (this.PreviewStatus != 'Y') {
      this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
      this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;
      this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;
    }
    else {
      this.FacultyFormGroup.disable();
      this.SelectedDepartmentID = this.previewDTEStatisticsComponent.SelectedDepartmentID;
      this.SelectedCollageID = await this.previewDTEStatisticsComponent.GetCollegeID_SearchRecordID();
      this.request.SelectedCollegeEntryTypeName = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('EntryType')?.toString());
    }

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;

    await this.GetByID();
  }
  get form() { return this.FacultyFormGroup.controls; }

  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.FacultyService.GetByID(this.request.CollegeID, this.request.ModifyBy)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;

          this.request.FacultyDetails = data['Data'].FacultyDetails; 


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
    if (this.FacultyFormGroup.invalid) {
      return
    }

    if (this.request.FacultyDetails.length==0) {
      this.toastr.error("Enter Faculty Details.!");
      return;
    }

    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.FacultyService.SaveData(this.request)
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
    this.request_FacultyDetails.NameofFaculty = Item.NameofFaculty;
    const btnAdd = document.getElementById('btnAdd')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }
  async btnDelete_Click(i: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.FacultyDetails.splice(i, 1);
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
      if (this.request_FacultyDetails.NameofFaculty == '') {
        this.toastr.error("Name of Faculty/School field is required .!");
        return;
      }
       
      this.loaderService.requestStarted();

      if (this.CurrentIndex != -1) {
        this.request.FacultyDetails.splice(this.CurrentIndex, 1);;
      }
      console.log(this.request.FacultyDetails)
      this.request.FacultyDetails.push({
        NameofFaculty: this.request_FacultyDetails.NameofFaculty
      });
      console.log(this.request.FacultyDetails)
      this.request_FacultyDetails.NameofFaculty = '';
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

