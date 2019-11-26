
import AvailableLocale from '../../utils/locale/AvailableLocale';
import DbService from '../DbService';
import moment from 'moment';
import Settings, { MeetingDays } from './Settings';

DbService.version(1).stores({
  settings: 'id++'
})

function newSettings(): Settings{
  return {
    locale: AvailableLocale.en,
    formatting: {
      date_format: 'YYYY-MM-DD',
      month_format: 'YYYY-MM',
    },
    congregation: 'Congregation',
    city: 'City',
    province: 'Province',
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
    rules: {
      interest: true,
      wefts: true
    },
    transferToBranchDefaults: [
      {description: 'WW (resolution)', amt: 0},
      {description: 'KHAHC (resolution)', amt: 0},
      {description: 'GAA (resolution)', amt: 0},
      {description: 'COAA (resolution)', amt: 0},
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
