import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { DocumentScrutinyDataModel, DocumentScrutinyDetail_DocumentScrutinyDataModel } from '../../Models/DocumentScrutinyDataModel';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CourseMasterService } from '../../Services/Master/AddCourse/course-master.service';
import { ApplyNOCApplicationService } from '../../Services/ApplyNOCApplicationList/apply-nocapplication.service';

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
  public SelectedApplyNOCID: number = 0;
  public CollegeID: number = 0;
  public LandClass: string = 'tabs-Link LandInformation';

  selectedIndex: number = 0;
  maxNumberOfTabs: number = 0;
  public CollegeType_IsExisting: boolean = true;
  public ShowObjectionField: boolean = false;
  public ShowFinalDocumentScrutiny: boolean = true;

  public TabFieldDataList: any = [];
  public SelectedTabFieldDataList: any = [];
  request = new DocumentScrutinyDataModel();
  DocumentScrutinyList: DocumentScrutinyDataModel[] = [];


  public isFormvalid: boolean = true;
  public isActionValid: boolean = false;
  public isObjectionValid: boolean = false;
  public isRemarkValid: boolean = false;

  public DocumentScrutinyDetail: DocumentScrutinyDetail_DocumentScrutinyDataModel[] = [];

  public RoleID: number = 13;
  public UserID: number = 0;


  ApprovedCount: number = 0;
  RevertCount: number = 0;
  RejectCount: number = 0;
  TotalCount: number = 0;
  public AllTabDocumentScrutinyData: any = [];
  public DocumentScrutinyButtonText: string = '';


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
    this.GetTabFieldByTabName('Land Information');
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      idField: "TabFieldID",
      textField: "TabFieldName",
    }
    this.GetAllTabData();
  }

  NextStep() {
    this.GetAllTabData();
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
      this.GetTabFieldByTabName(this.tabGroup._tabs['_results'][this.selectedIndex]['textLabel']);
    }
  }

  PreviousStep() {
    this.GetAllTabData();
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
      if (this.selectedIndex == 0) {
        this.GetTabFieldByTabName('Land Information');
      }
      else {
        this.GetTabFieldByTabName(this.tabGroup._tabs['_results'][this.selectedIndex]['textLabel']);
      }
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    this.GetAllTabData();
    this.selectedIndex = event.index;
    if (this.selectedIndex == 0) {
      this.GetTabFieldByTabName('Land Information');
    }
    else {
      this.GetTabFieldByTabName(this.tabGroup._tabs['_results'][this.selectedIndex]['textLabel']);
    }
  }
  async GetTabFieldByTabName(TabName: string) {
    this.request = new DocumentScrutinyDataModel();
    this.ShowObjectionField = false;
    this.isActionValid = false;
    this.isObjectionValid = false;
    this.isRemarkValid = false;
    this.isFormvalid = true;
    try {
      this.TabFieldDataList = [];
      this.SelectedTabFieldDataList = [];
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTabFieldByTabName(TabName)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TabFieldDataList = data['Data'];
        }, error => console.error(error));
      await this.applyNOCApplicationService.GetDocumentScrutinyData_TabNameCollegeWise(TabName, this.SelectedCollageID, this.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.request = data['Data'][0];
            if (this.request.ActionID == 2 || this.request.ActionID == 3) {
              this.ShowObjectionField = true;
              console.log(this.request.DocumentScrutinyDetail);
              this.SelectedTabFieldDataList = this.request.DocumentScrutinyDetail;
            }
            else {
              this.ShowObjectionField = false;
              this.SelectedTabFieldDataList = [];
            }
          }
          else {
            this.request = new DocumentScrutinyDataModel();
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
  async DocumentScrutiny(ActionType: string) {
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.DocumentScrutiny(this.RoleID, this.UserID, ActionType, this.SelectedApplyNOCID, this.SelectedDepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.routers.navigate(['/applynocapplicationlist']);
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
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


  async ShowHideObjectionDropdown() {
    this.ShowObjectionField = false;
    if (this.request.ActionID == 2 || this.request.ActionID == 3) {
      this.ShowObjectionField = true;
    }
    else {
      this.ShowObjectionField = false;
    }
  }


  async SubmitTabAction_Onclick() {
    this.DocumentScrutinyDetail = [];
    this.request.DepartmentID = this.SelectedDepartmentID;
    this.request.CollegeID = this.SelectedCollageID;
    this.request.UserID = this.UserID;
    this.request.RoleID = this.RoleID;
    this.request.TabName = this.selectedIndex == 0 ? 'Land Information' : this.tabGroup._tabs['_results'][this.selectedIndex]['textLabel'];

    this.isActionValid = false;
    this.isObjectionValid = false;
    this.isRemarkValid = false;
    this.isFormvalid = true;
    if (this.request.ActionID <= 0) {
      this.isActionValid = true;
      this.isFormvalid = false;
    }
    if (this.request.ActionID == 2 || this.request.ActionID == 3) {
      if (this.SelectedTabFieldDataList.length <= 0) {
        this.isObjectionValid = true;
        this.isFormvalid = false;
      }
    }
    if (this.request.Remark == '') {
      this.isRemarkValid = true;
      this.isFormvalid = false;
    }
    if (!this.isFormvalid) {
      return;
    }
    if (this.SelectedTabFieldDataList.length > 0) {
      for (var i = 0; i < this.SelectedTabFieldDataList.length; i++) {
        this.DocumentScrutinyDetail.push({
          DocumentScrutinyDetailID: 0, DocumentScrutinyID: 0, TabFieldID: this.SelectedTabFieldDataList[i].TabFieldID, TabFieldName: this.SelectedTabFieldDataList[i].FieldName
        });
      }
      this.request.DocumentScrutinyDetail = this.DocumentScrutinyDetail;
    }

    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.SaveDocumentScrutiny(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.request = new DocumentScrutinyDataModel();
            this.isActionValid = false;
            this.isObjectionValid = false;
            this.isRemarkValid = false;
            this.isFormvalid = true;
            this.ShowObjectionField = false;
            if (this.selectedIndex != this.maxNumberOfTabs) {
              this.selectedIndex = this.selectedIndex + 1;
              this.GetTabFieldByTabName(this.tabGroup._tabs['_results'][this.selectedIndex]['textLabel']);
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



  async GetAllTabData() {
    this.ShowFinalDocumentScrutiny = true;
    this.ApprovedCount = 0;
    this.RevertCount= 0;
    this.RejectCount= 0;
    this.TotalCount = 0;
    try {
      await this.applyNOCApplicationService.GetDocumentScrutinyData_TabNameCollegeWise('All', this.SelectedCollageID, this.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(data['Data']);
          if (data['Data'].length > 0) {
            this.AllTabDocumentScrutinyData = data['Data'];
            for (var i = 0; i < data['Data'].length; i++) {
              if (data['Data'][i]['DocumentScrutinyID'] > 0) {
                this.TotalCount++;
              }
              if (data['Data'][i]['ActionID'] == 1) {
                this.ApprovedCount++;
              }
              else if (data['Data'][i]['ActionID'] == 2) {
                this.RevertCount++;
              }
              //else if (data['Data'][i]['ActionID'] == 3) {
              //  this.RejectCount++;
              //}

            }
            if (this.RevertCount > 0) {
              if (this.TotalCount == this.maxNumberOfTabs) {
                this.ShowFinalDocumentScrutiny = false;
              }
              this.DocumentScrutinyButtonText = 'Revert';
            }
            if (this.RejectCount > 0 && this.TotalCount == this.maxNumberOfTabs - 1) {
              if (this.TotalCount == this.maxNumberOfTabs) {
                this.ShowFinalDocumentScrutiny = false;
              }
              this.DocumentScrutinyButtonText = 'Reject';
            }
            if (this.ApprovedCount == this.maxNumberOfTabs ) {
              if (this.TotalCount == this.maxNumberOfTabs) {
                this.ShowFinalDocumentScrutiny = false;
              }
              this.DocumentScrutinyButtonText = 'Approve';
            }
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
