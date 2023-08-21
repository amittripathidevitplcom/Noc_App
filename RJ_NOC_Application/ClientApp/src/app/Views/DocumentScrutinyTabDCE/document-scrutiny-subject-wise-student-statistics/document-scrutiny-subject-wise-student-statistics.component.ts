import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ClassWiseStudentDetailsServiceService } from '../../../Services/ClassWiseStudentDetails/class-wise-student-details-service.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SubjectWiseStatisticsDetailsDataModel, PostSubjectWiseStatisticsDetailsDataModel } from '../../../Models/SubjectWiseStatisticsDetailsDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';

@Component({
  selector: 'app-document-scrutiny-subject-wise-student-statistics',
  templateUrl: './document-scrutiny-subject-wise-student-statistics.component.html',
  styleUrls: ['./document-scrutiny-subject-wise-student-statistics.component.css']
})
export class DocumentScrutinySubjectWiseStudentStatisticsComponent implements OnInit {

  public SubjectWiseStudentDetailsList: any[] = [];

  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request = new PostSubjectWiseStatisticsDetailsDataModel();


  public FirstYearBoysCountFooter: number = 0
  public FirstYearGirlsCountFooter: number = 0
  public SecYearBoysCountFooter: number = 0
  public SecYearGirlsCountFooter: number = 0
  public ThirdYearBoysCountFooter: number = 0
  public ThirdYearGirlsCountFooter: number = 0
  public PervYearBoysCountFooter: number = 0
  public PervYearGirlsCountFooter: number = 0
  public FinalYearBoysCountFooter: number = 0
  public FinalYearGirlsCountFooter: number = 0
  public DiplomaBoysCountFooter: number = 0
  public DiplomaGirlsCountFooter: number = 0
  public OtherBoysCountFooter: number = 0
  public OtherGirlsCountFooter: number = 0
  public TotalFooter: number = 0
  public SelectedApplyNOCID: number = 0
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined

  constructor(private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService, private routers: Router, private formBuilder: FormBuilder, private classWiseStudentDetailsServiceService: ClassWiseStudentDetailsServiceService, private toastr: ToastrService, private dceDocumentScrutinyService: DCEDocumentScrutinyService) { }

  async ngOnInit()
  {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.GetSubjectWiseStudenetDetails(this.SelectedCollageID)
  }

  async GetSubjectWiseStudenetDetails(CollageID: number) {
    try {
      this.loaderService.requestStarted();
      await this.dceDocumentScrutinyService.DocumentScrutiny_SubjectWiseStudentDetail(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SubjectWiseStudentDetailsList = data['Data'];

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
    this.FirstYearBoysCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.FirstYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.FirstYearGirlsCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.FirstYearGirlsCount).reduce((acc, value) => acc + value, 0);

    this.SecYearBoysCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.SecYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.SecYearGirlsCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.SecYearGirlsCount).reduce((acc, value) => acc + value, 0);

    this.ThirdYearBoysCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.ThirdYearBoysCount).reduce((acc, value) => acc + value, 0);
    this.ThirdYearGirlsCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.ThirdYearGirlsCount).reduce((acc, value) => acc + value, 0);

    //Girls Footer SUM
    this.FinalYearBoysCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.FinalYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.FinalYearGirlsCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.FinalYearGirlsCount).reduce((acc, value) => acc + value, 0);



    //Girls Footer SUM
    this.PervYearBoysCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.PervYearBoysCount).reduce((acc, value) => acc + value, 0)
    this.PervYearGirlsCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.PervYearBoysCount).reduce((acc, value) => acc + value, 0);

    this.DiplomaBoysCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.DiplomaBoysCount).reduce((acc, value) => acc + value, 0)
    this.DiplomaGirlsCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.DiplomaGirlsCount).reduce((acc, value) => acc + value, 0);


    this.OtherBoysCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.OtherBoysCount).reduce((acc, value) => acc + value, 0);
    this.OtherGirlsCountFooter = this.SubjectWiseStudentDetailsList.map(t => t.OtherGirlsCount).reduce((acc, value) => acc + value, 0);

    //
    this.TotalFooter = this.SubjectWiseStudentDetailsList.map(t => t.Total).reduce((acc, value) => acc + value, 0)





  }
  async SaveData() {
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.request.CollegeID = this.SelectedCollageID;
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.request.SubjectWiseStatisticsDetails = this.SubjectWiseStudentDetailsList;
    try {
      await this.classWiseStudentDetailsServiceService.SaveDataSubjectWise(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)

            this.GetSubjectWiseStudenetDetails(this.SelectedCollageID);
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

  //validattions
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  CalculateAll(item: any, index: any) {

    let frstB = item.FirstYearBoysCount == undefined ? 0 : Number(item.FirstYearBoysCount);
    let frstG = item.FirstYearGirlsCount == undefined ? 0 : Number(item.FirstYearGirlsCount);
    let SecB = item.SecYearBoysCount == undefined ? 0 : Number(item.SecYearBoysCount);
    let SecG = item.SecYearGirlsCount == undefined ? 0 : Number(item.SecYearGirlsCount);
    let ThirdB = item.ThirdYearBoysCount == undefined ? 0 : Number(item.ThirdYearBoysCount);
    let ThirdG = item.ThirdYearGirlsCount == undefined ? 0 : Number(item.ThirdYearGirlsCount);
    let PervB = item.PervYearBoysCount == undefined ? 0 : Number(item.PervYearBoysCount)
    let PervG = item.PervYearGirlsCount == undefined ? 0 : Number(item.PervYearGirlsCount)
    let FinalB = item.FinalYearBoysCount == undefined ? 0 : Number(item.FinalYearBoysCount)
    let FinalG = item.FinalYearGirlsCount == undefined ? 0 : Number(item.FinalYearGirlsCount)
    let DiplomaB = item.DiplomaBoysCount == undefined ? 0 : Number(item.DiplomaBoysCount)
    let DiplomaG = item.DiplomaGirlsCount == undefined ? 0 : Number(item.DiplomaGirlsCount)
    let OtherB = item.OtherBoysCount == undefined ? 0 : Number(item.OtherBoysCount)
    let OtherG = item.OtherGirlsCount == undefined ? 0 : Number(item.OtherGirlsCount);

    item.Total = Number(frstB) + Number(frstG)
      + Number(SecG) + Number(SecB)
      + Number(ThirdB) + Number(ThirdG)
      + Number(PervB) + Number(PervG)
      + Number(FinalB) + Number(FinalG)
      + Number(DiplomaB) + Number(DiplomaG)
      + Number(OtherB) + Number(OtherG)
  }

}
