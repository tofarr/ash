import { number, object } from 'yup';
import { dateStr } from '../utils/schemas';

const NUM = number().integer().min(0).required();

export default function transactionSchema(){
  return object().shape({
    date: dateStr.required(),
    congregation_cash: NUM,
    congregation_cheques: NUM,
    worldwide_cash: NUM,
    worldwide_cheques: NUM,
    construction_cash: NUM,
    construction_cheques: NUM,
  });
};
