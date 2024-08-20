import { Component, OnInit, Input } from '@angular/core';
import { ApplyNocFDRDetailsDataModel } from '../../../Models/ApplyNocParameterDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DocumentScrutinyComponent } from '../../DCE/document-scrutiny/document-scrutiny.component';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { ToastrService } from 'ngx-toastr';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';


@Component({
  selector: 'app-document-scrutiny-fdrdetails-dce',
  templateUrl: './document-scrutiny-fdrdetails-dce.component.html',
  styleUrls: ['./document-scrutiny-fdrdetails-dce.component.css']
})
export class DocumentScrutinyFDRDetailsDCEComponent implements OnInit {
  public FDRResponseDataModel: any[] = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  dsrequest = new DocumentScrutinyDataModel();
  public isDisabledAction: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedApplyNOCID: number = 0;
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  public FinalRemarks: any = [];
  public QueryStringStatus: any = '';


  constructor(private dceDocumentScrutinyService: DCEDocumentScrutinyService,private applyNOCApplicationService: ApplyNOCApplicationService, private toastr: ToastrService, private dcedocumentscrutiny: DocumentScrutinyComponent,private loaderService: LoaderService, private applyNocParameterService: ApplyNocParameterService, private router: ActivatedRoute, private commonMasterService: CommonMasterService) {


  }

  async ngOnInit() {
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()))
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.getFDRDetailId(this.SelectedCollageID);
  }

  async getFDRDetailId(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.dceDocumentScrutinyService.DocumentScrutiny_FDRDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          // data
          this.FDRResponseDataModel = data['Data'][0]['FDRDetails'][0];
          this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
          this.dsrequest.ActionID = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.ActionID;
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


  async selectAll(ActionType: string) {
    await this.FDRResponseDataModel.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    });
    if (ActionType == 'No') {
      this.dsrequest.ActionID = 2;
      this.isDisabledAction = true;
    }
    else {
      this.dsrequest.ActionID = 0;
      this.isDisabledAction = false;
    }
  }


  ClickOnAction(idx: number) {
    var Count = 0;
    for (var i = 0; i < this.FDRResponseDataModel.length; i++) {
      if (i == idx) {
        this.FDRResponseDataModel[i].Remark = '';
      }
      if (this.FDRResponseDataModel[i].Action == 'No') {
        Count++;
      }
    }
    if (Count > 0) {
      this.dsrequest.ActionID = 2;
      this.isDisabledAction = true;
    }
    else {
      this.dsrequest.ActionID = 0;
      this.isDisabledAction = false;
    }
  }

  public isSubmitted: boolean = false;

  async SubmitFDRInformationDetail_Onclick() {
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'FDR';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.FDRResponseDataModel.length; i++) {
      if (this.FDRResponseDataModel[i].Action == '' || this.FDRResponseDataModel[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.FDRResponseDataModel[i].Action == 'No') {
        if (this.FDRResponseDataModel[i].Remark == '' || this.FDRResponseDataModel[i].Remark == undefined) {
          this.toastr.warning('Please enter remark');
          return;
        }
      }
    }
    if (this.dsrequest.ActionID <= 0) {
      this.isFormvalid = false;
    }
    if (this.dsrequest.FinalRemark == '' || this.dsrequest.FinalRemark == undefined) {
      this.isRemarkValid = true;
      this.isFormvalid = false;
    }
    if (!this.isFormvalid) {
      return;
    }
    if (this.FDRResponseDataModel.length > 0) {
      for (var i = 0; i < this.FDRResponseDataModel.length; i++) {
        console.log(this.FDRResponseDataModel[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.FDRResponseDataModel[i].Action,
          Remark: this.FDRResponseDataModel[i].Remark,
          TabRowID: this.FDRResponseDataModel[i].ApplyNocFDRID,
          SubTabName: ''
        });
      }
    }
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.SaveDocumentScrutiny(this.dsrequest)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.isRemarkValid = false;
            this.isFormvalid = true;
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ViewTaril(ID: number, ActionType: string) {
    this.dcedocumentscrutiny.ViewTarilCommon(ID, ActionType);
  }

}

