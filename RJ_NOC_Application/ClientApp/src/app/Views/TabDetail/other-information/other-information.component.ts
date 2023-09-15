import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OtherInformationDataModel } from '../../../Models/OtherInformationDataModel';
import { OtherInformationService } from '../../../Services/OtherInformation/other-information.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
/*import * as jsPDF from 'jspdf'*/

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';
import { debug } from 'console';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { PostCollegeLabInformation } from '../../../Models/CollegeLabInformationDataModel';
import { EnumDepartment } from '../../../Common/enum-noc';



@Injectable()

@Component({
  selector: 'app-other-information',
  templateUrl: './other-information.component.html',
  styleUrls: ['./other-information.component.css']
})

export class OtherInformationComponent implements OnInit {

  //Add FormBuilder
  OtherInformationForm !: FormGroup;

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new OtherInformationDataModel();

  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  isEdit: boolean = false;
  public files: File = null;

  public isView: boolean = true;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;
  public isDeleteButton: boolean = true;
  public isPrint: boolean = true;
  public CurrentPageName: any = "";

  public UserID: number = 0;
  public courseDataList: any[] = [];
  public RoomSizeDataList: any = [];
  public OtherInformation: any = [];

  public CollegeWiseLabSubject: any = [];
  public CollegeWiseLabViewDetails: any = [];

  searchText: string = '';
  public LoginSSOID: string = '';
  public LoginSocietyName: string = 'Society Name';
  sSOLoginDataModel = new SSOLoginDataModel();
  public ImageValidate: string = '';

  public dropdownList: any = [];
  public dropdownSettings: IDropdownSettings = {};
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public WidthMin: number = 0;
  public AnnexurePath: string = '';
  public AnnexurePath2: string = '';
  public LengthMin: number = 0;
  public CssClass_TextDangerWidth: string = 'text-danger';
  public CssClass_TextDangerLength: string = 'text-danger';
  public CssClass_TextDangerNoOfRooms: string = 'text-danger';
  public ShowHideBook: boolean = false;
  public ShowHideComputers: boolean = false;
  public isBookRequired: boolean = false;
  public isNoofBookRequired: boolean = false;
  public isNoofComputersRequired: boolean = false;

  isUploadImage: boolean = false;
  public isValidImageFilePath: boolean = false;
  public isValidBookImageFilePath: boolean = false;
  public showImageFilePath: boolean = false;
  public showBookImageFilePath: boolean = false;
  public ReqNoofComputers: number = 10;
  public Dis_ReqNoofComputers: number = 10;


  public ShowHideLabData: boolean = false;

  // ssologin model
  ssoLoginModel = new SSOLoginDataModel();
  requestSaveLab = new PostCollegeLabInformation();


  public ImageValidationMessage: string = '';
  public file: any = '';
  @ViewChild('fileUploadImage')
  fileUploadImage: ElementRef<HTMLInputElement> = {} as ElementRef;

  public MinNoOfRooms: number = 0;
  public LengthMin_Dis: number = 0;
  public WidthMin_Dis: number = 0;

  constructor(private otherInformationService: OtherInformationService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute,
    private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService, private clipboard: Clipboard) { }


  async ngOnInit() {
    this.OtherInformationForm = this.formBuilder.group(
      {
        OtherInformation_ddlCourse: ['', [DropdownValidators]],
        txtNoOfRooms_Room: ['', [Validators.required, Validators.min(1)]],
        OtherInformation_txtWidth: ['', [Validators.required, Validators.min(1)]],
        //OtherInformation_txtLength: ['', [Validators.required, Validators.min(1), Validators.max(500000)]],
        fileUploadImage: [''],
        fileUploadBookImage: [''],
        OtherInformation_Noofbooks: [''],
        OtherInformation_NoofComputers: [''],
        txtsearchText: [''],

      })

    const ddlCourse_Room = document.getElementById('ddlCourse_Room')
    if (ddlCourse_Room) ddlCourse_Room.focus();
    this.UserID = 1;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.request.DepartmentID = this.SelectedDepartmentID;
    this.LoadMaster();
    this.GetOtherInformationAllList();



  }
  get form() { return this.OtherInformationForm.controls; }


