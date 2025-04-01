import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TrusteeGeneralInfoDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { LegalEntityDataModel } from '../../../Models/LegalEntityDataModel';

import { HospitalDetailService } from '../../../Services/Tabs/HospitalDetail/hospital-detail.service';
import { BTERApplicationPDFComponent } from '../../DTE_Affiliation/bterapplication-pdf/bterapplication-pdf.component';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
@Component({
  selector: 'app-bterdocument-scrutiny',
  templateUrl: './bterdocument-scrutiny.component.html',
  styleUrls: ['./bterdocument-scrutiny.component.css']
})



export class BTERDocumentScrutinyComponent implements OnInit {
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
  maxNumberOfTabs: number = 1;

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public AffiliationRegID: number = 0;
  public AffiliationRegStatus: any = '';
  public ApplicationStatus: string = '';
  public IsManagmentType: boolean = false;
  public UserSSOID: string = '';
  public legalEntityListData1: any = [];
  constructor(private modalService: NgbModal, private loaderService: LoaderService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private legalEntityListService: LegalEntityService
  ) { }

  async ngOnInit() {

    this.loaderService.requestStarted();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.AffiliationRegID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTEAffiliationID')?.toString());
    this.AffiliationRegStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());
    this.ApplicationStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationStatus')?.toString());
    this.maxNumberOfTabs = 1;
    this.UserSSOID = this.sSOLoginDataModel.SSOID;
    try {
      this.loaderService.requestStarted();
      await this.legalEntityListService.GetLegalEntityBySSOID(this.UserSSOID, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.legalEntityListData1 = data['Data'][0]['data']['Table'][0];
          if (this.legalEntityListData1['ManagementType'] == 'Private') {
            this.IsManagmentType = true;
          }
          else {
            this.IsManagmentType = false;
          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
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
    debugger;
    const modalRef = this.modalService.open(BTERApplicationPDFComponent,
      { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
    modalRef.componentInstance.DepartmentID = this.SelectedDepartmentID;
    modalRef.componentInstance.AffiliationRegID = this.AffiliationRegID;

    modalRef.componentInstance.Status = this.AffiliationRegStatus;

  }
}


