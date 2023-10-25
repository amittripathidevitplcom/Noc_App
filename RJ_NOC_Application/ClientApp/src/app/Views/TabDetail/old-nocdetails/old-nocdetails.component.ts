import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { OldNocDetailsDataModel, OldNocDetails_SubjectDataModel } from '../../../Models/TabDetailDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { OldnocdetailService } from '../../../Services/OldNOCDetail/oldnocdetail.service';
import { StaffDetailsComponent } from '../staff-details/staff-details.component';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-old-nocdetails',
  templateUrl: './old-nocdetails.component.html',
  styleUrls: ['./old-nocdetails.component.css']
})
export class OldNOCDetailsComponent implements OnInit {
  oldNOCForm!: FormGroup;
  //request = new OldNocDataModel();

  request = new OldNocDetailsDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  isSubmitted: boolean = false;
  public ShowOldNOCType: boolean = false;
  public isDisabled: boolean = false;
  public IsUploadDocRequried: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public lstCollege: any = [];
  public lstCourse: any = [];
  public lstSubject: any = [];
  public lstNOCType: any = [];
  public lstSessionYear: any = [];
  public lstIssuedYear: any = [];
  public subjectDataList: any = [];
  public seatInformationDataList: any = [];
  public SelectedSubjectDetails: any = [];
  public SubjectID: any = [];
  public dropdownSettings: IDropdownSettings = {};
  public showImageFilePath: boolean = false;
  public SubjectShow_Hide: boolean = false;

  //NOC Details
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public OldNOCTypeId: number = 0;
  public SessionYear: string = '0';
  public IssueYear: string = '0';
  public NOCNumber: string = '';
  public NOCReceivedDate: string = '';//Date = new Date();
  public NOCExpireDate: string = '';//Date = new Date();
  public UploadNOCDoc: string = '';
  public Remark: string = '';
  public OldNocDetails: OldNocDetailsDataModel[] = [];
  public SubjectDataModel: OldNocDetails_SubjectDataModel[] = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public Seats: number = 0;
  public MaxDate: Date = new Date();
  public IsFormValid: boolean = true;
  public SubjectRequried: boolean = false;
  public NOCExpireDateRequried: boolean = false;
  public isToDisable = true;
  //NOC Details


  public QueryStringStatus: any = '';
  public SelectedApplyNOCID: number = 0;
  constructor(private loaderService: LoaderService, private toastr: ToastrService, private fileUploadService: FileUploadService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private oldnocdetailService: OldnocdetailService) {

    this.oldNOCForm = this.formBuilder.group(
      {
        ddlCollegeID: ['', DropdownValidators],
        ddlCourseID: ['', [DropdownValidators]],
        ddlOldNOCTypeId: ['', [DropdownValidators]],
        ddlSubject: ['', Validators.required],
        ddlSessionYear: ['', [DropdownValidators]],
        ddlIssueYear: ['', [DropdownValidators]],
        txtNOCNumber: ['', Validators.required],
        dtNOCReceivedDate: ['', Validators.required],
        dtNOCExpireDate: [''],
        UploadNOCDoc: [''],
        txtRemark: [''],
      });
  }

  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.request.CollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetCollegeList(this.sSOLoginDataModel.SSOID, this.SelectedDepartmentID);

