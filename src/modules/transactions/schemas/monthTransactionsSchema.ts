import { object } from 'yup';
import { YupContext } from '../../utils/schemas';

import MonthTransactions from '../types/MonthTransactions';
import transactionSetSchema from './transactionSetSchema';
import { dateStr, meetingDates } from '../../settings/settingsService';
import TransactionCode from '../types/TransactionCode';
import { dateToMonth } from '../../utils/date';
import { buildEndBalance } from '../transactionService'

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
    return this.createError({ message: `More than one contributions found on: ${duplicateTransactions.map(transaction =>
      transaction.code+' '+dateStr(settings, transaction.date)).join(', ')}`})
  }
).test('receipts_balance',
  'Receipts should balance at 0',
  function(monthTransactions: MonthTransactions) {
    const endBalance = buildEndBalance(monthTransactions.transactionSet);
    return endBalance.other === 0
  })
.test('no_unapplied_transactions',
  'There were unapplied transactions',
  function(this: YupContext, monthTransactions: MonthTransactions) {
    const unappliedTransactions = monthTransactions.transactionSet.transactions.filter(
      transaction => !transaction.apply_on_date);
    if(!unappliedTransactions.length){
      return true;
    }
    return this.createError({ message: `Unapplied transactions found on: ${unappliedTransactions.map(transaction =>
      transaction.code+' '+dateStr(monthTransactions.settings, transaction.date)).join(', ')}`})
  });

export default MonthTransactionsSchema;
