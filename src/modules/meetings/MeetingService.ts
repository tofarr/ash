import { todayStr } from '../utils/date';
import Meeting from './Meeting';
import { create, newInstance } from '../transactions/transactionService';
import TransactionCode from '../transactions/types/TransactionCode';
import addErr from '../utils/err';
import meetingSchema from './MeetingSchema';
import { loadSettings } from '../settings/settingsService';
import { list as listContributionBoxes } from '../contributionBoxes/contributionBoxService';

export function newMeeting(date = todayStr()) {
  return new Promise<Meeting>((resolve, reject) => {
    loadSettings().then((settings) => {
      listContributionBoxes().then((boxes) => {
        resolve({
          date,
          settings,
          boxes: boxes.map(box => {
            return {
              cash: 0,
              cheques: 0,
              box
            }
          }),
        });
      }, reject);
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

      Promise.all(meeting.boxes.map((box) =>
        initTransaction(box.box.code, box.box.title, box.cash, box.cheques)
      )).then(() => resolve(meeting), handleReject);
    }, handleReject);
  });
}
