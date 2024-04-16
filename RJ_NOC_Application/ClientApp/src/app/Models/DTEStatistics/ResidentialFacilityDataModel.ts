export class ResidentialFacilityDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0; 
  public IsStaffQuarterAvailable: string = "Yes"; 
  public TeachingStaff: number = 0;
  public NonTeachingStaff: number = 0;
  public TotalStaffQuarter: number = 0; 
  public IsStudentsHostelAvailable: string = "Yes";
  public HostelDetails: ResidentialFacility_HostelDetailsDataModel[] = []; 
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0; 
} 
export class ResidentialFacility_HostelDetailsDataModel {
  public Name: string = "";
  public Type: string = "0";
  public Capacity: number = 0;
  public ResidingStudents: number = 0;
}
