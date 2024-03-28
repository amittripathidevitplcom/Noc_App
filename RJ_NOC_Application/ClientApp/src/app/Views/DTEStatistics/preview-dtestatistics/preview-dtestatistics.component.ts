import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StatisticsFinalSubmitDataModel } from '../../../Models/SubjectWiseStatisticsDetailsDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';

@Component({
  selector: 'app-preview-dtestatistics',
  templateUrl: './preview-dtestatistics.component.html',
  styleUrls: ['./preview-dtestatistics.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class PreviewDTEStatisticsComponent implements OnInit {
  @ViewChild('tabs') tabGroup!: MatTabGroup;
  public collegeDataList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new StatisticsFinalSubmitDataModel();

  public SelectedCollageID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public SelectedDepartmentID: number = 0;

  public SeatValue: number = 50;
  public CollegeID: number = 0;
  public LandClass: string = 'tabs-Link LandInformation';
  public CollegeName: string = '';
  public CheckTabsEntry_StatisticsEntryData: any = [];

  public SearchRecordID: string = '';
  closeResult!: string;
  selectedIndex: number = 0;
  selectedTabName: string = 'Officers Details';
  maxNumberOfTabs: number = 0;
  public CollegeType_IsExisting: boolean = true;

  isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public IsShowDraftFinalSubmit: boolean = true;

  public SelectedCollegeEntryType: string = "0";


  constructor(private toastr: ToastrService, private loaderService: LoaderService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private collegeService: CollegeService
  ) {

  }

  async ngOnInit() {
    // $(".secondTab").addClass("highLightTab");
    this.loaderService.requestStarted();
    debugger;
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    this.SelectedCollageID = await this.GetCollegeID_SearchRecordID();
    if (this.SelectedCollageID == null || this.SelectedCollageID == 0 || this.SelectedCollageID == undefined) {
      this.routers.navigate(['/statisticscollegelist']);
    }
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetCollageDetails();
    this.loaderService.requestEnded();
  }

  public AISHECode: string = '';
  public YearofEstablishment: string = '';
  async GetCollageDetails() {
    try {
      this.loaderService.requestStarted();
      await this.collegeService.GetData(this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.collegeDataList = data['Data'];
          this.AISHECode = this.collegeDataList['AISHECode']
          this.YearofEstablishment = this.collegeDataList['YearofEstablishmentName']
          this.CollegeName = this.collegeDataList['CollegeNameEn']
          if (this.collegeDataList['CollegeStatus'] == 'New') {
            this.CollegeType_IsExisting = false;
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
  async GetCollegeID_SearchRecordID(): Promise<number> {
    await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SelectedCollageID = data['Data']['CollegeID'];
      }, error => console.error(error));
    return this.SelectedCollageID;
  }

  async GetCollegeDetails_After(): Promise<any> {
    await this.collegeService.GetData(this.SelectedCollageID)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.collegeDataList = data['Data'];
      }, error => console.error(error));
    return this.collegeDataList;
  }
}
