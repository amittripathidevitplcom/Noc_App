import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityDetailsDataModel } from '../../../../Models/ActivityDetailsDataModel';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'console';

import * as XLSX from 'xlsx';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../../Services/FileUpload/file-upload.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Clipboard } from '@angular/cdk/clipboard';
/*import * as jsPDF from 'jspdf'*/

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';
import { GlobalConstants } from '../../../../Common/GlobalConstants';
import { ActivityDetailsService } from '../../../../Services/ActivityDetails/activity-details.service';



@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css']
})
export class ActivityDetailsComponent implements OnInit {
  ActivityForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  isUploadImage: boolean = false;
  public isSubmitted: boolean = false;
  public isFormValid: boolean = true;
  public files !: File;
  public ActivityDataAddedList: any = [];
  public ActivityDataAllList: any = [];

  public ActivityData: any = [];
  public SelectedDepartmentID: number = 0;
  public SelectedCollageID: number = 0;
  public WidthMin: number = 0;
  public Unit: string = 'Sq. Feet';
  public CssClass_TextDangerWidth: string = '';
  public CssClass_TextDangerLength: string = '';
  public FacilitesMinSizeDataList: any = [];
  public isLoading: boolean = false;
  public isLoadingExport: boolean = false;
  public isValidActivityUrl: boolean = true;
  public showActivityUrl: boolean = false;

  public isDisabledGrid: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public EditID: any;
  isEdit: boolean = false;

  public isView: boolean = true;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;
  public isDeleteButton: boolean = true;
  public isPrint: boolean = true;
  public CurrentPageName: any = "";
  public UserID: number = 0;

  searchText: string = '';

  // ssologin model
  ssoLoginModel = new SSOLoginDataModel();


  public ImageValidationMessage: string = '';
  public ImageValidate: string = '';
  public file: any = '';


  public isInputOptionType: boolean = false;

  request = new ActivityDetailsDataModel();
  @ViewChild('fileUploadImage')
  fileUploadImage: ElementRef<HTMLInputElement> = {} as ElementRef;

  public QueryStringStatus: any = '';
  public SelectedApplyNOCID: number = 0;
  public SearchRecordID: string = '';

  constructor(private activityDetailsService: ActivityDetailsService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService, private clipboard: Clipboard) { }


