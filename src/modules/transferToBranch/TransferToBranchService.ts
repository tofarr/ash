import moment from 'moment';
import TransferToBranch from './TransferToBranch';
import { DATE_FORMAT, todayStr } from '../utils/date';
import Transaction from '../transactions/types/Transaction';
import { create, list } from '../transactions/transactionService';
import TransactionBreakdown from '../transactions/types/TransactionBreakdown';
import TransactionBreakdownCode from '../transactions/types/TransactionBreakdownCode';
import TransactionCode from '../transactions/types/TransactionCode';
import addErr from '../utils/err';
import transferToBranchSchema from './TransferToBranchSchema';
import { loadSettings } from '../settings/SettingsService';
import { fillAndDownloadTO62 } from '../transactions/TO62Service';

export function newTransferToBranch(apply_on_date = todayStr()) {
  return new Promise<TransferToBranch>((resolve, reject) => {
    loadSettings().then((settings) => {
      const m = moment(apply_on_date, DATE_FORMAT).startOf('month');
      const date = m.format(DATE_FORMAT);
      const date_max = date;
      const date_min = m.add(-1, 'month').format(DATE_FORMAT);
      list({ date_min, date_max }).then((transactions: Transaction[]) => {
        const wwBox = transactions.reduce(
          (sum: number, transaction: Transaction) => {
            const delta = (transaction.code === TransactionCode.W) ? transaction.receipts_amt : 0;
            return sum + delta;
          }, 0);

        const idOffset = new Date().getTime();
        const breakdown = settings.transferToBranchDefaults.map((item, index) => {
          return { ...item, id: idOffset + index }
        });

        breakdown.splice(0, 0, { id: idOffset - 1,
          description: 'WW (from box)',
          code: TransactionBreakdownCode.WW_BOX,
          amt: wwBox });

        resolve({
          date,
          apply_on_date: apply_on_date,
          confirmation_code: '',
          breakdown
        });

      }, reject);
    }, reject);
  });
}

export function toTransaction(transferToBranch: TransferToBranch){
  return new Promise<Transaction>((resolve, reject) => {
    transferToBranchSchema().validate(transferToBranch).then(() => {
      const { date, apply_on_date, breakdown, confirmation_code } = transferToBranch;

      const description = `To Branch - ${confirmation_code} (${apply_on_date})`;
      const amt = breakdown.reduce(((sum: number, item: TransactionBreakdown) => (item.amt as number) + sum), 0);
      resolve({ date, apply_on_date, description,
          code: TransactionCode.E, receipts_amt: 0, primary_amt: -amt,
          other_amt: 0 });
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
