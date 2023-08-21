//import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
//import { ActivatedRoute, Router } from '@angular/router';
//import { ToastrService } from 'ngx-toastr';
//import { SSOLandingDataDataModel, SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
//import { LoaderService } from '../../../Services/Loader/loader.service';
//import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';

//@Component({
//  selector: 'app-ssologin',
//  templateUrl: './ssologin.component.html',
//  styleUrls: ['./ssologin.component.css']
//})

//export class SSOLoginComponent implements OnInit {
//  LoginType: any;
//  Username: any;
//  sSOLoginDataModel = new SSOLoginDataModel();
//  sSOLandingDataDataModel = new SSOLandingDataDataModel();
//  public State: number = -1;
//  public SuccessMessage: any = [];
//  public ErrorMessage: any = [];

//  constructor(private activatedRoute: ActivatedRoute, private sSOLoginService: SSOLoginService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute, private routers: Router, private cdRef: ChangeDetectorRef) { }

//  init() {
//    this.loaderService.getSpinnerObserver().subscribe((status) => {
//      this.cdRef.detectChanges();
//    });
//  }

//  async ngOnInit() {
//    this.loaderService.requestStarted();
//    this.Username = this.router.snapshot.queryParams.id1;
//    this.LoginType = this.router.snapshot.queryParams.id2;
//    await this.Citizenlogin(this.Username, this.LoginType);
//    setTimeout(() => {
//      this.loaderService.requestEnded();
//    }, 200);
//  }

//  async Citizenlogin(Username: string, LoginType: string) {
//    try {

//      this.sSOLandingDataDataModel.Username = Username;
//      this.sSOLandingDataDataModel.LoginType = LoginType;

//      await this.sSOLoginService.GetSSOUserLogionDetails(this.sSOLandingDataDataModel)
//        .then((data: any) => {
//          data = JSON.parse(JSON.stringify(data));
//          this.State = data['State'];
//          this.SuccessMessage = data['SuccessMessage'];
//          this.ErrorMessage = data['ErrorMessage'];
//          if (this.State == 0) {
//            console.log(data['Data']);

//            
//            this.sSOLoginDataModel = data['Data'];

//            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))

//            //IF sso id exit in table
//           // {
//               //this.routers.navigate(['/dashboard']);
//          //  }
//           //else {
//            this.routers.navigate(['/legalentity']);
//           //}
//          }
//          else if (this.State == 2) {
//            this.toastr.warning(this.ErrorMessage)
//          }
//          else {
//            this.toastr.error(this.ErrorMessage)
//          }
//        }, error => {
//          this.toastr.warning("Unable to connect to server .!");
//        })
//    }
//    catch (Ex) {
//      console.log(Ex);
//    }
//    finally {
//      setTimeout(() => {
//        this.loaderService.requestEnded();
//      }, 200);
//    }
//  }
//}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { SSOLandingDataDataModel, SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';

@Component({
  selector: 'app-ssologin',
  templateUrl: './ssologin.component.html',
  styleUrls: ['./ssologin.component.css']
})

export class SSOLoginComponent implements OnInit {
  LoginType: any = "1";
  Username: any;
  LoginRoleType: any;
  sSOLoginDataModel = new SSOLoginDataModel();
  sSOLandingDataDataModel = new SSOLandingDataDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SSOjson: any = [];

  constructor(private activatedRoute: ActivatedRoute, private sSOLoginService: SSOLoginService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute, private routers: Router, private cdRef: ChangeDetectorRef, private commonMasterService: CommonMasterService) { }

  init() {
    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }


  async ngOnInit() {
    this.loaderService.requestStarted();
    //this.Username = this.router.snapshot.queryParams.id1;
    //this.LoginRoleType = this.router.snapshot.queryParams.id2;
    //alert(this.LoginType);
   this.Username = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('id1')?.toString());
   // this.LoginType = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('id2')?.toString());
    console.log(this.Username);
    if (this.Username == undefined) {
      this.Username = this.router.snapshot.queryParams.id1;

    }

