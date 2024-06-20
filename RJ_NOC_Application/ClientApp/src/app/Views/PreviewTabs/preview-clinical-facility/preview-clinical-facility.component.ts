import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { ClinicalFacilityService } from '../../../Services/ClinicalFacility/clinical-facility.service';

@Component({
  selector: 'app-preview-clinical-facility',
  templateUrl: './preview-clinical-facility.component.html',
  styleUrls: ['./preview-clinical-facility.component.css']
})
export class PreviewClinicalFacilityComponent {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public UserID: number = 0;
  public clinicalFacilityList: any = [];

  constructor(private commonMasterService: CommonMasterService, private loaderService: LoaderService,
    private clinicalFacilityService: ClinicalFacilityService, private router: ActivatedRoute) { }

  async ngOnInit() {
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    await this.GetAllClinicalFacilityList();
  }
  async GetAllClinicalFacilityList() {
    try {

      this.loaderService.requestStarted();
      await this.clinicalFacilityService.GetCollegeClinicalFacilityList(this.UserID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.clinicalFacilityList = data['Data'][0]['data'];
          console.log('clinicalFacilityList');
          console.log(data['Data'][0]['data']);
          console.log('clinicalFacilityList');
          debugger;
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
