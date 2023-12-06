export class ClassWiseStudentDetailsDataModel {
  public CourseName: string = ''
  public ClassStatisticID: number = 0
  public CollegeID: number = 0
  public CourseID: number = 0
  public Class: string = ''
  public ClassName: string = ''
  public Section: string = ''
  public SCBoysCount: number = 0
  public SCGirlsCount: number = 0
  public STBoysCount: number = 0
  public STGirlsCount: number = 0
  public OBCBoysCount: number = 0
  public OBCGirlsCount: number = 0
  public MBCBoysCount: number = 0
  public MBCGirlsCount: number = 0
  public GenBoysCount: number = 0
  public GenGirlsCount: number = 0
  public EWSGirlsCount: number = 0
  public EWSBoysCount: number = 0
  public TotalGirls: number = 0
  public TotalBoys: number = 0
  public Total: number = 0
  
  public OFTotalMinorityBoys: number = 0
  public OFTotalMinorityGirls: number = 0
  public OFTotalPHBoys: number = 0
  public OFTotalPHGirls: number = 0


   
  public OFTotalMinorityTransgender: number = 0
  public MinorityTotal: number = 0
  public OFTotalPHTransgender: number = 0
  public PHTotal: number = 0



  public Action: string = ''
  public Remark: string = ''
}

export class PostClassWiseStudentDetailsDataModel {
  public CollegeID: number = 0
  public UserID: number = 0
  public ClassWiseStudentDetails: ClassWiseStudentDetailsDataModel[] = [];
}