    await this.Citizenlogin(this.Username, this.LoginType);
    setTimeout(() => {
      this.loaderService.requestEnded();
    }, 200);
  }

  async Citizenlogin(LoginSSOID: string, LoginType: string) {
    try {
      this.sSOLandingDataDataModel.Username = LoginSSOID;
      this.sSOLandingDataDataModel.LoginType = '-999';
      this.sSOLandingDataDataModel.Password = LoginSSOID;
       
  
      if (LoginSSOID == undefined || LoginSSOID == '' || LoginSSOID == 'NaN' || LoginSSOID.toString() == NaN.toString()) {
        //LoginSSOID = "RISHIKAPOORDELHI";
        window.open(GlobalConstants.SSOURL, "_self");
        //this.router.navigate(['/login']);
      }
      
      await this.sSOLoginService.GetSSOUserLogionDetails(this.sSOLandingDataDataModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.sSOLoginDataModel = data['Data'];
          }
        }, error => console.error(error));
      
      if (this.sSOLoginDataModel.SSOID == '') {
        window.open(GlobalConstants.SSOURL, "_self");
        //this.router.navigate(['/login']);
        return;
      }

      await this.commonMasterService.Check_SSOIDWise_LegalEntity(this.sSOLoginDataModel.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data['Data'][0]['data'].length > 0) {
            
            this.sSOLoginDataModel.SSOID = data['Data'][0]['data'][0]['SSOID'];
            this.sSOLoginDataModel.RoleID = data['Data'][0]['data'][0]['RoleID'];
            this.sSOLoginDataModel.RoleName = data['Data'][0]['data'][0]['RoleName'];
            this.sSOLoginDataModel.DepartmentID = data['Data'][0]['data'][0]['DepartmentID'];
            this.sSOLoginDataModel.UserID = data['Data'][0]['data'][0]['UserID'];
          }
        }, error => console.error(error));
      //console.log(this.sSOLoginDataModel.RoleID);
      if (this.sSOLoginDataModel.RoleID == 0) {
        this.sSOLoginDataModel.RoleID = 0;
      }
      //this.SSOjson = "{\"SSOID\": \"" + LoginSSOID + "\",\"AadhaarId\": \"444088094507722\",\"BhamashahId\": null,\"BhamashahMemberId\": null,\"DisplayName\": \"RISHI KAPOOR\",\"DateOfBirth\": \"17/09/1991\",\"Gender\": \"MALE\",\"MobileNo\": null,\"TelephoneNumber\": \"07742860212\",\"IpPhone\": null,\"MailPersonal\": \"RISHIKAPOORDELHI@GMAIL.COM\",\"PostalAddress\": \"D-119D 119, GALI NO 6 GAUTAM MARG, NIRMAN NAGAR\",\"PostalCode\": \"302019\",\"l\": \"JAIPUR\",\"st\": \"RAJASTHAN\",\"Photo\": null,\"Designation\": \"CITIZEN\",\"Department\": \"GOOGLE\",\"MailOfficial\": null,\"EmployeeNumber\": null,\"DepartmentId\": null,\"FirstName\": \"RISHI\",\"LastName\": \"KAPOOR\",\"SldSSOIDs\": null,\"JanaadhaarId\": null,\"ManaadhaarMemberId\": null,\"UserType\": \"CITIZEN\",\"Mfa\": \"0\",\"RoleID\": \"" + this.RoleID + "\",\"RoleName\": \"" + this.RoleName + "\",\"DepartmentID\": \"" + this.DepartmentID + "\"} ";
      

      localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
      /// localStorage.setItem('SSOLoginUser', this.SSOjson)

      console.log(this.SSOjson);

      try {
        this.loaderService.requestStarted();
        this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

        if (this.sSOLoginDataModel.RoleName.length > 0) {
          this.routers.navigate(['/dashboard']);
        }
        else {
          this.routers.navigate(['/legalentity']);
        }
      }
      catch (Ex) {
        console.log(Ex);
        this.routers.navigate(['/legalentity']);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
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
}
