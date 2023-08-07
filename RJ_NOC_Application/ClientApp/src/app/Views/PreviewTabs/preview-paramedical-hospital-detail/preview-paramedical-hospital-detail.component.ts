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
import {ParamedicalHospitalBedValidation } from '../../../Models/ParamedicalHospitalDataModel';

@Component({
  selector: 'app-preview-paramedical-hospital-detail',
  templateUrl: './preview-paramedical-hospital-detail.component.html',
  styleUrls: ['./preview-paramedical-hospital-detail.component.css']
})
export class PreviewParamedicalHospitalDetailComponent implements OnInit {
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
  LegalEntityDataModel = new LegalEntityDataModel();
  public ParamedicalHospitalBedValidationList: ParamedicalHospitalBedValidation[] = [];
  constructor(private toastr: ToastrService, private TrusteeGeneralInfoService: TrusteeGeneralInfoService, private modalService: NgbModal, private hospitalDetailService: ParamedicalHospitalService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private fileUploadService: FileUploadService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetHospitalDataList();
    await this.GetLegalEntityData();
  }
  async GetHospitalDataList() {
    this.loaderService.requestStarted();
    try {
      await this.hospitalDetailService.GetDataList(this.SelectedCollageID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.HospitalParentNotDataModelList = data['Data'];
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

  async GetLegalEntityData() {
    try {
      await this.TrusteeGeneralInfoService.GetDataOfLegalEntity(this.sSOLoginDataModel.SSOID)
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
}
