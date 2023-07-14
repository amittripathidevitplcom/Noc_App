import { Component, OnInit, Input, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommitteeMasterDataModel, CommitteeMemberDetail } from '../../../../Models/CommitteeMasterDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service'
import { CommitteeMasterService } from '../../../../Services/Master/CommitteeMaster/committee-master.service';

@Component({
  selector: 'app-committee-master',
  templateUrl: './committee-master.component.html',
  styleUrls: ['./committee-master.component.css']
})
export class CommitteeMasterComponent implements OnInit {
  CommitteeMasterForm!: FormGroup;
  CommitteeMemberDetails!: FormGroup;

  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isSubmitted_MemberDetails: boolean = false;
  /*Save Data Model*/
  request = new CommitteeMasterDataModel();
  request_CommitteeMemberDataModel = new CommitteeMemberDetail();
  public CommitteeMasterID: any = 0;

  constructor(private committeeMasterService: CommitteeMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {
  }

  async ngOnInit() {
    this.CommitteeMasterForm = this.formBuilder.group(
      {
        ddlCommitteeType: ['0'],
        txtCommitteeName: ['', Validators.required],
        txtContactNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
      })
    this.CommitteeMemberDetails = this.formBuilder.group(
      {
        txtCMNameOfPerson: ['', Validators.required],
        txtCMMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
      })

    if (this.router.snapshot.paramMap.get('id') != null) {
      this.CommitteeMasterID = this.router.snapshot.paramMap.get('id');
      this.GetCommitteeMasterList(this.CommitteeMasterID);
    }
    this.request.CommitteeMemberDetailList = [];
  }

  get form() { return this.CommitteeMasterForm.controls; }
  get form_CommitteeMember() { return this.CommitteeMemberDetails.controls; }

  async SaveData() {
    debugger;
    this.isSubmitted = true;

    let isValid = true;
    if (this.CommitteeMasterForm.invalid) {
      isValid = false;
      return;
    }
    if (this.request.CommitteeMemberDetailList.length == 0) {
      this.toastr.error("Please add Member Details");
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.committeeMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            setTimeout(() => {
              this.routers.navigate(['/committeemasterlist']);
            }, 500);

          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }
  AddMemberDetail() {
    this.isSubmitted_MemberDetails = true;
    if (this.CommitteeMemberDetails.invalid) {
      return
    }
    this.request.CommitteeMemberDetailList.push({
      CommitteeMemberDetailID: 0,
      NameOfPerson: this.request_CommitteeMemberDataModel.NameOfPerson,
      MobileNumber: this.request_CommitteeMemberDataModel.MobileNumber,
      ActiveStatus: true,
      DeleteStatus: false,
    });
    // reset
    this.request_CommitteeMemberDataModel.NameOfPerson = '';
    this.request_CommitteeMemberDataModel.MobileNumber = '';

    this.isSubmitted_MemberDetails = false;
  }
  DelMemberDetail(item: CommitteeMemberDetail) {
    const index: number = this.request.CommitteeMemberDetailList.indexOf(item);
    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();

        if (this.request.CommitteeMemberDetailList[index].CommitteeMemberDetailID > 0) {
          this.request.CommitteeMemberDetailList[index].DeleteStatus = true;
          this.request.CommitteeMemberDetailList[index].ActiveStatus = false;
        }
        else {
          this.request.CommitteeMemberDetailList.splice(index, 1)
        }
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }
  async GetCommitteeMasterList(CommitteeMasterID: number) {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.committeeMasterService.GetCommitteeMasterList(CommitteeMasterID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data['Data'].length <= 0) {
            this.toastr.error("No Record found.!!");
            return;
          }
          this.request = data['Data'][0];
          this.request.CommitteeType = data[''][0]["CommitteeType"];
          this.request.CommitteeName = data['Data'][0]["CommitteeName"];
          this.request.ContactNumber = data['Data'][0]["ContactNumber"];
          console.log(this.request);
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
  ResetControl() {
    //this.routers.navigate(['/committeemasterlist']);
    const ddlCommitteeType = document.getElementById('ddlCommitteeType')
    if (ddlCommitteeType) ddlCommitteeType.focus();
    this.request = new CommitteeMasterDataModel();
    this.request.CommitteeMemberDetailList = [];
  }

  MaxLengthValidation_KeyPress(event: any, length: number): boolean {
    if (event.target.value.length == length) {
      return false;
    }
    return true;
  }

}
