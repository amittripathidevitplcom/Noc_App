import { Component, OnInit } from '@angular/core';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RequiredDocumentsDataModel, RequiredDocumentsDataModel_Documents } from '../../../Models/TabDetailDataModel'
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeDocumentService } from '../../../Services/Tabs/CollegeDocument/college-document.service';
@Component({
  selector: 'app-preview-other-document',
  templateUrl: './preview-other-document.component.html',
  styleUrls: ['./preview-other-document.component.css']
})
export class PreviewOtherDocumentComponent implements OnInit {
  request = new RequiredDocumentsDataModel();
  isSubmitted: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  sSOLoginDataModel = new SSOLoginDataModel();
  public HospitalRealtedDocuments: RequiredDocumentsDataModel_Documents[] = []
  constructor(private loaderService: LoaderService,
    private commonMasterService: CommonMasterService, private collegeDocumentService: CollegeDocumentService, private router: ActivatedRoute) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.request.DocumentDetails = [];
    this.GetRequiredDocuments('OtherDocument');
    if (this.SelectedDepartmentID == 6) {
      this.GetHospitalRelatedDocuments('HospitalRelatedDocument');
    }
  }
  async GetRequiredDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.collegeDocumentService.GetList(this.SelectedDepartmentID, this.SelectedCollageID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.DocumentDetails = data['Data'][0]['data'];
          debugger;
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

  async GetHospitalRelatedDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.collegeDocumentService.GetList(this.SelectedDepartmentID, this.SelectedCollageID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HospitalRealtedDocuments = data['Data'][0]['data'];
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
