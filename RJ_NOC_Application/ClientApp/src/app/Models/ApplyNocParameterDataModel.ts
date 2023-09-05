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


export class ApplyNocLateFeeDetailDataModal
{
  public ID: number = 0;
  public DepartmentID: number = 0;
  public LateFeeID: number = 0;
  public FeesType: string = '';
  public FeesAmount: number = 0;
  public StartDate: string = '';
  public EndDate: string = '';
}


