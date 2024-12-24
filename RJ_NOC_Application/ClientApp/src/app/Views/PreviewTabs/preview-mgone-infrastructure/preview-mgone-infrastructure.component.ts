import { Component, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { debug } from 'console';


@Component({
  selector: 'app-preview-mgone-infrastructure',
  templateUrl: './preview-mgone-infrastructure.component.html',
  styleUrls: ['./preview-mgone-infrastructure.component.css']
})
export class PreviewMGOneInfrastructureComponent {


  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public MGOneDepartmentList: any = [];
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
      await this.commonMasterService.GetMGOneFacilityDepartmentList(0, this.SelectedCollageID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MGOneDepartmentList = data['Data'];
          for (var i = 0; i < this.MGOneDepartmentList.length; i++) {
            for (var j = 0; j < this.MGOneDepartmentList[i].MGOneFacilityDepartmentList.length; j++) {
              await this.ShowHideRow(i, j, this.MGOneDepartmentList[i].MGOneFacilityDepartmentList[j].ID);
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

  async ShowHideRow(Departidx: number, idx: number, ID: number) {
    var GetChild = this.MGOneDepartmentList[Departidx].MGOneFacilityDepartmentList.filter((x: { ParentID: number }) => x.ParentID == ID);
    if (GetChild.length > 0) {
      for (var j = 0; j < this.MGOneDepartmentList[Departidx].MGOneFacilityDepartmentList.length; j++) {
        if (this.MGOneDepartmentList[Departidx].MGOneFacilityDepartmentList[j].ParentID == ID && this.MGOneDepartmentList[Departidx].MGOneFacilityDepartmentList[idx].Value == 'Yes') {
          this.MGOneDepartmentList[Departidx].MGOneFacilityDepartmentList[j].IsHide = false;
        }
        else if (this.MGOneDepartmentList[Departidx].MGOneFacilityDepartmentList[j].ParentID == ID && this.MGOneDepartmentList[Departidx].MGOneFacilityDepartmentList[idx].Value != 'Yes') {
          this.MGOneDepartmentList[Departidx].MGOneFacilityDepartmentList[j].IsHide = true;
          this.MGOneDepartmentList[Departidx].MGOneFacilityDepartmentList[j].Value = '';

        }
      }
    }
  }
}
