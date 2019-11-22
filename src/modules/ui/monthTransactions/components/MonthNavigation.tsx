import React, { FC } from 'react';
import moment from 'moment';

import Settings from '../../../persistent/settings/Settings';
import SerialNavigation from '../../../utils/SerialNavigation';

export interface MonthNavigationProps{
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
  settings: Settings
}

const MonthNavigation: FC<MonthNavigationProps> = ({ year, month, onChange, settings }) => {
  const value = moment().startOf('year').year(year).month(month-1);
  const prev = value.clone().add(-1, 'month');
  const next = value.clone().add(1, 'month');
  return (
    <SerialNavigation
      onPrev={() => { onChange(prev.year(), prev.month()+1) }}
      onNext={() => { onChange(next.year(), next.month()+1) }}>
      {value.format(settings.formatting.month_format)}
    </SerialNavigation>
  );
}

export default MonthNavigation;
