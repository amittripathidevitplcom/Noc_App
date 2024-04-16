import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { PostClassWiseStudentDetailsDataModel } from '../../Models/ClassWiseStudentDetailsDataModel';
import { CollegeList_StatisticsFinalSubmitedDataModel_Filter, PostSubjectWiseStatisticsDetailsDataModel, StatisticsFinalSubmitDataModel, TotalNotFilledStatics_DataModel_Filter } from '../../Models/SubjectWiseStatisticsDetailsDataModel';
@Injectable({
  providedIn: 'root'
})
export class ClassWiseStudentDetailsServiceService {
  readonly APIUrl = GlobalConstants.apiURL + "ClassWiseStudentDetails";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async GetCollegeWiseStudenetDetails(CollegeID: number, ApplyNOCID: number = 0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetCollegeWiseStudenetDetails/" + CollegeID + "/" + ApplyNOCID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetSubjectWiseStudenetDetails(CollegeID: number, ApplyNOCID: number = 0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetSubjectWiseStudenetDetails/" + CollegeID + "/" + ApplyNOCID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveData(request: PostClassWiseStudentDetailsDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveDataSubjectWise(request: PostSubjectWiseStatisticsDetailsDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveDataSubjectWise", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async StatisticsFinalSubmit_Save(request: StatisticsFinalSubmitDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/StatisticsFinalSubmit_Save", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CollegeList_StatisticsFinalSubmited(request: CollegeList_StatisticsFinalSubmitedDataModel_Filter) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/CollegeList_StatisticsFinalSubmited", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CollegeList_StatisticsDraftSubmited(request: CollegeList_StatisticsFinalSubmitedDataModel_Filter) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/CollegeList_StatisticsDraftSubmited", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CollegeList_StatisticsNotFilledReport(request: TotalNotFilledStatics_DataModel_Filter) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/CollegeList_StatisticsNotFilledReport", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCollegeStatisticsFinalSubmitStatus(CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetCollegeStatisticsFinalSubmitStatus/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}

