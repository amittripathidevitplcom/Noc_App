import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { QualificationMasterPageService } from '../../../Services/Master/QualificationMaster/qualification-masterpage.service';
import { QualificationMasterDataModel } from '../../../Models/QualificationMasterDataModel';

import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-qualification-master',
  templateUrl: './qualification-master.component.html',
  styleUrls: ['./qualification-master.component.css']
})
export class QualificationMasterComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  QualificationMasterFormGroup!: FormGroup;
  public isValid: boolean = true;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DepartmentList: any = [];
  public QualificationMasterDataList: any = [];

  searchText: string = '';

  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;

  NoIsDocCompulsory: number = 0;

  public is_disableDepartment: boolean = false;
  request = new QualificationMasterDataModel();

  constructor(private clipboard: Clipboard, private qualificationMasterPageService: QualificationMasterPageService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {
  }

  async ngOnInit() {
   

    this.QualificationMasterFormGroup = this.formBuilder.group(
      {
        ddlDepartmentID: ['', [DropdownValidators]],
        rbIsDocCompulsory: [this.NoIsDocCompulsory],
        txtQualificationName: ['', Validators.required],
        txtOrderBy: ['0'],
        chkActiveStatus: [''],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetDepartmentList();
    //disable dropdown
    if (this.sSOLoginDataModel.DepartmentID != 0) {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.is_disableDepartment = true;
    }

    await this.GetQualificationMasterDataList();
  }
  get form() { return this.QualificationMasterFormGroup.controls; }

  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      // college status
      await this.commonMasterService.GetDepartmentMaster()
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

  async GetQualificationMasterDataList() {
    try {
      this.loaderService.requestStarted();
      await this.qualificationMasterPageService.GetQualificationMasterList(this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.QualificationMasterDataList = data['Data'][0]['data'];
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
    if (this.QualificationMasterFormGroup.invalid) {
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.qualificationMasterPageService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            //this.GetDepartmentList();
            this.GetQualificationMasterDataList();
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

  async Edit_OnClick(QualificationID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.qualificationMasterPageService.GetQualificationMasterIDWise(QualificationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.QualificationID = data['Data'][0]["QualificationID"];
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.request.QualificationName = data['Data'][0]["QualificationName"];
          this.request.IsDocCompulsory = data['Data'][0]["IsDocCompulsory"];
          this.request.Orderby = data['Data'][0]["Orderby"];
          this.request.ActiveStatus = data['Data'][0]["ActiveStatus"];
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

  async DelQualificationMasterDate(QualificationID: number) {
    
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.qualificationMasterPageService.DeleteData(QualificationID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetQualificationMasterDataList();
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
    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();
    this.isSubmitted = false;
    this.isDisabledDOJ = false;
    this.request.QualificationID = 0;
   // this.request.DepartmentID = 0;
    this.request.IsDocCompulsory = 0;
    this.request.Orderby = 0;
    this.request.QualificationName = '';
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
    if (this.QualificationMasterDataList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][5] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "QualificationMaster.xlsx");
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
    if (this.QualificationMasterDataList.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.QualificationMasterDataList.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "DepartmentName": this.QualificationMasterDataList[i]['DepartmentName_English'],
            "QualificationName": this.QualificationMasterDataList[i]['QualificationName'],
            "IsDocCompulsory": this.QualificationMasterDataList[i]['IsDocCompulsory'],
            "Orderby": this.QualificationMasterDataList[i]['Orderby'],
            "Status": this.QualificationMasterDataList[i]['ActiveDeactive']
          })
        }

        let values: any;
        let privados = ['S.No.', "DepartmentName", "QualificationName", "IsDocCompulsory", "Orderby","Status"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("Qualification Master", 100, 10, { align: 'center', maxWidth: 100 });

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

        doc.save("QualificationMaster" + '.pdf');

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


