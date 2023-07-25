
import { ChangeDetectorRef, Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VeterinaryHospitalDataModel, AnimalDataModel } from '../../../Models/VeterinaryHospitalDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { VeterinaryHospitalService } from '../../../Services/VeterinaryHospital/veterinary-hospital.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { Obj } from '@popperjs/core';
import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable, { Table } from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-veterinary-hospital',
  templateUrl: './veterinary-hospital.component.html',
  styleUrls: ['./veterinary-hospital.component.css']
})
export class VeterinaryHospitalComponent implements OnInit {
  isSubmitted: boolean = false;
  veterinaryHospitalForm!: FormGroup;
  animalForm!: FormGroup;
  request = new VeterinaryHospitalDataModel();
  requestAnimal = new AnimalDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  UploadFile: string = '';
  file: File | any = null;
  public files: File = null;
  public isDisabledGrid: boolean = false;
  public isFileName: boolean = false;
  public isDeleteButton: boolean = true;
  public isLoadingExport: boolean = false;
  public DivisionList: any = [];
  public AnimalMasterList: any = [];
  public UserID: number = 0;
  public DistrictList: any = [];
  public SuvdivisionList: any = [];
  public TehsilList: any = [];
  public PanchyatSamitiList: any = [];
  public PinNoRegex = new RegExp(/[0-9]{5}/);
  public ContactNoRegex = new RegExp(/[0-9]{5}/);
  IsRural: boolean = false;
  IsPanchayatSamitirequried: boolean = false;
  IsTehsilrequired: boolean = false;
  public VeterinaryHostpitalFileUpload: boolean = false;
  public ActiveStatus: boolean = true;
  public downloadingPDF: boolean = false;
  searchText: string = '';
  public isFormValid: boolean = false;

  public ImageValidate: string = '';
  public CssClass_TextDangerWidth: string = '';
  public CssClass_TextDangerLength: string = '';

  public isValidFileUpload: boolean = false;
  public showFileUpload: boolean = false;

  public ImageValidationMessage: string = '';

  @ViewChild('fileUploadImage')
  fileUploadImage: ElementRef<HTMLInputElement> = {} as ElementRef;

  public EditID: any;
  isEdit: boolean = false;

  public isView: boolean = true;
  public isAddButton: boolean = true;
  public isEditButton: boolean = true;

  public isPrint: boolean = true;
  public CurrentPageName: any = "";
  public dropdownList: any = [];
  public dropdownSettings: IDropdownSettings = {};
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  isUploadImage: boolean = false;
  public lstVeterinaryHospital: any = [];
  public isAnimalAdded: boolean = false;


  sSOLoginDataModel = new SSOLoginDataModel();


  constructor(private veterinaryHospitalService: VeterinaryHospitalService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute,
    private routers: Router, private cdRef: ChangeDetectorRef, private clipboard: Clipboard) { }

  init() {
    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }

