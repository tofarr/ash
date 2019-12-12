import moment from 'moment';
import { DATE_FORMAT } from '../utils/date';
import { currentDateStr } from '../settings/settingsService';
import Settings from '../settings/Settings';
import DateBalance from './types/DateBalance';
import Transaction from './types/Transaction';
import TransactionCode from './types/TransactionCode';
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

export async function fillAndDownloadS26(transactionSet: TransactionSet, end: DateBalance, settings: Settings){
  const { start, transactions } = transactionSet;
  const date = moment(start.date, DATE_FORMAT);

  const context = {
    rowNum: 0,
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
      '900_4_Text_C': [date.format('MMMM')],
      '900_5_Text_C': [date.year()],
      '900_6_Text_C': [settings.other_account_description],
    }
  } as S26Context

  transactions.forEach((transaction) =>
    processTransaction(transaction, context)
  );

  const { fieldValues } = context;

  fillPrimaryReconcilliation(fieldValues, context, transactionSet, end, settings);
  fillSummary(fieldValues, settings, transactionSet.start, end, context);
  fillOtherReconcilliation(fieldValues, settings, transactionSet, end);

  await fillAndDownloadPdf('/pdf/S-26-E.pdf', fieldValues);
}

function buildPendingPrimaryDeposits(transactionSet: TransactionSet){
  return transactionSet.transactions.reduce((sum, transaction) => {
    const applicable = isPending(transaction, transactionSet.date_max) && (transaction.primary_amt > 0);
    const diff = applicable ? transaction.primary_amt : 0;
    return sum + diff;
  }, 0);
}

function buildPendingPrimaryCharges(transactionSet: TransactionSet){
  return transactionSet.transactions.reduce((sum, transaction) => {
    const applicable = isPending(transaction, transactionSet.date_max) && (transaction.primary_amt < 0);
    const diff = applicable ? transaction.primary_amt : 0;
    return sum - diff;
  }, 0);
}


function buildPendingOtherDeposits(transactionSet: TransactionSet){
  return transactionSet.transactions.reduce((sum, transaction) => {
    const applicable = isPending(transaction, transactionSet.date_max) && (transaction.other_amt > 0);
    const diff = applicable ? transaction.other_amt : 0;
    return sum + diff;
  }, 0);
}

function buildPendingOtherCharges(transactionSet: TransactionSet){
  return transactionSet.transactions.reduce((sum, transaction) => {
    const applicable = isPending(transaction, transactionSet.date_max) && (transaction.other_amt < 0);
    const diff = applicable ? transaction.other_amt : 0;
    return sum - diff;
  }, 0);
}


function processTransaction(transaction: Transaction, context: S26Context){
  fillFormFromTransaction(transaction, context);
  updateContext(transaction, context);
}

function getCodeStr(code: TransactionCode){
  if(code === TransactionCode.CCE){
    return TransactionCode.E;
  }
  return (code.length < 3) ? code : '';
}

function fillFormFromTransaction(transaction: Transaction, context: S26Context){

  const { rowNum, fieldValues } = context;
  const { date, description, code, receipts_amt, primary_amt, other_amt, breakdown} = transaction;

  fieldValues[`900_${7+rowNum}_Text_C`] = [moment(date, DATE_FORMAT).date()];
  fieldValues[`900_${59+rowNum}_Text`] = [description];
  fieldValues[`900_${111+rowNum}_Text_C`] = [getCodeStr(code)];

  if(receipts_amt > 0){
    fieldValues[`901_${1+rowNum}_S26Value`] = [toMoneyS(receipts_amt)];
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
      fieldValues[`900_${59+rowNum+index+1}_Text`] = [`${breakdown.description} ${breakdown.amt ? `[${toMoneyS(breakdown.amt)}]` : ''}`];
  })

}

function updateContext(transaction: Transaction, context: S26Context){
  const { breakdown, receipts_amt, primary_amt, other_amt} = transaction;
  if(receipts_amt > 0)
    context.receiptsIn += receipts_amt;
  else{
    context.receiptsOut -= receipts_amt;
  }
  if(primary_amt > 0)
    context.primaryIn += primary_amt;
  else{
    context.primaryOut -= primary_amt;
  }
  if(other_amt > 0)
    context.otherIn += other_amt;
  else{
    context.otherOut -= other_amt;
  }
  context.rowNum++;
  if(breakdown){
    context.rowNum += breakdown.length;
  }
}

function fillOtherReconcilliation(fieldValues: any, settings: Settings, transactionSet: TransactionSet, end: DateBalance){

  const pendingOtherCharges = buildPendingOtherCharges(transactionSet);
  const pendingOtherDeposits = buildPendingOtherDeposits(transactionSet);

  fieldValues['904_43_Text_C'] = [currentDateStr(settings)];
  fieldValues['904_44_S26Amount'] = [toMoneyS(end.applied_other)];
  fieldValues['904_45_S26Amount'] = [toMoneyS(pendingOtherDeposits)];
  //fieldValues['904_46_S26Amount'] = [toMoneyS(0)]; //Not sure why this exists? "Any bank charges not recorded on Accounts Sheet" - why would they not be recorded? Just record them...
  fieldValues['904_47_S26TotalAmount'] = [toMoneyS(end.applied_other + pendingOtherDeposits - pendingOtherCharges)];
  let offset = 0;
  transactionSet.transactions.forEach((transaction) => {
    if(isPending(transaction, end.date) && transaction.other_amt < 0){
      fieldValues[`904_${offset+48}_Text`] = [transaction.description];
      fieldValues[`904_${offset+49}_S26Amount`] = [toMoneyS(-transaction.other_amt)];
      offset += 2;
    }
  });
  fieldValues['904_54_S26TotalAmount'] = [toMoneyS(pendingOtherCharges)];
  //fieldValues['904_55_S26Amount'] = [toMoneyS(0)]; //Not sure why this exists? "Any bank interest not recorded on Accounts Sheet" - why would this not be recorded? Just record them...
  fieldValues['904_56_S26TotalAmount'] = [toMoneyS(end.other)];
}

