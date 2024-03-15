export class OffShoreCenterDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0;


  public NumberOfOffShoreCenter: number = 0;
  public OffShoreCenterDetails: OffShoreCenter_OffShoreCenterDetails[] = [];

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;


}

export class OffShoreCenter_OffShoreCenterDetails {
  public NameOffShoreCenter: string = "";
  public Country: string = "";
  public StudyMode: string = "";
  public TotalEnrolledStudents: number = 0;
  public TotalEnrolledGirlsStudents: number = 0;
}
