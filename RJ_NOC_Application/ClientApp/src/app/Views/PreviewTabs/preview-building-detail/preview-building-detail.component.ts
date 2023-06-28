import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingDetailsDataModel, DocuemntBuildingDetailsDataModel } from '../../../Models/TabDetailDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { BuildingDetailsMasterService } from '../../../Services/BuildingDetailsMaster/building-details-master.service'
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-preview-building-detail',
  templateUrl: './preview-building-detail.component.html',
  styleUrls: ['./preview-building-detail.component.css']
})
export class PreviewBuildingDetailComponent implements OnInit {
  buildingdetails: any = {};
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public lstBuildingDetails: any = [];
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public lstBuildingDetailsDocument: any = [];
  searchText: string = '';
  constructor(private buildingDetailsMasterService: BuildingDetailsMasterService, private commonMasterService: CommonMasterService,
    private loaderService: LoaderService, private router: ActivatedRoute) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetAllBuildingDetailsList();
  }
  async GetAllBuildingDetailsList() {
    try {
      this.loaderService.requestStarted();
      await this.buildingDetailsMasterService.GetAllBuildingDetailsList(0, this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstBuildingDetails = data['Data'][0]['data']['Table'];
          this.lstBuildingDetailsDocument = data['Data'][0]['data']['Table1'];
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


  async ViewBuildingDetails(BuildingDetailID: number) {
    try {
      this.loaderService.requestStarted();
      await this.buildingDetailsMasterService.GetByID(BuildingDetailID, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.buildingdetails.SchoolBuildingDetailsID = data['Data'][0]['data']['Table'][0]["SchoolBuildingDetailsID"];
          this.buildingdetails.BuildingTypeID = data['Data'][0]['data']['Table'][0]["BuildingTypeID"];
          this.buildingdetails.OwnerName = data['Data'][0]['data']['Table'][0]["OwnerName"];
          this.buildingdetails.AddressLine1 = data['Data'][0]['data']['Table'][0]["AddressLine1"];
          this.buildingdetails.AddressLine2 = data['Data'][0]['data']['Table'][0]["AddressLine2"];
          this.buildingdetails.RuralUrban = data['Data'][0]['data']['Table'][0]["RuralUrban"];
          this.buildingdetails.DivisionID = data['Data'][0]['data']['Table'][0]["DivisionID"];
          this.buildingdetails.Division_English = data['Data'][0]['data']['Table'][0]["Division_English"];
          this.buildingdetails.DistrictID = data['Data'][0]['data']['Table'][0]["DistrictID"];
          this.buildingdetails.District_Eng = data['Data'][0]['data']['Table'][0]["District_Eng"];

          if (this.buildingdetails.RuralUrban == 'Rural') {
            this.buildingdetails.TehsilID = data['Data'][0]['data']['Table'][0]["TehsilID"];
            this.buildingdetails.TehsilName = data['Data'][0]['data']['Table'][0]["TehsilName"];
            this.buildingdetails.PanchayatSamitiID = data['Data'][0]['data']['Table'][0]["PanchayatSamitiID"];
            this.buildingdetails.PanchyatSamitiName = data['Data'][0]['data']['Table'][0]["PanchyatSamitiName"];
          }
          this.buildingdetails.CityTownVillage = data['Data'][0]['data']['Table'][0]["CityTownVillage"];
          this.buildingdetails.ContactNo = data['Data'][0]['data']['Table'][0]["ContactNo"];
          this.buildingdetails.Pincode = data['Data'][0]['data']['Table'][0]["Pincode"];
          this.buildingdetails.OwnBuildingOrderNo = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderNo"];
          this.buildingdetails.OwnBuildingOrderDate = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderDate"];
          this.buildingdetails.OwnBuildingFileUpload = data['Data'][0]['data']['Table'][0]["OwnBuildingFileUpload"];
          this.buildingdetails.FromDate = data['Data'][0]['data']['Table'][0]["FromDate"];
          this.buildingdetails.ToDate = data['Data'][0]['data']['Table'][0]["ToDate"];
          this.buildingdetails.FireNOCFileUpload = data['Data'][0]['data']['Table'][0]["FireNOCFileUpload"];
          this.buildingdetails.OrderNo = data['Data'][0]['data']['Table'][0]["OrderNo"];
          this.buildingdetails.OrderDate = data['Data'][0]['data']['Table'][0]["OrderDate"];
          this.buildingdetails.ExpiringOn = data['Data'][0]['data']['Table'][0]["ExpiringOn"];
          this.buildingdetails.PWDNOCFileUpload = data['Data'][0]['data']['Table'][0]["PWDNOCFileUpload"];

          this.buildingdetails.lstBuildingDocDetails = data['Data'][0]['data']['Table1'];
          const display = document.getElementById('ModalViewBuildingDetail');
          if (display) display.style.display = 'block';
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async CloseBuildingModel() {
    const display = document.getElementById('ModalViewBuildingDetail');
    if (display) display.style.display = 'none';
    this.buildingdetails = {};      
  }
}
