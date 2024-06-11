export class DCENOCReportSearchFilterDataModel {
  public DistrictID: number = 0
  public UniversityID: number = 0
  public CollegeName: string = ''
  public CollegeEmail: string = ''
  public NOCStatusID: number = 0;
  public WorkFlowActionID: number = 0
  public NodelOfficerID: number = 0
  public CollegeTypeID: number = 0
  public FromSubmitDate: string = ''
  public ToSubmitDate: string = ''
  public ApplicationTypeID: number = 0
  public SearchStaticsID: number = 0
  public ApplicationID: number = null
  public ReportStatus: string = ''
  public ApplicationStatusID: number = 0
  public YearNewExistingID: number = 0
}
export class TotalCollegeReportSearchFilter {
  public DepartmentID: number = 0
  public UniversityID: number = 0
  public DivisionID: number = 0
  public DistrictID: number = 0
  public CollegeName: string = ''
}
export class DCECollegesReportSearchFilter {
  public DepartmentID: number = 0;
  public CollegeName: string = '';
  public NOCStatusID: number = 0;
  public ApplicationStatusID: number = 0;
  public FromSubmittedDate: string = '';
  public ToSubmittedDate: string='';
  public CollegeTypeID: number = 0;
  public CollegeMobileNo: string='';
  public CollegeEmail: string = '';
  public StatusOfCollegeID: number=0;
  public CollegeLevelID: number=0;
  public DivisionID: number=0;
  public DistrictID: number=0;
  public SubDivisionID: number=0;
  public TehsilID: number=0;
  public ParliamentID: number=0;
  public AssemblyID: number = 0;
  public PermanentAddress: string = '';
  public CityTownVillage: string = '';
  public PinCode: string = '';
  public LandlineNo: string = '';
  public AdditionalMobileNo: string = '';
  public FaxNo: string = '';
  public Website: string = '';
  public NodalOfficerID: number=0;
  public EstablishmentYearID: number = 0;
  public ApplicationTypeID: number=0;
  public LandAreaID: number=0;
  public LandDocumentID: number=0;
  public LandConversionID: number=0;
  public AgricultureLandArea: number=0;
  public CommercialLandArea: number=0;
  public InstitutionalLandArea: number=0;
  public ResidentialLandArea: number = 0;
  public AgricultureKhasraNo: string ='';
  public CommercialKhasraNo: string ='';
  public InstitutionalKhasraNo: string ='';
  public ResidentialKhasraNo: string ='';
  public FromAffidavitDate: string ='';
  public ToAffidavitDate: string = '';
  public UniversityID: number=0;
  public CourseID: number=0;
  public SubjectID: number=0;
  public UrbanRuralID: number=0;
  public CollegeNAACID: number = 0;
  public AISHECode: string='';
  public ApplicationId: string='';
}
export class GrievanceReportSearchFilter {
  public FromDate: string = '';
  public ToDate: string = '';
  public searchText = '';
}


export class SSOUpdateDataModelSearchFilter {
  public DepartmentID: number = 0
  public UniversityID: number = 0
  public DivisionID: number = 0
  public DistrictID: number = 0
  public CollegeName: string = ''
  public UserID: number = 0
  public CollegeID: number = 0
  public SSOID: number =0

}


