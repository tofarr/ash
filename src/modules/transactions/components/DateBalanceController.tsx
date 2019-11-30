import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Divider, Grid, Typography } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { dateToMonth } from '../../utils/date';
import Loader from '../../utils/components/Loader';
import Money from '../../utils/money/Money';
import useSettings from '../../settings/useSettings';
import { dateStr } from '../../settings/SettingsService';

import DateBalance from '../types/DateBalance';
import Transaction from '../types/Transaction';
import { loadDateBalance, list } from '../transactionService';
import MonthTransactionsRow from './MonthTransactionsRow';
import { updateTransactionPath } from './UpdateTransactionController';
import { monthTransactionsPath } from './MonthTransactionsController';

export const DATE_BALANCE_PATH = "/date-balance/:date";

export function dateBalancePath(date: string){
  return DATE_BALANCE_PATH.replace(':date', date);
}

export interface DateBalanceProps{
  setTitle: (title: string) => void;
}

export interface MonthTransactionsParams{
  date?: string
}

const DateBalanceController: FC<DateBalanceProps> = ({ setTitle }) => {

  const [working, setWorking] = useState(false);
  const [dateBalance, setDateBalance] = useState<DateBalance|undefined>(undefined);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]|undefined>(undefined);
  const date = useParams<MonthTransactionsParams>().date as string;
  const settings = useSettings();
  setTitle(`Balance as of ${dateStr(settings, date)}`);
  const { push } = useHistory();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    Promise.all([
      loadDateBalance(date),
      list({ date_max: date, apply_on_date_min: date })
    ]).then(([loadedDateBalance, transactions]) => {
      if(mounted){
        setDateBalance(loadedDateBalance);
        setPendingTransactions(transactions);
        setWorking(false);
      }
    }, () => {
      if(mounted){
        setWorking(false);
      }
    });
    return () => {
      mounted = false;
    }
  }, [date]);


  if(working){
    return <Loader />
  }

  function renderBalanceRow(){
    if(!dateBalance){
      return null;
    }
    return (
      <Box pb={1}>
        <MonthTransactionsRow
          description="Balance on Statement"
          receipts={<Money value={dateBalance.receipts} fontWeight={500} />}
          primary={<Money value={dateBalance.primary} fontWeight={500} />}
          other={<Money value={dateBalance.other} fontWeight={500} />} />
      </Box>
    )
  }

  function renderTransactionRows(){
    if(!pendingTransactions){
      return null;
    }
    return (
      pendingTransactions.map((transaction) => (
        <Box key={transaction.id} pb={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => push(updateTransactionPath(transaction.id as number))}>
            <MonthTransactionsRow
              description={transaction.description}
              receipts={<Money value={transaction.receipts_amt} />}
              primary={<Money value={transaction.primary_amt} />}
              other={<Money value={transaction.other_amt} />} />
          </Button>
        </Box>
      ))
    );
  }

  function renderAppliedBalanceRow(){
    if(!dateBalance){
      return null;
    }
    return (
      <Box pt={1}>
        <MonthTransactionsRow
          description="Account Balance"
          receipts={<Money value={dateBalance.applied_receipts} fontWeight={500} />}
          primary={<Money value={dateBalance.applied_primary} fontWeight={500} />}
          other={<Money value={dateBalance.applied_other} fontWeight={500} />} />
      </Box>
    )
  }

  return (
    <Box p={1}>
      <Grid container>
        <Grid item xs={(!smUp) || 'auto'}>
          <Box pb={1}>
            <Button
              fullWidth={!smUp}
              variant="contained"
              onClick={() => push(monthTransactionsPath(dateToMonth(date)))}>
              <NavigateBeforeIcon />
              Back to Month
            </Button>
          </Box>
        </Grid>
      </Grid>
      {renderBalanceRow()}
      <Divider />
      <Typography variant="h6">Pending Transactions</Typography>
      {renderTransactionRows()}
      <Divider />
      {renderAppliedBalanceRow()}
    </Box>
  )
}

export default DateBalanceController
