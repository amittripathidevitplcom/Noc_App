import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandDetailDataModel, LandDetailDocumentDataModel } from '../../../Models/LandDetailDataModel';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { LandDetailsService } from '../../../Services/Tabs/LandDetails/land-details.service'
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { Console, debug, log } from 'console';
import { Table } from 'jspdf-autotable';
import { type } from 'os';

@Component({
  selector: 'app-land-details',
  templateUrl: './land-details.component.html',
  styleUrls: ['./land-details.component.css']
})
export class LandDetailsComponent implements OnInit {
  LandDetailForm!: FormGroup;
  request = new LandDetailDataModel();
  isSubmitted: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public LandAreaData: any = [];
  public LandDocumentTypeData: any = [];
  public TermAndConditionData: any = [];
  public AnnexureData: any = [];
  public isLoading: boolean = false;
  public fileValidationMessage: string = '';
  public file: any = '';
  public IstxtBuildingHostel: boolean = false;
  public LandDetailDocumentDataModel: any = [];
  public LandDetailsList: any = [];
  public LandDetailsDocumentList: any = [];
  public LandDetailsDocumentListByID: any = [];
  public DetailoftheLand: any = [];
  public isDisabledGrid: boolean = false;
  public LandConversionData: any = [];
  public LandTypeData: any = [];
  //public LandDocumentDetailData: any = [];
  public CollegeData: any = [];
  public UnitOfLand: string = '';
  public ShowConversionOrderNo: boolean = false;
  public LandconvertedId: number = 0;
  public LandDetailList: LandDetailDataModel[] = [];
  public LandDetailDocument: LandDetailDocumentDataModel[] = [];
  public TotalArea: number = 0;
  public RequiredLandArea: number = 0;
  public IsRequiredLandArea: boolean = false;
  public RequiredLandAreaMsg: string = '';
  public LandUnitType: string = '';
  public ShowAffidavitDate: boolean = false;
  public isLandOwnerName: boolean = true;
  //@ViewChild('LandDocumentFile')
  //LandDocumentFile: ElementRef<HTMLInputElement> = {} as ElementRef;
  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  @ViewChild('fileUploader')
  fileUploader!: ElementRef;
  public LandConversionOrderNoValidate: string = '';
  public AffidavitDateValidate: string = '';
  public LandConversionDateValidate: string = '';

  public MinimumAreaBuildingHostelQuartersRoad: string = '';
  public MinimumAreaGroundCycleStand: string = '';
  public LandConversionMinDate: Date = new Date();
  public LandConversionMaxDate: Date = new Date();



  public LandTypeKhataAndLandArea: any = [];

  constructor(private loaderService: LoaderService, private toastr: ToastrService, private landDetailsService: LandDetailsService, private fileUploadService: FileUploadService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder) {

  }