  LoadMaster() {
    try {
      this.loaderService.requestStarted();
      this.commonMasterService.OtherInformationList_DepartmentAndTypeWise(this.SelectedDepartmentID, "OtherInformation")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.courseDataList = data['Data'];
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
    this.request.Width = 0;
    this.request.Length = 0;

    this.WidthMin = 0;
    this.AnnexurePath = '';
    this.AnnexurePath2 = '';
    this.LengthMin = 0;
    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';
    this.CssClass_TextDangerNoOfRooms = '';
    try {
      var OtherName = this.courseDataList.find((x: { ID: number; }) => x.ID == this.request.CourseID)?.Name;
      if (OtherName == 'Library' || OtherName == 'Library Room' || OtherName == ' Library Room ') {
        this.ShowHideBook = true;
      }
      else {
        this.ShowHideBook = false;
      }
      if (OtherName == 'Computer' || OtherName == 'Computer Room' || OtherName == ' Computer Room ') {
        this.ShowHideComputers = true;
      }
      else {
        this.ShowHideComputers = false;
      }


      if (this.request.DepartmentID == EnumDepartment.CollegeEducation) {
        if (OtherName == 'Laboratory') {
          this.ShowHideLabData = true;
          this.GetCollegeLabInformationList("GetData");
        }
        else
        {
          this.CollegeWiseLabSubject = [];
          this.ShowHideLabData = false;
        }

      }
      else {
        this.CollegeWiseLabSubject = [];
        this.ShowHideLabData = false;
      }
      


      this.loaderService.requestStarted();
      this.commonMasterService.GetOtherInformationSize(this.request.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RoomSizeDataList = data['Data'];

          this.WidthMin = this.RoomSizeDataList[0]['WidthMin'];
          this.WidthMin_Dis = this.RoomSizeDataList[0]['WidthMin'];
          this.LengthMin = this.RoomSizeDataList[0]['LengthMin'];
          this.LengthMin_Dis = this.RoomSizeDataList[0]['LengthMin'];
          this.MinNoOfRooms = this.RoomSizeDataList[0]['NoOfRooms'];
          this.AnnexurePath = this.RoomSizeDataList[0]['AnnexurePath'];
          this.AnnexurePath2 = this.RoomSizeDataList[0]['AnnexurePath2'];
        }, error => console.error(error));

      let NoofStudents = 0;
      if ((OtherName == 'Library' || OtherName == 'Library Room' || OtherName == ' Library Room ') && this.SelectedDepartmentID == 2) {
        try {
          this.loaderService.requestStarted();
          await this.commonMasterService.GetCourseLevelByCollegeIDAndDepartmentID(this.SelectedCollageID, this.SelectedDepartmentID)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              NoofStudents = data['Data'][0]['data'][0].SeatsValue;
            }, error => console.error(error));
          if (NoofStudents > 50) {
            this.MinNoOfRooms = 2;
          }
          else {
            this.MinNoOfRooms = 1;
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
  async ValidateUploadImage(event: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.isValidImageFilePath = false;
      this.isValidBookImageFilePath = false;
      debugger;
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/jpg' || event.target.files[0].type === 'application/pdf'
          || event.target.files[0].type === 'application/Pdf' || event.target.files[0].type === 'application/PDF') {
          if (event.target.files[0].size > 2000000) {
            this.ImageValidationMessage = 'Select less then 2MB File';
            if (Type == 'ImageFile') {
              this.isValidImageFilePath = true;
              this.request.ImageFileName = '';
              this.request.ImageFilePath = '';
              this.request.Image_Dis_FileName = '';
            }
            else if (Type == 'UploadBook') {
              this.isValidBookImageFilePath = true;
              this.request.BookImageFileName = '';
              this.request.BookImageFilePath = '';
              this.request.BookImage_Dis_FileName = '';
            }
            return
          }
          if (event.target.files[0].size < 100000) {
            this.ImageValidationMessage = 'Select more then 100kb File';
            if (Type == 'ImageFile') {
              this.isValidImageFilePath = true;
              this.request.ImageFileName = '';
              this.request.ImageFilePath = '';
              this.request.Image_Dis_FileName = '';
            }
            else if (Type == 'UploadBook') {
              this.isValidBookImageFilePath = true;
              this.request.BookImageFileName = '';
              this.request.BookImageFilePath = '';
              this.request.BookImage_Dis_FileName = '';
            }
            return
          }
        }
        else {
          this.ImageValidationMessage = 'Select Only jpg/jpeg/PDF file';
          if (Type == 'ImageFile') {
            this.isValidImageFilePath = true;
            this.request.ImageFileName = '';
            this.request.ImageFilePath = '';
            this.request.Image_Dis_FileName = '';
          }
          else if (Type == 'UploadBook') {
            this.isValidBookImageFilePath = true;
            this.request.BookImageFileName = '';
            this.request.BookImageFilePath = '';
            this.request.BookImage_Dis_FileName = '';
          }
          return
        }

        this.file = event.target.files[0];
        try {
          await this.fileUploadService.UploadDocument(this.file).then((data: any) => {

            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              if (Type == 'ImageFile') {
                this.showImageFilePath = true;
                this.request.ImageFileName = data['Data'][0]["FileName"];
                this.request.ImageFilePath = data['Data'][0]["FilePath"];
                this.request.Image_Dis_FileName = data['Data'][0]["Dis_FileName"];
              }
              else if (Type == 'UploadBook') {
                this.showBookImageFilePath = true;
                this.request.BookImageFileName = data['Data'][0]["FileName"];
                this.request.BookImageFilePath = data['Data'][0]["FilePath"];
                this.request.BookImage_Dis_FileName = data['Data'][0]["Dis_FileName"];
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
        catch (Ex) {
          console.log(Ex);
        }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            event.target.value = '';
          }, 200);
        }
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
    this.file = document.getElementById('fileUploadImage');
    this.file.value = '';
  }
  DeleteImage(Type: string) {
    try {
      this.loaderService.requestStarted();
      if (Type == 'ImageFile') {
        this.showImageFilePath = false;
        this.request.ImageFileName = '';
        this.request.ImageFilePath = '';
        this.request.Image_Dis_FileName = '';
      }
      else if (Type == 'UploadBook') {
        this.showBookImageFilePath = false;
        this.request.BookImageFileName = '';
        this.request.BookImageFilePath = '';
        this.request.BookImage_Dis_FileName = '';
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
    this.file = document.getElementById('fileUploadImage');
    this.file.value = '';
  }
  public isformvalid: boolean = true;
  async SaveData() {
    this.isformvalid = true;
    this.isNoofBookRequired = false;

    this.isNoofComputersRequired = false;

    this.isValidImageFilePath = false;
    this.isValidBookImageFilePath = false;
    this.isSubmitted = true;
    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';
    if (this.OtherInformationForm.invalid) {
      this.isformvalid = false;
    }
    if (Number((this.request.Width) < (this.WidthMin))) {
      this.CssClass_TextDangerWidth = 'text-danger';
      this.isformvalid = false;
    }
    if (this.request.ImageFilePath == '') {
      this.ImageValidate = 'This field is required .!';
      this.isformvalid = false;
    }
    var OtherName = this.courseDataList.find((x: { ID: number; }) => x.ID == this.request.CourseID).Name;
    if (OtherName == 'Library' || OtherName == 'Library Room' || OtherName == ' Library Room ') {
      if (this.request.NoofBooks <= 0) {
        this.isNoofBookRequired = true;
        this.isformvalid = false;
      }
      if (this.request.BookImageFilePath == '') {
        this.isValidBookImageFilePath = true;
        this.ImageValidate = 'This field is required .!';
        this.isformvalid = false;
      }
    }
    this.Dis_ReqNoofComputers = this.ReqNoofComputers;
    debugger
    if ((OtherName == 'Computer' || OtherName == 'Computer Room' || OtherName == ' Computer Room ') && (this.SelectedDepartmentID == 2)) {
      if (Number(this.request.NoOfRooms) > 0) {
        if (Number(this.request.NoofComputers) < (this.ReqNoofComputers * this.request.NoOfRooms)) {
          this.isNoofComputersRequired = true;
          this.isformvalid = false;
          this.Dis_ReqNoofComputers = this.ReqNoofComputers * this.request.NoOfRooms;
        }
      }
    }


    if (Number(this.request.NoOfRooms) < Number(this.MinNoOfRooms)) {
      this.CssClass_TextDangerNoOfRooms = 'text-danger';
      this.toastr.warning('Please Enter Min No. of Rooms : ' + this.MinNoOfRooms);
      this.isformvalid = false;
    }
    if (!this.isformvalid) {
      return;
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.request.CollegeID = this.SelectedCollageID;
    this.isLoading = true;
    try {
      await this.otherInformationService.SaveData(this.request, this.files)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // get saved society
            this.LoadMaster();
            this.GetOtherInformationAllList();
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


  async ResetControl() {
    try {
      this.loaderService.requestStarted();
      const ddlCourse_Room = document.getElementById('ddlCourse_Room')
      if (ddlCourse_Room) ddlCourse_Room.focus();

      this.isSubmitted = false;
      this.request.CollegeWiseOtherInfoID = 0;
      this.request.CourseID = 0;
      this.request.Width = 0;
      this.request.Length = 0;
      this.request.NoOfRooms = 1;
      this.request.ImageFileName = '';
      this.request.ImageFilePath = '';
      this.request.Image_Dis_FileName = '';
      this.request.BookImageFileName = '';
      this.request.BookImageFilePath = '';
      this.request.BookImage_Dis_FileName = '';
      this.request.NoofBooks = 0;
      this.request.NoofComputers = 0;
      this.AnnexurePath = '';
      this.AnnexurePath2 = '';
      this.request.UserID = 0;
      this.isDisabledGrid = false;
      this.showImageFilePath = false;
      this.showBookImageFilePath = false;
      this.ShowHideBook = false;
      this.ShowHideComputers = false;
      this.ShowHideLabData = false;
      this.CollegeWiseLabSubject = [];

      this.GetOtherInformationAllList();
      const btnSave = document.getElementById('btnSave')
      if (btnSave) btnSave.innerHTML = "<i class='fa fa-plus'></i> Add &amp; Save";
      const btnReset = document.getElementById('')
      if (btnReset) btnReset.innerHTML = "Reset";

      this.file = document.getElementById('fileUploadImage');
      this.file.value = '';
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async GetOtherInformationAllList() {
    try {
      this.loaderService.requestStarted();
      await this.otherInformationService.GetOtherInformationAllList(this.UserID, this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.OtherInformation = data['Data'][0]['data'];
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

  async GetCollegeLabInformationList(key: String) {
    try {


      this.loaderService.requestStarted();
      await this.otherInformationService.GetCollegeLabInformationList(this.SelectedCollageID, key)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          debugger;
          this.CollegeWiseLabSubject = data['Data'];

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

  async ViewLabDetails()
  {
    try
    {
      this.loaderService.requestStarted();
      await this.otherInformationService.GetCollegeLabInformationList(this.SelectedCollageID, "GetDataBYID")
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeWiseLabViewDetails = data['Data'];
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

  async txtNoOfRooms_change(Val: any) {
    try {
      if (this.SelectedDepartmentID == 2) {
        this.Dis_ReqNoofComputers = this.ReqNoofComputers;
        var OtherName = this.courseDataList.find((x: { ID: number; }) => x.ID == this.request.CourseID)?.Name;
        if ((OtherName == 'Computer' || OtherName == 'Computer Room' || OtherName == ' Computer Room ') && (this.SelectedDepartmentID == 2)) {
          if (Number(this.request.NoOfRooms) > 0) {
            if (Number(this.request.NoofComputers) < (this.ReqNoofComputers * this.request.NoOfRooms)) {
              this.isNoofComputersRequired = true;
              this.isformvalid = false;
              this.Dis_ReqNoofComputers = this.ReqNoofComputers * this.request.NoOfRooms;
            }
          }
        }
      }
    }
    catch (Ex) {
      console.log(Ex);
    }

  }

  async Edit_OnClick(CollegeWiseOtherInfoID: number) {
    this.ShowHideBook = false;
    this.ShowHideComputers = false;
    this.showBookImageFilePath = false;
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.otherInformationService.GetOtherInformationByID(CollegeWiseOtherInfoID, this.UserID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.CollegeWiseOtherInfoID = data['Data'][0]["CollegeWiseOtherInfoID"];
          this.request.CollegeID = data['Data'][0]["CollegeID"];
          this.request.CourseID = data['Data'][0]["CourseID"];
          this.request.NoOfRooms = data['Data'][0]["NoOfRooms"];
          this.request.Width = data['Data'][0]["Width"];
          this.request.Length = data['Data'][0]["Length"];
          this.request.ImageFileName = data['Data'][0]["ImageFileName"];
          this.request.ImageFilePath = data['Data'][0]["ImageFilePath"];
          this.request.Image_Dis_FileName = data['Data'][0]["Image_Dis_FileName"];
          if (data['Data'][0]["NoofBooks"] != '' && data['Data'][0]["NoofBooks"] != 0 && data['Data'][0]["BookImageFileName"] != '') {
            this.ShowHideBook = true;
            this.showBookImageFilePath = true;
            this.request.NoofBooks = data['Data'][0]["NoofBooks"];
            this.request.BookImageFileName = data['Data'][0]["BookImageFileName"];
            this.request.BookImageFilePath = data['Data'][0]["BookImageFilePath"];
            this.request.BookImage_Dis_FileName = data['Data'][0]["BookImage_Dis_FileName"];
          }

          if (Number(data['Data'][0]["NoofComputers"]) > 0) {
            this.ShowHideComputers = true;
            this.request.NoofComputers = data['Data'][0]["NoofComputers"];
          }

          this.showImageFilePath = true;
          this.isDisabledGrid = true;

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Reset";
          console.log(this.request);
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async Delete_OnClick(CollegeWiseOtherInfoID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.otherInformationService.DeleteData(CollegeWiseOtherInfoID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetOtherInformationAllList();
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
    if (this.OtherInformation.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        //ws['!cols'] = [];
        //ws['!cols'][0] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "OtherInformation.xlsx");
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
    if (this.OtherInformation.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("OtherInformation", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("OtherInformation" + '.pdf');

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


  async onFilechangeItem(event: any, item: any) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type === 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          if (this.file.size < 100000) {
            this.toastr.error('Select more then 100kb File')
            return
          }
        }
        else {// type validation
          this.toastr.error('Select Only pdf file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.fileUploadService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              item.Dis_FileName = data['Data'][0]["Dis_FileName"];
              item.FileName = data['Data'][0]["FileName"];
              item.FilePath = data['Data'][0]["FilePath"];
              event.target.value = null;
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
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async onFilechangeItemOther(event: any, item: any) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type === 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          if (this.file.size < 100000) {
            this.toastr.error('Select more then 100kb File')
            return
          }
        }
        else {// type validation
          this.toastr.error('Select Only pdf file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.fileUploadService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {

              item.Dis_OtherFileName = data['Data'][0]["Dis_FileName"];
              item.FileOtherName = data['Data'][0]["FileName"];
              item.FileOtherPath = data['Data'][0]["FilePath"];
              event.target.value = null;
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
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async DeleteImageItem(item: any) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.fileUploadService.DeleteDocument(item.FileName).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          item.FileName = '';
          item.FilePath = '';
          item.Dis_FileName = '';
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

  async DeleteImageOther(item: any) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.fileUploadService.DeleteDocument(item.FileOtherName).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          item.FileOtherName = '';
          item.FileOtherPath = '';
          item.Dis_OtherFileName = '';
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


  async SaveDataLab() {

    if (this.ValidateLabDetails()) {

      this.loaderService.requestStarted();
      this.isLoading = true;
      this.requestSaveLab.CollegeID = this.SelectedCollageID;
      this.requestSaveLab.UserID = this.sSOLoginDataModel.UserID;
      this.requestSaveLab.OtherID = this.request.CourseID;
      this.requestSaveLab.DepartmentID = this.request.DepartmentID;
      this.requestSaveLab.CollegeLabInformationList = this.CollegeWiseLabSubject;
      try {
        await this.otherInformationService.SaveLabData(this.requestSaveLab)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];

            console.log(this.State);
            if (!this.State)
            {
              this.toastr.success(this.SuccessMessage)
              this.ResetControl();
              this.GetOtherInformationAllList();
              //this.GetCollegeWiseStudenetDetails(this.SelectedCollageID);
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
  }

  ValidateLabDetails(): boolean {
    var message = 'Please validate following\n';
    var WorkFlowDetailLength = this.CollegeWiseLabSubject.length;
    var validateerrorcount = 0;
    debugger;
    if (WorkFlowDetailLength > 0) {
      for (var i = 0; i < this.CollegeWiseLabSubject.length; i++) {

       
        if (this.CollegeWiseLabSubject[i].Width == '' || this.CollegeWiseLabSubject[i].Width == '0') {
          message += 'Please Enter  Land Width \n';
          this.CollegeWiseLabSubject[i].Width = '';
        }

        if (this.CollegeWiseLabSubject[i].Length == '' || this.CollegeWiseLabSubject[i].Length == '0') {

          this.CollegeWiseLabSubject[i].Length = '';
        }

        if (this.CollegeWiseLabSubject[i].FileName == '' || this.CollegeWiseLabSubject[i].FileName == null) {
          message += 'Please Upload ConvertDocumet   \n';
          this.CollegeWiseLabSubject[i].FileName = '';
        }

        if (this.CollegeWiseLabSubject[i].FileOtherName == '' || this.CollegeWiseLabSubject[i].FileOtherName == null)
        {
          message += 'Please Upload FileOtherName   \n';
          this.CollegeWiseLabSubject[i].FileOtherName = '';
        }

        else {
          validateerrorcount++;
        }
      }
    }
    if (message.length > 30) {

      return false;
    }
    return true
  }




  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}



