import React, { FC } from 'react';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';

import Settings from '../../../persistent/settings/Settings';
import MonthTransactionsContainer from './MonthTransactionsContainer';

export const MONTH_TRANSACTIONS_PATH = '/month-transactions/:year/:month'

export function monthTransactionsPath(year: number, month: number){
  return MONTH_TRANSACTIONS_PATH.replace(':year', year.toString()).replace(':month', month.toString());
}

export function currentMonthPath(){
  return monthTransactionsPath(moment().year(), moment().month()+1);
}

export interface MonthTransactionsControllerProps{
  settings: Settings,
  setTitle: (setTitle: string) => void;
}

export interface MonthListControllerParams{
  year: string;
  month: string;
}


const MonthTransactionsController: FC<MonthTransactionsControllerProps> = ({ settings, setTitle }) => {
  const { push } = useHistory();
  const { year, month } = useParams<MonthListControllerParams>();
  const monthStr = moment().startOf('month').year(parseInt(year)).month(parseInt(month)-1).format(settings.formatting.month_format);
  setTitle(`Transactions for ${monthStr}`);

  function handleChangeMonth(newYear: number, newMonth: number){
    push(monthTransactionsPath(newYear, newMonth));
  }

  return <MonthTransactionsContainer
            year={parseInt(year)}
            month={parseInt(month)}
            onChangeMonth={handleChangeMonth}
            settings={settings} />

}

export default MonthTransactionsController;
