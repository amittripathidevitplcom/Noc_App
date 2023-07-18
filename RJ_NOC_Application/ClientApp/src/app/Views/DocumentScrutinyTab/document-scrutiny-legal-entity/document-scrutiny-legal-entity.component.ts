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

@Component({
  selector: 'app-document-scrutiny-legal-entity',
  templateUrl: './document-scrutiny-legal-entity.component.html',
  styleUrls: ['./document-scrutiny-legal-entity.component.css']
})
export class DocumentScrutinyLegalEntityComponent implements OnInit {

  constructor(private medicalDocumentScrutinyService: MedicalDocumentScrutinyService, private applyNOCApplicationService: ApplyNOCApplicationService, private legalEntityListService: LegalEntityService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private collegeService: CollegeService, private sSOLoginService: SSOLoginService) { }

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
    //
    this.ModifyBy = 1;
    // get college list
    this.ViewlegalEntityDataByID();
  }
  async ViewlegalEntityDataByID() {
    try {
      this.loaderService.requestStarted();
      await this.medicalDocumentScrutinyService.DocumentScrutiny_LegalEntity(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (data['Data'].length > 0) {
            this.legalEntityListData1 = data['Data'][0]['legalEntity'];
            if (this.legalEntityListData1 != null) {
              this.legalEntityInstituteDetailData = data['Data'][0]['legalEntity']['InstituteDetails'];
              this.legalEntityMemberDetailData = data['Data'][0]['legalEntity']['MemberDetails'];
            }
            this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];

            this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
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
    })
  }
  async selectInstituteAll(ActionType: string) {
    await this.legalEntityInstituteDetailData.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    })
  }


  ClickMemberOnAction(idx: number) {
    for (var i = 0; i < this.legalEntityMemberDetailData.length; i++) {
      if (i == idx) {
        this.legalEntityMemberDetailData[i].Remark = '';
      }
    }
  }
  ClickInstituteOnAction(idx: number) {
    for (var i = 0; i < this.legalEntityInstituteDetailData.length; i++) {
      if (i == idx) {
        this.legalEntityInstituteDetailData[i].Remark = '';
      }
    }
  }

  async SubmitLegalEntity_Onclick() {
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = 0;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Legal Entity';
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
    if (this.dsrequest.FinalRemark == '') {
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
          UserID: 0,
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
            UserID: 0,
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
}
