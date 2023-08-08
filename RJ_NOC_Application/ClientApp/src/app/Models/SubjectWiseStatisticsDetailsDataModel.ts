export class SubjectWiseStatisticsDetailsDataModel {
  public SubjectStaticsID: number = 0
  public CollegeID: number = 0
  public CourseName: string = ''
  public CourseID: number = 0
  public SubjectName: string = ''
  public SubjectID: number = 0
  public FirstYearBoysCount: number = 0
  public FirstYearGirlsCount: number = 0
  public SecYearBoysCount: number = 0
  public SecYearGirlsCount: number = 0
  public ThirdYearBoysCount: number = 0
  public ThirdYearGirlsCount: number = 0
  public PervYearBoysCount: number = 0
  public PervYearGirlsCount: number = 0
  public FinalYearBoysCount: number = 0
  public FinalYearGirlsCount: number = 0
  public DiplomaBoysCount: number = 0
  public DiplomaGirlsCount: number = 0
  public OtherBoysCount: number = 0
  public OtherGirlsCount: number = 0
  public Total: number = 0
}

export class PostSubjectWiseStatisticsDetailsDataModel {
  public CollegeID: number = 0
  public CourseID: number = 0
  public SubjectID: number = 0
  public UserID: number = 0
  public SubjectWiseStatisticsDetails: SubjectWiseStatisticsDetailsDataModel[] = [];
}


