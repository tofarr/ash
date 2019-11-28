import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Button, Grid } from '@material-ui/core';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ErrorIcon from '@material-ui/icons/Error';

import { DATE_FORMAT, MONTH_FORMAT, thisMonthStr } from '../../utils/date';
import useSettings from '../../settings/useSettings';

import Loader from '../../utils/components/Loader';
import Money from '../../utils/money/Money';
import TransactionSet from '../types/TransactionSet';
import { loadTransactionSet, buildEndBalance } from '../transactionService';
import MonthTransactionsRow from './MonthTransactionsRow';
import { updateTransactionPath } from './UpdateTransactionController';

export const MONTH_TRANSACTIONS_PATH = '/month-transactions/:month';

interface MonthTransactionsProps {
  setTitle: (title: string) => void;
}

export interface MonthTransactionsParams{
  month?: string
}

export function monthTransactionsPath(month?: string){
  return MONTH_TRANSACTIONS_PATH.replace(':month', month || thisMonthStr());
}

const MonthTransactionsController: FC<MonthTransactionsProps> = ({ setTitle }) => {

  const [working, setWorking] = useState(false);
  const [transactionSet, setTransactionSet] = useState<TransactionSet|undefined>(undefined);
  const settings = useSettings();
  const { push } = useHistory();

  const month = useParams<MonthTransactionsParams>().month as string;

  setTitle(moment(month, MONTH_FORMAT).format(settings.formatting.month_format));

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    const m = moment(month, MONTH_FORMAT).startOf('month');
    const min = m.format(DATE_FORMAT);
    const max = m.add(1, 'month').format(DATE_FORMAT);
    loadTransactionSet(min, max).then((loadedTransactionSet: TransactionSet) => {
      if(mounted){
        setTransactionSet(loadedTransactionSet);
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
  }, [month]);

  function handleMonthChange(delta: number){
    const newMonth = moment(month, MONTH_FORMAT).add(delta, 'months').format(MONTH_FORMAT);
    push(monthTransactionsPath(newMonth));
  }

  function renderControls(){
    return (
      <Grid container spacing={1}>
        <Grid item>
          <Button variant="contained" title="Previous Month" onClick={() => handleMonthChange(-1)}>
            <ArrowLeftIcon />
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" title="Generate S26">
            S26
          </Button>
          <Button variant="contained" title="Generate S30">
            S30
          </Button>
          <Button variant="contained" title="View Warnings">
            <ErrorIcon />
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" title="Next Month" onClick={() => handleMonthChange(1)}>
            <ArrowRightIcon />
          </Button>
        </Grid>
      </Grid>
    )
  }

  function renderHeaderRow(){
    return (
      <Box p={1}>
        <MonthTransactionsRow
          receipts={renderHeaderCol('Receipts')}
          primary={renderHeaderCol('Primary')}
          other={renderHeaderCol('Other')} />
      </Box>
    );
  }

  function renderHeaderCol(title: string){
    return (
      <Box textAlign="right" fontWeight={500}>
        {title}
      </Box>
    )
  }

  function renderOpeningBalanceRow(){
    if(!transactionSet){
      return null;
    }
    return (
      <Box p={1}>
        <MonthTransactionsRow
          description="Opening Balance"
          receipts={<Money value={transactionSet.start.receipts} />}
          primary={<Money value={transactionSet.start.primary} />}
          other={<Money value={transactionSet.start.other} />} />
      </Box>
    );
  }

  function renderTransactionRows(){
    if(!transactionSet){
      return null;
    }
    return (
      transactionSet.transactions.map((transaction) => (
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


  function renderClosingBalanceRow(){
    if(!transactionSet){
      return null;
    }
    const endBalance = buildEndBalance(transactionSet);
    return (
      <Box p={1}>
        <MonthTransactionsRow
          description="Closing Balance"
          receipts={<Money value={endBalance.receipts} fontWeight={500} />}
          primary={<Money value={endBalance.primary} fontWeight={500} />}
          other={<Money value={endBalance.other} fontWeight={500} />} />
      </Box>
    );
  }

  if(working){
    return <Loader />
  }

  return (
    <Box p={1}>
      {renderControls()}
      {renderHeaderRow()}
      {renderOpeningBalanceRow()}
      {renderTransactionRows()}
      {renderClosingBalanceRow()}
    </Box>
  );
}

export default MonthTransactionsController;
