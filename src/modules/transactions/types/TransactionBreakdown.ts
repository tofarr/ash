import TransactionBreakdownCode from './TransactionBreakdownCode';

export default interface TransactionBreakdown {
  id?: number,
  code?: TransactionBreakdownCode,
  description?: string,
  amt?: number,
}
