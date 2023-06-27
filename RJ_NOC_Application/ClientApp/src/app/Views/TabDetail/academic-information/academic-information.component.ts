import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicInformationDetailsDataModel } from '../../../Models/AcademicInformationDetailsDataModel';
import { AcademicInformationDetailsService } from '../../../Services/AcademicInformationDetails/academic-information-details.service';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'console';

import * as XLSX from 'xlsx';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Clipboard } from '@angular/cdk/clipboard';
/*import * as jsPDF from 'jspdf'*/

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';
import { GlobalConstants } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-academic-information',
  templateUrl: './academic-information.component.html',
  styleUrls: ['./academic-information.component.css']
})
export class AcademicInformationComponent implements OnInit {
  AcademicInformationDetailForm!: FormGroup;
  public isSubmitted: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  request = new AcademicInformationDetailsDataModel();
  public CourseData: any = [];
  public ResultData: any = [];
  public FinancialYearData: any = [];
  public AcademicInformationList: AcademicInformationDetailsDataModel[] = [];
  public TotalStudent: number = 0;
  public isDisabledGrid: boolean = false;
  public CurrentIndex: number = -1;
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public isLoading: boolean = false;
  public isLoadingExport: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public EditID: any;
  isEdit: boolean = false;
  public ValidationMessage: string = '';

  public isView: boolean = true;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;
  public isDeleteButton: boolean = true;
  public isPrint: boolean = true;
  public CurrentPageName: any = "";
  public UserID: number = 0;

  searchText: string = '';
  public dropdownList: any = [];
  public dropdownSettings: IDropdownSettings = {};

  // ssologin model
  ssoLoginModel = new SSOLoginDataModel();

  @ViewChild('fileUploadImage')
  fileUploadImage: ElementRef<HTMLInputElement> = {} as ElementRef;

  constructor(private academicInformationDetailsService: AcademicInformationDetailsService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService, private clipboard: Clipboard) { }    
 

  ngOnInit(): void {

    this.AcademicInformationDetailForm = this.formBuilder.group(
      {
        ddlYearId: ['', [DropdownValidators]],
        ddlCourseId: ['', [DropdownValidators]],
        txtTotalAdmittedStudent: ['', Validators.required],
        txtAppearedStudent: ['', Validators.required],
        ddlResultId: ['', [DropdownValidators]],
        txtPassedStudent: ['', Validators.required],
        txtFailedStudent: ['', Validators.required],
        txtOtherStudent: ['', Validators.required],
        txtsearchText: [''],
      });

    const ddlYearId = document.getElementById('ddlYearId')
    if (ddlYearId) ddlYearId.focus();
    this.UserID = 1;

    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    this.GetCourseList_CollegeWise(this.SelectedCollageID);
    this.GetResult(this.SelectedDepartmentID, 'Result');
    this.GetAllFinancialYear();
    this.GetAcademicInformationDetailAllList();
  }
  get form() { return this.AcademicInformationDetailForm.controls; }

