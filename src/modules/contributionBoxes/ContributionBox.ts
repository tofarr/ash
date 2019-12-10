
import TransactionCode from '../transactions/types/TransactionCode';

export default interface SpecialContributionBox{
  id?: number;
  title: string;
  code: TransactionCode;
}
