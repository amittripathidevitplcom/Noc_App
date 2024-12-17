import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DTEDocumentScrutinyService } from '../../../Services/DTEDocumentScrutiny/dtedocument-scrutiny.service';
import { ApplicationCommitteeMemberdataModel, PostApplicationCommitteeMemberdataModel } from '../../../Models/ApplicationCommitteeMemberdataModel';
import { CommitteeMasterService } from '../../../Services/Master/CommitteeMaster/committee-master.service';
import { AadharServiceDataModel } from '../../../Models/AadharServiceDataModel';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';

@Component({
  selector: 'app-application-landing-details-dte',
  templateUrl: './application-landing-details-dte.component.html',
  styleUrls: ['./application-landing-details-dte.component.css']
})
export class ApplicationLandingDetailsDTEComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public ApplicationDetails: any[] = [];
  public RoleID: number = 0;
  public UserID: number = 0;
  public ApplicationNo: string = '';

  sSOVerifyDataModel = new SSOLoginDataModel();

  SsoValidationMessage: string = '';
  SsoSuccessMessage: string = '';

  AadhaarNo: string = '';

  public isLoading: boolean = false;
  public QueryStringStatus: any = '';

  CommitteeMemberDetails!: FormGroup;
  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)
  constructor(private loaderService: LoaderService, private toastr: ToastrService,
    private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService,
    private dteDocumentScrutinyService: DTEDocumentScrutinyService, private modalService: NgbModal, private committeeMasterService: CommitteeMasterService,
    private sSOLoginService: SSOLoginService, private aadharServiceDetails: AadharServiceDetails
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    await this.GetApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
    this.CommitteeMemberDetails = this.formBuilder.group(
      {
        txtCMNameOfPerson: ['', Validators.required],
        txtCMMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtSSOID: ['', Validators.required]
      })
  }
  get form_CommitteeMember() { return this.CommitteeMemberDetails.controls; }

  async GetApplicationList(RoleId: number, UserID: number, Status: string) {
    try {
      let ActionName = '';

      ActionName = Status == 'Completed' ? 'Forward to Generate Receipt' : Status == 'Pending' ? 'Apply NOC,ReSubmit Application,Revert to Nodal officer' : Status=='Revert'?'Revert':'';

      this.loaderService.requestStarted();
      await this.dteDocumentScrutinyService.GetApplyNOCApplicationList(RoleId, UserID, Status, ActionName, this.sSOLoginDataModel.SessionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationDetails = data['Data'][0];
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

  async DocumentScrutiny_OnClick(DepartmentID: number, CollegeID: number, ApplyNOCID: number, ApplicationNo: string) {
    this.routers.navigate(['/documentscrutinydte' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplicationNo.toString())) + "/" + this.QueryStringStatus+ "/" + 'Step1']);
  }

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public ApplicationTrailList: any = [];
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
          debugger;
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
  async ApplicationSummary_OnClick(DepartmentID: number, CollegeID: number) {
    window.open('/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())), '_blank')
  }



  //async ForwardToDTECommittee(ApplyNOCID: number) {


  //  try {
  //    if (confirm("Are you sure you want to forward this application to DTE committee?")) {

  //      this.loaderService.requestStarted();
  //      await this.dteDocumentScrutinyService.WorkflowInsertDTE(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, 45, ApplyNOCID, 4, "", 0, 0, 0)
  //        .then((data: any) => {
  //          data = JSON.parse(JSON.stringify(data));
  //          this.State = data['State'];
  //          this.SuccessMessage = data['SuccessMessage'];
  //          this.ErrorMessage = data['ErrorMessage'];
  //          if (this.State == 0) {
  //            this.toastr.success(this.SuccessMessage);
  //            this.GetApplicationList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID, this.QueryStringStatus);
  //          }
  //          else if (this.State == 2) {
  //            this.toastr.warning(this.ErrorMessage)
  //          }
  //          else {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //        }, error => console.error(error));
  //    }
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  request_MemberList = new PostApplicationCommitteeMemberdataModel();
  request_CommitteeMemberDataModel = new ApplicationCommitteeMemberdataModel();
  async OpenAsignCommitteePopUP(content: any, ApplyNOCID: number, DepartmentID: number, CollegeID: number, ApplicationNo: string) {
    debugger;
    this.ApplicationNo = ApplicationNo;
    this.SelectedCollageID = CollegeID;
    this.SelectedDepartmentID = DepartmentID;
    this.SelectedApplyNOCID = ApplyNOCID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.GetApplicationCommitteeList(ApplyNOCID)
  }

  async GetApplicationCommitteeList(ApplyNocApplicationID: number) {

    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetApplicationCommitteeList(ApplyNocApplicationID)
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


  public isSubmitted: boolean = false;
  public isSubmitted_MemberDetails: boolean = false;
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
    this.isLoading = true;
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
        this.isLoading = false;

      }, 200);
    }
  }

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
  async VerifySSOID(SSOID: any) {
    //Show Loading
    debugger;
    //verify ssoid
    await this.CheckMappingSSOID(SSOID);
    if (this.sSOVerifyDataModel != null && SSOID.toLowerCase() == this.sSOVerifyDataModel.SSOID.toLowerCase()) {
      let d = new AadharServiceDataModel();
      d.AadharID = this.sSOVerifyDataModel.AadhaarId;
      await this.GetAadharByVID(d);
      this.SsoValidationMessage = 'd';
      this.SsoSuccessMessage = 'SSO Id Verified Successfully';

      
    }
    else {
      this.SsoValidationMessage = ''
      this.SsoValidationMessage = 'SSO Id Invalid !';
    }
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
  async GetAadharByVID(data: any) {
    await this.aadharServiceDetails.GetAadharByVID(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data[0].status == "0") {
          this.AadhaarNo = data[0].data;
        }
        else {
          this.AadhaarNo = '';
        }
      }, error => console.error(error));
  }
  SetPrimaryMember(item: any, index: any) {
    let oldArr = this.request_MemberList.ApplicationCommitteeList;
    let newArr = oldArr.map(obj => ({ ...obj, ['IsPrimaryMember']: false }));
    newArr[index].IsPrimaryMember = true;
    this.request_MemberList.ApplicationCommitteeList = newArr;
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
}

