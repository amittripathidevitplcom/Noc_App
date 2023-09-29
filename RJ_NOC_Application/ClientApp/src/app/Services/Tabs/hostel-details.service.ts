import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HostelDataModel } from '../../Models/HostelDetailsDataModel';

@Injectable({
  providedIn: 'root'
})
export class HostelDetailService {
  readonly APIUrl = GlobalConstants.apiURL + "HostelDetail";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }

  public async SaveData(HostelDataModel: HostelDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(HostelDataModel);
    console.log(body);
    return await this.http.post(this.APIUrl + '/SaveData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetHostelDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, HostelDetailID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetHostelDetailList_DepartmentCollegeWise/' + DepartmentID + "/" + CollegeID + "/" + HostelDetailID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteHostelDetail(HostelDetailID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/DeleteHostelDetail/' + HostelDetailID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetHostelPdfDetails(DepartmentID: number, CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetHostelPdfDetails/" + DepartmentID + "/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
