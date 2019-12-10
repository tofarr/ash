import ContributionBox from './ContributionBox';
import contributionBoxSchema from './contributionBoxSchema';
import db from '../utils/db';
import TransactionCode, { describeTransactionCodeShort } from '../transactions/types/TransactionCode';

db.version(1).stores({
  contribution_boxes: '++id,title'
})

db.on("populate", () => {
  [TransactionCode.W, TransactionCode.C, TransactionCode.B].forEach((code) => {
    (db as any).contribution_boxes.add({
      code,
      title: describeTransactionCodeShort(code),
    });
  });
});

function table(){
  return db.table<ContributionBox>('contribution_boxes');
}

export function create(box: ContributionBox){
  return new Promise<ContributionBox>((resolve, reject) => {
    contributionBoxSchema().validate(box).then(() => {
      table().add(box as ContributionBox).then((id) => {
        resolve({ ...box, id });
      }, reject);
    }, reject);
  });
}

export function read(id: number){
  return table().get(id);
}

export function update(box: ContributionBox){
  return new Promise<ContributionBox>((resolve, reject) => {
    contributionBoxSchema().validate(box).then(() => {
      table().update(box.id, box).then(() => {
        resolve(box);
      }, reject);
    }, reject);
  });
}

export function destroy(id: number){
  return table().delete(id);
}

export function list(){
  return table().orderBy('title').toArray();
}

export function editAll(toCreate: ContributionBox[], toUpdate: ContributionBox[], toDestroy: number[]){
  return new Promise<ContributionBox[]>((resolve, reject) => {
    const validations = toCreate.map(box => contributionBoxSchema().validate(box));
    validations.push.apply(validations, toUpdate.map(box => contributionBoxSchema().validate(box)));
    Promise.all(validations).then(() => {
      const t = table();
      db.transaction('rw', t, () => {
        return new Promise((resolve, reject) => {
          const promises = toCreate.map(box => t.add(box));
          promises.push.apply(promises, toUpdate.map(box => t.update(box.id, box)));
          promises.push.apply(promises, toDestroy.map(id => t.delete(id)));
          Promise.all(promises).then(resolve, reject);
        });
      }).then(() => {
        list().then(resolve, reject)
      }, reject);
    }, reject);
  })
}
