import { array, object } from 'yup';
import monthSchema from '../../persistent/months/MonthSchema';
import { meetingDates } from '../../persistent/settings/SettingsService';
import MonthTransactions from './MonthTransactions';
import TransactionCode from '../../persistent/transactions/models/TransactionCode';
import transactionSchema from '../../persistent/transactions/TransactionSchema';
import { getRecieptsBalance } from './MonthTransactionsService';
import { toS } from '../../utils/dateStamps/DateStampService';


interface YupContext{
  path: any;
  createError: any;
}

export default function monthTransactionsSchema(){
  return object().shape({
    month: monthSchema().required(),
    transactions: array().of(transactionSchema()).required()
  }).test('transaction-month-year-match',
    'Transaction Month and Year Should Match',
    function(this: YupContext, monthTransactions: MonthTransactions) {
      const { path, createError } = this;
      const { month, year } = monthTransactions.month;
      const outOfMonthTransactions = monthTransactions.transactions.filter((transaction) =>
        transaction.month != month || transaction.year != year
      );
      if(!outOfMonthTransactions.length){
        return true;
      }
      return createError(path, 'Out of Month Transactions found on '+outOfMonthTransactions.map((transaction) =>
        toS(transaction, monthTransactions.settings.formatting.date_format)));
    }
  ).test('has-w-for-meetings',
    'Each meeting should have an value for worldwide work contributions',
    function(this: YupContext, monthTransactions: MonthTransactions) {
      const { month, transactions, settings } = monthTransactions;
      const { path, createError } = this;
      const missingDates = meetingDates(month.year, month.month, settings.meeting_days).filter((date) => {
        return !transactions.find(transaction => transaction.code === TransactionCode.W && transaction.day === date);
      });
      if(!missingDates.length){
        return true;
      }
      return createError({
        path,
        message: 'Missing worldwide work contributions for meetings on ' +
          missingDates.map(missingDate =>
            toS({ year: month.year,
               month: month.month,
               day: missingDate }, settings.formatting.date_format)
          ).join(', ')
      });
    }
  ).test('has-c-for-meetings',
    'Each meeting should have an value for congregation contributions',
    function(this: YupContext, monthTransactions: MonthTransactions) {
      const { month, transactions, settings } = monthTransactions;
      const { path, createError } = this;
      const missingDates = meetingDates(month.year, month.month, settings.meeting_days).filter((date) => {
        return !transactions.find(transaction => transaction.code === TransactionCode.C && transaction.day === date);
      });
      if(!missingDates.length){
        return true;
      }
      return createError({
        path,
        message: 'Missing congregation contributions for meetings on ' +
        missingDates.map(missingDate =>
          toS({ year: month.year,
             month: month.month,
             day: missingDate }, settings.formatting.date_format)
        ).join(', ')
      });
    }
  ).test('no-duplicate-w-dates',
    'Each worldwide work contribution should be on a unique date',
    function(this: YupContext, monthTransactions: MonthTransactions) {
      const { path, createError } = this;
      const { settings } = monthTransactions;

      const transactions = monthTransactions.transactions.
        filter(transaction => transaction.code === TransactionCode.W);
      const duplicates = Array.from(new Set(transactions.filter(a => {
        transactions.find(b => a !== b && a.day === b.day)
      })));
      if(!duplicates.length){
        return true;
      }
      return createError({
        path,
        message: 'Duplicate worldwide work contributions on dates ' +
          duplicates.map(duplicate =>
            toS(duplicate, settings.formatting.date_format)
          ).join(', ')
      });
    }
  ).test('no-duplicate-c-dates',
    'Each congregation contribution should be on a unique date',
    function(this: YupContext, monthTransactions: MonthTransactions) {
      const { path, createError } = this;
      const { settings } = monthTransactions;

      const transactions = monthTransactions.transactions.
        filter(transaction => transaction.code === TransactionCode.C);
      const duplicates = Array.from(new Set(transactions.filter(a => {
        transactions.find(b => a !== b && a.day === b.day)
      })));
      if(!duplicates.length){
        return true;
      }
      return createError({
        path,
        message: 'Duplicate congregation contributions on dates ' +
          duplicates.map(duplicate =>
            toS(duplicate, settings.formatting.date_format)
          ).join(', ')
      });
    }
  ).test('deposits-should-match-reciepts',
    'Deposits Should Match Reciepts',
    function(monthTransactions: MonthTransactions) {
      return getRecieptsBalance(monthTransactions) === 0;
    }
  ).test('should-have-interest-payment',
    'Month should have an interest payment',
    function(monthTransactions: MonthTransactions) {
      return !monthTransactions.transactions.find(transaction => transaction.code === TransactionCode.I);
    }
  );
}
