import { array, number, object, string, StringSchema } from 'yup';
import { dateStr } from '../utils/schemas';
import TransferToBranch from './TransferToBranch';

interface YupContext{
  path: any;
  createError: any;
}

export default function transactionSchema(){
  return object().shape({
    date: dateStr.required(),
    apply_on_date: dateStr.required().when(['date'],
      (date: string, schema: StringSchema) => {
        return schema.test(
          'apply_on_date_gt_date',
          'Applied date should be the same as or later than date',
          (apply_on_date: string) => {
            return !apply_on_date || apply_on_date >= date;
          })
      }
    ),
    confirmation_code: string().required(),
    breakdown: array().min(1).of(
      object().shape({
        description: string().required(),
        amt: number().integer().min(0, 'All Amounts must be 0 or Greater').required()
      })
    ).required()
  });
};
