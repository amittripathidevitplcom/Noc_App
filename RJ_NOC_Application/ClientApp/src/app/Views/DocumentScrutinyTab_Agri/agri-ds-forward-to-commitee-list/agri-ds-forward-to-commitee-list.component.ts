import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonMasterDataModel } from '../../../Models/CommonMasterDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { EnumCommitteActionType, EnumCommitteType } from '../../../Common/enum-noc';

@Component({
  selector: 'app-agri-ds-forward-to-commitee-list',
  templateUrl: './agri-ds-forward-to-commitee-list.component.html',
  styleUrls: ['./agri-ds-forward-to-commitee-list.component.css']
})
export class AgriDsForwardToCommiteeListComponent {

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public DocumentScrutinyForwardCommiteeList: any = [];
  public ApplicationTrailList: any = [];
  public ApplicationCommitteeList: any = [];

  public CommitteType: string = '';
  public CommitteMemberType: string = '';
  public ApplicationNo: string = '';


  constructor(private committeeMasterService: CommitteeMasterService, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private modalService: NgbModal) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.sSOLoginDataModel.RoleID == 29) {
      this.CommitteType = EnumCommitteActionType.FTC;
      this.CommitteMemberType = EnumCommitteType.Pre;
    }
    await this.GeForwardCommiteeAgriList(this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID);

  }

  async GeForwardCommiteeAgriList(UserID: number, RoleID: number, DepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GeForwardCommiteeAHList(UserID, this.CommitteType, RoleID, DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'][0]['data'].length > 0) {
            this.DocumentScrutinyForwardCommiteeList = data['Data'][0]['data'];
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

  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string, Status: string) {
    window.open('/Previewbynodalofficer' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())), "_blank");
  }

  async GetApplicationCommitteeList(content: any, ApplyNocApplicationID: number, ApplicationNo: any) {
    this.ApplicationNo = ApplicationNo;
    try {

      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList_AH(ApplyNocApplicationID, this.CommitteMemberType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationCommitteeList = data['Data'];
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
