import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ClassWiseStudentDetailsServiceService } from '../../../Services/ClassWiseStudentDetails/class-wise-student-details-service.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClassWiseStudentDetailsDataModel, PostClassWiseStudentDetailsDataModel } from '../../../Models/ClassWiseStudentDetailsDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';

@Component({
  selector: 'app-document-scrutiny-class-wise-student-details',
  templateUrl: './document-scrutiny-class-wise-student-details.component.html',
  styleUrls: ['./document-scrutiny-class-wise-student-details.component.css']
})
export class DocumentScrutinyClassWiseStudentDetailsComponent implements OnInit {


  //public ClassWiseStudentDetailsList: any = [];

  public ClassWiseStudentDetailsList: any[] = [];

  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new PostClassWiseStudentDetailsDataModel();

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined


  SCBoysCountFooter: number = 0
  STBoysCountFooter: number = 0
  OBCBoysCountFooter: number = 0
  MBCBoysCountFooter: number = 0
  GenBoysCountFooter: number = 0
  EWSBoysCountFooter: number = 0
  SCGirlsCountFooter: number = 0
  STGirlsCountFooter: number = 0
  OBCGirlsCountFooter: number = 0
  MBCGirlsCountFooter: number = 0
  GenGirlsCountFooter: number = 0
  EWSGirlsCountFooter: number = 0


  TotalBoysFooter: number = 0
  TotalGirlsFooter: number = 0
  OFTotalMinorityBoysFooter: number = 0
  OFTotalMinorityGirlsFooter: number = 0
  OFTotalPHBoysFooter: number = 0
  OFTotalPHGirlsFooter: number = 0

  public SelectedApplyNOCID: number = 0;
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();
  public FinalRemarks: any = [];



  constructor(private dceDocumentScrutinyService: DCEDocumentScrutinyService, private applyNOCApplicationService: ApplyNOCApplicationService,private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private classWiseStudentDetailsServiceService: ClassWiseStudentDetailsServiceService, private toastr: ToastrService) { }

  async ngOnInit() {

    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.GetCollegeWiseStudenetDetails(this.SelectedCollageID)
  }

