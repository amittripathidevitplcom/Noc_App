import { Component, Injectable, OnInit } from '@angular/core';
import { TotalNotFilledStatics_DataModel_Filter } from '../../../Models/SubjectWiseStatisticsDetailsDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { CommonDataModel_TotalDraftEntrySearchFilter } from '../../../Models/CommonMasterDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
@Injectable()

@Component({
  selector: 'app-total-draft-entry-college',
  templateUrl: './total-draft-entry-college.component.html',
  styleUrls: ['./total-draft-entry-college.component.css']
})
export class TotalDraftEntryCollegeComponent implements OnInit {

  request = new CommonDataModel_TotalDraftEntrySearchFilter();

  public searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public UniversityList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public TotalDraftentryCollege: any = [];
  public DraftEntryCollegeDetailsList: any = [];
  public CollegeType: any = 'NA';


  constructor(private loaderService: LoaderService, private toastr: ToastrService, private commonMasterService: CommonMasterService, private modalService: NgbModal, private routers: Router, private router: ActivatedRoute) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CollegeType = this.router.snapshot.paramMap.get('Type')?.toString();
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.CollegeType = (this.CollegeType != '' && this.CollegeType != undefined && this.CollegeType != 'undefined') ? this.CollegeType : 'NA';
    this.request.SessionID = this.sSOLoginDataModel.SessionID;
    await this.LoadMaster();
    await this.GetTotalDraftentryCollege();
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


  async GetTotalDraftentryCollege() {
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.Type = 'Summary';
      await this.commonMasterService.GetTotalDraftentryCollege(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TotalDraftentryCollege = data['Data'][0];
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

  async ResetControl() {
    this.request = new CommonDataModel_TotalDraftEntrySearchFilter();
    await this.LoadMaster();
  }


  public isLoadingExport: boolean = false;
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.TotalDraftentryCollege.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "TotalDraftEntryCollegeList.xlsx");
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

  modalReference!: NgbModalRef;
  closeResult!: string;
  async PreviewDraftEntry_click(content: any, CollegeID: number) {
    try {
      this.request.CollegeID = CollegeID;
      this.request.Type = '';
      await this.GetPreviewDraftEntry();
      // model popup
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpayment-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.request.CollegeID = 0;
      this.request.Type = 'Summary';
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  async GetPreviewDraftEntry() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetTotalDraftentryCollege(this.request)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DraftEntryCollegeDetailsList = data['Data'][0];
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

  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }
}
