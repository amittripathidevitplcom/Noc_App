import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClinicalFacilityService } from '../../../Services/ClinicalFacility/clinical-facility.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicalFacilityModel } from '../../../Models/ClinicalFacilityModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { every } from 'rxjs';

@Component({
  selector: 'app-clinical-facility',
  templateUrl: './clinical-facility.component.html',
  styleUrls: ['./clinical-facility.component.css']
})
export class ClinicalFacilityComponent implements OnInit {
  isSubmitted: boolean = false;
  clinicalFacilityForm!: FormGroup;
  clinicalFacilityModel = new ClinicalFacilityModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SearchRecordID: string = '';
  public SelectedCollageID: number = 0;
  public UserID: number = 0;
  public SelectedDepartmentID: number = 0;

  constructor(private clinicalFacilityService: ClinicalFacilityService, private toastr: ToastrService, private loaderService: LoaderService,
    private cdRef: ChangeDetectorRef, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder) { }

  init() {
    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }
  async ngOnInit() {

    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.clinicalFacilityModel.CollegeID = data['Data']['CollegeID'];
          this.SelectedCollageID = data['Data']['CollegeID'];
          if (this.clinicalFacilityModel.CollegeID == null || this.clinicalFacilityModel.CollegeID == 0 || this.clinicalFacilityModel.CollegeID == undefined) {
            this.routers.navigate(['/draftapplicationlist']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }

    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));


    this.clinicalFacilityModel.FacilityList = [];
    await this.GetAllClinicalFacilityList();
  }
  get form() { return this.clinicalFacilityForm.controls; }


  async GetAllClinicalFacilityList() {
    try {

      this.loaderService.requestStarted();
      await this.clinicalFacilityService.GetAllClinicalFacilityList(this.UserID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.clinicalFacilityModel.FacilityList = data['Data'][0]['data'];
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
    var anyReq = this.clinicalFacilityModel.FacilityList.filter((x: { FacilityValue: string, IsMandatory: boolean, MinSize: number }) => (x.FacilityValue == '' || Number(x.FacilityValue) < x.MinSize) && x.IsMandatory == true);
    if (anyReq.length > 0) {
      return;
    }
    var anyRange = this.clinicalFacilityModel.FacilityList.filter((x: { FacilityValue: string, IsMandatory: boolean, MinSize: number, IsCheckbox: boolean }) => x.IsCheckbox == false && Number(x.FacilityValue) < x.MinSize && x.IsMandatory == true);
    if (anyRange.length > 0) {
      return;
    }
    this.loaderService.requestStarted();
    try {
      await this.clinicalFacilityService.SaveData(this.clinicalFacilityModel)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
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

      }, 200);
    }
  }
}
