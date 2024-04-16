import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { WorkFlowMasterService } from '../../../../../Services/Admin/WorkFlowMaster/work-flow-master.service';
import { WorkFlowMasterDataModel } from '../../../../../Models/WorkFlowMasterDataModel';
@Component({
  selector: 'app-work-flow-format3',
  templateUrl: './work-flow-format3.component.html',
  styleUrls: ['./work-flow-format3.component.css']
})
export class WorkFlowFormat3Component implements OnInit {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public WorkFlowFormat3Data: any = [];
  public WorkFlowFormat3Data_Details: any = [];
  request = new WorkFlowMasterDataModel();
  searchText: string = '';
  constructor(private loaderService: LoaderService, private workFlowMasterService: WorkFlowMasterService) { }
  ngOnInit(): void {
    this.GetWorkFlowFormat3(0, 'Main');
  }
  async GetWorkFlowFormat3(DepartmentID: number, ReportType: string) {
    try {
      this.loaderService.requestStarted();
      await this.workFlowMasterService.GetWorkFlowformat3(DepartmentID, ReportType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.WorkFlowFormat3Data = data['Data'][0];
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
  async OpenWorkFlowMasterDetailsModel(DepartmentID: number, ReportType: string) {
    try {
      this.loaderService.requestStarted();
      this.request.ReportType == "";
      await this.workFlowMasterService.GetWorkFlowformat3(DepartmentID, ReportType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.WorkFlowFormat3Data_Details = data['Data'][0];
          const display = document.getElementById('WorkFlowMasterDetails')
          if (display) display.style.display = "block";
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  CloseWorkFlowMasterDetailsModel() {
    const display = document.getElementById('WorkFlowMasterDetails');
    if (display) display.style.display = 'none';
  }
}