export class DCECollegesReportSearchFilterAllData {
  public CollegeID: boolean = true;
  public CollegeNameEn: boolean = true;
  public CollegeNameHi: boolean = true;
  public NOCStatus: boolean = true;
  public ApplicationStatus: boolean = true;
  public SubmittedDate: boolean = true;
  public CollegeType: boolean = true;
  public MobileNumber: boolean = true;
  public Email: boolean = true;
  public StatusofCollege: boolean = true;
  public CollegeLevel: boolean = true;
  public Division_English: boolean = true;
  public District_Eng: boolean = true;
  public SubdivisionName: boolean = true;
  public TehsilName: boolean = true;
  public ParliamentAreaName: boolean = true;
  public AssembelyAreaName: boolean = true;
  public PermanentAddress: boolean = true;
  public CityTownVillage: boolean = true;
  public Pincode: boolean = true;
  public CollegeLandlineNumber: boolean = true;
  public WebsiteLink: boolean = true;
  public NodalOfficer: boolean = true;
  public FinancialYearName: boolean = true;
  public ApplyNocFor: boolean = true;
  public LandAreaName: boolean = true;
  public LandDocumentTypeName: boolean = true;
  public LandConverted: boolean = true;
  public Agr_LandArea: boolean = true;
  public Com_LandArea: boolean = true;
  public Ins_LandArea: boolean = true;
  public Res_LandArea: boolean = true;
  public Agr_KhasraNo: boolean = true;
  public Com_KhasraNo: boolean = true;
  public Ins_KhasraNo: boolean = true;
  public Res_KhasraNo: boolean = true;
  public LandConversion: boolean = true;
  public AffidavitDate: boolean = true;
  public UniversityName: boolean = true;
  public CoursesAndSubjectInfo: boolean = true;
  public CollegeNAACAccredited: boolean = true;
  public SocietyName: boolean = true;
  public SecretaryName: boolean = true;
  public SecretaryMobile: boolean = true;
  public SecretaryAadhar: boolean = true;
  public SecretaryEmail: boolean = true;
  public PresidentName: boolean = true;
  public PresidentMobile: boolean = true;
  public PresidentAadhar: boolean = true;
  public PresidentEmail: boolean = true;
  public AcademicInfo: boolean = true;
  public FDRNumber: boolean = true;
  public FDRAmount: boolean = true;
  public FDRDate: boolean = true;
  public TeachingFaculityDetails: boolean = true;
  public NodalMobile: boolean = true;
  public NodalEmail: boolean = true;
  public PrincipalName: boolean = true;
  public AISHECode: boolean = true;
  public ApplyNocApplicationID: boolean = true;

}
 
export class CourseReportSearchFilter {

  public DepartmentID: number = 0;

  public CollegeName: string = '';

  public CollegeTypeID: number = 0;

  public Institution: number = 0;

  public UniversityName: number = 0;

  public CollegeID: number = 0;

  public NOCStatusID: number = 0;

  public UniversityID: number = 0;

  public CourseID: number = 0;

  public CourseName: number = 0;

  public SubjectID: number = 0;

  public SubjectName: number = 0;

  public NOCNumber: number = 0;

  public StatusOfCollegeID: number = 0;

  public CourseNOCStatusID: number = 0;

  public CourseNOCStatus: number = 0;

  public SubjectNOCStatusID: number = 0;

  public SubjectNOCStatus: number = 0;

  public CourseTypeID: number = 0;

  public CourseType: number = 0;

  public SubjectNOCDate: string = '';

  public SubjectNOCOrderNo: number = 0;

  public EnrolledStudent: number = 0;

  public StatusOfCollege: number = 0;

  public NoOfEnrolledStudents: number = 0;

  public searchText = '';

  public FromSubmittedNOCDate: string = '';

  public ToSubmittedNOCDate: string = '';

}
export class CourseReportSearchFilterLst {
  public DepartmentID: boolean = true;
  public CollegeName: boolean = true;
  public CollegeTypeID: boolean = true;
  public CollegeID: boolean = true;
  public Institution: boolean = true;
  public NOCStatusID: boolean = true;
  public UniversityID: boolean = true;
  public UniversityName: boolean = true;
  public CourseID: boolean = true;
  public CourseName: boolean = true;
  public SubjectID: boolean = true;
  public SubjectName: boolean = true;
  public StatusOfCollegeID: boolean = true;
  public StatusOfCollege: boolean = true;
  public CourseNOCStatusID: boolean = true;
  public CourseNOCStatus: boolean = true;
  public SubjectNOCStatusID: boolean = true;
  public SubjectNOCStatus: boolean = true;
  public CourseTypeID: boolean = true;
  public CourseType: boolean = true;
  public SubjectNOCDate: boolean = true;
  public SubjectNOCOrderNo: boolean = true;
  public EnrolledStudent: boolean = true;
  public NoOfEnrolledStudents: boolean = true;
  public searchText = '';
  public FromSubmittedNOCDate: boolean = true;
  public ToSubmittedNOCDate: boolean = true;
  public NOCNumber: boolean = true;
}
