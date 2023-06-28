import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { HostelDataModel, HostelDetailsDataModel_Hostel } from '../../../Models/HostelDetailsDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { HostelDetailService } from '../../../Services/Tabs/hostel-details.service';

@Component({
  selector: 'app-preview-hostel-details',
  templateUrl: './preview-hostel-details.component.html',
  styleUrls: ['./preview-hostel-details.component.css']
})
export class PreviewHostelDetailsComponent implements OnInit {

  request = new HostelDataModel();
  hosteldetail = new HostelDetailsDataModel_Hostel();
  sSOLoginDataModel = new SSOLoginDataModel();

  public hostelDataModel: HostelDataModel[] = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public showRentDocument: boolean = false;

  readonly imageUrlPath = 'http://localhost:62778/ImageFile/';
  constructor(private loaderService: LoaderService, private hostelDetailService: HostelDetailService, private commonMasterService: CommonMasterService, private router: ActivatedRoute) {

  }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.SelectedDepartmentID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString())
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()))

    await this.GetHostelDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0)
  }
  onCloseHandled() {
    const display = document.getElementById('PreviewHostelDetails');
    if (display) display.style.display = 'none';
  }

  async GetHostelDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, HostelDetailID: number) {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.hostelDetailService.GetHostelDetailList_DepartmentCollegeWise(DepartmentID, CollegeID, HostelDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.hostelDataModel = data['Data'];
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

  async ViewItem(HostelDetailID: number) {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.hostelDetailService.GetHostelDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, HostelDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request = data['Data'][0];
          if (this.request.HostelType == 'Rent') {
            this.showRentDocument = true;
          }
          this.request.RentDocumentPath = this.imageUrlPath + this.request.RentDocument;

          const display1 = document.getElementById('PreviewHostelDetails')
          if (display1) display1.style.display = 'block';

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
