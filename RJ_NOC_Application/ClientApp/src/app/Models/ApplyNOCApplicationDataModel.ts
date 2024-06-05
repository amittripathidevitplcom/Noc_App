export class ApplyNOCApplicationDataModel {
  public ApplyNOCID: number = 0;
  public ApplicationNo: string = '';
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public DepartmentName: string = '';
  public CollegeName: string = '';
}
export class CommiteeInspection_RNCCheckList_DataModel {
  public RNCCheckListID: number = 0;
  public ApplyNOCID: number = 0;
  public CreatedBy: number = 0;
  public FileUploadName: string = '';
  public Remark: string = '';
  public IsChecked: string = '';
  public FinalRemark: string = '';
  public RoleID: number = 0;
}


export class GenerateNOC_DataModel {
  public ApplyNOCID: number = 0;
  public DepartmentID: number = 0;
  public RoleID: number = 0;
  public UserID: number = 0;
  public CourseID: number = 0;
  public CourseName: string = '';
  public SubjectID: number = 0;
  public SubjectName: string = '';
  public ApplyNocParameterID: number = 0;
  public NOCIssuedRemark?: string = '';

}

export class ParameterFeeMaster {
  public ParamterID: number = 0;
  public DepartmentID: number = 0;
  public ApplyNocFeeID: number = 0;
  public OpenFromDate: string = '';
  public OpenToDate: string = '';
  public FeeAmount: number = 0;
  public ActionName: string = '';
  public ApplyNocName: string = '';
  public TableUpdateType: string = '';
}

export class NOCIssuedDataModel {
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public FromDate: string = '';
  public ToDate: string = '';

}
export class NOCIssuedForDataModel {
  public ApplyNOCID: number = 0;
  public ParameterID: number = 0;
  public CreatedBy: number = 0;
  public Remark: string = '';
}
export class NOCIssuedRequestDataModel {
  public NOCDetails: GenerateNOC_DataModel[] = [];
  public AppliedNOCFor: NOCIssuedForDataModel[] = [];
}
export class ApplicationPenaltyDataModel {

  public PenaltyID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public ApplyNOCID: number = 0;
  public Penaltyfor: string = '';
  public PenaltyAmount: number = 0;
  public IsPayment: boolean = false;
  public CreatedBy: number = 0;

}
