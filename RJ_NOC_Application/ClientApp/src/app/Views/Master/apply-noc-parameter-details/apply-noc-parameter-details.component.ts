import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';

@Component({
  selector: 'app-apply-noc-parameter-details',
  templateUrl: './apply-noc-parameter-details.component.html',
  styleUrls: ['./apply-noc-parameter-details.component.css']
})
export class ApplyNocParameterDetailsComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  // model popup
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  // login model
  sSOLoginDataModel = new SSOLoginDataModel();

  public ApplyNocApplicationList: any = [];

  constructor(private applyNocParameterService: ApplyNocParameterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal) {
  }

  async ngOnInit() {

    // load
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetApplyNocApplicationList();
  }

  async GetApplyNocApplicationList() {
    try {
      this.loaderService.requestStarted();
      // get
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

  async ViewApplyNocApplication(applyNocApplicationID: number) {

  }

  async DeleteApplyNocApplication(applyNocApplicationID: number) {

  }

}
