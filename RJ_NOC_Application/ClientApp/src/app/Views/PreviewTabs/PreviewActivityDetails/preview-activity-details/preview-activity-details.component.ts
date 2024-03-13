import { Component, OnInit } from '@angular/core';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';

import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { Console } from 'console';
import { ActivityDetailsService } from '../../../../Services/ActivityDetails/activity-details.service';

@Component({
  selector: 'app-preview-activity-details',
  templateUrl: './preview-activity-details.component.html',
  styleUrls: ['./preview-activity-details.component.css']
})
export class PreviewActivityDetailsComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public ActivityDataAllList: any = [];
  constructor(private ActivityDetailsService: ActivityDetailsService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private router: ActivatedRoute) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetActivityDetailAllList();
  }
  async GetActivityDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.ActivityDetailsService.GetActivityDetailAllList(0, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ActivityDataAllList = data['Data'][0]['data'];
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
