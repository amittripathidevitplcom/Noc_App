export class DepartmentDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0; 
  public DepartmentDetails: Department_DepartmentDetails[] = []; 
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0; 
} 
export class Department_DepartmentDetails {
  public NameofFaculty: string = "";
  public NameOfDepartmentCentres: string = "";
}
