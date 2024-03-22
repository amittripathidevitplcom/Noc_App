export class ScholarshipFellowshipLoanAccDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0;

  public EntryType: string = "Regular Mode";
  public ProgrammesDetails: ScholarshipFellowshipLoanAccDataModel_ProgrammesDetails[] = [];
 

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;


}

export class ScholarshipFellowshipLoanAccDataModel_ProgrammesDetails {
  public Faculty_School: string = "";
  public Department_Centre: string = "";
  public LevelID: number = 0;
  public LevelName: string = "";
  public Discipline: string = "";
  public Year: number = 0;
  public Month: number = 0;
  public StudentDetails: ScholarshipFellowshipLoanAccDataModel_StudentDetails[] = [];


  public Category: string = "";
  public GeneralCategorySeatsEarmarkedAsPerGOI: number = 0;
  public GeneralCategoryMale: number = 0;
  public GeneralCategoryFemale: number = 0;
  public GeneralCategoryTransGender: number = 0;

  public EWSCategorySeatsEarmarkedAsPerGOI: number = 0;
  public EWSCategoryMale: number = 0;
  public EWSCategoryFemale: number = 0;
  public EWSCategoryTransGender: number = 0;

  public SCCategorySeatsEarmarkedAsPerGOI: number = 0;
  public SCCategoryMale: number = 0;
  public SCCategoryFemale: number = 0;
  public SCCategoryTransGender: number = 0;

  public STCategorySeatsEarmarkedAsPerGOI: number = 0;
  public STCategoryMale: number = 0;
  public STCategoryFemale: number = 0;
  public STCategoryTransGender: number = 0;

  public OBCCategorySeatsEarmarkedAsPerGOI: number = 0;
  public OBCCategoryMale: number = 0;
  public OBCCategoryFemale: number = 0;
  public OBCCategoryTransGender: number = 0;

  public TotalCategorySeatsEarmarkedAsPerGOI: number = 0;
  public TotalCategoryMale: number = 0;
  public TotalCategoryFemale: number = 0;
  public TotalCategoryTransGender: number = 0;
  public Remark: string = "";
  public trCss: string = "";

}
export class ScholarshipFellowshipLoanAccDataModel_StudentDetails {
  public Category: string = "";
  public GeneralCategorySeatsEarmarkedAsPerGOI: number = 0;
  public GeneralCategoryMale: number = 0;
  public GeneralCategoryFemale: number = 0;
  public GeneralCategoryTransGender: number = 0;

  public EWSCategorySeatsEarmarkedAsPerGOI: number = 0;
  public EWSCategoryMale: number = 0;
  public EWSCategoryFemale: number = 0;
  public EWSCategoryTransGender: number = 0;

  public SCCategorySeatsEarmarkedAsPerGOI: number = 0;
  public SCCategoryMale: number = 0;
  public SCCategoryFemale: number = 0;
  public SCCategoryTransGender: number = 0;

  public STCategorySeatsEarmarkedAsPerGOI: number = 0;
  public STCategoryMale: number = 0;
  public STCategoryFemale: number = 0;
  public STCategoryTransGender: number = 0;

  public OBCCategorySeatsEarmarkedAsPerGOI: number = 0;
  public OBCCategoryMale: number = 0;
  public OBCCategoryFemale: number = 0;
  public OBCCategoryTransGender: number = 0;

  public TotalCategorySeatsEarmarkedAsPerGOI: number = 0;
  public TotalCategoryMale: number = 0;
  public TotalCategoryFemale: number = 0;
  public TotalCategoryTransGender: number = 0;

}
