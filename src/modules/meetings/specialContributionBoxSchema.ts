import { number, object, string } from 'yup';

const NUM = number().integer().min(0).required();

export default function specialContributionBoxSchema(){
  return object().shape({
    title: string().required(),
    cash: NUM,
    cheques: NUM
  });
};
