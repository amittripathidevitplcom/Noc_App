export class InfrastructureDetailsDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0;

  public EntryType: string = "InfrastructureDetails";
  public InfrastructureDetails_A: InfrastructureDetailsDataModel_InfrastructureDetails[] = [];
  public InfrastructureDetails_B: InfrastructureDetailsDataModel_InfrastructureDetails[] = [];

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;
}

export class InfrastructureDetailsDataModel_InfrastructureDetails {
  public FID: number = 0;
  public EntryType: string = '';
  public SNoText: string = '';
  public Item: string = '';
  public Value: string = '';
}
