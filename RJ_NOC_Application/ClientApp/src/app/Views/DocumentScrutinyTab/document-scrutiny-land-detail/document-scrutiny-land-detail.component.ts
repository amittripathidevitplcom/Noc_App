import { Component, OnInit } from '@angular/core';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { LandDetailDataModel } from '../../../Models/LandDetailDataModel';
import { LandDetailsService } from '../../../Services/Tabs/LandDetails/land-details.service'
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DocumentScrutinyDataModel, DocumentScrutinyList_DataModel } from '../../../Models/DocumentScrutinyDataModel';
import { ToastrService } from 'ngx-toastr';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { ApplyNOCPreviewComponent } from '../../apply-nocpreview/apply-nocpreview.component';

@Component({
  selector: 'app-document-scrutiny-land-detail',
  templateUrl: './document-scrutiny-land-detail.component.html',
  styleUrls: ['./document-scrutiny-land-detail.component.css']
})
export class DocumentScrutinyLandDetailComponent implements OnInit {
  public QueryStringStatus: any = '';
  request = new LandDetailDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public LandDetailList: LandDetailDataModel[] = [];
  public FinalRemarks: any = [];
  public UnitOfLand: string = '';

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public LandDetailsDocumentListByID: any = [];
  public DetailoftheLand: any = [];
  public CollegeLandConverstion: any = [];
  public isDisabledAction: boolean = false;

  public LandDetailHistory: any = [];
  public LandDetailsDocumentListHistory: any = [];
  public DetailoftheLandHistory: any = [];
  constructor(private landDetailsService: LandDetailsService, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private loaderService: LoaderService,
    private modalService: NgbModal, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService, private ApplyNOCPreview: ApplyNOCPreviewComponent) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetLandDetailsDataList();

    await this.GetUnitOfLandArea(this.SelectedDepartmentID, 'LandUnit');
  }
  async GetLandDetailsDataList() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_LandDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LandDetailList = data['Data'][0]['LandDetails'][0];
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

  async GetUnitOfLandArea(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UnitOfLand = data['Data'][0]['Name'];

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

  async ViewLandDetail(content: any, LandDetailID: number) {
    this.request = new LandDetailDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.landDetailsService.GetLandDetailsIDWise(LandDetailID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
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
    await this.LandDetailList.forEach((i: { Action: string, Remark: string }) => {
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
    for (var i = 0; i < this.LandDetailList.length; i++) {
      if (i == idx) {
        this.LandDetailList[i].Remark = '';
      }
      if (this.LandDetailList[i].Action == 'No') {
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
  async SubmitLandDetail_Onclick() {
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Land Information';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.LandDetailList.length; i++) {
      if (this.LandDetailList[i].Action == '' || this.LandDetailList[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.LandDetailList[i].Action == 'No') {
        if (this.LandDetailList[i].Remark == '' || this.LandDetailList[i].Remark == undefined) {
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
    if (this.LandDetailList.length > 0) {
      for (var i = 0; i < this.LandDetailList.length; i++) {
        console.log(this.LandDetailList[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.LandDetailList[i].Action,
          Remark: this.LandDetailList[i].Remark,
          TabRowID: this.LandDetailList[i].LandDetailID,
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
  async ViewLandDetailHistory(content: any, LandDetailID: number) {
    this.LandDetailHistory = [];
    this.LandDetailsDocumentListHistory = [];
    this.DetailoftheLandHistory = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeTabData_History(LandDetailID, 'LandDetails')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LandDetailHistory = data['Data'][0]['data']["Table"];
          this.LandDetailsDocumentListHistory = data['Data'][0]['data']["Table1"];
          this.DetailoftheLandHistory = data['Data'][0]['data']["Table2"];
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
