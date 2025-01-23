import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MGoneNOCService } from '../../../../Services/MGoneNOC/mgone-noc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../../../Services/FileUpload/file-upload.service';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';

@Component({
  selector: 'app-noccheck-list-mgone',
  templateUrl: './noccheck-list-mgone.component.html',
  styleUrls: ['./noccheck-list-mgone.component.css']
})
export class NoccheckListMgoneComponent {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public SelectedApplyNOCID: number = 0;
  public ApplicationNo: string = '';

  public isShowFile: boolean = false;
  public Filedoc: string = '';
  public Filedoc_Dis_FileName: string = '';
  public FiledocPath: string = '';
  public FileValidationMessage: string = '';

  public file!: File;
  public isFormvalid: boolean = true;
  constructor(private toastr: ToastrService, private loaderService: LoaderService, private mgoneNOCService: MGoneNOCService, private router: ActivatedRoute, private routers: Router, private fileUploadService: FileUploadService, private commonMasterService: CommonMasterService
  ) { }

  async ngOnInit() {

    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    this.SelectedApplyNOCID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplyNOCID')?.toString()));
    this.ApplicationNo = this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoYear')?.toString()) + "/" + this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('ApplicationNoID')?.toString());

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }




  async onFilechange(event: any) {

    try {
      this.loaderService.requestStarted();
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'application/pdf') {
          //size validation

          if (this.file.size > 2000000) {
            this.ResetFileAndValidation('Select less then 2MB File', '', '', '', false);
            this.toastr.error('Select less then 2MB File')
            return
          }
          if (this.file.size < 100000) {
            this.ResetFileAndValidation('Select more then 100kb File', '', '', '', false);
            this.toastr.error('Select more then 100kb File')
            return
          }
        }
        else {
          this.toastr.warning('Select Only jpg/jpeg/pdf');
          // type validation
          this.ResetFileAndValidation('Select Only jpg/jpeg/pdf', '', '', '', false);
          return
        }

        // upload to server folder
        await this.fileUploadService.UploadDocument(this.file).then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.ResetFileAndValidation('', data['Data'][0]["FileName"], data['Data'][0]["FilePath"], data['Data'][0]["Dis_FileName"], true);
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
        this.ResetFileAndValidation('', '', '', '', false);
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
            this.ResetFileAndValidation('', '', '', '', false);
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
  public files: any = '';
  ResetFileAndValidation(msg: string, name: string, path: string, dis_Name: string, isShowFile: boolean) {
      this.isShowFile = isShowFile;
      this.FileValidationMessage = msg;
      this.Filedoc = name;
      this.FiledocPath = path;
      this.Filedoc_Dis_FileName = dis_Name;
      this.files = document.getElementById('fFiledoc');
    this.files.value = '';
  }

  async SaveInspectionReport() {
    this.isFormvalid = true;
    try {
      if (this.Filedoc == '') {
        this.FileValidationMessage = 'This field is required .!';
        this.isFormvalid = false;
      }

      if (!this.isFormvalid) {
        return;
      }
      this.loaderService.requestStarted();
      await this.mgoneNOCService.SaveInspectionReport(this.SelectedDepartmentID, this.SelectedCollageID, this.SelectedApplyNOCID, this.sSOLoginDataModel.UserID, this.Filedoc)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            this.toastr.success(this.SuccessMessage);


            this.routers.navigate(['/mgonedocumentScrutinyNodalOfficer' + "/" + encodeURI(this.commonMasterService.Encrypt(this.SelectedDepartmentID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(this.SelectedCollageID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(this.SelectedApplyNOCID.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt(this.ApplicationNo.toString())) + "/" + encodeURI(this.commonMasterService.Encrypt('Pending'))]);
          }
          else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
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
}
