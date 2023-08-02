import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoomDetailsDataModel } from '../../../Models/RoomDetailsDataModel';
import { RoomDetailsService } from '../../../Services/RoomDetails/room-details.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { Clipboard } from '@angular/cdk/clipboard';
/*import * as jsPDF from 'jspdf'*/
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';
import { debug } from 'console';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { GlobalConstants } from '../../../Common/GlobalConstants';


@Injectable()

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})

export class RoomDetailsComponent implements OnInit {

  //Add FormBuilder
  RoomDetailsForm !: FormGroup;

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new RoomDetailsDataModel();

  public isDisabledGrid: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public files: File = null;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public EditID: any;
  isEdit: boolean = false;

  public isView: boolean = true;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;
  public isDeleteButton: boolean = true;
  public isPrint: boolean = true;
  public CurrentPageName: any = "";

  public UserID: number = 0;
  public courseDataList: any = [];
  public RoomSizeDataList: any = [];
  public RoomDetails: any = [];

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
  public LengthMin_Dis: number = 0;
  public MinNoOfRooms: number = 0;
  public CssClass_TextDangerWidth: string = 'text-danger';
  public CssClass_TextDangerLength: string = 'text-danger';
  public CssClass_TextDangerNoOfRooms: string = 'text-danger';
  public ImageValidate: string = '';

  isUploadImage: boolean = false;
  public isValidImageFilePath: boolean = false;
  public showImageFilePath: boolean = false;
  public isformvalid: boolean = true;
  public WidthMin_Dis: number = 0;

  // ssologin model
  ssoLoginModel = new SSOLoginDataModel();
  public ImageValidationMessage: string = '';
  public file: any = '';
  @ViewChild('fileUploadImage')
  fileUploadImage: ElementRef<HTMLInputElement> = {} as ElementRef;


  constructor(private roomDetailsService: RoomDetailsService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute,
    private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService, private clipboard: Clipboard) { }

