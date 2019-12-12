import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Button, Grid } from '@material-ui/core';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ErrorIcon from '@material-ui/icons/Error';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { DATE_FORMAT, MONTH_FORMAT, thisMonthStr } from '../../utils/date';
import useSettings from '../../settings/useSettings';
import { dateStr } from '../../settings/settingsService';

import Loader from '../../utils/components/Loader';
import Money from '../../utils/money/Money';
import TransactionSet from '../types/TransactionSet';
import { buildEndBalance, loadTransactionSet } from '../transactionService';
import { list as listContributionBoxes } from '../../contributionBoxes/contributionBoxService';
import { fillAndDownloadS26 } from '../S26Service'
import { fillAndDownloadS30 } from '../S30Service'
import MonthTransactionsRow from './MonthTransactionsRow';
import { updateTransactionPath } from './UpdateTransactionController';
import { monthWarningsPath } from './MonthWarningsController';
import { dateBalancePath } from './DateBalanceController';
import monthTransactionsSchema from '../schemas/monthTransactionsSchema';
import MonthWarningsDialog from './MonthWarningsDialog';

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
  const [warnings, setWarnings] = useState<string[]|undefined>(undefined);
  const [warningsOpen, setWarningsOpen] = useState(false);
  const settings = useSettings();
  const { push } = useHistory();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const month = useParams<MonthTransactionsParams>().month as string;
  const m = moment(month, MONTH_FORMAT).startOf('month');
  const min = m.format(DATE_FORMAT);
  const max = m.add(1, 'month').format(DATE_FORMAT);

  setTitle(`${moment(month, MONTH_FORMAT).format(settings.formatting.month_format)} Transactions`);

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    setWarnings(undefined);
    Promise.all([
      loadTransactionSet(min, max),
      listContributionBoxes()
    ]).then(([ loadedTransactionSet, boxes]) => {
      if(mounted){
        setTransactionSet(loadedTransactionSet);
        monthTransactionsSchema.validate({ transactionSet: loadedTransactionSet, settings, boxes }).then(() => {
          if(mounted){
            setWorking(false);
            setWarnings([]);
          }
        }, (err) => {
          if(mounted){
            setWorking(false);
            setWarnings(err.errors);
          }
        });
      }
    }, (err) => {
      if(mounted){
        setWorking(false);
        setWarnings(err.errors);
      }
    })
    return () => {
      mounted = false;
    }
  }, [month, min, max, settings]);

  function handleMonthChange(delta: number){
    const newMonth = moment(month, MONTH_FORMAT).add(delta, 'months').format(MONTH_FORMAT);
    push(monthTransactionsPath(newMonth));
  }

  function handleWarnings(){
    if(smUp){
      setWarningsOpen(true);
    }else{
      push(monthWarningsPath(month));
    }
  }

  function renderControls(){
    return (
      <Grid container spacing={1} justify="space-between">
        <Grid item>
          <Button variant="contained" title="Previous Month" onClick={() => handleMonthChange(-1)}>
            <ArrowLeftIcon />
          </Button>
        </Grid>
        <Grid item>
          <Box textAlign="center">
            <Button variant="contained" title="Generate S26"
              onClick={() => fillAndDownloadS26(transactionSet as TransactionSet, settings)}>
              S26
            </Button>
            <Button variant="contained" title="Generate S30"
              onClick={() => fillAndDownloadS30(transactionSet as TransactionSet, settings)}>
              S30
            </Button>
            <Button variant="contained" title="View Warnings"
              disabled={!(warnings && warnings.length)}
              onClick={handleWarnings}>
              <ErrorIcon />
              {warnings && !!warnings.length && warnings.length}
            </Button>
          </Box>
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
      <Box pb={1}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => push(dateBalancePath(min))}>
          <MonthTransactionsRow
            description="Opening Balance"
            receipts={<Money value={transactionSet.start.receipts} />}
            primary={<Money value={transactionSet.start.primary} />}
            other={<Money value={transactionSet.start.other} />} />
        </Button>
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
              description={`(${dateStr(settings, transaction.date)}) ${transaction.description}`}
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
      <Box pb={1}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => push(dateBalancePath(max))}>
          <MonthTransactionsRow
            description="Closing Balance"
            receipts={<Money value={endBalance.receipts} fontWeight={500} />}
            primary={<Money value={endBalance.primary} fontWeight={500} />}
            other={<Money value={endBalance.other} fontWeight={500} />} />
        </Button>
      </Box>
    );
  }

  function renderWarningDialog(){
    if(!smUp || !transactionSet){
      return null;
    }
    return <MonthWarningsDialog
              working={working}
              warnings={warnings}
              open={warningsOpen && smUp}
              onClose={() => setWarningsOpen(false)} />
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
      {renderWarningDialog()}
    </Box>
  );
}

export default MonthTransactionsController;
