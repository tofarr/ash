import TransactionBreakdown from '../../persistent/transactions/models/TransactionBreakdown';

export default interface TransferToBranch{
  for_year: number;
  for_month: number;
  year: number;
  month: number;
  day: number;
  confirmation_code: string;
  breakdown: TransactionBreakdown[];
}
