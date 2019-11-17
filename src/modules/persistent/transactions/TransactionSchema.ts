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
              return schema.positive().oneOf([(cash as number)+(cheques as number)]);
            case TransactionCode.D:
              return schema.negative();
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
              return schema.oneOf([0]);
            case TransactionCode.D:
              return schema.positive().oneOf([-receipts_amt]);
            case TransactionCode.CE:
            case TransactionCode.I:
              return schema.positive();
            default:
              return schema;
          }
        }
      ),
    other_amt: number().integer().required()
      .when('code',
        (code: string, schema: NumberSchema) => {
          return code ? schema.oneOf([0]) : schema;
        }
      ),
    code: string().required().oneOf(Object.keys(TransactionCode)),
    description: string().required(),
    statement_year: number().integer().positive().required(),
    statement_month: number().integer().positive().required(),
    statement_day: number().integer().positive().required(),
  });
};
