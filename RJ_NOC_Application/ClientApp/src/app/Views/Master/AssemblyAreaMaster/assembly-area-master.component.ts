import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { AssemblyAreaMasterService } from '../../../Services/Master/AssemblyAreaMaster/assembly-area-master.service';
import { AssemblyAreaDataModel } from '../../../Models/AssemblyAreaDataModel';


import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';

@Component({
  selector: 'app-assembly-area-master',
  templateUrl: './assembly-area-master.component.html',
  styleUrls: ['./assembly-area-master.component.css']
})
export class AssemblyAreaMasterComponent implements OnInit {

  AssemblyAreaFormGroup!: FormGroup;

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DistrictList: any = [];
  public AssemblyAreaList: any = [];
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;



  request = new AssemblyAreaDataModel();

  constructor(private clipboard: Clipboard, private assemblyAreaMasterService: AssemblyAreaMasterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {
  }

  async ngOnInit() {

    this.AssemblyAreaFormGroup = this.formBuilder.group(
      {
        ddlDistrictID: ['0', [DropdownValidators]],
        txtAssemblyAreaName: ['', Validators.required],
        chkActiveStatus: ['true'],
      })
    await this.GetDistrictList();
    await this.GetAssemblyAreaList();
  }
  get form() { return this.AssemblyAreaFormGroup.controls; }

  async GetDistrictList() {
    try {
      this.loaderService.requestStarted();;
      // college status
      await this.commonMasterService.GetDistrictList()
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

  async GetAssemblyAreaList() {
    try {
      this.loaderService.requestStarted();
      await this.assemblyAreaMasterService.GetList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AssemblyAreaList = data['Data'][0]['data'];
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
    if (this.AssemblyAreaFormGroup.invalid) {
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.assemblyAreaMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetDistrictList();
            this.GetAssemblyAreaList();
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

  async Edit_OnClick(AssemblyAreaID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.assemblyAreaMasterService.GetByID(AssemblyAreaID)
        .then((data: any) => {
          //this.GetUserPersonalDetail = data['Data'];

          //this.IsUserSelect = true;
          data = JSON.parse(JSON.stringify(data));
          this.request.AssemblyAreaID = data['Data'][0]["AssemblyAreaID"];
          this.request.DistrictID = data['Data'][0]["DistrictID"];
          this.request.AssemblyAreaName = data['Data'][0]["AssemblyAreaName"];
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

  async DelAssemblyDetail(AssemblyAreaID: number) {
    
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.assemblyAreaMasterService.DeleteData(AssemblyAreaID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAssemblyAreaList();
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
    this.request.AssemblyAreaID = 0;
    this.request.DistrictID = 0;
    this.request.AssemblyAreaName = '';
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
    if (this.AssemblyAreaList.length > 0) {
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
        XLSX.writeFile(wb, "AssemblyAreaMaster.xlsx");
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
    if (this.AssemblyAreaList.length > 0) {
      try {

        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.AssemblyAreaList.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "DistrictName": this.AssemblyAreaList[i]['District_Eng'],
            "AssemblyAreaName": this.AssemblyAreaList[i]['AssemblyAreaName'],
            "Status": this.AssemblyAreaList[i]['ActiveStatus']
          })
        }

        let values: any;
        let privados = ['S.No.', "DistrictName", "AssemblyAreaName","Status"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("Assembly Area Master", 100, 10, { align: 'center', maxWidth: 100 });

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

        doc.save("AssemblyAreaMaster" + '.pdf');

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

