import { array, number, object } from 'yup';
import contributionBoxSchema from '../contributionBoxes/contributionBoxSchema';
import settingsSchema from '../settings/settingsSchema';
import transactionBreakdownSchema from '../transactions/schemas/transactionBreakdownSchema';
import transactionSchema from '../transactions/schemas/transactionSchema';

export default function backupSchema(){
  return object().shape({
    timestamp: number().positive().required(),
    settings: settingsSchema().required(),
    transactions: array().of(transactionSchema().required()),
    boxes: array().of(contributionBoxSchema().required()),
    default_transaction_breakdowns: array().of(transactionBreakdownSchema().required()),
  })
}
