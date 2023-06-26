
export class TrusteeGeneralInfoDataModel {
  public LegalEntityID: number = 0;
  public TrusteeGeneralInfoID: number = 0;
  public SocietyRegistrationDocument: string = '';
  public SocietyLogo: string = '';
  public DateOfElectionOfPresentManagementCommittee: string = '';
  public WomenMembersOfManagementCommitteeID: number = null;
  public DateOfElectionOfManagementCommitteeID: number = null;
  public OtherInstitutionRunByTheSocietyID: number = null;

  public CreatedBy: number = null;
  public ModifyBy: number = null;
}

export class LegalEntityDataModel {
  public SSOID: string = '';
  public LegalEntityID: number = 0;
  public SocietyName: string = '';
  public LegalEntity: string = '';
  public RegistrationNo: string = '';
  public District_Eng: string = '';
  public RegisteredAct: string = '';
  public SocietyPresentStatus: string = '';
  public SocietyRegistrationDate: string = '';
}
