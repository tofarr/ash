
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
  CBT = 'CBT',
  CUC = 'CUC',
  CUW = 'CUW',
  CUO = 'CUO',
  CCE = 'CCE',
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
      return 'Congregation expenditure';
    case TransactionCode.CCE:
      return 'Special Congregation expenditure'
    case TransactionCode.S:
      return 'Funds received (For the Branch) for a special purpose';
    case TransactionCode.B:
      return 'Contributions for worldwide construction work from boxes';
    case TransactionCode.CBT:
      return 'Transfer to Branch';
    case TransactionCode.CUC:
      return 'Other - Congregation';
    case TransactionCode.CUW:
      return 'Other - Worldwide Work'
    case TransactionCode.CUO:
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
    case TransactionCode.CBT:
      return 'Transfer to Branch';
    case TransactionCode.B:
      return 'Contrib - Construction'
    case TransactionCode.E:
    case TransactionCode.CCE:
    case TransactionCode.S:
    case TransactionCode.CUC:
    case TransactionCode.CUW:
    case TransactionCode.CUO:
      return '';
    default:
      throw new Error('UnknownCode:'+code);
  }
}

export function isLocalCongregation(code: TransactionCode){
  switch(code){
    case TransactionCode.W:
    case TransactionCode.S:
    case TransactionCode.CUW:
    case TransactionCode.B:
      return false;
    case TransactionCode.C:
    case TransactionCode.CE:
    case TransactionCode.I:
    case TransactionCode.E:
    case TransactionCode.CCE:
    case TransactionCode.CUC:
      return true;
    case TransactionCode.D:
    case TransactionCode.CUO:
    case TransactionCode.CBT:
      return null;
    default:
      throw new Error('UnknownCode:'+code);
  }
}
