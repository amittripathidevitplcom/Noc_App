export class FacultyDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0;

  public FacultyDetails: Faculty_FacultyDetails[] = [];

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0; 
}
export class Faculty_FacultyDetails {
  public NameofFaculty: string = "";
}
