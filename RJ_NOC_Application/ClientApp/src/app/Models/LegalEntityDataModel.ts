
export class LegalEntityDataModel {
  public LegalEntityID: number = 0;
  public IsLegalEntity: string = '';
  public SSOID: string = '';
  public RegistrationNo: string = '';
  public PresidentMobileNo: string = '';
  public PresidentEmail: string = '';
  public SocietyName: string = '';
  public SocietyPresentStatus: number = 0;
  public StateID: number = 0;
  public DistrictID: number = 0;
  public RegisteredActID: number = 0;
  public RegisteredActName: string = '';
  public SocietyRegistrationDate: string = '';
  public ElectionPresentManagementCommitteeDate: string ='';
  public SocietyRegisteredAddress: string = '';
  public Pincode: string = '';
  public Dis_TrustLogoDocName: string = '';
  public TrustLogoDocPath: string = '';
  public TrustLogoDoc: string = '';
  public Dis_TrusteeMemberProofDocName: string = '';
  public TrusteeMemberProofDocPath: string = '';
  public TrusteeMemberProofDoc: string = '';
  public IsOtherInstitution: string = '';
  public IsWomenMembers: string = '';
  public IsDateOfElection: string = '';
  public ManagementCommitteeCertified: string = '';  
  public SocietyPANNumber: string = '';
  public Dis_SocietyPanProofDocName: string = '';
  public SocietyPanProofDocPath: string = '';
  public SocietyPanProofDoc: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public AadharNo: string = '';
  public PresidentAadhaarNumber: string = '';

  public Dis_RegistrationDocName: string = '';
  public RegistrationDocPath: string = '';
  public RegistrationDoc: string = '';

  public MemberDetails: LegalEntityMemberDetailsDataModel[] = [];
  public InstituteDetails: LegalEntityInstituteDetailsDataModel[] = [];



  public ProcessDepartmentID: number = 0;
  public ManagementType: string = 'Private';


}

export class RegistrationDetail_LegalEntityDataModel {
  public StateID: number = 0;
  public DistrictID: number = 0;
  public RegistrationNo: string = '';
}

export class LegalEntityMemberDetailsDataModel {
  public MemberID: number = 0;
  public MemberName: string = '';
  public MemberFatherName: string = '';
  public MemberDOB: string = '';
  public MemberMobileNo: string = '';
  public MemberPostID: number = 0;
  public MembersPostName: string = '';
  public Dis_MemberPhotoName: string = '';
  public MemberPhoto: string = '';
  public MemberPhotoPath: string = '';
  public MemberSignature: string = '';
  public Dis_MemberSignatureName: string = '';
  public MemberSignaturePath: string = '';
  public PresidentAadhaarNumber: string = '';
  public Dis_PresidentAadhaarProofDocName: string = '';
  public PresidentAadhaarProofDocPath: string = '';
  public PresidentAadhaarProofDoc: string = '';

  public Dis_AadhaarNumber: string = '';
}
export class LegalEntityInstituteDetailsDataModel {
  public InstituteID: number = 0;
  public RegistrationNo: string= '';
  public InstituteName: string = '';
  public InstitutePersonName: string = '';
  public InstituteDesignation: string = '';
  public InstituteContactNumber: string = '';
  public StateID: number = 0;
  public StateName: number = 0;
}
