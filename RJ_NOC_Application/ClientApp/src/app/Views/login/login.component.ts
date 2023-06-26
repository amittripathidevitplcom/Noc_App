import { Component, OnInit, Input, Injectable, Inject, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../Services/Login/login.service';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';


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

  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  isEdit: boolean = false;

  public UserID: number = 0;
  public projectMasterData: any = [];
  searchText: string = '';

  LoginID: string = '';
  Password: string = '';



  constructor(private loginService: LoginService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {

  }
  async ngOnInit() {

    this.LoginForm = this.formBuilder.group(
      {
        txtLoginID: ['', Validators.required],
        txtPassword: ['', Validators.required],
      })
    const element = document.getElementById('txtLoginID')
    if (element) element.focus();
  }

  get form() { return this.LoginForm.controls; }

  async Login() {



    this.isSubmitted = true;
    if (this.LoginForm.invalid) {
      return
    }
    try {
      this.loaderService.requestStarted();
      await this.loginService.Login(this.LoginID, this.Password)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            console.log(data['Data']);
            sessionStorage.setItem('UserID', data['Data'][0]["UserID"]);
            sessionStorage.setItem('LoginID', data['Data'][0]["LoginID"]);
            sessionStorage.setItem('UserName', data['Data'][0]["UserName"]);
            this.routers.navigate(['/dashboard']);
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
            setTimeout(() => {
              this.isLoading = false;
            }, 200);
          }
          else {
            this.toastr.error(this.ErrorMessage)
            setTimeout(() => {
              this.isLoading = false;
            }, 200);
          }
        }, error => {
          this.toastr.warning("Unable to connect to server .!");
          setTimeout(() => {
            this.isLoading = false;
          }, 200);
        })
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {

    }
  }
  GotoPassword() {
    if (this.LoginID != '') {
      const txtPassword = document.getElementById('txtPassword')
      if (txtPassword) txtPassword.focus();
    }
  }
}


