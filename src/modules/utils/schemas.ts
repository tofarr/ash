import moment from 'moment';
import { number, string } from 'yup';
import { DATE_FORMAT } from './date';

export interface YupContext{
  path: any;
  createError: any;
}

export const dateStr = string().test('valid-date', 'Invalid Date',
  function(this: YupContext, str?: string) {
    return !(str) || moment(str, DATE_FORMAT).format(DATE_FORMAT) === str;
  });


export const positiveNum = number().integer().min(0);
