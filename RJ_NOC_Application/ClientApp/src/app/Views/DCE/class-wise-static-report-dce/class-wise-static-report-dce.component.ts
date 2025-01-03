import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MGOneDocumentScrutinyService } from '../../../Services/MGOneDocumentScrutiny/mgonedocument-scrutiny.service';
import { SearchFilterDataModel } from '../../../Models/TabDetailDataModel';
import { Clipboard } from '@angular/cdk/clipboard'; 

@Injectable()

@Component({
  selector: 'app-class-wise-static-report-dce',
  templateUrl: './class-wise-static-report-dce.component.html',
  styleUrls: ['./class-wise-static-report-dce.component.css']
})
export class ClassWiseStaticReportDCEComponent implements OnInit {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  public ClassWiseStaticReportLst: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  searchText: string = '';


  public InstitutionList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public SuvdivisionList: any = [];
  public TehsilList: any = [];
  public ParliamentAreaList: any = [];

  request = new SearchFilterDataModel()
   

  constructor(private clipboard: Clipboard,private dceDocumentScrutinyService: DCEDocumentScrutinyService, private collegeservice: CollegeService, private toastr: ToastrService, private loaderService: LoaderService, private modalService: NgbModal,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private decDocumentScrutinyService: DCEDocumentScrutinyService, private mg1DocumentScrutinyService: MGOneDocumentScrutinyService) {

  }

  async ngOnInit() {
   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetClassWiseStaticReportList();
    await this.GetDivisionList();
    await this.GetCollegesByDepartmentID();
  }
  async GetDivisionList() {
    try {
      this.loaderService.requestStarted();
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
  async GetCollegesByDepartmentID() {
    try {
      this.loaderService.requestStarted();
      await this.collegeservice.GetCollegesByDepartmentID(3)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(data['Data'][0]);
          this.InstitutionList = data['Data'][0];
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
  async FillDivisionRelatedDDL(event: any, SelectedDivisionID: string) {
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

  async FillDistrictRelatedDDL(event: any, SelectedDistrictID: string) {
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
      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
            this.TehsilList = data['Data'];
        }, error => console.error(error));

      // ParliamentArea list
      await this.commonMasterService.GetParliamentAreaByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
            this.ParliamentAreaList = data['Data'];
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
  async GetClassWiseStaticReportList() {
    try {
      this.loaderService.requestStarted();
      this.request.SessionID = this.sSOLoginDataModel.SessionID;
      await this.dceDocumentScrutinyService.GetClassWiseStaticReport(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ClassWiseStaticReportLst = data['Data'][0]['data'];
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
  async OnClick_Search() {
    await this.GetClassWiseStaticReportList();
  }

  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {
      this.clipboard.copy(tabellist.innerText);
    }
  }

  public isLoadingExport: boolean = false;
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.ClassWiseStaticReportLst.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][8] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "ClassWiseStaticReportLst.xlsx");
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
  @ViewChild('content') content: ElementRef | any;
  

  async ResetControl() {
    this.request = new SearchFilterDataModel();
    await this.GetClassWiseStaticReportList();
  }
}

