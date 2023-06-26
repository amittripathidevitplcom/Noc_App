export class WorkFlowMasterDataModel {
  public WorkFlowMasterID: number = 0;
  public DepartmentID: number = 0;
  public SchemeID: number = 0;
  public ModuleID: number = 0;
  public SubModuleID: number = 0;
  public RoleLevelID: number = 0;
  public RoleID: number = 0;
  public DepartmentName: string = '';
  public SchemeName: string = '';
  public ModuleName: string = '';
  public SubModuleName: string = '';
  public RoleLevelName: string = '';
  public RoleName: string = '';
  public WorkFlowMasterDetailList: WorkFlowMasterDetail[] = [];
}

export class WorkFlowMasterDetail {
  public WorkFlowMasterDetailID: number = 0;
  public ActionHeadID: number = 0;
  public ActionID: number = 0;
  public ListCode: string = '';
  public RoleLevelID: number = 0;
  public NextRoleID: number = 0;
  public Priority: number = 0;
  public CompletionDays: number = 0;
  public OfficeGroupID: number = 0;
  public WorkFlowMasterID: number = 0;
  public ActionList: any = [];
  public NextUserGroupList: any = [];
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public ActionHeadName: string = '';
  public ActionName: string = '';
  public RoleLevelName: string = '';
  public NextRoleName: string = '';
  public OfficeGroupName: string = '';
}
