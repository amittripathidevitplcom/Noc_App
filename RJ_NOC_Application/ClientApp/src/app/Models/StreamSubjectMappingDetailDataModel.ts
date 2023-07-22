export class StreamSubjectMappingDetailDataModel
{
  public StreamMappingID: number = 0;
  public DepartmentID: number = 0;
  public CourseLevelID: number = 0;
  public CourseID: number = 0;
  public StreamID: number = 0;
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public SelectedSubjectDetails: CourseMasterDataModel_SubjectDetails[] = [];
  public UserID: number = 0;

}
export class CourseMasterDataModel_SubjectDetails
{
  public SubjectID: number = 0;
  public SubjectName: string = '';
  public IsChecked: boolean = false;
}


export class StreamSubjectMappingListDataModel
{
  public  StreamMappingID: number = 0;
  public  SubjectID: number = 0;
  public ActiveStatus: boolean = false;
  public IsChecked: boolean = false;
}

