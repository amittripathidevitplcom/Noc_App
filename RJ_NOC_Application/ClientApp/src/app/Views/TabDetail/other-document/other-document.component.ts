import { ChangeDetectorRef, Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RequiredDocumentsDataModel, RequiredDocumentsDataModel_Documents } from '../../../Models/TabDetailDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CollegeDocumentService } from '../../../Services/Tabs/CollegeDocument/college-document.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { Obj } from '@popperjs/core';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable, { Table } from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';


@Component({
  selector: 'app-other-document',
  templateUrl: './other-document.component.html',
  styleUrls: ['./other-document.component.css']
})
export class OtherDocumentComponent implements OnInit {
  isSubmitted: boolean = false;
  otherDocumentsForm!: FormGroup;
  request = new RequiredDocumentsDataModel();
  requestDoc = new RequiredDocumentsDataModel_Documents();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  file: File | any = null;
  public files: File = null;
  public isDisabledGrid: boolean = false;
  public isFileName: boolean = false;
  public isDeleteButton: boolean = true;
  public isLoadingExport: boolean = false;
  public UserID: number = 0;
  public downloadingPDF: boolean = false;
  searchText: string = '';
  public isFormValid: boolean = false;

  public ImageValidate: string = '';
  public CssClass_TextDangerWidth: string = '';
  public CssClass_TextDangerLength: string = '';

  public isValidFileName: boolean = false;
  public showFileUpload: boolean = false;

  public ImageValidationMessage: string = '';

  @ViewChild('fileUploadImage')
  fileUploadImage: ElementRef<HTMLInputElement> = {} as ElementRef;

  public EditID: any;
  isEdit: boolean = false;

  public isView: boolean = true;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;

  public isPrint: boolean = true;
  public CurrentPageName: any = "";
  public dropdownList: any = [];
  public dropdownSettings: IDropdownSettings = {};
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  isUploadImage: boolean = false;
  public lstOtherDocuments: any = [];


  sSOLoginDataModel = new SSOLoginDataModel();
  public SearchRecordID: string = '';



  public HospitalRealtedDocuments: RequiredDocumentsDataModel_Documents[] = []

  public QueryStringStatus: any = '';
  public SelectedApplyNOCID: number = 0;
  constructor(private collegeDocumentService: CollegeDocumentService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute,
    private routers: Router, private cdRef: ChangeDetectorRef, private clipboard: Clipboard) { }

  init() {
    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }

