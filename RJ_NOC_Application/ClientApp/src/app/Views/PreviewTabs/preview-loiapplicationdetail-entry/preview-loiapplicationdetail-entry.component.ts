import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {  MatTabChangeEvent,MatTabGroup } from '@angular/material/tabs';
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
import { LOIApplicationPDFComponent } from '../../loiapplication-pdf/loiapplication-pdf.component';
@Component({
  selector: 'app-preview-loiapplicationdetail-entry',
  templateUrl: './preview-loiapplicationdetail-entry.component.html',
  styleUrls: ['./preview-loiapplicationdetail-entry.component.css']
})



export class PreviewLOIapplicationdetailEntryComponent implements OnInit {
  @ViewChild('tabs') tabGroup!: MatTabGroup;
  LegalEntityDataModel = new LegalEntityDataModel();
  TrusteeGeneralInfoList: TrusteeGeneralInfoDataModel[] = [];
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];



  sSOLoginDataModel = new SSOLoginDataModel();
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 0;

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  constructor(   private modalService: NgbModal, private loaderService: LoaderService, 
     private commonMasterService: CommonMasterService, private router: ActivatedRoute,
     ) { }

  async ngOnInit() {

    this.loaderService.requestStarted();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.maxNumberOfTabs = 8;
    this.loaderService.requestEnded();


  }
  NextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }
  PreviousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }
  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

  async btnViewPDfPreview(content: any) {
    const modalRef = this.modalService.open(LOIApplicationPDFComponent,
      { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
    modalRef.componentInstance.CollegeID = this.SelectedCollageID;
    modalRef.componentInstance.DepartmentID = this.SelectedDepartmentID;
  }
}

