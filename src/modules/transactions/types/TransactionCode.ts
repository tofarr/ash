
enum TransactionCode {
  W = 'W',
  C = 'C',
  D = 'D',
  CE = 'CE',
  I = 'I',
  E = 'E',
  S = 'S',
}

export default TransactionCode;

export function describeTransactionCode(code?: TransactionCode){
  switch(code){
    case TransactionCode.W:
      return 'Contributions for the worldwide work';
    case TransactionCode.C:
      return 'Contributions for the local congregation collected from boxes';
    case TransactionCode.D:
      return 'Deposit to primary account';
    case TransactionCode.CE:
      return 'Contributions for the local congregation received by electronic transfer';
    case TransactionCode.I:
      return 'Interest from bank account';
    case TransactionCode.E:
      return 'Congregation expenditure'
    case TransactionCode.S:
      return 'Funds received for a special purpose';
    case null:
    case undefined:
      return 'Other';
    default:
      throw new Error('UnknownCode:'+code);
  }
}
