import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { __rest } from 'tslib';
import { ApplyNocParameterService } from '../../../Services/Master/apply-noc-parameter.service';
import { DCEDocumentScrutinyService } from '../../../Services/DCEDocumentScrutiny/dcedocument-scrutiny.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { TotalCollegeReportSearchFilter } from '../../../Models/SearchFilterDataModel';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { AadharServiceDetails } from '../../../Services/AadharServiceDetails/aadhar-service-details.service';
import { AadharServiceDataModel, CAGetSignedXmlApiRequest } from '../../../Models/AadharServiceDataModel';

@Injectable()

  @Component({
    selector: 'app-btergenerate-order-list',
    templateUrl: './btergenerate-order-list.component.html',
    styleUrls: ['./btergenerate-order-list.component.css']
  })
export class BTERGenerateOrderListComponent implements OnInit {
  request = new TotalCollegeReportSearchFilter();
  public searchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  //Add FormBuilder

  public UniversityList: any = [];
  public DivisionList: any = [];
  public DistrictList: any = [];
  public TotalOrderGenerateList: any = [];
  public TotalOrderGenerateListview: any = [];

  public collegeListData: any = [];
  public collegeContactDetailsList: any = [];
  public collegeNearestGovernmentHospitalsList: any = [];
  public DTECollegeLevel: any = [];
  public MaxDate: Date = new Date;
  public EnterInwordNo: string = '';
  public ApplicationDateofReceived: string = '';
  public selectedApplicationNo: string = '';
  public CollegeName: string = '';
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedDTEAffiliationID: number = 0;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public selectedFileName: string = '';
  pdfRequest = new CAGetSignedXmlApiRequest();

  AadhaarNo: string = '';
  displayName: string = '';
  constructor(private collegeservice: CollegeService, private draftApplicationListService: DraftApplicationListService, private routers: Router, private router: ActivatedRoute, private dceDocumentScrutinyService: DCEDocumentScrutinyService, private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private applyNocParameterService: ApplyNocParameterService, private modalService: NgbModal, private applyNOCApplicationService: ApplyNOCApplicationService, private aadharServiceDetails: AadharServiceDetails) {
  }

