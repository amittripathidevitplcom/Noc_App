export class OtherMinorityDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "College";
  public FYearID: number = 0;
  public EntryType: string = "";
  public OtherMinorityDetails: OtherMinorityDataModel_OtherMinorityDetails[] = [];
  public ModifyBy: number = 0;
}

export class OtherMinorityDataModel_OtherMinorityDetails {
  public LevelID: number = 0;
  public LevelName: string = "";
  public Discipline: string = "";
  public Year: number = 0;
  public General_Male: number = 0;
  public General_Female: number = 0;
  public General_Transgender: number = 0;
  public EWS_Male: number = 0;
  public EWS_Female: number = 0;
  public EWS_Transgender: number = 0;
  public SC_Male: number = 0;
  public SC_Female: number = 0;
  public SC_Transgender: number = 0;
  public ST_Male: number = 0;
  public ST_Female: number = 0;
  public ST_Transgender: number = 0;
  public OBC_Male: number = 0;
  public OBC_Female: number = 0;
  public OBC_Transgender: number = 0;
  public Total_Male: number = 0;
  public Total_Female: number = 0;
  public Total_Transgender: number = 0;
}

