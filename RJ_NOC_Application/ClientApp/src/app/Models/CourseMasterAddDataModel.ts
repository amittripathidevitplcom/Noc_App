export class CourseMasterAddDataModel {
  public CourseID: number = 0;
  public DepartmentID: number = 0;
  public CollegeLevel: number = 0;
  public CourseLevelID: number = 0;
  public CourseLevel: string = '';
  public CourseName: string = '';
  public UserID: number = 0;
  public CourseDurationType: number = 0;
  public CourseDuratinName: string = '';
  public Duration: number = null;
  public NoOfRooms: number = null;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public StreamID: number = 0;
  public UniversityID: number = 0;
  public NoofSubjectsForCombination: number = null;
  //BTER
  public ShortNameofCourse: string = '';
  public CourseSubjects: SubjectCourseMasterAddDataModel[] = [];
}
export class SubjectCourseMasterAddDataModel {
  public CourseID: number = 0;
  public SubjectID: number = 0;
}
