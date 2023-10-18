import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CommitteeMasterDataModel } from '../../../Models/CommitteeMasterDataModel';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { PostApplicationCommitteeMemberdataModel } from '../../../Models/ApplicationCommitteeMemberdataModel';

@Injectable({
  providedIn: 'root'
})
export class CommitteeMasterService {
  readonly APIUrl = GlobalConstants.apiURL + "CommitteeMaster";
  constructor(private http: HttpClient) {

  }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }
  public async SaveData(request: CommitteeMasterDataModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCommitteeMasterList(CommitteeMasterID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetCommitteeMasterList/' + CommitteeMasterID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteCommitteeData(CommitteeMasterID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/DeleteCommitteeData/' + CommitteeMasterID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveApplicationCommitteeData(request: PostApplicationCommitteeMemberdataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveApplicationCommitteeData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveApplicationCommitteeData_AH(request: PostApplicationCommitteeMemberdataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveApplicationCommitteeData_AH', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveApplicationCommitteeData_Agri(request: PostApplicationCommitteeMemberdataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveApplicationCommitteeData_Agri', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationCommitteeList(ApplyNocApplicationID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetApplicationCommitteeList/' + ApplyNocApplicationID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationCommitteeList_AH(ApplyNocApplicationID: number, ActionType: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetApplicationCommitteeList_AH/' + ApplyNocApplicationID + "/" + ActionType, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetApplicationNodelOfficer(ApplyNocApplicationID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetApplicationNodelOfficer/' + ApplyNocApplicationID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}

