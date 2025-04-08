export class DTEAffiliationRegistrationDataModel {
  public DTE_ARId: number = 0;
  public DepartmentID: number = 0;
  public CollegeStatusId: number = 0;
  public College_Name: string = "";
  public Mobile_Number: string = "";
  public Email_Address: string = "";
  public AffiliationTypeID: number =0;
  public StartDate: string = "";
  public EndDate: string = "";  
  public OpenSessionFY: number = 0; 
  public UserID: number = 0;  
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public CollegeStatus: string = '';
  public SSOID: string = '';
}
export class DTEAffiliationDataModel {
  public StartDate: string = "";
  public EndDate: string = "";  
  public ApplicationSession: number = 0;
  public IsOpen: boolean = false; 
  public SSOID: string = '';
}
export class BTERFeeMasterDataModel {
  public FeeID: number = 0;
  public DepartmentID: number = 0;
  public DepartmentName: string = '';
  public FeeType: string = '';
  public Amount: Number = null;
  public UserID: number = 0;
  public ActiveStatus: boolean = true;
  public ActiveDeactive: string = '';
  public DeleteStatus: boolean = false;
}


