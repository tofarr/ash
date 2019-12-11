import { array, number, object } from 'yup';
import { dateStr } from '../utils/schemas';
import contributionBoxSchema from '../contributionBoxes/contributionBoxSchema';

const NUM = number().integer().min(0).required();

export default function meetingSchema(){
  return object().shape({
    date: dateStr.required(),
    congregation_cash: NUM,
    congregation_cheques: NUM,
    worldwide_cash: NUM,
    worldwide_cheques: NUM,
    special_contribution_boxes: array().of(contributionBoxSchema().required()),
  });
};
