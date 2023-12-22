import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { GrievanceDataModel } from '../../../Models/GrievanceDataModel'
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { GrievanceService } from '../../../Services/Grievance/grievance.service';

@Injectable()
@Component({
  selector: 'app-new-grievance',
  templateUrl: './new-grievance.component.html',
  styleUrls: ['./new-grievance.component.css']
})
export class NewGrievanceComponent implements OnInit {
  AnimalMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public CollegeDataList: any = [];
  /*Save Data Model*/
  request = new GrievanceDataModel();
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  public isDeleteButton: boolean = true;
  public UserID: number = 0;
  public DepartmentList: any;
  public AnimalMasterData: any;
  public isDisabledClient: boolean = true;
  public checked: boolean = true;
  searchText: string = '';
  public ActiveStatus: boolean = true;
  public isMobileEntry: boolean = false;
  public file!: File;
  sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private grievanceService: GrievanceService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private clipboard: Clipboard, private fileUploadService: FileUploadService) { }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.MobileNo = this.sSOLoginDataModel.MobileNo;

    if (this.request.MobileNo == null || this.request.MobileNo == undefined || this.request.MobileNo == '') {
      this.isMobileEntry = true;
    }
    else {
      this.isMobileEntry = false;
    }


    this.AnimalMasterForm = this.formBuilder.group(
      {
        ddlBugFrom: [''],
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlCollegeID: [''],
        txtSubject: ['', [Validators.required]],
        txtDescription: ['', [Validators.required]],
        txtMobileNo: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]],
        chkActiveStatus: [''],
        fileAttachmentFile: [''],
      }
    )
    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();
    await this.GetDepartmentList();
    await this.GetGrievanceList();
    this.ActiveStatus = true;
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  async onFilechange(event: any) {

    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
      /*  if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg') {*/
          //size validation
          if (this.file.size > 5000000) {
            this.request.AttachmentFile = '';
            this.request.AttachmentFile_Dis_FileName = '';
            this.request.AttachmentFilePath = '';
            this.toastr.error("Select less then 5MB File.!")
            return
          }
          await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.request.AttachmentFile = data['Data'][0]["FileName"];
              this.request.AttachmentFile_Dis_FileName = data['Data'][0]["Dis_FileName"];
              this.request.AttachmentFilePath = data['Data'][0]["FilePath"];

            }
            if (this.State == 1) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
        }
        else {
          this.toastr.warning('Select File Format.!');
          return
        }
     /* }*/
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

  async DeleteImage(file: string) {
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.request.AttachmentFile = '';
        this.request.AttachmentFile_Dis_FileName = '';
        this.request.AttachmentFilePath = '';
      }
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
  get form() { return this.AnimalMasterForm.controls; }

  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentList = data['Data'];

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
  };


  async ddlDepartment_textChange(SeletedDepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(SeletedDepartmentID, this.sSOLoginDataModel.SSOID, "Grievance")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeDataList = data['Data'];
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
  };
  async GetGrievanceList() {
    try {
      this.loaderService.requestStarted();
      await this.grievanceService.GetGrievance_AddedSSOIDWise(this.sSOLoginDataModel.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AnimalMasterData = data['Data'][0];
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
    this.isSubmitted = true;
    if (this.AnimalMasterForm.invalid) {
      return
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    this.request.SSOID = this.sSOLoginDataModel.SSOID;
    
    try {
      await this.grievanceService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetGrievanceList();
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
  async ResetControl() {
    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();
    this.isSubmitted = false;
    this.isDisabledGrid = false;
    this.request.GrievanceID = 0;
    this.request.SSOID = '';
    this.request.MobileNo = '';
    this.request.BugFrom = 'Web Portal';
    this.request.DepartmentID = 0;
    this.request.CollegeID = 0;
    this.request.Subject = '';
    this.request.Description = '';
    this.request.AttachmentFile = '';
    this.request.AttachmentFile_Dis_FileName = '';
    this.request.AttachmentFilePath = '';

    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Submit";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }
  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {
      this.clipboard.copy(tabellist.innerText);
    }
  }
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.AnimalMasterData.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][4] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "AnimalMaster.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }
  }


}

