export class CollegeLabInformationDataModel
{
  public  CourseID :number=0
  public SubjectID: number=0;
  public  Width: number=0;
  public  Length: number=0;
  public DepartmentID: number = 0
  public RoomNo: string = '';

  public Dis_FileName?: string = '';
  public FileName?: string = '';
  public FilePath?: string = '';
  public LabImage: string = '';


  public Dis_OtherFileName?: string = '';
  public FileOtherName?: string = '';
  public FileOtherPath?: string = '';
  public ToolImage: string = '';
  public SubjectName: string = '';
  public CourseName: string = '';
}
export class PostCollegeLabInformation
{
  public CollegeID: number = 0
  public UserID: number = 0
  public DepartmentID: number = 0
  public OtherID: number = 0
  public CollegeLabInformationList: CollegeLabInformationDataModel[] = [];
}
