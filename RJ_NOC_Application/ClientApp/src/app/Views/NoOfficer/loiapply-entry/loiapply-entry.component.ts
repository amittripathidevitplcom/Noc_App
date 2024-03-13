import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { bottom } from '@popperjs/core';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { AcademicInformationComponent } from '../../TabDetail/academic-information/academic-information.component';
import { StaffDetailsComponent } from '../../TabDetail/staff-details/staff-details.component';

@Component({
  selector: 'app-loiapply-entry',
  templateUrl: './loiapply-entry.component.html',
  styleUrls: ['./loiapply-entry.component.css']
})
export class LOIApplyEntryComponent implements OnInit {
  @ViewChild('tabs') tabGroup!: MatTabGroup;
  public collegeDataList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SeatValue: number = 50;
  public CollegeID: number = 0;
  public LandClass: string = 'tabs-Link LandInformation';
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
  public SearchRecordID: string = '';

  @ViewChild(StaffDetailsComponent)
  private staffDetailsComponent!: StaffDetailsComponent;

  @ViewChild(AcademicInformationComponent)
  private academicInformationComponent!: AcademicInformationComponent;

  public DraftbuttonName: string = 'Save Draft';

  public QueryStringStatus: any = '';
  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private collegeService: CollegeService) { }

  async ngOnInit() {
    // $(".secondTab").addClass("highLightTab");
    this.loaderService.requestStarted();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    //this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));


    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //this.request.CollegeID = data['Data']['CollegeID'];
          this.SelectedCollageID = data['Data']['CollegeID'];
          if (this.SelectedCollageID == null || this.SelectedCollageID == 0 || this.SelectedCollageID == undefined) {
            this.routers.navigate(['/LOIapplyentry']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/LOIapplyentry']);
    }


    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //await this.GetCollageMaster();
    if (this.SelectedDepartmentID == 5) {
      this.DraftbuttonName = 'Apply LOI';
    }
    else {
      this.DraftbuttonName = 'Save Draft';
    }
    await this.GetCollageDetails();
    await this.GetCollegeBasicDetails();
    await this.CheckTabsEntry();
    await this.ShowDraftFinalSubmitBtn();
    this.loaderService.requestEnded();
    this.maxNumberOfTabs = this.tabGroup._tabs.length - 1;
  }

  NextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;

    }
    this.ShowDraftFinalSubmitBtn();
  }

  PreviousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
    this.ShowDraftFinalSubmitBtn();
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    this.ShowDraftFinalSubmitBtn();
    this.staffDetailsComponent.GetCollegeWiseSubjectList(this.SelectedCollageID);
    this.academicInformationComponent.GetCourseList_CollegeWise(this.SelectedCollageID);

  }

  async GetCollageDetails() {
    try {
      this.loaderService.requestStarted();
      await this.collegeService.GetData(this.SelectedCollageID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.collegeDataList = data['Data'];
          if (this.collegeDataList['CollegeStatus'] == 'New') {
            this.CollegeType_IsExisting = false;
            //this.isAcademicInformation = false;
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
  async GetCollegeBasicDetails() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeBasicDetails(this.SelectedCollageID.toString())
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeName = data['Data'][0]['data'][0]['CollegeNameEn'];

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
  async CheckTabsEntry() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.CheckTabsEntry(this.SelectedCollageID.toString())
        .then(async (data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.CheckTabsEntryData = data['Data'][0]['data'][0];
          console.log(this.CheckTabsEntryData);
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




  isCheck30Female: boolean = false;
  async LOIFinalSubmit() {


    let Femalepre = 0;
    this.isSubmitted = true;
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.isCheck30Female = false;
    try {
      //Check 30 Female Member Exit or Not
      if (this.SelectedDepartmentID == 5) {
        if (confirm("Are you sure you want to Apply LOI?")) {
          await this.commonMasterService.Check30Female(this.SelectedCollageID)
            .then((data: any) => {
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];

              data = JSON.parse(JSON.stringify(data));

              if (!this.State) {
                if (data['Data'][0]['data'][0]['PendingMinLandArea'] > 0) {
                  this.toastr.error('Please Enter Min Land Area : ' + data['Data'][0]['data'][0]['Dis_MinLandArea'] + ' Acre');
                  this.isCheck30Female = true;
                  return;
                }
                if (data['Data'][0]['data'][0]['Medicalexperts'] <= 0) {
                  this.toastr.error('Add Medical experts in College Management Committee Members.');
                  this.isCheck30Female = true;
                  return;
                }
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
          if (this.isCheck30Female == false) {
            await this.commonMasterService.LOIFinalSubmit(this.SelectedCollageID.toString())
              .then((data: any) => {

                this.State = data['State'];
                this.SuccessMessage = data['SuccessMessage'];
                this.ErrorMessage = data['ErrorMessage'];
                console.log(this.State);
                if (!this.State) {
                  this.toastr.success('Apply LOI Successfully')

                  setTimeout(() => {
                    this.routers.navigate(['/totalcollege']);
                  }, 500);

                }
                else {
                  this.toastr.error(this.ErrorMessage)
                }
              })
          }
        }
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }
  async ShowDraftFinalSubmitBtn() {

    await this.CheckTabsEntry();
    this.IsShowDraftFinalSubmit = true;
    //Medical Group 1
    if (this.SelectedDepartmentID == 5) {
      if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0)//&& this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['HospitalDetails'] > 0
      {
        this.IsShowDraftFinalSubmit = false;
      }
    }
  }
  async ResubmitApplication() {
    try {
      this.loaderService.requestStarted();

      if (confirm("Are you sure you want to Resubmit application?")) {

        await this.applyNOCApplicationService.SubmitRevertApplication(this.SelectedApplyNOCID, this.SelectedDepartmentID)
          .then((data: any) => {

            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (!this.State) {
              this.toastr.success('Resubmit Application Successfully')

              setTimeout(() => {
                this.routers.navigate(['/revertedapplicationlist']);
              }, 500);

            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          });
      }
    } catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }
}
