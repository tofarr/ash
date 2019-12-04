import { todayStr } from '../utils/date';
import Meeting from './Meeting';
import { create, newInstance } from '../transactions/transactionService';
import TransactionCode from '../transactions/types/TransactionCode';
import addErr from '../utils/err';
import meetingSchema from './MeetingSchema';
import { loadSettings } from '../settings/SettingsService';

export function newMeeting(date = todayStr()) {
  return new Promise<Meeting>((resolve, reject) => {
    loadSettings().then((settings) => {
      const special_contribution_boxes = settings.special_contribution_boxes.map((title) => {
        return {
          title,
          cash: 0,
          cheques: 0
        }
      });
      resolve({
        date,
        settings,
        congregation_cash: 0,
        congregation_cheques: 0,
        worldwide_cash: 0,
        worldwide_cheques: 0,
        special_contribution_boxes
      });
    }, reject)
  });

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

      const promises = [
        initTransaction(TransactionCode.C, 'Contributions - Congregation', meeting.congregation_cash, meeting.congregation_cheques),
        initTransaction(TransactionCode.W, 'Contributions - WW', meeting.worldwide_cash, meeting.worldwide_cheques),
      ];
      meeting.special_contribution_boxes.forEach((special_contribution_box) =>
        promises.push(initTransaction(TransactionCode.S, special_contribution_box.title, special_contribution_box.cash, special_contribution_box.cheques))
      );

      Promise.all(promises).then(() => resolve(meeting), handleReject);
    }, handleReject);
  });
}
