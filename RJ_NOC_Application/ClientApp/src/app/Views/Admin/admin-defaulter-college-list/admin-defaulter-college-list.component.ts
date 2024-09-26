import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { DraftApplicationListService } from '../../../Services/DraftApplicationList/draft-application-list.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CollegeService } from '../../../services/collegedetailsform/College/college.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RequestDetails } from '../../../Models/PaymentDataModel';
import { NocpaymentService } from '../../../Services/NocPayment/noc-payment.service';
import { DefaulterCollegeSearchFilterDataModel } from '../../../Models/DefaulterCollegeRequestDataModel';
import { DefaulterCollegeRequestService } from '../../../Services/DefaulterCollegeRequest/DefaulterCollegeRequest.service';
import { ApplicationPenaltyDataModel } from '../../../Models/ApplyNOCApplicationDataModel';
import { ApplyNOCApplicationService } from '../../../Services/ApplyNOCApplicationList/apply-nocapplication.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin-defaulter-college-list',
  templateUrl: './admin-defaulter-college-list.component.html',
  styleUrls: ['./admin-defaulter-college-list.component.css']
})
export class AdminDefaulterCollegeListComponent implements OnInit {
  request = new DefaulterCollegeSearchFilterDataModel();

  constructor(private fileUploadService: FileUploadService,private DefaulterCollegeRequestService: DefaulterCollegeRequestService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private collegeService: CollegeService, private sSOLoginService: SSOLoginService, private modalService: NgbModal, private nocpaymentService: NocpaymentService) {

  }

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;

  // sso ligin
  sSOLoginDataModel = new SSOLoginDataModel();
  DefaulterCollegeListData: any = [];
  DefaulterCollegeDetailsData: any = {};

