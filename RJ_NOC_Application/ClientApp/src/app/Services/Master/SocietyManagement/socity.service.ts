import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';;
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { SocietyDataModel } from '../../../Models/SocietyDataModel';

@Injectable({
  providedIn: 'root'
})
export class SocityService {
  readonly APIUrl = GlobalConstants.apiURL + "SocietyMaster";
  
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }

  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

 
  public async SaveData(request: SocietyDataModel, files: File) {
    
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetSocietyAllList(UserID: number) {

    return await this.http.get(this.APIUrl + "/GetSocietyAllList/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetSocietyByID(SocietyID: number, UserID: number) {
    return await this.http.get(this.APIUrl + "/GetSocietyByID/" + SocietyID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(SocietyID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/Delete/' + SocietyID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
