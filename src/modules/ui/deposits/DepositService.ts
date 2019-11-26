import moment from 'moment';
import Deposit from './Deposit';
import { ensureMonthExists } from '../../persistent/months/MonthService';
import { createTransaction } from '../../persistent/transactions/TransactionService';
import TransactionCode from '../../persistent/transactions/models/TransactionCode';
import MonthTransactions from '../monthTransactions/MonthTransactions';
import { loadOrNewMonthTransactions } from '../monthTransactions/MonthTransactionsService';
import addErr from '../../utils/Err';
import DepositSchema from './DepositSchema';

function delta(sum: number, code?: TransactionCode, amt?: number){
  switch(code){
    case TransactionCode.D:
      return sum - (amt || 0);
    case TransactionCode.W:
    case TransactionCode.C:
      return sum + (amt || 0);
    default:
      return sum
  }
}

export function newDeposit() {
  return new Promise<Deposit>((resolve, reject) => {
    const m = moment();
    const year = m.year();
    const month = m.month() + 1;
    loadOrNewMonthTransactions(year, month).then((monthTransactions: MonthTransactions) => {
      const cash = monthTransactions.transactions
        .reduce((sum: number, transaction) => delta(sum, transaction.code, transaction.cash), 0);
      const cheques = monthTransactions.transactions
        .reduce((sum: number, transaction) => delta(sum, transaction.code, transaction.cheques), 0);
      resolve({
        year,
        month,
        day: m.date(),
        cash: cash,
        cheques: cheques
      });
    }, reject);
  });
}

export function createDeposit(deposit: Deposit){
  return new Promise<Deposit>((resolve, reject) => {

    function handleReject(err: any){
      addErr(err);
      reject(err);
    }

    DepositSchema().validate(deposit).then(() => {
      const { year, month, day, cash, cheques} = deposit;
      const amt = cash + cheques
      Promise.all([
        ensureMonthExists(deposit.year, deposit.month),
        createTransaction({ year, month, day, description: 'Deposit',
          code: TransactionCode.D, cash, cheques, receipts_amt: -amt,
          primary_amt: amt, other_amt: 0 })
      ]).then(() => resolve(deposit), handleReject);
    }, handleReject);
  });
}
