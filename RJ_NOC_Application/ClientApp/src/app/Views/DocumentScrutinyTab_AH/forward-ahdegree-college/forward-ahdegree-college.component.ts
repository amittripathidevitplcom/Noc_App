import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-forward-ahdegree-college',
  templateUrl: './forward-ahdegree-college.component.html',
  styleUrls: ['./forward-ahdegree-college.component.css']
})



export class ForwardAHDegreeCollegeComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public CollegeType_IsExisting: boolean = true;
  public collegeDataList: any = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public QueryStatus: any = '';

  constructor(private routers: Router, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private collegeService: CollegeService) { }

  async ngOnInit() {

    this.loaderService.requestStarted();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetCollageDetails();
    await this.GetRoleListForApporval();
    await this.GetWorkFlowActionListByRole();
    this.loaderService.requestEnded();
  }
  async GetCollageDetails() {
    try {
      this.loaderService.requestStarted();
      await this.collegeService.GetData(this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.collegeDataList = data['Data'];
          if (this.collegeDataList['CollegeStatus'] == 'New') {
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


  //Document  Post Section
  public isNextRoleIDValid: boolean = false;
  public isNextUserIdValid: boolean = false;

  public isFormvalid: boolean = true;
  public isActionValid: boolean = false;
  public isObjectionValid: boolean = false;
  public isRemarkValid: boolean = false;
  public ShowHideNextRole: boolean = true;
  public ShowHideNextUser: boolean = true;
  //public ShowHideNextAction: boolean = true;
  public isActionTypeValid: boolean = false;
  public isNextActionValid: boolean = false;


  public CheckFinalRemark: string = '';
  public UserRoleList: any[] = [];
  public UserListRoleWise: any[] = [];
  public WorkFlowActionList: any[] = [];
  public NextWorkFlowActionList: any[] = [];
  public NextRoleID: number = 0;
  public NextUserID: number = 0;
  public ActionID: number = 0;
  public NextActionID: number = 0;

  async DocumentScrutiny() {
    this.isFormvalid = true;
    this.isNextUserIdValid = false;
    this.isNextRoleIDValid = false;
    this.isNextActionValid = false;
    this.isRemarkValid = false;
    try {

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


      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to submit?")) {
        await this.applyNOCApplicationService.DocumentScrutiny(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.ActionID, this.SelectedApplyNOCID, this.SelectedDepartmentID, this.CheckFinalRemark, this.NextRoleID, this.NextUserID, this.NextActionID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              this.routers.navigate(['/applicationslist' + "/" + encodeURI(this.commonMasterService.Encrypt(this.QueryStatus.toString()))]);
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
    debugger;
    this.UserRoleList = [];
    this.loaderService.requestStarted();
    try {
      console.log(this.sSOLoginDataModel.RoleID);
      console.log(this.sSOLoginDataModel.DepartmentID);

      await this.commonMasterService.GetRoleListForApporval(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID,'NOC')
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            debugger;
            this.UserRoleList = data['Data'];
            console.log(this.UserRoleList);
            if (this.UserRoleList.length > 0) {
              this.UserRoleList = this.UserRoleList.filter((x: { RoleID: number; }) => x.RoleID != 1);
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
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID == 45);
              }
              if (this.QueryStatus == 'Pending') {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID == 49);
              }
              if (this.QueryStatus == 'DCAfterPending') {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID != 49 && x.ActionID != 45);
              }

              if (this.QueryStatus == 'AfterScrutinyPending') {
                this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) =>  x.ActionID == 45);
              }

              //if (this.sSOLoginDataModel.RoleID == 7) {
              //  this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID != 42);
              //}
              this.ActionID = this.WorkFlowActionList[0]['ActionID'];
              var IsNextAction = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsNextAction;
              var IsRevert = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsRevert;
              if (IsNextAction == true && IsRevert == false) {
                this.ShowHideNextUser = true;
                this.ShowHideNextRole = true;
                //this.ShowHideNextAction = true;
              }
              else if (IsNextAction == false && IsRevert == false) {
                this.ShowHideNextUser = false;
                this.ShowHideNextRole = false;
                //this.ShowHideNextAction = false;
              }
              else if (IsNextAction == false && IsRevert == true) {
                this.ShowHideNextUser = true;
                this.ShowHideNextRole = true;
                //this.ShowHideNextAction = false;
              }
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
  OnChangeCurrentAction() {
    debugger;
    var IsNextAction = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsNextAction;
    var IsRevert = this.WorkFlowActionList.find((x: { ActionID: number; }) => x.ActionID == this.ActionID)?.IsRevert;
    if (IsNextAction == true && IsRevert == false) {
      this.ShowHideNextUser = true;
      this.ShowHideNextRole = true;
      //this.ShowHideNextAction = true;
    }
    else if (IsNextAction == false && IsRevert == false) {
      this.ShowHideNextUser = false;
      this.ShowHideNextRole = false;
      //this.ShowHideNextAction = false;
    }
    else if (IsNextAction == false && IsRevert == true) {
      this.ShowHideNextUser = true;
      this.ShowHideNextRole = true;
      //this.ShowHideNextAction = false;
    }
  }
}

