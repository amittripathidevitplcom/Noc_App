import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { DentalChairsMGOneNOCModel } from '../../Models/DentalChairsMGOneNOC';

@Injectable({
  providedIn: 'root'
})
export class DentalChairsMGOneNOCService {

  readonly APIUrl = GlobalConstants.apiURL + "DentalChairMGOneNOC";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async SaveDentalChairs(request: DentalChairsMGOneNOCModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveDentalChairs/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDentalChairs(ApplyNOCID: number, CollegeId:number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetDentalChairs/" + ApplyNOCID + "/" + CollegeId, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
