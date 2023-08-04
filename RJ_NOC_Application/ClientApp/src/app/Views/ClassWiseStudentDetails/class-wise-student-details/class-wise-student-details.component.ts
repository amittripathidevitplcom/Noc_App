import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ClassWiseStudentDetailsServiceService } from '../../../Services/ClassWiseStudentDetails/class-wise-student-details-service.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PostClassWiseStudentDetailsDataModel } from '../../../Models/ClassWiseStudentDetailsDataModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-class-wise-student-details',
  templateUrl: './class-wise-student-details.component.html',
  styleUrls: ['./class-wise-student-details.component.css']
})
export class ClassWiseStudentDetailsComponent implements OnInit {


  public ClassWiseStudentDetailsList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public SelectedCollageID: number = 0;
  public SelectedDepartmentID: number = 0;
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  request =new PostClassWiseStudentDetailsDataModel();

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined

  constructor(private loaderService: LoaderService, private formBuilder: FormBuilder, private classWiseStudentDetailsServiceService: ClassWiseStudentDetailsServiceService, private toastr: ToastrService) { }

  async ngOnInit()
  {
    this.GetCollegeWiseStudenetDetails()
  }

  async GetCollegeWiseStudenetDetails() {
    try {

      this.loaderService.requestStarted();
      await this.classWiseStudentDetailsServiceService.GetCollegeWiseStudenetDetails(1)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ClassWiseStudentDetailsList = data['Data'];
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

  async SaveData()
  {
    this.loaderService.requestStarted();
    this.isLoading = true;

    this.request.CollegeID = 1;
    this.request.UserID = 1;
    this.request.ClassWiseStudentDetails = this.ClassWiseStudentDetailsList;
    try {
      await this.classWiseStudentDetailsServiceService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.SuccessMessage = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
         
          console.log(this.State);
          if (!this.State) {
            this.toastr.success(this.SuccessMessage)
            this.GetCollegeWiseStudenetDetails();
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
  //validattions
  numberOnly(event: any): boolean
  {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
