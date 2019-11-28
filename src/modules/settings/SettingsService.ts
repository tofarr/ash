
import AvailableLocale from './AvailableLocale';
import DbService from '../utils/db';
import moment from 'moment';
import Settings, { MeetingDays } from './Settings';
import TransactionBreakdownCode from '../transactions/types/TransactionBreakdownCode';

DbService.version(1).stores({
  settings: 'id++'
})

function newSettings(): Settings{
  return {
    locale: AvailableLocale.en,
    formatting: {
      date_format: 'MMMM D YYYY',
      month_format: 'MMMM YYYY',
    },

    congregation_name: 'Congregation Name',
    city: 'City',
    province_or_state: 'Province or State',
    accounts_servant_or_overseer: 'Accounts Servant or Overseer',
    authorized_signer: 'Authorized Signer',

    cash_box: false,
    meeting_days: {
      sun: true,
      mon: false,
      tue: false,
      wed: false,
      thu: true,
      fri: false,
      sat: false,
    },
    //rules: {
    //  interest: true,
    //  wefts: true
    //},
    transferToBranchDefaults: [
      {description: 'WW (resolution)', code: TransactionBreakdownCode.WW_RESOLUTION, amt: 0},
      {description: 'KHAHC (resolution)', code: TransactionBreakdownCode.KHAHC, amt: 0},
      {description: 'GAA (resolution)', code: TransactionBreakdownCode.GAA, amt: 0},
      {description: 'COAA (resolution)', code: TransactionBreakdownCode.COAA, amt: 0},
    ],
  }
}

function table(){
  return DbService.table<Settings>('settings');
}

export function loadSettings(){
  return new Promise<Settings>((resolve, reject) => {
    table().get(1).then((settings) => {
      if(settings){
        resolve(settings);
        return;
      }
      resolve(newSettings());
    }, reject);
  });
}

export function storeSettings(settings: Settings){
  return new Promise<Settings>((resolve, reject) => {
    table().put(settings, 1).then(() => {
      resolve(settings);
    }, reject);
  });
}

export function meetingDates(year: number, month: number, meetingDays: MeetingDays) {
  let meetingDates: number[] = [];
  let m = moment().startOf('month').set('year', year).set('month', month);
  while(m.get('month') === month){
    if(((m.day() === 0) && meetingDays.sun) ||
        ((m.day() === 1) && meetingDays.mon) ||
        ((m.day() === 2) && meetingDays.tue) ||
        ((m.day() === 3) && meetingDays.wed) ||
        ((m.day() === 4) && meetingDays.thu) ||
        ((m.day() === 5) && meetingDays.fri) ||
        ((m.day() === 6) && meetingDays.sat)){
        meetingDates.push(m.date());
    }
  }
  return meetingDates;
}

export function currentDateStr(settings: Settings){
  return moment().format(settings.formatting.date_format);
}

export function dateStr(settings: Settings, year: number, month: number, day: number){
  return moment()
    .startOf('year')
    .year(year)
    .month(month)
    .day(day)
    .format(settings.formatting.date_format);
}
