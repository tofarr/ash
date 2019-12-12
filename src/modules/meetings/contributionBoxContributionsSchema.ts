import { number, object } from 'yup';
import contributionBoxSchema from '../contributionBoxes/contributionBoxSchema';

const NUM = number().integer().min(0).required();

export default function meetingSchema(){
  return object().shape({
    cash: NUM,
    cheques: NUM,
    box: contributionBoxSchema().required(),
  });
};
