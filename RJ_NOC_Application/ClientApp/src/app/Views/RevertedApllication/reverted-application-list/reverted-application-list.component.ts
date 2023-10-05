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

@Injectable()

  @Component({
    selector: 'app-reverted-application-list',
    templateUrl: './reverted-application-list.component.html',
    styleUrls: ['./reverted-application-list.component.css']
  })
export class RevertedApplicationListComponent implements OnInit
{
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


  constructor(private committeeMasterService: CommitteeMasterService,private collegeservice: CollegeService, private toastr: ToastrService, private loaderService: LoaderService, private modalService: NgbModal,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private decDocumentScrutinyService: DCEDocumentScrutinyService) {

  }

  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.RevertedApplicationList();
  }

  async RevertedApplicationList()
  {
    try
    {
      this.loaderService.requestStarted();
      await this.collegeservice.RevertedApplicationList(this.sSOLoginDataModel.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.draftApplicatoinListData = data['Data'][0]['data'];
          console.log(this.draftApplicatoinListData);
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
    this.routers.navigate(['/applicationdetailentry' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNocApplicationID.toString())) + "/R"], { skipLocationChange: true });
  }
  async ApplicationSummary_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }

  async CheckList_OnClick(DepartmentID: number, CollegeID: number, ApplyNocApplicationID: number) {
    this.routers.navigate([]).then(result => { window.open('/revertchecklistdce' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNocApplicationID.toString())), '_blank'); });
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
}

