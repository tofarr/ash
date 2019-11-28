
enum TransactionBreakdownCode{
  WW_BOX = 'WW_BOX',
  WW_RESOLUTION = 'WW_RESOLUTION',
  KHAHC = 'KHAHC',
  GAA = 'GAA',
  COAA = 'COAA',
}

export default TransactionBreakdownCode;

export function describeTransactionBreakdownCode(code?: TransactionBreakdownCode){
  switch(code){
    case TransactionBreakdownCode.WW_BOX:
      return 'Worldwide Work (From Contribution Box)';
    case TransactionBreakdownCode.WW_RESOLUTION:
      return 'Worldwide Work (Resolution)';
    case TransactionBreakdownCode.KHAHC:
      return 'Kingdom Hall and Assembly Hall Construction Worldwide (Resolution)';
    case TransactionBreakdownCode.GAA:
      return 'Global Assistance Arrangement (Resolution)';
    case TransactionBreakdownCode.COAA:
      return 'Circuit Overseer Assistance Arrangement (Resolution)';
    case null:
    case undefined:
      return 'Other';
    default:
      throw new Error('UnknownCode:'+code);
  }
}
