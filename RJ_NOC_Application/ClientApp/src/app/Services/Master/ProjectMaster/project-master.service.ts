import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CandidateInfoDataModel, ProjectMasterDataModel, ProjectMasterDataModel_PIDetails, ProjectMaster_DocumentScrutiny_ApprovedReject } from '../../../Models/ProjectMasterDataModel';

import { GlobalConstants } from '../../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class ProjectMasterService {

  readonly APIUrl = GlobalConstants.apiURL + "ProjectMaster";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }
  //Get 
  public async GetList(UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(ProjectID: number, UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/" + ProjectID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveData(request: ProjectMasterDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(ProjectID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return await this.http.post(this.APIUrl + '/Delete/' + ProjectID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();

  }
  public async GetProjectCandidateInfo(ProjectID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetProjectCandidateInfo/' + ProjectID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();

  }

  public async SaveProjectCandidateInfo(request: CandidateInfoDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    console.log(this.APIUrl + '/SaveProjectCandidateInfo', body);
    return await this.http.post(this.APIUrl +'/SaveProjectCandidateInfo', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDocumentScrutiny_ProjectCandidateInfo(ProjectID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetDocumentScrutiny_ProjectCandidateInfo/' + ProjectID+"/Type", httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();

  }


  public async DocumentScrutiny_ApprovedReject(request: ProjectMaster_DocumentScrutiny_ApprovedReject) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/DocumentScrutiny_ApprovedReject', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async Save_ProjectIPDetails(request: ProjectMasterDataModel_PIDetails) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    console.log(this.APIUrl + '/SaveProjectCandidateInfo', body);
    return await this.http.post(this.APIUrl + '/Save_ProjectIPDetails', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetProjectIPDetails(ProjectID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetProjectIPDetails/' + ProjectID , httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
