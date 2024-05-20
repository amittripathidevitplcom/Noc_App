import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { CourseMasterDataModel } from '../../../Models/CourseMasterDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { BedRoomDetailService } from '../../../Services/BEdRoomDetail/bed-room-detail.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-preview-bed-course-room-detail',
  templateUrl: './preview-bed-course-room-detail.component.html',
  styleUrls: ['./preview-bed-course-room-detail.component.css']
})
export class PreviewBedCourseRoomDetailComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public UserID: number = 0;
  public BEdCourseClassRoomDetailList: any = [];
  constructor(private bEdroomdetailService: BedRoomDetailService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private router: ActivatedRoute) { }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetBEdClassRoomDetailByDepartmentAndCollegeWise();
  }
  async GetBEdClassRoomDetailByDepartmentAndCollegeWise() {
    try {
      this.loaderService.requestStarted();
      await this.bEdroomdetailService.GetBEdRoomDetailList(this.SelectedDepartmentID, this.SelectedCollageID).then((data: any) => {

        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        this.BEdCourseClassRoomDetailList = data['Data'][0]['data'];
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
