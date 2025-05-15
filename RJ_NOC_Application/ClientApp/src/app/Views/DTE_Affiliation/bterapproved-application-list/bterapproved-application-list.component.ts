import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { __rest } from 'tslib';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { TotalCollegeReportSearchFilter, Generateorderforbter } from '../../../Models/SearchFilterDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DTEAffiliationRegistrationService } from '../../../Services/DTEAffiliation/DTEAffiliationRegistration/dte-affiliation-registration.service';

@Injectable()

  @Component({
    selector: 'app-bterapproved-application-list',
    templateUrl: './bterapproved-application-list.component.html',
    styleUrls: ['./bterapproved-application-list.component.css']
  })
export class BTERApprovedApplicationListComponent implements OnInit {
  OrderGenerateForm!: FormGroup;
  request = new TotalCollegeReportSearchFilter();
  request1 = new Generateorderforbter();
  public searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  //Add FormBuilder

  public UniversityList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public TotalBTERreceivedApplicationList: any = [];

  public collegeListData: any = [];
  public collegeContactDetailsList: any = [];
  public collegeNearestGovernmentHospitalsList: any = [];
  public DTECollegeLevel: any = [];
  public MaxDate: Date = new Date;
  public EnterInwordNo: string = '';
  public ApplicationDateofReceived: string = '';
  public selectedApplicationNo: string = '';
  public CollegeName: string = '';
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedDTEAffiliationID: number = 0;
  masterSelected: boolean = true;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  isSubmitted: boolean = false;
  public CollegeStatusList: any = [];
  public ManagementTypeList: any = [];

  constructor(private formBuilder: FormBuilder, private collegeservice: CollegeService, private draftApplicationListService: DraftApplicationListService, private routers: Router, private router: ActivatedRoute, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService, private modalService: NgbModal, private dTEAffiliationregistrationService: DTEAffiliationRegistrationService) {
  }

  async ngOnInit() {
    this.OrderGenerateForm = this.formBuilder.group({
      checkheadName: [false, Validators.requiredTrue],
      masterSelected: [''],       
    }
    )
    this.request1.TotalBTERreceivedApplicationList = [];
    debugger;
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request1.SessionID = this.sSOLoginDataModel.SessionID;
    this.request1.SessionName = this.sSOLoginDataModel.SessionName;
    this.request1.UserID = this.sSOLoginDataModel.UserID;
    this.request1.RoleID = this.sSOLoginDataModel.RoleID;
    //this.sSOLoginDataModel.UserID;
    //this.sSOLoginDataModel.RoleID;
    //this.sSOLoginDataModel.SessionName;
    //console.log(this.sSOLoginDataModel.SessionID);
    //console.log(this.sSOLoginDataModel.UserID);
    //console.log(this.sSOLoginDataModel.RoleID);
    //console.log(this.sSOLoginDataModel.SessionName);

    await this.LoadMaster();
    await this.GetManagementTypeList();
    await this.GetStatusOfCollege();
    await this.GetTotalBterpendingtoreceivedApplicationList();
  }


