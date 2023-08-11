import { ChangeDetectorRef, Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VeterinaryHospitalDataModel, AnimalDataModel } from '../../../Models/VeterinaryHospitalDataModel';
import { VeterinaryHospitalService } from '../../../Services/VeterinaryHospital/veterinary-hospital.service';

@Component({
  selector: 'app-preview-veterinary-hospital',
  templateUrl: './preview-veterinary-hospital.component.html',
  styleUrls: ['./preview-veterinary-hospital.component.css']
})
export class PreviewVeterinaryHospitalComponent implements OnInit {
  request = new VeterinaryHospitalDataModel();
  requestAnimal = new AnimalDataModel();
  public lstVeterinaryHospital: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public UserID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  constructor(private veterinaryHospitalService: VeterinaryHospitalService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private commonMasterService: CommonMasterService, private routers: Router, private router: ActivatedRoute, private modalService: NgbModal) { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetAllVeterinaryHospitalList();
  }
  async GetAllVeterinaryHospitalList() {

    try {
      this.loaderService.requestStarted();
      await this.veterinaryHospitalService.GetAllVeterinaryHospitalList(this.UserID, this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstVeterinaryHospital = data['Data'][0]['data'];
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
