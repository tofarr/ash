import { number, object, StringSchema } from 'yup';
import Deposit from './Deposit';
import { dateStr } from '../utils/schemas';

interface YupContext{
  path: any;
  createError: any;
}

const NUM = number().integer().min(0).required();

export default function transactionSchema(){
  return object().shape({
    date: dateStr.required(),
    apply_on_date: dateStr.required().when(['date'],
      (date: string, schema: StringSchema) => {
        return schema.test(
          'apply_on_date_gt_date',
          'Applied date should be the same as or later than date',
          (apply_on_date: string) => {
            return apply_on_date >= date;
          })
      }
    ),
    cash: NUM,
    cheques: NUM,
  }).test('transaction-month-year-match',
    'Deposit Total should not be 0',
    function(this: YupContext, deposit: Deposit) {
      return deposit.cash > 0 || deposit.cheques > 0
    }
  );
};
