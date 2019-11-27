import DbService from '../DbService';
import { loadSettings, meetingDates, currentDateStr } from '../settings/SettingsService';
import Transaction from './models/Transaction';
import transactionSchema from './TransactionSchema';
import TransactionCode from './models/TransactionCode';
import TransactionBreakdown from './models/TransactionBreakdown';
import TransactionBreakdownCode from './models/TransactionBreakdownCode';
import addErr from '../../utils/Err';
import { addMsg } from '../../utils/msgs/MsgService';
import { fillAndDownloadPdf } from '../../utils/pdf/PDFFormService';
import { toS } from '../../utils/money/MoneyService';

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

function getWithCode(breakdown: TransactionBreakdown[]|undefined, code: TransactionBreakdownCode){
  if(!breakdown){
    return [''];
  }
  return [toS(breakdown.reduce((sum, b) => {
    return sum + ((b.code == code && b.amt) ? b.amt : 0);
  }, 0))];
}

function truncate(str: string, len: number){
  return str.length <= len ? str : str.substring(len) + '...';
}

export async function fillAndDownloadTO62ForTransaction(transaction: Transaction){
  const { breakdown } = transaction;
  const settings = await loadSettings();

  const total = breakdown ? breakdown.reduce((sum, b) => sum + (b.amt || 0), 0): 0;

  await fillAndDownloadPdf('/pdf/TO-62-E.pdf', {
    // Field names / values here...
    '900_1_CheckBox': [true], // Type congregation
    '900_5_CheckBox': [!!transaction.confirmation_code], // Type Automatic Transfer
    '900_4_Text': [settings.congregation_name], // congregation name (from settings)

    '901_1_TO62Donate': getWithCode(breakdown, TransactionBreakdownCode.WW_BOX),
    '901_2_TO62Donate': getWithCode(breakdown, TransactionBreakdownCode.WW_RESOLUTION),
    '901_3_TO62Donate': getWithCode(breakdown, TransactionBreakdownCode.KHAHC),
    '901_4_TO62Donate': getWithCode(breakdown, TransactionBreakdownCode.GAA),
    '901_5_TO62Donate': getWithCode(breakdown, TransactionBreakdownCode.COAA),

    // '901_6_TO62Donate': ['7'], //Payment of Charges on Account
    // '901_7_TO62Donate': ['8'], //Video Equipment (Resolution)
    '901_8_TO62Donate': getWithCode(breakdown, TransactionBreakdownCode.OTHER),
    '900_8_Text': [breakdown ?
        truncate(breakdown
          .filter(b => b.code == TransactionBreakdownCode.OTHER)
          .map(b => b.description)
          .join(' / ')
        , 55)
       : ''],

    '900_9_Text': [transaction.confirmation_code || ''],
    '901_9_TO62TotalDonate': [toS(total)],
    // '901_10_TO62Funds': ['14'], // send funds to be kept with branch office (Using branch as bank?)
    '901_11_TO62TotalFunds': [toS(total)], //Total (Including send funds)
    // '901_12_TO62Funds': ['18'], // request funds be kept with branch office
    '900_10_Text': [currentDateStr(settings)], // Transaction Date
    '900_11_Text_C': [transaction.confirmation_code || ''], // confirmation number 1
    //'900_12_Text_C': ['17'], // confirmation number 2
    '900_13_Text_C': [settings.accounts_servant_or_overseer], // Accounts servant or overseer
    '900_14_Text_C': [settings.authorized_signer], // authorized signer
  });
}
