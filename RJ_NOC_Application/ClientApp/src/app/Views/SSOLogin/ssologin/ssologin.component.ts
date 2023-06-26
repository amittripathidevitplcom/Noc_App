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
  LoginType: any;
  Username: any;
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
    //this.loaderService.requestStarted();
    //this.Username = this.router.snapshot.queryParams.id1;
    //this.LoginType = this.router.snapshot.queryParams.id2;
    await this.Citizenlogin(this.Username, this.LoginType);
    //setTimeout(() => {
    //  this.loaderService.requestEnded();
    //}, 200);
  }



  async Citizenlogin(Username: string, LoginType: string) {
    try {
      this.sSOLandingDataDataModel.Username = Username;
      this.sSOLandingDataDataModel.LoginType = LoginType;



      this.SSOjson = "{\"SSOID\": \"RISHIKAPOORDELHI\",\"AadhaarId\": \"444088094507722\",\"BhamashahId\": null,\"BhamashahMemberId\": null,\"DisplayName\": \"RISHI KAPOOR\",\"DateOfBirth\": \"17/09/1991\",\"Gender\": \"MALE\",\"MobileNo\": null,\"TelephoneNumber\": \"07742860212\",\"IpPhone\": null,\"MailPersonal\": \"RISHIKAPOORDELHI@GMAIL.COM\",\"PostalAddress\": \"D-119D 119, GALI NO 6 GAUTAM MARG, NIRMAN NAGAR\",\"PostalCode\": \"302019\",\"l\": \"JAIPUR\",\"st\": \"RAJASTHAN\",\"Photo\": null,\"Designation\": \"CITIZEN\",\"Department\": \"GOOGLE\",\"MailOfficial\": null,\"EmployeeNumber\": null,\"DepartmentId\": null,\"FirstName\": \"RISHI\",\"LastName\": \"KAPOOR\",\"SldSSOIDs\": null,\"JanaadhaarId\": null,\"ManaadhaarMemberId\": null,\"UserType\": \"CITIZEN\",\"Mfa\": \"0\"} ";
      localStorage.setItem('SSOLoginUser', this.SSOjson)


      try {
        this.loaderService.requestStarted();
        this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
        await this.commonMasterService.Check_SSOIDWise_LegalEntity(this.sSOLoginDataModel.SSOID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log(data);
            if (data['Data'].length > 0) {
              this.routers.navigate(['/dashboard']);
            }
            else {
              this.routers.navigate(['/legalentity']);
            }
          }, error => console.error(error));
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




     // this.routers.navigate(['/legalentity']);

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
