import { object } from 'yup';
import { YupContext } from '../../utils/schemas';

import MonthTransactions from '../types/MonthTransactions';
import transactionSetSchema from './transactionSetSchema';
import { dateStr, meetingDates } from '../../settings/SettingsService';
import TransactionCode from '../types/TransactionCode';
import { dateToMonth } from '../../utils/date';

const MonthTransactionsSchema = object().shape({
  settings: object().required(),
  transactionSet: transactionSetSchema().required()
}).test('expected_contributions',
  'Missing Expected Contributions',
  function(this: YupContext, monthTransactions: MonthTransactions) {
    const { settings, boxes } = monthTransactions;
    const { transactions, start } = monthTransactions.transactionSet;
    const missingContributions: string[] = [];
    meetingDates(dateToMonth(start.date), settings.meeting_days).forEach(date => {
      boxes.forEach(box => {
        const transaction = transactions.find(transaction =>
          date === transaction.date && box.code === transaction.code
        );
        if(!transaction){
          missingContributions.push(`${dateStr(settings, date)} (${box.code})`);
        }
      });
    })
    if(!missingContributions.length){
      return true;
    }
    return this.createError({ message: 'Missing contributions : ' + missingContributions.join(', ')})
  }
).test('no_duplicate_contributions',
  'No Duplicate Contributions',
  function(this: YupContext, monthTransactions: MonthTransactions) {
    const { settings } = monthTransactions;
    const { transactions } = monthTransactions.transactionSet;
    const duplicateTransactions = transactions.filter(a => {
      if(a.code !== TransactionCode.W && a.code !== TransactionCode.C){
        return false;
      }
      return !!transactions.find(b => {
        return (a.id as number) < (b.id as number) && a.code === b.code && a.date === b.date;
      })
    });
    if(!duplicateTransactions.length){
      return true;
    }
    return this.createError({ message: `More than one contribution found on: ${duplicateTransactions.map(transaction =>
      dateStr(settings, transaction.date)+' ('+transaction.code+')').join(', ')}`})
  }
).test('receipts_balance',
  'Receipts should balance at 0',
  function(monthTransactions: MonthTransactions) {
    const receipts = monthTransactions.transactionSet.transactions.reduce(
      (sum, transaction) => sum + transaction.receipts_amt, 0);
    return receipts === 0
  }
).test('no_unapplied_transactions',
  'There were unapplied transactions',
  function(this: YupContext, monthTransactions: MonthTransactions) {
    const unappliedTransactions = monthTransactions.transactionSet.transactions.filter(
      transaction => !transaction.apply_on_date);
    if(!unappliedTransactions.length){
      return true;
    }
    return this.createError({ message: `Unapplied transactions found on: ${unappliedTransactions.map(transaction =>
      dateStr(monthTransactions.settings, transaction.date)+' ('+transaction.code+')').join(', ')}`})
  }
).test('has_min_interest',
  'Expected additional interest payments',
  function(this: YupContext, monthTransactions: MonthTransactions) {
    const { transactionSet, settings } = monthTransactions;
    const count = transactionSet.transactions.reduce((sum, transaction) => {
      return sum + ((transaction.code === TransactionCode.I) ? 1 : 0);
    }, 0);
    return (count >= settings.min_num_interest);
  }
).test('has_min_expenditures',
  'Expected additional expenditures',
  function(this: YupContext, monthTransactions: MonthTransactions) {
    const { transactionSet, settings } = monthTransactions;
    const count = transactionSet.transactions.reduce((sum, transaction) => {
      return sum + ((transaction.code === TransactionCode.E) ? 1 : 0);
    }, 0);
    return (count >= settings.min_num_expenditure);
  }
);

export default MonthTransactionsSchema;
