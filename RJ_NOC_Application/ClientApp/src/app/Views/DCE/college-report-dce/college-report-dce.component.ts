import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { __rest } from 'tslib';
import { DCENOCReportSearchFilterDataModel } from '../../../Models/SearchFilterDataModel';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Injectable()

@Component({
  selector: 'app-college-report-dce',
  templateUrl: './college-report-dce.component.html',
  styleUrls: ['./college-report-dce.component.css']
})
export class CollegeReportDCEComponent implements OnInit {
  public searchText: string = '';
  request = new DCENOCReportSearchFilterDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  //Add FormBuilder
  public NOCStatusList: any = [];
  public ApplicationStatusList: any = [];
  public CollegeTypeList: any = [];
  public StatusOfCollegeList: any = [];
  public CollegeLevelList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public SuvdivisionList: any = [];

  public TehsilList: any = [];
  public ParliamentAreaList: any = [];
  public AssembelyAreaList: any = [];
  public FinancialYearList: any = [];
  public NodalOfficerList: any = [];
  public ApplicationTypeList: any = [];


  constructor(private routers: Router, private router: ActivatedRoute, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.LoadMaster();
  }


  async LoadMaster() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(3, "CourseType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.NOCStatusList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetWorkFlowStatusbyDepartment(3)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ApplicationStatusList = data['Data'][0]['data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(3, "CollegeType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeTypeList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(3, "PresentCollegeStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusOfCollegeList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(3, "CollegeLevel")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeLevelList = data['Data'];
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
      await this.commonMasterService.GetAllFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.FinancialYearList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetUsersByRoleDepartment(3, 17)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.NodalOfficerList = data['Data'][0]['data'];
        }, error => console.error(error));
      await this.commonMasterService.GetApplyNOCParameterbyDepartment(3)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ApplicationTypeList = data['Data'][0]['data'];
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
  async FillDistrictRelatedDDL(SelectedDistrictID: string) {
    try {
      this.loaderService.requestStarted();
      const districtId = Number(SelectedDistrictID);
      if (districtId <= 0) {
        return;
      }
      // subdivision list
      await this.commonMasterService.GetSuvdivisionByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
            this.SuvdivisionList = data['Data'];
        }, error => console.error(error));
      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
            this.TehsilList = data['Data'];
        }, error => console.error(error));
      // ParliamentArea list
      await this.commonMasterService.GetParliamentAreaByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
            this.ParliamentAreaList = data['Data'];
        }, error => console.error(error));
      // AssembelyArea list
      await this.commonMasterService.GetAssembelyAreaByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
            this.AssembelyAreaList = data['Data'];
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

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
