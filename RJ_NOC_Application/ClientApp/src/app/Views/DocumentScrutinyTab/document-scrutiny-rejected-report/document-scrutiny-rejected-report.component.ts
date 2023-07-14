import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonMasterDataModel } from '../../../Models/CommonMasterDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';

@Component({
  selector: 'app-document-scrutiny-rejected-report',
  templateUrl: './document-scrutiny-rejected-report.component.html',
  styleUrls: ['./document-scrutiny-rejected-report.component.css']
})
export class DocumentScrutinyRejectedReportComponent implements OnInit {

  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public DocumentScrutinyComplete: any = [];
  public UserID: number = 0;

  constructor(private loaderService: LoaderService, private toastr: ToastrService, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.sSOLoginDataModel.RoleID = 0;
    console.log(this.sSOLoginDataModel.RoleID);
    await this.GetDocumentScrutinyCompletedReportRoleWise(this.UserID);
  }
  async GetDocumentScrutinyCompletedReportRoleWise(UserID: number) {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.GetDocumentScrutinyReportByRole(UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'][0]['data'].length > 0) {
            this.DocumentScrutinyComplete = data['Data'][0]['data'];
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

