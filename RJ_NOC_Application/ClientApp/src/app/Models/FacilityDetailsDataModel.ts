export class FacilityDetailsDataModel {
  public CollegeID: number = 0;
  public FacilityDetailID: number = 0;
  public IsAvailable: string = "";
  public FacilitiesID: number = 0;
  public FacilitiesUrl: string = '';
  public FacilitiesUrlPath: string = '';
  public FacilitiesUrl_Dis_FileName: string = '';
  public Width: number = 0;
  public Length: number = 0;
  public MinSize: number = 0;
  public Unit: string = '';
  public UserID: number = 0;
  public NoOf: number = null;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public Action: string = '';
  public Remark: string = '';
  public FacilitiesName: string = '';


  public C_Action: string = '';
  public C_Remark: string = '';
  public S_Action: string = '';
  public S_Remark: string = '';
  public AmountOrOtherSource?: string = '';
}


export class MGOneFacilityEachDataModel {
  public CollegeID: number = 0;
  public ID: number = 0;
  public Name: string = "";
  public Code: string = "";
  public MinSize: number = 0;
  public MinCapacity: number = 0;
  public MinRequired: number = 0;
  public Unit: string = "";
  public Capacity: number = null;
  public Size: number = null;
  public Showbutton: boolean = false;
  public IsSubmitted: boolean = false;
  public OrderBy: number = 0;
}


