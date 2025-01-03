export class HospitalDataModel {
  public ParentHospitalID: number = 0;
  public CollegeID: number = 0;
  public HospitalID: number = 0;
  public HospitalAreaID: number = null;
  public HospitalName: string = '';
  public HospitalRegNo: string = '';
  public HospitalDistance: Number = null;
  public HospitalContactNo: string = '';
  public HospitalEmailID: string = '';
  public ManageByName: string = '';
  public ManageByPhone: string = null;
  public OwnerName: string = '';
  public OwnerPhone: string = null;
  public MedicalBeds: Number = null;
  public SurgicalBeds: Number = null;
  public ObstAndGynaecologyBeds: Number = null;
  public PediatricsBeds: Number = null;
  public OrthoBeds: Number = null;
  public OccupancyPercentegeBeds: Number = null;
  public AffiliationPsychiatricBeds: Number = null;
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
  public IsAffiliatedHospital: string = '';

  public CityID: number = 0;
  public CityName: string = '';

  public CityID_ManageBy: number = 0;
  public CityName_ManageBy: string = '';

  public CityID_Owner: number = 0;
  public CityName_Owner: string = '';

  public CityID_Other: number = 0;
  public CityName_Other: string = '';


  public GeneralMedicinebed: number = null;
  public PaediatricsBed: number = null;
  public SkinandVDBed: number = null;
  public PsychiatryBed: number = null;

  public GeneralSurgeryBed: number = null;
  public SurgeryOrthopaedicsBed: number = null;
  public SurgeryOphthalmologyBed: number = null;
  public SurgeryOtorhinolaryngologyBed: number = null;

  public ObstetricsGynaecologyBed: number = null;

  public ICUBed: number = null;
  public ICCUBed: number = null;
  public RICUBed: number = null;

  public SICUBed: number = null;
  public NICUBed: number = null;
  public PICUBed: number = null;
  public ICUGrandTotalBed: number = 0;

  public OTICUBed: number = null;
  public CasualtyBeds: number = null;

}
export class HospitalParentNotDataModel {// not have parent
  public ParentHospitalID: number = 0;
  public CollegeID: number = 0;
  public HospitalID: number = 0;
  public HospitalAreaID: number = null;
  public HospitalName: string = '';
  public HospitalRegNo: string = '';
  public HospitalDistance: number = null;
  public HospitalContactNo: string = '';
  public HospitalEmailID: string = '';
  public ManageByName: string = '';
  public ManageByPhone: string = null;
  public OwnerName: string = '';
  public OwnerPhone: string = null;
  public MedicalBeds: number = null;
  public SurgicalBeds: number = null;
  public ObstAndGynaecologyBeds: number = null;
  public PediatricsBeds: number = null;
  public OrthoBeds: number = null;
  public OccupancyPercentegeBeds: number = null;
  public AffiliationPsychiatricBeds: number = null;
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
  public IsAffiliatedHospital: string = '';


  public CityID: number = 0;
  public CityName: string = '';

  public CityID_ManageBy: number = 0;
  public CityName_ManageBy: string = '';

  public CityID_Owner: number = 0;
  public CityName_Owner: string = '';


  public GeneralMedicinebed: number = null;
  public PaediatricsBed: number = null;
  public SkinandVDBed: number = null;
  public PsychiatryBed: number = null;

  public GeneralSurgeryBed: number = null;
  public SurgeryOrthopaedicsBed: number = null;
  public SurgeryOphthalmologyBed: number = null;
  public SurgeryOtorhinolaryngologyBed: number = null;

  public ObstetricsGynaecologyBed: number = null;

  public ICUBed: number = null;
  public ICCUBed: number = null;
  public RICUBed: number = null;

  public SICUBed: number = null;
  public NICUBed: number = null;
  public PICUBed: number = null;
  public ICUGrandTotalBed: number = 0;

