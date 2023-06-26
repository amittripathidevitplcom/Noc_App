export class HostelDataModel {
  public HostelDetailID: number = 0;
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
  public Pincode: number = 0;

  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public DivisionName: string = '';
  public DistrictName: string = '';
  public TehsilName: string = '';
  public PanchyatSamitiName: string = '';
}

export class HostelDetailsDataModel_Hostel {
  public HostelBlockDetailID: number = 0;
  public CollegeWiseRoomID: number = 0;
  public CourseID: number = 0;
  public CourseName: string = '';
  public DepartmentID: number = 0;
  public Width: number = 0;
  public Length: number = 0;
  public StudentCapacity: number = 0;
  public ImageFileName: string = '';
  public ImageFilePath: string = '';
  public HostelBlockName: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;

}