  async ngOnInit() {
    this.RoomDetailsForm = this.formBuilder.group(
      {
        ddlCourse_Room: ['', [DropdownValidators]],
        txtNoOfRooms_Room: ['', [Validators.required, Validators.min(1)]],
        txtWidth_Room: ['', [Validators.required, Validators.min(1)]],
        txtLength_Room: ['', [Validators.required, Validators.min(1)]],
        txtStudentCapacity_Room: ['', [Validators.required, Validators.min(1)]],
        fileUploadImage: [''],
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
    this.GetRoomDetailAllList();
  }
  get form() { return this.RoomDetailsForm.controls; }


  LoadMaster() {
    try {
      this.loaderService.requestStarted();
      this.commonMasterService.GetCourseList_CollegeWise(this.SelectedCollageID)
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


  ddlCourse_change($event: any, SeletedCourseID: any) {
    this.request.CourseID = SeletedCourseID;
    this.request.Width = 0;
    this.request.Length = 0;

    this.WidthMin = 0;
    this.LengthMin = 0;
    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';
    this.CssClass_TextDangerNoOfRooms = '';


    console.log(SeletedCourseID);
    try {
      this.loaderService.requestStarted();
      this.commonMasterService.GetCourseRoomSize(this.request.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RoomSizeDataList = data['Data'];

          this.WidthMin = this.RoomSizeDataList[0]['WidthMin'];
          this.WidthMin_Dis = this.RoomSizeDataList[0]['WidthMin'];
          this.LengthMin = this.RoomSizeDataList[0]['LengthMin'];
          this.LengthMin_Dis = this.RoomSizeDataList[0]['LengthMin'];
          this.MinNoOfRooms = this.RoomSizeDataList[0]['NoOfRooms'];
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

  async ValidateUploadImage(event: any) {
    this.loaderService.requestStarted();
    try {
      this.isValidImageFilePath = false;
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'image/jpeg' ||
          event.target.files[0].type === 'image/jpg') {
          if (event.target.files[0].size > 2000000) {
            this.fileUploadImage.nativeElement.value = "";
            this.ImageValidationMessage = 'Select less then 2MB File';
            this.isValidImageFilePath = true;
            this.request.ImageFileName = '';
            this.request.ImageFilePath = '';
            this.request.Image_Dis_FileName = '';
            return
          }
          if (event.target.files[0].size < 100000) {
            this.ImageValidationMessage = 'Select more then 100kb File';
            this.fileUploadImage.nativeElement.value = "";
            this.isValidImageFilePath = true;
            this.request.ImageFileName = '';
            this.request.ImageFilePath = '';
            this.request.Image_Dis_FileName = '';
            return
          }
        }
        else {
          this.ImageValidationMessage = 'Select Only jpg/jpeg file';
          this.fileUploadImage.nativeElement.value = "";
          this.isValidImageFilePath = true;
          this.request.ImageFileName = '';
          this.request.ImageFilePath = '';
          this.request.Image_Dis_FileName = '';
          return
        }
        this.file = event.target.files[0];
        try {
          await this.fileUploadService.UploadDocument(this.file).then((data: any) => {

            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.showImageFilePath = true;
              this.request.ImageFilePath = data['Data'][0]["FilePath"];
              this.request.ImageFileName = data['Data'][0]["FileName"];
              this.request.Image_Dis_FileName = data['Data'][0]["Dis_FileName"];
              this.isUploadImage = false;
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
        event.target.value = '';
      }, 200);
    }
  }
  DeleteImage() {
    try {
      this.loaderService.requestStarted();
      this.showImageFilePath = false;
      this.request.ImageFileName = '';
      this.request.ImageFilePath = '';
      this.request.Image_Dis_FileName = '';
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
    this.WidthMin = this.WidthMin_Dis;
    this.LengthMin = this.LengthMin_Dis;
    this.MinNoOfRooms = this.MinNoOfRooms;
    this.isformvalid = true;
    this.isValidImageFilePath = false;
    this.isSubmitted = true;
    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';
    this.CssClass_TextDangerNoOfRooms = '';
    if (this.RoomDetailsForm.invalid) {
      this.isformvalid = false;
    }
    //if (this.request.StudentCapacity > 60 && this.request.StudentCapacity <= 120) {
    //  this.WidthMin = this.WidthMin + this.WidthMin;
    //}
    //else if (this.request.StudentCapacity > 120) {
    //  this.WidthMin = this.WidthMin + this.WidthMin + this.WidthMin;
    //}
    //else {

    //}
    //console.log(this.WidthMin);
    if (Number(this.request.Width) < Number(this.WidthMin)) {
      this.CssClass_TextDangerWidth = 'text-danger';
      this.toastr.warning('Please Enter Min Width size : ' + this.WidthMin);
      this.isformvalid = false;
    }
    if (Number(this.request.Length) < Number(this.LengthMin)) {
      this.CssClass_TextDangerLength = 'text-danger';
      this.toastr.warning('Please Enter Min Length size : ' + this.LengthMin);
      //this.toastr.warning('Please Enter Min size : ' + this.WidthMin + ' sq.ft');
      this.isformvalid = false;
    }

    if (Number(this.request.NoOfRooms) < Number(this.MinNoOfRooms)) {
      this.CssClass_TextDangerNoOfRooms = 'text-danger';
      this.toastr.warning('Please Enter Min No. of Rooms : ' + this.MinNoOfRooms);
      //this.toastr.warning('Please Enter Min size : ' + this.WidthMin + ' sq.ft');
      this.isformvalid = false;
    }

    if (this.request.ImageFilePath == '') {
      this.ImageValidate = 'This field is required .!';
      this.isformvalid = false;
    }
    if (!this.isformvalid) {
      return;
    }
    //Show Loading
    this.request.CollegeID = this.SelectedCollageID;

    this.request.CourseName = this.courseDataList.find((x: { CourseID: number; }) => x.CourseID == this.request.CourseID).CourseName;

    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.roomDetailsService.SaveData(this.request, this.files)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // get saved society
            this.LoadMaster();
            this.GetRoomDetailAllList();
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
      this.request.CollegeWiseRoomID = 0;
      this.request.CourseID = 0;
      this.request.NoOfRooms = 1;
      this.request.Width = 0;
      this.request.Length = 0;
      this.request.StudentCapacity = 0;
      this.request.ImageFileName = '';
      this.request.ImageFilePath = '';
      this.request.Image_Dis_FileName = '';
      this.request.UserID = 0;
      this.isDisabledGrid = false;
      this.showImageFilePath = false;
      this.GetRoomDetailAllList();
      const btnSave = document.getElementById('btnSave')
      if (btnSave) btnSave.innerHTML = "<i class='fa fa-plus'></i> Add &amp; Save";
      const btnReset = document.getElementById('')
      if (btnReset) btnReset.innerHTML = "Reset";
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async GetRoomDetailAllList() {
      try {
        this.loaderService.requestStarted();
        await this.roomDetailsService.GetRoomDetailAllList(this.UserID, this.SelectedCollageID)
          .then((data: any) => {

            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.RoomDetails = data['Data'][0]['data'];
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

  async Edit_OnClick(CollegeWiseRoomID: number) {
      this.isSubmitted = false;
      try {
        this.loaderService.requestStarted();
        await this.roomDetailsService.GetRoomDetailsByID(CollegeWiseRoomID, this.UserID)
          .then(async (data: any) => {

            data = JSON.parse(JSON.stringify(data));
            this.request.CollegeID = data['Data'][0]["CollegeID"];
            this.request.CourseID = data['Data'][0]["CourseID"];
            await this.ddlCourse_change(this, this.request.CourseID);
            this.request.CollegeWiseRoomID = data['Data'][0]["CollegeWiseRoomID"];
            this.request.NoOfRooms = data['Data'][0]["NoOfRooms"];
            this.request.Width = data['Data'][0]["Width"];
            this.request.Length = data['Data'][0]["Length"];
            this.request.StudentCapacity = data['Data'][0]["StudentCapacity"];
            this.request.ImageFilePath = data['Data'][0]["ImageFilePath"];
            this.request.ImageFileName = data['Data'][0]["ImageFileName"];
            this.request.Image_Dis_FileName = data['Data'][0]["Image_Dis_FileName"];
            this.showImageFilePath = true;
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

  async Delete_OnClick(CollegeWiseRoomID: number) {
      this.isSubmitted = false;
      try {
        if (confirm("Are you sure you want to delete this ?")) {
          this.loaderService.requestStarted();
          await this.roomDetailsService.DeleteData(CollegeWiseRoomID, this.UserID)
            .then((data: any) => {
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              if (this.State == 0) {
                this.toastr.success(this.SuccessMessage)
                this.GetRoomDetailAllList();
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
      if(this.RoomDetails.length > 0) {
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
        XLSX.writeFile(wb, "RoomDetails.xlsx");
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
    if (this.RoomDetails.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("RoomDetails", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("RoomDetails" + '.pdf');

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

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}


