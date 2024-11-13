import { Component, OnInit } from '@angular/core';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RequiredDocumentsDataModel, RequiredDocumentsDataModel_Documents } from '../../../Models/TabDetailDataModel'
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeDocumentService } from '../../../Services/Tabs/CollegeDocument/college-document.service';
import { ToastrService } from 'ngx-toastr';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { DocumentScrutinyDataModel, DocumentScrutinyList_DataModel } from '../../../Models/DocumentScrutinyDataModel';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { DocumentScrutinyComponent } from '../../DCE/document-scrutiny/document-scrutiny.component';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-document-scrutiny-other-document-dce',
  templateUrl: './document-scrutiny-other-document.component.html',
  styleUrls: ['./document-scrutiny-other-document.component.css']
})
export class DocumentScrutinyOtherDocumentComponentDce implements OnInit {

  request = new RequiredDocumentsDataModel();
  isSubmitted: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedApplyNOCID: number = 0;
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();
  public FinalRemarks: any = [];
  public HospitalRealtedDocuments: RequiredDocumentsDataModel_Documents[] = []
  public QueryStringStatus: any = '';
  public isDisabledAction: boolean = false;

  constructor(private modalService: NgbModal,private dcedocumentscrutiny: DocumentScrutinyComponent, private loaderService: LoaderService,
    private commonMasterService: CommonMasterService, private collegeDocumentService: CollegeDocumentService, private router: ActivatedRoute,
    private applyNOCApplicationService: ApplyNOCApplicationService, private toastr: ToastrService, private dcedocumentScrutinyService: DCEDocumentScrutinyService) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.request.DocumentDetails = [];
    this.GetOtherDocuments('Other Document');
    //if (this.SelectedDepartmentID == 6) {
    //  this.GetHospitalRelatedDocuments('HospitalRelatedDocument');
    //}
  }
  async GetOtherDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_CollegeDocument(this.SelectedDepartmentID, this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.DocumentDetails = data['Data'][0]['CollegeDocument'][0];
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
  async GetHospitalRelatedDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.collegeDocumentService.GetList(this.SelectedDepartmentID, this.SelectedCollageID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HospitalRealtedDocuments = data['Data'][0]['data'];
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
    await this.request.DocumentDetails.forEach((i: { Action: string, Remark: string }) => {
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
    for (var i = 0; i < this.request.DocumentDetails.length; i++) {
      if (i == idx) {
        this.request.DocumentDetails[i].Remark = '';
      }
      if (this.request.DocumentDetails[i].Action == 'No') {
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

  async SubmitOtherDocumentDetail_Onclick() {
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Other Document';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.request.DocumentDetails.length; i++) {
      if (this.request.DocumentDetails[i].Action == '' || this.request.DocumentDetails[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.request.DocumentDetails[i].Action == 'No') {
        if (this.request.DocumentDetails[i].Remark == '' || this.request.DocumentDetails[i].Remark == undefined) {
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
    if (this.request.DocumentDetails.length > 0) {
      for (var i = 0; i < this.request.DocumentDetails.length; i++) {
        console.log(this.request.DocumentDetails[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.request.DocumentDetails[i].Action,
          Remark: this.request.DocumentDetails[i].Remark,
          TabRowID: this.request.DocumentDetails[i].DID,
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
    this.dcedocumentscrutiny.ViewTarilCommon(ID, ActionType);
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
  public OtherDocHistory: any = [];
  async ViewOtherDocumentHistory(content: any, DocumentName: string) {
    this.OtherDocHistory = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeTabData_History(0, 'OtherDoc', this.SelectedCollageID, DocumentName)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OtherDocHistory = data['Data'][0]['data']["Table"];
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