  async LoadMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetUniversityByDepartmentId(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UniversityList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetDivisionList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DivisionList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetDistrictListByStateID(6)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data['Data'];
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
  async FillDivisionRelatedDDL(SelectedDivisionID: string) {
    try {
      this.loaderService.requestStarted();
      const divisionId = Number(SelectedDivisionID);
      this.request.DistrictID = 0;
      if (divisionId < 0) {
        return;
      }
      if (divisionId == 0) {
        await this.commonMasterService.GetDistrictListByStateID(6)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictList = data['Data'];
          }, error => console.error(error));
      }
      else {
        await this.commonMasterService.GetDistrictByDivsionId(divisionId)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictList = data['Data'];
          }, error => console.error(error));
      }
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

  async GetTotalBterpendingtoreceivedApplicationList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.collegeservice.TotalBTERApplicationDetailsByDepartment(this.request, this.sSOLoginDataModel.SessionID, 'TotalApprovedApplication')
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.request1.TotalBTERreceivedApplicationList = data['Data'][0]['data'];
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
  }

  async GetCollegeDetailsByCollege(CollegeID: any) {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.ViewTotalCollegeDataByID(CollegeID, this.sSOLoginDataModel.UserID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.collegeListData = data['Data'][0]['data']['Table'][0];
          this.collegeContactDetailsList = data['Data'][0]['data']['Table1'];
          this.collegeNearestGovernmentHospitalsList = data['Data'][0]['data']['Table2'];
          this.DTECollegeLevel = data['Data'][0]['data']['Table4'];

          //console.log(this.draftApplicatoinListData);
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
  }

  async View_OnClick(DepartmentID: number, DTEAffiliationID: number, Status: string, CollegeStatusId: number) {
    window.open('/dteaffiliationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(DTEAffiliationID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeStatusId.toString())), '_blank')
    //debugger;
    //this.routers.navigate(['/dteaffiliationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeStatusId.toString()))]);
  }
  public isLoadingExport: boolean = false;
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.TotalBTERreceivedApplicationList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][0] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "TotalBTERApplicationList.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }
  }
  async ResetControl() {
    this.request = new TotalCollegeReportSearchFilter();
  }

  //async ReceivedApplicationPopUP(content: any, DepartmentID: number, DTEAffiliationID: number, CollegeRegistrationNo: string, CollegeName: string, CollegeID: number) {
  //  this.SelectedDepartmentID = DepartmentID;
  //  this.SelectedDTEAffiliationID = DTEAffiliationID;
  //  this.selectedApplicationNo = CollegeRegistrationNo;
  //  this.CollegeName = CollegeName;
  //  this.SelectedCollageID = CollegeID;
  //  this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
  //    this.closeResult = `Closed with: ${result}`;
  //  }, (reason) => {
  //    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //  });
  //}
  //async ReceivedApplication() {
  //  debugger;
  //  if (this.EnterInwordNo == '' || this.EnterInwordNo == null) {
  //    this.toastr.error("Please Enter Inword No");
  //    return;
  //  }
  //  if (this.ApplicationDateofReceived == '' || this.ApplicationDateofReceived == null) {
  //    this.toastr.error("Please Enter Application Received Date");
  //    return;
  //  }
  //  if (confirm("Are you sure you want to Submitted Application?")) {
  //    const input = this.selectedApplicationNo;
  //    const result = input.split('/').join('-');
  //    console.log(result);

  //    this.loaderService.requestStarted();
  //    // this.isLoading = true;
  //    try {
  //      await this.commonMasterService.BTERAffiliationFinalSubmit(this.EnterInwordNo, this.ApplicationDateofReceived, this.SelectedDepartmentID, this.SelectedDTEAffiliationID, result, this.SelectedCollageID)
  //        .then((data: any) => {
  //          this.State = data['State'];
  //          this.SuccessMessage = data['SuccessMessage'];
  //          this.ErrorMessage = data['ErrorMessage'];

  //          if (!this.State) {
  //            this.toastr.success(this.SuccessMessage)
  //            this.modalService.dismissAll('After Success');
  //            this.GetTotalBterpendingtoreceivedApplicationList();
  //          }
  //          else {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //        })
  //    }
  //    catch (ex) { console.log(ex) }
  //    finally {
  //      setTimeout(() => {
  //        this.loaderService.requestEnded();
  //        //this.isLoading = false;

  //      }, 200);
  //    }

  //  }

  //}
  //private getDismissReason(reason: any): string {
  //  //this.SelectedCollageID = 0;
  //  //this.SelectedDepartmentID = 0;
  //  //this.SelectedApplyNOCID = 0;
  //  if (reason === ModalDismissReasons.ESC) {
  //    return 'by pressing ESC';
  //  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //    return 'by clicking on a backdrop';
  //  } else {
  //    return `with: ${reason}`;
  //  }
  //}
  async Documentscrutiny_OnClick(DepartmentID: number, DTEAffiliationID: number, Status: string, CollegeStatusId: number, ApplyBterAffiliationID: number, CollegeID: number, ApplicationStatus: string) {
    window.open('/bterdocumentscrutiny' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(DTEAffiliationID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeStatusId.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyBterAffiliationID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationStatus.toString())), '_blank')
  }
  checkedList: any;
  //async checkUncheckAll() {
  //  debugger;
  //  for (var i = 0; i < this.request1.TotalBTERreceivedApplicationList.length; i++) {
  //    this.request1.TotalBTERreceivedApplicationList[i].ActiveStatus = this.masterSelected;
  //  }
  //  this.getCheckedItemList();
  //}
  async checkUncheckAll() {
    debugger;
    this.request1.TotalBTERreceivedApplicationList.forEach(item => {
      item.ActiveStatus = this.masterSelected;
    });
    this.getCheckedItemList();
  }
  //async getCheckedItemList() {
  //  debugger;
  //  this.checkedList = [];
  //  for (var i = 0; i < this.request1.TotalBTERreceivedApplicationList.length; i++) {
  //    if (this.request1.TotalBTERreceivedApplicationList[i].ActiveStatus)
  //      this.checkedList.push(this.request1.TotalBTERreceivedApplicationList[i]);
  //  }
  //  this.checkedList = JSON.stringify(this.checkedList);
  //}
  async getCheckedItemList() {
    debugger;
    this.checkedList = this.request1.TotalBTERreceivedApplicationList.filter(item => item.ActiveStatus);
    this.checkedList = JSON.stringify(this.checkedList);
  }
  //async isAllSelected() {
  //  debugger;
  //  this.masterSelected = this.request1.TotalBTERreceivedApplicationList.every(function (item: any) {
  //    return item.ActiveStatus == true;
  //  })
  //  this.getCheckedItemList();
  //}
  async isAllSelected() {
    debugger;
    this.masterSelected = this.request1.TotalBTERreceivedApplicationList.every(item => item.ActiveStatus);
    this.getCheckedItemList();
  }
  //async Generateorder_SaveData() {
  //  debugger;
  //  this.isSubmitted = true;
  //  let count = 0;
  //  if (this.OrderGenerateForm.invalid) {
  //    count = 1;
  //  }

  //  if (count > 0) {
  //    return;
  //  }
  //  console.log(this.request1);
  //  this.loaderService.requestStarted();
  //  try {
  //    await this.dTEAffiliationregistrationService.Generateorder_SaveData(this.request1)
  //      .then((data: any) => {
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (!this.State) {
  //          this.ResetControl();
  //          this.TotalBTERreceivedApplicationList = [];
  //          this.isSubmitted = false;
  //          this.toastr.success(this.SuccessMessage);
  //          this.routers.navigate(['/dashboard']);

  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage)
  //        }
  //      })
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();


  //    }, 200);
  //  }
  //}
  
  async Generateorder_SaveData() {
    debugger;
    this.isSubmitted = true;

    if (this.OrderGenerateForm.invalid) {
      return;
    }

    // Filter only selected records
    let selectedRecords = this.request1.TotalBTERreceivedApplicationList.filter(item => item.ActiveStatus);

    if (selectedRecords.length === 0) {
      this.toastr.warning("No records selected for saving.");
      return;
    }

    console.log("Selected Records:", selectedRecords);
    this.loaderService.requestStarted();

    // Ensure all required properties are included in the request object
    let requestPayload: Generateorderforbter = {
      DTEAffiliationID: this.request1.DTEAffiliationID,  // Ensure this is defined in request1
      SessionID: this.request1.SessionID,
      UserID: this.request1.UserID,
      RoleID: this.request1.RoleID,
      SessionName: this.request1.SessionName,
      TotalBTERreceivedApplicationList: selectedRecords
    };

    try {
      await this.dTEAffiliationregistrationService.Generateorder_SaveData(requestPayload)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          if (!this.State) {
            this.ResetControl();
            this.request1.TotalBTERreceivedApplicationList = [];
            this.isSubmitted = false;
            this.toastr.success(this.SuccessMessage);
            this.routers.navigate(['/dashboard']);
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        });
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async GetManagementTypeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(12, "AffiliationManagementType")
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ManagementTypeList = data['Data'];
          this.loaderService.requestEnded();
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
  async GetStatusOfCollege() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(12, "AffiliationCategory")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeStatusList = data['Data'];
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




