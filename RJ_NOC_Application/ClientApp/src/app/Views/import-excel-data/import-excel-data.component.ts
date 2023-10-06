import { ChangeDetectorRef, Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ImportExcelDataService } from '../../Services/ImportExcelData/import-excel-data.service';
import { ImportExcelDataDataModel } from '../../Models/ImportExcelDataDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { FileUploadService } from '../../Services/FileUpload/file-upload.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import * as XLSX from 'xlsx';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../Common/GlobalConstants';

type AOA = any[][];
@Injectable()

@Component({
  selector: 'app-import-excel-data',
  templateUrl: './import-excel-data.component.html',
  styleUrls: ['./import-excel-data.component.css']
})
export class ImportExcelDataComponent {
  isSubmitted: boolean = false;
  ImportExcelDataForm!: FormGroup;
  public importExcelData: any = [];
  public CourseData: any = [];
  public CollegeList: any = [];
  public lstImportFileData: any = [];
  public lstImportFileDetails: any = [];
  public lstEditImportFileDetails: any = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  UploadFile: string = '';
  file: File | any = null;
  public files: File = null;
  public isFormValid: boolean = false;
  public FinancialYearList: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  request = new ImportExcelDataDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public DownloadExcelPath: string = '';
  public ShowFileDownload: boolean = false;

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  constructor(private modalService: NgbModal, private importExcelDataService: ImportExcelDataService, private commonMasterService: CommonMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private fileUploadService: FileUploadService) { }

  ngOnInit() {
    this.ImportExcelDataForm = this.formBuilder.group({
      ddlDataType: [''],
      ddlFinancialYear: ['', [DropdownValidators]],
      ddlCollegeID: ['', [DropdownValidators]],
      ddlCourseId: ['', [DropdownValidators]],
      fileData: ['', [Validators.required]],
    });
    this.request.Data = [];
    this.GetAllFinancialYear();
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.GetCollegesByDepartmentAndSsoId(this.SelectedDepartmentID, this.sSOLoginDataModel.SSOID, 'Society');
    this.GetImportExcelData();
    // this.DownloadExcelPath = GlobalConstants.ExcelPathURL + 'Statics_Sample.xlsx';
  }
  get form() {
    return this.ImportExcelDataForm.controls;
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

  async GetCourseList_CollegeWise(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      this.commonMasterService.GetCourseList_CollegeWise(CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CourseData = data['Data'];
          console.log(this.CourseData);
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

  async GetCollegesByDepartmentAndSsoId(departmentId: number, ssoId: string, type: string) {
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(departmentId, ssoId, type)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeList = data['Data'];
        });
    }
    catch (ex) {
      console.log(ex)
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetControl() {
    this.importExcelData = [];
    this.request = new ImportExcelDataDataModel();
    this.GetImportExcelData();
    this.file = document.getElementById('fileData');
    this.file.value = '';
  }

  async SaveData() {
    ///Check Validators
    debugger;
    this.isSubmitted = true;
    if (this.ImportExcelDataForm.invalid) {
      return
    }
    this.request.DataType = '';
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.SelectedDepartmentID;
      this.request.SSOID = this.sSOLoginDataModel.SSOID;
      await this.importExcelDataService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.importExcelData = [];
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetImportExcelData();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }, error => {
          this.toastr.warning("Invalid excel file data entry .!");
          setTimeout(() => {
          }, 200);
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async UpdateData() {
    ///Check Validators
    this.request.DataType = '';
    try {
      let Data = this.request.Data;
      this.request.Data = [];
      this.loaderService.requestStarted();
      this.request.Data.push(Data);
      this.request.DepartmentID = this.SelectedDepartmentID;
      this.request.SSOID = this.sSOLoginDataModel.SSOID;
      await this.importExcelDataService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.importExcelData = [];
            this.toastr.success(this.SuccessMessage)
            this.modalService.dismissAll('After Success');
            this.ResetControl();
            this.GetImportExcelData();
          }
          else {
            this.toastr.error(this.ErrorMessage)
            this.request.Data = Data;
          }
        }, error => {
          this.toastr.warning("Invalid excel file data entry .!");
          setTimeout(() => {
          }, 200);
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetImportExcelData() {
    try {
      this.loaderService.requestStarted();
      await this.importExcelDataService.GetImprtExcelData(this.sSOLoginDataModel.SSOID, this.SelectedDepartmentID, this.SelectedCollageID, 0, 'ImportExcelFileName')
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstImportFileData = data['Data'][0]['data'];
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

  async GetImportExcelFileDetailsByID(content: any, StaticsFileID: number) {
    try {
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.loaderService.requestStarted();
      await this.importExcelDataService.GetImprtExcelData(this.sSOLoginDataModel.SSOID, 0, 0, StaticsFileID, 'ImportExcelFileDetailsById')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstImportFileDetails = data['Data'][0]['data'];
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

  async EditImportExcelFileDetailsByID(content: any, StaticsFileID: number) {
    try {
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.loaderService.requestStarted();
      this.request.StaticsFileID = StaticsFileID;
      this.request.SSOID = this.sSOLoginDataModel.SSOID;
      await this.importExcelDataService.GetImprtExcelData(this.sSOLoginDataModel.SSOID, 0, 0, StaticsFileID, 'ImportExcelFileDetailsById')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          
          this.request.Data = data['Data'][0]['data'];
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

  async DeleteImportExcelFileDetailsByID(StaticsFileID: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.importExcelDataService.GetImprtExcelData(this.sSOLoginDataModel.SSOID, 0, 0, StaticsFileID, 'DeleteImportExcelFileDetailsById')
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.GetImportExcelData();
          }, error => console.error(error));
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async downloadFile(filePath: string) {
    var link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
    link.click();
  }

  ddlCourseTypeSelected(value: string) {
    if (value == "All") {
      this.DownloadExcelPath = GlobalConstants.ExcelPathURL + 'Statics_Sample.xlsx';
      this.ShowFileDownload = true;
    }
  }

  async onFileChange(event: any) {
    try {
      this.request.Data = []
      this.importExcelData = []
      this.loaderService.requestStarted();

      let workBook: any = null;
      let jsonData = null;
      const reader = new FileReader();
      const file = event.target.files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        //size validation
        if (file.size > 2000000) {
          this.toastr.error('Select less then 2MB File')
          return
        }
        if (file.size < 10) {
          this.toastr.error('Select more then 1kb File')
          return
        }
      }
      else {// type validation
        this.toastr.error('Select Only xls/xlsx file')
        return
      }
      reader.onload = (event1) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          //console.log(sheet);
          return initial;
        }, {});
        //console.log(jsonData['Sheet1']);
        const dataString = JSON.stringify(jsonData['Sheet1']);
        this.request.Data.push(jsonData['Sheet1']);
      }
      reader.readAsBinaryString(file);

      const file1 = event.target.files[0];
      const target: DataTransfer = <DataTransfer>(event.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader1: FileReader = new FileReader();
      reader1.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.importExcelData = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      };
      reader1.readAsBinaryString(file1);

    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }
}
