
import db from '../utils/db';
import TransactionBreakdown from '../transactions/types/TransactionBreakdown';
import TransactionBreakdownCode, { describeTransactionBreakdownCodeShort } from '../transactions/types/TransactionBreakdownCode';
import transactionBreakdownSchema from '../transactions/schemas/transactionBreakdownSchema';

db.version(1).stores({
  transaction_breakdowns: '++id'
})

db.on("populate", () => {
  [ TransactionBreakdownCode.WW_RESOLUTION,
    TransactionBreakdownCode.KHAHC,
    TransactionBreakdownCode.GAA,
    TransactionBreakdownCode.COAA,
  ].forEach(code => {
    (db as any).transaction_breakdowns.add({
      code,
      description: describeTransactionBreakdownCodeShort(code),
      amt: 0,
    });
  })
});

function table(){
  return db.table<TransactionBreakdown>('transaction_breakdowns');
}

export function list(){
  return table().toArray();
}


export function restore(breakdowns: TransactionBreakdown[]){
  return new Promise((resolve, reject) => {
    Promise.all(breakdowns.map(breakdown => transactionBreakdownSchema().validate(breakdown))).then(() => {
      list().then((oldBreakdowns) => {
        table().bulkDelete(oldBreakdowns.map(box => box.id as number)).then(()=> {
          table().bulkAdd(breakdowns).then(resolve, reject);
        }, reject);
      }, reject);
    }, reject);
  });
}
