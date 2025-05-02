import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseMasterDataModel } from '../../../Models/CourseMasterDataModel';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { DTEAffiliationAddCourseService } from '../../../Services/DTEAffiliation/DTEAffiliationAddCourse/dte-affiliation-add-course.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { BTERDocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { ToastrService } from 'ngx-toastr';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';

@Component({
  selector: 'app-documentscrutinyforbter-payment-details',
  templateUrl: './documentscrutinyforbter-payment-details.component.html',
  styleUrls: ['./documentscrutinyforbter-payment-details.component.css']
})
export class DocumentscrutinyforbterPaymentDetailsComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new CourseMasterDataModel();

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public UserID: number = 0;
  public AllCourseList: any = [];
  public SearchRecordID: string = '';
  public BTERAffiliationRegID: number = 0;
  public SelectedDteAffiliationRegId: number = 0;
  public DeficiencyNOCHistoryDetails: any = [];
  public DeficiencyLOAHistoryDetails: any = [];
  public DeficiencyApplicationHistoryDetails: any = [];
  public DeficiencyAmountHistoryDetails: any = [];
  dsrequest = new BTERDocumentScrutinyDataModel();
  public isDisabledAction: boolean = false;
  public isFormvalid: boolean = false;
  public FinalRemarks: any = [];
  public isRemarkValid: boolean = false;
  public ApplyBterAffiliationID: number = 0;
  public CollegeStatusID: number = 0;
  public Affiliationstatus: string = '';
  public ApplicationStatus: string = '';
  public CollegeName: string = '';
  public CollegeMobileNo: string = '';
  constructor(private collegeService: CollegeService, private courseMasterService: CourseMasterService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private dTEAffiliationAddCourseService: DTEAffiliationAddCourseService, private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService) { }

  async ngOnInit() {   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.BTERAffiliationRegID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString());
    this.Affiliationstatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());
    this.CollegeStatusID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeStatusId')?.toString());
    this.ApplyBterAffiliationID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyBterAffiliationID')?.toString());
    this.SelectedCollageID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());    
    this.ApplicationStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationStatus')?.toString());
    //if (this.SearchRecordID.length > 20 && this.SelectedDepartmentID == 12) {
    //  debugger;
    //  await this.commonMasterService.GetDteAffiliation_SearchRecordIDWise(this.SearchRecordID)
    //    .then((data: any) => {
    //      data = JSON.parse(JSON.stringify(data));
    //      this.SelectedDteAffiliationRegId = data['Data']['DTE_ARId'];

    //      if (this.SelectedDteAffiliationRegId == null || this.SelectedDteAffiliationRegId == 0 || this.SelectedDteAffiliationRegId == undefined) {
    //        this.routers.navigate(['/affiliationregistration']);
    //      }
    //    }, error => console.error(error));
    //}
    //else {
    //  this.SelectedDteAffiliationRegId = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString()));
    //}
    await this.GetDeficiencyHistoryApplicationID();

  }


  async GetDeficiencyHistoryApplicationID() {
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationAddCourseService.GetDeficiencyHistoryApplicationID(this.BTERAffiliationRegID, this.ApplicationStatus)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DeficiencyNOCHistoryDetails = data['Data'][0]['data']['Table'];
          this.DeficiencyLOAHistoryDetails = data['Data'][0]['data']['Table1'];
          this.DeficiencyApplicationHistoryDetails = data['Data'][0]['data']['Table2'];
          this.DeficiencyAmountHistoryDetails = data['Data'][0]['data']['Table3'];
          this.CollegeName = data['Data'][0]['data']['Table4'][0]['CollegeName'];
          this.CollegeMobileNo = data['Data'][0]['data']['Table4'][0]['CollegeMobileNo'];
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
    await this.DeficiencyNOCHistoryDetails.forEach((i: { Action: string, Remark: string }) => {
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
  public isSubmitted: boolean = false;

  async SubmitOffPaymentDetail_Onclick() {
    debugger;
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyAffiliationID = this.ApplyBterAffiliationID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.BTERAffiliationRegID = this.BTERAffiliationRegID;
    //this.dsrequest.TabName = 'OfflinePayment';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.NocDocumentScrutinyDetail = [];
    this.dsrequest.LOADocumentScrutinyDetail = [];
    this.dsrequest.ApplicationFormDocumentScrutinyDetail = [];
    this.dsrequest.BTERPaymentDocumentScrutinyDetail = [];
    if (this.Affiliationstatus != 'Existing') {
      for (var i = 0; i < this.DeficiencyNOCHistoryDetails.length; i++) {
        if (this.DeficiencyNOCHistoryDetails[i].Action == '' || this.DeficiencyNOCHistoryDetails[i].Action == undefined) {
          this.toastr.warning('Please take Action on all records');
          return;
        }
        if (this.DeficiencyNOCHistoryDetails[i].Action == 'No') {
          if (this.DeficiencyNOCHistoryDetails[i].Remark == '' || this.DeficiencyNOCHistoryDetails[i].Remark == undefined) {
            this.toastr.warning('Please enter remark');
            return;
          }
        }
      }
    }
    for (var i = 0; i < this.DeficiencyLOAHistoryDetails.length; i++) {
      if (this.DeficiencyLOAHistoryDetails[i].Action == '' || this.DeficiencyLOAHistoryDetails[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.DeficiencyLOAHistoryDetails[i].Action == 'No') {
        if (this.DeficiencyLOAHistoryDetails[i].Remark == '' || this.DeficiencyLOAHistoryDetails[i].Remark == undefined) {
          this.toastr.warning('Please enter remark');
          return;
        }
      }
    }
    for (var i = 0; i < this.DeficiencyApplicationHistoryDetails.length; i++) {
      if (this.DeficiencyApplicationHistoryDetails[i].Action == '' || this.DeficiencyApplicationHistoryDetails[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.DeficiencyApplicationHistoryDetails[i].Action == 'No') {
        if (this.DeficiencyApplicationHistoryDetails[i].Remark == '' || this.DeficiencyApplicationHistoryDetails[i].Remark == undefined) {
          this.toastr.warning('Please enter remark');
          return;
        }
      }
    }
    for (var i = 0; i < this.DeficiencyAmountHistoryDetails.length; i++) {
      if (this.DeficiencyAmountHistoryDetails[i].Action == '' || this.DeficiencyAmountHistoryDetails[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.DeficiencyAmountHistoryDetails[i].Action == 'No') {
        if (this.DeficiencyAmountHistoryDetails[i].Remark == '' || this.DeficiencyAmountHistoryDetails[i].Remark == undefined) {
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
    if (this.Affiliationstatus != 'Existing') { 
    if (this.DeficiencyNOCHistoryDetails.length > 0) {
      for (var i = 0; i < this.DeficiencyNOCHistoryDetails.length; i++) {
        console.log(this.DeficiencyNOCHistoryDetails[i]);
        this.dsrequest.NocDocumentScrutinyDetail.push({
          DSBterAffiliationID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyAffiliationID: this.ApplyBterAffiliationID,
          Action: this.DeficiencyNOCHistoryDetails[i].Action,
          Remark: this.DeficiencyNOCHistoryDetails[i].Remark               
        });
      }
      }
    }
    if (this.DeficiencyLOAHistoryDetails.length > 0) {
      for (var i = 0; i < this.DeficiencyLOAHistoryDetails.length; i++) {
        console.log(this.DeficiencyLOAHistoryDetails[i]);
        this.dsrequest.LOADocumentScrutinyDetail.push({
          DSBterAffiliationID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyAffiliationID: this.ApplyBterAffiliationID,
          Action: this.DeficiencyLOAHistoryDetails[i].Action,
          Remark: this.DeficiencyLOAHistoryDetails[i].Remark,         
        });
      }
    }
    if (this.DeficiencyApplicationHistoryDetails.length > 0) {
      for (var i = 0; i < this.DeficiencyApplicationHistoryDetails.length; i++) {
        console.log(this.DeficiencyApplicationHistoryDetails[i]);
        this.dsrequest.ApplicationFormDocumentScrutinyDetail.push({
          DSBterAffiliationID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyAffiliationID: this.ApplyBterAffiliationID,
          Action: this.DeficiencyApplicationHistoryDetails[i].Action,
          Remark: this.DeficiencyApplicationHistoryDetails[i].Remark,          
        });
      }
    }
    if (this.DeficiencyAmountHistoryDetails.length > 0) {
      for (var i = 0; i < this.DeficiencyAmountHistoryDetails.length; i++) {
        console.log(this.DeficiencyAmountHistoryDetails[i]);
        this.dsrequest.BTERPaymentDocumentScrutinyDetail.push({
          DSBterAffiliationID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyAffiliationID: this.ApplyBterAffiliationID,
          Action: this.DeficiencyAmountHistoryDetails[i].Action,
          Remark: this.DeficiencyAmountHistoryDetails[i].Remark,
          PaymentID: this.DeficiencyLOAHistoryDetails[i].PaymentID
        });
      }
    }
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.SaveBTERDocumentScrutiny(this.dsrequest)
        .then(async(data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.isRemarkValid = false;
            this.isFormvalid = true;
            await this.commonMasterService.SendMessageBTER(this.CollegeMobileNo, 'Revert', this.ApplyBterAffiliationID)
            this.routers.navigate(['/dashboard']);
            
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
  async selectAllNoc(ActionType: string) {
    await this.DeficiencyNOCHistoryDetails.forEach((i: { Action: string, Remark: string }) => {
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
  ClickOnActionNoc(idx: number) {
    var Count = 0;
    for (var i = 0; i < this.DeficiencyNOCHistoryDetails.length; i++) {
      if (i == idx) {
        this.DeficiencyNOCHistoryDetails[i].Remark = '';
      }
      if (this.DeficiencyNOCHistoryDetails[i].Action == 'No') {
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
  async selectAllLOA(ActionType: string) {
    await this.DeficiencyLOAHistoryDetails.forEach((i: { Action: string, Remark: string }) => {
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
  
  ClickOnActionLOA(idx: number) {
    var Count = 0;
    for (var i = 0; i < this.DeficiencyLOAHistoryDetails.length; i++) {
      if (i == idx) {
        this.DeficiencyLOAHistoryDetails[i].Remark = '';
      }
      if (this.DeficiencyLOAHistoryDetails[i].Action == 'No') {
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


  async selectAllApplication(ActionType: string) {
    await this.DeficiencyApplicationHistoryDetails.forEach((i: { Action: string, Remark: string }) => {
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

  ClickOnActionApplication(idx: number) {
    var Count = 0;
    for (var i = 0; i < this.DeficiencyApplicationHistoryDetails.length; i++) {
      if (i == idx) {
        this.DeficiencyApplicationHistoryDetails[i].Remark = '';
      }
      if (this.DeficiencyApplicationHistoryDetails[i].Action == 'No') {
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
  async selectAllPayment(ActionType: string) {
    await this.DeficiencyAmountHistoryDetails.forEach((i: { Action: string, Remark: string }) => {
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
  ClickOnActionPayment(idx: number) {
    var Count = 0;
    for (var i = 0; i < this.DeficiencyAmountHistoryDetails.length; i++) {
      if (i == idx) {
        this.DeficiencyAmountHistoryDetails[i].Remark = '';
      }
      if (this.DeficiencyAmountHistoryDetails[i].Action == 'No') {
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
}

