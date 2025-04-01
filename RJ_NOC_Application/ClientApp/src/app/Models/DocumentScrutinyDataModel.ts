
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
  public SubTabName: string = '';

}

export class BTERDocumentScrutinyDataModel {
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public UserID: number = 0;
  public RoleID: number = 0;
  public ActionID: number = 0;
  public FinalRemark: string = ''; 
  public ApplyAffiliationID: number = 0;
  public BTERAffiliationRegID: number = 0;
  public NocDocumentScrutinyDetail: NOCBTERDocumentScrutinyList_DataModel[] = [];
  public LOADocumentScrutinyDetail: LOABTERDocumentScrutinyList_DataModel[] = [];
  public ApplicationFormDocumentScrutinyDetail: ApplicationformBTERDocumentScrutinyList_DataModel[] = [];
  public BTERPaymentDocumentScrutinyDetail: BTERPaymentformBTERDocumentScrutinyList_DataModel[] = [];
}
export class NOCBTERDocumentScrutinyList_DataModel {
  public DSBterAffiliationID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public UserID: number = 0;
  public RoleID: number = 0; 
  public ApplyAffiliationID: number = 0;
  public Action: string = '';
  public Remark: string = '';
}
export class LOABTERDocumentScrutinyList_DataModel {
  public DSBterAffiliationID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public UserID: number = 0;
  public RoleID: number = 0; 
  public ApplyAffiliationID: number = 0;
  public Action: string = '';
  public Remark: string = '';
}
export class ApplicationformBTERDocumentScrutinyList_DataModel {
  public DSBterAffiliationID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public UserID: number = 0;
  public RoleID: number = 0; 
  public ApplyAffiliationID: number = 0;
  public Action: string = '';
  public Remark: string = '';
}
export class BTERPaymentformBTERDocumentScrutinyList_DataModel {
  public DSBterAffiliationID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public UserID: number = 0;
  public RoleID: number = 0; 
  public ApplyAffiliationID: number = 0;
  public Action: string = '';
  public Remark: string = '';
  public PaymentID: string = '';
}
