import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { MGOneDocumentScrutinyService } from '../../../Services/MGOneDocumentScrutiny/mgonedocument-scrutiny.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-generate-loireport-mgone',
  templateUrl: './generate-loireport-mgone.component.html',
  styleUrls: ['./generate-loireport-mgone.component.css']
})
export class GenerateLOIReportMGOneComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public LOIApplicationDetails: any[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public ApplicationNo: string = '';

  sSOVerifyDataModel = new SSOLoginDataModel();

  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';

  AadhaarNo: string = '';

  public isLoading: boolean = false;
  public QueryStringStatus: any = '';
  public IsLOIIssued: number = 0;
  constructor(private loaderService: LoaderService, private toastr: ToastrService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private mg1DocumentScrutinyService: MGOneDocumentScrutinyService, private modalService: NgbModal
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetLOIApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
  }

  async GetLOIApplicationList(RoleId: number, UserID: number, Status: string) {
    try {
      let ActionName = '';
      ActionName = Status == 'Completed' ? 'Release NOC' : Status == 'Pending' ? 'Forward To Deputy Secretary,Forward To Joint Secretary' : '';

      this.loaderService.requestStarted();
      await this.mg1DocumentScrutinyService.GetLOIApplicationList(RoleId, UserID, Status, ActionName)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.LOIApplicationDetails = data['Data'];
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
    window.open('/LOIapplicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())), '_blank')
  }

  public SelectedLOIID: number = 0;
  public SelectedDepartmentID: number = 0;
  async OpenGeneratePDFPopUP(content: any, LOIID: number, DepartmentID: number) {
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedLOIID = LOIID;
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
  async GeneratePDF_OnClick() {
    try {
      this.isSubmitted = true;

      if (this.NOCIssuedRemark == '') {
        this.isRemarkValid = true;
        this.isFormvalid = false;
      }
      if (this.IsLOIIssued <=0) {
        this.isFormvalid = false;
      }
      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      await this.mg1DocumentScrutinyService.GeneratePDF_MedicalGroupLOI(this.SelectedLOIID, this.sSOLoginDataModel.UserID, this.NOCIssuedRemark, this.IsLOIIssued)
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
}

