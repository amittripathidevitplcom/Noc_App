export class ProjectMasterDataModel {
  public ProjectID: number = 0;
  public EmpanelmentType: string = 'Service';
  public ProjectName: string = '';
  public DepartmentName: string = '';
  public NumberofResources: number = 0;
  public UserID: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
}

export class CandidateInfoDataModel {
  public ProjectID: number = 0;
  public DocumentDataList: CandidateInfoDataModel_Document[] = [];
  public CandidateInfo: CandidateInfoDataModel_CandidateInfo[] = [];
}


export class CandidateInfoDataModel_Document {
  public DID: number = 0;
  public DocumentName: string ='';
  public DocumentType: string = '';
  public Status: boolean = false;
  public ForEmployeeCode: boolean = false;
}
export class CandidateInfoDataModel_CandidateInfo {
  public CID: number = 0;
  public ProjectID: number = 0;
  public Designation: string = '';
  public CandidateName: string = '';
  public DateofJoining: string = '';
  public CTC: number = 0;
  public EmailID: string = '';
  public PhoneNo: string = '';
  public Password: string = '';
}
export class ProjectMaster_DocumentScrutiny_ApprovedReject {
  public ProjectID: number = 0;
  public UserID: number = 0;
  public DocumentScrutiny_ApprovedRejectList: DocumentScrutiny_ApprovedReject[] = [];
}

export class DocumentScrutiny_ApprovedReject {
  public ProjectID: number = 0;
  public DID: number = 0;
  public EmployeeID: number = 0;
  public DocumentName: string = '';
  public DocumentFileName: string = '';
  public Status: string = '';
  public ActionRemarks: string = '';
}


export class ProjectMasterDataModel_PIDetails {
  public PIID: number = 0;
  public ProjectID: number = 0;
  public PINo: string = '';
  public TenderNo: string = '';
  public TenderValidUpTo: string = '';
  public InvoiceNo: string = '';
  public RefID: string = '';;
  public PIRecievedDate: string = '';
  public PIGrossAmount: number = 0;

  public Name: string = '';
  public GSTINNo: string = '';
  public ContactNo: string = '';
  public Email: string = '';

  public StateID: number = 0;
  public DistrictID: number = 0;
  public CityName: string = '';
  public PinCode: string = '';
  public Address: string = '';
  public DocumentName: string = '';
  public AssignTo: number = 0;
  public UserID: number = 0;
}
