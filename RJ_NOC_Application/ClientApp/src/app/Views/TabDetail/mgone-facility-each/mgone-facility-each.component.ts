import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClinicalFacilityService } from '../../../Services/ClinicalFacility/clinical-facility.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicalFacilityModel } from '../../../Models/ClinicalFacilityModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { every, filter } from 'rxjs';
import { MGOneFacilityEachDataModel } from '../../../Models/FacilityDetailsDataModel';

@Component({
  selector: 'app-mgone-facility-each',
  templateUrl: './mgone-facility-each.component.html',
  styleUrls: ['./mgone-facility-each.component.css']
})
export class MGoneFacilityEachComponent implements OnInit {
  isSubmitted: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SearchRecordID: string = '';
  public SelectedCollageID: number = 0;
  public UserID: number = 0;
  public SelectedDepartmentID: number = 0;


  public MedicalCollegeFacilitylst: MGOneFacilityEachDataModel[] = [];

  constructor(private toastr: ToastrService, private loaderService: LoaderService,
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
          this.SelectedCollageID = data['Data']['CollegeID'];
          if (this.SelectedCollageID == null || this.SelectedCollageID == 0 || this.SelectedCollageID == undefined) {
            this.routers.navigate(['/draftapplicationlist']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }

    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    await this.GetMGoneFacilityEach();
  }

  async GetMGoneFacilityEach() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetMGoneFacilityEach(this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.MedicalCollegeFacilitylst = data['Data'][0];
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

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode == 47 || charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }

  AddMoreFacilityDetails(item: any) {
    const valuesMax1 = this.MedicalCollegeFacilitylst.filter(items => items.Code == item.Code);
    const max1 = Math.max.apply(Math, valuesMax1.map(o => o.OrderBy));
    for (var i = 0; i < this.MedicalCollegeFacilitylst.length; i++) {
      if ((this.MedicalCollegeFacilitylst[i].Capacity < item.MinCapacity || this.MedicalCollegeFacilitylst[i].Capacity < 0) && this.MedicalCollegeFacilitylst[i].Code == item.Code) {
        this.MedicalCollegeFacilitylst[i].IsSubmitted = true;
        return;
      }
      if ((this.MedicalCollegeFacilitylst[i].Size < item.MinSize || this.MedicalCollegeFacilitylst[i].Size < 0) && this.MedicalCollegeFacilitylst[i].Code == item.Code && item.Code == 'LectureTheatre') {
        this.MedicalCollegeFacilitylst[i].IsSubmitted = true;
        return;
      }
    }

    this.MedicalCollegeFacilitylst.push({
      CollegeID: this.SelectedCollageID,
      ID: item.ID,
      Name: item.Name,
      Code: item.Code,
      MinSize: item.MinSize,
      MinCapacity: item.MinCapacity,
      MinRequired: item.MinRequired,
      Unit: item.Unit,
      Capacity: 0,
      Size: 0,
      Showbutton: true,
      IsSubmitted: false,
      OrderBy: Number(max1)+1
    }
    )
    item.IsSubmitted = false;
    this.MedicalCollegeFacilitylst = this.MedicalCollegeFacilitylst.sort((a, b) => a.ID - b.ID);
  }
  async DeleteFacilityDetails(i: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.MedicalCollegeFacilitylst.splice(i, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async SaveData() {
    debugger;
    var TotalLectureTheatre = this.MedicalCollegeFacilitylst.filter((element: any) => element.Code == 'LectureTheatre');
    var TotalMuseum = this.MedicalCollegeFacilitylst.filter((element: any) => element.Code == 'Museum');
    for (var i = 0; i < this.MedicalCollegeFacilitylst.length; i++) {
      if ((this.MedicalCollegeFacilitylst[i].Capacity < this.MedicalCollegeFacilitylst[i].MinCapacity || this.MedicalCollegeFacilitylst[i].Capacity < 0)) {
        this.MedicalCollegeFacilitylst[i].IsSubmitted = true;
        return;
      }
      if ((this.MedicalCollegeFacilitylst[i].Size < this.MedicalCollegeFacilitylst[i].MinSize || this.MedicalCollegeFacilitylst[i].Size < 0) && this.MedicalCollegeFacilitylst[i].Code == 'LectureTheatre') {
        this.MedicalCollegeFacilitylst[i].IsSubmitted = true;
        return;
      }
    }

    if (Number(TotalMuseum.length) < TotalMuseum[0].MinRequired) {
      this.toastr.warning('Total ' + TotalMuseum[0].Name + ' ' + TotalMuseum[0].MinRequired + ' Required');
      return;
    }
    if (Number(TotalLectureTheatre.length) < TotalLectureTheatre[0].MinRequired) {
      this.toastr.warning('Total ' + TotalLectureTheatre[0].Name + ' ' + TotalLectureTheatre[0].MinRequired + ' Required');
      return;
    }
    this.isSubmitted = true;
    try {
      this.loaderService.requestStarted();
      this.MedicalCollegeFacilitylst[0].CollegeID = this.SelectedCollageID;
      await this.commonMasterService.SaveMGoneFacilityEach(this.MedicalCollegeFacilitylst)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            //console.log(data['Data']);
            this.toastr.success(this.SuccessMessage);
            await this.GetMGoneFacilityEach();
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }, error => {
          this.toastr.warning("Unable to connect to server .!");
        })
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
