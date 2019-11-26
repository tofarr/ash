import React, { FC, useEffect, useState } from 'react';
import { Box } from '@material-ui/core';

import Month from '../Month';
import { listMonths } from '../MonthService';
import MonthSummaryComponent from './MonthSummaryComponent';
import Loader from '../../../utils/Loader';
import YearNavigation from './YearNavigation';

export interface MonthListProps{
  year: number;
  onChangeYear: (year: number) => void;
  onSelectMonth: (year: number, month: number, hasData: boolean) => void;
}

const MonthListContainer: FC<MonthListProps> = ({ year, onChangeYear, onSelectMonth }) => {

  const [working, setWorking] = useState(false);
  const [months, setMonths] = useState<null|Month[]>(null);

  useEffect(() => {
    setWorking(true);
    listMonths(year).then((months) => {
      setMonths(months);
      setWorking(false);
    }, () => setWorking(false));
  }, [year]);

  function renderMonthList(){
    if(!months){
      return null;
    }
    const monthList = [];
    for(var m = 1; m <= 12; m++){
      monthList.push(renderMonth(m));
    }
    return monthList;
  }

  function renderMonth(m: number){
    if(!months){
      return null;
    }
    const month = months.find(mon => mon.year === year && mon.month === m)
    return <MonthSummaryComponent
              key={`${year}-${m}`}
              year={year}
              month={m}
              hasData={!!month}
              onSelect={onSelectMonth} />
  }

  return <div>
    <YearNavigation value={year} onChange={onChangeYear} />
    <Box p={1}>
      {working ? <Loader /> : renderMonthList()}
    </Box>
  </div>
}

export default MonthListContainer;
