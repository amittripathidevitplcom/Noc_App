import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { MGOneDocumentScrutinyService } from '../../../Services/MGOneDocumentScrutiny/mgonedocument-scrutiny.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';

@Component({
  selector: 'app-nodal-secretary-application-list-mgone',
  templateUrl: './nodal-secretary-application-list-mgone.component.html',
  styleUrls: ['./nodal-secretary-application-list-mgone.component.css']
})
export class NodalSecretaryApplicationListMGOneComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public LOIApplicationDetails: any[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public ApplicationNo: string = '';

  sSOVerifyDataModel = new SSOLoginDataModel();

  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';

  AadhaarNo: string = '';

  public isLoading: boolean = false;
  public QueryStringStatus: any = '';
  constructor(private loaderService: LoaderService, private toastr: ToastrService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private mg1DocumentScrutinyService: MGOneDocumentScrutinyService, private modalService: NgbModal,
    private collegeservice: CollegeService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetLOIApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
    this.GetRoleListForApporval();
    this.GetWorkFlowActionListByRole();
  }

  async GetLOIApplicationList(RoleId: number, UserID: number, Status: string) {
    try {
      let ActionName = '';
      ActionName = Status == 'Completed' ? 'Forward' : Status == 'Pending' ? 'Forward,ReSubmit Application' : '';

      this.loaderService.requestStarted();
      await this.mg1DocumentScrutinyService.GetLOIApplicationList(RoleId, UserID, Status, ActionName)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.LOIApplicationDetails = data['Data'];
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

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public ApplicationTrailList: any = [];
  async GetApplicationTrail(content: any, ApplyNOCID: number) {
    this.ApplicationTrailList = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLOIApplicationTrail(ApplyNOCID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationTrailList = data['Data'];


          console.log(this.ApplicationTrailList)
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
    this.SelectedLOIID = 0;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public isFormvalid: boolean = true;
  public isActionValid: boolean = false;
  public isObjectionValid: boolean = false;
  public isRemarkValid: boolean = false;
  public ShowHideNextRole: boolean = true;
  public ShowHideNextUser: boolean = true;
  //public ShowHideNextAction: boolean = true;
  public isActionTypeValid: boolean = false;
  public isNextActionValid: boolean = false;
  public isNextRoleIDValid: boolean = false;
  public isNextUserIdValid: boolean = false;
  public NextRoleID: number = 0;
  public NextUserID: number = 0;
  public ActionID: number = 0;
  public NextActionID: number = 0;
  public CheckFinalRemark: string = '';

  async OpenForwardPopUp(content: any, LOIID: number) {
    this.SelectedLOIID = LOIID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  public SelectedLOIID: number = 0;

  async ForwardApplication() {
    this.isFormvalid = true;
    this.isNextUserIdValid = false;
    this.isNextRoleIDValid = false;
    this.isNextActionValid = false;
    this.isRemarkValid = false;

    try {
    //if (this.CheckFinalRemark == '') {
    //  this.isRemarkValid = true;
    //  this.isFormvalid = false;
    //}

        if (this.ActionID <= 0) {
          this.isActionTypeValid = true;
          this.isFormvalid = false;
        }
        if (this.ShowHideNextRole && this.ShowHideNextUser) {  //&& this.ShowHideNextAction
          if (this.NextRoleID <= 0) {
            this.isNextRoleIDValid = true;
            this.isFormvalid = false;
          }
          //if (this.NextActionID <= 0) {
          //  this.isNextActionValid = true;
          //  this.isFormvalid = false;
          //}
          if (this.NextUserID <= 0) {
            this.isNextUserIdValid = true;
            this.isFormvalid = false;
          }
        }
        else if (!this.ShowHideNextUser && !this.ShowHideNextRole) {//&& !this.ShowHideNextAction
          this.NextRoleID = 1;
          this.NextUserID = 0;
          this.NextActionID = 0;
        }
        //else if (this.ShowHideNextUser && this.ShowHideNextRole && !this.ShowHideNextAction) {
        //  if (this.NextRoleID <= 0) {
        //    this.isNextRoleIDValid = true;
        //    this.isFormvalid = false;
        //  }
        //  if (this.NextUserID <= 0) {
        //    this.isNextUserIdValid = true;
        //    this.isFormvalid = false;
        //  }
        //  this.NextActionID = 0;
        //}
        else if (!this.ShowHideNextUser && this.ShowHideNextRole) {//&& !this.ShowHideNextAction
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
      if (confirm("Are you sure you want to forward this application?")) {
        this.loaderService.requestStarted();
        await this.collegeservice.SaveLOIWorkFlow(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.ActionID, this.SelectedLOIID, 5, '', this.NextRoleID, this.NextUserID, this.NextActionID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success('forwarded successfully');//this.SuccessMessage
              this.modalService.dismissAll('After Success');
              this.routers.navigate(['/dashboard']);
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

  public UserRoleList: any[] = [];
  public UserListRoleWise: any[] = [];
  public WorkFlowActionList: any[] = [];
  public NextWorkFlowActionList: any[] = [];
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
            if (this.UserRoleList.length > 0) {
              this.NextRoleID = this.UserRoleList[0]['RoleID'];
              await this.NextGetUserDetailsByRoleID();
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
        await this.commonMasterService.GetUserDetailsByRoleID(this.NextRoleID, this.sSOLoginDataModel.DepartmentID)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (data['Data'].length > 0) {
              this.UserListRoleWise = data['Data'];
              if (this.UserListRoleWise.length > 0) {
                this.NextUserID = this.UserListRoleWise[0]['UId'];
                //await this.NextGetWorkFlowActionListByRole();
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
  //async NextGetWorkFlowActionListByRole() {
  //  this.NextActionID = 0;
  //  this.NextWorkFlowActionList = [];
  //  this.loaderService.requestStarted();
  //  try {
  //    await this.commonMasterService.GetWorkFlowActionListByRole(this.NextRoleID, "Next", this.sSOLoginDataModel.DepartmentID)
  //      .then(async (data: any) => {
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (data['Data'].length > 0) {
  //          this.NextWorkFlowActionList = data['Data'];
  //          if (this.NextWorkFlowActionList.length > 0) {
  //            this.NextActionID = this.NextWorkFlowActionList[0]['ActionID'];
  //          }
  //        }
  //      })
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
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
              this.WorkFlowActionList = this.WorkFlowActionList.filter((x: { ActionID: number; }) => x.ActionID == 45);
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

  async ApplicationSummary_OnClick(DepartmentID: number, CollegeID: number) {
    window.open('/LOIapplicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())), '_blank')
  }
}

