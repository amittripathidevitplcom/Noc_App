export class ApplyNocParameterDataModel {
  public ApplyNocApplicationID: number = 0;

  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public ApplyNocFor: string = '';
  public ApplyNocCode: string = '';
  public FeeAmount: number = 0;
  public CollegeID: number = 0;
  public CollegeName: string = '';
  public ApplicationTypeID: number = null;
  public ApplicationTypeName: string = '';
  public TotalFeeAmount: number = 0;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;

  public SSOID: string = '';
  public TotalNocFee: number = 0;
  public LateFee: number = 0;
  public ExistingLetterofEOA: string = '';
  public ExistingLetterofEOA_Dis_FileName: string = '';
  public ExistingLetterofEOA_Path: string = '';


  public ApplyNocParameterMasterListDataModel: ApplyNocParameterMasterListDataModel[] = [];

  public ApplyNocParameterMasterList_TNOCExtension: ApplyNocParameterMaster_TNOCExtensionDataModel = null;
  public ApplyNocParameterMasterList_AdditionOfNewSeats60: ApplyNocParameterMaster_AdditionOfNewSeats60DataModel = null;

  public ApplyNocParameterMasterList_ChangeInNameOfCollege: ApplyNocParameterMasterList_ChangeInNameOfCollege = null;
  public ApplyNocParameterMasterList_ChangeInPlaceOfCollege: ApplyNocParameterMasterList_ChangeInPlaceOfCollege = null;
  public ApplyNocParameterMasterList_ChangeInCoedtoGirls: ApplyNocParameterMasterList_ChangeInCoedtoGirls = null;
  public ApplyNocParameterMasterList_ChangeInGirlstoCoed: ApplyNocParameterMasterList_ChangeInGirlstoCoed = null;
  public ApplyNocParameterMasterList_ChangeInCollegeManagement: ApplyNocParameterMasterList_ChangeInCollegeManagement = null;
  public ApplyNocParameterMasterList_MergerCollege: ApplyNocParameterMasterList_MergerCollege = null;

  public ApplyNocParameterMasterList_NewCourse: ApplyNocParameterMaster_TNOCExtensionDataModel = null;
  public ApplyNocParameterMasterList_NewCourseSubject: ApplyNocParameterMaster_TNOCExtensionDataModel = null;



  public ApplyNocParameterMasterList_TNOCExtOfSubject: ApplyNocParameterMaster_TNOCExtensionDataModel = null;
  public ApplyNocParameterMasterList_PNOCOfSubject: ApplyNocParameterMaster_TNOCExtensionDataModel = null;

  public ApplyNocLateFeeDetailList: ApplyNocLateFeeDetailDataModal[] = [];
  //DTE Rishi kapoor 17 01 2024
  public DTE_BankDetails!: ApplyNocParameterMasterList_BankDetails;
  public DTE_BankDetails_View: boolean = false;
  /*Change in the Minority Status of the Institution*/
  public DTE_ChangeInTheMinorityStatusoftheInstitution_View: boolean = false;
  public DTE_ChangeInTheMinorityStatusoftheInstitution: string = '';
  public DTE_ChangeInTheMinorityStatusoftheInstitution_Dis_FileName: string = '';
  public DTE_ChangeInTheMinorityStatusoftheInstitution_Path: string = '';
  public DTE_ChangeInTheMinorityStatusoftheInstitution_FeeAmount: number = 0;

  /*Merger of Institutions under the same Trust / Society / Company*/
  public DTE_MergerofInstitutions!: ApplyNocParameterMasterList_MergerofInstitutions;
  public DTE_MergerofInstitutions_View: boolean = false;

  /*Change in the name of Trust/Society/Company*/
  public DTE_ChangeinNameofSociety!: ApplyNocParameterMasterList_ChangeinNameofSociety;
  public DTE_ChangeinNameofSociety_View: boolean = false;

  /*Change in the name of Trust/Society/Company*/
  public DTE_IncreaseinIntakeAdditionofCourse!: ApplyNocParameterMasterList_IncreaseinIntakeAdditionofCourse;
  public DTE_IncreaseinIntakeAdditionofCourse_List: ApplyNocParameterMasterList_IncreaseinIntakeAdditionofCourse[] = [];
  public DTE_IncreaseinIntakeAdditionofCourse_View: boolean = false;

  /*To start new Programme/ Level in the existing Institutions*/
  public DTE_TostartNewProgramme!: ApplyNocParameterMasterList_TostartNewProgramme;
  public DTE_TostartNewProgramme_List: ApplyNocParameterMasterList_TostartNewProgramme[] = [];
  public DTE_TostartNewProgramme_View: boolean = false;


  /*Change in Name of Institution*/
  public DTE_ChangeInNameofInstitution!: ApplyNocParameterMasterList_ChangeInNameofInstitution;
  public DTE_ChangeInNameofInstitution_View: boolean = false;

  
  /*Change of Site/ Location*/
  public DTE_ChangeofSite_Location!: ApplyNocParameterMasterList_ChangeofSite_Location;
  public DTE_ChangeofSite_Location_View: boolean = false;

  /*Increase in Intake / Addition of Course*/
  public DTE_IncreaseInIntake_AdditionofCourse!: ApplyNocParameterMasterList_IncreaseInIntake_AdditionofCourse;
  public DTE_IncreaseInIntake_AdditionofCourse_List: ApplyNocParameterMasterList_IncreaseInIntake_AdditionofCourse[] = [];
  public DTE_IncreaseInIntake_AdditionofCourse_View: boolean = false;




  //Amit Kumar 
  public DTE_AdditionofIntegratedDualDegreeList: ApplyNocParameterMasterList_AdditionofIntegratedDualDegree[] = [];
  public DTE_AdditionofIntegratedDualDegree: ApplyNocParameterMasterList_AdditionofIntegratedDualDegree[] = [];
  public DTE_AdditionofIntegratedDualDegree_View: boolean = false;
  public DTE_ChangeInNameOfCourse: ApplyNocParameterMasterList_ChangeInNameOfCourse[] = [];
  public DTE_ChangeInNameOfCourseList: ApplyNocParameterMasterList_ChangeInNameOfCourse[] = [];
  public DTE_ChangeInNameOfCourse_View: boolean = false;
  public DTE_ReductionInIntakeList: ApplyNocParameterMasterList_ReductionInIntake[] = [];
  public DTE_ReductionInIntake: ApplyNocParameterMasterList_ReductionInIntake[] = [];
  public DTE_ReductionInIntake_View: boolean = false;
  public DTE_ClosureOfProgramList: ApplyNocParameterMasterList_ClosureOfProgram[] = [];
  public DTE_ClosureOfProgram: ApplyNocParameterMasterList_ClosureOfProgram[] = [];
  public DTE_ClosureOfProgram_View: boolean = false;
  public DTE_ClosureOfCoursesList: ApplyNocParameterMasterList_ClosureOfCourses[] = [];
  public DTE_ClosureOfCourses: ApplyNocParameterMasterList_ClosureOfCourses[] = [];
  public DTE_ClosureOfCourses_View: boolean = false;
  public DTE_MergerOfTheCourseList: ApplyNocParameterMasterList_MergerOfTheCourse[] = [];
  public DTE_MergerOfTheCourse: ApplyNocParameterMasterList_MergerOfTheCourse[] = [];
  public DTE_MergerOfTheCourse_View: boolean = false;

}

