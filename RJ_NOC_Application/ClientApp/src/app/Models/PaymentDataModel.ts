export class RequestParameter {
  public MERCHANTCODE: string = '';
  public PRN: string = '';
  public REQTIMESTAMP: string = '';
  public PURPOSE: string = '';
  public AMOUNT: string = '';
  public SUCCESSURL: string = '';
  public FAILUREURL: string = '';
  public CANCELURL: string = '';
  public USERNAME: string = '';
  public USERMOBILE: string = '';
  public USEREMAIL: string = '';
  public UDF1: string = '';
  public UDF2: string = '';
  public UDF3: string = '';
  public OFFICECODE: string = '';
  public REVENUEHEAD: string = '';
  public CHECKSUM: string = '';
  public CreatedDate: string = '';
}

export class ResponseParameters {
  public MERCHANTCODE: string = '';
  public REQTIMESTAMP: string = '';
  public PRN: string = '';
  public AMOUNT: number = 0;
  public RPPTXNID: string = '';
  public RPPTIMESTAMP: string = '';
  public PAYMENTAMOUNT: string = '';
  public STATUS: string = '';
  public PAYMENTMODE: string = '';
  public PAYMENTMODEBID: string = '';
  public PAYMENTMODETIMESTAMP: string = '';
  public RESPONSECODE: string = '';
  public RESPONSEMESSAGE: string = '';
  public UDF1: string = '';
  public UDF2: string = '';
  public UDF3: string = '';
  public CHECKSUM: string = '';
  public CreatedDate: string = '';
}



export class RequestDetails {
  public AMOUNT: number = 0
  public PURPOSE: string = '';
  public USERNAME: string = '';
  public USERMOBILE: string = '';
  public USEREMAIL: string = '';
  public ApplyNocApplicationID: number = 0
  public PaymentRequestURL: string = ''
}

//Emitra Request

export class EmitraRequestDetails {

  public AppRequestID: string = '';
  public ServiceID: string = '';
  public ApplicationIdEnc: string = '';
  public Amount: number = 0;
  public UserName: string = ''
  public MobileNo: string = ''
  public RegistrationNo: string = ''
  public SsoID: string = ''
  public RESPONSEJSON: string = ''
  public STATUS: string = ''
  public ENCDATA: string = ''
  public PaymentRequestURL: string = ''
  public MERCHANTCODE: string = ''
  public IsKiosk: boolean = false;







}
