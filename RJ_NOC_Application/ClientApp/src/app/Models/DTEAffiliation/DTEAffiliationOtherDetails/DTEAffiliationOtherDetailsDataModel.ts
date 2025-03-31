export class DTEAffiliationOtherDetailsDataModel {
  public OtherDetailsID: number = 0;
  public DepartmentID: number = 0; 
  public NocIssued: number = 0;  
  public NocNumber: string = '';
  public NocIssueDate: string = '';
  public UploadNocApproval: string = '';  
  public UploadNocApprovalDocPath: string = '';
  public UploadNocApprovalDoc_Dis_FileName: string = '';
  public AICTE_EOA_LOA: number = 0;
  public AICTELAO_No: string = '';
  public EOA_LOA_Date: string = '';
  public UploadLOAApproval: string = '';
  public UploadLOAApprovalDocPath: string = '';
  public UploadLOAApproval_Dis_FileName: string = '';
  public UploadApplicationForm: string = ''; 
  public UploadApplicationFormDocPath: string = '';
  public UploadApplicationFormDoc_Dis_FileName: string = '';
  public FYID: number = 0; 
  public UserID: number = 0;  
  public BTERRegID: number = 0;  
  public RegAffiliationStatusId: number = 0;  
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public NOCStatus: string = '';
  public AICTEStatus: string = '';
}

export class DTEAffiliationOtherDetailsPreviewDataModel {
  public OtherDetailsID: number = 0;
  public DepartmentID: number = 0;
  public UploadNocApproval: string = '';
  public UploadNocApprovalDocPath: string = '';
  public UploadNocApprovalDoc_Dis_FileName: string = '';
  public NocIssued: string = '';
  public NocNumber: string = '';
  public NocIssueDate: string = '';
  public UploadLOAApproval: string = '';
  public UploadLOAApprovalDocPath: string = '';
  public UploadLOAApproval_Dis_FileName: string = '';
  public AICTE_EOA_LOA: string = '';
  public AICTELAO_No: string = '';
  public EOA_LOA_Date: string = '';
  public UploadApplicationForm: string = '';
  public UploadApplicationFormDocPath: string = '';
  public UploadApplicationFormDoc_Dis_FileName: string = '';

}
export class NOCRevertOtherDetailsDataModel { 
  public OtherDetailsID: number = 0;
  public BTERRegID: number = 0;
  public DepartmentID: number = 0;
  public RegAffiliationStatusId: number = 0;
  public UserID: number = 0;
  public FYID: number = 0;
  public NOCStatus: string = '';
  public NocIssued: number = 0;
  public NocNumber: string = '';
  public NocIssueDate: string = '';
  public UploadNocApproval: string = '';  
  public UploadNocApprovalDocPath: string = '';
  public UploadNocApprovalDoc_Dis_FileName: string = '';
}
export class EOALOARevertOtherDetailsDataModel {
  public OtherDetailsID: number = 0;
  public BTERRegID: number = 0;
  public DepartmentID: number = 0;
  public RegAffiliationStatusId: number = 0;
  public UserID: number = 0;
  public FYID: number = 0;
  public AICTEStatus: string = '';
  public AICTE_EOA_LOA: number = 0;
  public AICTELAO_No: string = '';
  public EOA_LOA_Date: string = '';
  public UploadLOAApproval: string = '';
  public UploadLOAApprovalDocPath: string = '';
  public UploadLOAApproval_Dis_FileName: string = '';
}
export class ApplicationRevertOtherDetailsDataModel {
  public OtherDetailsID: number = 0;
  public BTERRegID: number = 0;
  public DepartmentID: number = 0;
  public RegAffiliationStatusId: number = 0;
  public UserID: number = 0;
  public FYID: number = 0;
  public UploadApplicationForm: string = '';
  public UploadApplicationFormDocPath: string = '';
  public UploadApplicationFormDoc_Dis_FileName: string = '';
}


