import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApplyNOCApplicationService } from '../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyNOCApplicationDataModel, CommiteeInspection_RNCCheckList_DataModel } from '../../Models/ApplyNOCApplicationDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from '../../Services/FileUpload/file-upload.service';

@Component({
  selector: 'app-commitee-inspection',
  templateUrl: './commitee-inspection.component.html',
  styleUrls: ['./commitee-inspection.component.css']
})
export class CommiteeInspectionComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplyNocDetails: ApplyNOCApplicationDataModel[] = [];
  public request: CommiteeInspection_RNCCheckList_DataModel[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public isFormvalid: boolean = true;
  public isActionValid: boolean = false;
  public isObjectionValid: boolean = false;
  public isRemarkValid: boolean = false;
  public ShowHideNextRoleNextUser: boolean = true;
  public isActionTypeValid: boolean = false;

  public UserRoleList: any[] = [];
  public UserListRoleWise: any[] = [];


  public NextRoleID: number = 0;
  public NextUserID: number = 0;
  public ActionID: number = 0;
  public CheckFinalRemark: string = '';
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public WorkFlowActionList: any[] = [];
  public CheckListData: any[] = [];

  public All_U_Select: boolean = false;
  constructor(private modalService: NgbModal, private loaderService: LoaderService, private toastr: ToastrService, private applyNOCApplicationService: ApplyNOCApplicationService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private fileUploadService: FileUploadService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetApplyNOCApplicationListByRole(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID);
    this.GetRoleListForApporval();
    this.GetWorkFlowActionListByRole();

    this.GetRNCCheckListByTypeDepartment();
  }

  async GetApplyNOCApplicationListByRole(RoleId: number, UserID: number) {
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GetApplyNOCApplicationListByRole(RoleId, UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplyNocDetails = data['Data'];
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

  async GetRNCCheckListByTypeDepartment() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRNCCheckListByTypeDepartment('MDHNM', this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckListData = data['Data'];
          console.log(this.CheckListData);
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


  async ApplicationPreview_OnClick(DepartmentID: number, CollegeID: number) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }


  async OpenActionPopUP(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number) {
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  private getDismissReason(reason: any): string {
    this.SelectedCollageID = 0;
    this.SelectedDepartmentID = 0;
    this.SelectedApplyNOCID = 0;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  public isNextRoleIDValid: boolean = false;
  public isNextUserIdValid: boolean = false;
  async DocumentScrutiny() {
    this.request = [];
    this.isFormvalid = true;
    this.isNextUserIdValid = false;
    this.isNextRoleIDValid = false;
    this.isRemarkValid = false;
    try {
      for (var i = 0; i < this.CheckListData.length; i++) {
        if (this.CheckListData[i].FileUpload == true) {
          if (this.CheckListData[i].FileUploadName == '' || this.CheckListData[i].FileUploadName == undefined) {
            this.toastr.warning('Please select a file for upload');
            return
          }
        }
        this.request.push({
          ApplyNOCID: this.SelectedApplyNOCID,
          RNCCheckListID: this.CheckListData[i].RNCCheckListID,
          CreatedBy: this.sSOLoginDataModel.UserID,
          FileUploadName: this.CheckListData[i].FileUpload == true ? this.CheckListData[i].FileUploadName : ""
        })
      }
      if (this.ActionID <= 0) {
        this.isActionTypeValid = true;
        this.isFormvalid = false;
      }
      if (this.CheckFinalRemark == '') {
        this.isRemarkValid = true;
        this.isFormvalid = false;
      }

      if (this.NextRoleID <= 0) {
        this.isNextRoleIDValid = true;
        this.isFormvalid = false;
      }

      if (this.NextUserID <= 0) {
        this.isNextUserIdValid = true;
        this.isFormvalid = false;
      }


      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.SaveCommiteeInspectionRNCCheckList(this.request).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.applyNOCApplicationService.DocumentScrutiny(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.ActionID, this.SelectedApplyNOCID, this.SelectedDepartmentID, this.CheckFinalRemark, this.NextRoleID, this.NextUserID)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.SuccessMessage = data['SuccessMessage'];
              this.ErrorMessage = data['ErrorMessage'];
              if (this.State == 0) {
                this.toastr.success(this.SuccessMessage);
                this.modalService.dismissAll('After Success');
                this.routers.navigate(['/dashboard']);
              }
              else if (this.State == 2) {
                this.toastr.warning(this.ErrorMessage)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            }, error => console.error(error));
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




  async GetRoleListForApporval() {
    this.UserRoleList = [];
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetRoleListForApporval(this.sSOLoginDataModel.RoleID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.UserRoleList = data['Data'];
            if (this.UserRoleList.length > 0) {
              this.NextRoleID = this.UserRoleList[0]['RoleID'];
              await this.GetUserDetailsByRoleID();
            }
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


  async GetUserDetailsByRoleID() {
    this.UserListRoleWise = [];
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetUserDetailsByRoleID(this.NextRoleID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.UserListRoleWise = data['Data'];
            if (this.UserListRoleWise.length > 0) {
              this.NextUserID = this.UserListRoleWise[0]['UId'];

            }
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

  async GetWorkFlowActionListByRole() {
    this.WorkFlowActionList = [];
    this.loaderService.requestStarted();
    try {
      await this.commonMasterService.GetWorkFlowActionListByRole(this.sSOLoginDataModel.RoleID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length > 0) {
            this.WorkFlowActionList = data['Data'];
            if (this.WorkFlowActionList.length > 0) {
              this.ActionID = this.WorkFlowActionList[0]['ActionID'];
            }
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


  checkboxthAll_checkboxchange($event: any, checkValuethAll: boolean) {
    this.All_U_Select = checkValuethAll;
    for (let item of this.CheckListData) {
      item.IsChecked = checkValuethAll;
    }
  }

  public file: any = '';
  async ValidateDocumentImage(event: any, idx: number) {
    this.loaderService.requestStarted();
    try {
      this.CheckListData[idx].ShowHideImgButton = false;
      if (event.target.files && event.target.files[0]) {
        if ((event.target.files[0].type === 'image/jpeg' ||
          event.target.files[0].type === 'image/jpg') ||
          event.target.files[0].type === 'application/pdf') {
          if (event.target.files[0].size > 2000000) {
            event.target.value = '';

            this.toastr.warning('Select less then 2MB File');
            return
          }
          if (event.target.files[0].size < 100000) {
            event.target.value = '';
            this.toastr.warning('Select more then 100kb File');
            return
          }
        }
        else {
          event.target.value = '';
          let msg = 'Select Only ';

          this.toastr.warning('Select Only JPG/JPEG/Pdf File');

          return
        }
        this.file = event.target.files[0];
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.CheckListData[idx].ShowHideImgButton = true;
            this.CheckListData[idx].FileUploadName = data['Data'][0]["FileName"];
            this.CheckListData[idx].FileUploadNamePath = data['Data'][0]["FilePath"];
            this.CheckListData[idx].FileUploadName_Dis_FileName = data['Data'][0]["Dis_FileName"];
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


  async DeleteImage(idx: number) {
    this.loaderService.requestStarted();
    try {
      // delete from server folder
      await this.fileUploadService.DeleteDocument(this.CheckListData[idx].FileUploadName).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          this.CheckListData[idx].ShowHideImgButton = false;
          this.CheckListData[idx].FileUploadName = '';
          this.CheckListData[idx].FileUploadNamePath = '';
          this.CheckListData[idx].FileUploadName_Dis_FileName = '';

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

      }, 200);
    }

  }
}
