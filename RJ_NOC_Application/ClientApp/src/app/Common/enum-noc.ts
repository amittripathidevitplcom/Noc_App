export enum EnumDepartment {
  Agriculture = 1,
  Animal_Husbandry,
  CollegeEducation,
  DepartmentOfTechnicalEducation,
  MedicalGroup1,
  MedicalGroup3,
  Nursing,
  Nursing2,
  ParaMedical,
  PolyTechnic,
}

export enum EnumCommitteActionType {
  FTRDC = "Forward To Respective Document Commitee",
  FTPIC = "Forward To Physical Infrasturcture Commitee",
  FTPCPC = "Forward To Physical Check Policy Commitee",
  FTC = "Forward To Committee"
}

export enum EnumCommitteType {
  Pre = "PreVerification",
  Post = "PostVerification",
  Final = "FinalVerification",
}

export enum EnumCheckListType_Agri {
  DSPV = "DSPV_Agri",
  PIPV = "PIPV_Agri",
}
export enum EnumCheckListType_AH {
  PVCRD = "PVCRD",
  PVPIC = "PVPIC",
  FVCPC = "FVCPC",
}
export enum EnumOfficerActionType {
  PreVeriRejected = "Pre Verification Rejected",
  PreVeriApproved = "Pre Verification Approved",
  PostVeriRejected = "Post Verification Rejected",
  PostVeriApproved = "Post Verification Approved"
}

export enum EnumApplicationStatus {
  Pending = "Pending",
  Revert = "Revert",
  Rejected = "Rejected",
  Completed = "Completed",
  Approved = "Approved",
  Forward = "Forward",
  Approve = "Approve",
  ApproveandForward = "Approve and Forward",
  ForwardToCommissioner = "Forward To Commissioner",
  ReleaseNOC = "Release NOC",
  RejectNOC = "Reject NOC",
  ForwardToSecretary = "Forward To Secretary",
}