  async ngOnInit(): Promise<void> {
    this.ActivityForm = this.formBuilder.group(
      {
        ddlActivityId: ['', [DropdownValidators]],
        txtNoOf: ['', [Validators.required, Validators.min(1)]],
        ddlIsAvailable: ['', [Validators.required]],
        fileUploadImage: [''],
        //fileUploadImage: ['', Validators.required],
        txtMinSize: ['', [Validators.required, Validators.min(0), Validators.max(100000000)]],
        Unit: [''],
        txtRemark: [''],
        txtsearchText: [''],
      });

    const ddlActivityId = document.getElementById('ddlActivityId')
    if (ddlActivityId) ddlActivityId.focus();
    this.UserID = 1;

    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    //this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
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

    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.GetActivity(this.SelectedDepartmentID, this.SelectedCollageID, 0, 'Activity');
    this.GetActivityDetailAllList();
    this.Unit = this.SelectedDepartmentID == 4 ? 'Sq.Meter' : 'Sq. Feet';
  }
  get form() { return this.ActivityForm.controls; }


  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  async GetActivity(DepartmentID: number, CollegeID: number, ActivityID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.isLoading = true;
      this.ActivityData = [];
      await this.commonMasterService.GetActivityMasterList_DepartmentCollegeAndTypeWise(DepartmentID, CollegeID, ActivityID, Type)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ActivityData = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async ddlActivity_change($event: any, SeletedActivityID: any) {
    try {
      this.request.ActivityID = SeletedActivityID;
      var IsYesNoOption = this.ActivityData.find((x: { ActivityID: number; }) => x.ActivityID == this.request.ActivityID).IsYesNoOption;
      if (IsYesNoOption == "No") {
        this.isInputOptionType = true;
        this.request.IsAvailable = '';
        this.request.NoOf = null;
        this.request.Remark = '';
        this.request.MinSize = 0;
        this.request.Unit = '';

        this.WidthMin = 0;
        this.Unit = '';
        this.CssClass_TextDangerWidth = '';
        this.CssClass_TextDangerLength = '';

        this.loaderService.requestStarted();
        await this.commonMasterService.GetFacilitesMinSize(this.request.ActivityID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.FacilitesMinSizeDataList = data['Data'];
            this.WidthMin = this.FacilitesMinSizeDataList[0]['MinSize'];
            this.Unit = this.FacilitesMinSizeDataList[0]['Unit'];
            console.log(this.FacilitesMinSizeDataList);
          }, error => console.error(error));
      }
      else {
        this.request.NoOf = 0;
        this.request.MinSize = 0;
        this.request.Unit = '';
        this.WidthMin = 0;
        this.Unit = '';
        this.CssClass_TextDangerWidth = '';
        this.CssClass_TextDangerLength = '';
        this.isInputOptionType = false;
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

  async ValidateUploadImage(event: any) {
    try {

      this.loaderService.requestStarted();
      this.isValidActivityUrl = true;
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'image/jpeg' ||
          event.target.files[0].type === 'application/pdf' ||
          event.target.files[0].type === 'image/jpg') {
          if (event.target.files[0].size > 2000000) {
            this.fileUploadImage.nativeElement.value = "";
            this.ImageValidationMessage = 'Select less then 2MB File';
            this.ResetFile(false, '', '', '');
            this.isValidActivityUrl = false;
            return
          }
          if (event.target.files[0].size < 100000) {
            this.ImageValidationMessage = 'Select more then 100kb File';
            this.fileUploadImage.nativeElement.value = "";
            this.ResetFile(false, '', '', '');
            this.isValidActivityUrl = false;
            return
          }
        }
        else {
          this.ImageValidationMessage = 'Select Only pdf/jpeg/jpg file';
          this.fileUploadImage.nativeElement.value = "";
          this.ResetFile(false, '', '', '');
          this.isValidActivityUrl = false;
          return
        }
        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          //event.target.value = '';        
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFile(true, data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"]);
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
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DeleteImage(file: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.fileUploadService.DeleteDocument(file).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.ResetFile(false, '', '', '');
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

  ResetFile(isShow: boolean, fileName: string, filePath: string, dis_Name: string) {
    try {
      this.loaderService.requestStarted();
      this.showActivityUrl = isShow;
      this.request.ActivityUrl = fileName;
      this.request.ActivityUrlPath = filePath;
      this.request.ActivityUrl_Dis_FileName = dis_Name;
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
    this.isFormValid = true;
    this.request.CollegeID = this.SelectedCollageID;

    var IsYesNoOptionSave = this.ActivityData.find((x: { FID: number; }) => x.FID == this.request.ActivityID)?.IsYesNoOption;
    var IsExit = this.ActivityDataAllList.find((x: { ActivityID: number; }) => x.ActivityID == this.request.ActivityID);
    if (IsExit != undefined || IsExit != null) {
      //console.log(IsExit);
      //console.log(IsExit['ActivityName']);
      if (IsYesNoOptionSave == "Yes" && IsExit.ActivityDetailID != this.request.ActivityDetailID) {
        this.toastr.error(IsExit['ActivityName'] + " is Already Exist, It Can't Not Be Duplicate.!")
        return;
      }
    }

    this.isSubmitted = true;
    if ((this.request.MinSize).toString() == "") {
      this.toastr.warning("Please Select Min Size.!");
      return;
    }

    if (this.isInputOptionType == true) {
      this.ActivityForm.get('ddlIsAvailable')?.clearValidators();

      this.ActivityForm.get('txtNoOf')?.setValidators([Validators.required, Validators.min(1)]);
      this.ActivityForm.get('txtMinSize')?.setValidators([Validators.required, Validators.min(0), Validators.max(100000000)]);
    }
    else {
      this.ActivityForm.get('ddlIsAvailable')?.setValidators([Validators.required]);
      this.ActivityForm.get('txtNoOf')?.clearValidators();
      this.ActivityForm.get('txtMinSize')?.clearValidators();
    }
    this.ActivityForm.get('ddlIsAvailable')?.updateValueAndValidity();
    this.ActivityForm.get('txtNoOf')?.updateValueAndValidity();
    this.ActivityForm.get('txtMinSize')?.updateValueAndValidity();


    if (this.ActivityForm.invalid) {
      this.isFormValid = false;

    }
    //if (this.request.NoOf <= 0) {
    //  this.NoOfZero = true;
    //  this.isFormValid = false;
    //}
    if (this.WidthMin > this.request.MinSize) {
      this.CssClass_TextDangerWidth = 'text-danger';
      this.isFormValid = false;
    }
    if (this.request.IsAvailable == 'Yes' || this.isInputOptionType == true) {
      if (this.request.ActivityUrl == '') {
        this.ImageValidate = 'This field is required .!';
        this.isFormValid = false;
      }
    }



    if (!this.isFormValid) {
      return;
    }
    //owner
    if (this.request.ActivityID > 0) {
      this.request.ModifyBy = 1;
    } else {
      this.request.CreatedBy = 1;
      this.request.ModifyBy = 1;
    }

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.activityDetailsService.SaveData(this.request, this.files)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // get saved society
            await this.ResetControl();
            this.ActivityDataAllList();
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


      this.GetActivity(this.SelectedDepartmentID, this.SelectedCollageID, 0, 'Activity');
      const ddlActivityId = document.getElementById('ddlActivityId')
      if (ddlActivityId) ddlActivityId.focus();
      this.isValidActivityUrl = true;
      this.showActivityUrl = false;
      this.isInputOptionType = false;
      this.isSubmitted = false;
      this.request.ActivityDetailID = 0;
      this.request.IsAvailable = '';
      this.request.ActivityID = 0;
      this.request.NoOf = null;
      this.request.Remark = '';
      this.request.MinSize = 0;
      const fileUploadImage = '';
      this.request.ActivityUrl = '';
      this.request.UserID = 0;
      this.isDisabledGrid = false;
      this.ResetFile(false, '', '', '');
      await this.GetActivityDetailAllList();
      const btnSave = document.getElementById('btnSave')
      if (btnSave) btnSave.innerHTML = " Save";
      const btnReset = document.getElementById('btnReset')
      if (btnReset) btnReset.innerHTML = "Reset";
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

  async GetActivityDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.activityDetailsService.GetActivityDetailAllList(this.UserID, this.SelectedCollageID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ActivityDataAllList = data['Data'][0]['data'];
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

  async Edit_OnClick(ActivityDetailID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.activityDetailsService.GetActivityDetailsByID(ActivityDetailID, this.UserID, this.SelectedCollageID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.ActivityDetailID = data['Data'][0]["ActivityDetailID"];
          await this.GetActivity(this.SelectedDepartmentID, this.SelectedCollageID, data['Data'][0]["ActivityID"], 'Activity');
          this.request.ActivityID = data['Data'][0]["ActivityID"];
          this.ddlActivity_change(null, this.request.ActivityID);
          this.request.NoOf = data['Data'][0]["NoOf"];
          this.request.ActivityUrl = data['Data'][0]["ActivityUrl"];
          this.ResetFile((data['Data'][0]["ActivityUrl"] != '' ? true : false), data['Data'][0]["ActivityUrl"], data['Data'][0]["ActivityUrlPath"], data['Data'][0]["ActivityUrl_Dis_FileName"]);
          this.request.MinSize = data['Data'][0]["MinSize"];
          this.request.Remark = data['Data'][0]["Remark"];
          this.request.IsAvailable = data['Data'][0]["IsAvailable"];

          this.isDisabledGrid = true;
          this.isValidActivityUrl = true;
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

  async Delete_OnClick(ActivityDetailID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.activityDetailsService.DeleteData(ActivityDetailID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetActivityDetailAllList();
              this.ResetControl();
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
    if (this.ActivityDataAllList.length > 0) {
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
        XLSX.writeFile(wb, "ActivityDetail.xlsx");
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
    if (this.ActivityDataAllList.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("ActivityDetail", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("ActivityDetail" + '.pdf');

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

  async ddlIsAvailable_change(SeletedIsAvailable: any) {
    if (this.isInputOptionType == true) {
      if (SeletedIsAvailable == 'Yes') {
        this.isValidActivityUrl = false;
      }
      else {
        this.isValidActivityUrl = false;
      }
    }

  }
}
