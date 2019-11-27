import DbService from '../DbService';
import { loadSettings, meetingDates } from '../settings/SettingsService';
import Transaction from './models/Transaction';
import transactionSchema from './TransactionSchema';
import TransactionCode from './models/TransactionCode';
import addErr from '../../utils/Err';
import { addMsg } from '../../utils/msgs/MsgService';
import { fillAndDownloadPdf } from '../../utils/pdf/PDFFormService';

DbService.version(1).stores({
  transactions: '++id,[year+month]'
})

function table(){
  return DbService.table<Transaction>('transactions');
}

export function newTransaction(
  year: number,
  month: number,
  day: number,
  description: string,
  code?: TransactionCode
): Transaction{
  return {
    year,
    month,
    day,
    description,
    code,
    receipts_amt: 0,
    primary_amt: 0,
    other_amt: 0,
  }
}

export function newMeetingTransactions(year: number, month: number){
  return new Promise<Transaction[]>((resolve, reject) => {
    loadSettings().then((settings) => {
      const transactions: Transaction[] = [];
      meetingDates(year, month, settings.meeting_days).forEach((date: number) => {
        transactions.push(newTransaction(year, month, date, 'Contributions - Congregation', TransactionCode.C));
        transactions.push(newTransaction(year, month, date, 'Contributions - WW', TransactionCode.W));
      });
      resolve(transactions);
    }, reject);
  });
}

export function createTransaction(transaction:Transaction){
  return new Promise<Transaction>((resolve, reject) => {
    function handleReject(err: any){
      addErr(err);
      reject(err);
    }
    transactionSchema().validate(transaction).then(() => {
      table().add(transaction as Transaction).then((id) => {
        addMsg('Transaction Created');
        resolve({ ...transaction, id });
      }, handleReject);
    }, handleReject);
  });
}

export function readTransaction(transactionId: number){
  return new Promise<Transaction>((resolve, reject) => {
    table().get(transactionId).then((transaction) => {
      if(transaction){
        resolve(transaction);
      }
      reject(`unknownTransaction:${transactionId}`);
    }, reject);
  })
}

export function updateTransaction(transaction:Transaction){
  return new Promise<Transaction>((resolve, reject) => {
    function handleReject(err: any){
      addErr(err);
      reject(err);
    }
    transactionSchema().validate(transaction).then(() => {
      table().update(transaction.id, transaction)
        .then(() => {
          addMsg('Transaction Created');
          resolve(transaction);
        }, handleReject);
    }, handleReject);
  });
}

export function destroyTransaction(transaction_id:number){
  return table().delete(transaction_id);
}

export function listTransactions(year: number, month: number){
  return table().where({year: year, month: month}).sortBy('date');
}

export async function fillAndDownloadTO62ForTransaction(transaction: Transaction){
  await fillAndDownloadPdf('/pdf/TO-62-E.pdf', {
    // Field names / values here...
    '900_4_Text': ['Value Set from Javascript']
  });
}
