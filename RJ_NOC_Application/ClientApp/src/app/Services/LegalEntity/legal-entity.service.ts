import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { GlobalConstants } from '../../Common/GlobalConstants';
import { LegalEntityDataModel } from '../../Models/LegalEntityDataModel';

@Injectable({
  providedIn: 'root'
})
export class LegalEntityService {
  readonly APIUrl = GlobalConstants.apiURL + "LegalEntity";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }

  public async SaveData(legalEntityDataModel: LegalEntityDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(legalEntityDataModel);
    console.log(body);
    return await this.http.post(this.APIUrl + '/SaveData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CheckDuplicateRegNo(LegalEntityID: number, RegistrationNo: string) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify({ LegalEntityID: LegalEntityID, RegistrationNo: RegistrationNo });
    console.log(body);
    return await this.http.post(this.APIUrl + '/CheckDuplicate', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetLegalEntityList(UserID: number, SSOID: string) {

    return await this.http.get(this.APIUrl + "/GetLegalEntityList/" + UserID + "/" + SSOID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async ViewlegalEntityDataByID(LegalEntityID: number, UserID: number, SSOID: string) {
    return await this.http.get(this.APIUrl + "/ViewlegalEntityDataByID/" + LegalEntityID + "/" + UserID + "/" + SSOID )
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetLegalEntityBySSOID(SSOID: string, UserID: number) {
    return await this.http.get(this.APIUrl + "/GetLegalEntityBySSOID/" + SSOID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CheckExistsLegalEntity(SSOID: string, RoleID: number) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify({ SSOID: SSOID, RoleID: RoleID });
    return await this.http.post(this.APIUrl + '/CheckExistsLegalEntity', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
