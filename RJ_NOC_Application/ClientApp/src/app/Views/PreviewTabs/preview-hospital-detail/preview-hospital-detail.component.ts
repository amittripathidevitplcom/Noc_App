import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';

import { HospitalDataModel, HospitalParentNotDataModel } from '../../../Models/HospitalDataModel';
import { min } from 'rxjs';
import { async } from '@angular/core/testing';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { HospitalDetailService } from '../../../Services/Tabs/HospitalDetail/hospital-detail.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TrusteeGeneralInfoService } from '../../../Services/TrusteeGeneralInfo/trustee-general-info.service';
import { LegalEntityDataModel } from '../../../Models/TrusteeGeneralInfoDataModel';

@Component({
  selector: 'app-preview-hospital-detail',
  templateUrl: './preview-hospital-detail.component.html',
  styleUrls: ['./preview-hospital-detail.component.css']
})
export class PreviewHospitalDetailComponent implements OnInit {
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

  constructor(private toastr: ToastrService,private TrusteeGeneralInfoService: TrusteeGeneralInfoService,private modalService: NgbModal,private hospitalDetailService: HospitalDetailService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private fileUploadService: FileUploadService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetHospitalDataList();
    await this.IsSuperSpecialtyHospital();
    await this.GetLegalEntityData();
  }
  async IsSuperSpecialtyHospital() {
    try {
      this.IsShowSuperSpecialtyHospital = false;
      this.loaderService.requestStarted();
      await this.hospitalDetailService.IsSuperSpecialtyHospital(this.SelectedCollageID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.IsShowSuperSpecialtyHospital = data['Data'];
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
          console.log('Deepak');
          console.log(this.HospitalData);
          console.log('Deepak');
        });
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
}
