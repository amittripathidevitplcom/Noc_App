
export class DocumentScrutinyDataModel {
  public DocumentScrutinyID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public UserID: number = 0;
  public RoleID: number = 0;
  public ActionID: number = 0;
  public Remark: string = '';
  public TabName: string = '';
  public ApplyNOCID: number = 0;
  public DocumentScrutinyDetail: DocumentScrutinyDetail_DocumentScrutinyDataModel[] = [];
}
export class DocumentScrutinyDetail_DocumentScrutinyDataModel {
  public DocumentScrutinyDetailID: number = 0;
  public DocumentScrutinyID: number = 0;
  public TabFieldID: number = 0;
  public TabFieldName: string = '';
}
