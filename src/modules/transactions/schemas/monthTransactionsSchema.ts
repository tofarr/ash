import { array, number, object } from 'yup';
import moment from 'moment';
import { YupContext } from '../../utils/schemas';

import MonthTransactions from '../types/MonthTransactions';
import transactionSetSchema from './transactionSetSchema';
import { dateStr, meetingDates } from '../../settings/SettingsService';
import TransactionCode from '../types/TransactionCode';
import { DATE_FORMAT, dateToMonth } from '../../utils/date';
import { buildEndBalance } from '../transactionService'

const MonthTransactionsSchema = object().shape({
  settings: object().required(),
  transactionSet: transactionSetSchema.required()
}).test('expected_meetings',
  'Missing Expected Meetings',
  function(this: YupContext, monthTransactions: MonthTransactions) {
    const { settings } = monthTransactions;
    const { transactions, start } = monthTransactions.transactionSet;
    const missingMeetingDates = meetingDates(dateToMonth(start.date), settings.meeting_days)
      .filter((meetingDate) => {
        return !(transactions.find((transaction) => {
          return transaction.date == meetingDate && transaction.code === TransactionCode.W
        }) && transactions.find((transaction) => {
          return transaction.date === meetingDate && transaction.code === TransactionCode.C
        }) && (transactions.filter((transaction) => {
          return transaction.date === meetingDate && transaction.code === TransactionCode.S
        }).length === settings.special_contribution_boxes.length))
      }).map((date) => dateStr(settings, date));
    if(!missingMeetingDates.length){
      return true;
    }
    return this.createError({ message: `Missing meeting(s) on: ${missingMeetingDates.join(', ')}`})
  }
).test('no_unexpected_meetings',
  'No Unexpected Meetings',
  function(this: YupContext, monthTransactions: MonthTransactions) {
    const { settings } = monthTransactions;
    const { transactions, start } = monthTransactions.transactionSet;
    const _meetingDates = meetingDates(dateToMonth(start.date), settings.meeting_days);
    const unexpectedMeetings = transactions.filter((transaction) => {
      return (transaction.code === TransactionCode.W || transaction.code === TransactionCode.C) &&
        _meetingDates.indexOf(transaction.date) >= 0;
    }).map(transaction => dateStr(settings, transaction.date));
    if(!unexpectedMeetings.length){
      return true;
    }
    return this.createError({ message: `Unexpected meeting(s) on: ${unexpectedMeetings.join(', ')}`})
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
    return endBalance.other == 0
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
