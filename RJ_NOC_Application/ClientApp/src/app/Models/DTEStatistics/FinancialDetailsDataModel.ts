export class FinancialDetailsDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0;

  public EntryType: string = "FinancialDetails";
  public FinancialDetails_Income: FinancialDetailsDataModel_FinancialDetails[] = [];
  public FinancialDetails_Expenses: FinancialDetailsDataModel_FinancialDetails[] = [];

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;
}

export class FinancialDetailsDataModel_FinancialDetails {
  public FID: number = 0;
  public EntryType: string = '';
  public SNoText: string = '';
  public Item: string = '';
  public Amount: number = 0;
}
