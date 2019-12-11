import ContributionBox from '../contributionBoxes/ContributionBox';
import Settings from '../settings/Settings';
import Transaction from '../transactions/types/Transaction';
import TransactionBreakdown from '../transactions/types/TransactionBreakdown';

export default interface Backup{
  timestamp: number,
  settings: Settings,
  transactions: Transaction[],
  boxes: ContributionBox[],
  default_transaction_breakdowns: TransactionBreakdown[],
}
