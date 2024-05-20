import { DecimalPipe } from "@angular/common";

export class DuplicateAadharReportDataModel {
  public Gender: string = 'All';
  public DesignationID: number = 0;
  public StaffTypeID: string = 'All';
  public ResearchGuide: string = 'All';
  public DateOfAppointment: string = '';
  public DateOfJoining: string = '';
  public MonthlySalary: number = 0;
  public CollegeTypeID: number = 0;
  public AadhaarNo: string = '';
  public FaculityFatherName: string = '';
  public FaculityName: string = '';
  public FaculityMobileNo: string = '';
}
export class DuplicateAadharReportFilter {

  public Gender: boolean = true;
  public DesignationID: boolean = true;
  public StaffTypeID: boolean = true;
  public ResearchGuide: boolean = true;
  public DateOfAppointment: boolean = true;
  public DateOfJoining: boolean = true;
  public MonthlySalary: boolean = true;
  public CollegeTypeID: boolean = true;
  public AadhaarNo: boolean = true;
  public FaculityFatherName: boolean = true;
  public FaculityName: boolean = true;
  public FaculityMobileNo: boolean = true;
}


