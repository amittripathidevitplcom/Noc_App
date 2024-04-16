import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { WorkFlowMasterDataModel } from '../../../../Models/WorkFlowMasterDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service'
import { WorkFlowMasterService } from '../../../../Services/Admin/WorkFlowMaster/work-flow-master.service';

@Component({
  selector: 'app-work-flow-master',
  templateUrl: './work-flow-master.component.html',
  styleUrls: ['./work-flow-master.component.css']
})
export class WorkFlowMasterComponent implements OnInit {
  WorkFlowMasterForm!: FormGroup;
  WorkFlowMasterFormDetails!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new WorkFlowMasterDataModel();
  isSubmitted: boolean = false;
  public DepartmentData: any = [];
  public SchemeData: any = [];
  public ModuleData: any = [];
  public SubModuleData: any = [];
  public RoleLevelData: any = [];
  public RoleData: any = [];
  public ActionHeadData: any = [];
  public WorkFlowMasterID: any = 0;
  constructor(private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private workFlowMasterService: WorkFlowMasterService) {
    this.WorkFlowMasterForm = this.formBuilder.group(
      {
        ddlDepartmentId: ['', [DropdownValidators]],
        ddlnoctype: [''],
        ddlRoleLevelId: ['', [DropdownValidators]],
        ddlRoleId: ['', [DropdownValidators]]
      });

    this.WorkFlowMasterFormDetails = this.formBuilder.group(
      {
        ddlActionHeadID: ['', [DropdownValidators]],
        ddlActionID: ['', [DropdownValidators]],
        txtListCode: '',
        ddlRoleLevelID: ['', [DropdownValidators]],
        ddlNextRoleID: ['', [DropdownValidators]],
        txtPriority: '',
        txtCompletionDays: '',
        ddlOfficeGroupID: ''
      });
  }
  ngOnInit(): void {
    this.GetDepartmentList();
    this.GetLevelList();
    this.GetActionHeadList();
    this.request.WorkFlowMasterDetailList = []
    this.request.WorkFlowMasterDetailList.push(
      {
        ActionHeadID: 0,
        ActionID: 0,
        ListCode: '',
        RoleLevelID: 0,
        NextRoleID: 0,
        Priority: 0,
        CompletionDays: 0,
        OfficeGroupID: 0,
        WorkFlowMasterDetailID: 0,
        ActionList: [],
        NextUserGroupList: [],
        ActiveStatus: false,
        DeleteStatus: false,
        WorkFlowMasterID: 0,
        ActionHeadName: '',
        ActionName: '',
        RoleLevelName: '',
        NextRoleName: '',
        OfficeGroupName: '',
        RoleName: '',
        DepartmentID: 0,
      });
    if (this.router.snapshot.paramMap.get('id') != null) {
      this.WorkFlowMasterID = this.router.snapshot.paramMap.get('id');
      this.GetWorkFlowMasterList(this.WorkFlowMasterID);
    }
  }
  get form() { return this.WorkFlowMasterForm.controls; }
  get array() {
    return this.WorkFlowMasterForm.get('WorkFlowMasterDetailList') as FormArray;
  }
  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentData = data['Data'];
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
  async GetLevelList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLevelList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoleLevelData = data['Data'];
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
  async GetRoleListByLevelID(LevelID: number, i: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleListByLevelID(LevelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (i != -1) {
            this.request.WorkFlowMasterDetailList[i].NextRoleID = this.WorkFlowMasterID <= 0 ? 0 : this.request.WorkFlowMasterDetailList[i].NextRoleID;
            this.request.WorkFlowMasterDetailList[i].NextUserGroupList = data['Data'];
          }
          else {
            this.request.RoleID = this.WorkFlowMasterID <= 0 ? 0 : this.request.RoleID;
            this.RoleData = data['Data'];
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
  async AddMoreRoleMap() {
    try {
      if (this.ValidateAddNewRoleMap(true)) {
        this.loaderService.requestStarted();
        await this.request.WorkFlowMasterDetailList.push({
          ActionID: 0,
          ActionHeadID: 0,
          ListCode: '',
          RoleLevelID: 0,
          NextRoleID: 0,
          Priority: 0,
          CompletionDays: 0,
          OfficeGroupID: 0,
          WorkFlowMasterDetailID: 0,
          ActionList: [],
          NextUserGroupList: [],
          ActiveStatus: false,
          DeleteStatus: false,
          WorkFlowMasterID: this.WorkFlowMasterID > 0 ? this.WorkFlowMasterID : 0,
          ActionHeadName: '',
          ActionName: '',
          RoleLevelName: '',
          NextRoleName: '',
          OfficeGroupName: '',
          RoleName: '',
          DepartmentID: 0,
        });
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
  async DeleteWorkFlowDetail(i: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();

        if (this.request.WorkFlowMasterDetailList[i].WorkFlowMasterDetailID > 0) {
          this.request.WorkFlowMasterDetailList[i].DeleteStatus = true;
          this.request.WorkFlowMasterDetailList[i].ActiveStatus = false;
        }
        else {
          this.request.WorkFlowMasterDetailList.splice(i, 1);
        }
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async GetActionHeadList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetActionHeadList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ActionHeadData = data['Data'];
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
  async GetActionListByActionHead(ActionHeadID: number, i: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetActionListByActionHead(ActionHeadID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.WorkFlowMasterDetailList[i].ActionList = data['Data'];
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
  async SaveData() {
    debugger;
    this.isSubmitted = true;
    if (this.WorkFlowMasterForm.invalid) {
      return
    }

    try {
      if (this.ValidateAddNewRoleMap(false)) {
        this.loaderService.requestStarted();
        await this.workFlowMasterService.SaveData(this.request)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (!this.State) {
              this.toastr.success(this.SuccessMessage);
              this.ResetControl();
            }
            else {
              this.toastr.error(this.ErrorMessage);
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
  ResetControl() {
    this.routers.navigate(['/workflowmaster']);
    this.request = new WorkFlowMasterDataModel();
    this.request.WorkFlowMasterDetailList = [];
    this.request.WorkFlowMasterDetailList.push({
      ActionID: 0,
      ActionHeadID: 0,
      ListCode: '',
      RoleLevelID: 0,
      NextRoleID: 0,
      Priority: 0,
      CompletionDays: 0,
      OfficeGroupID: 0,
      WorkFlowMasterDetailID: 0,
      ActionList: [],
      NextUserGroupList: [],
      ActiveStatus: false,
      DeleteStatus: false,
      WorkFlowMasterID: this.WorkFlowMasterID > 0 ? this.WorkFlowMasterID : 0,
      ActionHeadName: '',
      ActionName: '',
      RoleLevelName: '',
      NextRoleName: '',
      OfficeGroupName: '',
      RoleName: '',
      DepartmentID: 0,
    });
  }
  ValidateAddNewRoleMap(IsAddNew: boolean) {
    var message = 'Please validate following\n';
    var WorkFlowDetailLength = this.request.WorkFlowMasterDetailList.length;
    var WorkFlowDetailLengthWithoutDelete = 0;
    if (WorkFlowDetailLength > 0) {
      for (var i = 0; i < this.request.WorkFlowMasterDetailList.length; i++) {
        if (this.request.WorkFlowMasterDetailList[i].DeleteStatus != true) {
          if (this.request.WorkFlowMasterDetailList[i].ActionHeadID == 0) {
            message += 'Please select Action Head \n';
          }
          if (this.request.WorkFlowMasterDetailList[i].ActionID == 0) {
            message += 'Please select Action \n';
          }
          if (this.request.WorkFlowMasterDetailList[i].RoleLevelID == 0) {
            message += 'Please select Role level \n';
          }
          if (this.request.WorkFlowMasterDetailList[i].NextRoleID == 0) {
            message += 'Please select Next user group \n';
          }
        }
        else {
          WorkFlowDetailLengthWithoutDelete++;
        }
      }

    }
    if (WorkFlowDetailLengthWithoutDelete == WorkFlowDetailLength && !IsAddNew) { message += 'Add atleast one Role Map \n'; }
    if (message.length > 30) {
      alert(message);
      return false;
    }
    return true
  }

  async GetWorkFlowMasterList(WorkFlowMasterID: number) {
    try {
      this.loaderService.requestStarted();
      await this.workFlowMasterService.GetWorkFlowMasterList(WorkFlowMasterID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request = data['Data'][0];
          this.GetRoleListByLevelID(this.request.RoleLevelID, -1);
          for (var i = 0; i < this.request.WorkFlowMasterDetailList.length; i++) {
            this.GetActionListByActionHead(this.request.WorkFlowMasterDetailList[i].ActionHeadID, i);
            this.GetRoleListByLevelID(this.request.WorkFlowMasterDetailList[i].RoleLevelID, i);
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
  public WorkflowNOCTypelst: any = [];
  async GetWorkflowNOCType(DepartmentID: number) {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, "WorkflowNOCType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.WorkflowNOCTypelst = data['Data'];
          if (this.WorkflowNOCTypelst.length > 0) {
            this.request.NOCTypeID = this.WorkflowNOCTypelst.find((x: { Name: string; }) => x.Name == "NOC")?.ID;
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
}
