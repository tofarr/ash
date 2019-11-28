import DateBalance from './DateBalance';
import Transaction from './Transaction';

export default interface TransactionSet {
  start: DateBalance,
  transactions: Transaction[],
  date_max: string,
}
