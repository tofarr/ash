import { number, object, string } from 'yup';
import TransactionBreakdownCode from '../types/TransactionBreakdownCode';

export default function transactionBreakdownSchema(){
  return object().shape({
    id: number().positive(),
    code: string().oneOf(Object.keys(TransactionBreakdownCode)),
    description: string(),
    amt: number().integer()
  });
}
