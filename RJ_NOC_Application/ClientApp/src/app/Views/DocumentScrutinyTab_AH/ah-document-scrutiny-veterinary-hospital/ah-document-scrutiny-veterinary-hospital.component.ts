import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicInformationDetailsService } from '../../../Services/AcademicInformationDetails/academic-information-details.service';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VeterinaryHospitalDataModel, AnimalDataModel } from '../../../Models/VeterinaryHospitalDataModel';
import { VeterinaryHospitalService } from '../../../Services/VeterinaryHospital/veterinary-hospital.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { AnimalDocumentScrutinyService } from '../../../Services/AnimalDocumentScrutiny/animal-document-scrutiny.service';
import { ApplyNocpreviewAnimalhusbandryComponent } from '../../apply-nocpreview-animalhusbandry/apply-nocpreview-animalhusbandry.component';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-ah-document-scrutiny-veterinary-hospital',
  templateUrl: './ah-document-scrutiny-veterinary-hospital.component.html',
  styleUrls: ['./ah-document-scrutiny-veterinary-hospital.component.css']
})
export class AhDocumentScrutinyVeterinaryHospitalComponent implements OnInit {

  public lstVeterinaryHospital: any = [];
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
  dsrequest = new DocumentScrutinyDataModel();

  request = new VeterinaryHospitalDataModel();
  requestAnimal = new AnimalDataModel();
  public UserID: number = 0;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  constructor(private applyNocpreviewAnimalhusbandryComponent: ApplyNocpreviewAnimalhusbandryComponent,private veterinaryHospitalService: VeterinaryHospitalService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private applyNOCApplicationService: ApplyNOCApplicationService,
    private animalDocumentScrutinyService: AnimalDocumentScrutinyService, private modalService: NgbModal) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()))
    await this.GetVeterinaryHospitalAllList();
  }

  async GetVeterinaryHospitalAllList() {
    try {
      this.loaderService.requestStarted();
      await this.animalDocumentScrutinyService.DocumentScrutiny_VeterinaryHospital(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstVeterinaryHospital = data['Data'][0]['VeterinaryHospitals'];
          this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
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
    await this.lstVeterinaryHospital.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    })
  }


  ClickOnAction(idx: number) {
    for (var i = 0; i < this.lstVeterinaryHospital.length; i++) {
      if (i == idx) {
        this.lstVeterinaryHospital[i].Remark = '';
      }
    }
  }

  async SubmitVeterinaryHospitalDetail_Onclick() {
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = 0;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Veterinary Hospital';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.lstVeterinaryHospital.length; i++) {
      if (this.lstVeterinaryHospital[i].Action == '' || this.lstVeterinaryHospital[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.lstVeterinaryHospital[i].Action == 'No') {
        if (this.lstVeterinaryHospital[i].Remark == '' || this.lstVeterinaryHospital[i].Remark == undefined) {
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
    if (this.lstVeterinaryHospital.length > 0) {
      for (var i = 0; i < this.lstVeterinaryHospital.length; i++) {
        console.log(this.lstVeterinaryHospital[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: 0,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.lstVeterinaryHospital[i].Action,
          Remark: this.lstVeterinaryHospital[i].Remark,
          TabRowID: this.lstVeterinaryHospital[i].VeterinaryHospitalID,
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
    this.applyNocpreviewAnimalhusbandryComponent.ViewTarilCommon(ID, ActionType);
  }

  async ViewVeterinaryHospitalDetail(content: any, VeterinaryHospitalID: number) {
    debugger;
    this.request = new VeterinaryHospitalDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.veterinaryHospitalService.GetVeterinaryHospitalByID(VeterinaryHospitalID, this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];
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
}
