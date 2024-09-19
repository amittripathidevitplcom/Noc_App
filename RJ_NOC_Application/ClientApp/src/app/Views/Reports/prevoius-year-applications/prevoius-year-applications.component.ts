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
import { CommonDataModel_TotalApplicationSearchFilter } from '../../../Models/CommonMasterDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DTEDocumentScrutinyService } from '../../../Services/DTEDocumentScrutiny/dtedocument-scrutiny.service';

@Injectable()

@Component({
  selector: 'app-prevoius-year-applications',
  templateUrl: './prevoius-year-applications.component.html',
  styleUrls: ['./prevoius-year-applications.component.css']
})
export class PrevoiusYearApplicationsComponent implements OnInit {
  request = new CommonDataModel_TotalApplicationSearchFilter();
  public searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  //Add FormBuilder

  public UniversityList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public TotalApplicationList: any = [];

  public CollegeStatusList: any = [];
  public WorkFlowActionList: any = [];
  public NodalOfficerList: any = [];
  public CollegeTypeList: any = [];
  public ApplicationTypeList: any = [];
  public ApplicationList: any = [];
  public ApplicationCountList: any = [];
  public SuvdivisionList: any = [];
  public QueryStringStatus: any = 'ALL';
  //request = new DCENOCReportSearchFilterDataModel();




  constructor(private dcedocumentScrutinyService: DTEDocumentScrutinyService, private modalService: NgbModal, private draftApplicationListService: DraftApplicationListService, private routers: Router, private router: ActivatedRoute, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.request.Status = this.QueryStringStatus;
    await this.LoadMaster();
    await this.GetTotalApplicationList();
  }

  async LoadMaster() {
    try {
      this.DistrictList = [];
      this.loaderService.requestStarted();
      await this.commonMasterService.GetUniversityByDepartmentId(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UniversityList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, "CourseType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeStatusList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetWorkFlowStatusbyDepartment(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.WorkFlowActionList = data['Data'][0]['data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.sSOLoginDataModel.DepartmentID, "CollegeType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeTypeList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.GetApplyNOCParameterbyDepartment(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ApplicationTypeList = data['Data'][0]['data'];
        }, error => console.error(error));
      await this.commonMasterService.GetDivisionList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionList = data['Data'];
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
  async FillDivisionRelatedDDL(SelectedDivisionID: string) {
    this.DistrictList = [];
    this.request.DistrictID = 0;
    this.SuvdivisionList = [];
    this.request.SubDivisionID = 0;
    try {
      this.loaderService.requestStarted();
      const divisionId = Number(SelectedDivisionID);
      if (divisionId <= 0) {
        return;
      }
      // college status
      await this.commonMasterService.GetDistrictByDivsionId(divisionId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
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
  async FillDistrictRelatedDDL(SelectedDistrictID: string) {
    this.SuvdivisionList = [];
    this.request.SubDivisionID = 0;
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
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SuvdivisionList = data['Data'];
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

  async GetTotalApplicationList() {
    try {
      this.request.ApplicationID = this.request.ApplicationID == null || this.request.ApplicationID.toString() == '' || this.request.ApplicationID == undefined ? 0 : this.request.ApplicationID;
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.commonMasterService.GetPreviousTotalApplicationListByDepartment(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TotalApplicationList = data['Data'][0]['data'];
          console.log(this.TotalApplicationList);
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


  public isLoadingExport: boolean = false;
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.TotalApplicationList.length > 0) {
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
        XLSX.writeFile(wb, "TotalApplicationList.xlsx");
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
    this.request = new CommonDataModel_TotalApplicationSearchFilter();
  }


  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  async ApplicationSummary_OnClick(DepartmentID: number, CollegeID: number) {
    if (DepartmentID == 5) {
      window.open('/LOIapplicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())), '_blank')
    }
    else {
      window.open('/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())), '_blank')
    }
  }


}
