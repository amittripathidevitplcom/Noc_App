import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingDetailsDataModel, DocuemntBuildingDetailsDataModel } from '../../../Models/TabDetailDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { BuildingDetailsMasterService } from '../../../Services/BuildingDetailsMaster/building-details-master.service'
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  constructor(private buildingDetailsMasterService: BuildingDetailsMasterService, private commonMasterService: CommonMasterService,
    private loaderService: LoaderService, private router: ActivatedRoute, private modalService: NgbModal) { }

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
  async ViewBuildingDetails(content: any, BuildingDetailID: number) {
    this.buildingdetails = {};
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.buildingDetailsMasterService.GetByID(BuildingDetailID, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.buildingdetails.SchoolBuildingDetailsID = data['Data'][0]['data']['Table'][0]["SchoolBuildingDetailsID"];
          this.buildingdetails.BuildingTypeID = data['Data'][0]['data']['Table'][0]["BuildingTypeID"];
          this.buildingdetails.BuildingTypeName = data['Data'][0]['data']['Table'][0]["BuildingTypeName"];
          this.buildingdetails.MGOneIstheCampusUnitary = data['Data'][0]['data']['Table'][0]["MGOneIstheCampusUnitary"];
          this.buildingdetails.Distance = data['Data'][0]['data']['Table'][0]["Distance"];
          this.buildingdetails.NameoftheAuthority = data['Data'][0]['data']['Table'][0]["NameoftheAuthority"];
          this.buildingdetails.AuthorityDateApproval = data['Data'][0]['data']['Table'][0]["AuthorityDateApproval"];
          this.buildingdetails.OwnerName = data['Data'][0]['data']['Table'][0]["OwnerName"];
          this.buildingdetails.AddressLine1 = data['Data'][0]['data']['Table'][0]["AddressLine1"];
          this.buildingdetails.AddressLine2 = data['Data'][0]['data']['Table'][0]["AddressLine2"];
          this.buildingdetails.RuralUrban = data['Data'][0]['data']['Table'][0]["RuralUrban"];
          this.buildingdetails.DivisionID = data['Data'][0]['data']['Table'][0]["DivisionID"];
          this.buildingdetails.Division_English = data['Data'][0]['data']['Table'][0]["Division_English"];
          this.buildingdetails.DistrictID = data['Data'][0]['data']['Table'][0]["DistrictID"];
          this.buildingdetails.District_Eng = data['Data'][0]['data']['Table'][0]["District_Eng"];
          this.buildingdetails.TehsilID = data['Data'][0]['data']['Table'][0]["TehsilID"];
          this.buildingdetails.TehsilName = data['Data'][0]['data']['Table'][0]["TehsilName"];
          this.buildingdetails.PanchayatSamitiID = data['Data'][0]['data']['Table'][0]["PanchayatSamitiID"];
          this.buildingdetails.PanchyatSamitiName = data['Data'][0]['data']['Table'][0]["PanchyatSamitiName"];
          this.buildingdetails.CityTownVillage = data['Data'][0]['data']['Table'][0]["CityTownVillage"];
          this.buildingdetails.CityName = data['Data'][0]['data']['Table'][0]["CityName"];
          this.buildingdetails.ContactNo = data['Data'][0]['data']['Table'][0]["ContactNo"];
          this.buildingdetails.Pincode = data['Data'][0]['data']['Table'][0]["Pincode"];
          this.buildingdetails.OwnBuildingOrderNo = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderNo"];
          this.buildingdetails.OwnBuildingOrderDate = data['Data'][0]['data']['Table'][0]["OwnBuildingOrderDate"];
          this.buildingdetails.OwnBuildingFileUpload = data['Data'][0]['data']['Table'][0]["OwnBuildingFileUpload"];
          this.buildingdetails.Dis_OwnBuildingFileUpload = data['Data'][0]['data']['Table'][0]["Dis_OwnBuildingFileUpload"];
          this.buildingdetails.OwnBuildingFileUploadPath = data['Data'][0]['data']['Table'][0]["OwnBuildingFileUploadPath"];
          this.buildingdetails.FromDate = data['Data'][0]['data']['Table'][0]["FromDate"];
          this.buildingdetails.ToDate = data['Data'][0]['data']['Table'][0]["ToDate"];

          this.buildingdetails.ResidentialBuildingTypeID = data['Data'][0]['data']['Table'][0]["ResidentialBuildingTypeID"];
          this.buildingdetails.ResidentialBuildingName = data['Data'][0]['data']['Table'][0]["ResidentialBuildingName"];
          this.buildingdetails.MGOneResidentialIstheCampusUnitary = data['Data'][0]['data']['Table'][0]["MGOneResidentialIstheCampusUnitary"];
          this.buildingdetails.ResidentialDistance = data['Data'][0]['data']['Table'][0]["ResidentialDistance"];
          this.buildingdetails.ResidentialAddressLine1 = data['Data'][0]['data']['Table'][0]["ResidentialAddressLine1"];
          this.buildingdetails.ResidentialAddressLine2 = data['Data'][0]['data']['Table'][0]["ResidentialAddressLine2"];
          this.buildingdetails.ResidentialRuralUrban = data['Data'][0]['data']['Table'][0]["ResidentialRuralUrban"];
          this.buildingdetails.ResidentialDivisionID = data['Data'][0]['data']['Table'][0]["ResidentialDivisionID"];
          this.buildingdetails.ResDivision_English = data['Data'][0]['data']['Table'][0]["ResDivision_English"];
          
          this.buildingdetails.ResidentialDistrictID = data['Data'][0]['data']['Table'][0]["ResidentialDistrictID"];
          this.buildingdetails.ResDistrict_Eng = data['Data'][0]['data']['Table'][0]["ResDistrict_Eng"];
         
          this.buildingdetails.ResidentialTehsilID = data['Data'][0]['data']['Table'][0]["ResidentialTehsilID"];
          this.buildingdetails.ResTehsilName = data['Data'][0]['data']['Table'][0]["ResTehsilName"];
          
          this.buildingdetails.ResidentialPanchayatSamitiID = data['Data'][0]['data']['Table'][0]["ResidentialPanchayatSamitiID"];
          this.buildingdetails.ResPanchyatSamitiName = data['Data'][0]['data']['Table'][0]["ResPanchyatSamitiName"];
          
         
            
          this.buildingdetails.ResidentialCityID = data['Data'][0]['data']['Table'][0]["ResidentialCityID"];
          this.buildingdetails.ResCity_English = data['Data'][0]['data']['Table'][0]["ResCity_English"];
        
          this.buildingdetails.ResidentialCityTownVillage = data['Data'][0]['data']['Table'][0]["ResidentialCityTownVillage"];
          this.buildingdetails.ResidentialPincode = data['Data'][0]['data']['Table'][0]["ResidentialPincode"];
          
          this.buildingdetails.ResidentialOwnerName = data['Data'][0]['data']['Table'][0]["ResidentialOwnerName"];
          this.buildingdetails.ResidentialContactNo = data['Data'][0]['data']['Table'][0]["ResidentialContactNo"];
          this.buildingdetails.ResidentialRentvaliditydate = data['Data'][0]['data']['Table'][0]["ResidentialRentvaliditydate"];












          this.buildingdetails.ResidentialbuildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc1FileUpload"];
          this.buildingdetails.ResidentialDis_buildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialDis_buildingOtherDoc1FileUpload"];
          this.buildingdetails.ResidentialbuildingOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc1FileUploadPath"];
          this.buildingdetails.ResidentialbuildingOtherDoc2FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc2FileUpload"];
          this.buildingdetails.ResidentialDis_buildingOtherDoc2FileUpload = data['Data'][0]['data']['Table'][0]["ResidentialDis_buildingOtherDoc2FileUpload"];
          this.buildingdetails.ResidentialbuildingOtherDoc2FileUploadPath = data['Data'][0]['data']['Table'][0]["ResidentialbuildingOtherDoc2FileUploadPath"];
          this.buildingdetails.ResidentialRentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["ResidentialRentAgreementFileUpload"];
          this.buildingdetails.ResidentialDis_RentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["ResidentialDis_RentAgreementFileUpload"];
          this.buildingdetails.ResidentialRentAgreementFileUploadPath = data['Data'][0]['data']['Table'][0]["ResidentialRentAgreementFileUploadPath"];
          this.buildingdetails.AuthoritybuildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["AuthoritybuildingOtherDoc1FileUpload"];
          this.buildingdetails.AuthorityDis_buildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["AuthorityDis_buildingOtherDoc1FileUpload"];
          this.buildingdetails.AuthoritybuildingOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["AuthoritybuildingOtherDoc1FileUploadPath"];
          this.buildingdetails.MGOneDrainage = data['Data'][0]['data']['Table'][0]["MGOneDrainage"];
          this.buildingdetails.BuildingUseNameoftheAuthority = data['Data'][0]['data']['Table'][0]["BuildingUseNameoftheAuthority"];
          this.buildingdetails.BuildingUseOrderNo = data['Data'][0]['data']['Table'][0]["BuildingUseOrderNo"];
          this.buildingdetails.BuildingUseDateApproval = data['Data'][0]['data']['Table'][0]["BuildingUseDateApproval"];
          this.buildingdetails.buildingUseOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["buildingUseOtherDoc1FileUpload"];
          this.buildingdetails.Dis_buildingUseOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["Dis_buildingUseOtherDoc1FileUpload"];
          this.buildingdetails.buildingUseOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["buildingUseOtherDoc1FileUploadPath"];
          this.buildingdetails.PollutionDateApproval = data['Data'][0]['data']['Table'][0]["PollutionDateApproval"];
          this.buildingdetails.ValidDateApproval = data['Data'][0]['data']['Table'][0]["ValidDateApproval"];
          this.buildingdetails.PollutionbuildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["PollutionbuildingOtherDoc1FileUpload"];
          this.buildingdetails.PollutionDis_buildingOtherDoc1FileUpload = data['Data'][0]['data']['Table'][0]["PollutionDis_buildingOtherDoc1FileUpload"];
          this.buildingdetails.PollutionbuildingOtherDoc1FileUploadPath = data['Data'][0]['data']['Table'][0]["PollutionbuildingOtherDoc1FileUploadPath"];

          this.buildingdetails.FireNOCFileUpload = data['Data'][0]['data']['Table'][0]["FireNOCFileUpload"];
          this.buildingdetails.Dis_FireNOCFileUpload = data['Data'][0]['data']['Table'][0]["Dis_FireNOCFileUpload"];
          this.buildingdetails.FireNOCFileUploadPath = data['Data'][0]['data']['Table'][0]["FireNOCFileUploadPath"];
          this.buildingdetails.OrderNo = data['Data'][0]['data']['Table'][0]["OrderNo"];
          this.buildingdetails.OrderDate = data['Data'][0]['data']['Table'][0]["OrderDate"];
          this.buildingdetails.ExpiringOn = data['Data'][0]['data']['Table'][0]["ExpiringOn"];
          this.buildingdetails.PWDNOCFileUpload = data['Data'][0]['data']['Table'][0]["PWDNOCFileUpload"];
          this.buildingdetails.Dis_PWDNOCFileUpload = data['Data'][0]['data']['Table'][0]["Dis_PWDNOCFileUpload"];
          this.buildingdetails.PWDNOCFileUploadPath = data['Data'][0]['data']['Table'][0]["PWDNOCFileUploadPath"];

          this.buildingdetails.TotalProjectCost = data['Data'][0]['data']['Table'][0]["TotalProjectCost"];
          this.buildingdetails.SourceCostAmount = data['Data'][0]['data']['Table'][0]["SourceCostAmount"];
          this.buildingdetails.AmountDeposited = data['Data'][0]['data']['Table'][0]["AmountDeposited"];
          this.buildingdetails.OtherFixedAssetsAndSecurities = data['Data'][0]['data']['Table'][0]["OtherFixedAssetsAndSecurities"];
          this.buildingdetails.GATEYearBalanceSecret = data['Data'][0]['data']['Table'][0]["GATEYearBalanceSecret"];
          this.buildingdetails.OtherFinancialResources = data['Data'][0]['data']['Table'][0]["OtherFinancialResources"];
          this.buildingdetails.TotalProjectCostFileUpload = data['Data'][0]['data']['Table'][0]["TotalProjectCostFileUpload"];
          this.buildingdetails.TotalProjectCostFileUploadPath = data['Data'][0]['data']['Table'][0]["TotalProjectCostFileUploadPath"];
          this.buildingdetails.Dis_TotalProjectCostFileUpload = data['Data'][0]['data']['Table'][0]["Dis_TotalProjectCostFileUpload"];
          this.buildingdetails.SourceCostAmountFileUpload = data['Data'][0]['data']['Table'][0]["SourceCostAmountFileUpload"];
          this.buildingdetails.SourceCostAmountFileUploadPath = data['Data'][0]['data']['Table'][0]["SourceCostAmountFileUploadPath"];
          this.buildingdetails.Dis_SourceCostAmountFileUpload = data['Data'][0]['data']['Table'][0]["Dis_SourceCostAmountFileUpload"];
          this.buildingdetails.AmountDepositedFileUpload = data['Data'][0]['data']['Table'][0]["AmountDepositedFileUpload"];
          this.buildingdetails.AmountDepositedFileUploadPath = data['Data'][0]['data']['Table'][0]["AmountDepositedFileUploadPath"];
          this.buildingdetails.Dis_AmountDepositedFileUpload = data['Data'][0]['data']['Table'][0]["Dis_AmountDepositedFileUpload"];
          this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUpload = data['Data'][0]['data']['Table'][0]["OtherFixedAssetsAndSecuritiesFileUpload"];
          this.buildingdetails.OtherFixedAssetsAndSecuritiesFileUploadPath = data['Data'][0]['data']['Table'][0]["OtherFixedAssetsAndSecuritiesFileUploadPath"];
          this.buildingdetails.Dis_OtherFixedAssetsAndSecuritiesFileUpload = data['Data'][0]['data']['Table'][0]["Dis_OtherFixedAssetsAndSecuritiesFileUpload"];
          this.buildingdetails.GATEYearBalanceSecretFileUpload = data['Data'][0]['data']['Table'][0]["GATEYearBalanceSecretFileUpload"];
          this.buildingdetails.GATEYearBalanceSecretFileUploadPath = data['Data'][0]['data']['Table'][0]["GATEYearBalanceSecretFileUploadPath"];
          this.buildingdetails.Dis_GATEYearBalanceSecretFileUpload = data['Data'][0]['data']['Table'][0]["Dis_GATEYearBalanceSecretFileUpload"];
          this.buildingdetails.OtherFinancialResourcesFileUpload = data['Data'][0]['data']['Table'][0]["OtherFinancialResourcesFileUpload"];
          this.buildingdetails.OtherFinancialResourcesFileUploadPath = data['Data'][0]['data']['Table'][0]["OtherFinancialResourcesFileUploadPath"];
          this.buildingdetails.Dis_OtherFinancialResourcesFileUpload = data['Data'][0]['data']['Table'][0]["Dis_OtherFinancialResourcesFileUpload"];
          this.buildingdetails.BuildingHostelQuartersRoadArea = data['Data'][0]['data']['Table'][0]["BuildingHostelQuartersRoadArea"];
          this.buildingdetails.FireNOCOrderNumber = data['Data'][0]['data']['Table'][0]["FireNOCOrderNumber"];

          if (this.buildingdetails.BuildingTypeName != 'Owned') {
            this.buildingdetails.Dis_RentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["Dis_RentAgreementFileUpload"];
            this.buildingdetails.RentAgreementFileUpload = data['Data'][0]['data']['Table'][0]["RentAgreementFileUpload"];
            this.buildingdetails.RentAgreementFileUploadPath = data['Data'][0]['data']['Table'][0]["RentAgreementFileUploadPath"];

            this.buildingdetails.Rentvaliditydate = data['Data'][0]['data']['Table'][0]["Rentvaliditydate"];
          }

          this.buildingdetails.lstBuildingDocDetails = data['Data'][0]['data']['Table1'];
          this.buildingdetails.IsApproved = data['Data'][0]['data']['Table'][0]["IsApproved"];
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
