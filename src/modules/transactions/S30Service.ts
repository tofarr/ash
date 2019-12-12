import moment from 'moment';
import { DATE_FORMAT } from '../utils/date';
import { currentDateStr } from '../settings/settingsService';
import Settings from '../settings/Settings';
import DateBalance from './types/DateBalance';
import Transaction from './types/Transaction';
import TransactionBreakdownCode from './types/TransactionBreakdownCode';
import TransactionCode, { isLocalCongregation } from './types/TransactionCode';
import TransactionSet from './types/TransactionSet';
import { toMoneyS } from '../utils/money/service';
import { fillAndDownloadPdf } from '../utils/pdf';
import { isPending } from './transactionService';

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

export async function fillAndDownloadS30(transactionSet: TransactionSet, end: DateBalance, settings: Settings){
  const fieldValues: any = {}

  fillInHeading(fieldValues, transactionSet, settings);
  const receipts = fillInReceipts(fieldValues, transactionSet);
  const disbursements = fillInDisbursements(fieldValues, transactionSet);
  fillInTotals(fieldValues, transactionSet, receipts, disbursements, settings);
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
  const interest = transactions.reduce((sum, transaction) => sum + ((transaction.code === TransactionCode.I) ? transaction.primary_amt : 0), 0);
  if(interest){
    fieldValues[`900_${3+offset}_Text`] = ['Interest'];
    fieldValues[`901_${4+offset}_S30CongRec`] = [toMoneyS(interest)];
    offset++;
  }
  transactions.forEach((transaction) => {
    if(transaction.code === TransactionCode.C ||
      transaction.code === TransactionCode.CE ||
      transaction.code === TransactionCode.I ||
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
      offset++;
    }
  });
  const totalCongregationReceipts = buildTotalCongregationReceipts(transactionSet);
  fieldValues['901_6_S30TotalCongRec'] = [toMoneyS(totalCongregationReceipts)];


  const worldwideBoxTotal = transactions.reduce((sum, transaction) => {
    return sum + (transaction.code === TransactionCode.W ? transaction.receipts_amt : 0);
  }, 0);
  fieldValues['901_7_S30OtherRec'] = [toMoneyS(worldwideBoxTotal)];

  //other - worldwide receipts not marked W...
  offset = 0;
  const construction = transactions.reduce((sum, transaction) => sum + ((transaction.code === TransactionCode.B) ? transaction.receipts_amt : 0), 0);
  if(construction){
    fieldValues[`900_${5+offset}_Text`] = ['Contrib - Construction'];
    fieldValues[`901_${8+offset}_S30OtherRec`] = [toMoneyS(construction)];
    offset++;
  }
  transactions.forEach((transaction) => {
    if(transaction.code == TransactionCode.W ||
      transaction.code == TransactionCode.B ||
      isLocalCongregation(transaction.code) !== false){
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
      fieldValues[`901_${8+offset}_S30OtherRec`] = [toMoneyS(amt)];
      offset++;
    }
  });

  const totalOtherReceipts = transactions.reduce((sum, transaction) => {
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
  fieldValues['901_10_S30TotalOtherRec'] = [toMoneyS(totalOtherReceipts)];

  const totalReceipts = totalCongregationReceipts + totalOtherReceipts;
  fieldValues['901_11_S30TotalRec'] = [toMoneyS(totalReceipts)];

  return totalReceipts;
}

function sumBreakdowns(transactionSet: TransactionSet, code: TransactionBreakdownCode){
  return transactionSet.transactions.reduce((sum, transaction) => {
    if(transaction.breakdown){
      sum += transaction.breakdown.reduce((s, breakdown) => {
        if(breakdown.amt && breakdown.code === code){
          s += breakdown.amt;
        }
        return s;
      }, sum);
    }
    return sum;
  }, 0);
}

function fillInDisbursements(fieldValues: any, transactionSet: TransactionSet){

  const khExpenses = transactionSet.transactions.reduce((sum, transaction) =>
    sum - ((transaction.code == TransactionCode.E) ? transaction.primary_amt : 0),
  0);
  fieldValues['901_12_S30CongEx'] = [toMoneyS(khExpenses)];

  const wwResolutionTotal = sumBreakdowns(transactionSet, TransactionBreakdownCode.WW_RESOLUTION);
  const khahcTotal = sumBreakdowns(transactionSet, TransactionBreakdownCode.KHAHC);
  const gaaTotal = sumBreakdowns(transactionSet, TransactionBreakdownCode.GAA);
  const coaaTotal = sumBreakdowns(transactionSet, TransactionBreakdownCode.COAA);
  fieldValues['901_13_S30CongEx'] = [toMoneyS(wwResolutionTotal)];
  fieldValues['901_14_S30CongEx'] = [toMoneyS(khahcTotal)];
  fieldValues['901_15_S30CongEx'] = [toMoneyS(gaaTotal)];
  fieldValues['901_16_S30CongEx'] = [toMoneyS(coaaTotal)];

  let offset = 0;
  let otherTotal = 0;
  transactionSet.transactions.forEach(transaction => {
    if(transaction.code !== TransactionCode.CCE){
      return;
    }
    fieldValues[`900_${7+offset}_Text`] = [transaction.description];
    fieldValues[`901_${8+offset}_S30OtherRec`] = [toMoneyS(-transaction.primary_amt)];
    otherTotal -= transaction.primary_amt;
    offset++;
  });

  const totalCong = khExpenses + wwResolutionTotal + khahcTotal + gaaTotal + coaaTotal + otherTotal;
  fieldValues['901_19_S30TotalCongEx'] = [toMoneyS(totalCong)];

  const wwBoxes = transactionSet.transactions.reduce((sum, transaction) =>
    sum + ((transaction.code == TransactionCode.W) ? transaction.receipts_amt : 0),
  0);
  fieldValues['901_20_S30OtherDis'] = [toMoneyS(wwBoxes)];

  const constBoxes = transactionSet.transactions.reduce((sum, transaction) =>
    sum + ((transaction.code == TransactionCode.B) ? transaction.receipts_amt : 0),
  0);
  fieldValues['901_21_S30OtherDis'] = [toMoneyS(constBoxes)];

  const totalOther = wwBoxes + constBoxes;
  fieldValues['901_23_S30TotalOtherDis'] = [toMoneyS(totalOther)];

  const totalDisbursements = totalCong + totalOther;
  fieldValues['901_24_S30TotalDisburse'] = [toMoneyS(totalDisbursements)];

  return totalDisbursements;
}

function fillInTotals(fieldValues: any, transactionSet: TransactionSet, receipts: number, disbursements: number, settings: Settings){
  const { start } = transactionSet;
  debugger;
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
    if(transaction.code === TransactionCode.CBT){
      return sum - (transaction.receipts_amt + transaction.primary_amt + transaction.other_amt);
    }
    return sum;
  }, 0);
  fieldValues['901_34_S30ToWWW'] = [toMoneyS(transferredToBranch)];

}
