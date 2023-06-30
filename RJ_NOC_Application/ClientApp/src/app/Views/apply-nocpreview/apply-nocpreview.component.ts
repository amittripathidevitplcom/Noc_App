import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CourseMasterService } from '../../Services/Master/AddCourse/course-master.service';

@Component({
  selector: 'app-apply-nocpreview',
  templateUrl: './apply-nocpreview.component.html',
  styleUrls: ['./apply-nocpreview.component.css']
})
export class ApplyNOCPreviewComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public dropdownSettings: IDropdownSettings = {};

  @ViewChild('tabs') tabGroup!: MatTabGroup;
  public collegeDataList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public CollegeID: number = 0;
  public LandClass: string = 'tabs-Link LandInformation';

  selectedIndex: number = 0;
  maxNumberOfTabs: number = 0;
  public CollegeType_IsExisting: boolean = true;

  public TabFieldDataList: any = [];
  public SelectedTabFieldDataList: any = [];

  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) { }

  async ngOnInit() {
    this.loaderService.requestStarted();
    console.log(this.router.snapshot.paramMap.get('DepartmentID'));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //await this.GetCollageMaster();
    this.loaderService.requestEnded();
    this.maxNumberOfTabs = this.tabGroup._tabs.length - 1;
    this.GetTabFieldByTabName('Land Information');
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      idField: "TabFieldID",
      textField: "FieldName",
    }
  }

  NextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
      this.GetTabFieldByTabName(this.tabGroup._tabs['_results'][this.selectedIndex]['textLabel']);
    }
  }

  PreviousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
      this.GetTabFieldByTabName(this.tabGroup._tabs['_results'][this.selectedIndex]['textLabel']);
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    this.GetTabFieldByTabName(this.tabGroup._tabs['_results'][this.selectedIndex]['textLabel']);
  }
  async GetTabFieldByTabName(TabName: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTabFieldByTabName(TabName)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TabFieldDataList = data['Data'];
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
