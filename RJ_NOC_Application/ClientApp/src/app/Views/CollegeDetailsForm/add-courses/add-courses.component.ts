import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CourseMasterDataModel } from '../../../Models/CourseMasterDataModel';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { EnumDepartment } from '../../../Common/enum-noc';


@Injectable()

@Component({
  selector: 'app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.css']
})

export class AddCoursesComponent implements OnInit {
  //Add FormBuilder
  CourseMasterForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new CourseMasterDataModel();
  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  isEdit: boolean = false;
  public UserID: number = 0;
  public collegeDataList: any = [];
  public departmentMasterData: any = [];
  public courseDataList: any[] = [];
  public subjectDataList: any = [];
  public seatInformationDataList: any = [];
  public courseTypeDataList: any = [];
  public AllCourseList: any = [];
  searchText: string = '';
  public isSeatInformation: boolean = false;
  public LoginSSOID: string = '';
  public LoginSocietyName: string = 'Society Name';
  sSOLoginDataModel = new SSOLoginDataModel();
  public dropdownList: any = [];
  public dropdownSettings: IDropdownSettings = {};

  public CollegeStatus: string = 'New';
  public CollegeStatusID: number = 0;
  public SelectedDepartmentID: number = 0;
  public iSNoOfEnrolledStudents: boolean = false;
  public CourseLevelList: any = [];
  public streamDataList: any = [];
  public isShowStreambox: boolean = false;

