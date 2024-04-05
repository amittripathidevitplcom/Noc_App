


export class PlacementDetailsDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0;

  public EntryType: string = "PlacementDetails";
  public PlacementDetails: PlacementDetailsDataModel_PlacementDetails[] = [];

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;


}

export class PlacementDetailsDataModel_PlacementDetails {
  public NoOfStudentsPlaced_Male: number = 0;
  public NoOfStudentsPlaced_Female: number = 0;
  public NoOfStudentsPlaced_Total: number = 0;
  public NoOfStudentsSelectedForHigherStudies_Male: number = 0;
  public NoOfStudentsSelectedForHigherStudies_Female: number = 0;
  public NoOfStudentsSelectedForHigherStudies_Total: number = 0;
  public MedianAnnualSalaryforPlacedStudents: number = 0;
  public SelfEmployed: string = "";
}

