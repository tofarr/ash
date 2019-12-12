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
  return table().toArray();
}

export function restore(boxes: ContributionBox[]){
  return new Promise((resolve, reject) => {
    Promise.all(boxes.map(box => contributionBoxSchema().validate(box))).then(() => {
      list().then((oldBoxes) => {
        table().bulkDelete(oldBoxes.map(box => box.id as number)).then(()=> {
          table().bulkAdd(boxes).then(resolve, reject);
        }, reject);
      }, reject);
    }, reject);
  });
}
