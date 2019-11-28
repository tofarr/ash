import Dexie from 'dexie';
import Transaction from './types/Transaction';
import TransactionListProps from './types/TransactionListProps';
import transactionSchema from './schemas/transactionSchema';
import db from '../utils/db';

db.version(1).stores({
  transactions: '++id,date,apply_on_date'
})

function table(){
  return db.table<Transaction>('transactions');
}

export function create(transaction: Transaction){
  return new Promise<Transaction>((resolve, reject) => {
    transactionSchema.validate(transaction).then(() => {
      table().add(transaction as Transaction).then((id) => {
        resolve({ ...transaction, id });
      }, reject);
    }, reject);
  });
}

export function read(id: number){
  return table().get(id);
}

export function update(transaction: Transaction){
  return new Promise<Transaction>((resolve, reject) => {
    transactionSchema.validate(transaction).then(() => {
      table().update(transaction.id, transaction).then(() => {
        resolve(transaction);
      }, reject);
    }, reject);
  });
}

export function destroy(id: number){
  return table().delete(id);
}

export function list(props?: TransactionListProps){
  const { date_min, date_max, apply_on_date_min, apply_on_date_max } = props || {};
  let collection: ColXN = range(null, 'date', date_min, date_max);
  collection = range(collection, 'apply_on_date', apply_on_date_min, apply_on_date_max);
  if(collection){
    return collection.sortBy('date');
  }
  return table().orderBy('date').toArray();
}

type IndexedAttrs = 'date'|'apply_on_date';
type ColXN = Dexie.Collection<Transaction, number>|null;

function range(collection: ColXN, attr: IndexedAttrs, min?: string, max?: string){
  if(max && min){
    return between(collection, attr, min, max);
  }else if(min){
    return aboveOrEqual(collection, attr, min);
  }else if(max){
    return below(collection, attr, max);
  }else{
    return collection;
  }
}

function between(collection: ColXN, attr: IndexedAttrs, min: string, max: string){
  if(collection){
    return collection.filter((transaction) => {
      const val = transaction[attr];
      return (!!val && val >= min && val < max);
    });
  }
  return table().where(attr).between(min, max);
}

function aboveOrEqual(collection: ColXN, attr: IndexedAttrs, min: string){
    if(collection){
      return collection.filter((transaction) => {
        const val = transaction[attr];
        return (!!val && val >= min);
      });
    }
    return table().where(attr).aboveOrEqual(min);
}

function below(collection: ColXN, attr: IndexedAttrs, max: string){
    if(collection){
      return collection.filter((transaction) => {
        const val = transaction[attr];
        return (!!val && val < max);
      });
    }
    return table().where(attr).below(max);
}
