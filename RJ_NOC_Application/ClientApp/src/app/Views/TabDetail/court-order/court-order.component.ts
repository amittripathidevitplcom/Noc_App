import {  Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CourtOrderDataModel, CourtOrderSearchFilterDataModel } from '../../../Models/TabDetailDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { CourtOrderService } from '../../../Services/Tabs/court-order.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { Clipboard } from '@angular/cdk/clipboard';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-court-order',
  templateUrl: './court-order.component.html',
  styleUrls: ['./court-order.component.css']
})
export class CourtOrderComponent {
  isSubmitted: boolean = false;
  courtOrderForm!: FormGroup;
  request = new CourtOrderDataModel();
  searchrequest = new CourtOrderSearchFilterDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public courtOrderList: any = [];
  file: File | any = null;
  public UserID: number = 0;
  public isLoadingExport: boolean = false;
  public downloadingPDF: boolean = false;
  searchText: string = '';
  public isFormValid: boolean = false;
  public fileValidationMessage: string = '';

  public isPrint: boolean = true;
  public CurrentPageName: any = "";
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  isUploadImage: boolean = false;
  public MaxDate: Date = new Date();

  sSOLoginDataModel = new SSOLoginDataModel();
  public SearchRecordID: string = '';

  constructor(private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute,
    private routers: Router, private courtOrderService: CourtOrderService, private clipboard: Clipboard) {
    this.courtOrderForm = this.formBuilder.group(
      {
        txtOrderDate: ['', Validators.required],
        txtOrderName: ['', Validators.required],
        OrderDocumentName: [''],
      })
  }


  async ngOnInit(): Promise<void> {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SelectedCollageID = data['Data']['CollegeID'];
          if (this.SelectedCollageID == null || this.SelectedCollageID == 0 || this.SelectedCollageID == undefined) {
            this.routers.navigate(['/statisticscollegelist']);
          }
        }, error => console.error(error));
    }
    else {
      this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    }

   

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.GetAllCourOrderList();
  }

  get form() { return this.courtOrderForm.controls; }
  async SaveData() {
    this.isSubmitted = true;
    if (this.request.OrderDocumentName == null || this.request.OrderDocumentName == '') {
      this.fileValidationMessage = 'This field is required .!';
      return
    }
    
    this.request.DepartmentID = this.SelectedDepartmentID;
    this.request.CollegeID = this.SelectedCollageID;
    this.request.UserID = this.sSOLoginDataModel.UserID;

    if (this.courtOrderForm.invalid) {
      return;
    }
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.courtOrderService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage);
            this.ResetControl();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.isSubmitted = false;
        this.loaderService.requestEnded();
      }, 200);
    }


  }

  async ValidateUploadImage(event: any, Type: string) {
    try {
      this.fileValidationMessage = '';
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (Type == 'FileUpload') {
          if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'application/pdf') {
            //size validation
            if (this.file.size > 2000000) {
              this.fileValidationMessage = 'Select less then 2MB File';
              this.toastr.error('Select less then 2MB File')
              this.request.OrderDocumentName = '';
              this.request.OrderDocumentNamePath = '';
              this.request.OrderDocumentName_DisName = '';
              return
            }
            else if (this.file.size < 499000) {
              this.fileValidationMessage = 'Select more then 499kb File';
              this.toastr.error('Select more then 499kb File')
              this.request.OrderDocumentName = '';
              this.request.OrderDocumentNamePath = '';
              this.request.OrderDocumentName_DisName = '';
              return
            }

            await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              if (this.State == 0) {
                if (Type == 'FileUpload') {
                  this.request.OrderDocumentName = data['Data'][0]["FileName"];
                  this.request.OrderDocumentName_DisName = data['Data'][0]["Dis_FileName"];
                  this.request.OrderDocumentNamePath = data['Data'][0]["FilePath"];                 
                }
              }
              if (this.State == 1) {
                this.toastr.error(this.ErrorMessage)
              }
              else if (this.State == 2) {
                this.toastr.warning(this.ErrorMessage)
              }
            });
            this.file = document.getElementById('OrderDocumentName');
            this.file.value = '';
          }
          else {
            this.toastr.warning('Select Only jpg/jpeg/pdf');
            // type validation
            this.fileValidationMessage='Select Only jpg/jpeg/pdf';
            return
          }
        }
      }
      
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
    this.file = document.getElementById('OrderDocument');
    this.file.value = '';

  }
  async DeleteImage(file: string) {
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        // delete from server folder
        await this.fileUploadService.DeleteDocument(file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.request.OrderDocumentName = '';
            this.request.OrderDocumentNamePath = '';
            this.request.OrderDocumentName_DisName = '';
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
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
  async ResetControl() {
    try {
      this.loaderService.requestStarted();
      const txtOrderName = document.getElementById('txtOrderName')
      if (txtOrderName) txtOrderName.focus();
      this.isSubmitted = false;
      this.request.CourtOrderID = 0;
      this.searchrequest.CourtOrderID = 0;
      this.request.OrderName = '';
      this.request.OrderDate = '';
      this.request.OrderDocumentName = '';
      this.request.OrderDocumentNamePath = '';
      this.request.OrderDocumentName_DisName = '';

      const btnSave = document.getElementById('btnSave')
      if (btnSave) btnSave.innerHTML = "Save";
      const btnReset = document.getElementById('btnReset')
      if (btnReset) btnReset.innerHTML = "Reset";
      this.GetAllCourOrderList();
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async GetAllCourOrderList() {

    try {
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = this.SelectedDepartmentID;
      this.searchrequest.CollegeID = this.SelectedCollageID;
      this.searchrequest.UserID = this.sSOLoginDataModel.UserID;
      
      await this.courtOrderService.GetCourtOrderData(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.courtOrderList = data['Data'][0]['data'];
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
  async Edit_OnClick(CourtOrderID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = this.SelectedDepartmentID;
      this.searchrequest.CollegeID = this.SelectedCollageID;
      this.searchrequest.UserID = this.sSOLoginDataModel.UserID;
      this.searchrequest.CourtOrderID = CourtOrderID;

      await this.courtOrderService.GetCourtOrderData(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'][0]['data'][0];
          
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
  async Delete_OnClick(CourtOrderID: number) {

    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.courtOrderService.Delete(CourtOrderID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllCourOrderList();
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
    if (this.courtOrderList.length > 0) {
      try {
        this.isLoadingExport = true;
        this.downloadingPDF = true;
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
        XLSX.writeFile(wb, "CourtOrder.xlsx");
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
    this.downloadingPDF = true;
    this.loaderService.requestStarted();
    if (this.courtOrderList.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);

        doc.text("Court Order List", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("CourtOrderList" + '.pdf');
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
