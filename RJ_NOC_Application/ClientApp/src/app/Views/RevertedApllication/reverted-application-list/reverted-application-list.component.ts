import { Component, OnInit, Input, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { MGOneDocumentScrutinyService } from '../../../Services/MGOneDocumentScrutiny/mgonedocument-scrutiny.service';

@Injectable()

@Component({
  selector: 'app-reverted-application-list',
  templateUrl: './reverted-application-list.component.html',
  styleUrls: ['./reverted-application-list.component.css']
})
export class RevertedApplicationListComponent implements OnInit {
  //Add FormBuilder
  ProjectMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/

  public UserID: number = 0;
  public draftApplicatoinListData: any = [];
  searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  closeResult: string | undefined;
  public RevertRemarks: string = '';


  constructor(private committeeMasterService: CommitteeMasterService, private collegeservice: CollegeService, private toastr: ToastrService, private loaderService: LoaderService, private modalService: NgbModal,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private decDocumentScrutinyService: DCEDocumentScrutinyService, private mg1DocumentScrutinyService: MGOneDocumentScrutinyService) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.RevertedApplicationList();
  }

  async RevertedApplicationList() {
    try {
      this.loaderService.requestStarted();
      await this.collegeservice.RevertedApplicationList(this.sSOLoginDataModel.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.draftApplicatoinListData = data['Data'][0]['data'];
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

  async DraftEdit_OnClick(DepartmentID: number, CollegeID: number, ApplyNocApplicationID: number) {
    if (DepartmentID == 5) {

      this.routers.navigate(['/applicationdetailentrymgone' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNocApplicationID.toString())) + "/R"]);
    }
    else if (DepartmentID == 4)
    {
      this.routers.navigate(['/applicationdetailentrydte' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNocApplicationID.toString())) + "/R"]);
    }
    else {
      this.routers.navigate(['/applicationdetailentry' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNocApplicationID.toString())) + "/R"]);
    }
  }
  async ApplicationSummary_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }

  async CheckList_OnClick(content: any, DepartmentID: number, CollegeID: number, ApplyNocApplicationID: number, ActionID: number, RevertByRole: number) {
    if (DepartmentID == 5) {
      await this.GetRevertApllicationRemark(DepartmentID, ApplyNocApplicationID);
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else if (DepartmentID == 4) {
      var VerificationStep = ActionID == 3 ? 'Step1' : ActionID == 60 ? 'Step2' : 'NoStep';
      this.routers.navigate([]).then(result => { window.open('/revertchecklistdte' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNocApplicationID.toString())) + "/" + VerificationStep, '_blank'); });
    }
    else if (DepartmentID == 3) {
      if (RevertByRole != 17) {
        await this.GetRevertApplicationRemarkByDepartment(DepartmentID, ApplyNocApplicationID, RevertByRole);
        this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
      else {
        this.routers.navigate([]).then(result => { window.open('/revertchecklistdce' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNocApplicationID.toString())), '_blank'); });
      }
    }
    else {
      this.routers.navigate([]).then(result => { window.open('/revertchecklistdce' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNocApplicationID.toString())), '_blank'); });
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

  async ViewApplicationPvDetails(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //
    await this.GetApplicationPvDetails(ApplyNOCID);
    //await this.GetPVApplicationCommitteeList(ApplyNOCID);
    await this.GetWorkFlowRemarksByApplicationID(ApplyNOCID);

  }
  public PVApplicationDetailsList: any[] = [];
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
  public PVCommitteeList: any[] = [];
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
  async GetRevertApllicationRemark(DepartmentID: number, ApplicationID: number) {
    try {
      this.loaderService.requestStarted();
      await this.mg1DocumentScrutinyService.GetRevertApllicationRemark(DepartmentID, ApplicationID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'][0].length > 0) {
            this.RevertRemarks = data['Data'][0][0]['Remark'];
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

  async GetRevertApplicationRemarkByDepartment(DepartmentID: number, ApplicationID: number, RoleID: number) {
    try {
      this.loaderService.requestStarted();
      await this.decDocumentScrutinyService.GetRevertApplicationRemarkByDepartment(DepartmentID, ApplicationID, RoleID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'][0].length > 0) {
            this.RevertRemarks = data['Data'][0][0]['Remark'];
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
}