  public SelectedCollageID: number = 0;
  public SearchRecordID: string = '';
  public lstSessionYear: any = [];
  public CourseCategoryDataList: any = [];
  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard) {

  }
  async ngOnInit() {
    console.log(this.request.NoOfEnrolledStudents);
    this.loaderService.requestStarted();
    try {
      this.CourseMasterForm = this.formBuilder.group(
        {
          ddlCollege: ['', [DropdownValidators]],
          ddlCourse: ['', [DropdownValidators]],          
          ddlSubject: ['', Validators.required],
          ddlSeatInformation: [''],//, [DropdownValidators]
          txtNoOfEnrolledStudents: [''],//, Validators.required
          txtsearchText: [''],
          ddlCourseLevelID: ['', [DropdownValidators]],
          ddlStreamID: [''], //, [DropdownValidators]
          ddlSessionYear: ['', [DropdownValidators]],
          CourseCategory: ['', [DropdownValidators]],
          txtTotalSeats: ['', Validators.required],
          txtCompositeUnit: ['', Validators.required],
          
        })

      const ddlDepartment = document.getElementById('ddlDepartment')
      if (ddlDepartment) ddlDepartment.focus();

      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
      //this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
      //this.request.CollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
       
      this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
      if (this.SearchRecordID.length > 20) {
        await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.request.CollegeID = data['Data']['CollegeID'];
            this.SelectedCollageID = data['Data']['CollegeID'];
            if (this.request.CollegeID == null || this.request.CollegeID == 0 || this.request.CollegeID == undefined) {
              this.routers.navigate(['/draftapplicationlist']);
            }
          }, error => console.error(error));
      }
      else {
        this.routers.navigate(['/draftapplicationlist']);
      }

      this.UserID = 1;
      ///Edit Process
      await this.LoadMaster();
      await this.GetAllList();
      await this.GetSessionYear();
      await this.GetCourceCategoryList();
      this.dropdownSettings = {
        singleSelection: false,
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        allowSearchFilter: true,
        idField: "SubjectID",
        textField: "SubjectName",
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
  get form() { return this.CourseMasterForm.controls; }
  async LoadMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(0, this.sSOLoginDataModel.SSOID, "AddCourse")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.collegeDataList = data['Data'];

          this.collegeDataList = this.collegeDataList.filter((element: any) => {
            return element.CollegeID == this.SelectedCollageID;
          });

          await this.ddlCollege_change(this.SelectedCollageID);


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
  public CollegeLevel: string = '';
  async ddlCollege_change(SeletedCollegeID: any) {
    this.CourseLevelList = [];
    this.request.Seats = 0;
    try {
      await this.commonMasterService.GetCollegeBasicDetails(SeletedCollegeID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.DepartmentID = await data['Data'][0]['data'][0]['DepartmentID'];
          this.CollegeStatus = await data['Data'][0]['data'][0]['CollegeStatus'];
          this.CollegeStatusID = await data['Data'][0]['data'][0]['CollegeStatusID'];
          this.CollegeLevel = await data['Data'][0]['data'][0]['CollegeLevel'];
          await this.ddlDepartment_change(this.request.DepartmentID);
          await this.CourseLevel();
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
  async ddlDepartment_change(SeletedDepartmentID: any) {
    this.request.DepartmentID = SeletedDepartmentID;
    this.request.SelectedSubjectDetails = [];
    this.courseDataList = [];
    this.subjectDataList = [];
    try {
      this.loaderService.requestStarted();

      //if (this.request.DepartmentID != EnumDepartment.CollegeEducation) {
      //  await this.commonMasterService.GetCourseList_DepartmentIDWise(this.request.DepartmentID)
      //    .then((data: any) => {
      //      data = JSON.parse(JSON.stringify(data));
      //      this.courseDataList = data['Data'];
      //    }, error => console.error(error));
      //}

      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "CourseType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.courseTypeDataList = data['Data'];
        }, error => console.error(error));

      this.showhideStream();

      if (this.request.DepartmentID == EnumDepartment.CollegeEducation) {
        await this.GetStreamList();
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

  async GetStreamList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetMappedStreamListByID(this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.streamDataList = data['Data'][0]['data'];
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


  async ddlCourse_change($event: any, SeletedCourseID: any) {
    this.request.CourseID = SeletedCourseID;
    this.request.SelectedSubjectDetails = [];
    try {
      this.loaderService.requestStarted();
      if (this.request.DepartmentID == EnumDepartment.CollegeEducation)//College Education
      {
        await this.ddlStream_change(this.request.StreamID);
      }
      else {
        await this.commonMasterService.GetSubjectList_CourseIDWise(this.request.CourseID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.subjectDataList = data['Data'];
            if (this.request.DepartmentID != 3) {
              this.request.SelectedSubjectDetails = data['Data'];
            }
            //this.request.SelectedSubjectDetails = data['Data'];
            console.log(this.request.SelectedSubjectDetails);
          }, error => console.error(error));
      }

      await this.commonMasterService.GetSeatInformation_CourseIDWise(this.request.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.seatInformationDataList = data['Data'];
        }, error => console.error(error));
      this.request.Seats = 0;
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
  async GetAllList() {
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetList(this.UserID, this.sSOLoginDataModel.SSOID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AllCourseList = data['Data'][0]['data'];
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
  public isFormValid: boolean = true;
  async SaveData() {
    debugger;
    this.isSubmitted = true;
    this.isFormValid = true;

    //if (this.request.DepartmentID == EnumDepartment.CollegeEducation && this.isSelectedCourseType == true) {
    //  this.CourseMasterForm.get('ddlSeatInformation')?.clearValidators();
    //  this.CourseMasterForm.get('ddlStreamID')?.setValidators([DropdownValidators]);
    //  this.CourseMasterForm.get('txtNoOfEnrolledStudents')?.setValidators([Validators.required]);

    //  this.CourseMasterForm.get('ddlSeatInformation')?.updateValueAndValidity();
    //  this.CourseMasterForm.get('ddlStreamID')?.updateValueAndValidity();
    //  this.CourseMasterForm.get('txtNoOfEnrolledStudents')?.updateValueAndValidity();
    //}
    //else {
    //  this.CourseMasterForm.get('ddlSeatInformation')?.setValidators([DropdownValidators]);
    //  this.CourseMasterForm.get('txtNoOfEnrolledStudents')?.clearValidators();
    //  this.CourseMasterForm.get('ddlStreamID')?.clearValidators();

    //  this.CourseMasterForm.get('ddlSeatInformation')?.updateValueAndValidity();
    //  this.CourseMasterForm.get('ddlStreamID')?.updateValueAndValidity();
    //  this.CourseMasterForm.get('txtNoOfEnrolledStudents')?.updateValueAndValidity();
    //}
    if (this.request.DepartmentID == EnumDepartment.ParaMedical) {
      this.CourseMasterForm.get('ddlSubject')?.clearValidators();
      this.CourseMasterForm.get('ddlSubject')?.updateValueAndValidity();
    }
    if (this.request.DepartmentID == 11) {
      this.CourseMasterForm.get('ddlSessionYear')?.setValidators(DropdownValidators);
      this.CourseMasterForm.get('CourseCategory')?.setValidators(DropdownValidators);
      this.CourseMasterForm.get('txtTotalSeats')?.setValidators(Validators.required);
      this.CourseMasterForm.get('txtCompositeUnit')?.setValidators(Validators.required);
      this.CourseMasterForm.get('ddlSessionYear')?.updateValueAndValidity();
      this.CourseMasterForm.get('CourseCategory')?.updateValueAndValidity();
      this.CourseMasterForm.get('txtTotalSeats')?.updateValueAndValidity();
      this.CourseMasterForm.get('txtCompositeUnit')?.updateValueAndValidity();
      this.CourseMasterForm.get('ddlSubject')?.clearValidators();
      this.CourseMasterForm.get('ddlSubject')?.updateValueAndValidity();
    }
    else {
      this.CourseMasterForm.get('ddlSessionYear')?.clearValidators();
      this.CourseMasterForm.get('CourseCategory')?.clearValidators();
      this.CourseMasterForm.get('txtTotalSeats')?.clearValidators();
      this.CourseMasterForm.get('txtCompositeUnit')?.clearValidators();
      this.CourseMasterForm.get('ddlSessionYear')?.updateValueAndValidity();
      this.CourseMasterForm.get('CourseCategory')?.updateValueAndValidity();
      this.CourseMasterForm.get('txtTotalSeats')?.updateValueAndValidity();
      this.CourseMasterForm.get('txtCompositeUnit')?.updateValueAndValidity();
    }
    console.log(this.CourseMasterForm);
    if (this.CourseMasterForm.invalid) {
      this.isFormValid = false;
      return
    }
    if (this.request.DepartmentID != 11) {
      if (this.request.DepartmentID != EnumDepartment.CollegeEducation && this.CollegeStatus != 'New') {
        if (this.request.Seats <= 0) {
          this.isFormValid = false;
        }
      }
    }

    if (this.request.DepartmentID == EnumDepartment.CollegeEducation) {
      if (this.request.NoOfEnrolledStudents == null || this.request.NoOfEnrolledStudents.toString() == '')
        this.isFormValid = false;
    }
    if (!this.isFormValid) {
      return;
    }

    if (this.request.DepartmentID == EnumDepartment.CollegeEducation) {
      var CourseLevel = this.CourseLevelList.find((x: { ID: number; }) => x.ID == this.request.CourseLevelID).Name;
      var CourseName = this.courseDataList.find((x: { CourseID: number; }) => x.CourseID == this.request.CourseID).CourseName;
      //Comment By rishi kapoor
      //if (this.isSelectedCourseType == true) {
      //  if (this.request.NoOfEnrolledStudents == 0) {
      //    this.iSNoOfEnrolledStudents = true;
      //    this.toastr.error("Please enter No Of Enrolled Students greater than 0.");
      //    return;
      //  }
      //}


      if (CourseLevel == 'PG') {
        if (this.request.SelectedSubjectDetails.length > 1) {
          this.toastr.error("you can select only 1 subject for PG");
          return;
        }
      }

      if ((CourseName.toLowerCase() == 'bachelor of arts' || CourseName.toLowerCase() == 'bachelor of commerce' || CourseName.toLowerCase() == 'bachelor of science')) {
        if (this.request.SelectedSubjectDetails.length < 3) {
          this.toastr.error("Minimum 3 Subject Required.");
          return;
        }
      }
    }

    //Added by rishi kapooor
    if (this.request.NoOfEnrolledStudents == undefined || this.request.NoOfEnrolledStudents == null) {
      this.request.NoOfEnrolledStudents = 0;
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.courseMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetAllList();
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
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  async ResetControl() {
    const ddlDepartment = document.getElementById('ddlDepartment')
    if (ddlDepartment) ddlDepartment.focus();
    this.isSubmitted = false;
    this.request.CollegeWiseCourseID = 0;
    this.ddlCollege_change(this.request.CollegeID);
    this.request.CourseID = 0;
    this.ddlCourse_change(this, this.request.CourseID);
    this.request.CourseLevelID = 0;
    this.ddlCourseLevel_change(this.request.CourseLevelID);
    this.request.Seats = 0;
    this.request.NoOfEnrolledStudents = undefined;
    this.request.SelectedSubjectDetails = [];
    this.request.CompositeUnit = '';
    this.request.CourseCategoryId = 0;
    this.request.SessionYear = 0;
    this.request.TotalSeatsCourseWise = '';
    this.subjectDataList = [];
    this.request.UserID = 0;
    this.request.ActiveStatus = true;
    this.request.DeleteStatus = false;

    //streamsection
    this.request.StreamID = 0;
    this.isShowStreambox = false;

    this.CollegeStatus = 'New';
    this.CollegeStatusID = 0;

    this.request.UserID = 0;
    this.request.ActiveStatus = true;
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('btnReset')
    if (btnReset) btnReset.innerHTML = "Reset";

  }
  async Edit_OnClick(CollegeWiseCourseID: number) {
    debugger;
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetByID(CollegeWiseCourseID, this.sSOLoginDataModel.SSOID, this.UserID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.CollegeWiseCourseID = CollegeWiseCourseID;
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];

          this.request.CollegeID = data['Data'][0]["CollegeID"];
          await this.ddlCollege_change(this.request.CollegeID);

          if (this.request.DepartmentID == EnumDepartment.CollegeEducation) {
            this.request.StreamID = data['Data'][0]["StreamID"];
            await this.ddlStream_change(this.request.StreamID);
            this.request.NoOfEnrolledStudents = data['Data'][0]["NoOfEnrolledStudents"];
          }

          this.request.CourseLevelID = data['Data'][0]["CourseLevelID"];
          console.log(this.request.CourseLevelID);
          if (this.request.DepartmentID == EnumDepartment.CollegeEducation || this.request.DepartmentID == EnumDepartment.Animal_Husbandry
            || this.request.DepartmentID == EnumDepartment.MedicalGroup3 || this.request.DepartmentID == EnumDepartment.Bed_CollegeEducation || this.request.DepartmentID == EnumDepartment.ParaMedical || this.request.DepartmentID == EnumDepartment.Agriculture) {
            await this.ddlCourseLevel_change(this.request.CourseLevelID);
          }


          this.request.CourseID = data['Data'][0]["CourseID"];
          await this.ddlCourse_change(null, this.request.CourseID);

          this.request.Seats = data['Data'][0]["Seats"];
          this.request.SelectedSubjectDetails = data['Data'][0]["SelectedSubjectDetails"];
          this.request.SessionYear = data['Data'][0]["SessionYear"];
          this.request.CourseCategoryId = data['Data'][0]["CourseCategoryId"];
          this.request.TotalSeatsCourseWise = data['Data'][0]["TotalSeatsCourseWise"];
          this.request.CompositeUnit = data['Data'][0]["CompositeUnit"];
          this.request.UserID = data['Data'][0]["UserID"];
          this.request.ActiveStatus = data['Data'][0]["ActiveStatus"];
          this.request.DeleteStatus = data['Data'][0]["DeleteStatus"];
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
  async Delete_OnClick(CollegeWiseCourseID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.courseMasterService.DeleteData(CollegeWiseCourseID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllList();
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
    if (this.AllCourseList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][0] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "CollegeCourse.xlsx");
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
    if (this.AllCourseList.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("College Wise Course", 100, 10, { align: 'center', maxWidth: 100 });
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
        //or

        //let pDFData: any = [];
        //for (var i = 0; i < this.AllCourseList.length; i++) {
        //  pDFData.push({
        //    "S.No.": i + 1,
        //    "Department": this.AllCourseList[i]['DepartmentName'],
        //    "Collage": this.AllCourseList[i]['CollageName'],
        //    "Course": this.AllCourseList[i]['CourseName'],
        //    "Subject": this.AllCourseList[i]['SubjectDetails']
        //  })
        //}

        //let values: any;
        //let privados = ['S.No.', "Department", "Collage", "Course", "Subject"];
        //let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        //values = pDFData.map((elemento: any) => Object.values(elemento));

        //doc.setFontSize(16);
        //doc.text("College Wise Course", 100, 10, { align: 'center', maxWidth: 100 });

        //autoTable(doc,
        //  {
        //    head: [header],
        //    body: values,
        //    styles: { fontSize: 8 },
        //    headStyles: {
        //      fillColor: '#3f51b5',
        //      textColor: '#fff',
        //      halign: 'center'
        //    },
        //    bodyStyles: {
        //      halign: 'center'
        //    },
        //    margin: {
        //      left: 5,
        //      right: 5,
        //      top:15
        //    },
        //    tableLineWidth: 0,

        //  }
        //)
        ///
        doc.save("CollegeCourse" + '.pdf');

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
  async CourseLevel() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "CourseLevel")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseLevelList = data['Data'];
          if (this.SelectedDepartmentID == 9 && this.CollegeLevel=='Diploma') {
            this.CourseLevelList = this.CourseLevelList.filter((element: any) => {
              return element.Name == 'Diploma';
            });
          }
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
  async GetStreamList_CourseIDWise() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetStreamList_CourseIDWise(this.request.DepartmentID, this.request.CourseLevelID, this.request.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.streamDataList = data['Data'];

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
  async GetCollegeBasicDetails() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeBasicDetails(this.request.CollegeID.toString())
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UniversityID = data['Data'][0]['data'][0]['UniversityID'];
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
  public UniversityID: number = 0;
  async ddlCourseLevel_change(CourseLevelID: any) {
    await this.GetCollegeBasicDetails();

    this.request.CourseLevelID = CourseLevelID;
    if (this.request.DepartmentID == 3) {
      //this.request.CourseID = 0; 
      await this.commonMasterService.GetCourseByStreamID(this.request.StreamID, this.request.DepartmentID, this.request.CourseLevelID, this.UniversityID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.courseDataList = data['Data'][0]['data'];
          console.log(this.courseDataList);
        }, error => console.error(error));
    }
    else {
      await this.commonMasterService.GetCourseList_DepartmentIDWise(this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.courseDataList = data['Data'];
          console.log(this.courseDataList);
        }, error => console.error(error));

    }


    this.courseDataList = this.courseDataList.filter(item => item.CourseLevelID == CourseLevelID);
  }


  showhideStream() {
    if (this.request.DepartmentID == EnumDepartment.CollegeEducation) {
      this.isShowStreambox = true;
    }
    else {
      this.isShowStreambox = false;
    }
  }

  async ddlStream_change(StreamID: any) {

    this.request.StreamID = StreamID;
    await this.commonMasterService.GetSubjectList_StreamIDWise(this.request.StreamID, this.request.DepartmentID, this.request.CourseLevelID, this.request.CourseID)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.subjectDataList = data['Data'];
      }, error => console.error(error));
  }
  async ddlSreamChangeReset(StreamID: any) {
    this.request.StreamID = StreamID;
    this.request.CourseLevelID = 0;
    this.request.CourseID = 0;
    this.subjectDataList = [];
    this.request.SelectedSubjectDetails = [];

  }

  shiftFHandler() {
    alert('Shift+F pressed!');
  }
  async GetSessionYear() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetAllFinancialYear_OldNOC(this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstSessionYear = data['Data'];          
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
  async GetCourceCategoryList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(this.request.DepartmentID, this.sSOLoginDataModel.SSOID, "Course Category")
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CourseCategoryDataList = data['Data'];
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


