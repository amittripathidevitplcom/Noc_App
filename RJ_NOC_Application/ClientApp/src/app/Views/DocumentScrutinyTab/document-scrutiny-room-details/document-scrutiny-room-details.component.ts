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
  constructor(private commonMasterService: CommonMasterService, private router: ActivatedRoute, private loaderService: LoaderService,
    private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService, private roomDetailsService: RoomDetailsService) { }

  async ngOnInit() {
    this.RoomDetails = [];
    this.dsrequest = new DocumentScrutinyDataModel();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    await this.GetRoomDetailAllList();
  }

  async selectAll(ActionType: string) {
    await this.RoomDetails.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    })
  }
  async GetRoomDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.roomDetailsService.GetRoomDetailAllList(0, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RoomDetails = data['Data'][0]['data'];
        }, (error:any) => console.error(error));
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

  ClickOnAction(idx: number) {
    for (var i = 0; i < this.RoomDetails.length; i++) {
      if (i == idx) {
        this.RoomDetails[i].Remark = '';
      }
    }
  }

  async SubmitRoomDetail_Onclick() {
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = 0;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Room Details';
    this.isRemarkValid = false;
    this.isFormvalid = true;
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

    if (this.dsrequest.Remark == '') {
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
          UserID: 0,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.RoomDetails[i].Action,
          Remark: this.RoomDetails[i].Remark,
          TabRowID: this.RoomDetails[i].CollegeWiseRoomID
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
}
