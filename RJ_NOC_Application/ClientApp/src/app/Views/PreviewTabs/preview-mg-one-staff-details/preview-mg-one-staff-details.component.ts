import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingDetailsDataModel, DocuemntBuildingDetailsDataModel } from '../../../Models/TabDetailDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { BuildingDetailsMasterService } from '../../../Services/BuildingDetailsMaster/building-details-master.service'
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EducationalQualificationDetails_StaffDetail, StaffDetailDataModel, StaffDetailDataModel_Excel } from '../../../Models/TabDetailDataModel';
import { StaffDetailService } from '../../../Services/StaffDetail/staff-detail.service';
@Component({
  selector: 'app-preview-mg-one-staff-details',
  templateUrl: './preview-mg-one-staff-details.component.html',
  styleUrls: ['./preview-mg-one-staff-details.component.css']
})
export class PreviewMgOneStaffDetailsComponent implements OnInit {
  buildingdetails: any = {};
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public StaffDetailModel: StaffDetailDataModel[] = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = []; 
  searchText: string = '';
  request = new StaffDetailDataModel();
  request_Excel = new StaffDetailDataModel_Excel()
  public EducationalQualificationDetails_Excel: EducationalQualificationDetails_StaffDetail[] = [];
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public SelectedApplyNOCID: number = 0;
  public TotalStaffDetail: number = 0;
  public ESIStaffShowHide: boolean = false;
  public TotalNonTeachingStaffDetail: number = 0;
  public TotalTeachingStaffDetail: number = 0;
  public EducationalQualificationDetailsById: any = [];
  constructor(private buildingDetailsMasterService: BuildingDetailsMasterService, private commonMasterService: CommonMasterService,
    private loaderService: LoaderService, private router: ActivatedRoute, private modalService: NgbModal, private staffDetailService: StaffDetailService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, 0);
  }
  async GetStaffDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, StaffDetailID: number) {
    try {
      this.loaderService.requestStarted();
      await this.staffDetailService.GetStaffDetailList_DepartmentCollegeWise(DepartmentID, CollegeID, StaffDetailID, this.SelectedApplyNOCID > 0 ? this.SelectedApplyNOCID : 0)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StaffDetailModel = data['Data'];
          this.TotalStaffDetail = this.StaffDetailModel.length;
          if (this.TotalStaffDetail > 10) {
            this.ESIStaffShowHide = true;
          }
          this.TotalTeachingStaffDetail = 0;
          this.TotalNonTeachingStaffDetail = 0;
          for (var i = 0; i < this.StaffDetailModel.length; i++) {

            if (this.StaffDetailModel[i].AadhaarNo.length > 0) {
              const visibleDigits = 4;
              let maskedSection = this.StaffDetailModel[i].AadhaarNo.slice(0, -visibleDigits);
              let visibleSection = this.StaffDetailModel[i].AadhaarNo.slice(-visibleDigits);
              this.StaffDetailModel[i].MaskedAadhaarNo = maskedSection.replace(/./g, 'X') + visibleSection;
            }
            if (this.StaffDetailModel[i].TeachingType == 'Teaching') {
              this.TotalTeachingStaffDetail++;
            }
            else {
              this.TotalNonTeachingStaffDetail++;
            }
          }
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
  async ViewStaffDetail(content: any, StaffDetailID: number) {
    /*this.request = new StaffDetailDataModel();*/
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.staffDetailService.GetStaffDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, StaffDetailID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.EducationalQualificationDetailsById = data['Data'][0].EducationalQualificationDetails;
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
}
