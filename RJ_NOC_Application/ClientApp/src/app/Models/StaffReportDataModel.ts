

    export class StaffReportDataModel
    {

      public TeachingFacultyID: number = 0;
      public DesignationID: number = 0;
      public FaculityName: string = '';
     /* public FaculityFatherName: string = '';*/
      public MobileNo: string = '';
      public AadhaarNo: string = '';
      public DateOfAppointment: string = '';
      public DateOfJoining: string = '';
      public MonthlySalary: string = '';
      public NOCStatus: number = 0;
     // public NOCStatus: string = '';
      public DuplicateAdharID: string = '';
      public Gender: string = '';
      public TempPermanentID: string = '';
      public IsReserachGuideID: string = '';
      public PFDeductionID: string = '';
      public PresentCollegeStatusID: number = 0;
      public SubjectID: number = 0;
      public CollegeName: string = '';
      public CollegeID: number = 0;
      public DepartmentID: number = 0;
      
     // public StatusofCollegeID: number = 0;

}

export class StaffReportFilter {

  public TeachingFacultyID: boolean = true;
  public FaculityName: boolean = true;
  public Gender: boolean = true;
  public MobileNo: boolean = true;
  public DuplicateAdharID: boolean = true;
  public TempPermanentID: boolean = true;
  public IsReserachGuideID: boolean = true;
  public AadhaarNo: boolean = true;
  public DateOfJoining: boolean = true;
  public MonthlySalary: boolean = true;
  public PFDeductionID: boolean = true;
  public CollegeID: boolean = true;
  public SubjectID: boolean = true;
  public DesignationID: boolean = true;
  public DateOfAppointment: boolean = true;



}

