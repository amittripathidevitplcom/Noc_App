export class UserMasterDataModel {
  public UId: number = 0;
  public SSOID: string = '';
  public MobileNumber: string = '';
  public EmailAddress: string = '';
  public Name: string = '';
  public DesignationID: number = 0;
  public DesignationName: string = '';
  public DepartmentID: number = 0;
  public DepartmentName: string = '';
  public RoleID: number = 0;
  public RoleName: string = '';
  public MemberType: string = '';
  public StateID: number = 0;
  public StateName: string = '';
  public DistrictID: number = 0;
  public DistrictName: string = '';
  public TehsilID: number = 0;
  public TehsilName: string = '';

  public ActiveStatus: boolean = true;
  public ActiveDeactive: string = '';
  public DeleteStatus: boolean = false;
}
