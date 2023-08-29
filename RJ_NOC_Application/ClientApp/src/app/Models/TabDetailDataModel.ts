
export class LandDetailDataModel {
  public LandDetailID: number = 0;
  public CollegeID: number = 0;
  public LandAreaID: number = 0;
  public LandDocumentTypeID: number = 0;
  public LandConvertedID: number = 0;
  public LandTypeID: number = 0;
  public KhasraNumber: string = '';
  public LandOwnerName: string = '';
  public BuildingHostelQuartersRoadArea: number = null;
  //public GroundCycleStandArea: number = 0;
  //public TotalLandArea: number = 0;
  public LandConversionOrderDate: Date = new Date();
  public AffidavitDate: Date = new Date();
  public LandConversionOrderNo: string = '';
  public CollegeName: string = '';
  public LandAreaSituatedName: string = '';
  public LandDocumentTypeName: string = '';
  public IsConvereted: string = '';
  public LandTypeName: string = '';
  public LandDetailDocument: LandDetailDocumentDataModel[] = [];
}
export class LandDetailDocumentDataModel {
  public DID: number = 0;
  public DocumentName: string = '';
  public DocumentValue: string = '';
}


export class FacilitieDataModel {
  public FacilitieID: number = 0;
  public FacilitieName: string = '';
  public FacilitieUrl: string = '';
  public Width: number = 0;
  public Length: number = 0;
  public MinSize: number = 0;
  public Unit: string = '';
}

export class RequiredDocumentsDataModel {
  public CollegeID: number = 0;
  public DocumentType: string = '';
  public DocumentDetails: RequiredDocumentsDataModel_Documents[] = [];
}

 

export class RequiredDocumentsDataModel_Documents {
  public DID: number = 0;
  public DocumentName: string = '';
  public DocumentValue: string = '';
  public IsMandatory: boolean = false;
  public Dis_FileName: string = '';
  public FileName: string = '';
  public FilePath: string = '';
  public SampleDocument?: string = '';
  public DisplayName?: string = '';
  public Action: string = '';
  public Remark: string = '';


  public C_Action: string = '';
  public C_Remark: string = '';
  public S_Action: string = '';
  public S_Remark: string = '';
  public DocumentType: string = '';
}

export class StaffDetailDataModel {
  public StaffDetailID: number = 0;
  public TeachingType: string = '';
  public SubjectName: string = '';
  public RoleName: string = '';
  public SubjectID: number = 0;
  public PersonName: string = '';
  public RoleID: number = 0;
  public MobileNo: string = '';
  public Email: string = '';
  public HighestQualification: number = 0;
  public HighestQualificationName: string = '';
  public NumberofExperience: string = '';
  public AadhaarNo: string = '';
  public MaskedAadhaarNo: string = '';
  public DateOfBirth: string = '';
  public DateOfAppointment: string = '';
  public DateOfJoining: string = '';
  public SpecializationSubject: string = '';
  public RoleMapping: string = '';
  public Salary: string = '';
  public StaffStatus: string = '';
  public PFDeduction: string = '';
  public UANNumber: string = '';
  public ResearchGuide: string = '';
  public ProfessionalQualificationID: number = 0;
  public StreamSubject: string = '';
  public UniversityBoardInstitutionName: string = '';
  public PassingYearID: number = 0;
  public Marks: string = '';
  public ProfilePhoto: string = '';
  public ProfilePhotoPath: string = '';
  public ProfilePhoto_Dis_FileName: string = '';
  public AadhaarCard: string = '';
  public AadhaarCardPath: string = '';
  public AadhaarCard_Dis_FileName: string = '';
  public PANCard: string = '';
  public PANCardPath: string = '';
  public PANCard_Dis_FileName: string = '';
  public ExperienceCertificate: string = '';
  public ExperienceCertificatePath: string = '';
  public ExperienceCertificate_Dis_FileName: string = '';
  public UploadDocument: string = '';
  public UploadDocumentPath: string = '';
  public UploadDocument_Dis_FileName: string = '';
  public DepartmentID: number = 0;
  public CollegeID: number = 0;

  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public IPAddress: string = '';
  public Action: string = '';
  public Remark: string = '';
  public EducationalQualificationDetails: EducationalQualificationDetails_StaffDetail[] = [];


