import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RequestDetails } from '../../../Models/PaymentDataModel';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service';
import { DefaulterCollegeSearchFilterDataModel } from '../../../Models/DefaulterCollegeRequestDataModel';
import { DefaulterCollegeRequestService } from '../../../Services/DefaulterCollegeRequest/DefaulterCollegeRequest.service';
import { ApplicationPenaltyDataModel } from '../../../Models/ApplyNOCApplicationDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';

@Component({
  selector: 'app-admin-defaulter-college-list',
  templateUrl: './admin-defaulter-college-list.component.html',
  styleUrls: ['./admin-defaulter-college-list.component.css']
})
export class AdminDefaulterCollegeListComponent implements OnInit {
  request = new DefaulterCollegeSearchFilterDataModel();

  constructor(private DefaulterCollegeRequestService: DefaulterCollegeRequestService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private collegeService: CollegeService, private sSOLoginService: SSOLoginService, private modalService: NgbModal, private nocpaymentService: NocpaymentService) {

  }

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;

  // sso ligin
  sSOLoginDataModel = new SSOLoginDataModel();
  DefaulterCollegeListData: any = [];
  DefaulterCollegeDetailsData: any = {};

  modalReference!: NgbModalRef;
  closeResult!: string;
  public searchText: string = '';
  requestPenalty = new ApplicationPenaltyDataModel();


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetApplicationList();
  }

  async GetApplicationList() {
    try {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();
      await this.DefaulterCollegeRequestService.GetDefaulterCollegeRequestData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.DefaulterCollegeListData = data['Data'][0]['data'];
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async ViewDetails(content: any, RequestID: number) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetApplicationDetails(RequestID);
  }

  async GetApplicationDetails(RequestID: number) {
    try {
      this.DefaulterCollegeDetailsData = {};
      this.request.RequestID = RequestID;
      this.loaderService.requestStarted();
      await this.DefaulterCollegeRequestService.GetDefaulterCollegeRequestData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.DefaulterCollegeDetailsData = data['Data'][0]['data'][0];
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


  public FormSubmit: boolean = false;
  public SelectedRequestID: number = 0;
  async SaveData() {
    this.FormSubmit = true;
    if (this.requestPenalty.Penaltyfor == '' ) {
      return;
    }
    if (this.requestPenalty.ApproveReject == '') {
      return;
    }
    if (this.requestPenalty.ApproveReject == 'Approve') {
      if (this.requestPenalty.PenaltyAmount == null || this.requestPenalty.PenaltyAmount.toString() == '') {
        return;
      }
      if (this.requestPenalty.PenaltyAmount == 0) {
        return;
      }
    }
    this.requestPenalty.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.requestPenalty.ApplyNOCID = this.SelectedRequestID;
    this.requestPenalty.CreatedBy = this.sSOLoginDataModel.UserID;
    this.loaderService.requestStarted();
    try {
      if (confirm("Are you sure you want?")) {
        await this.DefaulterCollegeRequestService.SaveDefaulterCollegePenalty(this.requestPenalty)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              this.requestPenalty = new ApplicationPenaltyDataModel();
              const btnSave = document.getElementById('btnPenaltySave')
              if (btnSave) btnSave.innerHTML = "Save";
              this.FormSubmit = false;
              await this.GetDefaulterCollegePenaltyData();
              await this.GetApplicationList();
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async OpenPenaltyModel(content: any, RequestID: number) {
    this.requestPenalty = new ApplicationPenaltyDataModel();
    this.SelectedRequestID = 0;
    this.SelectedRequestID = RequestID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetDefaulterCollegePenaltyData();
  }
  numberOnly(event: any): boolean {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  public DefaulterCollegePenaltyList: any = [];
  async GetDefaulterCollegePenaltyData() {
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.DefaulterCollegeRequestService.GetDefaulterCollegePenalty(this.SelectedRequestID, 0)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DefaulterCollegePenaltyList = data['Data'][0]['data'];
        });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async EditDefaulterCollegePenalty(PenaltyID: number) {
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.DefaulterCollegeRequestService.GetDefaulterCollegePenalty(this.SelectedRequestID, PenaltyID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.requestPenalty = data['Data'][0]['data'][0];
          const btnSave = document.getElementById('btnPenaltySave')
          if (btnSave) btnSave.innerHTML = "Update";
        });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  async DeleteDefaulterCollegePenalty(PenaltyID: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.DefaulterCollegeRequestService.DeleteDefaulterCollegePenalty(PenaltyID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetDefaulterCollegePenaltyData();
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async Reset() {
    const btnSave = document.getElementById('btnPenaltySave')
    if (btnSave) btnSave.innerHTML = "Save";
    this.requestPenalty = new ApplicationPenaltyDataModel();
  }
}
