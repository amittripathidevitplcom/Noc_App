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
}

export class LandDetailDocumentDataModel extends RequiredDocumentsDataModel_Documents {

}
