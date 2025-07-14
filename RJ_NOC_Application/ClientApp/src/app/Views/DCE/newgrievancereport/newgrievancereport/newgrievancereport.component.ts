import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { GrievanceReportSearchFilter } from '../../../../Models/SearchFilterDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { DCEDocumentScrutinyService } from '../../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { GrievanceService } from '../../../../Services/Grievance/grievance.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';


import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { GrievanceDataModel } from '../../../../Models/GrievanceDataModel'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FileUploadService } from '../../../../Services/FileUpload/file-upload.service';



import { __rest } from 'tslib';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Injectable()
@Component({
  selector: 'app-newgrievancereport',
  templateUrl: './newgrievancereport.component.html',
  styleUrls: ['./newgrievancereport.component.css']
})
export class NewgrievancereportComponent implements OnInit {
  GrievanceMasterForm!: FormGroup;
  request = new GrievanceReportSearchFilter();
  requestgrievancere = new GrievanceDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public QueryStringStatus: string = '';
  public DepartmentList: any;
  public CollegeDataList: any = [];
  public GrievanceReportData: any;
  searchText: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public SelectedCollageID: number = 0;
  public SelectedGrievanceID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedCollegeName: string = '';
  public SelectedDepartmentName: string = '';
  //public EnterGrievanceRemark: string = '';
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  public file!: File;
  public GrievanceTrailData: any = [];


  constructor(private routers: Router, private router: ActivatedRoute, private toastr: ToastrService, private commonMasterService: CommonMasterService, private grievanceService: GrievanceService, private loaderService: LoaderService, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private clipboard: Clipboard, private modalService: NgbModal, private formBuilder: FormBuilder, private fileUploadService: FileUploadService,) { }


  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.LoadMaster();
    this.QueryStringStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());

    await this.GetDepartmentList();
    //this.GetGrievanceReportList(this.request.FromDate, this.request.ToDate, this.request.DepartmentID, this.request.CollegeID);
    //await this.GetGrievanceReportList();
    //await this.GetDCENOCReportData();
    this.GrievanceMasterForm = this.formBuilder.group(
      {
        txtGrievanceRemark: ['', [Validators.required]],
        fileAttachmentImage: [''],
      }
    )
  }

  async LoadMaster() {
    try {
      this.loaderService.requestStarted();
      //await this.GetDepartmentList();
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
      await this.commonMasterService.GetDepartmentList_IsOpenNOCApplication()
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
  };

  async ddlDepartment_textChange(SeletedDepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(SeletedDepartmentID, this.sSOLoginDataModel.SSOID, "Grievance")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeDataList = data['Data'];
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
  };


  async GetGrievanceReportList(FromDate: any, ToDate: any, DepartmentID: number, CollegeID: number) {
    debugger;

    try {
      this.loaderService.requestStarted();
      await this.dceDocumentScrutinyService.GetGrievanceReport(FromDate, ToDate, DepartmentID, CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GrievanceReportData = data['Data'][0]['data'];
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
  public isLoadingExport: boolean = false;
  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {
      this.clipboard.copy(tabellist.innerText);
    }
  }
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.GrievanceReportData.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][8] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "GrievanceReportLst.xlsx");
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


  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  //async ResetControl() {
  //  this.request = new GrievanceReportSearchFilter();
  //  await this.GetGrievanceReportList();
  //}

  async ReceivedGrievancePopUP(content: any, GrievanceID: number, DepartmentID: number, CollegeID: number, DepartmentName: string, CollegeName: string) {
    debugger;
    this.ResetControl();
    this.SelectedGrievanceID = GrievanceID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedCollageID = CollegeID;
    this.SelectedCollegeName = CollegeName;
    this.SelectedDepartmentName = DepartmentName;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    debugger;
    //this.SelectedCollageID = 0;
    //this.SelectedDepartmentID = 0;
    //this.SelectedApplyNOCID = 0;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  async SubmitGrievanceStatus() {
    debugger;
    this.isSubmitted = true;
    //if (this.GrievanceMasterForm.invalid) {
    //  return
    //}
    if (this.requestgrievancere.GrievanceRemark == '' || this.requestgrievancere.GrievanceRemark == null) {
      this.toastr.error("Please Enter Grievance Remark");
      return;
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    this.requestgrievancere.SSOID = this.sSOLoginDataModel.SSOID;
    this.requestgrievancere.GrievanceID = this.SelectedGrievanceID;
    this.requestgrievancere.Action = "Complete";

    try {
      await this.grievanceService.SaveData(this.requestgrievancere)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.modalService.dismissAll('After Success');
            this.GetGrievanceReportList(this.request.FromDate, this.request.ToDate, this.request.DepartmentID, this.request.CollegeID);
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
    this.isSubmitted = false;
    this.requestgrievancere.GrievanceID = 0;
    this.requestgrievancere.SSOID = '';
    this.requestgrievancere.DepartmentID = 0;
    this.requestgrievancere.CollegeID = 0;
    this.requestgrievancere.GrievanceRemark = '';
    this.requestgrievancere.AttachmentImage = '';
    this.requestgrievancere.AttachmentImage_Dis_FileName = '';
    this.requestgrievancere.AttachmentImagePath = '';


  }
  async onFilechange(event: any) {

    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        /*  if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg') {*/
        //size validation
        if (this.file.size > 5000000) {
          this.requestgrievancere.AttachmentImage = '';
          this.requestgrievancere.AttachmentImage_Dis_FileName = '';
          this.requestgrievancere.AttachmentImagePath = '';
          this.toastr.error("Select less then 5MB File.!")
          return
        }
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.requestgrievancere.AttachmentImage = data['Data'][0]["FileName"];
            this.requestgrievancere.AttachmentImage_Dis_FileName = data['Data'][0]["Dis_FileName"];
            this.requestgrievancere.AttachmentImagePath = data['Data'][0]["FilePath"];

          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
      else {
        this.toastr.warning('Select File Format.!');
        return
      }
      /* }*/
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

  async DeleteImage(file: string) {
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.requestgrievancere.AttachmentImage = '';
        this.requestgrievancere.AttachmentImage_Dis_FileName = '';
        this.requestgrievancere.AttachmentImagePath = '';
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
  get form() { return this.GrievanceMasterForm.controls; }

  async GrievanceTrailPopUP(content: any, GrievanceID: number) {
    debugger;
    this.SelectedGrievanceID = GrievanceID;
    this.GetGrievanceTrail(this.SelectedGrievanceID);
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  async GetGrievanceTrail(GrievanceID: number) {
    try {
      debugger;

      this.loaderService.requestStarted();
      await this.grievanceService.Get_GrievanceTrail(GrievanceID, "Trail")
        .then((data: any) => {
          debugger
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GrievanceTrailData = data['Data'][0];
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

}
