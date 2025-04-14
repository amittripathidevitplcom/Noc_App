import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BTERApplicationOpensessionDataModel } from '../../../Models/BTERApplicationOpensessionMasterDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { UniversityMasterService } from '../../../Services/UniversityMaser/AddUniversity/university-master.service';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DTEAffiliationRegistrationService } from '../../../Services/DTEAffiliation/DTEAffiliationRegistration/dte-affiliation-registration.service';
@Injectable()

  @Component({
    selector: 'app-bterapplicationopensessionmaster',
    templateUrl: './bterapplicationopensessionmaster.component.html',
    styleUrls: ['./bterapplicationopensessionmaster.component.css']
  })
export class BTERApplicationopensessionmasterComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  ApplicationSessionMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public file: File = null;
  /*Save Data Model*/
  request = new BTERApplicationOpensessionDataModel();
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  public isDeleteButton: boolean = true;
  public CurrentPageName: any = "";
  public UserID: number = 0;
  public DepartmentList: any;
  public OpenApplicationSessionMasterData: any;
  public FinancialYearList: any;
  public isDisabledClient: boolean = true;
  public checked: boolean = true;
  searchText: string = '';
  public ActiveStatus: boolean = true;
  public is_disableDepartment: boolean = false;
  public MaxDate: Date = new Date();

  constructor(private universityMasterService: UniversityMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private clipboard: Clipboard, private dTEAffiliationregistrationService: DTEAffiliationRegistrationService) { }

  async ngOnInit() {
    this.ApplicationSessionMasterForm = this.formBuilder.group(
      {
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlApplicationSession: ['', [DropdownValidators]],
        StartDate: ['', Validators.required],
        EndDate: ['', Validators.required],
        chkActiveStatus: [''],
      }
    )

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    const ddlDepartmentID = document.getElementById('ddlDepartmentID')

    if (ddlDepartmentID) ddlDepartmentID.focus();


    this.GetDepartmentList();
    this.GetAllFinancialYear();
    //disable dropdown
    if (this.sSOLoginDataModel.DepartmentID != 0) {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.is_disableDepartment = true;
    }
    //get univercity
    this.GetAllOpenSessionApplicationList();

    this.ActiveStatus = true;
  }
  get form() { return this.ApplicationSessionMasterForm.controls; }

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
  async GetAllFinancialYear() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetAllFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.FinancialYearList = data['Data'];
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
  async GetAllOpenSessionApplicationList() {
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationregistrationService.GetAllOpenSessionApplicationList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.OpenApplicationSessionMasterData = data['Data'];
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
    if (this.ApplicationSessionMasterForm.invalid) {
      return
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.dTEAffiliationregistrationService.SaveDataBTERApplicationOpenSession(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetAllOpenSessionApplicationList();
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
    //this.request.DepartmentID = 0;
    this.request.ApplicationSession = 0;
    this.request.StartDate = '';
    this.request.EndDate = '';
    this.request.UserID = 0;
    this.request.ActiveStatus = false;
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }
  async Edit_OnClick(ID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.dTEAffiliationregistrationService.GetByID(ID, this.UserID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.request.ID = data['Data'][0]["ID"];
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.request.ApplicationSession = data['Data'][0]["ApplicationSession"];

          this.request.StartDate = data['Data'][0]["StartDate"];
          this.request.EndDate = data['Data'][0]["EndDate"];
          this.request.ActiveStatus = data['Data'][0]["ActiveStatus"];
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
  async Delete_OnClick(ID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.dTEAffiliationregistrationService.DeleteData(ID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllOpenSessionApplicationList();
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
    if (this.OpenApplicationSessionMasterData.length > 0) {
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
        XLSX.writeFile(wb, "UniversityMaster.xlsx");
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
    if (this.OpenApplicationSessionMasterData.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.OpenApplicationSessionMasterData.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "DepartmentName": this.OpenApplicationSessionMasterData[i]['DepartmentName'],
            "UniversityName": this.OpenApplicationSessionMasterData[i]['UniversityName'],
            "Status": this.OpenApplicationSessionMasterData[i]['ActiveDeactive'],
          })
        }

        let values: any;
        let privados = ['S.No.', "DepartmentName", "UniversityName", "Status"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("University Master", 100, 10, { align: 'center', maxWidth: 100 });

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

        doc.save("UniversityMaster" + '.pdf');

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



