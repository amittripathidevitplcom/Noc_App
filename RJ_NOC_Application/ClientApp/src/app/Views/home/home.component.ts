import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CommonMasterService } from '../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../Services/FileUpload/file-upload.service';
import * as XLSX from 'xlsx';
import { Clipboard } from '@angular/cdk/clipboard';
import { async } from 'rxjs';
import { UserManualDocumentMasterModel } from '../../Models/UserManualDocumentMasterModel';
import { UserManualDocumentService } from '../../Services/UserManualDocument/user-manual-document.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  public UserManualDocumentlList: any = [];
  constructor(private usermanualDocumentService: UserManualDocumentService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder, private fileUploadService: FileUploadService, private clipboard: Clipboard) {
  }

  async ngOnInit() {
     this.GetUserManualDocumentMasterList(0);
  }
  async GetUserManualDocumentMasterList(DepartmentID:number) {

    try {
      this.loaderService.requestStarted();
      await this.usermanualDocumentService.GetUserManualDocumentMasterList(DepartmentID,'U')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserManualDocumentlList= data['Data'][0]['data'];
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
