import DateBalance from './types/DateBalance';
import Transaction from './types/Transaction';
import TransactionCode from './types/TransactionCode';
import TransactionListProps from './types/TransactionListProps';
import TransactionSet from './types/TransactionSet';

import * as dao from './transactionDAO';

import { todayStr } from '../utils/date';
import { addMsg } from '../utils/msgs/service';
import addErr from '../utils/err';

export function create(transaction: Transaction){
  return new Promise((resolve, reject) => {
    dao.create(transaction).then((transaction) => {
      addMsg('Transaction Created');
      resolve(transaction);
    }, (err: any) => {
      addErr(err);
      reject(err);
    });
  })
}

export function read(id: number){
  return dao.read(id);
}

export function update(transaction: Transaction){
  return new Promise((resolve, reject) => {
    dao.update(transaction).then((transaction) => {
      addMsg('Transaction Updated');
      resolve(transaction);
    }, (err: any) => {
      addErr(err);
      reject(err);
    });
  });
}

export function destroy(id: number){
  return new Promise((resolve, reject) => {
    dao.destroy(id).then(() => {
      addMsg('Transaction Destroyed');
      resolve();
    }, (err: any) => {
      addErr(err);
      reject(err);
    });
  });
}

export function list(props?: TransactionListProps){
  return dao.list(props);
}

export function newInstance(
  description: string,
  date?: string,
  code = TransactionCode.C
): Transaction{
  return {
    date: date || todayStr(),
    apply_on_date: date || todayStr(),
    description,
    code,
    receipts_amt: 0,
    primary_amt: 0,
    other_amt: 0,
  }
}

export function loadDateBalance(date: string){
  return new Promise<DateBalance>((resolve, reject) => {
    dao.list({ date_max: date }).then((transactions) => {
      resolve(buildBalance(transactions, date));
    }, reject);
  });
}

export function loadTransactionSet(date_min: string, date_max: string){
  return new Promise<TransactionSet>((resolve, reject) => {
    loadDateBalance(date_min).then((start) => {
      list({ date_min, date_max }).then((transactions) => {
        resolve({ start, transactions, date_max });
      }, reject);
    }, reject);
  });
}

export function buildEndBalance(transactionSet: TransactionSet){
   const endBalance = buildBalance(transactionSet.transactions, transactionSet.date_max);
   const {start } = transactionSet;
   endBalance.receipts += start.receipts;
   endBalance.primary += start.primary;
   endBalance.other += start.other;
   endBalance.applied_receipts += start.applied_receipts;
   endBalance.applied_primary += start.applied_primary;
   endBalance.applied_other += start.applied_other;
   return endBalance;
}

function buildBalance(transactions: Transaction[], date: string): DateBalance{
  return transactions.reduce((dateBalance, transaction) => {
    dateBalance.receipts += transaction.receipts_amt;
    dateBalance.primary += transaction.primary_amt;
    dateBalance.other += transaction.other_amt;
    if(transaction.apply_on_date && date < transaction.apply_on_date){
      dateBalance.applied_receipts += transaction.receipts_amt;
      dateBalance.applied_primary += transaction.primary_amt;
      dateBalance.applied_other += transaction.other_amt;
    }
    return dateBalance;
  }, {
    date,
    receipts: 0,
    primary: 0,
    other: 0,
    applied_receipts: 0,
    applied_primary: 0,
    applied_other: 0,
  });
}

export function isPending(transaction: Transaction, date: string){
  return (!transaction.apply_on_date) || transaction.apply_on_date >= date
}