    if (this.SelectedDepartmentID == 2) {
      this.SubjectShow_Hide = false;

    }
    else {
      this.SubjectShow_Hide = true;

    }
    await this.getNOCType();
    await this.GetIssueYear();
    await this.GetSessionYear();
    await this.GetOldNOCDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);

    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      idField: "SubjectID",
      textField: "SubjectName",
    }

    this.lstCollege = this.lstCollege.filter((element: any) => {
      return element.CollegeID == this.SelectedCollageID;
    });
    await this.GetCourseList();


  }

  get form() { return this.oldNOCForm.controls; }

  async GetCollegeList(sSOID: string, DepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(DepartmentID, sSOID, 'oldNOC')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstCollege = data['Data'];
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

  async GetCourseList(Type: string = 'Course', OldNocID: number = 0) {
    try {
      this.loaderService.requestStarted();
      this.lstCourse = [];
      await this.commonMasterService.Get_CollegeWiseCourse_Subject_OldNOC(this.SelectedCollageID, Type, 0, OldNocID)//4=existing
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstCourse = data['Data'][0];
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

  async GetSubjectList(CourseID: any, GetType: string = 'Subject', OldNocID: number = 0) {
    try {
      this.SelectedSubjectDetails = [];
      this.loaderService.requestStarted();

      await this.commonMasterService.Get_CollegeWiseCourse_Subject_OldNOC(this.SelectedCollageID, GetType, CourseID, OldNocID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.subjectDataList = data['Data'][0];
          debugger;
          //if (this.SelectedDepartmentID != 3) {
          //  this.SelectedSubjectDetails = data['Data'][0];
          //  this.isToDisable = true;
          //}
          //else {
          //  //this.SelectedSubjectDetails = [];
          //  this.isToDisable = false;
          //}
          this.SelectedSubjectDetails = data['Data'][0];
          this.isToDisable = true;
          this.dropdownSettings = Object.assign({}, this.dropdownSettings);
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

  async getNOCType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWises(this.SelectedDepartmentID, this.SelectedCollageID, "OLDNOCStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstNOCType = data['Data'];
          if (this.SelectedDepartmentID != 3) {
            this.lstNOCType = this.lstNOCType.filter((element: any) => {
              return element.Name == "PNOC";
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

  async GetIssueYear() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetIssuedYearDetails()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstIssuedYear = data;
          console.log(this.lstIssuedYear);
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

  async AddData() {
    try {
      this.isSubmitted = true;

      if (this.oldNOCForm.invalid) {
        return
      }
      this.loaderService.requestStarted();
      //this.request.OldNocDetails.push({
      //  "OldNocID": 0,
      //  "CollegeID": this.CollegeID,
      //  "CollegeName": this.lstCollege.find((x: { CollegeID: number; }) => x.CollegeID == this.CollegeID).CollegeName,
      //  "CourseID": this.CourseID,
      //  "CourseName": this.lstCourse.find((x: { CourseID: number; }) => x.CourseID == this.CourseID).CourseName,
      //  //"SubjectID": this.SubjectId,
      //  //"SubjectName": this.lstCourse.find((x: { SubjectID: number; }) => x.SubjectID == this.SubjectId).SubjectName,
      //  "NOCTypeID": this.OldNOCTypeId,
      //  "NOCTypeName": this.lstCourse.find((x: { NOCTypeID: number; }) => x.NOCTypeID == this.OldNOCTypeId).NOCTypeName,
      //  "IssuedYear": this.IssueYear,
      //  "SessionYear": this.SessionYear,
      //  "NOCExpireDate": this.NOCExpireDate,
      //  "NOCNumber": this.NOCNumber,
      //  "NOCReceivedDate": this.NOCReceivedDate,
      //  "UploadNOCDoc": this.UploadNOCDoc,
      //  "Remark": this.Remark,
      //  SubjectData: this.SubjectDataModel
      //});
      //this.CollegeID = 0;
      //this.CourseID = 0;
      //this.SubjectID = 0;
      //this.OldNOCTypeId = 0;
      //this.SessionYear = '';
      //this.IssueYear = '';
      //this.NOCNumber = '';
      //this.NOCReceivedDate = '';//Date = new Date();
      //this.NOCExpireDate = '';//Date = new Date();
      //this.UploadNOCDoc = '';
      //this.Remark = '';
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
    //this.routers.navigate(['/addcollege']);
  }


  async AddOldNOCDetails() {
    debugger;
    this.IsFormValid = true;
    this.SubjectRequried = false;
    this.SubjectDataModel = [];
    if (this.SelectedSubjectDetails.length > 0) {
      for (var i = 0; i < this.SelectedSubjectDetails.length; i++) {
        this.SubjectDataModel.push({
          OldNOCSubjectID: 0,
          SubjectID: this.SelectedSubjectDetails[i].SubjectID, SubjectName: this.SelectedSubjectDetails[i].SubjectName
        })
      }
    }


    if (this.SelectedDepartmentID != 4) {
      this.oldNOCForm.get('ddlSubject')?.setValidators([DropdownValidators]);
    }
    else {
      this.oldNOCForm.get('ddlSubject')?.clearValidators();
    }
    this.oldNOCForm.get('ddlSubject')?.updateValueAndValidity();

    this.isSubmitted = true;
    if (this.oldNOCForm.invalid) {
      this.IsFormValid = false;
    }

    if (this.SubjectDataModel.length == 0 && (this.SelectedDepartmentID != 2 && this.SelectedDepartmentID != 4)) {
      this.IsFormValid = false;
      this.SubjectRequried = true;
    }
    if (this.request.UploadNOCDoc == '') {
      this.IsUploadDocRequried = true;
      this.IsFormValid = false;
    }
    var OldNOCtype = this.lstNOCType.find((x: { ID: any; }) => x.ID == this.request.NOCTypeID).Name;
    if (OldNOCtype != 'PNOC') {
      if (this.request.NOCExpireDate == '') {
        this.NOCExpireDateRequried = true;
        this.IsFormValid = false;
      }
    }
    if (!this.IsFormValid) {
      return;
    }
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.SelectedDepartmentID;
      this.request.CollegeID = this.SelectedCollageID;
      this.request.SubjectData = this.SubjectDataModel;

      console.log(this.oldNOCForm.controls);

      await this.oldnocdetailService.SaveData(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];



          if (this.State == 0) {
            //console.log(data['Data']);

            this.toastr.success(this.SuccessMessage);
            this.ResetControl();
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }, error => {
          this.toastr.warning("Unable to connect to server .!");
        })


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
  OnChangeOldNOCType() {
    var OldNOCtype = this.lstNOCType.find((x: { ID: any; }) => x.ID == this.request.NOCTypeID).Name;
    if (OldNOCtype == 'PNOC') {
      this.ShowOldNOCType = false;
      this.request.NOCExpireDate = '';
    }
    else {
      this.ShowOldNOCType = true;
    }
  }

  public ExpiryMinDate: Date = new Date;
  SetExpiryDate() {
    const NOCReceivedDate = new Date(this.request.NOCReceivedDate);
    NOCReceivedDate.setFullYear(NOCReceivedDate.getFullYear());
    this.ExpiryMinDate = new Date(NOCReceivedDate.getFullYear(), NOCReceivedDate.getMonth(), NOCReceivedDate.getDate());
    //this.request.DateOfAppointment = '';
    //this.request.DateOfJoining = '';
  }

  public file: any = '';
  async ValidateDocumentImage(event: any) {
    try {
      this.loaderService.requestStarted();
      if (event.target.files && event.target.files[0]) {
        //if (event.target.files[0].type === 'image/jpeg' ||
        //  event.target.files[0].type === 'application/pdf' ||
        //  event.target.files[0].type === 'image/jpg') {
        if (event.target.files[0].type === 'application/pdf') {
          if (event.target.files[0].size > 2000000) {
            event.target.value = '';
            this.toastr.warning('Select less then 2MB File');
            return
          }
          if (event.target.files[0].size < 100000) {
            event.target.value = '';
            this.toastr.warning('Select more then 100kb File');
            return
          }
        }
        else {
          event.target.value = '';
          this.toastr.warning('Select Only pdf file');
          return
        }

        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.request.UploadNOCDoc = data['Data'][0]["FileName"];
            this.request.UploadNOCDocPath = data['Data'][0]["FilePath"];
            this.request.Dis_FileName = data['Data'][0]["Dis_FileName"];
            this.IsUploadDocRequried = false;
            this.showImageFilePath = true;
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

  async DeleteImage() {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.fileUploadService.DeleteDocument(this.request.UploadNOCDoc).then(async (data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.request.UploadNOCDoc = '';
          this.request.UploadNOCDocPath = '';
          this.request.Dis_FileName = '';
          this.showImageFilePath = false;
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
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

  async GetOldNOCDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, OldNocID: number) {
    try {
      this.loaderService.requestStarted();
      await this.oldnocdetailService.GetOldNOCDetailList_DepartmentCollegeWise(DepartmentID, CollegeID, OldNocID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.OldNocDetails = data['Data'];
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

  async DeleteOldNocDetail(OldNocID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.oldnocdetailService.DeleteOldNocDetail(OldNocID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              this.GetOldNOCDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          }, error => {
            this.toastr.warning("Unable to connect to server .!");
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

  async EditItem(OldNocID: number) {
    try {
      this.isSubmitted = false;
      this.isDisabled = false;
      this.IsUploadDocRequried = false;
      this.loaderService.requestStarted();
      await this.oldnocdetailService.GetOldNOCDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, OldNocID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request = data['Data'][0];
          debugger;
          await this.GetCourseList('CourseEditList', OldNocID);
          await this.GetSubjectList(this.request.CourseID, 'SubjectEditList', OldNocID);

          //this.GetSubjectList(this.request.CourseID);

          this.SelectedSubjectDetails = this.request.SubjectData;
          await this.OnChangeOldNOCType();
          this.request.UploadNOCDoc = this.request.UploadNOCDoc;
          this.request.UploadNOCDocPath = this.request.UploadNOCDocPath;
          this.request.Dis_FileName = this.request.Dis_FileName;
          console.log(this.request);
          this.showImageFilePath = true;
          this.isDisabled = true;
          const btnAdd = document.getElementById('btnAddNOCDetail')
          if (btnAdd) { btnAdd.innerHTML = "Update"; }

          const btnAddReset = document.getElementById('btnAddReset')
          if (btnAddReset) { btnAddReset.innerHTML = "Cancel"; }

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

  async ResetControl() {
    try {
      this.loaderService.requestStarted();
      this.request = new OldNocDetailsDataModel();
      this.request.CollegeID = this.SelectedCollageID;
      this.ShowOldNOCType = false;
      this.SubjectDataModel = [];
      this.SelectedSubjectDetails = [];

      await this.GetCourseList();

      this.isSubmitted = false;
      this.isDisabled = false;
      this.showImageFilePath = false;
      this.isToDisable = true;
      const btnAdd = document.getElementById('btnAddNOCDetail')
      if (btnAdd) { btnAdd.innerHTML = '<i class="fa fa-plus"></i>&nbsp;Add & Save'; }

      const btnAddReset = document.getElementById('btnAddReset')
      if (btnAddReset) { btnAddReset.innerHTML = "Reset"; }
      this.GetOldNOCDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
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
