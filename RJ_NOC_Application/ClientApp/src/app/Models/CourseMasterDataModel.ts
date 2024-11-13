export class CourseMasterDataModel {
  public CollegeWiseCourseID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public Seats: number = 0;
  public NoOfEnrolledStudents: number = null;
  public SelectedSubjectDetails: CourseMasterDataModel_SubjectDetails[] = [];
  public UserID: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CourseLevelID: number = 0;
  public StreamID: number = 0;
  public SessionYear: number = 0;
  public CourseCategoryId: number = 0;
  public TotalSeatsCourseWise: string = '';
  public CompositeUnit: string = '';
}

export class CourseMasterDataModel_SubjectDetails {
  public SubjectID: number = 0;
  public SubjectName: string = '';
}


export class DTECourseMasterDataModel {
  public CollegeWiseCourseID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public UserID: number = 0;
  public StreamID: number = 0;
  public CourseLevelID: number = 0;
  public CourseID: number = 0;
  public OtherCourseName: string = '';
  public Intake: number = 0;
  public SuperNumerarySeats: number = 0;
  public Enrollment: number = 0;
  public Shift: number = 0;
  public ConductMode: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
}
