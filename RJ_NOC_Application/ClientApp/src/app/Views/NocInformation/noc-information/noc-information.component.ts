import { Component, OnInit, Input, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonMasterService } from '../../../Services/CommonMaster/common-master.service';
import { NocInformationService } from '../../../Services/NocInformation/noc-information.service';


@Component({
  selector: 'app-noc-information',
  templateUrl: './noc-information.component.html',
  styleUrls: ['./noc-information.component.css']
})
export class NocInformationComponent implements OnInit {

  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  /*Save Data Model*/

  public SearchRecordID: any = '';
  public NocInformationData: any = {};


  constructor(private toastr: ToastrService, private loaderService: LoaderService, private commonMasterService: CommonMasterService, private router: ActivatedRoute, private routers: Router, private nocInformationService: NocInformationService) {
  }

  async ngOnInit() {
    this.SearchRecordID = this.router.snapshot.paramMap.get('SearchRecordID')?.toString();
    await this.GetNocInformation();
  }

  async GetNocInformation() {
    try {
      this.loaderService.requestStarted();
      await this.nocInformationService.GetNocInformation(this.SearchRecordID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.NocInformationData = data['Data'];
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