  public C_Action: string = '';
  public C_Remark: string = '';
  public S_Action: string = '';
  public S_Remark: string = '';
  public Gender: string=''
}
export class EducationalQualificationDetails_StaffDetail {
  public EducationalQualificationID: number = 0;
  public ProfessionalQualificationID: number = 0;
  public ProfessionalQualification: string = '';
  public StreamSubject: string = '';
  public UniversityBoardInstitutionName: string = '';
  public PassingYearID: number = 0;
  public PassingYear: string = '';
  public Marks: string = '';
  public UploadDocument: string = '';
  public UploadDocumentPath: string = '';
  public UploadDocument_Dis_FileName: string = '';
}

//export class BuildingDetailsDataModel {
//  public BuildingDetailsID: number = 0;
//  public FromDate: string = '';
//  public ToDate: string = '';
//  //public RegistrationNo: string = '';
//  //public PreMobNo: string = '';
//  //public PreMailId: string = '';
//  //public SocietyName: string = '';
//  //public SocietyPresentStatus: number = 0;
//  //public State: number = 0;
//  //public District: number = 0;
//  //public RegisteredAct: string = '';
//  //public SocietyRegistrationDate: string = '';
//  //public ElectionPresentManagementCommitteeDate: string = '';
//  //public SocietyRegisteredAddress: string = '';
//  //public Pincode: string = '';
//  //public TrustLogoDoc: string = '';
//  //public TrusteeMemberProofDoc: string = '';
//  //public IsOtherInstitution: string = '';
//  //public IsWomenMembers: string = '';
//  //public IsDateOfElection: string = '';
//  //public ManagementCommitteecertified: string = '';
//  //public PresidentAadhaarNumber: string = '';
//  //public PresidentAadhaarProofDoc: string = '';
//  //public SocietTANNumber: string = '';
//  //public SocietyPANNumber: string = '';
//  //public SocietyPanProofDoc: string = '';
//  //public ActiveStatus: boolean = true;
//  //public DeleteStatus: boolean = false;
//  //public MemberDetails: LegalEntityMemberDetailsDataModel[] = [];
//}

 

export class OldNocDataModel {
  public OldNocDetails: OldNocDetailsDataModel[] = [];
}
export class OldNocDetailsDataModel {
  public OldNocID: number = 0;
  public CollegeID: number = 0;
  public DepartmentID: number = 0;
  public CollegeName: string = '';
  public CourseID: number = 0;
  public CourseName: string = '';

  public NOCTypeID: number = 0;
  public NOCTypeName: string = '';
  public SessionYear: number = 0;
  public FinancialYearName: string = '';
  public IssuedYear: number = 0;
  public NOCNumber: string = '';
  public NOCReceivedDate: string = '';
  public NOCExpireDate: string = '';
  public UploadNOCDoc: string = '';
  public UploadNOCDocPath: string = '';
  public Dis_FileName: string = '';
  public Remark: string = '';
  public SubjectData: OldNocDetails_SubjectDataModel[] = [];

  public Action: string = '';
  public C_Action: string = '';
  public S_Action: string = '';
  public C_Remark: string = '';
  public S_Remark: string = '';
}
export class OldNocDetails_SubjectDataModel {
  public OldNOCSubjectID: number = 0;
  public SubjectID: number = 0;
  public SubjectName: string = '';
}
export class AcademicInformationDetailsDataModel {
  public AcademicInformationID: number = 0;
  public YearID: number = 0;
  public YearValue: string = '';
  public CourseID: number = 0;
  public CourseName: string = '';
  public AdmittedStudent: number = 0;
  public AppearedStudent: number = 0;
  public ResultID: number = 0;
  public ResultName: string = '';
  public PassedStudent: number = 0;
  public FailedStudent: number = 0;
  public OtherStudent: number = 0;
  public Percentage: number = 0;
}
export class OtherDocumentDataModel {
  public OtherDocUrl: string = '';
} 



