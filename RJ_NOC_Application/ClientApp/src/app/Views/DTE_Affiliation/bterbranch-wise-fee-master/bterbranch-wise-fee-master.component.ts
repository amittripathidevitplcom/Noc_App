

import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { DTEAffiliationRegistrationDataModel, BTERFeeMasterDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationRegistration/DTEAffiliationRegistrationDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { min } from 'moment';
import { DTEAffiliationRegistrationService } from '../../../Services/DTEAffiliation/DTEAffiliationRegistration/dte-affiliation-registration.service';

@Injectable()
  @Component({
    selector: 'app-bterbranch-wise-fee-master',
    templateUrl: './bterbranch-wise-fee-master.component.html',
    styleUrls: ['./bterbranch-wise-fee-master.component.css']
  })
export class BTERBranchWiseFeeMasterComponent implements OnInit {
  BTERFeeMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new BTERFeeMasterDataModel();
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  public isDeleteButton: boolean = true;
  public UserID: number = 0;
  public DepartmentList: any;
  sSOLoginDataModel = new SSOLoginDataModel();
  searchText: string = '';
  public ActiveStatus: boolean = true;
  public isShowGrid: boolean = false;
  public is_disableDepartment: boolean = false;
  public BTERFeesList: any = [];
  constructor(private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private clipboard: Clipboard,private dTEAffiliationregistrationService: DTEAffiliationRegistrationService) { }
  async ngOnInit() {
    this.BTERFeeMasterForm = this.formBuilder.group(
      {
        ddlDepartmentID: ['', [DropdownValidators]],
        txtFeeType: ['', Validators.required],
        txtAmount: ['', Validators.required],
        chkActiveStatus: [''],
      }
    )
    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();
    await this.GetDepartmentList();
    //disable dropdown
    this.request.DepartmentID = 12;
    if (this.request.DepartmentID == 12) {
      this.is_disableDepartment = true;
    }
    else {
      this.is_disableDepartment = true;
    }
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ActiveStatus = true;
    this.GetAllBTERFeeList();
  }
  get form() { return this.BTERFeeMasterForm.controls; }

  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
          //this.request.CourseLevelID = 0;

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
  
  async GetAllBTERFeeList() {
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationregistrationService.GetAllBTERFeeList(this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.BTERFeesList = data['Data'][0]['data'];
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
    if (this.BTERFeeMasterForm.invalid) {
      return
    }

    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.dTEAffiliationregistrationService.BTERFeeSaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ResetControl();
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetAllBTERFeeList();
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
    // this.GetDepartmentList();
    //this.CourseLevelList = [];
    this.request.FeeType = '';
    this.request.Amount = null;
    this.request.FeeID = 0;
    this.request.UserID = 0;
    this.request.ActiveStatus = true;
    this.isDisabledGrid = false;
    this.isShowGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }
  async Edit_OnClick(FeeID: number) {

    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationregistrationService.GetBTERFeeByID(FeeID, this.UserID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.FeeID = data['Data'][0]["FeeID"];
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.request.FeeType = data['Data'][0]["FeeType"];
          this.request.Amount = data['Data'][0]["Amount"];
          this.request.ActiveStatus = data['Data'][0]["ActiveStatus"];
          this.isShowGrid = true;
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
  async Delete_OnClick(FeeID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.dTEAffiliationregistrationService.BTERDeleteData(FeeID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllBTERFeeList();
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
    if (this.BTERFeesList.length > 0) {
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
        XLSX.writeFile(wb, "LOIFeeMaster.xlsx");
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
    if (this.BTERFeesList.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.BTERFeesList.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "DepartmentName": this.BTERFeesList[i]['DepartmentName'],
            "FeeType": this.BTERFeesList[i]['FeeType'],
            "Amount": this.BTERFeesList[i]['Amount'],
            "Status": this.BTERFeesList[i]['ActiveDeactive']
          })
        }

        let values: any;
        let privados = ['S.No.', "DepartmentName", "FeeType", "Amount", "Status"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("LOI Fee Master", 100, 10, { align: 'center', maxWidth: 100 });


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
        doc.save("LOIFeeMaster" + '.pdf');
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


