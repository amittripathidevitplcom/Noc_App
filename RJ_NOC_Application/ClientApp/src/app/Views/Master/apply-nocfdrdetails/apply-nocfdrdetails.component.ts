import { Component, OnInit, Input, Injectable, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray, PatternValidator } from '@angular/forms';
import { ApplyNocFDRDetailsDataModel } from '../../../Models/ApplyNocParameterDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service'
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-apply-nocfdrdetails',
  templateUrl: './apply-nocfdrdetails.component.html',
  styleUrls: ['./apply-nocfdrdetails.component.css']
})

export class ApplyNOCFDRDetailsComponent implements OnInit {
  @ViewChild('modal')
  modal: NgbModal;

  ApplyNOCFDRDetailForm!: FormGroup;
  public IFSCRegex = new RegExp(/^[A-Z]{4}0[A-Z0-9]{6}$/);

  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  public file: any = '';
  /*Save Data Model*/
  request = new ApplyNocFDRDetailsDataModel();
  public FDRDetailsData: ApplyNocFDRDetailsDataModel[] = [];
  public isValidFDRDocument: boolean = false;
  public showFDRDocument: boolean = false;
  public DocumentValidMessage: string = '';
  public SelectedCollageID: number = 0;
  // model
  @Input() public CollegeID: number = 0;
  @Input() public ApplyNocApplicationID: number = 0;
  @Input() public IsSaveFDR: boolean = false;

  constructor(private applyNocParameterService: ApplyNocParameterService, private commonMasterService: CommonMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private fileUploadService: FileUploadService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private modalService: NgbModal) {
  }

  async ngOnInit() {

    this.ApplyNOCFDRDetailForm = this.formBuilder.group(
      {
        txtBankName: ['', Validators.required],
        txtBranchName: ['', Validators.required],
        txtIFSCCode: ['', [Validators.required, Validators.pattern(this.IFSCRegex)]],
        txtFDRNumber: ['', Validators.required],
        txtFDRAmount: ['', Validators.required],
        txtFDRDate: ['', Validators.required],
        ddlPeriodOfFDR: ['0', [DropdownValidators]],
        FDRDocument: ['', Validators.required],
      })

    const txtBankName = document.getElementById('txtBankName')
    if (txtBankName) txtBankName.focus();

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedCollageID = this.CollegeID;
    this.request.ApplyNocID = this.ApplyNocApplicationID;
    //load
    await this.GetApplyNoc_FDRMasterByCollegeID(this.SelectedCollageID)
    debugger
    // after save fdr
    if (this.IsSaveFDR) {
      await this.GetApplyNocFDRDetails(this.request.ApplyNocFDRID, this.request.ApplyNocID);
    }
  }
  get form() { return this.ApplyNOCFDRDetailForm.controls; }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  async GetApplyNoc_FDRMasterByCollegeID(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.applyNocParameterService.GetApplyNoc_FDRMasterByCollegeID(CollegeID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.FDRDetailsData = data['Data'];
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

  async SaveData() {
    //debugger;
    this.isSubmitted = true;
    //debugger;
    let isValid = true;
    console.log(this.request);
    if (this.ApplyNOCFDRDetailForm.invalid) {
      isValid = false;
      return;
    }
    if ((this.request.FDRNumber <= 0) || (this.request.PeriodOfFDR == '0') || (this.request.FDRDocument == '') || (this.request.FDRAmount <= 0)) {
      return;
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.request.CollegeID = this.SelectedCollageID;
    this.request.IsFDRSubmited = true;
    this.isLoading = true;
    try {
      await this.applyNocParameterService.SaveApplyNoc_FDRMasterDetail(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.modal.dismissAll();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async DeleteImage(fileName: string) {
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      // delete from server folder
      await this.fileUploadService.DeleteDocument(fileName).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.showFDRDocument = false;
          this.request.FDRDocument = '';
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }

  }

  async ValidateDocumentImage(event: any) {
    this.DocumentValidMessage = '';
    this.loaderService.requestStarted();
    try {
      this.isValidFDRDocument = false;
      if (event.target.files && event.target.files[0]) {
        if ((event.target.files[0].type === 'image/jpeg') || (event.target.files[0].type === 'application/pdf')) {
          if (event.target.files[0].size > 2000000) {
            event.target.value = '';
            this.isValidFDRDocument = true;
            this.request.FDRDocument = '';
            this.DocumentValidMessage = 'Select less then 2MB File';
            return
          }
          if (event.target.files[0].size < 100000) {
            event.target.value = '';
            this.isValidFDRDocument = true;
            this.request.FDRDocument = '';
            this.DocumentValidMessage = 'Select more then 100kb File';
            return
          }
        }
        else {
          event.target.value = '';
          let msg = 'Select Only ';
          this.isValidFDRDocument = true;
          this.request.FDRDocument = '';
          msg += 'jpeg/pdf file';
          this.DocumentValidMessage = msg;

          return
        }
        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.showFDRDocument = true;
            this.request.FDRDocument = data['Data'][0]["FileName"];
            this.request.FDRDocumentPath = data['Data'][0]["FilePath"];
            this.request.FDRDocument_Dis_FileName = data['Data'][0]["Dis_FileName"];
            event.target.value = '';
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
    } catch (ex) {

    }
    finally {
      this.loaderService.requestEnded();
    }
  }

  async GetApplyNocFDRDetails(ApplyNocFDRID: number, ApplyNocID: number) {
    // debugger;
    try {
      this.loaderService.requestStarted();
      await this.applyNocParameterService.GetApplyNocFDRDetails(ApplyNocFDRID, ApplyNocID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request = data['Data'][0];
          console.log(this.request);
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

  ResetControl() {
    const txtBankName = document.getElementById('txtBankName')
    if (txtBankName) txtBankName.focus();
    this.showFDRDocument = false;
    this.request.BankName = '';
    this.request.BranchName = '';
    this.request.IFSCCode = '';
    this.request.FDRNumber = 0;
    this.request.FDRAmount = 0;
    this.request.FDRDate = '';
    this.request.PeriodOfFDR = '0';
    this.request.IsFDRSubmited = false;
    this.request.FDRDocument = '';
    this.request.FDRDocumentPath = '';
    this.request.FDRDocument_Dis_FileName = '';

  }

  CloseModelPopUp() {
    this.modal.dismissAll();
  }
}
