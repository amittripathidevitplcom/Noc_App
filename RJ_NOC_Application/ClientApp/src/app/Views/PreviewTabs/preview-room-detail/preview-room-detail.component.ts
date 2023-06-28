import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoomDetailsDataModel_RoomDetails } from '../../../Models/RoomDetailsDataModel';
import { RoomDetailsService } from '../../../Services/RoomDetails/room-details.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-preview-room-detail',
  templateUrl: './preview-room-detail.component.html',
  styleUrls: ['./preview-room-detail.component.css']
})
export class PreviewRoomDetailComponent implements OnInit {
  public RoomDetails: RoomDetailsDataModel_RoomDetails[] = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  constructor(private roomDetailsService: RoomDetailsService, private loaderService: LoaderService, private router: ActivatedRoute, private commonMasterService: CommonMasterService,
    private routers: Router) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SelectedDepartmentID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('DepartmentID')?.toString()));
    this.SelectedCollageID = Number(this.commonMasterService.Decrypt(this.router.snapshot.paramMap.get('CollegeID')?.toString()));
    await this.GetRoomDetailAllList();
  }
  async GetRoomDetailAllList() {
    try {
      this.loaderService.requestStarted();
      await this.roomDetailsService.GetRoomDetailAllList(0, this.SelectedCollageID)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.RoomDetails = data['Data'][0]['data'];
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
