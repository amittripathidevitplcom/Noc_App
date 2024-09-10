import { Component } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { DropdownValidators, DropdownValidatorsString } from '../../../Services/CustomValidators/custom-validators.service';
import { DefaulterCollegeRequestDataModel, DefaulterCollegeSearchFilterDataModel } from '../../../Models/DefaulterCollegeRequestDataModel';
import { DefaulterCollegeRequestService } from '../../../Services/DefaulterCollegeRequest/DefaulterCollegeRequest.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-defaulter-college-request',
  templateUrl: './defaulter-college-request.component.html',
  styleUrls: ['./defaulter-college-request.component.css']
})
export class DefaulterCollegeRequestComponent {
  DefaulterCollegeForm!: FormGroup;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public UserID: number = 0;

  public DivisionList: any = [];
  public DistrictList: any = [];
  public CollegeTypeList: any = [];
  public UniversityList: any = [];
  public PresentCollegeStatusList: any = [];
  public CollegeLevelList: any = [];
  public CollegeLevelList_FilterData: any = [];
  public EstablishmentYearList: any = [];
  public DefaulterCollegeList: any = [];
  //Files
  public file!: File;
  public showFirstNOCDoc: boolean = false;
  public FirstNOCDocValidationMessage: string = '';
  public showLastNOCDoc: boolean = false;
  public LastNOCDocValidationMessage: string = '';
  public showLatestAffiliationDoc: boolean = false;
  public LatestAffiliationDocValidationMessage: string = '';
  public showResultLastSessionDoc: boolean = false;
  public ResultLastSessionDocValidationMessage: string = '';
  public showLastSessionProofOfExaminationDoc: boolean = false;
  public LastSessionProofOfExaminationDocValidationMessage: string = '';


  request = new DefaulterCollegeRequestDataModel();
  searchrequest = new DefaulterCollegeSearchFilterDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public DepartmentList: any = [];
  constructor(private modalService: NgbModal,private DefaulterCollegeRequestService: DefaulterCollegeRequestService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private fileUploadService: FileUploadService) {
  }
  get form() { return this.DefaulterCollegeForm.controls; }

