import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import * as XLSX from 'xlsx';
import { Clipboard } from '@angular/cdk/clipboard';
import { async } from 'rxjs';
import { UserManualDocumentMasterModel } from '../../../Models/UserManualDocumentMasterModel';
import { UserManualDocumentService } from '../../../Services/UserManualDocument/user-manual-document.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-usermanualdocumentmaster',
  templateUrl: './usermanualdocumentmaster.component.html',
  styleUrls: ['./usermanualdocumentmaster.component.css']
})
export class UserManualDocumentMasterComponent implements OnInit {

  UserManualDocumentForm!: FormGroup;
  request = new UserManualDocumentMasterModel();

  public file: any = '';
  public DepartmentList: any = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public UserTypeList: any = [];
  public UserManualDocumentlList: any = [];
  public UserID: number = 0;
  public isDisabledGrid: boolean = false;
  public isLoadingExport: boolean = false;
  public isLoading: boolean = false;
  public isValidDocument: boolean = false;
  public isSubmitted: boolean = false;
  public ImageValidationMessage: string = '';
  public searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public is_disableDepartment: boolean = false;


  constructor(private usermanualDocumentService: UserManualDocumentService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService, private clipboard: Clipboard) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.UserManualDocumentForm = this.formBuilder.group(
      {
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlUserTypeID: ['', [DropdownValidators]],
        txtTitleEnglish: ['', [Validators.required]],
        //txtTitleHindi: ['', [Validators.required]],
        fDocumentUploadFile: [''],
        chkIsShow: [''],
        chkIsNew: [''],
        txtOrderBy: ['', [Validators.required, Validators.min(1)]]
      });

    await this.GetDepartmentList();
    await this.GetUserTypeList();
    await this.GetUserManualDocumentMasterList();
    if (this.sSOLoginDataModel.DepartmentID != 0) {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.is_disableDepartment = true;
    }
    if (this.UserManualDocumentlList.length > 0) {
      const max = Math.max.apply(Math, this.UserManualDocumentlList.map((x: { OrderBy: number; }) => x.OrderBy));
      this.request.OrderBy = Number(max) + 1;
    }
    else {
      this.request.OrderBy = 1;
    }
  }
  get form() { return this.UserManualDocumentForm.controls; }
 
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
  }

  async GetUserTypeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(0,'UserManualType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.UserTypeList = data['Data'];
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

  DeleteImage(Type: string) {
    this.ResetFileAndValidation(Type, '', '', '', false);
  }

  async ValidatePdf(event: any, Type: string) {
    
    try {
      this.loaderService.requestStarted();
      this.isValidDocument = false;
    
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'application/pdf') {
          if (event.target.files[0].size > 2000000) {
            //event.target.value = '';
            this.ImageValidationMessage = 'Select less then 2MB File';
            this.ResetFileAndValidation(Type, '', '', '', true);
            return
          }
          if (event.target.files[0].size < 100000) {
            //event.target.value = '';
            this.ImageValidationMessage = 'Select more then 100kb File';
            this.ResetFileAndValidation(Type, '', '', '', true);
            return
          }
        }
        else {
          this.ImageValidationMessage = 'Select Only pdf file';
          this.ResetFileAndValidation(Type, '', '', '', true);
          return
        }

        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, data['Data'][0]["FileName"], data['Data'][0]["Dis_FileName"], data['Data'][0]["FilePath"], false);
           
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
  }


  ResetFileAndValidation(type: string, name: string, dis_name: string, path: string, isShowFile: boolean) {
    //event.target.value = '';
    try {
      this.loaderService.requestStarted();
     
      if (type == 'DocumentName' || type == 'All') {
        this.isValidDocument = isShowFile;
        this.request.DocumentName = name;
        this.request.Dis_Document = dis_name;
        this.request.DocumentPath = path;
        this.file = document.getElementById('fDocumentUploadFile');
        this.file.value = '';
      }

    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }



  async SaveData() {
    this.isSubmitted = true;
    if (this.UserManualDocumentForm.invalid) {
      return
    }
    if (this.request.DocumentName == '') {
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.usermanualDocumentService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // get saved society
            await this.GetUserManualDocumentMasterList();
            await this.ResetControl();
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
    try {
      this.loaderService.requestStarted();
      const TitleEnglish = document.getElementById('TitleEnglish')
      if (TitleEnglish) TitleEnglish.focus();
      this.isSubmitted = false;
      this.request.ID = 0;
      this.request.UserTypeID = 0;
      //this.request.DepartmentID = 0;
      this.request.TitleEnglish = '';
      this.request.TitleHindi = '';
      this.request.DocumentName = '';
      this.request.DocumentPath = '';
      this.request.Dis_Document = '';
      this.request.IsNew = true;
      this.request.IsShow = true;

      const btnSave = document.getElementById('btnSave')
      if (btnSave) btnSave.innerHTML = "<i class='fa fa-plus'></i> Add &amp; Save";
      const btnReset = document.getElementById('')
      if (btnReset) btnReset.innerHTML = "Reset";
      if (this.UserManualDocumentlList.length > 0) {
        const max = Math.max.apply(Math, this.UserManualDocumentlList.map((x: { OrderBy: number; }) => x.OrderBy));
        this.request.OrderBy = Number(max) + 1;
      }
      else {
        this.request.OrderBy = 1;
      }
    }
    
  catch(Ex) {
    console.log(Ex);
  }
    finally {
  setTimeout(() => {
    this.loaderService.requestEnded();
  }, 200);
}
  
  }

  async GetUserManualDocumentMasterList() {
    
    try {
      this.loaderService.requestStarted();
      await this.usermanualDocumentService.GetUserManualDocumentMasterList(this.sSOLoginDataModel.DepartmentID,'D')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.UserManualDocumentlList = data['Data'][0]['data'];
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

  async Delete_OnClick(ID: number) {
   
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.usermanualDocumentService.DeleteData(ID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetUserManualDocumentMasterList();
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

  async Edit_OnClick(ID: number) {
   
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.usermanualDocumentService.GetUserManualDocumentMasterIDWise(ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.ID = data['Data'][0]["ID"];
          //this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.request.UserTypeID = data['Data'][0]["UserTypeID"];
          this.request.TitleEnglish = data['Data'][0]["TitleEnglish"];
          this.request.TitleHindi = data['Data'][0]["TitleHindi"];
          this.request.DocumentName = data['Data'][0]["DocumentName"];
          this.request.Dis_Document = data['Data'][0]["Dis_Document"];
          this.request.DocumentPath = data['Data'][0]["DocumentPath"];
          this.request.OrderBy = data['Data'][0]["OrderBy"];
          this.request.IsShow = data['Data'][0]["IsShow"];
          this.request.IsNew = data['Data'][0]["IsNew"];
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          debugger;
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

  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {

      this.clipboard.copy(tabellist.innerText);
    }
  }

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.UserManualDocumentlList.length > 0) {
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
        XLSX.writeFile(wb, "UserManualDocumentMaster.xlsx");
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


  btnSavePDF_Click(): void {
    this.loaderService.requestStarted();
    if (this.UserManualDocumentlList.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("SocietyMaster", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("UserManualDocumentMaster" + '.pdf');

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
  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode == 47 || charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
