import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { CommonDataModel_ApplicationListFilter } from '../../../Models/ApplyNOCApplicationDataModel';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mgthree-applications-list',
  templateUrl: './mgthree-applications-list.component.html',
  styleUrls: ['./mgthree-applications-list.component.css']
})
export class MGThreeApplicationsListComponent implements OnInit {

  sSOLoginDataModel = new SSOLoginDataModel();
  request= new CommonDataModel_ApplicationListFilter();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplyNocDetails: any = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public QueryStatus: any = '';

  constructor(private loaderService: LoaderService, private toastr: ToastrService, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private modalService: NgbModal) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.request.RoleID = this.sSOLoginDataModel.RoleID;
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.request.SessionYear = this.sSOLoginDataModel.SessionID;
    this.request.Status = this.QueryStatus;
    await this.GetWorkflowPermissions();
    await this.GetApplyNOCApplicationListByRole();
  }

  async GetApplyNOCApplicationListByRole() {
    try {
      if (this.QueryStatus == 'Pending' && (this.sSOLoginDataModel.RoleID == 5 || this.sSOLoginDataModel.RoleID == 3 )) {
        this.request.ActionName = 'Apply NOC,Forward To';
      }
      else if (this.QueryStatus == 'DCPending' && (this.sSOLoginDataModel.RoleID == 2 || this.sSOLoginDataModel.RoleID == 3 || this.sSOLoginDataModel.RoleID == 5 || this.sSOLoginDataModel.RoleID == 6)) {
        this.request.ActionName = 'Forward To,Forward after document scrutiny';
      }
      else if (this.QueryStatus == 'Completed' && (this.sSOLoginDataModel.RoleID == 5 || this.sSOLoginDataModel.RoleID == 3|| this.sSOLoginDataModel.RoleID == 2)) {
        this.request.ActionName = 'Forward To';
      }
      else if (this.QueryStatus == 'DCCompleted' && (this.sSOLoginDataModel.RoleID == 2 || this.sSOLoginDataModel.RoleID == 3 || this.sSOLoginDataModel.RoleID == 5|| this.sSOLoginDataModel.RoleID == 6)) {
        this.request.ActionName = 'Forward after document scrutiny';
      }
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.GetApplyNOCApplicationList(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyNocDetails = data['Data'];
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
  public WorkflowPermissionslst: any = [];
  async GetWorkflowPermissions() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetWorkflowPermissions(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.WorkflowPermissionslst = data['Data'][0];
          console.log(this.WorkflowPermissionslst);
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
  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }
  public ApplicationTrailList: any = [];
  closeResult: string | undefined;
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
  async ApplicationForward(DepartmentID: number, CollegeID: number, ApplyNOCID: number) {
    this.routers.navigate(['/applicationforward' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + "Pending"]);
  }

  async DocumentScrutiny(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    this.routers.navigate(['/documentscrutinymgthree' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(this.request.Status.toString()))]);
    
  }
}
