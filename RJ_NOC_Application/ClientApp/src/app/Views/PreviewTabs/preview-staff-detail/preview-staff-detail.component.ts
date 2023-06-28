import { Component, OnInit } from '@angular/core';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffDetailDataModel } from '../../../Models/TabDetailDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StaffDetailService } from '../../../Services/StaffDetail/staff-detail.service';

@Component({
  selector: 'app-preview-staff-detail',
  templateUrl: './preview-staff-detail.component.html',
  styleUrls: ['./preview-staff-detail.component.css']
})
export class PreviewStaffDetailComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public StaffDetailModel: StaffDetailDataModel[] = [];
  public TotalStaffDetail: number = 0;
  public TotalNonTeachingStaffDetail: number = 0;
  public TotalTeachingStaffDetail: number = 0;
  request = new StaffDetailDataModel();
  constructor(private loaderService: LoaderService, private staffDetailService: StaffDetailService
    , private commonMasterService: CommonMasterService, private router: ActivatedRoute) { }

 async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
   this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
   this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
   await this.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
  }
  async GetStaffDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, StaffDetailID: number) {
    try {
      this.loaderService.requestStarted();
      await this.staffDetailService.GetStaffDetailList_DepartmentCollegeWise(DepartmentID, CollegeID, StaffDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StaffDetailModel = data['Data'];
          this.TotalStaffDetail = this.StaffDetailModel.length;
          this.TotalTeachingStaffDetail = 0;
          this.TotalNonTeachingStaffDetail = 0;
          for (var i = 0; i < this.StaffDetailModel.length; i++) {

            if (this.StaffDetailModel[i].AadhaarNo.length > 0) {
              const visibleDigits = 4;
              let maskedSection = this.StaffDetailModel[i].AadhaarNo.slice(0, -visibleDigits);
              let visibleSection = this.StaffDetailModel[i].AadhaarNo.slice(-visibleDigits);
              this.StaffDetailModel[i].MaskedAadhaarNo = maskedSection.replace(/./g, 'X') + visibleSection;
            }
            if (this.StaffDetailModel[i].TeachingType == 'Teaching') {
              this.TotalTeachingStaffDetail++;
            }
            else {
              this.TotalNonTeachingStaffDetail++;
            }
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

  async CloseStaffDetailModel() {
    const display = document.getElementById('ModalViewStaffDetail');
    if (display) display.style.display = 'none';
    this.request = new StaffDetailDataModel();
  }

  async ViewStaffDetail(StaffDetailID: number) {
    try {
      this.loaderService.requestStarted();
      await this.staffDetailService.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, StaffDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request = data['Data'][0];
          const display = document.getElementById('ModalViewStaffDetail');
          if (display) display.style.display = 'block';
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