export class ApplyNocParameterMasterListDataModel {
  public ApplyNocID: number = 0;
  public ApplyNocFor: string = '';
  public FeeAmount: number = 0;
  public IsChecked: boolean = false;
  public ParameterCode?: string = '';
}
export class ApplyNocParameterMaster_TNOCExtensionDataModel extends ApplyNocParameterMasterListDataModel {
  public ApplyNocParameterCourseList: ApplyNocParameterCourseDataModel[] = [];
}



export class ApplyNocParameterCourseDataModel {
  public ApplyNocID: number = 0;
  public CourseID: number = 0;
  public CourseName: string = '';
  public IsChecked: boolean = false;
  public CollegeLevel: string = '';
  public CourseFeesAmount?: number = 0;
  public ApplyNocParameterSubjectList: ApplyNocParameterSubjectDataModel[] = [];
}
export class ApplyNocParameterSubjectDataModel {
  public ApplyNocID: number = 0;
  public CourseID: number = 0;
  public SubjectID: number = 0;
  public SubjectName: string = '';
  public IsChecked: boolean = false;
}
export class ApplyNocParameterMaster_AdditionOfNewSeats60DataModel extends ApplyNocParameterMasterListDataModel {
  public ApplyNocParameterCourseList: ApplyNocParameterCourseDataModel[] = [];
}

