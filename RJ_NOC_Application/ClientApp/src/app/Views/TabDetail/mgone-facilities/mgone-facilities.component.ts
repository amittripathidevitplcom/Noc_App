import { Component, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { debug } from 'console';


@Component({
  selector: 'app-mgone-facilities',
  templateUrl: './mgone-facilities.component.html',
  styleUrls: ['./mgone-facilities.component.css']
})
export class MGOneFacilitiesComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  sSOLoginDataModel = new SSOLoginDataModel();

  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public MGOneFacilityList: any = [];
  public isSubmitted: boolean = false;
  public SearchRecordID: string = '';
  constructor(private routers: Router, private fileUploadService: FileUploadService, private toastr: ToastrService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private loaderService: LoaderService) { }



  async ngOnInit() {
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SearchRecordID = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString());
    if (this.SearchRecordID.length > 20) {
      await this.commonMasterService.GetCollegeID_SearchRecordIDWise(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SelectedCollageID = data['Data']['CollegeID'];
          if (this.SelectedCollageID == null || this.SelectedCollageID == 0 || this.SelectedCollageID == undefined) {
            this.routers.navigate(['/draftapplicationlist']);
          }
        }, error => console.error(error));
    }
    else {
      this.routers.navigate(['/draftapplicationlist']);
    }

    await this.GetMGOneFacilityList();

  }
  async GetMGOneFacilityList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetMGOneFacilityList(0, this.SelectedCollageID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MGOneFacilityList = data['Data'];
          for (var i = 0; i < this.MGOneFacilityList.length; i++) {
            await this.ShowHideRow(i, this.MGOneFacilityList[i].ID);
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



  public file: any = '';
  async ValidateDocumentImage(event: any, ItemIndex: number) {
    debugger;
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'application/pdf') {
        if (event.target.files[0].size > 2000000) {
          event.target.value = '';
          this.toastr.warning('Select less then 2MB File');
          return
        }
        if (event.target.files[0].size < 100000) {
          event.target.value = '';
          this.toastr.warning('Select more then 100kb File');
          return
        }
      }
      else {
        event.target.value = '';
        this.toastr.warning('Select Only pdf');
        return
      }
      // upload
      this.file = event.target.files[0];
      try {
        this.loaderService.requestStarted();
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFiles(ItemIndex, true, data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"]);
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
      }
      catch (ex) { }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }

    }
    else {
      this.ResetFiles(ItemIndex, false, '', '', '');
    }
  }



  ResetFiles(ItemIndex: number, isShow: boolean, fileName: string, filePath: string, dis_Name: string) {
    debugger;
    try {
      debugger;
      this.loaderService.requestStarted();
      this.MGOneFacilityList[ItemIndex].Value = fileName;
      this.MGOneFacilityList[ItemIndex].Value_Dis_FileName = dis_Name;
      this.MGOneFacilityList[ItemIndex].ValuePath = filePath;
      this.file = document.getElementById('UploadFile_' + ItemIndex);
      this.file.value = '';
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async DeleteImage(file: string, ItemIndex: number) {
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        // delete from server folder
        await this.fileUploadService.DeleteDocument(file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == 0) {
            this.ResetFiles(ItemIndex, true, '', '', '');
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






  async ResetControl() {
    /*for (var i = 0; i < this.AHDepartmentList.length; i++) {*/
    for (var j = 0; j < this.MGOneFacilityList.length; j++) {
      this.MGOneFacilityList[j].Value = '';
      this.MGOneFacilityList[j].Value_Dis_FileName = '';
      this.MGOneFacilityList[j].ValuePath = '';
    }
    /* }*/
  }
  async SaveData() {
    this.isSubmitted = true;
    try {
      /* for (var i = 0; i < this.AHDepartmentList.length; i++) {*/
      for (var j = 0; j < this.MGOneFacilityList.length; j++) {
        if (this.MGOneFacilityList[j].IsMandatory) {
          var GetChild = this.MGOneFacilityList.filter((x: { ParentID: number }) => x.ParentID == this.MGOneFacilityList[j].ID);
          if (this.MGOneFacilityList[j].Value == '' && this.MGOneFacilityList[j].ParentID == 0) {
            return;
          }
          else if (this.MGOneFacilityList[j].ControlType == 'Text' && this.MGOneFacilityList[j].Value < this.MGOneFacilityList[j].MinQty && this.MGOneFacilityList[j].ParentID == 0) {
            return;
          }
          else if (this.MGOneFacilityList[j].ControlType == 'DropDown' && this.MGOneFacilityList[j].ParentID == 0 && this.MGOneFacilityList[j].Value == 'Yes') {
            if (GetChild.length > 0) {
              for (var k = 0; k < GetChild.length; k++) {
                if (GetChild[k].Value == '') {
                  return;
                }
              }
            }
          }
        }
        /*}*/
      }
      this.loaderService.requestStarted();
      this.MGOneFacilityList[0].CollegeID = this.SelectedCollageID;
      await this.commonMasterService.SaveMGOneFacility(this.MGOneFacilityList)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            //console.log(data['Data']);
            this.toastr.success(this.SuccessMessage);
            //window.location.reload();
            await this.GetMGOneFacilityList();
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }, error => {
          this.toastr.warning("Unable to connect to server .!");
        })
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

  async ShowHideRow(idx: number, ID: number) {
    debugger;
    var GetChild = this.MGOneFacilityList.filter((x: { ParentID: number }) => x.ParentID == ID);
    if (GetChild.length > 0) {
      for (var j = 0; j < this.MGOneFacilityList.length; j++) {
        if (this.MGOneFacilityList[j].ParentID == ID && this.MGOneFacilityList[idx].Value == 'Yes') {
          this.MGOneFacilityList[j].IsHide = false;
        }
        else if (this.MGOneFacilityList[j].ParentID == ID && this.MGOneFacilityList[idx].Value != 'Yes') {
          this.MGOneFacilityList[j].IsHide = true;
          this.MGOneFacilityList[j].Value = '';
        }
      }
    }
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


}


