export class CollegeDataModel {
  public CollegeID: number = 0;
  public TypeofCollege: string = '';
  public DepartmentID: number = 0;
  public CollegeStatusID: number = 0;
  public CollegeLogo: string = '';
  public CollegeLogoPath: string = '';
  public CollegeLogo_Dis_FileName: string = '';
  public PresentCollegeStatusID: number = 0;
  public CollegeTypeID: number = 0;
  public CollegeLevelID: number = 0;
  public CollegeNameEn: string = '';
  public CollegeCode: string = '';
  public CollegeNameHi: string = '';
  public AISHECodeStatus: number = null;
  public AISHECode: string = null;
  public CollegeMedium: number = 0;
  public UniversityID: number = 0;
  public MobileNumber: string = '';
  public CollegeLandlineNumber: string = '';
  public Email: string = '';
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public RuralUrban: number = null;
  public DistanceFromCity: number = null;
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public SubdivisionID: number = 0;
  public TehsilID: number = 0;
  public PanchayatSamitiID: number = 0;
  public ParliamentAreaID: number = 0;
  public AssemblyAreaID: number = 0;
  public CityTownVillage: string = '';
  public YearofEstablishment: number = 0;
  public Pincode: number = null;
  public WebsiteLink: string = '';
  public GCD_DesignationID: number = 0;
  public GCD_MobileNumber: string = '';
  public GCD_LandlineNumber: string = '';
  public TGC_Latitude: string = '';
  public TGC_Longitude: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ParentSSOID: string = '';
  public MappingSSOID: string = '';
  public CollegeNAACAccredited: number = null;
  //public AffiliationDocument: number = null;
  public NAACAccreditedCertificate: string = '';
  public AffiliationDocument: string = '';
  public NAACAccreditedCertificatePath: string = '';
  public AffiliationDocumentPath: string = '';
  public NAACAccreditedCertificate_Dis_FileName: string = '';
  public AffiliationDocument_Dis_FileName: string = '';
  public NACCValidityDate: string = '';
  public CityID: number = 0;
  public ManagementTypeID: number = 0;
  public OtherUniversityName: string = '';
  public ContactDetailsList: ContactDetailsDataModel[] = [];
  public NearestGovernmentHospitalsList: NearestGovernmentHospitalsDataModel[] = [];
  public CollegeLevelDetails: CollegeLevelDetailsDataModel[] = [];

  public WebsiteImage: string = '';
  public WebsiteImagePath: string = '';
  public WebsiteImage_Dis_FileName: string = '';

  // Medical Group 1
  public AnnualIntakeStudents: number = null;
  public SocietyCapitalAssets: number = null;
  public SocietyIncome: number = null;
  public TotalProjectCost: number = null;
  public FundingSources: string = '';
  public FundingSourcesPath: string = '';
  public FundingSources_Dis_FileName: string = '';
  public AffiliationUniversityDoc: string = '';
  public AffiliationUniversityDocPath: string = '';
  public AffiliationUniversityDoc_Dis_FileName: string = '';
  public UniversityApproveTeachingFacultyDoc: string = '';
  public UniversityApproveTeachingFacultyDocPath: string = '';
  public UniversityApproveTeachingFacultyDoc_Dis_FileName: string = '';

  //Agriculture
  public AppliedICAR: string = '';
  public ApprovedICAR: string = '';
  public ICARDocument: string = '';
  public ICARDocumentPath: string = '';
  public ICARDocument_Dis_FileName: string = '';


  //Medical Group 3
  public IsAbbreviation: string = '';
  public AbbreviationName: string = '';



  //AH
  public FaxNo: string = '';
  public LiveStockFarmAddress: string = '';
  public VeternaryClinicalAddress: string = '';



  public PrivateCollegeUniversityName: string = '';
  public PrivateCollegeEstablishmentDate: string = '';
  public PrivateCollegeEstabCertificate: string = '';
  public PrivateCollegeEstabCertificatePath: string = '';
  public Dis_PrivateCollegeEstabCertificateName: string = '';

  //BTER
  public DTEAffiliationID: number = 0;
  public StatusOfBuildingID: number = 0;
  public AffiliationTypeID: number = 0;
  public AddressofCollegeasgiveninAICTEEOA: string = '';
  public AICTEEOAAdress: number = null;
  public AICTEEOADifferentAddress: string = '';
}
export class ContactDetailsDataModel {
  public ContactID: number = 0;
  public CollegeDetailsID: number = 0;//foreign key of M_CollegeMaster
  public NameOfPerson: string = '';
  public DesignationID: number = 0;
  public DesignationName: string = '';
  public MobileNumber: string = '';
  public EmailAddress: string = '';
  public DTEAffiliationIDs: number = 0;
  public PermanentAddress: string = '';
}
export class NearestGovernmentHospitalsDataModel {
  public NearestGovernmentHospitalsID: number = 0;
  public CollegeDetailsID: number = 0;//foreign key of M_CollegeMaster
  public HospitalName: string = '';  
  public HospitalRegNo: string = '';
  public HospitalDocument: string = '';
  public HospitalDocumentPath: string = '';
  public HospitalDocument_Dis_FileName: string = '';
  public HospitalDistance: number = null;
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public RuralUrban: number = null;
  public RuralUrbanName: string = '';
  public DivisionID: number = 0;
  public DivisionName: string = '';
  public DistrictID: number = 0;
  public DistrictName: string = '';
  public TehsilID: number = 0;
  public TehsilName: string = '';
  public PanchayatSamitiID: number = 0;
  public PanchayatSamitiName: string = '';
  public CityTownVillage: string = '';
  public Pincode: number = null;
  public CityID: number = 0;
  public CityName: string = '';


 


}
export class CollegeLevelDetailsDataModel {
  public AID: number = 0;
  public CollegeID: number = 0;
  public ID: number = 0;
  public Name: string = '';
}
