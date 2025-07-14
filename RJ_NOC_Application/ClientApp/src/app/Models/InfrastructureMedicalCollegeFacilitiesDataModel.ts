
export class InfrastructureMedicalCollegeFacilitiesDataModel {
  public CollegeID: number = 0;
  public MedicalCollegeFID: number = 0;
  public DemonstrationRoom: string = '';
  public Histology: string = '';
  public UploadPhotoHistology: string = '';
  public Dis_UploadPhotoHistology: string = '';
  public UploadPhotoHistologyPath: string = '';
  
  public ClinicalPhysiology: string = '';
  public UploadPhotoClinicalPhysiology: string = '';
  public Dis_UploadPhotoClinicalPhysiology: string = '';
  public UploadPhotoClinicalPhysiologyPath: string = '';

  public Biochemistry: string = '';
  public UploadPhotoBiochemistry: string = '';
  public Dis_UploadPhotoBiochemistry: string = '';
  public UploadPhotoBiochemistryPath: string = '';

  public HistopathologyCytopathology: string = '';
  public UploadPhotoHistopathologyCytopathology: string = '';
  public Dis_UploadPhotoHistopathologyCytopathology: string = '';
  public UploadPhotoHistopathologyCytopathologyPath: string = '';

  public ClinicalPathologyHaematolog: string = '';
  public UploadPhotoClinicalPathologyHaematolog: string = '';
  public Dis_UploadPhotoClinicalPathologyHaematolog: string = '';
  public UploadPhotoClinicalPathologyHaematologPath: string = '';

  public Microbiology: string = '';
  public UploadPhotoMicrobiology: string = '';
  public Dis_UploadPhotoMicrobiology: string = '';
  public UploadPhotoMicrobiologyPath: string = '';

  public ClinicalPharmacologyandComputerAssistedLearning: string = '';
  public UploadPhotoClinicalPharmacologyandComputerAssistedLearning: string = '';
  public Dis_ClinicalPharmacologyandComputerAssistedLearning: string = '';
  public ClinicalPharmacologyandComputerAssistedLearningPath: string = '';
  public Centralresearch: string = ''; 
  public CentralLibrary: string = ''; 
  public CentralLibraryArea: number = 0; 
  public CentralLibrarySeatingCapacity: number = 0;
  public CentralLibraryBooks: number = 0;
  public JournalsIndianForeign: number = 0;
  public CentralLibraryPhoto: string = '';
  public Dis_CentralLibraryPhoto: string = '';
  public CentralLibraryPhotoPath: string = '';
  public CentralLibrarybooksList: string = '';
  public CentralLibrarybooksListPath: string = '';
  public Dis_CentralLibrarybooksList: string = '';
  public JournalsIndianForeignList: string = '';
  public JournalsIndianForeignListPath: string = '';
  public Dis_JournalsIndianForeignList: string = '';

  public RuralHealthTrainingCentre: string = ''; 
  public RuralHealth: number = 0; 
  public UrbanHealthTrainingCentre: string = ''; 
  public UrbanHealth: number = 0;
  public PowerBackup: string = ''; 
  public PowerBackupCapacity: number = 0;
  public PowerBackupPhoto: string = '';
  public Dis_PowerBackupPhoto: string = '';
  public PowerBackupPhotoPath: string = '';
  public SSOID: string = ''; 
  public LectureTheatreDetails: LectureTheatreDetailsDataModel[] = [];
  public MuseumDetails: MuseumDetailsDataModel[] = [];  
  public DissectionHallDetails: DissectionHallDetailsDataModel[] = [];  
  public SkillLaboratoryDetails: SkillLaboratoryDetailsDataModel[] = [];  
}
export class LectureTheatreDetailsDataModel {
  public LectureTheatreID: number = 0;  
  public LectureTheatreCapacity: number = 0;
  public LectureTheatreSize: number = 0;
  public Dis_LectureTheatrePhotoName: string = '';
  public LectureTheatrePhoto: string = '';
  public LectureTheatrePhotoPath: string = ''; 
  public LectureTheatreType: string = ''; 
}
export class MuseumDetailsDataModel {
  public MuseumID: number = 0;
  public MuseumCapacity: number = 0;
  public MuseumSize: number = 0;
  public Dis_MuseumPhotoName: string = '';
  public MuseumPhoto: string = '';
  public MuseumPhotoPath: string = '';
  public MuseumType: string = '';
}
export class DissectionHallDetailsDataModel { 
  public DissectionID: number =0;
  public DissectionHallNumber: number = 0;
  public DissectionHallCapacity: number = 0;
  public DissectionHallsize: number = 0;
  public DissectionHallPhoto: string = '';
  public Dis_DissectionHallPhoto: string = ''; 
  public DissectionHallPhotoPath: string = '';
}
export class SkillLaboratoryDetailsDataModel { 
  public SkillLaboratoryID: number =0;  
  public SkillLaboratoryNumber: number = 0;
  public SkillLaboratorySize: number = 0;
  public SkillLaboratoryPhoto: string = '';
  public Dis_SkillLaboratoryPhoto: string = '';
  public SkillLaboratoryPhotoPath: string = '';
}
