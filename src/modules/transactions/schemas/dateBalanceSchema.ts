import { array, number, object } from 'yup';
import { dateStr } from '../../utils/schemas';

const dateBalanceSchema = object().shape({
  date: dateStr.required(),
  receipts: number().integer(),
  primary: number().integer(),
  other: number().integer(),
  applied_receipts: number().integer(),
  applied_primary: number().integer(),
  applied_other: number().integer(),
});

export default dateBalanceSchema;
