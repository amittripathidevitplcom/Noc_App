export class CollegeDataModel {
  public CollegeID: number = 0;
  public DepartmentID: number = 0;
  public CollegeStatusID: number = 0;
  public CollegeLogo: string = null;
  public PresentCollegeStatusID: number = 0;
  public CollegeTypeID: number = 0;
  public CollegeLevelID: number = 0;
  public CollegeNameEn: string = null;
  public CollegeNameHi: string = null;
  public AISHECodeStatus: number = null;
  public AISHECode: string = null;
  public CollegeMedium: number = 0;
  public UniversityID: number = 0;
  public MobileNumber: number = null;
  public Email: string = null;
  public AddressLine1: string = null;
  public AddressLine2: string = null;
  public RuralUrban: number = null;
  public DistanceFromCity: number = null;
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public SubdivisionID: number = 0;
  public TehsilID: number = 0;
  public PanchayatSamitiID: number = 0;
  public ParliamentAreaID: number = 0;
  public AssemblyAreaID: number = 0;
  public CityTownVillage: string = null;
  public YearofEstablishment: number = 0;
  public Pincode: number = null;
  public WebsiteLink: string = null;
  public GCD_DesignationID: number = 0;
  public GCD_MobileNumber: number = null;
  public GCD_LandlineNumber: number = null;
  public TGC_Latitude: string = null;
  public TGC_Longitude: string = null;
  public CreatedBy: number = null;
  public ModifyBy: number = null;
  public ParentSSOID: string = '';
  public MappingSSOID: string = '';

  public ContactDetailsList: ContactDetailsDataModel[] = [];
  public NearestGovernmentHospitalsList: NearestGovernmentHospitalsDataModel[] = [];
}
export class ContactDetailsDataModel {
  public ContactID: number = null;
  public CollegeDetailsID: number = 0;//foreign key of M_CollegeMaster
  public NameOfPerson: string = null;
  public DesignationID: number = 0;
  public MobileNumber: number = null;
  public EmailAddress: string = null;  
}
export class NearestGovernmentHospitalsDataModel {
  public NearestGovernmentHospitalsID: number = 0;
  public CollegeDetailsID: number = 0;//foreign key of M_CollegeMaster
  public HospitalName: string = null;  
  public HospitalRegNo: string = '';
  public HospitalDocument: string = null;
  public HospitalDistance: number = null;
  public AddressLine1: string = null;
  public AddressLine2: string = null;
  public RuralUrban: number = null;
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public TehsilID: number = 0;
  public PanchayatSamitiID: number = 0;
  public CityTownVillage: string = null;
  public Pincode: number = null;
}