  modalReference!: NgbModalRef;
  closeResult!: string;
  public searchText: string = '';
  requestPenalty = new ApplicationPenaltyDataModel();
  public ApplicationCountList: any = [];


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetApplicationList();
    await this.GetDefaulterRequestCount();
  }

  async GetApplicationList() {
    try {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.loaderService.requestStarted();
      await this.DefaulterCollegeRequestService.GetDefaulterCollegeRequestData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.DefaulterCollegeListData = data['Data'][0]['data'];
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async ViewDetails(content: any, RequestID: number) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetApplicationDetails(RequestID);
  }

  async GetApplicationDetails(RequestID: number) {
    try {
      this.DefaulterCollegeDetailsData = {};
      this.request.RequestID = RequestID;
      this.loaderService.requestStarted();
      await this.DefaulterCollegeRequestService.GetDefaulterCollegeRequestData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          // data
          this.DefaulterCollegeDetailsData = data['Data'][0]['data'][0];
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


  public FormSubmit: boolean = false;
  public SelectedRequestID: number = 0;
  async SaveData() {
    this.FormSubmit = true;
    if (this.requestPenalty.Penaltyfor == '' ) {
      return;
    }
    if (this.requestPenalty.ApproveReject == '') {
      return;
    }
    if (this.requestPenalty.PenaltyDoc == '') {
      return;
    }
    if (this.requestPenalty.ApproveReject == 'Approve') {
      if (this.requestPenalty.PenaltyAmount == null || this.requestPenalty.PenaltyAmount.toString() == '') {
        return;
      }
      if (this.requestPenalty.PenaltyAmount == 0) {
        return;
      }
    }
    this.requestPenalty.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.requestPenalty.ApplyNOCID = this.SelectedRequestID;
    this.requestPenalty.CreatedBy = this.sSOLoginDataModel.UserID;
    this.loaderService.requestStarted();
    try {
      if (confirm("Are you sure you want to submit?")) {
        await this.DefaulterCollegeRequestService.SaveDefaulterCollegePenalty(this.requestPenalty)
          .then(async (data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage);
              this.requestPenalty = new ApplicationPenaltyDataModel();
              const btnSave = document.getElementById('btnPenaltySave')
              if (btnSave) btnSave.innerHTML = "Save";
              this.FormSubmit = false;
              await this.GetDefaulterCollegePenaltyData();
              await this.GetApplicationList();
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async OpenPenaltyModel(content: any, RequestID: number) {
    this.requestPenalty = new ApplicationPenaltyDataModel();
    this.SelectedRequestID = 0;
    this.SelectedRequestID = RequestID;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetDefaulterCollegePenaltyData();
  }
  numberOnly(event: any): boolean {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  public ApplicationStatus: string = 'Pending';
  public DefaulterCollegePenaltyList: any = [];
  async GetDefaulterCollegePenaltyData() {
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.DefaulterCollegeRequestService.GetDefaulterCollegePenalty(this.SelectedRequestID, 0)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DefaulterCollegePenaltyList = data['Data'][0]['data'];
          if (this.DefaulterCollegePenaltyList.length > 0) {
            this.ApplicationStatus = this.DefaulterCollegePenaltyList[0].ApplicationStatus;
          }
          else {
            this.ApplicationStatus = '';
          }
        });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async EditDefaulterCollegePenalty(PenaltyID: number) {
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.DefaulterCollegeRequestService.GetDefaulterCollegePenalty(this.SelectedRequestID, PenaltyID)
        .then(async (data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.requestPenalty = data['Data'][0]['data'][0];
          const btnSave = document.getElementById('btnPenaltySave')
          if (btnSave) btnSave.innerHTML = "Update";
        });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  async DeleteDefaulterCollegePenalty(PenaltyID: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.DefaulterCollegeRequestService.DeleteDefaulterCollegePenalty(PenaltyID)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetDefaulterCollegePenaltyData();
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async Reset() {
    const btnSave = document.getElementById('btnPenaltySave')
    if (btnSave) btnSave.innerHTML = "Save";
    this.requestPenalty = new ApplicationPenaltyDataModel();
  }


  public file!: File;
  public files: any = '';
  public PenaltyDocValidationMessage: string = '';
  async onFilechange(event: any) {

    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
          if (this.file.type == 'application/pdf') {
            //size validation
            if (this.file.size > 2000000) {
              this.requestPenalty.PenaltyDoc = '';
              this.requestPenalty.PenaltyDoc_DisName = '';
              this.requestPenalty.PenaltyDocPath = '';
              this.files = document.getElementById('fuPenaltyDoc');
              this.files.value = '';
              this.toastr.error('Select less then 2MB File')
              return
            }

          }
          else {
            this.toastr.warning('Select Only jpdf');
            // type validation
            this.requestPenalty.PenaltyDoc = '';
            this.requestPenalty.PenaltyDoc_DisName = '';
            this.requestPenalty.PenaltyDocPath = '';
            this.files = document.getElementById('fuPenaltyDoc');
            this.files.value = '';
            return
          }
          // upload to server folder
          await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.requestPenalty.PenaltyDoc = data['Data'][0]["FileName"];
              this.requestPenalty.PenaltyDoc_DisName = data['Data'][0]["Dis_FileName"];
              this.requestPenalty.PenaltyDocPath = data['Data'][0]["FilePath"];
              this.files = document.getElementById('fuPenaltyDoc');
              this.files.value = '';
            }
            if (this.State == 1) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
        
      }
      else {
        this.requestPenalty.PenaltyDoc = '';
        this.requestPenalty.PenaltyDoc_DisName = '';
        this.requestPenalty.PenaltyDocPath = '';
        this.files = document.getElementById('fuPenaltyDoc');
        this.files.value = '';
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        event.target.value = null;
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async DeleteImage(file: string) {
    try {

      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        // delete from server folder
        await this.fileUploadService.DeleteDocument(file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.requestPenalty.PenaltyDoc = '';
            this.requestPenalty.PenaltyDoc_DisName = '';
            this.requestPenalty.PenaltyDocPath = '';
            this.files = document.getElementById('fuPenaltyDoc');
            this.files.value = '';
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
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


  async GetDefaulterRequestCount() {
    try {
      this.ApplicationCountList = [];
      this.loaderService.requestStarted();
      await this.DefaulterCollegeRequestService.GetDefaulterRequestCount(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ApplicationCountList = data['Data'][0];

          console.log(data);
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
  btnSavePDF_Click(): void {
    this.loaderService.requestStarted();
    let dt = new Date();
    let Imgpath = ''
    
    let DefaultImg = "../../../assets/images/userImg.jpg";
    try {
      let Heading1 = 'GOVERNMENT OF RAJASTHAN';
      let Heading2 = 'OFFICE OF THE COMMISSIONER, COLLEGE EDUCATION,';
      let Heading3 = 'RAJASTHAN, JAIPUR';

            
      let month = (Number(dt.getMonth()) + 1).toString();
      let day = (Number(dt.getDate())).toString();
      if (month.length == 1)
        month = '0' + month.toString();
      if (day.length == 1)
        day = '0' + day.toString();
      let Footer1 = 'DECLARATION';
      let Footer2 = 'ALL THE ABOVE INFORMATION PROVIDED BY ME IS TRUE AND OTHERWISE I ACCEPT TO WITHDRAW MY APPLICATION.';
      let Footer3 = 'PRINT DATE : - ' + dt.getFullYear() + '-' + month + '-' + day + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
      let Footer4 = 'SIGNATURE WITH DATE';
      let Footer5 = '(PRESIDENT/SECRETARY OF MANAGEMENT COMMITTEE)';
      let doc = new jsPDF('p', 'mm', [432, 279])
      doc.setDrawColor(0);
      doc.setFillColor(255, 0, 0);
      doc.setFontSize(12);

      let pDFData: any = [];
      
      pDFData.push({ "ContentName": "#DefaulterPersonalDetails" })
      
      for (var i = 0; i < pDFData.length; i++) {
          //doc.rect(15, 35, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 45, 'S');
          autoTable(doc,
            {
              html: pDFData[i].ContentName,
              styles: { fontSize: 10, overflow: "linebreak" },
              headStyles: {
                fillColor: '#3f51b5',
                textColor: '#fff',
                halign: 'left',
                fontSize: 13
              },
              bodyStyles: {
                halign: 'left', valign: "top"
              },
              showHead: "everyPage",
              margin: {
                left: 16,
                right: 16,
                top: 35,
                bottom: 70
              },
              //alternateRowStyles: {
              //  fillColor: '#CCC',
              //  textColor: '#fff',
              //  halign: 'center',
              //  fontSize: 10
              //},
              tableLineWidth: 0.5,
              didDrawPage: function (data) {
                // Header
                doc.setFontSize(13);
                doc.setTextColor("#161C22");

                doc.text(Heading1, 140, 10, { align: 'center', maxWidth: 100 });
                doc.setFontSize(12);
                doc.text(Heading2, 140, 15, { align: 'center', maxWidth: 200 });
                doc.setFontSize(12);
                doc.text(Heading3, 140, 20, { align: 'center', maxWidth: 100 });
                doc.setFontSize(10);
                //doc.text(Heading4, 140, 25, { align: 'center', maxWidth: 150 });
                //doc.setFontSize(8);
                //doc.text(Heading5, 140, 30, { align: 'center', maxWidth: 100 });

                // Footer
                let str = "1";//+ doc.internal.getNumberOfPages();
                doc.setFontSize(13);


                let pageSize = doc.internal.pageSize;
                let pageHeight = pageSize.height
                  ? pageSize.height
                  : pageSize.getHeight();
                doc.line(264, 377, 15, 377)
                doc.setTextColor("#3f51b5");
                //doc.text(Footer1, data.settings.margin.left, pageHeight - 50);
                //doc.line(264, 385, 15, 385)
                //doc.setFontSize(10);
                //doc.setTextColor("#161C22");
                //doc.text(Footer2, data.settings.margin.left, pageHeight - 43);
                //doc.text(Footer3, data.settings.margin.left, pageHeight - 22);
                //doc.text(Footer4, 250, pageHeight - 22, { align: 'right', maxWidth: 500 });
                let down = (pageHeight - 39);
                try {
                  doc.addImage(Imgpath, 214, down, 40, 13, 'PNG');
                } catch (e) {
                  //doc.addImage(DefaultImg, 214, down, 40, 13, 'JPG');
                }

                //doc.text(Footer5, 263, pageHeight - 18, { align: 'right', maxWidth: 500, });
                doc.text(str, 575, 830);
              }
            }
          )
          //doc.rect(15, 35, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 45, 'S');
        
      }
      doc.save("DefaulterApplicationSummery" + '.pdf');
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