export class ApplyNocFDRDetailsDataModel {
  public ApplyNocFDRID: number = 0;
  public ApplyNocID: number = 0;
  public CollegeID: number = 0;
  public CollegeName: string = '';
  public CourseType: string = '';
  public CollegeType: string = '';
  public DepartmentID: number = 0;
  public Amount: number = 0;
  public BankName: string = '';
  public BranchName: string = '';
  public IFSCCode: string = '';
  public FDRNumber: number = null;
  public FDRAmount: number = null;
  public FDRDate: string = '';
  public PeriodOfFDR: string = '0';
  public IsFDRSubmited: boolean = false;
  public FDRDocument: string = '';
  public FDRDocumentPath: string = '';
  public FDRDocument_Dis_FileName: string = '';
  public FDRExpriyDate: string = '';

}

// list details
export class ApplyNocApplicationDataModel {
  public ApplyNocApplicationID: number = 0;
  public ApplicationNo: string = '';
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public CollegeName: string = '';
  public CollegeMobileNo: string = '';
  public CollegeEmail: string = '';
  public SocietyName: string = '';
  public DepartmentName: string = '';
  public CollegeStatus: string = '';
  public CollegeType: string = '';
  public CollegeMedium: string = '';
  public UniversityName: string = '';
  public CollegeMobileNumber: string = '';
  public CollegeLandlineNumber: string = '';
  public FullAddress: string = '';
  public CreateDate: string = '';
  public GeoTagging: string = '';
  public CollegeRegistrationNo: string = '';
  public ApplicationTypeID: number = null;
  public ApplicationTypeName: string = '';
  public TotalFeeAmount: number = 0;
  public ApplicationStatus: boolean = false;
  public IsMakePayment_ApplicationFee: boolean = false;
  public IsFinalSubmit: boolean = false;
  public IsSaveFDR: boolean = false;
  public IsMakePayment: boolean = false;
  public IsNOCIssued: boolean = false;
  public NOCFilePath: string = '';
  public ApplicationFeeAmount: number = 0;
  public ServiceId: number = 0;
  public ApplyNocApplicationParameterList: ApplyNocApplicationParameterDataModel[] = [];

  public ChangeInPlaceOfCollegeList?: ApplyNocParameterMasterList_ChangeInPlaceOfCollege[] = [];

  public ChangeInNameOfCollegeList?: ApplyNocParameterMasterList_ChangeInNameOfCollege[] = [];
  public ChangeInCoedtoGirlsList?: ApplyNocParameterMasterList_ChangeInCoedtoGirls[] = [];
  public ChangeInGirlstoCoedList?: ApplyNocParameterMasterList_ChangeInGirlstoCoed[] = [];
  public ChangeInCollegeManagementList?: ApplyNocParameterMasterList_ChangeInCollegeManagement[] = [];
  public MergerCollegeList?: ApplyNocParameterMasterList_MergerCollege[] = [];




}
export class ApplyNocApplicationParameterDataModel {
  public ApplyNocParameterDetailID: number = 0;
  public ApplyNocApplicationID: number = 0;
  public ApplyNocParameterID: number = 0;
  public ApplyNocFor: string = '';
  public FeeAmount: number = 0;
  public ParameterCode: string = '';
  public ApplyNocApplicationDetailList: ApplyNocApplicationDetailDataModel[] = [];
}
export class ApplyNocApplicationDetailDataModel {
  public ApplyNocApplicationID: number = 0;
  public ApplyNocParameterID: number = 0;
  public CourseID: number = 0;
  public CourseName: string = '';
  public SubjectID: string = '';
  public SubjectName: string = '';

}


