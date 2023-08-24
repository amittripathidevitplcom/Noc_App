import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class AnimalDocumentScrutinyService {

  readonly APIUrl = GlobalConstants.apiURL + "AnimalDocumentScrutiny";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
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

  public async DocumentScrutiny_FacilityDetail(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_FacilityDetail/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
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
  public async DocumentScrutiny_RoomDetail(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_RoomDetail/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
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

  public async DocumentScrutiny_StaffDetails(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_StaffDetails/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DocumentScrutiny_OldNOCDetails(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_OldNOCDetails/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_AcademicInformation(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_AcademicInformation/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_OtherInformation(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_OtherInformation/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_VeterinaryHospital(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_VeterinaryHospital/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CheckDocumentScrutinyTabsData(ApplyNOCID: number, RoleID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/CheckDocumentScrutinyTabsData/" + ApplyNOCID + "/" + RoleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPhysicalVerificationAppliationList(SSOID: string, UserID: number, RoleID: number, DepartmentID: number, QueryStringStatus: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = { SSOID: SSOID, UserID: UserID, RoleID: RoleID, DepartmentID: DepartmentID, Status: QueryStringStatus };
    return await this.http.post(this.APIUrl + "/GetPhysicalVerificationAppliationList/", body, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetPreVerificationDoneList(SSOID: string, UserID: number, RoleID: number, DepartmentID: number, QueryStringStatus: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = { SSOID: SSOID, UserID: UserID, RoleID: RoleID, DepartmentID: DepartmentID, Status: QueryStringStatus };
    return await this.http.post(this.APIUrl + "/GetPreVerificationDoneList/", body, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async FinalSubmitInspectionCommittee(ApplyNOCID: number, DepartmentID: number, UserID: Number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/FinalSubmitInspectionCommittee/" + ApplyNOCID + "/" + DepartmentID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPreVerificationchecklistDetails(Type: string, DepartmentID: number, ApplyNOCID: number, CreatedBy: number, RoleID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetPreVerificationchecklistDetails/" + Type + "/" + DepartmentID + "/" + ApplyNOCID + "/" + CreatedBy + "/" + RoleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async FinalSubmitPreVerification(ApplyNOCID: number, DepartmentID: number, UserID: Number, ActionName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/FinalSubmitPreVerification/" + ApplyNOCID + "/" + DepartmentID + "/" + UserID + "/" + ActionName, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetNOCApplicationList(Action: string, DepartmentID: number, UserID: number, RoleID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetNOCApplicationList/" + UserID + "/" + RoleID + "/" + DepartmentID + "/" + Action)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
