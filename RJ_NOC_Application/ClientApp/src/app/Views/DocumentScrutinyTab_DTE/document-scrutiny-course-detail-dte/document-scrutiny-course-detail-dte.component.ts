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
import { DTEDocumentScrutinyService } from '../../../Services/DTEDocumentScrutiny/dtedocument-scrutiny.service';
import { DocumentScrutinyDTEComponent } from '../document-scrutiny-dte/document-scrutiny-dte.component';


@Component({
  selector: 'app-document-scrutiny-course-detail-dte',
  templateUrl: './document-scrutiny-course-detail-dte.component.html',
  styleUrls: ['./document-scrutiny-course-detail-dte.component.css']
})
export class DocumentScrutinyCourseDetailDTEComponent implements OnInit {
  public AllCourseList: any = [];
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

  public QueryStringApplicationStatus: any = '';
  constructor(private commonMasterService: CommonMasterService, private router: ActivatedRoute, private loaderService: LoaderService, private dtedocumentScrutinyService: DTEDocumentScrutinyService,
    private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService, private roomDetailsService: RoomDetailsService, private dtedocumentscrutiny: DocumentScrutinyDTEComponent) { }

  async ngOnInit() {
    this.AllCourseList = [];
    this.dsrequest = new DocumentScrutinyDataModel();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.QueryStringApplicationStatus = this.router.snapshot.paramMap.get('ApplicationStatus')?.toString();
    await this.GetCourseDetailAllList();
  }

  async GetCourseDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.dtedocumentScrutinyService.DocumentScrutiny_CourseDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, this.QueryStringApplicationStatus)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.AllCourseList = data['Data'][0]['CourseDetails'][0];
      
          this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; VerificationStep: string }) => x.RoleIDS == this.sSOLoginDataModel.RoleID )?.Remark;
          this.dsrequest.ActionID = this.FinalRemarks.find((x: { RoleIDS: number; VerificationStep: string }) => x.RoleIDS == this.sSOLoginDataModel.RoleID )?.ActionID;
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
    await this.AllCourseList.forEach((i: { Action: string, Remark: string }) => {
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
    for (var i = 0; i < this.AllCourseList.length; i++) {
      if (i == idx) {
        this.AllCourseList[i].Remark = '';
      }
      if (this.AllCourseList[i].Action == 'No') {
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
  async SubmitCourseDetail_Onclick() {
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Course Details';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.AllCourseList.length; i++) {
      if (this.AllCourseList[i].Action == '' || this.AllCourseList[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.AllCourseList[i].Action == 'No') {
        if (this.AllCourseList[i].Remark == '' || this.AllCourseList[i].Remark == undefined) {
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
    if (this.AllCourseList.length > 0) {
      for (var i = 0; i < this.AllCourseList.length; i++) {
        console.log(this.AllCourseList[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.AllCourseList[i].Action,
          Remark: this.AllCourseList[i].Remark,
          TabRowID: this.AllCourseList[i].CollegeWiseCourseID,
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
    this.dtedocumentscrutiny.ViewTarilCommon(ID, ActionType);
  }
}
