import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { NewsUpdateMasterDataModel } from '../../../../Models/NewsUpdateMasterDataModel';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';
import * as XLSX from 'xlsx';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import jsPDF from 'jspdf';
import { NewsUpdateMasterService } from '../../../../Services/Master/NewsUpdateMaster/news-update-master.service';
import autoTable from 'jspdf-autotable';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-news-update-master',
  templateUrl: './news-update-master.component.html',
  styleUrls: ['./news-update-master.component.css']
})
export class NewsUpdateMasterComponent implements OnInit {

  sSOLoginDataModel = new SSOLoginDataModel();
  NewsUpdateMasterForm!: FormGroup;
  request = new NewsUpdateMasterDataModel();
 
  public file: any = '';
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public DepartmentList: any;
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public isValidDocument: boolean = false;
  public StartYear: number = 0;
  public EndMinDate: Date = new Date;
  public YearData: any = [];
  public MaxDate: Date = new Date();
  public NewsUpdateMasterData: any;
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isLoadingExport: boolean = false;
  public is_disableDepartment: boolean = false;
  public ActiveStatus: boolean = true;

  public StartDate: Date = new Date();
  public maxDate: Date = new Date();

  constructor(private loaderService: LoaderService, private newsupdateMasterService: NewsUpdateMasterService, private commonMasterService: CommonMasterService, private toastr: ToastrService, private formBuilder: FormBuilder, private clipboard: Clipboard) { }


  async ngOnInit() {

  

    this.NewsUpdateMasterForm = this.formBuilder.group({

      ddlDepartmentID: ['', [DropdownValidators]],
      txtTitle: ['', [Validators.required]],
      txtContent: ['', [Validators.required]],
      txtOrderBy: ['', [Validators.required]],
      dtStartDate: ['', [Validators.required]],
      dtEndDate: ['', [Validators.required, this.endDateValidator.bind(this)]],
      ckIsNew: [''],
      chkActiveStatus: [''],


    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();


     this.GetDepartmentList();
    if (this.sSOLoginDataModel.DepartmentID != 0) {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.is_disableDepartment = true;
    }

    await this.GetNewsUpdateMasterList();
   // this.ActiveStatus = true;
  }

  get form() { return this.NewsUpdateMasterForm.controls; }

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



  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  btnSavePDF_Click(): void {
    this.loaderService.requestStarted();
    if (this.NewsUpdateMasterData.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("NewsUpdateMaster", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("NewsUpdateMaster" + '.pdf');

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

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.NewsUpdateMasterData.length > 0) {
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
        XLSX.writeFile(wb, "NewsUpdateMaster.xlsx");
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




  async GetNewsUpdateMasterList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.newsupdateMasterService.GetNewsUpdateMasterList(this.UserID, this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.NewsUpdateMasterData = data['Data'][0]['data'];
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
    if (this.NewsUpdateMasterForm.invalid) {
      return;
    }
    //if (this.request.EndDate <= ) {
    //  return;
    //}
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.newsupdateMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetNewsUpdateMasterList();
           
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


  async Edit_OnClick(ID: number) {
    debugger;
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.newsupdateMasterService.GetNewsUpdateMasterIDWise(ID, this.UserID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.request.ID = data['Data'][0]["ID"];
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.request.TitleEnglish = data['Data'][0]["TitleEnglish"];
          this.request.Content = data['Data'][0]["Content"];
          this.request.OrderBy = data['Data'][0]["OrderBy"];
          this.request.IsNew = data['Data'][0]["IsNew"];
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

  async ResetControl() {
    try {
      this.loaderService.requestStarted();
      const txtTitle = document.getElementById('txtTitle')
      if (txtTitle) txtTitle.focus();
      this.isSubmitted = false;
      this.request.ID = 0;
     // this.request.DepartmentID = 0;
      this.request.TitleEnglish = '';
      this.request.Content = '';
      this.request.OrderBy = '';
      this.request.IsNew = false;
      this.request.StartDate = '';
      this.request.EndDate = '';
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

  async Delete_OnClick(ID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.newsupdateMasterService.DeleteData(ID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetNewsUpdateMasterList();
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

//  endDateValidator(control: AbstractControl): ValidationErrors | null {
//  if(this.NewsUpdateMasterForm && this.NewsUpdateMasterForm.get('dtStartDate')) {
//  const startDate = this.NewsUpdateMasterForm.get('dtStartDate').value;
//  const endDate = control.value;

//    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
//    return { endDateInvalid: true };
//  }
//}

//return null;
//  }

  endDateValidator(control: AbstractControl): ValidationErrors | null {
    if (this.NewsUpdateMasterForm && this.NewsUpdateMasterForm.get('dtStartDate')) {
      const startDate = this.NewsUpdateMasterForm.get('dtStartDate').value;
      const endDate = control.value;

      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        return { endDateInvalid: true };
      }
    }

    return null;
  }


}


