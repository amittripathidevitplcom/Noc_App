import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OldNocDataModel, OldNocDetailsDataModel, OldNocDetails_SubjectDataModel } from '../../../Models/TabDetailDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OldnocdetailService } from '../../../Services/OldNOCDetail/oldnocdetail.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import * as XLSX from 'xlsx';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { CollegeDocumentService } from '../../../Services/Tabs/CollegeDocument/college-document.service';
import { DocumentScrutinyDataModel, DocumentScrutinyList_DataModel } from '../../../Models/DocumentScrutinyDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { BuildingDetailsMasterService } from '../../../Services/BuildingDetailsMaster/building-details-master.service'
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { DocumentScrutinyComponent } from '../../DCE/document-scrutiny/document-scrutiny.component';



@Component({
  selector: 'app-document-scrutiny-old-nocdetails-dce',
  templateUrl: './document-scrutiny-old-nocdetails.component.html',
  styleUrls: ['./document-scrutiny-old-nocdetails.component.css']
})
export class DocumentScrutinyOldNOCDetailsComponentDce implements OnInit {

  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public OldNocDetails: OldNocDetailsDataModel[] = [];
  public SubjectDataModel: OldNocDetails_SubjectDataModel[] = [];
  request = new OldNocDetailsDataModel();

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

 
  isSubmitted: boolean = false;
  public SelectedApplyNOCID: number = 0;
  dsrequest = new DocumentScrutinyDataModel();
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  //public RequiredDocumentsAllList: any = [];

  public FinalRemarks: any = [];

  constructor(private dcedocumentscrutiny: DocumentScrutinyComponent, private oldnocdetailService: OldnocdetailService, private commonMasterService: CommonMasterService, private formBuilder: FormBuilder, private fileUploadService: FileUploadService, private dcedocumentScrutinyService: DCEDocumentScrutinyService,
    private loaderService: LoaderService, private router: ActivatedRoute, private modalService: NgbModal, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService, private routers: Router) { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    await this.GetOldNOCDetailList_DepartmentCollegeWise(); 

  }
  async GetOldNOCDetailList_DepartmentCollegeWise() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_OldNOCDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.OldNocDetails = data['Data'][0]['OldNOCDetails'];
          this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
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

  async ViewOldNOCDetail(content: any, OldNocID: number) {
    this.request = new OldNocDetailsDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.oldnocdetailService.GetOldNOCDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, OldNocID)
        .then((data: any) => {
          const display = document.getElementById('ModalViewOldNOCDetail');
          if (display) display.style.display = 'block';
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request = data['Data'][0];
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
  async selectAll(ActionType: string) {
    await this.OldNocDetails.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    })
  }

  ClickOnAction(idx: number) {
    for (var i = 0; i < this.OldNocDetails.length; i++) {
      if (i == idx) {
        this.OldNocDetails[i].Remark = '';
      }
    }
  }

  async SubmitOldNOCDetails_Onclick() {
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'OLD NOC Details';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.OldNocDetails.length; i++) {
      if (this.OldNocDetails[i].Action == '' || this.OldNocDetails[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.OldNocDetails[i].Action == 'No') {
        if (this.OldNocDetails[i].Remark == '' || this.OldNocDetails[i].Remark == undefined) {
          this.toastr.warning('Please enter remark');
          return;
        }
      }
    }

    if (this.dsrequest.FinalRemark == '' || this.dsrequest.FinalRemark == undefined) {
      this.isRemarkValid = true;
      this.isFormvalid = false;
    }
    if (!this.isFormvalid) {
      return;
    }
    if (this.OldNocDetails.length > 0) {
      for (var i = 0; i < this.OldNocDetails.length; i++) {
        console.log(this.OldNocDetails[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.OldNocDetails[i].Action,
          Remark: this.OldNocDetails[i].Remark,
          TabRowID: this.OldNocDetails[i].OldNocID,
          SubTabName:''
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
    this.dcedocumentscrutiny.ViewTarilCommon(ID, ActionType);
  }
}
