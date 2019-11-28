import { number, object, string } from 'yup';
import TransactionBreakdownCode from '../types/TransactionBreakdownCode';

const dateBalanceSchema = object().shape({
  id: number().positive(),
  code: string().oneOf(Object.keys(TransactionBreakdownCode)),
  description: string(),
  amt: number().integer()
});

export default dateBalanceSchema;
