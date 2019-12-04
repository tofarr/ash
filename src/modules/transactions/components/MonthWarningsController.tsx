import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { Box, Button, Grid } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { DATE_FORMAT, MONTH_FORMAT, thisMonthStr } from '../../utils/date';
import useSettings from '../../settings/useSettings';

import { loadTransactionSet } from '../transactionService';
import { monthTransactionsPath } from './MonthTransactionsController';
import monthTransactionsSchema from '../schemas/monthTransactionsSchema';
import WarningList from './WarningList';

export const MONTH_WARNINGS_PATH = "/month-warnings/:month";

export function monthWarningsPath(month: string){
  return MONTH_WARNINGS_PATH.replace(':month', month || thisMonthStr());
}

export interface MonthWarningsProps{
  setTitle: (title: string) => void;
}

export interface MonthWarningsParams{
  month?: string
}

const MonthWarningsController: FC<MonthWarningsProps> = ({ setTitle }) => {

  const [working, setWorking] = useState(false);
  const [warnings, setWarnings] = useState<string[]|undefined>(undefined);
  const settings = useSettings();
  const { push } = useHistory();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const month = useParams<MonthWarningsParams>().month as string;
  const m = moment(month, MONTH_FORMAT).startOf('month');
  const min = m.format(DATE_FORMAT);
  const max = m.add(1, 'month').format(DATE_FORMAT);

  setTitle(`${moment(month, MONTH_FORMAT).format(settings.formatting.month_format)} Warnings`);

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    loadTransactionSet(min, max).then((transactionSet) => {
      if(mounted){
        monthTransactionsSchema.validate({transactionSet, settings}).then(() => {
          setWarnings([]);
          setWorking(false);
        }, (err) => {
          if(mounted){
            setWarnings(err.errors);
            setWorking(false);
          }
        });
      }
    }, () => {
      if(mounted){
        setWorking(false);
      }
    });
    return () => {
      mounted = false;
    }
  }, [min, max, settings]);

  return (
    <Box p={1}>
      <Grid container direction="column">
        <Grid item xs={(!smUp) || 'auto'}>
          <Box pb={1}>
            <Button
              fullWidth={!smUp}
              variant="contained"
              onClick={() => push(monthTransactionsPath(month))}>
              <NavigateBeforeIcon />
              Back to Month
            </Button>
          </Box>
        </Grid>
        <WarningList warnings={warnings} working={working} />
      </Grid>
    </Box>
  )
}

export default MonthWarningsController
