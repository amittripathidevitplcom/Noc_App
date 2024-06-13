import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CourtOrderSearchFilterDataModel } from '../../../Models/TabDetailDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CourtOrderService } from '../../../Services/Tabs/court-order.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preview-court-order',
  templateUrl: './preview-court-order.component.html',
  styleUrls: ['./preview-court-order.component.css']
})
export class PreviewCourtOrderComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  searchrequest = new CourtOrderSearchFilterDataModel();

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public UserID: number = 0;
  public courtOrderDataList: any = [];

  constructor(private commonMasterService: CommonMasterService,private loaderService: LoaderService,
    private courtOrderService: CourtOrderService, private router: ActivatedRoute) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    
    await this.GetAllCourOrderList();
  }

  async GetAllCourOrderList() {

    try {
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = this.SelectedDepartmentID;
      this.searchrequest.CollegeID = this.SelectedCollageID;
      this.searchrequest.UserID = this.sSOLoginDataModel.UserID;

      await this.courtOrderService.GetCourtOrderData(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.courtOrderDataList = data['Data'][0]['data'];
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
