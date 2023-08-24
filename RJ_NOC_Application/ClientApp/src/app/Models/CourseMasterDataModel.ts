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
}

export class CourseMasterDataModel_SubjectDetails {
  public SubjectID: number = 0;
  public SubjectName: string = '';
}
