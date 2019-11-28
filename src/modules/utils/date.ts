import moment from 'moment';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const MONTH_FORMAT = 'YYYY-MM';

export function todayStr(){
  return moment().format(DATE_FORMAT);
}

export function thisMonthStr(){
  return moment().format(MONTH_FORMAT);
}

export function dateToMonth(date: string){
  return date.substring(0, 7);
}
