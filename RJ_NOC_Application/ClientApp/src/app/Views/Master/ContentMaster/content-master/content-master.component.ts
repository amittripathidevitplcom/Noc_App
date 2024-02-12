import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentMasterDataModel } from '../../../../Models/ContentMasterDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { ContentMasterService } from '../../../../Services/Master/ContentMaster/content-master.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import * as XLSX from 'xlsx';
import { Clipboard } from '@angular/cdk/clipboard';
import autoTable from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-content-master',
  templateUrl: './content-master.component.html',
  styleUrls: ['./content-master.component.css']
})
export class ContentMasterComponent implements OnInit {

  sSOLoginDataModel = new SSOLoginDataModel();
  ContentMasterForm!: FormGroup;
  request = new ContentMasterDataModel();


  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public DepartmentList: any;
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public isValidDocument: boolean = false;
  public UserID: number = 0;
  public ContentMasterData: any;
  public isDisabledGrid: boolean = false;
  public isLoadingExport: boolean = false;
  searchText: string = '';
  public is_disableDepartment: boolean = false;

  constructor(private loaderService: LoaderService, private contentMasterService: ContentMasterService, private toastr: ToastrService, private commonMasterService: CommonMasterService, private formBuilder: FormBuilder, private clipboard: Clipboard) { }

  async ngOnInit() {


    this.ContentMasterForm = this.formBuilder.group({

      ddlDepartmentID: ['',[DropdownValidators]],
      txtContent: ['', [Validators.required]],
      chkStatus: [''],


    })

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();

     this.GetDepartmentList();

    if (this.sSOLoginDataModel.DepartmentID != 0) {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.is_disableDepartment = true;
    }

    await this.GetContentMasterList();
  }

 


  get form() { return this.ContentMasterForm.controls; }

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

  async GetContentMasterList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.contentMasterService.GetContentMasterList(this.UserID, this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ContentMasterData = data['Data'][0]['data'];
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
    debugger;
    this.isSubmitted = true;
    if (this.ContentMasterForm.invalid) {
      return;
    }
    //if (this.request.EndDate <= ) {
    //  return;
    //}
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.contentMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetContentMasterList();

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
    try {
      this.loaderService.requestStarted();
      const Content = document.getElementById('Content')
      if (Content) Content.focus();
      this.isSubmitted = false;
      this.request.ID = 0;
      // this.request.DepartmentID = 0;
      this.request.Content = '';
      this.request.Status = false;
      this.request.ActiveStatus = true;
      this.isDisabledGrid = false;


      const btnSave = document.getElementById('btnSave')
      if (btnSave) btnSave.innerHTML = "<i class='fa fa-plus'></i> Add &amp; Save";
      const btnReset = document.getElementById('')
      if (btnReset) btnReset.innerHTML = "Reset";
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

  async Edit_OnClick(ID: number) {
    debugger;
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.contentMasterService.GetContentMasterIDWise(ID, this.UserID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.request.ID = data['Data'][0]["ID"];
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.request.Content = data['Data'][0]["Content"];
          this.request.Status = data['Data'][0]["Status"];
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
        await this.contentMasterService.DeleteData(ID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetContentMasterList();
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


  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {

      this.clipboard.copy(tabellist.innerText);
    }
  }

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.ContentMasterData.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        //ws['!cols'] = [];
        //ws['!cols'][0] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "ContentMaster.xlsx");
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

  btnSavePDF_Click(): void {
    this.loaderService.requestStarted();
    if (this.ContentMasterData.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("ContentMaster", 100, 10, { align: 'center', maxWidth: 100 });
        autoTable(doc, {
          html: '#tabellist'
          , styles: { fontSize: 8 },
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
          tableLineWidth: 0
        })
        doc.save("ContentMaster" + '.pdf');

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