  ngOnInit(): void {
    this.veterinaryHospitalForm = this.formBuilder.group(
      {
        txtHospitalName: ['', Validators.required],
        txtDistanceFromInstitute: ['', Validators.required],
        txtAuthorizedPerson: ['', Validators.required],
        txtAddressLine1: ['', Validators.required],
        txtAddressLine2: ['', Validators.required],
        txtRelation: ['', Validators.required],
        rbRuralUrban: ['', Validators.required],
        rbYesNo: ['', Validators.required],
        ddlDivisionID: ['', [DropdownValidators]],
        ddlDistrictID: ['', [DropdownValidators]],
        ddlTehsilID: [''],
        ddlPanchayatSamitiID: [''],
        txtCityTownVillage: ['', Validators.required],
        txtPincode: ['', [Validators.required]],
        txtMobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
        txtEmailAddress: ['', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
        txtRemark: ['', Validators.required],        
        txtFileUpload: [''],        

        txtsearchText: [''],
      })
    this.animalForm = this.formBuilder.group(
      {
        txtAnimalCount: ['', Validators.required],
        ddlAnimalMasterID: ['', [DropdownValidators]],
      })
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CollegeID = this.SelectedCollageID;
    this.request.DepartmentID = this.SelectedDepartmentID;
    this.request.SSOID = this.sSOLoginDataModel.SSOID;
   
    this.GetDivisionList();
    this.GetAnimalMasterList();
    this.GetAllVeterinaryHospitalList();
    this.ActiveStatus = true;
  }
  get form() { return this.veterinaryHospitalForm.controls; }
  get animalform() { return this.animalForm.controls; }

  alphaOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode == 47 || charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
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
  async IsRuralOrUrban(isRural: boolean, section?: string) {
    this.IsRural = isRural;
    this.request.TehsilID = 0;
    this.request.PanchayatSamitiID = 0;
  }
  async FillDivisionRelatedDDL(event: any, SeletedValueDivision: any) {
    this.request.DivisionID = SeletedValueDivision;
    try {
      this.loaderService.requestStarted();
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
  async FillDistrictRelatedDDL(event: any, SeletedValueDistrict: any) {
    // this.request.DistrictID = SeletedValueDistrict;
    try {
      this.loaderService.requestStarted();
      // subdivision list
      await this.commonMasterService.GetSuvdivisionByDistrictId(SeletedValueDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SuvdivisionList = data['Data'];

        }, error => console.error(error));
      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(SeletedValueDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TehsilList = data['Data'];
        }, error => console.error(error));
      // PanchyatSamiti list
      await this.commonMasterService.GetPanchyatSamitiByDistrictId(SeletedValueDistrict)
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
  ValidateUploadImage(event: any, Type: string) {

    this.isValidFileUpload = false;
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'application/pdf') {
        if (event.target.files[0].size > 2000000) {
          this.ImageValidationMessage = 'Select less then 2MB File';
          if (Type == 'FileUpload') {
            this.isValidFileUpload = true;
            this.request.FileUpload = '';
            this.request.Dis_FileUpload = '';
            this.request.FileUploadPath = '';
          }
          return
        }
        if (event.target.files[0].size < 100000) {
          this.ImageValidationMessage = 'Select more then 100kb File';
          if (Type == 'FileUpload') {
            this.isValidFileUpload = true;
            this.request.FileUpload = '';
            this.request.Dis_FileUpload = '';
            this.request.FileUploadPath = '';
          }
          return
        }
      }
      else {
        this.ImageValidationMessage = 'Select Only pdf file';
        if (Type == 'FileUpload') {
          this.isValidFileUpload = true;
          this.request.FileUpload = '';
          this.request.Dis_FileUpload = '';
          this.request.FileUploadPath = '';
        }
        return
      }

      this.file = event.target.files[0];
      this.fileUploadService.UploadDocument(this.file).then((data: any) => {

        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == 'FileUpload') {
            this.request.FileUpload = data['Data'][0]["FileName"];
            this.request.Dis_FileUpload = data['Data'][0]["Dis_FileName"];
            this.request.FileUploadPath = data['Data'][0]["FilePath"];
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
  DeleteImage(Type: string) {
    if (Type == 'FileUpload') {
      //this.showOwnBuildingFileUpload = false;
      this.request.FileUpload = '';
      this.request.Dis_FileUpload = '';
      this.request.FileUploadPath = '';
    }
  }
  async AddAnimalDetails() {
    try {
      debugger;
      this.loaderService.requestStarted();
     
      this.isAnimalAdded = true;
      if (this.animalForm.invalid) {
        return;
      }
      
      var GetAnimalName = this.AnimalMasterList.find((x: { AnimalMasterID: number; }) => x.AnimalMasterID == this.requestAnimal.AnimalMasterID).AnimalName;
      if (this.request.AnimalDetails.length > 0) {
        var result = this.request.AnimalDetails.filter(obj => {
          return obj.AnimalMasterID === this.requestAnimal.AnimalMasterID
        });
        if (result.length > 0) {
          this.toastr.warning(GetAnimalName + " not duplicate");
          return;
        }
      }
      this.request.AnimalDetails.push({
        AnimalDetailsID: 0,      
        AnimalMasterID: this.requestAnimal.AnimalMasterID,
        AnimalName: this.AnimalMasterList.find((x: { AnimalMasterID: number; }) => x.AnimalMasterID == this.requestAnimal.AnimalMasterID).AnimalName,       
        AnimalCount: this.requestAnimal.AnimalCount,
        ActiveStatus: this.request.ActiveStatus,
        DeleteStatus: this.request.DeleteStatus,        
      });
      this.requestAnimal = new AnimalDataModel();
      this.isAnimalAdded = false;
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async DeleteAnimal(Index: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        this.request.AnimalDetails.splice(Index, 1);
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async GetAnimalMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.veterinaryHospitalService.GetAnimalMasterList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AnimalMasterList = data['Data'];
          console.log(this.AnimalMasterList);
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
    this.isValidFileUpload = false;

    this.CssClass_TextDangerWidth = '';
    this.CssClass_TextDangerLength = '';
    this.isSubmitted = true;
    this.isFormValid = true;
    if (this.veterinaryHospitalForm.invalid) {
      this.isFormValid = false;
    }
    if (this.request.RuralUrban == 'Rural') {
      if (this.request.PanchayatSamitiID == 0) {
        this.IsPanchayatSamitirequried = true;
        this.isFormValid = false;
      }
      if (this.request.TehsilID == 0) {
        this.IsTehsilrequired = true;
        this.isFormValid = false;
      }
    }
    if (this.request.FileUpload == '') {
      this.ImageValidate = 'This field is required .!';
      return
    }

    if (!this.isFormValid) {
      return;
    }
    this.loaderService.requestStarted();
    try {
      console.log(this.request);
      await this.veterinaryHospitalService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetDivisionList();
            this.GetAnimalMasterList();
            this.GetAllVeterinaryHospitalList();
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

      }, 200);
    }
  }
  async GetAllVeterinaryHospitalList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.veterinaryHospitalService.GetAllVeterinaryHospitalList(this.UserID, this.request.CollegeID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstVeterinaryHospital = data['Data'][0]['data'];
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
  async Edit_OnClick(VeterinaryHospitalID: number) {
    debugger;
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.veterinaryHospitalService.GetVeterinaryHospitalByID(VeterinaryHospitalID, this.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.VeterinaryHospitalID = data['Data']["VeterinaryHospitalID"];
          this.request.CollegeID = data['Data']["CollegeID"];
          this.request.HospitalName = data['Data']["HospitalName"];
          this.request.DistanceFromInstitute = data['Data']["DistanceFromInstitute"];
          this.request.AddressLine1 = data['Data']["AddressLine1"];
          this.request.AddressLine2 = data['Data']["AddressLine2"];
          this.request.RuralUrban = data['Data']["RuralUrban"];
          this.request.DivisionID = data['Data']["DivisionID"];
          this.FillDivisionRelatedDDL(null, this.request.DivisionID);
          this.request.DistrictID = data['Data']["DistrictID"];

          if (this.request.RuralUrban == 'Rural') {
            this.IsRural = true;
            this.FillDistrictRelatedDDL(null, this.request.DistrictID);
            this.request.TehsilID = data['Data']["TehsilID"];
            this.request.PanchayatSamitiID = data['Data']["PanchayatSamitiID"];
          }
          else {
            this.IsRural = false;
          }
          this.request.CityTownVillage = data['Data']["CityTownVillage"];
          this.request.MobileNo = data['Data']["MobileNo"];
          this.request.Pincode = data['Data']["Pincode"];
          this.request.EmailAddress = data['Data']["EmailAddress"];
          this.request.PersonField = data['Data']["PersonField"];
          this.request.Relation = data['Data']["Relation"];
          this.request.Remark = data['Data']["Remark"];
          this.request.FileUpload = data['Data']["FileUpload"];
          this.request.FileUploadPath = data['Data']["FileUploadPath"];
          this.request.Dis_FileUpload = data['Data']["Dis_FileUpload"];
          this.request.AuthorizedPerson = data['Data']["AuthorizedPerson"];
          this.request.AnimalDetails = data['Data']["AnimalDetails"];

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
  async Delete_OnClick(VeterinaryHospitalID: number) {
    debugger;
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.veterinaryHospitalService.DeleteData(VeterinaryHospitalID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetAllVeterinaryHospitalList();
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
  async ResetControl() {
    const txtHospitalName = document.getElementById('txtHospitalName')
    if (txtHospitalName) txtHospitalName.focus();
    this.isSubmitted = false;
    this.request.VeterinaryHospitalID = 0;
    this.request.CollegeID = 0;
    this.request.AddressLine1 = '';
    this.request.AddressLine2 = '';
    this.request.TehsilID = 0;
    this.request.RuralUrban = '';
    this.request.Pincode = '';
    this.request.PanchayatSamitiID = 0;
    this.request.FileUpload = '';
    this.request.Dis_FileUpload = '';
    this.request.FileUploadPath = '';
    this.request.DivisionID = 0;
    this.request.DistrictID = 0;
    this.request.PanchayatSamitiID = 0;
    this.request.CityTownVillage = '';
    this.request.MobileNo = '';
    this.request.HospitalName = '';
    this.request.DistanceFromInstitute = null;
    this.request.AuthorizedPerson = '';
    this.request.EmailAddress = '';
    this.request.PersonField = '';
    this.request.Relation = '';
    this.request.Remark = '';
    this.request.UserID = 0;
    this.isAnimalAdded = false;
    this.request.AnimalDetails = [];
   
    this.isValidFileUpload = false;
    this.request.ActiveStatus = true;
    this.isDisabledGrid = false;
    this.GetAllVeterinaryHospitalList();
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }
  btnCancel_Click() {
    this.routers.navigate(['/dashboard']);

  }
  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {
      this.clipboard.copy(tabellist.innerText);
    }
  }
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.lstVeterinaryHospital.length > 0) {
      try {
        this.isLoadingExport = true;
        this.downloadingPDF = true;
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
        XLSX.writeFile(wb, "VeterinaryHospital.xlsx");
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
    this.downloadingPDF = true;
    this.loaderService.requestStarted();
    if (this.lstVeterinaryHospital.length > 0) {
      try {
        let doc = new jsPDF('p', 'mm', [432, 279])
        doc.setFontSize(16);

        doc.text("Veterinary Hospital", 100, 10, { align: 'center', maxWidth: 100 });
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
        doc.save("Veterinary Hospital" + '.pdf');
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
