import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { MGThreeAffiliatedHospitalDataModel, MGThreeHospitalDataModel } from '../../../Models/HospitalDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { HospitalDetailService } from '../../../Services/Tabs/HospitalDetail/hospital-detail.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-preview-mgthree-hospital-details',
  templateUrl: './preview-mgthree-hospital-details.component.html',
  styleUrls: ['./preview-mgthree-hospital-details.component.css']
})
export class PreviewMGThreeHospitalDetailsComponent {

  HospitalForm!: FormGroup;
  AffiliatedHospitalForm!: FormGroup;
  // login model
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new MGThreeHospitalDataModel();
  Affiliatedrequest = new MGThreeAffiliatedHospitalDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public HospitalList: any = [];
  constructor( private modalService: NgbModal, private hospitalDetailService: HospitalDetailService,  private loaderService: LoaderService, private commonMasterService: CommonMasterService, private router: ActivatedRoute) {
  }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetMGThreeHospitalDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
  }

  async GetMGThreeHospitalDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, HospitalID: number) {
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.GetMGThreeHospitalDetailList_DepartmentCollegeWise(DepartmentID, CollegeID, HospitalID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HospitalList = data['Data'];
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
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public viewrequest: any = {};
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  async ViewHospitalDetail(content: any, HospitalID: number) {
    this.viewrequest = {};
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.hospitalDetailService.GetMGThreeHospitalDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, HospitalID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.viewrequest = data['Data'][0];
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
