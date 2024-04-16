export class RegularForeignStudentEnrolmentDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0; 
  public ForeignStudentEnrolledInTheinstitution: number = 0;
  public ApprovedIntakeCapacityOfInternationalStudents: number = 0; 
  public AlsoIncludeTemporaryContractualVisitingTeacherData: number = 0;
  public ForeignRegularStudentEnrollementThroughProgrammesOfferedByInstitution: number = 0; 
  public EntryType: string = "RegularForeignStudentEnrolment";
  public RegularForeignStudentEnrolment: RegularForeignStudentEnrolmentDataModel_RegularForeignStudentEnrolment[] = []; 
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0; 
} 
export class RegularForeignStudentEnrolmentDataModel_RegularForeignStudentEnrolment {
  public Country: string = "";
  public Faculty_School: string = "";
  public Department_Centre: string = "";
  public Discipline: string = "";
  public Method_of_Admission: string = "";
  public No_of_Students_Enrolled_Total: number = 0;
  public No_of_Students_Enrolled_Girls: number = 0;
  public No_of_Students_Staying_in_Institutions_Hostel: number = 0;
  public Broad_Discipline_Group: string = "";
  public Broad_DisciplineGroup_Category: string = "";
  public Method_of_Admission2: string = "";
  public LevelID: number = 0;
  public LevelName: string = "";
  public ProgrammeID: number = 0;
  public NameOfTheProgramme: string = "";
}

