import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { StaffReportDataModel } from '../../../Models/StaffReportDataModel';
import { GlobalConstants } from '../../../Common/GlobalConstants';


@Injectable({
  providedIn: 'root'
})
export class StaffReportsService {
  readonly APIUrl = GlobalConstants.apiURL + "DCEStaffReports";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  

  public async GetSubjectList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetSubjectList/")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

    

  public async GetStaffStatusList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetStaffStatusList/")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetStaffPFStatusList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetStaffPFStatusList/")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStaffDuplicateAdharList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetStaffDuplicateAdharList/")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStaffResearchGuideList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetStaffResearchGuideList/")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }





  public async DCEStaffDetailsList(request: StaffReportDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/DCEStaffDetailsList", body, { 'headers': headers })

      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



}
