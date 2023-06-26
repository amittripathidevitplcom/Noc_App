import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { WorkFlowMasterDataModel } from '../../../Models/WorkFlowMasterDataModel';
import { GlobalConstants } from '../../../Common/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class WorkFlowMasterService {
  readonly APIUrl = GlobalConstants.apiURL + "WorkFlowMaster";
  constructor(private http: HttpClient) {

  }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }
  public async SaveData(request: WorkFlowMasterDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetWorkFlowMasterList(WorkFlowMasterID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetWorkFlowMasterList/' + WorkFlowMasterID , httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}

