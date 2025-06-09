
export class InfrastructureMedicalCollegeFacilitiesDataModel {
  public CollegeID: number = 0;
  public MedicalCollegeFID: number = 0;
  public DemonstrationRoom: string = '';
  public Histology: string = '';
  public ClinicalPhysiology: string = '';
  public Biochemistry: string = '';
  public HistopathologyCytopathology: string = '';
  public ClinicalPathologyHaematolog: string = '';
  public Microbiology: string = '';
  public ClinicalPharmacologyandComputerAssistedLearning: string = '';
  public DissectionHall: string = '';
  public DissectionHallsize: string = '';
  public DissectionHallNumber: string = '';
  public DissectionHallCapacity: string = '';  
  public Dis_DissectionHallPhoto: string = '';
  public DissectionHallPhoto: string = '';
  public DissectionHallPhotoPath: string = ''; 
  public SkillLaboratory: string = ''; 
  public LaboratoryNumber: string = ''; 
  public LaboratoryCapacity: string = ''; 
  public SkillLaboratoryPhoto: string = ''; 
  public Dis_SkillLaboratoryPhoto: string = ''; 
  public SkillLaboratoryPhotoPath: string = ''; 
  public Centralresearch: string = ''; 
  public CentralLibrary: string = ''; 
  public CentralLibraryArea: string = ''; 
  public CentralLibrarySeatingCapacity: string = ''; 
  public CentralLibraryBooks: string = ''; 
  public JournalsIndianForeign: string = '';
  public CentralLibraryPhoto: string = '';
  public Dis_CentralLibraryPhoto: string = '';
  public CentralLibraryPhotoPath: string = ''; 
  public RuralHealthTrainingCentre: string = ''; 
  public RuralHealth: string = ''; 
  public UrbanHealthTrainingCentre: string = ''; 
  public UrbanHealth: string = ''; 
  public PowerBackup: string = ''; 
  public PowerBackupCapacity: string = '';
  public PowerBackupPhoto: string = '';
  public Dis_PowerBackupPhoto: string = '';
  public PowerBackupPhotoPath: string = '';
  public SSOID: string = ''; 
  public LectureTheatreDetails: LectureTheatreDetailsDataModel[] = [];
  public MuseumDetails: MuseumDetailsDataModel[] = [];  
}
export class LectureTheatreDetailsDataModel {
  public LectureTheatreID: number = 0;  
  public LectureTheatreCapacity: string = '';
  public LectureTheatreSize: string = ''; 
  public Dis_LectureTheatrePhotoName: string = '';
  public LectureTheatrePhoto: string = '';
  public LectureTheatrePhotoPath: string = ''; 
}
export class MuseumDetailsDataModel {
  public MuseumID: number = 0;
  public MuseumCapacity: string = '';
  public MuseumSize: string = '';
  public Dis_MuseumPhotoName: string = '';
  public MuseumPhoto: string = '';
  public MuseumPhotoPath: string = '';
}
