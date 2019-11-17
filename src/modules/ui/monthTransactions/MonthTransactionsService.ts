
import { destroyMonth, newMonth, readMonth, saveMonth } from '../../persistent/months/MonthService';
import MonthTransactions from './MonthTransactions';
import { loadSettings } from '../../persistent/settings/SettingsService';
import { createTransaction, destroyTransaction, listTransactions, updateTransaction } from '../../persistent/transactions/TransactionService';
import Transaction from '../../persistent/transactions/models/Transaction';


export function newMonthTransactions(year: number, month_number: number) {
  return new Promise<MonthTransactions>((resolve, reject) => {
    loadSettings().then((settings) => {
      newMonth(year, month_number).then((month) => {
        resolve({ month, settings, transactions: [] })
      }, reject);
    }, reject);
  });
}


export function loadMonthTransactions(year: number, month_number: number) {
  return new Promise<MonthTransactions>((resolve, reject) => {
    loadSettings().then((settings) => {
      readMonth(year, month_number).then((month) => {
        listTransactions(year, month_number).then((transactions: Transaction[]) => {
          resolve({ month, settings, transactions });
        }, reject);
      }, reject);
    }, reject);
  });
}

export function saveMonthTransactions(monthTransactions: MonthTransactions){
  return new Promise((resolve, reject) => {
    saveMonth(monthTransactions.month).then(() => {
      listTransactions(monthTransactions.month.year, monthTransactions.month.year).then((existingTransactions) => {
        const toDelete = existingTransactions.map(transaction => transaction.id);
        const all : Promise<any>[] = [];
        monthTransactions.transactions.forEach((transaction) => {
          if(transaction.id){
            const index = toDelete.indexOf(transaction.id);
            if(index >= 0){
              toDelete.splice(index, 1);
            }
            all.push(updateTransaction(transaction));
          }else{
            all.push(createTransaction(transaction));
          }
        });
        all.push.apply(all, toDelete.map(id => destroyTransaction(id as number)));
        Promise.all(all).then(resolve, reject);
      });
    });
  });
}

export function destroyMonthTransactions(year: number, month: number){
  listTransactions(year, year).then((existingTransactions) => {
    const all : Promise<any>[] = existingTransactions.map(
      transaction => destroyTransaction(transaction.id as number)
    );
    all.push(destroyMonth(year, month));
    return Promise.all(all);
  });
}


export function getRecieptsBalance(monthTransactions: MonthTransactions){
  return monthTransactions.transactions.reduce((balance, transaction) => {
    return balance + transaction.receipts_amt;
  }, 0);
}

export function getPrimaryBalance(monthTransactions: MonthTransactions){
  return monthTransactions.transactions.reduce((balance, transaction) => {
    return balance + transaction.primary_amt;
  }, 0);
}

export function getOtherBalance(monthTransactions: MonthTransactions){
  return monthTransactions.transactions.reduce((balance, transaction) => {
    return balance + transaction.other_amt;
  }, 0);
}

export function getRecieptsClosingBalance(monthTransactions: MonthTransactions){
  return monthTransactions.month.opening_receipts + getRecieptsBalance(monthTransactions);
}

export function getPrimaryClosingBalance(monthTransactions: MonthTransactions){
  return monthTransactions.month.opening_primary + getPrimaryBalance(monthTransactions);
}

export function getOtherClosingBalance(monthTransactions: MonthTransactions){
  return monthTransactions.month.opening_other + getOtherBalance(monthTransactions);
}
