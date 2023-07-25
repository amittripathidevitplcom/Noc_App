import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { SteramMasterService } from '../../../Services/Master/StreamMaster/steram-master.service'
import { StreamMasterDataModel } from '../../../Models/StreamMasterDataModel'
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Injectable()
@Component({
  selector: 'app-stream-master',
  templateUrl: './stream-master.component.html',
  styleUrls: ['./stream-master.component.css']
})
export class StreamMasterComponent implements OnInit {
  StreamMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new StreamMasterDataModel();
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  public isDeleteButton: boolean = true;
  public UserID: number = 0;
  public DepartmentList: any;
  public StreamDataList: any;
  public CourseLevelList: any;
  public CourseDataList: any;
  public isDisabledClient: boolean = true;
  public checked: boolean = true;
  searchText: string = '';
  public ActiveStatus: boolean = true;
  constructor(private steramMasterService: SteramMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private clipboard: Clipboard) { }
  async ngOnInit() {
    this.StreamMasterForm = this.formBuilder.group(
      {
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlCourseLevelID: ['', [DropdownValidators]],
        ddlCourseID: ['', [DropdownValidators]],
        txtStreamName: ['', [Validators.required, Validators.maxLength(100)]],
        chkActiveStatus: [''],
      }
    )
    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();
    await this.GetDepartmentList();
    await this.GetAllStreamList();
    this.ActiveStatus = true;
  }
  get form() { return this.StreamMasterForm.controls; }

  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
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
          this.request.CourseLevelID = 0;

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

  async FillCourselevel(event: any, SeletedDepartmentID: string) {
    this.request.CourseLevelID = 0;
    this.request.CourseID = 0;
    try {
      this.loaderService.requestStarted();
      const departmentId = Number(SeletedDepartmentID);
      if (departmentId <= 0) {
        return;
      }
      // Deparment level
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(departmentId, "CourseLevel")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseLevelList = data['Data'];
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

  async FillCourses(event: any, SeletedCourseLevelID: string) {
    this.request.CourseID = 0;
    try {
      this.loaderService.requestStarted();
      const courseLevelId = Number(SeletedCourseLevelID);
      if (courseLevelId <= 0) {
        return;
      }
      // Deparment level
      await this.commonMasterService.GetCourseList_ByCourseLevelIDWise(courseLevelId, this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseDataList = data['Data'];
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



  async GetAllStreamList() {
    try {
      this.loaderService.requestStarted();
      await this.steramMasterService.GetAllStreamList(this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StreamDataList = data['Data'][0]['data'];
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
    if (this.StreamMasterForm.invalid) {
      return
    }


    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.steramMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetAllStreamList();
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
    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();
    this.isSubmitted = false;
    this.request.StreamMasterID = 0;
    this.request.DepartmentID = 0;
    this.request.CourseLevelID = 0;
    this.request.CourseID = 0;
    this.request.StreamName = '';
    this.request.UserID = 0;
    this.request.ActiveStatus = true;
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }
  async Edit_OnClick(StreamMasterID: number) {
    debugger;
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.steramMasterService.GetByID(StreamMasterID, this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.StreamMasterID = data['Data'][0]["StreamMasterID"];
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.FillCourselevel('', (this.request.DepartmentID).toString())
          this.request.CourseLevelID = data['Data'][0]["CourseLevelID"];
          this.FillCourses('', (this.request.CourseLevelID).toString())
          this.request.CourseID = data['Data'][0]["CourseID"];
          this.request.StreamName = data['Data'][0]["StreamName"];
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
  async Delete_OnClick(AnimalMasterID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.steramMasterService.DeleteData(AnimalMasterID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllStreamList();
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
    if (this.StreamDataList.length > 0) {
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
        XLSX.writeFile(wb, "StreamMaster.xlsx");
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
    if (this.StreamDataList.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.StreamDataList.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "DepartmentName": this.StreamDataList[i]['DepartmentName'],
            "CourseLevelName": this.StreamDataList[i]['CourseLevelName'],
            "CourseName": this.StreamDataList[i]['CourseName'],
            "StreamName": this.StreamDataList[i]['StreamName'],
            "Status": this.StreamDataList[i]['ActiveDeactive']
          })
        }

        let values: any;
        let privados = ['S.No.', "DepartmentName", "CourseLevelName", "CourseName", "StreamName", "Status"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("Stream Master", 100, 10, { align: 'center', maxWidth: 100 });

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

        doc.save("StreamMaster" + '.pdf');

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


