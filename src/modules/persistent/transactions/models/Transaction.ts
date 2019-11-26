
import TransactionCode from './TransactionCode';
import TransactionBreakdown from './TransactionBreakdown';

export default interface Transaction {
  id?: number;

  year: number,
  month: number,
  day: number,
  description: string,
  code?: TransactionCode,

  statement_day?: number,
  statement_month?: number,
  statement_year?: number,

  receipts_amt: number,
  primary_amt: number,
  other_amt: number,

  cash?: number,
  cheques?: number,
  breakdown?: TransactionBreakdown[],
}
