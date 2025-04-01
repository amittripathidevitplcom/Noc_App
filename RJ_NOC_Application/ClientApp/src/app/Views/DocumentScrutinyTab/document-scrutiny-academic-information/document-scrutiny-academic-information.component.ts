import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicInformationDetailsDataModel } from '../../../Models/AcademicInformationDetailsDataModel';
import { AcademicInformationDetailsService } from '../../../Services/AcademicInformationDetails/academic-information-details.service';
import { ToastrService } from 'ngx-toastr';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { DocumentScrutinyDataModel, DocumentScrutinyList_DataModel } from '../../../Models/DocumentScrutinyDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { ApplyNOCPreviewComponent } from '../../apply-nocpreview/apply-nocpreview.component';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-document-scrutiny-academic-information',
  templateUrl: './document-scrutiny-academic-information.component.html',
  styleUrls: ['./document-scrutiny-academic-information.component.css']
})
export class DocumentScrutinyAcademicInformationComponent implements OnInit {
  public AcademicInformationList: AcademicInformationDetailsDataModel[] = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedApplyNOCID: number = 0;
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();
  public FinalRemarks: any = [];
  public QueryStringStatus: any = '';
  public isDisabledAction: boolean = false;
  constructor(private modalService: NgbModal, private ApplyNOCPreview: ApplyNOCPreviewComponent, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService, private academicInformationDetailsService: AcademicInformationDetailsService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute,
    private applyNOCApplicationService: ApplyNOCApplicationService, private toastr: ToastrService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()))
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetAcademicInformationDetailAllList();
  }
  async GetAcademicInformationDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_AcademicInformation(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AcademicInformationList = data['Data'][0]['AcademicInformations'];
          this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
          this.dsrequest.ActionID = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.ActionID;
          if (this.dsrequest.ActionID == 2) {
            this.isDisabledAction = true;
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

  async selectAll(ActionType: string) {
    await this.AcademicInformationList.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    });
    if (ActionType == 'No') {
      this.dsrequest.ActionID = 2;
      this.isDisabledAction = true;
    }
    else {
      this.dsrequest.ActionID = 0;
      this.isDisabledAction = false;
    }
  }


  ClickOnAction(idx: number) {
    var Count = 0;
    for (var i = 0; i < this.AcademicInformationList.length; i++) {
      if (i == idx) {
        this.AcademicInformationList[i].Remark = '';
      }
      if (this.AcademicInformationList[i].Action == 'No') {
        Count++;
      }
    }
    if (Count > 0) {
      this.dsrequest.ActionID = 2;
      this.isDisabledAction = true;
    }
    else {
      this.dsrequest.ActionID = 0;
      this.isDisabledAction = false;
    }
  }
  public isSubmitted: boolean = false;

  async SubmitAcademicInformationDetail_Onclick() {
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Academic Information';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.AcademicInformationList.length; i++) {
      if (this.AcademicInformationList[i].Action == '' || this.AcademicInformationList[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.AcademicInformationList[i].Action == 'No') {
        if (this.AcademicInformationList[i].Remark == '' || this.AcademicInformationList[i].Remark == undefined) {
          this.toastr.warning('Please enter remark');
          return;
        }
      }
    }
    if (this.dsrequest.ActionID <= 0) {
      this.isFormvalid = false;
    }
    if (this.dsrequest.FinalRemark == '' || this.dsrequest.FinalRemark == undefined) {
      this.isRemarkValid = true;
      this.isFormvalid = false;
    }
    if (!this.isFormvalid) {
      return;
    }
    if (this.AcademicInformationList.length > 0) {
      for (var i = 0; i < this.AcademicInformationList.length; i++) {
        console.log(this.AcademicInformationList[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.AcademicInformationList[i].Action,
          Remark: this.AcademicInformationList[i].Remark,
          TabRowID: this.AcademicInformationList[i].AcademicInformationID,
          SubTabName: ''
        });
      }
    }
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.SaveDocumentScrutiny(this.dsrequest)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.isRemarkValid = false;
            this.isFormvalid = true;
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ViewTaril(ID: number, ActionType: string) {
    this.ApplyNOCPreview.ViewTarilCommon(ID, ActionType);
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
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public AcademicHistory: any = [];
  async ViewAcademicDetailHistory(content: any, ID: number) {
    this.AcademicHistory = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeTabData_History(ID, 'AcademicDetails')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AcademicHistory = data['Data'][0]['data']["Table"];
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