  async GetCourseList_CollegeWise(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCourseList_CollegeWise(CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseData = data['Data'];
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

  async GetResult(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ResultData = data['Data'];
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

  async GetAllFinancialYear() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetAllFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.FinancialYearData = data['Data'];
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

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  async SaveData() {
    
    this.isSubmitted = true;
    console.log(this.request);
    if (Number(this.request.AppearedStudent) > Number(this.request.AdmittedStudent)) {
      this.toastr.warning('Please Enter No Of Appeared Student less than of Total Admitted Student..!');
      return;
    }
    if (Number(this.request.PassedStudent) > Number(this.request.AppearedStudent)) {
      this.toastr.warning('Please Enter No Of Passed Student less than  of No Of Appeared Student..!');
      return;
    }
    this.TotalStudent = Number(this.request.PassedStudent) + Number(this.request.FailedStudent) + Number(this.request.OtherStudent);
    if (Number(this.TotalStudent) != Number(this.request.AppearedStudent)) {
      this.toastr.warning('Please Enter No Of Passed Student + No Of Failed Student + Other(Withheld Result / Supplimentry) = No Of Appeared Student ...!');
      return;
    }
    if (this.AcademicInformationDetailForm.invalid) {
      return
    }
    
    if (this.AcademicInformationDetailForm.invalid) {
      return
    }

    //Show Loading
    this.loaderService.requestStarted();
    this.request.CollegeID = this.SelectedCollageID;
    this.isLoading = true;
    try {
      await this.academicInformationDetailsService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // get saved society
            this.GetCourseList_CollegeWise(this.SelectedCollageID);
            this.GetResult(this.SelectedDepartmentID, 'Result');
            this.GetAllFinancialYear();
            this.GetAcademicInformationDetailAllList();
            this.ResetControl();
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
    const ddlYearId = document.getElementById('ddlYearId')
    if (ddlYearId) ddlYearId.focus();

    this.isSubmitted = false;
    this.request.YearID = 0;
    this.request.CourseID = 0;
    this.request.AdmittedStudent = 0;
    this.request.AppearedStudent = 0;
    this.request.ResultID = 0;
    this.request.PassedStudent = 0;
    this.request.FailedStudent = 0;
    this.request.OtherStudent = 0;
    this.request.UserID = 0;
    this.isDisabledGrid = false;
    this.GetAcademicInformationDetailAllList();
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "<i class='fa fa-plus'></i> Add &amp; Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }

  async GetAcademicInformationDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.academicInformationDetailsService.GetAcademicInformationDetailAllList(this.UserID, this.SelectedCollageID)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AcademicInformationList = data['Data'][0]['data'];
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

  async Edit_OnClick(AcademicInformationID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.academicInformationDetailsService.GetAcademicInformationDetailByID(AcademicInformationID, this.UserID, this.SelectedCollageID)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.request.AcademicInformationID = data['Data'][0]["AcademicInformationID"];
          this.request.YearID = data['Data'][0]["YearID"];
          this.request.CourseID = data['Data'][0]["CourseID"];
          this.request.AdmittedStudent = data['Data'][0]["AdmittedStudent"];
          this.request.AppearedStudent = data['Data'][0]["AppearedStudent"];
          this.request.ResultID = data['Data'][0]["ResultID"];
          this.request.PassedStudent = data['Data'][0]["PassedStudent"];
          this.request.FailedStudent = data['Data'][0]["FailedStudent"];
          this.request.OtherStudent = data['Data'][0]["OtherStudent"];
         
          this.isDisabledGrid = true;

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Reset";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async Delete_OnClick(AcademicInformationID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.academicInformationDetailsService.DeleteData(AcademicInformationID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAcademicInformationDetailAllList();
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {
      
      this.clipboard.copy(tabellist.innerText);
    }
  }
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.AcademicInformationList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        //ws['!cols'] = [];
        //ws['!cols'][0] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "AcademicInformationDetail.xlsx");
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

  @ViewChild('content') content: ElementRef | any;
  btnSavePDF_Click(): void {
    this.loaderService.requestStarted();
    if (this.AcademicInformationList.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("AcademicInformationDetail", 100, 10, { align: 'center', maxWidth: 100 });
        autoTable(doc, {
          html: '#tabellist'
          , styles: { fontSize: 8 },
          headStyles: {
            fillColor: '#3f51b5',
            textColor: '#fff',
            halign: 'center'
          },
          bodyStyles: {
            halign: 'center'
          },
          margin: {
            left: 5,
            right: 5,
            top: 15
          },
          tableLineWidth: 0
        })
        doc.save("AcademicInformationDetail" + '.pdf');

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







  //async AddData() {
  //  this.isSubmitted = true;
  //  if (Number(this.request.AppearedStudent) > Number(this.request.AdmittedStudent)) {
  //    this.toastr.warning('Please Enter No Of Appeared Student less than of Total Admitted Student..!');
  //    return;
  //  }
  //  if (Number(this.request.PassedStudent) > Number(this.request.AppearedStudent)) {
  //    console.log(this.request.PassedStudent);
  //    this.toastr.warning('Please Enter No Of Passed Student less than  of No Of Appeared Student..!');
  //    return;
  //  }
  //  this.TotalStudent = Number(this.request.PassedStudent) + Number(this.request.FailedStudent) + Number(this.request.OtherStudent);
  //  if (Number(this.TotalStudent) != Number(this.request.AppearedStudent)) {
  //    this.toastr.warning('Please Enter No Of Passed Student + No Of Failed Student + Other(Withheld Result / Supplimentry) = No Of Appeared Student ...!');
  //    return;
  //  }
  //  if (this.AcademicInformationDetailForm.invalid) {
  //    return
  //  }
  //  if (this.CurrentIndex != -1) {
  //    this.AcademicInformationList.splice(this.CurrentIndex, 1, this.request);
  //  }
  //  else {
  //    this.AcademicInformationList.push({
  //      AcademicInformationID: 0,
  //      YearID: this.request.YearID,
  //      YearValue: this.FinancialYearData.find((x: { FinancialYearID: number; }) => x.FinancialYearID == this.request.YearID).FinancialYearName,
  //      CourseID: this.request.CourseID,
  //      CourseName: this.CourseData.find((x: { CourseID: number; }) => x.CourseID == this.request.CourseID).CourseName,
  //      AdmittedStudent: this.request.AdmittedStudent,
  //      AppearedStudent: this.request.AppearedStudent,
  //      ResultID: this.request.ResultID,
  //      ResultName: this.ResultData.find((x: { ID: number; }) => x.ID == this.request.ResultID).Name,
  //      PassedStudent: this.request.PassedStudent,
  //      FailedStudent: this.request.FailedStudent,
  //      OtherStudent: this.request.OtherStudent,
  //      Percentage: (Number(this.request.PassedStudent) / Number(this.request.AppearedStudent)) * 100
  //    });
  //  }
  //  this.request = new AcademicInformationDetailsDataModel();
  //  this.CurrentIndex = -1;
  //  const btnAdd = document.getElementById('btnAdd')
  //  if (btnAdd) { btnAdd.innerHTML = "Add"; }
  //  this.isDisabledGrid = false;
  //}

  //async EditAcademicInformation(Item: any, idx: number) {
  //  this.CurrentIndex = idx;
  //  this.isDisabledGrid = true;
  //  this.request = Item;
  //  const btnAdd = document.getElementById('btnAdd')
  //  if (btnAdd) { btnAdd.innerHTML = "Update"; }
  //}

  //async DeleteAcademicInformation(i: number) {
  //  this.isSubmitted = false;
  //  try {
  //    if (confirm("Are you sure you want to delete this ?")) {
  //      this.loaderService.requestStarted();
  //      this.AcademicInformationList.splice(i, 1);
  //    }
  //  }
  //  catch (ex) { }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
}
