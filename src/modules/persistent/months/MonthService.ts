
import DbService from '../DbService';
import moment from 'moment';
import Month from './Month';
import { listTransactions } from '../transactions/TransactionService';

DbService.version(1).stores({
  months: '[year+month],year'
})

function table(){
  return DbService.table<Month>('months');
}

//New month is always based on the previous month's transactions... (If it exists!)
export function newMonth(year:number, month:number){
  return new Promise<Month>((resolve, reject) => {

    const prev = moment().startOf('month').month(month-1).year(year).add(-1, 'month');
    const prevYear = prev.year();
    const prevMonthNum = prev.month() + 1;

    const newMonth = {
      year,
      month,
      opening_receipts: 0,
      opening_primary: 0,
      opening_other: 0,
    }

    function applyTransactions(){
      listTransactions(prevYear, prevMonthNum).then((transactions) => {
        transactions.forEach((transaction) => {
          newMonth.opening_receipts += transaction.receipts_amt;
          newMonth.opening_primary += transaction.primary_amt;
          newMonth.opening_other += transaction.other_amt;
        });
        resolve(newMonth);
      }, reject);
    }

    readMonth(prevYear, prevMonthNum).then((prevMonth) => {
      newMonth.opening_receipts = prevMonth.opening_receipts;
      newMonth.opening_primary = prevMonth.opening_primary;
      newMonth.opening_other = prevMonth.opening_other;
      applyTransactions();
    }, applyTransactions);
  });
}

export function saveMonth(month:Month) {
  return new Promise((resolve, reject) => {
    readMonth(month.year, month.month).then(() => {
      updateMonth(month).then(resolve, reject);
    }, () => {
      createMonth(month).then(resolve, reject);
    });
  });
}

export function ensureMonthExists(year: number, month: number){
  return new Promise((resolve, reject) => {
    readMonth(year, month).then(resolve, () => {
      newMonth(year, month).then((month) => {
        createMonth(month).then(resolve, reject);
      }, reject);
    })
  })
}

export function createMonth(month:Month){
  return new Promise<Month>((resolve, reject) => {
    console.log('createMonth', month);
    table().add(month).then(() => {
      resolve(month);
    }, reject);
  });
}

export function readMonth(year:number, month:number){
  return new Promise<Month>((resolve, reject) => {
    table().get({ year, month }).then((month) => {
      if(month){
        resolve(month);
      }
      reject(`UnknownMonth:${year}-${month}`);
    }, reject);
  })
}

export function loadOrNewMonth(year:number, month:number){
  return new Promise<Month>((resolve, reject) => {
    readMonth(year, month).then(resolve, () => {
      newMonth(year, month).then(resolve, reject);
    });
  });
}

export function updateMonth(month:Month){
  return new Promise<Month>((resolve, reject) => {
    table().update({ year: month.year, month: month.month }, month).then(() => {
      resolve(month);
    }, reject);
  });
}

export function destroyMonth(year:number, month:number){
  return table().delete({ year, month });
}

export function listMonths(year:number){
  return table().where({ year: year }).sortBy('date');
}
