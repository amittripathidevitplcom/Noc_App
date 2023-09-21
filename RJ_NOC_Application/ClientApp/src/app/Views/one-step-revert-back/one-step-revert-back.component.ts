import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApplyNOCApplicationService } from '../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyNOCApplicationDataModel } from '../../Models/ApplyNOCApplicationDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommitteeMasterService } from '../../Services/Master/CommitteeMaster/committee-master.service';
import { SSOLoginService } from '../../Services/SSOLogin/ssologin.service';
import { AadharServiceDetails } from '../../Services/AadharServiceDetails/aadhar-service-details.service';
import { AadharServiceDataModel } from '../../Models/AadharServiceDataModel';
import { ApplicationCommitteeMemberdataModel, PostApplicationCommitteeMemberdataModel } from '../../Models/ApplicationCommitteeMemberdataModel';
import { AnimalDocumentScrutinyService } from '../../Services/AnimalDocumentScrutiny/animal-document-scrutiny.service';

@Component({
  selector: 'app-one-step-revert-back',
  templateUrl: './one-step-revert-back.component.html',
  styleUrls: ['./one-step-revert-back.component.css']
})
export class OneStepRevertBackComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplyNocDetails: any[] = [];
  public ApplicationTrailList: any[] = [];
 
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public isSubmitted_MemberDetails: boolean = false;
  
  constructor(private animalDocumentScrutinyService: AnimalDocumentScrutinyService, private sSOLoginService: SSOLoginService, private aadharServiceDetails: AadharServiceDetails, private committeeMasterService: CommitteeMasterService, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetApplyNOCApplicationStep();
  }

  async GetApplyNOCApplicationStep() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetNOCApplicationStepList(0, 0, this.sSOLoginDataModel.DepartmentID, "GetApplicationExistStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyNocDetails = data['Data'][0]['data'];
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

  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string, Status: string) {
    if (DepartmentID = 2) {
      //this.routers.navigate(['/animalhusbandryappnocpreview' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString()))]);
     // this.routers.navigate(['/animalhusbandryappnocviewByNodal' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString()))]);
      window.open("/animalhusbandryappnocviewByNodal" + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())), "_self");
    }
  }

  async RevertOneSetp(ApplyNOCID: number, DepartmentID: number, CurrentActionID: number) {   
    try {
      debugger;
      if (confirm("Are you sure you want to one Step Back this Application ?")) {
        this.loaderService.requestStarted();
        await this.commonMasterService.GetNOCApplicationStepList(ApplyNOCID, CurrentActionID, DepartmentID, "RevertBackOneStep")
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (Number(data['Data'][0]['data'][0]["Status"]) == 1) {
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              this.toastr.success("Application Successfully reverted one step.")
              this.GetApplyNOCApplicationStep();
            }
            else {
              this.toastr.success("Application UnSuccessfully reverted one step. There are some error.")
            }
          }, error => console.error(error));
      }      
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }
  }
  async GetApplicationTrail(content: any, ApplyNOCID: number) {
    this.ApplicationTrailList = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetApplicationTrail_DepartmentApplicationWise(ApplyNOCID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationTrailList = data['Data'];
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
