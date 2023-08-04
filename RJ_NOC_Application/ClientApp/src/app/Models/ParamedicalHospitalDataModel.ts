export class ParamedicalHospitalDataModel {
  public ParentHospitalID: number = 0;
  public CollegeID: number = 0;
  public HospitalID: number = 0;
  public HospitalAreaID: number = null;
  public HospitalName: string = '';
  public HospitalRegNo: string = '';
  public HospitalDistance: Number = null;
  public CityPopulation: Number = null;
  public HospitalContactNo: string = '';
  public HospitalEmailID: string = '';
  public ManageByName: string = '';
  public ManageByPhone: string = null;
  public OwnerName: string = '';
  public OwnerPhone: string = null;
  public ParentHospitalRelatedToOtherID: Number = null;
  public InstitutionName: string = '';
  public OrganizationPhone: string = null;

  public CardioThoracicTotalBeds: number = null;
  public CardioThoracicCCUBeds: number = null;
  public CardioThoracicICCUBeds: number = null;
  public CardioThoracicICUBeds: number = null;
  public CriticalCareNursingTotalBeds: number = null;
  public CriticalCareNursingCCBeds: number = null;
  public CriticalCareNursingICUBeds: number = null;
  public MidwiferyNursingTotalBeds: number = null;
  public MotherNeonatalUnitsBeds: number = null;
  public DeliveriesPerYear: number = null;
  public LevelIINeonatalBeds: number = null;
  public LevelIIINeonatalBeds: number = null;
  public NeuroScienceNursingTotalBeds: number = null;
  public OncologyNursingTotalBeds: number = null;
  public OncologyNursingMedicalBeds: number = null;
  public OncologyNurSingsurgicalBeds: number = null;
  public OncologyNursingChemotherapyBeds: number = null;
  public OncologyNursingRadiotherapyBeds: number = null;
  public OncologyNursingPalliativeBeds: number = null;
  public OncologyNursingDiagnosticBeds: number = null;
  public OrthopaedicRehabilitationNursingTotalBeds: number = null;
  public OrthopaedicRehabilitationNursingOrthopaedicBeds: number = null;
  public OrthopaedicRehabilitationNursingRehabilitationBeds: number = null;
  public PsychiatricNursingTotalBeds: number = null;
  public PsychiatricNursingAcuteBeds: number = null;
  public PsychiatricNursingChronicBeds: number = null;
  public PsychiatricNursingAdultBeds: number = null;
  public PsychiatricNursingChildBeds: number = null;
  public PsychiatricNursingDeAddictionBeds: number = null;
  public NeonatalNursingTotalBeds: number = null;
  public NeonatalNursingLevelIIOrIIINICUBeds: number = null;
  public NeonatalNursingNICUBeds: number = null;
  public OperationRoomNursingTotalBeds: number = null;
  public OperationRoomNursingGeneralSurgeryBeds: number = null;
  public OperationRoomNursingPediatricBeds: number = null;
  public OperationRoomNursingCardiothoracicBeds: number = null;
  public OperationRoomNursingGynaeAndObstetricalBeds: number = null;
  public OperationRoomNursingOrthopaedicsBeds: number = null;
  public OperationRoomNursingOphthalmicBeds: number = null;
  public OperationRoomNursingENTAndNeuroBeds: number = null;
  public EmergencyAndDisasterNursingTotalBeds: number = null;
  public EmergencyAndDisasterNursingICUBeds: number = null;
  public EmergencyAndDisasterNursingEmergencylBeds: number = null;

  public AddressLine1: string = null;
  public AddressLine2: string = null;
  public RuralUrban: number = null;
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public TehsilID: number = 0;
  public PanchayatSamitiID: number = 0;
  public CityTownVillage: string = null;
  public Pincode: number = null;

  public AddressLine1_ManageBy: string = null;
  public AddressLine2_ManageBy: string = null;
  public RuralUrban_ManageBy: number = null;
  public DivisionID_ManageBy: number = 0;
  public DistrictID_ManageBy: number = 0;
  public TehsilID_ManageBy: number = 0;
  public PanchayatSamitiID_ManageBy: number = 0;
  public CityTownVillage_ManageBy: string = null;
  public Pincode_ManageBy: number = null;

  public AddressLine1_Owner: string = null;
  public AddressLine2_Owner: string = null;
  public RuralUrban_Owner: number = null;
  public DivisionID_Owner: number = 0;
  public DistrictID_Owner: number = 0;
  public TehsilID_Owner: number = 0;
  public PanchayatSamitiID_Owner: number = 0;
  public CityTownVillage_Owner: string = null;
  public Pincode_Owner: number = null;

  public AddressLine1_Other: string = null;
  public AddressLine2_Other: string = null;
  public RuralUrban_Other: number = null;
  public DivisionID_Other: number = 0;
  public DistrictID_Other: number = 0;
  public TehsilID_Other: number = 0;
  public PanchayatSamitiID_Other: number = 0;
  public CityTownVillage_Other: string = null;
  public Pincode_Other: number = null;

  public CreatedBy: number = null;
  public ModifyBy: number = null;
  public HospitalAreaName: string = '';
  public Action: string = '';
  public Remark: string = '';


  public C_Action: string = '';
  public C_Remark: string = '';
  public S_Action: string = '';
  public S_Remark: string = '';
  public PollutionUnitID: string = '';

  public PollutionCertificate: string = '';
  public Dis_PollutionCertificate: string = '';
  public PollutionCertificatePath: string = '';

  public HospitalStatus: string = '';
}
export class ParamedicalHospitalParentNotDataModel {// not have parent
  public ParentHospitalID: number = 0;
  public CollegeID: number = 0;
  public HospitalID: number = 0;
  public HospitalAreaID: number = null;
  public HospitalName: string = '';
  public HospitalRegNo: string = '';
  public HospitalDistance: number = null;
  public CityPopulation: Number = null;
  public HospitalContactNo: string = '';
  public HospitalEmailID: string = '';
  public ManageByName: string = '';
  public ManageByPhone: string = null;
  public OwnerName: string = '';
  public OwnerPhone: string = null;
  public AffiliatedHospitalAffiliationToOtherID: number = null;
  public ParentNotDocument: string = '';
  public Dis_ParentNotDocument: string = '';
  public ParentNotDocumentPath: string = '';
  public ConsentForm: string = '';
  public Dis_ConsentForm: string = '';
  public ConsentFormPath: string = '';

