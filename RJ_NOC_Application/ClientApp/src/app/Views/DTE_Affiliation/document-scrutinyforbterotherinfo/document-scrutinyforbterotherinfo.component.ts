import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AbstractControl, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { DTEAffiliationOtherDetailsService } from '../../../Services/DTEAffiliation/DTEAffiliationOtherDetails/dte-affiliation-other-details.service';
import { DTEAffiliationOtherDetailsPreviewDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationOtherDetails/DTEAffiliationOtherDetailsDataModel';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
@Component({
  selector: 'app-document-scrutinyforbterotherinfo',
  templateUrl: './document-scrutinyforbterotherinfo.component.html',
  styleUrls: ['./document-scrutinyforbterotherinfo.component.css']
})
export class DocumentScrutinyforbterotherinfoComponent implements OnInit {
  DTEAffiliationOtherDetails!: FormGroup;
  constructor(private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private sSOLoginService: SSOLoginService, private dteaffiliationOtherDetailsService: DTEAffiliationOtherDetailsService) {

  }
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public UserID: number = 0;
  public searchText: string = '';
  public SsoValidationMessage: string = '';
  public SsoSuccessMessage: string = '';
  public DepartmentList: any = [];
  public FinalRemarks: any = [];
  public DTEAffiliationOtherDetailsPreviewData: any = [];
  // sso ligin
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new DTEAffiliationOtherDetailsPreviewDataModel();
  public ModifyBy: number = 0;
  public SelectedDepartmentID: number = 0;
  public SearchRecordID: string = '';
  public SelectedDteAffiliationRegId: number = 0;
  public AffiliationRegStatus: any = '';
  public AffiliationRegID: number = 0;
  public AffiliationCollegeStatusId: number = 0;
  public isRemarkValid: boolean = false;
  public isDisabledAction: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString());
    this.AffiliationRegStatus = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('Status')?.toString());
    this.AffiliationCollegeStatusId = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeStatusId')?.toString());

    if (this.SearchRecordID.length > 20 && this.SelectedDepartmentID == 12) {
      await this.commonMasterService.GetDteAffiliation_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SelectedDteAffiliationRegId = data['Data']['DTE_ARId'];

          if (this.SelectedDteAffiliationRegId == null || this.SelectedDteAffiliationRegId == 0 || this.SelectedDteAffiliationRegId == undefined) {
            this.routers.navigate(['/affiliationregistration']);
          }
        }, error => console.error(error));
    }
    else {
      this.SelectedDteAffiliationRegId = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DTE_ARId')?.toString()));
    }
    this.ModifyBy = 1;
    await this.GetDTEAffiliationOtherDetailsPreviewData();
    await this.GetDepartmentList();
  }
  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
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
  async GetDTEAffiliationOtherDetailsPreviewData() {
    try {
      this.loaderService.requestStarted();
      await this.dteaffiliationOtherDetailsService.GetDTEAffiliationOtherDetailsPreviewData(this.SelectedDteAffiliationRegId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.DTEAffiliationOtherDetailsPreviewData = data['Data'][0];
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
  public isSubmitted: boolean = false;
  async SubmitCollegeDetail_Onclick() {
    this.isSubmitted = true;
    //this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    //this.dsrequest.CollegeID = this.SelectedCollageID;
    //this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    //this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    //this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    //this.dsrequest.TabName = 'College Detail';
    //this.isRemarkValid = false;
    //this.isFormvalid = true;
    //this.dsrequest.DocumentScrutinyDetail = [];
    //for (var i = 0; i < this.collegeNearestGovernmentHospitalsList.length; i++) {
    //  if (this.collegeNearestGovernmentHospitalsList[i].Action == '' || this.collegeNearestGovernmentHospitalsList[i].Action == undefined) {
    //    this.toastr.warning('Please take Action on all records');
    //    return;
    //  }
    //  if (this.collegeNearestGovernmentHospitalsList[i].Action == 'No') {
    //    if (this.collegeNearestGovernmentHospitalsList[i].Remark == '' || this.collegeNearestGovernmentHospitalsList[i].Remark == undefined) {
    //      this.toastr.warning('Please enter remark');
    //      return;
    //    }
    //  }
    //}
    //if (this.dsrequest.ActionID <= 0) {
    //  this.isFormvalid = false;
    //}
    //if (this.dsrequest.FinalRemark == '' || this.dsrequest.FinalRemark == undefined) {
    //  this.isRemarkValid = true;
    //  this.isFormvalid = false;
    //}
    //if (!this.isFormvalid) {
    //  return;
    //}
    //if (this.collegeNearestGovernmentHospitalsList.length > 0) {
    //  for (var i = 0; i < this.collegeNearestGovernmentHospitalsList.length; i++) {
    //    console.log(this.collegeNearestGovernmentHospitalsList[i]);
    //    this.dsrequest.DocumentScrutinyDetail.push({
    //      DocumentScrutinyID: 0,
    //      DepartmentID: this.SelectedDepartmentID,
    //      CollegeID: this.SelectedCollageID,
    //      UserID: this.sSOLoginDataModel.UserID,
    //      RoleID: this.sSOLoginDataModel.RoleID,
    //      ApplyNOCID: this.SelectedApplyNOCID,
    //      Action: this.collegeNearestGovernmentHospitalsList[i].Action,
    //      Remark: this.collegeNearestGovernmentHospitalsList[i].Remark,
    //      TabRowID: this.collegeNearestGovernmentHospitalsList[i].NearestGovernmentHospitalsID,
    //      SubTabName: ''
    //    });
    //  }
    //}
    //try {
    //  this.loaderService.requestStarted();
    //  await this.applyNOCApplicationService.SaveDocumentScrutiny(this.dsrequest)
    //    .then((data: any) => {
    //      this.State = data['State'];
    //      this.SuccessMessage = data['SuccessMessage'];
    //      this.ErrorMessage = data['ErrorMessage'];
    //      if (this.State == 0) {
    //        this.toastr.success(this.SuccessMessage);
    //        this.isRemarkValid = false;
    //        this.isFormvalid = true;
    //      }
    //      else if (this.State == 2) {
    //        this.toastr.warning(this.ErrorMessage)
    //      }
    //      else {
    //        this.toastr.error(this.ErrorMessage)
    //      }
    //    })
    //} catch (Ex) {
    //  console.log(Ex);
    //}
    //finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}
  }
}

