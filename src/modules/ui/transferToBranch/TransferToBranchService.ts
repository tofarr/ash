import moment from 'moment';
import TransferToBranch from './TransferToBranch';

import Transaction from '../../persistent/transactions/models/Transaction';
import { ensureMonthExists } from '../../persistent/months/MonthService';
import { createTransaction, newTransaction, listTransactions } from '../../persistent/transactions/TransactionService';
import TransactionBreakdown from '../../persistent/transactions/models/TransactionBreakdown';
import TransactionCode from '../../persistent/transactions/models/TransactionCode';
import addErr from '../../utils/Err';
import transferToBranchSchema from './TransferToBranchSchema';
import { loadSettings } from '../../persistent/settings/SettingsService';

export function newTransferToBranch(for_year = moment().year(), for_month = moment().month() + 1) {
  return new Promise<TransferToBranch>((resolve, reject) => {
    loadSettings().then((settings) => {
      listTransactions(for_year, for_month).then((transactions: Transaction[]) => {
        const m = moment();
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
          amt: wwBox });

        resolve({
          for_year,
          for_month,
          year: m.year(),
          month: m.month() + 1,
          day: m.date(),
          confirmation_code: '',
          breakdown
        });

      }, reject);
    }, reject);
  });
}

export function createTransferToBranch(transferToBranch: TransferToBranch){
  return new Promise<TransferToBranch>((resolve, reject) => {

    function handleReject(err: any){
      addErr(err);
      reject(err);
    }

    loadSettings().then((settings) => {
      transferToBranchSchema().validate(transferToBranch).then(() => {
        const { year, month, day, breakdown, confirmation_code } = transferToBranch;
        const date_str = moment().startOf('year')
          .year(transferToBranch.year)
          .month(transferToBranch.month - 1)
          .date(transferToBranch.day)
          .format(settings.formatting.date_format);
        const description = `To Branch - ${confirmation_code} (${date_str})`;
        const amt = breakdown.reduce(((sum: number, item: TransactionBreakdown) => (item.amt as number) + sum), 0);
        Promise.all([
          ensureMonthExists(transferToBranch.for_year, transferToBranch.for_month),
          createTransaction({ year, month, day, description: 'Deposit',
            code: TransactionCode.E, receipts_amt: 0, primary_amt: -amt,
            other_amt: 0 })
        ]).then(() => resolve(transferToBranch), handleReject);
      }, handleReject);
    }, handleReject);
  });
}
