import React, { FC } from 'react';
import moment from 'moment';
import { Redirect, useParams, useHistory } from 'react-router-dom';

import Settings from '../../settings/Settings';
import MonthListContainer from './MonthListContainer';
import { monthTransactionsPath } from '../../../ui/monthTransactions/components/MonthTransactionsController';

export const MONTH_LIST_PATH = '/month-list/:year?';

export function monthListPath(year?: number){
  return MONTH_LIST_PATH.replace(':year?', (year || '') as any);
}


export interface MonthListControllerProps{
  settings: Settings
}

export interface MonthListControllerParams{
  year?: string
}

const MonthListController: FC<MonthListControllerProps> = ({ settings }) => {

  const { push } = useHistory();
  const year = parseInt(useParams<MonthListControllerParams>().year as any);

  function handleSelectMonth(year: number, month: number, hasData: boolean){
    push(monthTransactionsPath(year, month));
  }

  function handleChangeYear(newYear: number){
    push(monthListPath(newYear));
  }

  if(!year){
    return <Redirect to={monthListPath(moment().year())} push={true} />
  }

  return <MonthListContainer
            year={year}
            onChangeYear={handleChangeYear}
            onSelectMonth={handleSelectMonth}
            settings={settings} />

}

export default MonthListController;
