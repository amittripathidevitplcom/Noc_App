import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DocumentScrutinyDataModel, DocumentScrutinyDetail_DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';

@Component({
  selector: 'app-preview-rncregistrat',
  templateUrl: './preview-rncregistrat.component.html',
  styleUrls: ['./preview-rncregistrat.component.css']
})
export class PreviewRNCRegistratComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public dropdownSettings: IDropdownSettings = {};

  @ViewChild('tabs') tabGroup!: MatTabGroup;
  public collegeDataList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public CollegeID: number = 0;
  public LandClass: string = 'tabs-Link LandInformation';

  selectedIndex: number = 0;
  maxNumberOfTabs: number = 0;
  public CollegeType_IsExisting: boolean = true;
  public ShowObjectionField: boolean = false;
  public ShowFinalDocumentScrutiny: boolean = true;



  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) { }

  async ngOnInit() {
    this.loaderService.requestStarted();
    console.log(this.router.snapshot.paramMap.get('DepartmentID'));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //await this.GetCollageMaster();
    this.loaderService.requestEnded();
    this.maxNumberOfTabs = this.tabGroup._tabs.length - 1;
    //this.GetTabFieldByTabName('Land Information');
    
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

}
