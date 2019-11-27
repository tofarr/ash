
enum TransactionCode {
  W = 'W',
  C = 'C',
  D = 'D',
  CE = 'CE',
  I = 'I',
  E = 'E',
  S = 'S'
}

export default TransactionCode;

///TODO: Use I18next
export function describeTransactionCode(code?: TransactionCode): string{
  if(!code){
    return 'No Code';
  }
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
      return 'Congregation expenditure';
    case TransactionCode.S:
      return 'Funds received for a special purpose';
    default:
      throw new Error('Unexpected Code: ' + code);
  }
}
