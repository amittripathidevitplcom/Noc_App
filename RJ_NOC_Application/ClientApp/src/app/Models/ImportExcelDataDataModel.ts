
export class ImportExcelDataDataModel {
  public StaticsFileID: number = 0;
  public DataType: string = '';
  public FinancialYear: string = '0';
  public FinancialYearName: string = '';
  public FileName: string = '';
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public DepartmentID: number = 0;
  public SSOID: string = '';
  public Data: ExcelMemberDataModel[] = [];
}
export class ExcelMemberDataModel {
  public ID: number = 0;
  public StaticsFileDetailsID: number = 0;
  public StaticsFileID: number = 0;
  public ApplicationID : string = '';
  public District : string = '';
  public CollegeName : string = '';
  public AISHECode : string = '';
  public StudentName : string = '';
  public FatherName : string = '';
  public Gender : string = '';
  public Course : string = '';
  public Subject : string = '';
  public Class : string = '';
  public Cast : string = '';
  public PH : string = '';
  public Minorty : string = '';
  public HasScholarship : string = '';
  public ScholarshipName : string = '';
  public DOB : string = '';
  public StudentMobileNo : string = '';
  public StudentEmailId : string = '';
  public PrincipalName : string = '';
  public PrincipalMobileNo : string = '';
  public CollegeEmailId : string = '';
}

