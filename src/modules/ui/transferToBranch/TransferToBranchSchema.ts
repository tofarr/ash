import { array, number, object, string } from 'yup';
import TransferToBranch from './TransferToBranch';

interface YupContext{
  path: any;
  createError: any;
}

const POSITIVE = number().integer().positive().required(); // does not include 0!

export default function transactionSchema(){
  return object().shape({
    for_year: POSITIVE,
    for_month: POSITIVE,
    year: POSITIVE,
    month: POSITIVE,
    day: POSITIVE,
    confirmation_code: string().required(),
    breakdown: array().min(1).of(
      object().shape({
        description: string().required(),
        amt: number().integer().min(0, 'All Amounts must be 0 or Greater').required()
      })
    ).required()
  }).test('month-year-match',
    'Transfer Date Should be on or after Month for Transaction',
    function(this: YupContext, transferToBranch: TransferToBranch) {
      const { for_year, year } = transferToBranch;
      return (for_year < year) || ((for_year === year)
        && (transferToBranch.for_month <= transferToBranch.month));
    }
  );
};
