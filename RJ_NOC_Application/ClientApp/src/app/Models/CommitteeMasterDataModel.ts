export class CommitteeMasterDataModel {
  public CommitteeMasterID: number = 0;
  public CommitteeType: string = '0';
  public CommitteeName: string = '';
  public ContactNumber: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CommitteeMemberDetailList: CommitteeMemberDetail[] = [];
}

export class CommitteeMemberDetail {
  public CommitteeMemberDetailID: number = 0;
  public NameOfPerson: string = '';
  public MobileNumber: string = '';
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
}
