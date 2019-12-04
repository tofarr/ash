import { array, number, object } from 'yup';
import moment from 'moment';
import { YupContext } from '../../utils/schemas';

import MonthTransactions from '../types/MonthTransactions';
import transactionSetSchema from './transactionSetSchema';
import { meetingDates } from '../../settings/SettingsService';
import TransactionCode from '../types/TransactionCode';
import { DATE_FORMAT, dateToMonth } from '../../utils/date';

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
        }));
      }).map((date) => moment(date, DATE_FORMAT)
          .format(settings.formatting.date_format))
    if(!missingMeetingDates.length){
      return true;
    }
    return this.createError({ message: `Missing meeting(s) on: ${missingMeetingDates.join(', ')}`})
  }
);


//Validate that there is all the required meetings...

export default MonthTransactionsSchema;
