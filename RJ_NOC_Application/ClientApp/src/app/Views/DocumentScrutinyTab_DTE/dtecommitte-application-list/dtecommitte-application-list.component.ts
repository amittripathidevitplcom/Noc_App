import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DTEDocumentScrutinyService } from '../../../Services/DTEDocumentScrutiny/dtedocument-scrutiny.service';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';

@Component({
  selector: 'app-dtecommitte-application-list',
  templateUrl: './dtecommitte-application-list.component.html',
  styleUrls: ['./dtecommitte-application-list.component.css']
})
export class DTECommitteApplicationListComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplicationDetails: any[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public ApplicationNo: string = '';

  sSOVerifyDataModel = new SSOLoginDataModel();

  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';

  AadhaarNo: string = '';

  public isLoading: boolean = false;
  public QueryStringStatus: any = '';
  public Stage: any = '';
  constructor(private loaderService: LoaderService, private toastr: ToastrService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private dteDocumentScrutinyService: DTEDocumentScrutinyService, private modalService: NgbModal, private aadharServiceDetails: AadharServiceDetails
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.AadhaarNo = this.sSOLoginDataModel.AadhaarId;
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.Stage = this.router.snapshot.paramMap.get('Stage')?.toString();
    await this.GetApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
  }

  async GetApplicationList(RoleId: number, UserID: number, Status: string) {
    try {
      let ActionName = '';
      if (this.Stage == 'Step1') {
        ActionName = Status == 'Completed' ? 'Recommended by Inspection Committee,Not recommended by Inspection Committee,Forward to Inspection Committee,Forward To Joint Secretary' : Status == 'Pending' ? 'Forward,Forward to Inspection Committee,Forward to Inspection Committee after inspection' : Status == 'Reject' ? 'Reject' : Status == 'Revert' ? 'Revert to Nodal officer' : '';
      }
      else {
        ActionName = Status == 'Completed' ? 'Forward to Inspection Committee after inspection,Forward To Joint Secretary after inspection' : Status == 'Pending' ? 'Forward to DTE committee' : Status == 'Revert' ? 'Revert to Nodal officer after inspection' : Status == 'Reject' ? 'Reject after inspection' : '';
      }
            this.loaderService.requestStarted();
      await this.dteDocumentScrutinyService.GetApplyNOCApplicationList(RoleId, UserID, Status, ActionName, this.sSOLoginDataModel.SessionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationDetails = data['Data'][0];
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


  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public ApplicationTrailList: any = [];
  async GetApplicationTrail(content: any, ApplyNOCID: number) {
    this.ApplicationTrailList = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetApplicationTrail_DepartmentApplicationWise(ApplyNOCID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationTrailList = data['Data'];
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
    window.open('/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())), '_blank')
  }





  public SelectedApplyNOCID: number = 0;
  public SelectedDepartmentID: number = 0;


  async OpenGeneratePDFPopUP(content: any, ApplyNOCID: number, DepartmentID: number) {
    debugger;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  public NOCIssuedRemark: string = '';
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  public isSubmitted: boolean = false;
  public IsNOCIssued: number = 0;
  async GeneratePDF_OnClick() {
    try {
      this.isSubmitted = true;

      if (this.NOCIssuedRemark == '') {
        this.isRemarkValid = true;
        this.isFormvalid = false;
      }
      if (this.IsNOCIssued <= 0) {
        this.isFormvalid = false;
      }
      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      await this.dteDocumentScrutinyService.GeneratePDF_DTENOC(this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID, this.NOCIssuedRemark, this.IsNOCIssued)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage);
            this.modalService.dismissAll('After Success');
            window.location.reload();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
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


  async DocumentScrutiny_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    this.routers.navigate(['/finalchecklistdte' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + this.QueryStringStatus + "/" + this.Stage]);
  }
}

