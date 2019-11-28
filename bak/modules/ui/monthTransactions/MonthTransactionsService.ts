
import { destroyMonth, newMonth, readMonth, saveMonth } from '../../persistent/months/MonthService';
import moment from 'moment';
import MonthTransactions from './MonthTransactions';
import { currentDateStr, dateStr, loadSettings } from '../../persistent/settings/SettingsService';
import { createTransaction, destroyTransaction, listTransactions, updateTransaction } from '../../persistent/transactions/TransactionService';
import Transaction from '../../persistent/transactions/models/Transaction';
import { fillAndDownloadPdf } from '../../utils/pdf/PDFFormService';
import { toMoneyS } from '../../utils/money/MoneyService';

export function newMonthTransactions(year: number, month_number: number) {
  return new Promise<MonthTransactions>((resolve, reject) => {
    loadSettings().then((settings) => {
      newMonth(year, month_number).then((month) => {
        resolve({ month, settings, transactions: [] })
      }, reject);
    }, reject);
  });
}


export function loadMonthTransactions(year: number, month_number: number) {
  return new Promise<MonthTransactions>((resolve, reject) => {
    loadSettings().then((settings) => {
      readMonth(year, month_number).then((month) => {
        listTransactions(year, month_number).then((transactions: Transaction[]) => {
          resolve({ month, settings, transactions });
        }, reject);
      }, reject);
    }, reject);
  });
}

export function loadOrNewMonthTransactions(year: number, month_number: number) {
  return new Promise<MonthTransactions>((resolve, reject) => {
    loadMonthTransactions(year, month_number).then(resolve, () => {
      newMonthTransactions(year, month_number).then(resolve, reject);
    });
  });
}

export function saveMonthTransactions(monthTransactions: MonthTransactions){
  return new Promise((resolve, reject) => {
    saveMonth(monthTransactions.month).then(() => {
      listTransactions(monthTransactions.month.year, monthTransactions.month.year).then((existingTransactions) => {
        const toDelete = existingTransactions.map(transaction => transaction.id);
        const all : Promise<any>[] = [];
        monthTransactions.transactions.forEach((transaction) => {
          if(transaction.id){
            const index = toDelete.indexOf(transaction.id);
            if(index >= 0){
              toDelete.splice(index, 1);
            }
            all.push(updateTransaction(transaction));
          }else{
            all.push(createTransaction(transaction));
          }
        });
        all.push.apply(all, toDelete.map(id => destroyTransaction(id as number)));
        Promise.all(all).then(resolve, reject);
      });
    });
  });
}

export function destroyMonthTransactions(year: number, month: number){
  listTransactions(year, year).then((existingTransactions) => {
    const all : Promise<any>[] = existingTransactions.map(
      transaction => destroyTransaction(transaction.id as number)
    );
    all.push(destroyMonth(year, month));
    return Promise.all(all);
  });
}


export function getReceiptsBalance(monthTransactions: MonthTransactions){
  return monthTransactions.transactions.reduce((balance, transaction) => {
    return balance + transaction.receipts_amt;
  }, 0);
}

export function getPrimaryBalance(monthTransactions: MonthTransactions){
  return monthTransactions.transactions.reduce((balance, transaction) => {
    return balance + transaction.primary_amt;
  }, 0);
}

export function getOtherBalance(monthTransactions: MonthTransactions){
  return monthTransactions.transactions.reduce((balance, transaction) => {
    return balance + transaction.other_amt;
  }, 0);
}

export function getReceiptsClosingBalance(monthTransactions: MonthTransactions){
  return monthTransactions.month.opening_receipts + getReceiptsBalance(monthTransactions);
}

export function getPrimaryClosingBalance(monthTransactions: MonthTransactions){
  return monthTransactions.month.opening_primary + getPrimaryBalance(monthTransactions);
}

export function getOtherClosingBalance(monthTransactions: MonthTransactions){
  return monthTransactions.month.opening_other + getOtherBalance(monthTransactions);
}


interface S26Context{
  rowNum: number;
  receiptsIn: number;
  receiptsOut: number;
  primaryIn: number;
  primaryOut: number;
  otherIn: number;
  otherOut: number;
  fieldValues: any;
  notYetAppliedReceiptsIn: number;
  notYetAppliedReceiptsOut: number;
  notYetAppliedPrimaryIn: number;
  notYetAppliedPrimaryOut: number;
  notYetAppliedOtherIn: number;
  notYetAppliedOtherOut: number;
}