//DCE

export class ApplyNocParameterMasterList_ChangeInNameOfCollege {
  public ApplyNocID: number = 0;
  public FeeAmount: number = 0;
  public NewNameEnglish: string = '';
  public NewNameHindi: string = '';
  public Dis_DocumentName: string = '';
  public DocumentName: string = '';
  public DocumentPath: string = '';
}

export class ApplyNocParameterMasterList_ChangeInPlaceOfCollege {
  public ApplyNocID: number = 0;
  public FeeAmount: number = 0;
  public PlaceName: string = '';
  public Dis_DocumentName: string = '';
  public DocumentName: string = '';
  public DocumentPath: string = '';
  public Dis_PlaceDocumentName: string = '';
  public PlaceDocumentName: string = '';
  public PlaceDocumentPath: string = '';
}

export class ApplyNocParameterMasterList_ChangeInCoedtoGirls {
  public ApplyNocID: number = 0;
  public FeeAmount: number = 0;
  public Dis_ConsentManagementDocument: string = '';
  public ConsentManagementDocument: string = '';
  public ConsentManagementDocumentPath: string = '';
}

export class ApplyNocParameterMasterList_ChangeInGirlstoCoed {
  public ApplyNocID: number = 0;
  public FeeAmount: number = 0;
  public Dis_ConsentManagementDocument: string = '';
  public ConsentManagementDocument: string = '';
  public ConsentManagementDocumentPath: string = '';
  public Dis_ConsentStudentDocument: string = '';
  public ConsentStudentDocument: string = '';
  public ConsentStudentDocumentPath: string = '';
}
export class ApplyNocParameterMasterList_ChangeInCollegeManagement {
  public ApplyNocID: number = 0;
  public NewSocietyName: string = '';
  public FeeAmount: number = 0;
  public Dis_DocumentName: string = '';
  public DocumentName: string = '';
  public DocumentPath: string = '';
  public Dis_AnnexureDocument: string = '';
  public AnnexureDocument: string = '';
  public AnnexureDocumentPath: string = '';
}

export class ApplyNocParameterMasterList_MergerCollege {
  public ApplyNocID: number = 0;
  public FeeAmount: number = 0;

  public Dis_SocietyProposal: string = '';
  public SocietyProposal: string = '';
  public SocietyProposalPath: string = '';

  public Dis_AllNOC: string = '';
  public AllNOC: string = '';
  public AllNOCPath: string = '';

  public Dis_UniversityAffiliation: string = '';
  public UniversityAffiliation: string = '';
  public UniversityAffiliationPath: string = '';

  public Dis_NOCAffiliationUniversity: string = '';
  public NOCAffiliationUniversity: string = '';
  public NOCAffiliationUniversityPath: string = '';

  public Dis_ConsentAffidavit: string = '';
  public ConsentAffidavit: string = '';
  public ConsentAffidavitPath: string = '';

  public Dis_OtherAllNOC: string = '';
  public OtherAllNOC: string = '';
  public OtherAllNOCPath: string = '';

  public Dis_OtherUniversityAffiliation: string = '';
  public OtherUniversityAffiliation: string = '';
  public OtherUniversityAffiliationPath: string = '';

  public Dis_OtherNOCAffiliationUniversity: string = '';
  public OtherNOCAffiliationUniversity: string = '';
  public OtherNOCAffiliationUniversityPath: string = '';

  public Dis_OtherConsentAffidavit: string = '';
  public OtherConsentAffidavit: string = '';
  public OtherConsentAffidavitPath: string = '';

  public Dis_LandTitleCertificate: string = '';
  public LandTitleCertificate: string = '';
  public LandTitleCertificatePath: string = '';

  public Dis_BuildingBluePrint: string = '';
  public BuildingBluePrint: string = '';
  public BuildingBluePrintPath: string = '';

  public Dis_StaffInformation: string = '';
  public StaffInformation: string = '';
  public StaffInformationPath: string = '';
}


export class ApplyNocLateFeeDetailDataModal {
  public ID: number = 0;
  public DepartmentID: number = 0;
  public LateFeeID: number = 0;
  public FeesType: string = '';
  public FeesAmount: number = 0;
  public StartDate: string = '';
  public EndDate: string = '';
}

