export class ApplicationCommitteeMemberdataModel
{

  public CommitteeMemberID?: number=0;
  public ApplyNocApplicationID?: number=0;
  public NameOfPerson: string=''
  public MobileNumber: string = ''
  public SSOID: string = ''
  public RoleID?: number = 0;
  public IsPrimaryMember?: boolean = false;
  public ActiveStatus?: boolean = false;
  public DeleteStatus?: boolean = false;
  public AadhaarNo?: string = '';


}

export class PostApplicationCommitteeMemberdataModel
{
  public CommitteeMemberID?: number = 0;
  public CollegeID?: number = 0
  public UserID?: number = 0
  public ApplyNocApplicationID?: number = 0;
  public ApplicationCommitteeList: ApplicationCommitteeMemberdataModel[] = [];
}

