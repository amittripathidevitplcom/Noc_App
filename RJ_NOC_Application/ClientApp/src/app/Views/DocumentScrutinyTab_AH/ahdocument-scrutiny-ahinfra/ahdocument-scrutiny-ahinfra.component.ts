import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicInformationDetailsService } from '../../../Services/AcademicInformationDetails/academic-information-details.service';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { SocietyDataModel } from '../../../Models/SocietyDataModel';
import { SocityService } from '../../../Services/Master/SocietyManagement/socity.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { AnimalDocumentScrutinyService } from '../../../Services/AnimalDocumentScrutiny/animal-document-scrutiny.service';
import { ApplyNocpreviewAnimalhusbandryComponent } from '../../apply-nocpreview-animalhusbandry/apply-nocpreview-animalhusbandry.component';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DocumentScrutinyAHDegreeComponent } from '../document-scrutiny-ahdegree/document-scrutiny-ahdegree.component';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-ahdocument-scrutiny-ahinfra',
  templateUrl: './ahdocument-scrutiny-ahinfra.component.html',
  styleUrls: ['./ahdocument-scrutiny-ahinfra.component.css']
})
export class AHDocumentScrutinyAHInfraComponent implements OnInit {
  public AHDepartmentList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public FinalRemarks: any = [];
  public SelectedApplyNOCID: number = 0;
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  request = new SocietyDataModel();
  dsrequest = new DocumentScrutinyDataModel();

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  constructor(private documentscrutinyahdegree: DocumentScrutinyAHDegreeComponent, private applyNocpreviewAnimalhusbandryComponent: ApplyNocpreviewAnimalhusbandryComponent, private socityService: SocityService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private applyNOCApplicationService: ApplyNOCApplicationService,
    private animalDocumentScrutinyService: AnimalDocumentScrutinyService, private modalService: NgbModal) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()))
    await this.GetAllDepartmentInfrastructureList();
  }
  async GetAllDepartmentInfrastructureList() {
    try {
      this.loaderService.requestStarted();
      await this.animalDocumentScrutinyService.DocumentScrutiny_DepartmentInfrastructure(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AHDepartmentList = data['Data'][0]['AHDepartmentList'];
          this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;

          console.log(this.AHDepartmentList);
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
  async selectAll(ActionType: string, idx: number) {
    await this.AHDepartmentList[idx].AHFacilityDepartmentList.forEach((j: { Action: string, Remark: string }) => {
      j.Action = ActionType;
      j.Remark = '';
    })
  }


  ClickOnAction(idx: number, idxx: number) {
    this.AHDepartmentList[idx].AHFacilityDepartmentList[idxx].Remark = '';
  }

  async SubmitAHInfraDetail_Onclick() {
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = 0;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'AHInfra';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.AHDepartmentList.length; i++) {
      for (var j = 0; j < this.AHDepartmentList[i].AHFacilityDepartmentList.length; j++) {
        if (this.AHDepartmentList[i].AHFacilityDepartmentList[j].Action == '' || this.AHDepartmentList[i].AHFacilityDepartmentList[j].Action == undefined) {
          this.toastr.warning('Please take Action on all records');
          return;
        }
        if (this.AHDepartmentList[i].AHFacilityDepartmentList[j].Action == 'No') {
          if (this.AHDepartmentList[i].AHFacilityDepartmentList[j].Remark == '' || this.AHDepartmentList[i].AHFacilityDepartmentList[j].Remark == undefined) {
            this.toastr.warning('Please enter remark');
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
    if (this.AHDepartmentList.length > 0) {
      for (var i = 0; i < this.AHDepartmentList.length; i++) {
        for (var j = 0; j < this.AHDepartmentList[i].AHFacilityDepartmentList.length; j++) {

          this.dsrequest.DocumentScrutinyDetail.push({
            DocumentScrutinyID: 0,
            DepartmentID: this.SelectedDepartmentID,
            CollegeID: this.SelectedCollageID,
            UserID: 0,
            RoleID: this.sSOLoginDataModel.RoleID,
            ApplyNOCID: this.SelectedApplyNOCID,
            Action: this.AHDepartmentList[i].AHFacilityDepartmentList[j].Action,
            Remark: this.AHDepartmentList[i].AHFacilityDepartmentList[j].Remark,
            TabRowID: this.AHDepartmentList[i].AHFacilityDepartmentList[j].ID,
            SubTabName: ''
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
    this.documentscrutinyahdegree.ViewTarilCommon(ID, ActionType);
  }
}
