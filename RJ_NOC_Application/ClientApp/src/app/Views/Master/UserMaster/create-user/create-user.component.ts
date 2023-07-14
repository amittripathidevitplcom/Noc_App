import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonMasterService } from '../../../../Services/CommonMaster/common-master.service';
import { CreateUserService } from '../../../../Services/Master/CreateUserMaster/create-user.service';
import { UserMasterDataModel } from '../../../../Models/UserMasterDataModel';

import { Clipboard } from '@angular/cdk/clipboard';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { style } from '@angular/animations';
import { debug } from 'console';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  CreatUserMasterForm!: FormGroup;
  //public SelectedDepartmentID: number = 0;

  public MobileNoRegex = new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/)

  public isValid: boolean = true;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DepartmentList: any = [];
  public DesignationList: any = [];
  public RoleList: any = [];
  public CommitteeList: any = [];
  public DistrictList: any = [];
  public TehsilList: any = [];
  public UsersDataList: any = [];

  public IsDistrict: boolean = true;
  public IsTehsil: boolean = true;

  searchText: string = '';

  public isDisabledGrid: boolean = false;
  public isLoadingExport: boolean = false;



  request = new UserMasterDataModel();

  constructor(private clipboard: Clipboard, private createUserService: CreateUserService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.SelectedDepartmentID = await Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));

    this.request.StateID = 6;

    this.CreatUserMasterForm = this.formBuilder.group(
      {
        txtSSOID: ['', Validators.required],
        txtMobileNumber: ['', [Validators.required, Validators.pattern(this.MobileNoRegex)]],
        txtEmailAddress: ['', [Validators.required, Validators.email]],
        txtName: ['', Validators.required],
        ddlDepartmentID: ['', [DropdownValidators]],
        ddlRoleID: ['', [DropdownValidators]],
        ddlCommitteeID: [''],
        rbMemberType: ['', Validators.required],
        ddlDistrictID: [''],
        ddlTehsilID: [''],
        chkActiveStatus: [''],
      })
    // department
    await this.GetDepartmentList();
    //Role
    await this.GetRoleList();
    //Committee
    await this.GetCommitteeList();
    //UsersList
    await this.GetUsersList();
    //GetDistrict
    await this.GetDistrictList(this.request.StateID);
  }
  get form() { return this.CreatUserMasterForm.controls; }


  async GetDepartmentList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDepartmentList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DepartmentList = data['Data'];
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

  async GetRoleList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoleList = data['Data'];
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
  async GetCommitteeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommitteeList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CommitteeList = data['Data'];
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
  async GetUsersList() {
    try {
      this.loaderService.requestStarted();
      await this.createUserService.GetUserList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.UsersDataList = data['Data'][0]['data'];
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

  async GetDistrictList(StateID: number) {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.Load_StateWise_DistrictMaster(StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DistrictList = data['Data'];
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

  async FillTehsilByDistrictId(SelectedDistrictID: string) {
    try {
      this.loaderService.requestStarted();
      const districtId = Number(SelectedDistrictID);
      if (districtId <= 0) {
        return;
      }

      // Tehsil list
      await this.commonMasterService.GetTehsilByDistrictId(districtId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TehsilList = data['Data'];
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

  async MemberTypeSelection(MemberType: string) {
    debugger;
    this.request.StateID = 6;
    if (MemberType == 'State') {
      this.IsDistrict = false;
      this.IsTehsil = false;
    }
    if (MemberType == 'District') {
      this.IsDistrict = true;
      this.IsTehsil = false;
    }
    if (MemberType == 'Tehsil') {
      this.IsDistrict = true;
      this.IsTehsil = true;
    }
    await this.FillTehsilByDistrictId((this.request.DistrictID).toString())
  }


  async SaveData() {

    this.isSubmitted = true;
    if (this.CreatUserMasterForm.invalid) {
      return
    }
    if (this.request.MemberType == 'State') {
      this.request.DistrictID = 0;
      this.request.TehsilID = 0;
    }
    if (this.request.MemberType == 'District') {
      this.request.TehsilID = 0;
      if (this.request.DistrictID == 0) {
        return;
      }
    }
    else if (this.request.MemberType == 'Tehsil') {
      if (this.request.DistrictID == 0 || this.request.TehsilID == 0) {
        return;
      }
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.createUserService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.ResetControl();
            this.GetDepartmentList();
            this.GetUsersList();
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

  async Edit_OnClick(UId: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.createUserService.GetUserByIDWise(UId)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];

          this.request.UId = data['Data'][0]['UId'];
          this.request.SSOID = data['Data'][0]['SSOID'];
          this.request.Name = data['Data'][0]['Name'];
          this.request.MobileNumber = data['Data'][0]['MobileNumber'];
          this.request.EmailAddress = data['Data'][0]['EmailAddress'];
          this.request.DepartmentID = data['Data'][0]['DepartmentID'];

          this.request.RoleID = data['Data'][0]['RoleID'];
          this.request.CommitteeID = data['Data'][0]['CommitteeID'];
          this.request.MemberType = data['Data'][0]['MemberType'];
          this.request.StateID = data['Data'][0]['StateID'];
          this.request.DistrictID = data['Data'][0]['DistrictID'];
          this.MemberTypeSelection(this.request.MemberType);
          this.request.TehsilID = data['Data'][0]['TehsilID'];
          this.request.ActiveStatus = data['Data'][0]['ActiveStatus'];


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

  async DelUsersData(UId: number) {

    this.isSubmitted = false;
    try {
      if (confirm("Are you sure you want to delete this ?")) {
        this.loaderService.requestStarted();
        await this.createUserService.DeleteData(UId)
          .then((data: any) => {
            this.State = data['State'];
            this.SuccessMessage = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == 0) {
              this.toastr.success(this.SuccessMessage)
              this.GetUsersList();
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
    }
    catch (ex) { }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async ResetControl() {
    const txtSSOID = document.getElementById('txtSSOID')
    if (txtSSOID) txtSSOID.focus();
    this.isSubmitted = false;
    this.request.UId = 0;
    this.request.SSOID = '';
    this.request.MobileNumber = '';
    this.request.EmailAddress = '';
    this.request.Name = '';
    this.request.DepartmentID = 0;
    this.request.RoleID = 0;
    this.request.CommitteeID = 0;
    this.request.StateID = 0;
    this.request.MemberType = '';
    this.request.DistrictID = 0;
    this.request.TehsilID = 0;
    this.request.ActiveStatus = true;
    this.isDisabledGrid = false;

    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }

  btnCopyTable_Click() {
    const tabellist = document.getElementById('tabellist')
    if (tabellist) {

      this.clipboard.copy(tabellist.innerText);
    }
  }

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.UsersDataList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][11] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "CreateUser.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }

  }


  @ViewChild('content') content: ElementRef | any;
  btnSavePDF_Click(): void {

    this.loaderService.requestStarted();
    if (this.UsersDataList.length > 0) {
      try {


        let doc = new jsPDF('p', 'mm', [432, 279])
        let pDFData: any = [];
        for (var i = 0; i < this.UsersDataList.length; i++) {
          pDFData.push({
            "S.No.": i + 1,
            "SSOID": this.UsersDataList[i]['SSOID'],
            "MobileNumber": this.UsersDataList[i]['MobileNumber'],
            "EmailAddress": this.UsersDataList[i]['EmailAddress'],
            "Name": this.UsersDataList[i]['Name'],
            "DesignationName": this.UsersDataList[i]['DesignationName'],
            "DepartmentName": this.UsersDataList[i]['DepartmentName_English'],
            "RoleName": this.UsersDataList[i]['RoleName'],
            "CommitteeName": this.UsersDataList[i]['CommitteeName'],
            "MemberType": this.UsersDataList[i]['MemberType'],
            "Status": this.UsersDataList[i]['ActiveDeactive']
          })
        }

        let values: any;
        let privados = ['S.No.', "SSOID", "MobileNumber", "EmailAddress", "Name", "DesignationName", "DepartmentName", "RoleName", "CommitteeName", "MemberType", "Status"];
        let header = Object.keys(pDFData[0]).filter(key => privados.includes(key));
        values = pDFData.map((elemento: any) => Object.values(elemento));

        doc.setFontSize(16);
        doc.text("Create User Master", 100, 10, { align: 'center', maxWidth: 100 });

        autoTable(doc,
          {
            head: [header],
            body: values,
            styles: { fontSize: 8 },
            headStyles: {
              fillColor: '#3f51b5',
              textColor: '#fff',
              halign: 'center'
            },
            bodyStyles: {
              halign: 'center'
            },
            margin: {
              left: 5,
              right: 5,
              top: 15
            },
            tableLineWidth: 0,

          }
        )

        doc.save("CreateUser" + '.pdf');

      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }

  }


  MaxLengthValidation_KeyPress(event: any, length: number): boolean {
    if (event.target.value.length == length) {
      return false;
    }
    return true;
  }
}
