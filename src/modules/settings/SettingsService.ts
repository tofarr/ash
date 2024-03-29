
// import AvailableLocale from './AvailableLocale';
import moment from 'moment';
import Settings, { MeetingDays } from './Settings';
import { DATE_FORMAT, MONTH_FORMAT } from '../utils/date';
import { load, store } from './SettingsDAO';
import { addMsg } from '../utils/msgs/service';

function newSettings(): Settings{
  return {
    // locale: AvailableLocale.en,
    formatting: {
      date_format: 'MMM D YYYY',
      month_format: 'MMM YYYY',
    },

    congregation_name: '',
    city: '',
    province_or_state: '',
    accounts_servant_or_overseer: '',
    authorized_signer: '',
    other_account_description: '',

    cash_box: false,
    min_num_interest: 1,
    min_num_expenditure: 1,

    meeting_days: {
      sun: true,
      mon: false,
      tue: false,
      wed: false,
      thu: true,
      fri: false,
      sat: false,
    },
  }
}

export function loadSettings(){
  return new Promise<Settings>((resolve, reject) => {
    load().then((settings) => {
      resolve(settings || newSettings());
    }, reject);
  });
}

export function storeSettings(settings: Settings){
  return new Promise<Settings>((resolve, reject) => {
    store(settings).then(() => {
      addMsg('Settings Updated');
      resolve(settings);
    }, reject);
  });
}

export function meetingDates(month: string, meetingDays: MeetingDays) {
  let m = moment(month, MONTH_FORMAT).startOf('month');
  let monthNum = m.month();
  let meetingDates: string[] = [];
  while(m.get('month') === monthNum){
    if(((m.day() === 0) && meetingDays.sun) ||
        ((m.day() === 1) && meetingDays.mon) ||
        ((m.day() === 2) && meetingDays.tue) ||
        ((m.day() === 3) && meetingDays.wed) ||
        ((m.day() === 4) && meetingDays.thu) ||
        ((m.day() === 5) && meetingDays.fri) ||
        ((m.day() === 6) && meetingDays.sat)){
        meetingDates.push(m.format(DATE_FORMAT));
    }
    m.add(1, 'day');
  }
  return meetingDates;
}

export function currentDateStr(settings: Settings){
  return moment().format(settings.formatting.date_format);
}

export function dateStr(settings: Settings, date: string){
  return moment(date, DATE_FORMAT)
    .format(settings.formatting.date_format);
}
