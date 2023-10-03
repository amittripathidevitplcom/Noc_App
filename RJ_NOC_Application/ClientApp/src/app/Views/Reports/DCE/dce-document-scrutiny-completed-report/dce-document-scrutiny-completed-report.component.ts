import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonMasterDataModel } from '../../../../Models/CommonMasterDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApplyNOCApplicationService } from '../../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { CommitteeMasterService } from '../../../../Services/Master/CommitteeMaster/committee-master.service';
import { DCEDocumentScrutinyService } from '../../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';

@Component({
  selector: 'app-dce-document-scrutiny-completed-report',
  templateUrl: './dce-document-scrutiny-completed-report.component.html',
  styleUrls: ['./dce-document-scrutiny-completed-report.component.css']
})
export class DceDocumentScrutinyCompletedReportComponent implements OnInit {
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public DocumentScrutinyCompleteList: any = [];
  public ApplicationTrailList: any = [];
  public QueryStringStatus: any = [];

  constructor(private decDocumentScrutinyService: DCEDocumentScrutinyService, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService, private committeeMasterService: CommitteeMasterService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private modalService: NgbModal) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetDocumentScrutinyCompletedReportUserWise(this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID);
  }

  async GetDocumentScrutinyCompletedReportUserWise(UserID: number, RoleID: number, DepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GetApplyNOCCompletedReport(UserID, this.QueryStringStatus, RoleID, DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'][0]['data'].length > 0) {
            this.DocumentScrutinyCompleteList = data['Data'][0]['data'];
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
  async DocumentScrutiny_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    this.routers.navigate(['/documentscrutiny' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + this.QueryStringStatus]);
  }


  public PVApplicationDetailsList: any[] = [];
  public PVCommitteeList: any[] = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public ApplicationNo: string = '';
  //Application Details
  async ViewApplicationPvDetails(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    this.ApplicationNo = ApplicationNo;
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //
    await this.GetApplicationPvDetails(this.SelectedApplyNOCID);
    await this.GetPVApplicationCommitteeList(this.SelectedApplyNOCID);
    await this.GetWorkFlowRemarksByApplicationID(this.SelectedApplyNOCID);

  }
  async GetApplicationPvDetails(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.decDocumentScrutinyService.GetApplicationPvDetails(ApplyNocApplicationID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PVApplicationDetailsList = data['Data'][0]['data'];
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

  async GetPVApplicationCommitteeList(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList(ApplyNocApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PVCommitteeList = data['Data'];
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
  public WorkFlowRemarks: any = [];
  async GetWorkFlowRemarksByApplicationID(ApplyNOCID: number) {
    try {
      this.loaderService.requestStarted();
      await this.decDocumentScrutinyService.GetWorkFlowRemarksByApplicationID(ApplyNOCID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.WorkFlowRemarks = data['Data'][0]['data'];
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



