export class RequestParameter
{
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
}



export class RequestDetails
{
  public AMOUNT: number = 0
  public PURPOSE: string = '';
  public USERNAME: string = '';
  public USERMOBILE: string = '';
  public USEREMAIL: string = '';
  public ApplyNocApplicationID: number = 0
  public PaymentRequestURL: string=''
  
 }
