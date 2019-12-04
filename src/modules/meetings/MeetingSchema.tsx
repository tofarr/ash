import { array, number, object } from 'yup';
import { dateStr } from '../utils/schemas';
import specialContributionBoxSchema from './specialContributionBoxSchema';

const NUM = number().integer().min(0).required();

export default function transactionSchema(){
  return object().shape({
    date: dateStr.required(),
    congregation_cash: NUM,
    congregation_cheques: NUM,
    worldwide_cash: NUM,
    worldwide_cheques: NUM,
    special_contribution_boxes: array().of(specialContributionBoxSchema().required()),
  });
};