export class ApplyNocOfflinePaymentModal {
  public ID: number = 0;
  public DepartmentID: number = 0;
  public ApplyNOCID: number = 0;
  public CollegeID: number = 0;
  public PaymentMode: string = '';
  public BankName: string = '';
  public Amount: number = 0;
  public DateofIssuance: string = '';
  public DateofExpiry: string = '';
  public FileName: string = '';
  public Dis_FileName: string = '';
  public FilePath: string = '';
  public ActionName: string = '';
}
export class ApplyNocParameterMasterList_BankDetails {
  public BankDetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public OldBankName: string = '';
  public NewBankName: string = '';
  public OldBranchName: string = '';
  public NewBranchName: string = '';
  public OldIFSC: string = '';
  public NewIFSC: string = '';
  public OldAccountNumber: string = '';
  public NewAccountNumber: string = '';
  public FeeAmount: number = 0;

}

export class ApplyNocParameterMasterList_MergerofInstitutions {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;

  public InstituteID1: number = 0;
  public InstituteID2: number = 0;
  public MergeInstituteID: number = 0;
  public FeeAmount: number = 0;
}

export class ApplyNocParameterMasterList_ChangeinNameofSociety {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;

  public CurrentName: string = '';
  public NewName: string = '';
  public FeeAmount: number = 0;
}
export class ApplyNocParameterMasterList_IncreaseinIntakeAdditionofCourse {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public CourseName: string = '';
  public CourseID: number = 0;
  public Intake: number = 0;
  public FeeAmount: number = 0;
}
export class ApplyNocParameterMasterList_TostartNewProgramme {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public CourseName: string = '';
  public CourseID: number = 0;
  public StreamID: number = 0;
  public StreamName: string = '';
  public CourseLevelID: number = 0;
  public CourseLevelName: string = '';
  public Intake: number = 0;
  public FeeAmount: number = 0;
}

export class ApplyNocParameterMasterList_ChangeInNameofInstitution {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;

  public CurrentCollegeName: string = '';
  public NewCollegeName: string = '';
  public NewCollegeNameHi: string = '';
  public FeeAmount: number = 0;
}
export class ApplyNocParameterMasterList_ChangeofSite_Location {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;

  public CurrentAddress: string = '';
  public NewAddress: string = '';
  public FeeAmount: number = 0;
}

export class ApplyNocParameterMasterList_IncreaseInIntake_AdditionofCourse {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public CourseName: string = '';
  public CourseID: number = 0;
  public Intake: number = 0;
  public UpdatedIntake: number = 0;
  public FeeAmount: number = 0;
}


//Amit
export class ApplyNocParameterMasterList_AdditionofIntegratedDualDegree {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public Intake: number = 0;
  public FeeAmount: number = 0;
  public CourseName: string = '';
  public StreamID: number = 0;
  public StreamName: string = '';
  public CourseLevelID: number = 0;
  public CourseLevelName: string = '';
}
export class ApplyNocParameterMasterList_ChangeInNameOfCourse {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public NewCourseName: string = '';
  public FeeAmount: number = 0;
  public CourseName: string = '';
}
export class ApplyNocParameterMasterList_ReductionInIntake {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public CurrentIntake: number = 0;
  public ReducedIntake: number = 0;
  public FeeAmount: number = 0;
  public CourseName: string = '';
}

export class ApplyNocParameterMasterList_ClosureOfProgram {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public FeeAmount: number = 0;
  public CourseName: string = '';
}

export class ApplyNocParameterMasterList_ClosureOfCourses {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public CurrentIntake: number = 0;
  public ReducedIntake: number = 0;
  public FeeAmount: number = 0;
  public CourseName: string = '';
}

export class ApplyNocParameterMasterList_MergerOfTheCourse {
  public DetailID: number = 0;
  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public CourseID1: number = 0;
  public CourseID2: number = 0;
  public MergerCourseID: number = 0;
  public FeeAmount: number = 0;
  public CourseName: string = '';
  public CourseName1: string = '';
  public MergeCourseName: string = '';
}

