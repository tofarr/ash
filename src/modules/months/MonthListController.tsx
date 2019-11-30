import React, { FC } from 'react';
import moment from 'moment';
import { Box, Button, Grid } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';

import { MONTH_FORMAT, thisYear } from '../utils/date';
import SerialNavigation from '../utils/components/SerialNavigation';
import useSettings from '../settings/useSettings';
import { monthTransactionsPath } from '../transactions/components/MonthTransactionsController';

export const MONTH_LIST_PATH = "/months/:year";

export function monthListPath(year = thisYear()){
  return MONTH_LIST_PATH.replace(':year', year.toString());
}

interface MonthListProps{
  setTitle: (title: string) => void;
}

interface MonthListParams {
  year?: string;
}

const MonthListController: FC<MonthListProps> = ({ setTitle }) => {
  setTitle('Select Month');
  const { push } = useHistory();
  const settings = useSettings();
  const year = parseInt(useParams<MonthListParams>().year as any) || moment().year();

  function handleMonth(month: string){
    push(monthTransactionsPath(month));
  }

  function handleYear(newYear: number){
    push(monthListPath(newYear));
  }

  function renderMonths(){
    const months = [];
    for(var i = 0; i < 12; i++){
      months.push(renderMonth(i));
    }
    return months;
  }

  function renderMonth(month: number){
    const m = moment().year(year).month(month);
    const monthStr = m.format(MONTH_FORMAT);
    return (
      <Grid item key={monthStr}>
        <Box pl={1} pr={1}>
          <Button fullWidth variant="contained" onClick={() => handleMonth(monthStr)}>
            {m.format(settings.formatting.month_format)}
          </Button>
        </Box>
      </Grid>
    )
  }

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Box p={1}>
          <SerialNavigation onPrev={() => handleYear(year - 1)} onNext={() => handleYear(year + 1)} >
            <Box textAlign="center">
              {year}
            </Box>
          </SerialNavigation>
        </Box>
      </Grid>
      {renderMonths()}
    </Grid>
  )
}

export default MonthListController;
