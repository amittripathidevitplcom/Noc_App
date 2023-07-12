import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { RNCCheckListMasterService } from '../../../Services/Master/RNCCheckListMaster/rnccheck-list-master.service';
import { RNCCheckListMasterDataModel } from '../../../Models/RNCCheckListMasterDataModel';


import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';

@Component({
  selector: 'app-rnccheck-list-master',
  templateUrl: './rnccheck-list-master.component.html',
  styleUrls: ['./rnccheck-list-master.component.css']
})
export class RNCCheckListMasterComponent implements OnInit {

  RNCCheckListFormGroup!: FormGroup;

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public UserID: number = 0;
  public DepartmentList: any;
  public RNCCheckListMasterData: any = [];
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;



  request = new RNCCheckListMasterDataModel();

  constructor(private clipboard: Clipboard, private rNCCheckListMasterService: RNCCheckListMasterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {
  }

  async ngOnInit() {

    this.RNCCheckListFormGroup = this.formBuilder.group(
      {
        ddlDepartmentID: ['0', [DropdownValidators]],
        txtRNCCheckListName: ['', Validators.required],
        chkUploadFile: ['false'],
      })
    await this.GetDepartmentList();
    await this.GetRNCCheckListData();
  }
  get form() { return this.RNCCheckListFormGroup.controls; }

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

  async GetRNCCheckListData() {
    try {
      this.loaderService.requestStarted();
      await this.rNCCheckListMasterService.GetRNCCheckListData(this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RNCCheckListMasterData = data['Data'][0]['data'];
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
    if (this.RNCCheckListFormGroup.invalid) {
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.rNCCheckListMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GetRNCCheckListData();
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.DepartmentList();
            this.GetRNCCheckListData();
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

  async Edit_OnClick(RNCCheckListID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.rNCCheckListMasterService.GetByID(RNCCheckListID,this.UserID)
        .then((data: any) => {
          //this.GetUserPersonalDetail = data['Data'];

          //this.IsUserSelect = true;
          data = JSON.parse(JSON.stringify(data));
          this.request.RNCCheckListID = data['Data'][0]["RNCCheckListID"];
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.request.RNCCheckListName = data['Data'][0]["RNCCheckListName"];
          this.request.FileUpload = data['Data'][0]["FileUpload"];
          this.request.IsFileUpload = data['Data'][0]["IsFileUpload"];
          this.isDisabledGrid = true;
          this.isDisabledDOJ = true;

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

  async DelRNCCheckListDetail(RNCCheckListID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.rNCCheckListMasterService.DeleteData(RNCCheckListID,this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetRNCCheckListData();
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


  async ResetControl() {
    const ddlDistrictID = document.getElementById('ddlDistrictID')
    if (ddlDistrictID) ddlDistrictID.focus();
    this.isSubmitted = false;
    this.isDisabledDOJ = false;
    this.request.RNCCheckListID = 0;
    this.request.DepartmentID = 0;
    this.request.RNCCheckListName = '';
    this.request.FileUpload = false;
    this.request.ActiveStatus = true;
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
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
    if (this.RNCCheckListMasterData.length > 0) {
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
        XLSX.writeFile(wb, "RNCCheckListMaster.xlsx");
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
    if (this.RNCCheckListMasterData.length > 0) {
      try {

        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.RNCCheckListMasterData.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "DepartmentName": this.RNCCheckListMasterData[i]['DepartmentName_English'],
            "RNCCheckListName": this.RNCCheckListMasterData[i]['RNCCheckListName'],
            "FileUpload": this.RNCCheckListMasterData[i]['FileUpload']
          })
        }

        let values: any;
        let privados = ['S.No.', "DepartmentName", "RNCCheckListName", "FileUpload"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("RNC Check List Master", 100, 10, { align: 'center', maxWidth: 100 });

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

        doc.save("RNCCheckListMaster" + '.pdf');

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


