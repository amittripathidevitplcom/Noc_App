import { Component, OnInit } from '@angular/core';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityDetailsService } from '../../../Services/FicilityDetais/facility-details.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { Console } from 'console';

@Component({
  selector: 'app-preview-facility-detail',
  templateUrl: './preview-facility-detail.component.html',
  styleUrls: ['./preview-facility-detail.component.css']
})
export class PreviewFacilityDetailComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public FacilitiesDataAllList: any = [];
  constructor(private facilityDetailsService: FacilityDetailsService,  private loaderService: LoaderService,  private commonMasterService: CommonMasterService, private router: ActivatedRoute) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetFacilityDetailAllList();
  }
  async GetFacilityDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.facilityDetailsService.GetFacilityDetailAllList(0, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.FacilitiesDataAllList = data['Data'][0]['data'];
          console.log(this.FacilitiesDataAllList);
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
