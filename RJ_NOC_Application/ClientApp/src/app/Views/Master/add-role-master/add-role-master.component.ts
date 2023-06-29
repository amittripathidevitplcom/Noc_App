import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AddRoleMasterService } from '../../../Services/Master/AddRoleMaster/add-role-master.service';
import { AddRoleMasterDataModel } from '../../../Models/AddRoleMasterDataModel';

import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';

@Component({
  selector: 'app-add-role-master',
  templateUrl: './add-role-master.component.html',
  styleUrls: ['./add-role-master.component.css']
})
export class AddRoleMasterComponent implements OnInit {

  AddRoleMasterFormGroup!: FormGroup;

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DistrictList: any = [];
  public AddRoleMasterList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;



  request = new AddRoleMasterDataModel();

  constructor(private clipboard: Clipboard, private addRoleMasterService: AddRoleMasterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {
  }

  async ngOnInit() {

    this.AddRoleMasterFormGroup = this.formBuilder.group(
      {
        txtRoleName: ['', Validators.required],
        chkActiveStatus: ['true'],
      })
    await this.GetAddRoleMasterList();
  }
  get form() { return this.AddRoleMasterFormGroup.controls; }



  async GetAddRoleMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.addRoleMasterService.GetList(this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AddRoleMasterList = data['Data'][0]['data'];
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
    if (this.AddRoleMasterFormGroup.invalid) {
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.addRoleMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetAddRoleMasterList();
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

  async Edit_OnClick(RoleID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.addRoleMasterService.GetByID(RoleID, this.UserID)
        .then((data: any) => {
          //this.GetUserPersonalDetail = data['Data'];

          //this.IsUserSelect = true;
          data = JSON.parse(JSON.stringify(data));
          this.request.RoleID = data['Data'][0]["RoleID"];
          this.request.RoleName = data['Data'][0]["RoleName"];
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
  async DelAddRoleMasterDetail(RoleID: number) {
    
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.addRoleMasterService.DeleteData(RoleID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAddRoleMasterList();
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
    const txtRoleName = document.getElementById('txtRoleName')
    if (txtRoleName) txtRoleName.focus();
    this.isSubmitted = false;
    this.isDisabledDOJ = false;
    this.request.RoleID = 0;
    this.request.RoleName = '';
    this.request.ActiveStatus = true;
    this.request.UserID = 0;
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
    if (this.AddRoleMasterList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][3] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "AddRoleMaster.xlsx");
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
    if (this.AddRoleMasterList.length > 0) {
      try {


        //let doc = new jsPDF('p', 'mm', [432, 279])
        //doc.setFontSize(16);
        //doc.text("College Wise Course", 100, 10, { align: 'center', maxWidth: 100 });
        //autoTable(doc, {
        //  html: '#tabellist'
        //  , styles: { fontSize: 8 },
        //  headStyles: {
        //    fillColor: '#3f51b5',
        //    textColor: '#fff',
        //    halign: 'center'
        //  },
        //  bodyStyles: {
        //    halign: 'center'
        //  },
        //  margin: {
        //    left: 5,
        //    right: 5,
        //    top: 15
        //  },
        //  tableLineWidth: 0
        //})
        //or
        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.AddRoleMasterList.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "RoleName": this.AddRoleMasterList[i]['RoleName'],
            "Status": this.AddRoleMasterList[i]['ActiveDeactive']
          })
        }

        let values: any;
        let privados = ['S.No.', "RoleName", "Status"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("Add Role Master", 100, 10, { align: 'center', maxWidth: 100 });

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

        doc.save("AddRoleMaster" + '.pdf');

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

