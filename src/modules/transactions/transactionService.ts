import DateBalance from './types/DateBalance';
import Transaction from './types/Transaction';
import TransactionBreakdown from './types/TransactionBreakdown';
import TransactionBreakdownCode from './types/TransactionBreakdownCode';
import TransactionCode from './types/TransactionCode';
import TransactionListProps from './types/TransactionListProps';
import TransactionSet from './types/TransactionSet';

import * as dao from './transactionDAO';
import { loadSettings, currentDateStr } from '../settings/SettingsService';

import { todayStr } from '../utils/date';
import { addMsg } from '../utils/msgs/service';
import addErr from '../utils/err';
import { toMoneyS } from '../utils/money/service';
import { fillAndDownloadPdf } from '../utils/pdf';

export function create(transaction: Transaction){
  return new Promise((resolve, reject) => {
    dao.create(transaction).then((transaction) => {
      addMsg('Transaction Created');
      resolve(transaction);
    }, (err: any) => {
      addErr(err);
      reject(err);
    });
  })
}

export function read(id: number){
  return dao.read(id);
}

export function update(transaction: Transaction){
  return new Promise((resolve, reject) => {
    dao.update(transaction).then((transaction) => {
      addMsg('Transaction Updated');
      resolve(transaction);
    }, (err: any) => {
      addErr(err);
      reject(err);
    });
  });
}

export function destroy(id: number){
  return new Promise((resolve, reject) => {
    dao.destroy(id).then(() => {
      addMsg('Transaction Destroyed');
      resolve();
    }, (err: any) => {
      addErr(err);
      reject(err);
    });
  });
}

export function list(props?: TransactionListProps){
  return dao.list(props);
}

export function newInstance(
  description: string,
  date?: string,
  code?: TransactionCode
): Transaction{
  return {
    date: date || todayStr(),
    apply_on_date: date || todayStr(),
    description,
    code,
    receipts_amt: 0,
    primary_amt: 0,
    other_amt: 0,
  }
}

export function loadDateBalance(date: string){
  return new Promise<DateBalance>((resolve, reject) => {
    dao.list({ date_max: date }).then((transactions) => {
      resolve(buildBalance(transactions, date));
    }, reject);
  });
}

export function loadTransactionSet(date_min: string, date_max: string){
  return new Promise<TransactionSet>((resolve, reject) => {
    loadDateBalance(date_min).then((start) => {
      list({ date_min, date_max }).then((transactions) => {
        resolve({ start, transactions, date_max });
      }, reject);
    }, reject);
  });
}

export function buildEndBalance(transactionSet: TransactionSet){
   const endBalance = buildBalance(transactionSet.transactions, transactionSet.date_max);
   const {start } = transactionSet;
   endBalance.receipts += start.receipts;
   endBalance.primary += start.primary;
   endBalance.other += start.other;
   endBalance.applied_receipts += start.applied_receipts;
   endBalance.applied_primary += start.applied_primary;
   endBalance.applied_other += start.applied_other;
   return endBalance;
}

function buildBalance(transactions: Transaction[], date: string): DateBalance{
  return transactions.reduce((dateBalance, transaction) => {
    dateBalance.receipts += transaction.receipts_amt;
    dateBalance.primary += transaction.primary_amt;
    dateBalance.other += transaction.other_amt;
    if(transaction.apply_on_date && date < transaction.apply_on_date){
      dateBalance.applied_receipts += transaction.receipts_amt;
      dateBalance.applied_primary += transaction.primary_amt;
      dateBalance.applied_other += transaction.other_amt;
    }
    return dateBalance;
  }, {
    date,
    receipts: 0,
    primary: 0,
    other: 0,
    applied_receipts: 0,
    applied_primary: 0,
    applied_other: 0,
  });
}

export function isPending(transaction: Transaction, date: string){
  return (!transaction.apply_on_date) || transaction.apply_on_date >= date
}

function getWithCode(breakdown: TransactionBreakdown[]|undefined, code?: TransactionBreakdownCode){
  if(!breakdown){
    return [''];
  }
  return [toMoneyS(breakdown.reduce((sum, b) => {
    return sum + ((b.code === code && b.amt) ? b.amt : 0);
  }, 0))];
}

function truncate(str: string, len: number){
  return str.length <= len ? str : str.substring(len) + '...';
}

export async function fillAndDownloadTO62(transaction: Transaction){
  const { breakdown } = transaction;
  const settings = await loadSettings();

  const total = breakdown ? breakdown.reduce((sum, b) => sum + (b.amt || 0), 0): 0;

  await fillAndDownloadPdf('/pdf/TO-62-E.pdf', {
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
    '901_8_TO62Donate': getWithCode(breakdown, undefined),
    '900_8_Text': [breakdown ?
        truncate(breakdown
          .filter(b => !b.code)
          .map(b => b.description)
          .join(' / ')
        , 55)
       : ''],

    '900_9_Text': [transaction.confirmation_code || ''],
    '901_9_TO62TotalDonate': [toMoneyS(total)],
    // '901_10_TO62Funds': ['14'], // send funds to be kept with branch office (Using branch as bank?)
    '901_11_TO62TotalFunds': [toMoneyS(total)], //Total (Including send funds)
    // '901_12_TO62Funds': ['18'], // request funds be kept with branch office
    '900_10_Text': [currentDateStr(settings)], // Transaction Date
    '900_11_Text_C': [transaction.confirmation_code || ''], // confirmation number 1
    //'900_12_Text_C': ['17'], // confirmation number 2
    '900_13_Text_C': [settings.accounts_servant_or_overseer], // Accounts servant or overseer
    '900_14_Text_C': [settings.authorized_signer], // authorized signer
  });
}
