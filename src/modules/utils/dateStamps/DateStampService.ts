import moment from 'moment';
import DateStamp from './DateStamp';

export function toS(dateStamp: DateStamp, format: string){
  return moment()
    .startOf('year')
    .year(dateStamp.year)
    .month(dateStamp.month-1)
    .day(dateStamp.day)
    .format(format);
}

export function fromS(value: string, format: string){
  const m =  moment(value, format);
  return {
    year: m.year(),
    month: m.month()+1,
    day: m.date()
  };
}