export class BuildingDetailsDataModel {
  public CollegeID: number = 0;
  public SchoolBuildingDetailsID: number = 0;
  public BuildingTypeID: number = null;
  public BuildingTypeName: string = '';
  public FromDate: string = '';
  public ToDate: string = '';
  public FireNOCFileUpload: string = '';
  public Dis_FireNOCFileUpload: string = '';
  public FireNOCFileUploadPath: string = '';
  public OrderNo: string = '';
  public OrderDate: string = '';
  public ExpiringOn: string = '';
  public PWDNOCFileUpload: string = '';
  public Dis_PWDNOCFileUpload: string = '';
  public PWDNOCFileUploadPath: string = '';
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public RuralUrban: string = '';
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public TehsilID: number = 1;
  public PanchayatSamitiID: number = 1;
  public CityTownVillage: string = '';
  public Pincode: string = '';
  public BuildingHostelQuartersRoadArea: number = 0;
  public ContactNo: string = '';
  public OwnerName: string = '';
  public OwnBuildingOrderNo: string = '';
  public OwnBuildingOrderDate: string = '';
  public OwnBuildingFileUpload: string = '';
  public Dis_OwnBuildingFileUpload: string = '';
  public OwnBuildingFileUploadPath: string = '';
  public RentAgreementFileUpload: string = '';
  public Dis_RentAgreementFileUpload: string = '';
  public RentAgreementFileUploadPath: string = '';
  public UserID: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public Action: string = '';
  public Remark: string = '';
  public TotalProjectCost: string = '';
  public TotalProjectCostFileUpload: string = '';
  public Dis_TotalProjectCostFileUpload: string = '';
  public TotalProjectCostFileUploadPath: string = '';
  public SourceCostAmount: string = '';
  public SourceCostAmountFileUpload: string = '';
  public Dis_SourceCostAmountFileUpload: string = '';
  public SourceCostAmountFileUploadPath: string = '';
  public AmountDeposited: string = '';
  public AmountDepositedFileUpload: string = '';
  public Dis_AmountDepositedFileUpload: string = '';
  public AmountDepositedFileUploadPath: string = '';
  public OtherFixedAssetsAndSecurities: string = '';
  public OtherFixedAssetsAndSecuritiesFileUpload: string = '';
  public Dis_OtherFixedAssetsAndSecuritiesFileUpload: string = '';
  public OtherFixedAssetsAndSecuritiesFileUploadPath: string = '';
  public GATEYearBalanceSecret: string = '';
  public GATEYearBalanceSecretFileUpload: string = '';
  public Dis_GATEYearBalanceSecretFileUpload: string = '';
  public GATEYearBalanceSecretFileUploadPath: string = '';
  public OtherFinancialResources: string = '';
  public OtherFinancialResourcesFileUpload: string = '';
  public Dis_OtherFinancialResourcesFileUpload: string = '';
  public OtherFinancialResourcesFileUploadPath: string = '';
  public Rentvaliditydate: string = '';
  public lstBuildingDocDetails: DocuemntBuildingDetailsDataModel[] = [];

  public C_Action: string = '';
  public C_Remark: string = '';
  public S_Action: string = '';
  public S_Remark: string = '';
}

export class DocuemntBuildingDetailsDataModel {

  public DID: number = 0;
  public DocumentType: string = '';
  public DocumentName: string = '';
  public FilePath: string = '';
  public FileName: string = '';
  public Dis_FileName: string = '';
  public Isfile: boolean = false;
}
