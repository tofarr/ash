import TransactionCode from './TransactionCode';
import TransactionBreakdown from './TransactionBreakdown';

export default interface Transaction {
  id?: number,

  date: string,
  description: string,
  code: TransactionCode,
  apply_on_date?: string,

  receipts_amt: number,
  primary_amt: number,
  other_amt: number,

  cash?: number,
  cheques?: number,
  breakdown?: TransactionBreakdown[],
  confirmation_code?: string,
}
