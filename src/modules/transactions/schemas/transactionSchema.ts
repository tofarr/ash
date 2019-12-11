import { array, number, NumberSchema, object, string, StringSchema } from 'yup';
import Transaction from '../types/Transaction';
import TransactionBreakdown from '../types/TransactionBreakdown';
import TransactionCode from '../types/TransactionCode';
import transactionBreakdownSchema from './transactionBreakdownSchema';
import { YupContext, dateStr } from '../../utils/schemas';

export default function transactionSchema(){
  return object().shape({
    id: number().integer(),
    date: dateStr.required(),
    receipts_amt: number().integer().required()
      .when(['code', 'cash', 'cheques'],
        (code: TransactionCode|undefined, cash: number|undefined, cheques: number|undefined, schema: NumberSchema) => {
          switch(code as unknown){
            case TransactionCode.C:
            case TransactionCode.W:
              return schema.min(0).oneOf([(cash as number)+(cheques as number)], 'Receipts should match sum of cash and cheques');
            case TransactionCode.D:
              return schema.max(0, 'Deposits should be debited from receipts (Receipts should be negative)');
            case TransactionCode.CE:
            case TransactionCode.I:
              return schema.oneOf([0]);
            default:
              return schema;
          }
        }
      ),
    primary_amt: number().integer().required()
      .when(['code', 'receipts_amt'],
        (code: TransactionCode|undefined, receipts_amt: number, schema: NumberSchema) => {
          switch(code as unknown){
            case TransactionCode.C:
            case TransactionCode.W:
              return schema.oneOf([0], 'Contributions should be applied as receipts. A separate deposit item should be created for crediting the primary account.');
            case TransactionCode.D:
              return schema.min(0).oneOf([-receipts_amt], 'Receipts and Primary amounts should match for Deposits');
            case TransactionCode.CE:
            case TransactionCode.I:
              return schema.min(0, 'Primary amount should be positive for Electronic Contributions / Interest Payments');
            default:
              return schema;
          }
        }
      ),
    other_amt: number().integer().required()
      .when('code',
        (code: TransactionCode|undefined, schema: NumberSchema) => {
          return code ? schema.oneOf([0], 'Amounts for other are not supported when a code is specified') : schema;
        }
      ),
    code: string().oneOf(Object.keys(TransactionCode)),
    description: string().required(),
    apply_on_date: dateStr.when(['date'],
      (date: string, schema: StringSchema) => {
        return schema.test(
          'apply_on_date_gt_date',
          'Applied date should be the same as or later than date',
          (apply_on_date: string) => {
            return !apply_on_date || apply_on_date >= date;
          })
      }
    ),
    breakdown: array().of(transactionBreakdownSchema())
  }).test('breakdown_total_match',
    'Breakdown total should match one of the transaction amounts',
    function(this: YupContext, transaction: Transaction) {
      const { breakdown } = transaction;
      if(!breakdown){
        return true;
      }
      const total = breakdown.reduce((sum: number|null, item: TransactionBreakdown) => {
        if(sum == null || item.amt == null){
          return null;
        }
        return sum + item.amt;
      }, 0);
      return total == null ||
        total === transaction.receipts_amt ||
        total === transaction.primary_amt ||
        total === transaction.other_amt;
    }
  );
}