export async function fillAndDownloadS26(monthTransactions: MonthTransactions){
  const { settings, month } = monthTransactions;

  const context = <S26Context>{
    rowNum: 1,
    receiptsIn: 0,
    receiptsOut: 0,
    primaryIn: 0,
    primaryOut: 0,
    otherIn: 0,
    otherOut: 0,
    fieldValues: {
      '900_1_Text_C': [settings.congregation_name],
      '900_2_Text_C': [settings.city],
      '900_3_Text_C': [settings.province_or_state],
      '900_4_Text_C': [moment().startOf('month').month(month.month-1).format('MMMM')],
      '900_5_Text_C': [month.year],
      '904_1_Text_C': [currentDateStr(settings)]
    }
  }

  monthTransactions.transactions.forEach((transaction) =>
    processTransaction(transaction, context)
  );

  const { fieldValues } = context;

  fieldValues['901_53_S26TotalValue'] = toMoneyS(context.receiptsIn)
  fieldValues['901_106_S26TotalValue'] = toMoneyS(context.receiptsOut)
  fieldValues['902_53_S26TotalValue'] = toMoneyS(context.primaryIn)
  fieldValues['902_106_S26TotalValue'] = toMoneyS(context.primaryOut)
  fieldValues['903_53_S26TotalValue'] = toMoneyS(context.otherIn)
  fieldValues['903_106_S26TotalValue'] = toMoneyS(context.otherOut)

  if(settings.cash_box){
    fieldValues['904_24_S26Amount'] = [toMoneyS(month.opening_receipts + context.receiptsIn - context.receiptsOut)];
  }else{
    fieldValues['904_2_S26Amount'] = [toMoneyS(month.opening_primary + context.receiptsIn - context.receiptsOut)];
  }



  await fillAndDownloadPdf('/pdf/S-26-E.pdf', fieldValues);
}





function processTransaction(transaction: Transaction, context: S26Context){
  fillFormFromTransaction(transaction, context);
  updateContext(transaction, context);
}

function fillFormFromTransaction(transaction: Transaction, context: S26Context){

  const { rowNum, fieldValues } = context;
  const { day, description, code, receipts_amt, primary_amt, other_amt, breakdown} = transaction;

  fieldValues[`900_${7+rowNum}_Text_C`] = [day];
  fieldValues[`900_${59+rowNum}_Text`] = [description];
  fieldValues[`900_${111+rowNum}_Text_C`] = [code];

  if(receipts_amt > 0){
    fieldValues[`901_${2+rowNum}_S26Value`] = [toMoneyS(receipts_amt)];
  }
  if(receipts_amt < 0){
    fieldValues[`901_${54+rowNum}_S26Value`] = [toMoneyS(-receipts_amt)];
  }
  if(primary_amt > 0){
    fieldValues[`902_${1+rowNum}_S26Value`] = [toMoneyS(primary_amt)];
  }
  if(primary_amt < 0){
    fieldValues[`902_${54+rowNum}_S26Value`] = [toMoneyS(-primary_amt)];
  }
  if(other_amt > 0){
    fieldValues[`903_${1+rowNum}_S26Value`] = [toMoneyS(other_amt)];
  }
  if(other_amt < 0){
    fieldValues[`903_${54+rowNum}_S26Value`] = [toMoneyS(-other_amt)];
  }

  (breakdown || []).forEach((breakdown, index) => {
      fieldValues[`900_${59+rowNum+index+1}_Text`] = [breakdown.description];
  })

}

function updateContext(transaction: Transaction, context: S26Context){
  const { breakdown, receipts_amt, primary_amt, other_amt} = transaction;
  context[(receipts_amt > 0) ? 'receiptsIn' : 'receiptsOut'] += receipts_amt;
  context[(primary_amt > 0) ? 'primaryIn' : 'primaryOut'] += primary_amt;
  context[(other_amt > 0) ? 'otherIn' : 'otherOut'] += other_amt;
  context.rowNum++;
  if(breakdown){
    context.rowNum += breakdown.length;
  }
}
