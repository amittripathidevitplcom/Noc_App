import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';

@Component({
  selector: 'app-application-detail-entry',
  templateUrl: './application-detail-entry.component.html',
  styleUrls: ['./application-detail-entry.component.css']
})
export class ApplicationDetailEntryComponent implements OnInit {
  @ViewChild('tabs') tabGroup!: MatTabGroup;
  public collegeDataList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public CollegeID: number = 0;
  public LandClass: string = 'tabs-Link LandInformation';
  public CollegeName: string = '';

  selectedIndex: number = 0;
  maxNumberOfTabs: number = 0;
  public CollegeType_IsExisting: boolean = true;

  //public isOLDNOCDetails: boolean = true;
  //public isAcademicInformation: boolean = true;


  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private collegeService: CollegeService) { }

  async ngOnInit() {
    // $(".secondTab").addClass("highLightTab");
    this.loaderService.requestStarted();
    console.log(this.router.snapshot.paramMap.get('DepartmentID'));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //await this.GetCollageMaster();
    await this.GetCollageDetails();
    await this.GetCollegeBasicDetails();

    this.loaderService.requestEnded();
    this.maxNumberOfTabs = this.tabGroup._tabs.length - 1;
    
  }

  NextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  PreviousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

  async GetCollageDetails() {
    try {
      this.loaderService.requestStarted();
      await this.collegeService.GetData(this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.collegeDataList = data['Data'];
          if (this.collegeDataList['CollegeStatusID'] == 3) {
            this.CollegeType_IsExisting = false;
            //this.isAcademicInformation = false;
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
  async GetCollegeBasicDetails() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeBasicDetails(this.SelectedCollageID.toString())
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeName = data['Data'][0]['data'][0]['CollegeNameEn'];

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
