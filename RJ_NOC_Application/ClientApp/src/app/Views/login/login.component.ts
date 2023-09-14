import { Component, OnInit, Input, Injectable, Inject, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../Services/Login/login.service';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { SSOLandingDataDataModel, SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { SSOLoginService } from '../../Services/SSOLogin/ssologin.service';


@Injectable()

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  //Add FormBuilder
  LoginForm!: FormGroup;

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/

  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  isEdit: boolean = false;

  public UserID: number = 0;

  UserName: string = '';
  Password: string = '';
  sSOLandingDataDataModel = new SSOLandingDataDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();


  constructor(private loginService: LoginService, private toastr: ToastrService, private loaderService: LoaderService, private sSOLoginService: SSOLoginService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {

  }
  async ngOnInit() {

    this.LoginForm = this.formBuilder.group(
      {
        txtUserID: ['', Validators.required],
        txtPassword: ['', Validators.required],
      })
    const element = document.getElementById('txtUserID')
    if (element) element.focus();
  }

  get form() { return this.LoginForm.controls; }

  async Login() {
    let count = 0;
    this.isSubmitted = true;
    if (this.LoginForm.invalid) {
      return
    }
    try {
      this.loaderService.requestStarted();
      this.sSOLandingDataDataModel.Username = this.UserName;
      this.sSOLandingDataDataModel.Password = this.Password;
      this.sSOLandingDataDataModel.LoginType = "0";
      
      await this.sSOLoginService.GetSSOUserLogionDetails(this.sSOLandingDataDataModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          
          if (this.State == 0) {
            this.sSOLoginDataModel = data['Data'];
          }
          else {
            this.toastr.error(this.SuccessMessage)
            count = count + 1;
            return;
          }
        }, error => console.error(error));
      if (count != 0) {
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
      console.log(this.sSOLoginDataModel.RoleID);
      if (this.sSOLoginDataModel.RoleID == 0) {
        this.sSOLoginDataModel.RoleID = 0;
      }
      if (this.sSOLoginDataModel.SSOID == "" || this.sSOLoginDataModel.SSOID == undefined || this.sSOLoginDataModel.SSOID == null) {
        this.toastr.error("Unable to service request.!");
        this.loaderService.requestEnded();
        return;
      }


      localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))

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
  GotoPassword() {
    if (this.UserName != '') {
      const txtPassword = document.getElementById('txtPassword')
      if (txtPassword) txtPassword.focus();
    }
  }
}


