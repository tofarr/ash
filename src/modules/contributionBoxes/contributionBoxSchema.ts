import { number, object, string } from 'yup';
import TransactionCode from '../transactions/types/TransactionCode';

export default function contributionBoxSchema(){
  return object().shape({
    id: number().integer().positive(),
    title: string().required(),
    code: string().oneOf(Object.keys(TransactionCode)),
  })
};
