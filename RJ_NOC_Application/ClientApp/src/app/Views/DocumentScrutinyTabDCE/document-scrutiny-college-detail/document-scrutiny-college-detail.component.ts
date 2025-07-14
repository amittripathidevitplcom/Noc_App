import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { DocumentScrutinyComponent } from '../../DCE/document-scrutiny/document-scrutiny.component';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PresentCollegeStatusDataModel } from '../../../Models/CollegeDataModel';

@Component({
  selector: 'app-document-scrutiny-college-detail-dce',
  templateUrl: './document-scrutiny-college-detail.component.html',
  styleUrls: ['./document-scrutiny-college-detail.component.css']
})
export class DocumentScrutinyCollegeDetailComponentDce implements OnInit {
  constructor(private modalService: NgbModal,private dcedocumentscrutiny: DocumentScrutinyComponent,private dceDocumentScrutinyService: DCEDocumentScrutinyService,private applyNOCApplicationService: ApplyNOCApplicationService,private draftApplicationListService: DraftApplicationListService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private collegeService: CollegeService, private sSOLoginService: SSOLoginService) {

  }
  public QueryStringStatus: any = '';

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;

  public UserID: number = 0;
  public draftApplicatoinListData: any = [];
  public collegeListData: any = [];
  public collegeContactDetailsList: any = [];
  public collegeNearestGovernmentHospitalsList: any = [];
  public searchText: string = '';
  public SsoValidationMessage: string = '';
  public SsoSuccessMessage: string = '';

  // sso ligin
  sSOLoginDataModel = new SSOLoginDataModel();
  sSOVerifyDataModel = new SSOLoginDataModel();
  public CollegeID: number = 0;
  public ModifyBy: number = 0;

  //
  public SSOID: string = '';
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();

  public FinalRemarks: any = [];
  public isDisabledAction: boolean = false;

  public PresentCollegeStatusList: any = [];
  request = new PresentCollegeStatusDataModel();
  

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString())
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()))
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()))
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.ModifyBy = 1;
    // get college list
    await this.ViewTotalCollegeDataByID();
  }
  async ViewTotalCollegeDataByID() {
    try {
      this.loaderService.requestStarted();
      await this.dceDocumentScrutinyService.DocumentScrutiny_CollegeDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          // data
          this.collegeListData = data['Data'][0]['CollegeDetails'][0][0];
          this.collegeContactDetailsList = data['Data'][0]['CollegeContactDetails'][0];
          this.collegeNearestGovernmentHospitalsList = data['Data'][0]['CollegeNearestHospitalsDetails'][0];
          this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
          this.dsrequest.ActionID = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.ActionID;
        }, (error: any) => console.error(error));
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
    await this.collegeNearestGovernmentHospitalsList.forEach((i: { Action: string, Remark: string }) => {
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
    for (var i = 0; i < this.collegeNearestGovernmentHospitalsList.length; i++) {
      if (i == idx) {
        this.collegeNearestGovernmentHospitalsList[i].Remark = '';
      }
      if (this.collegeNearestGovernmentHospitalsList[i].Action == 'No') {
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
  async SubmitCollegeDetail_Onclick() {
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'College Detail';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.collegeNearestGovernmentHospitalsList.length; i++) {
      if (this.collegeNearestGovernmentHospitalsList[i].Action == '' || this.collegeNearestGovernmentHospitalsList[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.collegeNearestGovernmentHospitalsList[i].Action == 'No') {
        if (this.collegeNearestGovernmentHospitalsList[i].Remark == '' || this.collegeNearestGovernmentHospitalsList[i].Remark == undefined) {
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
    if (this.collegeNearestGovernmentHospitalsList.length > 0) {
      for (var i = 0; i < this.collegeNearestGovernmentHospitalsList.length; i++) {
        console.log(this.collegeNearestGovernmentHospitalsList[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.collegeNearestGovernmentHospitalsList[i].Action,
          Remark: this.collegeNearestGovernmentHospitalsList[i].Remark,
          TabRowID: this.collegeNearestGovernmentHospitalsList[i].NearestGovernmentHospitalsID,
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
  public collegeListHistory: any = [];
  public collegeContactDetailsHistoryList: any = [];
  async ViewCollegeDetailHistory(content: any, ID: number) {
    this.collegeListHistory = [];
    this.collegeContactDetailsHistoryList = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeTabData_History(this.SelectedCollageID, 'CollegeDetails')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.collegeListHistory = data['Data'][0]['data']["Table"];
          this.collegeContactDetailsHistoryList = data['Data'][0]['data']["Table1"];
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


  async ViewCollegePresentCollegeStatusForL1(event: any, SeletedDepartmentID: string) {

    this.modalService.open(event, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {

      this.loaderService.requestStarted();
      const departmentId = Number(this.SelectedDepartmentID.toString());
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "PresentCollegeStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PresentCollegeStatusList = data['Data'];
          this.request.PresentCollegeStatusID = Number(this.collegeListData.PresentCollegeStatusID);
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

  async submitPresentCollegeStatusForm() {
    try {

      this.loaderService.requestStarted();
      this.request.DepartmentID = Number(this.SelectedDepartmentID);
      this.request.CollegeID = Number(this.SelectedCollageID);
      this.request.PresentCollegeStatusID = Number(this.request.PresentCollegeStatusID);
      if (this.request.PresentCollegeStatusID == 0) {

        this.toastr.warning('Please Select Present College Status Type');
        return;

      }
      await this.applyNOCApplicationService.SaveCollegePresentCollegeStatusForL1(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.modalService) {
            this.modalService.dismissAll(); // Or dismiss(), depending on modal library
          }
        }, (error: any) => console.error(error));
      await this.ViewTotalCollegeDataByID();
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
