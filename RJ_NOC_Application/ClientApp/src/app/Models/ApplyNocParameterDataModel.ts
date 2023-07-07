export class ApplyNocParameterDataModel {
  public ApplyNocApplicationID: number = 0;

  public ApplyNocID: number = 0;
  public DepartmentID: number = 0;
  public ApplyNocFor: string = '';
  public FeeAmount: number = 0;
  public CollegeID: number = 0;
  public CollegeName: string = '';
  public ApplicationTypeID: number = null;
  public ApplicationTypeName: string = '';
  public TotalFeeAmount: number = 0;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;

  public ApplyNocParameterMasterListDataModel: ApplyNocParameterMasterListDataModel[] = [];

  public ApplyNocParameterMasterList_TNOCExtension: ApplyNocParameterMaster_TNOCExtensionDataModel = null;
  public ApplyNocParameterMasterList_AdditionOfNewSeats60: ApplyNocParameterMaster_AdditionOfNewSeats60DataModel = null;
}

export class ApplyNocParameterMasterListDataModel {
  public ApplyNocID: number = 0;
  public ApplyNocFor: string = '';
  public FeeAmount: number = 0;
  public IsChecked: boolean = false;

}
export class ApplyNocParameterMaster_TNOCExtensionDataModel extends ApplyNocParameterMasterListDataModel {
  public ApplyNocParameterCourseList: ApplyNocParameterCourseDataModel[] = [];
}
export class ApplyNocParameterCourseDataModel {
  public ApplyNocID: number = 0;
  public CourseID: number = 0;
  public CourseName: string = '';
  public IsChecked: boolean = false;
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

// list details
export class ApplyNocApplicationDataModel {
  public ApplyNocApplicationID: number = 0;
  public CollegeID: number = 0;
  public CollegeName: string = '';
  public ApplicationTypeID: number = null;
  public ApplicationTypeName: string = '';
  public TotalFeeAmount: number = 0;
  public ApplicationStatus: boolean = false;
  public IsFinalSubmit: boolean = false;
  public IsSaveFDR: boolean = false;
  public ApplyNocApplicationParameterList: ApplyNocApplicationParameterDataModel[] = [];
}
export class ApplyNocApplicationParameterDataModel {
  public ApplyNocParameterDetailID: number = 0;
  public ApplyNocApplicationID: number = 0;
  public ApplyNocParameterID: number = 0;
  public ApplyNocFor: string = '';
  public FeeAmount: number = 0;
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
