export class RegularModeDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0;

  public EntryType: string = "Regular Mode";
  public ProgrammesDetails: RegularModeDataModel_ProgrammesDetails[] = [];

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;


}

export class RegularModeDataModel_ProgrammesDetails {
  public Faculty_School: string = "";
  public Department_Centre: string = "";
  public LevelID: number = 0;
  public LevelName: string = "";
  public ProgrammeID: number = 0;
  public NameOfTheProgramme: string = "";

  public BroadDisciplineGroupCategory: string = "";
  public BroadDisciplineGroupName: string = "";
  public Discipline: string = "";
  public AdmissionCriterion: string = "";
  public ExaminationSystem: string = "";
  public Year: number = 0;
  public Month: number = 0;
  public ApprovedIntake: number = 0;
  public Type: string = "";
  public WhetherVocationalCourse: string = "";
  public YearofStart: string = "";
  public AccreditationStatus: string = "";
}
