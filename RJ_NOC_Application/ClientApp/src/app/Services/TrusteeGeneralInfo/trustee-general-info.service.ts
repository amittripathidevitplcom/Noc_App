import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { GlobalConstants } from '../../Common/GlobalConstants';
import { TrusteeGeneralInfoDataModel } from '../../Models/TrusteeGeneralInfoDataModel';

@Injectable({
  providedIn: 'root'
})
export class TrusteeGeneralInfoService {
  readonly APIUrl = GlobalConstants.apiURL + "TrusteeGeneralInfoMaster";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }

  public async GetDataOfLegalEntity(ssoId: string) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetDataOfLegalEntity/" + ssoId, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDataList(legalEntityID: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetDataList/" + legalEntityID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetData(TrusteeGeneralInfoId: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetData/" + TrusteeGeneralInfoId, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDataListForPDF(TrusteeGeneralInfoId: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetDataListForPDF/" + TrusteeGeneralInfoId, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(TrusteeGeneralInfoDataModel: TrusteeGeneralInfoDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(TrusteeGeneralInfoDataModel);
    return await this.http.post(this.APIUrl + '/SaveData/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteData(TrusteeGeneralInfoId: number, modifiedBy: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/DeleteData/" + TrusteeGeneralInfoId + "/" + modifiedBy, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
