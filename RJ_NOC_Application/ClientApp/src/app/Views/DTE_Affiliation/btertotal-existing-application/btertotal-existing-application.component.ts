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
import { TotalCollegeReportSearchFilter } from '../../../Models/SearchFilterDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';

@Injectable()

  @Component({
    selector: 'app-btertotal-existing-application',
    templateUrl: './btertotal-existing-application.component.html',
    styleUrls: ['./btertotal-existing-application.component.css']
  })
export class BTERTotalExistingApplicationComponent implements OnInit {
  request = new TotalCollegeReportSearchFilter();
  public searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  //Add FormBuilder

  public UniversityList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public TotalBTERExistingApplicationList: any = [];

  public collegeListData: any = [];
  public collegeContactDetailsList: any = [];
  public collegeNearestGovernmentHospitalsList: any = [];
  public DTECollegeLevel: any = [];



  constructor(private collegeservice: CollegeService, private draftApplicationListService: DraftApplicationListService, private routers: Router, private router: ActivatedRoute, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService) {
  }

  async ngOnInit() {
    debugger;
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.LoadMaster();
    await this.GetTotalBterExistingApplicationList();
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

  async GetTotalBterExistingApplicationList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.collegeservice.TotalBTERApplicationDetailsByDepartment(this.request, this.sSOLoginDataModel.SessionID, 'Existing')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TotalBTERExistingApplicationList = data['Data'][0]['data'];
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
    if (this.TotalBTERExistingApplicationList.length > 0) {
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
}



