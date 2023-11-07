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
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { AnimalDocumentScrutinyService } from '../../../Services/AnimalDocumentScrutiny/animal-document-scrutiny.service';
import { EnumApplicationStatus, EnumDepartment } from '../../../Common/enum-noc';

@Component({
  selector: 'app-ah-final-noc-application-list',
  templateUrl: './ah-final-noc-application-list.component.html',
  styleUrls: ['./ah-final-noc-application-list.component.css']
})
export class AhFinalNocApplicationListComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public RoleID: number = 0;
  public UserID: number = 0;
  public ActionID: any = 0;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public selectedApplyNOCID: number = 0;
  public selectedCollegeID: number = 0;
  public QueryStringStatus: any = '';
  public IsDisabled: boolean = true;
  public IsPreDisabled: boolean = true;
  public IsBtnShowHide: boolean = true;
  public isRemarkValid: boolean = false;
  public FinalRemark: string = '';
  public ApplicationNO: string = '';
  public NOCFilePath: string = '';
  public btntext: string = 'Approved';
  public ActionType: string = '';

  public ApplicationTrailList: any = [];
  public ApplyNocDetails: any = [];
  public lstNOCCourse: any = [];

  constructor(private animalDocumentScrutinyService: AnimalDocumentScrutinyService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private committeeMasterService: CommitteeMasterService,
    private aadharServiceDetails: AadharServiceDetails
  ) { }

  async ngOnInit() {

    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetFinalNOCApplicationList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);

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

  async GetFinalNOCApplicationList(SSOID: string, UserID: number, RoleID: number, DepartmentID: number, QueryStringStatus: string) {
    try {
      this.loaderService.requestStarted();
      await this.animalDocumentScrutinyService.GetFinalNOCApplicationList(SSOID, UserID, RoleID, DepartmentID, QueryStringStatus)
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

  async NOCApproved_Rejected_Model(content: any, ApplyNOCID: number, CollegeID: number, ApplicationNo: string, type: string) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.selectedApplyNOCID = ApplyNOCID;
    this.selectedCollegeID = CollegeID;
    this.ApplicationNO = ApplicationNo;
    this.GetApplyNocCourse(this.selectedApplyNOCID);
    this.btntext = type;
  }

  async GetApplyNocCourse(ApplyNOCID: number) {
    this.loaderService.requestStarted();
    try {
      await this.animalDocumentScrutinyService.GetNOCCourse('GetNOCCourse', 2, ApplyNOCID, this.selectedCollegeID)
        .then((data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.lstNOCCourse = data['Data'][0]["data"];
          }
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }
  }

  async FinalNOCRejectRelese() {
    this.loaderService.requestStarted();
    try {
      this.isRemarkValid = false;
      if (this.FinalRemark == '') {
        this.isRemarkValid = true;
        return;
      }
      else {
        if (this.btntext == 'Approved')
          this.ActionType = EnumApplicationStatus.ReleaseNOC.toString();
        else
          this.ActionType = EnumApplicationStatus.RejectNOC.toString();
        await this.animalDocumentScrutinyService.FinalNOCRejectRelese(this.selectedApplyNOCID, EnumDepartment.Animal_Husbandry, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.FinalRemark, this.ActionType)
          .then((data: any) => {
            if (data != null && data != undefined) {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              this.toastr.success(this.SuccessMessage);
              this.modalService.dismissAll('After Success');
              this.GetFinalNOCApplicationList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);
            }
          }, error => console.error(error));
      }

    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }
  }
  async GenratePDF(ApplyNOCID: number, CollegeID: number) {
    this.loaderService.requestStarted();
    try {
      await this.animalDocumentScrutinyService.UpdateNOCPDFData('SaveData', EnumDepartment.Animal_Husbandry, ApplyNOCID, CollegeID, this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID)
        .then((data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.toastr.success(this.SuccessMessage);
            this.GetFinalNOCApplicationList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);
          }
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }
  }

  async DeleteImage(Type: string) {
    try {
      this.loaderService.requestStarted();
      if (Type == 'NOCFilePath') {
        this.NOCFilePath = '';
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }
  }
  async ForwardToJSDS(ApplyNOCID: number) {
    this.loaderService.requestStarted();
    try {
      this.FinalRemark = "Forward To DS/JS By Secretary";

      await this.animalDocumentScrutinyService.FinalNOCRejectRelese(ApplyNOCID, this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.FinalRemark, EnumApplicationStatus.ApproveandForward.toString())
        .then((data: any) => {
          if (data != null && data != undefined) {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.toastr.success("Forward To DS/JS By Secretary");
            this.modalService.dismissAll('After Success');
            this.GetFinalNOCApplicationList(this.sSOLoginDataModel.SSOID, this.sSOLoginDataModel.UserID, Number(this.sSOLoginDataModel.RoleID), this.sSOLoginDataModel.DepartmentID, this.QueryStringStatus);
          }
        }, error => console.error(error));

    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }
  }

  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string, Status: string) {
    if (DepartmentID = 2) {
      window.open('/animalhusbandryappnocviewByNodal' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())), "_blank");
    }
  }
}
