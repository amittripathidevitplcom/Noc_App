export class DTEAffiliationAddCourseDataModel {
  public BTERCourseID: number = 0; 
  public CourseStatusId: number = 0;
  public CourseTypeId: number = 0;
  public CourseId: number = 0;
  public CourseIntakeAsPerAICTELOA: string = '';
  public ShiftID: number = 0;
  public Yearofstarting: string = '';
  public BterBranchTypeId: number = 0;  
  public FirstYearRegularStudent: number = 0;
  public FirstYearExStudent: number = 0;
  public FirstYearTotal: number = 0;
  public SecondYearRegularStudent: number = 0;
  public SecondYearExStudent: number = 0;
  public SecondYearTotal: number = 0;
  public ThirdYearRegularStudent: number = 0;
  public ThirdYearExStudent: number = 0;
  public ThirdYearTotal: number = 0; 
  public GovtNOCAvailableforclosure: string = '';
  public NOCNumber: string = '';
  public NOCDate: string = '';
  public NOCClosingYearId: number = 0;
  public NOCCUploadDocument: string = '';
  public NOCCUploadDocumentPath: string = '';
  public NOCCUploadDocument_Dis_FileName: string = '';
  public LegalEntityManagementType: string = '';
  public DepartmentID: number = 0;
  public BTERRegID: number = 0;
  public RegAffiliationStatusId: number = 0;
  public UserID: number = 0;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public FinancialYearName: string = '';
  public CourseName: string = '';
  public BTERAffiliationfeesDetails: BTERAffiliationfeesdeposited[] = [];
  
}
export class BTERAffiliationfeesdeposited {
  public AffiliationfeeID: number = 0;
  public AffiliationRegID: number = 0;
  public CollegeStatusId: number = 0;
  public AffiliationCourseIDs: number = 0;
  public FinancialYearID: number = 0;
  public FeesAmount: number = 0;
  public FinancialYearName: string = '';
}
export class DTEAffiliationAddCoursePreviewDataModel {
  public AffiliationCourseID: number = 0;
  public DepartmentID: number = 0;
  public AffiliationCourseType: string = '';
  public CourseIntakeAsPerAICTELOA: string = '';
  public CourseName: string = '';
  public ShiftName: string = '';
  public AffiliationBranchType: string = '';
}




