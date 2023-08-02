import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityDetailsDataModel } from '../../../Models/FacilityDetailsDataModel';
import { FacilityDetailsService } from '../../../Services/FicilityDetais/facility-details.service';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'console';

import * as XLSX from 'xlsx';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Clipboard } from '@angular/cdk/clipboard';
/*import * as jsPDF from 'jspdf'*/

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';
import { GlobalConstants } from '../../../Common/GlobalConstants';



@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.css']
})
export class FacilityDetailsComponent implements OnInit {
  FacilitiesForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  isUploadImage: boolean = false;
  public isSubmitted: boolean = false;
  public files: File = null;
  public FacilitiesDataAddedList: any = [];
  public FacilitiesDataAllList: any = [];

  public FacilitiesData: any = [];
  public SelectedDepartmentID: number = 0;
  public SelectedCollageID: number = 0;
  public WidthMin: number = 0;
  public Unit: string = 'Sq. Feet';
  public CssClass_TextDangerWidth: string = '';
  public CssClass_TextDangerLength: string = '';
  public FacilitesMinSizeDataList: any = [];
  public isLoading: boolean = false;
  public isLoadingExport: boolean = false;
  public isValidFacilitiesUrl: boolean = true;
  public showFacilitiesUrl: boolean = false;

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

  request = new FacilityDetailsDataModel();
  @ViewChild('fileUploadImage')
  fileUploadImage: ElementRef<HTMLInputElement> = {} as ElementRef;



  constructor(private facilityDetailsService: FacilityDetailsService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService, private clipboard: Clipboard) { }


