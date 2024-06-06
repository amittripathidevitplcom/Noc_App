import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { DefaulterCollegeRequestDataModel } from '../../../Models/DefaulterCollegeRequestDataModel';

@Component({
  selector: 'app-defaulter-college-request',
  templateUrl: './defaulter-college-request.component.html',
  styleUrls: ['./defaulter-college-request.component.css']
})
export class DefaulterCollegeRequestComponent {
  DefaulterCollegeForm!: FormGroup;
  public isSubmitted: boolean = false;

  request = new DefaulterCollegeRequestDataModel();
  constructor(private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private fileUploadService: FileUploadService) {
  }

  async ngOnInit() {
    this.DefaulterCollegeForm = this.formBuilder.group(
      {
        ddlEverAppliedNOC: ['', [DropdownValidators]],
        ddlIsPNOC: ['', [DropdownValidators]],
        txtLastApplicationNo: ['', Validators.required],
        txtLastApplicationSubmittedDate: ['', Validators.required],

      });
  }
  get form() { return this.DefaulterCollegeForm.controls; }
}
