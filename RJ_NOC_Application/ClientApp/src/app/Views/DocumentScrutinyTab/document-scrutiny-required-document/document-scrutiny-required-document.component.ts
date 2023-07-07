import { Component, OnInit } from '@angular/core';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RequiredDocumentsDataModel, RequiredDocumentsDataModel_Documents } from '../../../Models/TabDetailDataModel'
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeDocumentService } from '../../../Services/Tabs/CollegeDocument/college-document.service';
import { DocumentScrutinyDataModel, DocumentScrutinyList_DataModel } from '../../../Models/DocumentScrutinyDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BuildingDetailsMasterService } from '../../../Services/BuildingDetailsMaster/building-details-master.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-document-scrutiny-required-document',
  templateUrl: './document-scrutiny-required-document.component.html',
  styleUrls: ['./document-scrutiny-required-document.component.css']
})
export class DocumentScrutinyRequiredDocumentComponent implements OnInit {

  request = new RequiredDocumentsDataModel();
  isSubmitted: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  sSOLoginDataModel = new SSOLoginDataModel();

  
  public SelectedApplyNOCID: number = 0;
  dsrequest = new DocumentScrutinyDataModel();
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  //public RequiredDocumentsAllList: any = [];

  constructor(private collegeDocumentService: CollegeDocumentService, private commonMasterService: CommonMasterService,
    private loaderService: LoaderService, private router: ActivatedRoute, private modalService: NgbModal, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService) { }


  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.request.DocumentDetails = [];
    this.GetRequiredDocuments('RequiredDocument')

  }
  async GetRequiredDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.collegeDocumentService.GetList(this.SelectedDepartmentID, this.SelectedCollageID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.DocumentDetails = data['Data'][0]['data'];
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


  async selectAll(ActionType: string) {
    await this.request.DocumentDetails.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    })
  }

  ClickOnAction(idx: number) {
    for (var i = 0; i < this.request.DocumentDetails.length; i++) {
      if (i == idx) {
        this.request.DocumentDetails[i].Remark = '';
      }
    }
  }

  async SubmitFacility_Onclick() {
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = 0;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Required Document';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    for (var i = 0; i < this.request.DocumentDetails.length; i++) {
      if (this.request.DocumentDetails[i].Action == '' || this.request.DocumentDetails[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.request.DocumentDetails[i].Action == 'No') {
        if (this.request.DocumentDetails[i].Remark == '' || this.request.DocumentDetails[i].Remark == undefined) {
          this.toastr.warning('Please enter remark');
          return;
        }
      }
    }

    if (this.dsrequest.FinalRemark == '') {
      this.isRemarkValid = true;
      this.isFormvalid = false;
    }
    if (!this.isFormvalid) {
      return;
    }
    if (this.request.DocumentDetails.length > 0) {
      for (var i = 0; i < this.request.DocumentDetails.length; i++) {
        console.log(this.request.DocumentDetails[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: 0,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.request.DocumentDetails[i].Action,
          Remark: this.request.DocumentDetails[i].Remark,
          TabRowID: this.request.DocumentDetails[i].DID
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
}
