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
import { ApplyNocParameterDetailsComponent } from '../../Master/apply-noc-parameter-details/apply-noc-parameter-details.component';
@Component({
  selector: 'app-revert-fdrdetails',
  templateUrl: './revert-fdrdetails.component.html',
  styleUrls: ['./revert-fdrdetails.component.css']
})

export class RevertFDRDetailsComponent implements OnInit {

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
  public SelectedDepartmentID: number = 0;
  public SelectedCollageID: number = 0;
  public DApplicationNo: string = '';

  public MaxDate: Date = new Date();
  public MaxExpDate: Date = new Date();

  public SearchRecordID: string = '';
  public QueryStringStatus: any = '';
  public SelectedApplyNOCID: number = 0;

  //@ViewChild(ApplyNocParameterDetailsComponent) child: ApplyNocParameterDetailsComponent | undefined; 

  constructor(private applyNocParameterService: ApplyNocParameterService, private commonMasterService: CommonMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private fileUploadService: FileUploadService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private modalService: NgbModal, private applyNocParameterDetailsComponent: ApplyNocParameterDetailsComponent) {
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
        FDRDocument: [''],
        txtFDRExpriyDate: ['', Validators.required]

      })
    this.ApplyNOCFDRDetailForm.get('ddlPeriodOfFDR')?.disable();

    const txtBankName = document.getElementById('txtBankName')
    if (txtBankName) txtBankName.focus();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    //this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SelectedCollageID = data['Data']['CollegeID'];
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ApplyNocID = this.SelectedApplyNOCID;
    //this.request.CollegeName = this.CollegeName;
    //this.DApplicationNo = this.ApplicationNo;

    //load
    await this.GetApplyNoc_FDRMasterByCollegeID(this.SelectedCollageID)
    //debugger
    // after save fdr

      await this.GetApplyNocFDRDetails(this.request.ApplyNocFDRID, this.request.ApplyNocID);

  }
  get form() { return this.ApplyNOCFDRDetailForm.controls; }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode == 47 || charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }
  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  alphaNumaricOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  async GetApplyNoc_FDRMasterByCollegeID(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.applyNocParameterService.GetApplyNoc_FDRMasterByCollegeID(CollegeID)
        .then((data: any) => {
          debugger;
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


    //
    this.isSubmitted = true;
    //
    let isValid = true;
    if (this.ApplyNOCFDRDetailForm.invalid) {
      isValid = false;
    }
    // image
    if (this.request.FDRDocument == '') {
      this.isValidFDRDocument = true;
      this.DocumentValidMessage = 'This field is required .!';
      isValid = false;
    }
    //if ((this.request.FDRNumber <= 0) || (this.request.PeriodOfFDR == '0') || (this.request.FDRDocument == '') || (this.request.FDRAmount <= 0)) {
    //  isValid = false;
    //}
    if (this.request.FDRNumber == '') {
      isValid = false;
    }
    if (this.SelectedDepartmentID != 1) {
      if (this.request.FDRAmount != Number(this.FDRDetailsData[0]['Amount'])) {
        this.toastr.warning('please enter valid FDR Amount')
        isValid = false;
      }
    }
    if (this.SelectedDepartmentID == 1) {
      if (this.request.FDRAmount < Number(this.FDRDetailsData[0]['Amount'])) {
        this.toastr.warning('please enter valid FDR Amount')
        isValid = false;
      }
    }
    // check all
    if (!isValid) {
      return;
    }

    //Show Loading
    this.loaderService.requestStarted();
    this.request.CollegeID = this.SelectedCollageID;
    this.request.IsFDRSubmited = true;
    this.isLoading = true;
    try {
      await this.applyNocParameterService.SaveApplyNoc_FDRMasterDetail(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            await this.GetApplyNocFDRDetails(this.request.ApplyNocFDRID, this.request.ApplyNocID);
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
        if (/*(event.target.files[0].type === 'image/jpeg') ||*/
          (event.target.files[0].type === 'application/pdf')) {
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
          msg += 'pdf file';
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
    // 
    try {
      this.loaderService.requestStarted();
      await this.applyNocParameterService.GetApplyNocFDRDetails(ApplyNocFDRID, ApplyNocID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.request = data['Data'][0];
          }
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
    this.request.FDRNumber = '';
    this.request.FDRAmount = 0;
    this.request.FDRDate = '';
    this.request.PeriodOfFDR = '0';
    this.request.IsFDRSubmited = false;
    this.request.FDRDocument = '';
    this.request.FDRDocumentPath = '';
    this.request.FDRDocument_Dis_FileName = '';

  }
  public DisabledPeriodofFDR: boolean = true;
  SetFDRExpriyDate() {
    try {
      if (this.request.FDRDate != '') {
        this.request.PeriodOfFDR = '5';
        this.DisabledPeriodofFDR = true;
        this.request.FDRExpriyDate = '';
        this.loaderService.requestStarted();
        const FDRDate = new Date(this.request.FDRDate);
        FDRDate.setFullYear(FDRDate.getFullYear() + 5);
        this.MaxExpDate = new Date(FDRDate.getFullYear(), FDRDate.getMonth(), FDRDate.getDate());
      }
      else {
        this.toastr.warning('Plese Select Fdr Date')
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }
}
