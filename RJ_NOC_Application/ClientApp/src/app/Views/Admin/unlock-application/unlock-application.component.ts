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
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UnlockApplicationDataModel } from '../../../Models/CommonMasterDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';

@Injectable()

@Component({
  selector: 'app-unlock-application',
  templateUrl: './unlock-application.component.html',
  styleUrls: ['./unlock-application.component.css']
})
export class UnlockApplicationComponent implements OnInit {
  request = new DCENOCReportSearchFilterDataModel();
  requestUnlock = new UnlockApplicationDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  //Add FormBuilder
  public DistrictList: any = [];
  public UniversityList: any = [];
  public CollegeStatusList: any = [];
  public WorkFlowActionList: any = [];
  public NodalOfficerList: any = [];
  public CollegeTypeList: any = [];
  public ApplicationTypeList: any = [];
  public ApplicationList: any = [];
  public ApplicationCountList: any = [];
  public QueryStringStatus: string = '';
  public searchText: string = '';
  public SuvdivisionList: any = [];
  public DivisionList: any = [];

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  constructor(private fileUploadService: FileUploadService, private modalService: NgbModal, private routers: Router, private router: ActivatedRoute, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());

    this.request.ReportStatus = this.QueryStringStatus;
    await this.GetUnlockApplication();
  }

  async GetUnlockApplication() {
    try {
      this.ApplicationList = [];
      this.loaderService.requestStarted();
      await this.dceDocumentScrutinyService.GetUnlockApplication(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationList = data['Data'][0];
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
      await this.commonMasterService.GetUnlockApplicationTrail_DepartmentApplicationWise(ApplyNOCID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
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
}