  async ngOnInit() {
    debugger;
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));    
    this.AadhaarNo = this.sSOLoginDataModel.AadhaarId
    this.displayName = this.sSOLoginDataModel.DisplayName;

    await this.LoadMaster();
    await this.GetGenerateorderList();
  }


  async LoadMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetUniversityByDepartmentId(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UniversityList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetDivisionList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DivisionList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.GetDistrictListByStateID(6)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data['Data'];
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
  async FillDivisionRelatedDDL(SelectedDivisionID: string) {
    try {
      this.loaderService.requestStarted();
      const divisionId = Number(SelectedDivisionID);
      this.request.DistrictID = 0;
      if (divisionId < 0) {
        return;
      }
      if (divisionId == 0) {
        await this.commonMasterService.GetDistrictListByStateID(6)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictList = data['Data'];
          }, error => console.error(error));
      }
      else {
        await this.commonMasterService.GetDistrictByDivsionId(divisionId)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictList = data['Data'];
          }, error => console.error(error));
      }
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

  async GetGenerateorderList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.collegeservice.TotalBTERApplicationDetailsByDepartment(this.request, this.sSOLoginDataModel.SessionID, 'TotalOrderGenerate')
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.TotalOrderGenerateList = data['Data'][0]['data'];
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

  async GetCollegeDetailsByCollege(CollegeID: any) {
    try {
      this.loaderService.requestStarted();
      await this.draftApplicationListService.ViewTotalCollegeDataByID(CollegeID, this.sSOLoginDataModel.UserID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.collegeListData = data['Data'][0]['data']['Table'][0];
          this.collegeContactDetailsList = data['Data'][0]['data']['Table1'];
          this.collegeNearestGovernmentHospitalsList = data['Data'][0]['data']['Table2'];
          this.DTECollegeLevel = data['Data'][0]['data']['Table4'];

          //console.log(this.draftApplicatoinListData);
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
  async View_OnClick(content: any, GenOrderNumber: string) {
    debugger;
    this.GenerateorderList(GenOrderNumber)
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  async GenerateorderList(GenOrderNumber:string) {
    debugger;
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.collegeservice.GetGenerateorderList('TotalViewOrderGenerate', GenOrderNumber)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.TotalOrderGenerateListview = data['Data'][0]['data'];
          
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
  //async View_OnClick(GenOrderNumber: string) {
  //  this.routers.navigate(['/bterordersummary' + "/" + encodeURI(this.commonMasterService.Encrypt(GenOrderNumber.toString()))]);
    
  //}
  public isLoadingExport: boolean = false;
  async btnExportTable_Click() {
    debugger;    
    this.loaderService.requestStarted();
    console.log(this.TotalOrderGenerateListview);
    if (this.TotalOrderGenerateListview.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][0] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "TotalOrdelList.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }
  }
  async ResetControl() {
    this.request = new TotalCollegeReportSearchFilter();
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
  public editor: any = ClassicEditor;
  config = {
    toolbar: [
      'heading',
      '|',
      'alignment',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      'subscript',
      'superscript',
      '|',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      '-', // break point
      'fontfamily',
      'fontsize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'code',
      'codeBlock',
      '|',
      'insertTable',
      '|',
      'imageInsert',
      'blockQuote',
      '|',
      'undo',
      'redo',
    ],
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
      ],
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        // 'Popins'
      ],
    },
  };
  public NOCFormat: string = '';
  async OpenGeneratePDFPopUP(content: any) {
    debugger;    
    this.GetAppliedParameterEssentialityForByApplyNOCID()
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  //public requestnoc = new NOCIssuedForMGOneDataModel();
  public isSubmitNOC: boolean = false;
  public NOCIssuedRemark: string = '';
  public IssuedYear: number = 0;
  public PNOCIssuedYear: number = 0;
  public ChangeIntoTNOC: boolean = false;
  async GetAppliedParameterEssentialityForByApplyNOCID() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.applyNOCApplicationService.GetAppliedParameterEssentialityForAffiliationorder()
        .then((data: any) => {
          if (data?.Data?.length > 0 && data.Data[0]?.data?.length > 0) {
            this.NOCFormat = data.Data[0].data[0].NOCFormat;
          } else {
            console.error("NOCFormat is undefined");
            this.NOCFormat = ''; // Default value
          }
        })
        .catch(error => console.error(error));
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

  //async PreviewPDF(NOCFormat: string) {
  //  debugger;
  //  try {
  //    this.loaderService.requestStarted();

  //    this.requestnoc.ApplyNOCID = this.SelectedApplyNOCID,
  //      this.requestnoc.CreatedBy = this.sSOLoginDataModel.UserID,
  //      this.requestnoc.Remark = this.NOCIssuedRemark,
  //      this.requestnoc.NOCFormat = NOCFormat

  //    this.loaderService.requestStarted();
  //    await this.applyNOCApplicationService.GenerateDraftEssentiality(this.requestnoc)
  //      .then((data: any) => {
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (!this.State) {
  //          this.toastr.success(this.SuccessMessage);
  //          //this.modalService.dismissAll('After Success');
  //          window.open(GlobalConstants.SystemGeneratedPDFPathURL + data.Data, "_blank");
  //          //window.location.reload();
  //          this.loaderService.requestEnded();
  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage);
  //          this.loaderService.requestEnded();
  //        }
  //      })
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async GeneratePDF_OnClick(NOCFormat: string) {
  //  try {
  //    debugger;
  //    this.loaderService.requestStarted();

  //    this.requestnoc.ApplyNOCID = this.SelectedApplyNOCID,
  //      this.requestnoc.CreatedBy = this.sSOLoginDataModel.UserID,
  //      this.requestnoc.Remark = this.NOCIssuedRemark,
  //      this.requestnoc.CollegeID = this.SelectedCollageID,
  //      this.requestnoc.NOCFormat = NOCFormat
  //    this.isFormvalid = true;
  //    this.isSubmitNOC = true;
  //    if (this.NOCIssuedRemark == '') {
  //      this.isFormvalid = false;
  //    }
  //    this.loaderService.requestStarted();
  //    await this.applyNOCApplicationService.GenerateEssentialityMgone(this.requestnoc)
  //      .then((data: any) => {
  //        debugger;
  //        this.State = data['State'];
  //        this.SuccessMessage = data['SuccessMessage'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (!this.State) {
  //          this.toastr.success(this.SuccessMessage);

  //          this.modalService.dismissAll('After Success');
  //          window.location.reload();
  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage)
  //        }
  //      })
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async Documentscrutiny_OnClick(DepartmentID: number, DTEAffiliationID: number, Status: string, CollegeStatusId: number, ApplyBterAffiliationID: number, CollegeID: number) {
    window.open('/bterdocumentscrutiny' + "/" + encodeURI(this.commonMasterService.Encrypt(DepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(DTEAffiliationID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(Status.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeStatusId.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(ApplyBterAffiliationID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(CollegeID.toString())), '_blank')
  }
  //async BTEROrderGen(GenOrderNumber: string) {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.BTEROrderGen(GenOrderNumber)
  //      .then((data: any) => {
  //        this.State = data['State'];
  //         this.SuccessMessage = data['SuccessMessage'];
  //        this.GetGenerateorderList();
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  public BTEROrderGen(GenOrderNumber: string) {
    this.commonMasterService.BTEROrderGen(GenOrderNumber).subscribe(
      (response: Blob) => {
        if (response) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);

          // Open PDF in a new tab
          //const newTab = window.open(blobUrl, '_blank');
          //if (!newTab) {
          //  alert('Pop-up blocked! Please allow pop-ups for this site.');
          //}
          this.GetGenerateorderList();
          // Cleanup
          setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        } else {
          console.error('Received empty response for PDF.');
        }
      },
      (error: any) => {  // ✅ Fix: Explicitly define `error` type
        console.error('Error opening the PDF:', error);
        alert('Failed to generate the PDF. Please try again.');
      }
    );
  }

  async SendEsign(FileName: string, LOIID: number) {

    try {
      this.loaderService.requestStarted();
      debugger
      this.selectedFileName = FileName;

      if (this.selectedFileName != undefined && this.selectedFileName != null) {

        this.pdfRequest.PDFFileName = this.selectedFileName
        this.pdfRequest.DepartmentID = 12;
        this.pdfRequest.SSOdisplayName = this.displayName;
        this.pdfRequest.CreatedBy = this.sSOLoginDataModel.UserID.toString();
        this.pdfRequest.eSignType = 'BTER Affliation'
        this.pdfRequest.ApplyNocApplicationID = LOIID.toString();

        await this.aadharServiceDetails.CA_eSignPDF(this.pdfRequest)
          .then(async (data: any) => {
            debugger;
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            console.log(data);
            console.log(this.State);
            if (!this.State) {

              this.RedirectCAeSignPDFReqest(data.Data.ESPRequestURL, (data.Data.signedXMLData))
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          });
      }
      else {
        this.toastr.warning("File Name is null.please try again.");
      }
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

  RedirectCAeSignPDFReqest(pServiceURL: string, pesignData: string) {
    debugger;
    //console.log("Amarendra");
    //console.log(pesignData);
    //console.log(pServiceURL);    
    //var decodedXml = atob(pesignData);
    //let decodedXml =atob(pesignData);
    var form = document.createElement("form");
    form.method = "POST";
    form.action = pServiceURL;
    form.enctype = "multipart/form-data";
    form.name = "uploadForm";
    var hiddenField = document.createElement("textarea");
    hiddenField.name = "esignData";
    hiddenField.style.display = "none"; // Hide field
    hiddenField.textContent = window.atob(pesignData); // ✅ Ensure decoded XML is set correctly
    form.appendChild(hiddenField);
    document.body.appendChild(form);
    console.log("Form HTML:", form.outerHTML);

    // ✅ Delay form submission to allow rendering
    setTimeout(() => {
      form.submit();
      document.body.removeChild(form);
    }, 100); // Small delay to ensure form is properly attached
  }
}




