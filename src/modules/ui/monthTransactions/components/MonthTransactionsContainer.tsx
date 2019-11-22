import React, { FC } from 'react';

import MonthNavigation from './MonthNavigation';
import Settings from '../../../persistent/settings/Settings';

export interface MonthTransactionsContainerProps{
  year: number;
  month: number;
  settings: Settings;
  onChangeMonth: (year: number, month: number) => void;
}

const MonthTransactionContainer: FC<MonthTransactionsContainerProps> =
  ({ year, month, settings, onChangeMonth}) => {
    return <div>
      <MonthNavigation
        year={year}
        month={month}
        onChange={onChangeMonth}
        settings={settings} />

      Actions: S26, S30, TO62, Warnings, Back to Year<br />

      Opening Balances<br />
      Transactions<br />
      Closing Balance

    </div>
  }

export default MonthTransactionContainer;