  public OTICUBed: number = null;
  public CasualtyBeds: number = null;
}
export class MGThreeHospitalDataModel {
  public CollegeID: number = 0;
  public IsHillytribalArea: string = '';
  public IsInstitutionParentHospital: string = '';
  public HospitalStatus: string = '';
  public HospitalName: string = '';
  public RegistrationNo: string = '';
  public HospitalContactNo: string = '';
  public HospitalEmailID: string = '';
  public AddressLine1: string = null;
  public AddressLine2: string = null;
  public RuralUrban: number = null;
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public TehsilID: number = 0;
  public CityID: number = 0;
  public PanchayatSamitiID: number = 0;
  public CityTownVillage: string = null;
  public Pincode: number = null;
  public OwnerName: string = '';
  public SocietyMemberID: number = 0;


  public HospitalMOU: string = '';
  public Dis_HospitalMOU: string = '';
  public HospitalMOUPath: string = '';
  public BedCapacity: number = null;

  public MedicalBeds: number = null;
  public SurgicalBeds: number = null;
  public ObstetricsBeds: number = null;
  public PediatricsBeds: number = null;
  public OrthoBeds: number = null;
  public EmergencyMedicineBeds: number = null;
  public PsychiatryBeds: number = null;


  public NumberofDeliveries: number = null;
  public CollegeDistance: number = null;

  public BedOccupancy: string = '';
  public Dis_BedOccupancy: string = '';
  public BedOccupancyPath: string = '';
  public FireNOC: string = '';
  public Dis_FireNOC: string = '';
  public FireNOCPath: string = '';
  public PollutionCertificate: string = '';
  public Dis_PollutionCertificate: string = '';
  public PollutionCertificatePath: string = '';

  public ClinicalEstablishment: string = '';
  public Dis_ClinicalEstablishment: string = '';
  public ClinicalEstablishmentPath: string = '';
  public NABH: string = '';
  public Dis_NABH: string = '';
  public NABHPath: string = '';
  public UndertakingNotAffiliated: string = '';
  public Dis_UndertakingNotAffiliated: string = '';
  public UndertakingNotAffiliatedPath: string = '';
  public StaffInformation: string = '';
  public Dis_StaffInformation: string = '';
  public StaffInformationPath: string = '';
  public IsAnyAffiliatedHospital: string = '';

  public MGThreeAffiliatedHospitalList: MGThreeAffiliatedHospitalDataModel[] = [];
}

export class MGThreeAffiliatedHospitalDataModel {
  public CollegeID: number = 0;
  public AffiliatedHospitalName: string = '';
  public AffiliationReason: number = 0;
 // public AffiliationReasonName: string = '';
  public SpecialtyAffiliation: string = '';
  public OwnerName: string = '';
  public BedCapacity: number = null;
  public NumberDeliveries: number = null;
  public CollegeDistance: number = null;

  public HospitalMOU: string = '';
  public Dis_HospitalMOU: string = '';
  public HospitalMOUPath: string = '';

  public MedicalBeds: number = null;
  public SurgicalBeds: number = null;
  public ObstetricsBeds: number = null;
  public PediatricsBeds: number = null;
  public OrthoBeds: number = null;
  public PsychiatryBeds: number = null;
  public EmergencyMedicineBeds: number = null;


  public BedOccupancy: string = '';
  public Dis_BedOccupancy: string = '';
  public BedOccupancyPath: string = '';


  public FireNOC: string = '';
  public Dis_FireNOC: string = '';
  public FireNOCPath: string = '';
  public PollutionCertificate: string = '';
  public Dis_PollutionCertificate: string = '';
  public PollutionCertificatePath: string = '';

  public ClinicalEstablishment: string = '';
  public Dis_ClinicalEstablishment: string = '';
  public ClinicalEstablishmentPath: string = '';
  public NABH: string = '';
  public Dis_NABH: string = '';
  public NABHPath: string = '';
  public UndertakingNotAffiliated: string = '';
  public Dis_UndertakingNotAffiliated: string = '';
  public UndertakingNotAffiliatedPath: string = '';
  public StaffInformation: string = '';
  public Dis_StaffInformation: string = '';
  public StaffInformationPath: string = '';
}

