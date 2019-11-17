
import Month from '../../persistent/months/Month';
import Settings from '../../persistent/settings/Settings';
import Transaction from '../../persistent/transactions/models/Transaction';


export default interface S26{
  month: Month,
  transactions: Transaction[],
  settings: Settings,
}