  async ngOnInit() {
    this.DefaulterCollegeForm = this.formBuilder.group(
      {
        ddlEverAppliedNOC: ['', [DropdownValidatorsString]],
        ddlIsPNOC: ['', [DropdownValidatorsString]],
        txtLastApplicationNo: ['', Validators.required],
        txtLastApplicationSubmittedDate: ['', Validators.required],
        ddlDivisionID: ['', [DropdownValidators]],
        ddlDistrictID: ['', [DropdownValidators]],
        txtCollegeNameEn: ['', Validators.required],
        txtCollegeNameHi: ['', Validators.required],
        txtEmail: ['', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
        txtMobileNumber: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]],
        ddlCollegeTypeID: ['', [DropdownValidators]],
        ddlUniversityID: ['', [DropdownValidators]],
        ddlPresentCollegeStatus: ['', [DropdownValidators]],
        ddlCollegeLevelID: ['', [DropdownValidators]],
        ddlEstablishmentYearID: ['', [DropdownValidators]],
        ddlCaseOperatedTNOCLevel: ['', [DropdownValidatorsString]],
        ddlLastSessionOfTNOCID: ['', [DropdownValidators]],
        FirstNOCDoc: [''],
        LastNOCDoc: [''],
        LatestAffiliationDoc: [''],
        ResultLastSessionDoc: [''],
        LastSessionProofOfExaminationDoc: [''],
        ddlDepartmentID: ['', [DropdownValidators]]
      });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDDLList();
    await this.GetDepartmentList();
    await this.GetDefaulterCollegeList();
  }

  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList_IsOpenDefaulter()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentList = data['Data'];
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
  async GetDDLList() {
    try {
      this.loaderService.requestStarted();

      // college Division
      await this.commonMasterService.GetDivisionList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionList = data['Data'];
        }, error => console.error(error));

      // College Type
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(3, "CollegeType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeTypeList = data['Data'];
        }, error => console.error(error));

      // college Present status
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "PresentCollegeStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PresentCollegeStatusList = data['Data'];
          if (this.request.DepartmentID == 11) {
            this.PresentCollegeStatusList = data['Data'];
          }
        }, error => console.error(error));

      // college level
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(this.request.DepartmentID, "CollegeLevel")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeLevelList = data['Data'];
        }, error => console.error(error));

      // Establishment Year
      await this.commonMasterService.GetAllFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.EstablishmentYearList = data['Data'];
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

  async FillDivisionRelatedDDL(SelectedDivisionID: string,) {
    try {
      this.loaderService.requestStarted();
      const divisionId = Number(SelectedDivisionID);
      if (divisionId <= 0) {
        return;
      }
      // college status
      await this.commonMasterService.GetDistrictByDivsionId(divisionId)
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



  async ddlCollegeType_TextChange(SelectedCollegeTypeID: string) {
    console.log('DepartmentID' + this.request.DepartmentID);
    this.loaderService.requestStarted();
    try {
      if (this.request.DepartmentID == 3) {
        let Item = this.CollegeTypeList.filter((element: any) => {
          return element.ID == SelectedCollegeTypeID;
        });

        if (Item[0]['Name'] == 'Law Co-ed' || Item[0]['Name'] == 'Law Girls') {
          await this.commonMasterService.GetUniversityByDepartmentId(3, 1)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              this.UniversityList = data['Data'];
            }, error => console.error(error));
        }
      }
      else {
        await this.commonMasterService.GetUniversityByDepartmentId(3)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            this.UniversityList = data['Data'];
          }, error => console.error(error));
      }
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

    //  console.log(Item[0]['Name']);

  }

  async ddlPresentCollegeStatus_TextChange(SelectedPresentCollegeStatusID: string) {
    if (3 == 3) {
      try {
        this.loaderService.requestStarted();
        const SelectedPresentCollegeStatusID1 = Number(SelectedPresentCollegeStatusID);
        let SelectdNOCStatus = this.PresentCollegeStatusList.find((x: { ID: number; }) => x.ID == SelectedPresentCollegeStatusID1).Name;
        if (SelectdNOCStatus == "TNOC Holder") {
          this.CollegeLevelList_FilterData = this.CollegeLevelList.filter((element: any) => {
            return element.Name == "UG";
          });
        }
        else {
          this.CollegeLevelList_FilterData = this.CollegeLevelList;
        }
      }
      catch (ex) {
        console.log(ex)
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    }
  }

  async SaveData() {
    this.isSubmitted = true;
    let isValid = true;
    this.request.SSOID = this.sSOLoginDataModel.SSOID;

    if (this.request.FirstNOCDoc == null || this.request.FirstNOCDoc == '') {
      isValid = false;
      this.FirstNOCDocValidationMessage = 'This field is required .!';
    }
    if (this.request.LastNOCDoc == null || this.request.LastNOCDoc == '') {
      isValid = false;
      this.LastNOCDocValidationMessage = 'This field is required .!';
    }
    if (this.request.LatestAffiliationDoc == null || this.request.LatestAffiliationDoc == '') {
      isValid = false;
      this.LatestAffiliationDocValidationMessage = 'This field is required .!';
    }
    if (this.request.ResultLastSessionDoc == null || this.request.ResultLastSessionDoc == '') {
      isValid = false;
      this.ResultLastSessionDocValidationMessage = 'This field is required .!';
    }
    if (this.request.LastSessionProofOfExaminationDoc == null || this.request.LastSessionProofOfExaminationDoc == '') {
      isValid = false;
      this.LastSessionProofOfExaminationDocValidationMessage = 'This field is required .!';
    }

    console.log(this.request);
    if (!isValid) {
      return;
    }
    if (this.DefaulterCollegeForm.invalid) {
      return;
    }


    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.DefaulterCollegeRequestService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage)
            await this.ClearForm();
            await this.GetDefaulterCollegeList();
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
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

  async ddlEverAppliedNOCStatus_TextChange(SelectedEverAppliedId: string) {
    if (SelectedEverAppliedId == 'Yes') {
      //set Validators
      this.DefaulterCollegeForm.get('txtLastApplicationNo')?.setValidators([Validators.required]);
      this.DefaulterCollegeForm.get('txtLastApplicationSubmittedDate')?.setValidators([Validators.required]);

      //clear Validators
      this.request.CollegeName = '';
      this.DefaulterCollegeForm.get('txtCollegeNameEn')?.clearValidators();
      this.request.DivisionID = 0;
      this.DefaulterCollegeForm.get('ddlDivisionID')?.clearValidators();
      this.request.CollegeNameHi = '';
      this.DefaulterCollegeForm.get('txtCollegeNameHi')?.clearValidators();
      this.request.DistrictID = 0;
      this.DefaulterCollegeForm.get('ddlDistrictID')?.clearValidators();
      this.request.CollegeEmail = '';
      this.DefaulterCollegeForm.get('txtEmail')?.clearValidators();
      this.request.CollegeMobileNo = '';
      this.DefaulterCollegeForm.get('txtMobileNumber')?.clearValidators();
      this.request.CollegeTypeID = 0;
      this.DefaulterCollegeForm.get('ddlCollegeTypeID')?.clearValidators();
      this.request.UniversityID = 0;
      this.DefaulterCollegeForm.get('ddlUniversityID')?.clearValidators();
      this.request.CollegePresentStatusID = 0;
      this.DefaulterCollegeForm.get('ddlPresentCollegeStatus')?.clearValidators();
      this.request.CollegeLevelID = 0;
      this.DefaulterCollegeForm.get('ddlCollegeLevelID')?.clearValidators();
      this.request.EstablishmentYearID = 0;
      this.DefaulterCollegeForm.get('ddlEstablishmentYearID')?.clearValidators();

    }
    else if (SelectedEverAppliedId == 'No') {
      //set Validators
      this.DefaulterCollegeForm.get('txtCollegeNameEn')?.setValidators([Validators.required]);
      this.DefaulterCollegeForm.get('ddlDivisionID')?.setValidators([DropdownValidators]);
      this.DefaulterCollegeForm.get('txtCollegeNameHi')?.setValidators([Validators.required]);
      this.DefaulterCollegeForm.get('ddlDistrictID')?.setValidators([DropdownValidators]);
      this.DefaulterCollegeForm.get('txtEmail')?.setValidators([Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]);
      this.DefaulterCollegeForm.get('txtMobileNumber')?.setValidators([Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]);
      this.DefaulterCollegeForm.get('ddlCollegeTypeID')?.setValidators([DropdownValidators]);
      this.DefaulterCollegeForm.get('ddlUniversityID')?.setValidators([DropdownValidators]);
      this.DefaulterCollegeForm.get('ddlPresentCollegeStatus')?.setValidators([DropdownValidators]);
      this.DefaulterCollegeForm.get('ddlCollegeLevelID')?.setValidators([DropdownValidators]);
      this.DefaulterCollegeForm.get('ddlEstablishmentYearID')?.setValidators([DropdownValidators]);

      //clear Validators
      this.request.LastApplicationNo = '';
      this.DefaulterCollegeForm.get('txtLastApplicationNo')?.clearValidators();
      this.request.LastApplicationSubmittedDate = '';
      this.DefaulterCollegeForm.get('txtLastApplicationSubmittedDate')?.clearValidators();

    }
    //update Validators
    this.DefaulterCollegeForm.get('txtLastApplicationNo')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('txtLastApplicationSubmittedDate')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('txtCollegeNameEn')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('ddlDivisionID')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('txtCollegeNameHi')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('ddlDistrictID')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('txtEmail')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('txtMobileNumber')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('ddlCollegeTypeID')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('ddlUniversityID')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('ddlPresentCollegeStatus')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('ddlCollegeLevelID')?.updateValueAndValidity();
    this.DefaulterCollegeForm.get('ddlEstablishmentYearID')?.updateValueAndValidity();
  }

  async ddlIsPNOCStatus_TextChange(SelectedIsPNOCId: string) {
    if (SelectedIsPNOCId == 'Yes') {
      this.DefaulterCollegeForm.get('ddlCaseOperatedTNOCLevel')?.setValidators([DropdownValidatorsString]);
    }
    else if (SelectedIsPNOCId == 'No') {
      this.request.CaseOperatedTNOCLevel = '';
      this.DefaulterCollegeForm.get('ddlCaseOperatedTNOCLevel')?.clearValidators();
    }
    this.DefaulterCollegeForm.get('ddlCaseOperatedTNOCLevel')?.updateValueAndValidity();
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async onFilechange(event: any, Type: string) {

    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (Type == 'FirstNOCDoc' || Type == 'LastNOCDoc' || Type == 'LatestAffiliationDoc' || Type == 'ResultLastSessionDoc' || Type == 'LastSessionProofOfExaminationDoc') {
          if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'application/pdf') {
            //size validation
            if (this.file.size > 2000000) {
              this.ResetFileAndValidation(Type, 'Select less then 2MB File', '', '', '', false);
              this.toastr.error('Select less then 2MB File')
              return
            }
            //if (this.file.size < 499000) {
            //  this.ResetFileAndValidation(Type, 'Select more then 499kb File', '', '', '', false);
            //  this.toastr.error('Select more then 499kb File')
            //  return
            //}
          }
          else {
            this.toastr.warning('Select Only jpg/jpeg/pdf');
            // type validation
            this.ResetFileAndValidation(Type, 'Select Only jpg/jpeg/pdf', '', '', '', false);
            return
          }
          // upload to server folder
          await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.ResetFileAndValidation(Type, '', data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"], true);
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
      else {
        this.ResetFileAndValidation(Type, '', '', '', '', false);
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        event.target.value = null;
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DeleteImage(Type: string, file: string) {
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        // delete from server folder
        await this.fileUploadService.DeleteDocument(file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation(Type, '', '', '', '', false);
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

  public files: any = '';
  ResetFileAndValidation(type: string, msg: string, name: string, path: string, dis_Name: string, isShowFile: boolean) {
    //event.target.value = '';
    try {
      this.loaderService.requestStarted();
      if (type == 'FirstNOCDoc') {
        this.showFirstNOCDoc = isShowFile;
        this.FirstNOCDocValidationMessage = msg;
        this.request.FirstNOCDoc = name;
        this.request.FirstNOCDocPath = path;
        this.request.FirstNOCDoc_DisName = dis_Name;
        this.files = document.getElementById('FirstNOCDoc');
        this.files.value = '';
      }
      else if (type == 'LastNOCDoc') {
        this.showLastNOCDoc = isShowFile;
        this.LastNOCDocValidationMessage = msg;
        this.request.LastNOCDoc = name;
        this.request.LastNOCDocPath = path;
        this.request.LastNOCDoc_DisName = dis_Name;
        this.files = document.getElementById('LastNOCDoc');
        this.files.value = '';
      }
      else if (type == 'LatestAffiliationDoc') {
        this.showLatestAffiliationDoc = isShowFile;
        this.LatestAffiliationDocValidationMessage = msg;
        this.request.LatestAffiliationDoc = name;
        this.request.LatestAffiliationDocPath = path;
        this.request.LatestAffiliationDoc_DisName = dis_Name;
        this.files = document.getElementById('LatestAffiliationDoc');
        this.files.value = '';
      }
      else if (type == 'ResultLastSessionDoc') {
        this.showResultLastSessionDoc = isShowFile;
        this.ResultLastSessionDocValidationMessage = msg;
        this.request.ResultLastSessionDoc = name;
        this.request.ResultLastSessionDocPath = path;
        this.request.ResultLastSessionDoc_DisName = dis_Name;
        this.files = document.getElementById('ResultLastSessionDoc');
        this.files.value = '';
      }
      else if (type == 'LastSessionProofOfExaminationDoc') {
        this.showLastSessionProofOfExaminationDoc = isShowFile;
        this.LastSessionProofOfExaminationDocValidationMessage = msg;
        this.request.LastSessionProofOfExaminationDoc = name;
        this.request.LastSessionProofOfExaminationDocPath = path;
        this.request.LastSessionProofOfExaminationDoc_DisName = dis_Name;
        this.files = document.getElementById('LastSessionProofOfExaminationDoc');
        this.files.value = '';
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
  DefaulterCollegeDetailsData: any = {};
  public ShowRegister: boolean = false;
  async GetDefaulterCollegeList() {
    this.DefaulterCollegeDetailsData = {};
    this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID;
    this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.DefaulterCollegeRequestService.GetDefaulterCollegeRequestData(this.searchrequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DefaulterCollegeList = data['Data'][0]['data'];
          if (this.DefaulterCollegeList.length > 0) {
            let ApprovePendingList = this.DefaulterCollegeList.filter((x: { ApplicationStatus: string; }) => x.ApplicationStatus == 'Approve' || x.ApplicationStatus == 'Pending');
            if (ApprovePendingList.length > 0) {
              this.ShowRegister = true;
            }
          }
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
  async Edit_OnClick(RequestID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      this.searchrequest.RequestID = RequestID;
      this.searchrequest.UserID = this.UserID;

      await this.DefaulterCollegeRequestService.GetDefaulterCollegeRequestData(this.searchrequest)
        .then(async (data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'][0]['data'][0];
          if (this.request.EverAppliedNOC == 'No') {
            await this.FillDivisionRelatedDDL(this.request.DivisionID.toString());
            await this.ddlCollegeType_TextChange(this.request.CollegeTypeID.toString());
            await this.ddlPresentCollegeStatus_TextChange(this.request.CollegePresentStatusID.toString());
          }
          await this.ddlEverAppliedNOCStatus_TextChange(this.request.EverAppliedNOC);
          await this.ddlIsPNOCStatus_TextChange(this.request.IsPNOC);

          const btnSave = document.getElementById('btnSave')
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

  async Delete_OnClick(RequestID: number) {
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.DefaulterCollegeRequestService.Delete(RequestID, this.UserID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetDefaulterCollegeList();
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
  async ClearForm() {
    this.DefaulterCollegeForm.reset();
    this.request.RequestID = 0;
    this.request.FirstNOCDoc = '';
    this.request.LastNOCDoc = '';
    this.request.LatestAffiliationDoc = '';
    this.request.ResultLastSessionDoc = '';
    this.request.LastSessionProofOfExaminationDoc = '';
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = `<i class="fa fa-save"></i> Register`;
  }
  modalReference!: NgbModalRef;
  closeResult!: string;
  public DefaulterCollegePenaltyList: any = [];
  public ApplicationStatus: any = [];
  async OpenPenaltyModel(content: any, RequestID: number, Status: string) {
    this.ApplicationStatus = '';
    this.ApplicationStatus = Status;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetDefaulterCollegePenaltyData(RequestID);
  }
  async GetDefaulterCollegePenaltyData(RequestID: number) {
    this.DefaulterCollegePenaltyList = [];
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.DefaulterCollegeRequestService.GetDefaulterCollegePenalty(RequestID, 0)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DefaulterCollegePenaltyList = data['Data'][0]['data'];
        });
    }
    catch (ex) { console.log(ex) }
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

  async ViewDetails(content: any, RequestID: number) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetApplicationDetails(RequestID);
  }
  async GetApplicationDetails(RequestID: number) {
    try {
      this.DefaulterCollegeDetailsData = {};
      this.searchrequest.RequestID = RequestID;
      this.loaderService.requestStarted();
      await this.DefaulterCollegeRequestService.GetDefaulterCollegeRequestData(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.DefaulterCollegeDetailsData = data['Data'][0]['data'][0];
        }, (error: any) => console.error(error));
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
