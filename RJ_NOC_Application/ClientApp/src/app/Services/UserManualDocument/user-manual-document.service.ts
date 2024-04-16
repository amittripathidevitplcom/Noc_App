import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { UserManualDocumentMasterModel } from '../../Models/UserManualDocumentMasterModel';
@Injectable({
  providedIn: 'root'
})
export class UserManualDocumentService {
  readonly APIUrl = GlobalConstants.apiURL + "UserManualDocumentMaster";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async SaveData(request: UserManualDocumentMasterModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetUserManualDocumentMasterList(DepartmentID: number, Type: string) {
    return await this.http.get(this.APIUrl + "/GetUserManualDocumentMasterList/" + DepartmentID + "/" + Type)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(ID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/Delete/' + ID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetUserManualDocumentMasterIDWise(ID: number) {
    debugger;
    return await this.http.get(this.APIUrl + "/" + ID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
