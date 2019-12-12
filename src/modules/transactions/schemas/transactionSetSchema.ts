import { array, object } from 'yup';

import dateBalanceSchema from './dateBalanceSchema';
import transactionSchema from './transactionSchema';

export default function transactionSetSchema(){
  return object().shape({
    start: dateBalanceSchema(),
    transactions: array().of(transactionSchema().required())
  });
}
