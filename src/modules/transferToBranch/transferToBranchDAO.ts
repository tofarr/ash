
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

export function editAll(toCreate: TransactionBreakdown[], toUpdate: TransactionBreakdown[], toDestroy: number[]){
  return new Promise<TransactionBreakdown[]>((resolve, reject) => {
    const validations = toCreate.map(box => transactionBreakdownSchema().validate(box));
    validations.push.apply(validations, toUpdate.map(breakdown => transactionBreakdownSchema().validate(breakdown)));
    Promise.all(validations).then(() => {
      const t = table();
      db.transaction('rw', t, () => {
        return new Promise((resolve, reject) => {
          const promises = toCreate.map(breakdown => t.add(breakdown));
          promises.push.apply(promises, toUpdate.map(breakdown => t.update(breakdown.id, breakdown)));
          promises.push.apply(promises, toDestroy.map(id => t.delete(id)));
          Promise.all(promises).then(resolve, reject);
        });
      }).then(() => {
        list().then(resolve, reject)
      }, reject);
    }, reject);
  })
}
