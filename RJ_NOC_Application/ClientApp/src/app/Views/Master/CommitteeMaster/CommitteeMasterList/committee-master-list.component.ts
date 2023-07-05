import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommitteeMasterService } from '../../../../Services/Master/CommitteeMaster/committee-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommitteeMasterDataModel } from '../../../../Models/CommitteeMasterDataModel';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';
import { debug } from 'console';

@Component({
  selector: 'app-committee-master-list',
  templateUrl: './committee-master-list.component.html',
  styleUrls: ['./committee-master-list.component.css']
})
export class CommitteeMasterListComponent implements OnInit {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public CommitteeMasterList: any = [];
  request = new CommitteeMasterDataModel();
  searchText: string = '';
  public isLoadingExport: boolean = false;
  constructor(private clipboard: Clipboard, private loaderService: LoaderService, private toastr: ToastrService,
    private committeeMasterService: CommitteeMasterService, private routers: Router) { }

  ngOnInit(): void {
    this.GetCommitteeMasterList(0);
  }

  async GetCommitteeMasterList(CommitteeMasterID: number) {
    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetCommitteeMasterList(CommitteeMasterID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CommitteeMasterList = data['Data'];
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
  async DelCommitteeMasterDetail(CommitteeMasterID: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.committeeMasterService.DeleteCommitteeData(CommitteeMasterID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetCommitteeMasterList(0);
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

  async OpenCommitteeMasterDetailsModel(CommitteeMasterID: number) {
    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetCommitteeMasterList(CommitteeMasterID)
        .then((data: any) => {
          this.request = data['Data'][0];
          const display = document.getElementById('CommitteeMasterDetails')
          if (display) display.style.display = "block";
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  CloseCommitteeMasterDetailsModel() {
    const display = document.getElementById('CommitteeMasterDetails');
    if (display) display.style.display = 'none';
  }
  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {

      this.clipboard.copy(tabellist.innerText);
    }
  }
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.CommitteeMasterList.length > 0) {
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
        XLSX.writeFile(wb, "CommitteeMaster.xlsx");
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
    if (this.CommitteeMasterList.length > 0) {
      try {

        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.CommitteeMasterList.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "CommitteeType": this.CommitteeMasterList[i]['CommitteeType'],
            "CommitteeName": this.CommitteeMasterList[i]['CommitteeName'],
            "ContactNumber": this.CommitteeMasterList[i]['ContactNumber']
          })
        }

        let values: any;
        let privados = ['S.No.', "CommitteeType", "CommitteeName", "ContactNumber"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));
        doc.setFontSize(16);
        doc.text("Committee Master", 100, 10, { align: 'center', maxWidth: 100 });

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

        doc.save("CommitteMaster" + '.pdf');

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
