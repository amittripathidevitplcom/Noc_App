import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { catchError, throwError } from 'rxjs';
import { ClinicalFacilityModel } from '../../Models/ClinicalFacilityModel';

@Injectable({
  providedIn: 'root'
})
export class ClinicalFacilityService {

  readonly APIUrl = GlobalConstants.apiURL + "ClinicalFacility";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async GetAllClinicalFacilityList(UserID: number, CollegeId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetAllClinicalFacilityList/" + UserID + "/" + CollegeId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveData(clinicalFacility: ClinicalFacilityModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(clinicalFacility);
    return await this.http.post(this.APIUrl + "/SaveData/", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCollegeClinicalFacilityList(UserID: number, CollegeId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetCollegeClinicalFacilityList/" + UserID + "/" + CollegeId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
