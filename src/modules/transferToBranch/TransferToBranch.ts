import TransactionBreakdown from '../transactions/types/TransactionBreakdown';

export default interface TransferToBranch{
  date: string;
  apply_on_date: string;
  confirmation_code: string;
  breakdown: TransactionBreakdown[];
}
