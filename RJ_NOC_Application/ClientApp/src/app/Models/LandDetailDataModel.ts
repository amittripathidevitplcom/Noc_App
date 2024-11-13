import { RequiredDocumentsDataModel_Documents } from "./TabDetailDataModel";

export class DocumentScrutiny_ActionModule {
  public Action: string = '';
  public Remark: string = '';
  public C_Action: string = '';
  public C_Remark: string = '';
  public S_Action: string = '';
  public S_Remark: string = '';
}

export class LandDetailDataModel {
  public LandDetailID: number = 0;
  public CollegeID: number = 0;
  public LandAreaID: number = 0;
  public LandDocumentTypeID: number = 0;
  public LandConvertedID: number = 0;
  public LandTypeID: number = 0;
  public KhasraNumber: string = '';
  public LandOwnerName: string = '';
  public BuildingHostelQuartersRoadArea: number = 0;
  //public GroundCycleStandArea: number = 0;
  public LandArea: number = 0;
  public LandConversionOrderDate: string = '';
  public AffidavitDate: string = '';
  public LandConversionOrderNo: string = '';
  public ActiveStatus: boolean = true;
  public CollegeName: string = '';
  public LandAreaSituatedName: string = '';
  public LandDocumentTypeName: string = '';
  public IsConvereted: string = '';
  public LandTypeName: string = '';
  public LandDetailDocument: LandDetailDocumentDataModel[] = [];
  public Code: string = '';
  public Action: string = '';
  public Remark: string = '';
  public C_Action: string = '';
  public C_Remark: string = '';
  public S_Action: string = '';
  public S_Remark: string = '';
  public AreaType: string = '';
  public CollegeLandTypeDetails: CollegeLandTypeDetailsDataModel[] = [];
  public CollegeLandConversionDetails: CollegeLandConversionDetailsDataModel[] = [];

  public MedicalGroupOneLandTypeID: number = 0;
  public MedicalGroupOneLandUnitID: number = 0;
  public LeaseDate: string = '';
  public NameOfLandPurchasedAllotted: string = '';



  //Medical Group 3

  public LandOwnerShipID  : number = 0;
  public SocietyMemberID : number = 0;
  public FromLeaseDate: string = '';
  public ToLeaseDate: string = '';
  public FromRentDate: string = '';
  public ToRentDate: string = '';
  public LeaseDocument: string = '';
  public Dis_LeaseDocument: string = '';
  public LeaseDocumentPath: string = '';
}

export class LandDetailDocumentDataModel extends RequiredDocumentsDataModel_Documents {

}


export class CollegeLandTypeDetailsDataModel
{
  public LandTypeID: number = 0;
  public LandTypeName: string = '';
  public LandArea: number = 0;
  public KhasraNo: string = '';
  public IsLandSelected: boolean = true;
  public LandConversionOrderDate?: string = '';
  public LandConversionOrderNo?: string = '';
  public LandConverstionDocument?: string = '';
  public OtherDocument?: string = '';
  public IsOtherDocument?: boolean = false;


  public Dis_FileName?: string = '';
  public FileName?: string = '';
  public FilePath?: string = '';


  public Dis_OtherFileName?: string = '';
  public  FileOtherName?: string = '';
  public FileOtherPath?: string = '';

}
export class CollegeLandConversionDetailsDataModel
{
  public LandDetailID: number = 0;
  public LandConversionID: number = 0;
  public LandConversionOrderDate: string = '';
  public LandConversionOrderNo: string = '';
}
