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
import { BTERPaymentHistoryeMitraDataModel } from '../../../Models/SearchFilterDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { NocPaymentComponent } from '../../noc-payment/payment-request/noc-payment.component';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DTEAffiliationRegistrationService } from '../../../Services/DTEAffiliation/DTEAffiliationRegistration/dte-affiliation-registration.service';

@Injectable()

  @Component({
    selector: 'app-payment-history-report-college-wise',
    templateUrl: './payment-history-report-college-wise.component.html',
    styleUrls: ['./payment-history-report-college-wise.component.css']
  })
export class PaymentHistoryReportCollegeWiseComponent implements OnInit {
  request = new BTERPaymentHistoryeMitraDataModel();
  public searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  //Add FormBuilder

  public DepartmentList: any = []; 
  public PaymentHistoryList: any = [];
  public StatusList: any = [];

  public collegeListData: any = [];
  public collegeContactDetailsList: any = [];
  public collegeNearestGovernmentHospitalsList: any = [];
  public DTECollegeLevel: any = [];
  modalReference!: NgbModalRef;
  closeResult!: string; 
  public filteredCollegeList: any = [];
  public BTERCollegeList: any = [];
  public CollegeID: number = 0;
  public CollegeName: string = '';
  constructor(private collegeservice: CollegeService, private draftApplicationListService: DraftApplicationListService, private routers: Router, private router: ActivatedRoute, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService, private nocPaymentComponent: NocPaymentComponent, private modalService: NgbModal,private dTEAffiliationregistrationService: DTEAffiliationRegistrationService) {
  }

  async ngOnInit() {
    debugger;
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.TransctionStatus = '0';
    
    await this.GetPaymenthistoryList();
    await this.GetAllCollegeList();
  }
  async GetPaymenthistoryList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.dTEAffiliationregistrationService.GetPaymenthistoryList(this.request,this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.PaymentHistoryList = data['Data'][0]['data'];
          //this.txtSearchLevel_closed();
          this.loaderService.requestEnded();
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
    if (this.PaymentHistoryList.length > 0) {
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
        XLSX.writeFile(wb, "PaymentHistoryList.xlsx");
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
    this.request = new BTERPaymentHistoryeMitraDataModel();
    this.CollegeID = 0;
    this.filteredCollegeList = this.BTERCollegeList;
    this.GetPaymenthistoryList();
  }
  async CheckStatus_click(item: any) {
    debugger;
    try {
      this.loaderService.requestStarted();
      //debugger
      // payment request
      debugger;
      this.nocPaymentComponent.transactionStatusRequest.ApplyNocApplicationID = item.ApplyNocApplicationID;
      this.nocPaymentComponent.transactionStatusRequest.AMOUNT = item.Amount;
      this.nocPaymentComponent.transactionStatusRequest.PRN = item.PRNNO;
      this.nocPaymentComponent.transactionStatusRequest.DepartmentID = item.DepartmentID;
      this.nocPaymentComponent.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.nocPaymentComponent.request.SSOID = this.sSOLoginDataModel.SSOID;
      this.nocPaymentComponent.transactionStatusRequest.ServiceProvider = item.ServiceProvider;
      debugger;
      // post
      if (item.ServiceProvider == 'RPPT') {
        this.loaderService.requestEnded();
        await this.nocPaymentComponent.GetTransactionStatus();
      }
      else if (item.ServiceProvider == 'EMITRA') {
        this.loaderService.requestEnded();
        await this.nocPaymentComponent.GetEmitraTransactionStatus();
        this.GetPaymenthistoryList();
      }
      else {
        this.loaderService.requestEnded();
        await this.nocPaymentComponent.GRAS_GetPaymentStatus(item.AID, item.DepartmentID, 'BTER Payment');
      }

      this.modalService.dismissAll();
      //this.GetAffiliationRegistrationList();

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
  async GetAllCollegeList() {
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationregistrationService.GetAllCollegeList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.BTERCollegeList = data['Data'][0]['data'];
          this.txtSearchLevel_closed();
          this.loaderService.requestEnded();
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();      
        this.filteredCollegeList = this.BTERCollegeList;
      }, 200);
    }
  }

  SearchLevel_keyword = 'CollegeName';
  selectEvent(item: any) {   
    this.txtSearchLevel_SelectedChange(item);
  }

  onChangeSearch(search: string) {
    this.txtSearchLevel_onChangeSearch(search);
  }
  onFocused(e: any) {
    // do something
  }
  async txtSearchLevel_SelectedChange(item: any) {
   
    this.request.CollegeID = item.CollegeID;   
  }
  async txtSearchLevel_closed() {
    this.CollegeID = 0;
    this.ResetControl();
  }
  async txtSearchLevel_onChangeSearch(val: string) {
    if (val != '') {
      this.filteredCollegeList = this.BTERCollegeList.filter((item: any) => item.ProjectName.toLowerCase().includes(val.toLowerCase()));
    }
    else {
      this.filteredCollegeList = this.BTERCollegeList;
    }
  }
  
}


