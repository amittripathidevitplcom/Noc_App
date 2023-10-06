
export class StaffAttendanceDataModel {

  public StaffAttendanceID: number = 0;
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public DepartmentID: number = 0;
  public Date: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;
  public AttendanceDetailsList: AttendanceDataModel[] = [];
}
export class AttendanceDataModel {
  public StaffAttendanceDetailID: number = 0;
  public StaffID: string = '';
  public PresentStatus: number = 0;
}

export class StaffAttendanceReportDataModel {
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public FromDate: string = '';
  public ToDate: string = '';
  public StatusID: number = 0;
  public StaffName: string = '';
  public StatusName: string = '';
  public PresentStatus: number = 0;
  public Date: string = '';
}
