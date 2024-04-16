import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class ParamedicalHospitalService {
  readonly APIUrl = GlobalConstants.apiURL + "ParamedicalHospital";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async GetHospitalAreaValidation() {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetHospitalAreaValidation", { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDataList(courseId: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetDataList/" + courseId, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetData(hospitalId: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetData/" + hospitalId, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async IsSuperSpecialtyHospital(collegeId: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/IsSuperSpecialtyHospital/" + collegeId, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveData(request: any) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(hospitalId: number, modifiedBy: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/DeleteData/" + hospitalId + "/" + modifiedBy, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetParamedicalHospitalBedValidation(CollegeID: number, HospitalID: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetParamedicalHospitalBedValidation/" + CollegeID + "/" + HospitalID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
