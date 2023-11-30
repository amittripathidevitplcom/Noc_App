import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LandDetailDataModel } from '../../Models/LandDetailDataModel';

import { GlobalConstants } from '../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class MGOneDocumentScrutinyService {

  readonly APIUrl = GlobalConstants.apiURL + "MGOneDocumentScrutiny";
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
  public async DocumentScrutiny_CollegeDocument(DepartmentID: number, CollageID: number, RoleID: number, ApplyNOCID: number, Type: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_CollegeDocument/" + DepartmentID + "/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + Type, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DocumentScrutiny_HospitalDetail(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_HospitalDetail/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_CollegeManagementSociety(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_CollegeManagementSociety/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DocumentScrutiny_LegalEntity(CollegeID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_LegalEntity/" + CollegeID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_CollegeDetail(CollegeID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_CollegeDetail/" + CollegeID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DocumentScrutiny_BuildingDetails(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_BuildingDetails/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get 

  public async CheckDocumentScrutinyTabsData(ApplyNOCID: number, RoleID: number, CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/CheckDocumentScrutinyTabsData/" + ApplyNOCID + "/" + RoleID + "/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Nodal Officer Applicaiton List 
  public async GetLOIApplicationList(RoleId: number, UserID: number, Status: string, ActionName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetLOIApplicationList/" + RoleId + "/" + UserID + "/" + Status + "/" + ActionName)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GeneratePDF_MedicalGroupLOI(LOIID: number, UserID: number, LOIRemark: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var request = { LOIID: LOIID, UserID: UserID, Remark: LOIRemark }
    return await this.http.post(this.APIUrl + "/GeneratePDF_MedicalGroupLOIC/", request, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async MedicalGroupLOIIssuedReport(LoginUserID: number, RoleID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/MedicalGroupLOIIssuedReport/" + LoginUserID + "/" + RoleID )
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
