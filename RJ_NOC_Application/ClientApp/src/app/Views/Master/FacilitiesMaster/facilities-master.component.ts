import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { FacilitiesMaserService } from '../../../Services/Master/FacilitiesMaster/facilities-master.service'
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilitiesMasterDataModel } from '../../../Models/FacilitiesMasterDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
@Injectable()
@Component({
  selector: 'app-facilities-master',
  templateUrl: './facilities-master.component.html',
  styleUrls: ['./facilities-master.component.css']
})
export class FacilitiesComponent implements OnInit {
  FacilitiesMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public file: File = null;
  /*Save Data Model*/
  request = new FacilitiesMasterDataModel();
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  public isDeleteButton: boolean = true;
  public CurrentPageName: any = "";
  public UserID: number = 0;
  public DepartmentList: any;
  public FacilitiesMasterData: any; 
  public isDisabledClient: boolean = true; 
  searchText: string = '';
  public ActiveStatus: boolean = true; 
  constructor(private facilitiesMaserService: FacilitiesMaserService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private clipboard: Clipboard) { }

  async ngOnInit() {
    this.FacilitiesMasterForm = this.formBuilder.group(
      {       
        ddlDepartmentID: ['', [DropdownValidators]],
        txtFacilitiesName: ['', Validators.required],
        chkActiveStatus: [''],
        MinSize: ['', [Validators.required, Validators.min(1)]],
        txtUnit: ['', Validators.required],
      }
    )
    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();    
    this.GetDepartmentList();
    this.GetAllFacilitiesMasterList();
    this.ActiveStatus = true;
  }
  get form() { return this.FacilitiesMasterForm.controls; } 
  async GetDepartmentList() {
    try
    {
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
  async GetAllFacilitiesMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.facilitiesMaserService.GetAllFacilitiesMasterList(this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.FacilitiesMasterData = data['Data'][0]['data'];
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
    if (this.FacilitiesMasterForm.invalid) {
      return;
    }
    if (this.request.MinSize <= 0) {
      return;
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.facilitiesMaserService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetAllFacilitiesMasterList();
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
    this.request.FID = 0;   
    this.request.DepartmentID = 0;
    this.request.FacilitiesName = '';
    this.request.MinSize = 0.00;
    this.request.Unit = '';
    this.request.UserID = 0;
    this.request.ActiveStatus = true;
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }
  async Edit_OnClick(FID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.facilitiesMaserService.GetByID(FID, this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.FID = data['Data'][0]["FID"];         
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.request.FacilitiesName = data['Data'][0]["FacilitiesName"];
          this.request.MinSize = data['Data'][0]["MinSize"];
          this.request.Unit = data['Data'][0]["Unit"];
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
  async Delete_OnClick(FID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.facilitiesMaserService.DeleteData(FID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllFacilitiesMasterList();
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
    if (this.FacilitiesMasterData.length > 0) {
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
        XLSX.writeFile(wb, "FacilitiesMaster.xlsx");
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
    if (this.FacilitiesMasterData.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.FacilitiesMasterData.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "DepartmentName": this.FacilitiesMasterData[i]['DepartmentName'],
            "FacilitiesName": this.FacilitiesMasterData[i]['FacilitiesName'],
            "MinSize": this.FacilitiesMasterData[i]['MinSize'],
            "Unit": this.FacilitiesMasterData[i]['Unit'],
            "Status": this.FacilitiesMasterData[i]['ActiveDeactive'],
          })
        }

        let values: any;
        let privados = ['S.No.', "DepartmentName", "FacilitiesName", "MinSize", "Unit", "Status"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("Facilities Master", 100, 10, { align: 'center', maxWidth: 100 });

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

        doc.save("FacilitiesMaster" + '.pdf');

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
    var regex = new RegExp("^[a-zA-Z. ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
}

