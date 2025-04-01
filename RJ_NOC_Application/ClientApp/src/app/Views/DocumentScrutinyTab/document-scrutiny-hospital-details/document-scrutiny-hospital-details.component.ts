import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { HospitalDataModel, HospitalParentNotDataModel } from '../../../Models/HospitalDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { HospitalDetailService } from '../../../Services/Tabs/HospitalDetail/hospital-detail.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DocumentScrutinyDataModel, DocumentScrutinyList_DataModel } from '../../../Models/DocumentScrutinyDataModel';
import { ToastrService } from 'ngx-toastr';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { LegalEntityDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { ApplyNOCPreviewComponent } from '../../apply-nocpreview/apply-nocpreview.component';

@Component({
  selector: 'app-document-scrutiny-hospital-details',
  templateUrl: './document-scrutiny-hospital-details.component.html',
  styleUrls: ['./document-scrutiny-hospital-details.component.css']
})
export class DocumentScrutinyHospitalDetailsComponent implements OnInit {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public HospitalList: any = [];
  public IsShowSuperSpecialtyHospital: boolean = false;
  public HospitalData: any = {};
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public SelectedApplyNOCID: number = 0;
  public UnitOfLand: string = '';

  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();
  public FinalRemarks: any = [];
  public isDisabledAction: boolean = false;
  public QueryStringStatus: any = '';

  constructor(private ApplyNOCPreview: ApplyNOCPreviewComponent,private TrusteeGeneralInfoService: TrusteeGeneralInfoService,private medicalDocumentScrutinyService: MedicalDocumentScrutinyService,private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,private modalService: NgbModal, private hospitalDetailService: HospitalDetailService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private fileUploadService: FileUploadService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetHospitalDataList();
  }
  async GetHospitalDataList() {
    this.loaderService.requestStarted();
    try {
      await this.medicalDocumentScrutinyService.DocumentScrutiny_HospitalDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.HospitalList = data['Data'][0]['HospitalDetails'][0];
            this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
            this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
            this.dsrequest.ActionID = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.ActionID;
            if (this.dsrequest.ActionID == 2) {
              this.isDisabledAction = true;
            }
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  public viewrequest: any = {};
  async ViewHospitalDetail(content: any, HospitalID: number) {
    this.viewrequest = {};
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.GetMGThreeHospitalDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, HospitalID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.viewrequest = data['Data'][0];
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
    await this.HospitalList.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
      if (ActionType == 'No') {
        this.dsrequest.ActionID = 2;
        this.isDisabledAction = true;
      }
      else {
        this.dsrequest.ActionID = 0;
        this.isDisabledAction = false;
      }
    })
  }


  ClickOnAction(idx: number) {
    var Count = 0;
    for (var i = 0; i < this.HospitalList.length; i++) {
      if (i == idx) {
        this.HospitalList[i].Remark = '';
      }
      if (this.HospitalList[i].Action == 'No') {
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
  async SubmitHospitalDetail_Onclick() {
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Hospital Details';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.HospitalList.length; i++) {
      if (this.HospitalList[i].Action == '' || this.HospitalList[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.HospitalList[i].Action == 'No') {
        if (this.HospitalList[i].Remark == '' || this.HospitalList[i].Remark == undefined) {
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
    if (this.HospitalList.length > 0) {
      for (var i = 0; i < this.HospitalList.length; i++) {
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.HospitalList[i].Action,
          Remark: this.HospitalList[i].Remark,
          TabRowID: this.HospitalList[i].HospitalID,
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



  public HospitalHistory: any = [];
  public AffiliatedHospitalHistory: any = [];
  async ViewHospitalDetailHistory(content: any, ID: number) {
    this.HospitalHistory = [];
    this.AffiliatedHospitalHistory = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeTabData_History(ID, 'HospitalDetails')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.HospitalHistory = data['Data'][0]['data']["Table"];
          this.AffiliatedHospitalHistory = data['Data'][0]['data']["Table1"];
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
