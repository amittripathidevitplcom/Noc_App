import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { LegalEntityService } from '../../../Services/LegalEntity/legal-entity.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { AbstractControl, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { ApplyNOCPreviewComponent } from '../../apply-nocpreview/apply-nocpreview.component';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-document-scrutiny-legal-entity',
  templateUrl: './document-scrutiny-legal-entity.component.html',
  styleUrls: ['./document-scrutiny-legal-entity.component.css']
})
export class DocumentScrutinyLegalEntityComponent implements OnInit {

  constructor(private modalService: NgbModal, private ApplyNOCPreview: ApplyNOCPreviewComponent, private medicalDocumentScrutinyService: MedicalDocumentScrutinyService, private applyNOCApplicationService: ApplyNOCApplicationService, private legalEntityListService: LegalEntityService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private collegeService: CollegeService, private sSOLoginService: SSOLoginService) { }
  public isSubmitted: boolean = false;
  public QueryStringStatus: any = '';
  public State: number = -1;
  public SuccessMessage: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;

  public UserID: number = 0;
  public legalEntityListData: any = [];
  public legalEntityListData1: any = null;
  public legalEntityInstituteDetailData: any = [];
  public legalEntityMemberDetailData: any = [];
  public searchText: string = '';
  public SsoValidationMessage: string = '';
  public SsoSuccessMessage: string = '';
  public TrustLogoDocPathfileExt: any = [];
  public TrusteeMemberProofDocPathfileExt: any = [];
  public PresidentAadhaarProofDocPathfileExt: any = [];
  public SocietyPanProofDocPathfileExt: any = [];
  public isDisabledAction: boolean = false;

  // sso ligin
  sSOLoginDataModel = new SSOLoginDataModel();
  public CollegeID: number = 0;
  public ModifyBy: number = 0;

  //
  public SSOID: string = '';
  public SelectedLegalEntityID: number = 0;

  public SelectedApplyNOCID: number = 0;
  public UnitOfLand: string = '';

  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;

