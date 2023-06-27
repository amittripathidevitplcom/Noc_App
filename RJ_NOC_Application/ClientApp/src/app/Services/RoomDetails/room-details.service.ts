import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RoomDetailsDataModel } from '../../Models/RoomDetailsDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class RoomDetailsService {

  readonly APIUrl = GlobalConstants.apiURL + "RoomDetails";

  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async SaveData(request: RoomDetailsDataModel, files: File) {
    
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRoomDetailAllList(UserID: number, CollageID: Number) {
    
    return await this.http.get(this.APIUrl + "/GetRoomDetailAllList/" + UserID + "/" + CollageID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRoomDetailsByID(CollegeWiseRoomID: number, UserID: number) {
    return await this.http.get(this.APIUrl + "/GetRoomDetailsByID/" + CollegeWiseRoomID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(CollegeWiseRoomID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/Delete/' + CollegeWiseRoomID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
