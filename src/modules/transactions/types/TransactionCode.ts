
enum TransactionCode {
  W = 'W',
  C = 'C',
  D = 'D',
  CE = 'CE',
  I = 'I',
  E = 'E',
  S = 'S',
  B = 'B',
  // Custom codes
  TTB = 'TTB',
  UC = 'UC',
  UW = 'UW',
  UO = 'UO',
}

export default TransactionCode;

export function describeTransactionCode(code: TransactionCode){
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
      return 'Funds received (For the Branch) for a special purpose';
    case TransactionCode.B:
      return 'Contributions for worldwide construction work from boxes';
    case TransactionCode.TTB:
      return 'Transfer to Branch';
    case TransactionCode.UC:
      return 'Other - Congregation';
    case TransactionCode.UW:
      return 'Other - Worldwide Work'
    case TransactionCode.UO:
      return 'Other';
    default:
      throw new Error('UnknownCode:'+code);
  }
}


export function describeTransactionCodeShort(code: TransactionCode){
  switch(code){
    case TransactionCode.W:
      return 'Contrib - WW';
    case TransactionCode.C:
      return 'Contrib - Cong';
    case TransactionCode.D:
      return 'Deposit';
    case TransactionCode.CE:
      return 'Contrib - Electronic';
    case TransactionCode.I:
      return 'Interest';
    case TransactionCode.TTB:
      return 'Transfer to Branch';
    case TransactionCode.B:
      return 'Contrib - Construction'
    case TransactionCode.E:
    case TransactionCode.S:
    case TransactionCode.UC:
    case TransactionCode.UW:
    case TransactionCode.UO:
      return '';
    default:
      throw new Error('UnknownCode:'+code);
  }
}

export function isLocalCongregation(code: TransactionCode){
  switch(code){
    case TransactionCode.W:
    case TransactionCode.S:
    case TransactionCode.UW:
      return false;
    case TransactionCode.C:
    case TransactionCode.CE:
    case TransactionCode.I:
    case TransactionCode.E:
    case TransactionCode.UC:
    case TransactionCode.B:
      return true;
    case TransactionCode.D:
    case TransactionCode.UO:
    case TransactionCode.TTB:
      return null;
    default:
      throw new Error('UnknownCode:'+code);
  }
}
