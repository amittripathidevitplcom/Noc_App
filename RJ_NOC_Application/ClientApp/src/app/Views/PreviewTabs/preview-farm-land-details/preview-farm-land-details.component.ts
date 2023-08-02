import { Component, OnInit } from '@angular/core';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { FarmLandDetailDataModel } from '../../../Models/FarmLandDetailDataModel';
import { FarmLandDetailService } from '../../../Services/FarmLandDetail/farm-land-detail.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-preview-farm-land-details',
  templateUrl: './preview-farm-land-details.component.html',
  styleUrls: ['./preview-farm-land-details.component.css']
})
export class PreviewFarmLandDetailsComponent implements OnInit {
  public IsRural: any = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  request = new FarmLandDetailDataModel();
  public lstFarmLandDetails: any = [];
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public QueryStringCollegeID: any = 0;
  constructor(private farmLandDetailServiceService: FarmLandDetailService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private loaderService: LoaderService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.QueryStringCollegeID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.GetAllFarmLandDetalsList(this.QueryStringCollegeID);
  }

  async GetAllFarmLandDetalsList(CollegeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.farmLandDetailServiceService.GetAllFarmLandDetalsListByCollegeID(CollegeID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstFarmLandDetails = data['Data'][0]['data'];
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
  async ViewLandDetail(content: any, FarmLandDetailID: number) {
    this.request = new FarmLandDetailDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
    
      this.loaderService.requestStarted();
      await this.farmLandDetailServiceService.GetFarmLandDetalsByID(FarmLandDetailID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.request.FarmLandDetailID = data['Data']["FarmLandDetailID"];
          this.request.CollegeID = data['Data']["CollegeID"];
          this.request.LandOwnerName = data['Data']["LandOwnerName"];
          this.request.KhasraNumber = data['Data']["KhasraNumber"];
          this.request.AddressLine1 = data['Data']["AddressLine1"];
          this.request.AddressLine2 = data['Data']["AddressLine2"];
          this.request.RuralUrban = data['Data']["RuralUrban"];
          this.request.DivisionName = data['Data']["DivisionName"];
          this.request.DistrictName = data['Data']["DistrictName"];

          if (this.request.RuralUrban == 'Rural') {
            this.IsRural = true;
            this.request.TehsilName = data['Data']["TehsilName"];
            this.request.PanchayatSamitiName = data['Data']["PanchayatSamitiName"];
          }
          else {
            this.IsRural = false;
          }
          this.request.CityTownVillage = data['Data']["CityTownVillage"];
          this.request.LandType = data['Data']["LandType"];
          this.request.Pincode = data['Data']["Pincode"];
          this.request.TotalFarmLandArea = data['Data']["TotalFarmLandArea"];
          this.request.TotalLandArea = data['Data']["TotalLandArea"];
          this.request.SourceIrrigation = data['Data']["SourceIrrigation"];
          this.request.FarmLandIs = data['Data']["FarmLandIs"];
          this.request.CertificatefOfTehsildarPath = data['Data']["CertificatefOfTehsildarPath"];
          this.request.CertificatefOfTehsildarName = data['Data']["CertificatefOfTehsildarName"];
          this.request.CertificatefOfTehsildar_DisName = data['Data']["CertificatefOfTehsildar_DisName"];
          this.request.LandTitleCertificatePath = data['Data']["LandTitleCertificatePath"];
          this.request.LandTitleCertificateName = data['Data']["LandTitleCertificateName"];
          this.request.LandTitleCertificate_DisName = data['Data']["LandTitleCertificate_DisName"];
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
