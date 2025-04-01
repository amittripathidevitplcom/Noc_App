import { Component, OnInit } from '@angular/core';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DocumentScrutinyDataModel, DocumentScrutinyList_DataModel } from '../../../Models/DocumentScrutinyDataModel';
import { ToastrService } from 'ngx-toastr';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { RoomDetailsDataModel_RoomDetails } from '../../../Models/RoomDetailsDataModel';
import { RoomDetailsService } from '../../../Services/RoomDetails/room-details.service';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { ApplyNOCPreviewComponent } from '../../apply-nocpreview/apply-nocpreview.component';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-document-scrutiny-room-details',
  templateUrl: './document-scrutiny-room-details.component.html',
  styleUrls: ['./document-scrutiny-room-details.component.css']
})
export class DocumentScrutinyRoomDetailsComponent implements OnInit {
  public RoomDetails: RoomDetailsDataModel_RoomDetails[] = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;

  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public FinalRemarks: any = [];
  public QueryStringStatus: any = '';
  public isDisabledAction: boolean = false;
  constructor(private modalService: NgbModal, private ApplyNOCPreview: ApplyNOCPreviewComponent, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private loaderService: LoaderService, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService,
    private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService, private roomDetailsService: RoomDetailsService) { }

  async ngOnInit() {
    this.RoomDetails = [];
    this.dsrequest = new DocumentScrutinyDataModel();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetRoomDetailAllList();
  }

  async GetRoomDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_RoomDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.RoomDetails = data['Data'][0]['RoomDetails'];
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
    await this.RoomDetails.forEach((i: { Action: string, Remark: string }) => {
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
    for (var i = 0; i < this.RoomDetails.length; i++) {
      if (i == idx) {
        this.RoomDetails[i].Remark = '';
      }
      if (this.RoomDetails[i].Action == 'No') {
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
  async SubmitRoomDetail_Onclick() {
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Room Details';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.RoomDetails.length; i++) {
      if (this.RoomDetails[i].Action == '' || this.RoomDetails[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.RoomDetails[i].Action == 'No') {
        if (this.RoomDetails[i].Remark == '' || this.RoomDetails[i].Remark == undefined) {
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
    if (this.RoomDetails.length > 0) {
      for (var i = 0; i < this.RoomDetails.length; i++) {
        console.log(this.RoomDetails[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.RoomDetails[i].Action,
          Remark: this.RoomDetails[i].Remark,
          TabRowID: this.RoomDetails[i].CollegeWiseRoomID,
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
  public ClassRoomHistory: any = [];
  async ViewClassRoomDetailHistory(content: any, ID: number) {
    this.ClassRoomHistory = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeTabData_History(ID, 'ClassRoomDetails')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ClassRoomHistory = data['Data'][0]['data']["Table"];
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
