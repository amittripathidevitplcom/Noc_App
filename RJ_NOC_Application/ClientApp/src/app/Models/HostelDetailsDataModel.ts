import { DocumentScrutiny_ActionModule} from '../Models/LandDetailDataModel'
export class HostelDataModel extends DocumentScrutiny_ActionModule {
  public HostelTypeID: number = 0;
  public HostelCategoryID: number = 0;
  public HostelDetailID: number = 0;
  public IsHostel: string = '';
  public IsHostelCampus: string = '';
  public HostelName: string = '';
  public HostelAddress: string = '';
  public ContactPersonName: string = '';
  public DistanceOfCollege: string = '';
  public HostelType: string = '';
  public OwnerName: string = '';
  public OwnerContactNo: string = '';
  public RentDocument: string = '';
  public RentDocumentPath: string = '';
  public RentDocument_Dis_FileName: string = '';
  public ContactPersonNo: string = '';
  public FromDate: string = '';
  public ToDate: string = '';
  public HostelDetails: HostelDetailsDataModel_Hostel[] = [];

  //Address
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public IsRuralUrban: string = '';
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public TehsilID: number = 0;
  public PanchayatSamitiID: number = 0;
  public CityTownVillage: string = '';
  public Pincode: number = null;

  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public DivisionName: string = '';
  public DistrictName: string = '';
  public TehsilName: string = '';
  public PanchyatSamitiName: string = '';

  public CreatedBy: number = 0;
  public ModifyBy: number = 0;


  public HostelCategory: string = '';
  public HostelCategoryType: string = '';
  public CityID: number = 0;
  public CityName: string = '';
  public BuiltUpArea?: string = '';
}

export class HostelDetailsDataModel_Hostel {
  public HostelBlockDetailID: number = 0;
  public CollegeWiseRoomID: number = 0;
  public CourseID: number = 0;
  public CourseName: string = '';
  public DepartmentID: number = 0;
  public NoOf: number = null;
  public Width: number = null;
  public Length: number = null;
  public StudentCapacity: number = null;
  public ImageFileName: string = '';
  public Dis_FileName: string = '';
  public ImageFilePath: string = '';
  public HostelBlockName: string = '';
}
