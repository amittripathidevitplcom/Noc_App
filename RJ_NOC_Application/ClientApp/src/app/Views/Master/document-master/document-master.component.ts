import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { DocumentMasterService } from '../../../Services/Master/DocumentMaster/document-master.service';
import { DocumentDataModel } from '../../../Models/DocumentDataModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { Clipboard } from '@angular/cdk/clipboard';
/*import * as jsPDF from 'jspdf'*/

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';

@Injectable()
@Component({
  selector: 'app-document-master',
  templateUrl: './document-master.component.html',
  styleUrls: ['./document-master.component.css']
})
export class DocumentMasterComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  DocumentFormGroup!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DepartmentData: any = [];

  public isDisabledGrid: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  isEdit: boolean = false;

  public isView: boolean = true;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;
  public isDeleteButton: boolean = true;
  public isPrint: boolean = true;
  public CurrentPageName: any = "";

  public UserID: number = 0;
  public documentMasterData: any = [];
  searchText: string = '';
  public dropdownList: any = [];
  public dropdownSettings: IDropdownSettings = {};
  request = new DocumentDataModel();
  public is_disableDepartment: boolean = false;
  constructor(private documentMasterService: DocumentMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private clipboard: Clipboard) {

  }



  async ngOnInit() {
    this.request.DocumentTypeID = "0"
    this.DocumentFormGroup = this.formBuilder.group(
      {
        ddlDepartmentId: ['0', [DropdownValidators]],
        ddlDocumentTypeId: ['0'],
        txtDocumentName: ['', Validators.required],
        txtMinSize: [0, Validators.required],
        txtMaxSize: [0, Validators.required],
        chkIsActiveStatus: ['false'],
        chkIsCompulsory: ['false'],
      })

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    const txtDocumentName = document.getElementById('txtDocumentName')
    if (txtDocumentName) txtDocumentName.focus();
    this.UserID = 1;

    this.GetDepartmentList();
    //diable dropdown
    if (this.sSOLoginDataModel.DepartmentID != 0) {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.is_disableDepartment = true;
    }

    this.GetAllList();
  }

  get form() { return this.DocumentFormGroup.controls; }

  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentData = data['Data'];
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
  async GetAllList() {
    try {

      this.loaderService.requestStarted();
      await this.documentMasterService.GetList(this.UserID, this.request.DepartmentID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.documentMasterData = data['Data'][0]['data'];
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
    if (this.DocumentFormGroup.invalid) {
      return
    }
    //if (this.request.DocumentTypeID == '0' || this.request.MinSize <= 0 || (this.request.MinSize).toString() == '' || this.request.MaxSize <= 0 || (this.request.MaxSize).toString() == '') {
    //  return;
    //}
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.documentMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetAllList();
         
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
    const txtDocumentName = document.getElementById('txtDocumentName')
    if (txtDocumentName) txtDocumentName.focus();

    //const ddlDepartmentId = document.getElementById('ddlDepartmentId')
    //if (ddlDepartmentId) ddlDepartmentId.focus();

    this.isSubmitted = false;
    this.request.DocumentMasterID = 0;
   // this.request.DepartmentID = 0;
    this.request.DocumentTypeID = '0';
    this.request.DocumentName = '';
    this.request.IsActiveStatus = true;
    this.request.IsCompulsory = false;
    this.request.MinSize = 0;
    this.request.MaxSize = 0;
    this.request.UserID = 0;
    this.isDisabledGrid = false;

    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }

  async Edit_OnClick(DocumentMasterID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.documentMasterService.GetByID(DocumentMasterID, this.UserID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.request.DocumentMasterID = data['Data'][0]["DocumentMasterID"];
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.request.DocumentTypeID = data['Data'][0]["DocumentTypeID"];
          this.request.DocumentName = data['Data'][0]["DocumentName"];
          this.request.MinSize = data['Data'][0]["MinSize"];
          this.request.MaxSize = data['Data'][0]["MaxSize"];
          this.request.IsActiveStatus = data['Data'][0]["IsActiveStatus"];
          this.request.IsCompulsory = data['Data'][0]["IsCompulsory"];
          this.isDisabledGrid = true;

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async Delete_OnClick(DocumentMasterID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.documentMasterService.DeleteData(DocumentMasterID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllList();
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
    if (this.documentMasterData.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][6] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "DocumentMaster.xlsx");
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
    if (this.documentMasterData.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.documentMasterData.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "DocumentTypeName": this.documentMasterData[i]['DocumentTypeName'],
            "DepartmentName": this.documentMasterData[i]['DepartmentName_English'],
            "DocumentName": this.documentMasterData[i]['DocumentName'],
            "IsCompulsory": this.documentMasterData[i]['Compulsory'],
            "Status": this.documentMasterData[i]['ActiveStatus'],
          })
        }

        let values: any;
        let privados = ['S.No.', "DocumentTypeName", "DepartmentName", "DocumentName", "IsCompulsory", "Status"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("Document Master", 100, 10, { align: 'center', maxWidth: 100 });

        autoTable(doc,
          {
            head: [header],
            body: values,
            styles: { fontSize: 8 },
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
            tableLineWidth: 0,

          }
        )

        doc.save("DocumentMaster" + '.pdf');

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
