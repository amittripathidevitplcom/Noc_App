

export class ClinicalFacilityModel {

  public CollegeID: number = 0;
  public UserId: number = 0;
  public FacilityList: ListClinicalFacility[] = [];
}
export class ListClinicalFacility {

  public CollegeFacilityID: number = 0;
  public ClinicFacilityID: number = 0;
  public FacilityTitle: string = '';
  public FacilityValue: string = '';
  public MinSize: number = 0;
  public IsCheckbox: boolean = false;
  public IsMandatory: boolean = false;
}

