import { Component } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { MGoneNOCService } from '../../../../Services/MGoneNOC/mgone-noc.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mg-one-noc-completed-report',
  templateUrl: './mg-one-noc-completed-report.component.html',
  styleUrls: ['./mg-one-noc-completed-report.component.css']
})
export class MgOneNocCompletedReportComponent {
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public DocumentScrutinyCompleteList: any = [];
  public ApplicationTrailList: any = [];
  public QueryStringStatus: any = '';

  constructor(private loaderService: LoaderService, private mgoneNOCService: MGoneNOCService, private commonMasterService: CommonMasterService, private modalService: NgbModal, private router: ActivatedRoute) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    if (this.QueryStringStatus == "Rejected") {
      await this.GetApplyNOCApplicationListByRole(this.QueryStringStatus);
    }
    else {
      await this.GetApplyNOCApplicationListByRole('Completed');
    }
  }
  async GetApplyNOCApplicationListByRole(status:string) {
    try {
      this.loaderService.requestStarted();
      await this.mgoneNOCService.GetNOCApplicationList(this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID, status )
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DocumentScrutinyCompleteList = data['Data'][0]['data'];
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


  async GetApplicationTrail(content: any, ApplyNOCID: number) {
    this.ApplicationTrailList = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetApplicationTrail_DepartmentApplicationWise(ApplyNOCID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationTrailList = data['Data'];
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
