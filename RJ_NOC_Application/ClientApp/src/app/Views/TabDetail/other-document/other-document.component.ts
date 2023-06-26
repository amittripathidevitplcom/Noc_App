import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RequiredDocumentsDataModel, RequiredDocumentsDataModel_Documents } from '../../../Models/TabDetailDataModel';
import { DropdownValidators, createPasswordStrengthValidator, MustMatch } from '../../../Services/CustomValidators/custom-validators.service';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { CollegeDocumentService } from '../../../Services/Tabs/CollegeDocument/college-document.service';

@Component({
  selector: 'app-other-document',
  templateUrl: './other-document.component.html',
  styleUrls: ['./other-document.component.css']
})
export class OtherDocumentComponent implements OnInit {
  //public RequiredDocumentsDetailData: any = [];
  request = new RequiredDocumentsDataModel();
  isSubmitted: boolean = false;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  sSOLoginDataModel = new SSOLoginDataModel();
  public file: File = null;

  constructor(private loaderService: LoaderService, private toastr: ToastrService,
    private commonMasterService: CommonMasterService, private collegeDocumentService: CollegeDocumentService, private router: ActivatedRoute, private routers: Router, private formBuilder: FormBuilder,
    private fileUploadService: FileUploadService) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.request.DocumentDetails = [];
    this.GetRequiredDocuments('OtherDocument')
  }
  async GetRequiredDocuments(Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.collegeDocumentService.GetList(this.SelectedDepartmentID, this.SelectedCollageID, Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.DocumentDetails = data['Data'][0]['data'];
          console.log("rishi")
          console.log(this.request.DocumentDetails)
          console.log("kapoor")

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

  async onFilechange(event: any, item: RequiredDocumentsDataModel_Documents) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type === 'image/jpeg' ||
          this.file.type === 'application/pdf' ||
          this.file.type === 'image/jpg') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          if (this.file.size < 100000) {
            this.toastr.error('Select more then 100kb File')
            return
          }
        }
        else {// type validation
          this.toastr.error('Select Only jpg/jpeg/pdf file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.fileUploadService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              item.Dis_FileName = data['Data'][0]["Dis_FileName"];
              item.FileName = data['Data'][0]["FileName"];
              item.FilePath = data['Data'][0]["FilePath"];

              event.target.value = null;
            }
            if (this.State == 1) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == 2) {
              this.toastr.warning(this.ErrorMessage)
            }
          });


        //await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
        //  this.State = data['State'];
        //  this.SuccessMessage = data['SuccessMessage'];
        //  this.ErrorMessage = data['ErrorMessage'];
        //  if (this.State == 0) {

        //    item.FileName = data['Data'][0]["FileName"];
        //    item.FilePath = data['Data'][0]["FilePath"];
        //    event.Value = null;
        //  }
        //  if (this.State == 1) {
        //    this.toastr.error(this.ErrorMessage)
        //  }
        //  else if (this.State == 2) {
        //    this.toastr.warning(this.ErrorMessage)
        //  }
        //});
      }
      else {
        //this.ResetFileAndValidation(Type, '', '', false);
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async DeleteImage(item: RequiredDocumentsDataModel_Documents) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.fileUploadService.DeleteDocument(item.FilePath).then((data: any) => {
        this.State = data['State'];
        this.SuccessMessage = data['SuccessMessage'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          item.FileName = '';
          item.FilePath = '';
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
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
  public IsValid: boolean = true;
  async SaveData() {
    this.isSubmitted = true;
    this.IsValid = true;
    this.request.DocumentDetails.forEach(item => {
      if (item.IsMandatory == true && item.FileName == '') {
        this.IsValid = false;
      }
    });
    if (!this.IsValid) {
      return;
    }
    this.request.CollegeID = this.SelectedCollageID;
    this.request.DocumentType = 'OtherDocument';
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.collegeDocumentService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.isSubmitted = false;
        this.loaderService.requestEnded();
      }, 200);
    }


  }
}
