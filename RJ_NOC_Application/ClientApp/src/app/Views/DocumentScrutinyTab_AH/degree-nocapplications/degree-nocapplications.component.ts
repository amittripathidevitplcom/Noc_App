import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { CommiteeInspection_RNCCheckList_DataModel, CommonDataModel_ApplicationListFilter, NOCIssuedForAHDegreeDataModel } from '../../../Models/ApplyNOCApplicationDataModel';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnimalDocumentScrutinyService } from '../../../Services/AnimalDocumentScrutiny/animal-document-scrutiny.service';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { ApplicationCommitteeMemberdataModel, PostApplicationCommitteeMemberdataModel } from '../../../Models/ApplicationCommitteeMemberdataModel';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';

@Component({
  selector: 'app-degree-nocapplications',
  templateUrl: './degree-nocapplications.component.html',
  styleUrls: ['./degree-nocapplications.component.css']
})
export class DegreeNOCApplicationsComponent implements OnInit {

  sSOLoginDataModel = new SSOLoginDataModel();
  request = new CommonDataModel_ApplicationListFilter();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplyNocDetails: any = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public QueryStatus: any = '';

  public editor: any = ClassicEditor;
  config = {
    toolbar: [
      'heading',
      '|',
      'alignment',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      'subscript',
      'superscript',
      '|',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      '-', // break point
      'fontfamily',
      'fontsize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'code',
      'codeBlock',
      '|',
      'insertTable',
      '|',
      'imageInsert',
      'blockQuote',
      '|',
      'undo',
      'redo',
    ],
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
      ],
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        // 'Popins'
      ],
    },
  };


  constructor(private applyNOCApplicationService: ApplyNOCApplicationService,private sSOLoginService: SSOLoginService, private committeeMasterService: CommitteeMasterService, private loaderService: LoaderService, private toastr: ToastrService, private animaldocumentscrutiny: AnimalDocumentScrutinyService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private modalService: NgbModal) { }
  onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.request.RoleID = this.sSOLoginDataModel.RoleID;
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.request.SessionYear = this.sSOLoginDataModel.SessionID;
    this.request.Status = this.QueryStatus;


    this.CommitteeMemberDetails = this.formBuilder.group(
      {
        txtCMNameOfPerson: ['', Validators.required],
        txtCMMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtSSOID: ['', Validators.required]
      })
    //await this.GetWorkflowPermissions();
    await this.GetApplyNOCApplicationListByRole();
  }
  get form_CommitteeMember() { return this.CommitteeMemberDetails.controls; }

  async GetApplyNOCApplicationListByRole() {
    try {
      if (this.QueryStatus == 'Pending') {
        this.request.ActionName = 'Forward To Secretary By Minister,Forward To';
      }
      if (this.QueryStatus == 'Completed') {
        this.request.ActionName = '';
      }
      if (this.QueryStatus == 'Forward') {
        this.request.ActionName = 'Forward To';
      }
      this.loaderService.requestStarted();
      await this.animaldocumentscrutiny.GetDegreeApplyNOCApplicationList(this.request)
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
  public WorkflowPermissionslst: any = [];
  async GetWorkflowPermissions() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetWorkflowPermissions(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.WorkflowPermissionslst = data['Data'][0];
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
  public ApplicationTrailList: any = [];
  closeResult: string | undefined;
  async GetApplicationTrail(content: any, ApplyNOCID: number) {
    this.ApplicationTrailList = [];
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetApplicationTrail_DepartmentApplicationWise(ApplyNOCID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationTrailList = data['Data'];
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


  async DocumentScrutinyForward(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    if (this.sSOLoginDataModel.RoleID == 5) {
      await this.GetApplicationCommitteeList(ApplyNOCID);
      if (this.request_MemberList.ApplicationCommitteeList.length <= 0) {
        this.toastr.warning('Please add committee member');
        return;
      }
    }

    this.routers.navigate(['/checklistahdegree' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(this.request.Status.toString()))]);
  }
  async DocumentScrutiny(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    this.routers.navigate(['/documentscrutinyahdegree' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(this.request.Status.toString()))]);

  }





  /*Inspection Committe*/

  CommitteeMemberDetails!: FormGroup;
  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)

  public SelectedApplyNOCID: number = 0;
  async OpenAsignCommitteePopUP(content: any, ApplyNOCID: number) {
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    await this.GetApplicationCommitteeList(this.SelectedApplyNOCID);
  }


  public CommitteeMemberlst: any = [];
  async GetApplicationCommitteeList(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList_AH(ApplyNocApplicationID, 'Inspection')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request_MemberList.ApplicationCommitteeList = data['Data'];
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



  request_CommitteeMemberDataModel = new ApplicationCommitteeMemberdataModel();
  request_MemberList = new PostApplicationCommitteeMemberdataModel();
  public isSubmitted_MemberDetails: boolean = false;
  public isSubmitted: boolean = false;
  AadhaarNo: string = '';
  async AddMemberDetail() {
    this.isSubmitted_MemberDetails = true;
    if (this.CommitteeMemberDetails.invalid) {
      return
    }
    //rest
    this.AadhaarNo = '';

    var isValidate = this.request_MemberList.ApplicationCommitteeList.find(e => e.SSOID === this.request_CommitteeMemberDataModel.SSOID);
    var isValidateMobile = this.request_MemberList.ApplicationCommitteeList.find(e => e.MobileNumber === this.request_CommitteeMemberDataModel.MobileNumber);
    if (!isValidate && !isValidateMobile) {
      await this.VerifySSOID(this.request_CommitteeMemberDataModel.SSOID);
      if (this.AadhaarNo.length > 0) {
        this.request_MemberList.ApplicationCommitteeList.push({
          CommitteeMemberID: 0,
          ApplyNocApplicationID: this.SelectedApplyNOCID,
          NameOfPerson: this.request_CommitteeMemberDataModel.NameOfPerson,
          MobileNumber: this.request_CommitteeMemberDataModel.MobileNumber,
          SSOID: this.request_CommitteeMemberDataModel.SSOID,
          RoleID: 0,
          IsPrimaryMember: false,
          ActiveStatus: true,
          DeleteStatus: false,
          AadhaarNo: this.AadhaarNo,
          CommitteeType: 'Inspection',
        });
        this.request_CommitteeMemberDataModel.NameOfPerson = '';
        this.request_CommitteeMemberDataModel.MobileNumber = '';
        this.request_CommitteeMemberDataModel.SSOID = '';
        this.request_CommitteeMemberDataModel.IsPrimaryMember = false;
        this.isSubmitted_MemberDetails = false;
      }
      else {
        this.toastr.warning('SSOID Invalid')
      }
    }
    else {
      this.toastr.warning(isValidate ? 'This User Alaready Exists' : 'this Mobile Number Exists');
    }
    // reset




  }
  DelMemberDetail(item: any, index: any) {

    //  const index: number = this.request_MemberList.ApplicationCommitteeList.indexOf(item);


    let chkIsPrimary = this.request_MemberList.ApplicationCommitteeList[index].IsPrimaryMember;
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        if (!chkIsPrimary) {
          this.loaderService.requestStarted();
          this.request_MemberList.ApplicationCommitteeList.splice(index, 1)
        }
        else {
          this.toastr.warning("You can't delete primary member")
        }
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
    this.isSubmitted = true;

    let isValid = true;
    if (this.form_CommitteeMember.invalid) {
      isValid = false;
      return;
    }
    if (this.request_MemberList.ApplicationCommitteeList.length == 0) {
      this.toastr.error("Please add Member Details");
      isValid = false;
    }
    if (this.request_MemberList.ApplicationCommitteeList.length < 3) {
      this.toastr.error("Please add three Member Details");
      isValid = false;
    }
    let ifPrimaryExits = this.request_MemberList.ApplicationCommitteeList.find(f => f.IsPrimaryMember == true);
    if (ifPrimaryExits?.IsPrimaryMember == undefined) {
      this.toastr.error("Atleast one primary member required");
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    //console.log(this.request_MemberList.ApplicationCommitteeList);
    this.request_MemberList.ApplyNocApplicationID = this.SelectedApplyNOCID;
    this.request_MemberList.UserID = this.sSOLoginDataModel.UserID;
    console.log(this.request_MemberList);
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.committeeMasterService.SaveApplicationCommitteeData(this.request_MemberList)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.modalService.dismissAll('After Success');
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
  sSOVerifyDataModel = new SSOLoginDataModel();
  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';
  async VerifySSOID(SSOID: any) {
    //verify ssoid
    await this.CheckMappingSSOID(SSOID);
    this.AadhaarNo = '123456789325';
    //if (this.sSOVerifyDataModel != null && SSOID.toLowerCase() == this.sSOVerifyDataModel.SSOID.toLowerCase()) {
    //  let d = new AadharServiceDataModel();
    //  d.AadharID = this.sSOVerifyDataModel.AadhaarId;
    //  await this.GetAadharByVID(d);
    //  this.SsoValidationMessage = 'd';
    //  this.SsoSuccessMessage = 'SSO Id Verified Successfully';
    //}
    //else {
    //  this.SsoValidationMessage = ''
    //  this.SsoValidationMessage = 'SSO Id Invalid !';
    //}
  }


  async GetAadharByVID(data: any) {
    this.AadhaarNo = '123456789102'
    //await this.aadharServiceDetails.GetAadharByVID(data)
    //  .then((data: any) => {
    //    data = JSON.parse(JSON.stringify(data));
    //    if (data[0].status == "0") {
    //      this.AadhaarNo = data[0].data;
    //    }
    //    else {
    //      this.AadhaarNo = '';
    //    }
    //  }, error => console.error(error));
  }
  SetPrimaryMember(item: any, index: any) {
    let oldArr = this.request_MemberList.ApplicationCommitteeList;
    let newArr = oldArr.map(obj => ({ ...obj, ['IsPrimaryMember']: false }));
    newArr[index].IsPrimaryMember = true;
    this.request_MemberList.ApplicationCommitteeList = newArr;
  }
  async CheckMappingSSOID(ssoid: any) {
    try {
      this.loaderService.requestStarted();
      await this.sSOLoginService.CheckMappingSSOID(ssoid)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.sSOVerifyDataModel = data['Data'];
          console.log(this.sSOVerifyDataModel);
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


  numbersOnly(event: any): boolean {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[0-9]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
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
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedPDFApplyNOCID: number = 0;
  public NOCIssuedRemark: string = '';
  async OpenGeneratePDFPopUP(content: any, ApplyNOCID: number, DepartmentID: number) {
    this.NOCIssuedRemark = '';
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedPDFApplyNOCID = ApplyNOCID;

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  public NOCFormat: any = '';
  public ApproveReject: string = '';
  async GetNOCMasterFormat() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetNOCFormat(this.SelectedDepartmentID,0,14,'T')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.NOCFormat = data['Data'][0][0]['NOCFormat'];
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
  public isSubmitNOC: boolean = false;
  public isFormvalid: boolean = true;
  public requestnoc: NOCIssuedForAHDegreeDataModel = new NOCIssuedForAHDegreeDataModel();
  async GeneratePDF_OnClick() {
    try {
      this.requestnoc = new NOCIssuedForAHDegreeDataModel();
      this.requestnoc.ApplyNOCID = this.SelectedPDFApplyNOCID;
      this.requestnoc.ParameterID = 13;
      this.requestnoc.ApproveReject = 'Approve';
      this.requestnoc.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestnoc.CreatedBy = this.sSOLoginDataModel.RoleID;
      this.requestnoc.Remark = this.NOCIssuedRemark;
      this.isFormvalid = true;
      this.isSubmitNOC = true;
      if (this.NOCIssuedRemark == '') {
        this.isFormvalid = false;
      }

      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GenerateNOCForAHDegree(this.requestnoc)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage);

            this.modalService.dismissAll('After Success');
            window.location.reload();
          }
          else {
            this.toastr.error(this.ErrorMessage)
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

  OnChangeApproveReject() {
    try {
      this.loaderService.requestStarted();
      if (this.ApproveReject == 'Approve') {
        this.GetNOCMasterFormat();
      }
      else {
        this.NOCFormat=''
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
