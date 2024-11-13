import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OldNocDataModel, OldNocDetailsDataModel, OldNocDetails_SubjectDataModel } from '../../../Models/TabDetailDataModel';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OldnocdetailService } from '../../../Services/OldNOCDetail/oldnocdetail.service';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-preview-old-nocdetail',
  templateUrl: './preview-old-nocdetail.component.html',
  styleUrls: ['./preview-old-nocdetail.component.css']
})
export class PreviewOldNOCDetailComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public OldNocDetails: OldNocDetailsDataModel[] = [];
  public SubjectDataModel: OldNocDetails_SubjectDataModel[] = [];
  request = new OldNocDetailsDataModel();

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  constructor(private loaderService: LoaderService, private toastr: ToastrService, private fileUploadService: FileUploadService,
    private modalService: NgbModal,private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder, private oldnocdetailService: OldnocdetailService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetOldNOCDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID,0);
  }
  async GetOldNOCDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, OldNocID: number) {
    try {
      this.loaderService.requestStarted();
      await this.oldnocdetailService.GetOldNOCDetailList_DepartmentCollegeWise(DepartmentID, CollegeID, OldNocID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.OldNocDetails = data['Data'];
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

  async ViewOldNOCDetail(content: any, OldNocID: number) {
    this.request = new OldNocDetailsDataModel();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    try {
      this.loaderService.requestStarted();
      await this.oldnocdetailService.GetOldNOCDetailList_DepartmentCollegeWise(this.SelectedDepartmentID, this.SelectedCollageID, OldNocID)
        .then((data: any) => {
          debugger;
          const display = document.getElementById('ModalViewOldNOCDetail');
          if (display) display.style.display = 'block';
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request = data['Data'][0];
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
