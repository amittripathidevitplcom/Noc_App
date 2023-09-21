import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseMasterDataModel } from '../../../Models/CourseMasterDataModel';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';


@Component({
  selector: 'app-preview-course-detail',
  templateUrl: './preview-course-detail.component.html',
  styleUrls: ['./preview-course-detail.component.css']
})
export class PreviewCourseDetailComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new CourseMasterDataModel();

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public UserID: number = 0;
  public AllCourseList: any = [];
  constructor(private courseMasterService: CourseMasterService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private router: ActivatedRoute) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetCourseByCollegeWise(this.SelectedCollageID, this.UserID);
  }

  async GetCourseByCollegeWise(CollegeID: number, UserID: number) {
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetCoursesByCollegeID(CollegeID, UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AllCourseList = data['Data'][0]['data'];
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
