import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { NOCFormatMasterModel } from '../../../Models/NOCFormatMasterModel';
import { Validators, Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-nocformat-master',
  templateUrl: './nocformat-master.component.html',
  styleUrls: ['./nocformat-master.component.css']
})
export class NOCFormatMasterComponent implements OnInit {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/
  request = new NOCFormatMasterModel()
  isSubmitted: boolean = false;
  public DepartmentData: any = [];
  public ParameterData: any = [];

  public editor!: Editor;
  public toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router) {

  }
  ngOnInit(): void {
    this.editor = new Editor();
    this.GetDepartmentList();
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentData = data['Data'];
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
  async GetParameterList(DepartmentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetApplyNOCParameterbyDepartment(DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ParameterData = data['Data'][0]['data'];
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

  async SaveData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SaveNOCFormatMaster(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.toastr.success(this.SuccessMessage);
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  ResetControl() {
    this.request = new NOCFormatMasterModel();
  }
}
