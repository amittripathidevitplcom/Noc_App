import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { __rest } from 'tslib';
import { DCENOCReportSearchFilterDataModel } from '../../../Models/SearchFilterDataModel';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UnlockApplicationDataModel } from '../../../Models/CommonMasterDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';

@Injectable()

@Component({
  selector: 'app-dcenocreport',
  templateUrl: './dcenocreport.component.html',
  styleUrls: ['./dcenocreport.component.css']
})
export class DCENOCReportComponent implements OnInit {
  request = new DCENOCReportSearchFilterDataModel();
  requestUnlock = new UnlockApplicationDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  //Add FormBuilder
  public DistrictList: any = [];
  public UniversityList: any = [];
  public CollegeStatusList: any = [];
  public WorkFlowActionList: any = [];
  public NodalOfficerList: any = [];
  public CollegeTypeList: any = [];
  public ApplicationTypeList: any = [];
  public ApplicationList: any = [];
  public ApplicationCountList: any = [];
  public QueryStringStatus: string = '';
  public searchText: string = '';
  public SuvdivisionList: any = [];
  public DivisionList: any = [];

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  constructor(private fileUploadService: FileUploadService,private modalService: NgbModal,private routers: Router,private router: ActivatedRoute,private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());

    this.request.ReportStatus = this.QueryStringStatus;
    await this.LoadMaster();
    await this.GetDCENOCReportData();
    await this.GetApplicationCountRoleWise();
    await this.GetRoleListForApporval();
  }


  async LoadMaster() {
    try {
      this.DistrictList = [];
      this.loaderService.requestStarted();
      //await this.commonMasterService.GetDistrictListByStateID(6)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.DistrictList = data['Data'];
      //  }, error => console.error(error));
      await this.commonMasterService.GetUniversityByDepartmentId(3)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UniversityList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(3, "CourseType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeStatusList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetWorkFlowStatusbyDepartment(3)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.WorkFlowActionList = data['Data'][0]['data'];
        }, error => console.error(error));
      await this.commonMasterService.GetUsersByRoleDepartment(3,17)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.NodalOfficerList = data['Data'][0]['data'];
        }, error => console.error(error));
      await this.commonMasterService.GetCommonMasterList_DepartmentAndTypeWise(3, "CollegeType")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
            this.CollegeTypeList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.GetApplyNOCParameterbyDepartment(3)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ApplicationTypeList = data['Data'][0]['data'];
        }, error => console.error(error));
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


  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  


  async GetDCENOCReportData() {
    try {
      this.request.ApplicationID = this.request.ApplicationID == null || this.request.ApplicationID.toString() == '' || this.request.ApplicationID == undefined ? 0 : this.request.ApplicationID;
      if (this.request.ReportStatus == null || this.request.ReportStatus == undefined) {
        this.request.ReportStatus =  '';
      }

      this.ApplicationList = [];
      this.loaderService.requestStarted();
      await this.dceDocumentScrutinyService.GetDCENOCReportData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationList = data['Data'];

          console.log(data);
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
  async GetApplicationCountRoleWise() {
    try {
      this.ApplicationCountList = [];
      this.loaderService.requestStarted();
      await this.commonMasterService.GetApplicationCountRoleWise(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationCountList = data['Data'][0];

          console.log(data);
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

  async ApplicationSummary_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }

  public isLoadingExport: boolean = false;
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.ApplicationList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][8] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "NOCApplicationList.xlsx");
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
  async ResetControl() {
    this.request = new DCENOCReportSearchFilterDataModel();
  }


  async FillDivisionRelatedDDL(SelectedDivisionID: string) {
    this.DistrictList = [];
    this.request.DistrictID = 0;
    this.SuvdivisionList = [];
    this.request.SubDivisionID = 0;
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
  async FillDistrictRelatedDDL(SelectedDistrictID: string) {
    this.SuvdivisionList = [];
    this.request.SubDivisionID = 0;
    try {
      this.loaderService.requestStarted();
      const districtId = Number(SelectedDistrictID);
      if (districtId <= 0) {
        return;
      }
      // subdivision list
      await this.commonMasterService.GetSuvdivisionByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
            this.SuvdivisionList = data['Data'];
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


  public UserRoleList: any = [];
  public FormSubmit: boolean = false;
  async GetRoleListForApporval() {
    this.UserRoleList = [];
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetRoleListForApporval(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.UserRoleList = data['Data'];
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

  async UnlockApplicationModel(content: any, ApplyNOCID: number,DepartmentID: number,CollegeID: number) {
    this.requestUnlock = new UnlockApplicationDataModel();
    this.requestUnlock.ApplyNOCID = ApplyNOCID;
    this.requestUnlock.DepartmentID = DepartmentID;
    this.requestUnlock.CollegeID = CollegeID;
    this.requestUnlock.UnlockSSOID = this.sSOLoginDataModel.SSOID;
    this.requestUnlock.CreatedBy = this.sSOLoginDataModel.UserID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
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


  public file!: File;
  public files: any = '';
  public PenaltyDocValidationMessage: string = '';
  async onFilechange(event: any) {

    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.requestUnlock.UnlockDoc = '';
            this.requestUnlock.UnlockDoc_DisName = '';
            this.requestUnlock.UnlockDocPath = '';
            this.files = document.getElementById('fuPenaltyDoc');
            this.files.value = '';
            this.toastr.error('Select less then 2MB File')
            return
          }

        }
        else {
          this.toastr.warning('Select Only jpdf');
          // type validation
          this.requestUnlock.UnlockDoc = '';
          this.requestUnlock.UnlockDoc_DisName = '';
          this.requestUnlock.UnlockDocPath = '';
          this.files = document.getElementById('fuPenaltyDoc');
          this.files.value = '';
          return
        }
        // upload to server folder
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.requestUnlock.UnlockDoc = data['Data'][0]["FileName"];
            this.requestUnlock.UnlockDoc_DisName = data['Data'][0]["Dis_FileName"];
            this.requestUnlock.UnlockDocPath = data['Data'][0]["FilePath"];
            this.files = document.getElementById('fuUnlockDoc');
            this.files.value = '';
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });

      }
      else {
        this.requestUnlock.UnlockDoc = '';
        this.requestUnlock.UnlockDoc_DisName = '';
        this.requestUnlock.UnlockDocPath = '';
        this.files = document.getElementById('fuUnlockDoc');
        this.files.value = '';
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
  async DeleteImage(file: string) {
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        // delete from server folder
        await this.fileUploadService.DeleteDocument(file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.requestUnlock.UnlockDoc = '';
            this.requestUnlock.UnlockDoc_DisName = '';
            this.requestUnlock.UnlockDocPath = '';
            this.files = document.getElementById('fuUnlockDoc');
            this.files.value = '';
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
  async SaveData() {
    this.FormSubmit = true;
    if (this.requestUnlock.Reason == '') {
      return;
    }
    if (this.requestUnlock.UnlockDoc == '') {
      return;
    }
   
    this.loaderService.requestStarted();
    try {
      if (confirm("Are you sure you unlock this application?")) {
        await this.commonMasterService.UnlockApplication(this.requestUnlock)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              this.FormSubmit = false;
              this.modalService.dismissAll('After Success');
              await this.GetDCENOCReportData();
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
