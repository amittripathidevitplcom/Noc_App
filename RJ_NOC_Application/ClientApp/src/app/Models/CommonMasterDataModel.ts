export class CommonMasterDataModel {
  public ID: number = 0;
  public DepartmentID: number = 0;
  public DepartmentName: string = '';
  public Name: string = '';
  public Type: string = '';
  public ActiveStatus: boolean = true;
  public ActiveDeactive: string = '';
  public DeleteStatus: boolean = false;
}
export class CommonDataModel_TotalApplicationSearchFilter {
  public DepartmentID: number = 0;
  public UniversityID: number = 0;
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public Status: string = 'ALL';
  public CollegeName: string = '';
}

export class CommonDataModel_TotalDraftEntrySearchFilter {
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public UniversityID: number = 0;
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public CollegeName: string = '';
  public Type: string = '';
}
