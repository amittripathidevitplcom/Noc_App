export class BasicDetailsDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0;

 
  
  public AisheCode: string = "";
  public Nameofinstitution: string = "";
  public YearofEstablishment: string = "";
  public StatusPriorToEstablishment: string = "";
  public YearDeclaredUniversityInstitute: string = "";
  public TypeOfInstitution: string = "";
  public OwnershipStatusOfInstitution: string = "";
  public Institutionfromonegender: string = "";
  public InstituteUnnatBharatScheme: string = "";
  public MinorityManagedInstitution: string = "";
  public IsInstitutionNCC: string = "";
  public EnrolledStudentInNCC: number = 0;
  public EnrolledFemaleStudentInNCC: number = 0;
  public EnrolledTotalStudentInNCC: number = 0;
  public IsInstitutionNSS: string = "";
  public EnrolledStudentInNSS: number = 0;
  public EnrolledFemaleStudentInNSS: number = 0;
  public EnrolledTotalStudentInNSS: number = 0;
  public IsspecializedUniversity: string = "";
  public AffiliatedInstitutions: string = "";

  public SpecialisationDetails: BasicDetails_SpecialisationDetailsDataModel[] = [];
  public CollegeUnderUniversityDetails: BasicDetails_CollegeUnderUniversityDetailsDataModel[] = [];
  public InstituteHeadDetails: BasicDetails_InstituteHeadDetailsDataModel = new BasicDetails_InstituteHeadDetailsDataModel();
  public NodalOfficerDetails: BasicDetails_NodalOfficerDetailsDataModel = new BasicDetails_NodalOfficerDetailsDataModel();
  public AffiliationDetails: BasicDetails_AffiliationDetailsDataModel = new BasicDetails_AffiliationDetailsDataModel();



  public ManagementOfTheInstitution: string = "";
  public IsEveningCollege: string = "";
  public AutonomousInstitute: string = "";
  public MinorityCommunityType: string = "";

  public EnrolledStudentInNCCOtherInstitute: number = 0;
  public EnrolledFemaleStudentInNCCOtherInstitute: number = 0;

  public SpecialisedUniversity: string = "";
  public OtherSpecialisedUniversity: string = "";
  public WhetherTheCollegeRunningDiplomaLevelCourse: string = "";
  public DiplomaLevelCourse: string = "";
  public OtherDiplomaCourse: string = "";
  public WhetherAwardsDegreethroughAnyUniversity: string = "";
  public OtherUniversityName: string = "";

}

export class BasicDetails_SpecialisationDetailsDataModel {
  public EntryID: number = 0;
  public AID: number = 0;
  public Specialisation: string = "";
  public NoOfCollegesPermanentAffiliation: number = 0;
  public NoOfCollegesTemporaryAffiliation: number = 0;
  public Total: number = 0;
}

export class BasicDetails_CollegeUnderUniversityDetailsDataModel {
  public EntryID: number = 0;
  public AID: number = 0;
  public FID: number = 0;
  public College: string = "";
  public NoOfColleges: number = 0;
}

export class BasicDetails_InstituteHeadDetailsDataModel {
  public EntryID: number = 0;
  public AID: number = 0;
  public NameOfUniversityNodalOfficerForAISHE: string = "";
  public Email: string = "";
  public DesignationID: number = 0;
  public DesignationName: string = "";
  public MobileNo: string = "";
  public TelephoneNo: string = "";
}
export class BasicDetails_NodalOfficerDetailsDataModel {
  public EntryID: number = 0;
  public AID: number = 0;
  public NameOfUniversityNodalOfficerForAISHE: string = "";
  public Email: string = "";
  public DesignationID: number = 0;
  public DesignationName: string = "";
  public MobileNo: string = "";
  public TelephoneNo: string = "";
}
export class BasicDetails_AffiliationDetailsDataModel {
  public EntryID: number = 0;
  public AID: number = 0;
  public NameStatutorybody: string = "";
  public AffiliationYear: string = "";
  public AffiliatedOtherUniversity: string = "";
}


