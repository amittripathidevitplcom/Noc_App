export class AadharServiceDataModel
{
  public AadharNo: string=''
  public TransactionNo: string = ''
  public OTP: string = ''
  public Status: string = ''
  public Message: string = ''
  public AadharID: string = ''

}

export class CAGetSignedXmlApiRequest {

  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public TransactionID: number = 0;
  public designation: string = '';
  public PDFFileName: string = '';
  public ApplyNocApplicationID: string = '';
  public SSOdisplayName: string = '';
  public CreatedBy: string = '';
  public eSignType: string = '';



}


export class CAGetSignedPDFAPIRequestResponse {

  public txn: string = '';
  public username: string = '';
  public TransactionID: number = 0;
  public responseCode: string = '';
  public responseMsg: string = '';
  public ApplyNocApplicationID: string = '';
  public SSOdisplayName: string = '';
  public RequestStatus: string = '';
  public eSignType: string = '';

}
