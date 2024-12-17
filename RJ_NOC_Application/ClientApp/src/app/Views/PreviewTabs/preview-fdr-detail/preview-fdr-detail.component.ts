import { Component, OnInit, Input } from '@angular/core';
import { ApplyNocFDRDetailsDataModel } from '../../../Models/ApplyNocParameterDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';


@Component({
  selector: 'app-preview-fdr-detail',
  templateUrl: './preview-fdr-detail.component.html',
  styleUrls: ['./preview-fdr-detail.component.css']
})
export class PreviewFDRDetailComponent implements OnInit
{
  public FDRResponseDataModel: any[] = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private loaderService: LoaderService, private applyNocParameterService: ApplyNocParameterService, private router: ActivatedRoute, private commonMasterService: CommonMasterService) {


  }

  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.getFDRDetailId(this.SelectedCollageID);
  }

  async getFDRDetailId(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.applyNocParameterService.ViewApplyNocFDRDetailsByCollegeID(CollegeID, this.sSOLoginDataModel.SessionID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.FDRResponseDataModel = data['Data'];

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
