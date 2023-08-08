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
import { HostelDetailService } from '../../../Services/Tabs/hostel-details.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../../Common/GlobalConstants'


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


  public DefaultWidthMin: number = 0;
  public DefaultLengthMin: number = 0;



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
  public HostelCategoryList: any = [];


  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;


  readonly imageUrlPath = GlobalConstants.ImagePathURL;

  constructor(private courseMasterService: CourseMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private clipboard: Clipboard, private fileUploadService: FileUploadService, private hostelDetailService: HostelDetailService, private modalService: NgbModal) {

  }

  async ngOnInit() {

    this.HostelForm = this.formBuilder.group(
      {
        rbHostelCampus: ['', Validators.required],
        ddlHostelCategoryID: ['', [DropdownValidators]],
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
        ddlTehsilID: ['', [DropdownValidators]],
        ddlPanchayatSamitiID: ['', [DropdownValidators]],
        txtCityTownVillage: ['', Validators.required],
        txtPincode: ['', [Validators.required, Validators.pattern(this.PinNoRegex)]],

      })

    this.HostelDetailsForm = this.formBuilder.group(
      {
        ddlCourse: ['', [DropdownValidators]],
        txtNoOf: ['', Validators.required],
        txtWidth: ['', Validators.required],
        txtLength: ['', Validators.required],
        txtStudentCapacity: ['', Validators.required],
        // fileImageFileName: ['', Validators.required], 
        hostel_fileImageFileName: [''],

      });

    this.request.HostelDetails = []

    const ddlCourse = document.getElementById('ddlCourse')
    if (ddlCourse) ddlCourse.focus();

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.SelectedDepartmentID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString())
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.LoadMaster();

    // load
    await this.GetHostelCategory();
    await this.GetDivisionList();
    await this.GetHostelDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0)
  }
  get Hform() { return this.HostelForm.controls; }
  get form() { return this.HostelDetailsForm.controls; }

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
      this.loaderService.requestStarted();
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

  async ddlCourse_change($event: any, SeletedCourseID: any) {
    this.hosteldetail.CourseID = SeletedCourseID;
    this.hosteldetail.Width = null;
    this.hosteldetail.Length = null;

    this.WidthMin = null;
    this.LengthMin = null;
    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';


    console.log(SeletedCourseID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetOtherInformationSize(this.hosteldetail.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RoomSizeDataList = data['Data'];

          //this.WidthMin = this.RoomSizeDataList[0]['WidthMin'];
          //this.LengthMin = this.RoomSizeDataList[0]['LengthMin'];

          this.DefaultWidthMin = this.RoomSizeDataList[0]['WidthMin'];
          this.DefaultLengthMin = this.RoomSizeDataList[0]['LengthMin'];

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
    try {
      this.loaderService.requestStarted();
      this.isHostelSubmitted = true;
      this.isImageFile = false;
      this.isFormValid = true;

      //this.isFormValid = this.ValidateForm();

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

      if (Number(this.hosteldetail.Width * this.hosteldetail.Length) < this.WidthMin) {
        this.CssClass_TextDangerWidth = 'text-danger';
        this.isFormValid = false;
      }
      if (this.hosteldetail.ImageFileName == '') {
        this.isImageFile = true;
        this.isValidImageFile = true;
        this.isFormValid = false;
        this.DocumentValidMessage = 'This field is required .!';
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
          NoOf: this.hosteldetail.NoOf,
          Width: this.hosteldetail.Width,
          Length: this.hosteldetail.Length,
          StudentCapacity: this.hosteldetail.StudentCapacity,
          ImageFileName: this.hosteldetail.ImageFileName,
          Dis_FileName: this.hosteldetail.Dis_FileName,
          HostelBlockName: this.hosteldetail.HostelBlockName,
          ImageFilePath: this.hosteldetail.ImageFilePath
        });
      }
      //console.log(this.request.HostelDetails);
      this.ResetHospitalDetails();
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

  ResetHospitalDetails() {
    try {
      this.loaderService.requestStarted();
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
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
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

  async ValidateDocumentImage(event: any, Type: string) {
    this.DocumentValidMessage = '';
    this.loaderService.requestStarted();
    try {
      this.isImageFile = false;
      this.isValidRentDocument = false;
      if (event.target.files && event.target.files[0]) {
        if ((Type != 'RentDocument' && (event.target.files[0].type === 'image/jpeg' ||
          event.target.files[0].type === 'image/jpg')) ||
          (Type == 'RentDocument' && event.target.files[0].type === 'application/pdf')) {
          if (event.target.files[0].size > 2000000) {
            event.target.value = '';
            this.ResetFiles(Type, false, '', '', '', true);
            this.DocumentValidMessage = 'Select less then 2MB File';
            return
          }
          if (event.target.files[0].size < 100000) {
            event.target.value = '';
            this.ResetFiles(Type, false, '', '', '', true);
            this.DocumentValidMessage = 'Select more then 100kb File';
            return
          }
        }
        else {
          event.target.value = '';
          let msg = 'Select Only ';
          if (Type == 'RentDocument') {
            msg += 'pdf file';
          }
          else if (Type == 'ImageFile') {
            msg += 'jpg/jpeg';
          }
          this.ResetFiles(Type, false, '', '', '', true);
          this.DocumentValidMessage = msg;

          return
        }
        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFiles(Type, true, data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"], false);
            event.target.value = '';
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
    } catch (ex) {

    }
    finally {
      this.loaderService.requestEnded();
    }
  }
  ResetFiles(Type: string, isShow: boolean, fileName: string, filePath: string, dis_Name: string, isValidate: boolean) {
    try {
      this.loaderService.requestStarted();
      if (Type == 'RentDocument' || Type == 'All') {
        this.isValidRentDocument = isValidate;
        this.showRentDocument = isShow;
        this.request.RentDocument = fileName;
        this.request.RentDocumentPath = filePath;
        this.request.RentDocument_Dis_FileName = dis_Name;
        this.file = document.getElementById('RentDocument');
        this.file.value = '';
      }
      if (Type == 'ImageFile' || Type == 'All') {
        this.showImageFile = isShow;
        this.hosteldetail.ImageFileName = fileName;
        this.hosteldetail.ImageFilePath = filePath;
        this.hosteldetail.Dis_FileName = dis_Name;
        this.isImageFile = isValidate;
        this.file = document.getElementById('fImageUpload');
        this.file.value = '';
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async SaveData() {
    debugger
    try {
      this.isFormValid = this.ValidateForm();
      if (this.HostelForm.invalid) {
        this.isFormValid = false;
        console.log(this.HostelForm);
      }
      
      if (!this.isFormValid) {
        return;
      }
      if (this.request.HostelDetails.length <= 0) {
        this.isFormValid = false;
        this.toastr.error('please add atleast one hostel block details');
      }
      //loding
      this.loaderService.requestStarted();
      //some data
      if (this.request.HostelDetailID > 0) {
        this.request.ModifyBy = 1;
      }
      else {
        this.request.CreatedBy = 1;
        this.request.ModifyBy = 1;
      }
      this.request.DepartmentID = this.SelectedDepartmentID;
      this.request.DepartmentID = this.SelectedDepartmentID;
      this.request.CollegeID = this.SelectedCollageID;
      //post
      await this.hostelDetailService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
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

    if (this.request.HostelType == 'Rent') {
      if (this.request.OwnerName == '' || this.request.OwnerContactNo == '' || this.request.FromDate == '' || this.request.ToDate == '') {
        this.isOwnerName = this.request.OwnerName == '' ? true : false;
        this.isOwnerContactNo = this.request.OwnerContactNo == '' ? true : false;
        this.isRentDocument = this.request.RentDocument == '' ? true : false;
        this.isFromDate = this.request.FromDate == '' ? true : false;
        this.isToDate = this.request.ToDate == '' ? true : false;
        this.isFormValid = false;
      }
      if (this.request.RentDocument == '') {
        this.isValidRentDocument = true;
        this.DocumentValidMessage = 'This field is required .!';
        this.isFormValid = false;
      }
      //debugger
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

  async DeleteImage(Type: string, fileName: string) {
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      // delete from server folder
      await this.fileUploadService.DeleteDocument(fileName).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.ResetFiles(Type, false, '', '', '', false);
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }

  }

  async EditHostelBlockDetail(Item: any, idx: number) {
    this.CurrentIndex = idx;
    this.isDisabledGrid = true;
    this.hosteldetail = Item;
    this.hosteldetail.ImageFilePath = this.hosteldetail.ImageFilePath;
    this.hosteldetail.ImageFileName = this.hosteldetail.ImageFileName;
    this.hosteldetail.Dis_FileName = this.hosteldetail.Dis_FileName;
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
          this.IsRuralOrUrban(null);
          this.IsHostelCampusOrNot();
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

  async GetHostelCategory() {
    try {
      // loading
      this.loaderService.requestStarted();
      // get
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(0, "HostelCategory")
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.HostelCategoryList = data['Data'];
          //msg
          if (this.State != 0) {
            this.toastr.error(this.ErrorMessage);
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

  ResetControl() {
    try {
      this.loaderService.requestStarted();
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
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async IsRuralOrUrban(section: string) {
    //debugger
    try {
      this.loaderService.requestStarted();
      if (section == 'nearest') {

      }
      else {
        if (this.request.IsRuralUrban == 'Rural') {
          this.HostelForm.get('ddlTehsilID')?.setValidators([DropdownValidators]);
          this.HostelForm.get('ddlPanchayatSamitiID')?.setValidators([DropdownValidators]);
        }
        else {
          this.HostelForm.get('ddlTehsilID')?.clearValidators();
          this.HostelForm.get('ddlPanchayatSamitiID')?.clearValidators();
        }
        // update
        this.HostelForm.get('ddlTehsilID')?.updateValueAndValidity();
        this.HostelForm.get('ddlPanchayatSamitiID')?.updateValueAndValidity();
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

  async IsHostelCampusOrNot() {
    //debugger
    try {
      this.loaderService.requestStarted();
      if (this.request.IsHostelCampus == 'No') {
        this.HostelForm.get('txtCollegeDistance')?.setValidators(Validators.required);
        this.HostelForm.get('rdHostelType')?.setValidators(Validators.required);
      }
      else {
        this.HostelForm.get('txtCollegeDistance')?.clearValidators();
        this.HostelForm.get('rdHostelType')?.clearValidators();
      }
      this.HostelForm.get('txtCollegeDistance')?.updateValueAndValidity();
      this.HostelForm.get('rdHostelType')?.updateValueAndValidity();
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



  async ViewItem(content: any, HostelDetailID: number) {
    this.request = new HostelDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.hostelDetailService.GetHostelDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, HostelDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request = data['Data'][0];
          if (this.request.HostelType == 'Rent') {
            this.showRentDocument = true;
          }
          this.request.RentDocumentPath = this.imageUrlPath + this.request.RentDocument;

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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //validation

  alphaOnly(event: any): boolean {  // Accept only alpha, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  alphanumbersOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }


  onKeyChange(searchValue: any): void {
    this.WidthMin = searchValue.target.value * this.DefaultWidthMin;
    this.LengthMin = searchValue.target.value * this.DefaultLengthMin;
    // console.log(searchValue.target.value);
  }



}






