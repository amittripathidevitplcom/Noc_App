import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { AcademicInformationComponent } from '../../TabDetail/academic-information/academic-information.component';
import { StaffDetailsComponent } from '../../TabDetail/staff-details/staff-details.component';

@Component({
  selector: 'app-revert-application-detail-entry',
  templateUrl: './revert-application-detail-entry.component.html',
  styleUrls: ['./revert-application-detail-entry.component.css']
})
export class RevertApplicationDetailEntryComponent implements OnInit {
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


  @ViewChild(StaffDetailsComponent)
  private staffDetailsComponent!: StaffDetailsComponent;

  @ViewChild(AcademicInformationComponent)
  private academicInformationComponent!: AcademicInformationComponent;

  public QueryStringStatus: any = '';
  public SearchRecordID: string = '';
  constructor(private dcedocumentScrutinyService: DCEDocumentScrutinyService,  private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private collegeService: CollegeService) { }

  async ngOnInit() {
    // $(".secondTab").addClass("highLightTab");
    this.loaderService.requestStarted();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    //this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SelectedCollageID = data['Data']['CollegeID'];
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }
    await this.GetRevertedTabData();
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
  async ShowDraftFinalSubmitBtn() {

    await this.CheckTabsEntry();
    this.IsShowDraftFinalSubmit = true;
    //Medical Group 3
    if (this.SelectedDepartmentID == 6) {
      if (this.CollegeType_IsExisting == true) {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['StaffDetails'] > 0 && this.CheckTabsEntryData['OLDNOCDetails'] > 0 && this.CheckTabsEntryData['AcademicInformation'] > 0 && this.CheckTabsEntryData['HospitalDetails'] > 0 && this.CheckTabsEntryData['HostelDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
      else {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['HospitalDetails'] > 0 && this.CheckTabsEntryData['HostelDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
    }
    // ParaMedical Medical Group 
    if (this.SelectedDepartmentID == 9) {
      if (this.CollegeType_IsExisting == true) {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['StaffDetails'] > 0 && this.CheckTabsEntryData['OLDNOCDetails'] > 0 && this.CheckTabsEntryData['AcademicInformation'] > 0 && this.CheckTabsEntryData['ParamedicalHospitalDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
      else {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['ParamedicalHospitalDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
    }
    //Animal Husbandry
    else if (this.SelectedDepartmentID == 2) {
      if (this.CollegeType_IsExisting == true) {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['StaffDetails'] > 0 && this.CheckTabsEntryData['OLDNOCDetails'] > 0 && this.CheckTabsEntryData['AcademicInformation'] > 0 && this.CheckTabsEntryData['OtherDocument'] > 0 && this.CheckTabsEntryData['VeterinaryHospital'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
      else {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['OtherDocument'] > 0 && this.CheckTabsEntryData['VeterinaryHospital'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
    }
    else if (this.SelectedDepartmentID == 1) {
      if (this.CollegeType_IsExisting == true) {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['StaffDetails'] > 0 && this.CheckTabsEntryData['OLDNOCDetails'] > 0 && this.CheckTabsEntryData['AcademicInformation'] > 0 && this.CheckTabsEntryData['FarmLandDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
      else {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['FarmLandDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
    }
    debugger;
    if (this.SelectedDepartmentID == 3) {
      if (this.CollegeType_IsExisting == true) {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['StaffDetails'] > 0 && this.CheckTabsEntryData['OLDNOCDetails'] > 0 && this.CheckTabsEntryData['AcademicInformation'] > 0 && this.CheckTabsEntryData['ClassWiseStatistics'] > 0 && this.CheckTabsEntryData['SubjectWiseStatistics'] > 0
          //&& this.CheckTabsEntryData['HostelDetails'] > 0
        ) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
      else {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 //&& this.CheckTabsEntryData['HostelDetails'] > 0
        ) {
          // && this.CheckTabsEntryData['ClassWiseStatistics'] > 0
          this.IsShowDraftFinalSubmit = false;
        }
      }
    }
    //Medical Group 1
    if (this.SelectedDepartmentID == 5) {
      if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['HospitalDetails'] > 0) {
        // && this.CheckTabsEntryData['ClassWiseStatistics'] > 0
        this.IsShowDraftFinalSubmit = false;
      }
    }
    if (this.SelectedDepartmentID == 4) {
      if (this.CollegeType_IsExisting == true) {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 &&
          this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 &&
            this.CheckTabsEntryData['OLDNOCDetails'] > 0 && this.CheckTabsEntryData['AcademicInformation'] > 0
          && this.CheckTabsEntryData['HostelDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
      else {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 &&
          this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0
          && this.CheckTabsEntryData['HostelDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
    }


    //if (this.SelectedDepartmentID == 4) {
    //  if (this.CollegeType_IsExisting == true) {
    //    if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 &&
    //      this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 &&
    //      this.CheckTabsEntryData['StaffDetails'] > 0 && this.CheckTabsEntryData['OLDNOCDetails'] > 0 && this.CheckTabsEntryData['AcademicInformation'] > 0
    //      && this.CheckTabsEntryData['HostelDetails'] > 0) {
    //      this.IsShowDraftFinalSubmit = false;
    //    }
    //  }
    //  else {
    //    if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 &&
    //      this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0
    //      && this.CheckTabsEntryData['HostelDetails'] > 0) {
    //      this.IsShowDraftFinalSubmit = false;
    //    }
    //  }
    //}



    //Tech Education
    if (this.SelectedDepartmentID == 6) {
      if (this.CollegeType_IsExisting == true) {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['StaffDetails'] > 0 && this.CheckTabsEntryData['OLDNOCDetails'] > 0 && this.CheckTabsEntryData['AcademicInformation'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
      else {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['HostelDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
    }

  }
  async ResubmitApplication() {
    try {
      let Femalepre = 0;
      this.isCheck30Female = false;
      this.loaderService.requestStarted();

      if (confirm("Are you sure you want to Resubmit application?")) {
        var DCPendingPoint = "";
          await this.commonMasterService.Check30Female(this.SelectedCollageID)
            .then((data: any) => {
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];

              data = JSON.parse(JSON.stringify(data));

              if (!this.State) {

                if (data['Data'][0]['data'][0]['TotalMember'] < 15) {
                  this.toastr.error("Add Minimum 15 College Management Committee Members.")
                  DCPendingPoint += "Add Minimum 15 College Management Committee Members." + "\n";
                  this.isCheck30Female = true;
                  return;
                }

                if (data['Data'][0]['data'][0]['Educationist'] < 2 && this.SelectedDepartmentID == 3) {
                  this.toastr.error("Add Minimum 2 Educationist College Management Committee Members.")
                  DCPendingPoint += "Add Minimum 2 Educationist College Management Committee Members." + "\n";
                  this.isCheck30Female = true;
                  return;
                }
                Femalepre = data['Data'][0]['data'][0]['FemalePercentage'];
                if (Femalepre < 30) {
                  //this.toastr.error("Society in Female Member is not valid (30%)")
                  this.toastr.error("Member list must have atleast 30% of Woman")
                  DCPendingPoint += "Member list must have atleast 30% of Woman" + "\n";
                  this.isCheck30Female = true;
                  return;
                }

                if (data['Data'][0]['data'][0]['PendingFacilities'] > 0) {
                  this.toastr.error("Enter All Facilities Details.")
                  DCPendingPoint += "Enter All Facilities Details." + "\n";
                  this.isCheck30Female = true;
                  return;
                }
                if (data['Data'][0]['data'][0]['PendingOtherInformation'] > 0) {
                  this.toastr.error("Enter All Other Information Details.")
                  DCPendingPoint += "Enter All Other Information Details." + "\n";
                  this.isCheck30Female = true;
                  return;
                }

                if (data['Data'][0]['data'][0]['PendingClassRoomDetails'] > 0) {
                  this.toastr.error("Enter All Class Room Details.")
                  DCPendingPoint += "Enter All Class Room Details." + "\n";
                  this.isCheck30Female = true;
                  return;
                }

                if (data['Data'][0]['data'][0]['PendingClassWiseNoofRoomRoomDetails'] > 0) {
                  this.toastr.error("Enter Class Wise No of Room Details.")
                  DCPendingPoint += "Enter Class Wise No of Room Details." + "\n";
                  this.isCheck30Female = true;
                  return;
                }
    
                else {
                  if (data['Data'][0]['data'][0]['PendingMinLandArea'] > 0) {
                    this.toastr.error('Please Enter Min Land Area : ' + data['Data'][0]['data'][0]['Dis_MinLandArea'] + ' Sq. Feet')
                    DCPendingPoint += "Please Enter Min Land Area : ' + data['Data'][0]['data'][0]['Dis_MinLandArea'] + ' Sq. Feet" + "\n";
                    this.isCheck30Female = true;
                    return;
                  }
                }

                if (this.SelectedDepartmentID == 3 && this.CollegeType_IsExisting == true) {
                  if (data['Data'][0]['data'][0]['PendingSubjectStaff'] > 0) {
                    this.toastr.error('In the case of teaching, it is Mandatory to have teachers of all the subjects.')
                    DCPendingPoint += "In the case of teaching, it is Mandatory to have teachers of all the subjects." + "\n";
                    this.isCheck30Female = true;
                    return;
                  }
                }
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        if (this.isCheck30Female == false) {
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
      }
    } catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  public RevertedTabData: any = [];
  async GetRevertedTabData() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.GetRevertedTabData(this.SelectedApplyNOCID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RevertedTabData = data['Data'][0]['data'][0];
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
