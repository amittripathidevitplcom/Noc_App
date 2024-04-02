import { Component, OnInit, Input, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClassWiseStudentDetailsServiceService } from '../../../Services/ClassWiseStudentDetails/class-wise-student-details-service.service';



@Injectable()

@Component({
  selector: 'app-statistics-college-list',
  templateUrl: './statistics-college-list.component.html',
  styleUrls: ['./statistics-college-list.component.css']
})

export class StatisticsCollegeListComponent implements OnInit {
  //Add FormBuilder
  ProjectMasterForm!: FormGroup;

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/

  public IsShowStaticData: boolean = false;
  public ViewSelectedDepartmentID: number = 0;
  public UserID: number = 0;
  public draftApplicatoinListData: any = [];
  searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();


  constructor(private classWiseStudentDetailsServiceService: ClassWiseStudentDetailsServiceService,private draftApplicationListService: DraftApplicationListService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private modalService: NgbModal) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetApplicationList();
  }

  async GetApplicationList() {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.StatisticsCollegeList(this.sSOLoginDataModel.SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.draftApplicatoinListData = data['Data'][0]['data'];
          console.log(this.draftApplicatoinListData);
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
  async DraftEdit_OnClick(DepartmentID: number, CollegeID: string) {
    this.routers.navigate(['/statisticsentry' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }
  async ApplicationSummary_OnClick(DepartmentID: number, CollegeID: string) {
    this.routers.navigate(['/applicationsummary' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString()))]);
  }
   

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
  //

  FirstYearBoysCountFooter: number = 0
  FirstYearGirlsCountFooter: number = 0
  SecYearBoysCountFooter: number = 0
  SecYearGirlsCountFooter: number = 0
  ThirdYearBoysCountFooter: number = 0
  ThirdYearGirlsCountFooter: number = 0
  PervYearBoysCountFooter: number = 0
  PervYearGirlsCountFooter: number = 0
  FinalYearBoysCountFooter: number = 0
  FinalYearGirlsCountFooter: number = 0
  DiplomaBoysCountFooter: number = 0
  DiplomaGirlsCountFooter: number = 0
  OtherBoysCountFooter: number = 0
  OtherGirlsCountFooter: number = 0
  TotalFooter: number = 0

  TotalBoys_GirlsFooter: number = 0
  TotalTotalBoys_GirlsFooter: number = 0
  TotalOFTotalMinorityTransgenderFooter: number = 0
  TotalMinorityTotalFooter: number = 0
  TotalOFTotalPHTransgenderFooter: number = 0
  TotalPHMinorityTotalFooter: number = 0

  public CheckList_ClassWiseStudentDetailsList: any = [];
  //Start Class Wise Student
  async GetCollegeWiseStudenetDetails(CollegeID: number) {
    try {

      this.loaderService.requestStarted();
      await this.classWiseStudentDetailsServiceService.GetCollegeWiseStudenetDetails(CollegeID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CheckList_ClassWiseStudentDetailsList = data['Data'];
          this.TotalClassWiseStudentFooterSum();
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

  TotalClassWiseStudentFooterSum() {

    //Boys
    this.SCBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { SCBoysCount: any; }) => t.SCBoysCount).reduce((acc: any, value: any) => acc + value, 0)
    this.STBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { STBoysCount: any; }) => t.STBoysCount).reduce((acc: any, value: any) => acc + value, 0);
    this.OBCBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OBCBoysCount: any; }) => t.OBCBoysCount).reduce((acc: any, value: any) => acc + value, 0)
    this.MBCBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { MBCBoysCount: any; }) => t.MBCBoysCount).reduce((acc: any, value: any) => acc + value, 0);
    this.GenBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { GenBoysCount: any; }) => t.GenBoysCount).reduce((acc: any, value: any) => acc + value, 0);
    this.EWSBoysCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { EWSBoysCount: any; }) => t.EWSBoysCount).reduce((acc: any, value: any) => acc + value, 0);
    //Girls Footer SUM
    this.SCGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { SCGirlsCount: any; }) => t.SCGirlsCount).reduce((acc: any, value: any) => acc + value, 0)
    this.STGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { STGirlsCount: any; }) => t.STGirlsCount).reduce((acc: any, value: any) => acc + value, 0);
    this.OBCGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OBCGirlsCount: any; }) => t.OBCGirlsCount).reduce((acc: any, value: any) => acc + value, 0)
    this.MBCGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { MBCGirlsCount: any; }) => t.MBCGirlsCount).reduce((acc: any, value: any) => acc + value, 0);
    this.GenGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { GenGirlsCount: any; }) => t.GenGirlsCount).reduce((acc: any, value: any) => acc + value, 0);
    this.EWSGirlsCountFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { EWSGirlsCount: any; }) => t.EWSGirlsCount).reduce((acc: any, value: any) => acc + value, 0);

    //
    this.TotalBoysFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { TotalBoys: any; }) => t.TotalBoys).reduce((acc: any, value: any) => acc + value, 0)
    this.TotalGirlsFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { TotalGirls: any; }) => t.TotalGirls).reduce((acc: any, value: any) => acc + value, 0);


    this.OFTotalMinorityBoysFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OFTotalMinorityBoys: any; }) => t.OFTotalMinorityBoys).reduce((acc: any, value: any) => acc + value, 0)
    this.OFTotalMinorityGirlsFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OFTotalMinorityGirls: any; }) => t.OFTotalMinorityGirls).reduce((acc: any, value: any) => acc + value, 0);

    this.OFTotalPHBoysFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OFTotalPHBoys: any; }) => t.OFTotalPHBoys).reduce((acc: any, value: any) => acc + value, 0)
    this.OFTotalPHGirlsFooter = this.CheckList_ClassWiseStudentDetailsList.map((t: { OFTotalPHGirls: any; }) => t.OFTotalPHGirls).reduce((acc: any, value: any) => acc + value, 0);


  }
  //End Class Wise Student

  public CheckList_SubjectWiseStudentDetailsList: any[] = [];
  //strat subject wise Student Detais
  async GetSubjectWiseStudenetDetails(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.classWiseStudentDetailsServiceService.GetSubjectWiseStudenetDetails(CollegeID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.CheckList_SubjectWiseStudentDetailsList = data['Data'];

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

  TotalFooterSum() {


    //Boys
    this.FirstYearBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.FirstYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.FirstYearGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.FirstYearGirlsCount).reduce((acc, value) => acc + value, 0);

    this.SecYearBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.SecYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.SecYearGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.SecYearGirlsCount).reduce((acc, value) => acc + value, 0);

    this.ThirdYearBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.ThirdYearBoysCount).reduce((acc, value) => acc + value, 0);
    this.ThirdYearGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.ThirdYearGirlsCount).reduce((acc, value) => acc + value, 0);

    //Girls Footer SUM
    this.FinalYearBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.FinalYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.FinalYearGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.FinalYearGirlsCount).reduce((acc, value) => acc + value, 0);

    //Girls Footer SUM
    this.PervYearBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.PervYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.PervYearGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.PervYearBoysCount).reduce((acc, value) => acc + value, 0);

    this.DiplomaBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.DiplomaBoysCount).reduce((acc, value) => acc + value, 0)
    this.DiplomaGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.DiplomaGirlsCount).reduce((acc, value) => acc + value, 0);


    this.OtherBoysCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.OtherBoysCount).reduce((acc, value) => acc + value, 0);
    this.OtherGirlsCountFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.OtherGirlsCount).reduce((acc, value) => acc + value, 0);

    //
    this.TotalFooter = this.CheckList_SubjectWiseStudentDetailsList.map(t => t.Total).reduce((acc, value) => acc + value, 0)

  }


  //end subject wise student detials

  
  modalReference!: NgbModalRef;
  closeResult!: string;
  async PreviewStatistics_click(CollegeID: number, _ViewSelectedDepartmentID: number, SearchRecordID: string, SelectedCollegeEntryType: string) {
    try {
      if (_ViewSelectedDepartmentID == 4) {
        this.routers.navigate([]).then(result => { window.open('/previewdtestatistics' + "/" + encodeURI(this.commonMasterService.Encrypt(_ViewSelectedDepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(SearchRecordID.toString())) + "/Y" + "/" + SelectedCollegeEntryType, '_blank'); });;
        return;
      }
      await this.GetCollegeWiseStudenetDetails(CollegeID);
      await this.GetSubjectWiseStudenetDetails(CollegeID);
      this.IsShowStaticData = true;
      this.ViewSelectedDepartmentID = _ViewSelectedDepartmentID;
      // model popup
      //this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-applynocpayment-title', backdrop: 'static' }).result.then((result) => {
      //  this.closeResult = `Closed with: ${result}`;
      //}, (reason) => {
      //  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      //});
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
  closeModel() {
    this.IsShowStaticData = false;
  }

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
      try {
        /* table id is passed over here */
        let element = document.getElementById('ClassWiseStatistics');
        let element1 = document.getElementById('SubjectWiseStudentStatistics');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        const ws1: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element1);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
       
        XLSX.utils.book_append_sheet(wb, ws, 'ClassWiseStatistics');
        XLSX.utils.book_append_sheet(wb, ws1, 'SubjectWiseStatistics');
        /* save to file */
        XLSX.writeFile(wb, "StatisticsData.xlsx");
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

