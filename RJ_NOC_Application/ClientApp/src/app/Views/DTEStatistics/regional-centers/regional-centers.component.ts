import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegionalCentersDataModel, RegionalCenters_RegionalCentersDetails } from '../../../Models/DTEStatistics/RegionalCentersDataModel';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { RegionalCentersService } from '../../../Services/DTEStatistics/RegionalCenters/regional-centers.service';
import { PreviewDTEStatisticsComponent } from '../preview-dtestatistics/preview-dtestatistics.component';

@Component({
  selector: 'app-regional-centers',
  templateUrl: './regional-centers.component.html',
  styleUrls: ['./regional-centers.component.css']
})
export class RegionalCentersComponent implements OnInit {
  RegionalCentersFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new RegionalCentersDataModel();
  request_RegionalCentersDetails = new RegionalCenters_RegionalCentersDetails();
  public FinancialYear: string = ''
  public SearchRecordID: string = ''
  public isSubmitted: boolean = false;
  public DesignationMasterList: any = [];
  public HostelCategoryList: any = [];
  public stateDataList: any = [];
  public districtDataList: any = [];
  public CurrentIndex: number = -1;
  public PreviewStatus: string = 'N';

  constructor(private RegionalCentersService: RegionalCentersService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent, private previewDTEStatisticsComponent: PreviewDTEStatisticsComponent) {
  }
  async ngOnInit() {
    this.RegionalCentersFormGroup = this.formBuilder.group(
      {

        ddlDistanceEducationMode: [''],
        ddlPrivateExternalProgramme: [''],
        ddlRegionalCenters: [''],


        txtName: [''],
        ddlState: [''],
        txtDistrict: [''],
        txtNoofStudyCenters: ['']
      })
    this.request.RegionalCentersDetails = []

    this.PreviewStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('PreviewStatus')?.toString());
    if (this.PreviewStatus != 'Y') {
      this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
      this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;
      this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;
    }
    else {
      this.RegionalCentersFormGroup.disable();
      this.SelectedDepartmentID = this.previewDTEStatisticsComponent.SelectedDepartmentID;
      this.SelectedCollageID = await this.previewDTEStatisticsComponent.GetCollegeID_SearchRecordID();
      //var dt = await this.previewDTEStatisticsComponent.GetCollegeDetails_After();
    }

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;

    await this.GetStateList();
    await this.GetDistrictListByStateID();
    await this.GetByID();
  }
  get form() { return this.RegionalCentersFormGroup.controls; }

  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.RegionalCentersService.GetByID(this.request.CollegeID, this.request.ModifyBy)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;
          if (data['Data'].DistanceEducationMode != null) {
            this.request.DistanceEducationMode = data['Data'].DistanceEducationMode;
          }
          if (data['Data'].PrivateExternalProgramme != null) {
            this.request.PrivateExternalProgramme = data['Data'].PrivateExternalProgramme;
          }
          if (data['Data'].RegionalCenters != null) {
            this.request.RegionalCenters = data['Data'].RegionalCenters;
          }
          if (data['Data'].RegionalCentersDetails != null) {
            this.request.RegionalCentersDetails = data['Data'].RegionalCentersDetails;
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
  async SaveData() {
    this.isSubmitted = true;
    if (this.RegionalCentersFormGroup.invalid) {
      return
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.RegionalCentersService.SaveData(this.request)
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
    this.request_RegionalCentersDetails.NameOfRegionalCenter = Item.NameOfRegionalCenter;
    this.request_RegionalCentersDetails.StateID = Item.StateID;
    await this.GetDistrictListByStateID();
    this.request_RegionalCentersDetails.DistrictID = Item.DistrictID;
    this.request_RegionalCentersDetails.NoofStudyCenters = Item.NoofStudyCenters;
    const btnAdd = document.getElementById('btnAdd')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }
  async btnDelete_Click(i: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.RegionalCentersDetails.splice(i, 1);
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
      if (this.request_RegionalCentersDetails.NameOfRegionalCenter == '') {
        this.toastr.error("Name field is required .!");
        return;
      }
      if (this.request_RegionalCentersDetails.StateID == 0) {
        this.toastr.error("State field is required .!");
        return;
      }
      if (this.request_RegionalCentersDetails.DistrictID == 0) {
        this.toastr.error("District field is required .!");
        return;
      }
      if (this.request_RegionalCentersDetails.NoofStudyCenters == null) {
        this.toastr.error("No Of Study Centers field is required .!");
        return;
      }

      this.loaderService.requestStarted();

      if (this.CurrentIndex != -1) {
        this.request.RegionalCentersDetails.splice(this.CurrentIndex, 1);;
      }

      this.request_RegionalCentersDetails.StateName = await this.stateDataList.find((x: { StateID: number; }) => x.StateID == this.request_RegionalCentersDetails.StateID)?.StateName;

      this.request_RegionalCentersDetails.DistrictName = await this.districtDataList.find((x: { DistrictID: number; }) => x.DistrictID == this.request_RegionalCentersDetails.DistrictID)?.DistrictName;

      this.request.RegionalCentersDetails.push({
        NameOfRegionalCenter: this.request_RegionalCentersDetails.NameOfRegionalCenter,
        StateID: this.request_RegionalCentersDetails.StateID,
        StateName: this.request_RegionalCentersDetails.StateName,
        DistrictID: this.request_RegionalCentersDetails.DistrictID,
        DistrictName: this.request_RegionalCentersDetails.DistrictName,
        NoofStudyCenters: this.request_RegionalCentersDetails.NoofStudyCenters,
      });
      console.log(this.request.RegionalCentersDetails);
      this.request_RegionalCentersDetails.NameOfRegionalCenter = "";
      this.request_RegionalCentersDetails.StateID = 0;
      this.request_RegionalCentersDetails.StateName = '';
      this.request_RegionalCentersDetails.DistrictID = 0;
      this.request_RegionalCentersDetails.DistrictName = '';
      this.request_RegionalCentersDetails.NoofStudyCenters = 0;
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

  async ddlRegionalCenters_OnChange() {
    this.request_RegionalCentersDetails.NameOfRegionalCenter = "";
    this.request_RegionalCentersDetails.StateID = 0;
    this.request_RegionalCentersDetails.StateName = '';
    this.request_RegionalCentersDetails.DistrictID = 0;
    this.request_RegionalCentersDetails.DistrictName = '';
    this.request_RegionalCentersDetails.NoofStudyCenters = 0;
    this.request.RegionalCentersDetails = [];
  }
  async GetStateList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.stateDataList = data['Data'];
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

  async GetDistrictListByStateID() {
    try {
      this.districtDataList = [];
      this.request_RegionalCentersDetails.DistrictID = 0;
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictListByStateID(this.request_RegionalCentersDetails.StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.districtDataList = data['Data'];
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

