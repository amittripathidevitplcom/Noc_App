import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import {  NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TrusteeGeneralInfoDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { LegalEntityDataModel } from '../../../Models/LegalEntityDataModel';

import { HospitalDetailService } from '../../../Services/Tabs/HospitalDetail/hospital-detail.service';
@Component({
  selector: 'app-preview-loiapplicationdetail-entry',
  templateUrl: './preview-loiapplicationdetail-entry.component.html',
  styleUrls: ['./preview-loiapplicationdetail-entry.component.css']
})



export class PreviewLOIapplicationdetailEntryComponent implements OnInit {

  LegalEntityDataModel = new LegalEntityDataModel();
  TrusteeGeneralInfoList: TrusteeGeneralInfoDataModel[] = [];
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];



  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  constructor(   private modalService: NgbModal, private toastr: ToastrService, private loaderService: LoaderService, private collegeService: CollegeService,
     private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,  private hospitalDetailService: HospitalDetailService,
     ) { }

  async ngOnInit() {

    this.loaderService.requestStarted();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loaderService.requestEnded();


  }

  
}

