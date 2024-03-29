import moment from 'moment';
import TransferToBranch from './TransferToBranch';
import { DATE_FORMAT, todayStr } from '../utils/date';
import Transaction from '../transactions/types/Transaction';
import { create, list as listTransactions } from '../transactions/transactionService';
import TransactionBreakdown from '../transactions/types/TransactionBreakdown';
import TransactionBreakdownCode from '../transactions/types/TransactionBreakdownCode';
import * as transferToBranchDAO from './transferToBranchDAO';
import TransactionCode, { isLocalCongregation } from '../transactions/types/TransactionCode';
import addErr from '../utils/Err';
import { addMsg } from '../utils/msgs/service';
import TransferToBranchSchema from './TransferToBranchSchema';
import { fillAndDownloadTO62 } from '../transactions/TO62Service';

export function newTransferToBranch(apply_on_date = todayStr()) {
  return new Promise<TransferToBranch>((resolve, reject) => {
    const m = moment(apply_on_date, DATE_FORMAT).startOf('month');
    const date_max = m.format(DATE_FORMAT);
    const date = m.clone().add(-1, 'days').format(DATE_FORMAT);
    const date_min = m.add(-1, 'month').format(DATE_FORMAT);
    Promise.all([listTransactions({ date_min, date_max }), transferToBranchDAO.list()])
      .then(([transactions, defaultBreakdown]) => {
      const wwBox = transactions.reduce(
        (sum: number, transaction: Transaction) => {
          let delta = (isLocalCongregation(transaction.code) === false) ? transaction.receipts_amt : 0;
          if(transaction.code === TransactionCode.CBT && transaction.breakdown){
            delta += transaction.breakdown.reduce((sum, breakdown) => {
              const delta = (breakdown.amt && breakdown.code === TransactionBreakdownCode.WW_BOX) ? breakdown.amt : 0;
              return sum - delta;
            }, 0);
          }
          return sum + delta;
        }, 0);

      const idOffset = new Date().getTime();
      const breakdown = defaultBreakdown.map((item, index) => {
        return { ...item, id: idOffset + index }
      });

      breakdown.splice(0, 0, { id: idOffset - 1,
        description: 'WW (from box)',
        code: TransactionBreakdownCode.WW_BOX,
        amt: wwBox });

      resolve({
        date,
        apply_on_date,
        confirmation_code: '',
        breakdown
      });

    }, reject);
  });
}


export function loadDefaultBreakdown(){
  return transferToBranchDAO.list();
}

export function storeDefaultBreakdown(breakdowns: TransactionBreakdown[]){
  return transferToBranchDAO.restore(breakdowns).then(() => {
    addMsg('Default Transfer Breakdown Updated');
  }, (err) => {
    addErr(err);
  })
}

export function toTransaction(transferToBranch: TransferToBranch){
  return new Promise<Transaction>((resolve, reject) => {
    TransferToBranchSchema().validate(transferToBranch).then(() => {
      const { date, apply_on_date, breakdown, confirmation_code } = transferToBranch;
      const description = `To Branch - ${confirmation_code} (${apply_on_date})`;
      const amt = breakdown.reduce(((sum: number, item: TransactionBreakdown) => (item.amt as number) + sum), 0);
      resolve({ date, apply_on_date, description,
        code: TransactionCode.CBT, receipts_amt: 0, primary_amt: -amt,
        other_amt: 0, breakdown, confirmation_code,
      });
    }, (err: any) => {
      addErr(err);
      reject(err);
    });
  });
}

export function createTransferToBranch(transferToBranch: TransferToBranch){
  return new Promise<TransferToBranch>((resolve, reject) => {
    toTransaction(transferToBranch).then((transaction) => {
      create(transaction).then(() => resolve(transferToBranch), reject)
    }, reject);
  });
}


export async function fillAndDownloadTO62ForTransfer(transferToBranch: TransferToBranch){
  transferToBranch = { ...transferToBranch, confirmation_code: transferToBranch.confirmation_code || ' ' } // Confirmation code required for save, but not for TO-62
  const transaction = await toTransaction(transferToBranch);
  const pdf = fillAndDownloadTO62(transaction);
  return pdf;
}
