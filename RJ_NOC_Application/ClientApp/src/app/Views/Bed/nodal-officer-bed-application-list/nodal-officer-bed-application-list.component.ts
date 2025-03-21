import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyNOCApplicationDataModel, CommiteeInspection_RNCCheckList_DataModel } from '../../../Models/ApplyNOCApplicationDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from '../..//../Services/FileUpload/file-upload.service';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { CommitteeMasterDataModel, CommitteeMemberDetail } from '../../../Models/CommitteeMasterDataModel';
import { ApplicationCommitteeMemberdataModel, PostApplicationCommitteeMemberdataModel } from '../../../Models/ApplicationCommitteeMemberdataModel';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';


@Component({
  selector: 'app-nodal-officer-bed-application-list',
  templateUrl: './nodal-officer-bed-application-list.component.html',
  styleUrls: ['./nodal-officer-bed-application-list.component.css']
})
export class NodalOfficerBedApplicationListComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplyNocDetails: any[] = [];
  public request: CommiteeInspection_RNCCheckList_DataModel[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public QueryStringStatus: any = '';

  constructor(private applyNocParameterService: ApplyNocParameterService, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private decDocumentScrutinyService: DCEDocumentScrutinyService
  ) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetNodalOfficerApplyNOCApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);

  }

  async GetNodalOfficerApplyNOCApplicationList(RoleId: number, UserID: number, Status: string) {
    try {
      let ActionName = '';
      if (RoleId == 17) {
        ActionName = Status == 'Completed' ? 'Approve' : Status == 'Rejected' ? 'Reject' : Status == 'Revert' ? 'Revert' : Status == 'DraftPending' ? 'DraftFinalApplication' : Status == 'Pending' ? 'Apply NOC,ReSubmit Application' : '';

      }
      else {

        ActionName = Status == 'Completed' ? 'Approve' : Status == 'Rejected' ? 'Reject' : Status == 'Revert' ? 'Revert' : Status == 'Pending' ? 'Approve' : '';
      }
      this.loaderService.requestStarted();
      await this.decDocumentScrutinyService.GetNodalOfficerApplyNOCApplicationList(RoleId, UserID, Status, ActionName, this.sSOLoginDataModel.SessionID)
        .then((data: any) => {
          debugger
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyNocDetails = data['Data'];
        }, error => console.error(error));
      //this.loaderService.requestStarted();

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




  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }




}

