import moment from 'moment';
import Deposit from './Deposit';
import { create, loadTransactionSet } from '../transactions/transactionService';
import TransactionCode from '../transactions/types/TransactionCode';
import addErr from '../utils/err';
import DepositSchema from './DepositSchema';

import { DATE_FORMAT, MONTH_FORMAT, todayStr } from '../utils/date';

function delta(sum: number, receipts: number, amt?: number){
  if(amt){
    if(receipts > 0){
      return sum += amt;
    }else{
      return sum -= amt;
    }
  }
  return sum;
}

export function newDeposit(date = todayStr()) {
  return new Promise<Deposit>((resolve, reject) => {
    const min = moment(date, DATE_FORMAT).startOf('month');
    loadTransactionSet(min.format(DATE_FORMAT), date).then((transactionSet) => {
      const cash = transactionSet.transactions
        .reduce((sum: number, transaction) => delta(sum, transaction.receipts_amt, transaction.cash), 0);
      const cheques = transactionSet.transactions
        .reduce((sum: number, transaction) => delta(sum, transaction.receipts_amt, transaction.cheques), 0);
      resolve({ date, cash, cheques });
    }, reject);
  });
}

export function createDeposit(deposit: Deposit){
  return new Promise<Deposit>((resolve, reject) => {
    DepositSchema().validate(deposit).then(() => {
      const { date, cash, cheques} = deposit;
      const amt = cash + cheques
      create({ date, apply_on_date: date, description: 'Deposit',
          code: TransactionCode.D, cash, cheques, receipts_amt: -amt,
          primary_amt: amt, other_amt: 0 })
        .then(() => resolve(deposit), reject);
    }, (err: any) => {
      addErr(err);
      reject(err);
    });
  });
}
