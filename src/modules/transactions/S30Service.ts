import moment from 'moment';
import { DATE_FORMAT } from '../utils/date';
import { currentDateStr } from '../settings/settingsService';
import Settings from '../settings/Settings';
import DateBalance from './types/DateBalance';
import Transaction from './types/Transaction';
import TransactionCode, { isLocalCongregation } from './types/TransactionCode';
import TransactionSet from './types/TransactionSet';
import { toMoneyS } from '../utils/money/service';
import { fillAndDownloadPdf } from '../utils/pdf';
import { buildEndBalance, isPending } from './transactionService';

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

export async function fillAndDownloadS30(transactionSet: TransactionSet, settings: Settings){
  const fieldValues: any = {}

  fillInHeading(fieldValues, transactionSet, settings);
  const receipts = fillInReceipts(fieldValues, transactionSet);
  const disbursements = fillInDisbursements(fieldValues, transactionSet);
  //fillInTotals(fieldValues, transactionSet, receipts, disbursements, settings);
  fillInSummary(fieldValues, transactionSet, settings);

  await fillAndDownloadPdf('/pdf/S-30-E.pdf', fieldValues);
}


function buildTotalCongregationReceipts(transactionSet: TransactionSet){
  return transactionSet.transactions.reduce((sum, transaction) => {
    if(!isLocalCongregation(transaction.code)){
      return sum;
    }
    if(transaction.receipts_amt > 0){
      sum += transaction.receipts_amt;
    }
    if(transaction.primary_amt > 0){
      sum += transaction.primary_amt;
    }
    if(transaction.other_amt > 0){
      sum += transaction.other_amt;
    }
    return sum;
  }, 0);
}

function buildTotalCongregationDisbursements(transactionSet: TransactionSet){
  return transactionSet.transactions.reduce((sum, transaction) => {
    if(isLocalCongregation(transaction.code) !== false){
      return sum;
    }
    if(transaction.receipts_amt > 0){
      sum += transaction.receipts_amt;
    }
    if(transaction.primary_amt > 0){
      sum += transaction.primary_amt;
    }
    if(transaction.other_amt > 0){
      sum += transaction.other_amt;
    }
    return sum;
  }, 0);
}

function fillInHeading(fieldValues: any, transactionSet: TransactionSet, settings: Settings){
  const { start } = transactionSet;
  fieldValues['900_1_Text'] = [settings.congregation_name];
  fieldValues['900_2_Text'] = [moment(start.date, DATE_FORMAT).format(settings.formatting.month_format)];
  fieldValues['901_1_S30BOM'] = [toMoneyS(start.receipts + start.primary + start.other)];
}

