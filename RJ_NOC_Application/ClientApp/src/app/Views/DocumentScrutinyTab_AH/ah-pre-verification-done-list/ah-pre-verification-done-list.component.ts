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
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { AnimalDocumentScrutinyService } from '../../../Services/AnimalDocumentScrutiny/animal-document-scrutiny.service';
import { EnumCheckListType_AH } from '../../../Common/enum-noc';

@Component({
  selector: 'app-ah-pre-verification-done-list',
  templateUrl: './ah-pre-verification-done-list.component.html',
  styleUrls: ['./ah-pre-verification-done-list.component.css']
})
export class AhPreVerificationDoneListComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplyNocDetails: any = [];
  public request: CommiteeInspection_RNCCheckList_DataModel[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public ActionID: any = 0;
  public ActionName: string = '';
  public IsRemarksReject: boolean = false;
  public isRemarkValid: boolean = false;
  public isActionTypeValid: boolean = false;
  public CheckFinalRemark: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public ApplicationTrailList: any[] = [];
  public CheckListData: any[] = [];
  public FinalCheckListData: any[] = [];
  public FinalRemark: string = '';
  public selectedApplyNOCID: number = 0;

  public QueryStringStatus: any = '';
  public IsDisabled: boolean = true;
  public IsPreDisabled: boolean = true;
  public IsBtnShowHide: boolean = true;

  constructor(private animalDocumentScrutinyService: AnimalDocumentScrutinyService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private committeeMasterService: CommitteeMasterService,
    private aadharServiceDetails: AadharServiceDetails
  ) { }

  async ngOnInit() {

    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetPreVerificationDoneList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);

    if (this.QueryStringStatus == 'Pending') {
      this.IsPreDisabled = false;
      this.IsBtnShowHide = true;
      this.ActionID = 0;
    }
    else if (this.QueryStringStatus == 'Completed') {
      this.IsPreDisabled = true;
      this.IsBtnShowHide = false;
      this.ActionID = 1;
    }
    else if (this.QueryStringStatus == 'Rejected') {
      this.IsPreDisabled = true;
      this.IsBtnShowHide = false;
      this.ActionID = 2;
    }
  }

  async GetPreVerificationDoneList(SSOID: string, UserID: number, RoleID: number, DepartmentID: number, QueryStringStatus: string) {
    try {
      this.loaderService.requestStarted();
      await this.animalDocumentScrutinyService.GetPreVerificationDoneList(SSOID, UserID, RoleID, DepartmentID, QueryStringStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyNocDetails = data['Data'][0]['data'];
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

  async OpenActionPopUP(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.selectedApplyNOCID = ApplyNOCID;
    this.GetRNCCheckListByTypeDepartment(this.selectedApplyNOCID);
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

  async GetRNCCheckListByTypeDepartment(ApplyNOCID: number) {
    try {
      this.CheckListData = [];
      this.FinalRemark = '';
      if (this.QueryStringStatus == 'Pending') {
        this.ActionID = 0;
      }

      this.CheckFinalRemark = '';
      this.isRemarkValid = false;
      this.isActionTypeValid = false;
      this.IsRemarksReject = false;
      this.ActionName = '';
      this.loaderService.requestStarted();
      await this.animalDocumentScrutinyService.GetPreVerificationchecklistDetails(EnumCheckListType_AH.PVCRD.toString(), this.sSOLoginDataModel.DepartmentID, ApplyNOCID, this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckListData = data['Data'];
          this.FinalRemark = this.CheckListData[0].FinalRemark;
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

  async OnChangeCurrentAction(ActionID: any) {
    if (ActionID == 2 || ActionID == '2') {
      this.IsRemarksReject = true;
    }
    else {
      this.IsRemarksReject = false;
    }
  }
  async SubmitPhysicalVerification() {
    this.request = [];
    this.isRemarkValid = false;
    this.isActionTypeValid = false;
    this.ActionName = '';
    try {

      if (this.ActionID == 0) {
        this.isActionTypeValid = true;
        this.CheckFinalRemark = 'Pre Verification Approved';
        return;
      }
      else {
        if (this.ActionID == 2) {
          this.ActionName = 'Pre Verification Rejected';
          if (this.CheckFinalRemark == '' || this.CheckFinalRemark == null) {
            this.isRemarkValid = true;
            return;
          }
        }
        else {
          this.ActionName = 'Pre Verification Approved';
        }
      }
      if (this.ActionName != '') {
        await this.animalDocumentScrutinyService.FinalSubmitPreVerification(this.selectedApplyNOCID, this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.UserID, this.ActionName, this.CheckFinalRemark)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              window.location.reload();
            }
            else if (this.State == 1) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
          }, error => console.error(error));
      }
      else
        this.toastr.warning("Select Pre Verification Application Action")
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

  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string, Status: string) {
    if (DepartmentID = 2) {
      //this.routers.navigate(['/animalhusbandryappnocpreview' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString()))]);
      //this.routers.navigate(['/animalhusbandryappnocviewByNodal' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString()))]);
      window.open('/animalhusbandryappnocviewByNodal' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())), "_blank");
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
}
