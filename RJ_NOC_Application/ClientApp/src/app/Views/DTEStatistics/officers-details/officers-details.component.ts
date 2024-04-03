import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OfficersDetailsDataModel } from '../../../Models/DTEStatistics/OfficersDetailsDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { OfficersDetailsService } from '../../../Services/DTEStatistics/officers-details.service';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { PreviewDTEStatisticsComponent } from '../preview-dtestatistics/preview-dtestatistics.component';

@Component({
  selector: 'app-officers-details',
  templateUrl: './officers-details.component.html',
  styleUrls: ['./officers-details.component.css']
})
export class OfficersDetailsComponent implements OnInit {
  OfficersDetailsFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new OfficersDetailsDataModel();
  public FinancialYear: string = ''
  public SearchRecordID: string = ''
  public isSubmitted: boolean = false;
  public DesignationMasterList: any = [];
  public PreviewStatus: string = 'N';

  constructor(private officersDetailsService: OfficersDetailsService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent, private previewDTEStatisticsComponent: PreviewDTEStatisticsComponent) {
  }
  async ngOnInit() {
    this.OfficersDetailsFormGroup = this.formBuilder.group(
      {
        txtNameOfVice: ['', Validators.required],
        ddlDesignationID: ['', [DropdownValidators]],
        txtMobileNo: ['', Validators.required],
        txtEmail: [''],
        txtTelephoneNo: [''],

        txtNameOfVice_Nodal: ['', Validators.required],
        ddlDesignationID_Nodal: ['', [DropdownValidators]],
        txtMobileNo_Nodal: ['', Validators.required],
        txtEmail_Nodal: [''],
        txtTelephoneNo_Nodal: [''],
      })
    this.PreviewStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('PreviewStatus')?.toString());
    if (this.PreviewStatus != 'Y') {
      this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
      this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;
      this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;
    }
    else {
      this.OfficersDetailsFormGroup.disable();
      this.SelectedDepartmentID = this.previewDTEStatisticsComponent.SelectedDepartmentID;
      this.SelectedCollageID = await this.previewDTEStatisticsComponent.GetCollegeID_SearchRecordID();
      this.request.SelectedCollegeEntryTypeName = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('EntryType')?.toString());
    }

    //this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
    //this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID; 

    await this.GetDesignation_OfficersDetailsMasterList();
    await this.GetByID()
  }
  get form() { return this.OfficersDetailsFormGroup.controls; }

  async GetDesignation_OfficersDetailsMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignation_OfficersDetails("All")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DesignationMasterList = data['Data'];
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
      await this.officersDetailsService.GetByID(this.request.CollegeID, this.request.ModifyBy)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];


          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;
          this.request.NameOfVice = data['Data'].NameOfVice;
          this.request.DesignationID = data['Data'].DesignationID;;
          this.request.Email = data['Data'].Email;
          this.request.MobileNo = data['Data'].MobileNo;
          this.request.TelephoneNo = data['Data'].TelephoneNo;
          this.request.NameOfNodal = data['Data'].NameOfNodal;
          this.request.Nodal_DesignationID = data['Data'].Nodal_DesignationID;
          this.request.Nodal_Email = data['Data'].Nodal_Email;
          this.request.Nodal_MobileNo = data['Data'].Nodal_MobileNo;
          this.request.Nodal_TelephoneNo = data['Data'].Nodal_TelephoneNo;

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
    if (this.OfficersDetailsFormGroup.invalid) {
      return
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.officersDetailsService.SaveData(this.request)
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

  //validattions
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
