import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatisticsEntryComponent } from '../../Statistics/statistics-entry/statistics-entry.component';
import { DTEStatisticsStaffService } from '../../../Services/DTEStatistics/DTEStatistics_Staff/dtestatistics-staff.service';
import { DTEStatisticsStaffDataModel } from '../../../Models/DTEStatistics/DTEStatisticsStaffDataModel';
import { PreviewDTEStatisticsComponent } from '../preview-dtestatistics/preview-dtestatistics.component';

@Component({
  selector: 'app-dtestatistics-staff',
  templateUrl: './dtestatistics-staff.component.html',
  styleUrls: ['./dtestatistics-staff.component.css']
})
export class DTEStatisticsStaffComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public staffData: any = [];
  public DesignationWiseTeachingStaff: any = [];
  public isLoading: boolean = false;
  request = new DTEStatisticsStaffDataModel();
  public FinancialYear: string = ''
  public SearchRecordID: string = ''
  public isSubmitted: boolean = false;
  public CurrentIndex: number = -1;
  public PreviewStatus: string = 'N';

  constructor(private dTEStatisticsStaffService: DTEStatisticsStaffService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private toastr: ToastrService
    , private statisticsEntryComponent: StatisticsEntryComponent, private previewDTEStatisticsComponent: PreviewDTEStatisticsComponent) {
  }
  async ngOnInit() {
   
    this.PreviewStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('PreviewStatus')?.toString());
    if (this.PreviewStatus != 'Y') {
      this.SelectedDepartmentID = this.statisticsEntryComponent.SelectedDepartmentID;
      this.SelectedCollageID = this.statisticsEntryComponent.SelectedCollageID;
      this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;
    }
    else {
      this.SelectedDepartmentID = this.previewDTEStatisticsComponent.SelectedDepartmentID;
      this.SelectedCollageID = await this.previewDTEStatisticsComponent.GetCollegeID_SearchRecordID();
      //var dt = await this.previewDTEStatisticsComponent.GetCollegeDetails_After();
    }

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.Department = this.SelectedDepartmentID;
    this.request.SelectedCollegeEntryTypeName = this.statisticsEntryComponent.SelectedCollegeEntryType;

    await this.TeachingStaff();
  } 

  async TeachingStaff() {
    try {
      this.loaderService.requestStarted();
      await this.dTEStatisticsStaffService.TeachingStaff(this.request.CollegeID,"TeachingStaff")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log('staff---')
          console.log(data)
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.staffData = data['Data'][0]['data'];
          this.DesignationWiseTeachingStaff = data['Data'][0]['DesignationWiseTeachingStaff'];
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

