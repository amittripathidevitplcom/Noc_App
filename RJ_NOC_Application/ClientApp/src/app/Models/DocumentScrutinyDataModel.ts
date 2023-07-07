
export class DocumentScrutinyDataModel {
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public UserID: number = 0;
  public RoleID: number = 0;
  public ActionID: number = 0;
  public FinalRemark: string = '';
  public TabName: string = '';
  public ApplyNOCID: number = 0;
  public DocumentScrutinyDetail: DocumentScrutinyList_DataModel[] = [];
}
export class DocumentScrutinyList_DataModel {
  public DocumentScrutinyID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public UserID : number = 0;
  public RoleID: number = 0;
  public ApplyNOCID: number = 0;
  public Action: string ='';
  public Remark: string = '';
  public TabRowID: number = 0;
}
