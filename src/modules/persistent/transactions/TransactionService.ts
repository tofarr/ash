
import DbService from '../DbService';
import { loadSettings, meetingDates } from '../settings/SettingsService';
import Transaction from './models/Transaction';
import TransactionCode from './models/TransactionCode';

DbService.version(1).stores({
  transactions: '++id,[year+month]'
})

function table(){
  return DbService.table<Transaction>('transactions');
}

export function newTransaction(
  year: number,
  month: number,
  day: number,
  description: string,
  code?: TransactionCode
): Transaction{
  return {
    year,
    month,
    day,
    description,
    code,
    receipts_amt: 0,
    primary_amt: 0,
    other_amt: 0,
  }
}

export function newMeetingTransactions(year: number, month: number){
  return new Promise<Transaction[]>((resolve, reject) => {
    loadSettings().then((settings) => {
      const transactions: Transaction[] = [];
      meetingDates(year, month, settings.meeting_days).forEach((date: number) => {
        transactions.push(newTransaction(year, month, date, 'Contributions - Congregation', TransactionCode.C));
        transactions.push(newTransaction(year, month, date, 'Contributions - WW', TransactionCode.W));
      });
      resolve(transactions);
    }, reject);
  });
}

export function createTransaction(transaction:Transaction){
  return new Promise<Transaction>((resolve, reject) => {
    table().add(transaction as Transaction).then((id) => {
      resolve({ ...transaction, id });
    }, reject);
  });
}

export function updateTransaction(transaction:Transaction){
  return table().update(transaction.id, transaction);
}

export function destroyTransaction(transaction_id:number){
  return table().delete(transaction_id);
}

export function listTransactions(year: number, month: number){
  return table().where({year: year, month: month}).sortBy('date');
}
