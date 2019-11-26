import { number, object } from 'yup';
import Deposit from './Deposit';

interface YupContext{
  path: any;
  createError: any;
}

const NUM = number().integer().min(0).required();

export default function transactionSchema(){
  return object().shape({
    year: NUM,
    month: NUM,
    day: NUM,
    cash: NUM,
    cheques: NUM,
  }).test('transaction-month-year-match',
    'Deposit Total should not be 0',
    function(this: YupContext, deposit: Deposit) {
      return deposit.cash > 0 || deposit.cheques > 0
    }
  );
};
