import Transaction from './types/Transaction';
import TransactionBreakdown from './types/TransactionBreakdown';
import TransactionBreakdownCode from './types/TransactionBreakdownCode';

import { loadSettings, currentDateStr } from '../settings/SettingsService';

import { toMoneyS } from '../utils/money/service';
import { fillAndDownloadPdf } from '../utils/pdf';


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