  ngOnInit(): void {
    this.FacilitiesForm = this.formBuilder.group(
      {
        ddlFacilitiesId: ['', [DropdownValidators]],
        txtNoOf: ['', Validators.required],
        fileUploadImage: [''],
        //fileUploadImage: ['', Validators.required],
        txtMinSize: ['', [Validators.required, Validators.min(0), Validators.max(100000000)]],
        Unit: [''],
        txtsearchText: [''],
      });

    const ddlFacilitiesId = document.getElementById('ddlFacilitiesId')
    if (ddlFacilitiesId) ddlFacilitiesId.focus();
    this.UserID = 1;

    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    this.GetFacilities(this.SelectedDepartmentID, 'Facilities');
    this.GetFacilityDetailAllList();
  }
  get form() { return this.FacilitiesForm.controls; }


  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  async GetFacilities(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      this.isLoading = true;
      await this.commonMasterService.GetFacilitiesMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(data);
          this.FacilitiesData = data['Data'];
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

  async ddlFacilities_change($event: any, SeletedFacilitiesID: any) {
    this.request.FacilitiesID = SeletedFacilitiesID;
    this.request.NoOf = null;
    this.request.MinSize = 0;
    this.request.Unit = '';

    this.WidthMin = 0;
    this.Unit = '';
    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';


    console.log(SeletedFacilitiesID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetFacilitesMinSize(this.request.FacilitiesID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.FacilitesMinSizeDataList = data['Data'];

          this.WidthMin = this.FacilitesMinSizeDataList[0]['MinSize'];
          this.Unit = this.FacilitesMinSizeDataList[0]['Unit'];
          console.log(this.FacilitesMinSizeDataList);
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
    try {
      this.loaderService.requestEnded();
      this.isValidFacilitiesUrl = true;
      if (event.target.files && event.target.files[0]) {
        if (event.target.files[0].type === 'image/jpeg' ||
          //event.target.files[0].type === 'application/pdf' ||
          event.target.files[0].type === 'image/jpg') {
          if (event.target.files[0].size > 2000000) {
            this.fileUploadImage.nativeElement.value = "";
            this.ImageValidationMessage = 'Select less then 2MB File';
            this.ResetFile(false, '', '', '');
            this.isValidFacilitiesUrl = false;
            return
          }
          if (event.target.files[0].size < 100000) {
            this.ImageValidationMessage = 'Select more then 100kb File';
            this.fileUploadImage.nativeElement.value = "";
            this.ResetFile(false, '', '', '');
            this.isValidFacilitiesUrl = false;
            return
          }
        }
        else {
          this.ImageValidationMessage = 'Select Only jpeg/jpg file';
          this.fileUploadImage.nativeElement.value = "";
          this.ResetFile(false, '', '', '');
          this.isValidFacilitiesUrl = false;
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
      this.showFacilitiesUrl = isShow;
      this.request.FacilitiesUrl = fileName;
      this.request.FacilitiesUrlPath = filePath;
      this.request.FacilitiesUrl_Dis_FileName = dis_Name;
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

    this.request.CollegeID = this.SelectedCollageID;

    this.isSubmitted = true;
    console.log(this.request);
    if ((this.request.MinSize).toString() == "") {
      this.toastr.warning("Please Select Min Size.!");
      return;
    }

    if (this.FacilitiesForm.invalid) {
      return
    }

    if (this.WidthMin > this.request.MinSize) {
      this.CssClass_TextDangerWidth = 'text-danger';
      return
    }
    if (this.request.FacilitiesUrl == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }
    //owner
    if (this.request.FacilitiesID > 0) {
      this.request.ModifyBy = 1;
    } else {
      this.request.CreatedBy = 1;
      this.request.ModifyBy = 1;
    }

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.facilityDetailsService.SaveData(this.request, this.files)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            // get saved society
            await this.ResetControl();
            await this.GetFacilities(this.SelectedDepartmentID, 'Facilities');
            await this.GetFacilityDetailAllList();

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
      const ddlFacilitiesId = document.getElementById('ddlFacilitiesId')
      if (ddlFacilitiesId) ddlFacilitiesId.focus();
      this.isValidFacilitiesUrl = true;
      this.showFacilitiesUrl = false;
      this.isSubmitted = false;
      this.request.FacilityDetailID = 0;
      this.request.FacilitiesID = 0;
      this.request.NoOf = null;
      this.request.MinSize = 0;
      const fileUploadImage = '';
      this.request.FacilitiesUrl = '';
      this.request.UserID = 0;
      this.isDisabledGrid = false;
      this.ResetFile(false, '', '', '');
      await this.GetFacilityDetailAllList();
      const btnSave = document.getElementById('btnSave')
      if (btnSave) btnSave.innerHTML = " Save";
      const btnReset = document.getElementById('')
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

  async GetFacilityDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.facilityDetailsService.GetFacilityDetailAllList(this.UserID, this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.FacilitiesDataAllList = data['Data'][0]['data'];
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

  async Edit_OnClick(FacilityDetailID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.facilityDetailsService.GetfacilityDetailsByID(FacilityDetailID, this.UserID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.FacilityDetailID = data['Data'][0]["FacilityDetailID"];
          this.request.FacilitiesID = data['Data'][0]["FacilitiesID"];
          this.request.NoOf = data['Data'][0]["NoOf"];
          this.request.FacilitiesUrl = data['Data'][0]["FacilitiesUrl"];
          this.ResetFile((data['Data'][0]["FacilitiesUrl"] != '' ? true : false), data['Data'][0]["FacilitiesUrl"], data['Data'][0]["FacilitiesUrlPath"], data['Data'][0]["FacilitiesUrl_Dis_FileName"]);
          this.request.MinSize = data['Data'][0]["MinSize"];

          this.isDisabledGrid = true;
          this.isValidFacilitiesUrl = true;
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Reset";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async Delete_OnClick(FacilityDetailID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.facilityDetailsService.DeleteData(FacilityDetailID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetFacilityDetailAllList();
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
    if (this.FacilitiesDataAllList.length > 0) {
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
        XLSX.writeFile(wb, "FacilityDetail.xlsx");
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
    if (this.FacilitiesDataAllList.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);
        doc.text("FacilityDetail", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("FacilityDetail" + '.pdf');

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
