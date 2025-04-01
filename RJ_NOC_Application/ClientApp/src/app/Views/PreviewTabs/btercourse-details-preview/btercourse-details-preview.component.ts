


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseMasterDataModel } from '../../../Models/CourseMasterDataModel';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { DTEAffiliationAddCourseService } from '../../../Services/DTEAffiliation/DTEAffiliationAddCourse/dte-affiliation-add-course.service';

@Component({
  selector: 'app-btercourse-details-preview',
  templateUrl: './btercourse-details-preview.component.html',
  styleUrls: ['./btercourse-details-preview.component.css']
})
export class BTERCourseDetailsPreviewComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new CourseMasterDataModel();

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public UserID: number = 0;
  public AllCourseList: any = [];
  public SearchRecordID: string = '';
  public SelectedDteAffiliationRegId: number = 0;
  public AllDTEAffiliationCourseList: any = [];
  public AffiliationCollegeStatusId: number = 0
  public AffiliationRegStatus: any = '';    ;
  public AffiliationRegID: number = 0;
  
  constructor(private collegeService: CollegeService, private courseMasterService: CourseMasterService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router ,private dTEAffiliationAddCourseService: DTEAffiliationAddCourseService) { }

  async ngOnInit() {
    debugger;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    //this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString());   
   
    this.AffiliationRegID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTEAffiliationID')?.toString());
    this.AffiliationRegStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());
    this.AffiliationCollegeStatusId = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeStatusId')?.toString());

    if (this.SearchRecordID.length > 20 && this.SelectedDepartmentID == 12) {
      await this.commonMasterService.GetDteAffiliation_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SelectedDteAffiliationRegId = data['Data']['DTE_ARId'];

          if (this.SelectedDteAffiliationRegId == null || this.SelectedDteAffiliationRegId == 0 || this.SelectedDteAffiliationRegId == undefined) {
            this.routers.navigate(['/affiliationregistration']);
          }
        }, error => console.error(error));
    }
    else {
      this.SelectedDteAffiliationRegId = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString()));
    }
    await this.GetAllDTEAffiliationCourseList();

  }

  async GetAllDTEAffiliationCourseList() {
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationAddCourseService.GetAllDTEAffiliationCourseList(this.SelectedDteAffiliationRegId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AllDTEAffiliationCourseList = data['Data'];
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
