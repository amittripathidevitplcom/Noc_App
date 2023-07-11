import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LandDetailDataModel } from '../../Models/LandDetailDataModel';

import { GlobalConstants } from '../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class MedicalDocumentScrutinyService {

  readonly APIUrl = GlobalConstants.apiURL + "MedicalDocumentScrutiny";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }
  //Get 
  public async DocumentScrutiny_LandDetails(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_LandDetails/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get 
  public async GetDocumentScrutinyReportByRole(RoleId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetDocumentScrutinyReportCompleted/" + RoleId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
