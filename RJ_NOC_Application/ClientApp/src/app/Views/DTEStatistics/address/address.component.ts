import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { AddressDataModel } from '../../../Models/DTEStatistics/AddressDataModel';
import { AddressService } from '../../../Services/DTEStatistics/Address/address.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  AddressFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new AddressDataModel();
  public FinancialYear: string = ''
  public SearchRecordID: string = ''
  public isSubmitted: boolean = false;
  public DesignationMasterList: any = [];

  public DistrictList: any = [];
  public TehsilList: any = [];
  public CityList: any = [];
  public IsRural: boolean = true;

  constructor(private addressService: AddressService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent) {
  }
  async ngOnInit() {
    this.AddressFormGroup = this.formBuilder.group(
      {
        txtAddressLine1: ['', Validators.required],
        txtAddressLine2: ['', Validators.required],
        ddlCityID: [''],
        txtCountry: [{ value: '', disabled: true }],
        txtState: [{ value: '', disabled: true }],
        ddlDistrictID: ['', [DropdownValidators]],
        rbRuralUrban: [''],
        ddlTehsilID: ['', [DropdownValidators]],
        txtPinCode: ['', Validators.required],
        txtLongitude: ['', Validators.required],
        txtLatitude: ['', Validators.required],
        txtTotalArea: ['', Validators.required],
        txtTotalConstructedArea: ['', Validators.required],
        txtWebsite: [''],
      })


    this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
    this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;

    await this.LoadMaster();
    await this.ddlDistrict_Change();
    await this.GetByID()
  }
  get form() { return this.AddressFormGroup.controls; }
  async LoadMaster() {
    await this.commonMasterService.Load_StateWise_DistrictMaster(6)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        this.DistrictList = data['Data'];
      }, error => console.error(error));
  }

  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.addressService.GetByID(this.request.CollegeID, this.request.ModifyBy)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];


          this.request.EntryID = data['Data'].EntryID;
          this.request.FYearID = data['Data'].FYearID;

          this.request.Country = data['Data'].Country;
          this.request.State = data['Data'].State;
          this.request.DistrictID = data['Data'].DistrictID;
          await this.ddlDistrict_Change()
          this.request.RuralUrban = data['Data'].RuralUrban;
          await this.IsRuralOrUrban();
          this.request.TehsilID = data['Data'].TehsilID;
          this.request.CityID = data['Data'].CityID;
          this.request.PinCode = data['Data'].PinCode;
          this.request.AddressLine1 = data['Data'].AddressLine1;
          this.request.AddressLine2 = data['Data'].AddressLine2;
          this.request.Longitude = data['Data'].Longitude;
          this.request.Latitude = data['Data'].Latitude;
          this.request.TotalArea = data['Data'].TotalArea;
          this.request.TotalConstructedArea = data['Data'].TotalConstructedArea;
          this.request.Website = data['Data'].Website;

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
    if (this.AddressFormGroup.invalid) {
      return
    }
    if (this.request.RuralUrban == 2) {
      if (this.request.CityID == 0) {
        this.toastr.error("City field is required .!");
        return;
      }
    }

    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.addressService.SaveData(this.request)
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

  async IsRuralOrUrban() {

  }
  async ddlDistrict_Change() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetTehsilByDistrictId(this.request.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TehsilList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.GetCityByDistrict(this.request.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CityList = data['Data'][0]['data'];
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
