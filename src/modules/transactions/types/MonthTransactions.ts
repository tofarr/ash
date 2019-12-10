import ContributionBox from '../../contributionBoxes/ContributionBox';
import Settings from '../../settings/Settings';
import TransactionSet from './TransactionSet';

export default interface MonthTransactions{
  transactionSet: TransactionSet,
  settings: Settings,
  boxes: ContributionBox[],
}
