import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OtherInformationMasterDataModel } from '../../../../Models/OtherInformationMasterDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { OtherInformationMasterService } from '../../../../Services/Master/OtherInformationMaster/other-information-master.service';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { FileUploadService } from '../../../../Services/FileUpload/file-upload.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import autoTable from 'jspdf-autotable';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';

@Injectable()
@Component({
  selector: 'app-other-information-master',
  templateUrl: './other-information-master.component.html',
  styleUrls: ['./other-information-master.component.css']
})
export class OtherInformationMasterComponent implements OnInit {

  sSOLoginDataModel = new SSOLoginDataModel();
  OtherInformationMasterForm!: FormGroup;
  request = new OtherInformationMasterDataModel();

  public file: any = '';
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public DepartmentList: any;
  public is_disableDepartment: boolean = false;
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public isValidDocument: boolean = false;
  public ImageValidationMessage: string = '';
  searchText: string = '';
  public isLoadingExport: boolean = false;
  public OtherInformationMasterList: any;
  public TypeList: any = [];
  public UserID: number = 0;
  public isDisabledGrid: boolean = false;
 

  constructor(private loaderService: LoaderService, private otherInformationMasterService: OtherInformationMasterService, private toastr: ToastrService, private commonMasterService: CommonMasterService, private formBuilder: FormBuilder, private fileUploadService: FileUploadService, private _fb: FormBuilder, private clipboard: Clipboard) { }

  async ngOnInit() {

    this.OtherInformationMasterForm = this.formBuilder.group(
      {
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlType: [''],
        txtName: ['', [Validators.required]],
        WidthMin: ['', [Validators.required, Validators.min(1)]],
        LengthMin: ['', [Validators.required, Validators.min(1)]],
        NumberOfRoom: ['', [Validators.required, Validators.min(1)]],
        fAnnexurePathFile: [''],
        fAnnexurePath2File: [''],
        chkActiveStatus: ['']
      }
    );

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();

    await this.GetDepartmentList();
    if (this.sSOLoginDataModel.DepartmentID != 0) {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.Departmentwise_Type(null, this.request.DepartmentID);
      this.is_disableDepartment = true;
    }

   

    await this.GetOtherInformationMasterList();
   // await this.Departmentwise_Type(null, this.request.DepartmentID);
  } 

  get form() { return this.OtherInformationMasterForm.controls; } 


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


  async Departmentwise_Type(event: any, SelectedValueDepartment: any) {
   // debugger;
    this.request.DepartmentID = SelectedValueDepartment;
    this.TypeList = [];
    try {
      this.loaderService.requestStarted();
      await this.otherInformationMasterService.GetOtherInformationMasterList_DepartmentAndTypeWise(this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TypeList = data['Data'];
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
    if (this.OtherInformationMasterForm.invalid) {
      return;
    }
    if (this.request.Type == '') {
      return;
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.otherInformationMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // get saved society
            this.GetOtherInformationMasterList();
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
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  DeleteImage(Type: string) {
    this.ResetFileAndValidation(Type, '', '', '', false);
  }

  ResetFileAndValidation(type: string, name: string, dis_name: string, path: string, isShowFile: boolean) {
    //event.target.value = '';
    try {
      this.loaderService.requestStarted();

      if (type == 'AnnexurePath' || type == 'All') {
        this.isValidDocument = isShowFile;
        this.request.AnnexurePath = name;
        this.request.Dis_AnnexurePath = dis_name;
        this.request.AnnexurePath = path;
        this.file = document.getElementById('fAnnexurePathFile');
        this.file.value = '';
      }
      else if (type == 'AnnexurePath2') {
        this.isValidDocument = isShowFile;
        this.request.AnnexurePath2 = name;
        this.request.Dis_AnnexurePath2 = dis_name;
        this.request.AnnexurePath = path;
        this.file = document.getElementById('fAnnexurePath2File');
        this.file.value = '';

      }

    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }



  async ValidatePdf(event: any, Type: string) {

    try {
      this.loaderService.requestStarted();
      this.isValidDocument = false;

      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'application/pdf') {
          if (event.target.files[0].size > 2000000) {
            //event.target.value = '';
            this.ImageValidationMessage = 'Select less then 2MB File';
            this.ResetFileAndValidation(Type, '', '', '', true);

            return
          }
          if (event.target.files[0].size < 100000) {
            //event.target.value = '';
            this.ImageValidationMessage = 'Select more then 100kb File';


            this.ResetFileAndValidation(Type, '', '', '', true);
            return
          }
        }
        else {
          this.ImageValidationMessage = 'Select Only pdf file';

          this.ResetFileAndValidation(Type, '', '', '', true);
          return
        }

        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {


          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, data['Data'][0]["FileName"], data['Data'][0]["Dis_FileName"], data['Data'][0]["FilePath"], false);

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


  async GetOtherInformationMasterList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.otherInformationMasterService.GetOtherInformationMasterList(this.UserID, this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.OtherInformationMasterList = data['Data'][0]['data'];
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


  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {

      this.clipboard.copy(tabellist.innerText);
    }
  }

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.OtherInformationMasterList.length > 0) {
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
        XLSX.writeFile(wb, "OtherInformationMaster.xlsx");
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
    if (this.OtherInformationMasterList.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("SocietyMaster", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("OtherInformationMaster" + '.pdf');

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
  
  async ResetControl() {
    try {
      this.loaderService.requestStarted();
      const txtName = document.getElementById('txtName')
      if (txtName) txtName.focus();
      this.isSubmitted = false;
      this.request.ID = 0;
     // this.request.DepartmentID = 0;
      this.request.Type = '';
      this.request.Name = '';
      this.request.WidthMin = null;
      this.request.LengthMin = null;
      this.request.NoOfRooms = null;
      this.request.ActiveStatus = true;
      this.request.AnnexurePath = '';
      this.request.AnnexurePath2 = '';
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

  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  numbersOnly(event: any): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async Delete_OnClick(ID: number) {
    // debugger;
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.otherInformationMasterService.DeleteData(ID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetOtherInformationMasterList();
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


  async Edit_OnClick(ID: number) {
    debugger;
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
     
      await this.otherInformationMasterService.GetOtherInformationMasterIDWise(ID, this.UserID)

        .then(async (data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.request.ID = data['Data'][0]["ID"];
          
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          await this.Departmentwise_Type(null,this.request.DepartmentID);
          this.request.Type = data['Data'][0]["Type"];
          this.request.Name = data['Data'][0]["Name"];
          this.request.WidthMin = data['Data'][0]["WidthMin"];
          this.request.LengthMin = data['Data'][0]["LengthMin"];
          this.request.NoOfRooms = data['Data'][0]["NoOfRooms"];
          this.request.Dis_AnnexurePath = data['Data'][0]["Dis_AnnexurePath"];
          this.request.AnnexurePath = data['Data'][0]["AnnexurePath"];
          this.request.Dis_AnnexurePath2 = data['Data'][0]["Dis_AnnexurePath"];
          this.request.AnnexurePath2 = data['Data'][0]["AnnexurePath"];
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
}
