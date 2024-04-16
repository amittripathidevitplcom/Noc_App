export class ScholarshipFellowshipLoanAccDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0; 
  public EntryType: string = "Regular Mode"; 
  public Scholarship: ScholarshipFellowshipLoanAccDataModel_Scholarship[] = [];
  public Fellowship: ScholarshipFellowshipLoanAccDataModel_Scholarship[] = [];
  public Loan: ScholarshipFellowshipLoanAccDataModel_Scholarship[] = [];
  public ACC: ScholarshipFellowshipLoanAccDataModel_ACC[] = []; 
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0; 
}
export class ScholarshipFellowshipLoanAccDataModel_Scholarship {
  public RowNo: number = 0;
  public SID: number = 0;
  public EntryType: string = "";
  public Type: string = "";
  public Category: string = "";
  public General_Total: number = 0;
  public General_Female: number = 0;
  public General_TransGender: number = 0;
  public EWS_Total: number = 0;
  public EWS_Female: number = 0;
  public EWS_TransGender: number = 0;
  public SC_Total: number = 0;
  public SC_Female: number = 0;
  public SC_TransGender: number = 0;
  public ST_Total: number = 0;
  public ST_Female: number = 0;
  public ST_TransGender: number = 0;
  public OBC_Total: number = 0;
  public OBC_Female: number = 0;
  public OBC_TransGender: number = 0;
  public TOTAL_Total: number = 0;
  public TOTAL_Female: number = 0;
  public TOTAL_TransGender: number = 0;
  public Remarks: string = "";
}

export class ScholarshipFellowshipLoanAccDataModel_ACC {
  public SNo: number = 0;
  public Name: string = "";
  public AccreditationBody: string = "";
  public IsScoreProvided: string = "";
  public MaximumScore: string = "";
  public Score: string = "";
  public CycleofAccreditatio: string = "";
  public StatusofAccreditation: string = "";
  public DateifAccreditationValidity: string = "";
  public Grade: string = "";
}

