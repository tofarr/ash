import { number, NumberSchema, object, string } from 'yup';
import TransactionCode from './models/TransactionCode';

export default function transactionSchema(){
  return object().shape({
    year: number().integer().positive().required(),
    month: number().integer().positive().required(),
    receipts_amt: number().integer().required()
      .when(['code', 'cash', 'cheques'],
        (code: string, cash: number|undefined, cheques: number|undefined, schema: NumberSchema) => {
          switch(code as unknown){
            case TransactionCode.C:
            case TransactionCode.W:
              return schema.positive().oneOf([(cash as number)+(cheques as number)], 'Receipts should match sum of cash and cheques');
            case TransactionCode.D:
              return schema.negative('Deposits should be debited from receipts (Receipts should be negative)');
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
        (code: string, receipts_amt: number, schema: NumberSchema) => {
          switch(code as unknown){
            case TransactionCode.C:
            case TransactionCode.W:
              return schema.oneOf([0], 'Contributions should be applied as receipts. A separate deposit item should be created for crediting the primary account.');
            case TransactionCode.D:
              return schema.positive().oneOf([-receipts_amt], 'Receipts and Primary amounts should match for Deposits');
            case TransactionCode.CE:
            case TransactionCode.I:
              return schema.positive('Primary amount should be positive for Electronic Contributions / Interest Payments');
            default:
              return schema;
          }
        }
      ),
    other_amt: number().integer().required()
      .when('code',
        (code: string, schema: NumberSchema) => {
          return code ? schema.oneOf([0], 'Amounts for other are not supported when a code is specified') : schema;
        }
      ),
    code: string().oneOf(Object.keys(TransactionCode)),
    description: string().required(),
    statement_year: number().integer().positive(),
    statement_month: number().integer().positive(),
    statement_day: number().integer().positive(),
  });
};
