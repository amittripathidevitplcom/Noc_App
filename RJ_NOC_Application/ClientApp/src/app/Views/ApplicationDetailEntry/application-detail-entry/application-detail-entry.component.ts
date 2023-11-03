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
import { DteAddCourseComponent } from '../../CollegeDetailsForm/dte-add-course/dte-add-course.component';
import { AcademicInformationComponent } from '../../TabDetail/academic-information/academic-information.component';
import { OldNOCDetailsComponent } from '../../TabDetail/old-nocdetails/old-nocdetails.component';
import { RoomDetailsComponent } from '../../TabDetail/room-details/room-details.component';
import { StaffDetailsComponent } from '../../TabDetail/staff-details/staff-details.component';

@Component({
  selector: 'app-application-detail-entry',
  templateUrl: './application-detail-entry.component.html',
  styleUrls: ['./application-detail-entry.component.css']
})
export class ApplicationDetailEntryComponent implements OnInit {
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

  @ViewChild(OldNOCDetailsComponent)
  private oldNOCDetailsComponent!: OldNOCDetailsComponent;

  @ViewChild(RoomDetailsComponent)
  private roomDetailsComponent!: RoomDetailsComponent;



  public DraftbuttonName: string = 'Save Draft';

  public QueryStringStatus: any = '';
  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private collegeService: CollegeService) { }

  async ngOnInit() {
    // $(".secondTab").addClass("highLightTab");
    this.loaderService.requestStarted();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
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
   
    try {
      this.ShowDraftFinalSubmitBtn();
    }
    catch (Ex) { }
    this.loaderService.requestEnded();
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
  async DraftFinalSubmit(IsDraftSubmited: any) {


    let Femalepre = 0;
    this.isSubmitted = true;
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.isCheck30Female = false;
    try {
      //Check 30 Female Member Exit or Not
      var DCPendingPoint = "";
      if (this.SelectedDepartmentID != 5) {
        await this.commonMasterService.Check30Female(this.SelectedCollageID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];

            data = JSON.parse(JSON.stringify(data));

            if (!this.State) {
              //No need Animal Husbandry Departement check member validation

              if (this.SelectedDepartmentID == 4) {
                if (data['Data'][0]['data'][0]['PendingPrincipal'] == 0) {
                  this.toastr.error('Please Add One Principal in Staff details.')
                  this.isCheck30Female = true;
                  return;
                }
              }


              if (this.SelectedDepartmentID != 2) {
                if (data['Data'][0]['data'][0]['TotalMember'] < 15) {
                  this.toastr.error("Add Minimum 15 College Management Committee Members.")
                  DCPendingPoint += "Add Minimum 15 College Management Committee Members." + "\n";
                  this.isCheck30Female = true;
                  if (this.SelectedDepartmentID != 3) {
                    return;
                  }

                }
                if (data['Data'][0]['data'][0]['Educationist'] < 2 && this.SelectedDepartmentID == 3) {
                  this.toastr.error("Add Minimum 2 Educationist College Management Committee Members.")
                  DCPendingPoint += "Add Minimum 2 Educationist College Management Committee Members." + "\n";
                  this.isCheck30Female = true;
                  if (this.SelectedDepartmentID != 3) {
                    return;
                  }
                }
                Femalepre = data['Data'][0]['data'][0]['FemalePercentage'];
                if (Femalepre < 30) {
                  //this.toastr.error("Society in Female Member is not valid (30%)")
                  this.toastr.error("Member list must have atleast 30% of Woman")
                  DCPendingPoint += "Member list must have atleast 30% of Woman" + "\n";
                  this.isCheck30Female = true;
                  if (this.SelectedDepartmentID != 3) {
                    return;
                  }
                }
              }

              if (data['Data'][0]['data'][0]['PendingFacilities'] > 0) {
                this.toastr.error("Enter All Facilities Details.")
                DCPendingPoint += "Enter All Facilities Details." + "\n";
                this.isCheck30Female = true;
                if (this.SelectedDepartmentID != 3) {
                  return;
                }
              }
              if (data['Data'][0]['data'][0]['PendingOtherInformation'] > 0) {
                this.toastr.error("Enter All Other Information Details.")
                DCPendingPoint += "Enter All Other Information Details." + "\n";
                this.isCheck30Female = true;
                if (this.SelectedDepartmentID != 3) {
                  return;
                }
              }

              if (data['Data'][0]['data'][0]['PendingClassRoomDetails'] > 0) {
                this.toastr.error("Enter All Class Room Details.")
                DCPendingPoint += "Enter All Class Room Details." + "\n";
                this.isCheck30Female = true;
                if (this.SelectedDepartmentID != 3) {
                  return;
                }
              }

              if (data['Data'][0]['data'][0]['PendingClassWiseNoofRoomRoomDetails'] > 0) {
                this.toastr.error("Enter Class Wise No of Room Details.")
                DCPendingPoint += "Enter Class Wise No of Room Details." + "\n";
                this.isCheck30Female = true;
                if (this.SelectedDepartmentID != 3) {
                  return;
                }
              }
              if (this.SelectedDepartmentID == 2) {
                if (data['Data'][0]['data'][0]['PendingMinLandArea'] > 0) {
                  this.toastr.error('Please Enter Min Land Area : ' + data['Data'][0]['data'][0]['Dis_MinLandArea'] + ' Acre')
                  this.isCheck30Female = true;
                }
                if (data['Data'][0]['data'][0]['FullyConvertedLand'] > 0) {
                  this.toastr.error('Please enter minimum building land area of 1200 square meters or 0.2966 acres and that too must be fully converted land type.')
                  this.isCheck30Female = true;
                  return;
                }
              }
              else {
                if (data['Data'][0]['data'][0]['PendingMinLandArea'] > 0) {
                  this.toastr.error('Please Enter Min Land Area : ' + data['Data'][0]['data'][0]['Dis_MinLandArea'] + ' Sq. Feet')
                  DCPendingPoint += "Please Enter Min Land Area : ' + data['Data'][0]['data'][0]['Dis_MinLandArea'] + ' Sq. Feet" + "\n";
                  this.isCheck30Female = true;
                  if (this.SelectedDepartmentID != 3) {
                    return;
                  }
                }
              }


              if (this.SelectedDepartmentID == 2 && this.CollegeType_IsExisting == true) {
                this.SeatValue = Number(data['Data'][0]['data'][0]['SeatsValue'])
                if (data['Data'][0]['data'][0]['PendingPrincipal'] == 0) {
                  this.toastr.error('Please Add One Principal in Staff details.')
                  this.isCheck30Female = true;
                  return;
                }
                if (data['Data'][0]['data'][0]['PendingTrainingOfficer'] == 0) {
                  if (this.SeatValue == 50)
                    this.toastr.error('Please Add two Training Officer in Staff details.')
                  else
                    this.toastr.error('Please Add Four Training Officer in Staff details.')
                  this.isCheck30Female = true;
                  return;
                }
                if (data['Data'][0]['data'][0]['PendingVeterinaryOfficer'] == 0) {
                  if (this.SeatValue == 50)
                    this.toastr.error('Please Add two Veterinary Officer in Staff details.')
                  else
                    this.toastr.error('Please Add Four Veterinary Officer in Staff details.')

                  this.isCheck30Female = true;
                  return;
                }
                if (data['Data'][0]['data'][0]['PendingFarmSupervisor'] == 0) {
                  this.toastr.error('Please Add One Farm Supervisor in Staff details.')
                  this.isCheck30Female = true;
                  return;
                }
                if (data['Data'][0]['data'][0]['PendingLaboratoryAssistant'] == 0) {
                  if (this.SeatValue == 50)
                    this.toastr.error('Please Add one Laboratory Assistant in Staff details.')
                  else
                    this.toastr.error('Please Add two Laboratory Assistant in Staff details.')

                  this.isCheck30Female = true;
                  return;

                }

                if (data['Data'][0]['data'][0]['PendingComputerOperator'] == 0) {
                  this.toastr.error('Please Add One Computer Operator in Staff details.')
                  this.isCheck30Female = true;
                  return;

                }
                if (data['Data'][0]['data'][0]['PendingClerk'] == 0) {
                  if (this.SeatValue == 50)
                    this.toastr.error('Please Add one Clerk in Staff details.')
                  else
                    this.toastr.error('Please Add two Clerk in Staff details.')
                  this.isCheck30Female = true;
                  return;

                }
                if (data['Data'][0]['data'][0]['PendingAttendantSweeper'] == 0) {
                  if (this.SeatValue == 50)
                    this.toastr.error('Please Add three Attendant Sweeper in Staff details.')
                  else
                    this.toastr.error('Please Add Five Attendant Sweeper in Staff details.')

                  this.isCheck30Female = true;
                  return;

                }
                if (data['Data'][0]['data'][0]['PendingBusDriver'] == 0) {
                  this.toastr.error('Please Add One Bus Driver in Staff details.')
                  this.isCheck30Female = true;
                  return;
                }
              }

              if (this.SelectedDepartmentID == 3 && this.CollegeType_IsExisting == true) {
                if (data['Data'][0]['data'][0]['PendingSubjectStaff'] > 0) {
                  this.toastr.error('In the case of teaching, it is Mandatory to have teachers of all the subjects.')
                  DCPendingPoint += "In the case of teaching, it is Mandatory to have teachers of all the subjects." + "\n";
                  this.isCheck30Female = true;
                  if (this.SelectedDepartmentID != 3) {
                    return;
                  }
                }
              }
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }








      if (this.SelectedDepartmentID == 3) {
        if (confirm(DCPendingPoint + "\nAre you sure you want to save draft application ?")) {
          this.isCheck30Female = false;
          if (this.isCheck30Female == false) {
            await this.commonMasterService.DraftFinalSubmit(this.SelectedCollageID.toString(), IsDraftSubmited)
              .then((data: any) => {

                this.State = data['State'];
                this.SuccessMessage = data['SuccessMessage'];
                this.ErrorMessage = data['ErrorMessage'];
                console.log(this.State);
                if (!this.State) {
                  this.toastr.success(this.SuccessMessage)

                  setTimeout(() => {
                    this.routers.navigate(['/draftapplicationlist']);
                  }, 500);

                }
                else {
                  this.toastr.error(this.ErrorMessage)
                }
              })
          }
        }
      }
      else if (this.SelectedDepartmentID == 5) {
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
                  this.toastr.error('Add Medical Educationist in College Management Committee Members.');
                  this.isCheck30Female = true;
                  return;
                }
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
          if (this.isCheck30Female == false) {
            await this.commonMasterService.DraftFinalSubmit(this.SelectedCollageID.toString(), IsDraftSubmited)
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

      else {

        if (this.isCheck30Female == false) {
          await this.commonMasterService.DraftFinalSubmit(this.SelectedCollageID.toString(), IsDraftSubmited)
            .then((data: any) => {

              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              console.log(this.State);
              if (!this.State) {
                this.toastr.success(this.SuccessMessage)

                setTimeout(() => {
                  this.routers.navigate(['/draftapplicationlist']);
                }, 500);

              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
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

    try {
      this.academicInformationComponent.GetCourseList_CollegeWise(this.SelectedCollageID);
    }
    catch (Ex) { }
    try {
      this.oldNOCDetailsComponent.GetCourseList();
    }
    catch (Ex) { }
    try {
      this.roomDetailsComponent.LoadMaster();
    }
    catch (Ex) { }
    try {
      this.staffDetailsComponent.GetCollegeWiseSubjectList(this.SelectedCollageID);
    }
    catch (Ex) { }

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
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['OtherDocument'] > 0 && this.CheckTabsEntryData['VeterinaryHospital'] > 0 && this.CheckTabsEntryData['StaffDetails'] > 0) {
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

    if (this.SelectedDepartmentID == 3) {
      if (this.CollegeType_IsExisting == true) {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['StaffDetails'] > 0 && this.CheckTabsEntryData['OLDNOCDetails'] > 0 && this.CheckTabsEntryData['AcademicInformation'] > 0 && this.CheckTabsEntryData['ClassWiseStatistics'] > 0 && this.CheckTabsEntryData['SubjectWiseStatistics'] > 0
          && this.CheckTabsEntryData['HostelDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
      else {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 && this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['HostelDetails'] > 0) {
          // && this.CheckTabsEntryData['ClassWiseStatistics'] > 0
          this.IsShowDraftFinalSubmit = false;
        }
      }
    }
    //Medical Group 1
    if (this.SelectedDepartmentID == 5) {
      if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0)//&& this.CheckTabsEntryData['BuildingDocuments'] > 0 && this.CheckTabsEntryData['HospitalDetails'] > 0
      {
        this.IsShowDraftFinalSubmit = false;
      }
    }



    //this.CheckTabsEntryData['StaffDetails'] > 0 &&
    if (this.SelectedDepartmentID == 4) {
      if (this.CollegeType_IsExisting == true) {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 &&
          this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0 &&
          this.CheckTabsEntryData['OLDNOCDetails'] > 0 && this.CheckTabsEntryData['AcademicInformation'] > 0
          && this.CheckTabsEntryData['CourseDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
      else {
        if (this.CheckTabsEntryData['LandInformation'] > 0 && this.CheckTabsEntryData['Facility'] > 0 && this.CheckTabsEntryData['RequiredDocument'] > 0 &&
          this.CheckTabsEntryData['RoomDetails'] > 0 && this.CheckTabsEntryData['OtherInformation'] > 0 && this.CheckTabsEntryData['BuildingDocuments'] > 0
          && this.CheckTabsEntryData['CourseDetails'] > 0) {
          this.IsShowDraftFinalSubmit = false;
        }
      }
    }



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
