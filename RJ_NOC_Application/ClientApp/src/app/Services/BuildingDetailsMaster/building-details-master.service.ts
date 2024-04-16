import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders} from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { BuildingDetailsDataModel } from '../../Models/TabDetailDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class BuildingDetailsMasterService {
  readonly APIUrl = GlobalConstants.apiURL + "BuildingDetailsMasterService";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  //Get 
  public async SaveData(buildingdetails: BuildingDetailsDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(buildingdetails);
    return await this.http.post(this.APIUrl, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(SchoolBuildingDetailsID: number, UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetBuildingDetailsIDWise/" + SchoolBuildingDetailsID + "/" + UserID )
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(SchoolBuildingDetailsID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/Delete/' + SchoolBuildingDetailsID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async StatusUpdate(SchoolBuildingDetailsID: number, ActiveStatus: boolean, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/StatusUpdate/' + SchoolBuildingDetailsID + "/" + ActiveStatus + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllBuildingDetailsList(UserID: number, CollegeID: number, ApplyNOCID: number=0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetAllBuildingDetailsList/" + UserID + "/" + CollegeID + "/" + ApplyNOCID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}

