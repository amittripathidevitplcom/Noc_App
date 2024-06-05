import { Component } from '@angular/core';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ApplicationPenaltyDataModel } from '../../../Models/ApplyNOCApplicationDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-application-penalty-dce',
  templateUrl: './add-application-penalty-dce.component.html',
  styleUrls: ['./add-application-penalty-dce.component.css']
})
export class AddApplicationPenaltyDCEComponent {
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new ApplicationPenaltyDataModel();
  constructor(private applyNOCApplicationService: ApplyNOCApplicationService, private toastr: ToastrService, private loaderService: LoaderService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute) {
  }
  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetData();
  }
  numberOnly(event: any): boolean {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }
  public FormSubmit: boolean = false;
  async SaveData() {
    this.FormSubmit = true;
    if (this.request.Penaltyfor == '' || this.request.PenaltyAmount == null || this.request.PenaltyAmount.toString() == '' ) {
      return;
    }
    if (this.request.PenaltyAmount == 0) {
      return;
    }
    this.request.DepartmentID = this.SelectedDepartmentID;
    this.request.CollegeID = this.SelectedCollageID;
    this.request.ApplyNOCID = this.SelectedApplyNOCID;
    this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    this.loaderService.requestStarted();
    try {
      await this.applyNOCApplicationService.SaveApplicationPenalty(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            await this.GetData();
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async GetData() {
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.applyNOCApplicationService.GetApplicationPenalty(this.SelectedApplyNOCID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (this.State == 0) {
            this.request = JSON.parse(JSON.stringify(data['Data'][0]['data'][0]));
          }

        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
