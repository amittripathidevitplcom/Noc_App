export class CollegeDataModel {
  public CollegeID: number = 0;
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
  public NAACAccreditedCertificate: string = '';
  public NAACAccreditedCertificatePath: string = '';
  public NAACAccreditedCertificate_Dis_FileName: string = '';
  public NACCValidityDate: string = '';
  public CityID: number = 0;

  public ContactDetailsList: ContactDetailsDataModel[] = [];
  public NearestGovernmentHospitalsList: NearestGovernmentHospitalsDataModel[] = [];
}
export class ContactDetailsDataModel {
  public ContactID: number = 0;
  public CollegeDetailsID: number = 0;//foreign key of M_CollegeMaster
  public NameOfPerson: string = '';
  public DesignationID: number = 0;
  public DesignationName: string = '';
  public MobileNumber: string = '';
  public EmailAddress: string = '';  
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
}

