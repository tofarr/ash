import React, { FC } from 'react';
import { Redirect, useParams, useHistory } from 'react-router-dom';

import Settings from '../../../persistent/settings/Settings';
import MonthTransactionsContainer from './MonthTransactionsContainer';

export const MONTH_TRANSACTIONS_PATH = '/month-transactions/:year/:month'

export function monthTransactionsPath(year: number, month: number){
  return MONTH_TRANSACTIONS_PATH.replace(':year', year.toString()).replace(':month', month.toString());
}

export interface MonthTransactionsControllerProps{
  settings: Settings
}

export interface MonthListControllerParams{
  year: string;
  month: string;
}


const MonthTransactionsController: FC<MonthTransactionsControllerProps> = ({ settings }) => {

  const { push } = useHistory();
  const { year, month } = useParams<MonthListControllerParams>();

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
