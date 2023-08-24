import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { MenuService } from '../../../Services/Menu/menu.service';
import { PlatformLocation } from '@angular/common';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
//import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
//import { Keepalive } from '@ng-idle/keepalive';
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.css']
})
export class MasterPageComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  UserName: any = '';
  public MenuHTML: any = "";
  public lstUserRole: any = []
  public RoleID: number = 0;

  //Manage Session
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = undefined;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  @ViewChild('mymodalSessionExpired') mymodalSessionExpired: TemplateRef<any> | undefined;

  constructor(private commonMasterService: CommonMasterService, private router: Router, private loaderService: LoaderService, private menuService: MenuService, private sanitizer: DomSanitizer, location: PlatformLocation, private idle: Idle, private modalService: NgbModal) {
    location.onPopState(() => {
      console.log('pressed back in add!!!!!'); 
    });
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  async ngOnInit() {

    //Added By rishi kapoor >> Manage Session
    this.idle.setIdle(2);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(600);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onIdleEnd.subscribe(() => (this.idleState = "No longer idle."));
    this.idle.onTimeout.subscribe(() => {
      //this.modalService.open('#mymodalSessionExpired', { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
      this.modalService.open(this.mymodalSessionExpired, {centered: true, backdrop: 'static',keyboard: false});
      this.idleState = "Timed out!";
      sessionStorage.removeItem('UserID');
      sessionStorage.removeItem('LoginID');
      sessionStorage.clear();
      localStorage.clear();
      this.timedOut = true;
    });
    this.idle.onIdleStart.subscribe(
      () => (this.idleState = "You've gone idle!")
    );
    this.idle.onTimeoutWarning.subscribe(
      countdown =>
        (this.idleState = "You will time out in " + countdown + " seconds!")
    );
    this.reset();


    //if (sessionStorage.getItem('UserID') == null) {
    //  this.router.navigate(['/dashboard']);
    //}
    //this.UserName = sessionStorage.getItem('UserName');

    sessionStorage.setItem('UserID', "1");
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);
    if (this.sSOLoginDataModel) {
      if (this.sSOLoginDataModel.SSOID == null && this.sSOLoginDataModel.SSOID == '' && this.sSOLoginDataModel.SSOID == undefined) {
        window.open(GlobalConstants.SSOURL, "_self");
        // this.router.navigate(['/login']);
      }
    }
    else {
      window.open(GlobalConstants.SSOURL, "_self");
      // this.router.navigate(['/login']);
    }
    this.RoleID = this.sSOLoginDataModel.UserID;
    await this.GetUserRoleList();
    await this.LoadMenu(this.sSOLoginDataModel.RoleID);

  }

  async GetUserRoleList() {
    try {
      this.loaderService.requestStarted();
      await this.menuService.GetUserRoleList(this.sSOLoginDataModel.SSOID)
        .then((RoleData: any) => {
          RoleData = JSON.parse(JSON.stringify(RoleData));
          this.lstUserRole = RoleData['Data'][0]['data'];
          //this.loaderService.requestEnded();
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);

    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 10);
    }
  }
  async loadMenuByRoleID(SeletedUserId: any) {
    
    this.loaderService.requestStarted();

    this.RoleID = this.lstUserRole.find((x: { UserID: number; }) => x.UserID == SeletedUserId).RoleID;;
    this.sSOLoginDataModel.RoleID = this.RoleID;

    if (this.RoleID > 0) {
      await this.commonMasterService.Check_SSOIDWise_LegalEntity(this.sSOLoginDataModel.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.sSOLoginDataModel.RoleName = data['Data'][0]['data'].find((x: { RoleID: number; UserID: number; }) => x.RoleID == this.RoleID && x.UserID == SeletedUserId).RoleName;
          this.sSOLoginDataModel.DepartmentID = data['Data'][0]['data'].find((x: { RoleID: number; UserID: number; }) => x.RoleID == this.RoleID && x.UserID == SeletedUserId).DepartmentID;
          this.sSOLoginDataModel.UserID = data['Data'][0]['data'].find((x: { RoleID: number; UserID: number; }) => x.RoleID == this.RoleID && x.UserID == SeletedUserId).UserID;
        }, error => console.error(error));
    }
    else {
      this.sSOLoginDataModel.RoleName = "Citizen";
      this.sSOLoginDataModel.DepartmentID = 0;
      this.sSOLoginDataModel.UserID = 0
    }
    localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))

    //this.LoadMenu(this.RoleID);
    window.open('/dashboard', "_self");

    //this.router.navigate(['/dashboard']);
    setTimeout(() => {
      this.loaderService.requestEnded();
    }, 100);
  }
  ////////////Load Menu///////
  async LoadMenu(roleID: number) {
    try {
      this.loaderService.requestStarted();
      this.MenuHTML = '';
      await this.menuService.GetUserWiseMenu(roleID)
        .then((MenuData: any) => {

          MenuData = JSON.parse(JSON.stringify(MenuData));


          this.MenuHTML += " <li class='nav-item'> ";
          this.MenuHTML += " <a class='nav-link' href='dashboard'> ";
          this.MenuHTML += " <i class='bi bi-speedometer'></i><span>Dashboard</span> ";
          this.MenuHTML += " </a> ";
          this.MenuHTML += " </li>";

          MenuData['Data'][0].data.forEach((item: any) => {
            if (item.ParentId == "0") {
              this.MenuHTML += "<li class='nav-item dropdown'>";
              this.MenuHTML += "<a class='nav-link dropdown-toggle' href='#' id='UserMasters' role='button' data-bs-toggle='dropdown' aria-expanded='false'> ";
              this.MenuHTML += item.Icon;
              this.MenuHTML += "<span class=''> ";
              this.MenuHTML += "" + item.MenuName + " ";
              /*this.MenuHTML += "<i class='fas fa-angle-down right'></i> ";*/
              this.MenuHTML += "</span> ";
              this.MenuHTML += "</a> ";
              this.MenuHTML += this.GetSubMenu_Level2(item.MenuId, MenuData['Data'][0].data);

              this.MenuHTML += " </li> ";
            }
          });

          //this.MenuHTML += " <li class='nav-item title'> ";
          //this.MenuHTML += " <a class='nav-link' (click)='Logout()'> ";
          //this.MenuHTML += " <i class='nav-icon fas fa-sign-out-alt'></i> ";
          //this.MenuHTML += " <p>Logout</p> ";
          //this.MenuHTML += " </a> ";
          //this.MenuHTML += " </li> ";

          this.MenuHTML = this.sanitizer.bypassSecurityTrustHtml(this.MenuHTML);

          //console.log(this.MenuHTML);

          //this.loaderService.requestEnded();
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }

  }
  GetSubMenu_Level2(MenuId: any, SubMenuData: any) {
    var GetSubMenu_Level3str = "";
    var GetSubMenu_Level2str = "";
    var GetSubMenu_SecondLevelData = SubMenuData.filter((row: any) => row.ParentId == MenuId);
    if (GetSubMenu_SecondLevelData) {
      GetSubMenu_Level2str = "";
      GetSubMenu_Level2str += " <ul class='dropdown-menu' aria-labelledby='UserMasters'> ";
      GetSubMenu_SecondLevelData.forEach((item2: any) => {
        GetSubMenu_Level3str = "";
        GetSubMenu_Level3str += this.GetSubMenu_Level3(item2.MenuId, SubMenuData);
        if (GetSubMenu_Level3str == "") {
          GetSubMenu_Level2str += " <li class='dropdown-item'> ";
          /*  GetSubMenu_Level2str += " <a href=" + item2.OnSelect + " class='nav-link '> ";*/
          GetSubMenu_Level2str += " <a href='" + item2.OnSelect + "' class='nav-link'><i class='fa fa-angle-right'></i>" + item2.MenuName + "</a> ";

          // GetSubMenu_Level2str += " <p class='SublebelMenu' style='color: " + item2.Forecolor + " !important;'>" + item2.MenuName + "</p> ";
          /*GetSubMenu_Level2str += " <i class='fas fa-angle-down right '></i> "; */
          /*GetSubMenu_Level2str += " </a> ";*/
          GetSubMenu_Level2str += GetSubMenu_Level3str;
          GetSubMenu_Level2str += " </li> ";
        }
        else {


          GetSubMenu_Level2str += " <li class='nav-item dropdown'> ";
          GetSubMenu_Level2str += " <a href='#' id='3' class='nav-link dropdown-toggle' role='button' data-bs-toggle='dropdown' aria-expanded='false'> ";
          GetSubMenu_Level2str += item2.MenuName;

          GetSubMenu_Level2str += " </a> ";
          GetSubMenu_Level2str += GetSubMenu_Level3str;
          GetSubMenu_Level2str += " </li> ";
        }

      });
      GetSubMenu_Level2str += " </ul> ";
    }

    return GetSubMenu_Level2str;
  }
  GetSubMenu_Level3(MenuId: any, SubMenuData: any) {
    var GetSubMenu_Level3str = "";
    var GetSubMenu_Level3Data = SubMenuData.filter((row: any) => row.ParentId == MenuId);
    if (GetSubMenu_Level3Data) {
      if (GetSubMenu_Level3Data.length > 0) {
        GetSubMenu_Level3str = "";
        GetSubMenu_Level3str += " <ul class='dropdown-menu' aria-labelledby='3' data-bs-popper='none'> ";
        GetSubMenu_Level3Data.forEach((item3: any) => {
          GetSubMenu_Level3str += " <li class='dropdown-item'> ";
          GetSubMenu_Level3str += " <a href='" + item3.OnSelect + "' class='nav-link ' style='padding-left: 2rem !important;'> " + item3.MenuName + "";
          GetSubMenu_Level3str += " </a> ";
          GetSubMenu_Level3str += " </li> ";
        });
        GetSubMenu_Level3str += " </ul> ";
      }
    }
    return GetSubMenu_Level3str;
  }
  ////////////End Load Menu///////

  Logout() {
    console.log("Logout...");
    sessionStorage.removeItem('UserID');
    sessionStorage.removeItem('LoginID');
    sessionStorage.clear();
    localStorage.clear();
    window.open(GlobalConstants.SSOURL, "_self");
    //window.open(GlobalConstants.SSOURL, "_self");
    //window.open("https://ssotest.rajasthan.gov.in/signin", "_self");
    // this.router.navigate(['/login']);
    // this.router.navigate(['/login']);
  }

  async BackToSSO() {
    console.log("BAck to SSO...");
    sessionStorage.removeItem('UserID');
    sessionStorage.removeItem('LoginID');
    sessionStorage.clear();
    localStorage.clear();

    try {
      this.loaderService.requestStarted();
      await this.menuService.BackToSSO();
    }
    catch (Ex) {
      console.log(Ex);

    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }
  }

  btnOk() {
    this.BackToSSO();
  }
}
