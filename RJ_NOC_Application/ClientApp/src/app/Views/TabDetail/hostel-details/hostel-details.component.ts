import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HostelDataModel, HostelDetailsDataModel_Hostel } from '../../../Models/HostelDetailsDataModel';
import { CourseMasterService } from '../../../Services/Master/AddCourse/course-master.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { HostelDetailService } from '../../../Services/HostelDetail/hostel-detail.service';
/*import * as jsPDF from 'jspdf'*/

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';


@Injectable()

@Component({
  selector: 'app-hostel-details',
  templateUrl: './hostel-details.component.html',
  styleUrls: ['./hostel-details.component.css']
})

export class HostelDetailsComponent implements OnInit {

  //Add FormBuilder
  HostelDetailsForm !: FormGroup;
  HostelForm !: FormGroup;

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new HostelDataModel();
  hosteldetail = new HostelDetailsDataModel_Hostel();
  public hostelDataModel: HostelDataModel[] = [];
  public DivisionList: any = [];
  public PinNoRegex = new RegExp(/[0-9]{6}/)
  public IsRural: boolean = false;
  public DistrictList_Nearest: any = [];
  public DistrictList: any = [];
  public SuvdivisionList: any = [];
  public TehsilList_Nearest: any = [];
  public TehsilList: any = [];
  public PanchyatSamitiList_Nearest: any = [];
  public PanchyatSamitiList: any = [];
  public ParliamentAreaList: any = [];
  public AssembelyAreaList: any = [];
  public isFromDate: boolean = false;
  public isToDate: boolean = false;



  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  isEdit: boolean = false;
  isDisabled: boolean = false;

  public isView: boolean = true;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;
  public isDeleteButton: boolean = true;
  public isPrint: boolean = true;
  public isOwnerName: boolean = false;
  public isOwnerContactNo: boolean = false;
  public isRentDocument: boolean = false;
  public isValidOwnerContactNo: boolean = false;
  public isValidRentDocument: boolean = false;
  public CurrentPageName: any = "";
  public DocumentValidMessage: string = '';

  public UserID: number = 0;
  public collegeDataList: any = [];
  public departmentMasterData: any = [];
  public courseDataList: any = [];
  public subjectDataList: any = [];
  public RoomSizeDataList: any = [];
  public seatInformationDataList: any = [];
  public courseTypeDataList: any = [];
  public AllCourseList: any = [];

  searchText: string = '';
  public LoginSSOID: string = '';
  public LoginSocietyName: string = 'Society Name';
  sSOLoginDataModel = new SSOLoginDataModel();


  public dropdownList: any = [];
  public dropdownSettings: IDropdownSettings = {};
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public WidthMin: number = 0;
  public LengthMin: number = 0;
  public CssClass_TextDangerWidth: string = '';
  public CssClass_TextDangerLength: string = '';

  public IsTehsilRequried: boolean = false;
  public IsPanchyatSamitiRequried: boolean = false;

  public isImageFile: boolean = false;
  public isValidImageFile: boolean = false;

  public showImageFile: boolean = false;
  public showRentDocument: boolean = false;
  public isHostelSubmitted: boolean = false;