  async GetCollegeWiseStudenetDetails(CollageID: number) {
    try {

      this.loaderService.requestStarted();
      await this.dceDocumentScrutinyService.DocumentScrutiny_ClassWiseStudentDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ClassWiseStudentDetailsList = data['Data'][0]['ClassWiseStudentDetails'];
          this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
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
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.request.CollegeID = this.SelectedCollageID;
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.request.ClassWiseStudentDetails = this.ClassWiseStudentDetailsList;
    try {
      await this.classWiseStudentDetailsServiceService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.GetCollegeWiseStudenetDetails(this.SelectedCollageID);
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
  CalculateAll(item: any, index: any) {

    //boys section
    let vSCB = item.SCBoysCount == undefined ? 0 : item.SCBoysCount;
    let vSTB = item.STBoysCount == undefined ? 0 : item.STBoysCount;
    let vOBC = item.OBCBoysCount == undefined ? 0 : item.OBCBoysCount;
    let vMBCB = item.MBCBoysCount == undefined ? 0 : item.MBCBoysCount;
    let vGENB = item.GenBoysCount == undefined ? 0 : item.GenBoysCount;
    let vEWSB = item.EWSBoysCount == undefined ? 0 : item.EWSBoysCount;

    //girls
    let vSCG = item.SCGirlsCount == undefined ? 0 : item.SCGirlsCount;
    let vSTG = item.STGirlsCount == undefined ? 0 : item.STGirlsCount;
    let vOBG = item.OBCGirlsCount == undefined ? 0 : item.OBCGirlsCount;
    let vMBCG = item.MBCGirlsCount == undefined ? 0 : item.MBCGirlsCount;
    let vGENG = item.GenGirlsCount == undefined ? 0 : item.GenGirlsCount;
    let vEWSG = item.EWSGirlsCount == undefined ? 0 : item.EWSGirlsCount;


    item.TotalBoys = Number(vSCB) + Number(vSTB) + Number(vOBC) + Number(vMBCB) + Number(vGENB) + Number(vEWSB);
    item.TotalGirls = Number(vSCG) + Number(vSTG) + Number(vOBG) + Number(vMBCG) + Number(vGENG) + Number(vEWSG);


  }


  TotalFooterSum() {

    //Boys
    this.SCBoysCountFooter = this.ClassWiseStudentDetailsList.map(t => t.SCBoysCount).reduce((acc, value) => acc + value, 0)
    this.STBoysCountFooter = this.ClassWiseStudentDetailsList.map(t => t.STBoysCount).reduce((acc, value) => acc + value, 0);
    this.OBCBoysCountFooter = this.ClassWiseStudentDetailsList.map(t => t.OBCBoysCount).reduce((acc, value) => acc + value, 0)
    this.MBCBoysCountFooter = this.ClassWiseStudentDetailsList.map(t => t.MBCBoysCount).reduce((acc, value) => acc + value, 0);
    this.GenBoysCountFooter = this.ClassWiseStudentDetailsList.map(t => t.GenBoysCount).reduce((acc, value) => acc + value, 0);
    this.EWSBoysCountFooter = this.ClassWiseStudentDetailsList.map(t => t.EWSBoysCount).reduce((acc, value) => acc + value, 0);
    //Girls Footer SUM
    this.SCGirlsCountFooter = this.ClassWiseStudentDetailsList.map(t => t.SCGirlsCount).reduce((acc, value) => acc + value, 0)
    this.STGirlsCountFooter = this.ClassWiseStudentDetailsList.map(t => t.STGirlsCount).reduce((acc, value) => acc + value, 0);
    this.OBCGirlsCountFooter = this.ClassWiseStudentDetailsList.map(t => t.OBCGirlsCount).reduce((acc, value) => acc + value, 0)
    this.MBCGirlsCountFooter = this.ClassWiseStudentDetailsList.map(t => t.MBCGirlsCount).reduce((acc, value) => acc + value, 0);
    this.GenGirlsCountFooter = this.ClassWiseStudentDetailsList.map(t => t.GenGirlsCount).reduce((acc, value) => acc + value, 0);
    this.EWSGirlsCountFooter = this.ClassWiseStudentDetailsList.map(t => t.EWSGirlsCount).reduce((acc, value) => acc + value, 0);

    //
    this.TotalBoysFooter = this.ClassWiseStudentDetailsList.map(t => t.TotalBoys).reduce((acc, value) => acc + value, 0)
    this.TotalGirlsFooter = this.ClassWiseStudentDetailsList.map(t => t.TotalGirls).reduce((acc, value) => acc + value, 0);


    this.OFTotalMinorityBoysFooter = this.ClassWiseStudentDetailsList.map(t => t.OFTotalMinorityBoys).reduce((acc, value) => acc + value, 0)
    this.OFTotalMinorityGirlsFooter = this.ClassWiseStudentDetailsList.map(t => t.OFTotalMinorityGirls).reduce((acc, value) => acc + value, 0);

    this.OFTotalPHBoysFooter = this.ClassWiseStudentDetailsList.map(t => t.OFTotalPHBoys).reduce((acc, value) => acc + value, 0)
    this.OFTotalPHGirlsFooter = this.ClassWiseStudentDetailsList.map(t => t.OFTotalPHGirls).reduce((acc, value) => acc + value, 0);


  }
  //validattions
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  async selectAll(ActionType: string) {
    await this.ClassWiseStudentDetailsList.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    })
  }


  ClickOnAction(idx: number) {
    for (var i = 0; i < this.ClassWiseStudentDetailsList.length; i++) {
      if (i == idx) {
        this.ClassWiseStudentDetailsList[i].Remark = '';
      }
    }
  }


  async SubmitClassWiseStudentDetail_Onclick() {
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = 0;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Class Wise Student Detail';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.ClassWiseStudentDetailsList.length; i++) {
      if (this.ClassWiseStudentDetailsList[i].Action == '' || this.ClassWiseStudentDetailsList[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.ClassWiseStudentDetailsList[i].Action == 'No') {
        if (this.ClassWiseStudentDetailsList[i].Remark == '' || this.ClassWiseStudentDetailsList[i].Remark == undefined) {
          this.toastr.warning('Please enter remark');
          return;
        }
      }
    }

    if (this.dsrequest.FinalRemark == '') {
      this.isRemarkValid = true;
      this.isFormvalid = false;
    }
    if (!this.isFormvalid) {
      return;
    }
    if (this.ClassWiseStudentDetailsList.length > 0) {
      for (var i = 0; i < this.ClassWiseStudentDetailsList.length; i++) {
        console.log(this.ClassWiseStudentDetailsList[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.ClassWiseStudentDetailsList[i].Action,
          Remark: this.ClassWiseStudentDetailsList[i].Remark,
          TabRowID: this.ClassWiseStudentDetailsList[i].ClassStatisticID,
          SubTabName: ''
        });
      }
    }
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.SaveDocumentScrutiny(this.dsrequest)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);
            this.isRemarkValid = false;
            this.isFormvalid = true;
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
