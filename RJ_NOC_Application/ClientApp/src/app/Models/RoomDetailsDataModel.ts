import { DocumentScrutiny_ActionModule } from "../Models/LandDetailDataModel";

export class RoomDetailsDataModel {
  public CollegeWiseRoomID: number = 0;
  public CollegeID: number = 0;
  public CourseID: number = 0;
  public DepartmentID: number = 0;
  public Width: number = 0;
  public Length: number = 0;
  public StudentCapacity: number = 0;
  public ImageFileName: string = '';
  public ImageFilePath: string = '';
  public Image_Dis_FileName: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;
}

export class RoomDetailsDataModel_RoomDetails extends DocumentScrutiny_ActionModule {
  public CollegeWiseRoomID: number = 0;
  public CourseID: number = 0;
  public CourseName: string = '';
  public DepartmentID: number = 0;
  public Width: number = 0;
  public Length: number = 0;
  public StudentCapacity: number = 0;
  public ImageFileName: string = '';
  public ImageFilePath: string = '';
 
}
