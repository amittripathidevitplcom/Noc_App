import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { WorkFlowMasterService } from '../../../../Services/Admin/WorkFlowMaster/work-flow-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkFlowMasterDataModel } from '../../../../Models/WorkFlowMasterDataModel';


@Component({
  selector: 'app-work-flow-master-list',
  templateUrl: './work-flow-master-list.component.html',
  styleUrls: ['./work-flow-master-list.component.css']
})
export class WorkFlowMasterListComponent implements OnInit {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public WorkFlowMasterList: any = [];
  request = new WorkFlowMasterDataModel();
  searchText: string = '';
  constructor(private loaderService: LoaderService,
    private workFlowMasterService: WorkFlowMasterService, private routers: Router) { }

  ngOnInit(): void {
    this.GetWorkFlowMasterList(0);
  }

  async GetWorkFlowMasterList(WorkFlowMasterID: number) {
    try {
      this.loaderService.requestStarted();
      await this.workFlowMasterService.GetWorkFlowMasterList(WorkFlowMasterID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.WorkFlowMasterList = data['Data'];
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


  async OpenWorkFlowMasterDetailsModel(WorkFlowMasterID: number) {
    try {
      this.loaderService.requestStarted();
      await this.workFlowMasterService.GetWorkFlowMasterList(WorkFlowMasterID)
        .then((data: any) => {
          this.request = data['Data'][0];
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
