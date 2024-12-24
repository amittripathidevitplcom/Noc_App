import { Component, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { debug } from 'console';


@Component({
  selector: 'app-preview-mgone-clinical-lab',
  templateUrl: './preview-mgone-clinical-lab.component.html',
  styleUrls: ['./preview-mgone-clinical-lab.component.css']
})
export class PreviewMGOneClinicalLabComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public MGOneClinicalList: any = [];
  public isSubmitted: boolean = false;
  public SearchRecordID: string = '';
  constructor(private routers: Router, private fileUploadService: FileUploadService, private toastr: ToastrService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private loaderService: LoaderService) { }



  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));

    await this.GetMGOneFacilityDepartmentList();

  }
  async GetMGOneFacilityDepartmentList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetMGOneClinicalLabDetails(this.SelectedCollageID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MGOneClinicalList = data['Data'];
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

  public file: any = '';
  async ShowHideRow(Departidx: number, idx: number, ID: number) {
    var GetChild = this.MGOneClinicalList.filter((x: { ParentID: number }) => x.ParentID == ID);
    if (GetChild.length > 0) {
      for (var j = 0; j < this.MGOneClinicalList.length; j++) {
        if (this.MGOneClinicalList[j].ParentID == ID && this.MGOneClinicalList[idx].Value == 'Yes') {
          this.MGOneClinicalList[j].IsHide = false;
        }
        else if (this.MGOneClinicalList[j].ParentID == ID && this.MGOneClinicalList[idx].Value != 'Yes') {
          this.MGOneClinicalList[j].IsHide = true;
          this.MGOneClinicalList[j].Value = '';
        }
      }
    }
  }
}
