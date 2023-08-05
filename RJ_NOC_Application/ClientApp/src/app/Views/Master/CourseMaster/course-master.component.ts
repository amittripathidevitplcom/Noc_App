import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { CourseMasterService } from '../../../Services/Master/CourseMaster/course-master.service'
import { CourseMasterAddDataModel } from '../../../Models/CourseMasterAddDataModel'
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { min } from 'moment';

@Injectable()
@Component({
  selector: 'app-course-master',
  templateUrl: './course-master.component.html',
  styleUrls: ['./course-master.component.css']
})
export class CourseMasterComponent implements OnInit {
  CourseMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new CourseMasterAddDataModel();
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  public isDeleteButton: boolean = true;
  public UserID: number = 0;
  public DepartmentList: any;
  public CourseLevelList: any;
  public CourseDataList: any;
  public CourseDurationList: any;
  public isDisabledClient: boolean = true;
  public checked: boolean = true;
  sSOLoginDataModel = new SSOLoginDataModel();
  searchText: string = '';
  public ActiveStatus: boolean = true;
  public isShowGrid: boolean = false;
  public is_disableDepartment: boolean = false;
  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private clipboard: Clipboard) { }
  async ngOnInit() {
    this.CourseMasterForm = this.formBuilder.group(
      {
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlCourseLevelID: ['', [DropdownValidators]],
        ddlCourseDurationType: ['', [DropdownValidators]],
        txtCourseDuration: ['', Validators.required],
        txtCourseName: ['', Validators.required],
        txtNoOfRooms: ['', Validators.required],
        chkActiveStatus: [''],
      }
    )
    const ddlDepartmentID = document.getElementById('ddlDepartmentID')
    if (ddlDepartmentID) ddlDepartmentID.focus();
    await this.GetDepartmentList();
    await this.GetCourseDurationTypeList();

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //disable dropdown
    if (this.sSOLoginDataModel.DepartmentID != 0)
    {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.is_disableDepartment = true;
      this.FillCourselevel(null, this.request.DepartmentID.toString());
    }

    await this.GetAllCourseList();
    this.ActiveStatus = true;
  }
  get form() { return this.CourseMasterForm.controls; }

  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
          //this.request.CourseLevelID = 0;

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
  async GetCourseDurationTypeList() {
    try {
      this.loaderService.requestStarted();
      // Course Duration department
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(0, "CourseDuration")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseDurationList = data['Data'];
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

  async GetAllCourseList() {
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetAllCourseList(this.UserID, this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseDataList = data['Data'][0]['data'];
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
    if (this.CourseMasterForm.invalid) {
      return
    }


    this.request.UserID = this.sSOLoginDataModel.UserID;
    if (this.request.Duration <= 0) {
      this.toastr.error("Course Duration Must be greater than 0.");
      return;
    }

    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.courseMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ResetControl();
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetAllCourseList();
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
   // this.GetDepartmentList();
    //this.CourseLevelList = [];
    this.GetCourseDurationTypeList();
   // this.request.DepartmentID = 0;
    this.request.CourseLevelID = 0;
    this.request.CourseID = 0;
    this.request.CourseName = '';
    this.request.CourseDurationType = 0;
    this.request.Duration = null;
    this.request.NoOfRooms = null;
    this.request.UserID = 0;
    this.request.ActiveStatus = true;
    this.isDisabledGrid = false;
    this.isShowGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }
  async Edit_OnClick(CourseID: number) {

    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetCourseIDWise(CourseID, this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.CourseID = data['Data'][0]["CourseID"];
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
          this.FillCourselevel('', (this.request.DepartmentID).toString());
          this.request.CourseLevelID = data['Data'][0]["CourseLevelID"];
          this.request.CourseName = data['Data'][0]["CourseName"];
          this.request.NoOfRooms = data['Data'][0]["NoOfRooms"];
          this.GetCourseDurationTypeList();
          this.request.CourseDurationType = data['Data'][0]["CourseDurationType"];
          this.request.Duration = data['Data'][0]["Duration"];
          this.request.ActiveStatus = data['Data'][0]["ActiveStatus"];


          this.isShowGrid = true;
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
  async Delete_OnClick(CourseID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.courseMasterService.DeleteData(CourseID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllCourseList();
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
    if (this.CourseDataList.length > 0) {
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
        XLSX.writeFile(wb, "CourseMaster.xlsx");
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
    if (this.CourseDataList.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.CourseDataList.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "DepartmentName": this.CourseDataList[i]['DepartmentName'],
            "CourseLevelName": this.CourseDataList[i]['CourseLevel'],
            "CourseName": this.CourseDataList[i]['CourseName'],
            "CourseDuration": this.CourseDataList[i]['Duration'],
            "CourseDurationType": this.CourseDataList[i]['CourseDuratinName'],
            "NoOfRooms": this.CourseDataList[i]['NoOfRooms'],
            "Status": this.CourseDataList[i]['ActiveDeactive']
          })
        }

        let values: any;
        let privados = ['S.No.', "DepartmentName", "CourseLevelName", "CourseName", "CourseDuration", "CourseDurationType","NoOfRooms", "Status"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("Course Master", 100, 10, { align: 'center', maxWidth: 100 });


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
        doc.save("CourseMaster" + '.pdf');
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


