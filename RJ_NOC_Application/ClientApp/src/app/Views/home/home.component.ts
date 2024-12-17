import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../Services/FileUpload/file-upload.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { UserManualDocumentService } from '../../Services/UserManualDocument/user-manual-document.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  public UserManualDocumentlList: any = [];
  public DCE_HomePage_IncreaseDateData_Top: any = [];
  public DCE_HomePage_IncreaseDateData_Bottom: any = [];
  constructor(private usermanualDocumentService: UserManualDocumentService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService, private clipboard: Clipboard) {
  }

  async ngOnInit() {
    await this.GetUserManualDocumentMasterList(0);
  }
  async HomePage_IncreaseDate(DepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.HomePage_IncreaseDate(DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.DCE_HomePage_IncreaseDateData_Top = data['Data'][0].filter((x: any) => x.DepartmentID === DepartmentID && x.Type=='Top');
          this.DCE_HomePage_IncreaseDateData_Bottom = data['Data'][0].filter((x: any) => x.DepartmentID === DepartmentID && x.Type == 'Bottom');
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
  async GetUserManualDocumentMasterList(DepartmentID: number) {

    try {
      this.loaderService.requestStarted();
      await this.HomePage_IncreaseDate(DepartmentID);
      await this.usermanualDocumentService.GetUserManualDocumentMasterList(DepartmentID, 'U')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserManualDocumentlList = data['Data'][0]['data'];
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
}