  public AddressLine1: string = null;
  public AddressLine2: string = null;
  public RuralUrban: number = null;
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public TehsilID: number = 0;
  public PanchayatSamitiID: number = 0;
  public CityTownVillage: string = null;
  public Pincode: number = null;

  public AddressLine1_ManageBy: string = null;
  public AddressLine2_ManageBy: string = null;
  public RuralUrban_ManageBy: number = null;
  public DivisionID_ManageBy: number = 0;
  public DistrictID_ManageBy: number = 0;
  public TehsilID_ManageBy: number = 0;
  public PanchayatSamitiID_ManageBy: number = 0;
  public CityTownVillage_ManageBy: string = null;
  public Pincode_ManageBy: number = null;

  public AddressLine1_Owner: string = null;
  public AddressLine2_Owner: string = null;
  public RuralUrban_Owner: number = null;
  public DivisionID_Owner: number = 0;
  public DistrictID_Owner: number = 0;
  public TehsilID_Owner: number = 0;
  public PanchayatSamitiID_Owner: number = 0;
  public CityTownVillage_Owner: string = null;
  public Pincode_Owner: number = null;

  public CreatedBy: number = null;
  public ModifyBy: number = null;

  public PollutionUnitID: string = '';
  public PollutionCertificate: string = '';
  public Dis_PollutionCertificate: string = '';
  public PollutionCertificatePath: string = '';
  public HospitalStatus: string = '';

}


