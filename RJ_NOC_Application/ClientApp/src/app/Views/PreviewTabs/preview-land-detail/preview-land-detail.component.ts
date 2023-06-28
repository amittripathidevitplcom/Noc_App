import { Component, OnInit } from '@angular/core';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { LandDetailDataModel } from '../../../Models/LandDetailDataModel';
import { LandDetailsService } from '../../../Services/Tabs/LandDetails/land-details.service'
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
@Component({
  selector: 'app-preview-land-detail',
  templateUrl: './preview-land-detail.component.html',
  styleUrls: ['./preview-land-detail.component.css']
})
export class PreviewLandDetailComponent implements OnInit {
  request = new LandDetailDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public LandDetailList: LandDetailDataModel[] = [];
  public UnitOfLand: string = '';
  constructor(private landDetailsService: LandDetailsService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private loaderService: LoaderService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetLandDetailsDataList();
    await this.GetUnitOfLandArea(this.SelectedDepartmentID,'LandUnit');
  }
  async GetLandDetailsDataList() {
    try {
      this.loaderService.requestStarted();
      await this.landDetailsService.GetLandDetailsIDWise(0, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LandDetailList = data['Data'];
          console.log(this.LandDetailList);
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

  async GetUnitOfLandArea(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UnitOfLand = data['Data'][0]['Name'];
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
  async ViewLandDetail(LandDetailID: number) {
    try {
      this.loaderService.requestStarted();
      await this.landDetailsService.GetLandDetailsIDWise(LandDetailID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'][0];
          const display = document.getElementById('ModalViewLandDetail');
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

  async CloseLandDetailModel() {
    const display = document.getElementById('ModalViewLandDetail');
    if (display) display.style.display = 'none';
    this.request = new LandDetailDataModel();
  }

}
