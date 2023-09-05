export class VeterinaryHospitalDataModel {
  public VeterinaryHospitalID: number = 0;
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public TehsilID: number = 0;
  public PanchayatSamitiID: number = 0;
  public CityTownVillage: string = '';
  public District_Eng: string = '';
  public Division_English: string = '';
  public TehsilName: string = '';
  public PanchyatSamitiName: string = '';
  public HospitalName: string = '';
  public DistanceFromInstitute: number = null;
  public AuthorizedPerson: string = '';
  public MobileNo: string = '';
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public RuralUrban: string = '';
  public Pincode: string = '';
  public EmailAddress: string = '';
  public PersonField: string = '';
  public Relation: string = '';
  public Remark: string = '';
  public FileUpload: string = '';
  public Dis_FileUpload: string = '';
  public FileUploadPath: string = '';  
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;
  public CollegeID: number = 0;
  public DepartmentID: number = 0;
  public SSOID: string = '';
  public AnimalDetails: AnimalDataModel[] = [];

  public Action: string = '';
  public Remarks: string = '';


  public C_Action: string = '';
  public C_Remark: string = '';
  public S_Action: string = '';
  public S_Remark: string = '';
}

export class AnimalDataModel {
  public AnimalDetailsID: number = 0;
  public AnimalMasterID: number = 0;
  public AnimalName: string = '';
  public MaleAnimalCount: number = 0;  
  public FemaleAnimalCount: number = 0;  
  public AnimalCount: number = 0;  
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
}

