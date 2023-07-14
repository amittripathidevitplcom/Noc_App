import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApplyNOCApplicationService } from '../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyNOCApplicationDataModel } from '../../Models/ApplyNOCApplicationDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';

@Component({
  selector: 'app-revert-apply-nocapplication-list',
  templateUrl: './revert-apply-nocapplication-list.component.html',
  styleUrls: ['./revert-apply-nocapplication-list.component.css']
})
export class RevertApplyNOCApplicationListComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public RevertApplyNocList: any = [];
  constructor(private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetRevertApplyNOCApplicationDepartmentRoleWise(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID);
  }
  async GetRevertApplyNOCApplicationDepartmentRoleWise(DepartmentID: number, RoleId: number, UserID: number) {
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GetApplyNOCApplicationListByRole(RoleId, UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RevertApplyNocList = data['Data'];
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
