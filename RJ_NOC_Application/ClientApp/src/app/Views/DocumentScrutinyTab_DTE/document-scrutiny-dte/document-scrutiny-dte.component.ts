import { Component, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DocumentScrutinyDataModel } from '../../../Models/DocumentScrutinyDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MedicalDocumentScrutinyService } from '../../../Services/MedicalDocumentScrutiny/medical-document-scrutiny.service';
import { DTEDocumentScrutinyService } from '../../../Services/DTEDocumentScrutiny/dtedocument-scrutiny.service';
import { DocumentScrutinyCheckListDTEComponent } from '../document-scrutiny-check-list-dte/document-scrutiny-check-list-dte.component';
import { ASTWithName } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-document-scrutiny-dte',
  templateUrl: './document-scrutiny-dte.component.html',
  styleUrls: ['./document-scrutiny-dte.component.css']
})
export class DocumentScrutinyDTEComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public dropdownSettings: IDropdownSettings = {};

  @ViewChild('tabs') tabGroup!: MatTabGroup;
  public collegeDataList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public CollegeID: number = 0;
  public LandClass: string = 'tabs-Link LandInformation';

  selectedIndex: number = 0;
  maxNumberOfTabs: number = 0;
  public CollegeType_IsExisting: boolean = true;
  public ShowObjectionField: boolean = false;
  public ShowFinalDocumentScrutiny: boolean = true;

  public TabFieldDataList: any = [];
  public SelectedTabFieldDataList: any = [];
  request = new DocumentScrutinyDataModel();
  DocumentScrutinyList: DocumentScrutinyDataModel[] = [];


  public isFormvalid: boolean = true;
  public isActionValid: boolean = false;
  public isObjectionValid: boolean = false;
  public isRemarkValid: boolean = false;


  public RoleID: number = 0;
  public UserID: number = 0;


  ApprovedCount: number = 0;
  RevertCount: number = 0;
  RejectCount: number = 0;
  TotalCount: number = 0;
  public AllTabDocumentScrutinyData: any = [];
  public CheckList_legalEntityListData1: any = [];
  public DocumentScrutinyButtonText: string = '';
  public ApplicationNo: string = '';
  public lstTarils: any = [];



  public UnitOfLand: string = '';

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  dsrequest = new DocumentScrutinyDataModel();



  @ViewChild(DocumentScrutinyCheckListDTEComponent)
  private checkListDetailsComponent_New!: DocumentScrutinyCheckListDTEComponent;

  public CheckFinalRemark: string = '';
  @ViewChild('TarilMymodal') tarilMymodal: TemplateRef<any> | undefined;
  constructor(private toastr: ToastrService, private loaderService: LoaderService, private dteDocumentScrutinyService: DTEDocumentScrutinyService,
    private commonMasterService: CommonMasterService, private router: ActivatedRoute, private modalService: NgbModal,
    private dcedocumentScrutinyService: DTEDocumentScrutinyService) { }



  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.ApplicationNo = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoYear')?.toString()) + "/" + this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoID')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.CheckTabsEntry();
    await this.ViewlegalEntityDataByID();
    try {
      this.maxNumberOfTabs = await this.tabGroup._tabs.length - 1;
    }
    catch (Ex) {
      this.maxNumberOfTabs = 14;
    }

  }

  NextStep() {
    this.CheckTabsEntry();
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }

    if (this.selectedIndex == this.maxNumberOfTabs) {
     this.checkListDetailsComponent_New.ngOnInit();
    }


  }

  PreviousStep() {
    this.CheckTabsEntry();
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    debugger;
    this.CheckTabsEntry();
    this.selectedIndex = event.index;

    if (this.selectedIndex == this.maxNumberOfTabs) {
     this.checkListDetailsComponent_New.ngOnInit();
    }

  }
  public CheckTabsEntryData: any = [];
  async CheckTabsEntry() {
    try {
      this.loaderService.requestStarted();
      await this.dteDocumentScrutinyService.CheckDocumentScrutinyTabsData(this.SelectedApplyNOCID, this.sSOLoginDataModel.RoleID, this.SelectedCollageID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CheckTabsEntryData = data['Data'][0]['data'][0];
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
  public ViewTarilCommon(ID: number, ActionType: string) {
    this.modalService.open(this.tarilMymodal, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      this.commonMasterService.GetDocumentScritintyTaril(ID, this.SelectedApplyNOCID, this.SelectedCollageID, this.SelectedDepartmentID, ActionType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.lstTarils = data['Data'][0]['data'];
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

  //Legal Entity
  async ViewlegalEntityDataByID() {
    try {
      this.loaderService.requestStarted();
      await this.dcedocumentScrutinyService.DocumentScrutiny_LegalEntity(this.SelectedCollageID, this.sSOLoginDataModel.RoleID, this.SelectedApplyNOCID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          if (data['Data'].length > 0) {
            this.CheckList_legalEntityListData1 = data['Data'][0]['legalEntity'];
          }
        }, (error: any) => console.error(error));
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
  //End Legal Entity
}