function fillInReceipts(fieldValues: any, transactionSet: TransactionSet){
  const { transactions } = transactionSet;
  const congregationBoxTotal = transactions.reduce((sum, transaction) => {
    return sum + (transaction.code === TransactionCode.C ? transaction.receipts_amt : 0);
  }, 0);
  const congregationElectronicTotal = transactions.reduce((sum, transaction) => {
    return sum + (transaction.code === TransactionCode.CE ? transaction.primary_amt : 0);
  }, 0);
  fieldValues['901_2_S30CongRec'] = [toMoneyS(congregationBoxTotal)];
  fieldValues['901_3_S30CongRec'] = [toMoneyS(congregationElectronicTotal)];

  //congregation - local receipts not marked C, or CE...
  let offset = 0;
  transactions.forEach((transaction) => {
    if(transaction.code == TransactionCode.C ||
      transaction.code == TransactionCode.CE ||
      !isLocalCongregation(transaction.code)){
      return;
    }
    let amt = 0
    if(transaction.receipts_amt > 0){
      amt += transaction.receipts_amt;
    }
    if(transaction.primary_amt > 0){
      amt += transaction.primary_amt;
    }
    if(transaction.other_amt > 0){
      amt += transaction.other_amt;
    }
    if(amt){
      fieldValues[`900_${3+offset}_Text`] = [transaction.description];
      fieldValues[`901_${4+offset}_S30CongRec`] = [toMoneyS(amt)];
    }
  });

  fieldValues['901_6_S30TotalCongRec'] = [toMoneyS(buildTotalCongregationReceipts(transactionSet))];


  const worldwideBoxTotal = transactions.reduce((sum, transaction) => {
    return sum + (transaction.code === TransactionCode.W ? transaction.receipts_amt : 0);
  }, 0);
  fieldValues['901_7_S30OtherRec'] = [toMoneyS(worldwideBoxTotal)];

  //other - worldwide receipts not marked W...
  offset = 0;
  transactions.forEach((transaction) => {
    if(transaction.code == TransactionCode.W ||
      !isLocalCongregation(transaction.code)){
      return;
    }
    let amt = 0
    if(transaction.receipts_amt > 0){
      amt += transaction.receipts_amt;
    }
    if(transaction.primary_amt > 0){
      amt += transaction.primary_amt;
    }
    if(transaction.other_amt > 0){
      amt += transaction.other_amt;
    }
    if(amt){
      fieldValues[`900_${5+offset}_Text`] = [transaction.description];
      fieldValues[`901_${8+offset}_S30CongRec`] = [toMoneyS(amt)];
    }
  });

  const totalOtherReceipts = transactions.reduce((sum, transaction) => {
    if(isLocalCongregation(transaction.code) === false){
      return sum;
    }
    if(transaction.receipts_amt > 0){
      sum += transaction.receipts_amt;
    }
    if(transaction.primary_amt > 0){
      sum += transaction.primary_amt;
    }
    if(transaction.other_amt > 0){
      sum += transaction.other_amt;
    }
    return sum;
  }, 0);
  fieldValues['901_10_S30TotalOtherRec'] = [toMoneyS(totalOtherReceipts)];

  //fieldValues['901_11_S30TotalRec'] = [toMoneyS(totalCongregationReceipts + totalOtherReceipts)];

  //return totalCongregationReceipts + totalOtherReceipts;
}

function fillInDisbursements(fieldValues: any, transactionSet: TransactionSet){
  // sum of expenses
  // sum of worldwide work breakdowns
  //sum of khahc breakdowns
  //sum of gaa breakdowns
  //sum of coaa breakdowns

  //other breakdowns



  // sum of worldwide work boxes
  // sum of specials (boxes)
  // sum of other (boxes)
  // sum of above 3

  //sum of all disbursements

  return 0;
}

function fillInTotals(fieldValues: any, transactionSet: TransactionSet, receipts: number, disbursements: number, settings: Settings){
  const { start } = transactionSet;
  fieldValues['901_25_S30SurDef'] = [toMoneyS(receipts - disbursements)];
  const total = start.receipts + start.primary + start.other + receipts - disbursements
  fieldValues['901_26_S30TotalEOM'] = [toMoneyS(total)];
  fieldValues['900_13_Text_C'] = [settings.accounts_servant_or_overseer];
  return total;
}

function fillInSummary(fieldValues: any, transactionSet: TransactionSet, settings: Settings){
  const totalCongregationReceipts = buildTotalCongregationReceipts(transactionSet);
  const totalCongregationDisbursements = buildTotalCongregationDisbursements(transactionSet);
  const { start } = transactionSet;
  const openingBalance = start.receipts + start.primary + start.other;
  fieldValues['900_14_Text_C'] = [moment(transactionSet.start.date, DATE_FORMAT).format(settings.formatting.month_format)];
  fieldValues['901_31_S30TotalDonation'] = [toMoneyS(totalCongregationReceipts)];
  fieldValues['901_32_S30TotalExpense'] = [toMoneyS(totalCongregationDisbursements)];
  fieldValues['901_33_S30MonthEnd'] = [toMoneyS(openingBalance + totalCongregationReceipts - totalCongregationDisbursements)];

  const transferredToBranch = transactionSet.transactions.reduce((sum, transaction) => {
    if(transaction.code === TransactionCode.TTB){
      return sum - (transaction.receipts_amt + transaction.primary_amt + transaction.other_amt);
    }
    return sum;
  }, 0);
  fieldValues['901_33_S30MonthEnd'] = [toMoneyS(transferredToBranch)];

}
