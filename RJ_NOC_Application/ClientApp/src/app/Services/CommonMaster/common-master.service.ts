import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
//import { CommonMasterData_UnderAccountGroup, PrintPassbookDataModel } from 'app/Models/CommonMasterDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';

import * as CryptoJS from 'crypto-js';
import internal from 'stream';



@Injectable({
  providedIn: 'root'
})
export class CommonMasterService {



  readonly APIUrl_CommonMaster = GlobalConstants.apiURL + "CommonFuncation";
  readonly APIUrl_SocietyMaster = GlobalConstants.apiURL + "SocietyMaster";
  readonly APIUrl_SSOAPI = GlobalConstants.apiURL + "SSOAPI";
  readonly APIUrl = GlobalConstants.apiURL + "VeterinaryHospital";

  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }

  public Encrypt(planTest: any) {
    return planTest;
    //return CryptoJS.AES.encrypt(planTest.trim(), "RJNoc").toString();
  }
  public Decrypt(encryptText: any) {
    return encryptText
    //return CryptoJS.AES.decrypt(encryptText.trim(), "RJNoc").toString(CryptoJS.enc.Utf8);
  }


  public async AppointmentPatientDetails(AppID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/apiname/" + AppID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDocumentMasterList(UserID: number, DocumentType: string, ProjectID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/DocumentMasterList/" + UserID + "/" + DocumentType + "/" + ProjectID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async ProjectWise_EmployeeDocumentList(ProjectID: number, EmployeeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/ProjectWise_EmployeeDocumentList/" + ProjectID + "/" + EmployeeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async EmployeeProfileDetails(EmployeeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/EmployeeProfileDetails/" + EmployeeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async Load_StateWise_DistrictMaster(StateID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/Load_StateWise_DistrictMaster/" + StateID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDepartmentList() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetDepartmentList")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetSchemeListByDepartment(DepatmentID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetSchemeListByDepartment/" + DepatmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetModuleList() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetModuleList")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetSubmoduleListByModule(ModuleID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetSubmoduleListByModule/" + ModuleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetLevelList() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetLevelList")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRoleListByLevel(LevelID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetRoleListByLevel/" + LevelID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRoleListByLevelID(LevelID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetRoleListByLevelID/" + LevelID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetActionHeadList() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetActionHeadList")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetActionListByActionHead(ActionHeadID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetActionListByActionHead/" + ActionHeadID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetDepartmentMaster() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetDepartmentMaster")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCollageList_DepartmentAndSSOIDWise(DepartmentID: number, LoginSSOID: string, Type: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCollageList_DepartmentAndSSOIDWise/" + DepartmentID + "/" + LoginSSOID + "/" + Type)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAddCourseList_DepartmentIDWise(DepartmentID: number, CourseLevelID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetAddCourseList_DepartmentIDWise/" + DepartmentID + "/" + CourseLevelID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCourseList_DepartmentIDWise(DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCourseList_DepartmentIDWise/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetSubjectList_CourseIDWise(CourseID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetSubjectList_CourseIDWise/" + CourseID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetSeatInformation_CourseIDWise(CourseID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetSeatInformation_CourseIDWise/" + CourseID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDistrictList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetDistrictList")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCommonMasterList_DepartmentAndTypeWise(DepartmentID: number, Type: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCommonMasterList_DepartmentAndTypeWise/" + DepartmentID + "/" + Type)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStateList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetState")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDivisionList() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetDivisionList")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCityByDistrict(DistrictID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCityByDistrict/" + DistrictID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDistrictByDivsionId(divisionId: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetDistrictByDivsionId/" + divisionId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetUniversityByDepartmentId(departmentId: number, IsLaw: number = 0) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetUniversityByDepartmentId/" + departmentId + "/" + IsLaw)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDistrictListByStateID(StateID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetDistrictListByStateID/" + StateID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetDocumentMasterList_DepartmentAndTypeWise(DepartmentID: number, Type: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetDocumentMasterList_DepartmentAndTypeWise/" + DepartmentID + "/" + Type)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //public async GetLandAreaMasterList_DepartmentWise(DepartmentID: number) {
  //  const httpOptions = {
  //    headers: new HttpHeaders({
  //      'Content-Type': 'application/json'
  //    })
  //  };
  //  return await this.http.get(this.APIUrl_CommonMaster + "/GetLandAreaMasterList_DepartmentWise/" + DepartmentID)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}
  public async GetLandTypeMasterList_DepartmentAndLandConvertWise(DepartmentID: number, Type: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetLandTypeMasterList_DepartmentAndLandConvertWise/" + DepartmentID + "/" + Type)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetLandDoucmentTypeMasterList_DepartmentWise(DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetLandDoucmentTypeMasterList_DepartmentWise/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCourseList_CollegeWise(CollegeID: number, CourseType: string = 'All') {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCourseList_CollegeWise/" + CollegeID + "/" + CourseType)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async Get_CollegeWiseCourse_Subject_OldNOC(CollegeID: number, Type: string, CourseID: number = 0, OldNocID: number = 0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/Get_CollegeWiseCourse_Subject_OldNOC/" + CollegeID + "/" + Type + "/" + CourseID + "/" + OldNocID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCollegeWise_SubjectList_StaffDetails(CollegeID: number, Type: string, CourseID: number = 0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCollegeWise_SubjectList_StaffDetails/" + CollegeID + "/" + Type + "/" + CourseID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCollegeWise_CourseList_AcademicInformation(CollegeID: number, Type: string, CourseID: number = 0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCollegeWise_CourseList_AcademicInformation/" + CollegeID + "/" + Type + "/" + CourseID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCourseRoomSize(CourseID: number, CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCourseRoomSize/" + CourseID + "/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async OtherInformationList_DepartmentAndTypeWise(DepartmentID: number, Type: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/OtherInformationList_DepartmentAndTypeWise/" + DepartmentID + "/" + Type)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetOtherInformationSize(OtherInformationID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/OtherInformationSize/" + OtherInformationID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  ///Deepak

  //public async GetQualificationMasterList_DepartmentAndTypeWise(DepartmentID: number, Type: string) {
  //  const httpOptions = {
  //    headers: new HttpHeaders({
  //      'Content-Type': 'application/json'
  //    })
  //  };
  //  return await this.http.get(this.APIUrl_CommonMaster + "/GetQualificationMasterList_DepartmentAndTypeWise/" + DepartmentID + "/" + Type)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  public async GetSuvdivisionByDistrictId(districtId: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetSuvdivisionByDistrictId/" + districtId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTehsilByDistrictId(districtId: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetTehsilByDistrictId/" + districtId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPanchyatSamitiByDistrictId(districtId: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetPanchyatSamitiByDistrictId/" + districtId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetParliamentAreaByDistrictId(districtId: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetParliamentAreaByDistrictId/" + districtId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllFinancialYear() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetAllFinancialYear")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllFinancialYear_AcademicInformation() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetAllFinancialYear_AcademicInformation")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllFinancialYear_OldNOC(CollegeID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetAllFinancialYear_OldNOC/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllDesignation() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetAllDesignation")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBuildingTypeCheck(SelectedDepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetBuildingTypeCheck/" + SelectedDepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBuildingUploadDetails(DepartmentId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetBuildingUploadDetails/" + DepartmentId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();


  }

  public async SendMessage(MobileNo: string, MessageType: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(GlobalConstants.apiURL + "SMSMail/SendMessage/" + MobileNo + "/" + MessageType)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();


  }
  public async GetSocietyDetailByRegistrationNo(RegistrationNo: string, districtId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get("https://rajsahakarapp.rajasthan.gov.in/api/EntireSocietyDetail/GetSocietyDetailsByRegistrationNO?Reg_no=" + RegistrationNo + "&districtId" + districtId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetLandAreaMasterList_DepartmentWise(DepartmentID: number, CollageID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetLandAreaMasterList_DepartmentWise/" + DepartmentID + "/" + CollageID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetLandSqureMeterMappingDetails_DepartmentWise(DepartmentID: number, CollageID: number, LandAreaId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetLandSqureMeterMappingDetails_DepartmentWise/" + DepartmentID + "/" + CollageID + "/" + LandAreaId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetTermAndConditionList_DepartmentWise(DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetTermAndConditionList_DepartmentWise/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAnnexureDataList_DepartmentWise(DepartmentID: number, LandDocumentTypeID: number, LandConvertedID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetAnnexureDataList_DepartmentWise/" + DepartmentID + "/" + LandDocumentTypeID + "/" + LandConvertedID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetIssuedYearDetails() {
    var lstIssuedYear = [];
    lstIssuedYear.push({ yearid: 11, yearname: 'Permanently' })
    for (var i = 1; i <= 10; i++) {
      lstIssuedYear.push({ yearid: i, yearname: i + ' Year' });
    }
    return lstIssuedYear;
  }

  public async GetAllOccupation() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetAllOccupation")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetQualificationMasterList_DepartmentWise(DepartmentID: number, IsTeaching: number, Type: string = '-1') {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetQualificationMasterList_DepartmentWise/" + DepartmentID + "/" + IsTeaching + "/" + Type)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCollegeWiseSubjectList(CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCollegeWiseSubjectList/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetFacilitiesMasterList_DepartmentAndTypeWise(DepartmentID: number, Type: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetFacilitiesMasterList_DepartmentAndTypeWise/" + DepartmentID + "/" + Type)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetFacilitesMinSize(FacilitieID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetFacilitesMinSize/" + FacilitieID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAssembelyAreaByDistrictId(districtId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetAssemblyAreaByDistrictId/" + districtId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async Check_SSOIDWise_LegalEntity(SSOID: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_SSOAPI + "/Check_SSOIDWise_LegalEntity/" + SSOID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDashboardDataSSOWise(SSOID: string, DepartmentID: number, RoleID: number, UserID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetDashboardDataSSOWise/" + SSOID + "/" + DepartmentID + "/" + RoleID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCollegeBasicDetails(CollegeID: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCollegeBasicDetails/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRoleList() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetRoleList/")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CheckTabsEntry(CollegeID: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/CheckTabsEntry/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DraftFinalSubmit(CollegeID: string, IsDraftSubmited: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl_CommonMaster + '/DraftFinalSubmit/' + CollegeID + "/" + IsDraftSubmited, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Check30Female(CollegeID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl_SocietyMaster + '/Check30Female/' + CollegeID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetTabFieldByTabName(TabName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetTabFieldByTabName/" + TabName)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCommitteeList() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCommitteeList/")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetRoleListForApporval(RoleID: number, DepartmentID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetRoleListForApporval/" + RoleID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetUserDetailsByRoleID(RoleID: number, DepartmentID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetUserDetailsByRoleID/" + RoleID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetWorkFlowActionListByRole(RoleID: number, Type: string, DepartmentID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetWorkFlowActionListByRole/" + RoleID + "/" + Type + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRNCCheckListByTypeDepartment(Type: string, DepartmentID: number, ApplyNOCID: number, CreatedBy: number, RoleID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetRNCCheckListByTypeDepartment/" + Type + "/" + DepartmentID + "/" + ApplyNOCID + "/" + CreatedBy + "/" + RoleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetStreamList_CourseIDWise(DepartmentID: number, CourseLevelID: number, CourseID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetStreamList_CourseIDWise/" + DepartmentID + "/" + CourseLevelID + "/" + CourseID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetApplicationTrail_DepartmentApplicationWise(ApplicationID: number, DepartmentID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetApplicationTrail_DepartmentApplicationWise/" + ApplicationID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCourseList_ByCourseLevelIDWise(CourseLevelID: number, DepartmentID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCourseList_ByCourseLevelIDWise/" + CourseLevelID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSubjectList_StreamIDWise(StreamID: number, DepartmentID: number, CourseLevelID: number, CourseID: number) {
    const httpOptions =
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetSubjectList_StreamIDWise/" + StreamID + "/" + DepartmentID + "/" + CourseLevelID + "/" + CourseID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCollegeWiseCourseList(CollegeID: any) {
    const httpOptions =
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCollegeWiseCourseList/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCollegeWiseCourseIDSubjectList(CollegeID: any, CollegeWiseCourseID: any, ViewMode: string) {
    const httpOptions =
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCollegeWiseCourseIDSubjectList/" + CollegeID + "/" + CollegeWiseCourseID + "/" + ViewMode)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStreamMasterList(DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetStreamMasterList/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetMappedStreamListByID(DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetMappedStreamListByID/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetMappedCourseListByID(DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetMappedStreamListByID/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCourseByStreamID(StreamID: number, DepartmentID: number, CourseLevelID: number, UniversityID: Number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCourseByStreamID/" + StreamID + "/" + DepartmentID + "/" + CourseLevelID + "/" + UniversityID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDocumentScritintyTaril(ID: number, NOCApplyID: number, CollageID: number, DepartmentID: number, ActionType: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetDocumentScritintyTaril/" + ID + "/" + NOCApplyID + "/" + CollageID + "/" + DepartmentID + "/" + ActionType)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetStaffDesignation(IsTeaching: number, DepartmentID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetStaffDesignation/" + IsTeaching + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetLandTypeDetails_CollegeWise(DepartmentID: number, Type: string, LandTypeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetLandTypeDetails_CollegeWise/" + DepartmentID + "/" + Type + "/" + LandTypeID + "/")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCollegeInspectionFee(CollegeID: number, DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCollegeInspectionFee/" + CollegeID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetUniversityDepartmentWise(DepartmentID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetUniversityDepartmentWise/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetSubjectDepartmentWise(DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetSubjectDepartmentWise/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCourseLevelByCollegeIDAndDepartmentID(CollegeID: number, DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetSeatInformationByCourse/" + CollegeID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCourseLevelByCollegeIDAndDepartmentID_CourseWise(CollegeID: number, DepartmentID: number, CourseID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetCourseLevelByCollegeIDAndDepartmentID_CourseWise/" + CollegeID + "/" + DepartmentID + "/" + CourseID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCollegeLandConversionDetail(DepartmentID: number, LandDetailsID: number, Type: string) {
    
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCollegeLandConversionDetail/" + DepartmentID + "/" + LandDetailsID + "/" + Type)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCommonMasterList_DepartmentAndTypeWises(DepartmentID: number, CollageID: number, Type: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetCommonMasterList_DepartmentAndTypeWises/" + DepartmentID + "/" + CollageID + "/" + Type)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetNOCApplicationStepList(ApplyNocID: number, CurrentActionID: number, DepartmentID: number, ActionType: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetNOCApplicationStepList/" + ApplyNocID + "/" + CurrentActionID + "/" + DepartmentID + "/" + ActionType)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDownloadPdfDetails(DepartmentID: number, CollageID: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetDownloadPdfDetails/" + DepartmentID + "/" + CollageID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  
}
