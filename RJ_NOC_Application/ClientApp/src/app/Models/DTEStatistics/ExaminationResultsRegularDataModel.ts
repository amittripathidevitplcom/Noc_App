export class ExaminationResultsRegularDataModel {
  public EntryID: number = 0;
  public EntryDate: string = "";
  public Department: number = 0;
  public CollegeID: number = 0;
  public SelectedCollegeEntryTypeName: string = "University";
  public FYearID: number = 0;

  public EntryType: string = "Examination Results Regular";
  public ProgrammesDetails: ExaminationResultsRegularDataModel_ProgrammesDetails[] = [];
 

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;


}

export class ExaminationResultsRegularDataModel_ProgrammesDetails {
  public Faculty_School: string = "";
  public Department_Centre: string = "";
  public LevelID: number = 0;
  public LevelName: string = "";
  public Discipline: string = "";
  
  public StudentDetails: ExaminationResultsRegularDataModel_StudentDetails[] = [];

  //Total Number of Students Appeard in Final Year
  public AppeardCategory: string = "";
  public AppeardGeneralCategoryMale: number = 0;
  public AppeardGeneralCategoryFemale: number = 0;
  public AppeardGeneralCategoryTransGender: number = 0;

  public AppeardEWSCategoryMale: number = 0;
  public AppeardEWSCategoryFemale: number = 0;
  public AppeardEWSCategoryTransGender: number = 0;

  public AppeardSCCategoryMale: number = 0;
  public AppeardSCCategoryFemale: number = 0;
  public AppeardSCCategoryTransGender: number = 0;

  public AppeardSTCategoryMale: number = 0;
  public AppeardSTCategoryFemale: number = 0;
  public AppeardSTCategoryTransGender: number = 0;

  public AppeardOBCCategoryMale: number = 0;
  public AppeardOBCCategoryFemale: number = 0;
  public AppeardOBCCategoryTransGender: number = 0;
   
  public AppeardTotalCategoryMale: number = 0;
  public AppeardTotalCategoryFemale: number = 0;
  public AppeardTotalCategoryTransGender: number = 0;

  public AppeardRemark: string = "";
  public trCss: string = "";


  //Total Number of Students Passed/Awarded Degree
  public PassedCategory: string = "";
  public PassedGeneralCategoryMale: number = 0;
  public PassedGeneralCategoryFemale: number = 0;
  public PassedGeneralCategoryTransGender: number = 0;

  public PassedEWSCategoryMale: number = 0;
  public PassedEWSCategoryFemale: number = 0;
  public PassedEWSCategoryTransGender: number = 0;

  public PassedSCCategoryMale: number = 0;
  public PassedSCCategoryFemale: number = 0;
  public PassedSCCategoryTransGender: number = 0;

  public PassedSTCategoryMale: number = 0;
  public PassedSTCategoryFemale: number = 0;
  public PassedSTCategoryTransGender: number = 0;

  public PassedOBCCategoryMale: number = 0;
  public PassedOBCCategoryFemale: number = 0;
  public PassedOBCCategoryTransGender: number = 0;

  public PassedTotalCategoryMale: number = 0;
  public PassedTotalCategoryFemale: number = 0;
  public PassedTotalCategoryTransGender: number = 0;

  public PassedRemark: string = "";

  //Out of Total, Number of Students Passed with 60% or above
  public OutofTotalPassedCategory: string = "";
  public OutofTotalPassedGeneralCategoryMale: number = 0;
  public OutofTotalPassedGeneralCategoryFemale: number = 0;
  public OutofTotalPassedGeneralCategoryTransGender: number = 0;

  public OutofTotalPassedEWSCategoryMale: number = 0;
  public OutofTotalPassedEWSCategoryFemale: number = 0;
  public OutofTotalPassedEWSCategoryTransGender: number = 0;

  public OutofTotalPassedSCCategoryMale: number = 0;
  public OutofTotalPassedSCCategoryFemale: number = 0;
  public OutofTotalPassedSCCategoryTransGender: number = 0;

  public OutofTotalPassedSTCategoryMale: number = 0;
  public OutofTotalPassedSTCategoryFemale: number = 0;
  public OutofTotalPassedSTCategoryTransGender: number = 0;

