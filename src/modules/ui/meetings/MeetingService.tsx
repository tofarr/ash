import moment from 'moment';
import Meeting from './Meeting';
import { ensureMonthExists } from '../../persistent/months/MonthService';
import { createTransaction, newTransaction } from '../../persistent/transactions/TransactionService';
import TransactionCode from '../../persistent/transactions/models/TransactionCode';
import addErr from '../../utils/Err';
import meetingSchema from './MeetingSchema';

export function newMeeting(year = moment().year(),
                          month = moment().month() + 1,
                          day = moment().date()) {
  return {
    year,
    month,
    day,
    congregation_cash: 0,
    congregation_cheques: 0,
    worldwide_cash: 0,
    worldwide_cheques: 0,
    construction_cash: 0,
    construction_cheques: 0
  };
}

export function createMeeting(meeting: Meeting){
  return new Promise<Meeting>((resolve, reject) => {

    function handleReject(err: any){
      addErr(err);
      reject(err);
    }

    meetingSchema().validate(meeting).then(() => {
      const { year, month, day} = meeting;

      function initTransaction(code: TransactionCode, description: string, cash?: number, cheques?: number){
        const transaction = newTransaction(year, month, day, description, code);
        transaction.cash = cash || 0;
        transaction.cheques = cheques || 0;
        transaction.receipts_amt = transaction.cash + transaction.cheques;
        return createTransaction(transaction);
      }

      Promise.all([
        ensureMonthExists(meeting.year, meeting.month),
        initTransaction(TransactionCode.C, 'Contributions - Congregation', meeting.congregation_cash, meeting.congregation_cheques),
        initTransaction(TransactionCode.W, 'Contributions - WW', meeting.worldwide_cash, meeting.worldwide_cheques),
        initTransaction(TransactionCode.W, 'Contributions - Construction', meeting.construction_cash, meeting.construction_cheques)
      ]).then(() => resolve(meeting), handleReject);
    }, handleReject);
  });
}
