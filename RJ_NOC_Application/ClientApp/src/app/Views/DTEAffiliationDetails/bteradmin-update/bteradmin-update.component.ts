import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { DTEAffiliationDataModel, DTEAffiliationRegistrationDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationRegistration/DTEAffiliationRegistrationDataModel';

import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bteradmin-update',
  templateUrl: './bteradmin-update.component.html',
  styleUrls: ['./bteradmin-update.component.css']
})
export class BTERAdminUpdateComponent implements OnInit {
  @ViewChild('tabs') tabGroup!: MatTabGroup;
  public collegeDataList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedDteAffiliationBTERRgID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SeatValue: number = 50;
  public CollegeID: number = 0;
  public CollegeName: string = '';
  public CheckTabsEntryData: any = [];
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 0;
  public CollegeType_IsExisting: boolean = true;
  isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public IsShowDraftFinalSubmit: boolean = true;
  public ApplyAffiliation: string = 'Apply Affiliation';

  public DTEAffiliationFeeDetailsList: any = [];
  public SearchRecordID: string = '';
  request = new DTEAffiliationRegistrationDataModel();
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public DTEAffiliationID: number = 0;
  constructor(private toastr: ToastrService, private loaderService: LoaderService,
    private applyNOCApplicationService: ApplyNOCApplicationService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute,
    private routers: Router, private collegeService: CollegeService, private modalService: NgbModal) { }

  async ngOnInit() {
    this.loaderService.requestStarted();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.CollegeID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.SSOID = this.sSOLoginDataModel.SSOID;
    if (this.SelectedDepartmentID == 12) {
      await this.commonMasterService.GetBTERDetailsIDWise(this.CollegeID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));          
          this.SelectedDepartmentID = data['Data'][0][0]['DepartmentID'];
          this.CollegeID = data['Data'][0][0]['CollegeID'];
          this.CollegeName = data['Data'][0][0]['CollegeName'];        
          this.SelectedDteAffiliationBTERRgID = data['Data'][0][0]['BTERRegID'];        
        }, error => console.error(error));
    }
    else {
      /*this.SelectedDteAffiliationCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString()));*/
    }
    //console.log(this.request.SSOID);
    await this.CheckTabsEntry();
    this.maxNumberOfTabs = this.tabGroup._tabs.length - 1;
    this.loaderService.requestEnded();
  }
  NextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
      this.CheckTabsEntry();
    }
  }
  PreviousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
      this.CheckTabsEntry();
    }
  }
  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;

    try {
    }
    catch (Ex) { }
    this.loaderService.requestEnded();
  }

  async CheckTabsEntry() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.CheckTabsEntryAffiliation(this.SelectedDteAffiliationBTERRgID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckTabsEntryData = data['Data'][0]['data'][0];

          //console.log(this.CheckTabsEntryData);
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

  async GetAffiliationRegistrationList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetAffiliationRegistrationList(this.request.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DTEAffiliationFeeDetailsList = data['Data'][0]['data'];
          console.log(this.DTEAffiliationFeeDetailsList);
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