  public file: any = '';
  public CurrentIndex: number = -1;
  public MaxFromDate: Date = new Date();
  public MinToDate: Date = new Date();
  readonly imageUrlPath = 'http://localhost:62778/ImageFile/';

  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard, private fileUploadService: FileUploadService, private hostelDetailService: HostelDetailService) {

  }
  async ngOnInit() {
    this.HostelDetailsForm = this.formBuilder.group(
      {
        ddlCourse: ['', [DropdownValidators]],
        txtWidth: ['', Validators.required],
        txtLength: ['', Validators.required],
        txtStudentCapacity: ['', Validators.required],
        // fileImageFileName: ['', Validators.required], 
        hostel_fileImageFileName: [''],

      });
    this.HostelForm = this.formBuilder.group(
      {
        rbHostelCampus: ['', Validators.required],
        txtHostelName: ['', Validators.required],
        txtContactPersonName: ['', Validators.required],
        txtContactPersonNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
        txtCollegeDistance: ['', Validators.required],
        rdHostelType: ['', Validators.required],
        txtOwnerName: [''],
        txtOwnerContactNo: [''],
        RentDocument: [''],
        dtFromDate: [''],
        dtToDate: [''],

        txtAddressLine1: ['', Validators.required],
        txtAddressLine2: ['', Validators.required],
        RuralUrban: ['', Validators.required],
        ddlDivisionID: ['', [DropdownValidators]],
        ddlDistrictID: ['', [DropdownValidators]],
        ddlTehsilID: [''],
        ddlPanchayatSamitiID: [''],
        txtCityTownVillage: ['', Validators.required],
        txtPincode: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],

      })
    this.request.HostelDetails = []
    const ddlCourse = document.getElementById('ddlCourse')
    if (ddlCourse) ddlCourse.focus();

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.SelectedDepartmentID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString())
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.LoadMaster();

    await this.GetDivisionList();
    await this.GetHostelDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0)
  }
  get form() { return this.HostelDetailsForm.controls; }
  get Hform() { return this.HostelForm.controls; }

  LoadMaster() {
    try {
      this.loaderService.requestStarted();
      this.commonMasterService.OtherInformationList_DepartmentAndTypeWise(this.SelectedDepartmentID, "HostelBlock")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.courseDataList = data['Data'];
          console.log(this.courseDataList);
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
  async GetDivisionList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionList = data['Data'];
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
  async FillDivisionRelatedDDL() {
    try {
      this.loaderService.requestStarted();
      // college status
      await this.commonMasterService.GetDistrictByDivsionId(this.request.DivisionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DistrictList = data['Data'];
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
  async FillDistrictRelatedDDL() {
    try {
      // subdivision list
      await this.commonMasterService.GetSuvdivisionByDistrictId(this.request.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SuvdivisionList = data['Data'];
        }, error => console.error(error));
      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(this.request.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TehsilList = data['Data'];
        }, error => console.error(error));
      // PanchyatSamiti list
      await this.commonMasterService.GetPanchyatSamitiByDistrictId(this.request.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PanchyatSamitiList = data['Data'];

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
  ddlCourse_change($event: any, SeletedCourseID: any) {
    this.hosteldetail.CourseID = SeletedCourseID;
    this.hosteldetail.Width = 0;
    this.hosteldetail.Length = 0;

    this.WidthMin = 0;
    this.LengthMin = 0;
    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';


    console.log(SeletedCourseID);
    try {
      this.loaderService.requestStarted();
      this.commonMasterService.GetOtherInformationSize(this.hosteldetail.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RoomSizeDataList = data['Data'];

          this.WidthMin = this.RoomSizeDataList[0]['WidthMin'];
          this.LengthMin = this.RoomSizeDataList[0]['LengthMin'];
          console.log(this.RoomSizeDataList);
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
  async btnAdd_Click() {
 
    this.isHostelSubmitted = true;
    this.isImageFile = false;
    //this.isFormValid = this.ValidateForm();
    if (this.HostelForm.invalid) {
      this.isFormValid = false;
    }
    if (this.HostelDetailsForm.invalid) {
      this.isFormValid = false;
    }
    //if (this.hosteldetail.Width <= this.WidthMin) {
    //  this.CssClass_TextDangerWidth = 'text-danger';
    //  this.isFormValid = false;
    //}
    //if (this.hosteldetail.Length <= this.LengthMin) {
    //  this.CssClass_TextDangerLength = 'text-danger';
    //  this.isFormValid = false;
    //}
    if (Number(this.hosteldetail.Width * this.hosteldetail.Length) <= this.WidthMin) {
      this.CssClass_TextDangerWidth = 'text-danger';
      this.isFormValid = false;
    }
    if (this.hosteldetail.ImageFileName == '') {
      this.isImageFile = true;
      this.isFormValid = false;
    }

    if (!this.isFormValid) {
      return;
    }
    //Show Loading
    if (this.CurrentIndex != -1) {
      this.request.HostelDetails.splice(this.CurrentIndex, 1, this.hosteldetail);
    }
    else {
      this.request.HostelDetails.push({
        HostelBlockDetailID: 0,
        CollegeWiseRoomID: 0,
        CourseID: this.hosteldetail.CourseID,
        CourseName: this.courseDataList.find((x: { ID: number; }) => x.ID == this.hosteldetail.CourseID).Name,
        DepartmentID: this.hosteldetail.DepartmentID,
        Width: this.hosteldetail.Width,
        Length: this.hosteldetail.Length,
        StudentCapacity: this.hosteldetail.StudentCapacity,
        ImageFileName: this.hosteldetail.ImageFileName,
        ActiveStatus: false,
        DeleteStatus: false,
        HostelBlockName: this.hosteldetail.HostelBlockName,
        ImageFilePath: this.hosteldetail.ImageFileName
      });
    }
    console.log(this.request.HostelDetails);
    this.hosteldetail = new HostelDetailsDataModel_Hostel();
    this.showImageFile = false;
    this.WidthMin = 0;
    this.LengthMin = 0;
    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';
    this.isSubmitted = false;

    this.CurrentIndex = -1;
    const btnAdd = document.getElementById('btnAdd')
    if (btnAdd) { btnAdd.innerHTML = "Add"; }
    this.isDisabledGrid = false;
    this.isHostelSubmitted = false;
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  ValidateDocumentImage(event: any, Type: string) {
    this.isImageFile = false;
    this.isValidRentDocument = false;
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'image/jpeg' ||
        event.target.files[0].type === 'application/pdf' ||
        event.target.files[0].type === 'image/jpg') {
        if (event.target.files[0].size > 2000000) {
          event.target.value = '';
          if (Type == 'RentDocument') {
            this.isValidRentDocument = true;
            this.request.RentDocument = '';
          }
          else if (Type == 'ImageFile') {
            this.hosteldetail.ImageFileName = '';
            this.isImageFile = true;
          }
          this.DocumentValidMessage = 'Select less then 2MB File';
          return
        }
        if (event.target.files[0].size < 100000) {
          event.target.value = '';
          if (Type == 'RentDocument') {
            this.isValidRentDocument = true;
            this.request.RentDocument = '';
          }
          else if (Type == 'ImageFile') {
            this.hosteldetail.ImageFileName = '';
            this.isImageFile = true;
          }
          this.DocumentValidMessage = 'Select more then 100kb File';
          return
        }
      }
      else {
        event.target.value = '';
        if (Type == 'RentDocument') {
          this.isValidRentDocument = true;
          this.request.RentDocument = '';
        }
        else if (Type == 'ImageFile') {
          this.hosteldetail.ImageFileName = '';
          this.isImageFile = true;
        }
        this.DocumentValidMessage = 'Select Only jpg/jpeg/pdf file';

        return
      }
      this.file = event.target.files[0];
      this.fileUploadService.UploadDocument(this.file).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == 'RentDocument') {
            this.showRentDocument = true;
            this.request.RentDocument = data['Data'][0]["FileName"];
            this.request.RentDocumentPath = data['Data'][0]["FilePath"];
          }
          else if (Type == 'ImageFile') {
            this.showImageFile = true;
            this.hosteldetail.ImageFileName = data['Data'][0]["FileName"];
            this.hosteldetail.ImageFilePath = data['Data'][0]["FilePath"];

          }
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

  async SaveData() {
    try {
      this.isFormValid = this.ValidateForm();
      if (this.HostelForm.invalid) {
        this.isFormValid = false;
      }
      if (this.request.HostelDetails.length <= 0) {
        this.isFormValid = false;
        this.toastr.warning('please add atleast one hostel block details');
      }
      if (!this.isFormValid) {
        return;
      }
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.SelectedDepartmentID;
      this.request.CollegeID = this.SelectedCollageID;
      await this.hostelDetailService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            //console.log(data['Data']);
            this.toastr.success(this.SuccessMessage);
            this.ResetControl()
            this.GetHostelDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
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
    //this.routers.navigate(['/addcollege']);
  }

  ValidateForm(): boolean {
    this.isFormValid = true;
    this.isSubmitted = true;
    this.IsTehsilRequried = false;
    this.IsPanchyatSamitiRequried = false;
    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';
    if (this.request.IsRuralUrban == 'Rural') {
      if (this.request.TehsilID == 0) {
        this.isFormValid = false;
        this.IsTehsilRequried = true;
      }
      if (this.request.PanchayatSamitiID == 0) {
        this.isFormValid = false;
        this.IsPanchyatSamitiRequried = true;
      }
    }

    if (this.request.HostelType == 'Rent') {
      if (this.request.OwnerName == '' || this.request.OwnerContactNo == '' || this.request.RentDocument == '' || this.request.FromDate == '' || this.request.ToDate == '') {
        this.isOwnerName = this.request.OwnerName == '' ? true : false;
        this.isOwnerContactNo = this.request.OwnerContactNo == '' ? true : false;
        this.isRentDocument = this.request.RentDocument == '' ? true : false;
        this.isFromDate = this.request.FromDate == '' ? true : false;
        this.isToDate = this.request.ToDate == '' ? true : false;
        this.isFormValid = false;
      }
      if (this.isOwnerContactNo == false) {
        if (this.request.OwnerContactNo.length != 10) {
          this.isValidOwnerContactNo = true;
          this.isFormValid = false;
        }
        else {
          this.isValidOwnerContactNo = false;
        }
      }

    }
    return this.isFormValid;
  }

  DeleteImage(Type: string) {
    if (Type == 'RentDocument') {
      this.showRentDocument = false;
      this.request.RentDocument = '';
    }
    else if (Type == 'ImageFile') {
      this.showImageFile = false;
      this.hosteldetail.ImageFileName = '';
    }
  }

  async EditHostelBlockDetail(Item: any, idx: number) {
    this.CurrentIndex = idx;
    this.isDisabledGrid = true;
    this.hosteldetail = Item;
    this.hosteldetail.ImageFilePath = this.imageUrlPath + this.hosteldetail.ImageFileName;
    this.showImageFile = true;
    const btnAdd = document.getElementById('btnAdd')
    if (btnAdd) { btnAdd.innerHTML = "Update"; }
  }

  async DeleteHostelBlockDetail(i: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.HostelDetails.splice(i, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  SetToDate() {
    const FromDate = new Date(this.request.FromDate);
    FromDate.setFullYear(FromDate.getFullYear());
    this.MinToDate = new Date(FromDate.getFullYear(), FromDate.getMonth(), FromDate.getDate());
    this.request.ToDate = '';
  }


  async GetHostelDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, HostelDetailID: number) {
    try {
      this.loaderService.requestStarted();
      await this.hostelDetailService.GetHostelDetailList_DepartmentCollegeWise(DepartmentID, CollegeID, HostelDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.hostelDataModel = data['Data'];
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

  async DeleteHostelDetails(HostelDetailID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.hostelDetailService.DeleteHostelDetail(HostelDetailID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              this.GetHostelDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
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

  async EditItem(HostelDetailID: number) {
    try {
      this.isDisabled = false;
      this.loaderService.requestStarted();
      await this.hostelDetailService.GetHostelDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, HostelDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request = data['Data'][0];
          this.FillDivisionRelatedDDL();
          this.FillDistrictRelatedDDL();
          this.isDisabled = true;
          if (this.request.HostelType == 'Rent') {
            this.showRentDocument = true;
          }
          this.request.RentDocumentPath = this.imageUrlPath + this.request.RentDocument;
          const btnAdd = document.getElementById('btnSave')
          if (btnAdd) { btnAdd.innerHTML = "Update"; }
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

  ResetControl() {
    this.request = new HostelDataModel();
    this.isSubmitted = false;
    this.WidthMin = 0;
    this.LengthMin = 0;
    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';
    this.IsTehsilRequried = false;
    this.IsPanchyatSamitiRequried = false;
    this.isImageFile = false;
    this.isValidImageFile = false;
    this.showImageFile = false;
    this.showRentDocument = false;
    this.isHostelSubmitted = false;
    this.isDisabled = false;
    const btnAdd = document.getElementById('btnSave')
    if (btnAdd) {
      btnAdd.innerHTML = "Save";
    }
  }
}






