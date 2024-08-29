import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { NOCFormatMasterModel } from '../../../Models/NOCFormatMasterModel';
import ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';

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

  public editor: any = ClassicEditor;
  public NOCFormatList: any = [];
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  config = {
    toolbar: [
      'heading',
      '|',
      'alignment',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      'subscript',
      'superscript',
      '|',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      '-', // break point
      'fontfamily',
      'fontsize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'code',
      'codeBlock',
      '|',
      'insertTable',
      '|',
      'imageInsert',
      'blockQuote',
      '|',
      'undo',
      'redo',
    ],
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
      ],
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        // 'Popins'
      ],
    },
  };


  constructor(private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router) {

  }
  onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }
  async ngOnInit() {
    await this.GetDepartmentList();
    await this.GetNOCFormatList(0);
  }
  async GetNOCFormatList(NOCFormatID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetNOCFormatList(NOCFormatID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.NOCFormatList = data['Data'][0];
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
          this.ResetControl();
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
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Submit";
    const btnReset = document.getElementById('btnReset')
    if (btnReset) btnReset.innerHTML = "Reset";
    this.isDisabledGrid = false;
    this.ParameterData = [];
    this.GetNOCFormatList(0);
  }

  async Edit_OnClick(NOCFormatID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetNOCFormatList(NOCFormatID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.NOCFormatID = data['Data'][0][0]["NOCFormatID"];
          this.request.DepartmentID = data['Data'][0][0]["DepartmentID"];
          await this.GetParameterList(data['Data'][0][0]["DepartmentID"]);
          this.request.ParameterID = data['Data'][0][0]["ParameterID"];
          this.request.NOCFormat = data['Data'][0][0]["NOCFormat"];

          this.isDisabledGrid = true;
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }
}
