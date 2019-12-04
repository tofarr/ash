import { array, number, object } from 'yup';

import dateBalanceSchema from './dateBalanceSchema';
import transactionSchema from './transactionSchema';

const TransactionSetSchema = object().shape({
  start: dateBalanceSchema,
  transactions: array().of(transactionSchema.required())
});

export default TransactionSetSchema;
