import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { AddRoleMasterService } from '../../../../Services/Master/AddRoleMaster/add-role-master.service';

import { Clipboard } from '@angular/cdk/clipboard';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { UserRoleRightsDataModel } from '../../../../Models/AddRoleMasterDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-user-role-rights',
  templateUrl: './user-role-rights.component.html',
  styleUrls: ['./user-role-rights.component.css']
})
export class UserRoleRightsComponent implements OnInit {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public MenuList: UserRoleRightsDataModel[] = [];

  public All_U_View: boolean = false;
  public All_U_Add: boolean = false;
  public All_U_Update: boolean = false;
  public All_U_Delete: boolean = false;
  public All_U_Print: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private menuService: MenuService, private clipboard: Clipboard, private addRoleMasterService: AddRoleMasterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllMenuList();
  }
  async GetAllMenuList() {
    try {
      //this.loaderService.requestStarted();
      await this.menuService.GetAllMenuUserRoleRightsRoleWise(this.sSOLoginDataModel.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //console.log('Test Menu');
          //console.log(data['Data']);
          //console.log('Test Menu');
          this.MenuList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }

  }


  checkboxthView_checkboxchange($event: any, checkValuethView: boolean) {
    this.All_U_View = checkValuethView;
    for (let item of this.MenuList) {
      item.NG_U_View = checkValuethView;
    }
  }
  checkboxthAdd_checkboxchange($event: any, checkValuethAdd: boolean) {
    this.All_U_Add = checkValuethAdd;
    for (let item of this.MenuList) {
      item.NG_U_Add = checkValuethAdd;
    }
  }
  checkboxthUpdate_checkboxchange($event: any, checkValuethUpdate: boolean) {
    this.All_U_Update = checkValuethUpdate;
    for (let item of this.MenuList) {
      item.NG_U_Update = checkValuethUpdate;
    }
  }
  checkboxthDelete_checkboxchange($event: any, checkValuethDelete: boolean) {
    this.All_U_Delete = checkValuethDelete;
    for (let item of this.MenuList) {
      item.NG_U_Delete = checkValuethDelete;
    }
  }
  checkboxthPrint_checkboxchange($event: any, checkValuethPrint: boolean) {
    this.All_U_Print = checkValuethPrint;
    for (let item of this.MenuList) {
      item.NG_U_Print = checkValuethPrint;
    }
  }

  async SaveData() {

    if (this.MenuList.length == 0) {
      this.toastr.warning("Select Menu Data.!")
      return;
    }

    ///Check Validators
    //Show Loading 
    this.loaderService.requestStarted();
    try {
      await this.addRoleMasterService.SaveUserRightData(this.MenuList)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
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
}