  public OutofTotalPassedOBCCategoryMale: number = 0;
  public OutofTotalPassedOBCCategoryFemale: number = 0;
  public OutofTotalPassedOBCCategoryTransGender: number = 0;

  public OutofTotalPassedTotalCategoryMale: number = 0;
  public OutofTotalPassedTotalCategoryFemale: number = 0;
  public OutofTotalPassedTotalCategoryTransGender: number = 0;

  public OutofTotalPassedRemark: string = "";

}
export class ExaminationResultsRegularDataModel_StudentDetails {
  //Total Number of Students Appeard in Final Year
  public AppeardCategory: string = "";
  public AppeardGeneralCategoryMale: number = 0;
  public AppeardGeneralCategoryFemale: number = 0;
  public AppeardGeneralCategoryTransGender: number = 0;

  public AppeardEWSCategoryMale: number = 0;
  public AppeardEWSCategoryFemale: number = 0;
  public AppeardEWSCategoryTransGender: number = 0;

  public AppeardSCCategoryMale: number = 0;
  public AppeardSCCategoryFemale: number = 0;
  public AppeardSCCategoryTransGender: number = 0;

  public AppeardSTCategoryMale: number = 0;
  public AppeardSTCategoryFemale: number = 0;
  public AppeardSTCategoryTransGender: number = 0;

  public AppeardOBCCategoryMale: number = 0;
  public AppeardOBCCategoryFemale: number = 0;
  public AppeardOBCCategoryTransGender: number = 0;

  public AppeardTotalCategoryMale: number = 0;
  public AppeardTotalCategoryFemale: number = 0;
  public AppeardTotalCategoryTransGender: number = 0;
   


  //Total Number of Students Passed/Awarded Degree
  public PassedCategory: string = "";
  public PassedGeneralCategoryMale: number = 0;
  public PassedGeneralCategoryFemale: number = 0;
  public PassedGeneralCategoryTransGender: number = 0;

  public PassedEWSCategoryMale: number = 0;
  public PassedEWSCategoryFemale: number = 0;
  public PassedEWSCategoryTransGender: number = 0;

  public PassedSCCategoryMale: number = 0;
  public PassedSCCategoryFemale: number = 0;
  public PassedSCCategoryTransGender: number = 0;

  public PassedSTCategoryMale: number = 0;
  public PassedSTCategoryFemale: number = 0;
  public PassedSTCategoryTransGender: number = 0;

  public PassedOBCCategoryMale: number = 0;
  public PassedOBCCategoryFemale: number = 0;
  public PassedOBCCategoryTransGender: number = 0;

  public PassedTotalCategoryMale: number = 0;
  public PassedTotalCategoryFemale: number = 0;
  public PassedTotalCategoryTransGender: number = 0;
   

  //Out of Total, Number of Students Passed with 60% or above
  public OutofTotalPassedCategory: string = "";
  public OutofTotalPassedGeneralCategoryMale: number = 0;
  public OutofTotalPassedGeneralCategoryFemale: number = 0;
  public OutofTotalPassedGeneralCategoryTransGender: number = 0;

  public OutofTotalPassedEWSCategoryMale: number = 0;
  public OutofTotalPassedEWSCategoryFemale: number = 0;
  public OutofTotalPassedEWSCategoryTransGender: number = 0;

  public OutofTotalPassedSCCategoryMale: number = 0;
  public OutofTotalPassedSCCategoryFemale: number = 0;
  public OutofTotalPassedSCCategoryTransGender: number = 0;

  public OutofTotalPassedSTCategoryMale: number = 0;
  public OutofTotalPassedSTCategoryFemale: number = 0;
  public OutofTotalPassedSTCategoryTransGender: number = 0;

  public OutofTotalPassedOBCCategoryMale: number = 0;
  public OutofTotalPassedOBCCategoryFemale: number = 0;
  public OutofTotalPassedOBCCategoryTransGender: number = 0;

  public OutofTotalPassedTotalCategoryMale: number = 0;
  public OutofTotalPassedTotalCategoryFemale: number = 0;
  public OutofTotalPassedTotalCategoryTransGender: number = 0;
   

}
