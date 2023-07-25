export class StreamMasterDataModel {
  public StreamMasterID: number = 0;
  public DepartmentID: number = 0;
  public DepartmentName: string = '';
  public CourseLevelID: number = 0;
  public CourseLevelName: string = '';
  public CourseID: number = 0;
  public CourseName: string = '';
  public StreamName: string = '';
  public UserID: number = 0;
  public ActiveStatus: boolean = true;
  public ActiveDeactive: string = '';
  public DeleteStatus: boolean = false;

  public SubjectDetails: CourseSubjectMappingListData_SubjectDetails[] = [];

}
export class CourseSubjectMappingListData_SubjectDetails {
  public SubjectID: number = 0;
  public SubjectName: string = '';
  public IsChecked: boolean = false;
}
