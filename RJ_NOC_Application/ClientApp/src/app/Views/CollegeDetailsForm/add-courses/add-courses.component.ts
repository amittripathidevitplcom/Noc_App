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
import { Console } from 'console';
import { async } from '@angular/core/testing';


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
  public LoginSSOID: string = '';
  public LoginSocietyName: string = 'Society Name';
  sSOLoginDataModel = new SSOLoginDataModel();
  public dropdownList: any = [];
  public dropdownSettings: IDropdownSettings = {};

  public CollegeStatus: string = 'New';
  public CollegeStatusID: number = 0;

  public isCollegExisting: boolean = false;
  public CourseLevelList: any = [];
  public streamDataList: any = [];
  public isShowStreambox: boolean= false;
  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard) {

  }
  async ngOnInit() {
    this.loaderService.requestStarted();
    try {
      this.CourseMasterForm = this.formBuilder.group(
        {
          //ddlDepartment: ['', [DropdownValidators]],
          ddlCollege: ['', [DropdownValidators]],
          ddlCourse: ['', [DropdownValidators]],
          ddlSubject: ['', Validators.required],
          ddlCourseType: ['', [DropdownValidators]],
          ddlSeatInformation: ['', [DropdownValidators]],
          txtsearchText: [''],
          ddlCourseLevelID: ['', [DropdownValidators]],
          ddlStreamID: new FormControl(),
        })

      const ddlDepartment = document.getElementById('ddlDepartment')
      if (ddlDepartment) ddlDepartment.focus();

      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      this.UserID = 1;
      ///Edit Process
      await this.LoadMaster();



      //this.ddlDepartment_change(0);

      await this.GetAllList();

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
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.collegeDataList = data['Data'];
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


  async GetStreamList()
  {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetMappedStreamListByID(this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(data['Data']);
          this.streamDataList = data['Data'][0]['data'];

          console.log(data['Data']);

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






  async ddlCollege_change(SeletedCollegeID: any)
  {
    this.request.CollegeID = SeletedCollegeID;
      await this.commonMasterService.GetCollegeBasicDetails(SeletedCollegeID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.DepartmentID = data['Data'][0]['data'][0]['DepartmentID'];
          this.CollegeStatus = data['Data'][0]['data'][0]['CollegeStatus'];
          this.CollegeStatusID = data['Data'][0]['data'][0]['CollegeStatusID'];

          await this.ddlDepartment_change(this.request.DepartmentID);
          await this.CourseLevel();
          await this.GetStreamList();


        }, error => console.error(error));

  }
  async ddlDepartment_change(SeletedDepartmentID: any) {
    this.request.DepartmentID = SeletedDepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCourseList_DepartmentIDWise(this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.courseDataList = data['Data'];
          console.log(this.courseDataList);
        }, error => console.error(error));

      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "CourseType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.courseTypeDataList = data['Data'];

        }, error => console.error(error));

      this.showhideStream();

      if (this.CollegeStatus == 'Existing' && this.AllCourseList.length == 0) {
        this.request.CourseTypeID = this.CollegeStatusID;
        this.isCollegExisting = true;
      }
      else {
        this.request.CourseTypeID = 0;
        this.isCollegExisting = false;
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
  async ddlCourse_change($event: any, SeletedCourseID: any)
  {
    this.request.CourseID = SeletedCourseID;
    try
    {
      this.loaderService.requestStarted();
      if (this.request.DepartmentID == EnumDepartment.CollegeEducation)//College Education
      {
          //this.GetStreamList_CourseIDWise();
         this.ddlStream_change(this.request.StreamID);

      }
      else
      {
        await this.commonMasterService.GetSubjectList_CourseIDWise(this.request.CourseID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.subjectDataList = data['Data'];
           this.request.SelectedSubjectDetails = data['Data'];
            console.log(this.request.SelectedSubjectDetails);
          }, error => console.error(error));
      }

      await this.commonMasterService.GetSeatInformation_CourseIDWise(this.request.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.seatInformationDataList = data['Data'];
        }, error => console.error(error));
      //this.request.SelectedSubjectDetails = [];
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
      await this.courseMasterService.GetList(this.UserID, this.sSOLoginDataModel.SSOID)
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
  async SaveData() {

    this.isSubmitted = true;

    if (this.isShowStreambox)
    {
      if (this.request.StreamID == 0) {
        this.toastr.error("Please Select Steam");
        return
      }
    }

    if (this.CourseMasterForm.invalid)
    {
      return
    }


    if (this.request.DepartmentID == EnumDepartment.CollegeEducation)
    {
      var CourseName = this.CourseLevelList.find((x: { ID: number; }) => x.ID == this.request.CourseLevelID).Name;
      var CourseType = this.courseTypeDataList.find((x: { ID: number; }) => x.ID == this.request.CourseTypeID).Name;

      if (CourseName == 'PG1')
      {
        if (this.request.SelectedSubjectDetails.length > 1)
        {
          this.toastr.error("you can select only 1 subject for PG");
          return;
        }
      }

      if (CourseName == 'UG1' && CourseType=='New')
      {
        if (this.request.SelectedSubjectDetails.length < 3)
        {
          this.toastr.error("Minimum 3 Subject Required for UG.");
          return;
        }
      }
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
  async ResetControl() {
    const ddlDepartment = document.getElementById('ddlDepartment')
    if (ddlDepartment) ddlDepartment.focus();
    this.isSubmitted = false;
    this.request.CollegeWiseCourseID = 0;
    this.request.DepartmentID = 0;
    this.request.CollegeID = 0;
    this.request.CourseID = 0;
    this.request.CourseLevelID = 0;
    this.request.CourseTypeID = 0;
    this.request.Seats = 0;
    this.request.SelectedSubjectDetails = [];
    this.request.UserID = 0;
    this.request.ActiveStatus = true;
    this.request.DeleteStatus = false;

    //streamsection
    this.request.StreamID = 0;
    this.isShowStreambox = false;

    this.isCollegExisting = false;
    this.CollegeStatus = 'New';
    this.CollegeStatusID = 0;

    this.request.UserID = 0;
    this.request.ActiveStatus = true;
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";

  }
  async Edit_OnClick(CollegeWiseCourseID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.courseMasterService.GetByID(CollegeWiseCourseID, this.sSOLoginDataModel.SSOID, this.UserID)
        .then(async (data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          
          this.request.CollegeWiseCourseID = CollegeWiseCourseID; //data['Data'][0]["CollegeWiseCourseID"];
     
          this.request.DepartmentID = data['Data'][0]["DepartmentID"];
    
          this.request.CollegeID = data['Data'][0]["CollegeID"];
          await this.ddlCollege_change(this.request.CollegeID);
         
          this.request.CourseLevelID = data['Data'][0]["CourseLevelID"];
          await this.ddlCourseLevel_change(this.request.CourseLevelID);
         

          setTimeout(async () =>
          {
            this.request.CourseID = data['Data'][0]["CourseID"];
            console.log(this.request.CourseID);
            await this.ddlCourse_change(null, this.request.CourseID);

            if (this.request.DepartmentID == EnumDepartment.CollegeEducation)
            {
              this.request.StreamID = data['Data'][0]["StreamID"];
              await this.ddlStream_change(this.request.StreamID);
            }
            console.log(data['Data'][0]["SelectedSubjectDetails"]);
            this.request.SelectedSubjectDetails = data['Data'][0]["SelectedSubjectDetails"];
            setTimeout(() => {
              this.request.Seats = data['Data'][0]["Seats"];
            }, 500);
          }, 300); 

          this.request.CourseTypeID = data['Data'][0]["CourseTypeID"];
          


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

  async CourseLevel()
  {
    try
    {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "CourseLevel")
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

  async GetStreamList_CourseIDWise()
  {
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

  async ddlCourseLevel_change(CourseLevelID: any)
  {

    this.request.CourseLevelID = CourseLevelID;
    if (this.request.DepartmentID == 3)
    {
      //this.request.CourseID = 0;
      await this.commonMasterService.GetCourseByStreamID(this.request.StreamID, this.request.DepartmentID, this.request.CourseLevelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.courseDataList = data['Data'][0]['data'];
          console.log(this.courseDataList);
        }, error => console.error(error));
    }
    else
    {
      await this.commonMasterService.GetCourseList_DepartmentIDWise(this.request.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.courseDataList = data['Data'];
          console.log(this.courseDataList);
        }, error => console.error(error));

    }


    this.courseDataList = this.courseDataList.filter(item => item.CourseLevelID == CourseLevelID);
  }

  showhideStream()
  {
    if (this.request.DepartmentID == EnumDepartment.CollegeEducation)
    {
      this.isShowStreambox = true;
    }
    else
    {
      this.isShowStreambox = false;
    }
  }

  async ddlStream_change(StreamID: any)
  {
    this.request.StreamID = StreamID;
    await this.commonMasterService.GetSubjectList_StreamIDWise(this.request.StreamID, this.request.DepartmentID, this.request.CourseLevelID, this.request.CourseID)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.subjectDataList = data['Data'];
       // this.request.SelectedSubjectDetails = data['Data'];
        console.log(this.request.SelectedSubjectDetails);
      }, error => console.error(error));
  }

  async ddlSreamChangeReset(StreamID: any)
  {
    this.request.StreamID = StreamID;
    this.request.CourseLevelID = 0;
    this.request.CourseID = 0;
    this.subjectDataList = [];
    this.request.SelectedSubjectDetails = [];

  }
}


