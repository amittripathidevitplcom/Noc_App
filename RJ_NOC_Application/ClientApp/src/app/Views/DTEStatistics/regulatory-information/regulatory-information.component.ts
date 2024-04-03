import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegulatoryInformationDataModel } from '../../../Models/DTEStatistics/RegulatoryInformationDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { RegulatoryInformationService } from '../../../Services/DTEStatistics/RegulatoryInformation/regulatory-information.service';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { PreviewDTEStatisticsComponent } from '../preview-dtestatistics/preview-dtestatistics.component';

@Component({
  selector: 'app-regulatory-information',
  templateUrl: './regulatory-information.component.html',
  styleUrls: ['./regulatory-information.component.css']
})
export class RegulatoryInformationComponent implements OnInit {
  RegulatoryInformationFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new RegulatoryInformationDataModel();
  public FinancialYear: string = ''
  public SearchRecordID: string = ''
  public isSubmitted: boolean = false;
  public DesignationMasterList: any = [];
  public PreviewStatus: string = 'N';

  constructor(private RegulatoryInformationService: RegulatoryInformationService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent, private previewDTEStatisticsComponent: PreviewDTEStatisticsComponent) {
  }
  async ngOnInit() {
    this.RegulatoryInformationFormGroup = this.formBuilder.group(
      {
        txtUnderSection: ['', Validators.required],
        txtDate: ['', Validators.required],
        ddlUniversityHasUploaded: ['', Validators.required],
        ddlUniversityIsComplying: ['', Validators.required],
        ddlUniversityHadMinimum: ['', Validators.required],
      })


    this.PreviewStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('PreviewStatus')?.toString());
    if (this.PreviewStatus != 'Y') {
      this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
      this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;
      this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;
    }
    else {
      this.RegulatoryInformationFormGroup.disable();
      this.SelectedDepartmentID = this.previewDTEStatisticsComponent.SelectedDepartmentID;
      this.SelectedCollageID = await this.previewDTEStatisticsComponent.GetCollegeID_SearchRecordID();
      this.request.SelectedCollegeEntryTypeName = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('EntryType')?.toString());
    }
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    await this.GetByID()
  }
  get form() { return this.RegulatoryInformationFormGroup.controls; }

  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.RegulatoryInformationService.GetByID(this.request.CollegeID, this.request.ModifyBy)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;
          this.request.UniversityHasUploaded = data['Data'].UniversityHasUploaded;
          this.request.UniversityIsComplying = data['Data'].UniversityIsComplying;
          this.request.UniversityHadMinimum = data['Data'].UniversityHadMinimum;
          this.request.UnderSection = data['Data'].UnderSection;
          this.request.Date = data['Data'].Date;
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
    if (this.RegulatoryInformationFormGroup.invalid) {
      return
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.RegulatoryInformationService.SaveData(this.request)
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
