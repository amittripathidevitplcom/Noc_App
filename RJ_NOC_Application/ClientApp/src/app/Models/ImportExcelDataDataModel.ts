
export class ImportExcelDataDataModel {
  public StaticsFileID: number = 0;
  public DataType: string = '';
  public FinancialYear: string = '0';
  public FileName: string = '';
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public DepartmentID: number = 0;
  public SSOID: string = '';
  public Data: any = [];
}
export class ExcelMemberDataModel {
  public ID: number = 0;
  public ImportExcelID: number = 0;
  public Course: string = '';
  public Subject: string = '';
  public StudentName: string = '';
  public FatherName: string = '';
  public Gender: string = '';
  public DOB: string = '';
  public Section: string = '';
  public RollNo: string = '';
  public Year: string = '';
  public Cast: string = '';
  public PH: string = '';
  public Minorty: string = '';
  public CreatedDate: string = '';
}