function fillSummary(fieldValues: any, settings: Settings, start: DateBalance, end: DateBalance, context: S26Context){
  fieldValues['904_28_Text_C'] = [moment().format(settings.formatting.month_format)];

  fieldValues['904_29_S26Amount'] = [toMoneyS(start.receipts)];
  fieldValues['904_30_S26TotalAmount'] = [toMoneyS(context.receiptsIn)];
  fieldValues['904_31_S26TotalAmount'] = [toMoneyS(context.receiptsOut)];
  fieldValues['904_32_S26TotalAmount'] = [toMoneyS(end.receipts)];

  fieldValues['904_33_S26Amount'] = [toMoneyS(start.primary)];
  fieldValues['904_34_S26TotalAmount'] = [toMoneyS(context.primaryIn)];
  fieldValues['904_35_S26TotalAmount'] = [toMoneyS(context.primaryOut)];
  fieldValues['904_36_S26TotalAmount'] = [toMoneyS(end.primary)];

  fieldValues['904_37_Text'] = [settings.other_account_description]
  fieldValues['904_38_S26Amount'] = [toMoneyS(start.other)];
  fieldValues['904_39_S26TotalAmount'] = [toMoneyS(context.otherIn)];
  fieldValues['904_40_S26TotalAmount'] = [toMoneyS(context.otherOut)];
  fieldValues['904_41_S26TotalAmount'] = [toMoneyS(end.other)];

  fieldValues['904_42_S26TotalAmount'] = [toMoneyS(end.receipts + end.primary + end.other)];
}

function fillPrimaryReconcilliation(fieldValues: any, context: S26Context, transactionSet: TransactionSet,
  end: DateBalance, settings: Settings){

  fieldValues['904_1_Text_C'] = [currentDateStr(settings)];
  fieldValues['901_53_S26TotalValue'] = [toMoneyS(context.receiptsIn)];
  fieldValues['901_106_S26TotalValue'] = [toMoneyS(context.receiptsOut)];
  fieldValues['902_53_S26TotalValue'] = [toMoneyS(context.primaryIn)];
  fieldValues['902_106_S26TotalValue'] = [toMoneyS(context.primaryOut)];
  fieldValues['903_53_S26TotalValue'] = [toMoneyS(context.otherIn)];
  fieldValues['903_106_S26TotalValue'] = [toMoneyS(context.otherOut)];

  if(settings.cash_box){
    fillCashBox(fieldValues, transactionSet, end);
  }else{
    fillBankAccount(fieldValues, transactionSet, end);
  }
}

function fillBankAccount(fieldValues: any, transactionSet: TransactionSet, end: DateBalance){
  const pendingPrimaryCharges = buildPendingPrimaryCharges(transactionSet);
  const pendingPrimaryDeposits = buildPendingPrimaryDeposits(transactionSet);
  fieldValues['904_2_S26Amount'] = [toMoneyS(end.applied_primary)];
  fieldValues['904_3_S26Amount'] = [toMoneyS(pendingPrimaryDeposits)];
  //fieldValues['904_4_S26Amount'] = [toMoneyS(0)]; //Not sure why this exists? "Any bank charges not recorded on Accounts Sheet" - why would they not be recorded? Just record them...
  fieldValues['904_5_S26TotalAmount'] = [toMoneyS(pendingPrimaryDeposits)];
  let offset = 0;
  transactionSet.transactions.forEach((transaction) => {
    if(isPending(transaction, end.date) && transaction.primary_amt < 0){
      fieldValues[`904_${offset+6}_Text`] = [transaction.description];
      fieldValues[`904_${offset+7}_S26Amount`] = [toMoneyS(-transaction.primary_amt)];
      offset += 2;
    }
  });
  fieldValues['904_20_S26TotalAmount'] = [toMoneyS(pendingPrimaryCharges)];
  //fieldValues['904_21_S26Amount'] = [toMoneyS(0)]; //Not sure why this exists? "Any bank interest not recorded on Accounts Sheet" - why would this not be recorded? Just record them...
  //fieldValues['904_22_S26Amount'] = [toMoneyS(0)];// All electronic contributions not recorded on Accounts Sheet:
  fieldValues['904_23_S26TotalAmount'] = [toMoneyS(end.primary)];
}

function fillCashBox(fieldValues: any, transactionSet: TransactionSet, end: DateBalance){
  const pendingPrimaryDeposits = buildPendingPrimaryDeposits(transactionSet);
  fieldValues['904_24_S26Amount'] = [toMoneyS(end.applied_primary)];
  fieldValues['904_25_S26Amount'] = [toMoneyS(pendingPrimaryDeposits)];
  fieldValues['904_26_S26Amount'] = [toMoneyS(0)]; // Not sure why this exists? "Completed payments not yet recorded on Accounts Sheet:" - why would they not be recorded? Just record them...
  fieldValues['904_27_S26Amount'] = [toMoneyS(end.primary)];
}
