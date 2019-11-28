import { todayStr } from '../utils/date';
import Meeting from './Meeting';
import { create, newInstance } from '../transactions/transactionService';
import TransactionCode from '../transactions/types/TransactionCode';
import addErr from '../utils/err';
import meetingSchema from './MeetingSchema';

export function newMeeting(date = todayStr()) {
  return {
    date,
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
      const { date } = meeting;

      function initTransaction(code: TransactionCode, description: string, cash?: number, cheques?: number){
        const transaction = newInstance(description, date, code);
        transaction.cash = cash || 0;
        transaction.cheques = cheques || 0;
        transaction.receipts_amt = transaction.cash + transaction.cheques;
        return create(transaction);
      }

      Promise.all([
        initTransaction(TransactionCode.C, 'Contributions - Congregation', meeting.congregation_cash, meeting.congregation_cheques),
        initTransaction(TransactionCode.W, 'Contributions - WW', meeting.worldwide_cash, meeting.worldwide_cheques),
        initTransaction(TransactionCode.S, 'Contributions - Construction', meeting.construction_cash, meeting.construction_cheques)
      ]).then(() => resolve(meeting), handleReject);
    }, handleReject);
  });
}