  public FinalRemarks: any = [];

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString())
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()))
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()))
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    //
    this.ModifyBy = 1;
    // get college list
    this.ViewlegalEntityDataByID();
  }


  public UserSSOID: string = '';
  async ViewlegalEntityDataByID() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_LegalEntity(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (data['Data'].length > 0) {
            this.legalEntityListData1 = data['Data'][0]['legalEntity'];
            this.UserSSOID = this.legalEntityListData1.SSOID;
            if (this.legalEntityListData1 != null) {
              this.legalEntityInstituteDetailData = data['Data'][0]['legalEntity']['InstituteDetails'];
              this.legalEntityMemberDetailData = data['Data'][0]['legalEntity']['MemberDetails'];
            }
            this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
            this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
            this.dsrequest.ActionID = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.ActionID;
            if (this.dsrequest.ActionID == 2) {
              this.isDisabledAction = true;
            }
          }
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


  async selectMemberAll(ActionType: string) {
    await this.legalEntityMemberDetailData.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
      if (ActionType == 'No') {
        this.dsrequest.ActionID = 2;
        this.isDisabledAction = true;
      }
      else {
        this.dsrequest.ActionID = 0;
        this.isDisabledAction = false;
      }
    })
  }
  async selectInstituteAll(ActionType: string) {
    await this.legalEntityInstituteDetailData.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
      if (ActionType == 'No') {
        this.dsrequest.ActionID = 2;
        this.isDisabledAction = true;
      }
      else {
        this.dsrequest.ActionID = 0;
        this.isDisabledAction = false;
      }
    })
  }


  ClickMemberOnAction(idx: number) {
    var Count = 0;
    for (var i = 0; i < this.legalEntityMemberDetailData.length; i++) {
      if (i == idx) {
        this.legalEntityMemberDetailData[i].Remark = '';
      }
      if (this.legalEntityMemberDetailData[i].Action == 'No') {
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
  ClickInstituteOnAction(idx: number) {
    var Count = 0;
    for (var i = 0; i < this.legalEntityInstituteDetailData.length; i++) {
      if (i == idx) {
        this.legalEntityInstituteDetailData[i].Remark = '';
      }
      if (this.legalEntityInstituteDetailData[i].Action == 'No') {
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

  async SubmitLegalEntity_Onclick() {
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Legal Entity';
    this.dsrequest.DocumentScrutinyDetail = [];
    this.isRemarkValid = false;
    this.isFormvalid = true;
    for (var i = 0; i < this.legalEntityMemberDetailData.length; i++) {
      if (this.legalEntityMemberDetailData[i].Action == '' || this.legalEntityMemberDetailData[i].Action == undefined) {
        this.toastr.warning('Please take Member Action on all records');
        return;
      }
      if (this.legalEntityMemberDetailData[i].Action == 'No') {
        if (this.legalEntityMemberDetailData[i].Remark == '' || this.legalEntityMemberDetailData[i].Remark == undefined) {
          this.toastr.warning('Please enter Member remark');
          return;
        }
      }
    }
    if (this.legalEntityInstituteDetailData != null) {
      for (var i = 0; i < this.legalEntityInstituteDetailData.length; i++) {
        if (this.legalEntityInstituteDetailData[i].Action == '' || this.legalEntityInstituteDetailData[i].Action == undefined) {
          this.toastr.warning('Please take Institute Action on all records');
          return;
        }
        if (this.legalEntityInstituteDetailData[i].Action == 'No') {
          if (this.legalEntityInstituteDetailData[i].Remark == '' || this.legalEntityInstituteDetailData[i].Remark == undefined) {
            this.toastr.warning('Please enter Institute remark');
            return;
          }
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
    if (this.legalEntityMemberDetailData.length > 0) {
      for (var i = 0; i < this.legalEntityMemberDetailData.length; i++) {
        console.log(this.legalEntityMemberDetailData[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.legalEntityMemberDetailData[i].Action,
          Remark: this.legalEntityMemberDetailData[i].Remark,
          TabRowID: this.legalEntityMemberDetailData[i].MemberID,
          SubTabName: 'MemberDetail'
        });
      }
    }
    if (this.legalEntityInstituteDetailData != null) {
      if (this.legalEntityInstituteDetailData.length > 0) {
        for (var i = 0; i < this.legalEntityInstituteDetailData.length; i++) {
          console.log(this.legalEntityInstituteDetailData[i]);
          this.dsrequest.DocumentScrutinyDetail.push({
            DocumentScrutinyID: 0,
            DepartmentID: this.SelectedDepartmentID,
            CollegeID: this.SelectedCollageID,
            UserID: this.sSOLoginDataModel.UserID,
            RoleID: this.sSOLoginDataModel.RoleID,
            ApplyNOCID: this.SelectedApplyNOCID,
            Action: this.legalEntityInstituteDetailData[i].Action,
            Remark: this.legalEntityInstituteDetailData[i].Remark,
            TabRowID: this.legalEntityInstituteDetailData[i].InstituteID,
            SubTabName: 'InstituteDetail'
          });
        }
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
    this.ApplyNOCPreview.ViewTarilCommon(ID, ActionType);
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
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public LegalEntityHistory: any = [];
  public legalEntityInstituteDetailDataHis: any = [];
  public legalEntityMemberDetailDataHis: any = [];
  async ViewLegalEntityDetailHistory(content: any) {
    this.LegalEntityHistory = [];
    this.legalEntityInstituteDetailDataHis = [];
    this.legalEntityMemberDetailDataHis = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeTabData_History(0, 'LegalEntityDetails', 0, this.UserSSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LegalEntityHistory = data['Data'][0]['data']["Table"];
          this.legalEntityMemberDetailDataHis = data['Data'][0]['data']["Table2"];
          this.legalEntityInstituteDetailDataHis = data['Data'][0]['data']["Table1"];
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
