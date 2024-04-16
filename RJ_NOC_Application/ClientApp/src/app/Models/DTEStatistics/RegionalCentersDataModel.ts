export class RegionalCentersDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0; 
  public DistanceEducationMode: string = "Yes"; 
  public PrivateExternalProgramme: string = "Yes"; 
  public RegionalCenters: string = "Yes";  
  public RegionalCentersDetails: RegionalCenters_RegionalCentersDetails[] = []; 
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0; 
}

export class RegionalCenters_RegionalCentersDetails {
  public NameOfRegionalCenter: string = "";
  public StateID: number = 0;
  public StateName: string = '';
  public DistrictID: number = 0;
  public DistrictName: string = '';
  public NoofStudyCenters: number = 0;
}