  async ngOnInit(): Promise<void> {
    this.otherDocumentsForm = this.formBuilder.group(
      {
        txtDocumentName: ['', Validators.required],
        txtFileName_OtherDocument: [''],
        txtsearchText: [''],
      })
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    //this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));

    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.CollegeID = data['Data']['CollegeID'];
          this.SelectedCollageID = data['Data']['CollegeID'];
          if (this.request.CollegeID == null || this.request.CollegeID == 0 || this.request.CollegeID == undefined) {
            this.routers.navigate(['/draftapplicationlist']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }

    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.request.CollegeID = this.SelectedCollageID;
    //this.request.DepartmentID = this.SelectedDepartmentID;
    //this.request.SSOID = this.sSOLoginDataModel.SSOID;
    //this.request.DocumentDetails = [];
    //this.GetRequiredDocuments('OtherDocument');
    //if (this.SelectedDepartmentID == 6) {
    //  this.GetHospitalRelatedDocuments('HospitalRelatedDocument');
    //}
    this.GetAllOtherDocumentList();
    //this.request.ActiveStatus = true;
    //this.request.DeleteStatus = false;
  }
  
  get form() { return this.otherDocumentsForm.controls; }  

  //async GetRequiredDocuments(Type: string) {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.collegeDocumentService.GetList(this.SelectedDepartmentID, this.SelectedCollageID, Type)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.request.DocumentDetails = data['Data'][0]['data'];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async GetHospitalRelatedDocuments(Type: string) {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.collegeDocumentService.GetList(this.SelectedDepartmentID, this.SelectedCollageID, Type)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.HospitalRealtedDocuments = data['Data'][0]['data'];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  public IsValid: boolean = true;
  async SaveData() {
    debugger;
    this.isSubmitted = true;
    this.IsValid = true;
    //if (this.SelectedDepartmentID == 6) {
    //  this.HospitalRealtedDocuments.forEach(item => {
    //    if (item.IsMandatory == true && item.FileName == '') {
    //      this.IsValid = false;
    //    }
    //  });
    //}
    //this.request.DocumentDetails.forEach(item => {
    //  if (item.IsMandatory == true && item.FileName == '') {
    //    this.IsValid = false;
    //  }
    //});
    if (this.requestDoc.FileName == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }
   
    if (!this.IsValid) {
      return;
    }
    this.request.CollegeID = this.SelectedCollageID;
    this.request.DocumentType = 'OtherDocument';
    //if (this.SelectedDepartmentID == 6) {
      //this.HospitalRealtedDocuments.forEach(item => {
      //  var IsDocExists = this.request.DocumentDetails.findIndex((x: { DID: number; }) => x.DID == item.DID);
        //if (IsDocExists != -1) {
        //  this.request.DocumentDetails.splice(IsDocExists, 1);
        //}
        this.request.DocumentDetails.push({
          DID: this.requestDoc.DID,
          DocumentName: this.requestDoc.DocumentName,
          DocumentValue: this.requestDoc.DocumentValue,
          IsMandatory: this.requestDoc.IsMandatory,
          Dis_FileName: this.requestDoc.Dis_FileName,
          FileName: this.requestDoc.FileName,
          FilePath: this.requestDoc.FilePath,
          Action: this.requestDoc.Action,
          Remark: this.requestDoc.Remark,
          C_Action: this.requestDoc.C_Action,
          C_Remark: this.requestDoc.C_Remark,
          S_Action: this.requestDoc.S_Action,
          S_Remark: this.requestDoc.S_Remark,
          DocumentType: this.request.DocumentType
        });
      //});
    //}
   
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.collegeDocumentService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage);
            //this.GetRequiredDocuments('OtherDocument');
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
        this.isSubmitted = false;
        this.loaderService.requestEnded();
      }, 200);
    }


  }

  async ValidateUploadImage(event: any, Type: string) {
    try {
      debugger;
      this.loaderService.requestStarted();
      this.isValidFileName = false;
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'application/pdf') {
          if (event.target.files[0].size > 2000000) {
            this.ImageValidationMessage = 'Select less then 2MB File';
            if (Type == 'FileUpload') {
              this.isValidFileName = true;
              this.requestDoc.FileName = '';
              this.requestDoc.Dis_FileName = '';
              this.requestDoc.FilePath = '';
            }
            return
          }
          if (event.target.files[0].size < 100000) {
            this.ImageValidationMessage = 'Select more then 100kb File';
            if (Type == 'FileUpload') {
              this.isValidFileName = true;
              this.requestDoc.FileName = '';
              this.requestDoc.Dis_FileName = '';
              this.requestDoc.FilePath = '';
            }
            return
          }
        }
        else {
          this.ImageValidationMessage = 'Select Only pdf file';
          if (Type == 'FileUpload') {
            this.isValidFileName = true;
            this.requestDoc.FileName = '';
            this.requestDoc.Dis_FileName = '';
            this.requestDoc.FilePath = '';
          }
          return
        }

        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          debugger;
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            if (Type == 'FileUpload') {
              this.requestDoc.FileName = data['Data'][0]["FileName"];
              this.requestDoc.Dis_FileName = data['Data'][0]["Dis_FileName"];
              this.requestDoc.FilePath = data['Data'][0]["FilePath"];
            }
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
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
    this.file = document.getElementById('txtFileName_OtherDocument');
    this.file.value = '';
    
  }
  async DeleteImage(Type: string) {
    try {
      this.loaderService.requestStarted();
      if (Type == 'FileUpload') {
        this.requestDoc.FileName = '';
        this.requestDoc.Dis_FileName = '';
        this.requestDoc.FilePath = '';
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
  async ResetControl() {
    try {
      this.loaderService.requestStarted();
      const txtDocumentName = document.getElementById('txtDocumentName')
      if (txtDocumentName) txtDocumentName.focus();
      this.isSubmitted = false;
      this.requestDoc.DID = 0;
      this.requestDoc.DocumentName = '';
      this.requestDoc.FileName = '';
      this.requestDoc.Dis_FileName = '';
      this.requestDoc.FilePath = '';
      this.request.DocumentDetails = [];
      //this.requestDoc.UserID = 0;

      this.isValidFileName = false;
      //this.request.ActiveStatus = true;
      //this.isDisabledGrid = false;
      this.GetAllOtherDocumentList();
      const btnSave = document.getElementById('btnSave')
      if (btnSave) btnSave.innerHTML = "Save";
      const btnReset = document.getElementById('')
      if (btnReset) btnReset.innerHTML = "Reset";
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  //async SaveData() {
  //  this.isValidFileName = false;

  //  this.CssClass_TextDangerWidth = '';
  //  this.CssClass_TextDangerLength = '';
  //  this.isSubmitted = true;
  //  this.isFormValid = true;
  //  if (this.otherDocumentsForm.invalid) {
  //    this.isFormValid = false;
  //  }
  //  if (this.request.FileName == '') {
  //    this.ImageValidate = 'This field is required .!';
  //    return
  //  }

  //  if (!this.isFormValid) {
  //    return;
  //  }
  //  this.loaderService.requestStarted();
  //  try {
  //    console.log(this.request);
  //    await this.collegeDocumentService.SaveData(this.request)
  //      .then((data: any) => {
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        console.log(this.State);
  //        if (!this.State) {
  //          this.toastr.success(this.SuccessMessage)
  //          this.ResetControl();
  //          this.GetAllOtherDocumentList();
  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage)
  //        }
  //      })
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();

  //    }, 200);
  //  }
  //}
  async GetAllOtherDocumentList() {

    try {
      this.loaderService.requestStarted();
      await this.collegeDocumentService.GetList(this.SelectedDepartmentID, this.SelectedCollageID,"OtherDocument")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstOtherDocuments = data['Data'][0]['data'];
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
  async Edit_OnClick(OtherDocumentID: number) {

    //this.isSubmitted = false;
    //try {
    //  this.loaderService.requestStarted();
    //  await this.collegeDocumentService.GetOtheDocumentByID(OtherDocumentID, this.UserID)
    //    .then((data: any) => {
    //      data = JSON.parse(JSON.stringify(data));
    //      this.request.OtherDocumentID = data['Data']["OtherDocumentID"];
    //      this.request.CollegeID = data['Data']["CollegeID"];
    //      this.request.DocumentName = data['Data']["DocumentName"];


    //      this.request.FileName = data['Data']["FileName"];
    //      this.request.FilePath = data['Data']["FilePath"];
    //      this.request.Dis_FileName = data['Data']["Dis_FileName"];
    //      this.isDisabledGrid = true;
    //      const btnSave = document.getElementById('btnSave')
    //      if (btnSave) btnSave.innerHTML = "Update";
    //      const btnReset = document.getElementById('btnReset')
    //      if (btnReset) btnReset.innerHTML = "Cancel";
    //    }, error => console.error(error));
    //}
    //catch (ex) { console.log(ex) }
    //finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}
  }
  async Delete_OnClick(AID: number) {

    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.collegeDocumentService.Delete(AID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllOtherDocumentList();
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
  //async ResetControl() {
  //  try {
  //    this.loaderService.requestStarted();
  //    const txtDocumentName = document.getElementById('txtDocumentName')
  //    if (txtDocumentName) txtDocumentName.focus();
  //    this.isSubmitted = false;
  //    this.request.OtherDocumentID = 0;
  //    this.request.FileName = '';
  //    this.request.Dis_FileName = '';
  //    this.request.FilePath = '';
  //    this.request.UserID = 0;

  //    this.isValidFileName = false;
  //    this.request.ActiveStatus = true;
  //    this.isDisabledGrid = false;
  //    this.GetAllOtherDocumentList();
  //    const btnSave = document.getElementById('btnSave')
  //    if (btnSave) btnSave.innerHTML = "Save";
  //    const btnReset = document.getElementById('')
  //    if (btnReset) btnReset.innerHTML = "Reset";
  //  }
  //  catch (ex) { }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  //btnCancel_Click() {
  //  this.routers.navigate(['/dashboard']);

  //}
  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {
      this.clipboard.copy(tabellist.innerText);
    }
  }
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.lstOtherDocuments.length > 0) {
      try {
        this.isLoadingExport = true;
        this.downloadingPDF = true;
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
        XLSX.writeFile(wb, "OtherDocument.xlsx");
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
  //@ViewChild('content') content: ElementRef | any;
  btnSavePDF_Click(): void {
    this.downloadingPDF = true;
    this.loaderService.requestStarted();
    if (this.lstOtherDocuments.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);

        doc.text("Other Documents", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("Other Documents" + '.pdf');
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
