import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicInformationDetailsService } from '../../../Services/AcademicInformationDetails/academic-information-details.service';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FarmLandDetailDataModel } from '../../../Models/FarmLandDetailDataModel';
import { FarmLandDetailService } from '../../../Services/FarmLandDetail/farm-land-detail.service';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { AgricultureDocumentScrutinyService } from '../../../Services/AgricultureDocumentScrutiny/agriculture-document-scrutiny.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApplyNocpreviewAgricultureComponent } from '../../apply-nocpreview-agriculture/apply-nocpreview-agriculture.component';
@Component({
  selector: 'app-agri-document-scrutiny-farm-land-details',
  templateUrl: './agri-document-scrutiny-farm-land-details.component.html',
  styleUrls: ['./agri-document-scrutiny-farm-land-details.component.css']
})
export class AgriDocumentScrutinyFarmLandDetailsComponent implements OnInit {
  public isDisabledAction: boolean = false;

  public lstFarmLandDetails: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  request = new FarmLandDetailDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public FinalRemarks: any = [];
  public SelectedApplyNOCID: number = 0;
  public isFormvalid: boolean = true;
  public isRemarkValid: boolean = false;
  dsrequest = new DocumentScrutinyDataModel();
  public IsRural: any = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  constructor(private applyNocpreviewAgricultureComponent: ApplyNocpreviewAgricultureComponent,private farmLandDetailService: FarmLandDetailService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private applyNOCApplicationService: ApplyNOCApplicationService,
    private agricultureDocumentScrutinyService: AgricultureDocumentScrutinyService, private modalService: NgbModal) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()))
    await this.GetFarmLandDetailsAllList();
  }

  async GetFarmLandDetailsAllList() {
    try {
      this.loaderService.requestStarted();
      await this.agricultureDocumentScrutinyService.DocumentScrutiny_FarmLandDetails(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.lstFarmLandDetails = data['Data'][0]['FarmLandDetails'];
          this.FinalRemarks = data['Data'][0]['DocumentScrutinyFinalRemarkList'][0];
          this.dsrequest.FinalRemark = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.Remark;
          this.dsrequest.ActionID = this.FinalRemarks.find((x: { RoleIDS: number; }) => x.RoleIDS == this.sSOLoginDataModel.RoleID)?.ActionID;
          if (this.dsrequest.ActionID == 2) {
            this.isDisabledAction = true;
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

  async ViewLandDetail(content: any, FarmLandDetailID: number) {
    this.request = new FarmLandDetailDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {

      this.loaderService.requestStarted();
      await this.farmLandDetailService.GetFarmLandDetalsByID(FarmLandDetailID)
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
          this.request.TehsilName = data['Data']["TehsilName"];
          if (this.request.RuralUrban == 'Rural') {
            this.IsRural = true;
            this.request.PanchayatSamitiName = data['Data']["PanchayatSamitiName"];
          }
          else {
            this.IsRural = false;
            this.request.CityName = data['Data']["CityName"];
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

  async selectAll(ActionType: string) {
    await this.lstFarmLandDetails.forEach((i: { Action: string, Remark: string }) => {
      i.Action = ActionType;
      i.Remark = '';
    })
    if (ActionType == 'No') {
      this.dsrequest.ActionID = 2;
      this.isDisabledAction = true;
    }
    else {
      this.dsrequest.ActionID = 0;
      this.isDisabledAction = false;
    }
  }


  ClickOnAction(idx: number) {
    var Count = 0;
    for (var i = 0; i < this.lstFarmLandDetails.length; i++) {
      if (i == idx) {
        this.lstFarmLandDetails[i].Remark = '';
      }
      if (this.lstFarmLandDetails[i].Action == 'No') {
        Count++;
      }
    }
    if (Count > 0) {
      this.dsrequest.ActionID = 2;
      this.isDisabledAction = true;
    }
    else {
      this.dsrequest.ActionID = 0;
      this.isDisabledAction = false;
    
    }
  }
  public isSubmitted: boolean = false;
  async SubmitFarmLandDetailsDetail_Onclick() {
    this.isSubmitted = true;
    this.dsrequest.DepartmentID = this.SelectedDepartmentID;
    this.dsrequest.CollegeID = this.SelectedCollageID;
    this.dsrequest.ApplyNOCID = this.SelectedApplyNOCID;
    this.dsrequest.UserID = this.sSOLoginDataModel.UserID;
    this.dsrequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.dsrequest.TabName = 'Farm Land Details';
    this.isRemarkValid = false;
    this.isFormvalid = true;
    this.dsrequest.DocumentScrutinyDetail = [];
    for (var i = 0; i < this.lstFarmLandDetails.length; i++) {
      if (this.lstFarmLandDetails[i].Action == '' || this.lstFarmLandDetails[i].Action == undefined) {
        this.toastr.warning('Please take Action on all records');
        return;
      }
      if (this.lstFarmLandDetails[i].Action == 'No') {
        if (this.lstFarmLandDetails[i].Remark == '' || this.lstFarmLandDetails[i].Remark == undefined) {
          this.toastr.warning('Please enter remark');
          return;
        }
      }
    }

    if (this.dsrequest.ActionID <= 0) {
      this.isFormvalid = false;
    }

    if (this.dsrequest.FinalRemark == '') {
      this.isRemarkValid = true;
      this.isFormvalid = false;
    }
    if (!this.isFormvalid) {
      return;
    }
    if (this.lstFarmLandDetails.length > 0) {
      for (var i = 0; i < this.lstFarmLandDetails.length; i++) {
        console.log(this.lstFarmLandDetails[i]);
        this.dsrequest.DocumentScrutinyDetail.push({
          DocumentScrutinyID: 0,
          DepartmentID: this.SelectedDepartmentID,
          CollegeID: this.SelectedCollageID,
          UserID: this.sSOLoginDataModel.UserID,
          RoleID: this.sSOLoginDataModel.RoleID,
          ApplyNOCID: this.SelectedApplyNOCID,
          Action: this.lstFarmLandDetails[i].Action,
          Remark: this.lstFarmLandDetails[i].Remark,
          TabRowID: this.lstFarmLandDetails[i].FarmLandDetailID,
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
  ViewTaril(ID: number, ActionType: string) {
    this.applyNocpreviewAgricultureComponent.ViewTarilCommon(ID, ActionType);
  }
}
