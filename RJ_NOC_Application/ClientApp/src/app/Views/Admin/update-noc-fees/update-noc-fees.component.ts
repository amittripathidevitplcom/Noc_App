import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyNOCApplicationDataModel, ParameterFeeMaster } from '../../../Models/ApplyNOCApplicationDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';

@Component({
    selector: 'app-update-noc-fees',
    templateUrl: './update-noc-fees.component.html',
    styleUrls: ['./update-noc-fees.component.css']
})
export class UpdateNocFeesComponent {
    sSOLoginDataModel = new SSOLoginDataModel();
    request = new ParameterFeeMaster();
    public State: number = -1;
    public SuccessMessage: any = [];
    public ErrorMessage: any = [];
    public ApplyNocFeeDetails: any[] = [];

    public SelectedDepartmentID: number = 0;
    public SelectedApplyNOCID: number = 0;

    ApplyNOCFee!: FormGroup;
    closeResult: string | undefined;
    modalReference: NgbModalRef | undefined;
    sSOVerifyDataModel = new SSOLoginDataModel();
    public isSubmitted: boolean = false;
    public IsDisabled: boolean = false;

    constructor(private applyNOCApplicationService: ApplyNOCApplicationService, private sSOLoginService: SSOLoginService, private aadharServiceDetails: AadharServiceDetails, private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService,
        private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService) { }

    async ngOnInit() {
        this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
        this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        this.ApplyNOCFee = this.formBuilder.group(
            {
                txtApplyNOCName: ['', Validators.required],
                txtFeeAmount: ['', [Validators.required]],
                txtOpenFromDate: ['', Validators.required],
                txtOpenToDate: ['', Validators.required]
            })
        await this.GetApplyNOCFeeDetails();
    }

    get form_ApplyNOCFee() { return this.ApplyNOCFee.controls; }

    async GetApplyNOCFeeDetails() {
        try {
            this.request.ActionName = 'GetNOCFeeList';
            this.loaderService.requestStarted();
            await this.applyNOCApplicationService.GetParameterFeeMaster(this.request)
                .then((data: any) => {
                    data = JSON.parse(JSON.stringify(data));
                    this.State = data['State'];
                    this.SuccessMessage = data['SuccessMessage'];
                    this.ErrorMessage = data['ErrorMessage'];
                    this.ApplyNocFeeDetails = data['Data'][0]['data'];
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

    async ViewandUpdateModel(content: any, item: any) {
        this.request.DepartmentID = item.DepartmentID;
        this.request.ParamterID = item.ApplyNocParameterID;
        this.request.OpenFromDate = item.OpenFromDate;
        this.request.OpenToDate = item.OpenToDate;
        this.request.FeeAmount = item.FeeAmount;
        this.request.ApplyNocFeeID = item.ApplyNocFeeID;
        this.request.ApplyNocName = item.ApplyNocName;
        this.request.TableUpdateType = item.TableUpdateType;
        this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        this.SelectedDepartmentID = 0;
        this.SelectedApplyNOCID = 0;
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    async UpdateFeeData() {
        this.isSubmitted = true;

        let isValid = true;
        if (this.ApplyNOCFee.invalid) {
            isValid = false;
            return;
        }

        if (!isValid) {
            return;
        }

        this.loaderService.requestStarted();
        try {
            this.request.ActionName = 'UpdateNOCFees';
            this.loaderService.requestStarted();
            await this.applyNOCApplicationService.GetParameterFeeMaster(this.request)
                .then((data: any) => {
                    data = JSON.parse(JSON.stringify(data));
                    if (this.State == 0) {
                        this.State = data['State'];
                        this.SuccessMessage = data['SuccessMessage'];
                        this.ErrorMessage = data['ErrorMessage'];
                        this.toastr.success("Fee details Updated Successfully");
                        this.modalService.dismissAll('After Success');
                        this.GetApplyNOCFeeDetails();
                        this.loaderService.requestEnded();
                    }
                    else {
                        this.toastr.error(this.ErrorMessage)
                    }
                    //this.ApplyNocFeeDetails = data['Data'][0]['data'];
                }, error => console.error(error));
        }
        catch (ex) { console.log(ex) }
        finally {
            setTimeout(() => {
                this.loaderService.requestEnded();
            }, 200);
        }
    }
}
