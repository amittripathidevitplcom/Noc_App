import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { CourseMasterService } from '../../../Services/Master/CourseMaster/course-master.service';
import { ToastrService } from 'ngx-toastr';
import { CourseMasterAddDataModel } from '../../../Models/CourseMasterAddDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { Clipboard } from '@angular/cdk/clipboard';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
@Component({
  selector: 'app-btercourse-master',
  templateUrl: './btercourse-master.component.html',
  styleUrls: ['./btercourse-master.component.css']
})
export class BTERCourseMasterComponent {

  dtCourseMasterForm!: FormGroup;

  request = new CourseMasterAddDataModel();

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  isSubmitted: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public isLoadingExport: boolean = false;
  public streamDataList: any = [];
  public CourseDataList: any;
  public courseDataList: any[] = [];
  public SelectedDepartmentID: number = 0;
  public CourseLevelList: any = [];
  public CourseDropdown: boolean = false;
  public ShowHideotherCourse: boolean = false;
  public isLoading: boolean = false;
  public SubjectList: any = [];
  public is_disableDepartment: boolean = false;
  public isShowGrid: boolean = false;
  public isDisabledGrid: boolean = false;
  public UserID: number = 0;
  searchText: string = '';
  public isDeleteButton: boolean = true;



  constructor(private loaderService: LoaderService, private commonMasterService: CommonMasterService, private courseMasterService: CourseMasterService, private toastr: ToastrService, private formBuilder: FormBuilder, private clipboard: Clipboard) { }

  async ngOnInit() {
    this.loaderService.requestStarted();
    try {
      this.dtCourseMasterForm = this.formBuilder.group({
        ddlCourseLevelID: ['', [DropdownValidators]],
        txtCourseName: ['', [Validators.required]],
        txtShortName: ['', [Validators.required]],
        chkActiveStatus: [''],
      })

      const ddlStreamID = document.getElementById('ddlStreamID')
      if (ddlStreamID) ddlStreamID.focus();

      await this.CourseLevel();
      await this.GetAllCourseList();
      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      if (this.sSOLoginDataModel.DepartmentID != 0) {
        this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        this.is_disableDepartment = true;
       // this.FillCourselevel(null, this.request.DepartmentID.toString());
        //   await this.GetSubjectDepartmentWise();
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 0);
    }
  }
  get form() { return this.dtCourseMasterForm.controls; }  

  async CourseLevel() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWises(12, 0, "AffiliationCourseType")
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
  };

  public isFormValid: boolean = true;

  async SaveData() {
    // debugger;
    //this.request.CourseSubjects = [];
    this.isSubmitted = true;
    if (this.dtCourseMasterForm.invalid) {
      return
    }

    //this.request.CourseSubjects.push({
    //  CourseID: 0,
    //  SubjectID: 0
    //})

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      //  this.request.CourseSubjects = [];
      this.request.DepartmentID =12;
      this.request.Duration = 0;
      this.request.NoOfRooms = 0;
      this.request.NoofSubjectsForCombination = 0;
      await this.courseMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // get saved society
            this.GetAllCourseList();
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

  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  async ResetControl() {

    const ddlStreamID = document.getElementById('ddlStreamID')
    if (ddlStreamID) ddlStreamID.focus();
    this.isSubmitted = false;
    this.request.CourseLevelID = 0;
    this.request.CourseName = '';
    this.request.ShortNameofCourse = '';
    this.request.UserID = 0;
    this.request.ActiveStatus = true;  
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }

  async Edit_OnClick(CourseID: number) {
    debugger;

    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetCourseIDWise(CourseID, this.UserID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //this.FillCourselevel('', (this.request.DepartmentID).toString());
          this.request.CourseID = data['Data'][0]["CourseID"];
          this.request.CourseLevelID = data['Data'][0]["CourseLevelID"];
          this.request.ActiveStatus = data['Data'][0]["ActiveStatus"];
          this.request.CourseName = data['Data'][0]["CourseName"];         
          this.request.ShortNameofCourse = data['Data'][0]["ShortNameofCourse"];         
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

  async GetAllCourseList() {
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetAllCourseList(this.UserID, 12)
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
        XLSX.writeFile(wb, "BTERCourseMaster.xlsx");
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
    if (this.CourseDataList.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("DTCourseMaster", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("BTERCourseMaster" + '.pdf');

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


