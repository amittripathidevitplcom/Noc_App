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
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';

@Component({
  selector: 'app-class-wise-student-details',
  templateUrl: './class-wise-student-details.component.html',
  styleUrls: ['./class-wise-student-details.component.css']
})
export class ClassWiseStudentDetailsComponent implements OnInit {



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
  TotalBoys_GirlsFooter: number = 0
  OFTotalMinorityBoysFooter: number = 0
  OFTotalMinorityGirlsFooter: number = 0
  OFTotalPHBoysFooter: number = 0
  OFTotalPHGirlsFooter: number = 0



  TotalTotalBoys_GirlsFooter: number = 0
  TotalOFTotalMinorityTransgenderFooter: number = 0
  TotalMinorityTotalFooter: number = 0
  TotalOFTotalPHTransgenderFooter: number = 0
  TotalPHMinorityTotalFooter: number = 0


  public QueryStringStatus: any = '';
  public SelectedApplyNOCID: number = 0;
  public SearchRecordID: string = '';


  constructor(private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private classWiseStudentDetailsServiceService: ClassWiseStudentDetailsServiceService, private toastr: ToastrService,
    private collegeService: CollegeService) { }

  async ngOnInit() {
    this.request.ClassWiseStudentDetails = [];
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SelectedCollageID = data['Data']['CollegeID'];
          if (this.SelectedCollageID == null || this.SelectedCollageID == 0 || this.SelectedCollageID == undefined) {
            this.routers.navigate(['/statisticscollegelist']);
          }
        }, error => console.error(error));
    }
    else {
      this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    }


    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.QueryStringStatus = this.router.snapshot.paramMap.get('Status')?.toString();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.GetCollegeWiseStudenetDetails(this.SelectedCollageID)
    await this.GetCollageDetails();
  }

  async GetCollegeWiseStudenetDetails(CollageID: number) {
    try {

      this.loaderService.requestStarted();
      await this.classWiseStudentDetailsServiceService.GetCollegeWiseStudenetDetails(CollageID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0, this.sSOLoginDataModel.SessionID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.ClassWiseStudentDetails = data['Data'];
          this.TotalFooterSum();

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
    //this.request.ClassWiseStudentDetails = this.request.ClassWiseStudentDetails;
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
  async CalculateAll(item: ClassWiseStudentDetailsDataModel, index: any) {

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
    item.Total = Number(item.TotalBoys) + Number(item.TotalGirls);

    let MinorityB = item.OFTotalMinorityBoys == undefined ? 0 : item.OFTotalMinorityBoys;
    let MinorityG = item.OFTotalMinorityGirls == undefined ? 0 : item.OFTotalMinorityGirls;
    let MinorityT = item.OFTotalMinorityTransgender == undefined ? 0 : item.OFTotalMinorityTransgender;
    item.MinorityTotal = Number(MinorityB) + Number(MinorityG) + Number(MinorityT);

    let PHB = item.OFTotalPHBoys == undefined ? 0 : item.OFTotalPHBoys;
    let PHG = item.OFTotalPHGirls == undefined ? 0 : item.OFTotalPHGirls;
    let PHT = item.OFTotalPHTransgender == undefined ? 0 : item.OFTotalPHTransgender;
    //item.PHTotal = Number(PHB) + Number(PHG) + Number(PHT);
    item.PHTotal = Number(PHB) + Number(PHG);

    await this.TotalFooterSum();
  }


  TotalFooterSum() {

    //Boys
    // this.SCBoysCountFooter = this.request.ClassWiseStudentDetails.map(t => t.SCBoysCount).reduce((acc, value) => acc + value, 0)
    this.SCBoysCountFooter = this.request.ClassWiseStudentDetails.map(t => t.SCBoysCount).reduce((acc, value) => Number(acc) + Number(value), 0)

    this.STBoysCountFooter = this.request.ClassWiseStudentDetails.map(t => t.STBoysCount).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.OBCBoysCountFooter = this.request.ClassWiseStudentDetails.map(t => t.OBCBoysCount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.MBCBoysCountFooter = this.request.ClassWiseStudentDetails.map(t => t.MBCBoysCount).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.GenBoysCountFooter = this.request.ClassWiseStudentDetails.map(t => t.GenBoysCount).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.EWSBoysCountFooter = this.request.ClassWiseStudentDetails.map(t => t.EWSBoysCount).reduce((acc, value) => Number(acc) + Number(value), 0);
    //Girls Footer SU
    this.SCGirlsCountFooter = this.request.ClassWiseStudentDetails.map(t => t.SCGirlsCount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.STGirlsCountFooter = this.request.ClassWiseStudentDetails.map(t => t.STGirlsCount).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.OBCGirlsCountFooter = this.request.ClassWiseStudentDetails.map(t => t.OBCGirlsCount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.MBCGirlsCountFooter = this.request.ClassWiseStudentDetails.map(t => t.MBCGirlsCount).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.GenGirlsCountFooter = this.request.ClassWiseStudentDetails.map(t => t.GenGirlsCount).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.EWSGirlsCountFooter = this.request.ClassWiseStudentDetails.map(t => t.EWSGirlsCount).reduce((acc, value) => Number(acc) + Number(value), 0);

    //
    this.TotalBoysFooter = this.request.ClassWiseStudentDetails.map(t => t.TotalBoys).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.TotalGirlsFooter = this.request.ClassWiseStudentDetails.map(t => t.TotalGirls).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.TotalTotalBoys_GirlsFooter = this.request.ClassWiseStudentDetails.map(t => t.Total).reduce((acc, value) => Number(acc) + Number(value), 0);


    this.OFTotalMinorityBoysFooter = this.request.ClassWiseStudentDetails.map(t => t.OFTotalMinorityBoys).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.OFTotalMinorityGirlsFooter = this.request.ClassWiseStudentDetails.map(t => t.OFTotalMinorityGirls).reduce((acc, value) => Number(acc) + Number(value), 0);

    this.TotalOFTotalMinorityTransgenderFooter = this.request.ClassWiseStudentDetails.map(t => t.OFTotalMinorityTransgender).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.TotalMinorityTotalFooter = this.request.ClassWiseStudentDetails.map(t => t.MinorityTotal).reduce((acc, value) => Number(acc) + Number(value), 0);

    this.OFTotalPHBoysFooter = this.request.ClassWiseStudentDetails.map(t => t.OFTotalPHBoys).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.OFTotalPHGirlsFooter = this.request.ClassWiseStudentDetails.map(t => t.OFTotalPHGirls).reduce((acc, value) => Number(acc) + Number(value), 0);

    this.TotalOFTotalPHTransgenderFooter = this.request.ClassWiseStudentDetails.map(t => t.OFTotalPHTransgender).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.TotalPHMinorityTotalFooter = this.request.ClassWiseStudentDetails.map(t => t.PHTotal).reduce((acc, value) => Number(acc) + Number(value), 0);

  }
  //validattions
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public FinancialYear: string = '';
  async GetCollageDetails() {
    try {
      this.loaderService.requestStarted();
      await this.collegeService.GetData(this.SelectedCollageID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.FinancialYear = data['Data']['FinancialYear']

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
}