  async ngOnInit() {
    this.LandConversionMinDate.setFullYear(this.LandConversionMinDate.getFullYear() - 76);
    this.LandConversionMinDate = new Date(this.LandConversionMinDate.getFullYear(), this.LandConversionMinDate.getMonth(), this.LandConversionMinDate.getDate());
    this.LandConversionMaxDate.setFullYear(this.LandConversionMaxDate.getFullYear());
    this.LandConversionMaxDate = new Date(this.LandConversionMaxDate.getFullYear(), this.LandConversionMaxDate.getMonth(), this.LandConversionMaxDate.getDate());
    this.LandDetailForm = this.formBuilder.group(
      {
        ddlCollegeId: [''],
        ddlLandAreaId: ['', [DropdownValidators]],
        ddlLandDocumentTypeId: ['', [DropdownValidators]],
        ddlLandconvertedId: ['', [DropdownValidators]],
   /*     ddlLandTypeId: ['', [DropdownValidators]],*/
     /*   txtKhasraNumber: ['', Validators.required],*/
        txtLandOwnerName: ['', Validators.required],
        txtLandArea: ['', [Validators.required, Validators.min(1)]],
        //txtBuildingHostelQuartersRoadArea: ['', [Validators.required, Validators.min(1)]],
        //txtGroundCycleStandArea: ['', Validators.required],
        txtTotalLandArea: [{ value: '', disabled: true }, Validators.required],
        dtLandConversionOrderDate: [''],
        dtAffidavitDate: [''],
        txtLandConversionOrderNo: [''],
      });
    this.request.BuildingHostelQuartersRoadArea = 0;
    this.request.LandDetailDocument = [];
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.loaderService.requestStarted();
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));


    await this.GetLandAreaMasterList_DepartmentWise(this.SelectedDepartmentID, this.SelectedCollageID);
    await this.GetLandDoucmentTypeMasterList_DepartmentWise(this.SelectedDepartmentID);

    await this.GetLandDocument(this.SelectedDepartmentID, 'LandDetail');
    await this.GetLandconverted(this.SelectedDepartmentID, 'LandConversion');
    await this.GetUnitOfLandArea(this.SelectedDepartmentID, 'LandUnit');

    await this.GetMinimumAreaBuildingHostelQuartersRoad(this.SelectedDepartmentID, 'BuildingMinimumArea');
    await this.GetMinimumAreaGroundCycleStand(this.SelectedDepartmentID, 'GroundMinimumArea');

    await this.GetCollageList_DepartmentAndSSOIDWise(this.SelectedDepartmentID, this.sSOLoginDataModel.SSOID, 'LandDetails');
    await this.GetTermAndConditionList_DepartmentWise(this.SelectedDepartmentID);
    /* this.GetLandTypeMasterList_DepartmentAndLandConvertWise(this.SelectedDepartmentID, this.request.LandConvertedID.toString());*/

    await this.GetLandDetailsDataList();

    this.CollegeData = this.CollegeData.filter((element: any) => {
      return element.CollegeID == this.SelectedCollageID;
    });


    this.request.CollegeID = this.SelectedCollageID;
  }

  get form() { return this.LandDetailForm.controls; }
  async GetLandAreaMasterList_DepartmentWise(DepartmentID: number, CollageID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLandAreaMasterList_DepartmentWise(DepartmentID, CollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.LandAreaData = data['Data'];
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
  async GetLandDoucmentTypeMasterList_DepartmentWise(DepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLandDoucmentTypeMasterList_DepartmentWise(DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.LandDocumentTypeData = data['Data'];
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

 
  


  async GetLandTypeMasterList_DepartmentAndLandConvertWise(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLandTypeMasterList_DepartmentAndLandConvertWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.LandTypeData = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetLandTypeDetails_CollegeWise(DepartmentID: number, Type: string, LandTypeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLandTypeDetails_CollegeWise(DepartmentID, Type, LandTypeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
         this.request.CollegeLandTypeDetails = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async GetLandDocument(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDocumentMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.LandDetailDocument = data['Data'];
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
  async GetLandconverted(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.LandConversionData = data['Data'];
          console.log(this.LandConversionData);
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

  async GetUnitOfLandArea(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.UnitOfLand = data['Data'][0]['Name'];
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

  async GetMinimumAreaBuildingHostelQuartersRoad(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.MinimumAreaBuildingHostelQuartersRoad = data['Data'][0]['Name'];;
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
  async GetMinimumAreaGroundCycleStand(DepartmentID: number, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(DepartmentID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.MinimumAreaGroundCycleStand = data['Data'][0]['Name'];;
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

  async GetCollageList_DepartmentAndSSOIDWise(DepartmentID: number, LoginSSOID: string, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollageList_DepartmentAndSSOIDWise(DepartmentID, LoginSSOID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeData = data['Data'];
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

  async GetTermAndConditionList_DepartmentWise(DepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTermAndConditionList_DepartmentWise(DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TermAndConditionData = data['Data'];
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
  async GetAnnexureDataList_DepartmentWise(DepartmentID: number, LandDocumentTypeID: number, LandConvertedID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetAnnexureDataList_DepartmentWise(DepartmentID, LandDocumentTypeID, LandConvertedID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AnnexureData = data['Data'];
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

  async GetLandSqureMeterMappingDetails(LandAreaId: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLandSqureMeterMappingDetails_DepartmentWise(this.SelectedDepartmentID, this.SelectedCollageID, LandAreaId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.Data.length > 0) {
            this.RequiredLandArea = data['Data'][0]["RequiredSquareMeter"];
            this.RequiredLandAreaMsg = data['Data'][0]["RequiredSquareMeter"].toString() + ' ' + data['Data'][0]["AreaType"].toString();
            this.LandUnitType = data['Data'][0]["AreaType"];
            this.IsRequiredLandArea = true;

          }
          else {
            this.RequiredLandArea = 0;
            this.RequiredLandAreaMsg = '';
            this.LandUnitType = '';
            this.IsRequiredLandArea = false;
            //this.toastr.warning("Land Area  mapping record not found. ")
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
  async onFilechange(event: any, item: LandDetailDocumentDataModel) {
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
  async DeleteImage(item: LandDetailDocumentDataModel) {
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

  async AddLandDetails() {
    this.IstxtBuildingHostel = false;
    this.isSubmitted = true;
    var message = '';
    console.log(this.request)

    if (this.LandDetailForm.invalid) {
      return
    }
    //if (this.request.BuildingHostelQuartersRoadArea <= 0 || (this.request.BuildingHostelQuartersRoadArea).toString() == "") {
    //  this.IstxtBuildingHostel = true;
    //  return;
    //}
    var LandConversionName = this.LandConversionData.find((x: { ID: number; }) => x.ID == this.request.LandConvertedID).Name;
    if (LandConversionName == 'Partially Converted' || LandConversionName == 'Not Converted') {
      if (this.request.AffidavitDate == '' || this.request.AffidavitDate == null) {
        this.AffidavitDateValidate = 'This field is required .!';
        return
      }
    }
    if (LandConversionName == 'Fully Converted' || LandConversionName == 'Partially Converted') {
      if (this.request.LandConversionOrderDate == '' || this.request.LandConversionOrderDate == null) {
        this.LandConversionDateValidate = 'This field is required .!';
        return
      }
    }
    if (LandConversionName == 'Fully Converted' || LandConversionName == 'Partially Converted') {
      if (this.request.LandConversionOrderNo == '' || this.request.LandConversionOrderNo == null) {
        this.LandConversionOrderNoValidate = 'This field is required .!';
        return
      }
    }

    //Temp Comment Ravi added by naresh
    //if (this.request.LandArea < this.RequiredLandArea || this.RequiredLandArea == 0) {
    //  this.toastr.error("Land area must be at least : " + this.RequiredLandAreaMsg);
    //  return
    //}

    if (this.request.CollegeLandTypeDetails != null && this.request.CollegeLandTypeDetails.length > 0)
    {
      if (this.request.CollegeLandTypeDetails.filter(f => f.IsLandSelected == true).length <= 0) {
        this.toastr.error("please select at least one land type details");
        return;
      }
    }

    let totaldata = this.request.CollegeLandTypeDetails.filter(f => f.IsLandSelected == true).map(t => t.LandArea).reduce((acc, value) => acc + Number( value), 0);

    if (this.request.LandArea != Number(totaldata))
    {
      this.toastr.error("Total land area is not equal to sum of all land type that you have checked.total land area is : " + totaldata);
     return
    }
 
    

    for (var i = 0; i < this.request.LandDetailDocument.length; i++) {
      if (this.request.LandDetailDocument[i].FilePath == '' || this.request.LandDetailDocument[i].FilePath == undefined) {
        message = 'Please choose ' + this.request.LandDetailDocument[i].DocumentName + ' document';
        this.toastr.warning(message);
        return;
      }
    }
    if (message.length > 5) {
      this.toastr.warning(message);
      return
    }
    console.log(this.request.LandDetailDocument)
    this.request.IsConvereted = this.LandConversionData.find((x: { ID: number; }) => x.ID == this.request.LandConvertedID).Name,
      //Show Loading
      this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      debugger;
      this.request.CollegeLandTypeDetails = this.request.CollegeLandTypeDetails;

      await this.landDetailsService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            await this.GetLandDetailsDataList();
            await this.ResetControl();
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
        this.isSubmitted = false;
      }, 200);
    }

    //this.ResetControl();
    //this.GetTotalArea();
  }

  async DeleteLandDetail(LandDetailID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.landDetailsService.DeleteData(LandDetailID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetLandDetailsDataList();
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

  async GetLandDetailsDataList() {
    try {
      this.loaderService.requestStarted();
      await this.landDetailsService.GetLandDetailsList(this.SelectedCollageID, 0)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.LandDetailsList = data['Data'][0]['data']['Table'];
         // this.LandDetailsDocumentList = data['Data'][0]['data']['Table1'];
          console.log(this.LandDetailsDocumentList);

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
  async ViewViewLandDetailDocumentByID(LandDetailID: any) {
    try {

      this.LandDetailsDocumentListByID = [];
      this.DetailoftheLand = [];
      this.loaderService.requestStarted();
      await this.landDetailsService.GetLandDetailsIDWise(LandDetailID, this.SelectedCollageID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          //this.request.LandDetailDocument = data['Data'][0]["LandDetailDocument"];
          this.LandDetailsDocumentListByID = data['Data'][0]["LandDetailDocument"];
          this.DetailoftheLand = data['Data'][0]["CollegeLandTypeDetails"];
          console.log(this.request.LandDetailDocument);
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
      this.request.LandDetailID = 0;
      this.request.LandAreaID = 0;
      this.request.LandDocumentTypeID = 0;
      this.request.LandConvertedID = 0;
      this.request.LandTypeID = 0;
      this.request.LandArea = 0;
      this.request.KhasraNumber = '';
      this.request.LandOwnerName = '';
      this.request.BuildingHostelQuartersRoadArea = 0;
      this.request.LandConversionOrderDate = '';
      this.request.AffidavitDate = '';
      this.request.LandConversionOrderNo = '';
      this.request.ActiveStatus = true;
      this.request.CollegeName = '';
      this.request.LandAreaSituatedName = '';
      this.request.LandDocumentTypeName = '';
      this.request.IsConvereted = '';
      this.request.LandTypeName = '';
      this.RequiredLandArea = 0;
      this.IsRequiredLandArea = false;
      this.RequiredLandAreaMsg = '';
      this.LandUnitType = '';
      this.request.LandDetailDocument = [];
      this.request.CollegeLandTypeDetails = [];
      this.ShowConversionOrderNo = false;
      this.isDisabledGrid = false;
      await this.GetLandDocument(this.SelectedDepartmentID, 'LandDetail');
      const btnSave = document.getElementById('btnAddLandDetail')
      if (btnSave) btnSave.innerHTML = "Save";
      //this.LandDocumentFile.nativeElement.value = "";
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

  async Edit_OnClick(LandDetailID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.landDetailsService.GetLandDetailsIDWise(LandDetailID, this.SelectedCollageID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //console.log(data['Data'][0]['data']);
          //console.log(data['Data'][0]['CollegeID']);
          this.request.CollegeID = data['Data'][0]['CollegeID'];
          this.request.LandDetailID = data['Data'][0]['LandDetailID'];
          this.request.LandAreaID = data['Data'][0]['LandAreaID'];
          this.request.LandDocumentTypeID = data['Data'][0]['LandDocumentTypeID'];
          this.request.LandConvertedID = data['Data'][0]['LandConvertedID'];
          await this.GetLandDocuments(this.request.LandConvertedID.toString(), 'Yes');
          this.request.LandTypeID = data['Data'][0]['LandTypeID'];
          this.request.LandArea = data['Data'][0]['LandArea'];

          this.request.KhasraNumber = data['Data'][0]['KhasraNumber'];
          this.request.LandOwnerName = data['Data'][0]['LandOwnerName'];
          this.request.BuildingHostelQuartersRoadArea = data['Data'][0]['BuildingHostelQuartersRoadArea'];
          this.request.LandConversionOrderDate = data['Data'][0]['LandConversionOrderDate'];
          this.request.AffidavitDate = data['Data'][0]['AffidavitDate'];
          this.request.LandConversionOrderNo = data['Data'][0]['LandConversionOrderNo'];
          this.request.ActiveStatus = data['Data'][0]['ActiveStatus'];
          this.request.CollegeName = data['Data'][0]['CollegeName'];
          this.request.LandAreaSituatedName = data['Data'][0]['LandAreaSituatedName'];
          this.request.LandDocumentTypeName = data['Data'][0]['LandDocumentTypeName'];
          this.request.IsConvereted = data['Data'][0]['IsConvereted'];
          this.request.LandTypeName = data['Data'][0]['LandTypeName'];
          this.request.LandDetailDocument = data['Data'][0]["LandDetailDocument"];

        

          this.GetLandSqureMeterMappingDetails(this.request.LandAreaID);
          console.log(this.request.LandDetailDocument);
          this.isDisabledGrid = true;
          const btnSave = document.getElementById('btnAddLandDetail')
          if (btnSave) btnSave.innerHTML = "Update";
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async GetLandDocuments(LandConvertedID: string, IsEdit: string = 'No') {

    console.log(this.LandConversionData);
    var Code = this.LandConversionData.find((x: { ID: number; }) => x.ID == Number(LandConvertedID)).Code;

    this.ShowConversionOrderNo = false;
    this.ShowAffidavitDate = false;
    var Type = '';


    if (Code == 'FCON') {
      this.ShowConversionOrderNo = true;
      Type = 'LandDetail||FullyPartialConvertLandDetail';
    }
    else if (Code == 'PCON') {
      this.ShowConversionOrderNo = true;
      this.ShowAffidavitDate = true;
      Type = 'LandDetail||FullyPartialConvertLandDetail||PartialConvertLandDetail||PartialNoConvertLandDetail';
    }
    else if (Code == 'NCON') {
      this.ShowConversionOrderNo = false;
      this.ShowAffidavitDate = true;
      Type = 'LandDetail||NoConvertLandDetail||PartialNoConvertLandDetail';
    }
    else {
      this.ShowConversionOrderNo = false;
      this.ShowAffidavitDate = false;
      Type = 'LandDetail';
    }

    await this.GetLandTypeMasterList_DepartmentAndLandConvertWise(this.SelectedDepartmentID, Code);
    await this.GetLandTypeDetails_CollegeWise(this.SelectedDepartmentID, Code, this.request.LandDetailID);

    if (IsEdit != 'Yes') {
      await this.GetLandDocument(this.SelectedDepartmentID, Type);
    }
    await this.GetAnnexureDataList_DepartmentWise(this.SelectedDepartmentID, this.request.LandDocumentTypeID, this.request.LandConvertedID);
  }

  async ApplyNocFor_cbChange(event: any,  item: any) {
    try {
      debugger
      this.loaderService.requestStarted();
      //unchecked
      if (!event.target.checked)
      {
        item.LandArea = 0;
        item.KhasraNo = '';
        return;
      }
     
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
 
}
