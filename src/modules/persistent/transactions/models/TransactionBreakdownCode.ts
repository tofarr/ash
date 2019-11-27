
enum TransactionBreakdownCode{
  WW_BOX = 'WW_BOX',
  WW_RESOLUTION = 'WW_RESOLUTION',
  KHAHC = 'KHAHC',
  GAA = 'GAA',
  COAA = 'COAA',
  OTHER = 'OTHER'
}

export default TransactionBreakdownCode;

//TODO: Replace this with I18Next
export function describeTransactionBreakdownCode(code?: TransactionBreakdownCode): string{
  if(!code){
    return 'No Code';
  }
  switch(code){
    case TransactionBreakdownCode.WW_BOX:
      return 'Worldwide Work (Box)';
    case TransactionBreakdownCode.WW_RESOLUTION:
      return 'Worldwide Work (Resolution)';
    case TransactionBreakdownCode.KHAHC:
      return 'Kingdom Hall and Assembly Hall Construction';
    case TransactionBreakdownCode.GAA:
      return 'Global Assistance Arrangement';
    case TransactionBreakdownCode.COAA:
      return 'Circuit Overseer Assistance Arrangement';
    case TransactionBreakdownCode.OTHER:
      return 'Other';
    default:
      throw new Error('Unexpected Code: ' + code);
  }
}
