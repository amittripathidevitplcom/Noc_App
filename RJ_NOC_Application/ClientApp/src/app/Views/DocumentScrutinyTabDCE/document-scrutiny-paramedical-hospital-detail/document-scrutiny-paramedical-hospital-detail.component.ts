import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { ParamedicalHospitalService } from '../../../Services/Tabs/ParamedicalHospital/paramedical-hospital.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { LegalEntityDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';
import { ParamedicalHospitalBedValidation } from '../../../Models/ParamedicalHospitalDataModel';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';

@Component({
  selector: 'app-document-scrutiny-paramedical-hospital-detail-dce',
  templateUrl: './document-scrutiny-paramedical-hospital-detail.component.html',
  styleUrls: ['./document-scrutiny-paramedical-hospital-detail.component.css']
})
export class DocumentScrutinyParamedicalHospitalDetailComponentDce implements OnInit {

  public ParamedicalHospitalBedValidationList: ParamedicalHospitalBedValidation[] = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public HospitalParentNotDataModelList: any = [];
  public IsShowSuperSpecialtyHospital: boolean = false;
  public HospitalData: any = {};
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public SelectedApplyNOCID: number = 0;
  public UnitOfLand: string = '';

  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();
  public FinalRemarks: any = [];
  LegalEntityDataModel = new LegalEntityDataModel();
  constructor(private medicalDocumentScrutinyService: MedicalDocumentScrutinyService,private applyNOCApplicationService: ApplyNOCApplicationService,private toastr: ToastrService, private TrusteeGeneralInfoService: TrusteeGeneralInfoService, private modalService: NgbModal, private hospitalDetailService: ParamedicalHospitalService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private fileUploadService: FileUploadService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    await this.GetHospitalDataList();
    await this.GetLegalEntityData();
  }
  async GetHospitalDataList() {
    this.loaderService.requestStarted();
    try {
      await this.medicalDocumentScrutinyService.DocumentScrutiny_ParamedicalHospitalDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.HospitalParentNotDataModelList = data['Data'][0]['HospitalDetails'];
            this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
            this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async ViewHospitalDetail(content: any, HospitalID: number) {
    this.HospitalData = {};
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.GetData(HospitalID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HospitalData = data['Data'];
        });
      await this.GetParamedicalHospitalBedValidation(HospitalID);
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

  public UserSSOID: string = '';
  async GetLegalEntityData() {
    try {
      await this.commonMasterService.GetCollegeBasicDetails(this.SelectedCollageID.toString())
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserSSOID = data['Data'][0]['data'][0]['ParentSSOID'];
          this.TrusteeGeneralInfoService.GetDataOfLegalEntity(this.UserSSOID)
            .then(async (data: any) => {
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              debugger;
              if (this.State == 0) {
                this.LegalEntityDataModel = JSON.parse(JSON.stringify(data['Data']));
              }
              if (this.State == 1) {
                this.toastr.error(this.ErrorMessage)
              }
              else if (this.State == 2) {
                this.toastr.warning(this.SuccessMessage)
              }
            })
        }, error => console.error(error));

    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetParamedicalHospitalBedValidation(HospitalID: number) {
    try {
      this.ParamedicalHospitalBedValidationList = [];
      await this.hospitalDetailService.GetParamedicalHospitalBedValidation(this.SelectedCollageID, HospitalID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ParamedicalHospitalBedValidationList = JSON.parse(JSON.stringify(data['Data']));
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.SuccessMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async selectAll(ActionType: string) {
    await this.HospitalParentNotDataModelList.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    })
  }

  ClickOnAction(idx: number) {
    for (var i = 0; i < this.HospitalParentNotDataModelList.length; i++) {
      if (i == idx) {
        this.HospitalParentNotDataModelList[i].Remark = '';
      }
    }
  }

  async SubmitHospitalDetail_Onclick() {
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = 0;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Paramedical Hospital Details';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.HospitalParentNotDataModelList.length; i++) {
      if (this.HospitalParentNotDataModelList[i].Action == '' || this.HospitalParentNotDataModelList[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.HospitalParentNotDataModelList[i].Action == 'No') {
        if (this.HospitalParentNotDataModelList[i].Remark == '' || this.HospitalParentNotDataModelList[i].Remark == undefined) {
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
    if (this.HospitalParentNotDataModelList.length > 0) {
      for (var i = 0; i < this.HospitalParentNotDataModelList.length; i++) {
        console.log(this.HospitalParentNotDataModelList[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: 0,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.HospitalParentNotDataModelList[i].Action,
          Remark: this.HospitalParentNotDataModelList[i].Remark,
          TabRowID: this.HospitalParentNotDataModelList[i].HospitalID,
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
}
