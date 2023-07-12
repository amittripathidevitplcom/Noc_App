export class AddRoleMasterDataModel {
  public RoleID: number = 0;
  public RoleName: string = '';
  public UserID: number = 0;
  public ActiveStatus: boolean = true;
  public ActiveDeactive: string = '';
  public DeleteStatus: boolean = false;
}


export class UserRoleRightsDataModel {
  public MenuID: number = 0;
  public MenuName: string = ''; 
  public RoleID: number = 0;
  public LevelNo: number = 0;
  public ParentId: number = 0;
  public U_View: string = '';
  public U_Add: string = '';
  public U_Update: string = '';
  public U_Delete: string = '';
  public U_Print: string = '';

  public NG_U_View: boolean = false;
  public NG_U_Add: boolean = false;
  public NG_U_Update: boolean = false;
  public NG_U_Delete: boolean = false;
  public NG_U_Print: boolean = false;
}
