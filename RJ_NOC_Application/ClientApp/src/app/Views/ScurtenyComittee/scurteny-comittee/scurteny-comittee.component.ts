import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ScurtenyComitteeDataModel } from '../../../Models/ScurtenyComitteeDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { ScurtenyComitteeService } from '../../../Services/ScurtenyComittee/scurteny-comittee.service';

@Component({
  selector: 'app-scurteny-comittee',
  templateUrl: './scurteny-comittee.component.html',
  styleUrls: ['./scurteny-comittee.component.css']
})
export class ScurtenyComitteeComponent implements OnInit {

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
  public LandClass: string = 'tabs-Link ScurtenyComittee';

  selectedIndex: number = 0;
  maxNumberOfTabs: number = 0;
  public CollegeType_IsExisting: boolean = true;
  public ShowObjectionField: boolean = false;

  public TabFieldDataList: any = [];
  public SelectedTabFieldDataList: any = [];
  request = new ScurtenyComitteeDataModel();

  public isFormvalid: boolean = true;
  public isActionValid: boolean = false;
  public isObjectionValid: boolean = false;
  public isRemarkValid: boolean = false;

  public RoleID: number = 10;
  public UserID: number = 0;


  ApprovedCount: number = 0;
  RevertCount: number = 0;
  RejectCount: number = 0;
  TotalCount: number = 0;  


  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService, private scurtenyComitteeService: ScurtenyComitteeService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) { }

  async ngOnInit() {
    debugger;
    this.loaderService.requestStarted();
    console.log(this.router.snapshot.paramMap.get('DepartmentID'));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loaderService.requestEnded();
    this.maxNumberOfTabs = this.tabGroup._tabs.length - 1; 
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
  async SubmitTabAction_Onclick() {
    this.request.DepartmentID = this.SelectedDepartmentID;
    this.request.CollegeID = this.SelectedCollageID;
    this.request.UserID = this.UserID;
    this.request.RoleID = this.RoleID;
    this.request.ApplyNOCID = this.SelectedApplyNOCID;
    this.request.TabName = this.selectedIndex == 0 ? 'Scurteny Comittee' : this.tabGroup._tabs['_results'][this.selectedIndex]['textLabel'];

    this.isActionValid = false;
    this.isObjectionValid = false;
    this.isRemarkValid = false;
    this.isFormvalid = true;
    if (this.request.ActionID <= 0) {
      this.isActionValid = true;
      this.isFormvalid = false;
    }    
    if (this.request.Remark == '') {
      this.isRemarkValid = true;
      this.isFormvalid = false;
    }
    if (!this.isFormvalid) {
      return;
    }  

    try {
      this.loaderService.requestStarted();
      await this.scurtenyComitteeService.SaveScurtenyComittee(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.isActionValid = false;
            this.isObjectionValid = false;
            this.isRemarkValid = false;
            this.isFormvalid = true;
            this.ShowObjectionField = false;
            if (this.selectedIndex != this.maxNumberOfTabs) {
              this.selectedIndex = this.selectedIndex + 1;
            }
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
