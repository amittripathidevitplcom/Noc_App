import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../.././Services/CommonMaster/common-master.service';
import { LandAreaSituatedMasterService } from '../../../../Services/LandAreaSituatedMaser/LandAreaSituated/landAreaSituated-master.service'
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandAreaSituatedMasterDataModel } from '../../../../Models/LandAreaSituatedMasterDataModel ';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-land-area-situated',
  templateUrl: './land-area-situated.component.html',
  styleUrls: ['./land-area-situated.component.css']
})
export class LandAreaSituatedComponent implements OnInit {
  LandAreaSituatedMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public file: File = null;

  /*Save Data Model*/
  request = new LandAreaSituatedMasterDataModel();
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  public isDeleteButton: boolean = true;
  public CurrentPageName: any = "";
  public UserID: number = 0;
  public DepartmentList: any;
  public LandAreaSituatedMasterData: any;
  public DistrictList: any;
  public StateList: any;
  public isDisabledClient: boolean = true;
  public checked: boolean = true;
  searchText: string = '';
  public ActiveStatus: boolean = true;
  constructor(private landAreaSituatedMasterService: LandAreaSituatedMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private clipboard: Clipboard) { }

  async ngOnInit() {
    this.LandAreaSituatedMasterForm = this.formBuilder.group(
      {
        ddlStateID: ['', [DropdownValidators]],
        ddlDistrictID: ['', [DropdownValidators]],
        ddlDepartmentID: ['', [DropdownValidators]],
        txtLandAreaSituatedName: ['', [Validators.required]],
        chkActiveStatus: [''],
      }
    )
    const ddlStateID = document.getElementById('ddlStateID')
    if (ddlStateID) ddlStateID.focus();
    this.GetStateList();
    this.GetDistrictList();
    this.GetDepartmentList();
    this.GetAlllandAreaSituatedMasterList();
    this.ActiveStatus = true;
  }
  get form() { return this.LandAreaSituatedMasterForm.controls; }
  async GetStateList() {
    try {
      this.loaderService.requestStarted();
      await this.landAreaSituatedMasterService.GetStateList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StateList = data['Data'];

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
  async GetDistrictList() {
    try {
      this.loaderService.requestStarted();
      await this.landAreaSituatedMasterService.GetDistrictList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DistrictList = data['Data'];

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
  async GetAlllandAreaSituatedMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.landAreaSituatedMasterService.GetAlllandAreaSituatedMasterList(this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.LandAreaSituatedMasterData = data['Data'][0]['data'];
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
    if (this.LandAreaSituatedMasterForm.invalid) {
      return
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.landAreaSituatedMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetAlllandAreaSituatedMasterList();
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
  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  async ResetControl() {
    const ddlStateID = document.getElementById('ddlStateID')
    if (ddlStateID) ddlStateID.focus();
    this.isSubmitted = false;
    this.request.LandAreaID = 0;
    this.request.StateID = 0;
    this.request.DistrictID = 0;
    this.request.DepartmentID = 0;
    this.request.LandAreaName = '';
    this.request.UserID = 0;
    this.request.ActiveStatus = false;
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }
  async Edit_OnClick(LandAreaID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.landAreaSituatedMasterService.GetByID(LandAreaID, this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.LandAreaID = data['Data'][0]["LandAreaID"];
          this.request.StateID = data['Data'][0]["StateID"];
          this.request.DistrictID = data['Data'][0]["DistrictID"];
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.request.LandAreaName = data['Data'][0]["LandAreaName"];
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
  async Delete_OnClick(LandAreaID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.landAreaSituatedMasterService.DeleteData(LandAreaID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAlllandAreaSituatedMasterList();
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
    if (this.LandAreaSituatedMasterData.length > 0) {
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
        XLSX.writeFile(wb, "LandAreaSituatedMaster.xlsx");
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
    if (this.LandAreaSituatedMasterData.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.LandAreaSituatedMasterData.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "StateName": this.LandAreaSituatedMasterData[i]['StateName'],
            "DistrictName": this.LandAreaSituatedMasterData[i]['DistrictName'],
            "DepartmentName": this.LandAreaSituatedMasterData[i]['DepartmentName'],
            "LandAreaName": this.LandAreaSituatedMasterData[i]['LandAreaName'],
            "Status": this.LandAreaSituatedMasterData[i]['ActiveDeactive'],
          })
        }

        let values: any;
        let privados = ['S.No.', "StateName", "DistrictName", "DepartmentName", "LandAreaName", "Status"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("LandArea Situated Master", 100, 10, { align: 'center', maxWidth: 100 });

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

        doc.save("LandAreaSituatedMaster" + '.pdf');

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
