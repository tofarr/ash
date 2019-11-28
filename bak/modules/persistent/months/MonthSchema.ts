import { number, object } from 'yup';

export default function monthSchema(){
  return object().shape({
    year: number().integer().positive().required(),
    month: number().integer().positive().required(),
    opening_receipts: number().integer().required(),
    opening_primary: number().integer().required(),
    opening_other: number().integer().required()
  });
};
