import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { CommiteeInspection_RNCCheckList_DataModel, CommonDataModel_ApplicationListFilter } from '../../../Models/ApplyNOCApplicationDataModel';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { RequiredDocumentsDataModel_Documents } from '../../../Models/TabDetailDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';

@Component({
  selector: 'app-mgthree-applications-list',
  templateUrl: './mgthree-applications-list.component.html',
  styleUrls: ['./mgthree-applications-list.component.css']
})
export class MGThreeApplicationsListComponent implements OnInit {

  sSOLoginDataModel = new SSOLoginDataModel();
  request = new CommonDataModel_ApplicationListFilter();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplyNocDetails: any = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public QueryStatus: any = '';

  constructor(private collegeService: CollegeService, private decDocumentScrutinyService: DCEDocumentScrutinyService, private fileUploadService: FileUploadService, private committeeMasterService: CommitteeMasterService, private applyNOCApplicationService: ApplyNOCApplicationService, private loaderService: LoaderService, private toastr: ToastrService, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private modalService: NgbModal) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.request.RoleID = this.sSOLoginDataModel.RoleID;
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.request.SessionYear = this.sSOLoginDataModel.SessionID;
    this.request.Status = this.QueryStatus;
    await this.GetWorkflowPermissions();
    await this.GetApplyNOCApplicationListByRole();
  }

  async GetApplyNOCApplicationListByRole() {
    try {
      if (this.QueryStatus == 'Pending') {
        this.request.ActionName = 'Apply NOC,Forward To';
      }
      else if (this.QueryStatus == 'Completed') {
        this.request.ActionName = 'Forward To';
      }
      else if (this.QueryStatus == 'DCPending') {
        this.request.ActionName = 'Forward To,Forward after document scrutiny,Revert,ReSubmit Application';
      }
      else if (this.QueryStatus == 'DCCompleted' && this.sSOLoginDataModel.RoleID != 16) { 
        this.request.ActionName = 'Forward after document scrutiny';
      }
      else if (this.QueryStatus == 'DCCompleted' && this.sSOLoginDataModel.RoleID == 16) {
        this.request.ActionName = 'Forward Inspection Report';
      }
      else if (this.QueryStatus == 'InspectionPending' || this.QueryStatus == 'IPending') {
        this.request.ActionName = 'Forward Inspection Report,Revert after Inspection';
      }
      else if (this.QueryStatus == 'InspectionCompleted') {
        this.request.ActionName = 'Forward Inspection Report,Forward';
      }
      else if (this.QueryStatus == 'ICompleted') {
        this.request.ActionName = 'Forward Inspection Report';
      }
      else if (this.QueryStatus == 'AfterInspectionPending') {
        this.request.ActionName = 'Forward,Forward To Joint Secretary after inspection';
      }
      else if (this.QueryStatus == 'AfterInspectionCompleted' && this.sSOLoginDataModel.RoleID != 6) {
        this.request.ActionName = 'Forward To Joint Secretary after inspection,Forward';
      }
      else if (this.QueryStatus == 'AfterInspectionCompleted' && this.sSOLoginDataModel.RoleID == 6) {
        this.request.ActionName = 'Forward To Joint Secretary after inspection,Forward To';
      }
      else if (this.QueryStatus == 'APending') {
        this.request.ActionName = 'Forward To';
      }
      else if (this.QueryStatus == 'ACompleted') {
        this.request.ActionName = 'Approve and Forward,Reject and Forward';
      }
      else if (this.QueryStatus == 'JSPending') {
        this.request.ActionName = 'Approve and Forward,Reject and Forward';
      }
      else if (this.QueryStatus == 'DCRevert') {
        this.request.ActionName = 'Revert';
      }
      else if (this.QueryStatus == 'InspectionRevert') {
        this.request.ActionName = 'Revert after Inspection';
      }
      //else if (this.QueryStatus == 'IPending') {
      //  this.request.ActionName = 'Forward';
      //}
      //else if (this.QueryStatus == 'DCPending' && (this.sSOLoginDataModel.RoleID == 2 || this.sSOLoginDataModel.RoleID == 3 || this.sSOLoginDataModel.RoleID == 5 || this.sSOLoginDataModel.RoleID == 6 || this.sSOLoginDataModel.RoleID == 16)) {
      //  this.request.ActionName = 'Forward To,Forward after document scrutiny,Revert,ReSubmit Application';
      //}
      //else if (this.QueryStatus == 'InspectionPending' && (this.sSOLoginDataModel.RoleID == 5 || this.sSOLoginDataModel.RoleID == 2|| this.sSOLoginDataModel.RoleID == 3)) {
      //  this.request.ActionName = 'Forward Inspection Report,Revert after Inspection';
      //}
      //else if (this.QueryStatus == 'Completed' && (this.sSOLoginDataModel.RoleID == 5 || this.sSOLoginDataModel.RoleID == 3 || this.sSOLoginDataModel.RoleID == 2)) {
      //  this.request.ActionName = 'Forward To';
      //}
      //else if (this.QueryStatus == 'DCCompleted' && (this.sSOLoginDataModel.RoleID == 2 || this.sSOLoginDataModel.RoleID == 3 || this.sSOLoginDataModel.RoleID == 5 || this.sSOLoginDataModel.RoleID == 6)) {
      //  this.request.ActionName = 'Forward after document scrutiny';
      //}
      //else if (this.QueryStatus == 'DCCompleted'  && (this.sSOLoginDataModel.RoleID == 16 )) {
      //  this.request.ActionName = 'Forward Inspection Report';
      //}
      //else if (this.QueryStatus == 'InspectionCompleted') {
      //  this.request.ActionName = 'Forward Inspection Report,Forward';
      //}
      //else if (this.QueryStatus == 'AfterInspectionPending' && (this.sSOLoginDataModel.RoleID == 5 || this.sSOLoginDataModel.RoleID == 6)) {
      //  this.request.ActionName = 'Forward,Forward To Joint Secretary after inspection';
      //}
      //else if (this.QueryStatus == 'AfterInspectionCompleted' && this.sSOLoginDataModel.RoleID == 5) {
      //  this.request.ActionName = 'Forward To Joint Secretary after inspection';
      //}
      //else if (this.QueryStatus == 'AfterInspectionCompleted' && this.sSOLoginDataModel.RoleID == 6) {
      //  this.request.ActionName = 'Forward To';
      //}
      //else if (this.QueryStatus == 'APending') {
      //  this.request.ActionName = 'Forward To';
      //}
      //else if (this.QueryStatus == 'ACompleted') {
      //  this.request.ActionName = 'Approve and Forward,Reject and Forward';
      //}
      //else if (this.QueryStatus == 'JSPending') {
      //  this.request.ActionName = 'Approve and Forward,Reject and Forward';
      //}
      //else if (this.QueryStatus == 'DCRevert') {
      //  this.request.ActionName = 'Revert';
      //}
      //else if (this.QueryStatus == 'InspectionRevert') {
      //  this.request.ActionName = 'Revert after Inspection';
      //}
      //else if (this.QueryStatus == 'IPending') {
      //  this.request.ActionName = 'Forward';
      //}
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.GetApplyNOCApplicationList(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyNocDetails = data['Data'];
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
  public WorkflowPermissionslst: any = [];
  async GetWorkflowPermissions() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetWorkflowPermissions(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.WorkflowPermissionslst = data['Data'][0];
          console.log(this.WorkflowPermissionslst);
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
  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }
  public ApplicationTrailList: any = [];
  closeResult: string | undefined;
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
  async ApplicationForward(DepartmentID: number, CollegeID: number, ApplyNOCID: number) {
    this.routers.navigate(['/applicationforward' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + "Pending"]);
  }

  async DocumentScrutiny(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    this.routers.navigate(['/documentscrutinymgthree' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(this.request.Status.toString()))]);

  }
  async DocumentScrutinyForward(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    this.routers.navigate(['/checklistmgthree' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(this.request.Status.toString()))]);

  }


  /*Check List*/


  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public ApplicationNo: string = '';
  async OpenCheckList(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {

    this.ApplicationNo = ApplicationNo;
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    await this.GetCollageDetails();
    await this.GetOtherDocuments('Other Document');
    await this.GetCourtCaseList();
    await this.GetWorkFlowActionListByRole();
    await this.GetCheckListByTypeDepartment();
    await this.GetApplicationCommitteeList(ApplyNOCID);
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  public CheckTabsEntryData: any = [];
  async CheckTabsEntry() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.CheckDocumentScrutinyTabsData(this.SelectedApplyNOCID, this.sSOLoginDataModel.RoleID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckTabsEntryData = data['Data'][0]['data'][0];
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
  public CheckListData: any = [];
  async GetCheckListByTypeDepartment() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRNCCheckListByTypeDepartment('MDHNM', this.sSOLoginDataModel.DepartmentID, this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckListData = data['Data'];
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




  /*Document Scrutiny*/
  public ShowHideNextRole: boolean = true;
  public ShowHideNextUser: boolean = true;
  public isFormvalid: boolean = true;
  public isActionValid: boolean = false;
  public isRemarkValid: boolean = false;
  public ShowHideNextRoleNextUser: boolean = true;
  public isActionTypeValid: boolean = false;
  public isNextActionValid: boolean = false;
  public isNextRoleIDValid: boolean = false;
  public isNextUserIdValid: boolean = false;
  public NextRoleID: number = 0;
  public NextUserID: number = 0;
  public ActionID: number = 0;
  public NextActionID: number = 0;
  public CheckFinalRemark: string = '';
  public UserRoleList: any[] = [];
  public UserListRoleWise: any[] = [];
  public WorkFlowActionList: any[] = [];
  public NextWorkFlowActionList: any[] = [];



  public isInspectionReportValid: boolean = false;
  async DocumentScrutinyAction() {
    this.requestpi = [];
    this.isFormvalid = true;
    this.isInspectionReportValid = true;
    this.isNextUserIdValid = false;
    this.isNextRoleIDValid = false;
    this.isNextActionValid = false;
    this.isRemarkValid = false;
    try {
      if (this.UploadInspectionReport == '') {
        this.isFormvalid = false;
        this.toastr.warning('Please upload inspection report');
      }
      if (this.CheckFinalRemark == '') {
        this.isRemarkValid = true;
        this.isFormvalid = false;
      }

      if (this.ActionID <= 0) {
        this.isActionTypeValid = true;
        this.isFormvalid = false;
      }
      if (this.ShowHideNextRole && this.ShowHideNextUser) {
        if (this.NextRoleID <= 0) {
          this.isNextRoleIDValid = true;
          this.isFormvalid = false;
        }
        if (this.NextUserID <= 0) {
          this.isNextUserIdValid = true;
          this.isFormvalid = false;
        }
      }
      else if (!this.ShowHideNextUser && !this.ShowHideNextRole) {
        this.NextRoleID = 1;
        this.NextUserID = 0;
        this.NextActionID = 0;
      }
      else if (this.ShowHideNextUser && this.ShowHideNextRole) {
        if (this.NextRoleID <= 0) {
          this.isNextRoleIDValid = true;
          this.isFormvalid = false;
        }
        if (this.NextUserID <= 0) {
          this.isNextUserIdValid = true;
          this.isFormvalid = false;
        }
        this.NextActionID = 0;
      }
      else if (!this.ShowHideNextUser && this.ShowHideNextRole) { // && !this.ShowHideNextAction
        if (this.NextRoleID <= 0) {
          this.isNextRoleIDValid = true;
          this.isFormvalid = false;
        }
        this.NextUserID = 0;
        this.NextActionID = 0;
      }
      for (var i = 0; i < this.ApplicationCommitteeList.length; i++) {
        if (this.ApplicationCommitteeList[i].SendOTP != 2) {
          this.toastr.warning('Verified All Memeber');
          return;
        }
      }
      for (var i = 0; i < this.CheckListData.length; i++) {
        if (this.CheckListData[i].FileUpload == true) {
          if (this.CheckListData[i].FileUploadName == '' || this.CheckListData[i].FileUploadName == undefined) {
            this.toastr.warning('Please select a file for upload');
            return
          }
        }
        if (this.CheckListData[i].IsChecked == '2') {
          if (this.CheckListData[i].Remark == '' || this.CheckListData[i].Remark == undefined) {
            this.toastr.warning('Please enter check list remark');
            return
          }
        }
        if (this.CheckListData[i].IsChecked == '' || this.CheckListData[i].IsChecked == undefined) {
          this.toastr.warning('Please check all checklist');
          return
        }
        this.requestpi.push({
          ApplyNOCID: this.SelectedApplyNOCID,
          RNCCheckListID: this.CheckListData[i].RNCCheckListID,
          CreatedBy: this.sSOLoginDataModel.UserID,
          FileUploadName: this.CheckListData[i].FileUpload == true ? this.CheckListData[i].FileUploadName : '',
          IsChecked: this.CheckListData[i].IsChecked,
          Remark: this.CheckListData[i].Remark,
          FinalRemark: '',//this.FinalRemark
          RoleID: this.sSOLoginDataModel.RoleID
        })
      }
      await this.CheckTabsEntry();
      //if (this.SelectedDepartmentID == 6) {
      //  if (this.CollegeType_IsExisting) {
      //    if (this.CheckTabsEntryData['LegalEntity'] <= 0 || this.CheckTabsEntryData['CollegeDetail'] <= 0 || this.CheckTabsEntryData['CollegeManagementSociety'] <= 0 || this.CheckTabsEntryData['LandInformation'] <= 0
      //      || this.CheckTabsEntryData['Facility'] <= 0 || this.CheckTabsEntryData['RoomDetails'] <= 0 || this.CheckTabsEntryData['OtherInformation'] <= 0
      //      || this.CheckTabsEntryData['BuildingDocuments'] <= 0 || this.CheckTabsEntryData['StaffDetails'] <= 0 || this.CheckTabsEntryData['OLDNOCDetails'] <= 0 || this.CheckTabsEntryData['AcademicInformation'] <= 0
      //      || (this.CheckTabsEntryData['OtherDocument'] <= 0 && this.CheckList_OtherDocumentDetails.length > 0) || this.CheckTabsEntryData['HospitalDetails'] <= 0 || this.CheckTabsEntryData['HostelDetails'] <= 0 || (this.CheckTabsEntryData['CourtCase'] <= 0 && this.CheckList_courtOrderList.length > 0)) {
      //      this.isFormvalid = false;
      //      var tab = this.CheckTabsEntryData['LegalEntity'] <= 0 ? 'Legal Entity' :
      //        this.CheckTabsEntryData['CollegeDetail'] <= 0 ? 'College Detail' :
      //          this.CheckTabsEntryData['CollegeManagementSociety'] <= 0 ? 'College Management Society' :
      //            this.CheckTabsEntryData['LandInformation'] <= 0 ? 'Land Information' :
      //              this.CheckTabsEntryData['Facility'] <= 0 ? 'Facility Detail' :
      //                this.CheckTabsEntryData['RoomDetails'] <= 0 ? 'Class Room Details' :
      //                  this.CheckTabsEntryData['OtherInformation'] <= 0 ? 'Clinical Details' :
      //                    this.CheckTabsEntryData['BuildingDocuments'] <= 0 ? 'Building Details' :
      //                      this.CheckTabsEntryData['StaffDetails'] <= 0 ? 'Staff Details' :
      //                        this.CheckTabsEntryData['OLDNOCDetails'] <= 0 ? 'OLD NOC Details' :
      //                          this.CheckTabsEntryData['AcademicInformation'] <= 0 ? 'Academic Information' :
      //                            (this.CheckTabsEntryData['OtherDocument'] <= 0 && this.CheckList_OtherDocumentDetails.length > 0) ? 'Other Document' :
      //                              this.CheckTabsEntryData['HospitalDetails'] <= 0 ? 'Hospital Details' :
      //                                this.CheckTabsEntryData['HostelDetails'] <= 0 ? 'Hostel Details' :
      //                                  (this.CheckTabsEntryData['CourtCase'] <= 0 && this.CheckList_courtOrderList.length > 0) ? 'Court Case Details' : '';
      //      this.toastr.warning('Please do document scrutiny of the ' + tab + ' tab');
      //    }
      //  }
      //  else {
      //    if (this.CheckTabsEntryData['LegalEntity'] <= 0 || this.CheckTabsEntryData['CollegeDetail'] <= 0 || this.CheckTabsEntryData['CollegeManagementSociety'] <= 0 || this.CheckTabsEntryData['LandInformation'] <= 0
      //      || this.CheckTabsEntryData['Facility'] <= 0 || this.CheckTabsEntryData['RoomDetails'] <= 0 || this.CheckTabsEntryData['OtherInformation'] <= 0
      //      || this.CheckTabsEntryData['BuildingDocuments'] <= 0 || (this.CheckTabsEntryData['OtherDocument'] <= 0 && this.CheckList_OtherDocumentDetails.length > 0) || this.CheckTabsEntryData['HospitalDetails'] <= 0
      //      || this.CheckTabsEntryData['HostelDetails'] <= 0 || (this.CheckTabsEntryData['CourtCase'] <= 0 && this.CheckList_courtOrderList.length > 0)) {
      //      this.isFormvalid = false;
      //      var tab = this.CheckTabsEntryData['LegalEntity'] <= 0 ? 'Legal Entity' :
      //        this.CheckTabsEntryData['CollegeDetail'] <= 0 ? 'College Detail' :
      //          this.CheckTabsEntryData['CollegeManagementSociety'] <= 0 ? 'College Management Society' :
      //            this.CheckTabsEntryData['LandInformation'] <= 0 ? 'Land Information' :
      //              this.CheckTabsEntryData['Facility'] <= 0 ? 'Facility Detail' :
      //                this.CheckTabsEntryData['RoomDetails'] <= 0 ? 'Class Room Details' :
      //                  this.CheckTabsEntryData['OtherInformation'] <= 0 ? 'Clinical Details' :
      //                    this.CheckTabsEntryData['BuildingDocuments'] <= 0 ? 'Building Details' :
      //                      (this.CheckTabsEntryData['OtherDocument'] <= 0 && this.CheckList_OtherDocumentDetails.length > 0) ? 'Other Document' :
      //                        this.CheckTabsEntryData['HospitalDetails'] <= 0 ? 'Hospital Details' :
      //                          this.CheckTabsEntryData['HostelDetails'] <= 0 ? 'Hostel Details' :
      //                            (this.CheckTabsEntryData['CourtCase'] <= 0 && this.CheckList_courtOrderList.length > 0) ? 'Court Case Details' : '';
      //      this.toastr.warning('Please do document scrutiny of the ' + tab + ' tab');
      //    }
      //  }
      //}

      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to submit?")) {
        await this.applyNOCApplicationService.SaveCommiteeInspectionRNCCheckList(this.requestpi).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
        });
        await this.applyNOCApplicationService.DocumentScrutiny(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.ActionID, this.SelectedApplyNOCID, this.SelectedDepartmentID, this.CheckFinalRemark, this.NextRoleID, this.NextUserID, this.NextActionID)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              await this.medicalDocumentScrutinyService.UploadInspectionReport(this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID, this.UploadInspectionReport)
                .then((data: any) => {
                  data = JSON.parse(JSON.stringify(data));
    
                }, error => console.error(error));
              this.toastr.success(this.SuccessMessage);
              this.routers.navigate(['/applicationslist' + "/" + encodeURI(this.commonMasterService.Encrypt(this.QueryStatus.toString()))]);
              this.modalService.dismissAll('After Success');
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
            else {
              this.toastr.error(this.ErrorMessage)
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
      }, 200);
    }
  }
  async GetRoleListForApporval() {
    this.UserRoleList = [];
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetRoleListForApporval(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.UserRoleList = data['Data'];
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
  async NextGetUserDetailsByRoleID() {
    this.UserListRoleWise = [];
    this.NextWorkFlowActionList = [];
    this.NextUserID = 0;
    this.NextActionID = 0
    this.loaderService.requestStarted();
    try {
      if (this.NextRoleID == 1) {
        this.ShowHideNextUser = false;
      }
      else {
        this.ShowHideNextUser = true;
        await this.commonMasterService.GetUserDetailsByRoleID(this.NextRoleID, this.sSOLoginDataModel.DepartmentID, this.SelectedApplyNOCID)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (data['Data'].length > 0) {
              this.UserListRoleWise = data['Data'];
              if (this.UserListRoleWise.length > 0) {
                this.NextUserID = this.UserListRoleWise[0]['UId'];
                await this.NextGetWorkFlowActionListByRole();
              }
            }
          })
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async NextGetWorkFlowActionListByRole() {
    this.NextActionID = 0;
    this.NextWorkFlowActionList = [];
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetWorkFlowActionListByRole(this.NextRoleID, "Next", this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.NextWorkFlowActionList = data['Data'];
            if (this.NextWorkFlowActionList.length > 0) {
              this.NextActionID = this.NextWorkFlowActionList[0]['ActionID'];
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
  async GetWorkFlowActionListByRole() {
    this.WorkFlowActionList = [];
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetWorkFlowActionListByRole(this.sSOLoginDataModel.RoleID, "Current", this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.WorkFlowActionList = data['Data'];
            if (this.WorkFlowActionList.length > 0) {

              if (this.QueryStatus == 'DCPending') {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID != 49);
              }
              this.ActionID = this.WorkFlowActionList[0]['ActionID'];
              await this.OnChangeCurrentAction()
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
  public IsRevert: boolean = false;
  async OnChangeCurrentAction() {
    await this.GetRoleListForApporval();
    var IsNextAction = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsNextAction;
    var IsRevert = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsRevert;
    this.IsRevert = IsRevert;
    if (IsNextAction == true && IsRevert == false) {
      this.ShowHideNextUser = true;
      this.ShowHideNextRole = true;
      if (this.UserRoleList.length > 0) {
        this.UserRoleList = this.UserRoleList.filter((x: { RoleID: number; }) => x.RoleID != 1);
      }
    }
    else if (IsNextAction == false && IsRevert == false) {
      this.ShowHideNextUser = false;
      this.ShowHideNextRole = false;
      if (this.UserRoleList.length > 0) {
        this.UserRoleList = this.UserRoleList.filter((x: { RoleID: number; }) => x.RoleID != 1);
      }
    }
    else if (IsNextAction == false && IsRevert == true) {
      this.ShowHideNextUser = true;
      this.ShowHideNextRole = true;
    }
  }


  /*Inspection committee list*/
  public ApplicationCommitteeList: any[] = [];
  public CustomOTP: string = '123456';
  public IsDisabled: boolean = false;
  public IsBtnShowHide: boolean = true;
  public PVCommitteeList: any[] = [];
  async GetApplicationCommitteeList(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList_AH(ApplyNocApplicationID, 'Inspection')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationCommitteeList = data['Data'];
          this.PVCommitteeList = data['Data'];
          if (this.ApplicationCommitteeList.length > 0) {
            this.ApplicationCommitteeList = this.ApplicationCommitteeList.filter(x => x.IsPrimaryMember == 0);
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
  numbersOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[0-9]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  alphanumbersOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }


  public CurrentOTP: number = 0;
  async SendOTPByEsanchar(MobileNo: string, idx: number) {
    this.CurrentOTP = 0;
    try {
      this.loaderService.requestStarted();
      if (MobileNo != undefined && MobileNo.length == 10) {
        for (var i = 0; i < this.ApplicationCommitteeList.length; i++) {
          if (idx != i && this.ApplicationCommitteeList[i].SendOTP != 2) {
            this.ApplicationCommitteeList[i].SendOTP = 0;
          }
        }
        this.commonMasterService.SendMessage(MobileNo, 'OTP')
          .then((data: any) => {
            if (data.State == '0') {
              this.ApplicationCommitteeList[idx].SendOTP = 1;
              this.toastr.success("OTP send Successfully");
              this.CurrentOTP = data['Data'];
            } else {
              this.toastr.warning(data.ErrorMessage);
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
      }, 200);
    }
  }
  async VerifyOTPByEsanchar(UserOTP: number, idx: number) {
    try {
      this.loaderService.requestStarted();
      if (UserOTP == this.CurrentOTP) {
        this.toastr.success("OTP Verify Successfully");
        this.ApplicationCommitteeList[idx].Verified = true;
        this.ApplicationCommitteeList[idx].SendOTP = 2;
      }
      else if (UserOTP == Number(this.CustomOTP)) {
        this.toastr.success("OTP Verify Successfully");
        this.ApplicationCommitteeList[idx].Verified = true;
        this.ApplicationCommitteeList[idx].SendOTP = 2;
      }
      else {
        this.toastr.warning("Invalid OTP");
      }
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

  public requestpi: CommiteeInspection_RNCCheckList_DataModel[] = [];
  async SavePhysicalVerification() {
    this.requestpi = [];
    try {
      for (var i = 0; i < this.CheckListData.length; i++) {
        if (this.CheckListData[i].FileUpload == true) {
          if (this.CheckListData[i].FileUploadName == '' || this.CheckListData[i].FileUploadName == undefined) {
            this.toastr.warning('Please select a file for upload');
            return
          }
        }
        if (this.CheckListData[i].IsChecked == '2') {
          if (this.CheckListData[i].Remark == '' || this.CheckListData[i].Remark == undefined) {
            this.toastr.warning('Please enter remark');
            return
          }
        }
        if (this.CheckListData[i].IsChecked == '' || this.CheckListData[i].IsChecked == undefined) {
          this.toastr.warning('Please check all checklist');
          return
        }
        this.requestpi.push({
          ApplyNOCID: this.SelectedApplyNOCID,
          RNCCheckListID: this.CheckListData[i].RNCCheckListID,
          CreatedBy: this.sSOLoginDataModel.UserID,
          FileUploadName: this.CheckListData[i].FileUpload == true ? this.CheckListData[i].FileUploadName : '',
          IsChecked: this.CheckListData[i].IsChecked,
          Remark: this.CheckListData[i].Remark,
          FinalRemark: '',//this.FinalRemark
          RoleID: this.sSOLoginDataModel.RoleID
        })
      }
      //if (!this.isTabCheckValid) {
      //  this.toastr.warning('First of all, check and complete all the tabs of document scrutiny and then submit the application.');
      //  return;
      //}
      await this.applyNOCApplicationService.SaveCommiteeInspectionRNCCheckList(this.requestpi).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.toastr.success(this.SuccessMessage);
        }
        else if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
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
  public file: any = '';
  async ValidateDocumentImage(event: any, idx: number) {
    try {
      this.CheckListData[idx].ShowHideImgButton = false;
      if (event.target.files && event.target.files[0]) {
        if ((event.target.files[0].type === 'image/jpeg' ||
          event.target.files[0].type === 'image/jpg') ||
          event.target.files[0].type === 'application/pdf') {
          if (event.target.files[0].size > 2000000) {
            event.target.value = '';
            this.toastr.warning('Select less then 2MB File');
            return
          }
          //if (event.target.files[0].size < 100000) {
          //  event.target.value = '';
          //  this.toastr.warning('Select more then 100kb File');
          //  return
          //}
        }
        else {
          event.target.value = '';
          let msg = 'Select Only ';

          this.toastr.warning('Select Only JPG/JPEG/Pdf File');

          return
        }
        this.file = event.target.files[0];
        try {
          this.loaderService.requestStarted();
          await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.CheckListData[idx].ShowHideImgButton = true;
              this.CheckListData[idx].FileUploadName = data['Data'][0]["FileName"];
              this.CheckListData[idx].FileUploadNamePath = data['Data'][0]["FilePath"];
              this.CheckListData[idx].FileUploadName_Dis_FileName = data['Data'][0]["Dis_FileName"];
              event.target.value = '';
            }
            if (this.State == 1) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
        }
        catch (ex) {
          console.log(ex);
        }
        finally {
          this.loaderService.requestEnded();
        }
      }
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      //this.loaderService.requestEnded();
    }
  }


  async DeleteImage(idx: number) {
    this.loaderService.requestStarted();
    try {
      // delete from server folder
      await this.fileUploadService.DeleteDocument(this.CheckListData[idx].FileUploadName).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.CheckListData[idx].ShowHideImgButton = false;
          this.CheckListData[idx].FileUploadName = '';
          this.CheckListData[idx].FileUploadNamePath = '';
          this.CheckListData[idx].FileUploadName_Dis_FileName = '';

        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();

      }, 200);
    }

  }


  async ViewApplicationInspectionDetails(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    this.ApplicationNo = ApplicationNo;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //
    await this.GetApplicationPvDetails(ApplyNOCID);
    await this.GetApplicationCommitteeList(ApplyNOCID);
  }
  public PVApplicationDetailsList: any[] = [];
  async GetApplicationPvDetails(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.decDocumentScrutinyService.GetApplicationPvDetails(ApplyNocApplicationID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PVApplicationDetailsList = data['Data'][0]['data'];
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














  public CheckList_OtherDocumentDetails: RequiredDocumentsDataModel_Documents[] = [];
  public CheckList_courtOrderList: any = [];
  async GetOtherDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_CollegeDocument(this.SelectedDepartmentID, this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_OtherDocumentDetails = data['Data'][0]['CollegeDocument'][0];

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
  async GetCourtCaseList() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_CourtCase(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_courtOrderList = data['Data'][0]['CourtCase'][0];

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
  public CollegeType_IsExisting: boolean = true;
  async GetCollageDetails() {
    try {
      this.loaderService.requestStarted();
      await this.collegeService.GetData(this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data']['CollegeStatus'] == 'New') {
            this.CollegeType_IsExisting = false;
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



  async GenerateInspectionReport(ApplyNOCID: number, CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.GenerateInspectionReport(CollegeID, this.sSOLoginDataModel.RoleID, ApplyNOCID, this.sSOLoginDataModel.UserID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          await this.GetApplyNOCApplicationListByRole();
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

  async onFilechange(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        // (Type != 'ConsentForm' && (this.file.type === 'image/jpeg' || this.file.type === 'image/jpg')) ||
        if (this.file.type === 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.warning('Please select less then 2 MB file');
            this.ResetFileAndValidation(Type, '', '', '');
            return
          }
          if (this.file.size < 100000) {
            this.toastr.warning('Please select grater then 100 KB file');
            this.ResetFileAndValidation(Type, '', '', '');
            return
          }
        }
        else {// type validation
          this.toastr.warning('Please select only pdf file');
          this.ResetFileAndValidation(Type, '', '', '');
          return
        }
        // upload to server folder
        this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, data['Data'][0]["FileName"], data['Data'][0]["Dis_FileName"], data['Data'][0]["FilePath"]);
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
      else {
        this.ResetFileAndValidation(Type, '', '', '');
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  public UploadInspectionReport: string='';
  public Dis_UploadInspectionReport: string='';
  public UploadInspectionReportPath: string='';
  ResetFileAndValidation(type: string, name: string, dis_name: string, path: string) {
    //event.target.value = '';
    try {
      this.loaderService.requestStarted();
      if (type == 'InspectionReport') {
        this.UploadInspectionReport = name;
        this.Dis_UploadInspectionReport = dis_name;
        this.UploadInspectionReportPath = path;
        this.file = document.getElementById('fInspectionReport');
        this.file.value = '';
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DeleteFile(Type: string, filename: string) {
    let path: string = '';
    try {
      this.loaderService.requestStarted();
      // delete from server folder
      this.fileUploadService.DeleteDocument(filename).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.ResetFileAndValidation(Type, '', '', '');
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
